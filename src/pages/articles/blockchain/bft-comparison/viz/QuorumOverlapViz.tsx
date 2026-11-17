import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 정족수 교집합 식과 그 interpretation.
 * n=4, f=1. q=3이면 |Q1∩Q2| ≥ 2·3−4 = 2, q=2이면 2·2−4 = 0이라 {A,B}와 {C,D}가 겹치지 않는다.
 * 어느 복제본이 Byzantine인지(B)와 어떤 세 명이 서명했는지는 설명용 가정이다.
 */
const IDS = ["A", "B", "C", "D"] as const;

const SCENES = [
  {
    label: "q=3 · 두 정족수",
    summary: "최소 3 + 3 − 4 = 2명이 겹침",
    q1: [0, 1, 2],
    q2: [1, 2, 3],
    byz: -1,
    note: "네 대 중 세 명씩 고르면 두 집합을 합친 6자리가 네 대에 들어가야 하므로 적어도 2자리는 같은 복제본입니다. 여기서는 Q1={A,B,C}, Q2={B,C,D}로 둡니다(가정).",
  },
  {
    label: "Byzantine 한 대",
    summary: "겹친 2명 − 최대 1 = 정상 1명 이상",
    q1: [0, 1, 2],
    q2: [1, 2, 3],
    byz: 1,
    note: "B가 Byzantine이라고 해도(가정) 겹친 B·C 가운데 C는 정상입니다. 다만 교집합 산술만으로는 부족하고, C 같은 정상 복제본이 각 프로토콜의 lock·vote 규칙을 지킨다는 조건이 함께 있어야 충돌하는 결정을 막습니다.",
  },
  {
    label: "q=2로 낮추면",
    summary: "최소 2 + 2 − 4 = 0명 · 안 겹칠 수 있음",
    q1: [0, 1],
    q2: [2, 3],
    byz: -1,
    note: "{A,B}와 {C,D}처럼 한 명도 겹치지 않는 두 certificate가 가능합니다. 공유하는 정상 복제본이 없으니 위의 논리를 쓸 수 없습니다.",
  },
] as const;

const W = 360;
const X = [72, 144, 216, 288] as const;
const NODE_Y = 74;

function Bracket({ members, y, label, color, above }: { members: readonly number[]; y: number; label: string; color: string; above: boolean }) {
  const xs = members.map((index) => (X as readonly number[])[index]);
  const left = Math.min(...xs) - 26;
  const right = Math.max(...xs) + 26;
  const tick = above ? 8 : -8;
  return (
    <g>
      <path d={`M ${left} ${y + tick} L ${left} ${y} L ${right} ${y} L ${right} ${y + tick}`} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={(left + right) / 2} y={above ? y - 6 : y + 15} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function QuorumOverlapViz() {
  return (
    <SceneShell
      eyebrow="정족수 교집합 · n=4, f=1"
      title="두 정족수를 네 대에 겹쳐 놓으면 공통 서명자가 생깁니다"
      description="정족수(quorum)는 한 certificate에 서명한 서로 다른 복제본의 집합입니다. 위 괄호는 Q1, 아래 괄호는 Q2이고, 두 괄호에 모두 걸린 복제본이 공통 서명자입니다."
      ariaLabel="네 복제본에서 크기 3인 두 정족수는 두 명을 공유하고, 크기 2이면 공유하지 않을 수 있음"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const q1 = scene.q1 as readonly number[];
        const q2 = scene.q2 as readonly number[];
        return (
          <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Bracket members={q1} y={30} label={`Q1 = {${q1.map((index) => IDS[index]).join(",")}}`} color="#2563eb" above />
            <Bracket members={q2} y={118} label={`Q2 = {${q2.map((index) => IDS[index]).join(",")}}`} color="#7c3aed" above={false} />
            {IDS.map((id, index) => {
              const shared = q1.includes(index) && q2.includes(index);
              const byz = index === (scene.byz as number);
              return (
                <g key={id}>
                  <circle
                    cx={X[index]}
                    cy={NODE_Y}
                    r={20}
                    fill={shared ? (byz ? "#fee2e2" : "#dcfce7") : "#f8fafc"}
                    stroke={byz ? "#dc2626" : shared ? "#16a34a" : "#94a3b8"}
                    strokeWidth={shared || byz ? 1.25 : 1}
                    strokeDasharray={byz ? "4 3" : undefined}
                  />
                  <text x={X[index]} y={NODE_Y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="#0f172a">
                    {id}
                  </text>
                  {byz && (
                    <text x={X[index]} y={NODE_Y - 26} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">
                      Byzantine
                    </text>
                  )}
                  {shared && !byz && (
                    <text x={X[index]} y={NODE_Y + 35} textAnchor="middle" fontSize={11} fontWeight={700} fill="#15803d">
                      {scene.byz >= 0 ? "정상·공통" : "공통"}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
