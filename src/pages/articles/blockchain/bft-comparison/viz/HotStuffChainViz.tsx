import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hotstuff — "B11이 QC10을, B12가 QC11을, B13이 QC12를 들고 바로 앞 부모를 이어야 B10을 커밋".
 * 마지막 장면은 같은 문단 후반부(주 노드 정지 → NEW-VIEW 2f+1개 중 가장 높은 유효 QC)를 따로 본 갈래이며,
 * 어느 복제본이 어떤 QC를 보고했는지와 B12 뒤 정지 시점은 설명용 가정이다.
 */
type Block = { id: string; qc: string; x: number; y: number };

const MAIN: readonly Block[] = [
  { id: "B9", qc: "", x: 10, y: 40 },
  { id: "B10", qc: "QC9", x: 80, y: 40 },
  { id: "B11", qc: "QC10", x: 150, y: 40 },
  { id: "B12", qc: "QC11", x: 220, y: 40 },
  { id: "B13", qc: "QC12", x: 290, y: 40 },
];
const NEW_BLOCK: Block = { id: "새 블록", qc: "QC11", x: 220, y: 112 };
const BW = 60;
const BH = 40;

const SCENES = [
  {
    label: "B10 제안",
    summary: "B10 + QC9(부모 B9)",
    shown: 2,
    certified: 0,
    committed: false,
    branch: false,
    note: "제안은 새 블록 B10과 부모 B9, 부모를 정당화하는 QC9를 함께 운반합니다. B10 자신은 아직 표를 받지 않았습니다.",
  },
  {
    label: "QC10",
    summary: "B10 인증 · 커밋 아님",
    shown: 3,
    certified: 1,
    committed: false,
    branch: false,
    note: "B10에 같은 블록·view를 가리키는 표 세 개가 모여 QC10이 되고, 다음 제안 B11이 QC10을 들고 B10을 부모로 잇습니다. QC 하나는 B10이 인증됐다는 뜻일 뿐 커밋은 아닙니다.",
  },
  {
    label: "QC11",
    summary: "B10 ← B11 ← B12 · 아직 커밋 아님",
    shown: 4,
    certified: 2,
    committed: false,
    branch: false,
    note: "B12가 QC11을 들고 바로 앞 부모 B11을 잇습니다. 사슬이 길어졌지만 본문의 커밋 조건은 아직 채우지 못했습니다.",
  },
  {
    label: "QC12 → B10 커밋",
    summary: "QC10·QC11·QC12가 연속 부모로 이어짐",
    shown: 5,
    certified: 3,
    committed: true,
    branch: false,
    note: "B11·B12·B13이 각각 바로 앞 부모의 QC를 들고 끊김 없이 이어졌으므로 B10을 커밋할 수 있습니다. 이 연속 세 단계를 three-chain이라고 부릅니다.",
  },
  {
    label: "다른 경우: 주 노드 정지",
    summary: "NEW-VIEW 3개 중 가장 높은 QC = QC11 (가정)",
    shown: 4,
    certified: 2,
    committed: false,
    branch: true,
    note: "B12 제안 뒤 주 노드가 멈췄다고 둡니다(가정). Pacemaker가 view를 올리고, 새 주 노드는 NEW-VIEW 2f+1=3개 안에서 가장 높은 유효 QC(여기서는 QC11)를 찾아 그 블록 B11을 잇는 제안을 만듭니다. 각 복제본은 그 제안에도 자신의 lock과 safe-vote 조건을 다시 검사합니다.",
  },
] as const;

type Tone = "context" | "pending" | "certified" | "committed";

function BlockBox({ block, tone, dim }: { block: Block; tone: Tone; dim: boolean }) {
  if (tone === "context") {
    return (
      <g>
        <rect x={block.x} y={block.y} width={BW} height={BH} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
        <text x={block.x + BW / 2} y={block.y + 25} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">
          {block.id}
        </text>
      </g>
    );
  }
  const stroke = tone === "committed" ? "#16a34a" : tone === "certified" ? "#2563eb" : "#94a3b8";
  const fill = tone === "committed" ? "#dcfce7" : tone === "certified" ? "#dbeafe" : "#f8fafc";
  return (
    <g opacity={dim ? 0.4 : 1}>
      <rect x={block.x} y={block.y} width={BW} height={BH} rx={6} fill={fill} stroke={stroke} strokeWidth={tone === "pending" ? 1 : 1.25} />
      <text x={block.x + BW / 2} y={block.y + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">
        {block.id}
      </text>
      {block.qc && (
        <text x={block.x + BW / 2} y={block.y + 33} textAnchor="middle" fontSize={11} fill="#475569">
          {block.qc}
        </text>
      )}
    </g>
  );
}

function ParentArrow({ from, to }: { from: Block; to: Block }) {
  const x1 = from.x;
  const y1 = from.y + BH / 2;
  const x2 = to.x + BW;
  const y2 = to.y + BH / 2;
  return <path d={`M ${x1} ${y1} L ${x2 + 5} ${y2}`} fill="none" stroke="#64748b" strokeWidth={1} markerEnd="url(#hs-parent)" />;
}

export default function HotStuffChainViz() {
  return (
    <SceneShell
      eyebrow="Chained HotStuff · n=4, f=1"
      title="QC는 인증이고, 커밋은 연속 부모 세 단계 뒤에 옵니다"
      description="상자는 블록, 화살표는 부모 참조입니다. 상자 아래 줄의 QC는 그 블록이 들고 온 부모의 인증서입니다. 회색은 아직 인증 전, 파랑은 QC를 받은 블록, 초록은 커밋된 블록입니다. 점선 B9는 이 장면들이 따라가지 않는 앞 블록이라 상태를 칠하지 않았습니다."
      ariaLabel="B10부터 B13까지 QC가 이어져 B10이 커밋되는 과정과 주 노드 정지 갈래"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const blocks = MAIN.slice(0, scene.shown);
        const toneOf = (index: number): Tone => {
          if (index === 0) return "context";
          if (index === 1 && scene.committed) return "committed";
          return index - 1 < scene.certified ? "certified" : "pending";
        };
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id="hs-parent" viewBox="0 0 8 8" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0 0 L8 4 L0 8 Z" fill="#64748b" />
              </marker>
            </defs>
            <text x={10} y={24} fontSize={11} fill="#64748b">
              ← 부모 방향
            </text>
            {blocks.slice(1).map((block, index) => (
              <ParentArrow key={block.id} from={block} to={blocks[index]} />
            ))}
            {blocks.map((block, index) => (
              <BlockBox key={block.id} block={block} tone={toneOf(index)} dim={scene.branch && index === 3} />
            ))}
            {scene.branch && (
              <>
                <path d={`M ${NEW_BLOCK.x} ${NEW_BLOCK.y + BH / 2} L ${MAIN[2].x + BW / 2} ${NEW_BLOCK.y + BH / 2} L ${MAIN[2].x + BW / 2} ${MAIN[2].y + BH + 5}`} fill="none" stroke="#64748b" strokeWidth={1} markerEnd="url(#hs-parent)" />
                <BlockBox block={NEW_BLOCK} tone="pending" dim={false} />
                <text x={288} y={128} fontSize={10} fill="#475569">
                  B12 미인증
                </text>
                <text x={288} y={142} fontSize={10} fill="#475569">
                  (가정)
                </text>
              </>
            )}
            {scene.committed && (
              <text x={MAIN[1].x + BW / 2} y={100} textAnchor="middle" fontSize={12} fontWeight={700} fill="#15803d">
                B10 커밋
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
