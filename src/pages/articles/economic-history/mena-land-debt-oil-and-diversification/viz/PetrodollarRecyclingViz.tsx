import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 — 페트로달러 재순환.
 * 유가 충격 → 산유국 경상수지 흑자·라틴아메리카 여러 나라 적자(연준 역사 자료).
 * 공적 경로: IMF 석유 융자(1974년 6월), 재원은 1974년 8월 일곱 곳과의 차입 약정.
 *   1,000 + 580 + 450 + 400 + 100 + 20 + 258 = 2,808백만 SDR ≈ 약 28억 SDR.
 * 은행 경로: 미국 정부 권장 아래 대형 미국 은행이 산유국 자금을 예치받아 라틴아메리카에 대출.
 */
const LENDERS: readonly { name: string; amount: number }[] = [
  { name: "사우디아라비아", amount: 1000 },
  { name: "이란", amount: 580 },
  { name: "베네수엘라", amount: 450 },
  { name: "쿠웨이트", amount: 400 },
  { name: "아부다비", amount: 100 },
  { name: "오만", amount: 20 },
  { name: "캐나다", amount: 258 },
];
const TOTAL = LENDERS.reduce<number>((sum, lender) => sum + lender.amount, 0);
const MAX = 1000;

const W = 360;
const H = 212;

const NODES = [
  { id: "exporter", cx: 56, cy: 106, w: 100, title: "산유국", sub: "달러가 모임" },
  { id: "importer", cx: 304, cy: 106, w: 100, title: "석유 수입국", sub: "라틴아메리카 등" },
  { id: "imf", cx: 180, cy: 30, w: 116, title: "IMF 석유 융자", sub: "1974년 6월" },
  { id: "bank", cx: 180, cy: 182, w: 116, title: "미국 대형 은행", sub: "예치·대출 중개" },
] as const;

const EDGES = [
  { x1: 252, y1: 106, x2: 108, y2: 106, label: "석유값", lx: 180, ly: 99, anchor: "middle" },
  { x1: 74, y1: 84, x2: 120, y2: 46, label: "차입 약정", lx: 90, ly: 58, anchor: "end" },
  { x1: 240, y1: 46, x2: 286, y2: 84, label: "융자", lx: 270, ly: 58, anchor: "start" },
  { x1: 74, y1: 128, x2: 120, y2: 166, label: "예치", lx: 90, ly: 160, anchor: "end" },
  { x1: 240, y1: 166, x2: 286, y2: 128, label: "대출", lx: 270, ly: 160, anchor: "start" },
] as const;

const SCENES = [
  { label: "유가 충격", summary: "산유국 흑자 · 수입국 적자", edges: [0], nodes: ["exporter", "importer"], note: "석유값이 오르자 수입국이 내는 돈이 산유국으로 몰렸습니다. 경상수지는 한 나라가 외국과 상품·서비스·소득을 주고받은 결과입니다. 연준 역사 자료는 이 충격이 산유국에는 흑자를, 라틴아메리카 여러 나라에는 적자를 만들었다고 씁니다." },
  { label: "공적 경로", summary: `산유국 6곳+캐나다 ${TOTAL.toLocaleString("en-US")}백만 SDR`, edges: [1, 2], nodes: ["exporter", "imf", "importer"], note: "IMF는 1974년 6월 석유값 상승으로 국제수지 문제를 겪는 회원국을 위한 석유 융자를 만들고, 8월 산유국 여섯 곳과 캐나다, 모두 일곱 곳과의 차입 약정(합 약 28억 SDR)으로 재원을 댔습니다. SDR(특별인출권)은 IMF의 회계 단위입니다." },
  { label: "은행 경로", summary: "예치받은 돈을 다시 대출", edges: [3, 4], nodes: ["exporter", "bank", "importer"], note: "공적 경로 옆에는 은행 경로가 있었습니다. 미국 정부의 권장 아래 대형 미국 은행들이 산유국 자금을 예치받아 라틴아메리카에 다시 빌려 주는 중개자가 됐습니다." },
  { label: "한 바퀴", summary: "해외자산 = 다른 나라의 부채", edges: [0, 1, 2, 3, 4], nodes: ["exporter", "imf", "bank", "importer"], note: "석유값으로 나간 달러가 IMF와 은행을 거쳐 수입국 대출로 돌아오는 고리가 페트로달러 재순환입니다. 산유국 장부의 해외자산 몫이 다른 나라 장부에서는 부채가 됩니다. 이 대출이 1980년대에 어떻게 위기가 됐는지는 라틴아메리카 글에서 이어집니다." },
] as const;

