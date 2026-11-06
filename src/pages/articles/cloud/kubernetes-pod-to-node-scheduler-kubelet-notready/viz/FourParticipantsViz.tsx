import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — scheduler·kubelet·node lifecycle controller는 서로 말을 걸지 않고 API server의 객체만 읽고 씁니다.
 * 그림의 칸은 본문이 이름 붙인 필드만 씁니다. 화살표 하나가 읽기 또는 쓰기 한 번입니다.
 */
const INK = "#0f172a";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const BOX = "#f1f5f9";
const ON = "#2563eb";
const ONBOX = "#dbeafe";

type Arrow = { from: [number, number]; to: [number, number]; text?: string; at?: [number, number] };

interface Scene {
  label: string;
  summary: string;
  note: string;
  nodeName: string;
  status: string;
  lease: string;
  node: string;
  on: string[];
  arrows: Arrow[];
  gone?: boolean;
}

const SCH_WRITE: Arrow = { from: [54, 62], to: [54, 176], text: "적기", at: [58, 104] };
const KUB_READ: Arrow = { from: [96, 176], to: [150, 62], text: "watch로 읽기", at: [30, 134] };
const KUB_STATUS: Arrow = { from: [180, 62], to: [170, 176], text: "적기", at: [182, 118] };
const KUB_LEASE: Arrow = { from: [214, 62], to: [250, 176], text: "심장박동", at: [166, 112] };
const CTL_READ: Arrow = { from: [290, 176], to: [290, 62], text: "읽기", at: [262, 118] };
const CTL_WRITE: Arrow = { from: [334, 62], to: [334, 218], text: "적기", at: [338, 104] };

const SCENES: readonly Scene[] = [
  { label: "네 참여자의 자리", summary: "서로 보내는 메시지 없음", note: "API server가 객체를 etcd에 두고 읽기와 쓰기를 받습니다. 나머지 셋 사이에는 화살표가 없습니다. 모두 객체를 watch하다가 자기 담당 필드가 바뀌면 행동합니다.", nodeName: "비어 있음", status: "", lease: "", node: "Node 객체", on: [], arrows: [] },
  { label: "scheduler가 적습니다", summary: "nodeName = worker-2", note: "scheduler는 nodeName이 비어 있는 Pod를 찾아 노드를 고르고 그 이름을 적습니다. kubelet에게 '이 Pod를 띄워라'라고 말하지 않습니다.", nodeName: "worker-2", status: "", lease: "", node: "Node 객체", on: ["nodeName"], arrows: [SCH_WRITE] },
  { label: "kubelet이 읽습니다", summary: "자기 이름이 적힌 Pod", note: "kubelet은 자기 노드 이름이 적힌 Pod를 읽어 컨테이너 런타임에 sandbox와 컨테이너 생성을 요청합니다. 런타임은 컨테이너를 실제로 만드는 노드 안 프로그램입니다.", nodeName: "worker-2", status: "", lease: "", node: "Node 객체", on: ["nodeName"], arrows: [KUB_READ] },
  { label: "kubelet이 결과를 적습니다", summary: "Pod의 status", note: "만든 결과는 kubelet이 다시 Pod의 status에 적습니다. 결과를 받는 쪽도 메시지가 아니라 객체로 받습니다.", nodeName: "worker-2", status: "결과 기록", lease: "", node: "Node 객체", on: ["status"], arrows: [KUB_STATUS] },
  { label: "컨트롤러가 판단합니다", summary: "심장박동 → Ready·taint", note: "kubelet의 심장박동(1절의 Lease 갱신)을 근거로 node lifecycle controller가 Node 객체의 Ready 조건과 taint를 적습니다. taint는 노드에 붙이는 표식입니다.", nodeName: "worker-2", status: "결과 기록", lease: "갱신됨", node: "Node 객체에 적음", on: ["lease", "node"], arrows: [KUB_LEASE, CTL_READ, CTL_WRITE] },
  { label: "kubelet이 사라지면", summary: "마지막 상태 + 흐른 시간", note: "어떤 참여자가 사라져도 나머지는 객체의 마지막 상태와 그 뒤 흐른 시간만으로 판단합니다. '나 죽는다'는 메시지가 없으므로 노드 장애 6분의 시계가 여기서 나옵니다.", nodeName: "worker-2", status: "마지막 보고", lease: "갱신 멈춤", node: "흐른 시간으로 판단", on: ["lease", "node"], arrows: [CTL_READ, CTL_WRITE], gone: true },
];

