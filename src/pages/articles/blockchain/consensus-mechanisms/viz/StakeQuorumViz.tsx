import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pos — phase0 판정 target×3 ≥ total×2, 합계 지분 100.
 * A·B·D = 10+20+40 = 70 → 210 ≥ 200 통과.
 * D 무응답 → A·B·C = 10+20+30 = 60 → 180 < 200 통과 못 함. 같은 3명이라도 결과가 다르다.
 */
const STAKES = [
  { name: "A", stake: 10 },
  { name: "B", stake: 20 },
  { name: "C", stake: 30 },
  { name: "D", stake: 40 },
] as const;
const STARTS = STAKES.map((_, index) => STAKES.slice(0, index).reduce<number>((sum, item) => sum + item.stake, 0));
const X0 = 12;
const W = 336;
const BAR_Y = 44;
const BAR_H = 34;
const SUM_Y = 120;
const xOf = (value: number) => X0 + (value / 100) * W;
const LINE_X = xOf(200 / 3);

const SCENES = [
  { label: "전체 지분과 2/3 선", voters: [] as readonly string[], off: [] as readonly string[], summary: "판정: 대상 지분×3 ≥ 100×2", note: "합계 지분은 100입니다. 원문 판정은 올바른 대상에 투표한 지분에 3을 곱해 전체의 2배 이상인지 봅니다. 100×2/3≈66.7에 점선을 그었습니다." },
  { label: "A·B·D가 투표", voters: ["A", "B", "D"], off: [] as readonly string[], summary: "70×3 = 210 ≥ 200 · 통과", note: "A·B·D의 지분을 더하면 10+20+40=70입니다. 사람 수 3명이 아니라 지분 70이 점선을 넘습니다. 이 판정은 justification이며 곧바로 최종 확정을 뜻하지 않습니다." },
  { label: "D가 응답하지 않음", voters: ["A", "B", "C"], off: ["D"], summary: "60×3 = 180 < 200 · 통과 못 함", note: "D의 40이 빠지면 나머지가 모두 투표해도 10+20+30=60입니다. 앞 장면과 똑같이 3명이 투표했지만 점선에 닿지 못합니다. 모순된 기록을 확정하지는 않지만 새 기록의 확정도 진행되지 않습니다." },
] as const;

export default function StakeQuorumViz() {
  return (
    <SceneShell
      eyebrow="지분 2/3 판정"
      title="몇 명이 투표했는지가 아니라 투표한 지분의 합이 점선을 넘어야 합니다"
      description="막대 전체가 합계 지분 100이고 칸 너비가 각 참여자의 지분입니다. 색칠한 칸이 같은 대상에 투표한 지분입니다."
      note="10·20·30·40은 설명용 가정입니다. 서명·출발 지점·시점 검사는 이미 통과했다고 놓습니다."
      ariaLabel="합계 지분 100에서 투표 지분이 2/3 판정을 통과하는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const voters = new Set<string>(scene.voters);
        const off = new Set<string>(scene.off);
        const total = STAKES.filter((item) => voters.has(item.name)).reduce<number>((sum, item) => sum + item.stake, 0);
        const pass = total * 3 >= 200;
        return (
          <svg viewBox="0 0 360 168" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={BAR_Y - 10} fontSize={13} fill="#64748b">합계 지분 100</text>
            {STAKES.map((item, index) => {
              const x = xOf(STARTS[index]);
              const w = (item.stake / 100) * W;
              const voted = voters.has(item.name);
              const absent = off.has(item.name);
              return (
                <g key={item.name}>
                  <rect
                    x={x + 0.5}
                    y={BAR_Y}
                    width={w - 1}
                    height={BAR_H}
                    rx={3}
                    fill={voted ? "#2563eb" : "#f1f5f9"}
                    stroke={absent ? "#94a3b8" : voted ? "#1d4ed8" : "#cbd5e1"}
                    strokeWidth={1}
                    strokeDasharray={absent ? "4 3" : undefined}
                  />
                  <text x={x + w / 2} y={BAR_Y + 15} textAnchor="middle" fontSize={13} fontWeight={700} fill={voted ? "#ffffff" : "#475569"}>{item.name}</text>
                  <text x={x + w / 2} y={BAR_Y + 28} textAnchor="middle" fontSize={12} fill={voted ? "#dbeafe" : "#64748b"}>{absent ? "무응답" : item.stake}</text>
                </g>
              );
            })}
            <line x1={LINE_X} x2={LINE_X} y1={BAR_Y - 22} y2={BAR_Y + BAR_H + 8} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={LINE_X} y={BAR_Y - 26} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">2/3 ≈ 66.7</text>

            {active === 0 ? (
              <text x={X0} y={SUM_Y} fontSize={13} fill="#475569">투표한 지분을 왼쪽부터 쌓아 점선과 비교합니다</text>
            ) : (
              <>
                <rect x={X0 + 0.5} y={SUM_Y - 15} width={(total / 100) * W - 1} height={19} rx={2} fill={pass ? "#16a34a" : "#d97706"} />
                <text x={X0 + 6} y={SUM_Y - 2} fontSize={13} fontWeight={700} fill="#ffffff">합 {total}</text>
                <line x1={LINE_X} x2={LINE_X} y1={SUM_Y - 20} y2={SUM_Y + 6} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={X0} y={SUM_Y + 26} fontSize={13} fontWeight={700} fill={pass ? "#15803d" : "#b45309"}>
                  {total}×3 = {total * 3} {pass ? "≥" : "<"} 200 · {pass ? "통과" : "통과 못 함"}
                </text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
