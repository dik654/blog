import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const primary = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

interface SceneProps {
  id: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}

function Scene({
  id,
  title,
  description,
  labels,
  notes,
  children,
}: SceneProps) {
  const controls = useAnimatedScenes(labels.length, 3200);

  return (
    <VizFrame title={title} description={description} className="my-9">
      <div
        id={id}
        data-viz
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
          Animated lesson · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7">
          {labels[controls.active]}
        </h3>
        <div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">
          {children(controls.active)}
        </div>
        <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
          {notes[controls.active]}
        </p>
        <AnimatedSceneControls labels={labels} {...controls} />
      </div>
    </VizFrame>
  );
}

interface BoxProps {
  x: number;
  y: number;
  w: number;
  label: string;
  detail: string;
  active: boolean;
}

function Box({ x, y, w, label, detail, active }: BoxProps) {
  return (
    <motion.g initial={false} animate={{ opacity: active ? 1 : 0.18 }}>
      <rect
        x={x}
        y={y}
        width={w}
        height="58"
        rx="9"
        fill={
          active
            ? "color-mix(in srgb, var(--primary) 8%, transparent)"
            : "var(--background)"
        }
        stroke={active ? primary : border}
        strokeWidth="1.25"
      />
      <text
        x={x + w / 2}
        y={y + 23}
        textAnchor="middle"
        className="fill-foreground text-[11px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + w / 2}
        y={y + 42}
        textAnchor="middle"
        className="fill-muted-foreground text-[9px]"
      >
        {detail}
      </text>
    </motion.g>
  );
}

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  id: string;
}

