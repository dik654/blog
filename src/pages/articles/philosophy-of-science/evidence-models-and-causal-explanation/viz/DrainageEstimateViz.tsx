import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 비 오는 날 사고 20건 × 1/2(노면 경로) × 1/2(배수 개선) = 기대 감소 5건.
 * 절반이라는 두 값은 글이 "추가 증거가 있고 ~라면"으로 둔 조건이다.
 * 어느 사고가 어느 칸인지는 정해지지 않았고 칸은 개수만 나타낸다.
 */
const RAIN = "#2563eb";
const PATH = "#d97706";
const OTHER = "#94a3b8";
const CELL = 26;
const GAP = 4;

const SCENES = [
  { label: "출발점", summary: "사고 25건 중 비 오는 날 20건", step: 0, note: "계산은 비 오는 날의 20건에서 시작합니다. 나머지 5건은 이 경로 계산에 들어가지 않습니다." },
  { label: "노면 경로의 몫", summary: "20 × ½ = 10건 (가정)", step: 1, note: "20건 가운데 절반이 미끄러운 노면 경로를 거친다는 추가 증거가 있다고 합시다. 이 절반은 상관표에서 나오지 않는 조건입니다." },
  { label: "배수 개선의 몫", summary: "10 × ½ = 5건 (가정)", step: 2, note: "배수 개선이 그 경로를 절반 줄인다면 기대 감소는 약 5건입니다. 이 값도 앞의 절반과 함께 조건 위에 있습니다." },
  { label: "남는 가정", summary: "운전량이 그대로일 때의 5건", step: 3, note: "이 계산은 개입이 운전량을 바꾸지 않는다는 가정을 둡니다. 효과가 없을 때 아래 세 곳 가운데 무엇을 다시 볼지 알려 주는 것이 인과 계산의 쓸모입니다." },
] as const;

const LADDER = [
  { value: "20건", tag: "비 오는 날" },
  { value: "10건", tag: "노면 경로" },
  { value: "5건", tag: "기대 감소" },
];

export default function DrainageEstimateViz() {
  return (
    <SceneShell
      eyebrow="개입 효과 계산"
      title="5건은 가정 두 개를 곱해서 나온 값입니다"
      description="칸 하나가 사고 1건입니다. 칸의 자리는 개수만 나타내며 어느 사고가 어느 칸인지는 정해지지 않았습니다. 주황은 노면 경로의 몫, 점선 칸은 줄어들 것으로 기대하는 몫이고, 물음표는 그 몫이 가정에 달렸다는 표시입니다."
      ariaLabel="사고 20건에서 노면 경로 10건, 배수 개선 기대 감소 5건으로 줄어드는 계산"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        const fillFor = (i: number) => {
          if (step === 0) return { fill: RAIN, hollow: false };
          if (i >= 10) return { fill: RAIN, hollow: false };
          if (step >= 2 && i < 5) return { fill: PATH, hollow: true };
          return { fill: PATH, hollow: false };
        };
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 300 138" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={0} y={11} fontSize={12} fontWeight={700} fill="#64748b">비 오는 날 20건</text>
              {Array.from({ length: 20 }, (_, i) => {
                const { fill, hollow } = fillFor(i);
                const x = (i % 10) * (CELL + GAP);
                const y = 17 + Math.floor(i / 10) * (CELL + GAP);
                return (
                  <g key={i}>
                    <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={3} fill={hollow ? "none" : fill} stroke={fill} strokeWidth={1} strokeDasharray={hollow ? "3 3" : undefined} />
                    {hollow && step === 3 && <text x={x + CELL / 2} y={y + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill={PATH}>?</text>}
                  </g>
                );
              })}
              <text x={0} y={95} fontSize={12} fontWeight={700} fill="#64748b">그 외 5건</text>
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={i * (CELL + GAP) + 0.5} y={101.5} width={CELL - 1} height={CELL - 1} rx={3} fill={OTHER} />
              ))}
            </svg>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 text-center">
              {LADDER.map((item, index) => {
                const reached = index <= Math.min(step, 2);
                return (
                  <div key={item.value} className="contents">
                    {index > 0 && <span className={`font-mono text-xs ${reached ? "font-bold" : "text-muted-foreground/60"}`}>×½</span>}
                    <div className={`rounded-lg border px-1 py-1.5 ${reached ? "border-border bg-background" : "border-dashed border-border/50"}`}>
                      <span className={`block font-mono text-sm font-bold ${reached ? "" : "text-muted-foreground/50"}`}>{item.value}</span>
                      <span className={`block text-xs ${reached ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{item.tag}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`mt-3 grid grid-cols-3 gap-2 text-center text-xs ${step === 3 ? "visible" : "invisible"}`}>
              {["노면 경로", "운전량", "측정 오류"].map((word) => (
                <span key={word} className="rounded-md border border-dashed px-1 py-1.5" style={{ borderColor: PATH }}>{word}</span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
