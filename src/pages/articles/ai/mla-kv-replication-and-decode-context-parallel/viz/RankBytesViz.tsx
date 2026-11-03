import { motion } from "framer-motion";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { ModuleBox } from "@/components/viz/boxes";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #small-case — 층 1개, token 4개, BF16에서 rank마다 드는 byte.
 * 열 = rank, 행 = token 0~3, 칸 폭 = 그 칸의 byte(512 B 또는 1,152 B를 같은 축척으로).
 * 한 mechanism: head 축으로 나눌 수 있으면 rank 몫이 줄고, 나눌 head가 하나면 rank 몫은 전체와 같다. token 축으로 나누면 다시 줄어든다.
 */
const W = 360;
const TOP = 34;
const ROW_H = 20;
const ROWS = 4;
const SCALE = 66 / 1152;
const GQA_W = 512 * SCALE;
const LATENT_W = 1152 * SCALE;
const H = TOP + ROWS * (ROW_H + 4) + 30;

const HEAD_COLORS = ["#2563eb", "#16a34a", "#d97706", "#7c3aed"];
const LATENT = "#475569";

interface Scene {
  label: string;
  ranks: number;
  cellW: number;
  color: (rank: number) => string;
  holds: (rank: number, token: number) => boolean;
  cellText: (rank: number) => string;
  perRank: string;
  summary: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "KV head 4개를 4장에",
    ranks: 4,
    cellW: GQA_W,
    color: (r) => HEAD_COLORS[r],
    holds: () => true,
    cellText: (r) => `h${r}`,
    perRank: "2,048 B",
    summary: "장마다 2,048 B · 중복 없음",
    note: "head 하나의 K와 V는 128개씩, 2 byte라 token 하나에 512 byte입니다. rank마다 다른 head를 맡아 token 4개면 2,048 byte이고, 네 장을 합친 8,192 byte가 모두 다른 기록입니다.",
  },
  {
    label: "공유 묶음 576개를 4장에",
    ranks: 4,
    cellW: LATENT_W,
    color: () => LATENT,
    holds: () => true,
    cellText: () => "c",
    perRank: "4,608 B",
    summary: "장마다 4,608 B · 같은 기록 4벌",
    note: "모든 head가 함께 읽는 숫자 576개는 token 하나에 1,152 byte입니다. 나눌 head가 하나뿐이라 네 장이 같은 1,152 byte를 token마다 들고 있어 장마다 4,608 byte입니다. 모델 전체로는 작은 쪽이 장 단위로는 더 큽니다.",
  },
  {
    label: "token을 4장에 나눠 담기",
    ranks: 4,
    cellW: LATENT_W,
    color: () => LATENT,
    holds: (r, t) => r === t,
    cellText: () => "c",
    perRank: "1,152 B",
    summary: "장마다 1,152 B · 중복 없음",
    note: "token 0은 rank 0, token 1은 rank 1에 두는 식으로 번갈아 나누면 장마다 token 하나, 1,152 byte만 남습니다. 네 장 합계 4,608 byte가 서로 다른 기록입니다.",
  },
  {
    label: "KV head 4개를 8장에",
    ranks: 8,
    cellW: GQA_W,
    color: (r) => HEAD_COLORS[Math.floor(r / 2)],
    holds: () => true,
    cellText: (r) => `h${Math.floor(r / 2)}`,
    perRank: "2,048 B",
    summary: "장마다 2,048 B · 같은 기록 2벌",
    note: "GPU를 8장으로 늘려도 head는 4개라 이웃한 두 장이 같은 head를 듭니다. 장마다 2,048 byte로 TP4와 같고, 8장 합계 16,384 byte 중 서로 다른 기록은 절반입니다.",
  },
];

export default function RankBytesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const colW = Math.max(scene.cellW, 30);
  const gap = (W - 30 - scene.ranks * colW) / (scene.ranks + 1);
  const colX = (r: number) => 30 + gap + r * (colW + gap);

  return (
    <VizFrame
      eyebrow="rank마다 드는 byte"
      title="모델 전체로 작은 기록이 GPU 한 장에서는 더 클 수 있습니다"
      description="층 1개, token 4개, 숫자당 2 byte입니다. 열은 rank, 행은 token이고 칸 폭은 그 칸의 byte에 비례합니다."
      note="head 수 4와 head 폭 128은 작은 사례용 가정입니다. 576은 Kimi K2.5 config의 512 + 64입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="rank마다 드는 KV byte 비교"
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
            {Array.from({ length: ROWS }, (_, t) => (
              <text key={`t${t}`} x={0} y={TOP + t * (ROW_H + 4) + ROW_H - 6} fontSize={9} fill="#64748b">
                {`tok ${t}`}
              </text>
            ))}
            {Array.from({ length: scene.ranks }, (_, r) => (
              <g key={`${scenes.active}-r${r}`}>
                <ModuleBox x={colX(r)} y={4} w={colW} h={22} label={scene.ranks > 4 ? `r${r}` : `rank ${r}`} color="#64748b" />
                {Array.from({ length: ROWS }, (_, t) => {
                  const held = scene.holds(r, t);
                  const y = TOP + t * (ROW_H + 4);
                  const x = colX(r) + (colW - scene.cellW) / 2;
                  return (
                    <g key={`c${r}-${t}`}>
                      <rect x={x} y={y} width={scene.cellW} height={ROW_H} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 2" />
                      <motion.rect
                        x={x}
                        y={y}
                        width={scene.cellW}
                        height={ROW_H}
                        rx={2}
                        fill={scene.color(r)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: held ? 0.8 : 0 }}
                        transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : r * 0.05 + t * 0.03 }}
                      />
                      {held ? (
                        <text x={x + scene.cellW / 2} y={y + ROW_H - 6} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">
                          {scene.cellText(r)}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
                <text x={colX(r) + colW / 2} y={H - 8} textAnchor="middle" fontSize={scene.ranks > 4 ? 8 : 10} fontWeight={700} fill="currentColor">
                  {scene.perRank}
                </text>
              </g>
            ))}
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
        <StaticSceneList labels={SCENES.map((s) => s.label)} notes={SCENES.map((s) => s.note)} />
      </div>
    </VizFrame>
  );
}
