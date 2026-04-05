import ProposerViz from './viz/ProposerViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ValidatorSet({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="validator-set" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ValidatorSet & 가중 라운드 로빈</h2>
      <div className="not-prose mb-8">
        <ProposerViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── ValidatorSet 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">ValidatorSet & Validator 구조체</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/types/validator_set.go
type ValidatorSet struct {
    Validators []*Validator  // sorted by address
    Proposer   *Validator    // 현재 라운드 제안자

    totalVotingPower int64   // 캐시된 합계
}

type Validator struct {
    Address     Address          // Ed25519 pubkey hash (20 bytes)
    PubKey      crypto.PubKey    // Ed25519 공개키
    VotingPower int64            // stake 기반 투표 가중치
    ProposerPriority int64       // 라운드 로빈용 priority
}

// 속성:
// - 최대 validator 수: 100 (기본), 설정 가능
// - VotingPower는 stake에 비례 (Cosmos SDK)
// - ProposerPriority는 round마다 업데이트
// - Validators는 Address 순 정렬 유지

// 합의 조건:
// 2/3+ VotingPower = "quorum"
// quorum이 같은 블록에 Precommit → finalize

// Cosmos Hub 예시:
// - 175 validators
// - total stake ~250M ATOM
// - 최소 voting power: ~100K ATOM (0.04%)
// - 최대 voting power: ~10M ATOM (4%)`}
        </pre>
        <p className="leading-7">
          ValidatorSet은 <strong>stake 기반 weighted validators</strong>.<br />
          각 validator의 VotingPower가 합의 가중치.<br />
          2/3+ VotingPower quorum → 블록 finalize.
        </p>

        {/* ── 가중 라운드 로빈 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">가중 라운드 로빈 — IncrementProposerPriority</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proposer 선정: 결정적 가중 라운드 로빈
// Ethereum의 VRF와 달리 모든 노드가 동일 결과 계산

func (vals *ValidatorSet) IncrementProposerPriority(times int32) {
    for i := int32(0); i < times; i++ {
        vals.incrementProposerPriority()
    }
}

func (vals *ValidatorSet) incrementProposerPriority() {
    // 1. 각 validator의 priority를 voting power만큼 증가
    for _, val := range vals.Validators {
        val.ProposerPriority += val.VotingPower
    }

    // 2. 가장 priority 높은 validator 선정
    mostest := vals.findHighestPriority()

    // 3. 선정된 validator의 priority에서 total voting power 차감
    //    (다른 validators에 기회 양보)
    mostest.ProposerPriority -= vals.TotalVotingPower()

    // 4. proposer 설정
    vals.Proposer = mostest
}

// 동작 예시 (4 validators, voting power [100, 80, 60, 40]):
// Round 0:
//   priorities = [0, 0, 0, 0]
//   increment: [100, 80, 60, 40]
//   select highest: val0 (100)
//   val0.priority -= 280 (total)
//   priorities = [-180, 80, 60, 40]
//
// Round 1:
//   increment: [-80, 160, 120, 80]
//   select highest: val1 (160)
//   val1.priority -= 280
//   priorities = [-80, -120, 120, 80]
//
// Round 2:
//   increment: [20, -40, 180, 120]
//   select highest: val2 (180)
//   val2.priority -= 280

// 특성:
// - 결정적 (모든 노드 동일 결과)
// - stake 비례 기회
// - 장기적 공정성 (priority 축적)`}
        </pre>
        <p className="leading-7">
          <strong>IncrementProposerPriority</strong>가 가중 라운드 로빈의 핵심.<br />
          VotingPower만큼 priority 증가 + 선정 시 total 차감.<br />
          stake 비례 + 결정적 + 장기 공정성 달성.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 가중 라운드 로빈 vs 랜덤 추첨</strong> — VRF 기반 랜덤 추첨은 비결정적이라 모든 노드가 같은 결과를 계산해야 하는 BFT 합의에 부적합하다.<br />
          priority 기반 라운드 로빈은 결정적이어서 모든 노드가 동일한 제안자를 계산한다.
        </p>
      </div>
    </section>
  );
}
