import SceneShell from "./SceneShell";

/**
 * 본문 대응: #detect-enforce-observe 첫 문단 — IDS는 signal, IPS는 inline에서 drop·reset·rate limit.
 * Alert ≠ incident, IPS action ≠ 공격 전체 차단. bypass·fail-open/fail-closed를 기록한다.
 * "IDS alert지만 IPS bypass path 사용"은 release 표의 행이다. IDS를 경로 옆에 둔 배치는 그림의 가정이다.
 */
const SCENES = [
  {
    label: "IDS는 보고 신호를 냅니다",
    summary: "alert · 트래픽은 그대로 흐름",
    note: "IDS는 packet·flow·host telemetry를 보고 signature나 anomaly에 맞으면 signal(alert)을 냅니다. 흐름을 멈추지는 않습니다. Alert가 떴다는 것이 곧 incident라는 뜻도 아닙니다.",
  },
  {
    label: "IPS는 경로 안에서 action을 실행합니다",
    summary: "inline · drop·reset·rate limit",
    note: "IPS는 트래픽이 반드시 지나는 inline 위치에 있어서 drop(버림)·reset(연결 끊음)·rate limit(속도 제한) 같은 action을 실행할 수 있습니다. 그래도 action 하나가 공격 전체를 막았다는 뜻은 아닙니다.",
  },
  {
    label: "IPS를 비켜 가는 길이 있으면",
    summary: "alert는 떴지만 차단은 0",
    note: "packet이 IPS를 거치지 않는 bypass path로 가면 IDS alert는 남아도 막힌 것은 없습니다. 실제 packet path와 enforcement receipt(차단 장비가 action을 실행했다는 기록)를 확인하고, 이 길을 coverage gap으로 표시합니다.",
  },
  {
    label: "IPS가 멈추면 둘 중 하나",
    summary: "fail-open 또는 fail-closed",
    note: "Fail-open은 장비가 멈춰도 트래픽을 검사 없이 통과시키는 모드이고, fail-closed는 장비와 함께 트래픽도 멈추는 모드입니다. 어느 쪽인지를 sensor coverage·packet loss와 함께 기록합니다.",
  },
] as const;

const INK = "#475569";
const MUTED = "#94a3b8";
const FLOW = "#2563eb";
const ALERT = "#d97706";
const BAD = "#dc2626";

const PATH_Y = 104;
const IPS_X = 160;
const IPS_W = 64;

