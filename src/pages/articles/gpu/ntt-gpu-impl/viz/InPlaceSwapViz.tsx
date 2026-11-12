import SceneShell from "./SceneShell";

/**
 * 본문 대응: #permutation-plan "In-place permutation은 pair를 한 번만 swap해야 합니다. Out-of-place permutation에는
 * 별도 buffer와 read/write traffic이 듭니다."
 * N=8, k=3의 rev₃(i)는 글의 식으로 계산합니다. "i < rev(i)일 때만 swap"은 한 번만 swap하는 방법의 한 예(가정)입니다.
 */
const N = 8;
const K = 3;
const rev = (i: number) =>
  Array.from({ length: K }, (_, r) => ((i >> r) & 1) << (K - 1 - r)).reduce<number>((sum, bit) => sum + bit, 0);
const REV = Array.from({ length: N }, (_, i) => rev(i));
const bits = (i: number) => i.toString(2).padStart(K, "0");

type Mode = "map" | "once" | "twice" | "copy";

type Scene = { label: string; summary: string; note: string; mode: Mode };

const SCENES: readonly Scene[] = [
  {
    label: "뒤집으면 어디로 가나",
    summary: "1↔4 · 3↔6 · 0,2,5,7 제자리",
    note: "3비트 index를 뒤집으면 001₂=1은 100₂=4로, 011₂=3은 110₂=6으로 갑니다. 000·010·101·111은 뒤집어도 같아 제자리에 남습니다. 바꿀 짝은 (1,4)와 (3,6) 두 개뿐입니다.",
    mode: "map",
  },
  {
    label: "pair마다 swap 한 번",
    summary: "x0 x4 x2 x6 x1 x5 x3 x7",
    note: "같은 배열 안에서 자리를 바꾸는 in-place permutation입니다. 예를 들어 i < rev(i)일 때만 swap하면(가정) i=1과 i=3에서만 바꾸고 i=4·6은 건너뜁니다. 각 pair가 정확히 한 번 바뀌어 bit-reversed order가 됩니다.",
    mode: "once",
  },
  {
    label: "모든 i에서 swap하면",
    summary: "다시 x0 x1 … x7 · permutation 사라짐",
    note: "i마다 무조건 i와 rev(i)를 바꾸면 i=1에서 바꾼 짝을 i=4에서 다시 바꾸고, i=3의 짝을 i=6에서 되돌립니다. 결과는 원래 순서와 같아 길이는 맞지만 order 계약이 틀린 배열이 됩니다.",
    mode: "twice",
  },
  {
    label: "Out-of-place",
    summary: "별도 buffer · 8 read + 8 write",
    note: "다른 buffer에 쓰는 out-of-place permutation은 swap 중복 문제가 없지만, N칸짜리 별도 buffer가 필요하고 원소 8개를 모두 한 번 읽고 한 번 씁니다. 원소가 32B라면(4절의 가정 크기) buffer는 8×32 = 256B입니다.",
    mode: "copy",
  },
];

const ONCE = Array.from({ length: N }, (_, i) => REV[i]);
const TWICE = Array.from({ length: N }, (_, i) => i);

function action(mode: Mode, i: number) {
  const r = REV[i];
  if (mode === "map") return `→ ${r}`;
  if (mode === "copy") return `→ buf[${r}]`;
  if (r === i) return "제자리";
  if (mode === "once") return i < r ? `${i}↔${r}` : "건너뜀";
  return i < r ? `${i}↔${r}` : `${i}↔${r} 되돌림`;
}

function actionTone(mode: Mode, i: number) {
  const r = REV[i];
  if (r === i || mode === "map" || mode === "copy") return "border-border text-muted-foreground";
  if (i < r) return "border-[#2563eb] font-semibold text-foreground";
  return mode === "twice" ? "border-[#dc2626] font-semibold text-[#b91c1c] dark:text-[#f87171]" : "border-dashed border-border/60 text-muted-foreground/60";
}

export default function InPlaceSwapViz() {
  return (
    <SceneShell
      eyebrow="In-place bit reversal"
      title="짝을 두 번 바꾸면 bit reversal이 없던 일이 됩니다"
      description="N=8 배열입니다. 맨 위 줄은 원래 index와 3비트 표기, 가운데 줄은 loop가 index i에서 하는 일, 맨 아래 줄은 끝난 뒤 각 칸에 들어 있는 원소입니다."
      ariaLabel="N=8 bit reversal을 in-place로 한 번 swap, 두 번 swap, out-of-place로 했을 때의 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const result = scene.mode === "twice" ? TWICE : scene.mode === "map" ? null : ONCE;
        const resultLabel = scene.mode === "copy" ? "새 buffer" : "끝난 뒤";
        const wrong = scene.mode === "twice";
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground">index</span>
              <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
                {REV.map((r, i) => (
                  <div key={i} className={`rounded border bg-background px-1 py-1 text-center ${r === i ? "border-border" : "border-[#2563eb]"}`}>
                    <span className="block text-xs font-bold">x{i}</span>
                    <span className="block font-mono text-[10px] text-muted-foreground">{bits(i)}₂</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground">i에서</span>
              <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
                {REV.map((_, i) => (
                  <div key={i} className={`flex min-h-[2.5rem] items-center justify-center rounded border bg-background px-1 py-1 text-center font-mono text-[10px] leading-4 ${actionTone(scene.mode, i)}`}>
                    {action(scene.mode, i)}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground">{resultLabel}</span>
              <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
                {Array.from({ length: N }, (_, slot) => {
                  const item = result === null ? null : result[slot];
                  const moved = item !== null && item !== slot;
                  return (
                    <div
                      key={slot}
                      className={`rounded border bg-background px-1 py-1.5 text-center text-xs font-bold ${
                        item === null ? "border-dashed border-border/60 text-muted-foreground/50" : wrong ? "border-[#dc2626]" : moved ? "border-[#2563eb]" : "border-border"
                      }`}
                    >
                      {item === null ? "?" : `x${item}`}
                    </div>
                  );
                })}
              </div>
            </div>
            <p className={`pt-1 text-xs font-bold ${wrong ? "text-[#b91c1c] dark:text-[#f87171]" : "text-foreground"}`}>
              {scene.mode === "map"
                ? "목표: 칸 i에 x_rev(i)가 오도록"
                : wrong
                  ? "원래 순서 그대로 · bit-reversed가 아님"
                  : scene.mode === "copy"
                    ? "원본 8칸 + buffer 8칸 · 읽기 8 · 쓰기 8"
                    : "bit-reversed order 완성 · swap 2번"}
            </p>
          </div>
        );
      }}
    />
  );
}
