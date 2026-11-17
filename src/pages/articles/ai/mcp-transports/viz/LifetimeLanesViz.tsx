import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lifetimes — request-scoped SSE는 한 request의 여러 response event를 운반하고,
 * stream을 닫아 cancellation 의사를 알릴 수 있지만 이미 생긴 외부 effect는 되돌리지 않는다.
 * Subscription은 request response와 수명을 묶지 않는 별도 장기 channel이다.
 * 세 가로줄 = 세 수명. 가로축은 사건 순서만 뜻하고 간격은 가정이다.
 */
const SCENES = [
  {
    label: "한 request가 여러 event를 받습니다",
    summary: "POST → SSE event들",
    note: "Request-scoped SSE는 POST 한 건에 딸린 stream입니다. 그 request의 response event 여러 개가 이 stream으로 도착합니다.",
  },
  {
    label: "그사이 외부 system에 effect가 생깁니다",
    summary: "effect 생성",
    note: "Server 작업이 진행되면서 외부 system에 effect가 생깁니다. 이 effect는 stream과 다른 줄에 놓입니다.",
  },
  {
    label: "Stream을 닫아 cancel 의사를 알립니다",
    summary: "effect는 남음",
    note: "Client가 stream을 닫으면 cancellation 의사를 알릴 수 있습니다. 그러나 이미 외부 system에 생긴 effect까지 되돌리지는 않습니다. Effect rollback은 별도 contract입니다.",
  },
  {
    label: "Subscription은 따로 이어집니다",
    summary: "별도 장기 channel",
    note: "Resource update를 계속 받는 subscription은 request response와 같은 수명으로 묶지 않습니다. 위 stream이 닫혀도 이 channel의 수명은 따로 관리됩니다.",
  },
] as const;

const NOTES: readonly string[] = SCENES.map((scene) => scene.note);

const ACCENT = "#2563eb";
const BAD = "#dc2626";
const EFFECT = "#d97706";
const SUB = "#16a34a";
const LINE = "#94a3b8";
const MUTED = "#64748b";

const X0 = 24;
const X_END = 344;
const T_POST = 40;
const T_EVENTS = [92, 132] as const;
const T_EFFECT = 160;
const T_CLOSE = 216;

export default function LifetimeLanesViz() {
  return (
    <SceneShell
      eyebrow="세 가지 수명"
      title="Stream을 닫아도 effect와 subscription은 그 줄에 남습니다"
      description="가로줄 하나가 수명 하나입니다. 가로축은 사건의 순서만 보이며, 간격과 subscription의 시작·끝 위치는 설명용 가정입니다."
      ariaLabel="request-scoped SSE, 외부 effect, subscription의 수명을 세 줄의 시간 순서로 비교"
      scenes={SCENES}
      render={(active) => {
        const streamEnd = active >= 2 ? T_CLOSE : 300;
        const subOn = active === 3;
        return (
          <svg viewBox="0 0 360 246" className="mx-auto block h-auto w-full max-w-[28rem]" role="img" aria-label={NOTES[active]}>
            <text x={X0} y={22} fontSize={11} fontWeight={700} fill={ACCENT}>① POST + request-scoped SSE</text>
            <circle cx={T_POST} cy={44} r={5} fill={ACCENT} />
            <text x={T_POST} y={64} textAnchor="middle" fontSize={9.5} fill={MUTED}>POST</text>
            <line x1={T_POST} y1={44} x2={streamEnd} y2={44} stroke={ACCENT} strokeWidth={1.25} strokeDasharray={active >= 2 ? undefined : "4 3"} />
            {T_EVENTS.map((t, i) => (
              <g key={t}>
                <rect x={t - 14} y={36} width={28} height={16} rx={4} className="fill-background" stroke={ACCENT} strokeWidth={1} />
                <text x={t} y={47.5} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={ACCENT}>{`ev${i + 1}`}</text>
              </g>
            ))}
            {active >= 2 && (
              <g>
                <path d={`M${T_CLOSE - 5} 39l10 10M${T_CLOSE + 5} 39l-10 10`} stroke={BAD} strokeWidth={1.25} />
                <text x={T_CLOSE} y={64} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={BAD}>stream close</text>
                <text x={T_CLOSE} y={76} textAnchor="middle" fontSize={9.5} fill={BAD}>cancel 의사를 알릴 수 있음</text>
              </g>
            )}

            <line x1={X0} y1={96} x2={X_END} y2={96} stroke={LINE} strokeWidth={1} />
            <text x={X0} y={114} fontSize={11} fontWeight={700} fill={active >= 1 ? EFFECT : MUTED}>② 외부 system의 effect</text>
            {active >= 1 ? (
              <g>
                <circle cx={T_EFFECT} cy={134} r={5} fill={EFFECT} />
                <line x1={T_EFFECT} y1={134} x2={X_END - 8} y2={134} stroke={EFFECT} strokeWidth={1.25} />
                <path d={`M${X_END} 134l-8 -4v8z`} fill={EFFECT} />
                <text x={T_EFFECT} y={152} textAnchor="middle" fontSize={9.5} fill={MUTED}>effect 생성</text>
                {active >= 2 && <text x={286} y={152} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={EFFECT}>되돌려지지 않음</text>}
              </g>
            ) : (
              <text x={T_EFFECT} y={138} textAnchor="middle" fontSize={9.5} fill={MUTED}>아직 없음</text>
            )}

            <line x1={X0} y1={164} x2={X_END} y2={164} stroke={LINE} strokeWidth={1} />
            <text x={X0} y={182} fontSize={11} fontWeight={700} fill={subOn ? SUB : MUTED}>③ subscription (장기 channel)</text>
            <g opacity={subOn ? 1 : 0.35}>
              <line x1={X0 + 8} y1={202} x2={X_END - 8} y2={202} stroke={subOn ? SUB : LINE} strokeWidth={1.25} />
              <path d={`M${X0} 202l8 -4v8z`} fill={subOn ? SUB : LINE} />
              <path d={`M${X_END} 202l-8 -4v8z`} fill={subOn ? SUB : LINE} />
              {[72, 180, 290].map((t) => (
                <line key={t} x1={t} y1={196} x2={t} y2={208} stroke={subOn ? SUB : LINE} strokeWidth={1} />
              ))}
              <text x={184} y={224} textAnchor="middle" fontSize={9.5} fill={MUTED}>resource update를 계속 받음</text>
              <text x={184} y={238} textAnchor="middle" fontSize={9.5} fill={MUTED}>stream close와 같은 수명으로 묶지 않음</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