export default function SignalActionViz() {
  return (
    <SceneShell
      eyebrow="Signal과 action"
      title="신호를 낸 것과 막은 것은 다른 기록입니다"
      description="파란 선이 트래픽이 가는 길, 경로 위 상자가 IPS, 경로 옆 상자가 IDS입니다."
      note="IDS를 경로 옆에 둔 배치는 ‘신호만 낸다’를 보이려는 그림의 가정입니다. bypass 사례는 이 글 release 표의 ‘IDS alert지만 IPS bypass path 사용’ 행입니다."
      ariaLabel="IDS의 신호, IPS의 inline 차단, bypass path, fail-open과 fail-closed"
      scenes={SCENES}
      render={(active) => {
        const bypass = active === 2;
        const failed = active === 3;
        const acted = active === 1;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={16} y={PATH_Y - 10} fontSize={12} fill={INK}>트래픽</text>
            <text x={344} y={PATH_Y - 10} fontSize={12} fill={INK} textAnchor="end">서버</text>

            {/* 주 경로. bypass 장면에서는 갈라지는 지점(130)까지와 다시 합류한 지점(260) 뒤만 실제 트래픽이 지난다. */}
            <line x1={16} y1={PATH_Y} x2={bypass ? 130 : IPS_X} y2={PATH_Y} stroke={FLOW} strokeWidth={1.25} />
            {bypass && <line x1={130} y1={PATH_Y} x2={IPS_X} y2={PATH_Y} stroke={MUTED} strokeWidth={1} />}
            {bypass && <line x1={IPS_X + IPS_W} y1={PATH_Y} x2={260} y2={PATH_Y} stroke={MUTED} strokeWidth={1} />}
            {/* action 장면에서는 IPS 뒤 구간을 흐리게 해 action이 걸린 트래픽이 그대로 가지 않음을 보인다. */}
            {!failed && (
              <line
                x1={bypass ? 260 : IPS_X + IPS_W}
                y1={PATH_Y}
                x2={338}
                y2={PATH_Y}
                stroke={acted ? MUTED : FLOW}
                strokeWidth={acted ? 1 : 1.25}
                strokeDasharray={acted ? "3 3" : undefined}
              />
            )}
            {!failed && <polygon points={`344,${PATH_Y} 337,${PATH_Y - 4} 337,${PATH_Y + 4}`} fill={acted ? MUTED : FLOW} />}

            {/* IDS: 경로 옆 */}
            <line x1={96} y1={PATH_Y} x2={96} y2={52} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
            <rect x={64} y={22} width={64} height={30} rx={6} fill={active === 0 || bypass ? ALERT : MUTED} fillOpacity={0.12} stroke={active === 0 || bypass ? ALERT : MUTED} strokeWidth={1} />
            <text x={96} y={41} fontSize={12.5} fontWeight={700} fill={INK} textAnchor="middle">IDS</text>
            <text x={106} y={78} fontSize={11} fill={MUTED}>관측</text>
            {(active === 0 || bypass) && (
              <g>
                <rect x={136} y={24} width={44} height={22} rx={4} fill={ALERT} fillOpacity={0.15} stroke={ALERT} strokeWidth={1} />
                <text x={158} y={39} fontSize={12} fontWeight={700} fill={ALERT} textAnchor="middle">alert</text>
              </g>
            )}

            {/* IPS: 경로 안 */}
            <rect
              x={IPS_X}
              y={PATH_Y - 18}
              width={IPS_W}
              height={36}
              rx={6}
              fill={active === 1 ? BAD : MUTED}
              fillOpacity={active === 1 ? 0.12 : 0.08}
              stroke={active === 1 ? BAD : failed ? MUTED : INK}
              strokeWidth={1}
              strokeDasharray={failed ? "3 3" : undefined}
            />
            <text x={IPS_X + IPS_W / 2} y={PATH_Y + 4} fontSize={12.5} fontWeight={700} fill={failed ? MUTED : INK} textAnchor="middle">
              {failed ? "IPS 멈춤" : "IPS"}
            </text>
            <text x={IPS_X + IPS_W / 2} y={PATH_Y - 24} fontSize={11} fill={MUTED} textAnchor="middle">inline</text>

            {active === 1 && (
              <g>
                <text x={IPS_X + IPS_W / 2} y={PATH_Y + 34} fontSize={12} fontWeight={700} fill={BAD} textAnchor="middle">
                  drop · reset · rate limit
                </text>
                <text x={IPS_X + IPS_W + 8} y={PATH_Y - 6} fontSize={13} fontWeight={700} fill={BAD}>✕</text>
              </g>
            )}

            {bypass && (
              <g>
                <path d={`M 130 ${PATH_Y} L 130 156 L 260 156 L 260 ${PATH_Y}`} fill="none" stroke={FLOW} strokeWidth={1.25} />
                <polygon points={`260,${PATH_Y + 2} 256,${PATH_Y + 10} 264,${PATH_Y + 10}`} fill={FLOW} />
                <text x={195} y={172} fontSize={12} fontWeight={700} fill={FLOW} textAnchor="middle">bypass path · IPS를 거치지 않음</text>
                <text x={IPS_X + IPS_W / 2} y={PATH_Y + 34} fontSize={11.5} fill={MUTED} textAnchor="middle">action 없음</text>
                <text x={16} y={192} fontSize={11.5} fontWeight={700} fill={BAD}>signal ≠ block · coverage gap</text>
              </g>
            )}

            {failed && (
              <g>
                {/* fail-open: 검사 없이 서버까지 이어짐 */}
                <line x1={IPS_X + IPS_W} y1={PATH_Y} x2={338} y2={PATH_Y} stroke={FLOW} strokeWidth={1.25} strokeDasharray="5 3" />
                <polygon points={`344,${PATH_Y} 337,${PATH_Y - 4} 337,${PATH_Y + 4}`} fill={FLOW} />
                <text x={248} y={PATH_Y + 18} fontSize={11.5} fontWeight={700} fill={FLOW}>fail-open</text>
                <text x={248} y={PATH_Y + 31} fontSize={11} fill={INK}>검사 없이 서버까지</text>
                {/* fail-closed: IPS 앞에서 끊김 */}
                <line x1={IPS_X - 14} y1={PATH_Y - 9} x2={IPS_X - 14} y2={PATH_Y + 9} stroke={BAD} strokeWidth={1.25} />
                <text x={IPS_X - 14} y={PATH_Y + 30} fontSize={11.5} fontWeight={700} fill={BAD} textAnchor="middle">fail-closed</text>
                <text x={IPS_X - 14} y={PATH_Y + 43} fontSize={11} fill={INK} textAnchor="middle">여기서 멈춤</text>
                <text x={16} y={192} fontSize={11.5} fill={INK}>설정에 따라 둘 중 하나만 일어남</text>
              </g>
            )}

            {active === 0 && (
              <text x={16} y={192} fontSize={11.5} fill={INK}>alert가 떠도 흐름은 그대로 · alert ≠ incident</text>
            )}
            {active === 1 && (
              <text x={16} y={192} fontSize={11.5} fill={INK}>action 하나 ≠ 공격 전체를 막음</text>
            )}
          </svg>
        );
      }}
    />
  );
}
