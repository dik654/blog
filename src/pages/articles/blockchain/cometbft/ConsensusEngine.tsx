import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import TendermintRoundViz from './viz/TendermintRoundViz';
import { ROUND_CODE, STATE_CODE, COMPARISON_TABLE } from './ConsensusEngineData';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

const CELL = 'border border-border px-4 py-2';

export default function ConsensusEngine({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="consensus-engine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 엔진 (Tendermint BFT)</h2>
      <div className="not-prose mb-8"><TendermintRoundViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT 합의 — Tendermint BFT 알고리즘 기반<br />
          <strong>Propose → Prevote → Precommit</strong> 3단계 프로토콜로 동작<br />
          이더리움 Casper FFG가 2 에폭 후 최종성 달성하는 것과 달리 매 블록 즉시 최종성 보장
        </p>
        <CitationBlock source="Buchman et al., &quot;The latest gossip on BFT consensus&quot;, 2018" citeKey={1} type="paper" href="https://arxiv.org/abs/1807.04938">
          <p className="italic">"Tendermint guarantees safety — no two correct processes decide differently — and liveness under partial synchrony"</p>
          <p className="mt-2 text-xs">Tendermint BFT 핵심 보장 — 부분 동기 모델에서 Safety(동일 높이에서 서로 다른 블록 커밋 불가) + Liveness 모두 제공</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">라운드 기반 합의 흐름</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('enter-propose', codeRefs['enter-propose'])} />
          <span className="text-[10px] text-muted-foreground self-center">enterPropose()</span>
          <CodeViewButton onClick={() => onCodeRef('enter-prevote', codeRefs['enter-prevote'])} />
          <span className="text-[10px] text-muted-foreground self-center">defaultDoPrevote()</span>
          <CodeViewButton onClick={() => onCodeRef('enter-precommit', codeRefs['enter-precommit'])} />
          <span className="text-[10px] text-muted-foreground self-center">enterPrecommit()</span>
          <CodeViewButton onClick={() => onCodeRef('finalize-commit', codeRefs['finalize-commit'])} />
          <span className="text-[10px] text-muted-foreground self-center">enterCommit()</span>
        </div>
        <p>
          Height H, Round R:<br />
          1. Propose (리더가 블록 제안)<br />
          Proposer = validators[H + R % len(validators)]<br />
          → 라운드 로빈 방식 리더 선출<br />
          2. Prevote (검증자가 블록 검증 후 투표)<br />
          유효한 블록 → Prevote(block_hash)<br />
          타임아웃/무효 → Prevote(nil)<br />
          +2/3 Prevote 수집 → "Polka" 달성<br />
          3. Precommit (최종 커밋 투표)<br />
          Polka 확인 → Precommit(block_hash)<br />
          → 해당 블록에 "Lock" (이전 Lock 해제)<br />
          +2/3 nil Prevote → Unlock
        </p>
        <CitationBlock source="cometbft/consensus/state.go" citeKey={2} type="code" href="https://github.com/cometbft/cometbft/blob/main/consensus/state.go">
          <pre className="text-xs overflow-x-auto"><code>{STATE_CODE}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">합의 상태 머신의 핵심 구조체.</p>
        </CitationBlock>
        {/* ── State Machine 전이 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">State Machine — 슬롯당 5 단계 전이</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/consensus/state.go: RoundStepType
const (
    RoundStepNewHeight     = 1  // 새 높이 시작 대기
    RoundStepNewRound      = 2  // 새 라운드 시작
    RoundStepPropose       = 3  // proposer 블록 대기
    RoundStepPrevote       = 4  // 2/3+ Prevote 수집
    RoundStepPrevoteWait   = 5  // polka 대기 timeout
    RoundStepPrecommit     = 6  // 2/3+ Precommit 수집
    RoundStepPrecommitWait = 7  // commit 대기 timeout
    RoundStepCommit        = 8  // 블록 finalize
)

// 상태 전이 흐름 (정상 경로):
// NewHeight → NewRound → Propose → Prevote → Precommit → Commit
//              ↑                                              ↓
//              └────────── (round failed) ← Timeout ←────────┘

// enterPropose (height H, round R):
// 1. Proposer = 현재 round의 선정된 validator
// 2. 내가 proposer면 → 블록 생성 + 방송
// 3. 아니면 → proposer 블록 대기 (propose timeout)

// enterPrevote:
// 1. 받은 proposal validation
// 2. valid → Prevote(block_hash)
// 3. invalid/timeout → Prevote(nil)

// enterPrevoteWait:
// +2/3 Prevote 수집 못 하면 timeout 대기
// timeout 후 enterPrecommit(nil) 강제

// enterPrecommit:
// 1. +2/3 Prevote 확인 → Precommit(block_hash) + lock
// 2. +2/3 nil Prevote → Precommit(nil) + unlock
// 3. 애매하면 Precommit(nil)

// enterPrecommitWait / enterCommit:
// +2/3 Precommit 확보 → enterCommit → block finalize`}
        </pre>
        <p className="leading-7">
          Tendermint BFT는 <strong>8 단계 state machine</strong>.<br />
          각 단계가 명확한 전이 조건 + timeout 보장.<br />
          round 실패 시 NewRound로 복귀 → liveness 확보.
        </p>

        {/* ── Lock 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Lock 메커니즘 — Safety 보장의 핵심</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Lock: validator가 특정 block에 commit 의사
// safety를 위반하지 않기 위한 제약 조건

// 구조:
type State struct {
    Height       int64
    Round        int32
    Step         RoundStepType

    LockedRound int32      // 현재 lock된 round (-1 = unlock)
    LockedBlock *Block     // 현재 lock된 block
    LockedBlockParts *PartSet

    ValidRound int32       // 가장 최근 valid block round
    ValidBlock *Block
}

// Lock 규칙:
// 1. Polka 발견 (+2/3 Prevote for block X)
//    → lock = block X
//    → Precommit(X) 방송
//
// 2. Lock된 상태에서 다른 block에 Prevote 못 함
//    → safety 위반 방지
//    → 만약 Prevote(Y)하면 equivocation = slashing
//
// 3. Unlock 조건:
//    a. +2/3 nil Prevote 수집 (현재 round)
//    b. 다른 block에 대한 polka 발견 (higher round)
//    c. polka round > LockedRound
//
// 4. 새 round 시작 시:
//    - Lock 유지 (safety)
//    - 하지만 새 proposal이 LockedBlock이면 Prevote 가능

// Safety 증명:
// 두 validator가 서로 다른 block을 finalize 불가
// 이유:
// - Block X finalize = 2/3+ Precommit(X)
// - Precommit(X)한 validator는 X에 lock됨
// - lock된 validator는 다른 Y에 Prevote 불가
// - 따라서 Y는 2/3+ Prevote 못 받음 = finalize 불가
// - 2/3 vs 1/3 = 최소 1/3 overlap → 슬래싱 가능

// Lock 예시:
// Round 0: Proposer A가 block1 제안 → Prevote(block1) → polka → lock(block1)
//          Round 0 commit 실패 (네트워크 장애 등)
// Round 1: 새 Proposer B가 block2 제안
//          나는 locked(block1) → Prevote(nil)
//          block2가 polka 달성 불가 → round 1 실패
// Round 2: 다시 제안...
//          만약 다른 validator들이 block2에 polka 달성
//          → 나도 unlock → Prevote(block2) 가능
//          → block2 finalize`}
        </pre>
        <p className="leading-7">
          <strong>Lock 메커니즘</strong>이 BFT safety의 핵심.<br />
          한 block에 Precommit한 validator는 다른 block 투표 불가.<br />
          이 제약으로 &quot;동일 height에 2개 block finalize&quot; 불가능.
        </p>

        {/* ── Timeout 전략 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Timeout 전략 — Liveness 보장</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 단계별 timeout (cometbft/types/params.go)
type ConsensusParams struct {
    TimeoutPropose      time.Duration  // 3s (기본)
    TimeoutProposeDelta time.Duration  // 500ms
    TimeoutPrevote      time.Duration  // 1s
    TimeoutPrevoteDelta time.Duration  // 500ms
    TimeoutPrecommit    time.Duration  // 1s
    TimeoutPrecommitDelta time.Duration // 500ms
    TimeoutCommit       time.Duration  // 1s
}

// Round마다 timeout 증가:
// Round 0: propose 3s, prevote 1s, precommit 1s
// Round 1: propose 3.5s, prevote 1.5s, precommit 1.5s
// Round 2: propose 4s, prevote 2s, precommit 2s
// ...

// 이유: 네트워크 상태 변동에 적응
// - 초기 시도: 낙관적 짧은 timeout
// - 실패 반복 → 네트워크 문제 가능성 → 증가
// - 무한 round 불가 (천장 있음)

// Round 실패 시나리오:
// 1. Proposer 오프라인
//    → propose timeout → Prevote(nil) → round 실패
// 2. +2/3 Prevote 미달성
//    → prevoteWait timeout → Precommit(nil) → round 실패
// 3. +2/3 Precommit 미달성
//    → precommitWait timeout → NewRound

// 3-5 round 내 대부분 성공 (메인넷 경험):
// - Round 0 성공률: ~95%
// - Round 1 성공률: ~99%
// - Round 3+: 매우 드물게 발생 (주요 네트워크 장애)

// Liveness 조건:
// - 2/3+ honest validators
// - 네트워크 궁극적 전달 (eventual delivery)
// - round 계속 증가 → 결국 성공 보장`}
        </pre>
        <p className="leading-7">
          <strong>Round별 증가하는 timeout</strong>이 liveness 확보.<br />
          네트워크 장애 시 점진적 대기 증가 → 결국 성공.<br />
          메인넷 ~95%가 round 0에 commit 성공.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 Casper FFG와 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>속성</th>
                <th className={`${CELL} text-left`}>Tendermint BFT</th>
                <th className={`${CELL} text-left`}>Casper FFG + LMD-GHOST</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map(r => (
                <tr key={r.attr}>
                  <td className={`${CELL} font-medium`}>{r.attr}</td>
                  <td className={CELL}>{r.tendermint}</td>
                  <td className={CELL}>{r.casper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
