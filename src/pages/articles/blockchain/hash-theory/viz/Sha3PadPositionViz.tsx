import SceneShell from "./HashSceneShell";

/**
 * 본문 대응: #source-sponge — pad는 현재 위치 pos에 06을, state[136/8−1]=state[16]의 최상위 비트(바이트 135)에 80을 XOR한다.
 * pos=3: word_offset 3/8=0, byte_offset 3%8=3. pos=135: 같은 바이트에 06 XOR 80 = 86.
 * pos=136: 블록이 이미 차서 먼저 처리하고, 새 블록의 위치 0에 06, 바이트 135에 80.
 */
const RATE = 136;
const LANES = RATE / 8;
type Kind = "data" | "pad06" | "pad80" | "both" | "zero" | "none";

const COLORS: Record<Kind, string> = {
  data: "#2563eb",
  pad06: "#d97706",
  pad80: "#dc2626",
  both: "#7c3aed",
  zero: "#e2e8f0",
  none: "transparent",
};

function block(pos: number): Kind[] {
  return Array.from({ length: RATE }, (_, i) =>
    i < pos ? "data" : i === pos && i === RATE - 1 ? "both" : i === pos ? "pad06" : i === RATE - 1 ? "pad80" : "zero",
  );
}

const EMPTY: Kind[] = Array.from({ length: RATE }, () => "none");

const SCENES = [
  { label: "위치 3 (abc)", summary: "06 → 바이트 3 · 80 → 바이트 135", blocks: [block(3), EMPTY], callouts: ["바이트 3 = 06 · word_offset 3/8 = 0, byte_offset 3%8 = 3", "바이트 135 = 80 · state[16]의 최상위 비트"], note: "06은 첫 값의 24번째 비트부터(바이트 3), 80은 state[16]의 최상위 비트(바이트 135)에 XOR합니다." },
  { label: "위치 135", summary: "06 XOR 80 = 86 · 한 블록", blocks: [block(135), EMPTY], callouts: ["바이트 135 = 06 XOR 80 = 86", "두 연산이 같은 마지막 바이트를 바꿈"], note: "입력이 135바이트이면 06과 80이 같은 마지막 바이트에 들어가 XOR한 86이 되고, 블록은 여전히 하나입니다." },
  { label: "위치 136", summary: "입력이 블록을 채움 → 새 패딩 블록", blocks: [block(RATE), block(0)], callouts: ["블록 1: 입력 136바이트를 먼저 처리", "블록 2: 바이트 0 = 06, 바이트 135 = 80"], note: "136바이트를 채운 블록을 먼저 처리하고 패딩만 담은 새 블록이 필요합니다. 135와 136의 차이는 블록 하나입니다." },
] as const;

export default function Sha3PadPositionViz() {
  return (
    <SceneShell
      eyebrow="SHA3 패딩 위치"
      title="06은 현재 위치에, 80은 136바이트 블록의 마지막 바이트에 들어갑니다"
      description="세로 한 줄이 64비트 값 하나(8바이트)이고 위에서 아래로 바이트 0부터 7까지입니다. 가로로 값 0부터 16까지 17개가 rate 136바이트입니다."
      ariaLabel="SHA3-256 패딩에서 현재 위치 3, 135, 136일 때 06과 80의 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid gap-2 sm:gap-3">
              {scene.blocks.map((kinds, b) => {
                const absent = kinds[0] === "none";
                return (
                  <div key={b} className="min-w-0">
                    <p className="mb-0.5 text-[11px] font-semibold sm:mb-1 sm:text-xs">
                      블록 {b + 1}
                      {absent ? <span className="ml-1 font-normal text-muted-foreground">· 없음</span> : null}
                    </p>
                    <div
                      className={`grid grid-flow-col grid-rows-8 gap-[2px] rounded-md border p-1 ${absent ? "border-dashed border-border/50" : "border-border"}`}
                      style={{ gridTemplateColumns: `repeat(${LANES}, minmax(0, 1fr))` }}
                    >
                      {kinds.map((kind, i) => (
                        <span key={i} className="h-2 rounded-[1px] sm:h-4 sm:rounded-[2px]" style={{ backgroundColor: COLORS[kind] }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-5 gap-1.5 text-[11px] sm:text-xs">
              {(
                [
                  ["data", "입력"],
                  ["zero", "00"],
                  ["pad06", "06"],
                  ["pad80", "80"],
                  ["both", "86"],
                ] as const
              ).map(([kind, label]) => (
                <div key={kind} className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 shrink-0 rounded-sm border border-border" style={{ backgroundColor: COLORS[kind] }} />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <ul className="mt-2 hidden space-y-1 font-mono text-xs sm:block">
              {scene.callouts.map((line) => (
                <li key={line} className="border-l border-primary/50 pl-3">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
