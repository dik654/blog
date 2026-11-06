import SceneShell from "./SceneShell";

/**
 * 본문 대응: #jl-lemma 끝, #probability 표 — 충분 크기 k가 ε와 n에 따라 어떻게 변하는가.
 * k = 4ln(n)/c, c = ε²/2 − ε³/3. n=4의 1188.25·4589.11은 같은 식의 산술이고 비 3.862는 본문의 값입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const W = 340;
const H = 216;
const LEFT = 46;
const RIGHT = 16;
const TOP = 26;
const BASE = 172;

const size = (n: number, e: number) => (4 * Math.log(n)) / ((e * e) / 2 - (e * e * e) / 3);

const ex = (e: number) => LEFT + ((e - 0.05) / 0.25) * (W - LEFT - RIGHT);
const ey = (k: number) => BASE - (k / 5000) * (BASE - TOP);
const EPS_CURVE = Array.from({ length: 51 }, (_, i) => {
  const e = 0.05 + (i / 50) * 0.25;
  return `${ex(e).toFixed(1)},${ey(size(4, e)).toFixed(1)}`;
}).join(" ");

const nx = (exp10: number) => LEFT + (exp10 / 6) * (W - LEFT - RIGHT);
const ny = (k: number) => BASE - (k / 13000) * (BASE - TOP);

const BARS = [
  { name: "일반 충분 크기", value: 320, color: AMBER },
  { name: "입력 좌표 수 D", value: 4, color: GRAY },
  { name: "구조를 아는 우리", value: 1, color: BLUE },
] as const;

const SCENES = [
  { label: "n=4, ε=0.2", summary: "320 · 4 · 1", note: "약 319.914를 올린 320은 입력 좌표 4보다 큽니다. 이 식은 점이 한 직선에 있다는 구조를 쓰지 않습니다. 구조를 아는 우리는 한 칸으로 줄였습니다." },
  { label: "ε을 절반으로", summary: "0.1 → 0.05: 약 3.862배", note: "ε이 작을수록 분모가 빠르게 작아져 k가 가파르게 커집니다. ε을 절반으로 줄이면 대략 네 배이지만 정확히는 약 3.862배입니다." },
  { label: "n을 천 배로", summary: "5921 → 11,842", note: "ε=0.1을 고정하면 n=1000에서 5921, n=1,000,000에서 11,842입니다. 점이 천 배가 되어도 k는 두 배입니다. 가로 눈금이 곱으로 커지는 로그 관계입니다." },
] as const;

export default function SufficientSizeViz() {
  return (
    <SceneShell
      eyebrow="충분 크기의 움직임"
      title="허용 오차에는 가파르게, 점의 수에는 느리게 늘어납니다"
      description="k≥4ln(n)/c, c=ε²/2−ε³/3 식의 값입니다. 필요한 최소 크기가 아니라 존재를 보장하는 충분 크기입니다."
      note="둘째 장면의 곡선은 n=4로 고정했습니다. 셋째 장면의 값은 본문 표처럼 올림했습니다."
      ariaLabel="충분 크기 k가 입력 좌표 수와 ε, n에 따라 달라지는 모습"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && BARS.map((bar, index) => {
            const y = 26 + index * 60;
            const width = (bar.value / 320) * (W - 40);
            return (
              <g key={bar.name}>
                <text x={20} y={y} fontSize={12} fill={GRAY}>{bar.name}</text>
                <rect x={20} y={y + 6} width={Math.max(width, 1.5)} height={18} fill={bar.color} opacity={0.75} />
                <text x={bar.value === 320 ? W - 26 : 20 + Math.max(width, 2) + 8} y={y + 20} textAnchor={bar.value === 320 ? "end" : "start"} fontSize={13} fontWeight={700} fill={bar.value === 320 ? "#ffffff" : bar.color}>{bar.value}</text>
              </g>
            );
          })}
          {active === 1 && (
            <g>
              <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <line x1={LEFT} x2={LEFT} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {[0.05, 0.1, 0.2, 0.3].map((e) => (
                <g key={e}>
                  <line x1={ex(e)} x2={ex(e)} y1={BASE} y2={BASE + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={ex(e)} y={BASE + 18} textAnchor="middle" fontSize={12} fill={GRAY}>{e}</text>
                </g>
              ))}
              {[0, 2500, 5000].map((k) => <text key={k} x={LEFT - 6} y={ey(k) + 4} textAnchor="end" fontSize={12} fill={GRAY}>{k}</text>)}
              <text x={W / 2} y={BASE + 36} textAnchor="middle" fontSize={12} fill={GRAY}>허용 오차 ε</text>
              <polyline points={EPS_CURVE} fill="none" stroke={BLUE} strokeWidth={1.25} />
              {[[0.05, "약 4589"], [0.1, "약 1188"], [0.2, "약 320"]].map(([e, text]) => (
                <g key={String(e)}>
                  <circle cx={ex(Number(e))} cy={ey(size(4, Number(e)))} r={4.5} fill={BLUE} />
                  <text x={ex(Number(e)) + 9} y={ey(size(4, Number(e))) - 6} fontSize={12} fontWeight={700} fill={BLUE}>{String(text)}</text>
                </g>
              ))}
            </g>
          )}
          {active === 2 && (
            <g>
              <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <line x1={LEFT} x2={LEFT} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {[0, 5000, 10000].map((k) => <text key={k} x={LEFT - 6} y={ny(k) + 4} textAnchor="end" fontSize={12} fill={GRAY}>{k}</text>)}
              {[[3, "1000"], [6, "1,000,000"]].map(([e, text]) => (
                <g key={String(e)}>
                  <line x1={nx(Number(e))} x2={nx(Number(e))} y1={BASE} y2={BASE + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={nx(Number(e))} y={BASE + 18} textAnchor={e === 6 ? "end" : "middle"} fontSize={12} fill={GRAY}>{String(text)}</text>
                </g>
              ))}
              <text x={W / 2} y={BASE + 36} textAnchor="middle" fontSize={12} fill={GRAY}>점의 수 n (눈금 하나가 천 배)</text>
              <line x1={nx(3)} y1={ny(5921)} x2={nx(6)} y2={ny(11842)} stroke={BLUE} strokeWidth={1.25} />
              <line x1={nx(3)} y1={ny(5921)} x2={nx(3)} y2={BASE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={nx(6) - 1} y1={ny(11842)} x2={nx(6) - 1} y2={BASE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={nx(3)} cy={ny(5921)} r={4.5} fill={BLUE} />
              <circle cx={nx(6) - 1} cy={ny(11842)} r={4.5} fill={BLUE} />
              <text x={nx(3) - 8} y={ny(5921) - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>5921</text>
              <text x={nx(6) - 8} y={ny(11842) - 6} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>11,842</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
