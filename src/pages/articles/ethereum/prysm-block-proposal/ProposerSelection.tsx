import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProposerSelection({ onCodeRef }: Props) {
  return (
    <section id="proposer-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proposer 선정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('compute-proposer', codeRefs['compute-proposer'])} />
          <span className="text-[10px] text-muted-foreground self-center">ComputeProposerIndex()</span>
        </div>

        {/* ── Proposer selection 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ComputeProposerIndex — effective_balance 가중</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 매 slot의 proposer 결정
func ComputeProposerIndex(
    state *BeaconState,
    activeIndices []ValidatorIndex,
    seed [32]byte,
) ValidatorIndex {
    MAX_RANDOM_BYTE := uint64(255)  // 2^8 - 1
    i := uint64(0)
    total := uint64(len(activeIndices))

    for {
        // 1. 후보 index 계산
        candidateIndex := activeIndices[computeShuffledIndex(i % total, total, seed)]
        candidate := state.Validators[candidateIndex]

        // 2. 랜덤 byte 추출
        //    seed + (i/32) 해시의 (i%32) 바이트
        randomByte := hash(append(seed[:], i/32.toBytes()...))[i%32]

        // 3. effective_balance 가중 선택
        effectiveBalance := candidate.EffectiveBalance
        if effectiveBalance * MAX_RANDOM_BYTE >= MAX_EFFECTIVE_BALANCE * uint64(randomByte) {
            return candidateIndex  // 당첨!
        }

        i++  // 다음 후보 시도
    }
}

// 확률 분석:
// - 32 ETH effective_balance: 항상 통과 (32 * 255 >= 32 * randomByte 항상 true)
// - 16 ETH: 50% 확률로 통과
// - 0.5 ETH: ~1.56% 확률

// 왜 이런 설계?
// - 큰 stake validator 우선 → 경제적 보안
// - 낮은 balance validator는 다시 추첨 → 공정성
// - 결정적 알고리즘 → 모든 노드 동일 결과

// Slot별 seed:
// seed = hash(state_root(epoch - 1) + domain + slot)
// RANDAO mix 기반 → 예측 불가능

// 미리 알 수 있는 이유:
// - epoch N의 RANDAO mix는 epoch N 시작 시점에 고정
// - epoch N+1의 proposer는 epoch N의 seed로 계산 가능
// - 1 epoch 미리 알고 준비 가능`}
        </pre>
        <p className="leading-7">
          Proposer는 <strong>effective_balance 가중 무작위 선정</strong>.<br />
          32 ETH = 100% 선정 확률, 낮은 balance = 재추첨.<br />
          결정적 알고리즘 → 모든 노드 동일 proposer 계산.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 잔액 비례 확률</strong> — effectiveBalance * maxRandom ≥ MaxEffectiveBalance * randomByte.<br />
          32 ETH 유효 잔액이면 항상 통과, 잔액이 낮으면 재추첨.<br />
          한 에폭 전에 다음 에폭의 제안자를 미리 알 수 있어 사전 준비 가능.
        </p>
      </div>
    </section>
  );
}
