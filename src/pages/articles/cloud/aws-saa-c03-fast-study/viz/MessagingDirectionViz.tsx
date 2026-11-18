import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 둘째 문단 — SQS는 작업을 보관해 소비자가 가져가게 하고, SNS는 한 메시지를 여러 구독자에게 밀어내며,
 * Kinesis는 순서 있는 스트림 처리에 맞다. 구독자 셋, 메시지·레코드 개수는 그림을 위한 가정이다.
 */
const BLUE = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "SQS: 보관하고, 소비자가 가져갑니다", summary: "보관 → 가져감", note: "보낸 작업은 큐에 보관됩니다. 받는 쪽이 밀어 받는 것이 아니라, 소비자가 큐에서 작업을 가져갑니다." },
  { label: "SNS: 한 메시지를 여러 구독자에게 밀어냅니다", summary: "1개 → 구독자마다 1개씩", note: "구독자는 이 메시지를 받겠다고 등록한 대상입니다. 메시지 하나가 등록된 구독자 모두에게 각각 전달됩니다. 구독자 셋은 가정입니다." },
  { label: "Kinesis: 순서 있는 흐름을 처리합니다", summary: "1 → 2 → 3 → 4 순서", note: "데이터가 들어온 순서대로 이어진 흐름(스트림)을 소비자가 그 순서대로 처리합니다. 본문 표현대로 순서 있는 스트림 처리에 맞습니다." },
] as const;

