import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture(2·3·4·7절) — 발행회사·신탁 장부·수익자·유통시장 사이에서 돈과 권리가 움직이는 순서.
 * 임대수입 1억 − 비용 1,500만 = 8,500만 → ÷1,000좌 = 좌당 8만5천 원(가정).
 * 배분 가능 현금 5,000만 → 좌당 5만 원(가정). 비용 항목별 금액·투자금·거래가격은 본문에 없어 숫자를 적지 않는다.
 */
type Edge = "issue" | "fund" | "rent" | "cost" | "pay" | "trade";

const SCENES: readonly { label: string; summary: string; note: string; edges: readonly Edge[]; labels: Partial<Record<Edge, string>> }[] = [
  {
    label: "발행",
    summary: "권리 1,000좌 기록 · 투자금은 발행회사로",
    note: "발행회사가 설명서와 권리 구조를 만들고 투자금을 받습니다. 신탁 장부는 자산과 현금을 정해진 조건대로 보관하고, 같은 권리 1,000좌를 가진 수익자(신탁에서 나오는 이익을 받을 권리자)를 기록합니다(가정).",
    edges: ["issue", "fund"],
    labels: { issue: "권리 1,000좌", fund: "투자금" },
  },
  {
    label: "임대료 입금",
    summary: "임대수입 1억 원 → 운영 계좌",
    note: "임차인이 낸 돈이 먼저 자산 운영 계좌로 들어옵니다. 한 해 1억 원은 설명용 가정입니다. 이 돈은 아직 투자자 몫이 아닙니다.",
    edges: ["rent"],
    labels: { rent: "1억 원" },
  },
  {
    label: "비용 먼저",
    summary: "1억 − 1,500만 = 8,500만 원",
    note: "세금·수선·보험·수탁 보수 같은 비용을 먼저 냅니다. 본문은 합계 1,500만 원만 주므로 항목별 크기는 나누지 않았습니다. 남은 8,500만 원이 배분 가능 현금입니다.",
    edges: ["rent", "cost"],
    labels: { rent: "1억 원", cost: "1,500만 원" },
  },
  {
    label: "기준일 배분",
    summary: "8,500만 ÷ 1,000좌 = 좌당 8만5천 원",
    note: "배분 기준일(그날 명부에 오른 사람이 배분을 받는 날)의 좌수 1,000으로 나눠 지급합니다. 발행회사의 계산, 수탁자의 장부와 투자자 명부를 맞춘 뒤에 나갑니다. 감정가 10억 원은 이 계산식 어디에도 들어가지 않습니다.",
    edges: ["rent", "cost", "pay"],
    labels: { rent: "1억 원", cost: "1,500만 원", pay: "좌당 8만5천 원" },
  },
  {
    label: "유통시장 매매",
    summary: "좌와 현금이 매수자와 바뀜",
    note: "투자자가 좌를 팔면 매수자와 현금·권리가 바뀝니다. 거래가격은 앞으로 받을 현금, 금리, 유동성과 위험 판단에 따라 감정가와 달라질 수 있어 숫자를 적지 않았습니다. 기준일 전에 거래했다면 결제 완료 시각과 기준일의 권리자를 확인합니다.",
    edges: ["trade"],
    labels: { trade: "좌 ↔ 현금" },
  },
  {
    label: "공실·수선비 증가",
    summary: "8,500만 → 5,000만 원이면 좌당 5만 원",
    note: "공실이나 수선비가 늘어 배분 가능 현금이 5,000만 원으로 줄면 좌당 5만 원입니다(가정). 감정가 10억 원이 그대로라도 투자자에게 오는 돈은 이 경로에서 정해집니다.",
    edges: ["rent", "cost", "pay"],
    labels: { rent: "공실 땐 감소", cost: "수선비 증가", pay: "좌당 5만 원" },
  },
];

const BOXES = [
  { id: "tenant", x: 12, y: 18, w: 96, h: 40, title: "임차인", sub: "월세·임대료" },
  { id: "trust", x: 132, y: 18, w: 108, h: 40, title: "운영 계좌", sub: "신탁 장부" },
  { id: "cost", x: 264, y: 18, w: 84, h: 40, title: "비용", sub: "세금·수선 등" },
  { id: "issuer", x: 12, y: 122, w: 96, h: 40, title: "발행회사", sub: "설명서·권리 구조" },
  { id: "holder", x: 132, y: 122, w: 108, h: 40, title: "수익자 1,000좌", sub: "기준일 명부" },
  { id: "market", x: 264, y: 122, w: 84, h: 40, title: "유통시장", sub: "매수자" },
] as const;

