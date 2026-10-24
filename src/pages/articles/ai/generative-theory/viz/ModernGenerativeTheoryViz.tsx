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
      <span id={id} className="scroll-mt-24" />
      <div
        id={controls.playbackId}
        data-viz
        data-viz-scene={id}
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <div data-viz-live-only>
          <p className="text-[11px] font-black tracking-[.12em] text-primary">
            장면 · {String(controls.active + 1).padStart(2, "0")}
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
        <ol className="static-reading-only space-y-3 text-sm leading-6">
          {labels.map((label, index) => (
            <li key={label}>
              <strong>{index + 1}. {label}</strong>
              <span className="mt-1 block text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
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
    "관측값과 조건을 고정합니다",
    "배워야 할 확률 분포를 정의합니다",
    "직접 계산할 연산을 고릅니다",
    "서로 다른 기준으로 결과를 평가합니다",
  ] as const;
  const notes = [
    "x는 이미지·토큰·오디오 같은 관측값이고 c는 프롬프트·분류값 같은 조건입니다.",
    "생성 모델은 표본 하나가 아니라 가능한 값 전체에 확률 또는 표본 추출 규칙을 둡니다.",
    "우도·잠재변수 추론·표본 추출 중 어느 계산을 쉽게 만들지가 계열마다 다릅니다.",
    "음의 로그 우도·품질·포괄 범위·조건 충실도·지연 시간은 한 숫자로 합치지 않습니다.",
  ] as const;

  return (
    <Scene
      id="generative-map-viz"
      title="표본에서 생성 모델 계열 선택까지"
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
          <Box x={18} y={68} w={80} label="x · c" detail="관측·조건" active />
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
            detail="가능성 분포"
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
            label="밀도"
            detail="확률 계산"
            active={active >= 2}
          />
          <Box
            x={240}
            y={112}
            w={82}
            label="표본 추출"
            detail="새 관측값"
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
            label="평가"
            detail="여러 기준"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function AutoregressiveFactorViz() {
  const labels = [
    "문장 전체의 결합확률을 놓습니다",
    "첫 토큰 확률을 계산합니다",
    "앞 토큰을 조건으로 다음 확률을 곱합니다",
    "생성은 앞 토큰이 나올 때까지 기다립니다",
  ] as const;
  const notes = [
    "문장 전체의 확률은 하나의 결합분포입니다.",
    "첫 토큰은 빈 앞부분 또는 시작 기호를 조건으로 삼습니다.",
    "연쇄 법칙은 순서를 정하면 결합확률을 조건부 확률의 곱으로 정확히 나눕니다.",
    "학습 때는 정답 토큰을 병렬로 평가할 수 있지만, 생성 때는 앞 토큰이 나와야 다음 조건이 생깁니다.",
  ] as const;

  return (
    <Scene
      id="autoregressive-factor-viz"
      title="문장 확률을 앞부분별 조건부 확률로"
      description="정확한 우도 계산과 순차 생성이 같은 분해에서 갈리는 모습을 봅니다."
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
            학습: 정답 앞부분을 앎 · 생성: 왼쪽부터 순서대로
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
    "추론기 q가 사후분포를 근사합니다",
    "ELBO와 근사 오차를 분리합니다",
  ] as const;
  const notes = [
    "z는 자세·스타일 같은 생성 원인을 표현할 수 있지만 사람이 붙인 의미와 자동으로 일치하지는 않습니다.",
    "z를 관측하지 않았으므로 가능한 원인의 결합확률을 모두 합하거나 적분합니다.",
    "실제 사후분포를 계산하기 어려워 계산 가능한 q(z|x)를 학습합니다.",
    "ELBO는 로그 증거의 하한이며, q와 실제 사후분포 사이의 KL이 정확한 차이입니다.",
  ] as const;

  return (
    <Scene
      id="latent-inference-viz"
      title="숨은 원인을 합하고 사후분포를 근사하기"
      description="주변화와 변분 추론을 서로 다른 단계로 보여 줍니다."
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
          <Box x={22} y={34} w={76} label="z=0" detail="사전확률 .75" active />
          <Box x={22} y={126} w={76} label="z=1" detail="사전확률 .25" active />
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
            detail="z를 모두 합산"
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
            detail="추론기"
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
            detail="근사 격차"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function FlowChangeViz() {
  const labels = [
    "계산하기 쉬운 기준 분포를 둡니다",
    "가역 함수로 좌표를 옮깁니다",
    "늘어난 부피만큼 밀도를 보정합니다",
    "역변환·표본·우도를 모두 검사합니다",
  ] as const;
  const notes = [
    "정규분포 z처럼 표본과 밀도 계산이 쉬운 출발점을 씁니다.",
    "f는 z와 x 사이를 양방향으로 오갈 수 있는 일대일 대응이어야 합니다.",
    "확률 질량은 보존되므로 공간이 두 배 늘면 단위 부피당 밀도는 절반이 됩니다.",
    "정확한 우도를 얻는 대신 차원 유지·가역성·계산 가능한 야코비안이라는 제약을 받습니다.",
  ] as const;

  return (
    <Scene
      id="flow-change-viz"
      title="고무판을 늘려도 확률 질량은 보존됩니다"
      description="기준 영역의 변형과 야코비안 밀도 보정을 도형으로 확인합니다."
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
            기준 z
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
            관측 x=f(z)
          </text>
          <Box
            x={160}
            y={174}
            w={120}
            label="Jacobian"
            detail="부피 보정"
            active={active >= 2}
          />
          <Box
            x={304}
            y={174}
            w={112}
            label="검증"
            detail="역변환·log p"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function AdversarialRatioViz() {
  const labels = [
    "실제 표본과 생성 표본을 따로 봅니다",
    "한 위치의 두 밀도를 비교합니다",
    "판별기가 밀도비 신호를 냅니다",
    "유한한 학습의 해석 한계를 함께 봅니다",
  ] as const;
  const notes = [
    "GAN은 생성기 밀도를 직접 정규화하지 않고 두 출처의 표본을 비교합니다.",
    "같은 x에서 실제 표본과 생성 표본의 밀도가 얼마나 겹치는지 묻습니다.",
    "이상적인 D*는 실제 밀도가 두 밀도의 합에서 차지하는 비율입니다.",
    "D=0.5가 두 분포의 일치를 뜻하려면 충분한 모델 용량과 각 점에서의 최적화가 전제되어야 합니다.",
  ] as const;

  return (
    <Scene
      id="adversarial-ratio-viz"
      title="두 표본 출처에서 밀도비 신호까지"
      description="GAN의 비교 신호를 점수 함수나 우도와 섞지 않고 따로 만듭니다."
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
            두 표본 출처
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
            detail="점별 비율"
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
            detail="실제 / 전체"
            active={active >= 2}
          />
          <Box
            x={256}
            y={166}
            w={156}
            label="용량 · 최적점"
            detail="해석 경계"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function ScoreDiffusionViz() {
  const labels = [
    "밀도가 커지는 국소 방향을 정의합니다",
    "정규분포에서는 중심 방향을 계산합니다",
    "잡음이 섞인 표본과 주입한 잡음을 연결합니다",
    "부호와 잡음 크기를 바꿔 복원 방향을 만듭니다",
  ] as const;
  const notes = [
    "점수 함수는 정규화된 밀도값이 아니라 로그 밀도가 가장 빠르게 증가하는 방향입니다.",
    "표준 정규분포의 점수 −x는 x=2에서 왼쪽인 −2를 가리킵니다.",
    "정방향 과정은 깨끗한 신호와 정규 잡음을 정해진 크기로 섞습니다.",
    "예측한 잡음의 반대 방향을 취하고 잡음 표준편차로 나누면 점수 함수 표현이 됩니다.",
  ] as const;

  return (
    <Scene
      id="score-diffusion-viz"
      title="국소 점수에서 확산 복원 방향까지"
      description="왜 예측 잡음의 부호를 바꾸고 잡음 크기로 나누는지 장면별로 확인합니다."
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
            밀도 최대점
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
            detail="노이즈 표본"
            active={active >= 2}
          />
          <Box
            x={230}
            y={126}
            w={84}
            label="εθ"
            detail="노이즈 추정"
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
