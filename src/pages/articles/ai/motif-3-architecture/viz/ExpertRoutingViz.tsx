import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #overview — 희소층마다 routed expert 384개 중 top-8 + shared expert 1개.
 * 전체 약 314B 중 token당 활성 약 13.2B → 13.2 / 314 ≈ 4.2%.
 * 어느 8칸이 켜지는지는 router가 정하며 그림의 위치는 예시(가정)입니다.
 */
const ROUTED = 384;
const COLS = 24;
const PICKED = new Set([17, 58, 103, 150, 211, 260, 299, 347]);
const TOTAL_B = 314;
const ACTIVE_B = 13.2;
const ACTIVE_PCT = (ACTIVE_B / TOTAL_B) * 100;

export default function ExpertRoutingViz() {
  return (
    <VizFrame
      eyebrow="희소층 하나에서 token 하나"
      title="384칸 중 8칸과 공유 1칸만 계산하고, 314B는 그대로 올려 둡니다"
      description="Routed expert는 router가 token마다 골라 보내는 expert이고, shared expert는 모든 token이 지나는 expert입니다. 칸 하나가 routed expert 하나이며, 켜진 8칸의 위치는 예시(가정)입니다."
      documentFlow
    >
      <div className="min-w-0 space-y-6">
        <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_7rem] sm:items-start">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold">Routed expert 384개 · router가 top-8 선택</p>
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }} role="img" aria-label="routed expert 384개 중 8개만 켜진 격자">
              {Array.from({ length: ROUTED }, (_, index) => (
                <span
                  key={index}
                  className={`aspect-square rounded-[2px] ${PICKED.has(index) ? "bg-[#2563eb]" : "border border-border/70 bg-background"}`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">켜진 칸 8 · 꺼진 칸 376 — 이 token은 꺼진 expert를 계산하지 않습니다.</p>
          </div>
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold">Shared expert 1개</p>
            <div className="flex h-10 items-center justify-center rounded-md border border-[#d97706] bg-background text-xs font-semibold text-amber-700 dark:text-amber-400">
              항상 계산
            </div>
            <p className="mt-2 text-xs text-muted-foreground">이 층에서 계산하는 expert는 8 + 1 = 9개입니다.</p>
          </div>
        </div>
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold">Parameter 장부 두 개 (모델 전체 기준)</p>
          <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 text-xs sm:text-sm">
            <span className="text-muted-foreground">올려 두는 가중치</span>
            <div className="flex h-5 min-w-0 items-center rounded-sm bg-[#64748b] px-2 font-mono text-[11px] font-bold text-white">약 {TOTAL_B}B</div>
            <span className="text-muted-foreground">token당 활성</span>
            <div className="flex h-5 min-w-0 items-center">
              <div className="h-full rounded-sm bg-[#2563eb]" style={{ width: `${ACTIVE_PCT}%` }} />
              <span className="ml-2 font-mono text-[11px] font-bold">약 {ACTIVE_B}B ≈ {ACTIVE_PCT.toFixed(1)}%</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            두 숫자는 가중치 상주량과 활성 parameter라는 서로 다른 장부이며, 어느 쪽도 VRAM·latency·품질과 같지 않습니다. 53층 중 이런 희소 MoE층은 51개이고 나머지 2개는 dense층입니다.
          </p>
        </div>
      </div>
    </VizFrame>
  );
}
