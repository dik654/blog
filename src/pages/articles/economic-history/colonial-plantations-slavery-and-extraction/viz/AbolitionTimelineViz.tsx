import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 폐지 날짜와 돈이 간 방향을 같은 연도 축에 놓습니다.
 * 금액(파운드·프랑)은 단위가 달라 축에 올리지 않습니다. 아이티의 "50년 더"는 1838 + 50 = 1888까지 점선으로 그립니다.
 * 프랑스·미국·브라질의 소유주 보상은 글이 확인하지 않았으므로 물음표로 둡니다.
 */
const x = (year: number) => 52 + (year - 1800) * (300 / 90);
const LANES = [
  { name: "아이티", y: 52 },
  { name: "영국", y: 112 },
  { name: "프랑스", y: 158 },
  { name: "미국", y: 196 },
  { name: "브라질", y: 234 },
] as const;
const INK = "#64748b";
const AMBER = "#d97706";
const BLUE = "#2563eb";

const SCENES = [
  { label: "폐지 날짜의 순서", summary: "1834 → 1848 → 1865 → 1888", note: "영국은 1834년 8월 1일 폐지, 프랑스는 1848년 4월 27일 법령(각 식민지에 공포된 지 두 달 뒤 폐지), 미국은 1865년 1월 31일 의회 통과 뒤 12월 6일 비준, 브라질은 1888년 5월 13일 법률입니다. 날짜의 성격이 서로 다릅니다." },
  { label: "영국: 폐지 뒤에도", summary: "적어도 1838까지", note: "1807년 법은 그해 5월 1일부터 아프리카 해안의 노예 거래를 금지했을 뿐 노예제를 끝내지 않았습니다. 1834년 폐지 뒤에도 도제(apprenticeship) 제도 때문에 많은 사람에게 강제 노동은 적어도 1838년까지 이어졌습니다." },
  { label: "영국: 돈의 방향", summary: "2천만 파운드 → 농장주", note: "1833년 법 전문은 노무에 대한 권리를 빼앗겨 입을 손실을 보상한다고 적고 24조에서 재원 2천만 파운드를 정합니다. 사람에 대한 권리가 보상받는 재산이었다는 뜻입니다." },
  { label: "아이티: 독립의 대가", summary: "1억 5천만 프랑 → 옛 소유주 쪽", note: "1825년 칙령은 독립을 인정하는 대가로 1억 5천만 프랑을 요구했고 1838년 개정으로 남은 액수가 6천만 프랑으로 줄었습니다. 차입금과 이자까지 합친 1억 1,200만 프랑을 갚는 데 그 뒤로도 50년이 더 걸렸습니다. 돈은 노예로 일한 사람이 아니라 옛 소유주 쪽으로 갔습니다." },
  { label: "확인하지 않은 칸", summary: "프랑스·미국·브라질 = ?", note: "프랑스·미국·브라질에서 소유주 보상이 있었는지는 이 글에서 따로 확인하지 않았습니다. 없었다는 뜻이 아니라 비어 있다는 표시입니다. 파운드와 프랑은 단위가 달라 크기를 견주지 않았습니다." },
] as const;

function Dot({ year, y, color, hollow = false }: { year: number; y: number; color: string; hollow?: boolean }) {
  return <circle cx={x(year)} cy={y} r={4.5} fill={hollow ? "none" : color} stroke={color} strokeWidth={1} />;
}

function Label({ px, y, children, anchor = "start", color = INK, bold = false }: { px: number; y: number; children: string; anchor?: "start" | "middle" | "end"; color?: string; bold?: boolean }) {
  return <text x={px} y={y} fontSize={12} textAnchor={anchor} fill={color} fontWeight={bold ? 700 : 400}>{children}</text>;
}

