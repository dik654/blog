import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 둘째 문단 — 장부 위험을 평행 이동·기울기·굽음·시간 구조 충격으로 나눈다.
 * 출발점: 한 달 곡선 90·100·110 = 30·20·24%(1절), 중앙의 만기 구조 1·3·6개월 = 20·22·24%(4절).
 * 충격 크기 2%포인트와 각 모양의 배분은 모양을 보이려는 가정입니다(글에 크기 없음).
 */
const W = 360;
const H = 200;
const SLOT_X: readonly number[] = [70, 180, 290];
const y = (vol: number) => 172 - (vol - 15) * 7;

const SMILE: readonly number[] = [30, 20, 24];
const TERM: readonly number[] = [20, 22, 24];

const SCENES: readonly { label: string; summary: string; axis: "strike" | "tenor"; base: readonly number[]; shocked: readonly number[]; note: string }[] = [
  {
    label: "평행 이동",
    summary: "세 점 모두 +2%p(가정)",
    axis: "strike",
    base: SMILE,
    shocked: [32, 22, 26],
    note: "곡선 전체가 같은 크기로 올라갑니다. 7절은 장부 위험을 이 평행 이동만이 아니라 다음 세 충격으로도 나눈다고 설명합니다.",
  },
  {
    label: "기울기",
    summary: "하락 쪽 +2 · 상승 쪽 −2(가정)",
    axis: "strike",
    base: SMILE,
    shocked: [32, 20, 22],
    note: "중앙은 그대로 두고 한쪽 날개는 오르고 반대쪽은 내립니다. 3절의 −6 같은 두 날개 차이가 바뀝니다(−6 → −10). 세 점의 평균 변화는 (2+0−2)÷3=0이라 평행 이동 크기로만 재면 움직임이 없어 보입니다.",
  },
  {
    label: "굽음",
    summary: "양 날개 +2 · 중앙 0(가정)",
    axis: "strike",
    base: SMILE,
    shocked: [32, 20, 26],
    note: "중앙은 그대로인데 두 날개가 함께 올라 U자가 더 깊어집니다. 날개 옵션이 있는 장부는 중앙이 그대로여도 이 충격에서 손익이 날 수 있습니다(5절).",
  },
  {
    label: "시간 구조",
    summary: "중앙 20·22·24 → 20·23·26(가정)",
    axis: "tenor",
    base: TERM,
    shocked: [20, 23, 26],
    note: "가로축이 만기로 바뀝니다. 같은 중앙 행사가에서 먼 만기 쪽이 더 많이 움직이는 충격입니다. 장기 옵션의 위험은 이 축에서 따로 봐야 합니다(5절).",
  },
];

export default function SurfaceShockShapesViz() {
  return (
    <SceneShell
      eyebrow="표면 충격 나누기"
      title="표면은 평행 이동 말고도 기울고, 굽고, 만기 쪽으로 움직입니다"
      description="점선은 충격 전, 실선은 충격 뒤의 내재변동성(%)입니다. 출발 숫자는 1·4절 값이고, 충격 크기 2%포인트와 배분은 모양을 보이려는 가정입니다."
      ariaLabel="변동성 곡선의 평행 이동, 기울기, 굽음, 시간 구조 충격 모양 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const labels = scene.axis === "strike" ? ["행사가 90", "행사가 100", "행사가 110"] : ["한 달", "세 달", "여섯 달"];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={W / 2} y={14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">
              {scene.axis === "strike" ? "한 달 만기 · 가로축: 행사가" : "중앙 행사가 · 가로축: 만기"}
            </text>
            <line x1={40} x2={W - 20} y1={178} y2={178} stroke="#94a3b8" strokeWidth={1} />
            {SLOT_X.map((sx, i) => (
              <text key={sx} x={sx} y={194} textAnchor="middle" fontSize={12} fill="#64748b">{labels[i]}</text>
            ))}
            <polyline points={SLOT_X.map((sx, i) => `${sx},${y(scene.base[i])}`).join(" ")} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            {SLOT_X.map((sx, i) => (
              <circle key={`b-${sx}`} cx={sx} cy={y(scene.base[i])} r={3.5} fill="#94a3b8" />
            ))}
            <polyline points={SLOT_X.map((sx, i) => `${sx},${y(scene.shocked[i])}`).join(" ")} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            {SLOT_X.map((sx, i) => {
              const diff = scene.shocked[i] - scene.base[i];
              const color = diff > 0 ? "#dc2626" : diff < 0 ? "#16a34a" : "#2563eb";
              const above = diff >= 0;
              return (
                <g key={`s-${sx}`}>
                  <circle cx={sx} cy={y(scene.shocked[i])} r={5} fill={color} />
                  <text x={sx} y={above ? y(scene.shocked[i]) - 10 : y(scene.shocked[i]) + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
                    {`${scene.base[i]}→${scene.shocked[i]}`}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
