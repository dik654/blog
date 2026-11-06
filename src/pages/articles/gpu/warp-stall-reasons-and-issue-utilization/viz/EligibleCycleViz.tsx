import SceneShell from "./SceneShell";

/**
 * 본문 대응: #eligible-issue-slot — cycle 당 최대 한 번 issue 하는 단순 모형.
 * 평균 0.8 → issue 비율 80% 이하, 2·0 번갈아 → 평균 1, 50%. 10 cycle 배열은 셈을 보이려는 가정.
 */
const CASES = [
  { label: "평균 0.8, 상한에 닿음", values: [1, 1, 1, 1, 0, 1, 1, 1, 1, 0], note: "Eligible 이 서로 다른 cycle 에 흩어지면 issue cycle 은 8개입니다. 평균 0.8 에서 issue 비율은 이 80%를 넘을 수 없습니다." },
  { label: "평균 0.8, 몰려 있음", values: [2, 0, 2, 0, 0, 2, 0, 2, 0, 0], note: "같은 0.8 이어도 2인 cycle 에 몰리면 issue cycle 은 4개입니다. 한 cycle 에 하나만 issue 하므로 남은 warp 는 not selected 가 됩니다." },
  { label: "평균 1, 2와 0이 번갈아", values: [2, 0, 2, 0, 2, 0, 2, 0, 2, 0], note: "2와 0이 번갈아 나오면 평균은 1이지만 issue cycle 비율은 50%입니다. 평균 1이 매 cycle issue 했다는 뜻은 아닙니다." },
  { label: "평균 1, 매 cycle 하나", values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], note: "같은 평균 1 이어도 매 cycle 하나씩이면 100%입니다. 그래서 평균 eligible 은 상한만 말해 줍니다." },
] as const;

const stats = (values: readonly number[]) => {
  const sum = values.reduce<number>((total, value) => total + value, 0);
  const issued = values.filter((value) => value >= 1).length;
  return { mean: sum / values.length, rate: (issued / values.length) * 100, notSelected: sum - issued };
};

const SCENES = CASES.map((item) => {
  const s = stats(item.values);
  return { label: item.label, summary: `평균 ${s.mean.toFixed(1)} → issue ${s.rate}%`, note: item.note };
});

const LEFT = 56;
const COL = 30;
const SELECTED = "#2563eb";
const WAITING = "#16a34a";

export default function EligibleCycleViz() {
  return (
    <SceneShell
      eyebrow="평균과 분포"
      title="평균 eligible 이 같아도 issue 비율은 분포에 따라 달라집니다"
      description="한 열이 1 cycle, 네모 하나가 그 cycle 의 eligible warp 하나입니다. Cycle 당 최대 한 번 issue 하는 글의 단순 모형이고, 10 cycle 배열은 가정입니다."
      ariaLabel="같은 평균 eligible 에서 분포에 따라 달라지는 issue cycle 비율"
      scenes={SCENES}
      render={(active) => {
        const values: readonly number[] = CASES[active].values;
        const s = stats(values);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 132" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={0} y={29} fontSize={11} fill="currentColor">eligible</text>
              <text x={0} y={102} fontSize={11} fill="currentColor">issue</text>
              {values.map((value, cycle) => {
                const x = LEFT + cycle * COL;
                return (
                  <g key={cycle}>
                    {value === 2 && (
                      <g>
                        <rect x={x} y={8} width={26} height={24} fill="none" stroke={WAITING} strokeWidth={1} />
                        <text x={x + 13} y={25} textAnchor="middle" fontSize={11} fill="currentColor">N</text>
                      </g>
                    )}
                    {value >= 1 ? (
                      <g>
                        <rect x={x} y={36} width={26} height={24} fill={SELECTED} fillOpacity={0.3} stroke={SELECTED} strokeWidth={1} />
                        <text x={x + 13} y={53} textAnchor="middle" fontSize={11} fill="currentColor">●</text>
                      </g>
                    ) : (
                      <rect x={x} y={36} width={26} height={24} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                    )}
                    <rect x={x} y={88} width={26} height={20} fill={value >= 1 ? SELECTED : "none"} fillOpacity={0.6} stroke={value >= 1 ? SELECTED : "#94a3b8"} strokeWidth={1} strokeDasharray={value >= 1 ? undefined : "3 3"} />
                    <text x={x + 13} y={126} textAnchor="middle" fontSize={11} fill="currentColor">{cycle + 1}</text>
                  </g>
                );
              })}
              <line x1={LEFT} x2={LEFT + 10 * COL - 4} y1={74} y2={74} stroke="#94a3b8" strokeOpacity={0.5} strokeWidth={1} />
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="border border-border p-2"><div className="text-muted-foreground">평균 eligible</div><div className="mt-1 font-mono text-sm font-bold">{s.mean.toFixed(1)}</div></div>
              <div className="border border-border p-2"><div className="text-muted-foreground">issue cycle</div><div className="mt-1 font-mono text-sm font-bold">{s.rate}%</div></div>
              <div className="border border-border p-2"><div className="text-muted-foreground">not selected</div><div className="mt-1 font-mono text-sm font-bold">{s.notSelected}번</div></div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">● 선택 · N 준비됐지만 밀림 · 점선 빈 cycle</p>
          </div>
        );
      }}
    />
  );
}
