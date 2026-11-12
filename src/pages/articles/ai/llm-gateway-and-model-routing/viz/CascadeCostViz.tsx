import SceneShell from "./SceneShell";

/**
 * 본문 대응: #model-cascade — "쉬운 요청은 비싼 model 호출을 건너뛰고 어려운 요청만 넘어간다".
 * 2단계 cascade, c₁=1·c₂=10 단위, 요청 10건 중 7건이 1단계에서 멈춤은 모두 가정이다.
 * 모두 상위: 10×10=100 → 평균 10. Cascade: 7×1 + 3×(1+10)=40 → 평균 4.
 * 확신도 추정이 틀려 6건이 넘어가면: 4×1 + 6×11 = 70 → 평균 7.
 */
const C1 = 1;
const C2 = 10;
const N = 10;

type Cell = "idle" | "large" | "stop" | "escalate";

function cells(kind: Cell | "split", escalated: number): readonly Cell[] {
  if (kind === "large") return Array.from({ length: N }, () => "large" as const);
  if (kind === "idle") return Array.from({ length: N }, () => "idle" as const);
  return Array.from({ length: N }, (_, index): Cell => (index < N - escalated ? "stop" : "escalate"));
}

const SCENES = [
  { label: "모든 요청을 상위 model로", summary: "10건 × 10 = 100 → 요청당 10", kind: "large", escalated: 0, showStop: true, showEsc: true, note: "가장 비싼 model 하나만 쓰면 쉬운 요청에도 매번 c₂ = 10을 냅니다." },
  { label: "1단계에서 멈춘 요청", summary: "7건 × c₁ = 7", kind: "split", escalated: 3, showStop: true, showEsc: false, note: "저비용 model의 확신도가 threshold 이상인 7건은 거기서 멈춥니다. 상위 model은 아예 호출하지 않으므로 1씩만 듭니다." },
  { label: "넘어간 요청은 두 번 냅니다", summary: "3건 × (1 + 10) = 33", kind: "split", escalated: 3, showStop: true, showEsc: true, note: "확신도가 낮았던 3건은 저비용 model을 이미 호출한 뒤 상위 model로 넘어갑니다. 실제로 호출한 단계의 비용을 모두 더하므로 한 건에 1 + 10입니다. 상위 model은 마지막 단계라 그 응답을 씁니다." },
  { label: "평균 비용", summary: "(7 + 33) ÷ 10 = 4", kind: "split", escalated: 3, showStop: true, showEsc: true, note: "넘어간 요청은 더 비싸졌지만 쉬운 요청 다수가 1단계에서 멈춰, 요청당 평균은 상위 model만 쓸 때의 10보다 낮은 4입니다." },
  { label: "확신도 추정이 틀리면", summary: "6건이 넘어가면 (4 + 66) ÷ 10 = 7", kind: "split", escalated: 6, showStop: true, showEsc: true, note: "쉬운 요청까지 잘못 넘어가면 두 번 내는 칸이 늘어 평균이 다시 올라갑니다. 반대로 어려운 요청이 1단계에서 잘못 멈추면 비용은 줄어들므로, 이 비용 칸만으로는 그 오류를 알아챌 수 없습니다." },
] as const satisfies readonly { label: string; summary: string; kind: Cell | "split"; escalated: number; showStop: boolean; showEsc: boolean; note: string }[];

const CELL_STYLE: Record<Cell, string> = {
  idle: "border-border bg-background text-muted-foreground",
  large: "border-slate-500 bg-slate-500/15",
  stop: "border-emerald-600 bg-emerald-500/10",
  escalate: "border-amber-600 bg-amber-500/15",
};

const MAX = 11;

function Bar({ label, value, color, strong = false }: { label: string; value: number | null; color: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((value ?? 0) / MAX) * 100}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value === null ? "−" : value}</span>
    </div>
  );
}

export default function CascadeCostViz() {
  return (
    <SceneShell
      eyebrow="Cascade의 평균 비용"
      title="넘어간 요청은 비용을 두 번 내도 평균은 내려갈 수 있습니다"
      description="칸 하나가 요청 하나입니다. 저비용 model 1회 비용 c₁ = 1, 상위 model 1회 비용 c₂ = 10(단위), 10건 중 7건이 1단계에서 멈춘다는 비율은 모두 가정입니다."
      note="두 단계짜리 cascade의 예입니다. 비용 비율과 멈추는 비율은 계산 과정을 보이려는 가정이며 논문이나 특정 서비스의 수치가 아닙니다."
      ariaLabel="요청 10건을 모두 상위 model로 보낼 때와 cascade로 보낼 때의 요청별 비용과 평균 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const row = scene.kind === "large" ? cells("large", 0) : cells("split" as Cell | "split", scene.escalated);
        const stopCount = N - scene.escalated;
        const cascadeAvg = (stopCount * C1 + scene.escalated * (C1 + C2)) / N;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-5 gap-1.5">
              {row.map((cell, index) => {
                const hidden = (cell === "stop" && !scene.showStop) || (cell === "escalate" && !scene.showEsc);
                const style = hidden ? CELL_STYLE.idle : CELL_STYLE[cell];
                return (
                  <div key={index} className={`flex h-12 flex-col items-center justify-center rounded-md border text-center text-xs leading-4 ${style}`}>
                    <span className="font-mono font-bold">{hidden ? "?" : cell === "large" ? "10" : cell === "stop" ? "1" : "1+10"}</span>
                    <span className="text-[11px] text-muted-foreground">{hidden ? "아직" : cell === "large" ? "상위" : cell === "stop" ? "멈춤" : "넘어감"}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-2">
              <Bar label="모두 상위 · 평균" value={C2} color="#64748b" />
              <Bar label="Cascade · 평균" value={active >= 3 ? cascadeAvg : null} color="#2563eb" strong />
            </div>
          </div>
        );
      }}
    />
  );
}
