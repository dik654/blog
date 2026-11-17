import SceneShell from "./SceneShell";

/**
 * 본문 대응: #equivariance 식 f(T_a x)[p] = T_a f(x)[p]와 #counterexamples의 stride phase·finite boundary.
 * 한 줄 입력(0~7번 칸, 왼쪽 −1번은 zero padding)에 pattern 값 1 하나를 두고
 * kernel w = [1, 2, 1](가정)을 같은 값으로 모든 위치에 적용한다: f[p] = x[p−1] + 2x[p] + x[p+1].
 * x=1 → [1,2,1,0,0,0,0,0], x=2 → [0,1,2,1,0,0,0,0], x=0 → [2,1,0,0,0,0,0,0].
 * Stride 2는 0·2·4·6번만 남긴다: x=1 → [1,1,0,0], x=2 → [0,2,0,0].
 */
const COLS = [0, 1, 2, 3, 4, 5, 6, 7];
const PICKED = [0, 2, 4, 6];

type Scene = {
  label: string;
  summary: string;
  note: string;
  pos: number;
  prev: number | null;
  response: readonly number[];
  stride2: readonly number[] | null;
  compareLabel: string;
  compare: readonly number[] | null;
  compareOnStride2: boolean;
};

const R_X0 = [2, 1, 0, 0, 0, 0, 0, 0];
const R_X1 = [1, 2, 1, 0, 0, 0, 0, 0];
const R_X2 = [0, 1, 2, 1, 0, 0, 0, 0];

const SCENES: readonly Scene[] = [
  {
    label: "Stride 1 기준",
    summary: "pattern x=1 → peak y=1",
    note: "같은 kernel w = [1, 2, 1](가정)을 모든 위치에 그대로 씁니다. Output p는 input p−1·p·p+1에 1·2·1을 곱해 더한 값이라, pattern이 있는 x=1 위에서 2로 가장 크고 peak는 y=1입니다.",
    pos: 1,
    prev: null,
    response: R_X1,
    stride2: null,
    compareLabel: "비교 없음",
    compare: null,
    compareOnStride2: false,
  },
  {
    label: "Stride 1 이동",
    summary: "x=2 → peak y=2 · 8칸 모두 일치",
    note: "Pattern을 x=2로 한 칸 옮겨 같은 kernel로 다시 계산하면 응답 전체가 한 칸 오른쪽으로 가고 peak는 y=2입니다. 1장면의 output을 한 칸 옮긴 T₁f(x)와 칸마다 같으므로 f(T₁x) = T₁f(x)가 성립합니다.",
    pos: 2,
    prev: 1,
    response: R_X2,
    stride2: null,
    compareLabel: "T₁f(x)",
    compare: [0, 1, 2, 1, 0, 0, 0, 0],
    compareOnStride2: false,
  },
  {
    label: "Stride 2 기준",
    summary: "0·2·4·6번만 읽음 → [1, 1, 0, 0]",
    note: "Stride 2는 위의 응답 가운데 0·2·4·6번 위치만 output으로 남깁니다. x=1의 응답 [1, 2, 1, 0, …]에서 읽으면 output은 [1, 1, 0, 0]이고, 가장 큰 값 2가 있던 1번 위치는 읽히지 않습니다.",
    pos: 1,
    prev: null,
    response: R_X1,
    stride2: [1, 1, 0, 0],
    compareLabel: "비교 없음",
    compare: null,
    compareOnStride2: true,
  },
  {
    label: "Stride 2 이동",
    summary: "[0, 2, 0, 0] ≠ 한 칸 옮긴 [0, 1, 1, 0]",
    note: "Pattern을 x=2로 한 pixel 옮기면 값 2가 짝수 위치인 2번에 와서 읽히고 output은 [0, 2, 0, 0]입니다. 3장면 output을 한 칸 옮긴 [0, 1, 1, 0]과도, 그대로 둔 [1, 1, 0, 0]과도 다릅니다. 입력 한 pixel은 output 반 칸이라 sampling 위치의 짝·홀이 바뀝니다.",
    pos: 2,
    prev: 1,
    response: R_X2,
    stride2: [0, 2, 0, 0],
    compareLabel: "T₁(3장면)",
    compare: [0, 1, 1, 0],
    compareOnStride2: true,
  },
  {
    label: "경계 근처",
    summary: "0번 칸: f(T₁x) = 1, T₁f(x) = 0",
    note: "Pattern이 x=0에 있으면 응답 1·2·1 중 왼쪽 1이 놓일 −1번 output 칸이 없어 f(x) = [2, 1, 0, …]입니다. 이를 한 칸 옮긴 T₁f(x)는 빈 0번 칸을 0으로 채우지만(가정), x=1로 옮긴 input을 직접 계산한 f(T₁x)의 0번 칸은 1이라 경계에서 등식이 깨집니다.",
    pos: 1,
    prev: 0,
    response: R_X1,
    stride2: null,
    compareLabel: "T₁f(x)",
    compare: [0, ...R_X0.slice(0, 7)],
    compareOnStride2: false,
  },
];

