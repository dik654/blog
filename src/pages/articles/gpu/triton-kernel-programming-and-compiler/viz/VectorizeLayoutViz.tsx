import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #compiler-pipeline — 한 thread에 연속 원소를 배정하고 정렬·16 배수가 보장되면 load가
 * 128-bit 명령 하나로 합쳐지고, thread들의 연속 주소로 coalescing도 얻습니다. Stride면 사라집니다.
 * fp32(128-bit = 원소 4개)와 thread당 4원소, stride 2는 그림을 위한 가정입니다.
 */
interface LayoutScene extends ShellScene {
  mode: "lanes" | "merged" | "coalesced" | "stride";
  loads: string;
}

const SCENES: readonly LayoutScene[] = [
  { label: "연속 원소 배정", summary: "thread 0 · 원소 0~3", note: "Layout이 한 thread에 연속 원소 여러 개를 배정했습니다. 아직 원소마다 load 하나로 그렸습니다.", mode: "lanes", loads: "load 4개" },
  { label: "128-bit 하나로", summary: "load 4개 → 1개", note: "Pointer 정렬과 16 배수 specialization이 보장되면 LLVM으로 낮출 때 load가 128-bit 명령 하나로 합쳐집니다.", mode: "merged", loads: "128-bit load 1개" },
  { label: "이웃 thread도 연속", summary: "coalescing도 함께", note: "Warp 안의 thread들이 연속 주소를 받아 coalescing도 얻습니다. 이웃 thread들의 메모리 요청을 하나로 합치는 일입니다.", mode: "coalesced", loads: "thread 네 개의 연속 구간" },
  { label: "Stride로 띄엄띄엄", summary: "vectorization 사라짐", note: "Offset이 띄엄띄엄이면 연속 배정을 못 해 vectorization이 사라지고, 성능이 몇 배 떨어져도 코드는 그대로 컴파일됩니다.", mode: "stride", loads: "load 4개 · 컴파일 오류 없음" },
];

const CELLS = 16;
const CELL = 19;
const X0 = 10;
const MEM_Y = 26;
const THREAD_Y = 104;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const SLATE = "#64748b";
const THREAD_COLORS = [BLUE, AMBER, "#16a34a", "#db2777"];

const cx = (index: number) => X0 + index * CELL + (CELL - 1) / 2;

function ownerOf(mode: LayoutScene["mode"], index: number) {
  if (mode === "stride") return index < 8 && index % 2 === 0 ? 0 : -1;
  if (mode === "coalesced") return Math.floor(index / 4);
  return index < 4 ? 0 : -1;
}

export default function VectorizeLayoutViz() {
  return (
    <SceneShell
      eyebrow="연속 배정의 효과"
      title="연속 주소를 받은 thread만 load를 한 번에 묶을 수 있습니다"
      description="위 줄은 메모리 원소, 아래 막대는 thread의 load입니다. fp32로 잡으면 128-bit에 원소 4개가 들어갑니다(가정)."
      note="Thread마다 원소 4개, stride 2는 예시입니다(가정)."
      ariaLabel="연속 offset과 stride offset에서 load가 합쳐지는지 비교"
      scenes={SCENES}
      render={(active) => {
        const { mode, loads } = SCENES[active];
        const threadStarts = mode === "coalesced" ? [0, 4, 8, 12] : [0];
        return (
          <svg viewBox="0 0 324 170" className="mx-auto block w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={16} fontSize={12} fill="currentColor">메모리 offset</text>
            {Array.from({ length: CELLS }, (_, index) => {
              const owner = ownerOf(mode, index);
              const color = owner >= 0 ? THREAD_COLORS[owner] : SLATE;
              return (
                <g key={index}>
                  <rect x={X0 + index * CELL} y={MEM_Y} width={CELL - 1} height={26} rx={2} fill={color} fillOpacity={owner >= 0 ? 0.3 : 0.07} stroke={color} strokeWidth={1} />
                  <text x={cx(index)} y={MEM_Y + 17} textAnchor="middle" fontSize={10} fill="currentColor">{index}</text>
                </g>
              );
            })}
            {(mode === "lanes" || mode === "stride") &&
              [0, 1, 2, 3].map((lane) => {
                const at = mode === "stride" ? lane * 2 : lane;
                return <line key={lane} x1={cx(at)} y1={MEM_Y + 26} x2={cx(lane) + 1} y2={THREAD_Y} stroke={BLUE} strokeWidth={1} />;
              })}
            {(mode === "merged" || mode === "coalesced") &&
              threadStarts.map((start, index) => (
                <line key={start} x1={cx(start) + 1.5 * CELL} y1={MEM_Y + 26} x2={cx(start) + 1.5 * CELL} y2={THREAD_Y} stroke={THREAD_COLORS[index]} strokeWidth={1.25} />
              ))}
            {threadStarts.map((start, index) => (
              <g key={start}>
                <rect x={X0 + start * CELL} y={THREAD_Y} width={4 * CELL - 1} height={24} rx={2} fill={THREAD_COLORS[index]} fillOpacity={0.3} stroke={THREAD_COLORS[index]} strokeWidth={1} />
                <text x={X0 + start * CELL + 2 * CELL} y={THREAD_Y + 16} textAnchor="middle" fontSize={11} fill="currentColor">thread {index}</text>
              </g>
            ))}
            <text x={162} y={156} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{loads}</text>
          </svg>
        );
      }}
    />
  );
}
