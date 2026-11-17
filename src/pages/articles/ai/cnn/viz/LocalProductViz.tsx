import SceneShell from "./SceneShell";

/**
 * 본문 대응: #local-operator — 3×3 입력의 왼쪽 위 2×2 patch [[1,2],[3,4]]와
 * kernel [[1,0],[0,−1]]을 같은 offset끼리 곱해 더한다. 1+0+0−4 = −3.
 * 입력의 나머지 다섯 칸 값은 글이 정하지 않았으므로 "?"로 둔다.
 */
const PATCH = [1, 2, 3, 4] as const;
const KERNEL = [1, 0, 0, -1] as const;
const PRODUCTS = PATCH.map((value, index) => value * KERNEL[index]);
const RUNNING = PRODUCTS.map((_, index) =>
  PRODUCTS.slice(0, index + 1).reduce<number>((sum, value) => sum + value, 0),
);
const OFFSETS = ["(0,0)", "(0,1)", "(1,0)", "(1,1)"] as const;

const fmt = (value: number) => (value < 0 ? `−${Math.abs(value)}` : `${value}`);

const SCENES = OFFSETS.map((offset, index) => ({
  label: `offset ${offset}`,
  summary: `${PATCH[index]} × ${KERNEL[index] < 0 ? `(${fmt(KERNEL[index])})` : fmt(KERNEL[index])} = ${fmt(PRODUCTS[index])} · 누적 ${fmt(RUNNING[index])}`,
  note:
    index === 0
      ? "Window의 왼쪽 위 칸과 kernel의 왼쪽 위 칸은 같은 offset (0,0)입니다. 두 값 1과 1을 곱해 1을 얻습니다."
      : index === 3
        ? "마지막 offset (1,1)에서 4 × (−1) = −4가 더해져 합이 −3이 됩니다. 이 값이 output feature map의 첫 칸 Y[0,0]입니다. 이 예에서는 bias를 더하지 않습니다(가정: b=0)."
        : `offset ${offset}의 kernel 값이 0이라 이 칸의 곱은 0입니다. 입력이 ${PATCH[index]}여도 합에는 영향이 없습니다.`,
}));

const CELL = 34;

function Grid({
  x,
  y,
  size,
  values,
  activeCell,
  doneCells,
  window,
}: {
  x: number;
  y: number;
  size: number;
  values: readonly string[];
  activeCell: number;
  doneCells: number;
  window: boolean;
}) {
  return (
    <g>
      {values.map((value, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        const inWindow = !window || (row < 2 && col < 2);
        const windowIndex = row * 2 + col;
        const isActive = inWindow && windowIndex === activeCell;
        const isDone = inWindow && windowIndex < doneCells;
        return (
          <g key={index}>
            <rect
              x={x + col * CELL}
              y={y + row * CELL}
              width={CELL}
              height={CELL}
              fill={isActive ? "#2563eb" : "#ffffff"}
              fillOpacity={isActive ? 0.14 : 0.02}
              stroke={isActive ? "#2563eb" : "#94a3b8"}
              strokeWidth={isActive ? 1.25 : 1}
            />
            <text
              x={x + col * CELL + CELL / 2}
              y={y + row * CELL + CELL / 2 + 5}
              textAnchor="middle"
              fontSize={14}
              fontWeight={isActive ? 700 : 500}
              fill={!inWindow ? "#94a3b8" : isActive ? "#2563eb" : isDone ? "#64748b" : undefined}
              className={!inWindow || isActive || isDone ? undefined : "fill-foreground"}
            >
              {value}
            </text>
          </g>
        );
      })}
      {window && (
        <rect
          x={x}
          y={y}
          width={CELL * 2}
          height={CELL * 2}
          fill="none"
          stroke="#2563eb"
          strokeWidth={1.25}
          strokeDasharray="4 3"
        />
      )}
    </g>
  );
}

export default function LocalProductViz() {
  return (
    <SceneShell
      eyebrow="같은 offset끼리 곱하기"
      title="Window와 kernel을 겹쳐 네 칸의 곱을 차례로 더합니다"
      description="왼쪽은 channel 1개인 3×3 입력이고 점선이 첫 2×2 window입니다. offset은 window 왼쪽 위에서 몇 행·몇 열 떨어졌는지입니다. 나머지 다섯 칸의 값은 이 계산에 쓰이지 않아 ?로 둡니다."
      ariaLabel="2×2 patch와 kernel을 같은 offset끼리 곱해 −3을 만드는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox="0 0 360 150"
          className="mx-auto h-auto w-full max-w-[520px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          <text x={10} y={14} fontSize={12} fill="#64748b">입력 X (3×3)</text>
          <Grid
            x={10}
            y={24}
            size={3}
            values={["1", "2", "?", "3", "4", "?", "?", "?", "?"]}
            activeCell={active}
            doneCells={active}
            window
          />
          <text x={128} y={80} textAnchor="middle" fontSize={16} fill="#64748b">×</text>
          <text x={146} y={14} fontSize={12} fill="#64748b">kernel W</text>
          <Grid
            x={146}
            y={24}
            size={2}
            values={KERNEL.map(fmt)}
            activeCell={active}
            doneCells={active}
            window={false}
          />
          <text x={232} y={14} fontSize={12} fill="#64748b">offset별 곱</text>
          {PRODUCTS.map((value, index) => (
            <text
              key={index}
              x={232}
              y={36 + index * 20}
              fontSize={13}
              fontWeight={index === active ? 700 : 400}
              fill={index > active ? "#cbd5e1" : index === active ? "#2563eb" : "#64748b"}
            >
              {`${PATCH[index]} × ${KERNEL[index] < 0 ? `(${fmt(KERNEL[index])})` : fmt(KERNEL[index])} = ${fmt(value)}`}
            </text>
          ))}
          <line x1={232} x2={340} y1={114} y2={114} stroke="#94a3b8" strokeWidth={1} />
          <text x={232} y={134} fontSize={13} fontWeight={700} fill={active === 3 ? "#2563eb" : undefined} className={active === 3 ? undefined : "fill-foreground"}>
            {`합 = ${fmt(RUNNING[active])}${active === 3 ? " → Y[0,0]" : ""}`}
          </text>
        </svg>
      )}
    />
  );
}
