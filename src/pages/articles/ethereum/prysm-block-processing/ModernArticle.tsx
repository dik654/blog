import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmBlockProcessingLocator, { PrysmBlockProcessingMapReturn } from "./PrysmBlockProcessingLocator";
import PrysmBlockProcessingFlowViz from "./viz/PrysmBlockProcessingFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

const operationRows = [
  ["Proposer / attester slashing", "서로 모순되는 signed evidence", "validator slashed 상태·exit epoch"],
  ["Attestations", "committee의 source·target·head vote", "participation flags"],
  ["Legacy deposits / voluntary exits", "기존 deposit queue·validator의 exit 의사", "validator balance·lifecycle"],
  ["BLS-to-execution changes", "withdrawal credential 변경", "validator withdrawal credential"],
  ["Execution requests", "EL에서 들어온 deposit·withdrawal·consolidation", "pending queue와 validator lifecycle"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmBlockProcessingLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Slot 352의 Fulu 블록은 어떻게 검증되어 optimistic 후보가 됩니까?
          </h2>
        </div>
        <PrysmBlockProcessingFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>블록 처리는 signed block 하나를 “유효”라는 boolean 하나로 바꾸는 함수가 아닙니다. Prysm은 <strong>consensus state transition</strong>, <strong>execution payload 판정</strong>, <strong>data availability</strong>를 서로 다른 소유자에게 맡기고 결과를 합칩니다. Execution client가 아직 동기화 중이라도 나머지 경계를 통과한 block은 execution-optimistic 후보가 될 수 있습니다.
        </p>
        <p>
          앞 글에서 slot 351 state는 epoch transition과 <code>SetSlot(352)</code>를 거쳐 block 352 직전 state가 되었습니다. 이 글은 그 state에 Fulu block 352를 적용해 post-state를 만들고 fork-choice에 후보로 넘기는 과정만 소유합니다. 어떤 후보를 head로 고르는지는 <Link to="/cs/blockchain/prysm-forkchoice#overview">fork-choice 글</Link>, Engine API method 자체의 전체 계약은 <Link to="/cs/blockchain/prysm-engine-api#overview">Engine API 글</Link>에서 이어집니다.
        </p>
        <ContentBoundary article="prysm-block-processing" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="설명용 Fulu block 352와 pre-state">
          {[
            ["Pre-state", "state.slot = 352", "latest header는 slot 351"],
            ["Block", "block.slot = 352", "parent root는 header 351을 가리킴"],
            ["Identity", "proposer = 17", "state에서 다시 계산한 proposer와 같다고 가정"],
            ["Execution", "Engine = SYNCING", "payload를 아직 확정하지 못한 응답"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Slot과 proposer 번호는 한 block을 끝까지 따라가기 위한 설명용 식별자입니다. 실제 chain에서 가져온 값이나 성능 측정값이 아닙니다. 또한 <Link to="/cs/blockchain/prysm-slot-processing#overview">slot processing</Link>이 pre-state를 이미 352까지 옮겼다고 가정합니다. Block 처리 안에서 시간을 다시 351에서 352로 전진시키지 않습니다.
        </p>
      </section>

      <section id="parallel-validation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">병렬 검증</h2>
        <p>
          Prysm v7.3.1의 <code>validateExecutionAndConsensus</code>는 Fulu처럼 Gloas 이전인 block에 대해 두 goroutine을 만듭니다. 하나는 parent가 finalized chain의 후손인지 확인하고 전체 consensus transition을 실행합니다.
        </p>
        <p>
          다른 하나는 pre-state의 execution header와 같은 block body를 이용해 EL에 <code>engine_newPayloadV4</code>를 보냅니다. 두 경로는 독립적으로 진행되지만 <code>errgroup.Wait()</code> 뒤에야 post-state와 payload 상태를 반환합니다.
        </p>
        <pre className="not-prose overflow-x-auto border border-border bg-muted/20 p-4 text-[12px] font-normal leading-6"><code>{`// Consensus 경로를 시작합니다.
go validateStateTransition(preState, block)

// 같은 block의 execution payload를 EL에 알립니다.
go validateExecutionOnBlock(preStateHeader, block)

// 두 경로가 모두 끝나야 다음 단계로 갑니다.
waitForBoth()

// Consensus post-state와 EL 판정 상태를 함께 반환합니다.
return postState, isValidPayload`}</code></pre>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("parallel-validation", codeRefs["parallel-validation"])} />
          <span className="text-xs text-muted-foreground">Prysm v7.3.1의 실제 errgroup 경계</span>
        </div>
        <p>
          여기서 병렬화되는 것은 <em>판정 경로</em>입니다. Consensus handler 내부의 mutation 순서를 병렬로 바꾼다는 뜻이 아닙니다. 두 경로가 같은 block identity를 보더라도 consensus state와 execution database라는 서로 다른 상태를 소유합니다.
        </p>
      </section>

      <section id="consensus-transition" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Consensus Transition</h2>
        <p>
          Consensus 경로는 state와 block의 fork version이 같은지 먼저 확인합니다. Fulu block의 handler 순서는 <strong>header → withdrawals·payload 문맥 → RANDAO → Eth1 data → operations → sync aggregate</strong>입니다. 앞 단계가 바꾼 working state를 뒤 단계가 읽으므로 이 순서를 임의로 재배치하면 post-state root가 달라질 수 있습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Consensus handler가 읽고 바꾸는 상태">
          {[
            ["Header", "slot·proposer·parent·body root", "latest_block_header"],
            ["Execution context", "withdrawals·parent hash·timestamp·prevRandao", "balance·payload header"],
            ["Consensus body", "RANDAO·Eth1·operations·sync aggregate", "mix·votes·validator state"],
          ].map(([stage, reads, writes]) => (
            <div key={stage} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{stage}</span>
              <p className="mt-2 break-keep text-xs"><strong>읽음</strong> · {reads}</p>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground"><strong>바꿈</strong> · {writes}</p>
            </div>
          ))}
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("ordered-handlers", codeRefs["ordered-handlers"])} />
          <span className="text-xs text-muted-foreground">Fulu가 사용하는 pre-Gloas ProcessBlockForStateRoot 순서</span>
        </div>
        <p>
          <code>ProcessPayload</code>가 하는 일과 EL의 <code>newPayload</code> 판정도 구분해야 합니다. 전자는 CL state에서 parent hash·timestamp·prevRandao·blob commitment 수를 확인하고 latest execution payload header를 갱신합니다. Transaction과 EVM 실행의 유효성은 병렬 Engine 경로가 판정합니다. Local payload check가 성공했다고 EL이 VALID인 것은 아닙니다.
        </p>
      </section>

      <section id="operations" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Operations</h2>
        <p>
          Fulu state는 Prysm의 Electra operation 경로를 재사용합니다. Operation은 같은 타입의 command 묶음이 아니라 서로 다른 권한과 검증 조건을 가진 state transition입니다. Fork별 list length를 먼저 확인한 뒤 각 family를 규격 순서대로 적용합니다.
        </p>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">Family</th><th className="p-3">입력이 주장하는 것</th><th className="p-3">바꾸는 state</th></tr></thead>
            <tbody>{operationRows.map(([family, claim, writes]) => <tr key={family} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{family}</td><td className="p-3">{claim}</td><td className="p-3 text-muted-foreground">{writes}</td></tr>)}</tbody>
          </table>
        </div>
        <p>
          예를 들어 validator 7의 slashing과 voluntary exit가 같은 block에 있다면 slashing handler가 먼저 validator 상태와 exit 정보를 바꿉니다. 뒤 exit handler는 바뀐 state를 읽습니다.
        </p>
        <p>
          Signature 계산을 묶어서 최적화할 수는 있지만 mutation commit 순서를 바꿀 수는 없습니다. Execution requests도 deposit, withdrawal, consolidation 순서를 유지합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("electra-operations", codeRefs["electra-operations"])} />
          <span className="text-xs text-muted-foreground">Fulu가 재사용하는 Electra operation 구현</span>
        </div>
      </section>

      <section id="proof" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Proof</h2>
        <p>
          Handler가 끝났다는 사실만으로 block을 받아들이지 않습니다. Prysm은 full post-state의 SSZ hash-tree-root를 다시 계산해 proposer가 block에 넣은 <code>state_root</code>와 비교합니다. 그다음 proposer·RANDAO·attestation·BLS-to-execution-change signature를 모은 batch를 검증합니다.
        </p>
        <ExplainedFormula
          question="두 정상 client가 같은 block transition을 실행했다는 핵심 비교는 무엇입니까?"
          idea="같은 pre-state와 fork 규칙에 같은 block을 적용한 post-state 전체를 SSZ Merkle root로 줄이고, block이 약속한 32-byte root와 비교합니다."
          formula={String.raw`\operatorname{HTR}(T_{Fulu}(S_{352},B_{352}))=B_{352}.\mathrm{state\_root}`}
          annotatedFormula={String.raw`\underbrace{\operatorname{HTR}(T_{Fulu}(S_{352},B_{352}))}_{\text{계산한 post-state root}}=\underbrace{B_{352}.\mathrm{state\_root}}_{\text{block의 commitment}}`}
          operations={[
            { expression: String.raw`T_{Fulu}(S_{352},B_{352})`, annotation: ["slot 352 pre-state에", "Fulu handler 순서로 block을 적용", "candidate post-state를 만듭니다"] },
            { expression: String.raw`\operatorname{HTR}(\cdot)`, annotation: ["post-state 전체를 SSZ Merkle화", "32-byte root를 계산"] },
            { expression: String.raw`=B_{352}.\mathrm{state\_root}`, annotation: ["한 bit라도 다르면 block invalid", "같아도 signature·DA·EL 판정은 별도"] },
          ]}
          terms={[
            { symbol: "S_{352}", name: "Pre-state", description: "Slot processing을 마친 Fulu BeaconState입니다." },
            { symbol: "B_{352}", name: "Signed block message", description: "Slot·parent·proposer·body와 state-root commitment를 가진 block입니다." },
            { symbol: "T_{Fulu}", name: "Fork-specific transition", description: "Prysm이 구현한 Fulu consensus handler 순서입니다." },
            { symbol: "HTR", name: "Hash-tree-root", description: "SSZ 값 전체의 32-byte Merkle root입니다." },
          ]}
          assumptions={["같은 consensus-spec release, fork preset과 integer semantics를 사용합니다.", "이 등식은 consensus post-state의 결정성을 확인하며 execution payload VALID나 head 선택을 대신하지 않습니다."]}
          interpretation="Root가 같아야 consensus transition을 통과합니다. 이후 signature batch와 blob/data-column availability까지 통과해야 fork-choice 후보로 넘길 수 있습니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("transition-root", codeRefs["transition-root"])} />
          <span className="text-xs text-muted-foreground">Prysm의 slot 전진, block 적용, full root 비교</span>
        </div>
        <p>
          Deneb 이후 block은 blob commitment와 sidecar의 data availability도 별도 경계를 통과해야 합니다. Root parity는 “block body가 이 post-state를 만들었다”는 약속을 확인하지만, 필요한 blob data를 실제로 확보했다는 사실까지 증명하지 않습니다.
        </p>
      </section>

      <section id="engine-status" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Engine Status</h2>
        <p>
          Fulu의 execution payload는 Deneb payload 형식에 Electra execution requests를 함께 보내므로 Prysm v7.3.1은 <code>engine_newPayloadV4</code>를 선택합니다. 입력에는 payload, versioned hashes, parent beacon block root, flattened execution requests가 들어갑니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Engine API status에 따른 block 처리">
          {[
            ["VALID", "Execution 판정 완료", "fork-choice node의 optimistic 표시 해제"],
            ["SYNCING / ACCEPTED", "아직 판정하지 못함", "후보를 optimistic 상태로 유지"],
            ["INVALID", "Execution 규칙 위반", "latestValidHash 기준으로 block·후손 제거"],
          ].map(([status, meaning, action]) => (
            <div key={status} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{status}</span>
              <strong className="mt-2 block break-keep text-xs">{meaning}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{action}</p>
            </div>
          ))}
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("engine-method-status", codeRefs["engine-method-status"])} />
          <CodeViewButton onClick={() => sidebar.open("engine-status", codeRefs["engine-status"])} />
          <span className="text-xs text-muted-foreground">Method 선택과 optimistic/invalid 분기</span>
        </div>
        <p>
          이 사례의 응답은 SYNCING입니다. 따라서 consensus transition으로 post-state를 만들 수 있어도 execution validity는 아직 확정되지 않았습니다. Prysm은 <code>isValidPayload=false</code>를 반환하고, 뒤 단계가 이 후보를 optimistic으로 표시할 수 있게 합니다. SYNCING을 VALID처럼 기록하거나 네트워크 오류를 SYNCING으로 바꾸면 실패 의미가 사라집니다.
        </p>
      </section>

      <section id="admission" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">후보 등록</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="검증 결과가 fork-choice 후보 상태로 이어지는 과정">
          {[
            ["Consensus", "통과", "post-state와 signature가 일치"],
            ["Execution", "SYNCING", "optimistic 표시 필요"],
            ["Availability", "통과", "필요한 sidecar를 확보"],
            ["Fork choice", "InsertNode", "후보 등록 · 아직 head 아님"],
          ].map(([owner, result, detail]) => (
            <div key={owner} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{owner}</span>
              <strong className="mt-2 block break-keep text-xs">{result}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          세 경계를 통과하면 post-state를 저장하고 fork-choice store에 node를 넣습니다. Engine이 이미 VALID였다면 <code>SetOptimisticToValid</code>로 표시를 해제합니다. SYNCING이면 optimistic 상태를 유지한 채 vote weight와 ancestry 판단의 후보가 됩니다. 이것은 해당 block이 곧바로 head가 되거나 finalized됐다는 뜻이 아닙니다.
        </p>
        <p>
          나중에 EL이 INVALID를 반환하면 Prysm은 <code>latestValidHash</code>를 기준으로 invalid suffix를 찾고 block과 영향을 받은 후손의 state·fork-choice entry를 제거합니다.
        </p>
        <p>
          반대로 consensus root나 signature, data availability가 실패하면 처음부터 후보 등록 단계로 가지 않습니다. Working state의 중간 mutation을 완성된 post-state로 저장하지 않는 것이 호출 경계의 책임입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("candidate-admission", codeRefs["candidate-admission"])} />
          <span className="text-xs text-muted-foreground">InsertNode, optimistic 해제, head 재계산과 INVALID 후손 제거</span>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <CitationBlock citeKey={1} source="Ethereum consensus-specs v1.7.0-beta.4 @ aa16bb4c" href="https://github.com/ethereum/consensus-specs/tree/aa16bb4c156184e9548a997d53efaf2a228a6304/specs">
          <p><Label>O</Label>Fork별 block transition, operation 순서, SSZ state-root commitment와 execution payload 문맥을 확인했습니다.</p>
          <p><strong>범위:</strong> Protocol state transition의 정본입니다. Prysm의 goroutine 배치·cache·저장 순서는 규정하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={2} type="code" source="OffchainLabs Prysm v7.3.1 @ 96d418cd" href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain">
          <p><Label>O</Label><code>ReceiveBlock</code>, consensus/Engine 병렬 경계, ordered handlers, signature batch, optimistic insertion과 invalid pruning 구현을 확인했습니다.</p>
          <p><strong>범위:</strong> 이 release의 구현 snapshot입니다. Moving main이나 다른 client의 package 구조로 일반화하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={3} source="Ethereum Execution APIs v1.0.0-beta.7 @ 5aebdfdd" href="https://github.com/ethereum/execution-apis/tree/5aebdfdd45cadeb723be4bd45b4611b71c8b1c85/src/engine">
          <p><Label>O</Label><code>engine_newPayloadV4</code> 입력과 VALID·SYNCING·ACCEPTED·INVALID status 계약을 확인했습니다.</p>
          <p><strong>범위:</strong> CL↔EL wire contract입니다. Consensus state root, data availability나 fork-choice head 선택은 규정하지 않습니다.</p>
        </CitationBlock>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>Consensus transition과 Engine API를 동시에 실행해도 operation mutation 순서를 바꿀 수 없는 이유는 무엇입니까? <strong>(답: 두 goroutine은 서로 다른 판정 소유자를 병렬화한 것이고, consensus 내부의 뒤 handler는 앞 handler가 바꾼 state를 읽기 때문입니다.)</strong></li>
          <li>CL의 local payload check가 통과해도 EL의 VALID가 필요한 이유는 무엇입니까? <strong>(답: CL은 parent·timestamp·prevRandao 같은 consensus 문맥을 확인하고, transaction·EVM 실행의 유효성은 EL이 소유하기 때문입니다.)</strong></li>
          <li>Post-state root가 같아도 아직 확인할 경계는 무엇입니까? <strong>(답: Proposer·RANDAO·attestation 등의 BLS signature, data availability, execution payload status가 별도이기 때문입니다.)</strong></li>
          <li>SYNCING block을 optimistic 후보로 등록하는 것과 head로 확정하는 것은 왜 다릅니까? <strong>(답: 등록은 fork-choice가 비교할 후보를 추가할 뿐이며, weight·ancestry·후속 Engine 판정과 finality가 별도로 남기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmBlockProcessingMapReturn />

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
