import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { ModuleBox } from "@/components/viz/boxes";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #parallel-budget — tensor parallel 8장에서 KV가 어떻게 놓이는가.
 * 열 하나 = GPU 한 장, 세로 8칸 = 같은 요청의 token 8개(t0~t7). 칸 색 = 어떤 KV head(또는 latent)의 기록인지.
 * 한 mechanism: 나눌 KV head가 TP보다 적으면 같은 기록이 여러 장에 복제되고, MLA는 head가 1개라 8장 모두 같은 기록을 든다.
 * DCP는 head 대신 token 축을 나눠 복제를 없앤다.
 */
const W = 360;
const COLS = 8;
const COL_W = 38;
const GAP = (W - COLS * COL_W) / (COLS + 1);
const HEAD_Y = 4;
const CELL_Y = 34;
const CELL_H = 15;
const ROWS = 8;
const H = CELL_Y + ROWS * (CELL_H + 2) + 4;

const PALETTE = ["#2563eb", "#16a34a", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#65a30d", "#dc2626"];
const LATENT = "#475569";

interface Scene {
  label: string;
  /** GPU i가 든 기록의 색 */
  color: (gpu: number) => string;
  /** GPU i가 token 구간 r을 들고 있는가 */
  holds: (gpu: number, row: number) => boolean;
  cellText: (gpu: number) => string;
  summary: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "GQA · KV head 8",
    color: (g) => PALETTE[g],
    holds: () => true,
    cellText: (g) => `h${g}`,
    summary: "서로 다른 기록 8벌 · 복제 1×",
    note: "KV head가 8개이고 GPU도 8장이면 장마다 head 하나씩 맡습니다. 같은 기록이 두 장에 있지 않으므로 8장의 KV 공간을 모두 서로 다른 기록에 씁니다.",
  },
  {
    label: "GQA · KV head 4",
    color: (g) => PALETTE[Math.floor(g / 2)],
    holds: () => true,
    cellText: (g) => `h${Math.floor(g / 2)}`,
    summary: "서로 다른 기록 4벌 · 복제 2×",
    note: "KV head가 4개뿐인데 GPU가 8장이면 이웃한 두 장이 같은 head를 함께 듭니다. 같은 기록이 두 벌씩 있으므로 실제 담을 수 있는 token은 head 8개일 때의 절반입니다.",
  },
  {
    label: "MLA · latent 1개",
    color: () => LATENT,
    holds: () => true,
    cellText: () => "c",
    summary: "서로 다른 기록 1벌 · 복제 8×",
    note: "MLA는 모든 query head가 latent 하나(576차원)를 함께 읽어 나눌 KV head가 1개뿐입니다. 8장 모두 같은 latent 기록을 통째로 들고 있어 KV 용량은 GPU 한 장 몫입니다.",
  },
  {
    label: "MLA + DCP 8",
    color: () => LATENT,
    holds: (g, r) => g === r,
    cellText: (g) => `t${g}`,
    summary: "token을 8장에 번갈아 · 복제 1×",
    note: "decode context parallel은 token 축을 나눕니다. vLLM 기본값은 token i를 GPU i % 8에 둡니다. 각 GPU가 부분 attention을 계산하고 층마다 결과를 합치는 통신이 붙습니다.",
  },
];

const colX = (g: number) => GAP + g * (COL_W + GAP);
const rowY = (r: number) => CELL_Y + r * (CELL_H + 2);

export default function TpKvPlacementViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="KV placement under TP"
      title="GPU 8장에 KV를 나눠 담을 때 무엇이 복제되는지 봅니다"
      description="열 G0~G7은 GPU 8장, 세로 8칸은 한 요청의 token t0~t7입니다. 칸 색이 같으면 같은 KV 기록이고, 빈 칸은 그 GPU가 들지 않는 token입니다."
      note="head 수와 GPU 수만 바꾼 모형입니다. 실제 byte는 본문 계산을 따릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="tensor parallel 8장에서 KV head와 MLA latent의 배치"
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
          <div className="mt-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${scene.label}, ${scene.summary}`}>
              {Array.from({ length: COLS }, (_, g) => (
                <g key={`gpu${g}`}>
                  <ModuleBox x={colX(g)} y={HEAD_Y} w={COL_W} h={24} label={`G${g}`} color="#64748b" />
                  {Array.from({ length: ROWS }, (_, r) => {
                    const held = scene.holds(g, r);
                    const color = scene.color(g);
                    return (
                      <g key={`c${g}-${r}`}>
                        <rect
                          x={colX(g)}
                          y={rowY(r)}
                          width={COL_W}
                          height={CELL_H}
                          rx={2}
                          fill="none"
                          stroke="#94a3b8"
                          strokeWidth={0.75}
                          strokeDasharray="2 2"
                        />
                        <motion.rect
                          key={`${scenes.active}-${g}-${r}`}
                          x={colX(g)}
                          y={rowY(r)}
                          width={COL_W}
                          height={CELL_H}
                          rx={2}
                          fill={color}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: held ? 0.8 : 0 }}
                          transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : g * 0.05 + r * 0.02 }}
                        />
                        {held && r === (scenes.active === 3 ? g : 0) ? (
                          <text
                            x={colX(g) + COL_W / 2}
                            y={rowY(r) + CELL_H - 4}
                            textAnchor="middle"
                            fontSize={9}
                            fontWeight={700}
                            fill="#ffffff"
                          >
                            {scene.cellText(g)}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              ))}
            </svg>
          </div>
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
