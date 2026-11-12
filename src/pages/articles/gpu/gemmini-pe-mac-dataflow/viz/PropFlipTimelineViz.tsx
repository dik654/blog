import SceneShell from "./SceneShell";

/**
 * 본문 대응: #double-buffer — OS에서 prop=0이면 c1 누적·c2 out_c 쪽, prop=1이면 반대.
 * last_s = 직전 유효 사이클의 prop, flip = (last_s ≠ prop), shift_offset = flip ? shift : 0.
 * 사이클 열은 설명용 가정: 모든 사이클 유효, 구간 길이 2(= C₀₀의 reduction 항 2개), t0은 직전 구간.
 * 값: c1 = 11(미리 적재) → 21 → 42, 경계에서 out_c = 42 >> shift (PE.scala: c1 >> shift_offset).
 */
const COLS = ["t0", "t1", "t2", "t3", "t4", "t5"] as const;

const ROWS = [
  { name: "prop", cells: ["1", "0", "0", "1", "1", "0"] },
  { name: "last_s", cells: ["·", "1", "0", "0", "1", "1"] },
  { name: "flip", cells: ["·", "1", "0", "1", "0", "1"] },
  { name: "shift_offset", cells: ["·", "shift", "0", "shift", "0", "shift"] },
  { name: "누적하는 칸", cells: ["c2", "c1", "c1", "c2", "c2", "c1"] },
  { name: "out_c 쪽 칸", cells: ["c1", "c2", "c2", "c1", "c1", "c2"] },
  { name: "C₀₀ 값", cells: ["c1←11", "c1=21", "c1=42", "42\n≫shift", "", ""] },
] as const;

const SCENES = [
  {
    label: "t1 · 구간 시작",
    summary: "flip=1 · c1 = 21",
    note: "prop이 1에서 0으로 바뀐 첫 사이클입니다. 저장된 last_s=1과 다르니 flip=1이고, out_c 쪽으로 넘어간 c2(직전 구간에 누적한 값, 그림 밖)에 shift가 적용됩니다. c1은 미리 받아 둔 11에 2×5를 더해 21이 됩니다.",
  },
  {
    label: "t2 · 같은 구간",
    summary: "flip=0 · c1 = 42",
    note: "prop은 그대로 0입니다. last_s가 t1의 0을 저장했으니 flip=0, shift_offset=0입니다. c1은 21+3×7=42가 됩니다. 역할은 사이클마다 뒤집히지 않습니다.",
  },
  {
    label: "t3 · 다음 경계",
    summary: "flip=1 · out_c = 42≫shift",
    note: "prop이 1로 바뀌어 flip=1입니다. 이번에는 c1이 out_c 쪽으로 가서 완성된 42를 shift만큼 오른쪽으로 민 값이 나가고, c2가 다음 출력을 누적합니다.",
  },
  {
    label: "t4 · 구간 유지",
    summary: "flip=0 · shift_offset=0",
    note: "prop=1이 유지되고 last_s도 t3의 1이 되어 flip=0입니다. 같은 구간의 나머지 사이클에는 shift_offset이 0입니다.",
  },
  {
    label: "t5 · 다시 교대",
    summary: "flip=1 · 역할이 t1과 같아짐",
    note: "prop이 다시 0이 되면 flip=1이 되고 c1이 누적, c2가 out_c 쪽으로 돌아갑니다. flip은 구간마다 첫 유효 사이클에 한 번만 켜집니다.",
  },
] as const;

export default function PropFlipTimelineViz() {
  return (
    <SceneShell
      eyebrow="prop · last_s · flip"
      title="flip은 prop이 바뀐 첫 사이클에만 켜집니다"
      description="열 하나가 한 사이클입니다(가정: 모든 사이클이 유효, 구간 길이 2, t0은 직전 구간). last_s는 직전 유효 사이클의 prop을 저장한 값, flip은 그 값이 지금 prop과 다른지입니다. ·은 그림 밖 값입니다."
      ariaLabel="OS에서 prop, last_s, flip, shift_offset과 c1·c2 역할이 사이클마다 어떻게 바뀌는지"
      scenes={SCENES}
      render={(active) => {
        const col = active + 1;
        return (
          <div className="grid min-w-0 grid-cols-[4.6rem_repeat(6,minmax(0,1fr))] text-center font-mono text-[10px] leading-4 sm:grid-cols-[6.5rem_repeat(6,minmax(0,1fr))] sm:text-xs sm:leading-5">
            <div />
            {COLS.map((name, index) => (
              <div key={name} className={`border-b border-border py-1 font-bold ${index === col ? "text-primary" : "text-muted-foreground"}`}>
                {name}
              </div>
            ))}
            {ROWS.map((row) => (
              <div key={row.name} className="contents">
                <div className="flex items-center border-b border-border/60 py-1.5 pr-1 text-left font-sans font-semibold text-foreground">{row.name}</div>
                {row.cells.map((cell, index) => {
                  const current = index === col;
                  const past = index < col;
                  const flipOn = row.name === "flip" && cell === "1";
                  return (
                    <div
                      key={index}
                      className={`flex min-w-0 items-center justify-center whitespace-pre-line border-b border-border/60 px-0.5 py-1.5 ${current ? "bg-primary/10 font-bold text-foreground" : past ? "text-foreground/80" : "text-muted-foreground/50"} ${flipOn && (current || past) ? "text-red-700 dark:text-red-400" : ""}`}
                    >
                      {cell}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
