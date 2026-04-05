import CodePanel from '@/components/ui/code-panel';
import NegSamplingViz from './viz/NegSamplingViz';
import TrainingPipelineViz from './viz/TrainingPipelineViz';
import {
  negSamplingCode, negSamplingAnnotations,
  hierarchicalSoftmaxCode, hierarchicalAnnotations,
  subsamplingCode, subsamplingAnnotations,
  cOptimizationCode, cOptimizationAnnotations,
} from './TrainingData';

export default function Training({ title }: { title?: string }) {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '학습 알고리즘'}</h2>
      <TrainingPipelineViz />
      <div className="not-prose mb-8"><NegSamplingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Softmax 분모 — 어휘 V 전체를 순회해야 하므로 O(V)<br />
          V = 100만이면 매 역전파마다 100만 번 연산 — 실용적으로 불가능<br />
          Word2Vec은 두 가지 근사법으로 해결
        </p>

        <h3>① Negative Sampling (NEG)</h3>
        <p>
          "이 단어 쌍이 실제로 맥락에서 함께 등장하는가?" — 이진 분류 문제로 변환<br />
          실제 맥락 단어 1개(positive)에 대해 k개의 노이즈 단어(negative)를 랜덤 샘플링<br />
          진짜 쌍과 가짜 쌍을 구별하도록 학습
        </p>
        <CodePanel title="Negative Sampling 목적 함수" code={negSamplingCode} annotations={negSamplingAnnotations} />
        <p>
          k는 보통 5~20 — 작은 데이터에서는 크게, 대용량 코퍼스에서는 작게 설정
        </p>

        <h3>② Hierarchical Softmax (HS)</h3>
        <p>
          어휘를 <strong>Huffman 트리</strong>(빈도 기반 이진 트리)로 구성<br />
          고빈도 단어는 루트 가까이, 저빈도 단어는 깊은 레벨에 배치<br />
          예측 시 루트에서 해당 잎까지 이진 경로를 따라가며 시그모이드 계산
        </p>
        <CodePanel title="Hierarchical Softmax" code={hierarchicalSoftmaxCode} annotations={hierarchicalAnnotations} />

        <h3>서브샘플링 (Subsampling)</h3>
        <p>
          "은, 는, 이, 가" 같은 고빈도 단어 — 의미적 기여가 낮음<br />
          빈도에 반비례하는 확률로 훈련에서 건너뜀:
        </p>
        <CodePanel title="서브샘플링 확률" code={subsamplingCode} annotations={subsamplingAnnotations} />

        <h3>Dynamic Context Window</h3>
        <p>
          고정 윈도우 대신 1 ~ max_window 사이에서 무작위로 크기 선택<br />
          중심 단어에서 멀수록 샘플링 빈도가 낮아짐 — 가까운 단어가 더 강하게 학습
        </p>

        <h3>구현 최적화 (C 코어)</h3>
        <CodePanel title="C 구현 최적화 기법" code={cOptimizationCode} annotations={cOptimizationAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Negative Sampling 수식 유도</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Negative Sampling (NEG)
//
// 원래 Skip-gram 목적 함수:
//   L = Σ_{(w,c)∈D} log P(c|w)
//     = Σ log(exp(v_c · v_w) / Σ_{c'∈V} exp(v_c' · v_w))
//
//   문제: 분모 Σ_{c'∈V} 계산 비용 O(V)
//   V = 100만이면 매번 100만 번 연산
//
// NEG의 아이디어:
//   "정답 context vs 랜덤 negative"를 이진 분류
//
// 새 목적 함수:
//   L_neg = log σ(v_c · v_w) + Σ_{i=1..k} E_{w_i ~ P_n}[log σ(-v_wi · v_w)]
//
// 해석:
//   첫 항: (center, real context) 쌍의 확률 최대화
//   둘째 항: (center, k random words) 쌍의 확률 최소화
//
// σ(x) = sigmoid(x) = 1/(1+e^(-x))
//
// Noise Distribution P_n:
//   P_n(w) ∝ freq(w)^(3/4)
//   - 원 빈도 그대로 쓰면 고빈도 단어만 샘플링
//   - 0.75 power로 중저빈도 단어 보정
//   - 실험적으로 최적

// k 값 선택:
//   small data: k = 10~20
//   large data: k = 2~5
//   데이터 많을수록 작은 k로 충분

// 연산 비용 비교:
//   Softmax: O(V) = O(100K~1M)
//   NEG(k=5): O(k+1) = O(6)
//   → 수만 배 빠름!

// Python 구현 (간소화):
def neg_sampling_loss(center_vec, context_vec, noise_vecs):
    # center_vec: (D,)
    # context_vec: (D,)  positive
    # noise_vecs: (k, D)  negatives

    pos_score = sigmoid(center_vec @ context_vec)
    neg_scores = sigmoid(-noise_vecs @ center_vec)

    loss = -log(pos_score) - sum(log(neg_scores))
    return loss`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Hierarchical Softmax 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Hierarchical Softmax (HS)
//
// 아이디어: 어휘를 이진 트리로 구조화
//
// Huffman Tree 구성:
//   - 고빈도 단어: 짧은 경로 (root 근처)
//   - 저빈도 단어: 긴 경로 (깊은 리프)
//
// 예시 (4 단어):
//
//           [root]
//          /      \\
//      [inner]   the  ← 고빈도, 경로 1
//       /   \\
//      cat  dog  ← 중빈도, 경로 2
//              \\
//               rare  ← 저빈도, 경로 3
//
// 각 inner node는 학습 가능한 벡터 θ_n 보유
//
// 확률 계산:
//   P(w) = ∏_{n ∈ path(w)} σ([left or right] · θ_n · v_w)
//
//   [left or right]: -1 또는 +1 (경로 방향)
//
// 연산 비용:
//   기존 softmax: O(V)
//   HS: O(log V)
//
//   V = 1M → log(1M) ≈ 20 연산만 필요

// 학습:
//   각 경로 노드의 θ를 업데이트
//   Negative Sampling보다 구현 복잡
//   저빈도 단어 학습에 유리
//
// 현대 추세:
//   - NEG이 더 인기 (구현 간단, 품질 유사)
//   - HS는 연구 목적이나 특수 케이스에 사용

// Subsampling:
//   P(w) = 1 - sqrt(t / freq(w))
//   t = 1e-5 보통
//
//   고빈도 단어("the", "of")는 높은 확률로 제외
//   저빈도 단어는 그대로 학습
//   → 학습 속도 2~10배 향상
//   → 품질도 개선 (노이즈 제거)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Negative Sampling</strong>이 O(V)→O(k+1)로 수만 배 가속.<br />
          요약 2: <strong>Hierarchical Softmax</strong>는 이진 트리로 O(log V).<br />
          요약 3: <strong>Subsampling</strong>으로 고빈도 단어 제외 — 품질·속도 동시 개선.
        </p>
      </div>
    </section>
  );
}
