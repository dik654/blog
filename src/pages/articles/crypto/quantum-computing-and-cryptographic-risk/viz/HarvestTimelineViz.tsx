import SceneShell from "./SceneShell";
import { Arrow, Box } from "./SvgBits";

/**
 * 본문 대응: #limits — 지금 기록한 암호문을 미래에 푸는 상황, 서명의 새로운 승인 위조, 남아 있는 예전 서명 경로.
 * 가로축은 시간입니다. "계산 능력이 생기는 시점"은 날짜가 없는 가정입니다.
 */
const W = 360;
const H = 268;
const X_NOW = 44;
const X_Q = 214;
const X_END = 348;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const FAINT = "#94a3b8";

const SCENES = [
  { label: "지금 기록", summary: "암호문 복사 → 보관", note: "공개 통신은 누구나 복사할 수 있습니다. 지금은 풀 수 없어도 암호문을 그대로 보관할 수 있습니다." },
  { label: "미래에 풀기", summary: "기록 시점 ≠ 해독 시점", note: "키 교환을 풀 계산 능력이 생기면 오래전 기록도 그때 풀 수 있습니다(시점은 가정). 공격이 나중에 일어나도 피해는 그때 보낸 통신입니다." },
  { label: "비밀 기간", summary: "시점을 넘기면 노출", note: "그 시점 뒤까지 비밀이어야 하는 통신에는 노출 구간이 생길 수 있습니다. 먼저 끝나는 비밀에는 이 구간이 없습니다." },
  { label: "서명은 방향이 다름", summary: "새로운 승인 위조", note: "서명의 문제는 옛 내용을 읽는 것이 아닙니다. 노출된 공개키로 그 시점 이후 새로운 승인을 위조할 수 있다는 것입니다." },
  { label: "남은 경로", summary: "키만 바꾸면 끝이 아님", note: "주 경로의 키를 바꿔도 인증서·펌웨어·복구·백업 경로에 예전 서명이 남아 있으면 전환이 끝난 것이 아닙니다." },
] as const;

function Axis({ upTo }: { upTo: number }) {
  return (
    <g>
      <Arrow x1={X_NOW - 20} y1={upTo} x2={X_END} y2={upTo} color={FAINT} />
      <line x1={X_NOW} x2={X_NOW} y1={upTo - 5} y2={upTo + 5} stroke={GRAY} strokeWidth={1} />
      <text x={X_NOW} y={upTo + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>지금</text>
      <line x1={X_Q} x2={X_Q} y1={8} y2={upTo + 5} stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
      <text x={X_Q} y={upTo + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>계산 능력 생김(가정)</text>
    </g>
  );
}

function Timeline({ active }: { active: number }) {
  const axis = 224;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Axis upTo={axis} />
      {active <= 2 && (
        <g>
          <circle cx={X_NOW} cy={40} r={6} fill={BLUE} />
          <text x={X_NOW + 12} y={30} fontSize={13} fontWeight={700} fill={BLUE}>통신 · 암호문 복사</text>
          <line x1={X_NOW} x2={active === 0 ? X_Q - 40 : X_Q} y1={40} y2={40} stroke={GRAY} strokeWidth={1.25} strokeDasharray="5 3" />
          <text x={X_NOW + 40} y={58} fontSize={12} fill={GRAY}>보관</text>
        </g>
      )}
      {(active === 1 || active === 2) && (
        <g>
          <circle cx={X_Q} cy={40} r={6} fill={RED} />
          <text x={X_Q + 12} y={45} fontSize={13} fontWeight={700} fill={RED}>해독</text>
        </g>
      )}
      {active === 2 && (
        <g>
          <rect x={X_NOW} y={92} width={110} height={26} rx={4} fill={`${BLUE}26`} stroke={BLUE} strokeWidth={1} />
          <text x={X_NOW + 8} y={110} fontSize={12} fontWeight={700} fill={BLUE}>짧은 비밀</text>
          <text x={X_NOW + 120} y={110} fontSize={12} fill={GRAY}>먼저 끝남</text>

          <rect x={X_NOW} y={144} width={X_Q - X_NOW} height={26} fill={`${BLUE}26`} stroke={BLUE} strokeWidth={1} />
          <rect x={X_Q} y={144} width={X_END - X_Q - 8} height={26} fill={`${RED}33`} stroke={RED} strokeWidth={1} />
          <text x={X_NOW + 8} y={162} fontSize={12} fontWeight={700} fill={BLUE}>장기간 비밀</text>
          <text x={X_Q + 8} y={162} fontSize={12} fontWeight={700} fill={RED}>노출 구간</text>
        </g>
      )}
      {active === 3 && (
        <g>
          <circle cx={X_NOW + 40} cy={70} r={6} fill={GRAY} />
          <text x={X_NOW + 40} y={52} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>공개키 노출</text>
          <text x={X_NOW + 40} y={92} textAnchor="middle" fontSize={12} fill={GRAY}>이미 공개</text>
          <line x1={X_NOW + 50} y1={70} x2={X_Q + 74} y2={70} stroke={AMBER} strokeWidth={1.25} strokeDasharray="4 3" />
          <Box x={X_Q + 12} y={100} w={124} h={52} text="새 승인 위조" sub="이 시점 이후" color={RED} />
          <Arrow x1={X_Q + 74} y1={70} x2={X_Q + 74} y2={100} color={RED} />
        </g>
      )}
    </svg>
  );
}

const PATHS = ["인증서", "펌웨어", "복구", "백업"] as const;

function Paths({ active }: { active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Box x={110} y={6} w={140} h={40} text="새 키로 바꿈" color={BLUE} />
      {PATHS.map((name, index) => {
        const x = 8 + index * 87;
        const old = index > 0;
        return (
          <g key={name}>
            <Arrow x1={180} y1={46} x2={x + 39} y2={106} color={old ? RED : BLUE} dashed={old} />
            <Box x={x} y={106} w={78} h={54} text={name} sub={old ? "예전 서명" : "새 서명"} color={old ? RED : BLUE} dashed={old} />
          </g>
        );
      })}
      <text x={W / 2} y={198} textAnchor="middle" fontSize={14} fontWeight={700} fill={RED}>한 경로라도 남으면 전환 미완료</text>
      <text x={W / 2} y={222} textAnchor="middle" fontSize={12} fill={GRAY}>어느 경로가 남는지는 예시입니다</text>
    </svg>
  );
}

export default function HarvestTimelineViz() {
  return (
    <SceneShell
      eyebrow="시간 위의 위험"
      title="지금 복사한 통신은 나중에 풀릴 수 있고, 서명은 새로 위조될 수 있습니다"
      description="가로축이 시간입니다. 계산 능력이 생기는 점선의 위치는 날짜 없는 가정입니다."
      ariaLabel="암호문을 지금 기록해 미래에 푸는 순서와 서명 위조의 방향, 예전 서명이 남은 경로"
      scenes={SCENES}
      render={(active) => (active === 4 ? <Paths active={active} /> : <Timeline active={active} />)}
    />
  );
}
