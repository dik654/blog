import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 3천만 원을 연 200만 원으로 나누면 15년.
 * 칸 하나 = 100만 원. 학비 10칸 + 포기 소득 20칸 = 30칸. 한 해에 2칸씩 채웁니다.
 * 30÷2=15년, 5년이면 10칸. 전부 글의 가정입니다.
 */
const SCENES = [
  { label: "회수할 비용", summary: "1천 + 2천 = 3천만 원", years: 0, note: "칸 하나가 100만 원입니다. 학비는 학교에 낸 돈 10칸, 포기 소득은 취업을 1년 늦춰 벌지 못한 돈 20칸입니다. 둘 다 비교할 초기 비용에 들어갑니다." },
  { label: "해마다 두 칸", summary: "1년 → 200만 원", years: 1, note: "교육 뒤 연 임금이 200만 원 높아진다면 한 해에 두 칸씩 채웁니다. 이 200만 원이 매년 계속된다는 전제가 필요합니다." },
  { label: "5년 뒤", summary: "10칸 채움 · 20칸 남음", years: 5, note: "학비만 나누면 5년이지만 그때 채운 돈은 1천만 원, 학비와 같은 크기일 뿐입니다. 포기 소득 2천만 원이 그대로 남습니다. 칸을 채우는 순서는 세기 위한 배치입니다." },
  { label: "15년 뒤", summary: "30칸 ÷ 2칸 = 15년", years: 15, note: "30칸이 모두 찹니다. 세금과 할인(미래의 돈을 지금 가치로 낮춰 세는 일), 임금 성장과 실업을 생략한 단순 계산이며, 퇴학이나 산업 이동이 있으면 실제 경로가 달라집니다." },
] as const;

const X0 = 30;
const CELL = 30;
const YEARS = Array.from({ length: 15 }, (_, i) => i + 1);
const RUNS = [
  { from: 0, count: 10, y: 22, label: "학비 1천만 원 · 10칸", tone: "#b45309" },
  { from: 10, count: 10, y: 68, label: "포기 소득 2천만 원 · 20칸", tone: "#475569" },
  { from: 20, count: 10, y: 94, label: "", tone: "#475569" },
] as const;

export default function PaybackCellsViz() {
  return (
    <SceneShell
      eyebrow="단순 회수 기간"
      title="한 해 두 칸씩 채우면 서른 칸에 15년이 걸립니다"
      description="칸 하나가 100만 원입니다. 사례 금액은 글이 놓은 값이며(가정), 특정 학교나 학위의 실측 수익률이 아닙니다."
      ariaLabel="학비와 포기 소득 30칸을 연 2칸씩 채워 15년에 회수하는 계산"
      scenes={SCENES}
      render={(index) => {
        const { years } = SCENES[index];
        const filled = years * 2;
        return (
          <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            {RUNS.map((run) => (
              <g key={run.from}>
                {run.label && <text x={X0} y={run.y - 6} fontSize={11} fontWeight={700} fill={run.tone}>{run.label}</text>}
                {Array.from({ length: run.count }, (_, i) => {
                  const on = run.from + i < filled;
                  return (
                    <rect key={i} x={X0 + i * CELL} y={run.y} width={CELL - 2} height={22} rx={3} fill={on ? "#2563eb" : "none"} fillOpacity={on ? 0.8 : 0} stroke={on ? "#2563eb" : run.tone} strokeWidth={1} />
                  );
                })}
              </g>
            ))}
            <text x={X0} y={136} fontSize={11} fill="#64748b">교육 뒤 지난 해</text>
            {YEARS.map((year) => {
              const on = year <= years;
              return (
                <g key={year}>
                  <rect x={X0 + (year - 1) * 20} y={142} width={18} height={12} rx={2} fill={on ? "#2563eb" : "none"} fillOpacity={on ? 0.8 : 0} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  {(year === 1 || year === 5 || year === 15) && (
                    <text x={X0 + (year - 1) * 20 + 9} y={169} textAnchor="middle" fontSize={11} fill="currentColor">{year}년</text>
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
