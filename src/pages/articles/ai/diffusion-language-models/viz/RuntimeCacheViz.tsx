import SceneShell from "./SceneShell";

/**
 * 본문 대응: #runtime-blocks — AR은 확정 prefix를 cache, full diffusion은 매 step 전체를 다시 읽고,
 * block diffusion은 완료 block을 causal prefix로 cache하고 현재 block 안에서만 고친다.
 * 행 = reverse step(또는 AR decode step) 3번, 열 = 응답 위치 8칸. 위치 수·step 수·block 크기 4는 예시(가정).
 * 칸 상태: cache = 이전에 확정해 K/V를 다시 쓰는 칸, work = 이번 forward에서 다시 계산하는 칸, none = 아직 다루지 않는 칸.
 */
type Cell = "cache" | "work" | "none";

const POSITIONS = 8;
const STEPS = 3;

const arRow = (step: number): Cell[] =>
  Array.from({ length: POSITIONS }, (_, pos) => (pos < step ? "cache" : pos === step ? "work" : "none"));
const fullRow = (): Cell[] => Array.from({ length: POSITIONS }, () => "work");
const blockRow = (step: number): Cell[] =>
  Array.from({ length: POSITIONS }, (_, pos) => {
    const currentBlock = step < 2 ? 0 : 1;
    const block = Math.floor(pos / 4);
    if (block < currentBlock) return "cache";
    return block === currentBlock ? "work" : "none";
  });

const SCENES = [
  {
    label: "Autoregressive",
    summary: "step마다 새 위치 1칸만 계산",
    rows: Array.from({ length: STEPS }, (_, step) => arRow(step)),
    note: "왼쪽 prefix는 확정되면 바뀌지 않으므로 그 K/V를 cache로 다시 씁니다. 한 forward가 내는 위치는 하나지만 cache와 streaming이 단순합니다.",
  },
  {
    label: "Full-sequence diffusion",
    summary: "step마다 8칸 전체를 다시 계산",
    rows: Array.from({ length: STEPS }, () => fullRow()),
    note: "한 forward에서 여러 위치를 채울 수 있지만 다음 step에서 여러 위치의 token이 바뀝니다. “앞부분은 영원히 변하지 않는다”는 전제가 없어 전체 sequence의 attention을 다시 계산하는 것이 기본입니다.",
  },
  {
    label: "Block diffusion",
    summary: "현재 block 4칸만 계산 · 이전 block은 cache",
    rows: Array.from({ length: STEPS }, (_, step) => blockRow(step)),
    note: "Block 1을 두 step 동안 고쳐 확정한 뒤, step 3부터는 block 1을 causal prefix로 cache하고 block 2 안에서만 diffusion으로 고칩니다. 대신 block 2의 문맥을 보고 block 1을 다시 고치는 경로는 닫힙니다.",
  },
] as const;

const STYLE: Record<Cell, { box: string; text: string; label: string }> = {
  cache: { box: "border-border bg-muted/60", text: "text-muted-foreground", label: "캐시" },
  work: { box: "border-blue-600 bg-blue-500/10", text: "text-blue-800 dark:text-blue-300", label: "계산" },
  none: { box: "border-dashed border-border/60 bg-transparent", text: "text-muted-foreground/50", label: "·" },
};

export default function RuntimeCacheViz() {
  return (
    <SceneShell
      eyebrow="Runtime 비교"
      title="같은 세 step에서 무엇을 다시 계산하고 무엇을 cache로 쓰는가"
      description="한 줄이 한 step의 forward, 한 칸이 응답의 한 위치입니다. 파란 ‘계산’ 칸은 이번 forward에서 다시 계산하는 위치, 회색 ‘캐시’ 칸은 이미 확정해 cache(이전에 계산한 key/value를 저장해 두고 다시 쓰는 것)로 읽는 위치입니다. 위치 8칸·step 3번·block 크기 4는 예시입니다(가정)."
      note="칸 수는 어느 위치를 다시 계산하는지만 보여 줍니다. 실제 speed는 sequence length, step 수, block size, forward latency, remask 비율과 quality를 함께 재야 하며 이 그림으로 판정하지 않습니다."
      ariaLabel="Autoregressive, full diffusion, block diffusion이 step마다 다시 계산하는 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-2 gap-y-1.5">
              <span />
              <div className="grid grid-cols-8 gap-1 text-center text-[10px] text-muted-foreground">
                {Array.from({ length: POSITIONS }, (_, pos) => (
                  <span key={pos}>{pos + 1}</span>
                ))}
              </div>
              {scene.rows.map((row, step) => (
                <div key={step} className="contents">
                  <span className="self-center text-xs font-semibold text-muted-foreground">step {step + 1}</span>
                  <div className="grid grid-cols-8 gap-1">
                    {row.map((cell, pos) => (
                      <div key={pos} className={`flex h-9 items-center justify-center rounded border text-[9px] font-semibold sm:text-[10px] ${STYLE[cell].box} ${STYLE[cell].text}`}>
                        {STYLE[cell].label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-2">
              <span />
              <div className="grid grid-cols-2 gap-1 text-center text-[10px] text-muted-foreground">
                <span className={active === 2 ? "rounded border border-border/70 py-0.5 font-semibold" : "py-0.5 opacity-0"}>block 1</span>
                <span className={active === 2 ? "rounded border border-border/70 py-0.5 font-semibold" : "py-0.5 opacity-0"}>block 2</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-blue-600 bg-blue-500/10 align-middle" />계산 = 이번 forward에서 다시 계산</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-border bg-muted/60 align-middle" />캐시 = 확정돼 저장한 key/value 재사용</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border border-dashed border-border/60 align-middle" />· = 이 step에서 아직 다루지 않음</span>
            </div>
          </div>
        );
      }}
    />
  );
}