function Detail({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-border px-3 py-2"><span className="block text-muted-foreground">산유국</span><span className="font-bold">경상수지 흑자</span></div>
        <div className="rounded-lg border border-border px-3 py-2"><span className="block text-muted-foreground">라틴아메리카 여러 나라</span><span className="font-bold">경상수지 적자</span></div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div>
        <p className="mb-1.5 text-xs text-muted-foreground">1974년 8월 차입 약정 (단위: 백만 SDR)</p>
        <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {LENDERS.map((lender) => (
            <li key={lender.name} className="grid grid-cols-[6.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs">
              <span>{lender.name}</span>
              <span className="h-2.5 rounded-sm bg-muted/40"><span className="block h-full rounded-sm" style={{ width: `${(lender.amount / MAX) * 100}%`, backgroundColor: "#2563eb" }} /></span>
              <span className="text-right font-mono">{lender.amount.toLocaleString("en-US")}</span>
            </li>
          ))}
          <li className="grid grid-cols-[6.5rem_minmax(0,1fr)_3rem] gap-2 border-t sm:col-span-2 border-border pt-1 text-xs font-bold">
            <span>합계</span><span>약 28억 SDR</span><span className="text-right font-mono">{TOTAL.toLocaleString("en-US")}</span>
          </li>
        </ul>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-border px-3 py-2"><span className="block text-muted-foreground">들어오는 돈</span><span className="font-bold">산유국 자금 예치</span></div>
        <div className="rounded-lg border border-border px-3 py-2"><span className="block text-muted-foreground">나가는 돈</span><span className="font-bold">라틴아메리카 대출</span></div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="rounded-lg border border-border px-3 py-2"><span className="block text-muted-foreground">산유국 장부</span><span className="font-bold">정부수입 60 중 해외자산 몫</span></div>
      <div className="rounded-lg border border-primary px-3 py-2"><span className="block text-muted-foreground">다른 나라 장부</span><span className="font-bold text-primary">부채 10</span></div>
    </div>
  );
}

export default function PetrodollarRecyclingViz() {
  return (
    <SceneShell
      eyebrow="페트로달러 재순환"
      title="석유값으로 나간 달러가 대출이 되어 돌아오는 두 경로"
      description="상자는 돈을 받고 내보내는 주체, 화살표는 돈이 가는 방향입니다. 지금 장면의 경로만 파랗게 그렸고 화살표 굵기는 금액과 무관합니다."
      ariaLabel="산유국, IMF 석유 융자, 미국 대형 은행, 석유 수입국 사이의 페트로달러 재순환 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const onEdges = new Set<number>(scene.edges);
        const onNodes = new Set<string>(scene.nodes);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[380px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                <marker id="petro-arrow-on" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 L8 4 L0 8 z" fill="#2563eb" />
                </marker>
                <marker id="petro-arrow-off" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 L8 4 L0 8 z" fill="#cbd5e1" />
                </marker>
              </defs>
              {EDGES.map((edge, index) => {
                const on = onEdges.has(index);
                return (
                  <g key={edge.label}>
                    <line x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={on ? "#2563eb" : "#cbd5e1"} strokeWidth={on ? 1.25 : 1} markerEnd={`url(#petro-arrow-${on ? "on" : "off"})`} />
                    <text x={edge.lx} y={edge.ly} textAnchor={edge.anchor} fontSize={11} fontWeight={on ? 700 : 400} fill={on ? "#2563eb" : "#94a3b8"}>{edge.label}</text>
                  </g>
                );
              })}
              {NODES.map((node) => {
                const on = onNodes.has(node.id);
                return (
                  <g key={node.id} opacity={on ? 1 : 0.45}>
                    <rect x={node.cx - node.w / 2} y={node.cy - 22} width={node.w} height={44} rx={8} fill="none" stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                    <text x={node.cx} y={node.cy - 3} textAnchor="middle" fontSize={12} fontWeight={700} fill={on ? "#2563eb" : "#64748b"}>{node.title}</text>
                    <text x={node.cx} y={node.cy + 13} textAnchor="middle" fontSize={10} fill="#64748b">{node.sub}</text>
                  </g>
                );
              })}
            </svg>
            <StableSceneStack active={active} className="mt-3" scenes={SCENES.map((_, index) => <Detail key={index} index={index} />)} />
          </div>
        );
      }}
    />
  );
}
