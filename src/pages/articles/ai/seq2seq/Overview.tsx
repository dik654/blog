import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConditionalSequenceViz from "./viz/ConditionalSequenceViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Seq2Seq는 입력과 출력의 길이·순서를 독립적으로 모델링한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          분류 문제에서는 입력 하나에 label 하나를 붙이지만 번역은 그렇지 않습니다. “Thank you”를 “고마워”로 번역하면 token 수와 어순이 달라집니다. Speech
          recognition·summarization·image captioning도 입력 전체를 조건으로 새로운 sequence를 만들어야 합니다. Seq2Seq(sequence-to-
          sequence)는 먼저 source를 읽는 encoder와 지금까지의 답을 이어 쓰는 decoder로 역할을 나눴고 출력 길이도 EOS token을 통해 함께 학습했습니다.
        </p>
        <p>
          2014년 LSTM Seq2Seq는 encoder가 source를 fixed-dimensional vector로 압축하고 decoder가 그 vector를 초기 조건으로
          target을 autoregressive하게 생성했다. 이후 attention과 Transformer가 내부 operator를 바꿨지만 source X를 읽어 target
          sequence Y의 조건부 probability를 모델링한다는 문제 정의는 그대로 남아 있다. BERT 같은 encoder-only model과 GPT 같은 decoder-
          only model은 모두 Transformer를 사용하더라도 이 encoder–decoder contract와는 다르다.
        </p>
        <p>
          아래 식의 vertical bar와 product가 낯설다면 먼저
          <Link to="/ai/math-probability-expectation-variance#conditional-probability"> 조건부확률과 확률의 연쇄법칙</Link>을
          읽으면 됩니다. 전체 sequence 확률을 “앞에서 무엇을 봤는가”라는 작은 질문으로
          나누는 단계부터 숫자 예제로 설명합니다.
        </p>
      </div>

      <ConditionalSequenceViz />

      <ExplainedFormula
        question="가변 길이 target sequence 전체의 확률을 다음-token 확률로 어떻게 분해할까?"
        idea={<>Probability chain rule을 적용하면 각 target token은 source X와 이전 target prefix y&lt;t에 조건부인 항으로 분해됩니다. EOS도 하나의 token이므로 종료 시점까지 같은 분해에 포함됩니다.</>}
        formula={String.raw`\begin{aligned}p_t&=P_\theta(y_t\mid y_{<t},X)\\P_\theta(Y\mid X)&=\prod_{t=1}^{T}p_t\\\log P_\theta(Y\mid X)&=\sum_{t=1}^{T}\log p_t\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}p_t&=\underbrace{P_\theta(y_t\mid y_{<t},X)}_{\text{허용 경계 판정}}\\P_\theta(Y\mid X)&=\underbrace{\prod_{t=1}^{T}p_t}_{\text{model parameters 계산}}\\\log P_\theta(Y\mid X)&=\underbrace{\sum_{t=1}^{T}\log p_t}_{\text{로그 비용 변환}}\end{aligned}`}
        operations={[
          { expression: String.raw`P_\theta(y_t\mid y_{<t},X)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Probability chain rule을 적용하면 각","target token은 source X와 이전 target","prefix y t에 조건부인 항으로 분해됩니다."] },
          { expression: String.raw`\prod_{t=1}^{T}p_t`, annotation: ["model parameters이(가) 식의 결과에 기여하는","방식을 계산합니다.","Probability chain rule을 적용하면 각","target token은 source X와 이전 target"] },
          { expression: String.raw`\sum_{t=1}^{T}\log p_t`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Probability chain rule을 적용하면 각","target token은 source X와 이전 target","prefix y t에 조건부인 항으로 분해됩니다."] },
        ]}
        terms={[
          { symbol: "X=(x_1,\\ldots,x_S)", name: "source sequence", description: "길이 S의 encoder 입력입니다." },
          { symbol: "Y=(y_1,\\ldots,y_T)", name: "target sequence", description: "EOS를 포함할 수 있는 길이 T의 출력입니다." },
          { symbol: "y_{<t}", name: "target prefix", description: "현재 token보다 앞에서 주어졌거나 생성된 token들입니다." },
          { symbol: "\\theta", name: "model parameters", description: "Encoder·decoder·embedding·output projection을 함께 포함합니다." },
        ]}
        assumptions={["Target tokenization과 sequence ordering이 정의되어 있습니다.", "식은 probability identity이며 encoder가 RNN인지 Transformer인지 정하지 않습니다."]}
        interpretation="Seq2Seq의 본질은 LSTM이라는 cell 이름이 아니라 P(Y|X)의 autoregressive factorization입니다. Architecture와 decoding은 각 conditional을 계산하고 탐색하는 방법입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-seq2seq" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
          <p className="text-xs font-bold text-primary">논문 읽기 · 2014 Seq2Seq</p>
          <p className="mt-2 text-sm font-semibold">Sequence to Sequence Learning with Neural Networks</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            깊은 LSTM 두 개면 가변 길이 source를 fixed-dimensional representation에 담고 그 조건에서 가변 길이 target을 생성할 수 있습니다. 이
            논문이 보여 준 핵심입니다. Source 단어 순서를 뒤집은 실험은 해당 WMT setup에서 source와 target 사이의 짧은 dependency를 만들어
            optimization을 도왔습니다. Reversal이 모든 sequence task에 필요한지는 이 실험 하나로 정해지지 않습니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://proceedings.neurips.cc/paper_files/paper/2014/hash/a14ac55a4f27472c5d894ec1c3c743d2-Abstract.html" target="_blank" rel="noreferrer">원 논문과 실험 조건 보기</a>
        </div>
        <p>
          Recurrent state와 LSTM gate는 <Link to="/ai/rnn">RNN 글</Link>과
          <Link to="/ai/lstm">LSTM 글</Link>이 소유한다. 여기서는 두 network 사이의
          interface와 조건부 generation에서 생기는 training·search 문제에 집중한다.
        </p>
      </div>
    </section>
  );
}
