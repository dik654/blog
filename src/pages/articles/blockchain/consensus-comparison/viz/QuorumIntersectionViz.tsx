import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evidence — 같은 slot에서 충돌하는 quorum certificate를 만들지 못하게 하는 교집합.
 * 명부 4명, 정족수 3표는 설명용 가정이다. 같은 명부에서 3명씩 두 번 뽑으면
 * 최소 3 + 3 − 4 = 2명이 겹친다.
 */
const VALIDATORS = ["V1", "V2", "V3", "V4"] as const;
const X_SET = [0, 1, 2];
const Y_SET = [1, 2, 3];

const SCENES = [
  {
    label: "고정 명부",
    summary: "명부 4명 · 정족수 3표 (가정)",
    note: "Classical BFT는 이번 epoch의 고정된 validator 명부에서 서명된 표를 셉니다. 정족수(quorum)만큼 모인 표 묶음이 quorum certificate(QC)입니다. 여기서는 명부 4명, 정족수 3표라고 가정합니다.",
  },
  {
    label: "블록 X의 QC",
    summary: "slot s · X ← V1·V2·V3",
    note: "slot s에서 V1, V2, V3가 블록 X에 서명해 3표가 모였습니다. X의 QC가 생겼습니다.",
  },
  {
    label: "충돌 블록 Y",
    summary: "3 + 3 − 4 = 2명 겹침",
    note: "같은 slot s에서 X와 충돌하는 블록 Y도 같은 명부에서 3표를 모아야 합니다. 4명 중 3명을 어떻게 고르든 X의 3명과 최소 3 + 3 − 4 = 2명이 겹칩니다. 그림은 V2·V3·V4를 고른 경우입니다.",
  },
  {
    label: "겹친 표",
    summary: "겹친 2명이 이중 서명해야 Y 완성",
    note: "Y의 QC가 완성되려면 겹친 V2와 V3가 같은 slot에서 X와 Y 모두에 서명해야 합니다. 같은 slot에서 한 블록에만 서명하는 validator가 겹침 안에 한 명이라도 있으면 Y는 완성되지 못합니다. 겹친 사람이 모두 이중 서명(equivocation)하면 교집합만으로는 막지 못하므로, 정족수 크기는 장애 노드 수 가정과 함께 정합니다. Lock과 view change로 이 조건을 지키는 방식은 프로토콜마다 다릅니다.",
  },
] as const;

const X0 = 40;
const STEP = 80;
const CY = 112;
const vx = (index: number) => X0 + STEP * index + 20;

export default function QuorumIntersectionViz() {
  return (
    <SceneShell
      eyebrow="Quorum 교집합"
      title="같은 명부에서 뽑은 두 정족수는 반드시 겹칩니다"
      description="원 하나가 validator 한 명입니다. 명부 크기 4와 정족수 3은 설명용 가정입니다."
      ariaLabel="네 명의 validator 명부에서 두 블록의 quorum certificate가 겹치는 validator를 공유하는 과정"
      scenes={SCENES}
      render={(active) => {
        const showX = active >= 1;
        const showY = active >= 2;
        const overlap = active >= 2;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto block h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={180} y={24} textAnchor="middle" fontSize={12} fill="#475569">
              epoch 명부 · slot s
            </text>
            {showX && (
              <>
                <rect x={vx(0) - 34} y={CY - 46} width={vx(2) - vx(0) + 68} height={92} rx={12} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={vx(0) - 30} y={CY - 52} fontSize={12} fontWeight={700} fill="#2563eb">X의 QC · 3표</text>
              </>
            )}
            {showY && (
              <>
                <rect x={vx(1) - 28} y={CY - 38} width={vx(3) - vx(1) + 56} height={76} rx={10} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
                <text x={vx(3) + 28} y={CY + 56} textAnchor="end" fontSize={12} fontWeight={700} fill="#b45309">Y의 QC · 3표 필요</text>
              </>
            )}
            {VALIDATORS.map((name, index) => {
              const inX = showX && X_SET.includes(index);
              const inY = showY && Y_SET.includes(index);
              const both = overlap && inX && inY;
              return (
                <g key={name}>
                  <circle cx={vx(index)} cy={CY} r={18} fill={both ? "#fde68a" : inX ? "#dbeafe" : "#ffffff"} stroke={both ? "#b45309" : "#64748b"} strokeWidth={both ? 1.25 : 1} />
                  <text x={vx(index)} y={CY + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">
                    {name}
                  </text>
                  {active === 3 && both && (
                    <text x={vx(index)} y={CY + 34} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">
                      X·Y 둘 다
                    </text>
                  )}
                </g>
              );
            })}
            <text x={180} y={192} textAnchor="middle" fontSize={11} fill="#475569">
              {active === 0 ? "정족수 = 4명 중 3표 (가정)" : active === 1 ? "V1·V2·V3 → X" : "겹침 ≥ 3 + 3 − 4 = 2명 (V2·V3)"}
            </text>
          </svg>
        );
      }}
    />
  );
}
