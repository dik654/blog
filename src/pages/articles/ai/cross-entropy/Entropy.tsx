import EntropyViz from './viz/EntropyViz';

export default function Entropy({ title }: { title?: string }) {
  return (
    <section id="entropy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '엔트로피: 불확실성의 척도'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        H(P) = -Σ P(x)·log P(x) — 놀라움의 기대값.<br />
        편향된 분포 → 낮은 엔트로피, 균등 분포 → 높은 엔트로피.
      </p>
      <EntropyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Information Content (자기 정보량)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 사건 x의 정보량
// I(x) = -log P(x)

// 직관
// - 확률 낮은 사건 → 정보 많음 (많이 놀람)
// - 확률 높은 사건 → 정보 적음 (당연함)
// - I(x) >= 0 (확률 <= 1이므로)
// - P(x) = 1이면 I(x) = 0 (놀라움 없음)

// 예시
// 동전 던지기 (공평)
// P(heads) = 0.5, I(heads) = -log(0.5) = 1 bit

// 주사위 굴리기
// P(1) = 1/6, I(1) = -log(1/6) ≈ 2.58 bits

// 복권 당첨
// P(win) = 10^-7, I(win) ≈ 23.3 bits   (매우 놀라움)

// Log base 선택
// base 2: bits (정보이론 표준)
// base e: nats (수학/통계)
// base 10: dits/hartleys (거의 안 씀)

// 1 bit = log2(2) = 1
// 2 bits = log2(4) = 2
// 3 bits = log2(8) = 3`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Shannon Entropy 수식 유도</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Entropy = 정보량의 기대값
// H(P) = E[I(X)] = -Σ P(x) log P(x)

// 속성
// 1. H(P) >= 0
// 2. H(P) = 0 iff P is deterministic (한 사건만 확률 1)
// 3. H(P) <= log(N) for N outcomes
// 4. H(P) = log(N) iff P is uniform

// 공평한 분포 vs 편향된 분포
// Uniform (n=4): P = [0.25, 0.25, 0.25, 0.25]
// H = -4 × (0.25 × log2(0.25)) = 2 bits

// Biased: P = [0.9, 0.05, 0.03, 0.02]
// H = -(0.9·log2(0.9) + 0.05·log2(0.05) + 0.03·log2(0.03) + 0.02·log2(0.02))
//   ≈ 0.63 bits (훨씬 낮음)

// Deterministic: P = [1, 0, 0, 0]
// H = -(1·log2(1) + 0 + 0 + 0) = 0 bits

// 해석
// 엔트로피 = "평균적으로 sample을 인코딩하려면 몇 bits 필요"
// 또는 "분포의 불확실성 정도"`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ML에서 Entropy 활용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 1. Decision Tree (의사결정 트리)
// Information Gain으로 분기 선택
// IG(S, A) = H(S) - Σ (|S_v|/|S|) · H(S_v)
// - 분기 후 entropy 감소량 계산
// - 최대 IG인 feature로 split

// 2. Cross-Entropy Loss
// L(P, Q) = -Σ P(x) log Q(x) = H(P) + KL(P||Q)
// - P = true, Q = predicted
// - H(P, Q) >= H(P) (Gibbs inequality)

// 3. Maximum Entropy Principle
// "부족한 정보를 가정으로 채우지 말고, 가장 '무지한' 분포 선택"
// - 제약 조건 + MaxEnt → 자연스러운 분포
// - Logistic regression, MaxEnt classifier

// 4. Entropy Regularization (RL)
// - Policy entropy 최대화 유도
// - Exploration 증진
// - A3C, PPO 등에서 bonus term

// 5. Mutual Information
// I(X; Y) = H(X) - H(X|Y)
// - 두 변수 간 통계적 의존성
// - InfoGAN, Information Bottleneck

// Python 구현
import numpy as np
def entropy(p, base=2):
    p = np.asarray(p)
    p = p[p > 0]  # 0 제외 (log 0 문제)
    return -np.sum(p * np.log(p) / np.log(base))

print(entropy([0.25, 0.25, 0.25, 0.25]))  # 2.0
print(entropy([0.9, 0.05, 0.03, 0.02]))   # ~0.63`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Conditional Entropy & Mutual Information</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Conditional Entropy
// H(Y|X) = -Σ P(x,y) log P(y|x)
//        = Σ P(x) · H(Y|X=x)

// "X를 알 때 Y에 대한 불확실성"

// Joint Entropy
// H(X, Y) = -ΣΣ P(x,y) log P(x,y)

// Chain Rule
// H(X, Y) = H(X) + H(Y|X) = H(Y) + H(X|Y)

// Mutual Information
// I(X; Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)
//         = H(X) + H(Y) - H(X,Y)

// 직관
// I(X;Y) = "X를 알면 Y에 대해 얼마나 더 알게 되는가"
// - I(X;Y) = 0: X와 Y 독립
// - I(X;Y) = H(X) = H(Y): X와 Y는 같은 정보 (X = f(Y))

// 실제 응용
// - Feature selection: high MI with target
// - Clustering evaluation (NMI score)
// - Information Bottleneck principle
// - Representation learning (MINE, InfoMax)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Entropy와 "놀람"의 관계</p>
          <p>
            <strong>Shannon의 원래 동기</strong> (1948):<br />
            - 통신 채널의 정보 전송 한계 연구<br />
            - "압축 불가능한 정보의 최소량"<br />
            - 노이즈 있는 채널의 최대 전송 속도
          </p>
          <p className="mt-2">
            <strong>ML에서의 번역</strong>:<br />
            - Data의 "압축 어려움" = entropy<br />
            - 좋은 모델 = 실제 data entropy에 근사<br />
            - Cross-entropy loss의 의미: "model Q로 data P 인코딩 시 overhead"
          </p>
          <p className="mt-2">
            <strong>직관적 예</strong>:<br />
            - 영어 텍스트: ~1-1.5 bits/character (예측 가능)<br />
            - 랜덤 문자열: 4.7 bits/character (log2(26))<br />
            - Perfect LLM = 인간 수준 entropy에 근사<br />
            - Scaling laws = entropy 하한에 수렴 과정
          </p>
        </div>

      </div>
    </section>
  );
}
