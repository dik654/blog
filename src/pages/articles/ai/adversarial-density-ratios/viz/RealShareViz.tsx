import SceneShell from "./SceneShell";

/**
 * 본문 대응: #optimal-ratio — m(x)=p_data(x)+p_g(x), D*(x)=p_data(x)/m(x).
 * 글의 예(3:1 → 3/(3+1)=.75, 같으면 .5)를 세 위치에 놓고, 반대쪽 1:3 → 1/4=.25는 같은 식의 산수다.
 * 세 위치의 합을 모두 4칸으로 맞춘 것과 x₁·x₂·x₃ 위치는 설명용 가정이다.
 * 마지막 장면: 상수 discriminator의 .5는 equality 증거가 아니다(글의 interpretation).
 */
const COLUMNS = [
  { name: "x₁", real: 3, gen: 1, value: ".75" },
  { name: "x₂", real: 2, gen: 2, value: ".5" },
  { name: "x₃", real: 1, gen: 3, value: ".25" },
] as const;

type Column = { name: string; real: number; gen: number; value: string };
const COLS: readonly Column[] = COLUMNS;

const SCENES = [
  { label: "x₁ · real이 3배", summary: "D* = 3/(3+1) = .75", focus: 0, note: "x₁ 부근에 real 몫이 3칸, generated 몫이 1칸 모입니다. 전체 4칸 중 real이 3칸이므로 이상적인 discriminator는 .75를 냅니다." },
  { label: "x₂ · 두 density가 같음", summary: "D* = 2/(2+2) = .5", focus: 1, note: "두 몫이 같으면 real 몫은 전체의 절반입니다. 이때의 .5는 두 density가 그 위치에서 같다는 신호입니다." },
  { label: "x₃ · generated가 3배", summary: "D* = 1/(1+3) = .25", focus: 2, note: "반대로 generated 몫이 크면 D*는 .5 아래로 내려갑니다. 같은 식에 1과 3을 넣은 값입니다." },
  { label: "상수 discriminator의 .5", summary: "어디서나 .5 → 일치 증거 아님", focus: -1, note: "학습이 덜 됐거나 상수인 discriminator는 x₁·x₃처럼 몫이 다른 곳에서도 .5를 낼 수 있습니다. 그래서 .5만 보고 두 분포가 같다고 판정하지 않습니다." },
] as const;

const W = 360;
const H = 236;
const CELL = 22;
const BAR_W = 46;
const CENTERS: readonly number[] = [62, 180, 298];
const REAL = "#2563eb";
const GEN = "#d97706";
const MUTED = "#64748b";
const FAINT = "#cbd5e1";
const ALERT = "#dc2626";
const TOP = 46;

function Meter({ cx, y, value, color, label }: { cx: number; y: number; value: number; color: string; label: string }) {
  const x = cx - 46;
  return (
    <g>
      <rect x={x} y={y} width={92} height={8} rx={2} fill="none" stroke={FAINT} strokeWidth={1} />
      <rect x={x} y={y} width={92 * value} height={8} rx={2} fill={color} />
      <line x1={cx} x2={cx} y1={y - 3} y2={y + 11} stroke={MUTED} strokeWidth={1} strokeDasharray="2 2" />
      <text x={cx} y={y + 22} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function RealShareViz() {
  return (
    <SceneShell
      eyebrow="Real 몫으로 정규화"
      title="같은 x에서 두 source 몫을 쌓으면 D*는 real 몫의 비율입니다"
      description="칸 하나가 x 부근 density의 한 단위입니다. 파란 칸이 p_data(x), 주황 테두리 칸이 p_g(x)이고, 두 몫을 더한 m(x)가 막대 전체입니다. D*는 generator를 고정했을 때 이상적인 discriminator가 내는 real source 확률입니다. 두 source를 같은 비중으로 뽑는다는 글의 전제를 따르며, 세 위치와 4칸 합은 비율을 보이기 위한 가정입니다."
      ariaLabel="세 위치에서 real과 generated density 몫을 쌓은 막대와 이상적 discriminator 값 .75, .5, .25, 그리고 상수 discriminator .5 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const constant = scene.focus === -1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={14} y={8} width={10} height={10} fill={REAL} />
            <text x={28} y={17} fontSize={11} fill={MUTED}>p_data(x) 몫</text>
            <rect x={116} y={8} width={10} height={10} fill="none" stroke={GEN} strokeWidth={1.25} />
            <text x={130} y={17} fontSize={11} fill={MUTED}>p_g(x) 몫</text>
            <text x={346} y={17} textAnchor="end" fontSize={11} fill={MUTED}>막대 전체 = m(x)</text>
            {COLS.map((col, index) => {
              const on = constant || scene.focus === index;
              const cx = CENTERS[index];
              const x = cx - BAR_W / 2;
              const cells = Array.from({ length: col.real + col.gen }, (_, i) => i);
              return (
                <g key={col.name} opacity={on ? 1 : 0.32}>
                  <text x={cx} y={TOP - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={MUTED}>{col.name}</text>
                  {cells.map((i) => {
                    const isReal = i >= col.gen;
                    return (
                      <rect
                        key={i}
                        x={x}
                        y={TOP + i * CELL}
                        width={BAR_W}
                        height={CELL - 3}
                        rx={3}
                        fill={isReal ? REAL : "none"}
                        stroke={isReal ? REAL : GEN}
                        strokeWidth={1.25}
                      />
                    );
                  })}
                  <text x={cx} y={TOP + 4 * CELL + 14} textAnchor="middle" fontSize={12} fill={MUTED}>
                    {col.real} : {col.gen}
                  </text>
                  {constant ? (
                    <g>
                      <text x={cx} y={TOP + 4 * CELL + 30} textAnchor="middle" fontSize={11} fill={MUTED}>D* = {col.value}</text>
                      <Meter cx={cx} y={TOP + 4 * CELL + 40} value={0.5} color={index === 1 ? REAL : ALERT} label={index === 1 ? "D = .5 = D*" : "D = .5 ≠ D*"} />
                    </g>
                  ) : (
                    <g>
                      <text x={cx} y={TOP + 4 * CELL + 30} textAnchor="middle" fontSize={11} fill={MUTED}>
                        {col.real}/({col.real}+{col.gen})
                      </text>
                      <Meter cx={cx} y={TOP + 4 * CELL + 40} value={col.real / (col.real + col.gen)} color={REAL} label={`D* = ${col.value}`} />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
