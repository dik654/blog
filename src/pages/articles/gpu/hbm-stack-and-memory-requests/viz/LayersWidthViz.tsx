import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits, #comparison — 층 수는 주로 용량·패키지 구성의 변화입니다.
 * 같은 8Gb/s/pin 가정에서 1,024비트 → 1,024GB/s, 2,048비트 → 2,048GB/s.
 * 4층·8층은 모형이며 특정 제품의 적층 수가 아닙니다.
 */
const SCENES = [
  { label: "기준", summary: "1,024비트 → 1,024GB/s", layers: 4, width: 1024, note: "네 층은 모형입니다. 아래쪽 인터페이스에서 나가는 폭 1,024비트에 선당 8Gb/s를 가정하면 이론상 상한은 1,024GB/s입니다." },
  { label: "층만 두 배", summary: "대역폭 상한 그대로", layers: 8, width: 1024, note: "층은 주로 용량과 패키지 구성을 바꿉니다. 외부 폭과 선당 속도(pin 속도)가 유지되면 층 수에 비례해 대역폭이 늘지 않습니다. 계산은 그대로 1,024GB/s입니다." },
  { label: "폭을 두 배", summary: "2,048비트 → 2,048GB/s", layers: 4, width: 2048, note: "HBM4 공개 PHY의 2,048비트에 같은 선당 8Gb/s를 가정한 인터페이스 계산입니다. 폭이 두 배라 상한이 두 배일 뿐 응답 지연이 절반이라는 뜻이 아니며, 특정 GPU의 실측 성능도 아닙니다." },
] as const;

const BASE_Y = 136;
const LAYER_H = 11;
const STACK_X = 16;
const STACK_W = 100;

export default function LayersWidthViz() {
  return (
    <SceneShell
      eyebrow="높이와 폭"
      title="위로 쌓는 일과 옆으로 넓히는 일은 다른 축입니다"
      description="왼쪽은 적층을 옆에서 본 모형이고 오른쪽 띠가 바깥 통로의 폭입니다. 선당 속도는 8Gb/s로 놓은 계산 가정입니다."
      ariaLabel="층 수를 두 배로 할 때와 데이터 폭을 두 배로 할 때의 대역폭 상한 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const band = scene.width === 2048 ? 28 : 14;
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Array.from({ length: scene.layers }, (_, index) => (
              <rect key={index} x={STACK_X} y={BASE_Y - 22 - (index + 1) * LAYER_H} width={STACK_W} height={LAYER_H - 2} rx={1} fill="#d97706" fillOpacity={0.55} stroke="#d97706" strokeWidth={0.75} />
            ))}
            <text x={STACK_X + STACK_W + 8} y={BASE_Y - 30} fontSize={12} fontWeight={700} fill="#d97706">{scene.layers}층 (모형)</text>
            <rect x={STACK_X} y={BASE_Y - 20} width={STACK_W} height={20} rx={2} fill="none" stroke="#64748b" strokeWidth={1} />
            <text x={STACK_X + STACK_W / 2} y={BASE_Y - 6} textAnchor="middle" fontSize={11} fill="#64748b">아래쪽 인터페이스</text>
            <rect x={STACK_X + STACK_W} y={BASE_Y - 10 - band / 2} width={148} height={band} fill="#2563eb" />
            <rect x={STACK_X + STACK_W + 148} y={BASE_Y - 44} width={72} height={68} rx={3} fill="none" stroke="#64748b" strokeWidth={1} />
            <text x={STACK_X + STACK_W + 184} y={BASE_Y - 6} textAnchor="middle" fontSize={12} fill="#64748b">계산 칩</text>
            <text x={STACK_X + STACK_W + 74} y={BASE_Y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">폭 {scene.width.toLocaleString("en-US")}비트</text>
            <text x={180} y={18} textAnchor="middle" fontSize={14} fontWeight={700} fill="#2563eb">{scene.width.toLocaleString("en-US")} × 8 ÷ 8 = {scene.width.toLocaleString("en-US")}GB/s</text>
          </svg>
        );
      }}
    />
  );
}
