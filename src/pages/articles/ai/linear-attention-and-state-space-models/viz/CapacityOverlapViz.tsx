import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tradeoff — d×d state에서 간섭 없이 꺼낼 수 있는 key-value 연관은 대략 d개(서로 직교하는 key 수)다.
 * d²는 state의 값 개수다. 넘치면 key끼리 직교할 수 없어 서로 다른 연관이 겹친다.
 * 그림은 d=4(값 16개, 직교 key 4개)로 줄이고 사실 하나를 key 방향 한 줄에 대응시킨 단순화다(가정). 사실 3개와 6개 두 경우를 비교한다.
 * Full attention은 사실마다 기록을 하나씩 늘려 겹침이 없다.
 */
const D = 4;
const CAPACITY = D;
const SCENES = [
  {
    label: "사실 3개 · 용량보다 적음",
    summary: "3 < 4 · 겹침 없음",
    count: 3,
    note: "서로 다른 사실이 용량을 밑돌면 각자 직교하는 key 방향에 들어가 state가 거의 손실 없이 요약합니다. 오른쪽 attention 기록도 3칸입니다. d=128이면 이 용량이 128 근처이고, 16,384는 state의 값 개수입니다.",
  },
  {
    label: "사실 6개 · 용량을 넘음",
    summary: "6 > 4 · 2줄에서 겹침",
    count: 6,
    note: "d=4 공간에는 직교하는 key가 4개뿐이라 넘친 사실 2개는 이미 쓰인 key 방향 위에 겹쳐 쓰입니다. 겹친 줄을 나중에 읽으면 value가 섞여 둘 중 하나 또는 둘 다 부정확하게 나옵니다. 오른쪽 attention은 기록을 6칸으로 늘려 겹침이 없는 대신 문맥 길이만큼 자랍니다.",
  },
] as const;

const SKY = "#0284c7";
const RED = "#dc2626";
const AMBER = "#d97706";
const SLATE = "#64748b";
const LINE = "#94a3b8";
const CELL = 34;
const GX = 16;
const GY = 30;
const AX = 182;
const AC = 19;

function Panel({ count }: { count: number }) {
  const slots = Array.from({ length: CAPACITY }, (_, slot) => {
    const facts = Array.from({ length: count }, (_, fact) => fact).filter((fact) => fact % CAPACITY === slot);
    return facts.map((fact) => fact + 1);
  });
  const overlapped = slots.filter((facts) => facts.length > 1).length;
  return (
    <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`사실 ${count}개를 고정 state와 attention 기록에 담은 모습`}>
      <text x={GX} y={18} fontSize={11} fontWeight={700} fill={SKY}>고정 state d=4 · key 4줄</text>
      {slots.map((facts, slot) => {
        const y = GY + slot * CELL;
        const clash = facts.length > 1;
        const color = clash ? RED : SKY;
        return (
          <g key={slot}>
            {Array.from({ length: D }, (_, col) => (
              <rect key={col} x={GX + col * CELL} y={y} width={CELL} height={CELL} fill={facts.length ? color : "#ffffff"} fillOpacity={facts.length ? 0.14 : 0} stroke={facts.length ? color : LINE} strokeWidth={1} strokeDasharray={clash ? "3 2" : undefined} />
            ))}
            <text x={GX + (D * CELL) / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={facts.length ? 700 : 400} fill={facts.length ? color : LINE}>
              {facts.length ? `사실 ${facts.join("·")}` : ""}
            </text>
          </g>
        );
      })}
      <text x={GX} y={GY + D * CELL + 18} fontSize={10} fill={overlapped ? RED : SLATE}>
        {overlapped ? `겹친 key 줄 ${overlapped}개 (점선)` : "겹친 key 줄 0개"}
      </text>
      <text x={AX} y={18} fontSize={11} fontWeight={700} fill={AMBER}>Full attention · 사실마다 1칸</text>
      {Array.from({ length: count }, (_, fact) => (
        <g key={fact}>
          <rect x={AX + (fact % 8) * AC} y={GY + Math.floor(fact / 8) * AC} width={AC - 2} height={AC - 2} fill={AMBER} fillOpacity={0.14} stroke={AMBER} strokeWidth={1} />
          <text x={AX + (fact % 8) * AC + (AC - 2) / 2} y={GY + Math.floor(fact / 8) * AC + 12} textAnchor="middle" fontSize={8} fill={AMBER}>{fact + 1}</text>
        </g>
      ))}
      <text x={AX} y={GY + D * CELL + 18} fontSize={10} fill={SLATE}>기록 {count}칸 · 겹침 없음</text>
    </svg>
  );
}

export default function CapacityOverlapViz() {
  return (
    <SceneShell
      eyebrow="고정 state의 용량"
      title="사실이 용량을 넘으면 같은 좌표에 겹쳐 쓰입니다"
      description="d×d state에서 간섭 없이 꺼낼 수 있는 key-value 연관은 대략 d개(서로 직교하는 key 수)이고, d²는 state의 값 개수입니다. 그림은 d=4로 줄이고 사실 하나를 key 방향 한 줄에 대응시킨 단순화이며, 어느 사실이 어느 줄에 겹치는지는 임의로 정했습니다(가정)."
      ariaLabel="사실 3개와 6개를 고정 state와 full attention 기록에 담았을 때 겹침 비교"
      scenes={SCENES}
      render={(active) => <Panel count={SCENES[active].count} />}
    />
  );
}
