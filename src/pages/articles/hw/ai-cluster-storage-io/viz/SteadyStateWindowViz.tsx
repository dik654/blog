import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — SNIA SSS PTS 2.0.2의 Steady State 판정(정의 2.1.24·2.1.13).
 * 창 = 라운드 x−4~x 다섯 개. 조건 1: 최대−최소 ≤ 창 평균의 20%. 조건 2: 최적 직선의 최대−최소 ≤ 창 평균의 10%.
 * 라운드별 IOPS는 모두 설명용 값(가정)이며 뒤 창의 평균을 본문 예시와 같은 100,000으로 맞췄다.
 */
// 두 조건을 처음 함께 통과하는 창이 8~12가 되도록 골랐다. 7~11은 범위(16)는 통과하지만 직선 차이(11.6)가
// 허용(10.24)을 넘고, 6~10도 직선에서, 그 앞 창은 범위와 직선 모두에서 걸린다. 그래야 그림의 x=12가 ‘처음 통과한 라운드’와 일치한다.
const ROUNDS: readonly number[] = [182, 164, 146, 134, 125, 119, 114, 99, 101, 98, 100, 102];

interface WindowCheck {
  start: number;
  avg: number;
  range: number;
  slopeSpan: number;
  slope: number;
  intercept: number;
}

function check(start: number): WindowCheck {
  const values = ROUNDS.slice(start, start + 5);
  const avg = values.reduce<number>((sum, value) => sum + value, 0) / values.length;
  const range = Math.max(...values) - Math.min(...values);
  const xs = values.map((_, index) => index - 2);
  const slope = xs.reduce<number>((sum, x, index) => sum + x * (values[index] - avg), 0) / xs.reduce<number>((sum, x) => sum + x * x, 0);
  return { start, avg, range, slopeSpan: Math.abs(slope) * 4, slope, intercept: avg };
}

