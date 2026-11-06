import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #conntrack — 16 GiB 노드 기본값 nf_conntrack_max 262,144(RAM ÷ 16384 = 1,048,576을 262,144로 자름).
 * FIN 없이 끊기는 연결 초당 100개: 항목이 빠지지 않아 262,144 ÷ 100 = 2,621초 ≈ 44분에 가득 찬다.
 * 정상 종료: TIME_WAIT 120초 뒤 사라져 100 × 120 = 12,000 안팎에 머문다.
 */
const W = 360;
const H = 190;
const X0 = 16;
const X1 = 348;
const Y0 = 160;
const Y1 = 34;
const MAX = 262144;
const FILL_S = MAX / 100;
const END_S = 3600;
const STEADY = 12000;
const x = (s: number) => X0 + ((X1 - X0) * s) / END_S;
const y = (n: number) => Y0 - ((Y0 - Y1) * n) / MAX;

const SCENES: readonly ShellScene[] = [
  { label: "빠지지 않는 항목", summary: "초당 +100 · 수명 5일", note: "FIN이나 RST 없이 사라진 연결의 항목은 ESTABLISHED로 432,000초(5일) 남습니다. 60분 안에는 하나도 빠지지 않아 그래프가 곧게 오릅니다." },
  { label: "상한에 닿음", summary: "262,144 ÷ 100 = 2,621초 ≈ 44분", note: "16 GiB 노드의 계산값 1,048,576은 262,144로 잘립니다. 약 44분 뒤부터 새 연결의 첫 패킷이 버려지기 시작합니다. 기존 연결은 멀쩡합니다." },
  { label: "정상 종료였다면", summary: "100 × 120초 = 12,000개", note: "같은 초당 100개라도 FIN으로 닫히면 TIME_WAIT 120초 뒤 사라져 12,000개 안팎에 머뭅니다. 문제는 양이 아니라 수명입니다." },
];

export default function ConntrackFillViz() {
  return (
    <SceneShell
      eyebrow="nf_conntrack_max"
      title="같은 초당 100개인데, 수명이 표를 채울지 말지를 가릅니다"
      description="가로축은 60분, 세로축은 표의 항목 수입니다. 다른 연결이 없고 지울 만료 항목도 없다고 가정한 계산입니다."
      note="gc 워커가 95% 이상 찼을 때 만료 항목을 미리 지우므로 실제로는 조금 더 버팁니다. kube-proxy가 도는 노드는 상한과 timeout을 바꾸므로 이 계산보다 오래 버틸 수 있습니다."
      ariaLabel="conntrack 표의 항목 수가 시간에 따라 늘어나는 그래프"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={X0} x2={X1} y1={y(MAX)} y2={y(MAX)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
          <text x={X0} y={y(MAX) - 7} fontSize={12} fontWeight={700} fill="#dc2626">상한 262,144</text>
          <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
          {[0, 15, 30, 45, 60].map((minute) => (
            <g key={minute}>
              <line x1={x(minute * 60)} x2={x(minute * 60)} y1={Y0} y2={Y0 + 4} stroke="#94a3b8" strokeWidth={1} />
              <text x={x(minute * 60)} y={Y0 + 18} textAnchor={minute === 0 ? "start" : minute === 60 ? "end" : "middle"} fontSize={12} fill="#64748b">{minute === 60 ? "60분" : minute}</text>
            </g>
          ))}
          <path d={`M${x(0)},${y(0)} L${x(FILL_S)},${y(MAX)}`} fill="none" stroke="#2563eb" strokeWidth={1.25} opacity={active === 2 ? 0.35 : 1} />
          {active >= 1 && (
            <>
              <path d={`M${x(FILL_S)},${y(MAX)} L${x(END_S)},${y(MAX)}`} fill="none" stroke="#2563eb" strokeWidth={1.25} opacity={active === 2 ? 0.35 : 1} />
              <circle cx={x(FILL_S)} cy={y(MAX)} r={3.5} fill="#dc2626" />
              <text x={x(FILL_S) + 6} y={y(MAX) + 18} fontSize={12} fontWeight={700} fill="#dc2626">약 44분</text>
            </>
          )}
          {active === 2 && (
            <>
              <path d={`M${x(0)},${y(0)} L${x(120)},${y(STEADY)} L${x(END_S)},${y(STEADY)}`} fill="none" stroke="#b45309" strokeWidth={1.25} />
              <text x={X1} y={y(STEADY) - 6} textAnchor="end" fontSize={12} fontWeight={700} fill="#b45309">정상 종료 12,000개</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
