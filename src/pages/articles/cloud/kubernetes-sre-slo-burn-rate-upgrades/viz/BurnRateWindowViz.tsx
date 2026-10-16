import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 99.9% SLO 서비스에 10분 동안 15% 오류가 난 사건 하나를 90분 시간축에 놓고,
 * 긴 창(1시간)과 짧은 창(5분)의 평균 오류율이 임계값 14.4 × 0.1% = 1.44%를 언제 넘고 언제 내려오는지 그린다.
 * 한 mechanism: 경보 = (긴 창 평균 > 1.44%) AND (짧은 창 평균 > 1.44%). 긴 창이 "충분히 큰 소진"을, 짧은 창이 "아직 진행 중"을 보증한다.
 * 오류율·시간은 가정이고 평균은 아래 코드가 분 단위로 직접 계산한다. 실제 monitoring을 돌린 값이 아니다.
 */
const MINUTES = 90;
const INCIDENT_START = 10;
const INCIDENT_END = 20;
const ERROR_DURING = 0.15;
const LONG_WINDOW = 60;
const SHORT_WINDOW = 5;
const THRESHOLD = 14.4 * 0.001;

const errorAt = (minute: number) => (minute >= INCIDENT_START && minute < INCIDENT_END ? ERROR_DURING : 0);
const windowAvg = (end: number, size: number) => {
  let sum = 0;
  for (let m = end - size; m < end; m += 1) sum += m >= 0 ? errorAt(m) : 0;
  return sum / size;
};
const SERIES = Array.from({ length: MINUTES + 1 }, (_, minute) => ({
  minute,
  short: windowAvg(minute, SHORT_WINDOW),
  long: windowAvg(minute, LONG_WINDOW),
}));
const bothAbove = (minute: number) => SERIES[minute].short > THRESHOLD && SERIES[minute].long > THRESHOLD;
const longAbove = (minute: number) => SERIES[minute].long > THRESHOLD;

interface Scene {
  label: string;
  cursor: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "평상시", cursor: 8, note: "(가정) 1,000 req/s 서비스의 오류율이 0%인 시각입니다. 두 창의 평균 모두 0이고 임계값 1.44%는 14.4 × (1 − 0.999)에서 나옵니다." },
  { label: "장애 시작 1분 뒤", cursor: 11, note: "10분부터 15% 오류가 납니다. 5분 창 평균은 15% × 1 ÷ 5 = 3%로 곧바로 임계값을 넘지만 1시간 창은 15% × 1 ÷ 60 = 0.25%라 아직 아래입니다. 둘 다 넘어야 하므로 경보는 울리지 않습니다." },
  { label: "장애 6분 뒤 · 경보", cursor: 16, note: "1시간 창 평균이 15% × 6 ÷ 60 = 1.5%로 임계값을 넘었습니다. 이 순간 이미 소진한 budget은 15% × 6분 ÷ (0.1% × 43,200분) ≈ 2.1%이고, 2%를 넘겼으니 Page가 울립니다." },
  { label: "장애 종료 5분 뒤 · 해제", cursor: 25, note: "20분에 오류가 멎었습니다. 5분 창은 25분에 0%로 떨어져 AND 조건이 깨지고 경보가 꺼집니다. 1시간 창은 아직 2.5%라 혼자였다면 계속 울렸을 것입니다." },
  { label: "한 시간 뒤", cursor: 75, note: "1시간 창은 사건이 창 밖으로 밀려나 남은 오류 분이 6분에서 5분이 되는 75분에야 1.25%로 내려옵니다. 짧은 창이 없었다면 끝난 사건에 약 50분을 더 깨어 있어야 했습니다." },
];

const X0 = 46;
const X1 = 470;
const Y_TOP = 30;
const Y_BASE = 128;
const Y_MAX = 0.032;
const x = (minute: number) => X0 + ((X1 - X0) * minute) / MINUTES;
const y = (ratio: number) => Y_BASE - ((Y_BASE - Y_TOP) * Math.min(ratio, Y_MAX)) / Y_MAX;
const path = (key: "short" | "long") => SERIES.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.minute).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");

const pct = (ratio: number) => `${(ratio * 100).toFixed(2)}%`;

