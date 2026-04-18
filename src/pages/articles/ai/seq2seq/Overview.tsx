import { RoughNotation } from 'react-rough-notation';
import Seq2SeqFlowViz from './viz/Seq2SeqFlowViz';
import S2SOverviewViz from './viz/S2SOverviewViz';
import M from '@/components/ui/math';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Seq2Seq란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>기계번역의 근본 문제</h3>
        <p>
          영어{' '}
          <RoughNotation type="highlight" show color="#fef08a" animationDelay={300}>
            "Thank you"
          </RoughNotation>
          를 한국어로 번역하면{' '}
          <RoughNotation type="highlight" show color="#bbf7d0" animationDelay={600}>
            "고마워"
          </RoughNotation>
          <br />
          단어 수가 다르고(2 → 1), 어순도 다르다<br />
          입력과 출력의 길이가 달라도 처리할 수 있는 구조가 필요
        </p>

        <h3>인코더-디코더 구조</h3>
        <p>
          Sutskever et al. (2014) — LSTM 기반{' '}
          <strong>인코더-디코더</strong>(Encoder-Decoder) 구조로 해결<br />
          인코더: 입력 시퀀스를 하나의 고정 길이 벡터로 압축<br />
          디코더: 그 벡터에서 출력 시퀀스를 생성<br />
          입력·출력 길이가 달라도 동작 — "many-to-many" 매핑
        </p>

        <h3>Transformer의 기반 모델</h3>
        <p>
          Seq2Seq → Attention 추가 → Transformer로 발전<br />
          현대 GPT, BERT 모두 이 인코더-디코더 사상(思想)에서 출발
        </p>
      </div>
      <div className="not-prose my-8">
        <Seq2SeqFlowViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Seq2Seq 모델의 수학적 정의와 역사적 혁신</h3>
        <S2SOverviewViz />
        <M display>{'P(Y|X) = \\prod_{t=1}^{T\'} \\underbrace{P(y_t \\mid y_{<t},\\, X)}_{\\text{autoregressive 분해}}'}</M>
        <p className="leading-7">
          Encoder: <M>{'h_t = \\text{LSTM}(x_t,\\, h_{t-1})'}</M>, context <M>{'c = h_T'}</M><br />
          Decoder: <M>{'s_t = \\text{LSTM}(y_{t-1},\\, s_{t-1},\\, c)'}</M>, <M>{'P(y_t) = \\text{softmax}(W \\cdot s_t)'}</M>
        </p>
        <M display>{'\\mathcal{L} = -\\sum_{t=1}^{T\'} \\underbrace{\\log P(y_t \\mid y_{<t},\\, X)}_{\\text{MLE: negative log-likelihood}}'}</M>
        <p className="leading-7">
          요약 1: Seq2Seq는 <strong>가변 길이 입력·출력</strong> 문제를 encoder-decoder로 해결.<br />
          요약 2: <strong>조건부 확률 P(Y|X)</strong>를 autoregressive로 분해 — 현대 LLM의 본질.<br />
          요약 3: Sutskever 2014가 <strong>Phrase-based MT 시대 종료</strong>를 선언한 역사적 모델.
        </p>
      </div>
    </section>
  );
}
