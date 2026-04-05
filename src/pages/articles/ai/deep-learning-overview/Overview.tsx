import { RoughNotation } from 'react-rough-notation';
import DepthVsWidthViz from './viz/DepthVsWidthViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 깊은 네트워크인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          얕은 네트워크(2~3층) — 이론상 어떤 함수든 근사 가능(만능 근사 정리)<br />
          그러나{' '}
          <RoughNotation type="highlight" show color="#fef08a" animationDelay={300}>
            필요한 뉴런 수가 기하급수적으로 증가
          </RoughNotation>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">깊이의 효율성</h3>
        <p>
          5×5 특징 조합 표현 시:<br />
          <strong>넓은 1층</strong> — 최대 2²⁵ = 33,554,432개 뉴런 필요<br />
          <strong>깊은 5층</strong> — 각 층 5개 뉴런이면 충분 (총 25개)<br />
          깊이가 파라미터 효율을 극적으로 개선
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">계층적 추상화</h3>
        <p>
          층이 깊을수록 추상 수준이 상승:<br />
          1층: 엣지(edge, 경계선) 감지<br />
          2층: 엣지를 조합 → 도형(코너, 곡선)<br />
          3층: 도형을 조합 → 텍스처(패턴)<br />
          4~5층: 텍스처 조합 → 물체(얼굴, 자동차)<br />
          각 층이 이전 층의 출력을 재조합 — 복잡한 함수를 적은 파라미터로 표현 가능
        </p>
      </div>
      <div className="not-prose mt-8">
        <DepthVsWidthViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Deep Learning의 본질</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Machine Learning vs Deep Learning
//
// Classic ML:
//   - Feature engineering 수작업
//   - SVM, Random Forest, XGBoost 등
//   - 구조화된 데이터에 강함
//   - 해석 가능성 높음
//   - 적은 데이터로 작동
//
// Deep Learning:
//   - Feature를 자동 학습 (representation learning)
//   - 깊은 신경망 (> 3 layers)
//   - 비정형 데이터 (이미지, 텍스트, 음성)
//   - 대용량 데이터 필요
//   - GPU 연산 필수
//
// 구분 기준:
//   얕은 NN ≈ ML
//   깊은 NN (+ end-to-end learning) = Deep Learning

// Representation Learning의 혁명:
//
// Before Deep Learning:
//   Raw Image → SIFT/HOG → Feature Vector → Classifier
//                      ↑
//                  수작업 설계 필요
//
// Deep Learning:
//   Raw Image → CNN → end-to-end learning → Classification
//                    ↑
//              Feature가 자동 학습됨
//
// 각 층의 학습 내용 (CNN 예):
//   Layer 1: 엣지, 방향 (Gabor-like filters)
//   Layer 2: 텍스처, 간단한 패턴
//   Layer 3: 물체 부분 (눈, 코, 바퀴)
//   Layer 4: 전체 물체 (얼굴, 자동차)
//   Layer 5: 의미적 추상 개념`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">깊이가 중요한 수학적 이유</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Depth Separation Theorems (2015~)
//
// Eldan-Shamir (2016):
//   특정 함수 f는 3-layer NN으로 poly(d) 뉴런으로 표현
//   하지만 2-layer NN으로는 exp(d) 뉴런 필요
//   → 깊이 1 증가가 지수적 효율 차이
//
// Telgarsky (2016):
//   sawtooth 함수
//   k-layer NN: O(k) 뉴런
//   (k-1)-layer NN: Ω(2^k) 뉴런
//
// Cohen-Sharir (2016):
//   Compositional functions
//   깊이 log n, 너비 O(1)로 표현 가능
//   얕은 NN은 exp(n) 필요
//
// 직관:
//   깊이 = 함수 합성 (composition)
//   f(g(h(x))) 형태의 구조 포착
//   너비 = 함수 조합 (sum)
//   Σ w_i · f_i(x) 형태
//
//   현실 데이터는 compositional
//   → 깊이 효과적

// 실전 효과 (ImageNet 정확도):
//   AlexNet (8 layers): 84.7%
//   VGG (16 layers):    92.7%
//   ResNet (152 layers): 96.4%
//   EfficientNet: 97.9%
//
//   깊이 ↑ → 성능 ↑ (물론 적절한 설계와 함께)`}
        </pre>
        <p className="leading-7">
          요약 1: Deep Learning의 본질은 <strong>representation learning</strong> — 자동 특징 학습.<br />
          요약 2: <strong>깊이가 지수적 효율</strong> — 수학적으로 증명됨.<br />
          요약 3: compositional 구조를 가진 <strong>현실 데이터에 특히 효과적</strong>.
        </p>
      </div>
    </section>
  );
}
