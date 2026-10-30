import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import CommonwareSimplexLocator, { CommonwareSimplexMapReturn } from "./CommonwareSimplexLocator";
import { codeRefs } from "./codeRefs";
import { commonwareSimplexTree } from "./fileTrees";
import {
  QuorumIntersectionViz,
  SimplexFailureViz,
  SimplexFinalizationViz,
} from "./viz/ModernCommonwareSimplexViz";

const digest = "hash(encode(Random(42)))";

export default function ModernCommonwareSimplexArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <CommonwareSimplexLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">같은 digest는 언제 finalization certificate가 되는가</h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            부모 글에서 Application은 <code>Random(42)</code> 원문을 indexer에 보관하고 <code>{digest}</code>를 Simplex에 넘겼습니다. 여기서는 그 digest 하나만 계속 추적합니다. 네 validator 가운데 최대 한 대가 Byzantine일 수 있는 <code>n=4, f=1</code> 예에서 어떤 표와 local 상태가 차례로 필요한지 확인합니다.
          </p>
        </div>
        <SimplexFinalizationViz />
        <p className="text-lg leading-8">
          <strong>서로 다른 세 notarize vote가 notarization을 만들고, 각 validator의 Application certification이 true인 곳만 finalize vote를 낼 수 있습니다.</strong> 이 finalize vote도 세 개가 모여야 finalization certificate가 됩니다. 따라서 notarization, local certification, finalization은 같은 완료 상태가 아닙니다.
        </p>
        <p>
          이 글은 Commonware Simplex 전체 최적화나 운영 배포를 비교하지 않습니다. v2026.9.0의 기본 finalization 경로와 두 실패 분기만 실제 코드까지 좁혀 봅니다. Stable leader, optimistic validation, forced inclusion과 speculative finality는 다음 질문으로 남깁니다.
        </p>
        <ContentBoundary article="commonware-primitives-simplex-storage" />
      </section>

      <section id="certificate-path" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">표의 종류가 바뀌면 증명하는 사실도 바뀐다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Simplex의 세 vote와 certificate 의미">
          {([
            ["NOTARIZE", "digest 지지", "세 표 → notarization"],
            ["NULLIFY", "현재 term 건너뛰기", "세 표 → nullification"],
            ["FINALIZE", "digest 최종 확정", "세 표 → finalization"],
          ] as const).map(([name, meaning, output], index) => (
            <div key={name} className={`min-w-0 bg-background p-4 ${index === 2 ? "ring-2 ring-inset ring-primary" : ""}`}>
              <span className={`font-mono text-[10px] font-black ${index === 2 ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
              <strong className="mt-2 block break-keep text-sm">{meaning}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{output}</p>
            </div>
          ))}
        </div>
        <p>
          Batcher는 참여자 집합에서 <code>N3f1</code> quorum을 계산하고 그 수를 verifier에 넘깁니다. 검증된 vote가 quorum에 도달하면 message kind에 맞는 certificate를 조립합니다. Nullify 표 세 장을 finalize 표처럼 세어 finalization으로 바꿀 수는 없습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Quorum 계산 코드" onClick={() => sidebar.open("batcher-quorum", codeRefs["batcher-quorum"])} />
          <CodeViewButton label="Certificate 조립 코드" onClick={() => sidebar.open("certificate-assembly", codeRefs["certificate-assembly"])} />
        </div>
      </section>

      <section id="quorum" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">왜 네 명 중 세 명이 필요한가</h2>
        <QuorumIntersectionViz />
        <ExplainedFormula
          question="n=4, f=1에서 certificate마다 왜 서로 다른 signer 세 명이 필요한가?"
          idea={<>크기가 3인 두 signer 집합을 같은 네 명 안에서 고르면 최소 두 명이 겹칩니다. Byzantine은 최대 한 명이므로 교집합에는 적어도 한 명의 honest validator가 남습니다.</>}
          formula={String.raw`\begin{aligned}q&=2f+1=3\\|Q_1\cap Q_2|&\ge 2q-n=2\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}q&=\underbrace{2f+1}_{\text{certificate quorum}}=3\\|Q_1\cap Q_2|&\ge\underbrace{2q-n}_{\text{교집합 하한}}=2\end{aligned}`}
          operations={[
            { expression: String.raw`q=2f+1`, annotation: ["f=1이면 notarize·nullify·finalize", "certificate마다 서로 다른 signer 3명이 필요합니다."] },
            { expression: String.raw`2q-n`, annotation: ["두 집합의 원소 수는 합쳐 6이지만", "validator는 4명뿐이므로 최소 2명이 겹칩니다."] },
            { expression: String.raw`2-f`, annotation: ["교집합 2명에서 Byzantine 최대 1명을 빼도", "honest validator가 최소 1명 남습니다."] },
          ]}
          terms={[
            { symbol: "n", name: "participants", description: "고정 epoch에 참여하는 validator 수입니다." },
            { symbol: "f", name: "fault bound", description: "Byzantine일 수 있는 validator의 최대 수입니다." },
            { symbol: "q", name: "quorum", description: "Certificate를 만드는 서로 다른 signer 수입니다." },
            { symbol: "Q₁,Q₂", name: "two signer sets", description: "같은 epoch·round·message kind의 서로 다른 certificate 후보입니다." },
          ]}
          assumptions={[
            "n=3f+1인 인증된 고정 committee를 사용합니다.",
            "중복 signer와 다른 epoch·round·message kind의 서명을 거절합니다.",
            "Honest validator는 같은 phase의 충돌하는 표를 동시에 보내지 않습니다.",
            "교집합은 payload 원문 보관이나 Application state 실행을 증명하지 않습니다.",
          ]}
          interpretation="n=4, f=1이면 q=3입니다. 세 명짜리 두 quorum은 최소 두 명이 겹치며, 그중 적어도 한 명은 honest이므로 같은 phase의 충돌하는 certificate를 막는 기반이 됩니다."
        />
      </section>

      <section id="certification" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Notarization 뒤에는 validator마다 local certification이 열린다</h2>
        <p>
          Voter는 notarization이 있는 proposal을 <code>automaton.certify(round, payload)</code>로 보냅니다. 이 호출은 중앙의 한 Application 서버가 전체 committee를 대신 판정하는 구조가 아닙니다. 각 validator가 자신의 Application automaton에서 같은 round와 digest를 판정합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr]" aria-label="notarization에서 local certification과 finalize 조건으로 이어지는 경로">
          <div className="min-w-0 bg-background p-3"><span className="text-[9px] font-bold text-muted-foreground">NETWORK CERT</span><strong className="mt-2 block text-xs">Notarization</strong></div>
          <div className="hidden items-center bg-background px-1 text-primary sm:flex" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-3 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">LOCAL APP</span><strong className="mt-2 block text-xs">certify(round, digest)</strong></div>
          <div className="hidden items-center bg-background px-1 text-primary sm:flex" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-3"><span className="text-[9px] font-bold text-muted-foreground">LOCAL VOTE GATE</span><strong className="mt-2 block text-xs">true일 때 finalize 가능</strong></div>
        </div>
        <p>
          <code>construct_finalize</code>는 이미 finalize 또는 nullify를 보냈는지, proposal equivocation이 없는지, notarization이 있는지, certification이 성공했는지를 확인합니다. 하나라도 통과하지 못하면 finalize vote를 만들지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Certification 요청 코드" onClick={() => sidebar.open("certification-request", codeRefs["certification-request"])} />
          <CodeViewButton label="Finalize 조건 코드" onClick={() => sidebar.open("finalize-gate", codeRefs["finalize-gate"])} />
        </div>
      </section>

      <section id="journal" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">전파하기 전에 local journal을 먼저 sync한다</h2>
        <p>
          Successful certification이 곧바로 네트워크 broadcast로 이어지는 것은 아닙니다. Voter loop는 이번 iteration에서 추가한 certification result와 vote artifact를 <code>sync_journal()</code>로 durable하게 만든 뒤 <code>notify()</code>를 호출합니다.
        </p>
        <div className="not-prose grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-px bg-border p-px text-center text-[10px] sm:text-xs">
          <div className="min-w-0 bg-background px-2 py-3"><strong className="block text-primary">1</strong>local result 생성</div>
          <div className="flex items-center bg-background px-1 text-primary" aria-hidden>→</div>
          <div className="min-w-0 bg-background px-2 py-3 ring-2 ring-inset ring-primary"><strong className="block text-primary">2</strong>journal sync</div>
          <div className="flex items-center bg-background px-1 text-primary" aria-hidden>→</div>
          <div className="min-w-0 bg-background px-2 py-3"><strong className="block text-primary">3</strong>vote·report 전파</div>
        </div>
        <p>
          이 journal은 validator 하나의 local 내구성 경계입니다. Committee 전체의 finalization certificate와 같지 않습니다. 반대로 네트워크에서 finalize vote를 보았다는 사실만으로 Application state commit이나 client success를 주장할 수도 없습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Journal 후 전파 코드" onClick={() => sidebar.open("durable-broadcast", codeRefs["durable-broadcast"])} />
        </div>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">False와 오류를 같은 거절로 기록하지 않는다</h2>
        <SimplexFailureViz />
        <p>
          Application이 실제로 <code>false</code>를 반환하거나 timer가 끝나면 현재 term은 nullify 경로로 갑니다. 서로 다른 세 nullify vote가 모이면 nullification이 되고, 다음 시작점은 일반식으로 <code>next_term_start(v)</code>입니다.
        </p>
        <p>
          하지만 certification result channel이 끊겨 <code>RecvError</code>가 나면 코드는 이를 <code>false</code>로 바꾸지 않습니다. 주석이 밝히듯 실패로 가정하면 notarization은 있지만 certification이 영원히 없어 view를 빠져나오지 못할 수 있습니다. Sync된 결과는 journal에서 replay하고, 기록되지 않은 결과는 restart 뒤 다시 요청합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="오류와 false 분기 코드" onClick={() => sidebar.open("certification-error", codeRefs["certification-error"])} />
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 이 글의 경계</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <div id="paper-commonware-simplex">
            <CitationBlock source="Commonware Simplex module docs · v2026.9.0" citeKey={1} type="code" href="https://docs.rs/commonware-consensus/2026.9.0/commonware_consensus/simplex/index.html">
              <p><strong>확인한 것:</strong> Notarize·nullify·finalize와 Application certification의 관계, genesis·term 진행, crash recovery의 공개 계약입니다.</p>
              <p><strong>전제:</strong> 인증된 n=3f+1 committee와 deterministic certification, 해당 릴리스 설정을 사용합니다.</p>
              <p><strong>말하지 않는 것:</strong> 임의 네트워크에서 고정 지연을 보장하거나 finalization이 Application state 실행까지 자동 완료한다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-commonware-simplex-source">
            <CitationBlock source="Commonware monorepo · v2026.9.0 · d476a236" citeKey={2} type="code" href="https://github.com/commonwarexyz/monorepo/tree/d476a2361ce6840d2b9d0aa6fb30a924429046d4/consensus/src/simplex">
              <p><strong>확인한 것:</strong> N3f1 quorum, certificate 조립, certify 요청, finalize 조건, journal-before-notify와 RecvError 분기입니다.</p>
              <p><strong>범위:</strong> 2026-10-30에 고정한 exact tag와 commit의 공개 구현입니다.</p>
              <p><strong>말하지 않는 것:</strong> 다른 버전의 API·최적화와 동일하거나 실제 배포 성능이 우수하다고 주장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </div>
        <p>
          이 글의 <code>Random(42)</code>, validator D의 지연, A·B·C의 <code>certify=true</code>는 내부 순서를 한 객체로 추적하기 위한 설명용 가정입니다. Protocol의 필수 고정 입력이나 측정 결과가 아닙니다.
        </p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">흐름을 다시 말해 보기</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>Notarization이 있는데도 곧바로 finalization이라고 부를 수 없는 이유는 무엇입니까? <strong>(답: 각 validator의 successful certification과 별도의 finalize quorum이 아직 없기 때문입니다.)</strong></li>
          <li>Certification이 중앙 판정 한 번이 아닌 이유는 무엇입니까? <strong>(답: 각 validator가 자신의 automaton에 같은 round와 payload를 certify하기 때문입니다.)</strong></li>
          <li><code>RecvError</code>를 <code>false</code>로 처리하면 왜 위험합니까? <strong>(답: 실제 영구 거절이 아닌 통신 오류가 nullify 판단으로 굳어 liveness를 멈출 수 있기 때문입니다.)</strong></li>
          <li>Finalization certificate가 생겼을 때 아직 말할 수 없는 것은 무엇입니까? <strong>(답: Application state 실행, 외부 저장 성공, client success는 별도 경계입니다.)</strong></li>
        </ol>
        <p className="text-sm text-muted-foreground">
          다음 글에서는 <Link to="/cs/blockchain/commonware-broadcast#overview" className="font-bold text-primary hover:underline">Commonware buffered broadcast</Link>로 이동해 local 요청 수락과 상대가 검증한 수신을 구분합니다.
        </p>
      </section>

      <CommonwareSimplexMapReturn />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ commonware: commonwareSimplexTree }}
        projectMetas={{
          commonware: {
            id: "commonware",
            label: "Commonware v2026.9.0 · Rust",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
