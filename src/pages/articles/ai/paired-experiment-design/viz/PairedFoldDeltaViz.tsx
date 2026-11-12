import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 다섯 평가 묶음의 기존·새 점수(가정)를 묶음끼리 빼고 평균을 낸다.
 * 값은 천분의 일 단위 정수로 둔다: 기존 700·720·680·710·690, 새 706·724·679·715·693.
 * 차이 6·4·−1·5·3 → 합 17 → 평균 3.4(=0.0034).
 */
const BASE: readonly number[] = [700, 720, 680, 710, 690];
const NEW: readonly number[] = [706, 724, 679, 715, 693];
const DELTA = NEW.map((value, index) => value - BASE[index]);
const SUM = DELTA.reduce<number>((acc, value) => acc + value, 0);
const MEAN = SUM / DELTA.length;

const W = 400;
const H = 200;
const TOP = 26;
const BOTTOM = 166;
const cx = (index: number) => 86 + index * 68;

const fmt = (thousandths: number) => {
  const sign = thousandths > 0 ? "+" : thousandths < 0 ? "−" : "";
  return `${sign}${(Math.abs(thousandths) / 1000).toFixed(3)}`;
};

const SCENES = [
  {
    label: "같은 묶음끼리 짝짓기",
    summary: "기존 회색 · 새 파랑, 다섯 쌍",
    note: "묶음마다 기존 점수부터 0.680에서 0.720까지 다릅니다. 이 차이는 변경 하나가 만든 차이(가장 큰 것이 0.006)보다 큽니다. 그래서 다른 묶음끼리가 아니라 같은 묶음의 두 점끼리 비교합니다. (가정)",
  },
  {
    label: "묶음마다 새 값 − 기존 값",
    summary: "0.006 · 0.004 · −0.001 · 0.005 · 0.003",
    note: "각 묶음의 짝을 빼서 차이만 남깁니다. 네 묶음은 0선 위로, 세 번째 묶음만 0선 아래로 0.001 내려갑니다. 다섯 차이를 더하면 0.017입니다.",
  },
  {
    label: "평균은 0.0034",
    summary: "0.017 ÷ 5 = 0.0034",
    note: "평균선은 0보다 위에 있지만 세 번째 막대는 여전히 0선 아래입니다. 평균만 보고 모든 평가 묶음에서 좋아졌다고 말할 수는 없습니다.",
  },
] as const;

function ScoreDots() {
  const lo = 670;
  const hi = 730;
  const y = (value: number) => BOTTOM - ((value - lo) / (hi - lo)) * (BOTTOM - TOP);
  return (
    <>
      <circle cx={W - 104} cy={10} r={4} fill="#94a3b8" />
      <text x={W - 96} y={14} fontSize={10} fill="#64748b">기존</text>
      <circle cx={W - 58} cy={10} r={4} fill="#2563eb" />
      <text x={W - 50} y={14} fontSize={10} fill="#2563eb">새 점수</text>
      {[680, 700, 720].map((tick) => (
        <g key={tick}>
          <line x1={24} x2={W - 8} y1={y(tick)} y2={y(tick)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 4" />
          <text x={22} y={y(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{(tick / 1000).toFixed(2)}</text>
        </g>
      ))}
      {BASE.map((base, index) => (
        <g key={index}>
          <line x1={cx(index)} x2={cx(index)} y1={y(base)} y2={y(NEW[index])} stroke="#64748b" strokeWidth={1} />
          <circle cx={cx(index) - 9} cy={y(base)} r={5} fill="#94a3b8" />
          <circle cx={cx(index) + 9} cy={y(NEW[index])} r={5} fill="#2563eb" />
          <text x={cx(index) - 15} y={y(base) + 4} textAnchor="end" fontSize={9} fill="#64748b">{(base / 1000).toFixed(3)}</text>
          <text x={cx(index) + 15} y={y(NEW[index]) + 4} fontSize={9} fill="#2563eb">{(NEW[index] / 1000).toFixed(3)}</text>
        </g>
      ))}
    </>
  );
}

function DeltaBars({ showMean }: { showMean: boolean }) {
  const lo = -2;
  const hi = 7;
  const y = (value: number) => BOTTOM - ((value - lo) / (hi - lo)) * (BOTTOM - TOP);
  return (
    <>
      <line x1={24} x2={W - 8} y1={y(0)} y2={y(0)} stroke="#64748b" strokeWidth={1} />
      <text x={22} y={y(0) + 4} textAnchor="end" fontSize={10} fill="#64748b">0</text>
      {DELTA.map((delta, index) => {
        const negative = delta < 0;
        const top = negative ? y(0) : y(delta);
        const height = Math.abs(y(delta) - y(0));
        return (
          <g key={index}>
            <rect x={cx(index) - 14} y={top} width={28} height={height} rx={2} fill={negative ? "#dc2626" : "#2563eb"} opacity={0.85} />
            <text x={cx(index)} y={negative ? y(delta) + 13 : y(delta) - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill={negative ? "#dc2626" : "#1e40af"}>
              {fmt(delta)}
            </text>
          </g>
        );
      })}
      {showMean && (
        <g>
          <line x1={24} x2={W - 8} y1={y(MEAN)} y2={y(MEAN)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
          <text x={cx(2)} y={y(MEAN) - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">평균 +0.0034</text>
        </g>
      )}
    </>
  );
}

export default function PairedFoldDeltaViz() {
  return (
    <SceneShell
      eyebrow="짝지은 차이"
      title="다섯 평가 묶음에서 짝을 빼고 평균을 냅니다"
      description="칸 하나가 평가 묶음 하나입니다. 점수는 클수록 좋고, 값은 3절의 가정 사례 그대로입니다."
      ariaLabel="다섯 평가 묶음의 기존·새 점수, 묶음별 차이, 평균 0.0034"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? <ScoreDots /> : <DeltaBars showMean={active === 2} />}
          {BASE.map((_, index) => (
            <text key={index} x={cx(index)} y={H - 10} textAnchor="middle" fontSize={11} fontWeight={index === 2 && active > 0 ? 700 : 400} fill={index === 2 && active > 0 ? "#dc2626" : "#475569"}>
              묶음 {index + 1}
            </text>
          ))}
        </svg>
      )}
    />
  );
}
