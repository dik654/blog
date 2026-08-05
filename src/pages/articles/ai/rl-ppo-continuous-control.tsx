import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MathFormula from "@/components/ui/math";
import FormulaNote from "@/components/ui/formula-note";
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from "@/components/learning/ArticleLearning";
import { articlePath } from "@/lib/paths";
import { PpoIterationSequenceViz } from "./rl-viz/RlAnimatedSequences";
import { GaeCreditLab } from "./rl-ppo-continuous-control/viz/PpoFoundationViz";

function PpoClipExplorer() {
  const [ratio, setRatio] = useState(1.2);
  const [epsilon, setEpsilon] = useState(0.2);
  const [advantage, setAdvantage] = useState(1);
  const clippedRatio = Math.min(1 + epsilon, Math.max(1 - epsilon, ratio));
  const raw = ratio * advantage;
  const clipped = clippedRatio * advantage;
  const objective = Math.min(raw, clipped);
  const clippedActive = Math.abs(raw - objective) > 1e-9;
  const left = 1 - epsilon;
  const right = 1 + epsilon;
  return (
    <figure
      data-ppo-clip
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-orange-700 dark:text-orange-300">
          PPO CLIP LAB
        </span>
        <strong className="text-sm">
          같은 ratio라도 추정 advantage Â의 부호가 바뀌면 어느 경계에서 잘릴까?
        </strong>
        <span
          className={`rounded px-2 py-1 text-xs font-black ${clippedActive ? "bg-amber-500/12 text-amber-800 dark:text-amber-300" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}
        >
          {clippedActive ? "CLIPPED" : "ACTIVE"}
        </span>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-orange-500/[0.035] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label className="text-xs font-semibold text-muted-foreground">
          Probability ratio rₜ · {ratio.toFixed(2)}
          <input
            type="range"
            min="0.4"
            max="1.6"
            step="0.01"
            value={ratio}
            onChange={(event) => setRatio(Number(event.target.value))}
            className="mt-3 block w-full accent-orange-700"
          />
        </label>
        <label className="text-xs font-semibold text-muted-foreground">
          Clip ε · {epsilon.toFixed(2)}
          <input
            type="range"
            min="0.05"
            max="0.4"
            step="0.01"
            value={epsilon}
            onChange={(event) => setEpsilon(Number(event.target.value))}
            className="mt-3 block w-full accent-orange-700"
          />
        </label>
        <div
          role="group"
          aria-label="Advantage 부호"
          className="flex items-center gap-1 rounded-md border border-border bg-background p-1"
        >
          <button
            type="button"
            aria-pressed={advantage === 1}
            onClick={() => setAdvantage(1)}
            className={`h-8 px-3 text-xs font-bold ${advantage === 1 ? "rounded bg-foreground text-background" : "text-muted-foreground"}`}
          >
            Â +1
          </button>
          <button
            type="button"
            aria-pressed={advantage === -1}
            onClick={() => setAdvantage(-1)}
            className={`h-8 px-3 text-xs font-bold ${advantage === -1 ? "rounded bg-foreground text-background" : "text-muted-foreground"}`}
          >
            Â -1
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="relative h-24">
          <div className="absolute left-0 right-0 top-10 h-px bg-border" />
          <div
            className="absolute top-5 h-10 border-x border-orange-500/35 bg-orange-500/[0.06]"
            style={{
              left: `${((left - 0.4) / 1.2) * 100}%`,
              right: `${100 - ((right - 0.4) / 1.2) * 100}%`,
            }}
          />
          <div
            className="absolute top-2 -translate-x-1/2"
            style={{ left: `${((ratio - 0.4) / 1.2) * 100}%` }}
          >
            <span className="block rounded bg-foreground px-2 py-1 font-mono text-[10px] font-bold text-background">
              r {ratio.toFixed(2)}
            </span>
            <span className="mx-auto block h-10 w-0.5 bg-foreground" />
          </div>
          <span className="absolute bottom-0 left-0 font-mono text-[10px] text-muted-foreground">
            0.4
          </span>
          <span
            className="absolute bottom-0 -translate-x-1/2 font-mono text-[10px] text-orange-700 dark:text-orange-300"
            style={{ left: `${((left - 0.4) / 1.2) * 100}%` }}
          >
            {left.toFixed(2)}
          </span>
          <span
            className="absolute bottom-0 -translate-x-1/2 font-mono text-[10px] text-orange-700 dark:text-orange-300"
            style={{ left: `${((right - 0.4) / 1.2) * 100}%` }}
          >
            {right.toFixed(2)}
          </span>
          <span className="absolute bottom-0 right-0 font-mono text-[10px] text-muted-foreground">
            1.6
          </span>
        </div>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-4">
            <p className="text-xs text-muted-foreground">Unclipped r × Â</p>
            <p className="mt-1 font-mono text-xl font-black">
              {raw.toFixed(3)}
            </p>
          </div>
          <div className="bg-background p-4">
            <p className="text-xs text-muted-foreground">Clipped ratio × Â</p>
            <p className="mt-1 font-mono text-xl font-black">
              {clipped.toFixed(3)}
            </p>
          </div>
          <div className="bg-orange-500/[0.04] p-4">
            <p className="text-xs text-muted-foreground">min surrogate</p>
            <p className="mt-1 font-mono text-xl font-black text-orange-700 dark:text-orange-300">
              {objective.toFixed(3)}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}

function AlgorithmChooser() {
  const [action, setAction] = useState<"discrete" | "continuous">("continuous");
  const [reuse, setReuse] = useState(true);
  const [entropy, setEntropy] = useState(true);
  const result = useMemo(() => {
    if (action === "discrete" && reuse)
      return {
        name: "DQN 계열",
        why: "Discrete action의 Q를 모두 출력하고 replay를 재사용한다.",
        caution: "연속 action에서는 모든 후보의 max를 열거할 수 없다.",
      };
    if (!reuse)
      return {
        name: "PPO",
        why: "현재 policy rollout으로 직접 policy objective를 안정적으로 개선한다.",
        caution: "과거 data 재사용이 제한되어 environment sample 비용이 크다.",
      };
    if (entropy)
      return {
        name: "SAC",
        why: "Off-policy critic과 stochastic actor에 entropy 목적을 결합한다.",
        caution:
          "Temperature, twin critic과 target update까지 구현 계약이 늘어난다.",
      };
    return {
      name: "TD3 / DDPG",
      why: "Deterministic actor가 critic gradient를 따라 연속 action을 직접 출력한다.",
      caution:
        "Q overestimation과 exploration noise에 민감해 TD3 안정화가 중요하다.",
    };
  }, [action, entropy, reuse]);
  return (
    <figure
      data-algorithm-chooser
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-orange-700 dark:text-orange-300">
          ALGORITHM MAP
        </span>
        <strong className="text-sm">
          행동 공간과 data 계약을 먼저 정하면 후보가 줄어든다
        </strong>
        <span className="font-mono text-xs font-black">{result.name}</span>
      </figcaption>
      <div className="grid gap-3 border-b border-border bg-muted/15 p-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-bold text-muted-foreground">
            Action space
          </p>
          <div className="flex rounded-md border border-border bg-background p-1">
            <button
              type="button"
              aria-pressed={action === "discrete"}
              onClick={() => setAction("discrete")}
              className={`h-8 flex-1 text-xs font-bold ${action === "discrete" ? "rounded bg-foreground text-background" : "text-muted-foreground"}`}
            >
              Discrete
            </button>
            <button
              type="button"
              aria-pressed={action === "continuous"}
              onClick={() => setAction("continuous")}
              className={`h-8 flex-1 text-xs font-bold ${action === "continuous" ? "rounded bg-foreground text-background" : "text-muted-foreground"}`}
            >
              Continuous
            </button>
          </div>
        </div>
        <label
          className={`cursor-pointer rounded-md border p-3 ${reuse ? "border-orange-600/35 bg-orange-500/[0.04]" : "border-border bg-background"}`}
        >
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reuse}
              onChange={(event) => setReuse(event.target.checked)}
              className="h-4 w-4 accent-orange-700"
            />
            <strong className="text-sm">Replay 재사용 필요</strong>
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            비싼 환경 sample을 여러 update에 사용
          </span>
        </label>
        <label
          className={`cursor-pointer rounded-md border p-3 ${entropy ? "border-orange-600/35 bg-orange-500/[0.04]" : "border-border bg-background"}`}
        >
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={entropy}
              onChange={(event) => setEntropy(event.target.checked)}
              className="h-4 w-4 accent-orange-700"
            />
            <strong className="text-sm">Stochastic exploration</strong>
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Policy entropy를 목적에 포함
          </span>
        </label>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:p-6">
        <div className="rounded-md border border-orange-600/30 bg-orange-500/[0.05] p-4">
          <p className="text-xs text-muted-foreground">권장 출발점</p>
          <p className="mt-2 text-2xl font-black">{result.name}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{result.why}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            주의 · {result.caution}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            이 선택기는 문제 계약을 설명하기 위한 출발점이다. Offline coverage,
            safety constraint, partial observability와 multi-agent dynamics는
            별도 축이다.
          </p>
        </div>
      </div>
    </figure>
  );
}

function PolicyShift() {
  return (
    <section id="policy-shift" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        한 번 잘된 행동을 너무 강하게 따라 하면 왜 오히려 무너질까?
      </h2>
      <BeginnerOpening
        title="PPO는 한 번 모은 경험에서 행동 규칙이 너무 멀리 바뀌지 않게 한다"
        description={<>Agent가 실제로 움직이며 모은 한 묶음의 경험을 <strong>rollout</strong>이라고 한다. 상황마다 행동을 고르는 규칙이 policy이고, 어떤 행동이 당시 평균보다 얼마나 나았는지를 나타낸 값이 advantage다. 학습 update는 좋은 행동을 더 자주 고르게 만들지만 한 번에 지나치게 바꾸면 경험 자체가 낡아 버린다.</>}
        familiarScene={<>운전 연습에서 한 번 왼쪽으로 크게 꺾어 장애물을 피했다고 하자. 다음부터 모든 비슷한 장면에서 핸들을 훨씬 더 세게 꺾으면 차선을 벗어날 수 있다. 성공한 행동을 배우되, 그 경험을 모았을 때의 운전 습관에서 너무 멀리 뛰지 않게 해야 한다.</>}
        steps={[
          { label: '기존 규칙으로 경험을 모은다', detail: '상황·행동·점수와 당시 행동 선택 확률을 함께 저장한다.' },
          { label: '좋고 나쁜 행동을 가른다', detail: '기대보다 나았는지 나타내는 advantage를 계산한다.' },
          { label: '변화 폭을 제한한다', detail: '새 선택 확률이 기존 값에서 과도하게 멀어지면 추가 이득을 자른다.' },
        ]}
      />
      <QuestionLead
        question="한 번 잘됐던 행동의 선택 확률을 크게 올리면 성능도 같은 방향으로 크게 좋아질까?"
        answer="아니다. Update 뒤 policy가 크게 달라지면 rollout을 만들었던 state-action 분포와 새 policy의 분포가 어긋난다. 같은 sample의 advantage가 더는 새 policy 아래에서 유효하지 않고, 몇 개 행동의 확률이 급격히 포화되어 exploration도 사라질 수 있다."
      />
      <ConceptPrimer
        items={[
          {
            term: "Old policy",
            meaning: "현재 rollout을 생성한 고정 policy πold다.",
            why: "Update 중 data distribution의 기준을 명시한다.",
          },
          {
            term: "Probability ratio",
            meaning: "선택 action의 새 확률을 old 확률로 나눈 값이다.",
            why: "같은 sample을 새 policy 관점으로 재가중한다.",
          },
          {
            term: "Surrogate objective",
            meaning:
              "새 environment rollout 없이 policy improvement를 근사하는 목적이다.",
            why: "한 batch를 여러 epoch 재사용하는 근거다.",
          },
          {
            term: "Policy collapse",
            meaning:
              "일부 행동 확률이 급격히 쏠려 return과 entropy가 무너지는 상태다.",
            why: "Gradient loss만 보지 않고 KL·clip fraction을 봐야 한다.",
          },
        ]}
      />
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula
          display
          className="my-0 text-lg"
        >{String.raw`\begin{aligned}
\underbrace{\ell_t}_{\text{현재 action log 확률}}
&=\log\pi_\theta(a_t\mid s_t)\\
\underbrace{\ell_t^{\mathrm{old}}}_{\text{rollout 당시 log 확률}}
&=\log\pi_{\theta_{\mathrm{old}}}(a_t\mid s_t)\\
\underbrace{\Delta\ell_t}_{\text{정책의 log 확률 차이}}
&=\ell_t-\ell_t^{\mathrm{old}}\\
\underbrace{r_t(\theta)}_{\text{같은 action의 확률 배율}}
&=\exp(\Delta\ell_t)
\end{aligned}`}</MathFormula>
      </div>
      <FormulaNote
        meaning="Rollout buffer에 저장한 old log-probability를 빼고 현재 policy의 같은 state-action log-probability를 더한 뒤 exp를 취한다. Ratio가 1이면 동일하고 1.2면 discrete action의 확률 또는 continuous action의 확률 밀도가 old policy 대비 1.2배다."
        symbols={[
          [
            String.raw`\log\pi_{\theta_{\mathrm{old}}}`,
            "rollout 순간 저장해 둔 선택 action의 log-probability",
          ],
          [
            String.raw`\log\pi_\theta`,
            "같은 state-action을 현재 network로 다시 평가한 log-probability",
          ],
          [String.raw`\Delta\ell_t`, "현재 action log-probability에서 rollout 당시 값을 뺀 차이"],
          [String.raw`r_t(\theta)`, "old 대비 새 action 확률 또는 확률 밀도의 양수 배율"],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          예를 들어 rollout 때 선택 확률이 0.40이면 stored log-probability는 약
          -0.916이다. Current policy가 같은 행동에 0.52를 주면 log-probability는
          약 -0.654이고, 차이 0.262를 exp에 넣은 ratio는 1.30이다. 확률을 직접
          나눈 0.52/0.40과 같은 값이지만 구현에서는 작은 확률의 수치 안정성을
          위해 log 공간의 차이를 사용한다.
        </p>
        <p>
          위 숫자는 ratio 계산을 보이기 위한 discrete 예시다. Continuous control의
          Gaussian policy에서는 한 action point의 <strong>확률 밀도</strong> ratio를
          사용한다. Action을 <code>tanh</code>로 범위에 맞춰 변환했다면 old와 current
          log-probability 모두에 같은 change-of-variables Jacobian 보정을 적용해야 한다.
        </p>
      </div>
    </section>
  );
}

function Ppo() {
  return (
    <section id="ppo" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PPO clipping은 어느 방향의 과도한 개선만 잘라내는가?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Positive advantage 행동은 확률을 올리는 것이 유리하지만 ratio가 1+ε를
          넘은 추가 이득을 자른다. Negative advantage 행동은 확률을 내리는 것이
          유리하지만 ratio가 1-ε 아래로 내려간 추가 이득을 자른다. 따라서 같은
          ratio도 advantage 부호에 따라 clip이 활성화되는 경계가 다르다.
        </p>
        <p>
          Clipping은 sample surrogate의 incentive를 평평하게 만들 뿐 모든
          state의 KL을 엄밀히 제한하지 않는다. Optimizer step, epoch 수,
          advantage normalization에 따라 실제 KL이 커질 수 있어 approximate KL,
          clip fraction과 entropy를 같이 모니터링하고 early stop을 둔다.
        </p>
        <p>
          평균 approximate KL이 작아도 소수 sample의 ratio가 폭주할 수 있다.
          따라서 평균만 통과시키지 말고 log-ratio의 상·하위 quantile, 최대
          절댓값과 sequence별 KL을 함께 본다. Clip fraction이 높다면 이미 많은
          sample이 평평한 구간에 들어가 추가 epoch의 정보 효율이 낮다는 신호다.
        </p>
      </div>
      <PpoClipExplorer />
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula
          display
          className="my-0 text-lg"
        >{String.raw`\begin{aligned}
\underbrace{u_t}_{\text{그대로 계산한 이득}}
&=r_t(\theta)\widehat A_t\\
\underbrace{c_t}_{\text{ratio를 경계 안으로 제한}}
&=\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)\widehat A_t\\
\underbrace{L^{\mathrm{clip}}(\theta)}_{\text{보수적인 policy 이득}}
&=\mathbb E_t[\underbrace{\min(u_t,c_t)}_{\text{낙관적인 증가를 제거}}]
\end{aligned}`}</MathFormula>
      </div>
      <FormulaNote
        meaning="Unclipped importance-weighted advantage와 ratio를 경계 안으로 자른 값을 비교해 더 보수적인 쪽을 택한다. Positive·negative advantage 모두 policy가 지나치게 유리한 방향으로 움직여 얻는 추가 objective를 제거한다."
        symbols={[
          [
            String.raw`r_t(\theta)`,
            "old rollout을 새 policy로 재가중하는 ratio",
          ],
          [String.raw`\widehat A_t`, "행동의 상대적 품질 estimate"],
          [String.raw`\epsilon`, "허용할 ratio 변화 폭"],
          [String.raw`\min`, "과도한 improvement를 보수적으로 제한"],
        ]}
      />
      <Misconception>
        PPO의 clip 범위는 parameter가 20%만 바뀐다는 뜻도, 모든 action
        probability가 20% 안에 있다는 뜻도 아니다. Rollout에서 선택된 action의
        ratio가 surrogate에 기여하는 방식을 제한한다.
      </Misconception>
    </section>
  );
}

function TrainingLoop() {
  return (
    <section id="training-loop" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PPO 한 iteration에서 무엇을 고정하고 무엇을 여러 번 갱신할까?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          먼저 πold로 horizon만큼 environment를 실행해 state, action, reward,
          done, old log-probability와 old value를 저장한다. 마지막 state를
          bootstrap해 return과 GAE advantage를 역순으로 계산한다. 그 뒤 rollout
          buffer는 고정하고 mini-batch를 여러 epoch 순회하며 actor와 critic을
          update한다.
        </p>
        <p>
          <strong>종료 여부는 단순한 부가 column이 아니다.</strong> Terminal 뒤
          value를 0으로 막지 않으면 다음 episode의 value가 현재 episode의
          credit으로 새어 들어간다. 반대로 time-limit truncation은 환경의 진짜
          terminal과 구분해 bootstrap 여부를 정해야 한다.
        </p>
      </div>
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula
          display
          className="my-0 text-lg"
        >{String.raw`\begin{aligned}
\underbrace{b_t}_{\text{남길 next value}}
&=(1-d_t)V_\phi(s_{t+1})\\
\underbrace{y_t}_{\text{한 step target}}
&=r_t+\gamma b_t\\
\underbrace{\delta_t}_{\text{critic 오차}}
&=y_t-V_\phi(s_t)
\end{aligned}`}</MathFormula>
      </div>
      <FormulaNote
        meaning="먼저 보상과 종료 전 next value로 한 step target을 만들고 현재 value 예측을 뺀다. dₜ=1인 진짜 terminal에서는 미래 가치가 0이 되어 다른 episode의 정보가 섞이지 않는다."
        symbols={[
          [String.raw`r_t`, "현재 transition에서 받은 reward"],
          [String.raw`1-d_t`, "terminal이면 bootstrap을 차단하는 mask"],
          [String.raw`b_t`, "terminal mask를 적용한 다음 state value"],
          [String.raw`y_t`, "reward와 할인된 next value를 합친 한 step target"],
          [
            String.raw`\delta_t`,
            "현재 value prediction이 한 step target에서 벗어난 양",
          ],
        ]}
      />
      <div className="not-prose my-6 min-w-0 rounded-md border border-cyan-700/25 bg-cyan-500/[0.035] p-3">
        <MathFormula
          display
          className="my-0 text-lg"
        >{String.raw`\begin{aligned}
\underbrace{\widehat A_t}_{\text{현재 action의 GAE}}
&=\underbrace{\delta_t}_{\text{현재 TD 오차}}
+\underbrace{\gamma\lambda(1-d_t)\widehat A_{t+1}}_{\text{다음 오차의 일부를 전달}}\\
\underbrace{\widehat R_t}_{\text{critic 학습 target}}
&=\widehat A_t+\underbrace{V_\phi(s_t)}_{\text{빼 두었던 baseline 복원}}
\end{aligned}`}</MathFormula>
      </div>
      <FormulaNote
        meaning="GAE는 마지막 step에서 시작해 다음 advantage의 일부를 현재 TD 오차에 더한다. λ는 먼 residual을 얼마나 전달할지 정하고, critic target은 advantage에 빼 두었던 baseline을 다시 더해 만든다."
        symbols={[
          [
            String.raw`\lambda`,
            "0이면 한 step, 1에 가까우면 더 긴 미래 오차를 전달",
          ],
          [String.raw`\widehat A_{t+1}`, "이미 역산한 다음 step의 credit"],
          [String.raw`\widehat R_t`, "critic이 회귀할 lambda-return target"],
        ]}
      />
      <GaeCreditLab />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          λ=0은 one-step critic 예측에 강하게 의존해 sampling variance는 낮지만
          부정확한 value의 bias를 더 많이 받는다. λ가 1에 가까워질수록 실제 뒤쪽
          reward를 더 길게 사용해 bootstrap bias는 줄지만 rollout noise의
          variance가 커진다. 그래서 λ는 “정답 상수”가 아니라 critic 품질과
          horizon에 맞춰 검증할 손잡이다.
        </p>
        <p>
          아래 애니메이션은 이 계산이 전체 iteration에서 어디에 놓이는지 보여
          준다. GAE를 계산한 뒤에는 rollout buffer와 old log-probability를
          바꾸지 않는다. Update epoch 중 environment를 다시 실행하거나 old
          log-probability를 current network로 덮어쓰면 ratio의 기준 자체가
          사라진다.
        </p>
        <p>
          Actor loss, value regression, entropy bonus는 서로 다른 목적이다.
          Value loss가 너무 크면 shared representation을 지배하고, entropy
          coefficient가 크면 reward 개선보다 무작위성이 오래 남는다. 합산 loss
          한 숫자보다 각 항과 approximate KL, clip fraction, explained
          variance를 분리해야 한다.
        </p>
      </div>
      <PpoIterationSequenceViz />
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {[
          ["01", "ROLLOUT", "πold 고정", "s, a, r, done, logπold, Vold 수집"],
          [
            "02",
            "ADVANTAGE",
            "Buffer 고정",
            "Terminal mask 뒤 GAE와 return을 t=T-1부터 역산",
          ],
          [
            "03",
            "MINI-BATCH",
            "K epoch 재사용",
            "Ratio, clipped actor loss, value loss, entropy 계산",
          ],
          [
            "04",
            "UPDATE",
            "θ, φ 갱신",
            "KL·clip fraction을 확인하고 early stop",
          ],
          [
            "05",
            "REFRESH",
            "πold ← πθ",
            "새 policy로 다음 data distribution 생성",
          ],
        ].map(([number, name, state, detail]) => (
          <div
            key={number}
            className="grid gap-2 border-b border-border p-4 last:border-0 sm:grid-cols-[2.5rem_7rem_8rem_minmax(0,1fr)]"
          >
            <span className="font-mono text-xs font-black text-orange-700 dark:text-orange-300">
              {number}
            </span>
            <strong className="text-xs">{name}</strong>
            <span className="text-xs font-semibold text-muted-foreground">
              {state}
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground">
              {detail}
            </span>
          </div>
        ))}
      </div>
      <div className="not-prose my-6 min-w-0 rounded-md border border-border p-3">
        <MathFormula
          display
          className="my-0 text-lg"
        >{String.raw`\begin{aligned}
\underbrace{L_{\mathrm{total}}}_{\text{한 update의 전체 loss}}
={}&\underbrace{-L^{\mathrm{clip}}}_{\text{좋은 action 확률을 높임}}\\
&+\underbrace{c_v\mathbb E_t[(V_\phi(s_t)-\widehat R_t)^2]}_{\text{critic이 return을 맞힘}}\\
&-\underbrace{c_e\mathbb E_t[\mathcal H(\pi_\theta(\cdot\mid s_t))]}_{\text{탐색 다양성을 보존}}
\end{aligned}`}</MathFormula>
      </div>
      <FormulaNote
        meaning="Minimize convention에서 actor objective에는 음수를 붙이고, critic MSE를 더하며, entropy는 exploration을 보상하도록 뺀다. cᵥ와 cₑ는 세 gradient가 shared network에 미치는 상대 크기를 정한다."
        symbols={[
          [String.raw`L^{\mathrm{clip}}`, "policy improvement surrogate"],
          [String.raw`V_\phi`, "critic prediction"],
          [String.raw`\widehat R_t`, "GAE로 만든 critic return target"],
          [String.raw`\mathcal H`, "policy distribution의 entropy"],
        ]}
      />
    </section>
  );
}

function ContinuousControl() {
  return (
    <section id="continuous-control" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        연속 행동에서는 왜 Q의 argmax 대신 actor가 필요한가?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Torque처럼 action이 연속이면 모든 action Q를 열거해 max를 고를 수
          없다. DDPG는 deterministic actor μθ(s)가 action을 직접 출력하고 critic
          Qφ(s,a)의 action gradient를 actor로 전달한다. Replay와 target
          network를 사용해 sample-efficient하지만 critic overestimation과
          exploration noise에 민감하다.
        </p>
        <p>
          TD3는 twin critic의 작은 값을 target에 사용하고 actor update를 늦추며
          target action을 smoothing한다. SAC는 stochastic policy와
          entropy-regularized objective를 사용해 여러 좋은 행동을 유지한다.
          PPO가 on-policy stability를 택한다면 이 계열은 off-policy data reuse를
          택한다.
        </p>
      </div>
      <AlgorithmChooser />
      <div data-formula-pair className="not-prose my-6 min-w-0">
        <div className="grid min-w-0 gap-2">
          <div className="min-w-0 overflow-hidden rounded-md border border-border p-3">
            <MathFormula
              display
              className="my-0 text-lg"
            >{String.raw`\begin{aligned}
\underbrace{g_a(s)}_{\text{action 방향}}
&=\left.\nabla_a Q_\phi(s,a)\right|_{a=\mu_\theta(s)}\\
\underbrace{\nabla_\theta J(\theta)}_{\text{actor update}}
&=\mathbb E_{s\sim\mathcal D}\!\left[g_a(s)\right.\\
&\qquad\left.\underbrace{\nabla_\theta\mu_\theta(s)}_{\text{parameter로 전달}}\right]
\end{aligned}`}</MathFormula>
          </div>
          <div className="min-w-0 overflow-hidden rounded-md border border-orange-600/30 bg-orange-500/[0.04] p-3">
            <MathFormula
              display
              className="my-0 text-lg"
            >{String.raw`\begin{aligned}
\underbrace{c_H(s,a)}_{\text{entropy 비용}}
&=\alpha\log\pi_\theta(a\mid s)\\
\underbrace{J_{\mathrm{SAC}}(\theta)}_{\text{actor loss}}
&=\mathbb E_{s,a}\!\left[c_H(s,a)\right.\\
&\qquad\left.-\underbrace{Q_\phi(s,a)}_{\text{높은 Q 선호}}\right]
\end{aligned}`}</MathFormula>
          </div>
        </div>
        <FormulaNote
          meaning="DDPG는 critic이 action 방향으로 얼마나 증가하는지 actor parameter에 chain rule로 전달한다. SAC는 높은 Q 행동을 선호하면서 log-probability 비용으로 entropy를 유지해 stochastic exploration을 학습 목적에 포함한다."
          symbols={[
            [
              String.raw`\mu_\theta(s)`,
              "continuous action을 직접 내는 deterministic actor",
            ],
            [String.raw`g_a(s)`, "critic이 현재 action에서 제시하는 개선 방향"],
            [String.raw`\nabla_a Q_\phi`, "critic이 제시하는 action 개선 방향"],
            [String.raw`\alpha`, "SAC reward와 entropy의 온도"],
            [String.raw`c_H(s,a)`, "SAC의 log-probability 기반 entropy 비용"],
            [String.raw`\mathcal D`, "off-policy replay buffer"],
          ]}
        />
      </div>
    </section>
  );
}

function LlmBridge() {
  return (
    <section id="llm-bridge" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Token 생성도 순차 의사결정이라면 무엇이 state, action, reward일까?
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          LLM policy의 state는 prompt와 지금까지 생성한 prefix, action은 다음
          token, transition은 token을 prefix에 붙이는 deterministic 연산이다.
          Reward model이나 verifier는 주로 완성 응답에 scalar reward를 주고, KL
          penalty는 reference model에서 과도하게 멀어지는 것을 제한한다.
        </p>
        <p>
          이 대응만으로 RLHF가 단순한 게임 RL과 같아지는 것은 아니다. Action
          horizon은 길고 vocabulary는 크며 reward가 sparse하다. Reward model은
          환경의 객관 법칙이 아니라 학습된 proxy라 hacking이 가능하다. RLVR은
          정답 검증기로 reward 신뢰도를 높이지만 검증 가능한 task로 범위가
          제한된다.
        </p>
        <p>
          환경과 reward의 출처는 달라도 update의 뼈대는 같다. Rollout 때 저장한
          old policy를 기준으로 probability ratio를 만들고, advantage로 actor를
          갱신하되 clipping으로 한 번의 이동을 제한하며 critic은 return target을
          따로 맞춘다.
        </p>
      </div>
      <div className="not-prose my-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            slug: "rlhf",
            label: "RLHF 실행 계약",
            note: "K-way ranking, reward offset, old/reference policy와 PPO-ptx",
          },
          {
            slug: "post-training-rlvr",
            label: "Post-training & RLVR",
            note: "Verifier reward, rollout과 reasoning improvement",
          },
          {
            slug: "open-r1",
            label: "Open-R1 & GRPO",
            note: "Group-relative advantage와 critic 없는 update",
          },
        ].map((item) => (
          <Link
            key={item.slug}
            to={articlePath("ai", item.slug)}
            className="group rounded-md border border-border p-4 transition-colors hover:border-orange-600/30 hover:bg-orange-500/[0.035]"
          >
            <strong className="text-sm">{item.label}</strong>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {item.note}
            </p>
            <span className="mt-4 block text-xs font-bold text-orange-700 dark:text-orange-300">
              이어 읽기 →
            </span>
          </Link>
        ))}
      </div>
      <CapabilityCheck
        items={[
          "Old policy와 current policy를 rollout 생성·update 역할로 구분한다.",
          "Ratio가 1보다 크거나 작을 때 선택 행동 확률 변화를 해석한다.",
          "Advantage 부호별 PPO clipping 경계를 직접 계산한다.",
          "Clipping이 KL trust region을 엄밀히 보장하지 않는 이유를 설명한다.",
          "Terminal mask를 적용해 GAE advantage와 critic target을 뒤에서부터 계산한다.",
          "PPO iteration에서 rollout buffer와 old log-probability가 고정되는 구간을 표시한다.",
          "PPO, DQN, DDPG·TD3, SAC를 action space와 data reuse로 비교한다.",
          "LLM 생성에서 state, action, transition, reward와 KL을 대응시킨다.",
        ]}
      />
      <SourceNotes
        sources={[
          {
            label:
              "Schulman et al. · High-Dimensional Continuous Control Using GAE",
            href: "https://arxiv.org/abs/1506.02438",
            note: "TD residual을 λ로 누적해 policy-gradient variance를 낮추는 GAE 원 논문.",
          },
          {
            label: "Schulman et al. · Proximal Policy Optimization Algorithms",
            href: "https://arxiv.org/abs/1707.06347",
            note: "Clipped surrogate와 여러 epoch mini-batch update를 제안한 PPO 원 논문.",
          },
          {
            label: "OpenAI · Proximal Policy Optimization",
            href: "https://openai.com/index/openai-baselines-ppo/",
            note: "PPO의 설계 의도와 구현 공개 글.",
          },
          {
            label: "OpenAI Spinning Up · Algorithms",
            href: "https://spinningup.openai.com/en/latest/user/algorithms.html",
            note: "VPG→PPO의 on-policy 계보와 DDPG→TD3·SAC off-policy 계보를 비교한다.",
          },
          {
            label: "Lillicrap et al. · Continuous Control with Deep RL",
            href: "https://arxiv.org/abs/1509.02971",
            note: "Deterministic policy gradient, replay와 target network를 결합한 DDPG.",
          },
          {
            label:
              "Fujimoto et al. · Addressing Function Approximation Error in Actor-Critic Methods",
            href: "https://arxiv.org/abs/1802.09477",
            note: "Twin critic, delayed policy update와 target smoothing으로 DDPG를 안정화한 TD3 원 논문.",
          },
          {
            label: "Haarnoja et al. · Soft Actor-Critic",
            href: "https://arxiv.org/abs/1801.01290",
            note: "Maximum-entropy off-policy actor-critic의 원 논문.",
          },
        ]}
      />
    </section>
  );
}

export default function RlPpoContinuousControlArticle() {
  return (
    <>
      <PolicyShift />
      <Ppo />
      <TrainingLoop />
      <ContinuousControl />
      <LlmBridge />
    </>
  );
}
