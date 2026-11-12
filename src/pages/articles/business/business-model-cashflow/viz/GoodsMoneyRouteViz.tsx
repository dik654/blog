import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box·#picture — 물건과 돈은 반대 방향으로, 다른 날짜에 움직인다.
 * 3절 사례(가정): D−7 공급자에게 120만 원 지급·상품 100개 입고,
 * D0 고객에게 100개 이전·고객이 결제업체에 200만 원 결제,
 * D+14 결제업체가 6만 원을 떼고 판매자에게 194만 원 지급 → 194 − 120 = 74.
 * 120만 원이 묶이는 기간: D−7 → D+14 = 21일.
 * 넓은 화면은 가로 배치, 640px 미만은 세로 배치를 그린다(같은 흐름, 좌표만 다름).
 * 세로 배치에서는 수수료 6만 원을 그림 대신 아래 "결제업체가 가진 돈" 칸에서 보인다.
 */

const GOODS = "#2563eb";
const MONEY = "#16a34a";
const PAST = "#94a3b8";
const MUTED = "#64748b";

type Anchor = "start" | "middle" | "end";
interface Box { name: string; x: number; y: number }
interface Flow { key: string; kind: "goods" | "money"; step: number; x1: number; y1: number; x2: number; y2: number; label: string; day: string; lx: number; ly: number; anchor: Anchor }
interface Layout { w: number; h: number; nodeW: number; nodeH: number; nodes: readonly Box[]; flows: readonly Flow[]; fee: { x: number; y: number } | null }

/** step: 그 흐름이 일어나는 장면 번호(0 = D−7, 1 = D0, 2 = D+14) */
const WIDE: Layout = {
  w: 460,
  h: 262,
  nodeW: 90,
  nodeH: 44,
  nodes: [
    { name: "공급자", x: 10, y: 50 },
    { name: "판매자", x: 185, y: 50 },
    { name: "고객", x: 360, y: 50 },
    { name: "결제업체", x: 290, y: 186 },
  ],
  flows: [
    { key: "g1", kind: "goods", step: 0, x1: 100, y1: 64, x2: 183, y2: 64, label: "물건 100개", day: "D−7", lx: 142, ly: 30, anchor: "middle" },
    { key: "m1", kind: "money", step: 0, x1: 185, y1: 82, x2: 102, y2: 82, label: "돈 120만 원", day: "D−7", lx: 142, ly: 110, anchor: "middle" },
    { key: "g2", kind: "goods", step: 1, x1: 275, y1: 64, x2: 358, y2: 64, label: "물건 100개", day: "D0", lx: 317, ly: 30, anchor: "middle" },
    { key: "m2", kind: "money", step: 1, x1: 405, y1: 94, x2: 373, y2: 184, label: "돈 200만 원", day: "D0", lx: 330, ly: 132, anchor: "middle" },
    { key: "m3", kind: "money", step: 2, x1: 300, y1: 186, x2: 251, y2: 96, label: "돈 194만 원", day: "D+14", lx: 258, ly: 145, anchor: "end" },
  ],
  fee: { x: 335, y: 250 },
};

const TALL: Layout = {
  w: 320,
  h: 340,
  nodeW: 100,
  nodeH: 40,
  nodes: [
    { name: "공급자", x: 20, y: 10 },
    { name: "판매자", x: 20, y: 150 },
    { name: "고객", x: 20, y: 290 },
    { name: "결제업체", x: 210, y: 200 },
  ],
  flows: [
    { key: "g1", kind: "goods", step: 0, x1: 45, y1: 50, x2: 45, y2: 148, label: "물건 100개", day: "D−7", lx: 108, ly: 74, anchor: "start" },
    { key: "m1", kind: "money", step: 0, x1: 95, y1: 150, x2: 95, y2: 52, label: "돈 120만 원", day: "D−7", lx: 108, ly: 112, anchor: "start" },
    { key: "g2", kind: "goods", step: 1, x1: 45, y1: 190, x2: 45, y2: 288, label: "물건 100개", day: "D0", lx: 58, ly: 236, anchor: "start" },
    { key: "m2", kind: "money", step: 1, x1: 120, y1: 310, x2: 228, y2: 242, label: "돈 200만 원", day: "D0", lx: 180, ly: 302, anchor: "start" },
    { key: "m3", kind: "money", step: 2, x1: 212, y1: 202, x2: 123, y2: 172, label: "돈 194만 원", day: "D+14", lx: 140, ly: 150, anchor: "start" },
  ],
  fee: null,
};