export default function BurnRateWindowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const point = SERIES[scene.cursor];
  const firing = bothAbove(scene.cursor);
  const longOnly = longAbove(scene.cursor);

  return (
    <VizFrame
      eyebrow="Multiwindow burn-rate alert"
      title="긴 창은 소진이 충분히 큰지, 짧은 창은 아직 진행 중인지 묻습니다"
      description="가로는 분, 세로는 창 안의 평균 오류율입니다. 파란 선은 1시간 창, 주황 선은 5분 창, 빨간 점선은 14.4배 소진 임계값 1.44%입니다. 아래 두 띠는 경보 상태입니다."
      note="오류율 15%·10분과 1,000 req/s는 가정입니다. 평균은 이 그림이 분 단위로 직접 계산한 값이고 실제 monitoring 출력이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 창 평균 오류율과 경보 상태의 시간 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="grid">
            {SCENES.map((s, i) => (
              <div key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 flex flex-wrap items-baseline justify-between gap-2 ${i === scenes.active ? "" : "invisible"}`}>
                <h4 className="text-base font-bold">{s.label}</h4>
                <span className={`font-mono text-sm font-bold ${bothAbove(s.cursor) ? "text-[#dc2626]" : "text-muted-foreground"}`}>{bothAbove(s.cursor) ? "PAGE 울림" : "경보 없음"}</span>
              </div>
            ))}
          </div>

          <svg viewBox="0 0 480 190" className="mt-2 h-auto w-full" role="img" aria-label={`${scene.cursor}분: 5분 창 ${pct(point.short)}, 1시간 창 ${pct(point.long)}`}>
            {/* 사건 구간 */}
            <rect x={x(INCIDENT_START)} y={Y_TOP - 14} width={x(INCIDENT_END) - x(INCIDENT_START)} height={Y_BASE - Y_TOP + 14} fill="#fee2e2" opacity={0.7} />
            <text x={(x(INCIDENT_START) + x(INCIDENT_END)) / 2} y={Y_TOP - 4} textAnchor="middle" fontSize={8} fontWeight={700} fill="#b91c1c">
              15% 오류 10분
            </text>

            {/* 축 */}
            <line x1={X0} y1={Y_BASE} x2={X1} y2={Y_BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} y1={Y_TOP} x2={X0} y2={Y_BASE} stroke="#94a3b8" strokeWidth={1} />
            {[0, 15, 30, 45, 60, 75, 90].map((m) => (
              <g key={m}>
                <line x1={x(m)} y1={Y_BASE} x2={x(m)} y2={Y_BASE + 3} stroke="#94a3b8" />
                <text x={x(m)} y={Y_BASE + 12} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
                  {m}분
                </text>
              </g>
            ))}
            {[0, 0.01, 0.02, 0.03].map((r) => (
              <text key={r} x={X0 - 4} y={y(r) + 3} textAnchor="end" fontSize={8} className="fill-muted-foreground">
                {(r * 100).toFixed(0)}%
              </text>
            ))}

            {/* 임계값 */}
            <line x1={X0} y1={y(THRESHOLD)} x2={X1} y2={y(THRESHOLD)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
            <text x={X1} y={y(THRESHOLD) - 3} textAnchor="end" fontSize={8} fontWeight={700} fill="#dc2626">
              14.4 × 0.1% = 1.44%
            </text>

            {/* 두 창의 평균 */}
            <path d={path("long")} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <path d={path("short")} fill="none" stroke="#f59e0b" strokeWidth={1.25} />

            {/* 경보 띠 */}
            <text x={X0 - 4} y={153} textAnchor="end" fontSize={8} fontWeight={700} className="fill-foreground">
              두 창 AND
            </text>
            <text x={X0 - 4} y={171} textAnchor="end" fontSize={8} className="fill-muted-foreground">
              긴 창만
            </text>
            {SERIES.slice(0, MINUTES).map((p) => (
              <g key={p.minute}>
                <rect x={x(p.minute)} y={146} width={x(p.minute + 1) - x(p.minute) + 0.3} height={9} fill={bothAbove(p.minute) ? "#dc2626" : "#e2e8f0"} />
                <rect x={x(p.minute)} y={164} width={x(p.minute + 1) - x(p.minute) + 0.3} height={9} fill={longAbove(p.minute) ? "#93c5fd" : "#e2e8f0"} />
              </g>
            ))}

            {/* 커서 */}
            <motion.g initial={false} animate={{ x: x(scene.cursor) }} transition={{ duration: reduced ? 0 : 0.5, ease: "easeInOut" }}>
              <line x1={0} y1={Y_TOP - 14} x2={0} y2={174} stroke="#0f172a" strokeWidth={1} className="stroke-foreground" />
              <circle cx={0} cy={y(point.long)} r={3.5} fill="#2563eb" />
              <circle cx={0} cy={y(point.short)} r={3.5} fill="#f59e0b" />
              <text x={scene.cursor > 70 ? -4 : 4} y={Y_TOP - 16} textAnchor={scene.cursor > 70 ? "end" : "start"} fontSize={8} fontWeight={700} className="fill-foreground">
                {scene.cursor}분
              </text>
            </motion.g>
          </svg>

          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">5분 창 평균</dt>
              <dd className={`font-bold ${point.short > THRESHOLD ? "text-[#b45309]" : "text-foreground"}`}>{pct(point.short)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">1시간 창 평균</dt>
              <dd className={`font-bold ${point.long > THRESHOLD ? "text-[#1d4ed8]" : "text-foreground"}`}>{pct(point.long)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">소진 속도(1h)</dt>
              <dd className="font-bold text-foreground">{(point.long / 0.001).toFixed(1)}배</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">긴 창만이었다면</dt>
              <dd className={`font-bold ${longOnly && !firing ? "text-[#1d4ed8]" : "text-foreground"}`}>{longOnly ? "울림" : "조용"}</dd>
            </div>
          </dl>

<div className="mt-3 grid border-l border-primary/50 pl-4">
            {SCENES.map((item, i) => (
              <p key={i} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-sm leading-7 text-muted-foreground ${i === scenes.active ? "" : "invisible"}`}>
                {item.note}
              </p>
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
