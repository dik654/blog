import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import TrainingRecipeViz from "./viz/TrainingRecipeViz";

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Training recipe는 architecture 밖의 부록이 아니라 재현 결과의 일부다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Layer 수와 hidden size가 같아도 initialization과 optimizer, learning-rate schedule이 다르면 안정성과 최종 loss가
          달라집니다. global token batch와 sequence packing, numerical precision도 마찬가지입니다. “Transformer는 AdamW와
          warmup을 쓴다”는 목록보다 각 선택이 어떤 failure를 막는지, checkpoint resume 때 어떤 state가 보존되는지를 봅니다.
        </p>
      </div>

      <TrainingRecipeViz />

      <ExplainedFormula
        question="Warmup 이후 learning rate를 왜 step 수의 제곱근에 반비례하게 낮추는가?"
        idea={
          <>
            초기 몇 step은 parameter가 무작위라 residual stream의 활성값
            분산이 아직 안정되지 않습니다. Warmup 동안 learning rate를 선형으로
            올려 이 불안정한 구간을 완만하게 지나고, 이후에는 optimizer moment
            추정이 누적될수록 더 작은 step으로 미세조정하도록 step 수의
            역제곱근에 비례해 감쇠시킵니다.
          </>
        }
        formula={String.raw`\mathrm{lr}(t)=d_{\mathrm{model}}^{-0.5}\cdot\min\!\left(t^{-0.5},\,t\cdot t_{\mathrm{warmup}}^{-1.5}\right)`}
        annotatedFormula={String.raw`\mathrm{lr}(t)=\underbrace{d_{\mathrm{model}}^{-0.5}}_{\text{model 폭에 따라 전체 크기 조정}}\cdot\min\Big(\underbrace{t^{-0.5}}_{\text{warmup 이후 역제곱근 감쇠}},\;\underbrace{t\cdot t_{\mathrm{warmup}}^{-1.5}}_{\text{warmup 동안 선형 증가}}\Big)`}
        operations={[
          {
            expression: String.raw`d_{\mathrm{model}}^{-0.5}`,
            annotation: ["hidden 폭이 커질수록", "기본 learning rate 크기를 줄임"],
          },
          {
            expression: String.raw`t\cdot t_{\mathrm{warmup}}^{-1.5}`,
            annotation: ["step이 지날수록", "0에서 peak까지 선형으로 증가"],
          },
          {
            expression: String.raw`t^{-0.5}`,
            annotation: ["warmup이 끝난 뒤에는", "step 제곱근에 반비례해 감쇠"],
          },
          {
            expression: String.raw`\min(\cdot,\cdot)`,
            annotation: [
              "두 후보 중 더 작은 값을 선택해",
              "증가 구간과 감쇠 구간을 하나의 곡선으로 연결",
            ],
          },
        ]}
        terms={[
          {
            symbol: "t",
            name: "현재 optimizer step",
            description: "1부터 시작하는 global training step 번호입니다.",
          },
          {
            symbol: String.raw`t_{\mathrm{warmup}}`,
            name: "warmup step 수",
            description:
              "Learning rate가 선형으로 증가하는 구간의 길이이며, 원 논문은 4000을 씁니다.",
          },
          {
            symbol: String.raw`d_{\mathrm{model}}`,
            name: "hidden 차원",
            description:
              "Model width입니다. 이 값이 클수록 initialization 분산이 커 더 작은 base learning rate가 필요합니다.",
          },
        ]}
        assumptions={[
          "원 Transformer 논문(Vaswani et al. 2017)의 Noam schedule입니다. 이후 널리 쓰이는 cosine decay·linear decay는 이 식과 다릅니다.",
          "t=t_warmup 지점에서 두 항의 값이 같아 그 지점이 peak이며, 그 이전은 증가, 이후는 감쇠 구간입니다.",
        ]}
        interpretation="Step이 warmup보다 작으면 min이 선형 증가 항을 고르고, warmup을 넘으면 min이 역제곱근 감쇠 항을 고릅니다. 그래서 learning rate 곡선은 선형으로 올라갔다가 peak에서 꺾여 완만하게 내려갑니다."
      />

      <TermBreakdown
        title="Dropout이 실제로 걸리는 위치와 weight initialization"
        items={[
          {
            term: "Dropout 배치 (rate=0.1)",
            description:
              "원 논문은 두 곳에 dropout을 겁니다 — (1) 각 sub-layer(attention, FFN)의 출력이 residual로 더해지기 직전, (2) embedding과 positional encoding을 합한 직후. Attention weight 자체에 추가로 dropout을 거는 구현도 흔합니다.",
            example: "output = LayerNorm(x + Dropout(Sublayer(x)))",
            boundary:
              "0.1은 원 논문 base 설정값입니다. 모델 크기와 데이터 양에 따라 실제 구현은 이 값을 낮추거나(대형 모델일수록 더 작게) 아예 생략합니다.",
          },
          {
            term: "Weight initialization",
            description:
              "Linear projection은 Xavier(Glorot) uniform으로 초기화해 layer를 지날 때 activation 분산이 급격히 커지거나 작아지지 않게 합니다. Embedding table은 d_model의 제곱근을 곱해 scale을 맞춥니다. 이후 GPT-2 계열 구현은 residual projection weight에 layer 수 기반 추가 factor를 곱해, layer가 늘어날수록 residual stream 분산이 누적되는 문제를 초기화 단계에서 미리 보정합니다.",
            example:
              "nn.init.xavier_uniform_(linear.weight); out_proj.weight *= (2 * num_layers) ** -0.5",
            boundary:
              "이 depth-scaling 보정은 원 2017 논문에는 없고, 이후 대형 모델 구현에서 흔해진 관례입니다.",
          },
        ]}
      />

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
          data parallel은 sample을, tensor parallel은 layer tensor를, pipeline parallel은 layer 구간을 나누며 MoE는 expert
          routing communication을 추가합니다. 같은 global batch·optimizer state·randomness를 재현하려면 실험 metadata의 범위가
          parallel topology와 gradient accumulation까지 넓어집니다.
        </p>
      </div>
    </section>
  );
}
