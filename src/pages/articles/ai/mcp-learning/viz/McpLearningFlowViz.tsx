import { useEffect, useState, type ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type Mode = "core" | "primitives" | "transport" | "operations";
const border = "var(--border)";
const line = "var(--muted-foreground)";
const accent = "var(--primary)";

const FLOWS: Record<Mode, { id: string; eyebrow: string; title: string; description: string; labels: string[]; notes: string[] }> = {
  core: {
    id: "mcp-protocol-request-viz",
    eyebrow: "TICKET REQUEST · MCP 2026-07-28",
    title: "장애 티켓 한 건이 Host에서 Server까지 갑니다",
    description: "연결 규약이 맞아도 승인·권한·업무 실행은 자동으로 생기지 않습니다.",
    labels: ["사용자 요청", "역할 분리", "요청 자체 설명", "응답"],
    notes: [
      "사용자는 ‘결제 오류를 장애 티켓으로 등록해 줘’라고 요청합니다. Host가 대화와 사용자 의도를 소유합니다.",
      "Host 안의 MCP client는 Ticket server와 메시지를 교환합니다. Server는 티켓 도메인의 기능과 권한을 집행합니다.",
      "tools/call에는 protocol version·client capabilities·tool 이름·인자가 함께 실립니다. 2026-07-28 core는 숨은 연결 세션에 기대지 않습니다.",
      "Server는 resultType과 실행 결과를 돌려줍니다. 이 응답은 모델 제안과 실제 외부 효과를 구분해 다음 판단에 사용됩니다.",
    ],
  },
  primitives: {
    id: "mcp-primitives-ticket-viz",
    eyebrow: "TICKET SERVER · CAPABILITY CONTRACT",
    title: "세 기능 중 티켓 생성 Tool만 실행 후보가 됩니다",
    description: "Resource와 Prompt를 Tool처럼 실행하지 않고, Schema와 권한도 따로 검사합니다.",
    labels: ["기능 목록", "Tool 선택", "Schema 검사", "결과 상태"],
    notes: [
      "Server는 tickets.create Tool, ticket://policy Resource, incident-review Prompt를 서로 다른 primitive로 공개합니다.",
      "모델은 사용자의 요청에 맞춰 tickets.create를 제안합니다. 목록에 보인다는 사실은 실행 권한의 증명이 아닙니다.",
      "project·title·operationId의 JSON 모양을 inputSchema로 검사합니다. 업무 권한과 사실성은 별도 gate가 판정합니다.",
      "성공은 complete, 추가 입력은 input_required, 업무 오류는 tool error로 구분합니다. JSON-RPC protocol error와도 섞지 않습니다.",
    ],
  },
  transport: {
    id: "mcp-transport-ticket-viz",
    eyebrow: "SAME JSON-RPC · TWO BINDINGS",
    title: "같은 tools/call을 stdio 또는 HTTP로 운반합니다",
    description: "Transport가 정하는 것은 framing·전달·취소 신호이며 티켓 생성의 의미가 아닙니다.",
    labels: ["같은 메시지", "stdio", "HTTP POST", "수명 분리"],
    notes: [
      "JSON-RPC body의 method·name·arguments는 transport와 무관하게 같은 뜻을 가집니다.",
      "로컬에서는 Host가 child process를 시작하고 stdin으로 요청, stdout으로 응답을 주고받습니다. 진단은 stderr로 분리합니다.",
      "원격에서는 요청마다 POST하고 JSON 또는 요청 범위 SSE로 응답받습니다. MCP-Protocol-Version·Mcp-Method·Mcp-Name 헤더와 body가 일치해야 합니다.",
      "응답 stream 종료, cancellation, 장기 subscription은 수명이 다릅니다. 연결이 끊겼다고 이미 생긴 티켓이 자동으로 취소되지는 않습니다.",
    ],
  },
  operations: {
    id: "mcp-operation-receipt-viz",
    eyebrow: "WRITE TOOL · OPERATION TENANT7:TICKET:42",
    title: "Timeout 뒤에는 새 티켓보다 기존 영수증을 먼저 찾습니다",
    description: "제안→권한 검사→한 번 실행→영수증 확인으로 중복 효과를 막습니다.",
    labels: ["실행 제안", "권한 검사", "한 번 실행", "영수증 확인"],
    notes: [
      "모델의 tickets.create 호출은 후보입니다. Host는 사용자 의도와 위험도에 맞춰 확인 여부를 결정합니다.",
      "Server는 token issuer·audience·scope·tenant와 project ACL을 실행 직전에 다시 검사합니다.",
      "operationId tenant7:ticket:42로 effect와 receipt를 함께 기록합니다. 첫 응답이 유실돼도 티켓은 이미 만들어졌을 수 있습니다.",
      "재시도는 같은 operationId의 receipt를 조회해 ticketId 91을 돌려줍니다. Network attempt는 2번이어도 실제 티켓은 1건입니다.",
    ],
  },
};

function useMobileDiagram() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return mobile;
}

