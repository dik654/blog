import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";

export default function PruningGranularity() {
  return (
    <section id="pruning-granularity" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Channel 말고도 attention head·layer·expert 단위로 지울 수 있습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          위 shape propagation 계약은 무엇을 지우는지를 지정하지 않습니다.
          Channel 대신 attention head 하나, transformer layer 하나, MoE
          expert 하나를 지워도 같은 계약(현재 output과 다음 input을 함께
          줄이는)이 적용됩니다. 다만 어느 단위를 고르느냐에 따라 남는
          품질과 절약량의 profile이 달라집니다.
        </p>
      </div>
      <TermBreakdown
        title="세 granularity의 실측 profile"
        description="논문이 보고한 조건에서의 결과이며, 다른 model·task에 그대로 옮길 수는 없습니다."
        items={[
          {
            term: "Attention head pruning",
            description:
              "Multi-head attention에서 query·key·value·output projection 중 head 하나 몫을 통째로 지웁니다.",
            example:
              "WMT en-de 번역 모델은 head 20%, BERT는 40%까지 지워도 성능 저하가 크지 않았습니다.",
            boundary:
              "어느 head가 지워도 되는지는 head importance 측정 방법에 따라 달라지고, 비율이 그대로 옮겨가지 않습니다.",
          },
          {
            term: "Layer pruning",
            description: "Residual block(transformer layer) 하나를 통째로 건너뜁니다.",
            example:
              "LLaMA2-13B에서 layer 10개(전체의 25%)를 지우자 MMLU가 55.0에서 52.2로만 떨어졌고, LLaMA3.1-8B에서 layer 12개를 지우면 추론이 최대 1.49배 빨라졌습니다.",
            boundary:
              "어느 layer를 지울지는 layer 입력·출력이 얼마나 비슷한지(redundancy)로 정하며, 앞뒤 layer 순서를 그대로 유지해야 합니다.",
          },
          {
            term: "Expert pruning",
            description: "MoE의 routed expert(하나의 FFN)를 통째로 지웁니다.",
            example:
              "Mixtral 8x7B에서 8개 중 2개(25%)를 지우면 평균 점수가 2.9점, 4개(50%)를 지우면 7.1점 떨어졌습니다.",
            boundary:
              "몇 개를 지울지는 아래 expert importance estimation이 정하고, 실제로 많이 쓰이는 expert를 잘못 지우면 손실이 급격히 커집니다.",
          },
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="expert-importance" className="scroll-mt-20">
          Expert를 지우기 전에 얼마나 쓰이는지부터 잽니다
        </h3>
        <p>
          MoE expert는 channel이나 head와 달리 서로 대칭이 아닙니다. Router가
          어떤 token을 어느 expert로 보내는지에 따라 expert마다 실제로
          처리하는 token 비율이 크게 다르고, 이 비율이 지워도 되는 expert를
          찾는 첫 신호가 됩니다. Expert importance estimation은 이 신호에
          출력 유사도나 제거 시 늘어나는 loss까지 더해 pruning 우선순위를
          정하는 계산입니다.
        </p>
        <p>
          예를 들어 8개 expert 중 2개가 router로부터 token의 40% 이상을
          받는다면, 나머지 6개는 각각 10% 미만만 받습니다. 이 6개가 먼저
          pruning 후보에 오르고, 그중에서도 다른 expert 출력과 겹치는
          expert가 우선순위 상위로 갑니다.
        </p>
        <p>
          이 신호는 하나로 고정돼 있지 않습니다. Routing 빈도만 보는 방법은
          계산이 가볍지만, 드물게 호출돼도 결정적인 순간에만 쓰이는 expert를
          놓칠 수 있습니다. 그래서 실제 방법들은 특정 task·calibration
          data에서 expert를 지웠을 때 늘어나는 loss까지 함께 봅니다.
        </p>
      </div>

      <div className="not-prose mt-6 grid gap-4 lg:grid-cols-2">
        <div id="paper-attention-head-pruning" className="scroll-mt-24">
          <CitationBlock
            source="Are Sixteen Heads Really Better than One?"
            citeKey={1}
            href="https://arxiv.org/abs/1905.10650"
          >
            <strong>문제:</strong> 학습 때 여러 head를 쓴 모델이 추론 때도
            모든 head가 정말 필요한지. <strong>기여:</strong> Greedy pruning으로
            WMT en-de는 head 20%, BERT는 40%까지 제거해도 성능 저하가 크지
            않음을 보임. <strong>전제:</strong> 논문의 model·task·pruning
            절차. <strong>근거 범위:</strong> 해당 실험의 head 제거 비율과
            성능 측정. <strong>과장 금지:</strong> 이 비율이 모든
            model·task로 그대로 옮겨간다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-shortgpt-layer-pruning" className="scroll-mt-24">
          <CitationBlock
            source="ShortGPT: Layers in Large Language Models are More Redundant Than You Expect"
            citeKey={2}
            href="https://arxiv.org/abs/2403.03853"
          >
            <strong>문제:</strong> LLM layer가 실제로 얼마나 redundant한지.{" "}
            <strong>기여:</strong> 입출력 유사도로 정의한 Block Influence
            점수로 layer를 지워 LLaMA2-13B에서 25% 제거·MMLU 52.2 유지,
            LLaMA3.1-8B에서 최대 1.49배 속도 향상을 보임.{" "}
            <strong>전제:</strong> 논문의 model·benchmark·pruning 비율.{" "}
            <strong>근거 범위:</strong> 해당 model family의 layer 제거
            실험. <strong>과장 금지:</strong> 모든 model이 같은 비율에서
            같은 성능을 유지한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-moe-expert-pruning" className="scroll-mt-24 lg:col-span-2">
          <CitationBlock
            source="Not All Experts are Equal: Efficient Expert Pruning and Skipping for Mixture-of-Experts Large Language Models"
            citeKey={3}
            href="https://arxiv.org/abs/2402.14800"
          >
            <strong>문제:</strong> MoE model의 거대한 parameter를 배포
            가능하게 줄이면서 성능을 지키는 법. <strong>기여:</strong>{" "}
            Task-agnostic·task-specific expert importance를 계산해 Mixtral
            8x7B에서 expert 2개 제거 시 2.9점, 4개 제거 시 7.1점 하락에
            그치는 pruning·skipping 방법을 제시. <strong>전제:</strong>{" "}
            논문의 model·evaluation task 조건. <strong>근거 범위:</strong>{" "}
            해당 MoE model의 post-training expert pruning 실험.{" "}
            <strong>과장 금지:</strong> 모든 MoE architecture·routing
            방식에서 같은 하락 폭을 보장하지 않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
