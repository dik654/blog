import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * Q head 4개는 그대로 두고 저장하는 KV head를 4·2·1벌로 줄인다.
 * 칸 하나 = 한 위치·한 KV head의 K 또는 V(숫자 2개 × 2byte = 4byte). 3위치라 KV head 한 벌은 3 × 2 × 4 = 24byte.
 * 한 mechanism: 저장 byte는 KV head 수에 비례하고, repeat_kv의 0·0·1·1 펼침은 계산용이라 저장량을 바꾸지 않는다.
 */
const W = 360;
const POS = 3;
const CELL_W = 20;
const CELL_H = 13;
const GROUP_W = CELL_W * 2 + 4;
const Q_Y = 14;
const KV_Y = 92;
const GHOST_Y = 190;

interface Scene {
  label: string;
  kv: number;
  map: readonly number[];
  ghost: boolean;
  bytes: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "MHA · KV head 4", kv: 4, map: [0, 1, 2, 3], ghost: false, bytes: "4벌 × 24 = 96byte", note: "Q head마다 자기 KV head를 둡니다. 3위치 × K·V × 4byte = 24byte가 네 벌이라 96byte입니다." },
  { label: "GQA · KV head 2", kv: 2, map: [0, 0, 1, 1], ghost: false, bytes: "2벌 × 24 = 48byte", note: "Q head 0·1은 KV head 0을, 2·3은 KV head 1을 함께 읽습니다. 묶음 크기 4/2=2이고 저장은 48byte입니다." },
  { label: "MQA · KV head 1", kv: 1, map: [0, 0, 0, 0], ghost: false, bytes: "1벌 × 24 = 24byte", note: "네 Q head가 KV head 하나를 모두 읽습니다. 저장은 가장 적은 24byte이지만 표현을 공유하므로 품질이 같다는 보장은 없습니다." },
  { label: "GQA · repeat_kv 펼침", kv: 2, map: [0, 0, 1, 1], ghost: true, bytes: "저장은 그대로 48byte", note: "점수를 계산할 때만 KV head를 0·0·1·1 순서로 네 벌처럼 펼칩니다. 점선은 계산용 배열이고 다음 실행까지 남는 저장은 여전히 두 벌입니다." },
];

const qx = (i: number) => (W / 4) * (i + 0.5);
const gx = (g: number, n: number) => (W / n) * (g + 0.5) - GROUP_W / 2;

function Group({ x, y, label, dashed, delay, reduced }: { x: number; y: number; label: string; dashed?: boolean; delay: number; reduced: boolean }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : delay }}>
      <text x={x + GROUP_W / 2} y={y - 5} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-muted-foreground">
        {label}
      </text>
      {["K", "V"].map((kind, c) =>
        Array.from({ length: POS }, (_, r) => (
          <rect
            key={kind + r}
            x={x + c * (CELL_W + 4)}
            y={y + r * (CELL_H + 2)}
            width={CELL_W}
            height={CELL_H}
            rx={2}
            fill={dashed ? "none" : kind === "K" ? "#2563eb" : "#16a34a"}
            fillOpacity={dashed ? 1 : 0.75}
            stroke={kind === "K" ? "#2563eb" : "#16a34a"}
            strokeWidth={1}
            strokeDasharray={dashed ? "3 2" : undefined}
          />
        )),
      )}
      <text x={x + CELL_W / 2} y={y + POS * (CELL_H + 2) + 10} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
        K
      </text>
      <text x={x + CELL_W * 1.5 + 4} y={y + POS * (CELL_H + 2) + 10} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
        V
      </text>
    </motion.g>
  );
}

export default function KvHeadSharingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const height = scene.ghost ? 262 : 166;
  const storeY = scene.ghost ? GHOST_Y : KV_Y;

  return (
    <VizFrame
      eyebrow="KV head sharing"
      title="Q head 4개는 그대로 두고 저장하는 KV head만 4·2·1벌로 줄입니다"
      description="위는 Q head, 아래 칸 묶음은 저장하는 KV head입니다. 칸 하나는 한 위치의 K 또는 V(숫자 2개 × 2byte)이고 선은 어느 Q가 어느 기록을 읽는지입니다."
      note="9절 사례의 3위치·head 폭 2·숫자당 2byte를 고정하고 head 수만 바꿨습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Q head와 KV head의 공유 관계와 저장 byte"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.bytes}</span>
          </div>
          <div className="mt-3 h-[17rem]">
            <svg key={scenes.active} viewBox={`0 0 ${W} ${height}`} className="h-auto max-h-[17rem] w-full" role="img" aria-label={`${scene.label}, ${scene.bytes}`}>
              {scene.map.map((g, i) => {
                const target = scene.ghost ? { x: gx(i, 4) + GROUP_W / 2, y: KV_Y - 16 } : { x: gx(g, scene.kv) + GROUP_W / 2, y: KV_Y - 16 };
                return (
                  <motion.line
                    key={`q${i}`}
                    x1={qx(i)}
                    y1={Q_Y + 22}
                    x2={target.x}
                    y2={target.y}
                    stroke="#64748b"
                    strokeWidth={1}
                    strokeDasharray={scene.ghost ? "3 2" : undefined}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.35 + i * 0.12 }}
                  />
                );
              })}
              {scene.ghost
                ? scene.map.map((g, i) => (
                    <motion.line
                      key={`r${i}`}
                      x1={gx(g, scene.kv) + GROUP_W / 2}
                      y1={storeY - 16}
                      x2={gx(i, 4) + GROUP_W / 2}
                      y2={KV_Y + POS * (CELL_H + 2) + 14}
                      stroke="#d97706"
                      strokeWidth={1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.2 + i * 0.1 }}
                    />
                  ))
                : null}
              {Array.from({ length: 4 }, (_, i) => (
                <g key={`qbox${i}`}>
                  <rect x={qx(i) - 20} y={Q_Y} width={40} height={22} rx={4} fill="#7c3aed" fillOpacity={0.85} />
                  <text x={qx(i)} y={Q_Y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                    Q{i}
                  </text>
                </g>
              ))}
              {Array.from({ length: scene.kv }, (_, g) => (
                <Group key={`kv${g}`} x={gx(g, scene.kv)} y={storeY} label={scene.ghost ? `저장 KV head ${g}` : `KV head ${g}`} delay={0.1 + g * 0.1} reduced={reduced} />
              ))}
              {scene.ghost
                ? scene.map.map((g, i) => <Group key={`gh${i}`} x={gx(i, 4)} y={KV_Y} label={`계산용 ${g}`} dashed delay={0.5 + i * 0.1} reduced={reduced} />)
                : null}
            </svg>
          </div>
          <p className="mt-2 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
