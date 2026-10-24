import VizFrame from "@/components/viz/VizFrame";

export default function WeightingViz() {
  return (
    <VizFrame eyebrow="고양이–반려 cell 계산" title="Count 4를 독립 기대와 비교하면 PPMI 0.439가 됩니다" description="두 항목이 각각 자주 나온다는 사실을 먼저 빼고, 함께 나온 양이 그 기대보다 얼마나 큰지 계산합니다." note="자연로그를 사용했습니다. 19·7·4는 위 count matrix에서 직접 센 값입니다.">
      <div data-viz-canvas className="grid items-center gap-2 md:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)]">
        {[
          ["실제 joint", "4 / 19", "0.2105"],
          ["독립 기대", "(7 / 19)²", "0.1357"],
          ["기대 대비", "76 / 49", "1.551"],
          ["log + clamp", "max(0, log 1.551)", "0.439"],
        ].map(([label, expression, value], index, items) => <div key={label} className="contents">
          <div className={`min-w-0 border p-3 ${index === items.length - 1 ? "border-primary bg-primary/[.06]" : "border-border"}`}>
            <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
            <p className="mt-2 break-words font-mono text-xs">{expression}</p>
            <p className="mt-1 font-mono text-sm font-bold text-primary">{value}</p>
          </div>
          {index < items.length - 1 ? <span aria-hidden className="text-center text-primary"><span className="md:hidden">↓</span><span className="hidden md:inline">→</span></span> : null}
        </div>)}
      </div>
      <p className="mt-4 border-l border-border pl-3 text-xs leading-6 text-muted-foreground">0 count에는 log를 바로 적용할 수 없습니다. Smoothing·최소 빈도·0 처리 중 무엇을 썼는지도 representation의 일부입니다.</p>
    </VizFrame>
  );
}
