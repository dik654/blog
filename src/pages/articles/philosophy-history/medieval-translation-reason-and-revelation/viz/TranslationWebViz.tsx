import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture (·#source) — 한 방향 전달선 대신 번역·비판·재번역의 그물.
 * 고대 그리스 저작 → 시리아어·아랍어 번역과 주석 / 마이모니데스(유대아랍어)·아베로에스(아랍어) → 히브리어·라틴어 /
 * 라틴어 → 히브리어·그리스어. 시리아어와 아랍어 사이의 경로는 글에 없으므로 한 칸으로 묶는다.
 */
const SCENES = [
  { label: "흔한 그림: 한 줄의 전달선", summary: "고대 그리스 → 르네상스 유럽", note: "이 절이 벗어나려는 그림입니다. 지식이 고대 그리스에서 르네상스 유럽까지 한 방향으로 넘겨졌다고 보면, 그 사이의 번역자·주석가·독자 공동체가 화살표 하나 안에 묻힙니다." },
  { label: "시리아어·아랍어에서 새 재료가 됩니다", summary: "그리스어 → 시리아어·아랍어", note: "아리스토텔레스와 후기 고대 저작은 시리아어·아랍어 번역과 주석 안에서 새 철학 체계의 재료가 됐습니다. 그대로 보관된 것이 아니라 주석이 덧붙은 채로 다음 독자를 만납니다." },
  { label: "아랍어에서 두 갈래로", summary: "→ 히브리어 · → 라틴어", note: "마이모니데스는 유대아랍어로 썼고 그의 저작은 히브리어와 라틴어로 번역됐습니다. 아베로에스의 주석도 아랍어에서 히브리어·라틴어 독자를 만났습니다." },
  { label: "라틴어에서 다시 되돌아갑니다", summary: "라틴어 → 히브리어 · 그리스어", note: "라틴어 저작이 다시 히브리어와 그리스어로 옮겨진 경우도 있습니다. 화살표가 되돌아오면서 한 줄이던 선이 여러 공동체가 번역·비판·재번역한 그물이 됩니다." },
] as const;

type NodeId = "greek" | "syrAr" | "hebrew" | "latin";

const NODES: Record<NodeId, { x: number; y: number; label: string; sub: string }> = {
  greek: { x: 180, y: 36, label: "그리스어", sub: "고대 저작" },
  syrAr: { x: 74, y: 140, label: "시리아어·아랍어", sub: "번역·주석" },
  hebrew: { x: 290, y: 140, label: "히브리어", sub: "" },
  latin: { x: 180, y: 244, label: "라틴어", sub: "" },
};

const EDGES = [
  { from: "greek", to: "syrAr", scene: 1 },
  { from: "syrAr", to: "hebrew", scene: 2 },
  { from: "syrAr", to: "latin", scene: 2 },
  { from: "latin", to: "hebrew", scene: 3 },
  { from: "latin", to: "greek", scene: 3 },
] as const;

const NODE_W = 120;
const NODE_H = 42;

/** 두 노드 상자 사이를 잇되 상자 가장자리에서 멈추는 선분을 계산합니다. */
function segment(from: NodeId, to: NodeId) {
  const a = NODES[from];
  const b = NODES[to];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const scaleA = Math.min(Math.abs(NODE_W / 2 / (dx || 1e-6)), Math.abs(NODE_H / 2 / (dy || 1e-6)));
  const pad = 6 / Math.hypot(dx, dy);
  const t0 = scaleA + pad;
  const t1 = 1 - scaleA - pad;
  return { x1: a.x + dx * t0, y1: a.y + dy * t0, x2: a.x + dx * t1, y2: a.y + dy * t1 };
}

function Line() {
  return (
    <svg viewBox="0 0 360 290" className="mx-auto h-auto w-full max-w-lg" role="img" aria-label="고대 그리스에서 르네상스 유럽으로 가는 화살표 하나">
      <defs>
        <marker id="web-arrow-line" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#64748b" />
        </marker>
      </defs>
      <rect x={20} y={124} width={110} height={42} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={75} y={150} fontSize={13} textAnchor="middle" fill="#64748b">
        고대 그리스
      </text>
      <rect x={230} y={124} width={110} height={42} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={285} y={150} fontSize={13} textAnchor="middle" fill="#64748b">
        르네상스 유럽
      </text>
      <line x1={136} y1={145} x2={224} y2={145} stroke="#64748b" strokeWidth={1.25} markerEnd="url(#web-arrow-line)" />
      <text x={180} y={200} fontSize={12} textAnchor="middle" fill="#dc2626">
        이 절이 벗어나려는 그림
      </text>
    </svg>
  );
}

function Web({ step }: { step: number }) {
  const visibleNodes: NodeId[] = step === 1 ? ["greek", "syrAr"] : ["greek", "syrAr", "hebrew", "latin"];
  return (
    <svg viewBox="0 0 360 290" className="mx-auto h-auto w-full max-w-lg" role="img" aria-label="그리스어, 시리아어·아랍어, 히브리어, 라틴어 사이의 번역 화살표">
      <defs>
        <marker id={`web-arrow-new-${step}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#2563eb" />
        </marker>
        <marker id={`web-arrow-old-${step}`} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#94a3b8" />
        </marker>
      </defs>
      {EDGES.filter((edge) => edge.scene <= step).map((edge) => {
        const s = segment(edge.from, edge.to);
        const fresh = edge.scene === step;
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line
              {...s}
              stroke={fresh ? "#2563eb" : "#94a3b8"}
              strokeWidth={fresh ? 1.25 : 1}
              markerEnd={fresh ? `url(#web-arrow-new-${step})` : `url(#web-arrow-old-${step})`}
            />
          </g>
        );
      })}
      {step >= 2 ? (
        <text x={56} y={NODES.syrAr.y + 46} fontSize={11} textAnchor="middle" fill={step === 2 ? "#2563eb" : "#64748b"}>
          <tspan x={56}>마이모니데스·</tspan>
          <tspan x={56} dy={13}>아베로에스 저작</tspan>
        </text>
      ) : null}
      {visibleNodes.map((id) => {
        // 3장면의 라틴어→그리스어 화살표는 고대 저작이 아니라 이후 그리스어 독자에게 닿으므로 부제를 넓힌다.
        const node = id === "greek" && step >= 3 ? { ...NODES.greek, sub: "고대 원문·후대 독자" } : NODES[id];
        return (
          <g key={id}>
            <rect x={node.x - NODE_W / 2} y={node.y - NODE_H / 2} width={NODE_W} height={NODE_H} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
            <text x={node.x} y={node.sub ? node.y - 3 : node.y + 5} fontSize={13} fontWeight={600} textAnchor="middle" fill="currentColor">
              {node.label}
            </text>
            {node.sub ? (
              <text x={node.x} y={node.y + 13} fontSize={11} textAnchor="middle" fill="#64748b">
                {node.sub}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export default function TranslationWebViz() {
  return (
    <SceneShell
      eyebrow="번역 경로"
      title="한 줄의 전달선이 번역·재번역의 그물이 됩니다"
      description="상자는 언어권, 화살표는 이 절과 8절이 말한 번역 방향입니다. 파란 화살표가 이번 장면에 새로 생긴 경로이고, 시리아어와 아랍어 사이의 경로는 글이 따로 말하지 않아 한 상자로 묶었습니다."
      ariaLabel="고대 그리스에서 르네상스 유럽으로 가는 한 줄 그림과, 시리아어·아랍어, 히브리어, 라틴어 사이 번역과 재번역 경로가 늘어나는 네 장면"
      scenes={SCENES}
      render={(active) => (active === 0 ? <Line /> : <Web step={active} />)}
    />
  );
}
