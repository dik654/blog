import SceneShell from "./SceneShell";

/**
 * 본문 대응: 도입 사례의 숫자 절 — (가정) 8,000GB ÷ 120초 ≈ 66.7GB/s는 payload 기준선이고,
 * local이 이 속도를 내도 node loss 뒤 restore가 안 되면 checkpoint 계층으로는 실패.
 */
const CHECKPOINT_GB = 8000;
const WINDOW_S = 120;
const RATE = (CHECKPOINT_GB / WINDOW_S).toFixed(1);

const SCENES = [
  {
    label: "필요한 쓰기 속도",
    summary: `8,000GB ÷ ${WINDOW_S}초 ≈ ${RATE}GB/s`,
    note: "(가정) 8,000GB를 120초 안에 저장하려면 약 66.7GB/s가 필요합니다. 이것은 application payload 기준선이고 보호 복사·metadata·다른 작업의 read는 아직 넣지 않았습니다.",
  },
  {
    label: "빠른 local에 함께 둡니다",
    summary: "반복 read는 빨라짐",
    note: "(가정) 도입 사례는 dataset과 checkpoint를 계산 node의 빠른 저장 공간에 함께 뒀습니다. 계산 가까이에 있으니 반복 read는 빨라졌습니다. 오른쪽 칸은 node와 다른 failure domain(한 번의 고장으로 함께 잃는 범위)이며, 이 사례에서는 쓰지 않았습니다.",
  },
  {
    label: "node가 고장 나면",
    summary: "마지막 checkpoint도 함께 사라짐",
    note: "가까운 복사본은 그 node와 failure domain을 공유합니다. node가 고장 나자 마지막 checkpoint도 사라져 전날 상태로 돌아갔습니다. 속도를 냈더라도 checkpoint 계층으로는 실패입니다.",
  },
  {
    label: "checkpoint를 node 밖에",
    summary: "다시 만들 수 있는 것만 local",
    note: "local에는 원본에서 다시 만들 수 있는 읽기 복사본을 둘 수 있습니다. 마지막 checkpoint는 node와 다른 failure domain에 두고, restore해 마지막 complete 세대를 읽어 봐야 남았다고 말할 수 있습니다.",
  },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GREEN = "#16a34a";
const AMBER = "#d97706";
const SLATE = "#64748b";
const LINE = "#94a3b8";

const W = 360;
const H = 200;

function Item({ x, y, w, label, sub, color, lost }: { x: number; y: number; w: number; label: string; sub: string; color: string; lost?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} rx={5} fill="none" stroke={lost ? RED : color} strokeWidth={1} strokeDasharray={lost ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={lost ? SLATE : "currentColor"}>{label}</text>
      <text x={x + w / 2} y={y + 27} textAnchor="middle" fontSize={9.5} fill={lost ? RED : color}>{sub}</text>
    </g>
  );
}

function RateScene() {
  return (
    <g>
      <rect x={14} y={30} width={110} height={56} rx={6} fill="none" stroke={BLUE} strokeWidth={1} />
      <text x={69} y={54} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">checkpoint</text>
      <text x={69} y={72} textAnchor="middle" fontSize={11} fill={BLUE}>8,000GB</text>
      <line x1={124} y1={58} x2={226} y2={58} stroke={BLUE} strokeWidth={1.25} />
      <path d="M226 58 l-7 -4 v8 z" fill={BLUE} />
      <text x={175} y={50} textAnchor="middle" fontSize={10.5} fill="currentColor">120초 안에</text>
      <text x={175} y={74} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>≈ {RATE}GB/s</text>
      <rect x={230} y={30} width={116} height={56} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={288} y={62} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">저장 공간</text>
      <text x={14} y={118} fontSize={10.5} fontWeight={600} fill="currentColor">위 속도는 payload만 센 기준선</text>
      {["보호 복사", "metadata", "다른 작업 read"].map((t, i) => (
        <g key={t}>
          <rect x={14 + i * 112} y={128} width={104} height={34} rx={5} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
          <text x={66 + i * 112} y={142} textAnchor="middle" fontSize={10.5} fill="currentColor">+ {t}</text>
          <text x={66 + i * 112} y={155} textAnchor="middle" fontSize={9.5} fill={AMBER}>아직 미포함</text>
        </g>
      ))}
      <text x={14} y={184} fontSize={10} fill={SLATE}>세 항목의 크기는 글에 없어 길이로 그리지 않았습니다</text>
    </g>
  );
}

function NodeScene({ phase }: { phase: 1 | 2 | 3 }) {
  const failed = phase >= 2;
  const split = phase === 3;
  return (
    <g>
      <rect x={10} y={14} width={200} height={150} rx={8} fill="none" stroke={failed ? RED : LINE} strokeWidth={1} strokeDasharray={failed ? "5 3" : undefined} />
      <text x={18} y={30} fontSize={10.5} fontWeight={600} fill={failed ? RED : "currentColor"}>계산 node{failed ? " · 고장" : ""}</text>
      <rect x={22} y={40} width={176} height={26} rx={5} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={110} y={57} textAnchor="middle" fontSize={10.5} fill={failed ? SLATE : "currentColor"}>계산</text>
      {!failed && (
        <g>
          <line x1={110} y1={66} x2={110} y2={80} stroke={BLUE} strokeWidth={1.25} />
          <text x={116} y={77} fontSize={9.5} fill={BLUE}>빠른 read</text>
        </g>
      )}
      <rect x={22} y={82} width={176} height={74} rx={5} fill="none" stroke={LINE} strokeWidth={1} />
      <text x={30} y={95} fontSize={9.5} fill={SLATE}>빠른 local 저장 공간</text>
      <Item x={30} y={102} w={split ? 160 : 76} label={split ? "dataset 읽기 복사본" : "dataset"} sub={failed ? (split ? "잃음 → 원본에서 다시 만듦" : "사라짐") : "local"} color={BLUE} lost={failed} />
      {!split && <Item x={114} y={102} w={76} label="checkpoint" sub={failed ? "사라짐" : "마지막 세대"} color={BLUE} lost={failed} />}

      <rect x={232} y={14} width={118} height={150} rx={8} fill="none" stroke={split ? GREEN : LINE} strokeWidth={1} strokeDasharray={split ? undefined : "4 3"} />
      <text x={291} y={32} textAnchor="middle" fontSize={10} fill={split ? "currentColor" : SLATE}>node와 다른</text>
      <text x={291} y={46} textAnchor="middle" fontSize={10} fill={split ? "currentColor" : SLATE}>failure domain</text>
      {split ? (
        <g>
          <Item x={242} y={70} w={98} label="checkpoint" sub="남아 있어야 함" color={GREEN} />
          <text x={291} y={126} textAnchor="middle" fontSize={9.5} fill={GREEN}>restore로 마지막</text>
          <text x={291} y={140} textAnchor="middle" fontSize={9.5} fill={GREEN}>complete 세대 확인</text>
        </g>
      ) : (
        <text x={291} y={96} textAnchor="middle" fontSize={10} fill={SLATE}>쓰지 않음</text>
      )}
      {phase === 2 && (
        <text x={W / 2} y={188} textAnchor="middle" fontSize={11} fontWeight={600} fill={RED}>→ 전날 상태로 돌아감</text>
      )}
      {phase === 3 && (
        <text x={W / 2} y={188} textAnchor="middle" fontSize={10.5} fill={SLATE}>같은 node 고장에서도 checkpoint는 밖에 있습니다</text>
      )}
    </g>
  );
}

export default function CheckpointLossViz() {
  return (
    <SceneShell
      eyebrow="속도와 남는 것"
      title="66.7GB/s를 내도 node와 함께 사라지면 checkpoint가 아닙니다"
      description="도입 사례의 (가정) 숫자와 장면을 그대로 씁니다. 첫 장면은 필요한 속도를, 나머지는 checkpoint를 어디에 두었느냐에 따라 node 고장 뒤 무엇이 남는지를 봅니다."
      ariaLabel="8000GB를 120초에 저장하는 속도, local에 함께 둔 checkpoint가 node 고장으로 사라지는 과정, checkpoint를 node 밖에 두는 배치"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? <RateScene /> : <NodeScene phase={active as 1 | 2 | 3} />}
        </svg>
      )}
    />
  );
}
