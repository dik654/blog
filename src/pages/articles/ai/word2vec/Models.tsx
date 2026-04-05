import CodePanel from '@/components/ui/code-panel';
import ModelViz from './viz/ModelViz';
import {
  cbowCode, cbowAnnotations,
  skipgramCode, skipgramAnnotations,
  objectiveCode, objectiveAnnotations,
} from './ModelsData';

export default function Models({ title }: { title?: string }) {
  return (
    <section id="models" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Skip-gram & CBOW'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Word2Vec — 두 가지 학습 아키텍처를 제공<br />
          둘 다 얕은 신경망(shallow neural network, 은닉층이 1개인 구조) 기반<br />
          역전파로 임베딩 행렬 <strong>W</strong>(입력)와 <strong>W'</strong>(출력)를 학습
        </p>

        <h3>CBOW (Continuous Bag of Words)</h3>
        <p>
          빈칸 추론 문제와 동일 — "I ___ pizza" → 정답 "love"<br />
          주변 맥락 단어(context)를 입력, <strong>중심 단어(target)를 예측</strong><br />
          윈도우 크기 c 안의 주변 단어 벡터를 평균 → 은닉층 → softmax로 중심 단어 예측
        </p>
        <CodePanel title="CBOW 구조" code={cbowCode} annotations={cbowAnnotations} />
        <p>
          CBOW — 작은 데이터셋에서 더 빠르고, 고빈도 단어를 더 잘 학습
        </p>

        <h3>Skip-gram</h3>
        <p>
          반대로 <strong>중심 단어로 주변 맥락 단어들을 예측</strong><br />
          하나의 입력으로 여러 개의 예측을 수행 — 학습 데이터가 더 많이 생성
        </p>
        <CodePanel title="Skip-gram 구조" code={skipgramCode} annotations={skipgramAnnotations} />
        <p>
          Skip-gram — 저빈도 단어와 대규모 데이터셋에 더 효과적<br />
          대부분의 실용적 상황에서 더 좋은 품질의 임베딩을 생성
        </p>

        <h3>은닉층에 활성화 함수가 없는 이유</h3>
        <p>
          Word2Vec의 은닉층은 sigmoid/ReLU 같은 비선형 활성화 함수를 <strong>사용하지 않음</strong><br />
          목적이 복잡한 분류가 아니라 단어 관계의 <strong>정확한 선형 표현</strong><br />
          비선형 함수가 단어 간 관계를 왜곡 → 모든 단어가 공평하게 표현되어야 함
        </p>

        <h3>목적 함수</h3>
        <p>
          두 모델 모두 로그 우도(Log-Likelihood, 데이터가 모델에 의해 관측될 확률)를 최대화<br />
          Skip-gram의 경우:
        </p>
        <CodePanel title="Skip-gram 목적 함수" code={objectiveCode} annotations={objectiveAnnotations} />
      </div>
      <div className="mt-8">
        <ModelViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CBOW vs Skip-gram 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CBOW 상세 흐름
//
// Input: 컨텍스트 단어들 (window=2)
//   "The cat [MASK] on the mat"
//   context = [The, cat, on, the]
//   target = sat
//
// Step 1: 각 컨텍스트 단어 임베딩 조회
//   v_context = [W[the], W[cat], W[on], W[the]]
//             shape: (4, 300)
//
// Step 2: 평균 (또는 합)
//   h = mean(v_context)  # (300,)
//
// Step 3: 출력 레이어
//   logits = h @ W'.T  # (V,)
//
// Step 4: Softmax & Loss
//   p = softmax(logits)
//   loss = -log p[target]
//
// 파라미터:
//   W: (V, D) 입력 임베딩
//   W': (V, D) 출력 임베딩
//   V = 어휘 크기, D = 임베딩 차원 (보통 300)

// Skip-gram 상세 흐름
//
// Input: 중심 단어
//   "The cat [sat] on the mat"
//   target (center) = sat
//   contexts = [The, cat, on, the, mat]
//
// Step 1: 중심 단어 임베딩
//   h = W[sat]  # (300,)
//
// Step 2: 각 컨텍스트 예측
//   for context_word in contexts:
//     logits = h @ W'.T  # (V,)
//     p = softmax(logits)
//     loss += -log p[context_word]
//
// 하나의 (center, context) 쌍 당 1 업데이트
// window=5면 한 문장에서 10배 더 많은 학습 신호

// 실험 결과 (Mikolov 2013):
//
// ┌──────────┬─────────┬──────────┬────────────┐
// │  모델    │ semantic│ syntactic│  속도      │
// ├──────────┼─────────┼──────────┼────────────┤
// │ CBOW     │  60%    │  53%     │  빠름 (5x) │
// │ Skip-gram│  61%    │  69%     │  느림      │
// └──────────┴─────────┴──────────┴────────────┘
//
// 권장:
//   - 소규모 데이터: CBOW (빠르고 안정)
//   - 대규모 데이터: Skip-gram (품질 우수)
//   - 저빈도 단어 중요: Skip-gram`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Embedding 추출</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 학습 완료 후 임베딩 행렬 활용
//
// Word2Vec은 두 개의 행렬을 학습:
//   W: 입력 임베딩 (center words)
//   W': 출력 임베딩 (context words)
//
// 최종 임베딩 선택:
//   Option 1: W만 사용 (일반적)
//   Option 2: W + W' 합산
//   Option 3: (W + W') / 2 평균
//
// 실무에서는 W 사용이 표준

// 임베딩 활용:
//   vocab = {"king": 0, "queen": 1, "man": 2, "woman": 3, ...}
//   W.shape  # (V, 300)
//
//   king_vec = W[vocab["king"]]  # 300-dim vector
//   queen_vec = W[vocab["queen"]]
//
//   similarity = cosine(king_vec, queen_vec)  # 높음
//
//   analogy = W[vocab["king"]] - W[vocab["man"]] + W[vocab["woman"]]
//   # analogy ≈ W[vocab["queen"]]

// Gensim 라이브러리:
from gensim.models import Word2Vec

# 학습
sentences = [["the", "cat", "sat"], ["the", "dog", "ran"]]
model = Word2Vec(
    sentences,
    vector_size=300,   # embedding 차원
    window=5,           # context window
    min_count=5,        # 최소 등장 빈도
    workers=4,          # 병렬
    sg=1                # 1=Skip-gram, 0=CBOW
)

# 사용
king_vec = model.wv["king"]
similar = model.wv.most_similar("king")
analogy = model.wv.most_similar(
    positive=["king", "woman"],
    negative=["man"]
)  # [("queen", 0.82), ...]`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>CBOW</strong>는 context → center, <strong>Skip-gram</strong>은 center → context.<br />
          요약 2: Skip-gram이 <strong>syntactic 태스크</strong>에서 우수, CBOW는 속도 우위.<br />
          요약 3: 학습 후 <strong>W 행렬</strong>이 최종 단어 임베딩 — 행마다 하나의 단어.
        </p>
      </div>
    </section>
  );
}
