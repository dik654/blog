import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmForkchoiceLocator, { PrysmForkchoiceMapReturn } from "./PrysmForkchoiceLocator";
import PrysmForkchoiceFlowViz from "./viz/PrysmForkchoiceFlowViz";

const inputs = [
  ["Anchor", "J320", "현재 justified checkpoint root"],
  ["Branch A", "A353 · 96", "latest-message subtree weight"],
  ["Branch B", "B353 · 80", "현재 slot의 timely block"],
  ["Active", "3,200 units", "32 slots로 나눌 설명용 balance"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmForkchoiceLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            같은 checkpoint 아래 두 유효한 가지가 있을 때 Prysm은 왜 B353을 잠시 head로 골랐다가 다음 slot A353으로 바꿉니까?
          </h2>
        </div>
        <PrysmForkchoiceFlowViz />
        <p className="text-lg leading-8">
          Block이 state transition과 execution 검증을 통과했다는 사실은 그 block이 현재 head라는 뜻이 아닙니다.
        </p>
        <p>
          Prysm의 fork choice는 <strong>유효한 후보들 사이의 현재 선택</strong>을 소유합니다. Block tree, validator별 latest vote, justified·finalized checkpoint, 현재 slot과 proposer boost를 입력으로 받아 root 하나를 돌려줍니다. 이 선택은 새 vote와 시간이 들어오면 바뀔 수 있습니다.
        </p>
        <p>
          직전 <Link to="/cs/blockchain/prysm-block-proposal#overview">블록 제안 글</Link>은 proposer가 parent를 받아 새 block을 만드는 경로였습니다. 이 글은 여러 candidate가 이미 store에 들어온 뒤 head 하나를 고르는 경로만 추적합니다. Block 검증은 <Link to="/cs/blockchain/prysm-block-processing#overview">블록 처리 글</Link>, 되돌리기 어려운 checkpoint는 <Link to="/cs/blockchain/prysm-finality#overview">최종성 글</Link>이 각각 소유합니다.
        </p>
        <ContentBoundary article="prysm-forkchoice" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="설명용 Fulu fork-choice 입력">
          {inputs.map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Root 이름과 weight unit은 계산 순서를 보기 위한 설명용 값입니다. 실제 mainnet block이나 validator 집합을 측정한 값이 아닙니다. Fulu slot 353에서 J320 아래 A353과 B353이 모두 검증을 통과했고, latest vote만 반영하면 A subtree 96, B subtree 80이라고 둡니다.
        </p>
        <p>
          Total active balance 3,200도 proposer boost 산식을 정수로 보여 주기 위한 정규화 값입니다. 모든 값을 같은 비율로 키워 Gwei로 표현해도 비교 결과는 같습니다.
        </p>
      </section>

      <section id="state" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">상태</h2>
        <p>
          Prysm v7.3.1의 자료구조는 과거의 단순한 <code>nodeByRoot + children</code> 예제보다 넓습니다. <code>ForkChoice</code>가 validator별 <code>Vote</code>와 balance snapshot을 소유하고, 내부 <code>Store</code>가 checkpoint, proposer boost, block node와 cached head를 소유합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Prysm fork-choice 상태 소유권">
          {[
            ["Vote", "current · next", "validator별 latest message"],
            ["Node", "balance · weight", "직접 지지와 subtree 합계"],
            ["Store", "checkpoint · boost", "head 계산의 시간·안전 경계"],
            ["Cache", "bestDescendant", "viable heaviest leaf shortcut"],
          ].map(([owner, state, role]) => (
            <div key={owner} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{owner}</span>
              <strong className="mt-2 block break-keep text-xs">{state}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>
        <p>
          같은 <code>balance</code>라는 이름이라도 두 층을 구분해야 합니다. <code>Node.balance</code>는 그 node를 직접 지지하는 값이고, <code>Node.weight</code>는 자식 subtree까지 합한 값입니다. <code>Vote.currentRoot</code>는 이미 balance에 반영된 root이고 <code>nextRoot</code>는 다음 <code>Head()</code>에서 반영할 후보입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="ForkChoice·Store" onClick={() => sidebar.open("forkchoice-owners", codeRefs["forkchoice-owners"])} />
          <CodeViewButton label="Node·Vote" onClick={() => sidebar.open("forkchoice-node-vote", codeRefs["forkchoice-node-vote"])} />
          <span className="text-xs text-muted-foreground">고정한 v7.3.1 소스의 실제 필드</span>
        </div>
      </section>

      <section id="vote" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Vote</h2>
        <p>
          Network에서 attestation bytes를 받자마자 이 배열을 바꾸는 것은 아닙니다. Target state와 signature를 검증하고 attesting indices를 얻은 뒤 <code>ProcessAttestation</code>에 들어옵니다. 이 함수는 validator의 첫 vote이거나 기존 <code>nextSlot</code>보다 target epoch가 더 새로운 경우에만 <code>nextRoot</code>와 <code>nextSlot</code>을 바꿉니다.
        </p>
        <pre className="not-prose overflow-x-auto border border-border bg-muted/20 p-4 text-[12px] font-normal leading-6"><code>{`// 검증이 끝난 latest message를 다음 반영 대상으로 기록합니다.
if firstVote || targetEpoch > nextEpoch {
  vote.nextRoot = attestedBlockRoot
  vote.nextSlot = attestationSlot
}

// Head 계산이 시작될 때 old/new 직접 balance를 이동합니다.
oldNode.balance -= oldJustifiedBalance
newNode.balance += newJustifiedBalance

// 반영이 끝난 next를 current 기준으로 회전합니다.
vote.currentRoot = vote.nextRoot`}</code></pre>
        <ExplainedFormula
          question="Validator 하나의 latest vote가 A353에서 B353으로 바뀌면 직접 balance는 어떻게 이동합니까?"
          idea="이미 반영된 current root에서 이전 justified balance를 빼고 next root에 새 justified balance를 더합니다. Subtree weight는 뒤 단계에서 자식 합계로 다시 계산합니다."
          formula={String.raw`b_{A}^{\prime}=b_A-q_{old},\qquad b_{B}^{\prime}=b_B+q_{new}`}
          annotatedFormula={String.raw`\underbrace{b_{A}^{\prime}}_{\text{A353 직접 지지}}=\underbrace{b_A}_{\text{기존 직접 지지}}-\underbrace{q_{old}}_{\text{이전 justified balance}},\qquad \underbrace{b_{B}^{\prime}}_{\text{B353 직접 지지}}=\underbrace{b_B}_{\text{기존 직접 지지}}+\underbrace{q_{new}}_{\text{새 justified balance}}`}
          operations={[
            { expression: String.raw`b_A-q_{old}`, annotation: ["currentRoot=A353이면 이전 balance 제거", "underflow는 실제 구현이 방어"] },
            { expression: String.raw`b_B+q_{new}`, annotation: ["nextRoot=B353이면 새 balance 추가", "root가 store에 있을 때만 반영"] },
            { expression: String.raw`current\leftarrow next`, annotation: ["같은 vote를 다음 Head에서 중복 반영하지 않음"] },
          ]}
          terms={[
            { symbol: "b_A,b_B", name: "직접 node balance", description: "각 root를 직접 지지하도록 현재 store에 반영된 값입니다." },
            { symbol: "q_{old},q_{new}", name: "Justified balance", description: "이전·현재 justified state에서 읽은 validator effective balance입니다." },
          ]}
          assumptions={["Attestation의 target state·signature·index 검증이 끝났습니다.", "설명용 A353과 B353 root가 store에서 resolve됩니다.", "Slashed validator는 updateBalances에서 제외됩니다."]}
          interpretation="Prysm은 과거 attestation을 모두 누적하지 않습니다. Validator별 current와 next 한 쌍을 이용해 직접 balance를 옮긴 뒤 subtree weight를 재계산합니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="latest vote 기록" onClick={() => sidebar.open("forkchoice-attestation", codeRefs["forkchoice-attestation"])} />
          <CodeViewButton label="balance 이동" onClick={() => sidebar.open("forkchoice-balance", codeRefs["forkchoice-balance"])} />
          <span className="text-xs text-muted-foreground">기록과 반영은 같은 함수가 아닙니다.</span>
        </div>
      </section>

      <section id="boost" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Boost</h2>
        <p>
          Proposer boost는 proposer의 영구 stake가 아닙니다. Current slot의 block이 attestation due 전에 도착하고, 그 slot에서 처음 boost 대상이 되며, 이전 epoch의 dependent root가 현재 head와 같을 때만 <code>proposerBoostRoot</code>로 기록됩니다.
        </p>
        <ExplainedFormula
          question="설명용 B353에 임시로 더할 proposer score는 얼마입니까?"
          idea="Unslashed active balance를 slots per epoch로 나눈 committee weight에 PROPOSER_SCORE_BOOST 40%를 곱합니다."
          formula={String.raw`P=\left\lfloor\frac{3{,}200}{32}\right\rfloor\times\frac{40}{100}=40`}
          annotatedFormula={String.raw`\underbrace{P}_{\text{B353 임시 score}}=\underbrace{\left\lfloor\frac{3{,}200}{32}\right\rfloor}_{\text{committee weight}=100}\times\underbrace{\frac{40}{100}}_{\text{proposer boost}}=40`}
          operations={[
            { expression: String.raw`3{,}200\div32=100`, annotation: ["설명용 active balance", "mainnet preset의 slots per epoch"] },
            { expression: String.raw`100\times40\div100=40`, annotation: ["고정한 spec의 PROPOSER_SCORE_BOOST=40", "정수 연산"] },
          ]}
          terms={[
            { symbol: "P", name: "Proposer score", description: "현재 slot의 timely block subtree에만 잠시 더하는 가중치입니다." },
            { symbol: "3,200", name: "정규화 balance", description: "산식을 설명하기 위한 같은 단위의 합이며 실제 chain 측정값이 아닙니다." },
          ]}
          assumptions={["B353이 현재 slot의 첫 timely block입니다.", "B353과 기존 head의 dependent root가 같습니다.", "모든 balance 값은 같은 정규화 단위를 사용합니다."]}
          interpretation="Latest vote만 보면 B=80이지만 boost 40을 더한 현재 score는 120입니다. A=96보다 커지므로 이 slot의 head 선택을 바꿀 수 있습니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="timely gate" onClick={() => sidebar.open("forkchoice-boost-gate", codeRefs["forkchoice-boost-gate"])} />
          <CodeViewButton label="score 적용" onClick={() => sidebar.open("forkchoice-boost-score", codeRefs["forkchoice-boost-score"])} />
          <CodeViewButton label="slot reset" onClick={() => sidebar.open("forkchoice-new-slot", codeRefs["forkchoice-new-slot"])} />
        </div>
      </section>

      <section id="weight" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Weight</h2>
        <p>
          Direct balance를 옮기고 boost를 더한 뒤 Prysm은 leaf부터 위로 weight를 다시 계산합니다. 현재 구현은 Gloas를 수용할 empty/full payload node도 함께 갖지만, 이 Fulu 사례에서는 같은 consensus block의 full path가 이어집니다.
        </p>
        <ExplainedFormula
          question="A와 B subtree의 비교 값은 어떻게 만들어집니까?"
          idea="각 node의 직접 balance에 모든 자식의 weight를 더합니다. Boost는 B353의 직접 balance에 들어왔으므로 B ancestor의 subtree weight에도 전파됩니다."
          formula={String.raw`W(n)=b(n)+\sum_{c\in children(n)}W(c)`}
          annotatedFormula={String.raw`\underbrace{W(n)}_{\text{subtree weight}}=\underbrace{b(n)}_{\text{직접 latest vote + 임시 boost}}+\underbrace{\sum_{c\in children(n)}W(c)}_{\text{자식 subtree 합}}`}
          operations={[
            { expression: String.raw`W(A)=96`, annotation: ["A branch의 latest-message 지지 합", "boost 없음"] },
            { expression: String.raw`W(B)=80+40=120`, annotation: ["B branch의 latest-message 지지 80", "B353의 proposer score 40"] },
          ]}
          terms={[
            { symbol: "b(n)", name: "Direct balance", description: "Node 자체를 직접 지지하도록 반영된 latest balance와 적용 중인 임시 score입니다." },
            { symbol: "W(n)", name: "Subtree weight", description: "Node와 모든 descendant가 받는 합계입니다." },
          ]}
          assumptions={["A와 B는 justified·finalized checkpoint와 양립하는 viable branch입니다.", "같은 Head 호출 안에서 vote·boost·weight snapshot을 사용합니다."]}
          interpretation="Fork choice는 block 개수를 세지 않습니다. 최신 validator 지지가 descendant 어디에 있든 그 balance가 ancestor subtree weight로 올라옵니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("forkchoice-weight", codeRefs["forkchoice-weight"])} />
          <CodeViewButton label="best descendant" onClick={() => sidebar.open("forkchoice-best", codeRefs["forkchoice-best"])} />
          <span className="text-xs text-muted-foreground">합산과 viable child 선택을 나눠 확인합니다.</span>
        </div>
      </section>

      <section id="head" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Head</h2>
        <p>
          Spec은 justified root에서 viable child의 weight를 비교하며 아래로 내려가는 LMD-GHOST로 표현합니다. Prysm v7.3.1은 같은 결과를 매번 단순 loop로 새로 찾지 않습니다. Recursive update가 각 node의 <code>bestDescendant</code>를 먼저 채우고, <code>store.head</code>가 justified root의 cached descendant를 읽습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Prysm Head 호출 순서">
          {[
            ["1", "updateBalances", "current·next balance 이동"],
            ["2", "apply boost", "이전 score 제거·현재 score 추가"],
            ["3", "weight + best", "subtree 합산·viable descendant"],
            ["4", "store.head", "J320의 best root 반환"],
          ].map(([step, call, result]) => (
            <div key={step} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{step}</span>
              <strong className="mt-2 block break-keep text-xs">{call}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{result}</p>
            </div>
          ))}
        </div>
        <p>
          Slot 353에서는 B=120이 A=96보다 크므로 <code>head=B353</code>입니다. Weight가 같으면 root byte ordering에서 더 큰 root를 고릅니다. Tie-break는 안전성을 새로 판단하는 규칙이 아니라, 같은 store snapshot을 가진 node들이 같은 결과를 내게 하는 결정 규칙입니다.
        </p>
        <p>
          Slot 354의 <code>NewSlot</code>은 <code>proposerBoostRoot</code>를 비웁니다. 다음 <code>Head</code>는 이전에 더한 40을 먼저 제거하므로 B는 80으로 돌아가고 A=96이 더 무거워집니다. 이때 <code>head=A353</code>으로 바뀌는 것은 retained tree 안의 짧은 reorg입니다. Finalized checkpoint가 이동하거나 branch가 prune됐다는 뜻이 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Head 호출 순서" onClick={() => sidebar.open("forkchoice-head-order", codeRefs["forkchoice-head-order"])} />
          <CodeViewButton label="root 반환" onClick={() => sidebar.open("forkchoice-store-head", codeRefs["forkchoice-store-head"])} />
          <span className="text-xs text-muted-foreground">계산 순서와 최종 반환 경계를 분리했습니다.</span>
        </div>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">위치</th><th className="p-3">동작</th><th className="p-3">확정되지 않는 것</th></tr></thead>
            <tbody>
              {[
                ["Attestation 검증 전", "target·signature·indices 검증 실패면 ProcessAttestation에 넣지 않음", "latest message"],
                ["Vote root 미확인", "resolve할 node가 없으면 해당 direct balance를 더하지 않음", "subtree weight"],
                ["Justified root 미확인", "store.head가 오류 반환", "새 head root"],
                ["Viable tip 없음", "allTipsAreInvalid를 표시하고 오류 반환", "checkpoint-compatible head"],
                ["NewSlot", "boost root reset, epoch 시작이면 checkpoint update와 prune 수행", "이전 head의 finality"],
              ].map(([where, behavior, absent]) => (
                <tr key={where} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{where}</td><td className="p-3">{behavior}</td><td className="p-3 text-muted-foreground">{absent}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          이 글은 한 process 안에서 validated event를 head로 계산하는 개념 경계까지만 다룹니다. DB에 fork-choice snapshot을 어떻게 저장하고 crash 뒤 복구할지, 다른 release로 교체할 때 oracle parity를 어떻게 검증할지는 운영 글의 책임입니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <a
            id="paper-ethereum-forkchoice-spec"
            href="https://github.com/ethereum/consensus-specs/tree/aa16bb4c156184e9548a997d53efaf2a228a6304"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Protocol</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Ethereum consensus-specs v1.7.0-beta.4 · aa16bb4c</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Latest message, proposer score 40%, viable tree, get_head, on_tick·on_block·on_attestation의 protocol 규칙을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Head 선택의 정본이며 Prysm의 current·next 배열과 best-descendant cache 구현은 규정하지 않습니다.</p>
          </a>
          <a
            id="paper-prysm-forkchoice-source"
            href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/forkchoice/doubly-linked-tree"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Implementation</span>
            <strong className="mt-2 block break-keep text-sm leading-6">OffchainLabs Prysm v7.3.1 · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Vote rotation, justified balances, proposer boost, recursive weight, viable best descendant, head와 NewSlot 구현을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 이 release의 snapshot입니다. Gloas payload-content 선택이나 다른 client의 자료구조로 일반화하지 않습니다.</p>
          </a>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li><code>Vote.currentRoot</code>와 <code>nextRoot</code>를 나누는 이유는 무엇입니까? <strong>(답: 이미 direct balance에 반영된 vote와 다음 Head에서 반영할 최신 vote를 구분해 old balance 제거·new balance 추가를 한 번만 수행하기 위해서입니다.)</strong></li>
          <li>B353의 latest vote가 80인데 현재 score가 120이 되는 이유는 무엇입니까? <strong>(답: 설명용 committee weight 100의 40%인 proposer score 40이 timely current-slot block에 임시로 더해졌기 때문입니다.)</strong></li>
          <li>Prysm v7.3.1의 <code>store.head</code>가 자식을 직접 순회하지 않아도 되는 이유는 무엇입니까? <strong>(답: 앞 단계의 recursive update가 viable heaviest leaf를 각 node의 bestDescendant에 캐시하기 때문입니다.)</strong></li>
          <li>Slot 354에서 A353으로 head가 바뀌어도 finality가 아닌 이유는 무엇입니까? <strong>(답: 임시 boost가 사라져 retained candidate tree 안의 현재 선택만 바뀐 것이며 finalized checkpoint 이동과 prune은 별도 상태이기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmForkchoiceMapReturn />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: {
            id: "prysm",
            label: "Prysm v7.3.1 · Go",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </article>
  );
}
