import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import AdditiveAttnViz from './viz/AdditiveAttnViz';

const addCode = `Bahdanau (Additive) Attention:

1. 정렬 점수 (Alignment Score):
   e_ij = v^T * tanh(W_a * s_{i-1} + U_a * h_j)
   v, W_a, U_a: 학습 가능한 파라미터

2. 어텐션 가중치:
   a_ij = softmax_j(e_ij)
   = exp(e_ij) / Sum_k(exp(e_ik))

3. 컨텍스트 벡터:
   c_i = Sum_j(a_ij * h_j)
   디코더 입력에 concat: [y_{i-1}; c_i]`;

const annotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'MLP 기반 정렬 점수' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'Softmax 정규화' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: '가중합 → 컨텍스트' },
];

export default function Additive() {
  return (
    <section id="additive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bahdanau (Additive) Attention</h2>
      <div className="not-prose mb-8"><AdditiveAttnViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bahdanau Attention(2015) — 최초의 어텐션 메커니즘<br />
          디코더 상태 s + 인코더 히든 스테이트 h를 <strong>MLP(다층 퍼셉트론, 작은 신경망)</strong>에 통과 → 정렬 점수(alignment score) 계산<br />
          "Additive" = s와 h를 <strong>더한 뒤</strong> tanh 적용하기 때문
        </p>

        <CitationBlock source="Bahdanau et al., 2015" citeKey={2} type="paper"
          href="https://arxiv.org/abs/1409.0473">
          <p className="italic">"The decoder decides which parts of the source sentence to pay
          attention to. This frees the model from having to encode the whole source sentence
          into a fixed-length vector."</p>
        </CitationBlock>

        <CodePanel title="Bahdanau Attention 수식" code={addCode} annotations={annotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Additive Attention 상세 동작</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bahdanau Attention 상세 계산
//
// 파라미터:
//   s_{i-1} : 디코더 이전 상태 (dim d_s)
//   h_j     : 인코더 j번째 hidden state (dim d_h)
//   W_a     : (d_attn × d_s)
//   U_a     : (d_attn × d_h)
//   v       : (d_attn,)
//
// 정렬 점수 계산 (각 j마다):
//   projected = W_a · s_{i-1} + U_a · h_j   # (d_attn,)
//   transformed = tanh(projected)            # 비선형성
//   e_ij = v^T · transformed                 # scalar
//
// Softmax 정규화:
//   α_ij = exp(e_ij) / Σ_k exp(e_ik)
//
// Context 벡터:
//   c_i = Σ_j α_ij · h_j                     # (d_h,)
//
// 디코더 업데이트:
//   s_i = RNN(s_{i-1}, concat(y_{i-1}, c_i))
//   y_i = softmax(W_out · s_i)

// Additive의 특징:
//   - MLP 기반 (학습 가능한 alignment function)
//   - Q와 K가 다른 차원일 때도 OK
//   - 유연하지만 계산 비용 높음
//   - 작은 차원에서 Dot-product보다 우수`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">번역에서의 정렬 학습 예시</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// English → French 번역 정렬 시각화
//
// 입력: "The cat sat on the mat"
// 출력: "Le chat s'est assis sur le tapis"
//
// Attention 매트릭스 (α_ij):
//
//           The  cat  sat  on   the  mat
//   Le      0.9  0.0  0.0  0.0  0.1  0.0
//   chat    0.0  0.9  0.1  0.0  0.0  0.0
//   s'est   0.0  0.0  0.5  0.1  0.0  0.0
//   assis   0.0  0.0  0.8  0.1  0.0  0.0
//   sur     0.0  0.0  0.0  0.9  0.0  0.1
//   le      0.0  0.0  0.0  0.0  0.9  0.1
//   tapis   0.0  0.0  0.0  0.0  0.0  0.9
//
// 주요 관찰:
//   - 대각선에 가까운 패턴 (단조 정렬)
//   - 일대일, 일대다 매핑 자동 학습
//   - 언어 어순 차이도 포착
//
// 예: "Je le veux" (I want it) → 순서 역전
//           I    want  it
//   Je      0.9  0.1   0.0
//   le      0.0  0.1   0.9  ← 역순!
//   veux    0.1  0.9   0.0
//
// 정렬의 명시적 감독 없이 자동 학습
// → 번역 품질 + 해석 가능성 동시 확보

// 한계:
//   - 순차적 계산 (병렬화 어려움)
//   - RNN 기반이라 장기 의존성 여전
//   - Luong에서 효율 개선, Transformer에서 완전 혁신`}
        </pre>
        <p className="leading-7">
          요약 1: Bahdanau는 <strong>v^T·tanh(Ws + Uh)</strong>로 alignment score 계산 — MLP 방식.<br />
          요약 2: 번역 시 <strong>명시적 감독 없이</strong> 단어 정렬 자동 학습 — 해석 가능성 높음.<br />
          요약 3: 계산 비용이 높아 Luong의 multiplicative로 진화 — 효율성 개선의 출발점.
        </p>
      </div>
    </section>
  );
}
