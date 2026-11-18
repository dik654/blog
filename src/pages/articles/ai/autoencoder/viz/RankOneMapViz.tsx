import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rank-k — M=ED, rank(M)≤k.
 * 첫 Viz의 중심화한 점 A′=(0.1,−0.1)을 쓴다. n=2, k=1.
 * E=(1,−1)ᵀ, D=(0.5,−0.5)는 x₂=−x₁ 방향을 남기는 한 가지 선택(가정).
 * z=A′E=0.1+0.1=0.2, x̂=zD=(0.1,−0.1), M=ED=[[0.5,−0.5],[−0.5,0.5]] (둘째 행=−1×첫째 행 → rank 1).
 * E=(2,−2)ᵀ, D=(0.25,−0.25)이면 z=0.4이지만 ED는 같은 M.
 */
type Pair = { e: readonly [string, string]; d: readonly [string, string]; z: string };

const FIRST: Pair = { e: ["1", "−1"], d: ["0.5", "−0.5"], z: "0.2" };
const SECOND: Pair = { e: ["2", "−2"], d: ["0.25", "−0.25"], z: "0.4" };

const SCENES = [
  {
    label: "Encoder E: 2칸 → 1칸",
    summary: "z = 0.1×1 + (−0.1)×(−1) = 0.2",
    note: "E는 2행 1열이라 두 좌표를 섞어 숫자 하나 z만 남깁니다. 중간 좌표가 k=1개뿐이므로 이 통로를 지나는 정보는 한 방향의 크기 하나입니다. E=(1,−1)ᵀ는 x₂=−x₁ 방향을 남기려고 고른 값입니다(가정).",
    pair: FIRST,
    focus: "encode",
  },
  {
    label: "Decoder D: 1칸 → 2칸",
    summary: "x̂ = 0.2 × (0.5, −0.5) = (0.1, −0.1)",
    note: "D는 1행 2열이라 숫자 하나를 다시 두 좌표로 펼칩니다. 펼친 점은 언제나 (0.5, −0.5)의 배수, 곧 x₂=−x₁ 직선 위에 놓입니다. 이 예에서는 A′가 원래 그 직선 위에 있어 그대로 되살아납니다.",
    pair: FIRST,
    focus: "decode",
  },
  {
    label: "M = ED로 합치기",
    summary: "(2×1)·(1×2) = 2×2, rank 1",
    note: "E와 D를 먼저 곱하면 2×2 행렬 M 하나가 됩니다. 칸은 네 개지만 둘째 행이 첫째 행의 −1배라 독립된 방향은 하나뿐입니다(rank 1). 중간 좌표 수 k=1이 rank의 상한을 만든 것입니다. A′M도 (0.1, −0.1)로 같은 복원입니다.",
    pair: FIRST,
    focus: "merge",
  },
  {
    label: "다른 E, D · 같은 M",
    summary: "z = 0.4로 바뀌어도 M은 그대로",
    note: "E를 두 배로, D를 절반으로 바꾸면 중간값 z는 0.2에서 0.4가 되지만 곱 ED는 같은 M입니다. 그래서 최적화 문제는 E와 D 각각이 아니라 M 하나를 고르는 문제로 바뀌고, 중간 좌표의 크기는 하나로 정해지지 않습니다.",
    pair: SECOND,
    focus: "rescale",
  },
] as const;

const M_CELLS = ["0.5", "−0.5", "−0.5", "0.5"] as const;

function Cell({ value, tone }: { value: string; tone: "on" | "changed" | "off" }) {
  const cls =
    tone === "changed"
      ? "border-amber-600 bg-amber-500/10 font-bold text-amber-800 dark:text-amber-300"
      : tone === "on"
        ? "border-primary bg-primary/[.08] font-bold"
        : "border-border text-muted-foreground";
  return <span className={`grid h-8 w-10 place-items-center sm:h-9 sm:w-12 rounded-sm border font-mono text-xs ${cls}`}>{value}</span>;
}

function Matrix({
  name,
  shape,
  cols,
  values,
  on,
  changed = false,
}: {
  name: string;
  shape: string;
  cols: number;
  values: readonly string[];
  on: boolean;
  changed?: boolean;
}) {
  const tone = changed ? "changed" : on ? "on" : "off";
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-xs font-bold ${on || changed ? "text-foreground" : "text-muted-foreground"}`}>{name}</span>
      <span className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
        {values.map((value, index) => (
          <Cell key={`${name}-${index}`} value={value} tone={tone} />
        ))}
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">{shape}</span>
    </div>
  );
}

function Op({ children }: { children: string }) {
  return <span className="self-center pb-4 font-mono text-sm text-muted-foreground">{children}</span>;
}

export default function RankOneMapViz() {
  return (
    <SceneShell
      eyebrow="n=2 · k=1"
      title="두 행렬을 곱하면 한 방향만 남기는 M 하나가 됩니다"
      description="첫 그림의 중심화한 점 A′=(0.1, −0.1)을 그대로 씁니다. E는 encoder 행렬, D는 decoder 행렬이고, rank는 행렬이 통과시키는 독립 방향의 수입니다. E와 D의 값은 설명을 위해 고른 한 가지 예입니다(가정)."
      ariaLabel="encoder 행렬과 decoder 행렬을 곱해 rank 1 복원 행렬 M을 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const p = s.pair;
        const rescale = s.focus === "rescale";
        const enc = s.focus === "encode" || rescale;
        const dec = s.focus === "decode" || rescale;
        const merge = s.focus === "merge" || rescale;
        return (
          <div className="min-w-0 space-y-4">
            <div className="rounded-lg border border-border px-3 py-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">한 점을 통과시키기: A′ → z → x̂</p>
              <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-3">
                <Matrix name="A′" shape="1×2" cols={2} values={["0.1", "−0.1"]} on={s.focus === "encode"} />
                <Op>·</Op>
                <Matrix name="E" shape="2×1" cols={1} values={p.e} on={enc} changed={rescale} />
                <Op>=</Op>
                <Matrix name="z" shape="1×1" cols={1} values={[p.z]} on={enc || s.focus === "decode"} changed={rescale} />
                <span className="basis-full sm:hidden" aria-hidden />
                <span className="self-center pb-4 font-mono text-sm text-muted-foreground"><span className="sm:hidden">z </span>·</span>
                <Matrix name="D" shape="1×2" cols={2} values={p.d} on={dec} changed={rescale} />
                <Op>=</Op>
                <Matrix name="x̂" shape="1×2" cols={2} values={["0.1", "−0.1"]} on={dec} />
              </div>
            </div>
            <div className="rounded-lg border border-border px-3 py-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">두 행렬을 먼저 곱하기: E · D = M</p>
              <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-3">
                <Matrix name="E" shape="2×1" cols={1} values={p.e} on={s.focus === "merge"} changed={rescale} />
                <Op>·</Op>
                <Matrix name="D" shape="1×2" cols={2} values={p.d} on={s.focus === "merge"} changed={rescale} />
                <Op>=</Op>
                <Matrix name="M" shape="2×2 · rank 1" cols={2} values={M_CELLS} on={merge} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
