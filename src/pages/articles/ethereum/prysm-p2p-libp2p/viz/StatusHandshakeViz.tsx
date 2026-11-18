import SceneShell from "./SceneShell";

/**
 * 본문 대응: #connection-gating — outbound와 inbound에서 누가 먼저 Status를 보내고,
 * 무엇을 대조하며, inbound가 10초 안에 chain state를 남기지 않으면 Goodbye로 닫히는가.
 * 세로축은 시간 순서다. inbound 성공 장면의 request 시점은 10초 창 안의 한 예다(가정).
 */
const W = 360;
const H = 252;
const US = 72;
const PEER = 288;
const WIN_TOP = 84;
const WIN_BOTTOM = 196;

type Kind = "out-ok" | "out-bad" | "in-ok" | "in-timeout";

const SCENES: readonly { label: string; summary: string; note: string; kind: Kind }[] = [
  {
    label: "Outbound · 일치",
    summary: "우리가 먼저 묻고, 맞으면 Connected",
    note: "우리가 N42에 먼저 건 연결에서는 Prysm이 Status request를 보냅니다. 응답을 decode해 fork digest, 지나치게 미래인 head slot, finalized epoch와 root를 local chain과 비교하고, 이 검사가 성공한 뒤에야 Connecting을 Connected로 올립니다.",
    kind: "out-ok",
  },
  {
    label: "Outbound · 불일치",
    summary: "wrong fork · 모순된 finalized root → terminal",
    note: "Noise로 PeerId가 확인됐어도 Status가 wrong fork나 local finalized chain과 모순되는 root를 보내면 대화할 수 없는 상대입니다. 점수 평균이 좋아질 때까지 기다리지 않고 terminal 오류로 다루며, Connected로 올리지 않습니다.",
    kind: "out-bad",
  },
  {
    label: "Inbound · Status 도착",
    summary: "상대가 먼저 묻는 쪽",
    note: "N42가 먼저 건 연결에서는 N42가 Status request를 시작해야 합니다. 10초 창 안에 chain state가 기록되면 Goodbye 조건에 걸리지 않습니다. 그림의 request 시점은 창 안의 한 예입니다(가정).",
    kind: "in-ok",
  },
  {
    label: "Inbound · 10초 무소식",
    summary: "chain state 없음 → Goodbye, 연결 닫힘",
    note: "현재 Prysm source는 최대 10초를 기다린 뒤 chain state가 기록되지 않았거나 갱신되지 않았으면 Goodbye와 함께 연결을 닫습니다. 질문 내용은 outbound와 같고, 먼저 질문하는 쪽만 다릅니다.",
    kind: "in-timeout",
  },
];

