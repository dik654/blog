import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmFinalityLocator, { PrysmFinalityMapReturn } from "./PrysmFinalityLocator";
import PrysmFinalityFlowViz from "./viz/PrysmFinalityFlowViz";

const fixture = [
  ["Current epoch", "11", "이번 transition이 처리하는 epoch"],
  ["Old current justified", "epoch 10", "판정 전에 보존하는 checkpoint"],
  ["Old bits", "0001", "오른쪽 끝이 bit 0"],
  ["Current target", "64 / 96", "unique unslashed effective balance"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmFinalityLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            전체 active balance 96 중 64가 epoch 11 경계를 지지했을 때 Prysm은 왜 epoch 11이 아니라 epoch 10 checkpoint를 finalized로 기록합니까?
          </h2>
        </div>
        <p>
          설명용 상태에서 epoch 10 경계 block은 이미 justified됐고, 최근 justification history는 <code>0001</code>입니다. 이제 유효한 epoch 11 target vote의 effective balance 합이 64가 됐다고 둡니다. 오른쪽 끝을 bit 0으로 읽습니다.
        </p>
        <PrysmFinalityFlowViz />
        <p className="text-lg leading-8">
          64/96은 epoch 11을 <strong>새 justified checkpoint</strong>로 만듭니다. Finalization은 그 값 하나를 다시 쓰지 않습니다. 한 칸 옮긴 four-bit history가 <code>0011</code>인지, 갱신 전 current justified checkpoint가 정확히 한 epoch 전인지 함께 확인한 뒤 epoch 10을 finalized로 올립니다.
        </p>
        <p>
          직전 <Link to="/cs/blockchain/prysm-forkchoice#overview">가지 선택 글</Link>은 현재 따라갈 head 하나를 고릅니다. 이 글은 epoch-level participation을 되돌리기 어려운 checkpoint로 바꾸는 경로를 맡습니다. Finality는 block body를 영구 보관했다는 뜻도, 애플리케이션 처리가 성공했다는 뜻도 아닙니다.
        </p>
        <ContentBoundary article="prysm-finality" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="설명용 finality 입력">
          {fixture.map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Epoch 번호와 balance는 계산을 눈으로 확인하기 위한 값이며 mainnet에서 측정한 상태가 아닙니다. Attestation의 signature, source checkpoint, target epoch와 target root 검증은 이미 끝났다고 가정합니다. Prysm precompute는 validator별 target participation flag를 만들고, slashed validator를 빼고 한 번씩 effective balance를 합산합니다.
        </p>
      </section>

      <section id="checkpoint-management" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Checkpoint</h2>
        <p>
          Checkpoint는 <code>(epoch, root)</code> 쌍입니다. 같은 epoch라도 root가 다르면 다른 checkpoint입니다. Attestation에는 현재 보이는 head root와 별도로 FFG <code>source</code>와 <code>target</code> checkpoint가 들어갑니다. 이 사례의 유효한 vote는 이미 justified된 epoch 10 source에서 state가 알고 있는 epoch 11 target root로 향합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Finality 상태 소유권">
          {[
            ["AttestationData", "source · target", "Validator가 서명한 FFG 문맥"],
            ["Precompute Balance", "64 / 96", "중복을 제거한 target·active 합"],
            ["BeaconState", "bits · J · F", "Justified와 finalized의 정본"],
          ].map(([owner, state, role]) => (
            <div key={owner} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{owner}</span>
              <strong className="mt-2 block break-keep text-xs">{state}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>
        <p>
          Aggregated attestation object 수를 더하면 같은 validator를 여러 번 셀 수 있습니다. Prysm은 validator index별 flag를 합치고 각 validator의 effective balance를 한 번만 더합니다. 그래서 이 경계의 단위는 “64명”이 아니라 “유효한 validator들이 가진 effective balance 64”입니다.
        </p>

        <h3 className="break-keep text-xl font-bold">Balance</h3>
        <ExplainedFormula
          question="Current target participation은 언제 2/3 경계를 통과합니까?"
          idea="부동소수점 비율을 만들지 않고 양쪽을 정수로 곱합니다. 같은 balance snapshot을 읽는 client는 rounding 차이 없이 같은 결과를 냅니다."
          formula={String.raw`3W_{target}\;\ge\;2W_{active}`}
          annotatedFormula={String.raw`\underbrace{3W_{target}}_{\text{target 참여 잔액 × 3}}\;\ge\;\underbrace{2W_{active}}_{\text{전체 활성 잔액 × 2}}`}
          operations={[
            { expression: String.raw`3\times64=192`, annotation: ["epoch 11 target을 맞힌", "unique unslashed effective balance"] },
            { expression: String.raw`2\times96=192`, annotation: ["current epoch의 total active balance", "192≥192이므로 정확히 통과"] },
            { expression: String.raw`3\times63=189<192`, annotation: ["한 단위 적으면 실패", "새 bit를 켜지 않음"] },
          ]}
          terms={[
            { symbol: "W_{target}", name: "Target 참여 잔액", description: "해당 epoch boundary root를 맞힌 unique unslashed validator의 effective balance 합입니다." },
            { symbol: "W_{active}", name: "전체 활성 잔액", description: "같은 current-epoch state에서 읽은 active effective balance 합입니다." },
          ]}
          assumptions={[
            "Attestation validation과 target-root 비교가 끝났습니다.",
            "한 validator는 index별 participation flag로 한 번만 집계됩니다.",
            "이 판정은 justification bit 하나를 만들며 finalization pattern 전체를 대신하지 않습니다.",
          ]}
          interpretation="64/96은 경계를 통과하지만 63/96은 통과하지 못합니다. 통과한 결과는 먼저 justification bit와 current justified checkpoint를 바꿀 후보가 됩니다."
        />
      </section>

      <section id="bits" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Bits</h2>
        <p>
          Prysm의 <code>processJustificationBits</code>는 기존 four-bit history를 한 칸 옮깁니다. 이 사례에서는 <code>0001</code>이 <code>0010</code>이 됩니다. Current target 64/96이 경계를 통과했으므로 오른쪽 끝인 bit 0을 켜 최종 <code>0011</code>을 만듭니다.
        </p>
        <pre className="not-prose overflow-x-auto border border-border bg-muted/20 p-4 text-[12px] font-normal leading-6"><code>{`// 최근 justification 결과를 한 epoch 뒤로 옮깁니다.
bits = shift_left(old_bits, 1)       // 0001 → 0010

// 현재 target의 unique balance가 정수 2/3를 넘는지 확인합니다.
if 3 * current_target_balance >= 2 * active_balance:
    bits[0] = true                   // 0010 → 0011

// 갱신 전 checkpoint와 새 bit pattern으로 두 결과를 계산합니다.
new_justified, new_finalized = compute_checkpoints(old_state, bits)

// 계산이 끝난 네 값을 BeaconState에 기록합니다.
state.previous_justified = old_state.current_justified
state.current_justified = new_justified
state.justification_bits = bits
state.finalized = new_finalized`}</code></pre>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Bits 계산" onClick={() => sidebar.open("finality-bits", codeRefs["finality-bits"])} />
          <CodeViewButton label="State 기록" onClick={() => sidebar.open("finality-state-write", codeRefs["finality-state-write"])} />
          <span className="text-xs text-muted-foreground">Pseudocode와 v7.3.1 실제 source를 나눠 확인합니다.</span>
        </div>
      </section>

      <section id="finalization-pruning" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Finalized</h2>
        <p>
          <code>computeCheckpoints</code>는 먼저 update 전 <code>previous_justified</code>와 <code>current_justified</code>를 보존합니다. 그런 다음 새 bit 0이 켜졌으므로 epoch 11 경계 root를 새 current justified checkpoint로 고릅니다. Finalized 후보는 이 새 값이 아니라 보존해 둔 checkpoint에서 고릅니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="설명용 0011 finalization 판정">
          {[
            ["Bits", "0011", "최근 두 위치가 true"],
            ["Old current", "epoch 10", "갱신 전 justified"],
            ["Current", "epoch 11", "10+1=11"],
            ["Output", "finalized 10", "old current를 선택"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          이 사례가 사용하는 조건은 <code>bits &amp; 0b0011 == 0b0011</code>이면서 <code>old_current.epoch + 1 == current_epoch</code>입니다. Spec에는 한 epoch gap을 허용하는 경우까지 포함해 네 pattern이 있습니다. “2/3가 두 번 나왔다”만 기억하면 어느 checkpoint를 finalize할지 재현할 수 없습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Checkpoint 판정" onClick={() => sidebar.open("finality-checkpoints", codeRefs["finality-checkpoints"])} />
          <span className="text-xs text-muted-foreground">네 bit mask와 old checkpoint epoch를 함께 봅니다.</span>
        </div>

        <h3 className="break-keep text-xl font-bold">Safety</h3>
        <p>
          Finalized는 “절대로 바뀌지 않는 오래된 head”라는 저장 등급이 아닙니다. 같은 validator set에서 충돌하는 두 finality quorum을 만들려면 두 집합에 들어간 stake가 slashable vote를 남긴다는 accountable-safety 경계입니다.
        </p>
        <ExplainedFormula
          question="전체 96에서 충돌하는 두 quorum이 각각 64라면 최소 얼마가 양쪽에 겹칩니까?"
          idea="두 집합의 크기를 더한 뒤 전체 집합을 빼면 반드시 겹치는 하한이 남습니다."
          formula={String.raw`|Q_1\cap Q_2|\;\ge\;|Q_1|+|Q_2|-W\;=\;64+64-96\;=\;32`}
          annotatedFormula={String.raw`\underbrace{|Q_1\cap Q_2|}_{\text{양쪽 vote에 들어간 stake}}\;\ge\;\underbrace{|Q_1|+|Q_2|-W}_{\text{포함-배제 하한}}\;=\;\underbrace{32}_{\text{전체의 1/3}}`}
          operations={[
            { expression: String.raw`64+64`, annotation: ["충돌하는 두 finality quorum", "각각 전체의 2/3"] },
            { expression: String.raw`128-96=32`, annotation: ["전체 stake를 한 번 빼면", "최소 32가 두 quorum에 모두 포함"] },
          ]}
          terms={[
            { symbol: "W", name: "전체 잔액", description: "같은 relevant validator set의 active effective balance입니다." },
            { symbol: "Q_1,Q_2", name: "충돌 quorum", description: "서로 양립할 수 없는 finality vote를 지지한 stake 집합입니다." },
          ]}
          assumptions={[
            "두 vote가 Casper FFG slashing condition 아래 실제로 충돌합니다.",
            "두 quorum은 같은 relevant validator set과 balance 기준으로 비교합니다.",
            "Evidence가 남는다는 사실과 즉시 발견·처벌된다는 사실은 다릅니다.",
          ]}
          interpretation="최소 32 balance가 양쪽 vote에 들어갑니다. 이것은 slashable evidence의 하한이며 data availability나 영구 보관을 보장하는 식이 아닙니다."
        />

        <h3 className="break-keep text-xl font-bold">Prune</h3>
        <p>
          BeaconState를 처리한 block이 fork-choice에 들어오면 Prysm의 <code>updateCheckpoints</code>가 더 높은 finalized epoch를 store에 반영하고 <code>prune</code>을 호출합니다. Store는 finalized root를 찾지 못하면 오류를 내고, 찾으면 그 node를 새 tree root로 만든 뒤 같은 checkpoint slot 이하에서 양립하지 않는 child를 제거합니다.
        </p>
        <p>
          여기서 지우는 대상은 <strong>fork-choice 후보와 그 파생 index</strong>입니다. Block archive, historical state, slashing evidence와 API 보관 기간은 다른 owner가 결정합니다. Fork-choice prune이 곧 모든 과거 자료 삭제를 허가하지는 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Checkpoint 반영·Prune" onClick={() => sidebar.open("forkchoice-finality-prune", codeRefs["forkchoice-finality-prune"])} />
          <span className="text-xs text-muted-foreground">Finality 판정과 후보 tree 정리는 다른 함수입니다.</span>
        </div>
      </section>

      <section id="weak-subjectivity" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Weak Subjectivity</h2>
        <p>
          오래 offline이던 Proof-of-Stake node는 오래전에 exit한 validator key로 만든 대체 history와 현재 chain을 로컬 데이터만으로 구분하기 어렵습니다. 그래서 최근 checkpoint를 외부 신뢰 anchor로 받아 동기화를 시작합니다. 이 checkpoint에는 network와 epoch, block root, 확인 시각이 붙어야 하며 “아무 snapshot이나 신뢰한다”는 뜻이 아닙니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Prysm weak subjectivity 검증 순서">
          {[
            ["1", "Checkpoint 입력", "epoch · block root"],
            ["2", "Finality 대기", "local finalized epoch가 전진"],
            ["3", "DB 확인", "block 존재 · finalized"],
            ["4", "Epoch 확인", "해당 slot 범위에 root 존재"],
          ].map(([step, action, result]) => (
            <div key={step} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{step}</span>
              <strong className="mt-2 block break-keep text-xs">{action}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{result}</p>
            </div>
          ))}
        </div>
        <p>
          Prysm v7.3.1 verifier는 checkpoint epoch가 아직 local finalized epoch보다 앞서거나 같으면 기다립니다. Finality가 그 지점을 지난 뒤에는 root가 DB에 존재하고 canonical finalized block이며 지정한 epoch의 slot 범위에 들어가는지 확인합니다. 세 조건을 모두 통과한 뒤에만 <code>verified=true</code>가 됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Weak-subjectivity 검증" onClick={() => sidebar.open("weak-subjectivity-verifier", codeRefs["weak-subjectivity-verifier"])} />
          <span className="text-xs text-muted-foreground">Checkpoint 배포자를 신뢰하는 문제와 local canonical 확인을 구분합니다.</span>
        </div>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">상황</th><th className="p-3">시스템 동작</th><th className="p-3">확정되지 않는 것</th></tr></thead>
            <tbody>
              {[
                ["63 / 96", "Current target bit를 켜지 않고 기존 checkpoint를 유지", "새 justification·finality"],
                ["첫 두 epoch", "초기 zero-root corner case를 피하려 FFG 갱신을 건너뜀", "초기 stub 변경"],
                ["Finalized root 미확인", "Fork-choice prune이 unknown-finalized-root 오류 반환", "새 tree root"],
                ["Weak checkpoint block 없음", "Verifier가 fail-closed 오류 반환", "trusted anchor 검증 완료"],
                ["Finalized root 존재", "Accountable-safety evidence 경계가 생김", "Block body 영구 보관·application 성공"],
              ].map(([situation, behavior, absent]) => (
                <tr key={situation} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{situation}</td><td className="p-3">{behavior}</td><td className="p-3 text-muted-foreground">{absent}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          참여가 2/3 아래라고 즉시 safety가 깨지는 것은 아닙니다. 새 finality의 liveness가 멈추고 current head는 fork choice에 따라 계속 움직일 수 있습니다. 반대로 finalized checkpoint가 전진해도 availability, archive와 외부 애플리케이션 상태는 별도 증거가 필요합니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <a
            id="paper-ethereum-finality-spec"
            href="https://github.com/ethereum/consensus-specs/blob/aa16bb4c156184e9548a997d53efaf2a228a6304/specs/phase0/beacon-chain.md#justification-and-finalization"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Protocol</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Ethereum consensus-specs v1.7.0-beta.4 · aa16bb4c</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Checkpoint·AttestationData, target balance, four-bit history와 네 finalization pattern을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Protocol state transition의 정본이며 Prysm의 precompute·fork-choice tree 구현은 규정하지 않습니다.</p>
          </a>
          <a
            id="paper-prysm-finality-source"
            href="https://github.com/OffchainLabs/prysm/blob/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/core/epoch/precompute/justification_finalization.go"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Implementation</span>
            <strong className="mt-2 block break-keep text-sm leading-6">OffchainLabs Prysm v7.3.1 · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Precomputed balance, justification bits, checkpoint update와 fork-choice prune 구현을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 이 release의 Fulu 흐름입니다. 다른 release나 client 자료구조로 일반화하지 않습니다.</p>
          </a>
          <a
            id="paper-ethereum-weak-subjectivity-spec"
            href="https://github.com/ethereum/consensus-specs/blob/aa16bb4c156184e9548a997d53efaf2a228a6304/specs/phase0/weak-subjectivity.md"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Bootstrap boundary</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Weak Subjectivity Guide · aa16bb4c</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Recent checkpoint의 period, sync procedure와 stale-checkpoint 검사를 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 예시 일수를 protocol 상수로 만들지 않으며 신뢰할 provider 선택을 자동 해결하지 않습니다.</p>
          </a>
          <a
            href="https://github.com/OffchainLabs/prysm/blob/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/blockchain/weak_subjectivity_checks.go"
            target="_blank"
            rel="noreferrer"
            className="min-w-0 bg-background p-4 hover:bg-muted/30"
          >
            <span className="font-mono text-[10px] font-black text-primary">O · Client check</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Prysm WeakSubjectivityVerifier · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Local block 존재, finalized canonical 여부와 epoch slot 범위를 검사하는 실제 경로를 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Checkpoint를 어디서 받아 신뢰할지는 이 verifier 바깥의 책임입니다.</p>
          </a>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>64/96이 epoch 11을 justify해도 epoch 10이 finalized되는 이유는 무엇입니까? <strong>(답: 새 bit 0과 이동한 기존 bit가 <code>0011</code>을 만들고, 갱신 전 current justified epoch 10이 current epoch 11보다 정확히 하나 앞서기 때문입니다.)</strong></li>
          <li>Aggregated attestation 개수를 세지 않는 이유는 무엇입니까? <strong>(답: 같은 validator가 여러 object에 들어갈 수 있으므로 index별 target participation을 합친 뒤 unique unslashed effective balance를 한 번만 더해야 하기 때문입니다.)</strong></li>
          <li>Finalized checkpoint와 fork-choice prune이 같은 상태가 아닌 이유는 무엇입니까? <strong>(답: BeaconState의 finality 판정이 먼저 일어나고, fork-choice store는 그 결과를 받아 충돌 후보와 derived index를 별도 함수에서 정리하기 때문입니다.)</strong></li>
          <li>Weak-subjectivity verifier가 checkpoint provider의 신뢰까지 해결하지 않는 이유는 무엇입니까? <strong>(답: Verifier는 받은 epoch·root가 local finalized chain과 일치하는지만 확인하며, 그 tuple을 어떤 독립 경로에서 받아 신뢰할지는 외부 경계이기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmFinalityMapReturn />

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
