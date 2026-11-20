import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 선형 채권은 민감도 근사가 잘 맞을 수 있지만 옵션은 큰 충격에서 다시 가격을 계산해야 할 수 있습니다.
 * 본문에 숫자가 없으므로 축에 값을 적지 않은 모양 그림입니다(가정).
 * 옵션 곡선은 콜옵션 매수처럼 아래로 볼록한 모양을 예로 들고, 직선은 충격 0에서의 기울기로 그은 근사입니다.
 */
const W = 360;
const H = 200;
const CX = 180;
const CY = 120;
const SPAN = 150;
const STEPS = 30;

/** 충격 s ∈ [−1, 1]에서 설명용 가치 변화(가정). 옵션은 0에서 기울기 0.5, 위로 휘는 곡선. */
const optionValue = (s: number) => 0.5 * s + 0.45 * s * s;
const linear = (s: number) => 0.5 * s;
const px = (s: number) => CX + s * SPAN;
const py = (v: number) => CY - v * 80;

const path = (fn: (s: number) => number) =>
  Array.from({ length: STEPS + 1 }, (_, i) => -1 + (2 * i) / STEPS)
    .map((s, i) => `${i === 0 ? "M" : "L"}${px(s).toFixed(1)},${py(fn(s)).toFixed(1)}`)
    .join(" ");

const SCENES = [
  { label: "선형 채권", summary: "직선 근사 ≈ 실제", option: false, zone: 1, note: "가치가 충격에 거의 직선으로 반응하는 포지션이면 현재 기울기(민감도)로 그은 직선이 실제 가치 변화와 거의 겹칠 수 있습니다." },
  { label: "옵션 · 작은 충격", summary: "곡선과 직선이 가까움", option: true, zone: 0.25, note: "옵션의 가치는 충격에 따라 휘어 움직입니다. 충격이 작은 가운데 구간에서는 현재 기울기로 그은 직선과 실제 곡선의 차이가 작습니다." },
  { label: "옵션 · 큰 충격", summary: "차이가 벌어짐 → 다시 가격 계산", option: true, zone: 1, note: "충격이 커지면 곡선이 직선에서 멀어집니다. 이때는 기울기 근사 대신 충격 뒤 시장 값으로 옵션 가격을 다시 계산해야 할 수 있습니다. 10절이 말하는 ‘큰 충격에서 민감도가 바뀐다’는 모습도 이 휘어짐입니다." },
] as const;

export default function RepriceVsLinearViz() {
  return (
    <SceneShell
      eyebrow="근사와 재평가"
      title="옵션은 큰 충격에서 직선 근사가 벗어납니다"
      description="가로축은 시장 충격의 크기와 방향, 세로축은 포지션 가치의 변화입니다. 민감도 근사는 지금 기울기(옵션이면 델타 같은 값)로 직선을 그어 손익을 추정하는 방법입니다. 본문에 숫자가 없어 모양만 그린 그림이며 곡선의 휘는 정도는 가정입니다."
      ariaLabel="선형 채권과 옵션에서 민감도 직선 근사와 실제 가치 변화의 차이가 충격 크기에 따라 달라지는 모습"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const real = scene.option ? optionValue : linear;
        const edge = scene.zone;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={px(-edge)} y={14} width={px(edge) - px(-edge)} height={H - 44} fill="#f1f5f9" />
            <line x1={px(-1) - 6} x2={px(1) + 6} y1={CY} y2={CY} stroke="#94a3b8" strokeWidth={1} />
            <line x1={CX} x2={CX} y1={14} y2={H - 30} stroke="#94a3b8" strokeWidth={1} />
            <text x={px(1) + 4} y={CY + 16} textAnchor="end" fontSize={10} fill="#64748b">충격 →</text>
            <text x={px(-1) + 4} y={CY - 8} fontSize={10} fill="#64748b">← 충격</text>
            <text x={CX + 4} y={22} fontSize={10} fill="#64748b">가치 변화</text>
            <path d={path(real)} fill="none" stroke={scene.option ? "#b45309" : "#2563eb"} strokeWidth={1.25} />
            <path d={path(linear)} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="5 4" />
            {scene.option && (
              <>
                <line x1={px(edge)} x2={px(edge)} y1={py(linear(edge))} y2={py(optionValue(edge))} stroke="#dc2626" strokeWidth={1.25} />
                <line x1={px(-edge)} x2={px(-edge)} y1={py(linear(-edge))} y2={py(optionValue(-edge))} stroke="#dc2626" strokeWidth={1.25} />
                <text x={px(edge) + 4} y={(py(linear(edge)) + py(optionValue(edge))) / 2 + 4} fontSize={10} fontWeight={700} fill="#dc2626">차이</text>
              </>
            )}
            <g fontSize={10}>
              <line x1={14} x2={34} y1={H - 12} y2={H - 12} stroke="#64748b" strokeWidth={1.25} strokeDasharray="5 4" />
              <text x={38} y={H - 8} fill="#475569">민감도 직선 근사</text>
              <line x1={170} x2={190} y1={H - 12} y2={H - 12} stroke={scene.option ? "#b45309" : "#2563eb"} strokeWidth={1.25} />
              <text x={194} y={H - 8} fill="#475569">{scene.option ? "매수 옵션 가치(가정 모양)" : "선형 채권 실제 가치"}</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