function Arrow({ y, from, to, label, color = "#334155" }: { y: number; from: number; to: number; label: string; color?: string }) {
  const dir = to > from ? 1 : -1;
  return (
    <g>
      <line x1={from} x2={to - dir * 6} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M ${to} ${y} L ${to - dir * 7} ${y - 4} L ${to - dir * 7} ${y + 4} Z`} fill={color} />
      <text x={(from + to) / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function StatusHandshakeViz() {
  return (
    <SceneShell
      eyebrow="Status 교환 순서"
      title="누가 먼저 거느냐에 따라 Status를 먼저 묻는 쪽이 바뀝니다"
      description="왼쪽 세로선이 우리 Prysm 노드, 오른쪽이 후보 N42이며 아래로 갈수록 나중입니다. 맨 위 띠는 두 방향 모두 Status 전에 끝나 있는 libp2p 연결 단계입니다. Status는 fork digest·finalized checkpoint·head를 교환하는 Ethereum RPC입니다."
      note="10초와 대조 항목은 Prysm v7.3.1 source 기준 본문 설명을 따릅니다. 앞단 connection gater의 IP별 속도·peer 수 제한은 이 그림에 넣지 않았습니다."
      ariaLabel="outbound와 inbound 연결에서 Status 교환 순서와 실패 처리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const outbound = scene.kind === "out-ok" || scene.kind === "out-bad";
        const ok = scene.kind === "out-ok" || scene.kind === "in-ok";
        const resultText =
          scene.kind === "out-ok"
            ? "Connecting → Connected"
            : scene.kind === "out-bad"
              ? "terminal 오류 · Connected 아님"
              : scene.kind === "in-ok"
                ? "chain state 기록 · Goodbye 없음"
                : "Goodbye · 연결 닫힘";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={US} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">Prysm (우리)</text>
            <text x={PEER} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">N42</text>
            <text x={W / 2} y={16} textAnchor="middle" fontSize={10} fill="#64748b">{outbound ? "outbound: 우리가 dial" : "inbound: N42가 dial"}</text>
            <line x1={US} x2={US} y1={24} y2={H - 30} stroke="#94a3b8" strokeWidth={1} />
            <line x1={PEER} x2={PEER} y1={24} y2={H - 30} stroke="#94a3b8" strokeWidth={1} />
            <rect x={US - 30} y={32} width={PEER - US + 60} height={30} rx={6} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1} />
            <text x={W / 2} y={46} textAnchor="middle" fontSize={10} fill="#334155">TCP/QUIC · Noise로 PeerId 확인 · muxer</text>
            <text x={W / 2} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">{outbound ? "상태: Connecting" : "Status 전 단계"}</text>

            {outbound ? (
              <g>
                <Arrow y={100} from={US} to={PEER} label="Status request" color="#2563eb" />
                <Arrow y={134} from={PEER} to={US} label="Status 응답" />
                <rect x={US - 30} y={146} width={PEER - US + 60} height={52} rx={6} fill="#ffffff" stroke={ok ? "#16a34a" : "#dc2626"} strokeWidth={1.25} />
                <text x={W / 2} y={161} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">Prysm이 local chain과 대조</text>
                <text x={W / 2} y={176} textAnchor="middle" fontSize={10} fill="#334155">fork digest · 지나치게 미래인 head slot</text>
                <text x={W / 2} y={190} textAnchor="middle" fontSize={10} fill="#334155">finalized epoch · finalized root</text>
                <text x={W / 2} y={214} textAnchor="middle" fontSize={11} fontWeight={700} fill={ok ? "#15803d" : "#b91c1c"}>{ok ? "모두 맞음 ✓" : "wrong fork 또는 root 모순 ✕"}</text>
              </g>
            ) : (
              <g>
                <line x1={US - 18} x2={US - 18} y1={WIN_TOP} y2={WIN_BOTTOM} stroke="#d97706" strokeWidth={1.25} />
                <line x1={US - 22} x2={US - 14} y1={WIN_TOP} y2={WIN_TOP} stroke="#d97706" strokeWidth={1.25} />
                <line x1={US - 22} x2={US - 14} y1={WIN_BOTTOM} y2={WIN_BOTTOM} stroke="#d97706" strokeWidth={1.25} />
                <text x={US - 24} y={WIN_TOP + 4} textAnchor="end" fontSize={10} fill="#b45309">0초</text>
                <text x={US - 24} y={WIN_BOTTOM + 4} textAnchor="end" fontSize={10} fill="#b45309">10초</text>
                {scene.kind === "in-ok" ? (
                  <g>
                    <Arrow y={128} from={PEER} to={US} label="Status request (시점 가정)" color="#2563eb" />
                    <text x={US + 8} y={160} fontSize={10} fill="#15803d">chain state 기록 ✓</text>
                    <text x={US + 8} y={176} fontSize={10} fill="#64748b">확인하는 항목은 outbound와 같음</text>
                  </g>
                ) : (
                  <g>
                    <text x={W / 2} y={140} textAnchor="middle" fontSize={10} fill="#64748b">10초 동안 Status request 없음</text>
                    <Arrow y={212} from={US} to={PEER} label="Goodbye" color="#dc2626" />
                  </g>
                )}
              </g>
            )}

            <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={ok ? "#15803d" : "#b91c1c"}>
              결과: {resultText}
            </text>
          </svg>
        );
      }}
    />
  );
}
