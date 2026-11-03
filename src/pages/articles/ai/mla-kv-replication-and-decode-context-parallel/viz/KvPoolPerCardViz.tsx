import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { ModuleBox } from "@/components/viz/boxes";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #overview — 8장 노드에서 한 장의 KV 자리가 200K 대화를 몇 개 담는가.
 * 열 하나 = GPU 한 장의 KV 자리(약 16 GB를 세로 150px로 확대). 칸 = 대화 하나의 기록(색이 같으면 같은 대화).
 * 한 mechanism: 같은 기록이 8장 모두에 통째로 놓이면 자리는 한 장 몫이고, token을 8장에 나눠 담으면 조각이 1/8이 된다.
 * 수치: 70,272 B/token(BF16)·35,136 B/token(FP8) × 200,000 token, 장당 자리는 rtx6kpro 측정 token 수에서 역산(13.4·15.9 GB).
 */
const W = 360;
const COLS = 8;
const COL_W = 34;
const GAP = (W - COLS * COL_W) / (COLS + 1);
const POOL_TOP = 60;
const POOL_H = 150;
const POOL_GB = 16;
const PX_PER_GB = POOL_H / POOL_GB;
const POOL_BOTTOM = POOL_TOP + POOL_H;
const H = POOL_BOTTOM + 22;

const AGENT_COLORS = ["#2563eb", "#d97706", "#16a34a", "#7c3aed", "#db2777", "#0891b2"];

interface Block {
  gb: number;
  color: string;
}

interface Scene {
  label: string;
  summary: string;
  /** 장당 자리 상한(측정값 역산). 없으면 선을 그리지 않는다. */
  limitGb: number | null;
  limitLabel: string;
  blocks: (gpu: number) => Block[];
  footer: (gpu: number) => string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "가중치는 8장에 나뉩니다",
    summary: "장마다 약 74 GB · 기록 0개",
    limitGb: null,
    limitLabel: "",
    blocks: () => [],
    footer: () => "비어 있음",
    note: "체크포인트 595.2 GB를 8장이 나눠 들면 장마다 약 74 GB입니다(균등 분배 가정). 96 GB 카드에서 이 몫과 실행용 공간을 빼고 남은 약 13~16 GB가 대화 기록을 담는 자리입니다.",
  },
  {
    label: "200K 대화 하나 · 숫자당 2 byte",
    summary: "장마다 같은 14.1 GB · 0.95개",
    limitGb: 13.35,
    limitLabel: "자리 13.4 GB",
    blocks: () => [{ gb: 14.05, color: AGENT_COLORS[0] }],
    footer: () => "사본",
    note: "token 하나의 기록 70,272 byte에 200,000 token을 곱하면 14.1 GB입니다. 이 기록이 8장 모두에 통째로 놓입니다. 측정된 자리는 약 19만 token이라 200K 대화 하나도 끝까지 담지 못합니다.",
  },
  {
    label: "숫자당 1 byte로 줄이기",
    summary: "장마다 같은 7.0 GB × 2 · 2개",
    limitGb: 15.9,
    limitLabel: "자리 15.9 GB",
    blocks: () => [
      { gb: 7.03, color: AGENT_COLORS[0] },
      { gb: 7.03, color: AGENT_COLORS[1] },
    ],
    footer: () => "사본",
    note: "숫자 하나를 1 byte로 저장하면 대화 하나가 7.0 GB라 장마다 두 개가 들어갑니다. 그래도 8장이 같은 두 대화를 똑같이 들고 있으므로 노드 전체가 받는 대화는 두 개뿐입니다.",
  },
  {
    label: "token을 8장에 나눠 담기",
    summary: "장마다 서로 다른 1/8 조각 · 18개",
    limitGb: 15.9,
    limitLabel: "자리 15.9 GB",
    blocks: () => Array.from({ length: 18 }, (_, index) => ({ gb: 0.879, color: AGENT_COLORS[index % AGENT_COLORS.length] })),
    footer: (gpu) => `${gpu + 1}/8 조각`,
    note: "대화마다 token을 8장에 번갈아 나누면 한 장이 드는 몫은 0.88 GB입니다. 같은 자리에 18개 대화의 조각이 들어가고, 장마다 서로 다른 조각이라 중복이 없습니다. 측정값 3,621,504 token을 200,000으로 나눈 값과 같습니다.",
  },
];

const colX = (g: number) => GAP + g * (COL_W + GAP);
const yOf = (gb: number) => POOL_BOTTOM - gb * PX_PER_GB;

export default function KvPoolPerCardViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600, { loop: false });
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="GPU 한 장의 KV 자리"
      title="8장을 꽂아도 같은 기록이 장마다 놓이면 담는 양은 한 장 몫입니다"
      description="열은 GPU 한 장의 대화 기록 자리를 확대한 것입니다. 색이 같은 칸은 같은 대화의 기록이고 점선은 측정값에서 역산한 자리의 끝입니다."
      note="Kimi K2.5, 8×RTX PRO 6000, 200K token 대화 기준입니다. 자리 크기는 커뮤니티 측정 token 수로 역산했습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GPU 8장의 KV 자리에 200K 대화가 몇 개 들어가는지"
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
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[23rem]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Array.from({ length: COLS }, (_, g) => {
              let cursor = 0;
              return (
                <g key={`gpu${g}`}>
                  <ModuleBox x={colX(g)} y={4} w={COL_W} h={24} label={`G${g}`} color="#64748b" />
                  <text x={colX(g) + COL_W / 2} y={44} textAnchor="middle" fontSize={8} fill="#64748b">
                    가중치 74
                  </text>
                  <rect
                    x={colX(g)}
                    y={POOL_TOP}
                    width={COL_W}
                    height={POOL_H}
                    rx={2}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth={0.75}
                    strokeDasharray="2 2"
                  />
                  {scene.blocks(g).map((block, index) => {
                    const y = yOf(cursor + block.gb);
                    const h = block.gb * PX_PER_GB;
                    cursor += block.gb;
                    return (
                      <motion.rect
                        key={`${scenes.active}-${g}-${index}`}
                        x={colX(g) + 1}
                        y={y + 0.5}
                        width={COL_W - 2}
                        height={Math.max(h - 1, 1)}
                        rx={1.5}
                        fill={block.color}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.78 }}
                        transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : g * 0.04 + index * 0.02 }}
                      />
                    );
                  })}
                  <text x={colX(g) + COL_W / 2} y={POOL_BOTTOM + 14} textAnchor="middle" fontSize={8} fill="currentColor">
                    {scene.footer(g)}
                  </text>
                </g>
              );
            })}
            {scene.limitGb !== null ? (
              <g>
                <line
                  x1={GAP - 4}
                  x2={W - GAP + 4}
                  y1={yOf(scene.limitGb)}
                  y2={yOf(scene.limitGb)}
                  stroke="#dc2626"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <text x={W - GAP} y={POOL_TOP - 3} textAnchor="end" fontSize={8} fontWeight={700} fill="#dc2626">
                  {`빨간 점선 = ${scene.limitLabel}`}
                </text>
              </g>
            ) : null}
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
