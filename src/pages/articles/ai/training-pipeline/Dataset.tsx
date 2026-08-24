import ExplainedFormula from "@/components/ui/explained-formula";
import DatasetViz from "./viz/DatasetViz";

export default function Dataset() {
  return (
    <section id="dataset" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Dataset·sampler·collate는 서로 다른 질문에 답합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>Dataset</code>은 sample ID 하나를 input·target·metadata 하나로
          바꾸는 규칙입니다. Map-style dataset은 index로 sample을 찾고,
          <code> IterableDataset</code>은 stream에서 다음 sample을 꺼냅니다.
          Split 전체를 보고 학습하는 scaler·vocabulary·target encoder는
          <code>__getitem__</code> 안에서 fit하지 않고 training fold artifact로
          전달해야 합니다.
        </p>
        <p>
          <code>Sampler</code>는 어떤 sample ID를 어느 순서와 어느 rank에 보낼지
          정합니다. <code>collate_fn</code>은 여러 sample을 stack·pad해 model input
          tensor와 validity mask를 만듭니다. <code>DataLoader</code>는 이 계약들을
          worker·prefetch·batching과 연결합니다. 역할을 나누면 잘못된 label과
          duplicated sample이 어느 경계에서 생겼는지 추적할 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-8"><DatasetViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Batch contract는 shape만이 아니라 sample 의미까지 검사합니다</h3>
        <p>
          가장 작은 fixture에서 sample ID, raw label, transform 뒤 dtype·shape,
          padding mask를 함께 출력합니다. Classification이라면 target이 class index인지
          probability vector인지, sequence라면 loss를 계산할 valid token 수가
          얼마인지 확인합니다. Distributed sampler에서는 rank별 sample ID의 교집합과
          합집합을 검사하고, <code>drop_last</code>가 실제로 버린 sample도 기록합니다.
        </p>
        <h3>Loader tuning은 GPU가 기다린 시간을 줄이는 실험입니다</h3>
        <p>
          <code>num_workers</code>, <code>prefetch_factor</code>,
          <code>persistent_workers</code>, <code>pin_memory</code>는 큰 값이 항상 좋은
          설정이 아닙니다. Storage latency, CPU transform, host RAM, batch bytes가
          바뀌면 병목도 달라집니다. 한 조건씩 바꾸며 data wait·compute time·samples/s와
          host memory를 함께 봅니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 training step에서 accelerator가 데이터를 기다린 비율과 실제 처리량을 어떻게 구할까?"
        idea={<>Step 시간을 batch 대기와 device 계산으로 나눕니다. 대기 비율이 크면서 accelerator utilization이 낮다면 model보다 input path를 먼저 최적화할 근거가 됩니다.</>}
        formula={String.raw`\begin{aligned}t_{\mathrm{step}}&=t_{\mathrm{wait}}+t_{\mathrm{compute}},\\r_{\mathrm{wait}}&=\frac{t_{\mathrm{wait}}}{t_{\mathrm{step}}},\\Q&=\frac{N_{\mathrm{samples}}}{\sum t_{\mathrm{step}}}.\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}t_{\mathrm{step}}&=\underbrace{t_{\mathrm{wait}}+t_{\mathrm{compute}},}_{\text{오른쪽 항으로 결과 계산}}\\r_{\mathrm{wait}}&=\underbrace{\frac{t_{\mathrm{wait}}}{t_{\mathrm{step}}},}_{\text{기준량당 비율}}\\Q&=\underbrace{\frac{N_{\mathrm{samples}}}{\sum t_{\mathrm{step}}}.}_{\text{항별 기여 누적}}\end{aligned}`}
        operations={[
          { expression: String.raw`t_{\mathrm{wait}}+t_{\mathrm{compute}},`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Step 시간을 batch 대기와 device 계산으로","나눕니다."] },
          { expression: String.raw`\frac{t_{\mathrm{wait}}}{t_{\mathrm{step}}},`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Step 시간을 batch 대기와 device 계산으로","나눕니다."] },
          { expression: String.raw`\frac{N_{\mathrm{samples}}}{\sum t_{\mathrm{step}}}.`, annotation: ["index마다","Step 시간을 batch 대기와 device 계산으로","나눕니다."] },
        ]}
        terms={[
          { symbol: "t_wait", name: "data wait time", description: "다음 batch가 준비되기를 training process가 기다린 wall-clock 시간입니다." },
          { symbol: "t_compute", name: "device compute time", description: "Device copy·forward·backward·update를 측정 범위에 맞춰 포함한 시간입니다." },
          { symbol: "r_wait", name: "wait fraction", description: "Step 시간 중 input path 때문에 쉬었던 비율입니다." },
          { symbol: "Q", name: "throughput", description: "측정 구간에 실제 처리한 sample 수를 전체 step 시간으로 나눈 값입니다." },
        ]}
        assumptions={["CUDA 연산은 asynchronous이므로 event 또는 profiler로 측정 경계를 동기화합니다.", "Warmup step을 제외하고 같은 batch·augmentation·hardware 조건을 비교합니다.", "Sequence task라면 samples/s와 함께 valid tokens/s도 기록합니다."]}
        interpretation="Worker 수를 늘렸는데 r_wait은 그대로이고 host memory만 증가한다면 input 병목은 worker 개수가 아닌 storage·transform·copy 경로에 있을 가능성이 큽니다."
      />

      <div id="docs-pytorch-data" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 따라 읽기 · torch.utils.data</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          현재 문서는 map-style·iterable-style dataset, sampler·batch sampler,
          automatic batching·collation, multi-process loading을 구분합니다. 특히
          IterableDataset의 worker별 복제와 <code>in_order=False</code>의 재현성·분포
          편향 경고는 stream pipeline 설계에 직접 영향을 줍니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.pytorch.org/docs/stable/data.html" target="_blank" rel="noreferrer">현재 stable API와 주의사항 보기</a>
      </div>
    </section>
  );
}
