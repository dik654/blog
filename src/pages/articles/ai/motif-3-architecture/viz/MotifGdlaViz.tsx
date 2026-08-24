export default function MotifGdlaViz() {
  return (
    <figure
      data-viz="motif-gdla-branch"
      data-viz-canvas="motif-gdla-branch-canvas"
      className="not-prose min-w-0 overflow-hidden rounded-lg border border-border bg-background"
    >
      <figcaption className="border-b border-border px-5 py-4 sm:px-6">
        <h3 className="font-black">GDLA는 두 연구 축이 만나는 결합 구조입니다</h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
          MLA는 저장 상태의 폭을, GDA는 signal·noise head 배분과 attention 선택성을 다룹니다.
        </p>
      </figcaption>
      <div className="relative grid min-h-[22rem] gap-5 p-5 md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] md:grid-rows-2 md:items-center md:p-8">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          viewBox="0 0 900 360"
          preserveAspectRatio="none"
        >
          <defs>
            <marker id="motif-gdla-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-primary" />
            </marker>
          </defs>
          <path d="M360 90 C450 90 465 180 545 180" fill="none" className="stroke-primary" strokeWidth="1" markerEnd="url(#motif-gdla-arrow)" />
          <path d="M360 270 C450 270 465 180 545 180" fill="none" className="stroke-primary" strokeWidth="1" markerEnd="url(#motif-gdla-arrow)" />
        </svg>

        <div className="relative z-10 min-w-0 rounded-lg border border-border bg-background p-5 md:col-start-1 md:row-start-1">
          <p className="text-xs font-black text-primary">저장 축 · MLA</p>
          <p className="mt-2 font-black">K·V를 latent cKV로 압축</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Decode 때 token마다 full K/V head를 따로 보관하는 폭을 줄입니다.</p>
        </div>
        <div className="relative z-10 text-center text-primary md:hidden" aria-hidden="true">↓</div>
        <div className="relative z-10 min-w-0 rounded-lg border border-border bg-background p-5 md:col-start-1 md:row-start-2">
          <p className="text-xs font-black text-primary">선택 축 · GDA</p>
          <p className="mt-2 font-black">Signal head를 늘리고 noise head를 공유</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">반복한 noise output을 token별 λ로 빼 attention output의 공통 성분을 억제합니다.</p>
        </div>
        <div className="relative z-10 text-center text-primary md:hidden" aria-hidden="true">↓</div>
        <div className="relative z-10 min-w-0 rounded-lg border border-primary bg-primary/5 p-5 md:col-start-3 md:row-span-2">
          <p className="text-xs font-black text-primary">결합 지점 · GDLA</p>
          <p className="mt-2 font-black">공유 latent KV + signal/noise query + output gate</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">두 query path가 같은 압축 KV를 읽고, 차분한 output을 query-dependent gate로 조절합니다.</p>
          <p className="mt-4 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">MLA의 상위호환이라는 뜻이 아니라 서로 다른 병목을 한 attention block에서 조합한 설계입니다.</p>
        </div>
      </div>
    </figure>
  );
}
