const rows = [
  {
    field: "Computer Vision",
    input: "image · video",
    output: "분류 · 탐지 · segmentation · 생성",
    structure: "CNN · Vision Transformer · diffusion",
  },
  {
    field: "Language",
    input: "token sequence",
    output: "검색 · 분류 · 번역 · 생성 · tool use",
    structure: "encoder · decoder · embedding model",
  },
  {
    field: "Audio",
    input: "waveform · spectrogram",
    output: "인식 · 합성 · 분리 · 분류",
    structure: "convolution · Transformer · codec model",
  },
  {
    field: "Science",
    input: "sequence · graph · 3D structure",
    output: "구조 예측 · 후보 생성 · simulation surrogate",
    structure: "GNN · equivariant model · multimodal model",
  },
] as const;

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝의 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          딥러닝은 특정 산업의 제품 목록이라기보다 입력을 representation으로 바꾸고 원하는 출력을 학습하는 공통 계산 방식입니다. 같은 Transformer도 문서 분류,
          token 생성과 protein sequence 분석에 쓰일 수 있으며 차이는 data와 objective, 평가 기준에서 생깁니다.
        </p>
      </div>

      <div data-viz="modern" className="not-prose my-12 grid gap-6 sm:grid-cols-2 sm:gap-7">
        {rows.map((row) => (
          <article
            key={row.field}
            className="min-w-0 border-l border-border/80 pl-4"
          >
            <h3 className="text-sm font-bold text-foreground">{row.field}</h3>
            <dl className="mt-3 grid gap-2 text-xs leading-5">
              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                <dt className="font-semibold text-muted-foreground">입력</dt>
                <dd className="break-words text-foreground">{row.input}</dd>
              </div>
              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                <dt className="font-semibold text-muted-foreground">과업</dt>
                <dd className="break-words text-foreground">{row.output}</dd>
              </div>
              <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                <dt className="font-semibold text-muted-foreground">구조</dt>
                <dd className="break-words text-foreground">{row.structure}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          적용 가능성과 운영 가능성은 다르다
        </h3>
        <p className="leading-7">
          benchmark에서 높은 점수를 얻는 것만으로 제품 적용이 끝나지 않습니다. 의료에서는 false negative와 calibration, 자율주행에서는 tail event와
          latency, 생성 모델에서는 factuality와 misuse처럼 분야마다 실패 비용이 다릅니다. dataset split과 metric도 실제 의사결정의 비용을 반영해야 하는
          이유입니다.
        </p>
        <p className="leading-7">
          새로운 모델 이름을 계속 나열하기보다{" "}
          <strong>입력 표현 → objective → 출력 → 검증</strong>의 네 단계를
          기준으로 보면 기술이 바뀌어도 글을 확장하기 쉽습니다. 이후 분야별 글은
          이 공통 구조 위에서 architecture와 evaluation을 구체화합니다.
        </p>
      </div>
    </section>
  );
}