const SCENES: readonly { label: string; summary: string; note: string; sellerCash: string; held: string }[] = [
  {
    label: "D−7 · 재고 준비",
    summary: "물건 들어옴 · 돈 120만 원 나감",
    note: "판매 7일 전, 공급자에게서 상품 100개가 들어오고 판매자는 120만 원을 먼저 냅니다. 물건과 돈이 반대 방향으로 움직이고, 이날은 날짜가 같습니다.",
    sellerCash: "−120만 원",
    held: "없음",
  },
  {
    label: "D0 · 판매",
    summary: "물건은 고객에게, 200만 원은 결제업체로",
    note: "판매일에 상품의 통제가 고객에게 넘어간다고 가정했습니다. 고객이 낸 200만 원은 결제업체가 먼저 받으므로 판매자는 그 돈을 즉시 쓸 수 없습니다.",
    sellerCash: "−120만 원 그대로",
    held: "200만 원",
  },
  {
    label: "D+14 · 정산",
    summary: "200 − 6 = 194만 원 입금",
    note: "판매 14일 뒤 결제업체가 수수료 6만 원을 떼고 194만 원을 보냅니다. 194 − 120 = 74만 원이 남지만 배송·임금·세금·반품은 넣지 않았습니다.",
    sellerCash: "+74만 원",
    held: "수수료 6만 원",
  },
  {
    label: "두 길을 겹쳐 보기",
    summary: "물건은 D0에 끝, 돈은 D+14에 돌아옴",
    note: "물건은 D0에 고객에게 넘어가지만 판매자가 먼저 낸 돈은 D+14에야 돌아옵니다. D−7부터 D+14까지 21일 동안 120만 원이 묶입니다.",
    sellerCash: "120만 원이 21일 묶임",
    held: "D0~D+14에 200만 원",
  },
];

function flowState(step: number, active: number) {
  if (active === 3 || step === active) return "on";
  if (step < active) return "past";
  return "off";
}

function RouteSvg({ layout, active, className, idPrefix }: { layout: Layout; active: number; className: string; idPrefix: string }) {
  const scene = SCENES[active];
  const markers: readonly (readonly [string, string])[] = [
    ["goods", GOODS],
    ["money", MONEY],
    ["past", PAST],
  ];
  return (
    <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className={className} role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <defs>
        {markers.map(([id, color]) => (
          <marker key={id} id={`${idPrefix}-${id}`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={color} />
          </marker>
        ))}
      </defs>
      {layout.nodes.map((node) => (
        <g key={node.name}>
          <rect x={node.x} y={node.y} width={layout.nodeW} height={layout.nodeH} rx={8} fill="none" stroke={MUTED} strokeWidth={1} />
          <text x={node.x + layout.nodeW / 2} y={node.y + layout.nodeH / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="currentColor">
            {node.name}
          </text>
        </g>
      ))}
      {layout.flows.map((flow) => {
        const state = flowState(flow.step, active);
        if (state === "off") return null;
        const color = state === "past" ? PAST : flow.kind === "goods" ? GOODS : MONEY;
        const marker = state === "past" ? "past" : flow.kind;
        return (
          <g key={flow.key}>
            <line
              x1={flow.x1}
              y1={flow.y1}
              x2={flow.x2}
              y2={flow.y2}
              stroke={color}
              strokeWidth={state === "on" ? 1.25 : 1}
              strokeDasharray={flow.kind === "money" ? "5 3" : undefined}
              markerEnd={`url(#${idPrefix}-${marker})`}
            />
            <text x={flow.lx} y={flow.ly} textAnchor={flow.anchor} fontSize={12} fontWeight={700} fill={color}>
              {flow.label}
            </text>
            <text x={flow.lx} y={flow.ly + 14} textAnchor={flow.anchor} fontSize={11} fill={state === "past" ? PAST : MUTED}>
              {flow.day}
            </text>
          </g>
        );
      })}
      {active >= 2 && layout.fee && (
        <text x={layout.fee.x} y={layout.fee.y} textAnchor="middle" fontSize={11} fill={active === 2 ? MUTED : PAST}>
          결제업체 수수료 6만 원
        </text>
      )}
    </svg>
  );
}

export default function GoodsMoneyRouteViz() {
  return (
    <SceneShell
      eyebrow="물건과 돈의 길"
      title="물건과 돈은 반대 방향으로, 다른 날짜에 움직입니다"
      description="3절의 설명용 사례(가정)입니다. 실선은 물건, 점선은 돈의 이동이며 화살표 옆에 날짜를 적었습니다. D0은 판매일, D−7은 판매 7일 전, D+14는 판매 14일 뒤입니다."
      ariaLabel="공급자, 판매자, 고객, 결제업체 사이에서 물건과 돈이 날짜별로 이동하는 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <RouteSvg layout={WIDE} active={active} idPrefix="gm-wide" className="mx-auto hidden h-auto w-full max-w-[500px] sm:block" />
            <RouteSvg layout={TALL} active={active} idPrefix="gm-tall" className="mx-auto block h-auto w-full max-w-[290px] sm:hidden" />
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div className="min-w-0 rounded-lg border border-border px-3 py-2">
                <span className="block text-muted-foreground">판매자 누적 현금</span>
                <span className="block break-keep font-bold">{scene.sellerCash}</span>
              </div>
              <div className="min-w-0 rounded-lg border border-border px-3 py-2">
                <span className="block text-muted-foreground">결제업체가 가진 돈</span>
                <span className="block break-keep font-bold">{scene.held}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
