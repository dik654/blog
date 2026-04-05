import { RoughNotation } from 'react-rough-notation';
import Seq2SeqFlowViz from './viz/Seq2SeqFlowViz';

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
        <h3 className="text-xl font-semibold mt-6 mb-3">Seq2Seq 모델의 수학적 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sutskever et al. 2014 - "Sequence to Sequence Learning with NNs"
//
// 목표: 입력 시퀀스 X → 출력 시퀀스 Y 매핑
//   X = (x_1, x_2, ..., x_T)
//   Y = (y_1, y_2, ..., y_T')
//   T ≠ T'가 일반적
//
// 조건부 확률 분해:
//   P(Y|X) = ∏_{t=1}^{T'} P(y_t | y_{<t}, X)
//
// Encoder:
//   h_t = f(x_t, h_{t-1})        # RNN/LSTM
//   c = h_T                       # 마지막 hidden = context
//
// Decoder:
//   s_t = g(y_{t-1}, s_{t-1}, c)  # autoregressive
//   P(y_t | ...) = softmax(W · s_t)
//
// 학습:
//   L = -Σ_t log P(y_t | y_{<t}, X)   # MLE (negative log likelihood)
//
// 추론 (Greedy):
//   y_t = argmax_w P(w | y_{<t}, X)
//
// 추론 (Beam Search):
//   각 스텝에서 top-k 후보 유지
//   누적 확률 최대 경로 선택

// 예시 (번역):
//   X = "The cat sat"  (T=3)
//   Y = "고양이가 앉았다" (T'=2)
//
//   Encoder:
//     h_1 = LSTM("The", h_0)
//     h_2 = LSTM("cat", h_1)
//     h_3 = LSTM("sat", h_2)
//     c = h_3
//
//   Decoder:
//     s_1 = LSTM(<SOS>, c)
//     y_1 = "고양이가"
//     s_2 = LSTM("고양이가", s_1)
//     y_2 = "앉았다"
//     <EOS>`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Seq2Seq의 역사적 혁신</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2014년 이전 NLP 상황:
//   - Phrase-based Statistical MT (Moses, Koehn 2007)
//   - 단어 정렬 + 구 번역 + 언어 모델의 조합
//   - 수작업 feature engineering
//   - 제한된 성능
//
// Sutskever 2014의 혁신:
//   - 단일 end-to-end 신경망
//   - 2개 LSTM만으로 WMT'14 English→French SOTA 근접
//   - BLEU 34.8 (기존 phrase-based 33.3 상회)
//
// 핵심 트릭:
//   1. 입력 문장 역순 (reverse)
//      - "ABC → DEF" 대신 "CBA → DEF"
//      - 초기 단어 간 거리 단축
//      - BLEU 25.9 → 30.6 (4.7 point 개선)
//
//   2. 4층 LSTM 사용
//      - 1층 24.9 → 4층 34.8
//      - 깊이가 중요
//
//   3. 큰 어휘 (160K) + beam search

// 영향:
//   - 2014: Google이 즉시 채택 (GNMT 2016)
//   - Seq2Seq → Attention (Bahdanau 2015)
//   - Attention → Transformer (Vaswani 2017)
//   - Transformer → BERT/GPT (2018~)
//   - 10년만에 모든 NLP 표준 모델의 조상`}
        </pre>
        <p className="leading-7">
          요약 1: Seq2Seq는 <strong>가변 길이 입력·출력</strong> 문제를 encoder-decoder로 해결.<br />
          요약 2: <strong>조건부 확률 P(Y|X)</strong>를 autoregressive로 분해 — 현대 LLM의 본질.<br />
          요약 3: Sutskever 2014가 <strong>Phrase-based MT 시대 종료</strong>를 선언한 역사적 모델.
        </p>
      </div>
    </section>
  );
}
