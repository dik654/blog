import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 4절의 key 네 값 0.47, −1.3, 3.1, 12.0을 ÷0.02 → E4M3 칸에 맞춤 → ×0.02로 왕복시킨다.
 * 축은 log2 눈금이라 두 배 구간마다 E4M3 칸이 8개씩 같은 폭으로 보인다(간격 2·4·8·16·32).
 * 한 mechanism: 작은 오차는 칸 간격에서, 큰 오차는 448 상한에서 생긴다.
 */
const W = 360;
const L = 14;
const R = W - 14;
const LO = 16;
const HI = 640;
const x = (v: number) => L + ((Math.log2(v) - Math.log2(LO)) / (Math.log2(HI) - Math.log2(LO))) * (R - L);

/** E4M3 정규 범위 중 16–448의 칸. 두 배 구간마다 가수 3비트 = 8칸. */
const TICKS: number[] = [];
for (let e = 4; e <= 8; e++) for (let m = 0; m < 8; m++) {
  const v = 2 ** e * (1 + m / 8);
  if (v <= 448) TICKS.push(v);
}
const OCTAVES = [
  { from: 16, to: 32, step: 2 },
  { from: 32, to: 64, step: 4 },
  { from: 64, to: 128, step: 8 },
  { from: 128, to: 256, step: 16 },
  { from: 256, to: 448, step: 32 },
];

const VALUES = [
  { raw: "0.47", div: 23.5, snap: 24, back: "0.48", err: "0.01", sign: "" },
  { raw: "−1.3", div: 65, snap: 64, back: "−1.28", err: "0.02", sign: "−" },
  { raw: "3.1", div: 155, snap: 160, back: "3.2", err: "0.10", sign: "" },
  { raw: "12.0", div: 600, snap: 448, back: "8.96", err: "3.04", sign: "" },
] as const;

const SCENES = [
  { label: "원래 값 네 개", note: "같은 head의 key 원소 네 개입니다. 비율 s=0.02는 앞서 본 최댓값 4.0을 200에 맞춰 정했고, 12.0은 그 뒤에 처음 나왔습니다." },
  { label: "÷ 0.02", note: "각 값을 0.02로 나누면 23.5, −65, 155, 600입니다. 위 줄의 점이 그 위치입니다. 600은 448 벽 너머에 있습니다." },
  { label: "가장 가까운 칸으로", note: "8비트 칸은 두 배 구간마다 8개라 값이 클수록 간격이 넓습니다. 23.5→24, −65→−64, 155→160으로 맞추고 600은 448에서 멈춥니다." },
  { label: "× 0.02로 복원", note: "읽을 때 0.02를 곱합니다. 작은 세 값은 간격 때문에 0.01·0.02·0.10만 틀리고 12.0은 상한 때문에 3.04가 사라집니다. 두 오차의 원인이 다릅니다." },
  { label: "12.0만 s=0.06", note: "큰 값이 나오는 채널에 0.06을 주면 12.0÷0.06=200이 벽 안에 들어옵니다. 192와 208의 한가운데라 192에 맞추고 11.52로 돌아와 오차는 0.48입니다." },
] as const;

const UP = 42;
const DOWN = 96;

