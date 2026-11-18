import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 호프만(2018) 연표의 순서.
 * 1976 가구책임제 비공식 시작 → 1978 연설·3중전회 → 1979 대외 개방 착수·가구책임제 제한적 공식 용인
 * → 1980 첫 네 경제특구 → 1984~1987 국유기업 개혁. 이중 경로는 연표가 아니라 강연 본문의 서술이라 연도를 붙이지 않는다.
 */
const LANES = ["정치 결정", "농촌 가구", "대외·특구", "국유기업"] as const;
const LANE_Y = [40, 98, 158, 210] as const;
const X0 = 112;
const YEAR_W = 28;
const x = (year: number) => X0 + (year - 1976) * YEAR_W;

interface Mark {
  lane: number;
  from: number;
  to: number;
  label: string;
  below?: boolean;
  dashed?: boolean;
  scene: number;
}

const MARKS: readonly Mark[] = [
  { lane: 1, from: 1976, to: 1976, label: "비공식 시작", dashed: true, scene: 0 },
  { lane: 0, from: 1978, to: 1978, label: "연설·3중전회", scene: 1 },
  { lane: 1, from: 1979, to: 1979, label: "제한적 공식 용인", below: true, scene: 2 },
  { lane: 2, from: 1979, to: 1979, label: "개방 착수", scene: 2 },
  { lane: 2, from: 1980, to: 1980, label: "첫 네 특구", below: true, scene: 3 },
  { lane: 3, from: 1984, to: 1987, label: "기업 개혁", scene: 4 },
];

const TICKS = [1976, 1978, 1980, 1982, 1984, 1986, 1988] as const;

const SCENES = [
  { label: "1976", summary: "가구책임제가 비공식으로 시작", note: "연표는 가구책임제가 공식 용인보다 먼저, 1976년에 비공식으로 시작됐다고 적습니다. 점선 동그라미는 아직 공식 제도가 아니라는 표시입니다." },
  { label: "1978", summary: "덩샤오핑 연설 · 제11기 3중전회", note: "중앙공작회의의 덩샤오핑 연설과 제11기 3중전회는 정치 결정 줄에 놓입니다. 농촌에서는 이미 비공식 실천이 있던 상태입니다." },
  { label: "1979", summary: "대외 개방 착수 · 가구책임제 제한적 공식 용인", note: "같은 해에 두 줄이 함께 움직입니다. 가구책임제는 이때 제한적으로 공식 용인됐고, 대외 개방도 착수됐습니다." },
  { label: "1980", summary: "첫 네 경제특구", note: "외국 투자·수출·기업 규칙을 한정된 지역에서 먼저 시험하는 경제특구가 처음 네 곳 생깁니다." },
  { label: "1984~1987", summary: "국유기업 개혁", note: "국유기업 개혁은 한 해의 점이 아니라 여러 해에 걸친 막대로 적힙니다. 앞의 제도들이 사라진 뒤가 아니라 그 위에 겹쳐 들어옵니다." },
  { label: "연표 밖의 이중 경로", summary: "연도 없이 강연 본문이 서술", note: "계획 가격과 시장 가격을 함께 굴린 이중 경로는 연표의 한 칸이 아니라 강연 본문이 가장 중요한 전환 제도로 서술합니다. 그래서 축 위에 연도를 찍지 않았습니다." },
] as const;

export default function ReformTimelineViz() {
  return (
    <SceneShell
      eyebrow="개혁 순서"
      title="개혁은 한 번의 법이 아니라 여러 줄에서 차례로 겹쳤습니다"
      description="항목마다 연도와 제도 영역(정치 결정·농촌 가구·대외·특구·국유기업)을 붙여 순서대로 놓았습니다. 버트 호프만의 2018년 강연문에 붙은 '중국 개혁 40단계' 연표에서 본문이 고른 항목만 옮겼습니다."
      ariaLabel="1976년부터 1987년까지 정치, 농촌 가구, 대외 특구, 국유기업 줄에 놓인 개혁 항목"
      scenes={SCENES}
      render={(active) => (
        <div className="flex min-w-0 flex-col">
          <svg viewBox="0 0 480 254" className="mx-auto hidden h-auto w-full max-w-[540px] sm:block" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {LANES.map((lane, i) => (
              <g key={lane}>
                <line x1={X0 - 8} x2={470} y1={LANE_Y[i]} y2={LANE_Y[i]} stroke="#cbd5e1" strokeWidth={1} />
                <text x={8} y={LANE_Y[i] + 5} fontSize={14} fontWeight={600} fill="#475569">{lane}</text>
              </g>
            ))}
            {TICKS.map((year) => (
              <g key={year}>
                <line x1={x(year)} x2={x(year)} y1={228} y2={233} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(year)} y={249} fontSize={12} textAnchor="middle" fill="#64748b">{year}</text>
              </g>
            ))}
            {MARKS.map((mark) => {
              const shown = mark.scene <= active;
              const current = mark.scene === active || active === SCENES.length - 1;
              const color = current ? "#2563eb" : "#94a3b8";
              const y = LANE_Y[mark.lane];
              const cx = (x(mark.from) + x(mark.to)) / 2;
              return (
                <g key={`${mark.lane}-${mark.from}`} opacity={shown ? 1 : 0}>
                  {mark.to > mark.from ? (
                    <rect x={x(mark.from)} y={y - 6} width={x(mark.to) - x(mark.from)} height={12} rx={3} fill={color} />
                  ) : (
                    <circle cx={x(mark.from)} cy={y} r={6} fill={mark.dashed ? "#ffffff" : color} stroke={color} strokeWidth={1.25} strokeDasharray={mark.dashed ? "2 2" : undefined} />
                  )}
                  <text x={cx} y={mark.below ? y + 22 : y - 12} fontSize={13} textAnchor="middle" fontWeight={current ? 700 : 400} fill={current ? "#1d4ed8" : "#64748b"}>
                    {mark.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <ol className="space-y-1.5 sm:hidden" aria-label="연도순 목록">
            {MARKS.map((mark) => {
              const shown = mark.scene <= active;
              const current = mark.scene === active || active === SCENES.length - 1;
              return (
                <li
                  key={`m-${mark.lane}-${mark.from}`}
                  className={`grid grid-cols-[4.75rem_5rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-2 py-1.5 text-sm leading-5 ${shown ? (current ? "border-primary" : "border-border") : "border-border/30 opacity-25"}`}
                >
                  <span className={`font-mono text-xs ${current && shown ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {mark.to > mark.from ? `${mark.from}~${mark.to}` : mark.from}
                  </span>
                  <span className="text-xs text-muted-foreground">{LANES[mark.lane]}</span>
                  <span className={current && shown ? "font-semibold" : ""}>
                    {mark.label}
                  </span>
                </li>
              );
            })}
          </ol>
          <div
            className={`order-first mb-3 rounded-lg border border-dashed sm:order-none sm:mb-0 sm:mt-3 px-3 py-2 text-sm leading-6 ${active === SCENES.length - 1 ? "border-primary text-foreground" : "border-border/40 text-muted-foreground/40"}`}
          >
            <span className="font-semibold">이중 경로(계획 가격 + 시장 가격)</span> · 연도 없음, 강연 본문의 서술
          </div>
        </div>
      )}
    />
  );
}