/** 선분 좌표와 라벨 위치. 화살표는 끝점 쪽으로 향한다. */
const EDGES: Record<Edge, { x1: number; y1: number; x2: number; y2: number; lx: number; ly: number; anchor: "start" | "middle" | "end" }> = {
  rent: { x1: 108, y1: 38, x2: 130, y2: 38, lx: 120, ly: 76, anchor: "middle" },
  cost: { x1: 240, y1: 38, x2: 262, y2: 38, lx: 252, ly: 76, anchor: "middle" },
  pay: { x1: 186, y1: 58, x2: 186, y2: 120, lx: 192, ly: 98, anchor: "start" },
  issue: { x1: 108, y1: 134, x2: 130, y2: 134, lx: 60, ly: 114, anchor: "middle" },
  fund: { x1: 132, y1: 152, x2: 110, y2: 152, lx: 60, ly: 180, anchor: "middle" },
  trade: { x1: 240, y1: 142, x2: 262, y2: 142, lx: 252, ly: 180, anchor: "middle" },
};

const EDGE_ORDER: readonly Edge[] = ["rent", "cost", "pay", "issue", "fund", "trade"];

const ACTIVE_BOXES: Record<Edge, readonly string[]> = {
  rent: ["tenant", "trust"],
  cost: ["trust", "cost"],
  pay: ["trust", "holder"],
  issue: ["issuer", "holder", "trust"],
  fund: ["issuer", "holder"],
  trade: ["holder", "market"],
};

function Arrow({ edge, on, label }: { edge: Edge; on: boolean; label?: string }) {
  const e = EDGES[edge];
  const angle = Math.atan2(e.y2 - e.y1, e.x2 - e.x1);
  const size = 5;
  const left = `${e.x2 - size * Math.cos(angle - 0.5)},${e.y2 - size * Math.sin(angle - 0.5)}`;
  const right = `${e.x2 - size * Math.cos(angle + 0.5)},${e.y2 - size * Math.sin(angle + 0.5)}`;
  const color = on ? "#2563eb" : "#cbd5e1";
  const twoWay = edge === "trade";
  const back = twoWay
    ? `${e.x1 + size * Math.cos(angle - 0.5)},${e.y1 + size * Math.sin(angle - 0.5)} ${e.x1},${e.y1} ${e.x1 + size * Math.cos(angle + 0.5)},${e.y1 + size * Math.sin(angle + 0.5)}`
    : null;
  return (
    <g>
      <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={color} strokeWidth={on ? 1.25 : 1} />
      <polyline points={`${left} ${e.x2},${e.y2} ${right}`} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} />
      {back && <polyline points={back} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} />}
      {on && label && (
        <text x={e.lx} y={e.ly} textAnchor={e.anchor} fontSize={11} fontWeight={700} fill="#1d4ed8">{label}</text>
      )}
    </g>
  );
}

export default function TrustCashFlowViz() {
  return (
    <SceneShell
      eyebrow="돈과 권리의 길"
      title="임대료가 비용과 신탁 장부를 거쳐 한 좌에 도착하는 순서"
      description="칸은 본문 2절의 관계, 파란 화살표는 지금 장면에서 움직이는 돈이나 권리입니다. 1·3절의 임대수입 1억 원·비용 1,500만 원·1,000좌는 설명용 가정입니다."
      ariaLabel="발행, 임대료 입금, 비용 공제, 기준일 배분, 유통시장 매매, 배분 현금 감소의 여섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lit = new Set(scene.edges.flatMap((edge) => ACTIVE_BOXES[edge]));
        return (
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {BOXES.map((box) => {
              const on = lit.has(box.id);
              return (
                <g key={box.id}>
                  <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={8} fill="none" stroke={on ? "#2563eb" : "#cbd5e1"} strokeWidth={on ? 1.25 : 1} />
                  <text x={box.x + box.w / 2} y={box.y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? undefined : "#64748b"} className={on ? "fill-foreground" : undefined}>{box.title}</text>
                  <text x={box.x + box.w / 2} y={box.y + 31} textAnchor="middle" fontSize={9.5} fill="#64748b">{box.sub}</text>
                </g>
              );
            })}
            {EDGE_ORDER.map((edge) => (
              <Arrow key={edge} edge={edge} on={scene.edges.includes(edge)} label={scene.labels[edge]} />
            ))}
            <rect x={96} y={196} width={168} height={28} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            <text x={180} y={214} textAnchor="middle" fontSize={10.5} fill="#475569">감정가 10억 원 · 배분 계산 밖</text>
          </svg>
        );
      }}
    />
  );
}
