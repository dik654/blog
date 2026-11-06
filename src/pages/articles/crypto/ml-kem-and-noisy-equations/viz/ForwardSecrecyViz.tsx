import SceneShell from "./SceneShell";
import { Arrow } from "./SvgBits";

/**
 * 본문 대응: #limits — 장기 복호 비밀키가 유출되면 저장된 캡슐도 다시 분석할 수 있고,
 * 전방 비밀성은 임시 키 사용과 삭제를 포함한 전체 프로토콜의 성질이다.
 */
const W = 360;
const H = 244;
const X0 = 18;
const X_TALK = 62;
const X_LEAK = 262;
const X1 = 346;
const AXIS = 208;
const Y_LONG = 62;
const Y_TEMP = 150;
const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#64748b";
const FAINT = "#94a3b8";

const SCENES = [
  { label: "캡슐이 남음", summary: "복사본은 지워지지 않음", note: "공개 통신을 지난 캡슐은 누군가 저장해 둘 수 있습니다. 통신이 끝나도 그 복사본은 남습니다." },
  { label: "장기 키 유출", summary: "저장된 캡슐 재분석", note: "같은 복호 비밀키를 오래 쓰다 유출되면, 저장해 둔 지난 캡슐도 그 키로 다시 분석할 수 있습니다." },
  { label: "임시 키 삭제", summary: "유출 시점에 키가 없음", note: "통신마다 임시 키를 쓰고 끝나면 지우면, 나중에 유출될 그 키가 이미 없습니다. 키가 뒤늦게 새도 지난 통신이 지켜지는 이 성질이 전방 비밀성이고, 삭제까지 포함한 전체 프로토콜의 성질입니다." },
] as const;

function Lanes({ active }: { active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Arrow x1={X0} y1={AXIS} x2={X1} y2={AXIS} color={FAINT} />
      <text x={X_TALK} y={AXIS + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>통신</text>
      <line x1={X_TALK} x2={X_TALK} y1={14} y2={AXIS} stroke={FAINT} strokeWidth={1} strokeDasharray="2 3" />
      {active >= 1 && (
        <g>
          <line x1={X_LEAK} x2={X_LEAK} y1={14} y2={AXIS} stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
          <text x={X_LEAK} y={AXIS + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>키 유출</text>
        </g>
      )}

      {active <= 1 ? (
        <g>
          <text x={X0} y={Y_LONG - 30} fontSize={13} fontWeight={700} fill={BLUE}>복호 비밀키</text>
          <rect x={X0} y={Y_LONG - 20} width={(active === 0 ? X1 - 18 : X_LEAK) - X0} height={16} fill={`${BLUE}33`} stroke={BLUE} strokeWidth={1} />
          <text x={X0} y={Y_TEMP - 28} fontSize={13} fontWeight={700} fill={GRAY}>저장된 캡슐</text>
          <circle cx={X_TALK} cy={Y_TEMP - 8} r={6} fill={GRAY} />
          <line x1={X_TALK} x2={X1 - 18} y1={Y_TEMP - 8} y2={Y_TEMP - 8} stroke={GRAY} strokeWidth={1.25} strokeDasharray="5 3" />
          {active === 1 && (
            <g>
              <Arrow x1={X_LEAK} y1={Y_LONG} x2={X_LEAK} y2={Y_TEMP - 16} color={RED} />
              <text x={X_LEAK - 8} y={(Y_LONG + Y_TEMP) / 2 - 2} textAnchor="end" fontSize={13} fontWeight={700} fill={RED}>지난 캡슐 재분석</text>
            </g>
          )}
        </g>
      ) : (
        <g>
          <text x={X0} y={Y_LONG - 30} fontSize={13} fontWeight={700} fill={BLUE}>임시 키</text>
          <rect x={X_TALK - 22} y={Y_LONG - 20} width={60} height={16} fill={`${BLUE}33`} stroke={BLUE} strokeWidth={1} />
          <text x={X_TALK + 46} y={Y_LONG - 7} fontSize={13} fontWeight={700} fill={BLUE}>사용 후 삭제</text>
          <rect x={X_TALK + 38} y={Y_LONG - 20 + 28} width={X_LEAK - X_TALK - 38} height={16} fill="none" stroke={FAINT} strokeWidth={1} strokeDasharray="3 3" />
          <text x={(X_TALK + 38 + X_LEAK) / 2} y={Y_LONG + 20} textAnchor="middle" fontSize={12} fill={GRAY}>키가 남아 있지 않음</text>
          <text x={X0} y={Y_TEMP - 28} fontSize={13} fontWeight={700} fill={GRAY}>저장된 캡슐</text>
          <circle cx={X_TALK} cy={Y_TEMP - 8} r={6} fill={GRAY} />
          <line x1={X_TALK} x2={X1 - 18} y1={Y_TEMP - 8} y2={Y_TEMP - 8} stroke={GRAY} strokeWidth={1.25} strokeDasharray="5 3" />
          <text x={X_LEAK - 8} y={Y_TEMP + 16} textAnchor="end" fontSize={13} fontWeight={700} fill={GRAY}>이 캡슐을 풀 키가 유출본에 없음</text>
        </g>
      )}
    </svg>
  );
}

export default function ForwardSecrecyViz() {
  return (
    <SceneShell
      eyebrow="시간 위의 키"
      title="키를 언제까지 보관하는지가 지난 통신의 안전을 가릅니다"
      description="가로축이 시간입니다. 위 줄은 복호 키가 살아 있는 기간, 아래 줄은 저장해 둔 캡슐입니다."
      ariaLabel="장기 복호 키가 유출되면 저장된 캡슐을 재분석할 수 있고 임시 키를 삭제하면 그 키가 남지 않는 비교"
      scenes={SCENES}
      render={(active) => <Lanes active={active} />}
    />
  );
}
