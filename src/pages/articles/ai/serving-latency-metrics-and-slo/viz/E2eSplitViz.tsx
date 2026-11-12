import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #metrics — E2E = TTFT + (n−1)·TPOT 를 네 경우에 넣어 두 몫의 크기를 비교한다.
 * 5토큰: 1 + 4×0.08175 = 1.327초 / 200토큰: 1 + 199×0.05 = 10.95초
 * 평균 간격 30ms: 1 + 199×0.03 = 6.97초 / TTFT 0.3초: 0.3 + 199×0.05 = 10.25초 (모두 가정)
 */
const ROWS = [
  { label: "5토큰 · 3절 사례", ttft: 1, gaps: 4, tpot: 0.08175 },
  { label: "200토큰 · 평균 간격 50ms", ttft: 1, gaps: 199, tpot: 0.05 },
  { label: "평균 간격만 30ms로", ttft: 1, gaps: 199, tpot: 0.03 },
  { label: "첫 도착만 0.3초로", ttft: 0.3, gaps: 199, tpot: 0.05 },
];

const BASE_E2E = ROWS[1].ttft + ROWS[1].gaps * ROWS[1].tpot;
const AXIS = 12;
const TTFT_COLOR = "#64748b";
const GAP_COLOR = "#2563eb";

const sec = (v: number) => (Math.round(v * 100000) / 100000).toString();

export default function E2eSplitViz() {
  return (
    <VizFrame
      eyebrow="E2E 나누기"
      title="응답이 길어지면 전체 시간의 대부분은 간격의 합입니다"
      description={`막대 하나가 요청 하나의 E2E(마지막 토큰까지의 시간)입니다. 회색은 첫 토큰까지의 TTFT, 파랑은 그 뒤 간격 n−1개의 합(간격 수 × 평균 간격 TPOT)입니다. 가로축은 0–${AXIS}초입니다.`}
      note="네 경우 모두 본문 7절의 설명용 가정 숫자이며 장비 실측이 아닙니다."
    >
      <div className="min-w-0 space-y-4" data-viz-canvas>
        {ROWS.map((row, index) => {
          const gapSum = row.gaps * row.tpot;
          const total = row.ttft + gapSum;
          const saved = index >= 2 ? BASE_E2E - total : null;
          return (
            <div key={row.label} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
                <span className="font-bold">{row.label}</span>
                <span className="font-mono">
                  {sec(row.ttft)} + {row.gaps}×{sec(row.tpot)} = <strong>{sec(total)}초</strong>
                  {saved !== null && <span className="text-muted-foreground"> (−{sec(saved)})</span>}
                </span>
              </div>
              <div className="mt-1.5 flex h-5 w-full overflow-hidden rounded-sm bg-muted/40">
                <div className="h-full" style={{ width: `${(row.ttft / AXIS) * 100}%`, backgroundColor: TTFT_COLOR }} />
                <div className="h-full border-l border-background" style={{ width: `${(gapSum / AXIS) * 100}%`, backgroundColor: GAP_COLOR }} />
              </div>
            </div>
          );
        })}
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
          {[0, 3, 6, 9, 12].map((t) => (
            <span key={t}>{t}s</span>
          ))}
        </div>
        <p className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
          5토큰 사례에서는 TTFT 1초가 1.327초의 대부분이지만 200토큰에서는 간격 199개의 합 9.95초가 10.95초 가운데 약 91%를 차지합니다. 평균 간격을 20ms 줄이면 3.98초가 줄고, 첫 도착을 0.7초 줄이면 0.7초가 줄어듭니다.
        </p>
      </div>
    </VizFrame>
  );
}
