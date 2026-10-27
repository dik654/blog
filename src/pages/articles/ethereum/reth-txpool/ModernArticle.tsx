import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import RethTxpoolLocator, { RethTxpoolMapReturn } from "./RethTxpoolLocator";
import { rethTxpoolV281Tree } from "./fileTree";
import { RETH_TXPOOL_PROJECT_META, rethTxpoolCodeRefs } from "./modernCodeRefs";
import RethTxpoolLifecycleViz from "./viz/RethTxpoolLifecycleViz";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethTxpoolLocator current="reth-txpool" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">아직 블록에 들어가지 않은 거래는 어떤 조건에서 기다리며, 언제 실행 후보가 됩니까?</h2>
        </div>
        <RethTxpoolLifecycleViz />
        <p className="text-lg leading-8">설명용 상황은 Alice의 canonical nonce가 7인 시점입니다. Alice가 T7과 T8을 연달아 보내고 Bob이 T4를 보냅니다. 다음 블록의 base fee는 처음 42 gwei이고 T7의 max fee는 40 gwei라고 가정합니다. 이 숫자는 상태 변화를 보기 위한 예시이며 Reth 기본 설정이나 실제 네트워크 값이 아닙니다.</p>
        <p>TxPool은 canonical state도, 단순 FIFO queue도 아닙니다. 아직 블록에 포함되지 않은 거래를 노드 로컬 정책으로 검증·보관하고, 현재 head에서 실행 가능한 sender별 첫 거래만 payload builder에 제공합니다. Head가 바뀌면 nonce·balance·fee와 reorg 결과를 반영해 같은 거래를 다시 분류합니다.</p>
      </section>

      <section id="validation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">거래 규칙 위반과 state 조회 실패를 다른 결과로 남깁니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["VALID", "형식과 현재 sender state를 통과", "분류 입력과 함께 pool로 이동"],
            ["INVALID", "Type·fork·nonce·balance·blob 규칙 위반", "거래 hash와 원인을 남기고 거부"],
            ["ERROR", "Latest state provider를 열거나 읽지 못함", "거래 자체가 잘못됐다고 단정하지 않음"],
          ].map(([title, body, result]) => <div key={title} className="bg-background p-4"><strong className="text-sm text-primary">{title}</strong><p className="mt-2 text-xs leading-5">{body}</p><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{result}</p></div>)}
        </div>
        <p>Reth v2.8.1은 state access가 필요 없는 type·fork·크기·gas limit·fee field·chain ID 검사를 먼저 수행합니다. 그다음 latest state provider에서 sender account를 읽어 nonce, balance, sender bytecode와 blob sidecar를 검사합니다. Stateless 실패는 <code>Invalid</code>, provider 조회 실패는 <code>Error</code>, 두 단계를 통과한 거래만 <code>Valid</code>가 됩니다.</p>
        <p><code>Valid</code>는 “다음 블록에 들어간다”는 뜻이 아닙니다. 검증에 사용한 balance와 state nonce, origin에 따른 propagation 여부를 내부 pool에 넘길 자격만 얻습니다. T7처럼 max fee가 다음 base fee보다 낮은 거래도 영구 invalid가 아니라 잠시 기다릴 수 있으므로, 실행 가능성은 다음 서브풀 단계가 결정합니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("validation-pipeline", rethTxpoolCodeRefs["validation-pipeline"])} /><span className="text-xs text-muted-foreground">eth.rs L401–435·L661–730 · 실제 검증 분기</span><CodeViewButton onClick={() => sidebar.open("validation-outcome", rethTxpoolCodeRefs["validation-outcome"])} /><span className="text-xs text-muted-foreground">pool/mod.rs L571–637 · Valid만 삽입</span></div>
      </section>

      <section id="classification" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Valid 거래도 이유에 따라 네 서브풀에서 기다립니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">서브풀</th><th className="px-3 py-3">현재 부족한 조건</th><th className="px-3 py-3">예시</th><th className="px-3 py-3">조건이 바뀌면</th></tr></thead>
            <tbody>{[
              ["Pending", "없음 · ancestor·nonce·balance·gas·fee 충족", "Bob T4", "Builder sender-head 후보"],
              ["BaseFee", "일반 거래의 max fee가 다음 base fee보다 낮음", "T7 · 40 < 42", "Base fee가 내려가면 Pending 가능"],
              ["Queued", "Nonce gap, parked ancestor, balance 또는 gas 조건", "T8 · T7이 아직 BaseFee", "선행 거래와 account state 뒤 재분류"],
              ["Blob", "Blob 거래가 base fee나 blob fee 또는 의존성 조건을 못 채움", "설명용 blob B9", "두 fee와 sender 조건을 모두 다시 검사"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>Reth는 <code>NO_NONCE_GAPS</code>, <code>ENOUGH_BALANCE</code>, <code>ENOUGH_FEE_CAP_BLOCK</code> 같은 조건을 <code>TxState</code> 비트로 보존합니다. 이렇게 해야 head가 바뀌었을 때 왜 기다리는지를 잃지 않고 영향을 받은 sender와 fee 조건만 다시 계산할 수 있습니다.</p>
        <p>중요한 차이는 v2.8.1에 <code>Blob</code> 서브풀이 따로 있다는 점입니다. 예전 세 서브풀 그림은 현재 구현을 충분히 설명하지 못합니다. Blob 거래는 consensus 형식과 pooled sidecar의 크기·보존 경로도 다르므로 일반 BaseFee 대기 거래와 같은 메모리 정책으로 단순화하면 안 됩니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("subpool-state", rethTxpoolCodeRefs["subpool-state"])} /><span className="text-xs text-muted-foreground">state.rs L3–48·L143–205 · 네 서브풀 결정</span></div>
        <ExplainedFormula
          question="같은 sender·nonce의 새 거래가 T7을 교체하려면 fee를 얼마나 높여야 합니까?"
          idea="Replacement는 consensus 규칙이 아니라 노드의 anti-spam 정책입니다. 비교하도록 설정한 fee 축마다 price bump를 적용하고 정수 wei 단위로 계산합니다."
          formula={String.raw`F^{\mathrm{new}}_i\ge\left\lceil F^{\mathrm{old}}_i\frac{100+b}{100}\right\rceil`}
          annotatedFormula={String.raw`F^{\mathrm{new}}_i\ge\left\lceil \underbrace{F^{\mathrm{old}}_i}_{\text{기존 T7의 fee 축}}\underbrace{\frac{100+b}{100}}_{\text{설정한 bump}}\right\rceil`}
          operations={[
            { expression: String.raw`F^{\mathrm{old}}_i`, annotation: ["같은 sender·nonce로 이미 보관한 거래", "max fee·priority fee·blob fee 축은 설정과 type에 따름"] },
            { expression: String.raw`\frac{100+b}{100}`, annotation: ["설명용 b=10이면 1.1배", "40 gwei → 44 gwei", "3 gwei → 3.3 gwei 상당의 정수 wei"] },
          ]}
          terms={[
            { symbol: "i", name: "Fee 축", description: "Transaction type과 Reth 설정이 replacement에서 비교하는 fee 항목입니다." },
            { symbol: "b", name: "Price bump", description: "노드가 정한 인상률입니다. Ethereum consensus 상수가 아닙니다." },
            { symbol: String.raw`\lceil\cdot\rceil`, name: "정수 올림", description: "Wei 단위에서 최소 증가량을 잃지 않기 위한 표현입니다." },
          ]}
          assumptions={[
            "두 거래의 sender와 nonce가 같고 기본 envelope 검증을 통과했습니다.",
            "10%는 계산을 보여주기 위한 가정이며 실제 release와 PriceBumpConfig를 확인해야 합니다.",
            "모든 required fee 축 가운데 하나라도 부족하면 replacement가 거부될 수 있습니다.",
          ]}
          interpretation="설명용 10% 정책에서 T7의 max fee 40 gwei와 priority fee 3 gwei를 모두 비교한다면 새 거래는 각각 44 gwei와 3.3 gwei 상당의 정수 wei 조건을 충족해야 합니다. 실제 채택 여부는 고정한 Reth 설정에 귀속합니다."
        />
      </section>

      <section id="ordering" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">우선순위는 모든 거래가 아니라 sender별 현재 head 사이에서 비교합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["01", "Sender chain", "Alice T7 → T8 · Bob T4"],
            ["02", "Independent heads", "Alice T7 · Bob T4만 노출"],
            ["03", "Priority", "기본은 effective tip으로 비교"],
            ["04", "Unlock", "T7을 내보낸 뒤 T8 활성"],
          ].map(([step, title, body]) => <div key={step} className="bg-background p-4"><span className="text-[9px] font-bold text-primary">{step}</span><strong className="mt-2 block text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p><code>TransactionOrdering</code>은 거래 하나의 priority를 계산합니다. 기본 <code>CoinbaseTipOrdering</code>은 현재 base fee를 기준으로 계산한 effective tip을 사용합니다. 그러나 이 trait이 nonce 순서를 보장하는 것은 아닙니다. <code>BestTransactions</code> iterator가 sender별 independent head만 후보 집합에 넣고, nonce N을 내보낸 뒤 N+1을 해제합니다.</p>
        <p>Payload builder는 이 iterator가 준 순서를 그대로 무조건 포함하지 않습니다. Block gas, blob gas, 실행 실패와 builder 정책을 적용하며, 어떤 sender의 head를 invalid로 표시하면 그 descendants도 건너뜁니다. Pool ordering은 후보 제공 계약이고 canonical inclusion 보장이 아닙니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("ordering-policy", rethTxpoolCodeRefs["ordering-policy"])} /><span className="text-xs text-muted-foreground">ordering.rs L39–85 · priority 정책</span><CodeViewButton onClick={() => sidebar.open("sender-head-order", rethTxpoolCodeRefs["sender-head-order"])} /><span className="text-xs text-muted-foreground">best.rs L87–120·L206–248 · nonce-safe iterator</span></div>
      </section>

      <section id="canonical-update" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">새 head와 reorg는 예전 판정을 복사하지 않고 현재 state로 다시 계산합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["새 tip", "next base/blob fee 계산"],
            ["계정", "changed nonce·balance 반영"],
            ["Mined", "새 chain 포함 거래 제거"],
            ["Old-only", "reorg 거래·sidecar 복원"],
            ["재검증", "external admission 재진입"],
          ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}
        </div>
        <p>정상 commit에서는 새 block에 포함된 거래를 제거하고 changed account와 다음 block fee를 반영합니다. T7이 포함돼 Alice nonce가 8이 되면 T8은 새 sender head가 될 수 있습니다. 반대로 fee가 올라가면 Pending이 BaseFee나 Blob으로 내려갈 수도 있습니다.</p>
        <p>Reorg에서는 new branch의 state와 mined set을 pool에 먼저 적용합니다. Old branch에만 있던 거래는 consensus 형식에서 pooled 형식으로 복원하고, blob 거래라면 sidecar를 다시 결합한 뒤 <code>add_external_transactions</code> 경로로 보냅니다. 따라서 “한 번 valid였으니 그대로 되살린다”가 아니라 새 canonical state에서 다시 검증합니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("reorg-reinjection", rethTxpoolCodeRefs["reorg-reinjection"])} /><span className="text-xs text-muted-foreground">maintain.rs L382–435 · update 후 old-only 재검증</span></div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">설명은 Reth v2.8.1의 transaction-pool 구현에 고정했습니다</h2>
        <CitationBlock source="Reth v2.8.1 release" citeKey={1} href="https://github.com/paradigmxyz/reth/releases/tag/v2.8.1"><p><b>확인한 범위:</b> 이 글의 구현 기준 release입니다.</p><p><b>확대하지 않은 범위:</b> 현재 main branch, 다른 chain 설정이나 대상 노드의 성능을 뜻하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Ethereum transaction validator" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/transaction-pool/src/validate/eth.rs"><p><b>확인한 범위:</b> Stateless→stateful 순서와 Valid·Invalid·Error, blob sidecar 검증입니다.</p><p><b>주의:</b> Pool admission 성공을 EVM 실행 성공이나 block inclusion으로 확대하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · subpool state" citeKey={3} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/transaction-pool/src/pool/state.rs"><p><b>확인한 범위:</b> Pending·BaseFee·Queued·Blob 네 상태와 분류 bit입니다.</p><p><b>주의:</b> Default limit와 replacement 정책은 실행 설정을 별도로 고정해야 합니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · best transaction iterator" citeKey={4} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/transaction-pool/src/pool/best.rs"><p><b>확인한 범위:</b> Sender별 independent transaction과 다음 nonce unlock입니다.</p><p><b>확대하지 않은 범위:</b> Builder의 최종 inclusion과 block validity를 이 iterator 하나가 보장한다는 뜻이 아닙니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · transaction pool maintenance" citeKey={5} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/transaction-pool/src/maintain.rs"><p><b>확인한 범위:</b> Commit·reorg에서 canonical state를 반영하고 old-only 거래를 재검증하는 순서입니다.</p><p><b>주의:</b> 대상 노드의 restart·resource pressure 복구 결과는 별도 실무 글에서 측정해야 합니다.</p></CitationBlock>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="reth-txpool-review">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="reth-txpool-review" className="mt-2 text-xl font-bold">Alice T7·T8이 도착해 reorg를 만나는 과정을 네 문장으로 추적해 보세요</h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-4">
          {[["01 · 검증", "Valid와 Pending은 왜 다를까요?"], ["02 · 분류", "T7과 T8은 왜 다른 곳에서 기다릴까요?"], ["03 · 선택", "왜 T8보다 T7을 먼저 내보낼까요?"], ["04 · Reorg", "왜 T7을 다시 검증할까요?"]].map(([title, body]) => <li key={title} className="bg-background p-4"><strong className="block text-xs text-primary">{title}</strong><span className="mt-2 block">{body}</span></li>)}
        </ol>
      </section>

      <RethTxpoolMapReturn current="reth-txpool" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethTxpoolCodeRefs} fileTrees={{ reth: rethTxpoolV281Tree }} projectMetas={RETH_TXPOOL_PROJECT_META} />
    </article>
  );
}
