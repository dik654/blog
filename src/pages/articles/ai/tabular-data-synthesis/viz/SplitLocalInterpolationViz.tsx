import SceneShell from "./SceneShell";

/**
 * 본문 대응: #split-local — i, j ∈ I_train, x̃ = x_i + λ(x_j − x_i), a(x̃) = Π 1[c_r(x̃) = 1].
 * 평면의 점 위치, λ = 0.4, rule 세 개(R = 3)는 설명용 가정이다.
 * 정상: anchor (90,150), 가장 가까운 train neighbor (170,110) → x̃ = (90+0.4·80, 150−0.4·40) = (122,134).
 * 누출: split 전에 찾은 가장 가까운 이웃이 validation 점 (125,165) → x̃ = (90+0.4·35, 150+0.4·15) = (104,156).
 */
const ANCHOR = { x: 90, y: 150 };
const NEIGHBOR = { x: 170, y: 110 };
const VAL_NEAR = { x: 125, y: 165 };
const LAMBDA = 0.4;

const lerp = (from: { x: number; y: number }, to: { x: number; y: number }) => ({
  x: from.x + LAMBDA * (to.x - from.x),
  y: from.y + LAMBDA * (to.y - from.y),
});
const CANDIDATE = lerp(ANCHOR, NEIGHBOR);
const LEAKED = lerp(ANCHOR, VAL_NEAR);

const TRAIN = [ANCHOR, NEIGHBOR, { x: 40, y: 60 }, { x: 165, y: 58 }, { x: 300, y: 58 }];
const VALID = [VAL_NEAR, { x: 250, y: 78 }, { x: 305, y: 125 }];

const SCENES = [
  {
    label: "먼저 split",
    summary: "train ● · validation ○",
    note: "보간을 시작하기 전에 row를 training fold(채운 점)와 validation(빈 점)으로 나눕니다. 이후 neighbor 탐색·generator·통계는 채운 점만 봅니다. 두 축은 보간해도 되는 수치 feature 두 개라고 가정했습니다.",
  },
  {
    label: "Anchor와 neighbor",
    summary: "i, j ∈ I_train",
    note: "Anchor x_i는 보간을 시작하는 training row이고, neighbor x_j는 그 근처의 다른 training row입니다. 둘 다 training index set I_train 안에서만 고르고, 두 점의 차이 d = x_j − x_i가 이동 방향이 됩니다.",
  },
  {
    label: "λ만큼 이동",
    summary: "x̃ = x_i + 0.4·d",
    note: "λ는 0과 1 사이 값으로, anchor에서 neighbor까지 선분 위의 위치입니다. λ = 0.4라고 가정하면 synthetic candidate x̃는 anchor에서 neighbor 쪽으로 40% 지점에 놓입니다. 아직 release된 row가 아니라 후보입니다.",
  },
  {
    label: "Constraint 곱",
    summary: "1 × 1 × 1 = 1 → 승인",
    note: "Rule이 세 개라고 가정하면 각 rule의 통과 여부(통과 1, 실패 0)를 곱합니다. 셋 다 1이면 a(x̃) = 1로 승인됩니다. 하나라도 0이면 곱이 0이 되어, 다른 rule을 모두 통과해도 거부됩니다.",
  },
  {
    label: "Split 전에 찾으면",
    summary: "validation 위치가 후보에 섞임",
    note: "Split 전에 neighbor를 찾으면 anchor의 가장 가까운 이웃이 validation row일 수 있습니다. 그 방향으로 만든 후보는 validation 점의 위치 정보를 품은 채 training data로 들어갑니다. 이것이 validation geometry 누출입니다.",
  },
] as const;

const C_TRAIN = "#2563eb";
const C_VALID = "#64748b";
const C_CAND = "#d97706";
const C_LEAK = "#dc2626";