function Arrow({ x1, y1, x2, y2, id, active = false, dashed = false }: { x1: number; y1: number; x2: number; y2: number; id: string; active?: boolean; dashed?: boolean }) {
  return <g><defs><marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={active ? accent : line} /></marker></defs><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? accent : line} strokeWidth="1.2" strokeDasharray={dashed ? "5 5" : undefined} markerEnd={`url(#${id})`} /></g>;
}

function Box({ x, y, w, h, title, detail, active = false }: { x: number; y: number; w: number; h: number; title: string; detail: string; active?: boolean }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="8" fill={active ? "color-mix(in srgb, var(--primary) 9%, var(--background))" : "var(--background)"} stroke={active ? accent : border} strokeWidth="1.2" /><text x={x + 14} y={y + 25} className="fill-foreground text-[12px] font-bold">{title}</text><text x={x + 14} y={y + 45} className="fill-muted-foreground text-[9px]">{detail}</text></g>;
}

function CoreDiagram({ active, mobile }: { active: number; mobile: boolean }) {
  const viewBoxes = ["0 18 190 224", "155 18 210 224", "315 18 260 224", "560 18 160 224"];
  return <svg viewBox={mobile ? viewBoxes[active] : "0 0 720 260"} role="img" aria-label={FLOWS.core.labels[active]} className={mobile ? "mx-auto block h-[12.5rem] w-auto max-w-full" : "block h-auto w-full"}>
    <Box x={20} y={76} w={140} h={94} title="사용자 · Host" detail="대화 · 승인 정책" active={active === 0} />
    <Box x={205} y={76} w={120} h={94} title="MCP Client" detail="한 server 연결" active={active === 1} />
    <Box x={370} y={52} w={170} h={142} title="JSON-RPC request" detail="tools/call" active={active === 2} />
    <text x="385" y="105" className="fill-muted-foreground text-[9px]">version 2026-07-28</text><text x="385" y="124" className="fill-muted-foreground text-[9px]">client capabilities</text><text x="385" y="143" className="fill-muted-foreground text-[9px]">tickets.create · args</text>
    <Box x={585} y={76} w={115} h={94} title={active === 3 ? "complete result" : "Ticket Server"} detail={active === 3 ? "ticketId 91" : "권한 · 실행"} active={active === 3} />
    <Arrow x1={162} y1={123} x2={201} y2={123} id="mcp-core-a" active={active >= 1} /><Arrow x1={327} y1={123} x2={366} y2={123} id="mcp-core-b" active={active >= 2} /><Arrow x1={542} y1={123} x2={581} y2={123} id="mcp-core-c" active={active >= 3} />
    <circle cx={[82, 265, 455, 642][active]} cy="218" r="5" fill={accent} />
    <text x="360" y="245" textAnchor="middle" className="fill-muted-foreground text-[9px]">Host 판단 → client 교환 → 요청 자체 설명 → server result</text>
  </svg>;
}