function Box({ x, y, w, h, label, strong = false }: { x: number; y: number; w: number; h: number; label: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={strong ? BLUE : MUTED} strokeWidth={strong ? 1.25 : 1} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={strong ? BLUE : TEXT}>{label}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const tip = (offset: number) => `${x2 - 7 * Math.cos(angle + offset)} ${y2 - 7 * Math.sin(angle + offset)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BLUE} strokeWidth={1.25} />
      <path d={`M${x2} ${y2} L${tip(0.45)} L${tip(-0.45)} Z`} fill={BLUE} />
    </g>
  );
}

function Chip({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={26} height={22} rx={4} fill={BLUE} opacity={0.15} stroke={BLUE} strokeWidth={1} />
      <text x={x + 13} y={y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>{label}</text>
    </g>
  );
}

function WideDiagram({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 480 180" className="mx-auto hidden h-auto w-full max-w-[640px] sm:block" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Box x={10} y={70} w={86} h={40} label="보내는 쪽" />
      {active === 0 && (
        <g>
          <Arrow x1={96} y1={90} x2={150} y2={90} />
          <rect x={150} y={56} width={150} height={68} rx={6} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <text x={225} y={48} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>SQS 큐 · 보관</text>
          {["1", "2", "3"].map((label, index) => <Chip key={label} x={166 + index * 42} y={79} label={label} />)}
          <Arrow x1={300} y1={90} x2={370} y2={90} />
          <text x={335} y={80} textAnchor="middle" fontSize={11} fill={TEXT}>가져감</text>
          <Box x={370} y={70} w={100} h={40} label="소비자" strong />
          <text x={420} y={130} textAnchor="middle" fontSize={11} fill={TEXT}>소비자 쪽에서 꺼냄</text>
        </g>
      )}
      {active === 1 && (
        <g>
          <Arrow x1={96} y1={90} x2={170} y2={90} />
          <Box x={170} y={70} w={100} h={40} label="SNS" strong />
          <Chip x={127} y={60} label="1" />
          {[24, 90, 156].map((yy, index) => (
            <g key={yy}>
              <Arrow x1={270} y1={90} x2={360} y2={yy} />
              <Box x={360} y={yy - 18} w={110} h={36} label={`구독자 ${index + 1}`} strong />
            </g>
          ))}
          <text x={300} y={170} textAnchor="middle" fontSize={11} fill={TEXT}>각자 같은 메시지 1개</text>
        </g>
      )}
      {active === 2 && (
        <g>
          <Arrow x1={96} y1={90} x2={140} y2={90} />
          <rect x={140} y={66} width={190} height={48} rx={6} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <text x={235} y={56} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>Kinesis 스트림 · 들어온 순서</text>
          {["4", "3", "2", "1"].map((label, index) => <Chip key={label} x={152 + index * 44} y={79} label={label} />)}
          <Arrow x1={330} y1={90} x2={370} y2={90} />
          <Box x={370} y={70} w={100} h={40} label="소비자" strong />
          <text x={420} y={130} textAnchor="middle" fontSize={11} fill={TEXT}>1 → 2 → 3 → 4</text>
        </g>
      )}
    </svg>
  );
}

/** 640px 미만: 보내는 쪽을 위, 받는 쪽을 아래에 두어 글자를 줄이지 않습니다. */
function NarrowDiagram({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 300 236" className="mx-auto h-auto w-full sm:hidden" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Box x={100} y={4} w={100} h={36} label="보내는 쪽" />
      {active === 0 && (
        <g>
          <Arrow x1={150} y1={40} x2={150} y2={68} />
          <rect x={60} y={68} width={180} height={60} rx={6} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <text x={150} y={86} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>SQS 큐 · 보관</text>
          {["1", "2", "3"].map((label, index) => <Chip key={label} x={96 + index * 40} y={96} label={label} />)}
          <Arrow x1={150} y1={128} x2={150} y2={170} />
          <text x={160} y={154} fontSize={12} fill={TEXT}>가져감</text>
          <Box x={100} y={170} w={100} h={36} label="소비자" strong />
          <text x={150} y={226} textAnchor="middle" fontSize={12} fill={TEXT}>소비자 쪽에서 꺼냄</text>
        </g>
      )}
      {active === 1 && (
        <g>
          <Arrow x1={150} y1={40} x2={150} y2={74} />
          <Chip x={160} y={46} label="1" />
          <Box x={100} y={74} w={100} h={36} label="SNS" strong />
          {[52, 150, 248].map((xx, index) => (
            <g key={xx}>
              <Arrow x1={150} y1={110} x2={xx} y2={166} />
              <Box x={xx - 46} y={166} w={92} h={36} label={`구독자 ${index + 1}`} strong />
            </g>
          ))}
          <text x={150} y={226} textAnchor="middle" fontSize={12} fill={TEXT}>각자 같은 메시지 1개</text>
        </g>
      )}
      {active === 2 && (
        <g>
          <Arrow x1={150} y1={40} x2={150} y2={68} />
          <rect x={40} y={68} width={220} height={60} rx={6} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <text x={150} y={86} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>Kinesis 스트림 · 들어온 순서</text>
          {["4", "3", "2", "1"].map((label, index) => <Chip key={label} x={74 + index * 40} y={96} label={label} />)}
          <Arrow x1={150} y1={128} x2={150} y2={170} />
          <Box x={100} y={170} w={100} h={36} label="소비자" strong />
          <text x={150} y={226} textAnchor="middle" fontSize={12} fill={TEXT}>1 → 2 → 3 → 4</text>
        </g>
      )}
    </svg>
  );
}

export default function MessagingDirectionViz() {
  return (
    <SceneShell
      eyebrow="메시징 셋의 이동 방향"
      title="같은 ‘메시징’이라도 메시지가 움직이는 방식이 다릅니다"
      description="회색 상자가 보내는 쪽, 파란 상자가 받는 쪽입니다. 파란 화살표는 메시지가 실제로 넘어가는 방향이고, 칸 하나가 메시지 하나입니다."
      ariaLabel="SQS 보관과 가져감, SNS 여러 구독자 전달, Kinesis 순서 처리 비교"
      scenes={SCENES}
      render={(active) => (
        <>
          <WideDiagram active={active} />
          <NarrowDiagram active={active} />
        </>
      )}
    />
  );
}
