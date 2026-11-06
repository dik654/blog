import SceneShell from "./SceneShell";
import { Arrow, Box } from "./SvgBits";

/**
 * 본문 대응: #black-box — 수신자 공개값 → 송신자 비밀·캡슐 → 수신자 복원, 그리고 공개값을 바꿔치기하는 경우.
 * 가운데 띠가 공개 통신입니다. 띠를 지나는 것만 남이 복사할 수 있습니다.
 */
const W = 360;
const H = 296;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const FAINT = "#94a3b8";

const SCENES = [
  { label: "한 쌍 만들기", summary: "보관값 · 공개값", note: "수신자가 자신만 보관할 값과 남에게 줄 값을 한 쌍으로 만듭니다. 보관값은 어떤 통신에도 나가지 않습니다." },
  { label: "공개값 전송", summary: "수신자 → 송신자", note: "공개값은 공개 통신을 지나므로 누구나 복사할 수 있습니다. 복사해도 되도록 설계한 값입니다." },
  { label: "비밀과 캡슐", summary: "공개값 + 새 난수", note: "송신자는 받은 공개값과 새 난수로 비밀과 캡슐을 함께 만듭니다. 비밀은 이쪽에 남고 캡슐만 나갑니다." },
  { label: "캡슐 전송", summary: "송신자 → 수신자", note: "돌아가는 캡슐도 복사될 수 있습니다. 비밀 자체는 어느 쪽 전송에도 실리지 않습니다." },
  { label: "복원", summary: "양쪽에 같은 비밀", note: "수신자는 캡슐과 보관값으로 비밀을 복원합니다. 띠에는 공개값과 캡슐만 지나갔는데 양쪽에 같은 비밀이 생겼습니다." },
  { label: "바꿔치기", summary: "다른 상대와 비밀", note: "절차는 상대의 이름을 확인하지 않습니다. 중간에서 공개값을 다른 사람의 것으로 바꾸면 송신자는 정상 절차대로 그 사람과 비밀을 만들 수 있습니다. 신원 확인은 뒤에서 다시 연결합니다." },
] as const;

function Heads({ middle }: { middle: string }) {
  return (
    <g>
      <rect x={126} y={0} width={108} height={H} fill={`${FAINT}1f`} />
      <text x={62} y={20} textAnchor="middle" fontSize={14} fontWeight={700} fill={BLUE}>수신자</text>
      <text x={180} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>{middle}</text>
      <text x={298} y={20} textAnchor="middle" fontSize={14} fontWeight={700} fill={AMBER}>송신자</text>
    </g>
  );
}

function Flow({ active }: { active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Heads middle="공개 통신" />
      <Box x={4} y={32} w={118} h={48} text="보관값" sub="+ 공개값" color={BLUE} live={active === 0} />
      {active >= 1 && (
        <g opacity={active === 1 ? 1 : 0.45}>
          <Arrow x1={62} y1={100} x2={298} y2={100} color={BLUE} />
          <text x={180} y={92} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>공개값</text>
          <text x={180} y={118} textAnchor="middle" fontSize={12} fill={GRAY}>복사 가능</text>
        </g>
      )}
      {active >= 2 && <Box x={238} y={128} w={118} h={48} text="비밀 · 캡슐" sub="공개값 + 새 난수" color={AMBER} live={active === 2} />}
      {active >= 3 && (
        <g opacity={active === 3 ? 1 : 0.45}>
          <Arrow x1={298} y1={200} x2={62} y2={200} color={AMBER} />
          <text x={180} y={192} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>캡슐</text>
          <text x={180} y={218} textAnchor="middle" fontSize={12} fill={GRAY}>복사 가능</text>
        </g>
      )}
      {active >= 4 && (
        <g>
          <Box x={4} y={236} w={118} h={48} text="같은 비밀" sub="캡슐 + 보관값" color={BLUE} />
          <Box x={238} y={236} w={118} h={48} text="같은 비밀" sub="위에서 만든 것" color={AMBER} />
        </g>
      )}
    </svg>
  );
}

function Swap({ active }: { active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Heads middle="중간의 공격자" />
      <Box x={4} y={32} w={118} h={48} text="보관값" sub="+ 공개값 A" color={BLUE} />
      <Arrow x1={122} y1={56} x2={134} y2={92} color={BLUE} />
      <Box x={134} y={92} w={92} h={48} text="A를 버림" sub="B를 보냄" color={RED} dashed />
      <Arrow x1={226} y1={116} x2={286} y2={116} color={RED} />
      <text x={254} y={108} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>B</text>
      <Box x={238} y={136} w={118} h={48} text="비밀 · 캡슐" sub="공개값 B로 만듦" color={AMBER} />
      <Arrow x1={250} y1={184} x2={226} y2={206} color={AMBER} />
      <Box x={134} y={186} w={92} h={48} text="공격자가" sub="같은 비밀 복원" color={RED} dashed />
      <text x={250} y={208} fontSize={13} fontWeight={700} fill={AMBER}>캡슐</text>
      <text x={180} y={268} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>절차는 정상, 상대가 다름</text>
    </svg>
  );
}

export default function KemMessagesViz() {
  return (
    <SceneShell
      eyebrow="공개 통신 위의 왕복"
      title="비밀은 한 번도 지나가지 않는데 양쪽에 생깁니다"
      description="가운데 띠가 공개 통신입니다. 위에서 아래로 시간이 흐릅니다."
      ariaLabel="수신자의 공개값과 송신자의 캡슐이 오가며 양쪽에 같은 비밀이 생기고, 공개값을 바꾸면 상대가 달라지는 과정"
      scenes={SCENES}
      render={(active) => (active === 5 ? <Swap active={active} /> : <Flow active={active} />)}
    />
  );
}
