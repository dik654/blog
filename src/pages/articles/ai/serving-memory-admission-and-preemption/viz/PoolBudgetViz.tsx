import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pool-budget — 가상 장비 80GiB에서 KV 예산 54GiB를 거쳐 block 수와 V0 1% 하한을 얻고,
 * 입력 1000토큰(63block) 요청을 free 300과 free 350에서 판정한다.
 * 80 × 0.9 = 72, 72 − 16 − 2 = 54GiB, 54 × 1024 ÷ 2 = 27,648block, floor(276.48) = 276.
 * 300 − 63 = 237 < 276 → LATER, 350 − 63 = 287 ≥ 276 → OK.
 */
const DEVICE_GIB = 80;
const ENGINE_GIB = DEVICE_GIB * 0.9;
const WEIGHT_GIB = 16;
const WORK_GIB = 2;
const KV_GIB = ENGINE_GIB - WEIGHT_GIB - WORK_GIB;
const BLOCK_MIB = 2;
const BLOCKS = (KV_GIB * 1024) / BLOCK_MIB;
const WATERMARK = Math.floor(BLOCKS * 0.01);
const REQUEST = 63;
const AXIS_MAX = 360;

const SPLIT = [
  { key: "out", label: "엔진 밖", gib: DEVICE_GIB - ENGINE_GIB, color: "#cbd5e1", ink: "#334155" },
  { key: "weight", label: "가중치", gib: WEIGHT_GIB, color: "#64748b", ink: "#ffffff" },
  { key: "work", label: "작업 공간", gib: WORK_GIB, color: "#a855f7", ink: "#ffffff" },
  { key: "kv", label: "KV 예산", gib: KV_GIB, color: "#2563eb", ink: "#ffffff" },
] as const;

const ENGINE_ONLY = [
  SPLIT[0],
  { key: "engine", label: "엔진 몫", gib: ENGINE_GIB, color: "#93c5fd", ink: "#1e3a8a" },
] as const;

const SCENES = [
  {
    label: "엔진 몫은 90%",
    summary: `${DEVICE_GIB} × 0.9 = ${ENGINE_GIB}GiB`,
    free: 0,
    note: "크기 80GiB인 가상 장비에서 엔진이 쓸 몫을 90%로 잡으면 72GiB입니다. 나머지 8GiB는 엔진 바깥 몫입니다. (가정)",
  },
  {
    label: "가중치와 작업 공간을 뺍니다",
    summary: `${ENGINE_GIB} − ${WEIGHT_GIB} − ${WORK_GIB} = ${KV_GIB}GiB`,
    free: 0,
    note: "72GiB에서 가중치 16GiB와 프로파일링한 작업 공간 2GiB를 빼면 KV cache를 담을 예산이 54GiB 남습니다. 그 밖의 비용은 이미 포함됐다고 가정한 값입니다.",
  },
  {
    label: "2MiB block으로 셉니다",
    summary: `${BLOCKS.toLocaleString("en-US")}block · 하한 ${WATERMARK}`,
    free: 0,
    note: "10절의 block 하나가 2MiB이므로 54GiB는 27,648block입니다. V0의 1% 하한은 floor(276.48) = 276block, 곧 552MiB입니다. 새 요청을 받은 뒤 free block이 이 개수 이상 남아야 합니다.",
  },
  {
    label: "free 300이면 LATER",
    summary: `300 − ${REQUEST} = 237 < ${WATERMARK}`,
    free: 300,
    note: "입력 1000토큰은 63block입니다. free 300에서 받으면 237이 남아 하한 276보다 작으므로 지금은 받지 않고 기다리게 합니다(LATER). 전체 pool로는 들어가므로 NEVER는 아닙니다.",
  },
  {
    label: "free 350이면 OK",
    summary: `350 − ${REQUEST} = 287 ≥ ${WATERMARK}`,
    free: 350,
    note: "free가 350이면 63을 빼도 287이 남아 하한 276 이상입니다. 같은 요청이 지금 수용됩니다(OK). pool 전체가 아니라 그 순간의 free가 판정을 가릅니다.",
  },
] as const;

type Segment = { key: string; label: string; gib: number; color: string; ink: string };
const SPLIT_LIST: readonly Segment[] = SPLIT;
const ENGINE_LIST: readonly Segment[] = ENGINE_ONLY;

