import LanguageModelViz from './viz/LanguageModelViz';
import RNNLMDetailViz from './viz/RNNLMDetailViz';
import M from '@/components/ui/math';

export default function LanguageModel() {
  return (
    <section id="language-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">언어 모델</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        <M>{'P(w_t \\mid w_1 \\ldots w_{t-1})'}</M> — 다음 단어 예측이 핵심 과제.<br />
        n-gram은 직전 n-1개만 참조. RNN 은닉 상태는 이론적으로 무한 맥락 압축.
      </p>
      <LanguageModelViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">RNN Language Model</h3>
        <RNNLMDetailViz />
        <p className="leading-7">RNN 언어 모델:</p>
        <M display>{'P(w_t \\mid w_1 \\ldots w_{t-1}) = \\text{softmax}(\\underbrace{W_{hy}}_{\\text{출력 가중치}} \\cdot \\underbrace{h_t}_{\\text{문맥 압축}})'}</M>
        <p className="leading-7">
          은닉 상태 <M>{'h_t'}</M>가 전체 이전 문맥을 압축. 학습 목표:
        </p>
        <M display>{'\\underbrace{L = -\\frac{1}{T} \\sum_{t=1}^{T} \\log P(w_t)}_{\\text{평균 Cross-Entropy}}, \\quad \\underbrace{\\text{PPL} = e^L}_{\\text{후보 단어 수}}'}</M>
        <p className="leading-7">
          Perplexity(PPL) = 모델이 각 위치에서 "고려하는 후보 단어 수"로 해석. PPL=100이면 100개 중 하나를 고르는 수준.<br />
          n-gram(직전 n-1개만 참조)과 달리 RNN은 이론상 무한 과거를 참조하지만, vanishing gradient로 실제 10~20스텝이 한계.<br />
          생성 전략: greedy(argmax), temperature(<M>{'T<1'}</M> sharp / <M>{'T>1'}</M> 다양), top-k, top-p(nucleus sampling).<br />
          2017년 Transformer 등장 이후 대부분 대체되었으나, CE·PPL·샘플링 개념은 GPT 시대에도 그대로 적용.
        </p>
      </div>
    </section>
  );
}
