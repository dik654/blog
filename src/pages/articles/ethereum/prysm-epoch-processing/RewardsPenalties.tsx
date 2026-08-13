import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import RewardDetailViz from "./viz/RewardDetailViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function RewardsPenalties({ onCodeRef }: Props) {
  return (
    <section id="rewards-penalties" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보상 & 패널티</h2>
      <div className="not-prose mb-8">
        <RewardDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("process-rewards", codeRefs["process-rewards"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            ProcessRewardsAndPenalties()
          </span>
        </div>

        {/* ── 4가지 보상 카테고리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Attestation 보상 — 4가지 구성요소
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-2">
              ParticipationFlags (3-bit) — Altair+
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              {[
                { flag: "source", weight: "14", index: "0" },
                { flag: "target", weight: "26", index: "1" },
                { flag: "head", weight: "14", index: "2" },
                { flag: "sync", weight: "2", index: "-" },
                { flag: "proposer", weight: "8", index: "-" },
              ].map((f) => (
                <div
                  key={f.flag}
                  className="rounded border border-border p-2 text-center"
                >
                  <span className="font-bold text-indigo-400">{f.flag}</span>
                  <p className="text-foreground/60">weight: {f.weight}/64</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/50 mt-2">
              총합: 64 (<code>WEIGHT_DENOMINATOR</code>)
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              보상 공식
            </p>
            <div className="space-y-1 text-xs text-foreground/70">
              <div>
                <code>
                  BASE_REWARD = effective_balance * BASE_REWARD_FACTOR /
                  sqrt(total_active_balance) / BASE_REWARDS_PER_EPOCH
                </code>
              </div>
              <div>
                <code>
                  flag_reward = BASE_REWARD * FLAG_WEIGHT / 64 *
                  participation_ratio
                </code>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              값을 계산할 때 필요한 입력
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-foreground/70">
              <div className="space-y-1">
                <div>
                  validator의 현재 <code>effective_balance</code>
                </div>
                <div>전체 활성 검증자의 effective balance 합</div>
                <div>source·target·head의 적시성 조건과 참여 balance</div>
                <div>현재 fork의 reward weights와 inactivity 상태</div>
              </div>
              <div className="space-y-1">
                <div>epoch 길이와 연간 epoch 수는 network preset으로 환산</div>
                <div>proposer·sync committee 역할은 별도 확률과 보상</div>
                <div>
                  실현 수익은 uptime, inclusion delay와 네트워크 참여율에 영향
                </div>
                <div>고정 APR은 합의 규칙이 아니라 시점별 관측 결과</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          Attestation reward는 source·target·head participation flag와 각각의 weight를 사용해 계산합니다. 정확한 constant와 timely condition은 활성 fork의 consensus specification에서 읽어야 하며, protocol reward를 연간 APR로 바꾸려면 total active balance와 실제 validator participation 같은 network data를 추가로 넣어야 합니다.
        </p>

        {/* ── 패널티 공식 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          패널티 — 미참여/잘못된 투표
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">
              Flag별 패널티 (Altair+)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-foreground/70">
              <div className="rounded border border-border p-2">
                <strong>source 미참여:</strong>{" "}
                <code>BASE_REWARD * 14 / 64</code>
              </div>
              <div className="rounded border border-border p-2">
                <strong>target 미참여:</strong>{" "}
                <code>BASE_REWARD * 26 / 64</code>
              </div>
              <div className="rounded border border-border p-2">
                <strong>head 미참여:</strong> 0 (penalty 없음, reward only)
              </div>
            </div>
            <p className="text-xs text-foreground/50 mt-2">
              최대 flag penalty: <code>BASE_REWARD x (14+26)/64 = 62%</code>
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              Inactivity Leak — finality 지연 시 추가 패널티
            </p>
            <div className="space-y-2 text-xs text-foreground/70">
              <div>
                <strong>트리거:</strong> finality 4 epoch 이상 지연 시 활성화
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="rounded border border-border p-2">
                  <strong>Inactivity Score 변동:</strong>
                  <span className="mt-1 block">활성 fork의 bias와 recovery rate에 따라 참여 여부별로 증가하거나 감소합니다.</span>
                </div>
                <div className="rounded border border-border p-2">
                  <strong>Leak penalty 공식:</strong>
                  <code className="mt-1 block">score × effective_balance ÷ (bias × quotient)</code>
                </div>
              </div>
              <div className="text-foreground/50">
                정상 시: 작은 penalty / leak 시: 지수적 증가 → 빠른 exit 유도 →
                2/3 quorum 회복
              </div>
            </div>
          </div>
        </div>
        <p>
          미참여 penalty는 모든 reward 항목을 단순히 음수로 바꾼 값이 아닙니다. Source·target·head와 inactivity condition별 rule을 따로 적용하며, finality가 일정 기간 지연되면 inactivity score 기반의 추가 penalty가 발생해 참여하지 않는 balance의 비중을 줄이고 quorum 회복을 유도합니다.
        </p>

        {/* ── Precompute 최적화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Precompute 패턴 — O(N) 최적화
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">
                Naive 구현 — O(N²)
              </p>
              <div className="text-xs text-foreground/70 space-y-1">
                <div>
                  각 validator마다 <code>computeTotalBalance(validators)</code>{" "}
                  O(N) 호출
                </div>
                <div>
                  전역 집계를 validator loop 안에서 반복하면 검증자 수에 대해
                  이차 비용이 될 수 있음
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">
                Precompute 최적화 — O(N)
              </p>
              <div className="text-xs text-foreground/70 space-y-1">
                <div>2번의 O(N) 순회 = 선형</div>
                <div>
                  전역 합계를 재사용해 validator 수에 대해 선형 순회로 유지
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-3">
              Pass 1: 사전 계산 — O(N) 순회 1회
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-foreground/80 mb-1">
                  <code>ValidatorPrecompute</code>
                </p>
                <div className="space-y-1 text-foreground/60">
                  <div>
                    <code>ValidatorIndex</code>, <code>Balance</code>,{" "}
                    <code>EffectiveBalance</code>
                  </div>
                  <div>
                    <code>IsActive</code>, <code>IsInactive</code>
                  </div>
                  <div>
                    <code>IsPreviousEpochSource/Target/Head</code>
                  </div>
                  <div>
                    <code>IsCurrentEpochSource/Target/Head</code>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground/80 mb-1">
                  <code>BalancePrecompute</code>
                </p>
                <div className="space-y-1 text-foreground/60">
                  <div>
                    <code>TotalBalance</code>
                  </div>
                  <div>
                    <code>PreviousEpochSourceAttestingBalance</code>
                  </div>
                  <div>
                    <code>PreviousEpochTargetAttestingBalance</code>
                  </div>
                  <div>
                    <code>PreviousEpochHeadAttestingBalance</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Pass 2: 보상 계산 — O(N), precompute 사용
            </p>
            <div className="text-xs text-foreground/70">
              <code>deltas[i] = computeDelta(vals[i], bals)</code> — 각
              validator O(1) 연산
            </div>
          </div>
        </div>
        <p>
          Prysm은 validator별 계산마다 전체 participation을 다시 집계하지 않고 epoch 공통 합계를 먼저 precompute합니다. 이후 validator registry를 순회하며 각 entry의 delta를 계산하므로 반복적인 global scan을 피할 수 있습니다. 실제 complexity와 latency는 fork별 state representation, active validator 수와 cache behavior를 profiler로 확인해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 Precompute 최적화</strong> — 모든 검증자의 참여도를 한 번에
          집계한 뒤 validator별 reward·penalty delta를 계산합니다. Phase0와 Altair 이후의 participation 표현과 reward rule이 다르므로 구현도 활성 fork를 기준으로 분기합니다.
        </p>
      </div>
    </section>
  );
}
