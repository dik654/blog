import SceneShell from "./SceneShell";

/**
 * 본문 대응: 도입 "같은 사건에 숫자를 넣습니다" — (가정) 90GB weight를 48GB 두 장에 45GB씩 나눈다.
 * 합계로 보면 96 − 90 = 6GB가 남지만, 실제로는 장치마다 48 − 45 = 3GB만 남는다.
 * Runtime state와 통신 buffer의 크기는 글에 없으므로 막대로 그리지 않고 3GB와의 비교만 보인다.
 */
const TOTAL = 96;
const CARD = 48;
const WEIGHT = 90;
const HALF = WEIGHT / 2;

const SCENES = [
  { label: "합계로 보면", summary: `${TOTAL} − ${WEIGHT} = ${TOTAL - WEIGHT}GB 남음`, note: "두 장의 용량을 더한 96GB 한 덩어리로 보면 90GB weight를 넣고도 6GB가 남아 넉넉해 보입니다. 하지만 이런 한 덩어리 장치는 없습니다." },
  { label: "실제로는 두 장치", summary: `장치마다 ${CARD} − ${HALF} = ${CARD - HALF}GB`, note: "각 GPU는 자기 48GB만 씁니다. 90GB를 45GB씩 나누면 장치마다 남는 자리는 3GB입니다." },
  { label: "실행 상태가 들어갈 자리", summary: "장치마다 3GB 안에 들어가야", note: "Runtime state와 통신 buffer는 장치마다 따로 필요합니다. 이것이 3GB를 넘으면 총량 96GB가 있어도 실행은 실패합니다. 글에 그 크기가 정해져 있지 않아 막대로 그리지 않았습니다." },
] as const;

const W = 360;
const LEFT = 12;
const SCALE = (W - 2 * LEFT) / TOTAL;
const BAR_H = 30;

function Bar({ y, capacity, used, label, highlight }: { y: number; capacity: number; used: number; label: string; highlight: boolean }) {
  const width = capacity * SCALE;
  const usedW = used * SCALE;
  return (
    <g>
      <text x={LEFT} y={y - 6} fontSize={14} fontWeight={700} fill="#475569">{label}</text>
      <rect x={LEFT} y={y} width={width} height={BAR_H} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />
      <rect x={LEFT} y={y} width={usedW} height={BAR_H} rx={3} fill="#6366f1" fillOpacity={0.35} stroke="#6366f1" strokeWidth={1} />
      <text x={LEFT + usedW / 2} y={y + 20} textAnchor="middle" fontSize={14} fontWeight={700} fill="#4338ca">weight {used}GB</text>
      <rect x={LEFT + usedW} y={y} width={width - usedW} height={BAR_H} fill={highlight ? "#f59e0b" : "#10b981"} fillOpacity={0.25} stroke={highlight ? "#d97706" : "#059669"} strokeWidth={1} />
      <text x={LEFT + width + 4} y={y + 20} fontSize={14} fontWeight={700} fill={highlight ? "#b45309" : "#047857"}>{capacity - used}GB</text>
    </g>
  );
}

export default function SplitFitViz() {
  return (
    <SceneShell
      eyebrow="합계와 장치별 여유"
      title="96GB에 90GB가 들어가 보여도 장치마다 남는 건 3GB입니다"
      description="막대 길이는 같은 GB 눈금입니다. 90GB weight를 두 장에 반씩 나눈 위 사례(가정)를 그대로 씁니다."
      ariaLabel="합계 96GB와 장치별 48GB 두 개에서 90GB weight를 넣은 뒤 남는 용량 비교"
      scenes={SCENES}
      render={(active) => {
        const split = active >= 1;
        const runtime = active === 2;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W + 40} 132`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {split ? (
                <>
                  <Bar y={24} capacity={CARD} used={HALF} label="GPU 0 · 자기 48GB" highlight={runtime} />
                  <Bar y={94} capacity={CARD} used={HALF} label="GPU 1 · 자기 48GB" highlight={runtime} />
                </>
              ) : (
                <>
                  <Bar y={48} capacity={TOTAL} used={WEIGHT} label="두 장을 더한 96GB (실제로는 없는 장치)" highlight={false} />
                </>
              )}
            </svg>
            <div className="mt-3 grid min-w-0 grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className={`rounded-lg border px-3 py-2 ${runtime ? "border-emerald-600/60" : "border-border/40 text-muted-foreground/50"}`}>
                <p className="font-bold">runtime state + 통신 buffer ≤ 3GB</p>
                <p className="mt-1">장치별 fit 판정을 통과</p>
              </div>
              <div className={`rounded-lg border px-3 py-2 ${runtime ? "border-red-600/60" : "border-border/40 text-muted-foreground/50"}`}>
                <p className="font-bold">runtime state + 통신 buffer {">"} 3GB</p>
                <p className="mt-1">총량 96GB여도 → 실패</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