function PrimitiveDiagram({ active, mobile }: { active: number; mobile: boolean }) {
  const viewBoxes = ["0 0 225 260", "220 0 215 260", "425 0 220 260", "555 0 165 260"];
  return <svg viewBox={mobile ? viewBoxes[active] : "0 0 720 270"} role="img" aria-label={FLOWS.primitives.labels[active]} className={mobile ? "mx-auto block h-[12.5rem] w-auto max-w-full" : "block h-auto w-full"}>
    {[{ y: 38, t: "Tool", d: "tickets.create" }, { y: 102, t: "Resource", d: "ticket://policy" }, { y: 166, t: "Prompt", d: "incident-review" }].map((item, index) => <Box key={item.t} x={18} y={item.y} w={188} h={52} title={item.t} detail={item.d} active={active === 0 || (active === 1 && index === 0)} />)}
    <Arrow x1={210} y1={64} x2={266} y2={64} id="mcp-primitive-a" active={active >= 1} />
    <Box x={270} y={31} w={150} h={72} title="모델의 제안" detail="tickets.create" active={active === 1} />
    <Arrow x1={423} y1={67} x2={468} y2={67} id="mcp-primitive-b" active={active >= 2} />
    <g><path d="M476 29h119l31 72-31 72H476l-31-72z" fill={active === 2 ? "color-mix(in srgb, var(--primary) 9%, var(--background))" : "var(--background)"} stroke={active === 2 ? accent : border} strokeWidth="1.2" /><text x="535" y="76" textAnchor="middle" className="fill-foreground text-[11px] font-bold">inputSchema</text><text x="535" y="97" textAnchor="middle" className="fill-muted-foreground text-[9px]">project · title</text><text x="535" y="114" textAnchor="middle" className="fill-muted-foreground text-[9px]">operationId</text><text x="535" y="145" textAnchor="middle" className="fill-muted-foreground text-[9px]">형식 ✓ · 권한은 별도</text></g>
    <Arrow x1={629} y1={101} x2={658} y2={101} id="mcp-primitive-c" active={active >= 3} />
    <g opacity={active === 3 ? 1 : 0.48}><path d="M663 39h45v134h-45z" fill="var(--background)" stroke={active === 3 ? accent : border} /><text x="685" y="61" textAnchor="middle" className="fill-foreground text-[8px] font-bold">RESULT</text>{["complete", "input", "error"].map((t, i) => <text key={t} x="685" y={89 + i * 25} textAnchor="middle" className="fill-muted-foreground text-[7px]">{t}</text>)}</g>
    <text x="360" y="252" textAnchor="middle" className="fill-muted-foreground text-[9px]">기능 종류 → 실행 후보 → 구조 검증 → 명시적 결과 상태</text>
  </svg>;
}

function TransportDiagram({ active, mobile }: { active: number; mobile: boolean }) {
  const viewBoxes = ["0 0 215 260", "265 0 205 260", "265 70 205 190", "475 0 245 260"];
  return <svg viewBox={mobile ? viewBoxes[active] : "0 0 720 270"} role="img" aria-label={FLOWS.transport.labels[active]} className={mobile ? "mx-auto block h-[12.5rem] w-auto max-w-full" : "block h-auto w-full"}>
    <Box x={18} y={72} w={175} h={112} title="JSON-RPC body" detail="tools/call" active={active === 0} /><text x="32" y="128" className="fill-muted-foreground text-[9px]">name: tickets.create</text><text x="32" y="147" className="fill-muted-foreground text-[9px]">operationId: …42</text>
    <path d="M196 126h44" stroke={line} /><circle cx="254" cy="126" r="17" fill="var(--background)" stroke={border} /><text x="254" y="130" textAnchor="middle" className="fill-foreground text-[9px] font-bold">OR</text>
    <g opacity={active === 1 ? 1 : 0.5}><Box x={292} y={29} w={155} h={86} title="stdio" detail="child process" active={active === 1} /><text x="306" y="93" className="fill-muted-foreground text-[8px]">stdin → stdout · log=stderr</text></g>
    <g opacity={active >= 2 ? 1 : 0.5}><Box x={292} y={144} w={155} h={86} title="HTTP POST /mcp" detail="JSON 또는 SSE" active={active === 2} /><text x="306" y="208" className="fill-muted-foreground text-[8px]">version · method · name headers</text></g>
    <Arrow x1={271} y1={116} x2={288} y2={82} id="mcp-transport-a" active={active === 1} /><Arrow x1={271} y1={137} x2={288} y2={177} id="mcp-transport-b" active={active >= 2} />
    <g opacity={active === 3 ? 1 : 0.47}><path d="M497 31h202v198H497z" fill="var(--background)" stroke={active === 3 ? accent : border} strokeWidth="1.2" /><text x="515" y="58" className="fill-foreground text-[11px] font-bold">서로 다른 수명</text>{[[88,"요청 응답","JSON · request SSE"],[126,"취소","notification · stream close"],[164,"구독","subscriptions/listen"],[202,"업무 효과","ticket receipt로 확인"]].map(([y,t,d]) => <g key={String(t)}><text x="515" y={Number(y)} className="fill-primary text-[8px] font-bold">{t}</text><text x="580" y={Number(y)} className="fill-muted-foreground text-[8px]">{d}</text></g>)}</g>
  </svg>;
}

