import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tv-partition — m16n8k16 A layout ((4,8),(2,2,2)):((32,1),(16,8,128)) 을 lane 5 에 대입.
 * TV layout 출력 33을 논리 16×16 좌표로 풀면 행 + 16·열 = 33 → (행 1, 열 2).
 * 이 정수는 A tensor의 memory address가 아니라 (thread, value)를 tile 좌표로 보내는 논리 좌표 encoding이다.
 * thread: lane 5 = 1 + 4·1 → 1·32 + 1·1 = 33 → (행 1, 열 2).
 * value stride 16 → 열+1, 8 → 행+8, 128 → 열+8 → 8칸.
 */
const N = 16;
const CELL = 17;
const X0 = 36;
const Y0 = 26;
const BASE = 33;

type Cell = readonly [number, number];
const toCell = (offset: number): Cell => [offset % N, Math.floor(offset / N)];
const offsetsUpTo = (modes: number): number[] =>
  [16, 8, 128].slice(0, modes).reduce<number[]>((acc, stride) => [...acc, ...acc.map((o) => o + stride)], [BASE]);

const SCENES = [
  { label: "Thread mode", summary: "1·32 + 1·1 = 33 → (1,2)", modes: 0, note: "Lane 5를 나머지 4와 몫 8로 풀면 (1,1)입니다. Stride (32,1)과 내적한 layout 출력은 33이고, 이를 논리 16×16 좌표로 풀면 33 mod 16 = 1행, 33 ÷ 16 = 2열입니다." },
  { label: "Value stride 16", summary: "+16 → 열 +1", modes: 1, note: "논리 좌표 encoding에서 16을 더하면 같은 행의 다음 열입니다. 그래서 첫 value mode는 (1,2) 옆의 (1,3)을 더합니다." },
  { label: "Value stride 8", summary: "+8 → 행 +8", modes: 2, note: "논리 번호에 8을 더하면 같은 열에서 8행 아래입니다. (9,2)와 (9,3)이 더해져 C fragment와 같은 '8행 아래 한 번 더' 모양이 됩니다." },
  { label: "Value stride 128", summary: "+128 → 열 +8 · 8칸", modes: 3, note: "논리 번호에 128을 더하면 8열 오른쪽입니다. 네 칸이 열 10·11에 한 번 더 놓여 lane 5의 A 값은 8개가 됩니다. 32 lane × 8 = 256 = 16×16입니다." },
] as const;

export default function ALayoutViz() {
  return (
    <SceneShell
      eyebrow="A TV layout"
      title="Stride 네 개가 lane 5의 A 값 8칸을 고릅니다"
      description="m16n8k16 A fragment의 TV layout은 (thread, value)를 논리 16×16 tile 좌표로 보냅니다. 빨간 칸이 lane 5가 드는 값이며 칸 안 숫자는 좌표를 열 우선으로 편 layout 출력값입니다. A tensor의 memory address가 아닙니다."
      ariaLabel="A 16 by 16 행렬에서 lane 5의 thread mode와 value mode stride가 고르는 8칸"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const current = offsetsUpTo(scene.modes);
        const previous = scene.modes === 0 ? [] : offsetsUpTo(scene.modes - 1);
        const cells = new Map(current.map((o) => [toCell(o).join(","), o]));
        return (
          <svg viewBox={`0 0 ${X0 + N * CELL + 10} ${Y0 + N * CELL + 10}`} className="mx-auto block w-full max-w-[24rem]" role="img" aria-label="A 16×16 lane 5 배치">
            {Array.from({ length: N }, (_, i) => (
              <g key={`axis${i}`}>
                <text x={X0 + i * CELL + CELL / 2} y={Y0 - 8} textAnchor="middle" fontSize={8} className="fill-muted-foreground">
                  {i}
                </text>
                <text x={X0 - 5} y={Y0 + i * CELL + 12} textAnchor="end" fontSize={8} className="fill-muted-foreground">
                  {i}
                </text>
              </g>
            ))}
            <text x={6} y={Y0 - 8} fontSize={8} className="fill-muted-foreground">행\열</text>
            {Array.from({ length: N }, (_, r) =>
              Array.from({ length: N }, (_, c) => {
                const offset = cells.get(`${r},${c}`);
                const on = offset !== undefined;
                const isNew = on && !previous.includes(offset);
                return (
                  <g key={`${r}-${c}`}>
                    <rect
                      x={X0 + c * CELL + 1}
                      y={Y0 + r * CELL + 1}
                      width={CELL - 2}
                      height={CELL - 2}
                      rx={2}
                      fill={on ? "#dc2626" : "#94a3b8"}
                      fillOpacity={on ? (isNew ? 0.35 : 0.18) : 0.08}
                      stroke={on ? "#dc2626" : "#94a3b8"}
                      strokeOpacity={on ? 1 : 0.3}
                      strokeWidth={isNew ? 1.25 : 1}
                    />
                    {on && (
                      <text x={X0 + c * CELL + CELL / 2} y={Y0 + r * CELL + 12} textAnchor="middle" fontSize={7} fontWeight={700} className="fill-foreground">
                        {offset}
                      </text>
                    )}
                  </g>
                );
              }),
            )}
          </svg>
        );
      }}
    />
  );
}
