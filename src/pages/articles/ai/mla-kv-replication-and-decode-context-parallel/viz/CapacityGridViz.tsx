import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #trace — Kimi K2.5 8×RTX PRO 6000에서 KV dtype × DCP 네 조합의 token 용량(rtx6kpro 측정)과 200K 대화 수.
 * 행 = 설정 하나, 막대 길이 = 노드가 담는 token 수(선형 축척), 눈금 하나 = 200,000 token 대화 하나.
 * 한 mechanism: 숫자 byte를 절반으로 줄이면 약 2배, token 축으로 8장에 나누면 약 8배이고 두 효과는 곱해진다.
 */
const W = 360;
const LEFT = 92;
const BAR_MAX = W - LEFT - 8;
const MAX_TOKENS = 3_621_504;
const AGENT = 200_000;
const ROW_H = 40;
const TOP = 10;
const H = TOP + 4 * ROW_H + 18;

interface Row {
  label: string;
  sub: string;
  tokens: number;
  shown: string;
  color: string;
}

const ROWS: readonly Row[] = [
  { label: "2 byte · 나눔 없음", sub: "BF16 · DCP1", tokens: 190_000, shown: "약 190,000", color: "#64748b" },
  { label: "1 byte · 나눔 없음", sub: "FP8 · DCP1", tokens: 449_600, shown: "약 449,600", color: "#d97706" },
  { label: "2 byte · 8장에 나눔", sub: "BF16 · DCP8", tokens: 1_500_000, shown: "약 1,500,000", color: "#2563eb" },
  { label: "1 byte · 8장에 나눔", sub: "FP8 · DCP8", tokens: 3_621_504, shown: "3,621,504", color: "#16a34a" },
];

const SCENES = [
  { label: "출발점", visible: 1, summary: "200K 대화 0.95개", note: "숫자당 2 byte, 나눔 없음은 약 19만 token입니다. token 하나가 70,272 byte이고 장마다 같은 기록을 들므로, 한 장의 자리 약 13.4 GB를 70,272 byte로 나눈 값과 같습니다." },
  { label: "숫자를 1 byte로", visible: 2, summary: "약 2.4배 · 2개", note: "1 byte로 저장하면 약 449,600 token입니다. byte만 보면 정확히 2배여야 하지만 측정값은 약 2.4배입니다. 두 측정의 메모리 설정이 같았는지 기록이 없어, 남는 차이는 설정 차이로 봅니다." },
  { label: "token을 8장에", visible: 3, summary: "약 7.9배 · 7개", note: "2 byte 그대로 token을 8장에 나누면 약 150만 token입니다. 장마다 같은 기록을 들던 낭비가 사라져 거의 정확히 8배가 됩니다." },
  { label: "둘 다", visible: 4, summary: "약 19배 · 18개", note: "1 byte와 8장 나눔을 함께 쓰면 3,621,504 token, 200K 대화 18개입니다. 2배와 8배가 곱해진 크기이고, 1 byte·나눔 없음 대비로는 약 8.05배입니다." },
] as const;

const barW = (tokens: number) => (tokens / MAX_TOKENS) * BAR_MAX;

export default function CapacityGridViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const agentTicks = Math.floor(MAX_TOKENS / AGENT);

  return (
    <VizFrame
      eyebrow="노드가 담는 token 수"
      title="byte를 절반으로 줄인 효과와 8장에 나눈 효과는 곱해집니다"
      description="막대는 노드 하나가 담는 token 수이고, 위 눈금 하나가 200,000 token 대화 하나입니다. 네 막대 모두 커뮤니티 측정값입니다."
      note="Kimi K2.5 INT4, 8×RTX PRO 6000, vLLM TRITON_MLA 기준 rtx6kpro 위키 값(현장 경험)입니다. BF16 행은 gpu-util 설정이 적혀 있지 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="KV 숫자 크기와 token 나눔 네 조합의 token 용량"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <StableSceneStack
            active={scenes.active}
            scenes={SCENES.map((s) => (
              <div key={s.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-base font-bold">{s.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">{s.summary}</span>
              </div>
            ))}
          />
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[30rem]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Array.from({ length: agentTicks + 1 }, (_, i) => (
              <line key={`tick${i}`} x1={LEFT + (i * AGENT * BAR_MAX) / MAX_TOKENS} x2={LEFT + (i * AGENT * BAR_MAX) / MAX_TOKENS} y1={TOP - 4} y2={TOP + 4 * ROW_H - 6} stroke="#cbd5e1" strokeWidth={0.5} />
            ))}
            {ROWS.map((row, index) => {
              const y = TOP + index * ROW_H;
              const on = index < scene.visible;
              const current = index === scene.visible - 1;
              return (
                <g key={row.sub}>
                  <text x={0} y={y + 12} fontSize={9} fontWeight={700} fill={on ? "currentColor" : "#94a3b8"}>
                    {row.label}
                  </text>
                  <text x={0} y={y + 24} fontSize={8} fill="#64748b">
                    {row.sub}
                  </text>
                  <rect x={LEFT} y={y + 4} width={BAR_MAX} height={16} rx={2} fill="none" stroke="#e2e8f0" strokeWidth={0.75} />
                  <motion.rect
                    key={`bar-${scenes.active}-${index}`}
                    x={LEFT}
                    y={y + 4}
                    height={16}
                    rx={2}
                    fill={row.color}
                    initial={{ width: current && !reduced ? 0 : on ? barW(row.tokens) : 0 }}
                    animate={{ width: on ? barW(row.tokens) : 0, opacity: current ? 0.85 : 0.5 }}
                    transition={{ duration: reduced ? 0 : 0.6 }}
                  />
                  <text
                    x={on && barW(row.tokens) > 120 ? LEFT + 4 : LEFT + barW(row.tokens) + 4}
                    y={y + 32}
                    fontSize={8}
                    fill={on ? "currentColor" : "transparent"}
                  >
                    {`${row.shown} token · ${(row.tokens / AGENT).toFixed(row.tokens < AGENT ? 2 : 1)} 대화`}
                  </text>
                </g>
              );
            })}
            <text x={LEFT} y={H - 2} fontSize={8} fill="#64748b">
              눈금 = 200,000 token 대화 1개
            </text>
          </svg>
          <StableSceneStack
            active={scenes.active}
            className="mt-2"
            scenes={SCENES.map((s) => (
              <p key={s.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
                {s.note}
              </p>
            ))}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