export default function SplitLocalInterpolationViz() {
  return (
    <SceneShell
      eyebrow="Split-local 보간"
      title="새 row는 training 점 두 개 사이의 선분 위에서만 태어납니다"
      description="평면 위 점 하나가 row 하나입니다. 점 위치, λ = 0.4, rule 세 개는 설명용 가정입니다."
      ariaLabel="training fold 안에서 anchor와 neighbor를 골라 보간하고 constraint로 승인하는 과정과 split 전 탐색의 누출"
      scenes={SCENES}
      render={(active) => {
        const leak = active === 4;
        const showPair = active >= 1;
        const showCandidate = active >= 2;
        const target = leak ? VAL_NEAR : NEIGHBOR;
        const point = leak ? LEAKED : CANDIDATE;
        return (
          <svg viewBox="0 0 360 236" className="mx-auto block h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={16} y={40} width={328} height={170} rx={8} fill="none" stroke="#cbd5e1" strokeWidth={1} />
            <text x={20} y={226} fontSize={10} fill="#64748b">수치 feature 1 →</text>
            <text x={340} y={226} fontSize={10} fill="#64748b" textAnchor="end">(가정)</text>
            <text x={11} y={206} fontSize={10} fill="#64748b" transform="rotate(-90 11 206)">수치 feature 2 →</text>
            <circle cx={26} cy={18} r={5} fill={C_TRAIN} />
            <text x={36} y={22} fontSize={11} fill="#334155">training fold</text>
            <circle cx={130} cy={18} r={4.5} fill="#ffffff" stroke={C_VALID} strokeWidth={1.25} />
            <text x={140} y={22} fontSize={11} fill="#334155">validation</text>
            {showCandidate && (
              <>
                <rect x={222} y={12} width={10} height={10} fill={leak ? C_LEAK : C_CAND} transform="rotate(45 227 17)" />
                <text x={240} y={22} fontSize={11} fill="#334155">후보 x̃</text>
              </>
            )}
            {TRAIN.map((p) => (
              <circle key={`t-${p.x}-${p.y}`} cx={p.x} cy={p.y} r={5} fill={C_TRAIN} opacity={showPair && p !== ANCHOR && p !== target ? 0.35 : 1} />
            ))}
            {VALID.map((p) => (
              <circle key={`v-${p.x}-${p.y}`} cx={p.x} cy={p.y} r={4.5} fill="#ffffff" stroke={leak && p === VAL_NEAR ? C_LEAK : C_VALID} strokeWidth={leak && p === VAL_NEAR ? 1.25 : 1} />
            ))}
            {showPair && (
              <>
                <line x1={ANCHOR.x} y1={ANCHOR.y} x2={target.x} y2={target.y} stroke={leak ? C_LEAK : C_TRAIN} strokeWidth={1.25} strokeDasharray={showCandidate ? "4 3" : undefined} />
                <text x={ANCHOR.x - 10} y={ANCHOR.y + 4} fontSize={11} fontWeight={700} fill="#1e293b" textAnchor="end">x_i anchor</text>
                <text x={target.x + (leak ? -14 : 8)} y={target.y + (leak ? 22 : -10)} fontSize={11} fontWeight={700} fill={leak ? C_LEAK : "#1e293b"}>
                  {leak ? "가장 가까운 이웃 = validation" : "x_j neighbor"}
                </text>
              </>
            )}
            {active === 1 && (
              <text x={(ANCHOR.x + NEIGHBOR.x) / 2 + 6} y={(ANCHOR.y + NEIGHBOR.y) / 2 - 6} fontSize={11} fill={C_TRAIN}>d = x_j − x_i</text>
            )}
            {showCandidate && (
              <>
                <rect x={point.x - 5} y={point.y - 5} width={10} height={10} fill={leak ? C_LEAK : C_CAND} transform={`rotate(45 ${point.x} ${point.y})`} />
                {!leak && (
                  <text x={point.x + 10} y={point.y + 16} fontSize={11} fontWeight={700} fill={C_CAND}>
                    λ = 0.4
                  </text>
                )}
              </>
            )}
            {active === 3 && (
              <g>
                <rect x={196} y={150} width={140} height={52} rx={6} fill="#ffffff" stroke="#cbd5e1" strokeWidth={1} />
                <text x={204} y={168} fontSize={11} fill="#334155">c₁=1 · c₂=1 · c₃=1</text>
                <text x={204} y={188} fontSize={12} fontWeight={700} fill="#15803d">a(x̃) = 1 → 승인</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
