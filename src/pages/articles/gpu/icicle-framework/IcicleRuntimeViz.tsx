const CALL_PATH = [
  { eyebrow: "Typed call", title: "BN254 NTT", detail: "input · config · stream" },
  { eyebrow: "Active device", title: "CUDA:0", detail: "device type = CUDA" },
  { eyebrow: "Per-API dispatcher", title: 'map["CUDA"]', detail: "BN254 NTT 전용 registry" },
  { eyebrow: "Concrete backend", title: "CUDA NTT 함수", detail: "copy · kernel · completion" },
] as const;

export function IcicleRuntimeViz() {
  return (
    <figure data-viz="icicle-call-path" className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-xs font-semibold text-primary">한 호출을 끝까지 따라가기</p>
        <p className="mt-1 font-bold">공통 API는 현재 장치에 등록된 정확한 구현을 찾아 호출한다</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Primitive와 field/curve 조합이 dispatcher를 먼저 정합니다. 그 안에서는 active device type이 lookup key입니다.
        </p>
      </figcaption>

      <div data-viz-canvas className="grid gap-3 p-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center sm:p-6">
        {CALL_PATH.map((step, index) => (
          <div className="contents" key={step.eyebrow}>
            <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-4">
              <p className="text-[11px] font-bold text-primary">{step.eyebrow}</p>
              <p className="mt-2 text-sm font-semibold [overflow-wrap:normal]">{step.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.detail}</p>
            </div>
            {index < CALL_PATH.length - 1 ? (
              <span aria-hidden className="text-center text-sm text-muted-foreground">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid gap-3 border-t border-border bg-muted/10 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:p-6">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">등록됨</p>
          <p className="mt-1 text-sm font-semibold">Stream 완료 뒤 output 검증</p>
        </div>
        <span className="text-center text-xs font-semibold text-muted-foreground">또는</span>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <p className="text-xs font-bold text-amber-700 dark:text-amber-300">등록 안 됨</p>
          <p className="mt-1 text-sm font-semibold">Unsupported error · 자동 CPU 전환 없음</p>
        </div>
      </div>
    </figure>
  );
}
