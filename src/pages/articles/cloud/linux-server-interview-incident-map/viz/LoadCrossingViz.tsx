import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — calc_load를 그대로 다시 계산한다. 스레드 하나가 표본 12개 동안 돌고 끝난다.
 * 종료 뒤 12표본: 1분 474, 15분 120. 종료 뒤 31표본(약 155초): 1분 93 < 15분 101.
 */
const FIXED_1 = 2048;
const EXP_1 = 1884;
const EXP_15 = 2037;
const RUN_SAMPLES = 12;
const ALL_SAMPLES = 48;

const step = (load: number, active: number, exp: number) => {
  const sum = load * exp + active * (FIXED_1 - exp);
  return Math.floor((active >= load ? sum + FIXED_1 - 1 : sum) / FIXED_1);
};

const series = (exp: number) =>
  Array.from({ length: ALL_SAMPLES }).reduce<number[]>(
    (values, _, index) => [...values, step(values[values.length - 1], index < RUN_SAMPLES ? FIXED_1 : 0, exp)],
    [0],
  );

const ONE = series(EXP_1);
const FIFTEEN = series(EXP_15);

interface Scene {
  label: string;
  summary: string;
  note: string;
  until: number;
  yMax: number;
}

const SCENES: readonly Scene[] = [
  { label: "스레드가 도는 60초", summary: "1분 1,299 · 15분 132", until: 12, yMax: 1400, note: "수요 1이 이어지는 동안 1분 값이 15분 값보다 빨리 오릅니다. 화면 값으로 0.63과 0.06입니다." },
  { label: "끝나고 60초 뒤", summary: "1분 474 · 15분 120", until: 24, yMax: 1400, note: "수요는 이미 0인데 1분 값은 0.23이 남아 15분 값 0.06보다 아직 큽니다. 이 순간에 접속하면 수요가 오르는 중처럼 읽힐 수 있습니다." },
  { label: "끝나고 약 155초 뒤", summary: "1분 93 < 15분 101", until: 43, yMax: 300, note: "세로축을 확대했습니다. 표본 31개째에 1분 값이 15분 값 아래로 내려갑니다. 정수 값의 비교이고, 두 자리로 찍는 /proc/loadavg에서는 둘 다 0.05입니다." },
  { label: "끝나고 180초 뒤 접속", summary: "1분 59 · 15분 96", until: 48, yMax: 300, note: "1분 값이 15분 값보다 낮습니다. 화면 값으로는 0.03과 0.05입니다. 늦게 접속해 이 모양을 봤다면 이미 지나간 사건의 꼬리를 보는 중일 수 있습니다." },
];

const W = 360;
const H = 190;
const LEFT = 36;
const RIGHT = 350;
const TOP = 14;
const BASE = 164;
const ONE_TONE = "#2563eb";
const FIFTEEN_TONE = "#d97706";

const xAt = (sample: number) => LEFT + (sample / ALL_SAMPLES) * (RIGHT - LEFT);

export default function LoadCrossingViz() {
  return (
    <SceneShell
      eyebrow="꼬리와 교차"
      title="스레드가 끝나도 1분 값은 약 155초 뒤에야 15분 값 아래로 내려갑니다"
      description="세로축은 커널의 정수 load 값(2048 = 1.0), 가로축은 초입니다. 7절의 calc_load를 5초 표본마다 다시 계산했고 스레드는 처음 60초만 돕니다."
      ariaLabel="스레드 종료 전후 1분 값과 15분 값의 변화와 교차"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const yAt = (value: number) => BASE - (value / scene.yMax) * (BASE - TOP);
        const points = (values: readonly number[]) =>
          values.slice(0, scene.until + 1).map((value, sample) => `${xAt(sample).toFixed(1)},${yAt(value).toFixed(1)}`).join(" ");
        const atEnd = xAt(scene.until);
        const anchor = active < 2 ? "start" : "end";
        const labelX = active < 2 ? atEnd + 6 : atEnd - 4;
        const clipId = "load-crossing-clip";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <clipPath id={clipId}>
                <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={BASE - TOP} />
              </clipPath>
            </defs>
            {[0, 0.5, 1].map((ratio) => (
              <g key={ratio}>
                <line x1={LEFT} x2={RIGHT} y1={yAt(scene.yMax * ratio)} y2={yAt(scene.yMax * ratio)} stroke="#94a3b8" strokeWidth={ratio === 0 ? 1 : 0.5} />
                <text x={LEFT - 4} y={yAt(scene.yMax * ratio) + 4} textAnchor="end" fontSize={11} fill="#64748b">
                  {(scene.yMax * ratio).toLocaleString("en-US")}
                </text>
              </g>
            ))}
            {[0, 60, 120, 180, 240].map((second) => (
              <text key={second} x={xAt(second / 5)} y={BASE + 14} textAnchor={second === 240 ? "end" : "middle"} fontSize={11} fill="#64748b">
                {second}초
              </text>
            ))}
            <line x1={xAt(12)} x2={xAt(12)} y1={TOP} y2={BASE} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={xAt(12) + 4} y={TOP + 9} fontSize={11} fill="#64748b">스레드 종료</text>
            {scene.yMax === 300 && (
              <text x={RIGHT} y={TOP + 9} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">세로축 확대 0~300</text>
            )}
            <g clipPath={`url(#${clipId})`}>
              <polyline points={points(FIFTEEN)} fill="none" stroke={FIFTEEN_TONE} strokeWidth={1.25} strokeDasharray="5 2" />
              <polyline points={points(ONE)} fill="none" stroke={ONE_TONE} strokeWidth={1.25} />
            </g>
            <circle cx={atEnd} cy={yAt(ONE[scene.until])} r={3} fill={ONE_TONE} />
            <circle cx={atEnd} cy={yAt(FIFTEEN[scene.until])} r={3} fill={FIFTEEN_TONE} />
            <text x={labelX} y={yAt(ONE[scene.until]) + (active === 1 ? -6 : 15)} textAnchor={anchor} fontSize={11} fontWeight={700} fill={ONE_TONE}>
              1분 {ONE[scene.until].toLocaleString("en-US")}
            </text>
            <text x={labelX} y={yAt(FIFTEEN[scene.until]) - 7} textAnchor={anchor} fontSize={11} fontWeight={700} fill={FIFTEEN_TONE}>
              15분 {FIFTEEN[scene.until].toLocaleString("en-US")}
            </text>
          </svg>
        );
      }}
    />
  );
}