const pctOfAxis = (blocks: number) => `${(blocks / AXIS_MAX) * 100}%`;

export default function PoolBudgetViz() {
  return (
    <SceneShell
      eyebrow="KV pool 예산"
      title="80GiB 장비에서 276칸 하한까지"
      description="위 막대는 가상 장비 80GiB를 나눈 몫이고, 아래 막대는 27,648block pool 중 그 순간의 free block을 0–360칸 축으로 확대한 것입니다. 모든 숫자는 12절의 설명용 가정입니다."
      note="V0의 1% 하한(watermark)과 OK·LATER 판정은 11절에서 본 원문 조건입니다. 장비 표기의 80GB를 바꿔 읽은 값이 아닙니다."
      ariaLabel="장비 메모리를 KV 예산과 block 수로 바꾼 뒤 free 300과 350에서 입력 1000토큰 요청을 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const judged = scene.free > 0;
        const after = scene.free - REQUEST;
        const ok = after >= WATERMARK;
        const verdictColor = ok ? "#16a34a" : "#d97706";
        const segments = active === 0 ? ENGINE_LIST : SPLIT_LIST;
        return (
          <div className="min-w-0 space-y-5">
            <div>
              <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">장비 80GiB (가정)</span>
                <span className="font-mono">GiB 단위</span>
              </div>
              <div className="mt-2 flex h-8 w-full overflow-hidden rounded-sm border border-border">
                {segments.map((seg) => (
                  <div
                    key={seg.key}
                    className="flex h-full items-center justify-center border-r border-background text-[11px] font-semibold last:border-r-0"
                    style={{ width: `${(seg.gib / DEVICE_GIB) * 100}%`, backgroundColor: seg.color, color: seg.ink }}
                  >
                    {seg.gib >= 8 ? seg.gib : ""}
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:grid-cols-4">
                {SPLIT_LIST.map((seg, index) => {
                  const item: Segment | undefined = active === 0 ? ENGINE_LIST[index] : seg;
                  return (
                    <span key={seg.key} className={item ? "" : "invisible"}>
                      <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: item?.color ?? "#e2e8f0" }} />
                      {item ? `${item.label} ${item.gib}GiB` : "—"}
                    </span>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {active === 0 ? "엔진 몫 72GiB (아직 나누기 전)" : `KV 예산 ${KV_GIB}GiB ÷ ${BLOCK_MIB}MiB = ${active >= 2 ? `${BLOCKS.toLocaleString("en-US")}block` : "?"}`}
              </p>
            </div>

            <div className={active >= 2 ? "" : "opacity-40"}>
              <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">그 순간의 free block</span>
                <span className="font-mono">0–{AXIS_MAX}칸 확대</span>
              </div>
              <div className="relative mt-2 h-14 w-full rounded-sm border border-border bg-muted/30">
                {judged && (
                  <>
                    <div className="absolute left-0 top-1 h-5" style={{ width: pctOfAxis(after), backgroundColor: verdictColor }} />
                    <div className="absolute top-1 h-5 border border-dashed" style={{ left: pctOfAxis(after), width: pctOfAxis(REQUEST), borderColor: "#2563eb", backgroundColor: "#dbeafe" }} />
                    <span className="absolute top-7 text-[11px] font-semibold" style={{ left: 4, color: verdictColor }}>
                      받은 뒤 {after}
                    </span>
                  </>
                )}
                {active >= 2 && (
                  <div className="absolute bottom-0 top-0 w-0 border-l-2" style={{ left: pctOfAxis(WATERMARK), borderColor: "#dc2626" }} />
                )}
              </div>
              <div className="relative mt-1 h-4 text-[11px]">
                {active >= 2 && (
                  <span className="absolute -translate-x-1/2 font-semibold" style={{ left: pctOfAxis(WATERMARK), color: "#dc2626" }}>
                    하한 {WATERMARK}
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span>free {judged ? scene.free : "—"}</span>
                <span>
                  <span className="mr-1 inline-block h-2.5 w-2.5 align-middle" style={{ backgroundColor: "#dbeafe", border: "1px dashed #2563eb" }} />
                  입력 1000토큰 = {REQUEST}block
                </span>
                <span className="font-bold" style={{ color: judged ? verdictColor : "#94a3b8" }}>
                  {judged ? (ok ? "OK · 지금 수용" : "LATER · 대기") : "판정 전"}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
