import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 조합원 100명의 한 해가 출자·이용 → 결산(140, 110) → 총회(잉여 30) → 적립 12·교육 3·배당 15 → 다음 총회로 닫히는 고리.
 * ICA 3원칙의 잉여 용도 셋: 적립금을 포함한 조합 발전 / 거래에 비례한 조합원 혜택 / 조합원이 승인한 기타 활동(교육 3).
 * 교육의 내용은 5원칙. 칸 위치는 순서만 뜻한다.
 */
const ACCENT = "#2563eb";
const MUTED = "#94a3b8";

const SCENES = [
  { label: "조합원이 출자하고 이용합니다", summary: "조합원 100명 → 사업", node: 0, edge: 0, note: "조합원은 출자하고, 조합의 종류에 따라 상품을 사거나 생산물을 맡기거나 노동을 제공합니다. 이 이용이 한 해 사업과 장부의 바탕이 됩니다." },
  { label: "경영진이 결산합니다", summary: "매출 140 · 비용 110", node: 1, edge: 1, note: "경영진은 매출 140과 비용 110을 기록하고 감사 가능한 결산, 곧 바깥에서 확인할 수 있는 한 해 장부를 냅니다." },
  { label: "총회가 결정합니다", summary: "잉여 30을 어떻게 나눌지", node: 2, edge: 2, note: "총회는 조합원 전체 회의입니다. 잉여 30을 적립·교육·배당으로 나눌지 여기서 결정합니다." },
  { label: "세 몫이 각자 자리로 갑니다", summary: "12 · 3 · 15", node: 3, edge: 3, note: "적립금 12는 다음 투자와 손실 완충에 남고, 교육 3은 조합원이 장부와 의사결정을 이해하도록 쓰며, 배당 15는 이용액에 따라 조합원에게 돌아갑니다." },
  { label: "ICA 3원칙의 세 용도에 놓으면", summary: "교육 3 = 셋째 용도", node: 3, edge: -1, note: "ICA는 국제협동조합연맹입니다. 그 3원칙(조합원의 경제적 참여)이 잉여의 용도 셋을 정합니다. 글은 교육 3이 셋째 용도라고 밝히고, 적립 12와 배당 15는 이름이 그대로 겹치는 용도에 놓았습니다. 교육의 내용은 따로 5원칙이 정합니다." },
  { label: "다음 총회에서 다시 정합니다", summary: "이사·규칙 → 다음 해", node: 2, edge: 4, note: "다음 총회에서는 경영 결과와 회원 참여를 보고 이사와 규칙을 다시 정합니다. 그래서 이 그림은 한 방향으로 끝나지 않고 고리로 닫힙니다." },
] as const;

const BOXES = [
  { x: 10, y: 10, title: "조합원 100명" },
  { x: 210, y: 10, title: "경영진" },
  { x: 210, y: 142, title: "총회" },
  { x: 10, y: 142, title: "세 몫 12·3·15" },
] as const;

function Edge({ d, label, lx, ly, anchor = "middle", on, dashed = false }: { d: readonly [number, number, number, number]; label: string; lx: number; ly: number; anchor?: "start" | "middle" | "end"; on: boolean; dashed?: boolean }) {
  const [x1, y1, x2, y2] = d;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const p1 = `${x2 - 6 * Math.cos(angle - 0.45)},${y2 - 6 * Math.sin(angle - 0.45)}`;
  const p2 = `${x2 - 6 * Math.cos(angle + 0.45)},${y2 - 6 * Math.sin(angle + 0.45)}`;
  const color = on ? ACCENT : MUTED;
  return (
    <g opacity={on ? 1 : 0.5}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={`${x2},${y2} ${p1} ${p2}`} fill={color} />
      <text x={lx} y={ly} textAnchor={anchor} fontSize={11.5} fontWeight={on ? 700 : 500} fill={on ? ACCENT : "currentColor"}>{label}</text>
    </g>
  );
}

function Panel({ active }: { active: number }) {
  if (active === 3 || active === 4) {
    const rows = active === 3
      ? [
          { amount: "적립 12", use: "다음 투자·손실 완충 (조합에 남음)" },
          { amount: "교육 3", use: "조합원이 장부·의사결정을 이해하도록" },
          { amount: "배당 15", use: "이용액에 따라 조합원에게" },
        ]
      : [
          { amount: "적립 12", use: "① 적립금을 포함한 조합 발전" },
          { amount: "배당 15", use: "② 조합과의 거래에 비례한 조합원 혜택" },
          { amount: "교육 3", use: "③ 조합원이 승인한 기타 활동 · 교육의 내용은 5원칙" },
        ];
    return (
      <ul className="space-y-1 text-xs">
        {active === 4 && <li className="font-bold text-muted-foreground">ICA 3원칙이 정한 잉여의 용도</li>}
        {rows.map((row) => (
          <li key={row.amount} className="grid grid-cols-[3.75rem_minmax(0,1fr)] gap-2 rounded-md border border-border/70 px-2 py-1 leading-5">
            <span className="font-mono font-bold text-[#2563eb]">{row.amount}</span>
            <span>{row.use}</span>
          </li>
        ))}
      </ul>
    );
  }
  const text = [
    "출자 + 이용: 상품 구매 · 생산물 위탁 · 노동 제공",
    "매출 140 − 비용 110 = 잉여 30, 감사 가능한 결산",
    "잉여 30을 적립·교육·배당으로 나눌지 표결",
    "",
    "",
    "경영 결과·회원 참여 보고 → 이사와 규칙을 다시 정함",
  ][active];
  return <p className="rounded-md border border-border/70 px-2 py-1 text-xs leading-5">{text}</p>;
}

export default function MemberCycleViz() {
  return (
    <SceneShell
      eyebrow="한 해의 닫힌 고리"
      title="이용이 결산·총회·세 몫을 거쳐 다시 조합원에게 돌아옵니다"
      description="3절의 설명용 숫자를 그대로 씁니다. 칸 위치는 순서만 뜻하며 실제 배분은 정관과 국가 법률을 따릅니다."
      ariaLabel="조합원 출자와 이용, 경영진 결산, 총회 결정, 적립·교육·배당, 다음 총회로 이어지는 고리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {BOXES.map((box, index) => {
                const on = scene.node === index;
                return (
                  <g key={box.title} opacity={on ? 1 : 0.6}>
                    <rect x={box.x} y={box.y} width={140} height={44} rx={8} fill={on ? ACCENT : MUTED} fillOpacity={on ? 0.14 : 0.06} stroke={on ? ACCENT : MUTED} strokeWidth={on ? 1.25 : 1} />
                    <text x={box.x + 70} y={box.y + 26} textAnchor="middle" fontSize={12.5} fontWeight={on ? 700 : 500} fill="currentColor">{box.title}</text>
                  </g>
                );
              })}
              <Edge d={[152, 32, 208, 32]} label="출자·이용" lx={180} ly={24} on={scene.edge === 0} />
              <Edge d={[240, 56, 240, 140]} label="결산" lx={234} ly={102} anchor="end" on={scene.edge === 1} />
              <Edge d={[208, 164, 152, 164]} label="배분 승인" lx={180} ly={134} on={scene.edge === 2} />
              <Edge d={[80, 140, 80, 56]} label="배당·교육" lx={88} ly={102} anchor="start" on={scene.edge === 3} />
              <Edge d={[330, 140, 330, 56]} label="이사·규칙" lx={324} ly={102} anchor="end" on={scene.edge === 4} dashed />
            </svg>
            <Panel active={active} />
          </div>
        );
      }}
    />
  );
}
