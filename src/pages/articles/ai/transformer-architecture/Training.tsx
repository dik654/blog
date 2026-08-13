import { Link } from "react-router-dom";
import TrainingRecipeViz from "./viz/TrainingRecipeViz";

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Training recipe는 architecture 밖의 부록이 아니라 재현 결과의 일부다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Layer 수와 hidden size가 같아도 initialization, optimizer,
          learning-rate schedule, global token batch, sequence packing과
          numerical precision이 다르면 안정성과 최종 loss가 달라집니다.
          “Transformer는 AdamW와 warmup을 쓴다”는 목록보다 각 선택이 어떤
          failure를 막는지, checkpoint resume 때 어떤 state가 보존되는지
          확인해야 합니다.
        </p>
      </div>

      <TrainingRecipeViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          Mixed precision의 절약률은 parameter dtype 하나로 결정되지 않는다
        </h3>
        <p className="leading-8">
          Model weight 외에도 gradient, optimizer moment, master weight,
          activation, temporary buffer와 communication이 memory를 차지합니다.
          BF16·FP16·FP8을 쓴다고 전체 memory가 정확히 절반이나 4분의 1이 되지
          않으며, loss scaling과 accumulation precision도 함께 봐야 합니다.
          Optimizer update 자체는
          <Link to="/ai/optimizers"> Optimizer 정본 글</Link>에서 이어집니다.
        </p>

        <h3>Distributed strategy는 model 의미보다 tensor 소유권을 바꾼다</h3>
        <p className="leading-8">
          Data parallel은 sample을, tensor parallel은 layer tensor를, pipeline
          parallel은 layer 구간을 나누며 MoE는 expert routing communication을
          추가합니다. 같은 global batch·optimizer state·randomness를 재현하려면
          parallel topology와 gradient accumulation까지 실험 metadata에 남겨야
          합니다.
        </p>
      </div>
    </section>
  );
}
