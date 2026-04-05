import InformationViz from './viz/InformationViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '확률과 정보'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          확률이 높은 사건이 발생 → 당연한 결과, 놀라움 없음<br />
          확률이 낮은 사건이 발생 → 예상 밖, 매우 놀라움<br />
          <strong>정보(Information)</strong> = 이 "놀라움"을 수학으로 표현한 것
        </p>

        <h3>정보량 = -log P(x)</h3>
        <p>
          확률 P(x)가 클수록 정보량은 작음<br />
          확률 P(x)가 작을수록 정보량은 큼<br />
          로그를 쓰는 이유 — 정보 이론(Information Theory)의 관례로 비트(bit) 단위 표현이 가능
        </p>

        <h3>제비뽑기 비유</h3>
        <p>
          100장 중 99장이 빈 종이, 1장이 당첨<br />
          빈 종이를 뽑음 → 정보량 ≈ 0.014 bit (거의 놀랍지 않음)<br />
          당첨을 뽑음 → 정보량 ≈ 6.64 bit (매우 놀라움)<br />
          희귀한 사건일수록 전달되는 정보가 많음
        </p>
      </div>
      <div className="mt-8">
        <InformationViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Shannon 정보이론 기초</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 정보(Information)의 공리적 요구사항
//
// "정보량 I(x)"가 가져야 할 성질:
//
// 1. I(x) ≥ 0
//    - 정보는 음수가 될 수 없음
//
// 2. I(x) → 0 as P(x) → 1
//    - 확실한 사건은 정보 없음
//
// 3. I(x) > I(y) if P(x) < P(y)
//    - 드문 사건일수록 정보 많음
//
// 4. I(x, y) = I(x) + I(y)  if x, y independent
//    - 독립 사건의 정보는 합산
//
// 이 공리들을 만족하는 유일한 함수:
//   I(x) = -log_b P(x)
//
//   (곱셈이 덧셈 되는 함수 = 로그)
//
// log base 선택:
//   base 2: bit (binary digit)
//   base e: nat (natural unit)
//   base 10: hartley / dit
//
// 변환:
//   1 nat = 1/ln(2) bit ≈ 1.443 bit
//   1 hartley = log_2(10) bit ≈ 3.322 bit

// Shannon (1948):
//   "A Mathematical Theory of Communication"
//   정보이론 창시
//   통신 채널의 최대 전송 속도
//   압축 한계 (Shannon's source coding theorem)
//   → ML의 모든 probabilistic loss의 기반`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">정보이론과 ML의 연결</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 정보이론 개념이 ML 손실에 어떻게 쓰이는지
//
// Cross-Entropy Loss:
//   L = -Σ P(x) log Q(x)
//   = 모델 Q로 데이터 P 인코딩 시 평균 비트 수
//
// KL Divergence:
//   KL(P||Q) = Σ P(x) log(P(x)/Q(x))
//   = Q 대신 P 쓸 때의 추가 비트 (inefficiency)
//
// Maximum Likelihood:
//   log P(data|θ) 최대화
//   ≡ -log P(data|θ) 최소화
//   ≡ Cross-Entropy 최소화
//
// Perplexity:
//   PPL = 2^H(P) = exp(CE)
//   언어 모델 평가 표준
//
// Mutual Information:
//   I(X; Y) = H(X) - H(X|Y)
//   representation learning, feature selection
//
// Information Bottleneck:
//   min I(X; Z) - β I(Z; Y)
//   deep learning 이론적 설명

// 왜 log를 쓰는가?
//   1. 독립 이벤트의 정보 합산
//   2. MLE의 수치 안정성 (log-likelihood)
//   3. 곱셈 → 덧셈 (계산 편의)
//   4. 기울기가 덧셈 구조 (backprop)
//   5. 정보이론적 해석 (bits)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>정보량 = -log P(x)</strong> — Shannon의 공리에서 유도되는 유일한 함수.<br />
          요약 2: <strong>놀라움의 수학적 표현</strong> — 드물수록 정보 많음.<br />
          요약 3: 모든 ML의 확률적 loss가 <strong>정보이론의 응용</strong>.
        </p>
      </div>
    </section>
  );
}
