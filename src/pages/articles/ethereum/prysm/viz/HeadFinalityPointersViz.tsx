import SceneShell from "./SceneShell";

/**
 * 본문 대응: #state-head-finality — post-state 계산, head 선택, finalized는 서로 다른 답이다.
 * B352의 parent는 slot 351(글의 fixture). 다른 branch 끝 X와 이전 checkpoint 위치는 설명용 가정. X에 slot 번호를 붙이지 않는다(B351과 같은 slot이면 한 proposer가 두 block을 낸 꼴이 된다).
 */
const W = 360;
const H = 176;
const NODE_W = 70;
const NODE_H = 28;
const TOP_Y = 58;
const LOW_Y = 128;

const NODES = [
  { id: "cp", label: "checkpoint", x: 8, y: TOP_Y },
  { id: "b350", label: "B350", x: 96, y: TOP_Y },
  { id: "b351", label: "B351", x: 184, y: TOP_Y },
  { id: "b352", label: "B352", x: 272, y: TOP_Y },
  { id: "x", label: "X", x: 184, y: LOW_Y },
] as const;

type NodeId = (typeof NODES)[number]["id"];

const SCENES = [
  {
    label: "post-state 계산",
    summary: "B352 → S352 · head는 아직 X",
    head: "x" as NodeId,
    note: "B351의 상태 위에 B352를 적용해 S352가 나왔습니다. 그러나 그 사실은 ‘이 후보를 계산할 수 있다’는 답일 뿐입니다. 아래쪽 다른 branch의 끝 X가 더 많은 attestation weight를 받고 있다면(가정) head는 그쪽 끝에 남습니다.",
  },
  {
    label: "head 이동",
    summary: "vote가 바뀌면 head가 B352로",
    head: "b352" as NodeId,
    note: "Fork choice는 attestation weight와 ancestry를 보고 따라갈 끝을 고릅니다. B352 쪽 표가 더 많아지면(가정) head가 B352로 옮겨 갑니다. X도 유효한 후보라면 head가 아니어도 tree에 남을 수 있습니다.",
  },
  {
    label: "finalized는 뒤에",
    summary: "head는 B352 · finalized는 이전 checkpoint",
    head: "b352" as NodeId,
    note: "Finality는 epoch 단위로 더 강한 증거가 쌓인 checkpoint를 가리키므로 head보다 느리게 전진합니다. Justified checkpoint도 head보다 느리게 움직입니다. 그래서 ‘latest state’만으로는 head·justified·finalized 중 무엇을 읽었는지 알 수 없습니다.",
  },
] as const;

const center = (id: NodeId) => {
  const node = NODES.find((n) => n.id === id) ?? NODES[0];
  return { x: node.x + NODE_W / 2, y: node.y + NODE_H / 2, node };
};

function Pill({ id, text, color, row }: { id: NodeId; text: string; color: string; row: number }) {
  const { node } = center(id);
  const y = node.y - 20 - row * 18;
  return (
    <g>
      <rect x={node.x + 6} y={y} width={NODE_W - 12} height={15} rx={4} fill="none" stroke={color} strokeWidth={1} />
      <text x={node.x + NODE_W / 2} y={y + 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
        {text}
      </text>
    </g>
  );
}

export default function HeadFinalityPointersViz() {
  return (
    <SceneShell
      eyebrow="세 포인터 · B352"
      title="상태를 계산한 block, 따라가는 head, finalized checkpoint는 서로 다른 자리를 가리킵니다"
      description="상자 하나가 block, 선이 parent 관계입니다. 위 줄이 B352의 branch, 아래 X는 B350에서 갈라진 다른 branch의 끝입니다. X와 표의 많고 적음, checkpoint 위치는 설명을 위한 가정입니다."
      ariaLabel="B352의 post-state 계산, head 이동, finalized checkpoint 위치를 block tree에서 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const b352 = center("b352");
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={78} x2={96} y1={TOP_Y + NODE_H / 2} y2={TOP_Y + NODE_H / 2} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={166} x2={184} y1={TOP_Y + NODE_H / 2} y2={TOP_Y + NODE_H / 2} stroke="#94a3b8" strokeWidth={1} />
            <line x1={254} x2={272} y1={TOP_Y + NODE_H / 2} y2={TOP_Y + NODE_H / 2} stroke="#94a3b8" strokeWidth={1} />
            <path d={`M 166 ${TOP_Y + NODE_H / 2} L 175 ${TOP_Y + NODE_H / 2} L 175 ${LOW_Y + NODE_H / 2} L 184 ${LOW_Y + NODE_H / 2}`} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {NODES.map((node) => {
              const isB352 = node.id === "b352";
              const isHead = node.id === scene.head;
              const isCp = node.id === "cp";
              const stroke = isHead ? "#2563eb" : isB352 ? "#16a34a" : isCp && active === 2 ? "#d97706" : "#94a3b8";
              return (
                <g key={node.id}>
                  <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx={6} fill="none" stroke={stroke} strokeWidth={isHead || isB352 ? 1.25 : 1} />
                  <text x={node.x + NODE_W / 2} y={node.y + 18} textAnchor="middle" fontSize={isCp ? 10.5 : 11.5} fontWeight={700} fill={isCp ? "#64748b" : "#475569"}>
                    {node.label}
                  </text>
                </g>
              );
            })}
            <text x={b352.x} y={TOP_Y + NODE_H + 14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#16a34a">
              S352 계산됨
            </text>
            <text x={184 + NODE_W + 6} y={LOW_Y + 12} fontSize={10.5} fill="#64748b">
              다른 branch
            </text>
            <text x={184 + NODE_W + 6} y={LOW_Y + 26} fontSize={10.5} fill="#64748b">
              (가정)
            </text>
            <Pill id={scene.head} text="head" color="#2563eb" row={0} />
            <Pill id="cp" text="finalized" color={active === 2 ? "#d97706" : "#94a3b8"} row={0} />
            <text x={8} y={H - 6} fontSize={10.5} fill="#64748b">
              {active === 2 ? "head가 움직여도 finalized는 같은 자리" : "점선 = 그 사이의 block 생략"}
            </text>
          </svg>
        );
      }}
    />
  );
}
