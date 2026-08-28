const columns = [
  {
    title: "Image host",
    input: "image + caption",
    path: "spatial denoiser",
    result: "subject · style",
  },
  {
    title: "Video host",
    input: "clip + caption",
    path: "spatial · temporal",
    result: "appearance · motion",
  },
  {
    title: "Audio-video host",
    input: "clip + audio",
    path: "cross-modal path",
    result: "sync · joint condition",
  },
];

export default function AdapterScopeMap() {
  return (
    <figure
      data-viz="image-video-lora-host-map"
      className="not-prose my-8 overflow-hidden rounded-xl border border-border/75 bg-background p-4 sm:p-6"
    >
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">
          같은 저랭크 update가 host의 서로 다른 정보 경로에 들어갑니다
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
          Adapter 수식은 같지만 input 단위와 target path가 바뀌면 학습 결과도 달라집니다.
        </p>
      </figcaption>
      <div className="mx-auto max-w-sm rounded-lg border border-primary/40 bg-primary/[0.04] px-4 py-3 text-center">
        <p className="text-xs font-bold text-primary">Frozen base + LoRA ΔW</p>
        <p className="mt-1 text-sm text-foreground">먼저 host module의 역할을 확인</p>
      </div>
      <div aria-hidden="true" className="mx-auto h-6 w-px bg-border" />
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
        {columns.map((column) => (
          <div
            key={column.title}
            className="w-[min(78vw,270px)] shrink-0 snap-start rounded-lg border border-border/70 p-4 md:w-auto md:min-w-0"
          >
            <p className="text-sm font-semibold text-foreground">{column.title}</p>
            <div className="mt-4 space-y-2 text-xs leading-5">
              <p className="border-l border-border pl-3 text-muted-foreground">
                입력 <span className="block font-medium text-foreground">{column.input}</span>
              </p>
              <p aria-hidden="true" className="text-center text-muted-foreground">↓</p>
              <p className="border-l border-primary/45 pl-3 text-muted-foreground">
                Target <span className="block font-medium text-foreground">{column.path}</span>
              </p>
              <p aria-hidden="true" className="text-center text-muted-foreground">↓</p>
              <p className="border-l border-emerald-600/45 pl-3 text-muted-foreground">
                평가 <span className="block font-medium text-foreground">{column.result}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