function Arrow({ x1, y1, x2, y2, active, id }: ArrowProps) {
  return (
    <g opacity={active ? 1 : 0.18}>
      <defs>
        <marker
          id={id}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill={active ? primary : muted} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? primary : muted}
        strokeWidth="1.25"
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

export function GenerativeMapViz() {
  const labels = [
    "Observation과 condition을 고정합니다",
    "배워야 할 distribution을 정의합니다",
    "직접 계산할 연산을 고릅니다",
    "여러 평가 축에서 release합니다",
  ] as const;
  const notes = [
    "x는 image·token·audio 같은 observation이고 c는 prompt·class 같은 condition입니다.",
    "생성 모델은 한 sample이 아니라 support 전체에 probability 또는 sampling rule을 둡니다.",
    "Likelihood·latent inference·sampling 중 무엇을 tractable하게 만들지 family마다 다릅니다.",
    "NLL·quality·coverage·condition fidelity·latency는 한 숫자로 합치지 않습니다.",
  ] as const;

  return (
    <Scene
      id="generative-map-viz"
      title="Sample에서 model family 선택까지"
      description="생성 문제를 정의하고 필요한 연산과 평가로 좁혀 가는 지도입니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Box x={18} y={68} w={80} label="x · c" detail="observation" active />
          <Arrow
            x1={100}
            y1={97}
            x2={122}
            y2={97}
            active={active >= 1}
            id="gm-1"
          />
          <Box
            x={126}
            y={68}
            w={86}
            label="p(x|c)"
            detail="distribution"
            active={active >= 1}
          />
          <Arrow
            x1={214}
            y1={97}
            x2={236}
            y2={97}
            active={active >= 2}
            id="gm-2"
          />
          <Box
            x={240}
            y={28}
            w={82}
            label="Density"
            detail="likelihood"
            active={active >= 2}
          />
          <Box
            x={240}
            y={112}
            w={82}
            label="Sampler"
            detail="new x"
            active={active >= 2}
          />
          <Arrow
            x1={324}
            y1={58}
            x2={350}
            y2={92}
            active={active >= 3}
            id="gm-3"
          />
          <Arrow
            x1={324}
            y1={141}
            x2={350}
            y2={108}
            active={active >= 3}
            id="gm-4"
          />
          <Box
            x={354}
            y={68}
            w={70}
            label="Release"
            detail="many axes"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function AutoregressiveFactorViz() {
  const labels = [
    "Joint sequence를 놓습니다",
    "첫 token 확률을 계산합니다",
    "Prefix를 조건으로 다음 확률을 곱합니다",
    "Sampling은 token 순서를 기다립니다",
  ] as const;
  const notes = [
    "문장 전체 probability는 하나의 joint distribution입니다.",
    "첫 token은 빈 prefix 또는 시작 기호에 조건화됩니다.",
    "Chain rule은 ordering을 정하면 joint를 conditional product로 정확히 분해합니다.",
    "Training은 알려진 targets를 병렬 점수화할 수 있지만 generation은 앞 token이 나와야 다음 조건이 생깁니다.",
  ] as const;

  return (
    <Scene
      id="autoregressive-factor-viz"
      title="문장 확률을 prefix별 조건부 확률로"
      description="Exact likelihood와 sequential sampling이 같은 factorization에서 갈리는 모습을 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 245"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          {["x₁", "x₂", "x₃", "x₄"].map((token, index) => (
            <g key={token}>
              <motion.circle
                cx={64 + index * 96}
                cy="88"
                r="23"
                fill={
                  index <= active
                    ? "color-mix(in srgb, var(--primary) 10%, transparent)"
                    : "var(--background)"
                }
                stroke={index <= active ? primary : border}
                strokeWidth="1.25"
              />
              <text
                x={64 + index * 96}
                y="93"
                textAnchor="middle"
                className="fill-foreground text-[12px] font-bold"
              >
                {token}
              </text>
              {index > 0 ? (
                <Arrow
                  x1={91 + (index - 1) * 96}
                  y1={88}
                  x2={132 + (index - 1) * 96}
                  y2={88}
                  active={active >= index}
                  id={`ar-${index}`}
                />
              ) : null}
            </g>
          ))}
          <motion.path
            d="M64 151 C116 206 308 206 352 151"
            fill="none"
            stroke={active >= 3 ? primary : border}
            strokeWidth="1.25"
            initial={false}
            animate={{ pathLength: active >= 3 ? 1 : 0.1 }}
          />
          <text
            x="208"
            y="196"
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            training: targets known · sampling: left → right
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function LatentInferenceViz() {
  const labels = [
    "보이지 않는 원인 z를 둡니다",
    "모든 z 설명을 가중해 p(x)를 만듭니다",
    "Encoder q가 posterior를 근사합니다",
    "ELBO와 inference gap을 분리합니다",
  ] as const;
  const notes = [
    "z는 pose·style 같은 생성 원인을 표현할 수 있지만 사람이 붙인 의미와 자동 일치하지 않습니다.",
    "z를 관측하지 않았으므로 가능한 원인의 joint probability를 모두 합하거나 적분합니다.",
    "True posterior가 어렵기 때문에 tractable q(z|x)를 학습합니다.",
    "ELBO는 log evidence 아래의 bound이고 q와 true posterior의 KL이 정확한 gap입니다.",
  ] as const;

  return (
    <Scene
      id="latent-inference-viz"
      title="숨은 원인을 합하고 posterior를 근사하기"
      description="Marginalization과 variational inference를 서로 다른 단계로 보여 줍니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 245"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Box x={22} y={34} w={76} label="z=0" detail="prior .75" active />
          <Box x={22} y={126} w={76} label="z=1" detail="prior .25" active />
          <Arrow
            x1={100}
            y1={63}
            x2={153}
            y2={92}
            active={active >= 1}
            id="lv-1"
          />
          <Arrow
            x1={100}
            y1={155}
            x2={153}
            y2={112}
            active={active >= 1}
            id="lv-2"
          />
          <Box
            x={157}
            y={72}
            w={82}
            label="p(x)"
            detail="sum over z"
            active={active >= 1}
          />
          <Arrow
            x1={241}
            y1={101}
            x2={272}
            y2={101}
            active={active >= 2}
            id="lv-3"
          />
          <Box
            x={276}
            y={72}
            w={68}
            label="q(z|x)"
            detail="encoder"
            active={active >= 2}
          />
          <Arrow
            x1={346}
            y1={101}
            x2={366}
            y2={101}
            active={active >= 3}
            id="lv-4"
          />
          <Box
            x={370}
            y={72}
            w={54}
            label="ELBO"
            detail="+ gap"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function FlowChangeViz() {
  const labels = [
    "쉬운 base density를 둡니다",
    "가역 함수로 좌표를 옮깁니다",
    "늘어난 volume만큼 density를 보정합니다",
    "Inverse·sample·likelihood를 모두 검사합니다",
  ] as const;
  const notes = [
    "Gaussian z처럼 sample과 density 계산이 쉬운 출발점을 씁니다.",
    "f는 z와 x 사이를 양방향으로 오갈 수 있는 bijection이어야 합니다.",
    "Probability mass는 보존되므로 공간이 두 배 늘면 단위 volume density는 절반이 됩니다.",
    "Exact likelihood의 대가는 같은 dimension·invertibility·tractable Jacobian 제약입니다.",
  ] as const;

  return (
    <Scene
      id="flow-change-viz"
      title="고무판을 늘려도 probability mass는 보존됩니다"
      description="Base cell의 변형과 Jacobian density correction을 도형으로 확인합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 245"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <motion.rect
            x="36"
            y="62"
            width="76"
            height="76"
            rx="8"
            fill="color-mix(in srgb, var(--primary) 10%, transparent)"
            stroke={primary}
            strokeWidth="1.25"
          />
          <text
            x="74"
            y="103"
            textAnchor="middle"
            className="fill-foreground text-[11px] font-bold"
          >
            base z
          </text>
          <Arrow
            x1={114}
            y1={100}
            x2={175}
            y2={100}
            active={active >= 1}
            id="fl-1"
          />
          <motion.rect
            x="180"
            y="48"
            rx="12"
            height="104"
            fill="color-mix(in srgb, var(--primary) 8%, transparent)"
            stroke={active >= 1 ? primary : border}
            strokeWidth="1.25"
            initial={false}
            animate={{
              width: active >= 1 ? 150 : 76,
              opacity: active >= 1 ? 1 : 0.2,
            }}
          />
          <text
            x="255"
            y="103"
            textAnchor="middle"
            className="fill-foreground text-[11px] font-bold"
          >
            data x=f(z)
          </text>
          <Box
            x={160}
            y={174}
            w={120}
            label="Jacobian"
            detail="volume correction"
            active={active >= 2}
          />
          <Box
            x={304}
            y={174}
            w={112}
            label="Receipt"
            detail="inverse · log p"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function AdversarialRatioViz() {
  const labels = [
    "Real sample과 generated sample을 따로 봅니다",
    "한 위치의 두 density를 비교합니다",
    "Discriminator가 density ratio를 출력합니다",
    "Finite training 경계를 함께 기록합니다",
  ] as const;
  const notes = [
    "GAN은 generator density를 직접 정규화하지 않고 두 source의 sample을 비교합니다.",
    "같은 x에서 real mass와 generated mass가 얼마나 겹치는지 묻습니다.",
    "이상적 D*는 real density가 두 density 합에서 차지하는 비율입니다.",
    "D=0.5가 distribution equality를 뜻하려면 capacity와 pointwise optimum 전제가 필요합니다.",
  ] as const;

  return (
    <Scene
      id="adversarial-ratio-viz"
      title="두 sample source에서 density-ratio signal까지"
      description="GAN의 비교 신호를 score나 likelihood와 섞지 않고 따로 만듭니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 245"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          {[0, 1, 2].map((index) => (
            <circle
              key={`real-${index}`}
              cx={46 + index * 23}
              cy={55 + index * 8}
              r="7"
              fill={primary}
            />
          ))}
          {[0, 1, 2].map((index) => (
            <rect
              key={`generated-${index}`}
              x={40 + index * 23}
              y={125 - index * 7}
              width="14"
              height="14"
              rx="3"
              fill="none"
              stroke={primary}
              strokeWidth="1.25"
            />
          ))}
          <text
            x="78"
            y="180"
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            two sample sources
          </text>
          <Arrow
            x1={118}
            y1={96}
            x2={160}
            y2={96}
            active={active >= 1}
            id="gan-1"
          />
          <Box
            x={164}
            y={66}
            w={98}
            label="pᵣ(x) : p𝓰(x)"
            detail="local ratio"
            active={active >= 1}
          />
          <Arrow
            x1={264}
            y1={96}
            x2={292}
            y2={96}
            active={active >= 2}
            id="gan-2"
          />
          <Box
            x={296}
            y={66}
            w={116}
            label="D*(x)"
            detail="real / total"
            active={active >= 2}
          />
          <Box
            x={256}
            y={166}
            w={156}
            label="capacity · optimum"
            detail="release boundary"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function ScoreDiffusionViz() {
  const labels = [
    "한 density의 local score를 정의합니다",
    "Gaussian에서는 원점 방향을 계산합니다",
    "Noisy sample과 injected noise를 연결합니다",
    "Minus와 noise scale로 reverse direction을 만듭니다",
  ] as const;
  const notes = [
    "Score는 normalized density 값이 아니라 log density가 가장 빨리 증가하는 방향입니다.",
    "Standard Gaussian의 score −x는 x=2에서 왼쪽인 −2를 가리킵니다.",
    "VP forward process는 clean signal과 Gaussian noise를 알려진 scale로 섞습니다.",
    "Predicted noise의 반대 방향을 취하고 noise standard deviation으로 나누면 score parameterization이 됩니다.",
  ] as const;

  return (
    <Scene
      id="score-diffusion-viz"
      title="Local score에서 diffusion reverse direction까지"
      description="왜 predicted noise 앞에 minus가 붙고 noise scale로 나누는지 장면별로 확인합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 245"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="38"
            y1="92"
            x2="176"
            y2="92"
            stroke={border}
            strokeWidth="1.25"
          />
          <circle cx="107" cy="92" r="6" fill={primary} />
          <text
            x="107"
            y="116"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            density peak
          </text>
          <circle
            cx="162"
            cy="92"
            r="8"
            fill="var(--background)"
            stroke={primary}
            strokeWidth="1.25"
          />
          <Arrow
            x1={157}
            y1={72}
            x2={118}
            y2={72}
            active={active >= 1}
            id="score-1"
          />
          <text
            x="139"
            y="58"
            textAnchor="middle"
            className="fill-foreground text-[10px] font-bold"
          >
            score = −x
          </text>
          <Arrow
            x1={186}
            y1={92}
            x2={226}
            y2={92}
            active={active >= 2}
            id="score-2"
          />
          <Box
            x={230}
            y={34}
            w={84}
            label="xₜ"
            detail="noisy point"
            active={active >= 2}
          />
          <Box
            x={230}
            y={126}
            w={84}
            label="εθ"
            detail="noise guess"
            active={active >= 2}
          />
          <Arrow
            x1={316}
            y1={63}
            x2={350}
            y2={92}
            active={active >= 3}
            id="score-3"
          />
          <Arrow
            x1={316}
            y1={155}
            x2={350}
            y2={108}
            active={active >= 3}
            id="score-4"
          />
          <Box
            x={354}
            y={70}
            w={70}
            label="sθ"
            detail="−εθ / σₜ"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}
