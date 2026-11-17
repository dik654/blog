import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 3중 복제(원본의 3배) 대 (n=10,k=6) 100 MiB symbol,
 * 그리고 R=k/n=6/10과 O_extra=(n−k)/k=4/6이 분모가 다르다는 해석.
 * 칸 하나 = 100 MiB. 3중 복제 18칸 = 1,800 MiB, (10,6) 10칸 = 1,000 MiB.
 */
const N = 10;
const K = 6;
const SYMBOL_MIB = 100;
const COPIES = 3;
const pct = (v: number) => `${(v * 100).toFixed(1).replace(/\.0$/, "")}%`;

type Kind = "source" | "repair" | "copy" | "empty";
type Mark = "none" | "num" | "den" | "both";

const SCENES = [
  {
    label: "3중 복제",
    summary: `${COPIES * K}칸 = ${(COPIES * K * SYMBOL_MIB).toLocaleString("en-US")} MiB · 원본의 ${COPIES}배`,
    note: "원본 600 MiB를 세 저장소에 그대로 둡니다. 한 줄만 살아 있어도 읽을 수 있지만 칸 수는 원본 줄의 세 배입니다.",
  },
  {
    label: "(10,6) 조각",
    summary: `${N}칸 = ${(N * SYMBOL_MIB).toLocaleString("en-US")} MiB · 아무 ${K}칸으로 복원`,
    note: "Source 6칸에 repair 4칸을 더한 한 줄입니다. MDS profile이면 위치가 확인된 symbol 4칸이 없어도 남은 6칸으로 원본을 복원합니다.",
  },
  {
    label: "Code rate",
    summary: `R = ${K}/${N} = ${pct(K / N)}`,
    note: `분모는 저장한 전체 ${N}칸입니다. 그중 source가 ${K}칸이라 ${pct(K / N)}이고, repair 4칸은 전체의 ${pct((N - K) / N)}입니다.`,
  },
  {
    label: "Extra overhead",
    summary: `O = ${N - K}/${K} ≈ ${pct((N - K) / K)} 추가`,
    note: `분모가 원본 ${K}칸으로 바뀝니다. 같은 repair 4칸이 원본 기준으로는 ${pct((N - K) / K)}만큼 더 저장한 양입니다. '전체의 40%'와 '원본보다 66.7% 더'는 다른 문장입니다.`,
  },
] as const;

function Cell({ kind, text, mark }: { kind: Kind; text: string; mark: Mark }) {
  const base = "flex h-9 min-w-0 items-center justify-center rounded-sm border font-mono text-[10px] font-bold sm:text-xs";
  const tone =
    kind === "empty"
      ? "border-transparent"
      : kind === "repair"
        ? "border-[#2563eb] bg-[#2563eb]/10 text-[#1d4ed8] dark:text-[#93c5fd]"
        : "border-foreground/30 bg-foreground/5";
  const ring =
    mark === "both"
      ? "border-dashed outline outline-1 outline-offset-1 outline-[#d97706]"
      : mark === "num"
        ? "outline outline-1 outline-offset-1 outline-[#d97706]"
        : mark === "den"
          ? "border-dashed"
          : "";
  return <div className={`${base} ${tone} ${ring}`}>{text}</div>;
}

function Row({ label, cells }: { label: string; cells: { kind: Kind; text: string; mark: Mark }[] }) {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[5rem_minmax(0,1fr)]">
      <span className="text-[11px] text-muted-foreground sm:text-xs">{label}</span>
      <div className="grid grid-cols-10 gap-1">
        {cells.map((cell, i) => (
          <Cell key={i} {...cell} />
        ))}
      </div>
    </div>
  );
}

const copyRow = Array.from({ length: N }, (_, i) =>
  i < K ? { kind: "copy" as Kind, text: `S${i}`, mark: "none" as Mark } : { kind: "empty" as Kind, text: "", mark: "none" as Mark },
);
const emptyRow = Array.from({ length: N }, () => ({ kind: "empty" as Kind, text: "", mark: "none" as Mark }));

function codedRow(active: number) {
  return Array.from({ length: N }, (_, i) => {
    const isSource = i < K;
    const mark: Mark =
      // Code rate의 분모는 전체 10칸이라 source 6칸은 분자이면서 분모에도 들어갑니다.
      active === 2 ? (isSource ? "both" : "den") : active === 3 ? (isSource ? "den" : "num") : "none";
    return { kind: (isSource ? "source" : "repair") as Kind, text: isSource ? `S${i}` : `R${i - K}`, mark };
  });
}

export default function RateOverheadViz() {
  return (
    <SceneShell
      eyebrow="같은 repair, 두 분모"
      title="복제는 줄을 통째로 늘리고, erasure coding은 repair 칸만 더합니다"
      description="칸 하나가 100 MiB symbol입니다. 주황 테두리는 분자, 점선 테두리는 분모로 세는 칸입니다."
      ariaLabel="3중 복제와 (10,6) erasure coding의 저장량, code rate와 extra overhead 비교"
      scenes={SCENES}
      render={(active) => {
        const replicate = active === 0;
        const rows = replicate
          ? [
              { label: "저장소 1", cells: copyRow },
              { label: "저장소 2", cells: copyRow },
              { label: "저장소 3", cells: copyRow },
            ]
          : [
              { label: "조각 10개", cells: codedRow(active) },
              { label: "", cells: emptyRow },
              { label: "", cells: emptyRow },
            ];
        const ratio =
          active === 2
            ? [`분자 source ${K}칸`, `분모 전체 ${N}칸`, `${K}/${N} = ${pct(K / N)}`]
            : active === 3
              ? [`분자 repair ${N - K}칸`, `분모 원본 ${K}칸`, `${N - K}/${K} ≈ ${pct((N - K) / K)}`]
              : null;
        return (
          <div className="min-w-0 space-y-2">
            {rows.map((row, i) => (
              <Row key={i} label={row.label} cells={row.cells} />
            ))}
            <div className="grid min-h-[4.5rem] grid-cols-3 gap-2 border-t border-border pt-3 text-xs sm:text-sm">
              {ratio ? (
                ratio.map((text, i) => (
                  <p key={text} className={i === 2 ? "font-mono font-bold text-primary" : "text-muted-foreground"}>
                    {text}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-muted-foreground">칸 수 {replicate ? COPIES * K : N}</p>
                  <p className="text-muted-foreground">저장 {((replicate ? COPIES * K : N) * SYMBOL_MIB).toLocaleString("en-US")} MiB</p>
                  <p className="font-mono font-bold text-primary">{replicate ? "1줄 남으면 읽음" : `아무 ${K}칸 남으면 복원`}</p>
                </>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