const EARLY = check(2);
const PREV = check(6);
const LATE = check(7);
const k = (value: number) => `${(value * 1000).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const SCENES = [
  {
    label: "처음 라운드는 높게 나옵니다",
    summary: "FOB → 안정 상태로 내려옴",
    win: null,
    line: false,
    note: "갓 꺼낸 FOB(Fresh Out of the Box) 장치는 잠깐 높은 성능을 보이다가 그 workload에 맞는 안정 상태로 내려옵니다. 점 하나가 한 라운드의 평균 IOPS이며 값은 설명용입니다(가정).",
  },
  {
    label: "앞쪽 창은 범위 조건에서 걸립니다",
    summary: `범위 ${k(EARLY.range)} > 허용 ${k(EARLY.avg * 0.2)}`,
    win: EARLY,
    line: false,
    note: `라운드 ${EARLY.start + 1}~${EARLY.start + 5}의 평균은 약 ${k(EARLY.avg)}이고 허용 범위는 그 20%인 약 ${k(EARLY.avg * 0.2)}입니다. 실제 최대−최소는 ${k(EARLY.range)}이라 아직 Steady State가 아닙니다.`,
  },
  {
    label: "창 x−4~x: 범위 20% 이내",
    summary: `범위 ${k(LATE.range)} ≤ 허용 ${k(LATE.avg * 0.2)}`,
    win: LATE,
    line: false,
    note: `라운드 ${LATE.start + 1}~${LATE.start + 5}(x=${LATE.start + 5})의 평균은 ${k(LATE.avg)}입니다. 본문 예처럼 실측 범위는 20,000 이내여야 하는데 ${k(LATE.range)}입니다.`,
  },
  {
    label: "최적 직선의 차이 10% 이내",
    summary: `직선 차이 ${k(LATE.slopeSpan)} ≤ 허용 ${k(LATE.avg * 0.1)}`,
    win: LATE,
    line: true,
    note: `다섯 점에 맞춘 최적 직선(최소제곱 직선)의 양 끝 차이는 ${k(LATE.slopeSpan)}입니다. 허용치 10,000 이내라 두 조건을 모두 통과하고, 이 다섯 라운드에서 측정합니다. 바로 앞 창 ${PREV.start + 1}~${PREV.start + 5}은 범위(${k(PREV.range)})는 20% 조건을 통과했지만 직선 차이(${k(PREV.slopeSpan)})가 허용 ${k(PREV.avg * 0.1)}을 넘었습니다.`,
  },
] as const;

const W = 360;
const H = 200;
const LEFT = 44;
const RIGHT = 350;
const BASE = 168;
const TOP = 14;
const MIN = 80;
const MAX = 190;
const px = (round: number) => LEFT + 10 + (round / (ROUNDS.length - 1)) * (RIGHT - LEFT - 20);
const py = (value: number) => BASE - ((value - MIN) / (MAX - MIN)) * (BASE - TOP);

export default function SteadyStateWindowViz() {
  return (
    <SceneShell
      eyebrow="Steady State 판정"
      title="다섯 라운드 창이 두 조건을 모두 통과해야 측정을 시작합니다"
      description="가로는 시험 라운드, 세로는 라운드별 평균 IOPS(천 단위, 80부터 시작)입니다. 값은 설명용이며 실제 장치 측정이 아닙니다(가정)."
      ariaLabel="FOB 성능 하락과 다섯 라운드 창의 범위 20퍼센트, 직선 기울기 10퍼센트 조건"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const win = scene.win;
        const pass = win !== null && win.range <= win.avg * 0.2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[80, 100, 120, 140, 160, 180].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={RIGHT} y1={py(tick)} y2={py(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={LEFT - 6} y={py(tick) + 3} textAnchor="end" fontSize={9} fill="#64748b">{`${tick}k`}</text>
              </g>
            ))}
            {win && (
              <g>
                <rect x={px(win.start) - 9} y={TOP} width={px(win.start + 4) - px(win.start) + 18} height={BASE - TOP} fill={pass ? "#16a34a" : "#dc2626"} opacity={0.08} />
                <rect x={px(win.start) - 9} y={TOP} width={px(win.start + 4) - px(win.start) + 18} height={BASE - TOP} fill="none" stroke={pass ? "#16a34a" : "#dc2626"} strokeWidth={1} strokeDasharray="4 3" />
                {!scene.line && (
                  <g>
                    <line x1={px(win.start) - 9} x2={px(win.start + 4) + 9} y1={py(Math.max(...ROUNDS.slice(win.start, win.start + 5)))} y2={py(Math.max(...ROUNDS.slice(win.start, win.start + 5)))} stroke={pass ? "#16a34a" : "#dc2626"} strokeWidth={1} />
                    <line x1={px(win.start) - 9} x2={px(win.start + 4) + 9} y1={py(Math.min(...ROUNDS.slice(win.start, win.start + 5)))} y2={py(Math.min(...ROUNDS.slice(win.start, win.start + 5)))} stroke={pass ? "#16a34a" : "#dc2626"} strokeWidth={1} />
                  </g>
                )}
                {scene.line && (
                  <line x1={px(win.start)} x2={px(win.start + 4)} y1={py(win.intercept - 2 * win.slope)} y2={py(win.intercept + 2 * win.slope)} stroke="#2563eb" strokeWidth={1.25} />
                )}
                <text x={px(win.start + 2)} y={TOP + 12} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={pass ? "#15803d" : "#b91c1c"}>
                  {`창 ${win.start + 1}~${win.start + 5} · ${pass ? "통과" : "미달"}`}
                </text>
              </g>
            )}
            {ROUNDS.map((value, round) => (
              <circle key={round} cx={px(round)} cy={py(value)} r={3.2} fill="#0f172a" opacity={win && (round < win.start || round > win.start + 4) ? 0.3 : 0.9} />
            ))}
            {ROUNDS.map((_, round) => (
              <text key={`r${round}`} x={px(round)} y={BASE + 14} textAnchor="middle" fontSize={9} fill="#64748b">{round + 1}</text>
            ))}
            <text x={RIGHT} y={H - 4} textAnchor="end" fontSize={9} fill="#64748b">라운드 →</text>
            <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
