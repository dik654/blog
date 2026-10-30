import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { rethMevTree, rbuilderTree } from "./fileTree";
import RethMevLocator, { RethMevMapReturn } from "./RethMevLocator";
import RethMevFlowViz from "./viz/RethMevFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethMevLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Reth가 block을 만들면 mev-boost가 그 안에서 더 비싼 block을 고릅니까?
          </h2>
        </div>
        <RethMevFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>아닙니다. Reth는 execution client로서 consensus client가 요청한 local execution payload를 준비합니다. External builder는 별도 서비스에서 payload와 bid를 만들고 relay가 이를 중개합니다. Proposer 측의 mev-boost와 consensus client가 external header 경로를 조정합니다.
        </p>
        <p>
          두 경로는 같은 slot의 block proposal을 놓고 경쟁하지만 상태 owner와 실패 지점이 다릅니다. rbuilder가 Reth crates를 재사용해도 Reth node의 local payload job과 같은 프로세스나 같은 lifecycle이 되지는 않습니다. Relay가 높은 bid를 돌려줘도 full payload가 제시간에 전달된다는 보장도 생기지 않습니다.
        </p>
        <p>
          이 글은 <Link to="/cs/blockchain/reth-payload-builder#overview">Reth local payload lifecycle</Link>에서 출발해 한 slot의 local·external 후보가 proposer 앞에서 만나는 지점까지 추적합니다. Relay 선택 정책, 대상 환경의 cutoff, 수익 비교와 배포 계획은 실측이 필요한 별도 운영 판단이므로 여기서는 역할·프로토콜·기본 실패 경계만 다룹니다.
        </p>
        <ContentBoundary article="reth-mev" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Parent P 위에 local 하나와 external bid 셋이 도착합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Reth와 MEV 설명에 사용할 네 후보">
          {[
            ["Local L", "value 4", "parent P · 준비됨"],
            ["Bid A", "value 5", "parent P · 유효"],
            ["Bid B", "value 9", "parent Q · 문맥 불일치"],
            ["Bid C", "value 7", "parent P · 유효"],
          ].map(([title, value, condition]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{title}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{value}</code>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{condition}</span>
            </div>
          ))}
        </div>
        <p>
          숫자는 선택 순서를 설명하기 위한 임의의 value unit입니다. 대상 환경에서 측정한 수익이나 실제 bid 분포가 아닙니다. 요청 문맥은 같은 slot, parent P와 proposer key를 요구한다고 두겠습니다. 그러면 9가 가장 커도 parent Q 위의 후보이므로 비교 집합에서 빠지고, deadline 안에 검증을 마쳤다는 전제에서 7이 external 최댓값입니다.
        </p>
      </section>

      <section id="roles" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Block을 만드는 주체와 최종 제안하는 주체를 나눠 봅니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">주체</th><th className="px-3 py-3">소유하는 상태</th><th className="px-3 py-3">소유하지 않는 상태</th></tr></thead>
            <tbody>
              {[
                ["Reth local builder", "Engine API payload job · local candidate", "Relay bid와 blinded block 선택"],
                ["External builder", "Orderflow 실행 · payload · signed bid", "Validator의 최종 서명"],
                ["Relay", "Builder submission · header/body 중개", "Neutrality·항상 전달된다는 보장"],
                ["mev-boost", "Configured relay 조회 · proposer-side candidate 집계", "Reth txpool·local payload 내부 상태"],
                ["Consensus client / proposer", "Slot duty · blinded block 서명 · proposal", "External builder의 실행 정책"],
              ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3 align-top">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
        <p>
          Searcher는 별도 private orderflow surface로 bundle을 external builder나 relay service에 보낼 수 있습니다. Searcher→builder의 주문 제출과 proposer→relay의 Builder API exchange는 caller, 인증, privacy와 실패 의미가 다릅니다.
        </p>
      </section>

      <section id="builder-api" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Local과 external 경로는 cutoff 전까지 병렬로 준비됩니다</h2>
        <p>
          Local 경로에서는 consensus client가 Reth에 <code>forkchoiceUpdated</code>와 payload attributes를 보내 payload job을 엽니다. Reth는 txpool 후보를 실행해 local L을 갱신하고 이후 <code>getPayload</code> 요청에 답할 준비를 합니다. 이 lifecycle은 <Link to="/cs/blockchain/reth-payload-builder#overview">Reth Payload Builder 글</Link>이 소유합니다.
        </p>
        <p>
          External 경로에서는 별도 builder가 public transaction과 private orderflow를 실행해 payload와 bid를 만들고 relay에 제출합니다. rbuilder의 <code>StateProviderFactoryFromRethProvider</code>는 실제 Reth provider trait을 요구하고 대부분의 메서드를 위임합니다. 이것은 코드 재사용의 근거이지 두 애플리케이션이 같은 runtime owner라는 근거가 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("rbuilder-reth-provider", codeRefs["rbuilder-reth-provider"])} />
          <span className="text-xs text-muted-foreground">Reth provider 재사용과 external builder policy의 코드 경계</span>
        </div>
        <p>
          External bid를 기다린다는 이유로 local build를 멈추면 no-bid·invalid bid·late bid에서 준비된 대안이 사라집니다. 반대로 cutoff를 넘긴 external 응답까지 계속 비교하면 block proposal에 필요한 검증·서명·body retrieval 시간을 침범합니다. 그래서 두 경로를 병렬로 준비하되 결정 fence 뒤에는 하나의 경로만 남겨야 합니다.
        </p>
      </section>

      <section id="flashbots" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Builder API는 header 선택과 body 전달을 서로 다른 단계로 둡니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Builder API의 proposer-side 네 단계">
          {[
            ["01", "Registration", "fee recipient·gas limit을 signed registration으로 전달"],
            ["02", "getHeader", "slot·parent·proposer에 맞는 signed bid 요청"],
            ["03", "Blinded sign", "선택한 execution header를 포함한 blinded block 서명"],
            ["04", "getPayload", "서명한 header에 대응하는 full payload 회수"],
          ].map(([number, title, body]) => (
            <div key={number} className="relative min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{number}</span>
              <strong className="mt-1 block break-keep text-xs">{title}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Header bid를 받았다는 것은 full body를 받은 것이 아닙니다. Proposer가 blinded block에 서명한 다음 relay가 payload body를 돌려주고, 그 body의 block hash와 fork-specific 내용이 앞서 서명한 header와 맞아야 합니다. 따라서 header selection과 payload delivery는 서로 다른 성공 단계입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("get-payload-timeout", codeRefs["get-payload-timeout"])} />
          <span className="text-xs text-muted-foreground">여러 relay 요청, timeout, first valid body와 header/body 대조</span>
        </div>
      </section>

      <section id="validation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Value를 보기 전에 요청 문맥에 속한 후보인지 확인합니다</h2>
        <p>
          Candidate set에는 relay가 돌려준 모든 응답을 넣지 않습니다. 요청한 slot·parent·proposer와 fork schema에 맞는지, builder identity와 signature가 유효한지, block hash와 value encoding이 허용되는지 확인해야 합니다. mev-boost의 고정 source snapshot에서 <code>processBid</code>는 빈 block hash, pubkey·signature, parent hash, zero value와 운영자가 둔 최소 bid 정책을 검사한 뒤에만 최댓값을 갱신합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("process-bid", codeRefs["process-bid"])} />
          <span className="text-xs text-muted-foreground">유효 집합을 만든 뒤 value argmax를 갱신하는 실제 구현</span>
        </div>
        <ExplainedFormula
          question="5·9·7 bid와 local L 가운데 external 후보는 어떻게 좁혀집니까?"
          idea="Value 비교 전에 요청 문맥과 signature, fork schema, deadline을 통과한 external 집합을 만듭니다. Local L은 그 집합의 원소라기보다 별도로 준비한 proposer fallback입니다."
          formula={String.raw`b^*=\arg\max_{b\in\mathcal V(t<t_d)} v(b)`}
          annotatedFormula={String.raw`b^*=\underbrace{\arg\max_{b\in\mathcal V(t<t_d)}}_{\text{유효하고 제시간인 external 후보}}\ \underbrace{v(b)}_{\text{advertised value}}`}
          operations={[
            { expression: String.raw`\mathcal V(t<t_d)`, annotation: ["parent P·signature·fork·deadline 검사", "Bid B=9는 parent Q라 제외", "Bid A=5와 Bid C=7만 남음"] },
            { expression: String.raw`\arg\max v(b)`, annotation: ["유효 집합 안에서 value 비교", "max(5, 7)=7", "delivery 성공은 별도 단계"] },
          ]}
          terms={[
            { symbol: "b", name: "External builder bid", description: "Signed execution header와 advertised value를 포함한 외부 후보입니다." },
            { symbol: String.raw`\mathcal V`, name: "Validated set", description: "요청 문맥, signature, fork fields와 정책을 통과한 external 후보 집합입니다." },
            { symbol: "t_d", name: "Decision deadline", description: "검증·서명·body retrieval·proposal 시간을 남기기 위한 결정 경계입니다." },
            { symbol: "v(b)", name: "Advertised value", description: "Bid가 약속하는 value입니다. Full body delivery나 실제 지급을 뜻하지 않습니다." },
          ]}
          assumptions={["모든 bid를 같은 slot·parent·proposer 요청과 대조합니다.", "설명용 cutoff 전에 검증이 끝난 후보만 비교합니다.", "Local payload readiness는 external 후보 집합 밖에서 별도로 유지합니다."]}
          interpretation="Parent Q인 value 9 bid는 먼저 제외됩니다. Parent P인 5와 7 가운데 7이 external 선택 후보입니다. 이후 blinded block 서명과 payload delivery가 성공해야 proposal 경로가 끝납니다."
        />
      </section>

      <section id="selection" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">선택은 수익 비교 한 번이 아니라 시간 안의 상태 전이입니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5" aria-label="설명용 external bid 선택 상태 전이">
          {[
            ["준비", "Local L과 bid 수집"],
            ["검증", "문맥·서명·fork"],
            ["결정", "Bid C=7"],
            ["약속", "Blinded block 서명"],
            ["완료", "Body 검증·proposal"],
          ].map(([title, body], index) => (
            <div key={title} className="relative min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs">{title}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{body}</p>
              {index < 4 ? <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-0.5 text-primary sm:block">→</span> : null}
            </div>
          ))}
        </div>
        <p>
          External candidate를 선택하기 전에는 local L로 갈 수 있습니다. 그러나 특정 execution header를 포함한 blinded beacon block에 proposer가 서명한 뒤에는 이미 그 header에 약속한 상태입니다. 이 경계를 넘은 뒤 relay가 body를 주지 않는 문제는 “local이 준비돼 있으니 그냥 바꾸면 된다”로 해결되지 않습니다.
        </p>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">No bid, invalid bid, non-delivery는 서로 다른 terminal state입니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["No valid bid", "서명 전", "External 집합이 비어 local 선택 가능"],
            ["Invalid 또는 late bid", "서명 전", "후보 제외 뒤 남은 external 또는 local 선택"],
            ["Payload non-delivery", "Blinded 서명 뒤", "약속한 body를 받지 못해 proposal liveness에 직접 영향"],
          ].map(([failure, moment, outcome]) => (
            <div key={failure} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{failure}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{moment}</code>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{outcome}</span>
            </div>
          ))}
        </div>
        <p>
          Source snapshot의 <code>innerGetPayload</code>는 여러 relay에 동시에 body를 요청하고 timeout 안에 받은 응답을 <code>verifyPayload</code>로 검사합니다. 첫 유효 body를 채택하며, 아무 유효 body도 오지 않으면 빈 결과로 끝납니다. 이 동작은 무한 대기를 막지만 이미 서명한 slot을 되살리거나 relay의 future delivery를 보장하지는 않습니다.
        </p>
      </section>

      <section id="private-orderflow" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Private bundle API는 proposer Builder API가 아닙니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <div className="min-w-0 bg-background p-4">
            <span className="text-[10px] font-bold text-muted-foreground">Searcher → builder / relay service</span>
            <strong className="mt-1 block text-sm">eth_sendBundle 계열</strong>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">Ordered transactions, target block과 privacy·rate policy를 다루는 private orderflow surface입니다.</p>
          </div>
          <div className="min-w-0 bg-background p-4">
            <span className="text-[10px] font-bold text-muted-foreground">Proposer-side client → relay</span>
            <strong className="mt-1 block text-sm">getHeader · blinded_blocks</strong>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">Slot·parent·proposer에 맞는 bid와 서명한 blinded block의 full payload 교환을 다룹니다.</p>
          </div>
        </div>
        <p>
          두 API를 “Flashbots 요청” 하나로 합치면 누가 무엇을 제출했고 어느 실패가 누구에게 영향을 주는지 알 수 없습니다. Private submission은 inclusion·confidentiality·non-censorship을 자동으로 보장하지 않으며, proposer Builder API 역시 relay neutrality를 보장하지 않습니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">고정한 규격과 구현에서 확인한 범위까지만 결론을 냅니다</h2>
        <CitationBlock citeKey={1} source="Ethereum Builder Specifications @ 78a5546d" href="https://github.com/ethereum/builder-specs/tree/78a5546d9d8253beabf7db8baf988a58abdec87f">
          <p><Label>O</Label>Validator registration, header bid, signed blinded block과 payload delivery의 proposer-builder message surface를 확인했습니다.</p>
          <p><strong>범위:</strong> 고정한 specification snapshot의 schema와 endpoint 계약입니다. Relay availability·neutrality·payment를 보장하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={2} type="code" source="Flashbots mev-boost @ 203bb965" href="https://github.com/flashbots/mev-boost/tree/203bb9659eea613caefd198c67df4c6a8e6bf5d6">
          <p><Label>O</Label><code>processBid</code>의 후보 검증·최댓값 갱신과 <code>innerGetPayload</code>의 concurrent relay 요청·timeout·payload verification을 확인했습니다.</p>
          <p><strong>범위:</strong> 선택한 source snapshot의 proposer-side middleware 동작입니다. 다른 release와 운영 설정의 deadline을 일반화하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={3} type="code" source="Flashbots rbuilder @ 6037fa72" href="https://github.com/flashbots/rbuilder/tree/6037fa728b13bf1806e16fff2586414216f6b8fa">
          <p><Label>O</Label>External builder application이 Reth provider trait을 재사용하고 일부 builder-specific logic을 추가하는 코드 경계를 확인했습니다.</p>
          <p><strong>범위:</strong> Reth crates 재사용의 근거이며 Reth node와 rbuilder가 동일한 runtime owner라는 뜻이 아닙니다.</p>
        </CitationBlock>
        <p><Label>M</Label>대상 환경의 relay latency, bid 분포, realized value, proposal success, cutoff와 local fallback 성공률은 측정하지 않았습니다.</p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>rbuilder가 Reth crates를 사용해도 Reth node의 내부 기능이 아닌 이유는 무엇입니까? <strong>(답: 별도 애플리케이션이 Reth provider와 EVM 코드를 재사용할 뿐 orderflow·build·bid 상태와 lifecycle을 스스로 소유하기 때문입니다.)</strong></li>
          <li>Value 9 bid가 parent Q이고 요청 parent가 P라면 무엇을 선택합니까? <strong>(답: 9를 유효 집합에서 빼고, 제시간인 5와 7 가운데 7을 external 후보로 선택합니다.)</strong></li>
          <li>getHeader 성공과 getPayload 성공을 나눠야 하는 이유는 무엇입니까? <strong>(답: Header에 서명한 뒤에도 relay가 그 header와 일치하는 full body를 제시간에 전달하지 못할 수 있기 때문입니다.)</strong></li>
          <li>No bid와 payload non-delivery의 복구 가능성이 왜 다릅니까? <strong>(답: No bid는 blinded 서명 전이라 local 경로를 고를 수 있지만, non-delivery는 특정 header에 서명한 뒤의 실패이기 때문입니다.)</strong></li>
        </ol>
      </section>

      <RethMevMapReturn />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "mev-boost": rethMevTree, rbuilder: rbuilderTree }}
        projectMetas={{
          "mev-boost": { id: "mev-boost", label: "mev-boost · Go", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          rbuilder: { id: "rbuilder", label: "rbuilder · Rust", badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700" },
        }}
      />
    </article>
  );
}
