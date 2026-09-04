import ContentBoundary from "@/components/articles/content-boundary";
import TransformerBlockViz from "./viz/TransformerBlockViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Transformer의 출발점은 attention이 아니라 sequence 계산 경로를 바꾼
        것이다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          RNN은 앞 time step의 state가 준비되어야 다음 token을 처리할 수 있습니다. Transformer는 학습할 때 sequence의 모든 위치를 행렬로 놓고
          attention으로 필요한 위치의 정보를 직접 모읍니다. 덕분에 token 사이 path length가 짧아지고 sequence 축 병렬화도 가능해졌습니다. 다만 standard
          full attention은 길이 n에 대해 score matrix가 n×n이므로 긴 context 비용은 커집니다.
        </p>
        <p className="leading-8">
          한 block을 attention 하나로 이해하면 절반만 본 셈입니다. Attention은
          <strong> token 축</strong>을 섞고, FFN은 각 위치의
          <strong> feature 축</strong>을 섞으며, residual과 normalization이 두
          update를 반복해서 쌓는 경로를 만듭니다.
          Encoder-only·decoder-only·encoder–decoder의 차이는 이 block을 버리는
          것이 아니라 어떤 source를 읽고 어느 위치를 가리는지에 있습니다.
        </p>

        <h3 id="decoder-only" className="scroll-mt-20">
          Decoder-only Transformer가 오늘날 LLM의 표준 architecture다
        </h3>
        <p className="leading-8">
          Decoder-only Transformer는 encoder 없이 causal self-attention만 쌓습니다. 지금까지 나온 token만 보고 다음 token 확률을 내는
          구조입니다. 이 next-token 예측 목적함수로 학습하는 model을 autoregressive language model이라 부르고 GPT 계열을 비롯한 오늘날 대부분의
          대규모 언어모델이 이 architecture를 씁니다.
        </p>
        <p className="leading-8">
          이렇게 한 번의 대규모 corpus 학습을 여러 downstream task에 재사용하는 model을 foundation model이라 부르며 언어를 다루는 foundation
          model을 특히 LLM(Large Language Model)이라 합니다. 세 이름은 서로 다른 architecture가 아닙니다. 같은 decoder-only causal
          구조·next-token objective·범용 재사용 방식을 세 관점에서 가리킨 것입니다.
        </p>
        <p className="leading-8">
          작은 예로 vocabulary 128,000개, 입력이 [BOS, 나는, 밥을] 세 token이라면 decoder-only model은 causal mask 아래 각 위치가 자기
          이전 token만 보고 다음 token 확률분포를 냅니다. 3번째 위치는 BOS·나는·밥을만 조건으로 삼습니다. Encoder가 미리 처리해 둔 별도 source sequence는
          존재하지 않습니다.
        </p>
      </div>

      <ContentBoundary article="transformer-architecture" />
      <TransformerBlockViz />

      <div
        id="paper-transformer"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · Attention Is All You Need</p>
        <h3 className="mt-2 text-base font-bold">기여는 attention 하나가 아니라 recurrence 없이 sequence transduction 경로를 구성한 것이다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          원 논문은 encoder–decoder machine translation에서 self-attention과 cross-attention, position-wise
          FFN·residual·normalization을 결합해 recurrence와 convolution 없이 sequence를 처리했습니다. WMT 2014 번역과
          constituency parsing 결과가 뒷받침하는 것은 그 architecture와 training recipe까지입니다. 모든 sequence task와 decoder-
          only LLM에서 원 구성이 그대로 최선일지는 여기서 정해지지 않습니다.
        </p>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>이 글은 block을 외우는 대신 실행 계약을 따라간다</h3>
        <p className="leading-8">
          먼저 문자열이 아니라 token ID와 mask에서 시작해 위치 신호를 넣습니다. 그다음 Q·K·V의 source와 visibility를 고정한 뒤
          attention·FFN·residual·norm을 지나 logits와 loss로 나갑니다. 마지막에는 같은 architecture라도 결과를 바꾸는 training recipe와
          scaling law의 적용 범위를 분리합니다. Attention score의 상세 유도와 tokenizer algorithm은 정본 글에 맡겨 설명이 여러 곳으로 흩어지지 않게
          했습니다.
        </p>
      </div>
    </section>
  );
}
