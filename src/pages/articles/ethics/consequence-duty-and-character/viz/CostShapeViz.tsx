import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 같은 기대값 100만원이 부담의 위치와 모양을 말해 주지 않는다.
 * 3절 가정: 회수 100만원, 중증 반응 2%, 발생 시 5000만원. 0.02 × 5000만 = 100만.
 * 회수 비용의 몫은 글에 없으므로 크기를 그리지 않는다.
 */
const INK = "#64748b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const W = 360;
const H = 200;
const SHARES = [["회사"], ["배송 기사"], ["판매점"], ["다시 만드는", "사람"]];
const BAR_MAX = 300; // 5000만원의 막대 길이
const barOf = (man: number) => (man / 5000) * BAR_MAX;

const SCENES = [
  { label: "회수: 여러 곳이 나눕니다", summary: "총 100만원", note: "회수 비용 100만원은 회사, 배송 기사, 판매점, 식품을 다시 만들어야 하는 사람에게 나뉩니다. 누가 얼마를 맡는지는 글에 정해져 있지 않아 칸 크기로 몫을 나타내지 않았습니다." },
  { label: "미회수: 평균을 만드는 칸", summary: "(2 × 5000만) ÷ 100 = 100만원", note: "2%를 눈으로 보려고 같은 결정을 100번 되풀이한다고 쳤습니다(가정). 칸 하나는 결정 한 번이고, 도시락 한 개가 아닙니다. 칸 두 개의 5000만원을 100칸에 고르게 나누면 기대 손실 100만원이 됩니다. 빨간 칸의 위치에는 뜻이 없습니다." },
  { label: "실제 결정은 한 번입니다", summary: "0원 또는 5000만원", note: "한 번의 결정에서 생기는 결과는 두 갈래뿐입니다. 평균인 100만원을 치르는 갈래는 없고, 5000만원은 알레르기가 있는 고객 한 명에게 집중될 수 있습니다." },
  { label: "같은 잣대에 놓으면", summary: "100만원 대 5000만원, 50배", note: "회수 총액과 기대 손실은 둘 다 100만원이라 막대 길이가 같습니다. 사고가 났을 때의 5000만원은 그 50배입니다. 숫자는 설명을 위한 가정이고, 사람의 가치를 뜻하지 않습니다." },
] as const;

export default function CostShapeViz() {
  return (
    <SceneShell
      eyebrow="같은 기대값, 다른 모양"
      title="100만원이 어디에 어떤 모양으로 떨어지는지 봅니다"
      description="3절의 가정 수치인 회수 비용 100만원, 중증 반응 가능성 2%, 발생 시 5000만원을 그대로 씁니다. 기대 손실은 확률과 피해액을 곱한 평균값입니다."
      ariaLabel="회수 비용 100만원의 분산과 미회수 기대 손실 100만원의 집중 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <>
              <rect x={8} y={12} width={344} height={36} rx={6} fill={GREEN} fillOpacity={0.14} stroke={GREEN} strokeWidth={1} />
              <text x={180} y={35} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">회수 비용 총 100만원</text>
              {SHARES.map((lines, i) => {
                const x = 8 + i * 88;
                return (
                  <g key={lines[0]}>
                    <line x1={x + 40} x2={x + 40} y1={48} y2={88} stroke={INK} strokeWidth={1} />
                    <path d={`M${x + 36} 83 L${x + 40} 89 L${x + 44} 83`} fill="none" stroke={INK} strokeWidth={1} />
                    <rect x={x} y={92} width={80} height={72} rx={6} fill="none" stroke={INK} strokeWidth={1} strokeDasharray="4 3" />
                    {lines.map((line, j) => (
                      <text key={line} x={x + 40} y={lines.length === 1 ? 122 : 114 + j * 16} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">{line}</text>
                    ))}
                    <text x={x + 40} y={152} textAnchor="middle" fontSize={11} fill={INK}>몫은 미정</text>
                  </g>
                );
              })}
            </>
          )}
          {active === 1 && (
            <>
              {Array.from({ length: 100 }, (_, i) => {
                const hit = i === 23 || i === 76;
                return (
                  <rect
                    key={i}
                    x={8 + (i % 10) * 18}
                    y={10 + Math.floor(i / 10) * 18}
                    width={15}
                    height={15}
                    rx={2}
                    fill={hit ? RED : INK}
                    fillOpacity={hit ? 0.9 : 0.16}
                  />
                );
              })}
              <text x={200} y={22} fontSize={12} fontWeight={700} className="fill-foreground">칸 하나 = 같은 결정 한 번</text>
              <rect x={200} y={36} width={13} height={13} rx={2} fill={RED} fillOpacity={0.9} />
              <text x={220} y={47} fontSize={12} fontWeight={700} className="fill-foreground">2칸: 5000만원씩</text>
              <rect x={200} y={60} width={13} height={13} rx={2} fill={INK} fillOpacity={0.16} />
              <text x={220} y={71} fontSize={12} className="fill-foreground">98칸: 0원</text>
              <text x={200} y={112} fontSize={12} fill={INK}>합계 1억원</text>
              <text x={200} y={132} fontSize={12} fill={INK}>÷ 100칸</text>
              <text x={200} y={156} fontSize={14} fontWeight={700} className="fill-foreground">= 칸당 100만원</text>
            </>
          )}
          {active === 2 && (
            <>
              <rect x={8} y={74} width={84} height={44} rx={6} fill="none" stroke={INK} strokeWidth={1} />
              <text x={50} y={93} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">미회수</text>
              <text x={50} y={109} textAnchor="middle" fontSize={11} fill={INK}>결정 한 번</text>
              <path d="M92 90 L132 44" fill="none" stroke={INK} strokeWidth={1} />
              <path d="M92 102 L132 148" fill="none" stroke={RED} strokeWidth={1.25} />
              <text x={100} y={56} fontSize={11} fill={INK}>98%</text>
              <text x={102} y={146} fontSize={11} fontWeight={700} fill={RED}>2%</text>
              <rect x={136} y={22} width={216} height={44} rx={6} fill="none" stroke={INK} strokeWidth={1} />
              <text x={244} y={49} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-foreground">0원</text>
              <rect x={136} y={126} width={216} height={52} rx={6} fill={RED} fillOpacity={0.1} stroke={RED} strokeWidth={1.25} />
              <text x={244} y={148} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-foreground">5000만원</text>
              <text x={244} y={167} textAnchor="middle" fontSize={11} fill={INK}>한 사람에게 집중될 수 있음</text>
              <text x={244} y={100} textAnchor="middle" fontSize={11} fill={INK}>100만원인 갈래는 없음</text>
            </>
          )}
          {active === 3 && (
            <>
              {[
                { y: 8, name: "회수 총액", value: 100, text: "100만원 · 여러 곳이 나눔", color: GREEN },
                { y: 68, name: "미회수 기대 손실", value: 100, text: "100만원 · 평균값", color: INK },
                { y: 128, name: "미회수에서 사고가 나면", value: 5000, text: "5000만원 · 한 사람에게 집중될 수 있음", color: RED },
              ].map((row) => (
                <g key={row.name}>
                  <text x={8} y={row.y + 12} fontSize={12} fontWeight={700} className="fill-foreground">{row.name}</text>
                  <rect x={8} y={row.y + 20} width={barOf(row.value)} height={14} rx={2} fill={row.color} />
                  <text x={8} y={row.y + 50} fontSize={11} fill={INK}>{row.text}</text>
                </g>
              ))}
            </>
          )}
        </svg>
      )}
    />
  );
}
