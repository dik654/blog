import SceneShell from "./SceneShell";

/**
 * 본문 대응: #shape — (32,128,768)+(768,)는 끝 축이 같아 각 위치의 768개 값에 같은 가로 목록을 더한다.
 * 덩어리와 줄과 칸은 줄여 그렸고 32×128=4096, 4096×768=3,145,728은 본문 shape의 산술입니다.
 * 축은 배열의 번호일 뿐 공간의 위치가 아니라 2D로 그립니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const W = 340;
const X0 = 104;
const LENGTH = 220;
const LIST_Y = 22;
const ROW_H = 8;
const ROW_GAP = 3;
const ROWS = 5;
const LAYERS = 3;
const BLOCK_Y = 54;
const BLOCK_H = ROWS * ROW_H + (ROWS - 1) * ROW_GAP;
const BLOCK_GAP = 12;
const rowY = (layer: number, row: number) => BLOCK_Y + layer * (BLOCK_H + BLOCK_GAP) + row * (ROW_H + ROW_GAP);
const BOTTOM = rowY(LAYERS - 1, ROWS - 1) + ROW_H;
const H = BOTTOM + 28;

const SCENES = [
  { label: "세 축의 입력", summary: "(32, 128, 768)", note: "막대 하나가 끝 축 768개 값의 묶음입니다. 묶음 한 덩어리가 첫 축 한 칸이고 덩어리 안의 줄이 둘째 축입니다." },
  { label: "끝 축끼리 맞추기", summary: "768 = 768", note: "오른쪽부터 맞추면 (768,)은 끝 축에 놓입니다. 크기가 같아 통과하고, 앞의 두 축은 없어서 1처럼 취급됩니다." },
  { label: "한 위치에 더하기", summary: "768개 값끼리 더함", note: "한 막대의 768개 값에 주황 목록을 칸마다 더합니다. 위치끼리 짝을 짓는 방향이 끝 축입니다." },
  { label: "모든 위치로", summary: "4096곳 · 3,145,728칸", note: "같은 목록이 32×128=4096곳에 모두 적용되어 3,145,728칸에 더해집니다. 규칙이 허용해도 이 짝짓기가 의도인지는 따로 확인합니다." },
] as const;

export default function BroadcastTensorViz() {
  return (
    <SceneShell
      eyebrow="세 축의 짝짓기"
      title="같은 목록이 끝 축을 따라 모든 위치에 더해집니다"
      description="파란 막대가 (32,128,768) 입력, 주황 막대가 (768,) 목록입니다."
      note="덩어리와 줄과 칸은 줄여 그렸습니다. shape는 본문의 예이고 입력을 실제로 복사한다는 뜻이 아닙니다."
      ariaLabel="세 축 입력에 끝 축 목록이 더해지는 범위"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active >= 1 && (
            <g>
              <text x={X0 - 8} y={LIST_Y + 11} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>(768,)</text>
              <rect x={X0} y={LIST_Y} width={LENGTH} height={14} fill={AMBER} fillOpacity={0.4} stroke={AMBER} strokeWidth={1} />
              {Array.from({ length: 7 }, (_, index) => {
                const x = X0 + ((index + 1) / 8) * LENGTH;
                return <line key={index} x1={x} x2={x} y1={LIST_Y} y2={LIST_Y + 14} stroke={AMBER} strokeWidth={1} />;
              })}
            </g>
          )}
          {active === 1 && [X0, X0 + LENGTH].map((x) => (
            <line key={x} x1={x} x2={x} y1={LIST_Y + 14} y2={BOTTOM} stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
          ))}
          {active === 2 && [0.2, 0.5, 0.8].map((f) => (
            <line key={f} x1={X0 + f * LENGTH} x2={X0 + f * LENGTH} y1={LIST_Y + 14} y2={rowY(0, 0)} stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
          ))}
          {Array.from({ length: LAYERS }, (_, layer) =>
            Array.from({ length: ROWS }, (__, row) => {
              const on = active === 3 || (active === 2 && layer === 0 && row === 0);
              const color = on ? AMBER : BLUE;
              return <rect key={`${layer}-${row}`} x={X0} y={rowY(layer, row)} width={LENGTH} height={ROW_H} fill={color} fillOpacity={on ? 0.45 : 0.16} stroke={color} strokeWidth={1} />;
            }),
          )}
          <path d={`M ${X0 - 6} ${rowY(0, 0)} h -5 V ${rowY(0, ROWS - 1) + ROW_H} h 5`} fill="none" stroke={GRAY} strokeWidth={1} />
          <text x={X0 - 16} y={rowY(0, 2) - 2} textAnchor="end" fontSize={12} fill={GRAY}>둘째 축</text>
          <text x={X0 - 16} y={rowY(0, 2) + 14} textAnchor="end" fontSize={12} fontWeight={700} fill={GRAY}>128줄</text>
          <path d={`M 28 ${rowY(0, 0)} h -5 V ${BOTTOM} h 5`} fill="none" stroke={GRAY} strokeWidth={1} />
          <text transform={`translate(14 ${(rowY(0, 0) + BOTTOM) / 2}) rotate(-90)`} textAnchor="middle" fontSize={12} fill={GRAY}>첫 축 32덩어리</text>
          <text x={X0 + LENGTH / 2} y={BOTTOM + 20} textAnchor="middle" fontSize={12} fill={GRAY}>끝 축 768칸 →</text>
          {active === 1 && <text x={X0 + LENGTH} y={14} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>길이가 같아 맞음</text>}
          {active === 2 && <text x={X0 + LENGTH} y={14} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>이 한 줄에 칸마다 더함</text>}
          {active === 3 && <text x={X0 + LENGTH} y={14} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER}>4096줄 모두에 같은 목록</text>}
        </svg>
      )}
    />
  );
}
