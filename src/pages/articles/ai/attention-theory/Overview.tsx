import { CitationBlock } from '@/components/ui/citation';
import Seq2SeqViz from './viz/Seq2SeqViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Seq2Seq 한계와 어텐션의 등장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Seq2Seq — 인코더가 입력을 <strong>하나의 고정 길이 벡터</strong>로 압축, 디코더가 이를 참조해 출력 생성<br />
          문장이 길어지면 <strong>정보 병목(Bottleneck, 하나의 벡터에 모든 정보를 담아야 하는 제약)</strong> 발생<br />
          어텐션 — 디코더가 매 출력 스텝마다 인코더의 <strong>모든 히든 스테이트를 동적으로 참조</strong>하여 병목 해소
        </p>

        <CitationBlock source="Bahdanau et al., 2015 — Neural Machine Translation by Jointly Learning to Align and Translate"
          citeKey={1} type="paper" href="https://arxiv.org/abs/1409.0473">
          <p className="italic">"A potential issue with this encoder-decoder approach is that a neural
          network needs to compress all information into a fixed-length vector."</p>
        </CitationBlock>
      </div>

      <div className="not-prose my-8"><Seq2SeqViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">어텐션 메커니즘의 발전 단계</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">이름</th>
                <th className="border border-border px-4 py-2 text-left">연도</th>
                <th className="border border-border px-4 py-2 text-left">핵심 아이디어</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Bahdanau (Additive)', '2015', 'MLP로 정렬 점수 계산'],
                ['Luong (Multiplicative)', '2015', '내적(dot-product)으로 점수 계산'],
                ['Self-Attention', '2017', '입력 자신에 대한 어텐션'],
                ['Multi-Head', '2017', '여러 어텐션 헤드 병렬 적용'],
              ].map(([name, year, idea]) => (
                <tr key={name}>
                  <td className="border border-border px-4 py-2 font-medium">{name}</td>
                  <td className="border border-border px-4 py-2">{year}</td>
                  <td className="border border-border px-4 py-2">{idea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Seq2Seq의 정보 병목 문제</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Seq2Seq 원리 (Sutskever et al. 2014)
//
// Encoder (RNN/LSTM):
//   x_1, x_2, ..., x_T  →  h_1, h_2, ..., h_T
//
// 마지막 hidden state h_T → "context vector" c
//   c = h_T  (고정 차원, 예: 512)
//
// Decoder:
//   s_0 = c  (decoder 초기 상태)
//   s_t = f(s_{t-1}, y_{t-1})
//   y_t = softmax(W·s_t)
//
// 문제:
//   - 모든 입력 정보를 1개 벡터에 압축
//   - 긴 문장일수록 정보 손실 증가
//   - 30단어 이상에서 성능 급락
//
// 실험 결과 (Cho et al. 2014):
//   ┌─────────┬──────────────┐
//   │ 문장길이│  BLEU score  │
//   ├─────────┼──────────────┤
//   │  < 10   │    26.5      │
//   │ 10-20   │    28.1      │
//   │ 20-30   │    25.8      │
//   │ 30-40   │    17.3  ← 급락
//   │  > 40   │    12.4      │
//   └─────────┴──────────────┘
//
// 인간의 번역 방식에서 영감:
//   - 한 번에 전체 문장 외우지 않음
//   - 필요한 부분을 "다시 보며" 번역
//   - 주의(attention)를 동적으로 이동
//
// Bahdanau의 해결책 (2015):
//   c_i = Σ α_ij · h_j
//   → 디코더 매 스텝마다 다른 context vector
//   → 모든 인코더 상태 직접 참조`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Attention의 일반 프레임워크</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Attention의 일반 수식 (Q, K, V 관점)
//
// 입력:
//   Query Q:   "무엇을 찾고 싶은가"
//   Key K:     "각 위치의 식별자"
//   Value V:   "각 위치의 내용"
//
// 3단계 연산:
//
// Step 1: Score (Q와 K의 유사도)
//   s_i = score(Q, K_i)
//
// Step 2: Weight (normalize)
//   α_i = softmax(s_i) = exp(s_i) / Σ_j exp(s_j)
//
// Step 3: Value aggregation (가중합)
//   output = Σ_i α_i · V_i
//
// Score 함수 종류:
//   - Additive:      v^T · tanh(W[Q;K])
//   - Dot-product:   Q^T · K
//   - Scaled dot:    Q^T · K / sqrt(d)
//   - Bilinear:      Q^T · W · K
//   - Cosine:        (Q·K) / (|Q|·|K|)

// 직관적 비유:
//   정보 검색 시스템처럼 작동
//   - Query = 검색어
//   - Key = 문서 제목 (인덱스)
//   - Value = 문서 내용
//   → 쿼리와 가장 유사한 키의 값을 가져옴
//   → 단, 단일 선택이 아닌 가중합

// Attention의 3가지 축:
//   1. Q와 K의 출처 (같음 = self, 다름 = cross)
//   2. Score 계산 방법 (additive/multiplicative)
//   3. 제약 유무 (causal mask, global/local)`}
        </pre>
        <p className="leading-7">
          요약 1: Seq2Seq의 <strong>정보 병목</strong>이 attention 필요성을 만듦 — 30단어 이상 성능 급락.<br />
          요약 2: Attention의 본질은 <strong>Query-Key 유사도로 Value 가중합</strong>.<br />
          요약 3: Score 함수 선택이 attention 변형들을 구분 — additive/multiplicative/scaled.
        </p>
      </div>
    </section>
  );
}
