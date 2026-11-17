import SceneShell from "./SceneShell";

/**
 * 본문 대응: #list-cache — t_refresh = t_listed + TTL, 권한은 tools/call마다 다시 검사.
 * 시각은 모두 가정: t_listed = 0분, TTL = 10분 → t_refresh = 10분.
 * role 변경 4분, 호출 5분.
 */
const T_LISTED = 0;
const TTL = 10;
const T_REFRESH = T_LISTED + TTL;
const T_ROLE = 4;
const T_CALL = 5;
const T_MAX = 12;

const W = 360;
const LEFT = 78;
const RIGHT = 14;
const sx = (t: number) => LEFT + (t / T_MAX) * (W - LEFT - RIGHT);
const LIST_Y = 34;
const POLICY_Y = 84;
const CALL_Y = 134;
const AXIS_Y = 168;

const OK = "#2563eb";
const STALE = "#94a3b8";
const DENY = "#dc2626";

const SCENES = [
  {
    label: "목록 수신",
    summary: "key = tenant · user · role · server revision",
    note: "0분에 tools/list를 받습니다. 이 목록은 받은 사용자의 tenant·user·role과 server revision 조합에 묶인 cache입니다. 다른 조합이 같은 목록을 재사용하지 않습니다.",
  },
  {
    label: "TTL 동안 재사용",
    summary: `t_refresh = ${T_LISTED} + ${TTL} = ${T_REFRESH}분`,
    note: "TTL을 10분으로 가정하면 10분까지는 목록을 다시 받지 않습니다. 이 식이 정하는 것은 목록을 언제 새로 받을지뿐입니다.",
  },
  {
    label: "중간에 role이 바뀌면",
    summary: "목록엔 남아 있어도 5분 호출은 거부",
    note: "4분에 role이 바뀌어 tickets.create 권한이 빠졌고 변경 알림은 오지 않았다고 가정합니다. 목록 cache는 10분까지 유효해 tool이 여전히 보입니다. 5분의 tools/call은 그 시점 policy로 다시 검사돼 거부됩니다. 권한까지 cache했다면 이 호출이 오래된 권한으로 통과합니다.",
  },
  {
    label: "변경 알림이 오면",
    summary: "TTL 전 4분에 목록 무효화",
    note: "Permission change notification이 오면 10분을 기다리지 않고 그때 목록을 무효화하고 새로 받습니다. 그래도 호출마다 하는 authorization 검사는 그대로 남습니다.",
  },
] as const;

export default function ListCacheTimelineViz() {
  return (
    <SceneShell
      eyebrow="Catalog freshness ≠ 권한"
      title="목록 cache의 시계와 호출 권한 검사는 따로 돕니다"
      description="가로축은 분 단위 시각입니다. 0분 수신, TTL 10분, 4분 role 변경, 5분 호출은 모두 예시로 고른 값입니다(가정)."
      ariaLabel="tools/list cache의 TTL 시간선과 tools/call 시점 권한 검사를 분리해 보여 주는 장면"
      scenes={SCENES}
      render={(active) => {
        const notified = active === 3;
        const roleChanged = active >= 2;
        const listEnd = notified ? T_ROLE : T_REFRESH;
        return (
          <svg viewBox={`0 0 ${W} 186`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={LIST_Y + 4} fontSize={10} fontWeight={700} fill="#475569">목록 cache</text>
            <text x={8} y={POLICY_Y + 4} fontSize={10} fontWeight={700} fill="#475569">현재 policy</text>
            <text x={8} y={CALL_Y + 4} fontSize={10} fontWeight={700} fill="#475569">tools/call</text>

            <rect x={sx(T_LISTED)} y={LIST_Y - 9} width={sx(listEnd) - sx(T_LISTED)} height={18} rx={3} fill={OK} opacity={active === 0 ? 0.35 : 0.85} />
            {!notified && active >= 1 && (
              <text x={(sx(T_LISTED) + sx(T_REFRESH)) / 2} y={LIST_Y + 4} fontSize={10} fontWeight={700} textAnchor="middle" fill="#ffffff">TTL {TTL}분 재사용</text>
            )}
            {notified && (
              <>
                <rect x={sx(T_ROLE)} y={LIST_Y - 9} width={sx(T_MAX) - sx(T_ROLE)} height={18} rx={3} fill={OK} opacity={0.35} />
                <text x={sx(T_ROLE) + 6} y={LIST_Y + 4} fontSize={10} fontWeight={700} fill="#1e3a8a">새로 받은 목록</text>
              </>
            )}
            {active >= 1 && !notified && (
              <>
                <line x1={sx(T_REFRESH)} x2={sx(T_REFRESH)} y1={LIST_Y - 16} y2={AXIS_Y} stroke={OK} strokeWidth={1} strokeDasharray="3 3" />
                <text x={sx(T_REFRESH)} y={LIST_Y - 19} fontSize={9} textAnchor="middle" fill={OK}>t_refresh</text>
              </>
            )}

            <rect x={sx(0)} y={POLICY_Y - 9} width={sx(roleChanged ? T_ROLE : T_MAX) - sx(0)} height={18} rx={3} fill={STALE} opacity={0.5} />
            <text x={sx(0) + 6} y={POLICY_Y + 4} fontSize={10} fill="#1e293b">권한 있음</text>
            {roleChanged && (
              <>
                <rect x={sx(T_ROLE)} y={POLICY_Y - 9} width={sx(T_MAX) - sx(T_ROLE)} height={18} rx={3} fill="none" stroke={DENY} strokeWidth={1} strokeDasharray="4 3" />
                <text x={sx(T_ROLE) + 6} y={POLICY_Y + 4} fontSize={10} fill={DENY}>role 변경 · 권한 없음</text>
                <line x1={sx(T_ROLE)} x2={sx(T_ROLE)} y1={notified ? LIST_Y - 9 : POLICY_Y - 14} y2={AXIS_Y} stroke="#64748b" strokeWidth={1} />
                {notified && <text x={sx(T_ROLE) - 4} y={LIST_Y - 13} fontSize={9} textAnchor="end" fill="#64748b">알림 → 무효화</text>}
              </>
            )}

            {roleChanged && (
              <>
                <circle cx={sx(T_CALL)} cy={CALL_Y} r={5} fill={DENY} />
                <line x1={sx(T_CALL)} x2={sx(T_CALL)} y1={CALL_Y - 6} y2={POLICY_Y + 10} stroke={DENY} strokeWidth={1} />
                <text x={sx(T_CALL) + 9} y={CALL_Y + 4} fontSize={10} fontWeight={700} fill={DENY}>호출 시점 검사 → 거부</text>
              </>
            )}
            {!roleChanged && <text x={sx(0)} y={CALL_Y + 4} fontSize={10} fill="#64748b">호출마다 그 시점 policy로 검사</text>}

            <line x1={LEFT} x2={W - RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, T_ROLE, T_CALL, T_REFRESH].map((t) => (
              <text key={t} x={sx(t)} y={AXIS_Y + 13} fontSize={9} textAnchor="middle" fill="#64748b">{t}분</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
