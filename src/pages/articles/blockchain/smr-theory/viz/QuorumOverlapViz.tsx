import SceneShell from "./SceneShell";

/**
 * 본문 대응: #log-replication 의 quorum 식. n=5 → q=floor(5/2)+1=3, 두 quorum 교집합 ≥ 2·3−5 = 1.
 * 2개가 멈춰도 3개 남아 q를 채움. 분할 배치 {R1,R2}|{R3,R4}|{R5}는 어느 쪽도 3에 못 미치는 가정 사례입니다.
 */
const N = 5;
const Q = Math.floor(N / 2) + 1;

type Status = "up" | "down";
interface SceneData {
  label: string;
  summary: string;
  note: string;
  status: readonly Status[];
  q1: readonly number[];
  q2: readonly number[];
  groups: readonly (readonly number[])[];
}

const ALL_UP: readonly Status[] = ["up", "up", "up", "up", "up"];

const SCENES: readonly SceneData[] = [
  { label: "절반을 넘는 최소 수", summary: `n=5 → q=2+1=${Q}`, note: "5의 절반은 2.5입니다. 내림한 2에 1을 더한 3개가 모이면 과반입니다. 3개가 vote나 ACK를 주면 election·replication이 진행됩니다.", status: ALL_UP, q1: [0, 1, 2], q2: [], groups: [] },
  { label: "두 quorum은 반드시 겹칩니다", summary: "3 + 3 − 5 = 1", note: "Q₁={R1,R2,R3}과 Q₂={R3,R4,R5}는 R3을 공유합니다. 3개짜리 둘을 5칸에 겹치지 않게 놓으려면 6칸이 필요하므로, 어떻게 골라도 최소 1개가 겹칩니다.", status: ALL_UP, q1: [0, 1, 2], q2: [2, 3, 4], groups: [] },
  { label: "2개가 멈춰도", summary: "남은 3개 = q", note: "R4와 R5가 crash해도(가정) R1–R3 세 개가 q=3을 채웁니다. 그래서 n=2f+1=5는 f=2개 crash를 견딥니다.", status: ["up", "up", "up", "down", "down"], q1: [0, 1, 2], q2: [], groups: [] },
  { label: "모두 살아 있어도 멈출 수 있음", summary: "2 | 2 | 1 → 어느 쪽도 3 미만", note: "Network가 {R1,R2}, {R3,R4}, {R5}로 나뉘었다고 둡니다(가정). 다섯 개 모두 살아 있지만 어느 묶음도 3을 채우지 못해 진행(liveness)이 멈춥니다. 교집합 하나만으로 safety가 끝나지도 않으며 Raft election restriction이 따로 필요합니다.", status: ALL_UP, q1: [], q2: [], groups: [[0, 1], [2, 3], [4]] },
];

const W = 360;
const H = 170;
const CY = 85;
const cx = (i: number) => 44 + i * 68;
const R = 20;

function Bracket({ members, y, label, color, above }: { members: readonly number[]; y: number; label: string; color: string; above: boolean }) {
  if (!members.length) return null;
  const x1 = cx(members[0]) - R - 4;
  const x2 = cx(members[members.length - 1]) + R + 4;
  const tick = above ? 6 : -6;
  return (
    <g>
      <path d={`M ${x1} ${y + tick} L ${x1} ${y} L ${x2} ${y} L ${x2} ${y + tick}`} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={(x1 + x2) / 2} y={above ? y - 6 : y + 15} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function QuorumOverlapViz() {
  return (
    <SceneShell
      eyebrow="Majority quorum"
      title="다섯 개 중 세 개씩 고르면 어떤 두 묶음도 한 개 이상 겹칩니다"
      description="원 하나가 voting replica 하나입니다. Quorum은 결정을 내리는 데 필요한 최소 replica 묶음이고, 여기서는 과반입니다."
      ariaLabel="replica 5개에서 크기 3인 quorum 두 개의 겹침과 crash, network 분할"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Bracket members={scene.q1} y={36} label="Q₁" color="#2563eb" above />
            <Bracket members={scene.q2} y={134} label="Q₂" color="#d97706" above={false} />
            {scene.groups.map((group) => (
              <rect key={group[0]} x={cx(group[0]) - R - 8} y={CY - R - 10} width={cx(group[group.length - 1]) - cx(group[0]) + 2 * R + 16} height={2 * R + 20} rx={10} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
            ))}
            {scene.status.map((status, i) => {
              const down = status === "down";
              const inBoth = scene.q1.includes(i) && scene.q2.includes(i);
              return (
                <g key={i}>
                  <circle cx={cx(i)} cy={CY} r={R} fill={inBoth ? "#2563eb" : down ? "none" : "#ffffff"} stroke={down ? "#94a3b8" : "#334155"} strokeWidth={1} strokeDasharray={down ? "3 3" : undefined} />
                  <text x={cx(i)} y={CY + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={inBoth ? "#ffffff" : down ? "#94a3b8" : "#0f172a"}>R{i + 1}</text>
                  {down && <text x={cx(i)} y={CY + R + 16} textAnchor="middle" fontSize={11} fill="#64748b">crash</text>}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
