import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import TendermintRoundViz from './viz/TendermintRoundViz';
import { COMPARISON_TABLE } from './ConsensusEngineData';
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
          <p className="text-xs text-foreground/70">합의 상태 머신의 핵심 구조체 — <code>RoundState</code>가 Height/Round/Step + LockedBlock + ValidBlock + Votes를 관리</p>
        </CitationBlock>
        {/* ── State Machine 전이 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">State Machine — 슬롯당 5 단계 전이</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2"><code>RoundStepType</code> — 8단계 상태</p>
            <div className="grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="font-mono text-xs">1</span><code className="text-xs">NewHeight</code><span>새 높이 시작 대기</span>
              <span className="font-mono text-xs">2</span><code className="text-xs">NewRound</code><span>새 라운드 시작</span>
              <span className="font-mono text-xs">3</span><code className="text-xs">Propose</code><span>proposer 블록 대기</span>
              <span className="font-mono text-xs">4</span><code className="text-xs">Prevote</code><span>2/3+ Prevote 수집</span>
              <span className="font-mono text-xs">5</span><code className="text-xs">PrevoteWait</code><span>polka 대기 timeout</span>
              <span className="font-mono text-xs">6</span><code className="text-xs">Precommit</code><span>2/3+ Precommit 수집</span>
              <span className="font-mono text-xs">7</span><code className="text-xs">PrecommitWait</code><span>commit 대기 timeout</span>
              <span className="font-mono text-xs">8</span><code className="text-xs">Commit</code><span>블록 finalize</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">정상 경로: NewHeight → NewRound → Propose → Prevote → Precommit → Commit<br />실패 시: Timeout → NewRound로 복귀</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2"><code>enterPropose</code></p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Proposer = 현재 round 선정 validator</li>
                <li>내가 proposer → 블록 생성 + 방송</li>
                <li>아니면 → proposer 블록 대기 (propose timeout)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2"><code>enterPrevote</code></p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>받은 proposal validation</li>
                <li>유효 → <code>Prevote(block_hash)</code></li>
                <li>무효/타임아웃 → <code>Prevote(nil)</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2"><code>enterPrecommit</code></p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>+2/3 Prevote 확인 → <code>Precommit(block_hash)</code> + lock</li>
                <li>+2/3 nil Prevote → <code>Precommit(nil)</code> + unlock</li>
                <li>애매하면 → <code>Precommit(nil)</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2"><code>enterCommit</code></p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>+2/3 Precommit 확보 → block finalize</li>
                <li><code>PrevoteWait</code> timeout → <code>enterPrecommit(nil)</code> 강제</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Tendermint BFT는 <strong>8 단계 state machine</strong>.<br />
          각 단계가 명확한 전이 조건 + timeout 보장.<br />
          round 실패 시 NewRound로 복귀 → liveness 확보.
        </p>

        {/* ── Lock 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Lock 메커니즘 — Safety 보장의 핵심</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2"><code>State</code> 구조체 — Lock 관련 필드</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <code className="text-xs">LockedRound int32</code><span>현재 lock된 round (-1 = unlock)</span>
              <code className="text-xs">LockedBlock *Block</code><span>현재 lock된 block</span>
              <code className="text-xs">LockedBlockParts *PartSet</code><span>lock된 block의 파트셋</span>
              <code className="text-xs">ValidRound int32</code><span>가장 최근 valid block round</span>
              <code className="text-xs">ValidBlock *Block</code><span>가장 최근 valid block</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">Lock 규칙 4가지</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">1. Polka 발견</strong> — +2/3 Prevote for block X → lock = block X → <code>Precommit(X)</code> 방송</p>
              <p><strong className="text-foreground">2. Lock 유지</strong> — lock된 상태에서 다른 block에 Prevote 불가 (위반 = equivocation → slashing)</p>
              <p><strong className="text-foreground">3. Unlock 조건</strong> — a) +2/3 nil Prevote 수집 b) 다른 block의 polka 발견 (higher round) c) polka round &gt; <code>LockedRound</code></p>
              <p><strong className="text-foreground">4. 새 round</strong> — Lock 유지 (safety), 단 새 proposal이 <code>LockedBlock</code>이면 Prevote 가능</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">Safety 증명</p>
            <p className="text-sm text-muted-foreground">Block X finalize = 2/3+ <code>Precommit(X)</code> → X에 lock됨 → 다른 Y에 Prevote 불가 → Y는 2/3+ Prevote 불가 = finalize 불가<br />2/3 vs 1/3 = 최소 1/3 overlap → 슬래싱 가능</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">Lock 예시</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Round 0</strong> — Proposer A가 block1 제안 → <code>Prevote(block1)</code> → polka → <code>lock(block1)</code>. commit 실패 (네트워크 장애)</p>
              <p><strong className="text-foreground">Round 1</strong> — Proposer B가 block2 제안 → 나는 <code>locked(block1)</code> → <code>Prevote(nil)</code>. block2 polka 불가 → round 1 실패</p>
              <p><strong className="text-foreground">Round 2</strong> — 다른 validator들이 block2에 polka 달성 → 나도 unlock → <code>Prevote(block2)</code> → block2 finalize</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Lock 메커니즘</strong>이 BFT safety의 핵심.<br />
          한 block에 Precommit한 validator는 다른 block 투표 불가.<br />
          이 제약으로 &quot;동일 height에 2개 block finalize&quot; 불가능.
        </p>

        {/* ── Timeout 전략 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Timeout 전략 — Liveness 보장</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2"><code>ConsensusParams</code> — 단계별 timeout</p>
            <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <code className="text-xs">TimeoutPropose</code><span>3s (기본)</span>
              <code className="text-xs">TimeoutProposeDelta</code><span>500ms</span>
              <code className="text-xs">TimeoutPrevote</code><span>1s</span>
              <code className="text-xs">TimeoutPrevoteDelta</code><span>500ms</span>
              <code className="text-xs">TimeoutPrecommit</code><span>1s</span>
              <code className="text-xs">TimeoutPrecommitDelta</code><span>500ms</span>
              <code className="text-xs">TimeoutCommit</code><span>1s</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Round별 증가: R0 → propose 3s, R1 → 3.5s, R2 → 4s ... 네트워크 상태에 적응</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Round 실패 시나리오</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">1. Proposer 오프라인</strong> — propose timeout → <code>Prevote(nil)</code> → round 실패</p>
                <p><strong className="text-foreground">2. +2/3 Prevote 미달성</strong> — prevoteWait timeout → <code>Precommit(nil)</code> → round 실패</p>
                <p><strong className="text-foreground">3. +2/3 Precommit 미달성</strong> — precommitWait timeout → NewRound</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">메인넷 성공률</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Round 0 성공률: <strong className="text-foreground">~95%</strong></p>
                <p>Round 1 성공률: <strong className="text-foreground">~99%</strong></p>
                <p>Round 3+: 매우 드물게 발생 (주요 네트워크 장애)</p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Liveness 조건: 2/3+ honest validators + eventual delivery → round 증가로 결국 성공 보장</p>
            </div>
          </div>
        </div>
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
