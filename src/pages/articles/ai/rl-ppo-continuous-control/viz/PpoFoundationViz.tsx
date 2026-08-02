import { useMemo, useState } from "react";

const GAMMA = 0.9;
const REWARDS = [0.2, 0, 0.5, 1];
const VALUES = [1, 1.2, 0.8, 0.5];
const TRUNCATION_BOOTSTRAP_VALUE = 0.35;
const LAMBDAS = [0, 0.5, 0.95, 1];
type Boundary = "terminal" | "truncation";

type GaeRow = {
  time: number;
  reward: number;
  value: number;
  nextValue: number;
  delta: number;
  tail: number;
  advantage: number;
  returnTarget: number;
  done: number;
};

function fixed(value: number) {
  return value.toFixed(3);
}

function calculateRows(lambda: number, boundary: Boundary): GaeRow[] {
  const advantages = Array<number>(REWARDS.length).fill(0);
  const rows = Array<GaeRow>(REWARDS.length);
  const done = REWARDS.map((_, time) =>
    boundary === "terminal" && time === REWARDS.length - 1 ? 1 : 0,
  );

  for (let time = REWARDS.length - 1; time >= 0; time -= 1) {
    const nextValue = done[time]
      ? 0
      : time === REWARDS.length - 1
        ? TRUNCATION_BOOTSTRAP_VALUE
        : VALUES[time + 1];
    const delta =
      REWARDS[time] + GAMMA * (1 - done[time]) * nextValue - VALUES[time];
    const tail =
      time === REWARDS.length - 1
        ? 0
        : GAMMA * lambda * (1 - done[time]) * advantages[time + 1];
    const advantage = delta + tail;
    advantages[time] = advantage;
    rows[time] = {
      time,
      reward: REWARDS[time],
      value: VALUES[time],
      nextValue,
      delta,
      tail,
      advantage,
      returnTarget: advantage + VALUES[time],
      done: done[time],
    };
  }

  return rows.reverse();
}

export function GaeCreditLab() {
  const [lambda, setLambda] = useState(0.95);
  const [boundary, setBoundary] = useState<Boundary>("terminal");
  const rows = useMemo(() => calculateRows(lambda, boundary), [boundary, lambda]);
  const firstStep = rows.find((row) => row.time === 0);

  return (
    <figure
      data-gae-credit
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-cyan-800 dark:text-cyan-300">
          GAE CREDIT LAB
        </span>
        <strong className="min-w-0 text-sm">
          마지막 TD 오차에서 시작해 미래의 책임을 과거 행동으로 되돌린다
        </strong>
        <span className="font-mono text-xs font-black text-muted-foreground">
          t3 → t2 → t1 → t0
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-cyan-500/[0.035] p-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold">
            얼마나 먼 TD 오차까지 현재 행동의 책임으로 볼까?
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            γ는 0.9로 고정했다. λ=0은 한 step만, λ가 1에 가까울수록 episode
            뒤쪽의 오차를 더 오래 전달한다.
          </p>
        </div>
        <div
          role="group"
          aria-label="Rollout boundary"
          className="grid grid-cols-2 rounded-md border border-border bg-background p-1"
        >
          <button
            type="button"
            aria-pressed={boundary === "terminal"}
            onClick={() => setBoundary("terminal")}
            className={`h-9 min-w-24 px-2 text-xs font-bold ${
              boundary === "terminal"
                ? "rounded bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            환경 terminal
          </button>
          <button
            type="button"
            aria-pressed={boundary === "truncation"}
            onClick={() => setBoundary("truncation")}
            className={`h-9 min-w-24 px-2 text-xs font-bold ${
              boundary === "truncation"
                ? "rounded bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            시간 제한
          </button>
        </div>
        <div
          role="group"
          aria-label="GAE lambda"
          className="grid grid-cols-4 rounded-md border border-border bg-background p-1"
        >
          {LAMBDAS.map((candidate) => (
            <button
              key={candidate}
              type="button"
              aria-pressed={lambda === candidate}
              onClick={() => setLambda(candidate)}
              className={`h-9 min-w-12 px-2 text-xs font-bold ${
                lambda === candidate
                  ? "rounded bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              λ {candidate}
            </button>
          ))}
        </div>
      </div>

      <div
        data-gae-boundary={boundary}
        className="border-b border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground"
      >
        고정 trajectory · r=[0.2, 0, 0.5, 1.0] · V=[1.0, 1.2, 0.8, 0.5] · 마지막
        step은 {boundary === "terminal"
          ? "환경이 끝나므로 terminal=1"
          : `시간 제한으로 잘렸으므로 terminal=0, V(s4)=${TRUNCATION_BOOTSTRAP_VALUE}`}
      </div>

      <div>
        {rows.map((row, index) => (
          <div
            key={row.time}
            className="grid gap-3 border-b border-border p-4 last:border-0 sm:grid-cols-[3.5rem_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center"
          >
            <div className="flex items-center justify-between sm:block">
              <span className="font-mono text-xs font-black text-cyan-800 dark:text-cyan-300 sm:block">
                STEP
              </span>
              <strong className="font-mono text-xl sm:mt-1 sm:block">t={row.time}</strong>
            </div>

            <div className="min-w-0 rounded-sm bg-muted/25 px-3 py-2">
              <p className="text-[11px] font-bold text-muted-foreground">
                한 step TD 오차
              </p>
              <p className="mt-1 break-words font-mono text-xs leading-relaxed">
                {fixed(row.reward)} + 0.9·
                {row.done ? "0" : fixed(row.nextValue)} − {fixed(row.value)}
              </p>
              <p className="mt-1 font-mono text-base font-black">
                δ{row.time} = {fixed(row.delta)}
              </p>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 sm:block">
              <span className="text-[11px] font-bold text-muted-foreground">
                뒤 step에서 온 tail
              </span>
              <strong className="font-mono text-sm sm:mt-1 sm:block">
                {fixed(row.tail)}
              </strong>
              <span className="text-[11px] text-muted-foreground sm:mt-1 sm:block">
                {index === 0
                  ? row.done
                    ? "terminal이므로 0"
                    : `rollout 경계라 GAE tail은 0 · V(s4)=${TRUNCATION_BOOTSTRAP_VALUE}가 δ3에 반영`
                  : `0.9·${lambda}·Â${row.time + 1}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border">
              <div className="bg-cyan-500/[0.045] p-3">
                <p className="text-[11px] font-bold text-muted-foreground">
                  추정 advantage
                </p>
                <p className="mt-1 font-mono text-base font-black">
                  Â{row.time}
                </p>
                <p className="font-mono text-sm">{fixed(row.advantage)}</p>
              </div>
              <div className="bg-background p-3">
                <p className="text-[11px] font-bold text-muted-foreground">
                  Value target
                </p>
                <p className="mt-1 font-mono text-base font-black">
                  R̂{row.time}
                </p>
                <p className="font-mono text-sm">{fixed(row.returnTarget)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 border-t border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          λ를 바꾸면 reward와 value prediction은 그대로지만 과거 step에 돌아가는
          credit만 달라진다. 이것이 GAE의 bias–variance 손잡이다.
        </p>
        <p
          data-gae-a0
          className="font-mono text-sm font-black text-cyan-800 dark:text-cyan-300"
        >
          λ={lambda} · Â0={fixed(firstStep?.advantage ?? 0)}
        </p>
      </div>
    </figure>
  );
}