export default function AbolitionTimelineViz() {
  return (
    <SceneShell
      eyebrow="폐지와 돈의 방향"
      title="폐지 날짜와 돈이 간 방향을 한 연도 축에 놓습니다"
      description="가로축은 연도입니다. 점은 글이 적은 날짜이고 빈 점은 소유주 보상을 확인하지 않은 나라입니다. 금액은 글자로만 적었습니다. 도제는 폐지 뒤에도 강제 노동이 이어지게 한 제도입니다."
      ariaLabel="영국, 프랑스, 미국, 브라질의 노예제 폐지 날짜와 영국, 아이티에서 돈이 소유주 쪽으로 간 사례의 연표"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 276" className="mx-auto block h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {LANES.map((lane) => (
            <g key={lane.name}>
              <text x={4} y={lane.y + 4} fontSize={12} fontWeight={700} fill={INK}>{lane.name}</text>
              <line x1={x(1800)} x2={x(1890)} y1={lane.y} y2={lane.y} stroke="#94a3b8" strokeWidth={1} opacity={0.5} />
            </g>
          ))}
          <line x1={x(1800)} x2={x(1890)} y1={254} y2={254} stroke="#94a3b8" strokeWidth={1} />
          {[1800, 1820, 1840, 1860, 1880].map((year) => (
            <g key={year}>
              <line x1={x(year)} x2={x(year)} y1={254} y2={259} stroke="#94a3b8" strokeWidth={1} />
              <text x={x(year)} y={272} fontSize={11} textAnchor="middle" fill={INK}>{year}</text>
            </g>
          ))}

          {active === 0 && (
            <>
              <Dot year={1834} y={112} color={BLUE} />
              <Label px={x(1834)} y={102} anchor="middle" bold color={BLUE}>1834 폐지</Label>
              <Dot year={1848} y={158} color={BLUE} />
              <Label px={x(1848)} y={148} anchor="middle" bold color={BLUE}>1848 법령</Label>
              <Dot year={1865} y={196} color={BLUE} />
              <Label px={x(1865)} y={186} anchor="middle" bold color={BLUE}>1865 비준</Label>
              <Dot year={1888} y={234} color={BLUE} />
              <Label px={x(1888) + 6} y={224} anchor="end" bold color={BLUE}>1888 법률</Label>
            </>
          )}
          {active === 1 && (
            <>
              <Dot year={1807} y={112} color={INK} />
              <Label px={x(1807) - 4} y={102} bold>1807 거래 금지</Label>
              <Dot year={1834} y={112} color={BLUE} />
              <Label px={x(1834)} y={102} bold color={BLUE}>1834 폐지</Label>
              <rect x={x(1834)} y={109} width={x(1838) - x(1834)} height={6} fill={AMBER} />
              <path d={`M${x(1838)} 112 H${x(1838) + 16}`} stroke={AMBER} strokeWidth={1} strokeDasharray="3 2" fill="none" />
              <Label px={x(1834)} y={130} bold color={AMBER}>도제: 적어도 1838까지 강제 노동</Label>
            </>
          )}
          {active === 2 && (
            <>
              <Dot year={1834} y={112} color={BLUE} />
              <Label px={x(1834)} y={102} anchor="middle" bold color={BLUE}>1833 법 · 1834 폐지</Label>
              <Label px={x(1834) - 12} y={130} bold color={AMBER}>2천만 파운드 → 식민지 농장주</Label>
            </>
          )}
          {active === 3 && (
            <>
              <Dot year={1825} y={52} color={AMBER} />
              <Label px={x(1825) - 4} y={18} bold color={AMBER}>1825 칙령 1억 5천만 프랑</Label>
              <line x1={x(1825)} x2={x(1825)} y1={22} y2={47} stroke={AMBER} strokeWidth={1} />
              <Dot year={1838} y={52} color={AMBER} />
              <Label px={x(1838)} y={40} bold color={AMBER}>1838 개정 · 남은 6천만 프랑</Label>
              <path d={`M${x(1838) + 5} 52 H${x(1888)} m-5 -3 l5 3 l-5 3`} stroke={AMBER} strokeWidth={1} strokeDasharray="3 2" fill="none" />
              <Label px={x(1838) + 6} y={68}>그 뒤로도 50년 더 걸려 상환</Label>
              <Label px={356} y={84} anchor="end">차입금·이자 합쳐 1억 1,200만 프랑</Label>
            </>
          )}
          {active === 4 && (
            <>
              <Dot year={1825} y={52} color={AMBER} />
              <Label px={x(1825) + 8} y={42} bold color={AMBER}>돈 → 옛 소유주 쪽</Label>
              <Dot year={1834} y={112} color={AMBER} />
              <Label px={x(1834) + 8} y={102} bold color={AMBER}>돈 → 농장주</Label>
              <Dot year={1848} y={158} color={INK} hollow />
              <Label px={x(1848) + 8} y={148} bold>? 보상 미확인</Label>
              <Dot year={1865} y={196} color={INK} hollow />
              <Label px={x(1865) + 8} y={186} bold>? 미확인</Label>
              <Dot year={1888} y={234} color={INK} hollow />
              <Label px={x(1888) + 6} y={224} anchor="end" bold>? 미확인</Label>
            </>
          )}
        </svg>
      )}
    />
  );
}
