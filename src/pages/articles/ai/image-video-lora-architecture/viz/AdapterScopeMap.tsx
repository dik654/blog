const columns = [
  {
    title: "이미지 모델",
    input: "이미지 + 설명문",
    path: "공간 잡음 복원기",
    result: "대상 · 화풍",
  },
  {
    title: "영상 모델",
    input: "영상 묶음 + 설명문",
    path: "공간 경로 · 시간 경로",
    result: "겉모습 · 움직임",
  },
  {
    title: "음성·영상 모델",
    input: "영상 묶음 + 음성",
    path: "매체 연결 경로",
    result: "동기화 · 결합 조건",
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
          같은 저랭크 변화량이 원래 모델의 서로 다른 정보 경로에 들어갑니다
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
          어댑터 수식은 같지만 입력 단위와 학습 경로가 바뀌면 결과도 달라집니다.
        </p>
      </figcaption>
      <div className="mx-auto max-w-sm rounded-lg border border-primary/40 bg-primary/[0.04] px-4 py-3 text-center">
        <p className="text-xs font-bold text-primary">동결한 원래 모델 + LoRA 변화량 ΔW</p>
        <p className="mt-1 text-sm text-foreground">먼저 원래 모듈의 역할을 확인합니다</p>
      </div>
      <div aria-hidden="true" className="mx-auto h-6 w-px bg-border" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
        {columns.map((column) => (
          <div
            key={column.title}
            className="min-w-0 rounded-lg border border-border/70 p-3 sm:p-4"
          >
            <p className="text-sm font-semibold text-foreground">{column.title}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-[10px] leading-4 sm:mt-4 sm:block sm:space-y-2 sm:border-0 sm:pt-0 sm:text-xs sm:leading-5">
              <p className="min-w-0 text-muted-foreground sm:border-l sm:border-border sm:pl-3">
                입력 <span className="block font-medium text-foreground">{column.input}</span>
              </p>
              <p aria-hidden="true" className="hidden text-center text-muted-foreground sm:block">↓</p>
              <p className="min-w-0 text-muted-foreground sm:border-l sm:border-primary/45 sm:pl-3">
                학습 경로 <span className="block font-medium text-foreground">{column.path}</span>
              </p>
              <p aria-hidden="true" className="hidden text-center text-muted-foreground sm:block">↓</p>
              <p className="min-w-0 text-muted-foreground sm:border-l sm:border-emerald-600/45 sm:pl-3">
                평가 <span className="block font-medium text-foreground">{column.result}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
