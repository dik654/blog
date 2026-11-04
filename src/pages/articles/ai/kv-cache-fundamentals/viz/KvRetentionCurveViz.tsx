import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 처리한 token 수에 따른 논리 KV 용량. 같은 축에 세 계산을 놓는다.
 * 한 mechanism: window 층이 2048에서 멈추면 Muse의 기울기가 52KiB에서 13KiB로 꺾인다.
 * 위치 축 끝은 8192이고 MiB = KiB × token ÷ 1024이다.
 */
const W = 380;
const H = 240;
const M = { l: 34, r: 72, t: 22, b: 34 };
const MAX_T = 8192;
const MAX_MIB = 512;
const QWEN = "#0891b2";
const MUSE = "#d97706";

const qwen = (t: number) => (64 * t) / 1024;
const museAll = (t: number) => (52 * t) / 1024;
const museLong = (t: number) => (13 * t) / 1024;
const museWindow = (t: number) => (39 * Math.min(t, 2048)) / 1024;
const museReclaim = (t: number) => museLong(t) + museWindow(t);

const x = (t: number) => M.l + (t / MAX_T) * (W - M.l - M.r);
const y = (mib: number) => H - M.b - (mib / MAX_MIB) * (H - M.t - M.b);

const SCENES = [
  { t: 1024, label: "1,024 token · window 안", note: "모든 층이 token마다 늘어납니다. 회수한다고 가정해도 window를 넘은 기록이 없어 두 Muse 계산이 같습니다." },
  { t: 2048, label: "2,048 token · 가득 참", note: "39층이 길이 2048에 닿습니다. 여기까지는 token당 52KiB를 곱한 값과 일치합니다." },
  { t: 4096, label: "4,096 token · 갈라짐", note: "회수한다면 39층은 78MiB에 머물고 13층만 늘어납니다. 기울기가 token당 52KiB에서 13KiB로 꺾입니다." },
  { t: 8192, label: "8,192 token · 벌어짐", note: "회수 계산은 13층 104MiB와 39층 78MiB를 더한 182MiB입니다. 52KiB를 그대로 곱한 416MiB의 절반에도 못 미칩니다." },
] as const;

const format = (mib: number) => `${Number.isInteger(mib) ? mib : mib.toFixed(1)}MiB`;

export default function KvRetentionCurveViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const t = scene.t;
  const dots = [
    { value: qwen(t), color: QWEN },
    { value: museAll(t), color: MUSE },
    { value: museReclaim(t), color: MUSE },
  ];

  return (
    <VizFrame
      eyebrow="문맥 길이와 저장량"
      title="window 층이 멈추면 Muse의 기울기가 2048에서 꺾입니다"
      description="가로는 처리한 token 수, 세로는 attention KV의 논리 용량입니다. 세 선을 같은 축에 놓았습니다."
      note="회수 곡선은 길이 2048을 넘은 local 기록을 바로 회수한다는 가정입니다(가정). 실제 엔진의 회수 시점과 block 배정을 측정한 값이 아니며, Qwen 선에는 linear 48층의 상태가 들어 있지 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="처리한 token 수에 따른 KV 논리 용량"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="min-h-[3rem] text-base font-bold sm:min-h-0">{scene.label}</h4>
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-2 h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}의 세 계산 값`}>
            {[0, 128, 256, 384, 512].map((mib) => (
              <g key={mib}>
                <line x1={M.l} x2={W - M.r} y1={y(mib)} y2={y(mib)} stroke="#94a3b8" strokeOpacity={0.3} strokeWidth={1} />
                <text x={M.l - 5} y={y(mib) + 4} textAnchor="end" fontSize={11} className="fill-muted-foreground">
                  {mib}
                </text>
              </g>
            ))}
            {[0, 2048, 4096, 6144, 8192].map((tick) => (
              <text key={tick} x={x(tick)} y={H - M.b + 15} textAnchor="middle" fontSize={11} className="fill-muted-foreground">
                {tick}
              </text>
            ))}
            <text x={M.l - 5} y={10} textAnchor="end" fontSize={10} className="fill-muted-foreground">
              MiB
            </text>
            <text x={(M.l + W - M.r) / 2} y={H - 3} textAnchor="middle" fontSize={11} className="fill-muted-foreground">
              처리한 token 수
            </text>
            <motion.line initial={false} animate={{ x1: x(t), x2: x(t) }} transition={{ duration: reduced ? 0 : 0.4 }} y1={M.t} y2={H - M.b} stroke="#64748b" strokeWidth={1} />
            <line x1={x(0)} y1={y(0)} x2={x(MAX_T)} y2={y(qwen(MAX_T))} stroke={QWEN} strokeWidth={1.25} />
            <line x1={x(0)} y1={y(0)} x2={x(MAX_T)} y2={y(museAll(MAX_T))} stroke={MUSE} strokeWidth={1.25} strokeDasharray="5 4" />
            <polyline fill="none" stroke={MUSE} strokeWidth={1.25} points={[0, 2048, MAX_T].map((p) => `${x(p)},${y(museReclaim(p))}`).join(" ")} />
            {dots.map((dot, index) => (
              <motion.circle key={index} r={4} fill={dot.color} initial={false} animate={{ cx: x(t), cy: y(dot.value) }} transition={{ duration: reduced ? 0 : 0.4 }} />
            ))}
            <text x={W - M.r + 6} y={y(512) + 4} fontSize={11} fontWeight={700} className="fill-foreground">Qwen</text>
            <text x={W - M.r + 6} y={y(416) + 4} fontSize={11} fontWeight={700} className="fill-foreground">Muse 곱셈</text>
            <text x={W - M.r + 6} y={y(182) + 4} fontSize={11} fontWeight={700} className="fill-foreground">Muse 회수</text>
          </svg>
          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <dt className="font-sans text-muted-foreground">Qwen 64KiB×</dt>
              <dd className="font-bold tabular-nums">{format(qwen(t))}</dd>
            </div>
            <div>
              <dt className="font-sans text-muted-foreground">Muse 52KiB×</dt>
              <dd className="font-bold tabular-nums">{format(museAll(t))}</dd>
            </div>
            <div>
              <dt className="font-sans text-muted-foreground">Muse 회수</dt>
              <dd className="font-bold tabular-nums">{format(museReclaim(t))}</dd>
            </div>
          </dl>
          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => `${s.t.toLocaleString("en-US")} token`)} />
      </div>
    </VizFrame>
  );
}
