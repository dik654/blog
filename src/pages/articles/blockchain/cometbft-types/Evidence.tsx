import EvidenceViz from './viz/EvidenceViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Evidence({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="evidence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Evidence — 비잔틴 증거</h2>
      <div className="not-prose mb-8">
        <EvidenceViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Evidence 타입 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Evidence 종류 — 2가지 비잔틴 행위</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>Evidence</code> interface — cometbft/types/evidence.go</p>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-1 text-xs text-center text-muted-foreground">
              <div className="bg-background rounded px-2 py-1.5"><code>ABCI()</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>Bytes()</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>Hash()</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>Height()</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>String()</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>Time()</code></div>
              <div className="bg-background rounded px-2 py-1.5"><code>ValidateBasic()</code></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">1. DuplicateVoteEvidence (equivocation)</p>
              <p className="text-xs text-muted-foreground mb-2">같은 (height, round, type)에 2개 다른 block 투표</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">VoteA</code><span className="text-xs text-muted-foreground"><code>*Vote</code> — 첫 번째 투표</span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">VoteB</code><span className="text-xs text-muted-foreground"><code>*Vote</code> — 두 번째 투표</span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">TotalVotingPower</code><span className="text-xs text-muted-foreground"><code>int64</code></span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">ValidatorPower</code><span className="text-xs text-muted-foreground"><code>int64</code></span>
                </div>
                <div className="flex justify-between py-0.5">
                  <code className="text-xs">Timestamp</code><span className="text-xs text-muted-foreground"><code>time.Time</code></span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">검증: Height/Round/Type 동일 + Address 동일 + BlockID 상이 + 두 Vote 서명 유효</p>
            </div>

            <div className="rounded-lg border border-orange-500/30 p-4">
              <p className="font-semibold text-sm text-orange-400 mb-2">2. LightClientAttackEvidence</p>
              <p className="text-xs text-muted-foreground mb-2">light client 공격 (conflicting headers)</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">ConflictingBlock</code><span className="text-xs text-muted-foreground"><code>*LightBlock</code> — 공격자 블록</span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">CommonHeight</code><span className="text-xs text-muted-foreground"><code>int64</code> — 공통 조상 높이</span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">ByzantineValidators</code><span className="text-xs text-muted-foreground"><code>[]*Validator</code></span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">TotalVotingPower</code><span className="text-xs text-muted-foreground"><code>int64</code></span>
                </div>
                <div className="flex justify-between py-0.5">
                  <code className="text-xs">Timestamp</code><span className="text-xs text-muted-foreground"><code>time.Time</code></span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-3 text-xs text-center text-muted-foreground">
                <div className="bg-background/50 rounded px-2 py-1">Lunatic — 다른 state 기반</div>
                <div className="bg-background/50 rounded px-2 py-1">Equivocation — conflicting 서명</div>
                <div className="bg-background/50 rounded px-2 py-1">Amnesia — 이전 commit 무시</div>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">탐지 시점</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div><strong className="text-foreground/80">일반 노드</strong> — P2P로 받은 Vote 비교</div>
              <div><strong className="text-foreground/80">Light client</strong> — 2개 full node의 응답 비교</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Evidence는 <strong>2가지 비잔틴 행위 증거</strong>.<br />
          DuplicateVote (equivocation) + LightClientAttack (reorg 공격).<br />
          Block에 포함되어 영구 기록 → slashing 판단 근거.
        </p>

        {/* ── Evidence Pool & Slashing ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Evidence Lifecycle — 탐지 → Block 포함 → Slash</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">Evidence 생명주기 — 5단계</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. 탐지</p>
                <p className="text-xs text-muted-foreground"><code>VoteSet.AddVote</code>에서 equivocation 감지 → <code>DuplicateVoteEvidence</code> 생성 → EvidencePool 추가</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. Gossip</p>
                <p className="text-xs text-muted-foreground">Evidence reactor가 모든 peer에게 방송. 누가 먼저 블록에 포함시키는지 경쟁</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. Block 포함</p>
                <p className="text-xs text-muted-foreground"><code>evpool.PendingEvidence(10)</code> — 블록당 최대 10개 Evidence 포함</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">4. Validation</p>
                <p className="text-xs text-muted-foreground"><code>ValidateBlock</code>에서 Evidence 재검증 + 서명 체크. 유효하지 않으면 블록 거부</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">5. Slashing</p>
                <p className="text-xs text-muted-foreground">ABCI <code>FinalizeBlock</code>에 Misbehavior 전달 → Cosmos SDK slashing module stake 차감</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Slashing 효과 (Cosmos Hub 기준)</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>stake 5% loss</li>
                <li>validator tombstone (영구 activate 불가)</li>
                <li>delegator stake 동반 slash</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Evidence max age</p>
              <p className="text-sm text-muted-foreground">UnbondingPeriod 내 (~21일)에만 유효</p>
              <p className="text-xs text-muted-foreground mt-1">이유: unbond 후 stake 없어 slash 불가</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Evidence lifecycle: <strong>탐지 → gossip → block 포함 → slashing</strong>.<br />
          Block에 최대 10개 Evidence → 모든 노드 동일 slashing.<br />
          UnbondingPeriod(~21일) 이내 Evidence만 유효.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Evidence가 Block에 포함되는 이유</strong> — 비잔틴 행위의 증거를 블록체인에 영구 기록하면 모든 노드가 동일한 슬래싱 판단을 내릴 수 있다.<br />
          off-chain 신고 방식은 합의 없이 불일치가 발생할 수 있어 부적합하다.
        </p>
      </div>
    </section>
  );
}