export default function Fp8GridSnapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const s = scenes.active;
  const reduced = scenes.reducedMotion;
  const t = (d: number) => ({ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : d });

  return (
    <VizFrame
      eyebrow="FP8 E4M3 grid"
      title="작은 오차는 칸 간격에서, 큰 오차는 448 상한에서 생깁니다"
      description="가로축은 x ÷ s의 크기를 두 배마다 같은 폭으로 그렸습니다. 위 줄의 점은 나눈 값, 아래 줄의 눈금 하나하나는 E4M3가 담을 수 있는 수이고 붉은 선이 상한 448입니다."
      note="−1.3은 크기 65로 그리고 부호는 따로 둡니다. 16보다 작은 칸과 음수 쪽 칸은 생략했습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="FP8 왕복에서 네 값이 칸에 맞춰지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{SCENES[s].label}</h4>
          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
          <svg viewBox={`0 0 ${W} 150`} className="h-auto max-h-[12rem] w-full" role="img" aria-label="E4M3 칸과 네 값의 위치">
            <rect x={x(448)} y={20} width={R - x(448)} height={96} fill="#dc2626" fillOpacity={0.06} />
            <line x1={L} x2={R} y1={DOWN} y2={DOWN} stroke="#94a3b8" strokeWidth={1} />
            {TICKS.map((v) => (
              <line key={v} x1={x(v)} x2={x(v)} y1={DOWN - 7} y2={DOWN + 7} stroke="#64748b" strokeWidth={1} />
            ))}
            <line x1={x(448)} x2={x(448)} y1={16} y2={DOWN + 12} stroke="#dc2626" strokeWidth={1.25} />
            <text x={x(448)} y={13} textAnchor="middle" fontSize={9} fontWeight={700} fill="#dc2626">
              448
            </text>
            {[16, 32, 64, 128, 256].map((v) => (
              <text key={v} x={x(v)} y={DOWN + 20} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
                {v}
              </text>
            ))}
            {OCTAVES.map((o) => (
              <text key={o.from} x={(x(o.from) + x(Math.min(o.to, 448))) / 2} y={DOWN + 34} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
                간격 {o.step}
              </text>
            ))}
            {s === 4 ? (
              <g>
                <motion.circle key="big-up" cx={x(200)} cy={UP} r={5} fill="#d97706" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0)} />
                <motion.circle key="big-down" cx={x(200)} cy={UP} r={5} fill="#d97706" initial={{ cx: x(200), cy: UP }} animate={{ cx: x(192), cy: DOWN }} transition={t(0.5)} />
                <text x={x(200)} y={UP - 9} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-foreground">
                  200
                </text>
              </g>
            ) : (
              VALUES.map((v, i) => {
                const atUp = s === 1;
                const atDown = s >= 2;
                const cx = atDown ? x(v.snap) : x(Math.min(v.div, HI - 8));
                const cy = atDown ? DOWN : UP;
                return s === 0 ? null : (
                  <g key={v.raw}>
                    {atDown ? <circle cx={x(Math.min(v.div, HI - 8))} cy={UP} r={3.5} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" /> : null}
                    <motion.circle
                      key={`${v.raw}-${s >= 2 ? "down" : "up"}`}
                      r={5}
                      fill={i === 3 ? "#dc2626" : "#2563eb"}
                      initial={atUp ? { cx, cy, opacity: 0 } : { cx: x(Math.min(v.div, HI - 8)), cy: UP, opacity: 1 }}
                      animate={{ cx, cy, opacity: 1 }}
                      transition={t(s === 2 ? 0.2 + i * 0.25 : i * 0.15)}
                    />
                    <text x={x(Math.min(v.div, HI - 8))} y={UP - 9} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-foreground">
                      {v.sign}
                      {v.div}
                    </text>
                  </g>
                );
              })
            )}
          </svg>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[16rem] text-left font-mono text-[11px]">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-1 pr-1.5 font-normal">원래</th>
                  <th className="py-1 pr-1.5 font-normal">÷ s</th>
                  <th className="py-1 pr-1.5 font-normal">FP8</th>
                  <th className="py-1 pr-1.5 font-normal">× s</th>
                  <th className="py-1 font-normal">오차</th>
                </tr>
              </thead>
              <tbody>
                {(s === 4 ? [...VALUES.slice(0, 3), { raw: "12.0", div: 200, snap: 192, back: "11.52", err: "0.48", sign: "" }] : VALUES).map((v) => (
                  <tr key={v.raw} className={`border-t border-border ${s === 4 && v.raw !== "12.0" ? "opacity-40" : ""}`}>
                    <td className="py-1 pr-1.5 font-bold">{v.raw}</td>
                    <td className="py-1 pr-1.5">{s >= 1 ? `${v.sign}${v.div}` : "·"}</td>
                    <td className={`py-1 pr-2 ${v.snap === 448 && s >= 2 ? "font-bold text-[#dc2626]" : ""}`}>{s >= 2 ? `${v.sign}${v.snap}` : "·"}</td>
                    <td className="py-1 pr-1.5">{s >= 3 ? v.back : "·"}</td>
                    <td className={`py-1 ${v.err === "3.04" ? "font-bold text-[#dc2626]" : ""}`}>{s >= 3 ? v.err : "·"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{SCENES[s].note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((sc) => sc.label)} />
      </div>
    </VizFrame>
  );
}
