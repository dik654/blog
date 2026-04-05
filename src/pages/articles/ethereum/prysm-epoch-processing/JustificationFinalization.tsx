import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function JustificationFinalization({ onCodeRef }: Props) {
  return (
    <section id="justification-finalization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Justification & Finalization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-justification', codeRefs['process-justification'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessJustification()</span>
        </div>

        {/* ── Casper FFG ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Casper FFG — 2-phase finality</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Casper FFG (Friendly Finality Gadget)
// Ethereum 2.0의 economic finality 메커니즘
// 기반 논문: "Casper the Friendly Finality Gadget" (Vitalik, 2017)

// 핵심 개념:
// 1. Justified checkpoint: 2/3+ validators가 지지
// 2. Finalized checkpoint: justified의 supermajority link

// FFG rule (EIP-3675):
// epoch N의 checkpoint가 finalized 조건:
//
// Rule 1: N과 N+1이 모두 justified, AND
//         N → N+1 supermajority link 존재 (연속 2 epoch)
//
// Rule 2: N, N+1, N+2가 justified, AND
//         N → N+2 supermajority link 존재

// Supermajority link:
// 전체 active balance의 2/3+ validator가
// source=N, target=M 투표 → "N → M" link

// JustificationBits (4-bit 벡터):
// 최근 4 epoch의 justification 상태 추적
struct BeaconState {
    justification_bits: Bitvector[4],
    previous_justified_checkpoint: Checkpoint,
    current_justified_checkpoint: Checkpoint,
    finalized_checkpoint: Checkpoint,
}

// bits[0]: current epoch - 4 (oldest)
// bits[1]: current epoch - 3
// bits[2]: current epoch - 2
// bits[3]: current epoch - 1 (most recent)`}
        </pre>
        <p className="leading-7">
          Casper FFG는 <strong>2-phase finality</strong> 제공.<br />
          justified → finalized 2단계 진행으로 economic security 보장.<br />
          finalized 되돌리면 전체 staker의 1/3 이상 슬래싱 필요 → 수십억 달러 비용.
        </p>

        {/* ── processJustification 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">processJustificationAndFinalization 로직</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`func ProcessJustificationAndFinalization(state *BeaconState) error {
    currentEpoch := getCurrentEpoch(state)
    if currentEpoch <= GENESIS_EPOCH + 1 { return nil }  // 첫 2 epoch skip

    // 1. 참여 잔액 계산
    previousEpoch := currentEpoch - 1
    totalActiveBalance := getTotalActiveBalance(state)
    previousTargetBalance := getAttestingBalance(state, previousEpoch, TARGET)
    currentTargetBalance := getAttestingBalance(state, currentEpoch, TARGET)

    // 2. JustificationBits 업데이트
    // 기존 bits를 한 칸 shift (bits[3] → bits[2] → ...)
    oldJustifiedBits := state.JustificationBits
    newBits := Bitvector{oldJustifiedBits[0], oldJustifiedBits[1], oldJustifiedBits[2], false}

    // 3. 이전 epoch justified 체크
    if previousTargetBalance * 3 >= totalActiveBalance * 2 {
        // 2/3+ supermajority
        state.CurrentJustifiedCheckpoint = Checkpoint{
            Epoch: previousEpoch,
            Root: getBlockRoot(state, previousEpoch),
        }
        newBits[1] = true
    }

    // 4. 현재 epoch justified 체크
    if currentTargetBalance * 3 >= totalActiveBalance * 2 {
        state.CurrentJustifiedCheckpoint = Checkpoint{
            Epoch: currentEpoch,
            Root: getBlockRoot(state, currentEpoch),
        }
        newBits[0] = true
    }

    state.JustificationBits = newBits

    // 5. Finalization 체크
    // Rule 1: bits[1:4] all true → N-3 → N 연속 link
    if newBits[1] && newBits[2] && newBits[3] &&
       oldJustified.Epoch + 3 == currentEpoch {
        state.FinalizedCheckpoint = oldJustified  // N-3 finalized
    }

    // Rule 2: bits[1:3] all true → N-2 → N link
    if newBits[1] && newBits[2] &&
       oldJustified.Epoch + 2 == currentEpoch {
        state.FinalizedCheckpoint = oldJustified  // N-2 finalized
    }

    // Rule 3: bits[0:2] all true → 현재 epoch 기반 finalize
    // (정상 동작 시 이 rule이 대부분)
    if newBits[0] && newBits[1] &&
       previousJustified.Epoch + 1 == currentEpoch {
        state.FinalizedCheckpoint = previousJustified
    }

    return nil
}`}
        </pre>
        <p className="leading-7">
          매 epoch 2/3 target vote 체크 → justified 마킹.<br />
          연속 2+ epoch justified + supermajority link → finalized.<br />
          4-bit vector로 최근 history 추적.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 2/3 슈퍼 매저리티</strong> — 이전/현재 에폭의 타겟 투표 잔액이 전체의 2/3를 넘으면 justified.<br />
          2개 연속 에폭이 justified되면 첫 번째가 finalized — 경제적 최종성.<br />
          JustificationBits 4비트 벡터로 최근 4에폭의 상태를 추적.
        </p>
      </div>
    </section>
  );
}
