export function EcGpuGenArtifactViz() {
  const stages = [
    { title: "typed parameters", detail: "field ID · modulus · limbs · curve" },
    { title: "source builder", detail: "field · FFT · multiexp templates" },
    { title: "backend artifact", detail: "CUDA fatbin / OpenCL source" },
    { title: "runtime program", detail: "device selection · launch · receipt" },
  ];
  return (
    <figure className="rounded-xl border border-border bg-card p-4 sm:p-6" aria-labelledby="ec-gen-viz-title">
      <figcaption id="ec-gen-viz-title"><p className="text-sm font-semibold text-primary">코드 생성은 문자열 치환이 아니라 provenance chain이다</p><p className="mt-1 text-sm leading-6 text-muted-foreground">어떤 field와 compiler 설정으로 어떤 artifact를 만들었는지 실행 결과까지 추적할 수 있어야 합니다.</p></figcaption>
      <ol className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage, index) => <li key={stage.title} className="min-w-0 rounded-lg border border-border bg-background p-4"><span className="text-xs font-semibold text-primary">0{index + 1}</span><strong className="mt-2 block break-words">{stage.title}</strong><span className="mt-1 block break-words text-sm text-muted-foreground">{stage.detail}</span></li>)}
      </ol>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-sky-500/45 bg-sky-500/5 p-4 text-sm"><strong>CUDA path</strong><p className="mt-1 text-muted-foreground">build-time compiler → embedded fatbin</p></div>
        <div className="rounded-lg border border-emerald-500/45 bg-emerald-500/5 p-4 text-sm"><strong>OpenCL path</strong><p className="mt-1 text-muted-foreground">generated source → runtime compiler</p></div>
      </div>
    </figure>
  );
}