function OperationsDiagram({ active, mobile }: { active: number; mobile: boolean }) {
  const viewBoxes = ["0 0 185 260", "175 0 215 260", "395 0 175 260", "395 25 325 230"];
  return <svg viewBox={mobile ? viewBoxes[active] : "0 0 720 270"} role="img" aria-label={FLOWS.operations.labels[active]} className={mobile ? "mx-auto block h-[12.5rem] w-auto max-w-full" : "block h-auto w-full"}>
    <Box x={18} y={70} w={145} h={92} title="모델 제안" detail="tickets.create" active={active === 0} />
    <Arrow x1={166} y1={116} x2={207} y2={116} id="mcp-op-a" active={active >= 1} />
    <g><path d="M216 50h132l30 66-30 66H216l-30-66z" fill={active === 1 ? "color-mix(in srgb, var(--primary) 9%, var(--background))" : "var(--background)"} stroke={active === 1 ? accent : border} strokeWidth="1.2" /><text x="282" y="91" textAnchor="middle" className="fill-foreground text-[11px] font-bold">실행 gate</text><text x="282" y="116" textAnchor="middle" className="fill-muted-foreground text-[8px]">consent · scope · ACL</text><text x="282" y="137" textAnchor="middle" className="fill-muted-foreground text-[8px]">tenant7 · project PAY</text></g>
    <Arrow x1={381} y1={116} x2={416} y2={116} id="mcp-op-b" active={active >= 2} />
    <Box x={420} y={70} w={132} h={92} title="Ticket API" detail="ticketId 91" active={active === 2} /><text x="433" y="144" className="fill-muted-foreground text-[8px]">effect count = 1</text>
    <Arrow x1={555} y1={116} x2={590} y2={116} id="mcp-op-c" active={active >= 3} />
    <g opacity={active === 3 ? 1 : 0.48}><path d="M596 45h108v142H596z" fill="var(--background)" stroke={active === 3 ? accent : border} strokeWidth="1.2" /><text x="650" y="70" textAnchor="middle" className="fill-foreground text-[10px] font-bold">RECEIPT</text><text x="609" y="96" className="fill-muted-foreground text-[8px]">op: …42</text><text x="609" y="116" className="fill-muted-foreground text-[8px]">ticket: 91</text><text x="609" y="136" className="fill-muted-foreground text-[8px]">status: created</text><text x="609" y="156" className="fill-muted-foreground text-[8px]">attempts: 2</text><text x="609" y="176" className="fill-primary text-[8px] font-bold">effects: 1</text></g>
    {active === 3 && <Arrow x1={646} y1={205} x2={475} y2={205} id="mcp-op-reconcile" active dashed />}
    <text x="475" y="228" textAnchor="middle" className="fill-muted-foreground text-[8px]">timeout 뒤 새 effect 전에 기존 receipt 조회</text>
  </svg>;
}

const DIAGRAMS: Record<Mode, (props: { active: number; mobile: boolean }) => ReactNode> = { core: CoreDiagram, primitives: PrimitiveDiagram, transport: TransportDiagram, operations: OperationsDiagram };

export default function McpLearningFlowViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  const controls = useAnimatedScenes(flow.labels.length, 6200);
  const mobile = useMobileDiagram();
  const Diagram = DIAGRAMS[mode];
  return <VizFrame eyebrow={flow.eyebrow} title={flow.title} description={flow.description} className="my-8">
    <div id={flow.id} data-viz-canvas data-viz-scene={flow.id} data-story-index={controls.active} tabIndex={0} onKeyDown={controls.onKeyDown} className="flex h-[min(32rem,calc(100svh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto border-y border-border/70 bg-background px-4 py-5 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6">
      <div data-viz-live-only className="flex min-h-0 flex-1 flex-col justify-center">
        <p className="text-[11px] font-black text-primary">장면 {String(controls.active + 1).padStart(2, "0")}</p><h3 className="mt-2 text-lg font-bold leading-7">{flow.labels[controls.active]}</h3>
        <div className="mt-4 min-w-0 overflow-hidden"><Diagram active={controls.active} mobile={mobile} /></div>
        <p className="mt-3 border-l border-primary/50 pl-3 text-[11px] leading-5 text-muted-foreground sm:mt-4 sm:text-sm sm:leading-6">{flow.notes[controls.active]}</p>
      </div>
      <AnimatedSceneControls labels={flow.labels} {...controls} />
      <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">{flow.labels.map((label, index) => <li key={label}><strong>{String(index + 1).padStart(2, "0")} · {label}</strong><span className="mt-1 block text-muted-foreground">{flow.notes[index]}</span></li>)}</ol>
    </div>
  </VizFrame>;
}
