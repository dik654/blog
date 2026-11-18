import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 첫 문단 — 호가단위 0.05포인트 × 계약승수 25만 원 = 한 칸 1만2,500원.
 * 330 → 328의 2포인트 = 2 ÷ 0.05 = 40칸, 40 × 1만2,500원 = 50만 원(3절 손실과 같음).
 * 가격 축 위에 0.05포인트 칸 40개를 실제로 그려 셀 수 있게 한다.
 */
const TICKS = 40;

const W = 360;
const H = 150;
const LEFT = 20;
const RIGHT = 340;
const CELL = (RIGHT - LEFT) / TICKS;
const ROW_Y = 54;
const ROW_H = 34;

const SCENES = [
  { label: "2포인트를 칸으로 자르면", summary: "2 ÷ 0.05 = 40칸", filled: 0, total: "", note: "가격은 0.05포인트보다 작게 움직이지 않습니다. 330에서 328까지 내려가는 길은 이 칸 40개로 이루어집니다. 1포인트가 20칸입니다." },
  { label: "칸 하나의 값", summary: "0.05 × 25만 원 = 1만2,500원", filled: 1, total: "1만2,500원", note: "칸 하나에 계약승수 25만 원을 곱하면 1계약 기준 1만2,500원입니다. 화면에서 한 칸 내려가면 매수한 1계약의 평가손익이 1만2,500원 줄어듭니다." },
  { label: "40칸을 모두 더하면", summary: "40 × 1만2,500원 = 50만 원", filled: TICKS, total: "50만 원", note: "40칸 × 1만2,500원 = 50만 원으로, 3절의 (328−330) × 25만 원 = −50만 원과 같은 손실입니다. 화면의 2포인트는 2원이 아니라 50만 원입니다." },
] as const;

export default function TickGridViz() {
  return (
    <SceneShell
      eyebrow="호가단위와 계약승수"
      title="330에서 328까지는 0.05포인트 칸 40개입니다"
      description="호가단위는 가격이 한 번에 움직일 수 있는 가장 작은 칸입니다. 칸 하나가 0.05포인트이고, 1계약 매수 기준으로 칸마다 금액을 붙였습니다(KRX 코스피200 선물 명세, 2026-10-09 확인)."
      ariaLabel="코스피200 선물 330에서 328까지의 호가단위 40칸과 칸당 1만2,500원, 합계 50만 원"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT} y={30} fontSize={13} fontWeight={700} fill="#475569">330</text>
            <text x={(LEFT + RIGHT) / 2} y={30} textAnchor="middle" fontSize={12} fill="#64748b">329</text>
            <text x={RIGHT} y={30} textAnchor="end" fontSize={13} fontWeight={700} fill="#475569">328</text>
            <line x1={LEFT} x2={LEFT} y1={38} y2={ROW_Y + ROW_H + 6} stroke="#94a3b8" strokeWidth={1} />
            <line x1={(LEFT + RIGHT) / 2} x2={(LEFT + RIGHT) / 2} y1={38} y2={ROW_Y + ROW_H + 6} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 2" />
            <line x1={RIGHT} x2={RIGHT} y1={38} y2={ROW_Y + ROW_H + 6} stroke="#94a3b8" strokeWidth={1} />
            {Array.from({ length: TICKS }, (_, tick) => (
              <rect
                key={tick}
                x={LEFT + tick * CELL + 0.5}
                y={ROW_Y}
                width={CELL - 1}
                height={ROW_H}
                rx={1}
                fill={tick < scene.filled ? "#dc2626" : "#e2e8f0"}
                opacity={tick < scene.filled ? 0.85 : 1}
              />
            ))}
            {index === 1 ? (
              <text x={LEFT + CELL / 2} y={ROW_Y + ROW_H + 20} fontSize={12} fontWeight={700} fill="#dc2626">↑ 0.05포인트 = 1만2,500원</text>
            ) : null}
            {index === 0 ? (
              <text x={(LEFT + RIGHT) / 2} y={ROW_Y + ROW_H + 20} textAnchor="middle" fontSize={12} fill="#64748b">칸 하나 = 0.05포인트 · 모두 40칸</text>
            ) : null}
            {index === 2 ? (
              <text x={(LEFT + RIGHT) / 2} y={ROW_Y + ROW_H + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">40칸 모두 손실</text>
            ) : null}
            <text x={(LEFT + RIGHT) / 2} y={H - 10} textAnchor="middle" fontSize={14} fontWeight={700} fill={scene.total ? "#dc2626" : "#64748b"}>
              {scene.total ? `1계약 평가손익 −${scene.total}` : "1계약 평가손익 = 칸 수 × 칸당 금액"}
            </text>
          </svg>
        );
      }}
    />
  );
}