function Participant({ x, lines, gone }: { x: number; lines: string[]; gone?: boolean }) {
  return (
    <g>
      <rect x={x} y={14} width={92} height={48} rx={8} fill={gone ? "none" : BOX} stroke={gone ? MUTED : LINE} strokeWidth={1} strokeDasharray={gone ? "4 3" : undefined} />
      {lines.map((line, i) => (
        <text key={line} x={x + 46} y={lines.length === 1 ? 42 : 34 + i * 15} textAnchor="middle" fontSize={12} fontWeight={700} fill={gone ? MUTED : INK}>{line}</text>
      ))}
    </g>
  );
}

function NoTalk({ x }: { x: number }) {
  return (
    <g>
      <line x1={x - 16} x2={x + 16} y1={38} y2={38} stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
      <text x={x} y={43} textAnchor="middle" fontSize={15} fontWeight={700} fill="#dc2626">×</text>
    </g>
  );
}

function Field({ x, y, w, h = 36, name, value, on }: { x: number; y: number; w: number; h?: number; name: string; value: string; on: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={on ? ONBOX : "#ffffff"} stroke={on ? ON : LINE} strokeWidth={1} />
      <text x={x + w / 2} y={y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={INK}>{name}</text>
      <text x={x + w / 2} y={y + 29} textAnchor="middle" fontSize={11} fill={on ? ON : MUTED}>{value}</text>
    </g>
  );
}

function ArrowLine({ arrow, id }: { arrow: Arrow; id: string }) {
  return (
    <g>
      <line x1={arrow.from[0]} y1={arrow.from[1]} x2={arrow.to[0]} y2={arrow.to[1]} stroke={ON} strokeWidth={1.25} markerEnd={`url(#${id})`} />
      {arrow.text && arrow.at && <text x={arrow.at[0]} y={arrow.at[1]} fontSize={11} fontWeight={700} fill={ON}>{arrow.text}</text>}
    </g>
  );
}

export default function FourParticipantsViz() {
  return (
    <SceneShell
      eyebrow="Pod 객체를 사이에 둔 넷"
      title="누구도 서로에게 말하지 않고 객체만 읽고 씁니다"
      description="아래 큰 칸이 API server가 보관하는 객체입니다. 위 셋 사이의 ×는 직접 보내는 메시지가 없다는 표시입니다. 파란 화살표가 그 장면에서 일어나는 읽기·쓰기입니다."
      ariaLabel="scheduler, kubelet, node lifecycle controller가 API server의 객체만 읽고 쓰는 구조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const markerId = `four-participants-arrow-${active}`;
        return (
          <svg viewBox="0 0 360 272" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id={markerId} markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={ON} />
              </marker>
            </defs>
            <Participant x={8} lines={["scheduler"]} />
            <Participant x={134} lines={["kubelet"]} gone={scene.gone} />
            <Participant x={260} lines={["node lifecycle", "controller"]} />
            <NoTalk x={117} />
            <NoTalk x={243} />
            <rect x={8} y={146} width={344} height={120} rx={8} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={16} y={258} fontSize={11} fontWeight={700} fill={MUTED}>API server · etcd</text>
            <rect x={16} y={168} width={204} height={68} rx={6} fill={BOX} stroke={LINE} strokeWidth={1} />
            <text x={118} y={230} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>Pod 객체</text>
            <Field x={22} y={176} w={100} name="spec.nodeName" value={scene.nodeName} on={scene.on.includes("nodeName")} />
            <Field x={128} y={176} w={86} name="status" value={scene.status} on={scene.on.includes("status")} />
            <Field x={232} y={176} w={82} name="Lease" value={scene.lease} on={scene.on.includes("lease")} />
            <Field x={232} y={218} w={112} name="Ready·taint" value={scene.node} on={scene.on.includes("node")} />
            {scene.arrows.map((arrow) => <ArrowLine key={`${arrow.from}-${arrow.to}`} arrow={arrow} id={markerId} />)}
          </svg>
        );
      }}
    />
  );
}
