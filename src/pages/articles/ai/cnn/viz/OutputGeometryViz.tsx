import SceneShell from "./SceneShell";

/**
 * 본문 대응: #output-geometry — H=7, K=3, P=1, S=2, D=1.
 * padding 뒤 길이 9, span = 1×(3−1)+1 = 3, room = 9 − 3 = 6,
 * 시작점 0·2·4·6 → floor(6/2)+1 = 4. 다음 시작점 8은 8..10을 읽어야 해 길이 9를 넘는다.
 */
const H = 7;
const P = 1;
const K = 3;
const S = 2;
const D = 1;
const LENGTH = H + 2 * P;
const SPAN = D * (K - 1) + 1;
const ROOM = LENGTH - SPAN;
const OUT = Math.floor(ROOM / S) + 1;
const STARTS = Array.from({ length: OUT }, (_, index) => index * S);
const NEXT_START = OUT * S;

const SCENES = [
  {
    label: "Padding",
    summary: `${H} + 2×${P} = ${LENGTH}칸`,
    note: `한 축의 입력 ${H}칸 양쪽에 padding을 ${P}칸씩 붙입니다. kernel 시작점은 이 ${LENGTH}칸 위에서 움직입니다.`,
  },
  {
    label: "Span과 room",
    summary: `span ${SPAN} · room ${LENGTH} − ${SPAN} = ${ROOM}`,
    note: `Kernel tap은 K=${K}개입니다. Dilation(tap 사이 간격) D=${D}이면 tap 사이에 빈칸이 없어 kernel이 실제로 덮는 폭(span)은 ${D}×(${K}−1)+1 = ${SPAN}칸입니다. 첫 window를 맨 왼쪽에 두면 시작점은 오른쪽으로 ${ROOM}칸까지 움직일 수 있습니다.`,
  },
  {
    label: "Stride 이동",
    summary: `시작점 ${STARTS.join(", ")}`,
    note: `시작점을 S=${S}칸씩 옮깁니다. room ${ROOM}을 ${S}로 나눈 ${ROOM / S}번의 이동과 첫 위치 하나를 합해 window ${OUT}개가 생기고, 각 window가 output 한 칸이 됩니다.`,
  },
  {
    label: "멈추는 자리",
    summary: `floor(${ROOM}/${S}) + 1 = ${OUT} → Hout = ${OUT}`,
    note: `다음 시작점 ${NEXT_START}에 놓으면 window가 ${NEXT_START}~${NEXT_START + SPAN - 1}번 칸을 읽어야 하지만 축은 ${LENGTH - 1}번 칸에서 끝납니다. 그래서 output 높이는 ${OUT}입니다.`,
  },
] as const;

const CELL = 34;
const X0 = 20;
const CELL_Y = 26;
const ROW_Y = 80;
const ROW_GAP = 22;
const cx = (index: number) => X0 + index * CELL;

export default function OutputGeometryViz() {
  return (
    <SceneShell
      eyebrow="한 축의 시작점 세기"
      title="Padding한 축 위에서 kernel을 놓을 수 있는 자리를 셉니다"
      description="칸 하나가 input 한 행이고 점선 칸이 padding입니다. 아래 막대 하나가 kernel window 하나, 곧 output 한 칸입니다."
      ariaLabel="H=7, K=3, P=1, S=2에서 output 높이 4를 세는 과정"
      scenes={SCENES}
      render={(active) => {
        const shown = active === 0 ? [] : active === 1 ? STARTS.slice(0, 1) : STARTS;
        return (
          <svg
            viewBox="0 0 400 196"
            className="mx-auto h-auto w-full max-w-[580px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            {Array.from({ length: LENGTH }, (_, index) => {
              const pad = index < P || index >= LENGTH - P;
              return (
                <g key={index}>
                  <rect
                    x={cx(index)}
                    y={CELL_Y}
                    width={CELL}
                    height={CELL}
                    fill="#ffffff"
                    fillOpacity={0.02}
                    stroke="#94a3b8"
                    strokeWidth={1}
                    strokeDasharray={pad ? "3 3" : undefined}
                  />
                  <text
                    x={cx(index) + CELL / 2}
                    y={CELL_Y + CELL / 2 + 5}
                    textAnchor="middle"
                    fontSize={pad ? 12 : 14}
                    fill={pad ? "#94a3b8" : undefined}
                    className={pad ? undefined : "fill-foreground"}
                  >
                    {pad ? "pad" : `x${index - P}`}
                  </text>
                  <text x={cx(index) + CELL / 2} y={CELL_Y - 6} textAnchor="middle" fontSize={11} fill="#94a3b8">
                    {index}
                  </text>
                </g>
              );
            })}
            {active === 0 && (
              <text x={X0 + (LENGTH * CELL) / 2} y={ROW_Y + 10} textAnchor="middle" fontSize={14} fill="#64748b">
                {`입력 ${H}칸 + 양쪽 padding ${P}칸씩 = ${LENGTH}칸`}
              </text>
            )}
            {shown.map((start, row) => (
              <g key={start}>
                <rect
                  x={cx(start) + 2}
                  y={ROW_Y + row * ROW_GAP}
                  width={SPAN * CELL - 4}
                  height={17}
                  rx={3}
                  fill="#2563eb"
                  fillOpacity={0.16}
                  stroke="#2563eb"
                  strokeWidth={1}
                />
                <text
                  x={cx(start) + (SPAN * CELL) / 2}
                  y={ROW_Y + row * ROW_GAP + 13}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill="#2563eb"
                >
                  {`시작 ${start} → Y[${row}]`}
                </text>
              </g>
            ))}
            {active === 1 && (
              <g>
                <line
                  x1={cx(0) + CELL / 2}
                  x2={cx(ROOM) + CELL / 2}
                  y1={ROW_Y + 36}
                  y2={ROW_Y + 36}
                  stroke="#64748b"
                  strokeWidth={1}
                />
                <path
                  d={`M ${cx(ROOM) + CELL / 2 - 6} ${ROW_Y + 32} L ${cx(ROOM) + CELL / 2} ${ROW_Y + 36} L ${cx(ROOM) + CELL / 2 - 6} ${ROW_Y + 40}`}
                  fill="none"
                  stroke="#64748b"
                  strokeWidth={1}
                />
                <text x={cx(ROOM / 2) + CELL / 2} y={ROW_Y + 54} textAnchor="middle" fontSize={13} fill="#64748b">
                  {`시작점이 움직일 공간 room = ${ROOM}칸 (0 → ${ROOM})`}
                </text>
              </g>
            )}
            {active === 3 && (
              <g>
                <rect
                  x={cx(NEXT_START) + 2}
                  y={ROW_Y + OUT * ROW_GAP}
                  width={SPAN * CELL - 4}
                  height={17}
                  rx={3}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                />
                <text
                  x={cx(NEXT_START) - 4}
                  y={ROW_Y + OUT * ROW_GAP + 13}
                  textAnchor="end"
                  fontSize={12}
                  fontWeight={700}
                  fill="#dc2626"
                >
                  {`시작 ${NEXT_START}: 축 밖으로 넘침 ✕`}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
