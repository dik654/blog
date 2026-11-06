import SceneShell from "./SceneShell";

/**
 * 본문 대응: #power — 전압 × 전류 = 전력. 전원 12 V × 6 mA = 72 mW.
 * 첫 저항 6 V × 6 mA = 36, 갈래 6 V × 3 mA = 18 두 개. 칸 하나 = 1 V × 1 mA = 1 mW.
 */
const X0 = 44;
const Y0 = 30;
const CELL_W = 28;
const CELL_H = 15;
const W = 6 * CELL_W;
const H = 12 * CELL_H;

const BLOCKS = [
  { key: "첫 저항", value: 36, detail: "6 V × 6 mA", from: 1, x: X0, y: Y0, w: W, h: H / 2, color: "#2563eb" },
  { key: "왼쪽", value: 18, detail: "6 V × 3 mA", from: 2, x: X0, y: Y0 + H / 2, w: W / 2, h: H / 2, color: "#16a34a" },
  { key: "오른쪽", value: 18, detail: "6 V × 3 mA", from: 3, x: X0 + W / 2, y: Y0 + H / 2, w: W / 2, h: H / 2, color: "#d97706" },
];

const SCENES = [
  { label: "전원이 주는 양", summary: "12 V × 6 mA = 72 mW", note: "전압은 전하 1 C당 에너지, 전류는 1초당 전하입니다. 둘을 곱한 넓이가 1초당 에너지이며, 칸 하나가 1 mW입니다." },
  { label: "첫 저항", summary: "6 V × 6 mA = 36 mW", note: "전류 6 mA가 모두 첫 저항을 지나고, 거기서 전압 12 중 6을 씁니다. 그래서 위쪽 절반을 차지합니다." },
  { label: "왼쪽 갈래", summary: "6 V × 3 mA = 18 mW", note: "아래 절반에는 6 V가 남아 있습니다. 전류 6 mA 중 3 mA가 왼쪽을 지나므로 왼쪽 칸입니다." },
  { label: "오른쪽 갈래", summary: "6 V × 3 mA = 18 mW", note: "남은 3 mA가 오른쪽을 지납니다. 두 갈래에 같은 6 V가 걸리므로 넓이도 같습니다." },
  { label: "빈칸이 남지 않습니다", summary: "36 + 18 + 18 = 72 mW", note: "72칸이 빠짐없이 채워졌습니다. 공급과 소비의 합이 맞으므로 전압·전류 계산도 한 번 더 확인됩니다. 저장 소자가 없는 정상 상태에서 세운 검산입니다." },
];

export default function PowerAreaViz() {
  return (
    <SceneShell
      eyebrow="전력 검산"
      title="전원이 주는 72칸을 세 저항이 빠짐없이 나눠 씁니다"
      description="세로가 전압, 가로가 전류이고 넓이가 전력입니다. 숫자는 설명을 위한 가정입니다."
      ariaLabel="12볼트와 6밀리암페어로 만든 72칸 사각형을 세 저항의 36, 18, 18칸으로 나눈 그림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 250" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {BLOCKS.map((block) => {
            const on = active >= block.from;
            return (
              <g key={block.key}>
                <rect x={block.x} y={block.y} width={block.w} height={block.h} fill={block.color} fillOpacity={on ? (active === block.from || active === 4 ? 0.3 : 0.14) : 0} />
                {on && (
                  <g textAnchor="middle" fontWeight={700} fill="currentColor">
                    <text x={block.x + block.w / 2} y={block.y + block.h / 2 - 3} fontSize={12}>{block.key} {block.value}</text>
                    <text x={block.x + block.w / 2} y={block.y + block.h / 2 + 13} fontSize={10} fontWeight={400}>{block.detail}</text>
                  </g>
                )}
              </g>
            );
          })}
          {Array.from({ length: 7 }, (_, column) => (
            <line key={`v${column}`} x1={X0 + column * CELL_W} x2={X0 + column * CELL_W} y1={Y0} y2={Y0 + H} stroke="#94a3b8" strokeWidth={1} opacity={0.35} />
          ))}
          {Array.from({ length: 13 }, (_, row) => (
            <line key={`h${row}`} x1={X0} x2={X0 + W} y1={Y0 + row * CELL_H} y2={Y0 + row * CELL_H} stroke="#94a3b8" strokeWidth={1} opacity={0.35} />
          ))}
          <rect x={X0} y={Y0} width={W} height={H} fill="none" stroke="#64748b" strokeWidth={1.25} />
          {[12, 6, 0].map((volt) => (
            <text key={volt} x={X0 - 6} y={Y0 + ((12 - volt) / 12) * H + 4} textAnchor="end" fontSize={11} fill="#64748b">{volt}</text>
          ))}
          <text x={X0 - 6} y={Y0 - 10} textAnchor="end" fontSize={11} fill="#64748b">V</text>
          {[0, 3, 6].map((milli) => (
            <text key={milli} x={X0 + (milli / 6) * W} y={Y0 + H + 16} textAnchor="middle" fontSize={11} fill="#64748b">{milli}</text>
          ))}
          <text x={X0 + W / 2} y={Y0 + H + 32} textAnchor="middle" fontSize={11} fill="#64748b">전류 mA</text>
          <g fontSize={12}>
            <text x={232} y={52} fontWeight={700} fill="currentColor">전원 공급 72 mW</text>
            <line x1={232} x2={348} y1={62} y2={62} stroke="#94a3b8" strokeWidth={1} />
            {BLOCKS.map((block, index) => (
              <text key={block.key} x={232} y={84 + index * 22} fill={active >= block.from ? block.color : "#94a3b8"} fontWeight={active === block.from ? 700 : 400}>
                {block.key} {active >= block.from ? `${block.value} mW` : "−"}
              </text>
            ))}
            <line x1={232} x2={348} y1={140} y2={140} stroke="#94a3b8" strokeWidth={1} />
            <text x={232} y={160} fontWeight={700} fill={active === 4 ? "#16a34a" : "#94a3b8"}>{active === 4 ? "합계 72 mW ✓" : "합계 −"}</text>
          </g>
        </svg>
      )}
    />
  );
}
