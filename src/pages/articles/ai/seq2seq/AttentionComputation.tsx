import AttentionCompViz from './viz/AttentionCompViz';

export default function AttentionComputation() {
  return (
    <section id="attention-computation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어텐션 계산 (구체적 숫자)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Step 1: Attention Score</h3>
        <p>
          s=[0.7, 0.3], h₁=[0.8, 0.2], h₂=[0.1, 0.9], h₃=[0.5, 0.5]<br />
          score₁ = 0.7×0.8 + 0.3×0.2 = <strong>0.62</strong><br />
          score₂ = 0.7×0.1 + 0.3×0.9 = <strong>0.34</strong><br />
          score₃ = 0.7×0.5 + 0.3×0.5 = <strong>0.50</strong>
        </p>

        <h3>Step 2: Softmax → 확률</h3>
        <p>
          softmax([0.62, 0.34, 0.50]) = [<strong>0.40</strong>, <strong>0.30</strong>, <strong>0.30</strong>]<br />
          합 = 1.0 — 각 인코더 상태에 부여할 가중치
        </p>

        <h3>Step 3: 가중합 → 컨텍스트 벡터</h3>
        <p>
          0.40×[0.8, 0.2] + 0.30×[0.1, 0.9] + 0.30×[0.5, 0.5]<br />
          = [0.32, 0.08] + [0.03, 0.27] + [0.15, 0.15]<br />
          = <strong>[0.50, 0.50]</strong> — 새 컨텍스트 벡터
        </p>

        <h3>Step 4: 디코더에 입력</h3>
        <p>
          새 컨텍스트 벡터 [0.50, 0.50] → 디코더 LSTM 입력<br />
          Softmax → 다음 단어 "고마워" 생성
        </p>
      </div>
      <div className="not-prose my-8">
        <AttentionCompViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Softmax 계산 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Softmax 함수의 역할
//
// 입력: raw scores [0.62, 0.34, 0.50]
//
// Step 1: exponential 적용
//   exp(0.62) = 1.8589
//   exp(0.34) = 1.4049
//   exp(0.50) = 1.6487
//
// Step 2: 합계 계산
//   sum = 1.8589 + 1.4049 + 1.6487 = 4.9125
//
// Step 3: 정규화
//   p_1 = 1.8589 / 4.9125 = 0.3784 ≈ 0.38
//   p_2 = 1.4049 / 4.9125 = 0.2860 ≈ 0.29
//   p_3 = 1.6487 / 4.9125 = 0.3356 ≈ 0.33
//
//   (반올림 후: 0.40, 0.30, 0.30 - 예시와 차이는 반올림)
//
// 특성:
//   - 출력 ∈ (0, 1), 합 = 1 (확률 분포)
//   - 큰 값이 더 커짐 (비선형 증폭)
//   - 미분 가능 (gradient flow)
//
// 수치 안정성:
//   max 빼기 트릭:
//   softmax(x) = softmax(x - max(x))
//
//   → overflow 방지
//   → 같은 결과

// Numerically stable softmax:
//   scores = [0.62, 0.34, 0.50]
//   max_score = 0.62
//   shifted = [0.00, -0.28, -0.12]
//   exp = [1.00, 0.756, 0.887]
//   sum = 2.643
//   prob = [0.378, 0.286, 0.335]
//
// Temperature 조정:
//   softmax(scores / T)
//   - T < 1: 더 sharp (confidence↑)
//   - T = 1: 표준
//   - T > 1: 더 flat (uniform)
//
//   attention에서는 T=1 사용
//   언어 생성에서는 T=0.7~1.2 조정`}
        </pre>
        <p className="leading-7">
          요약 1: Softmax는 <strong>raw score → 확률 분포</strong> 변환 — 합=1 정규화.<br />
          요약 2: <strong>max 빼기 트릭</strong>으로 수치 안정성 확보 — 실무 필수.<br />
          요약 3: Context vector는 <strong>가중 평균</strong>으로 얻어진 동적 표현.
        </p>
      </div>
    </section>
  );
}