const ROW = "grid grid-cols-[4.75rem_repeat(9,minmax(0,1fr))] items-center gap-1 sm:grid-cols-[7rem_repeat(9,minmax(0,1fr))]";
const CELL = "flex h-8 items-center justify-center rounded-md border font-mono text-xs sm:text-sm";

function RowLabel({ text, sub }: { text: string; sub: string }) {
  return (
    <span className="min-w-0 pr-1 leading-4">
      <span className="block break-keep text-[11px] font-bold sm:text-xs">{text}</span>
      <span className="block break-keep text-[10px] text-muted-foreground">{sub}</span>
    </span>
  );
}

export default function ShiftGridViz() {
  return (
    <SceneShell
      eyebrow="한 줄 격자 · 이동 전후 비교"
      title="한 칸 옮긴 pattern이 output에서도 한 칸만 옮겨지는지 칸마다 맞춰 봅니다"
      description="0~7번 칸의 한 줄 입력에 값 1인 pattern 하나를 둡니다(가정). 맨 왼쪽 −1번은 zero padding, 입력 줄의 점선 칸은 이동 전 위치, 옅은 테두리는 peak를 만든 kernel 창(peak 위치와 양옆)입니다. 비교 줄의 ✓·✗는 실제 output(stride 1은 응답 f, stride 2는 stride 2 output)과 같은지를 칸마다 표시합니다."
      ariaLabel="stride 1 이동, stride 2 sampling 위상, 경계에서의 이동 관계를 칸 단위로 비교하는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const peak = scene.response.indexOf(Math.max(...scene.response));
        const target = scene.compareOnStride2 ? scene.stride2 : scene.response;
        return (
          <div className="min-w-0 space-y-2">
            <div className={ROW}>
              <span className="text-[10px] text-muted-foreground">칸 번호</span>
              <span className="text-center font-mono text-[10px] text-muted-foreground">−1</span>
              {COLS.map((col) => (
                <span key={col} className="text-center font-mono text-[10px] text-muted-foreground">{col}</span>
              ))}
            </div>

            <div className={ROW}>
              <RowLabel text="입력" sub={`pattern x=${scene.pos}`} />
              <span className={`${CELL} border-dashed border-border text-muted-foreground`}>0</span>
              {COLS.map((col) => {
                const on = col === scene.pos;
                const was = col === scene.prev;
                const inWindow = Math.abs(col - peak) <= 1;
                return (
                  <span
                    key={col}
                    className={`${CELL} ${on ? "border-primary bg-primary/15 font-bold text-primary" : was ? "border-dashed border-primary/60 text-muted-foreground" : inWindow ? "border-primary/40" : "border-border text-muted-foreground"}`}
                  >
                    {on ? 1 : 0}
                  </span>
                );
              })}
            </div>

            <div className={ROW}>
              <RowLabel text="응답 f" sub={scene.prev === null ? "f(x) · w 1·2·1" : "f(T₁x) · w 1·2·1"} />
              <span className={`${CELL} border-dashed border-border/50 text-muted-foreground/60`}>—</span>
              {COLS.map((col) => {
                const value = scene.response[col];
                const read = scene.stride2 !== null && PICKED.includes(col);
                return (
                  <span
                    key={col}
                    className={`${CELL} ${col === peak ? "border-primary font-bold text-primary" : "border-border"} ${scene.stride2 !== null && !read ? "opacity-40" : ""} ${read ? "underline decoration-2 underline-offset-4" : ""}`}
                  >
                    {value}
                  </span>
                );
              })}
            </div>

            <div className={ROW}>
              <RowLabel text="Stride 2 output" sub={scene.stride2 ? "밑줄 칸만 읽음" : "이 장면은 stride 1"} />
              <span />
              {COLS.map((col) => {
                const slot = PICKED.indexOf(col);
                if (scene.stride2 === null || slot < 0) return <span key={col} className={`${CELL} border-transparent`} />;
                return (
                  <span key={col} className={`${CELL} border-primary/70 font-bold`}>
                    {scene.stride2[slot]}
                  </span>
                );
              })}
            </div>

            <div className={ROW}>
              <RowLabel text="비교" sub={scene.compareLabel} />
              <span />
              {COLS.map((col) => {
                const slot = scene.compareOnStride2 ? PICKED.indexOf(col) : col;
                if (scene.compare === null || target === null || slot < 0) {
                  return <span key={col} className={`${CELL} border-dashed border-border/40`} />;
                }
                const same = scene.compare[slot] === target[slot];
                return (
                  <span
                    key={col}
                    className={`${CELL} ${same ? "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]" : "border-[#dc2626] font-bold text-[#b91c1c] dark:text-[#f87171]"}`}
                  >
                    {scene.compare[slot]}
                    <span className="ml-0.5 text-[10px]" aria-hidden>{same ? "✓" : "✗"}</span>
                  </span>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
