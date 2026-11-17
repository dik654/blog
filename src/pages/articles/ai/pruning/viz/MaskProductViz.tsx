import PruningSceneShell from "./PruningSceneShell";

/**
 * 본문 대응: #mask-shape — W′ = M ⊙ W, ρ = ‖M‖₀ / N, s = 1 − ρ.
 * 본문 숫자: N = 10, K = 4 → ρ = 0.4, s = 0.6. Dense GEMM이면 계산 shape는 그대로.
 * weight 값과 어느 자리를 남기는지는 설명용 가정입니다.
 */
const WEIGHTS: readonly number[] = [0.8, -0.1, 0.2, 1.2, -0.6, 0.1, 0.3, -0.9, 0.2, -0.3];
const MASK: readonly number[] = [1, 0, 0, 1, 1, 0, 0, 1, 0, 0];
const N = WEIGHTS.length;
const K = MASK.reduce<number>((sum, m) => sum + m, 0);
const RHO = K / N;
const ZERO_SLOTS = N - K;

const fmt = (value: number) => (value === 0 ? "0" : `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(1)}`);

const SCENES = [
  { label: "대상 weight 10개", summary: `N = ${N}`, note: "Pruning 분모에 넣을 대상 자리를 먼저 고정합니다. 여기서는 weight 10개이며 값은 설명용 가정입니다." },
  { label: "같은 shape의 mask", summary: `‖M‖₀ = ${K}`, note: "Mask M은 W와 자리 수가 같은 0/1 표시입니다. 1은 남길 연결, 0은 제거할 연결이고, 1을 세면 남은 수 K = 4입니다. 어느 자리를 남길지 고르는 방법은 이 글의 범위 밖이라 임의로 정했습니다(가정)." },
  { label: "자리별로 곱하기", summary: `ρ = ${K}/${N} = ${RHO.toFixed(1)} · s = 1 − ${RHO.toFixed(1)} = ${(1 - RHO).toFixed(1)}`, note: "M ⊙ W는 같은 자리끼리만 곱합니다. Mask가 0인 여섯 자리는 0이 되고, 1인 네 자리는 원래 값을 유지합니다. 남긴 비율이 density ρ, 나머지가 sparsity s입니다." },
  { label: "Dense로 실행하면", summary: `곱셈 ${N}번 그대로 · 0 곱셈 ${ZERO_SLOTS}번`, note: "W′를 dense format과 dense GEMM으로 실행하면 계산 shape는 그대로입니다. 0이 된 여섯 자리도 입력과 곱해지므로, sparsity 0.6이 곧 계산 60% 감소를 뜻하지는 않습니다." },
] as const;

const BLUE = "#2563eb";

function Row({ name, cells, show, tone }: { name: string; cells: readonly string[]; show: boolean; tone: (index: number) => "keep" | "drop" | "plain" }) {
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-2">
      <span className={`font-mono text-sm font-bold ${show ? "" : "text-muted-foreground/40"}`}>{name}</span>
      <div className="grid grid-cols-10 gap-1">
        {cells.map((cell, index) => {
          const kind = tone(index);
          return (
            <div
              key={index}
              className={`flex h-8 min-w-0 items-center justify-center rounded border text-[10px] font-semibold tabular-nums sm:text-xs ${
                !show
                  ? "border-dashed border-border/50 text-transparent"
                  : kind === "keep"
                    ? "border-[#2563eb] text-[#2563eb]"
                    : kind === "drop"
                      ? "border-dashed border-border text-muted-foreground"
                      : "border-border"
              }`}
              style={show && kind === "keep" ? { backgroundColor: `${BLUE}14` } : undefined}
            >
              {cell}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Picture({ active }: { active: number }) {
  const keepTone = (index: number): "keep" | "drop" => (MASK[index] === 1 ? "keep" : "drop");
  const masked = WEIGHTS.map((w, i) => fmt(w * MASK[i]));
  return (
    <div className="space-y-2" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Row name="W" cells={WEIGHTS.map(fmt)} show tone={(index) => (active >= 1 ? keepTone(index) : "plain")} />
      <Row name="M" cells={MASK.map(String)} show={active >= 1} tone={keepTone} />
      <Row name="W′" cells={masked} show={active >= 2} tone={keepTone} />
      <Row name="×x" cells={MASK.map((m) => (m === 1 ? "w×x" : "0×x"))} show={active >= 3} tone={() => "plain"} />
      <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-2 pt-1 text-xs">
        <span />
        <p className={active >= 3 ? "font-semibold" : "text-muted-foreground/40"}>
          dense GEMM은 칸 {N}개를 모두 곱합니다. 남긴 {K}칸만 계산하려면 그에 맞는 저장 형식과 kernel이 필요합니다.
        </p>
      </div>
    </div>
  );
}

export default function MaskProductViz() {
  return (
    <PruningSceneShell
      eyebrow="W′ = M ⊙ W"
      title="Mask를 자리별로 곱하면 4칸이 남고, dense 실행은 여전히 10칸을 계산합니다"
      description="칸 하나가 weight 하나입니다. 파란 칸은 남긴 연결, 점선 칸은 제거한 연결이고, w는 그 칸의 남은 weight, x는 이 weight들과 곱해질 입력입니다. 값과 남길 자리는 설명용 가정입니다."
      ariaLabel="weight 10개에 mask를 곱해 density 0.4, sparsity 0.6을 얻고 dense 실행은 10칸을 계산하는 과정"
      scenes={SCENES}
      render={(active) => <Picture active={active} />}
    />
  );
}
