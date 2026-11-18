import SceneShell from "./SceneShell";

/**
 * 본문 대응: #key-management "Timeout 뒤 root를 바꾸어 재시도하면 왜 위험할까요?"
 * RA 응답만 잃어도 remote signer에는 σA가 남을 수 있다. 다른 head의 RB로 재시도하면 서명이 둘,
 * 같은 root를 stable digest로 조회하거나 idempotent 재요청이면 서명은 하나로 남는다.
 */
const W = 360;
const H = 204;
const PX = 64;
const SX = 250;
const TOP = 30;
const BOTTOM = 170;

type Step = "ask" | "lost" | "retryRB" | "retryRA";

const SCENES: readonly { label: string; summary: string; steps: readonly Step[]; sigs: readonly string[]; note: string }[] = [
  {
    label: "RA 요청",
    summary: "Prysm → remote signer: Sign(RA)",
    steps: ["ask"],
    sigs: [],
    note: "V37의 slot 100 attester duty에 대해 Prysm이 RA의 서명을 remote signer에 요청합니다.",
  },
  {
    label: "응답만 유실",
    summary: "signer에는 σA · Prysm에는 timeout",
    steps: ["ask", "lost"],
    sigs: ["σA"],
    note: "Signer는 σA를 만들었지만 응답이 사라져 Prysm은 timeout만 봅니다. 응답을 못 받았다는 것은 서명하지 않았다는 증거가 아닙니다.",
  },
  {
    label: "RB 재시도",
    summary: "같은 duty에 σA와 σB가 남을 수 있음",
    steps: ["ask", "lost", "retryRB"],
    sigs: ["σA", "σB"],
    note: "같은 duty에 다른 head로 만든 RB를 보내면 signer 쪽에 σA와 σB 두 signature가 존재할 수 있습니다.",
  },
  {
    label: "RA 재조회",
    summary: "stable digest 또는 idempotent → 서명 1개",
    steps: ["ask", "lost", "retryRA"],
    sigs: ["σA"],
    note: "Stable request digest로 같은 root의 기존 결과를 조회하거나 signer가 같은 root 재요청을 idempotent하게 처리하면 기존 σA만 돌아옵니다.",
  },
];

function Arrow({ y, toRight, color, label, broken = false }: { y: number; toRight: boolean; color: string; label: string; broken?: boolean }) {
  const from = toRight ? PX : SX;
  const to = toRight ? SX : PX;
  const end = broken ? (from + to) / 2 : to;
  const dir = toRight ? 1 : -1;
  return (
    <g>
      <line x1={from} x2={end - dir * 6} y1={y} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={broken ? "4 3" : undefined} />
      {broken ? (
        <g>
          <line x1={end - 5} x2={end + 5} y1={y - 5} y2={y + 5} stroke={color} strokeWidth={1.25} />
          <line x1={end - 5} x2={end + 5} y1={y + 5} y2={y - 5} stroke={color} strokeWidth={1.25} />
        </g>
      ) : (
        <path d={`M${end - dir * 6} ${y - 4} L${end} ${y} L${end - dir * 6} ${y + 4} Z`} fill={color} />
      )}
      <text x={broken ? (end + from) / 2 : (PX + SX) / 2} y={y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function TimeoutRetryViz() {
  return (
    <SceneShell
      eyebrow="Remote signer timeout"
      title="응답을 잃은 뒤 root를 바꿔 재시도하면 같은 duty에 서명이 둘 생길 수 있습니다"
      description="왼쪽 세로선은 Prysm, 가운데는 remote signer이며 시간은 아래로 흐릅니다. 오른쪽 칸은 signer에 남은 signature입니다."
      note="V37·slot 100·RA·RB는 본문의 설명용 예입니다. 3·4장면은 같은 timeout 뒤의 두 갈래입니다."
      ariaLabel="Remote signer 응답 유실 뒤 다른 root로 재시도할 때와 같은 root로 조회할 때의 signature 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const has = (step: Step) => scene.steps.includes(step);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={PX} y={16} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">
              Prysm
            </text>
            <text x={SX} y={16} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">
              remote signer
            </text>
            <line x1={PX} x2={PX} y1={TOP - 6} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={SX} x2={SX} y1={TOP - 6} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            {has("ask") && <Arrow y={48} toRight color="#2563eb" label="Sign(RA)" />}
            {has("lost") && (
              <g>
                <Arrow y={84} toRight={false} color="#dc2626" label="σA 응답 유실" broken />
                <text x={PX - 6} y={88} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">
                  timeout
                </text>
              </g>
            )}
            {has("retryRB") && <Arrow y={134} toRight color="#dc2626" label="Sign(RB) · 다른 head" />}
            {has("retryRA") && (
              <g>
                <Arrow y={126} toRight color="#2563eb" label="같은 RA · stable digest" />
                <Arrow y={156} toRight={false} color="#2563eb" label="기존 σA" />
              </g>
            )}
            <rect x={296} y={TOP} width={58} height={BOTTOM - TOP} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={325} y={TOP + 14} textAnchor="middle" fontSize={10.5} fill="#64748b">
              남은 서명
            </text>
            {scene.sigs.map((sig, index) => (
              <g key={sig}>
                <rect x={304} y={TOP + 24 + index * 30} width={42} height={22} rx={5} fill="none" stroke={scene.sigs.length > 1 ? "#dc2626" : "#2563eb"} strokeWidth={1.25} />
                <text x={325} y={TOP + 39 + index * 30} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.sigs.length > 1 ? "#dc2626" : "#2563eb"}>
                  {sig}
                </text>
              </g>
            ))}
            <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.sigs.length > 1 ? "#dc2626" : "#64748b"}>
              {scene.sigs.length === 0 ? "아직 서명 없음" : scene.sigs.length > 1 ? "같은 duty에 signature 2개가 있을 수 있음" : "이 duty의 signature 1개"}
            </text>
          </svg>
        );
      }}
    />
  );
}
