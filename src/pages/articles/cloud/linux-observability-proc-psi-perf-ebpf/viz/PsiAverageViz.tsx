import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * kernel/sched/psi.c의 calc_avgs를 그대로 따라 (가정) 4초 주기 폭주가 avg10으로 어떻게 25%가 되는지 그린다.
 * 한 mechanism: 2초마다 '그 주기에 누군가 CPU를 기다린 시간 ÷ 2초'를 표본(50% 또는 0%)으로 넣고,
 * avg10 = avg10 × 1677/2048 + 표본 × 371/2048 로 섞는다. 사용률 40%는 같은 24초 동안 변하지 않는다.
 */
const FIXED_1 = 2048;
const EXP_10S = 1677;
const EXP_60S = 1981;
const PERIODS = 30; // 60초
const UTIL = 40;

/** 4초 주기(1초 폭주 + 3초 한가)를 2초 주기로 자르면 50%와 0%가 번갈아 온다. */
const SAMPLES = Array.from({ length: PERIODS }, (_, i) => (i % 2 === 0 ? 50 : 0));

function series(exp: number) {
  const out: number[] = [];
  let avg = 0;
  for (const pct of SAMPLES) {
    avg = (avg * exp + pct * (FIXED_1 - exp)) / FIXED_1;
    out.push(avg);
  }
  return out;
}
const AVG10 = series(EXP_10S);
const AVG60 = series(EXP_60S);

interface Scene {
  label: string;
  upto: number; // 보여 줄 주기 수
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "0~2초 · 첫 표본", upto: 1, note: "첫 2초 주기에 폭주 1초가 들어 있어 어떤 task가 기다린 시간은 1초, 표본은 1 ÷ 2 = 50%입니다. avg10은 0에서 출발해 50 × 371/2048 = 9.06%가 됩니다. 아직 '25%'로 보이지 않습니다." },
  { label: "2~4초 · 둘째 표본", upto: 2, note: "다음 2초는 한가해 표본이 0%입니다. avg10 = 9.06 × 1677/2048 = 7.42%. 평균이 내려갑니다. 사용률 선은 그대로 40%인데, 이 순간 PSI는 7%라 두 숫자가 모두 '여유'를 가리킵니다." },
  { label: "~10초", upto: 5, note: "표본 50·0·50·0·50이 쌓이며 avg10이 19% 근처까지 올라옵니다. 시정수 10초의 EMA라 10초가 지나야 목표의 63%쯤에 닿습니다. 장애 직후 처음 몇 초의 PSI를 보고 '낮다'고 판단하면 틀립니다." },
  { label: "~60초 · 정상 상태", upto: PERIODS, note: "avg10이 22~27% 사이를 오가며 평균 25%에 수렴했습니다. avg60은 같은 표본으로 더 천천히 올라 아직 16%입니다. 세 창의 차이가 폭주가 '지금 시작됐는지, 오래됐는지'를 말해 줍니다. 사용률 40%는 60초 내내 한 번도 움직이지 않았습니다." },
];

const H = 120;
const W = 300;
const PAD = 22;
const y = (v: number) => H - PAD / 2 - (v / 100) * (H - PAD);
const x = (i: number) => PAD + 6 + i * ((W - PAD - 12) / (PERIODS - 1));

export default function PsiAverageViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5000);
  const scene = SCENES[scenes.active];
  const n = scene.upto;
  const pathOf = (s: number[]) => s.slice(0, n).map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last10 = AVG10[n - 1];
  const last60 = AVG60[n - 1];

  return (
    <VizFrame
      eyebrow="PSI avg10 · calc_avgs"
      title="2초마다 넣는 표본이 10초 시정수의 지수 평균으로 섞여 25%가 됩니다"
      description="막대는 2초 주기마다 커널이 넣는 표본(그 주기에 누군가 CPU를 기다린 시간의 비율), 파란 선은 avg10, 옅은 선은 avg60, 회색 점선은 같은 시간의 CPU 사용률 40%입니다."
      note="(가정) 12스레드 폭주 1초 + 한가 3초가 반복되는 4 vCPU 서버입니다. 계수 1677/2048·1981/2048은 kernel/sched/psi.c의 EXP_10s·EXP_60s 값이고, 폭주 중에는 min(8 ÷ 4, 1) = 100%가 기다리는 것으로 봤습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="PSI cpu some의 2초 표본과 avg10·avg60 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.5rem] flex-wrap items-baseline justify-between gap-x-3 gap-y-1 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-xs font-bold tabular-nums">
              <span className="text-[#2563eb]">avg10 {last10.toFixed(2)}%</span>
              <span className="mx-2 text-muted-foreground">·</span>
              <span className="text-[#93c5fd]">avg60 {last60.toFixed(2)}%</span>
              <span className="mx-2 text-muted-foreground">·</span>
              <span className="text-muted-foreground">사용률 {UTIL}%</span>
            </span>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full" role="img" aria-label={`${n}개 주기까지의 표본과 평균`}>
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line x1={PAD} x2={W} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeWidth={0.6} />
                <text x={PAD - 3} y={y(v) + 2.5} fontSize={7} textAnchor="end" className="fill-muted-foreground">
                  {v}
                </text>
              </g>
            ))}
            <line x1={PAD} x2={W} y1={y(UTIL)} y2={y(UTIL)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={W - 2} y={y(UTIL) - 3} fontSize={7} textAnchor="end" fill="#64748b">
              사용률 40%
            </text>
            {SAMPLES.map((pct, i) => (
              <rect
                key={i}
                x={x(i) - 3}
                y={i < n ? y(pct) : y(0)}
                width={6}
                height={i < n ? y(0) - y(pct) : 0}
                fill={pct > 0 ? "#fca5a5" : "#e2e8f0"}
                className="transition-all duration-300"
              />
            ))}
            <path d={pathOf(AVG60)} fill="none" stroke="#93c5fd" strokeWidth={1.4} />
            <path d={pathOf(AVG10)} fill="none" stroke="#2563eb" strokeWidth={2} />
            {n > 0 && <circle cx={x(n - 1)} cy={y(last10)} r={3} fill="#2563eb" />}
            {SAMPLES.map((_, i) => (
              <text key={`t${i}`} x={x(i)} y={H - 1} fontSize={7} textAnchor="middle" className="fill-muted-foreground">
                {(i + 1) % 5 === 0 ? `${(i + 1) * 2}s` : ""}
              </text>
            ))}
          </svg>

          <p className="mt-4 min-h-[12rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10rem] sm:min-h-[5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
