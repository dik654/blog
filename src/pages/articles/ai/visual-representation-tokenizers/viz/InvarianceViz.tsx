import SceneShell from "./SceneShell";

/**
 * 본문 대응: #semantic 첫 문단 — 같은 object를 crop하거나 조명을 바꾼 두 view가 비슷한 feature로 모이도록 학습되면
 * recognition에는 유용하지만, decoder가 그 feature에서 원 image의 정확한 조명·pixel phase를 되살리려 할 때는
 * 그 차이가 이미 지워졌을 수 있다. feature 공간의 점 위치는 개념도(가정)이다.
 */
const SCENES = [
  {
    label: "두 view가 한 점 근처로 모임",
    summary: "인식: 같은 object",
    note: "Semantic encoder는 같은 object를 crop하거나 조명을 바꿔도 비슷한 feature를 내도록 학습될 수 있습니다. 두 view가 feature 공간에서 가까이 모이므로 '같은 물체'라는 인식에는 유리합니다.",
  },
  {
    label: "그 점에서 거꾸로 image를 만들면",
    summary: "어느 조명이었나? 단서가 지워졌을 수 있음",
    note: "Decoder가 이 feature에서 원 image의 정확한 조명과 pixel phase를 복원하려 해도, 두 view를 가르던 차이는 이미 지워졌을 수 있습니다. Invariance(불변성)는 공짜 robustness가 아니라 어떤 차이를 의도적으로 무시한 결과입니다.",
  },
] as const;

function Photo({ x, y, dark, shift, dashed, label }: { x: number; y: number; dark: boolean; shift: number; dashed: boolean; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width="72" height="50" rx="4" fill={dark ? "#94a3b8" : "#f1f5f9"} stroke="#64748b" strokeWidth="1" strokeDasharray={dashed ? "4 3" : undefined} />
      <circle cx={x + 30 + shift} cy={y + 27} r="13" fill="#d97706" opacity={dark ? 0.6 : 1} />
      <text x={x + 36} y={y + 64} textAnchor="middle" fontSize="12" fill="currentColor">{label}</text>
    </g>
  );
}

export default function InvarianceViz() {
  return (
    <SceneShell
      eyebrow="불변성"
      title="두 view를 같은 feature로 모으면, 거꾸로 갈 때 둘을 가를 단서가 남지 않았을 수 있습니다"
      description="왼쪽은 같은 물체(주황 원)를 찍은 원본과 crop·조명을 바꾼 view입니다. 오른쪽 사각형은 feature 공간을 평면으로 줄인 개념도이고, 점의 위치는 설명을 위한 가정입니다."
      ariaLabel="두 view가 semantic feature 한 점으로 모이고, 그 점에서는 원래 조명을 되살릴 수 없는 그림"
      scenes={SCENES}
      render={(active) => {
        const back = active === 1;
        const arrow = (y: number) =>
          back ? (
            <g>
              <line x1="146" y1="85" x2="96" y2={y} stroke="#dc2626" strokeWidth="1" strokeDasharray="4 3" />
              <text x="104" y={y + (y < 85 ? -4 : 12)} fontSize="13" fontWeight="700" fill="#dc2626">?</text>
            </g>
          ) : (
            <line x1="96" y1={y} x2="146" y2="85" stroke="#2563eb" strokeWidth="1" />
          );
        return (
          <svg viewBox="0 0 360 180" className="mx-auto block w-full max-w-lg" role="img" aria-label={back ? "feature에서 두 후보 image로 되돌아가는 모호한 화살표" : "두 view가 encoder를 지나 가까운 feature로 모임"}>
            <Photo x={20} y={14} dark={false} shift={0} dashed={back} label="원본" />
            <Photo x={20} y={104} dark shift={10} dashed={back} label="crop·조명 변경" />
            {arrow(40)}
            {arrow(130)}
            <rect x="146" y="64" width="64" height="42" rx="6" fill="none" stroke={back ? "#dc2626" : "#2563eb"} strokeWidth="1.25" />
            <text x="178" y="82" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={back ? "#dc2626" : "#2563eb"}>{back ? "decoder" : "semantic"}</text>
            <text x="178" y="97" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={back ? "#dc2626" : "#2563eb"}>{back ? "" : "encoder"}</text>
            <line x1="210" y1="85" x2="232" y2="85" stroke="#64748b" strokeWidth="1" />
            <rect x="232" y="22" width="122" height="126" rx="6" fill="none" stroke="#64748b" strokeWidth="1" />
            <text x="293" y="16" textAnchor="middle" fontSize="11" fill="#64748b">feature 공간</text>
            <circle cx="288" cy="82" r="5" fill="#2563eb" />
            <circle cx="297" cy="88" r="5" fill="#2563eb" opacity="0.6" />
            <circle cx="293" cy="85" r="16" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" />
            <text x="293" y="122" textAnchor="middle" fontSize="11.5" fill="currentColor">{back ? "조명 차이는" : "두 feature가"}</text>
            <text x="293" y="138" textAnchor="middle" fontSize="11.5" fill="currentColor">{back ? "남지 않았을 수 있음" : "가까이 모임"}</text>
          </svg>
        );
      }}
    />
  );
}
