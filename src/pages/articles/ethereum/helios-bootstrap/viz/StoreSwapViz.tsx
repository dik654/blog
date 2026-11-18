import SceneShell from "./SceneShell";

/**
 * 본문 대응: #store-init — verify_bootstrap이 두 검사를 통과한 뒤에만 S1의 각 field를 채우고,
 * apply_bootstrap이 기존 LightClientStore 전체를 새 struct로 한 번에 대입한다.
 * verify가 오류를 반환하면 apply 자체가 호출되지 않아 기존 Store(있다면)가 남는다.
 * 확인 범위는 in-memory 교체 순서이며 disk persistence·crash 복구는 포함하지 않는다.
 */
const C = { old: "#64748b", gate: "#7c3aed", ok: "#059669", bad: "#dc2626", text: "#334155", line: "#cbd5e1", s1: "#2563eb" };

const FIELDS = [
  { name: "finalized header", value: "H" },
  { name: "optimistic header", value: "H" },
  { name: "current committee", value: "K" },
  { name: "next committee", value: "아직 모름" },
  { name: "보조 상태 (participation 등)", value: "초기값" },
] as const;

const SCENES = [
  {
    label: "검증하는 동안",
    summary: "기존 Store 그대로 · S1 없음",
    note: "verify_bootstrap이 HTR(H)=C와 committee branch를 확인하는 동안에는 새 Store를 만들지 않습니다. 이전 Store가 있다면 그것이 계속 쓰입니다.",
  },
  {
    label: "두 검사 통과 뒤 S1 채우기",
    summary: "H · H · K · 모름 · 초기값",
    note: "Finalized와 optimistic header는 둘 다 H로 시작하고, current committee는 검증한 K입니다. Next committee는 아직 모르는 상태로 두며, participation 최대치와 best-valid-update 같은 보조 상태도 초기값을 넣어야 첫 update의 threshold 계산이 재현됩니다.",
  },
  {
    label: "한 번에 전체 대입",
    summary: "apply_bootstrap: Store ← S1",
    note: "확인한 구현의 apply_bootstrap은 기존 LightClientStore 전체를 새 struct로 한 번에 바꿉니다. 이 경계는 in-memory 교체 순서이며 disk 저장의 원자성이나 crash 뒤 복구까지 보여 주지는 않습니다.",
  },
  {
    label: "검증이 실패하면",
    summary: "apply 호출 없음 · 기존 Store 유지",
    note: "verify_bootstrap이 오류를 반환하면 apply_bootstrap 자체가 호출되지 않습니다. S1은 만들어지지 않고, 이전 Store가 있다면 그대로 남습니다.",
  },
] as const;

export default function StoreSwapViz() {
  return (
    <SceneShell
      eyebrow="Store 교체 순서"
      title="두 검사를 통과한 뒤에만 S1을 채우고, Store를 통째로 바꿉니다"
      description="왼쪽은 지금 client가 쓰는 Store(있다면), 오른쪽은 새로 만들 S1입니다. 가운데 상자가 두 검사입니다."
      ariaLabel="검증 통과 뒤 S1의 field를 채우고 기존 Store를 한 번에 교체하거나, 실패하면 기존 Store를 유지하는 과정"
      scenes={SCENES}
      render={(active) => {
        const failed = active === 3;
        const built = active === 1 || active === 2;
        const swapped = active === 2;
        const gateColor = active === 0 ? C.gate : failed ? C.bad : C.ok;
        const gateText = active === 0 ? "확인 중" : failed ? "오류 반환" : "두 검사 통과";
        return (
          <svg viewBox="0 0 360 230" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={10} y={30} width={96} height={150} rx={8} fill="none" stroke={swapped ? C.line : C.old} strokeWidth={swapped ? 1 : 1.2} strokeDasharray={swapped ? "3 3" : undefined} />
            <text x={58} y={22} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.old}>현재 Store</text>
            <text x={58} y={98} textAnchor="middle" fontSize={10} fill={swapped ? "#94a3b8" : C.text}>{swapped ? "S1로 대체됨" : "기존 Store"}</text>
            <text x={58} y={114} textAnchor="middle" fontSize={10} fill={swapped ? "#94a3b8" : C.text}>{swapped ? "" : "(있다면)"}</text>
            {(active === 0 || failed) && (
              <text x={58} y={160} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ok}>그대로 사용</text>
            )}

            <rect x={118} y={70} width={70} height={56} rx={8} fill="none" stroke={gateColor} strokeWidth={1.25} />
            <text x={153} y={88} textAnchor="middle" fontSize={9.5} fill={C.text}>HTR(H)=C</text>
            <text x={153} y={102} textAnchor="middle" fontSize={9.5} fill={C.text}>branch→R</text>
            <text x={153} y={118} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={gateColor}>{gateText}</text>
            <text x={153} y={62} textAnchor="middle" fontSize={9.5} fill={C.old}>verify_bootstrap</text>

            <text x={272} y={22} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.s1}>새 Store S1</text>
            <rect x={198} y={30} width={152} height={150} rx={8} fill="none" stroke={built ? C.s1 : C.line} strokeWidth={built ? 1.2 : 1} strokeDasharray={built ? undefined : "3 3"} />
            {built ? (
              FIELDS.map((field, index) => (
                <g key={field.name}>
                  <text x={206} y={52 + index * 28} fontSize={9} fill={C.old}>{field.name}</text>
                  <text x={206} y={66 + index * 28} fontSize={10.5} fontWeight={700} fill={index < 3 ? C.s1 : C.text}>← {field.value}</text>
                </g>
              ))
            ) : (
              <text x={274} y={108} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={failed ? C.bad : "#94a3b8"}>{failed ? "만들지 않음" : "아직 없음"}</text>
            )}

            {active >= 1 && !failed && <line x1={188} y1={98} x2={198} y2={98} stroke={C.ok} strokeWidth={1.25} />}
            {swapped && (
              <>
                <path d="M 274 184 L 274 200 L 58 200 L 58 184" fill="none" stroke={C.s1} strokeWidth={1.25} />
                <circle cx={58} cy={184} r={2.6} fill={C.s1} />
              </>
            )}
            <text x={180} y={222} textAnchor="middle" fontSize={10} fontWeight={700} fill={failed ? C.bad : swapped ? C.s1 : "#64748b"}>
              {failed ? "apply_bootstrap 호출 안 됨" : swapped ? "apply_bootstrap · 전체를 한 번에 대입" : "apply_bootstrap 아직 호출 전"}
            </text>
          </svg>
        );
      }}
    />
  );
}
