import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import RewardDetailViz from './viz/RewardDetailViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function RewardsPenalties({ onCodeRef }: Props) {
  return (
    <section id="rewards-penalties" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보상 & 패널티</h2>
      <div className="not-prose mb-8"><RewardDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-rewards', codeRefs['process-rewards'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessRewardsAndPenalties()</span>
        </div>

        {/* ── 4가지 보상 카테고리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation 보상 — 4가지 구성요소</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-2">ParticipationFlags (3-bit) — Altair+</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              {[
                { flag: 'source', weight: '14', index: '0' },
                { flag: 'target', weight: '26', index: '1' },
                { flag: 'head', weight: '14', index: '2' },
                { flag: 'sync', weight: '2', index: '-' },
                { flag: 'proposer', weight: '8', index: '-' },
              ].map(f => (
                <div key={f.flag} className="rounded border border-border p-2 text-center">
                  <span className="font-bold text-indigo-400">{f.flag}</span>
                  <p className="text-foreground/60">weight: {f.weight}/64</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/50 mt-2">총합: 64 (<code>WEIGHT_DENOMINATOR</code>)</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">보상 공식</p>
            <div className="space-y-1 text-xs text-foreground/70">
              <div><code>BASE_REWARD = effective_balance * BASE_REWARD_FACTOR / sqrt(total_active_balance) / BASE_REWARDS_PER_EPOCH</code></div>
              <div><code>flag_reward = BASE_REWARD * FLAG_WEIGHT / 64 * participation_ratio</code></div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">계산 예시 (32 ETH validator, 1M validators)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-foreground/70">
              <div className="space-y-1">
                <div><code>effective_balance</code> = 32,000,000,000 Gwei</div>
                <div><code>BASE_REWARD</code> ≈ 2,350 Gwei/epoch</div>
                <div>Perfect attestation (3 flags): 14+26+14 = 54/64 = <strong>84%</strong></div>
                <div>reward/epoch ≈ 2,350 x 0.84 ≈ <strong>1,975 Gwei</strong></div>
              </div>
              <div className="space-y-1">
                <div>225 epochs/day x 365 = 82,125 epochs/year</div>
                <div>82,125 x 1,975 ≈ 0.162 ETH/year</div>
                <div>APR ≈ 0.162 / 32 = <strong>0.5%</strong> (attestation만)</div>
                <div>+ sync committee + proposer → 실제 APR ≈ <strong>3~5%</strong></div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Attestation 보상 = <strong>3 flags x weights</strong>.<br />
          source(14) + target(26) + head(14) = 54/64 of base reward.<br />
          Perfect participation 시 연 ~0.5% (attestation만).
        </p>

        {/* ── 패널티 공식 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">패널티 — 미참여/잘못된 투표</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">Flag별 패널티 (Altair+)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-foreground/70">
              <div className="rounded border border-border p-2">
                <strong>source 미참여:</strong> <code>BASE_REWARD * 14 / 64</code>
              </div>
              <div className="rounded border border-border p-2">
                <strong>target 미참여:</strong> <code>BASE_REWARD * 26 / 64</code>
              </div>
              <div className="rounded border border-border p-2">
                <strong>head 미참여:</strong> 0 (penalty 없음, reward only)
              </div>
            </div>
            <p className="text-xs text-foreground/50 mt-2">최대 flag penalty: <code>BASE_REWARD x (14+26)/64 = 62%</code></p>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Inactivity Leak — finality 지연 시 추가 패널티</p>
            <div className="space-y-2 text-xs text-foreground/70">
              <div><strong>트리거:</strong> finality 4 epoch 이상 지연 시 활성화</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="rounded border border-border p-2">
                  <strong>Inactivity Score 변동:</strong><br />
                  참여 시 <code>-16</code>/epoch, 미참여 시 <code>+4</code>/epoch
                </div>
                <div className="rounded border border-border p-2">
                  <strong>Leak penalty 공식:</strong><br />
                  <code>score * effective_balance / BIAS(4) / QUOTIENT(2^26)</code>
                </div>
              </div>
              <div className="text-foreground/50">정상 시: 작은 penalty / leak 시: 지수적 증가 → 빠른 exit 유도 → 2/3 quorum 회복</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          패널티는 <strong>reward와 대칭적 구조</strong>.<br />
          source/target 미참여 시 최대 62% penalty.<br />
          Inactivity leak로 finality 지연 validator 강력 처벌.
        </p>

        {/* ── Precompute 최적화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Precompute 패턴 — O(N) 최적화</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">Naive 구현 — O(N²)</p>
              <div className="text-xs text-foreground/70 space-y-1">
                <div>각 validator마다 <code>computeTotalBalance(validators)</code> O(N) 호출</div>
                <div>총 복잡도: O(N²) — 1M validator에서 수십 초</div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">Precompute 최적화 — O(N)</p>
              <div className="text-xs text-foreground/70 space-y-1">
                <div>2번의 O(N) 순회 = 선형</div>
                <div>1M validator 기준: <strong>~200ms</strong> (naive 대비 수백 배)</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-3">Pass 1: 사전 계산 — O(N) 순회 1회</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-foreground/80 mb-1"><code>ValidatorPrecompute</code></p>
                <div className="space-y-1 text-foreground/60">
                  <div><code>ValidatorIndex</code>, <code>Balance</code>, <code>EffectiveBalance</code></div>
                  <div><code>IsActive</code>, <code>IsInactive</code></div>
                  <div><code>IsPreviousEpochSource/Target/Head</code></div>
                  <div><code>IsCurrentEpochSource/Target/Head</code></div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground/80 mb-1"><code>BalancePrecompute</code></p>
                <div className="space-y-1 text-foreground/60">
                  <div><code>TotalBalance</code></div>
                  <div><code>PreviousEpochSourceAttestingBalance</code></div>
                  <div><code>PreviousEpochTargetAttestingBalance</code></div>
                  <div><code>PreviousEpochHeadAttestingBalance</code></div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Pass 2: 보상 계산 — O(N), precompute 사용</p>
            <div className="text-xs text-foreground/70">
              <code>deltas[i] = computeDelta(vals[i], bals)</code> — 각 validator O(1) 연산
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Precompute 패턴</strong>으로 O(N²) → O(N) 최적화.<br />
          2번의 O(N) 순회로 reward 계산 완료.<br />
          1M validator에서 200ms — naive 대비 수백 배 가속.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Precompute 최적화</strong> — 모든 검증자의 참여도를 한 번에 집계한 후 보상/패널티 벡터 계산.<br />
          N번 반복 대신 한 번의 순회로 처리하여 O(N) 성능 달성.<br />
          Phase0 vs Altair에서 보상 공식이 다르므로 포크별 분기 구현.
        </p>
      </div>
    </section>
  );
}
