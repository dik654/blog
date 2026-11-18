import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 모든 만기의 앞선(선도) 금리 흔들림 σ = 연 1% (가정).
 * 0~2년 쌓인 흔들림 = 1% × 2 = 2% (높이 1%·폭 2년 직사각형 넓이), 평균 몫 = 1% × 2% = 0.02% = 연 2bp.
 * 하루 2bp ÷ 252 = 0.0079bp ≈ 0.008bp, 하루 표준 움직임 1% ÷ √252 ≈ 6.3bp.
 * 마지막 장면은 같은 가정과 8절 식 μ = σ × σT로 1년·5년 만기를 계산한 값입니다(1bp, 5bp).
 */
const W = 360;
const H = 150;
const LEFT = 34;
const RIGHT = 18;
const BASE = 118;
const LINE_Y = 46;
const MAX_T = 5;
const tx = (years: number) => LEFT + (years / MAX_T) * (W - LEFT - RIGHT);

const DAILY_DRIFT_BP = 2 / 252;
const DAILY_SD_BP = 100 / Math.sqrt(252);

const SCENES = [
  { label: "만기별 흔들림", summary: "모든 만기 σ = 연 1%", area: 0, marks: [] as number[], rows: ["−", "−", "−"], daily: false, note: "가로는 앞선 금리의 만기, 세로는 그 만기의 연 흔들림입니다. 설명을 위해 모든 만기의 흔들림을 1%로 같게 둡니다(가정)." },
  { label: "2년까지 쌓인 흔들림", summary: "1% × 2년 = 2%", area: 2, marks: [] as number[], rows: ["2%", "−", "−"], daily: false, note: "지금부터 2년까지 각 만기의 흔들림을 더한 값은 높이 1%·폭 2년인 직사각형의 넓이, 곧 2%입니다." },
  { label: "평균 몫", summary: "1% × 2% = 연 2bp", area: 2, marks: [2], rows: ["2%", "1%", "0.02% = 2bp"], daily: false, note: "2년 앞 금리 자신의 흔들림 1%를 쌓인 흔들림 2%에 곱하면 0.02%, 곧 연 2bp입니다. 흔들림을 정하는 순간 이 평균 몫은 차익이 없도록 묶여 마음대로 고를 수 없습니다." },
  { label: "하루로 보면", summary: "약 0.008bp 대 약 6.3bp", area: 2, marks: [2], rows: ["2%", "1%", "0.02% = 2bp"], daily: true, note: "하루로 나누면 평균 몫은 약 0.008bp이고 무작위 한 표준 움직임은 약 6.3bp입니다. 아래 막대에서 평균 몫은 거의 보이지 않지만, 긴 기간의 많은 만기와 복리로 쌓이며 채권과 옵션 가격을 맞추는 제약이 됩니다." },
  { label: "만기가 길면", summary: "1년 1bp · 2년 2bp · 5년 5bp", area: 5, marks: [1, 2, 5], rows: ["만기(년) × 1%", "1%", "만기(년) × 1bp"], daily: false, note: "같은 가정에서 쌓인 흔들림은 만기에 비례하므로 8절 식에 넣으면 1년 앞은 연 1bp, 5년 앞은 연 5bp입니다. 실제 시장은 만기마다 흔들림이 다르고 요인도 여럿이라 이 값은 식을 읽기 위한 대입입니다." },
] as const;

const ROW_LABELS = ["쌓인 흔들림", "× 그 만기의 흔들림", "= 평균 몫(연)"] as const;

export default function HjmDriftViz() {
  return (
    <SceneShell
      eyebrow="차익 없는 평균 몫"
      title="흔들림을 정하면 평균 몫은 넓이 × 높이로 정해집니다"
      description="앞선(선도) 금리는 오늘 시장에서 읽히는 미래 한 구간의 금리입니다. 1bp는 0.01%포인트입니다. 숫자는 본문 3절의 가정이며 금리 전망이 아닙니다."
      ariaLabel="상수 흔들림 1퍼센트에서 2년 앞 선도금리의 차익 없는 평균 몫 2bp를 직사각형 넓이로 계산"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {scene.area > 0 ? (
                <rect x={tx(0)} y={LINE_Y} width={tx(scene.area) - tx(0)} height={BASE - LINE_Y} fill="#bfdbfe" opacity={0.7} stroke="#2563eb" strokeWidth={1} />
              ) : null}
              {scene.area === 2 ? (
                <text x={(tx(0) + tx(2)) / 2} y={(LINE_Y + BASE) / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">넓이 2%</text>
              ) : null}
              <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <line x1={LEFT} x2={LEFT} y1={20} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <line x1={LEFT} x2={W - RIGHT} y1={LINE_Y} y2={LINE_Y} stroke="#475569" strokeWidth={1.25} />
              <text x={LEFT - 6} y={LINE_Y + 4} textAnchor="end" fontSize={11} fill="#475569">1%</text>
              <text x={LEFT - 6} y={BASE + 4} textAnchor="end" fontSize={11} fill="#64748b">0</text>
              {[0, 1, 2, 3, 4, 5].map((year) => (
                <g key={year}>
                  <line x1={tx(year)} x2={tx(year)} y1={BASE} y2={BASE + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={tx(year)} y={BASE + 17} textAnchor="middle" fontSize={11} fill="#64748b">{year}년</text>
                </g>
              ))}
              {scene.marks.map((year, n) => (
                <g key={year}>
                  <circle cx={tx(year)} cy={LINE_Y} r={5} fill="#d97706" />
                  <text x={tx(year)} y={LINE_Y - 10 - (n % 2) * 14} textAnchor={year === MAX_T ? "end" : "middle"} fontSize={11} fontWeight={700} fill="#b45309">{`${year}년 → 연 ${year}bp`}</text>
                </g>
              ))}
            </svg>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {ROW_LABELS.map((label, n) => (
                <div key={label} className="rounded-lg border border-border px-1 py-2">
                  <span className="block text-muted-foreground">{label}</span>
                  <strong className="font-mono">{scene.rows[n]}</strong>
                </div>
              ))}
            </div>
            <div className={`space-y-2 text-xs ${scene.daily ? "" : "invisible"}`} aria-hidden={!scene.daily}>
              {[
                { label: "하루 평균 몫", value: DAILY_DRIFT_BP, text: "약 0.008bp", color: "#d97706" },
                { label: "하루 표준 움직임", value: DAILY_SD_BP, text: "약 6.3bp", color: "#64748b" },
              ].map((bar) => (
                <div key={bar.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)_5rem] items-center gap-2">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div className="h-full min-w-[2px] rounded-sm" style={{ width: `${(bar.value / DAILY_SD_BP) * 100}%`, backgroundColor: bar.color }} />
                  </div>
                  <span className="text-right font-mono">{bar.text}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
