import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmEpochProcessingLocator, { PrysmEpochProcessingMapReturn } from "./PrysmEpochProcessingLocator";
import PrysmEpochProcessingFlowViz from "./viz/PrysmEpochProcessingFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmEpochProcessingLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Slot 351의 누적 상태는 어떻게 다음 Epoch 상태가 됩니까?
          </h2>
        </div>
        <PrysmEpochProcessingFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>Epoch processing은 32개 slot을 한 번에 다시 실행하는 작업이 아닙니다. 이미 <code>BeaconState</code>에 쌓인 participation·checkpoint·balance·validator queue를 <strong>정해진 순서로 한 번 접어 다음 epoch의 시작 state를 만드는 전이</strong>입니다. Prysm은 state version으로 fork별 <code>ProcessEpoch</code>를 고르고, 그 함수가 같은 working state를 순서대로 바꿉니다.
        </p>
        <p>
          이 글은 Fulu state가 slot 351에서 경계를 만나는 한 사례를 추적합니다. Mainnet preset에서 다음 slot 352는 epoch 11의 시작입니다. <Link to="/cs/blockchain/prysm-slot-processing#boundary">slot processing 글</Link>에서 확인했듯이 epoch transition은 <code>SetSlot(352)</code>보다 먼저 실행됩니다. 이 글은 그 사이에 무엇이 바뀌는지를 소유합니다.
        </p>
        <p>
          Checkpoint가 head와 다른 이유와 Casper FFG의 안전성 증명은 <Link to="/cs/blockchain/prysm-finality#overview">finality 글</Link>에서 더 깊게 다룹니다. 여기서는 그 개념이 실제 epoch pipeline의 어느 입력을 읽고 어느 state field를 바꾸는지만 확인합니다.
        </p>
        <ContentBoundary article="prysm-epoch-processing" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Slot 351에서 처리할 설명용 epoch state">
          {[
            ["Clock", "state.slot = 351", "next slot 352 · epoch 11 시작"],
            ["Participation", "active 96 · target 64", "32씩 가진 V0·V1이 timely target 참여"],
            ["Queue", "pending 40 · 32", "이번 epoch churn budget 64"],
            ["Fork", "state.version = Fulu", "Prysm v7.3.1의 Fulu pipeline 선택"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          96·64·40·32는 상태 변화의 조건과 순서를 세기 위한 설명용 stake 단위입니다. 실제 mainnet state에서 가져온 balance나 성능 측정값이 아닙니다. 다만 비교식과 queue 조건은 같은 단위를 사용하므로 정수 연산의 경계는 그대로 볼 수 있습니다.
        </p>
      </section>

      <section id="dispatch-order" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Fork와 순서</h2>
        <p>
          공통 <code>ProcessEpoch</code> wrapper는 현재 state의 version을 읽고 Gloas·Fulu·Electra·Altair·Phase 0 중 한 경로만 실행합니다. “Prysm의 epoch processing은 항상 7단계”처럼 fork를 지운 설명은 실제 코드를 설명하지 못합니다. Fulu는 Electra pipeline을 먼저 실행한 뒤 proposer lookahead를 추가합니다.
        </p>
        <pre className="not-prose overflow-x-auto border border-border bg-muted/20 p-4 text-[12px] font-normal leading-6"><code>{`// 현재 state가 epoch 경계인지 확인합니다.
if CanProcessEpoch(state) {
  // State version에 맞는 fork별 pipeline 하나를 선택합니다.
  if state.version >= Gloas { processEpochGloas(state) }
  else if state.version >= Fulu { fulu.ProcessEpoch(state) }
  else if state.version >= Electra { electra.ProcessEpoch(state) }
  else if state.version >= Altair { altair.ProcessEpoch(state) }
  else { ProcessEpochPrecompute(state) }
}`}</code></pre>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("process-epoch-dispatch", codeRefs["process-epoch-dispatch"])} />
          <CodeViewButton onClick={() => sidebar.open("process-epoch-fulu", codeRefs["process-epoch-fulu"])} />
          <span className="text-xs text-muted-foreground">Prysm v7.3.1의 실제 fork dispatch와 Fulu→Electra 호출</span>
        </div>
        <p>
          순서는 단순한 목록이 아닙니다. Finality와 보상·패널티 계산은 transition 전 participation을 읽어야 하므로 participation rotation보다 앞섭니다. Reward·deposit으로 실제 balance를 바꾼 뒤 effective balance를 갱신해야 다음 epoch가 새 값을 사용합니다. Fulu proposer lookahead도 Electra의 reset·rotation이 끝난 state에서 계산합니다.
        </p>
      </section>

      <section id="finality" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Finality</h2>
        <p>
          Prysm은 validator마다 participation을 다시 훑는 대신, 이번 호출에서 active balance와 flag별 participating balance를 먼저 집계합니다. 이 precompute는 다른 요청이 공유하는 cache가 아니라 <strong>한 epoch transition 안에서 같은 집계값을 다시 계산하지 않기 위한 지역 자료</strong>입니다.
        </p>
        <ExplainedFormula
          question="Target 참여가 checkpoint를 justify할 만큼 충분한지 어떻게 판정합니까?"
          idea="부동소수점 비율 대신 target 참여 balance의 세 배와 전체 active balance의 두 배를 정수로 비교합니다."
          formula={String.raw`3A_{target}\ge2A_{active}`}
          annotatedFormula={String.raw`\underbrace{3A_{target}}_{\text{target 참여 weight의 3배}}\ge\underbrace{2A_{active}}_{\text{전체 active weight의 2배}}`}
          operations={[
            { expression: String.raw`3\times64=192`, annotation: ["V0·V1의 timely-target 참여 합 64", "3배를 계산"] },
            { expression: String.raw`2\times96=192`, annotation: ["V0·V1·V2의 active 합 96", "2배와 같으므로 2/3 조건 통과"] },
          ]}
          terms={[
            { symbol: "A_{target}", name: "Target-attesting balance", description: "같은 epoch target에 timely하게 참여한 unslashed validator의 effective balance 합입니다." },
            { symbol: "A_{active}", name: "Total active balance", description: "같은 state snapshot에서 활성인 validator의 effective balance 총합입니다." },
          ]}
          assumptions={["두 값은 같은 fork·epoch·state에서 집계합니다.", "Signature·committee·target root·timeliness 검증을 통과한 participation만 셉니다."]}
          interpretation="64/96은 정확히 2/3이므로 조건을 통과합니다. 하지만 이 결과는 새 justification bit와 checkpoint 후보를 만들 뿐입니다. Finalization은 이전 justification bits와 checkpoint epoch 간격까지 함께 맞아야 합니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("process-justification", codeRefs["process-justification"])} />
          <span className="text-xs text-muted-foreground">Target balance 비교, bit shift, checkpoint pattern의 실제 구현</span>
        </div>
        <p>
          Prysm은 기존 4-bit history를 한 칸 이동하고 이전·현재 epoch가 threshold를 넘었는지 bit 1·0에 기록합니다. 그다음 <code>0011</code>, <code>0110</code>, <code>0111</code>, <code>1110</code>에 해당하는 mask와 old checkpoint의 epoch 거리를 함께 검사합니다. 따라서 “이번 epoch가 2/3이면 바로 finalized”라는 설명은 틀립니다.
        </p>
      </section>

      <section id="accounting" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">보상·패널티</h2>
        <p>
          Finality에서 사용한 participation 집계를 보상·패널티 계산에도 재사용합니다. Validator마다 source·target·head flag를 따로 보고, 실제 balance에 reward를 더한 뒤 penalty를 뺍니다. Head flag를 놓쳤을 때는 source·target처럼 대칭 penalty를 부과하지 않습니다.
        </p>
        <ExplainedFormula
          question="한 participation flag의 reward는 무엇을 곱해 만듭니까?"
          idea="개인 base reward에 flag weight와 그 flag에 참여한 전체 balance 비율을 곱하되, 실제 구현은 Gwei increment와 정수 나눗셈 순서를 지킵니다."
          formula={String.raw`r_{i,f}=b_i\times\frac{w_f}{W}\times\frac{A_f}{A}`}
          annotatedFormula={String.raw`\underbrace{r_{i,f}}_{\text{validator i의 flag reward}}=\underbrace{b_i}_{\text{개인 base reward}}\times\underbrace{\frac{w_f}{W}}_{\text{flag 비중}}\times\underbrace{\frac{A_f}{A}}_{\text{참여 balance 비율}}`}
          operations={[
            { expression: String.raw`100\times\frac{14}{64}`, annotation: ["설명용 base reward 100", "source flag weight 14 / denominator 64"] },
            { expression: String.raw`\times\frac{64}{96}=14.58\ldots`, annotation: ["target 사례와 같은 참여 비율 64/96", "실제 integer order에서는 소수점 아래를 버려 14"] },
          ]}
          terms={[
            { symbol: "b_i", name: "Base reward", description: "Validator i의 effective balance와 전체 active balance 제곱근으로 만든 기준값입니다." },
            { symbol: "w_f/W", name: "Flag weight share", description: "Source·target·head마다 정해진 weight를 전체 denominator로 나눈 비율입니다." },
            { symbol: "A_f/A", name: "Participation share", description: "해당 flag에 참여한 balance를 전체 active balance로 나눈 비율입니다." },
          ]}
          assumptions={["100은 식의 곱셈 순서를 보기 위한 설명용 base reward입니다.", "실제 Prysm은 uint64와 EFFECTIVE_BALANCE_INCREMENT를 사용하므로 실수 계산과 반올림하면 안 됩니다.", "Inactivity leak에서는 일반 reward와 추가 penalty 조건이 달라집니다."]}
          interpretation="실수식은 14.58…을 보여 주지만 실제 코드는 정수 나눗셈 결과 14를 적용합니다. 이 한 flag의 toy result를 APR이나 validator 전체 보상으로 확대하면 안 됩니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("process-rewards", codeRefs["process-rewards"])} />
          <span className="text-xs text-muted-foreground">Prysm의 validator별 delta와 integer 계산 순서</span>
        </div>
        <p>
          Finality가 오래 지연되면 inactivity score가 별도로 작동합니다. Timely target에 참여한 validator의 score는 회복되고, 참여하지 않았거나 slashed된 validator는 추가 penalty를 받습니다. 이는 한 번 결석한 validator를 즉시 퇴출하는 timer가 아니라, 참여하지 않는 weight의 비중을 줄여 남은 정상 참여가 다시 threshold를 만들 수 있게 하는 feedback입니다.
        </p>
      </section>

      <section id="membership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Validator Queue</h2>
        <p>
          보상·패널티를 반영한 뒤에는 validator lifecycle을 바꿉니다. Registry update는 activation eligibility·activation epoch·low-balance ejection을 처리합니다. Slashing은 이미 기록된 slashed validator가 정해진 epoch에 도달했을 때 correlation penalty를 적용합니다. Evidence가 block에 포함된 순간과 이 epoch penalty가 적용되는 순간은 같지 않습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr]" aria-label="Pending deposit 40과 32가 churn budget 64를 사용하는 과정">
          <div className="min-w-0 bg-background p-4"><span className="font-mono text-[9px] font-black text-primary">BUDGET</span><strong className="mt-1 block text-sm">64</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">finalized position과 count limit을 통과했다고 가정</p></div>
          <div className="flex items-center justify-center bg-background px-2 text-muted-foreground" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4"><span className="font-mono text-[9px] font-black text-primary">DEPOSIT 40</span><strong className="mt-1 block text-sm">적용 · 24 남음</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">40 ≤ 64이므로 balance에 반영</p></div>
          <div className="flex items-center justify-center bg-background px-2 text-muted-foreground" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4"><span className="font-mono text-[9px] font-black text-primary">DEPOSIT 32</span><strong className="mt-1 block text-sm">다음 epoch</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">32 &gt; 24이므로 여기서 멈추고 queue에 유지</p></div>
        </div>
        <p>
          Fulu의 pending-deposit 처리에서는 queue position이 finalized인지 먼저 확인하고, epoch당 처리 개수와 churn budget을 적용합니다. 위 사례는 첫 40을 처리한 뒤 <code>processedAmount + 32 &gt; availableForProcessing</code>이 되므로 더 진행하지 않습니다. “Block에 deposit request가 들어갔다”와 “validator balance에 적용됐다”를 같은 완료 상태로 보면 안 됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("process-pending-deposits", codeRefs["process-pending-deposits"])} />
          <span className="text-xs text-muted-foreground">Finalized position, count limit, churn budget의 실제 loop</span>
        </div>
      </section>

      <section id="rotation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">다음 Epoch 준비</h2>
        <p>
          Balance와 queue를 처리한 뒤 effective balance를 갱신하고 slashings·RANDAO·historical summary ring을 전진시킵니다. 그다음 <code>current_epoch_participation</code>을 <code>previous_epoch_participation</code>으로 옮기고, 새 current vector를 validator 수만큼 0으로 만듭니다. 이 rotation을 보상·패널티 계산보다 먼저 실행하면 방금 정산해야 할 participation evidence를 잃습니다.
        </p>
        <p>
          Sync committee는 period 경계에서만 교체됩니다. Fulu는 마지막에 proposer lookahead에서 가장 오래된 epoch의 32개 proposer를 밀어내고, <code>current epoch + MIN_SEED_LOOKAHEAD + 1</code>에 해당하는 proposer indices를 끝에 채웁니다. 모든 epoch field가 매번 같은 방식으로 바뀌는 것은 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("process-participation-rotation", codeRefs["process-participation-rotation"])} />
          <CodeViewButton onClick={() => sidebar.open("process-proposer-lookahead", codeRefs["process-proposer-lookahead"])} />
          <span className="text-xs text-muted-foreground">Participation rotation과 Fulu proposer lookahead</span>
        </div>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["Precompute", "validator·balance 길이 불일치", "오류를 반환하고 완료 state로 취급하지 않음"],
            ["Finality", "root·bit 계산 실패", "checkpoint 이후 단계로 가지 않음"],
            ["Queue", "signature·state update 실패", "남은 pipeline을 실행하지 않음"],
            ["Mutation", "앞 단계가 이미 state를 바꿈", "함수가 자동 rollback하지 않음"],
          ].map(([guard, state, result]) => (
            <div key={guard} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{guard}</span>
              <strong className="mt-1 block break-keep text-xs">{state}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{result}</p>
            </div>
          ))}
        </div>
        <p>
          Prysm의 fork별 함수는 같은 <code>state.BeaconState</code>를 직접 바꾸며, 중간 단계가 실패했을 때 앞선 mutation을 되돌리는 transaction을 제공하지 않습니다. 안전 경계는 “오류가 나면 완성된 post-state를 반환하지 않는다”는 데 있습니다. 호출자는 실패한 working state를 slot 352에 도달한 정본처럼 저장하거나 publish하면 안 됩니다.
        </p>
        <p>
          어느 fork를 운영망에 활성화할지, state-transition test vector를 어떤 release gate로 돌릴지, epoch 처리 지연을 어떻게 측정할지는 실무 글의 판단입니다. 이 개념 글은 같은 pre-state에서 모든 정상 client가 같은 post-state를 만들어야 한다는 protocol 경계까지만 확정합니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <CitationBlock citeKey={1} source="Ethereum consensus-specs v1.7.0-beta.4 @ aa16bb4c" href="https://github.com/ethereum/consensus-specs/tree/aa16bb4c156184e9548a997d53efaf2a228a6304/specs/fulu">
          <p><Label>O</Label>Fulu <code>process_epoch</code>의 ordered calls, pending-deposit queue, proposer lookahead를 확인했습니다.</p>
          <p><strong>범위:</strong> Protocol state transition의 정본입니다. Prysm의 precompute 구조와 실행 성능은 규정하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={2} type="code" source="OffchainLabs Prysm v7.3.1 @ 96d418cd" href="https://github.com/OffchainLabs/prysm/blob/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/core/transition/transition.go">
          <p><Label>O</Label>State version에 따른 fork dispatch와 error return 경계를 확인했습니다.</p>
          <p><strong>범위:</strong> 이 release의 구현 snapshot입니다. 다른 release의 함수 배치나 운영 지연을 증명하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={3} type="code" source="Prysm v7.3.1 Electra·Fulu epoch source @ 96d418cd" href="https://github.com/OffchainLabs/prysm/blob/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/core/electra/transition.go">
          <p><Label>O</Label>Participation precompute, finality, inactivity, 보상·패널티, registry·slashing, pending queue, effective balance, rotation 순서를 확인했습니다.</p>
          <p><strong>범위:</strong> Fulu가 재사용하는 Electra pipeline과 Fulu lookahead 추가까지입니다. Gloas의 builder payment·PTC window를 현재 경로에 섞지 않았습니다.</p>
        </CitationBlock>
        <p><Label>A</Label>Slot 351, balance 96·64, pending 40·32는 위 순서를 한 번에 따라가기 위한 설명용 입력입니다. 실제 chain state나 benchmark 결과가 아닙니다.</p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>Fulu <code>ProcessEpoch</code>가 Electra pipeline을 먼저 실행하는 이유는 무엇입니까? <strong>(답: Fulu가 Electra의 기존 ordered transition을 재사용하고 proposer lookahead만 마지막에 추가하기 때문입니다.)</strong></li>
          <li>Target 참여 64, active 96이 finalization을 즉시 보장하지 않는 이유는 무엇입니까? <strong>(답: 2/3 비교는 justification bit를 만들며, finalization에는 이전 bit pattern과 checkpoint epoch 간격도 필요하기 때문입니다.)</strong></li>
          <li>Pending deposit 40 뒤에 32가 남는 이유는 무엇입니까? <strong>(답: Churn budget 64에서 40을 쓰고 남은 24보다 32가 크므로 loop가 멈추고 queue에 유지되기 때문입니다.)</strong></li>
          <li>Participation rotation이 rewards보다 뒤에 있어야 하는 이유는 무엇입니까? <strong>(답: Rewards는 방금 끝난 epoch의 current participation을 읽어야 하며, 먼저 0으로 초기화하면 보상·패널티의 근거를 잃기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmEpochProcessingMapReturn />

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
