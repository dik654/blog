import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Softmax Step 1 — exponential 적용',
    body:
      'raw scores [0.62, 0.34, 0.50]에 exp() 적용:\n' +
      'exp(0.62)=1.859, exp(0.34)=1.405, exp(0.50)=1.649.\n' +
      'exp는 양수 보장 + 큰 값 비선형 증폭 — 차이를 더 극명하게 만듦.\n' +
      '왜 exp? — 미분 가능하면서 음수→양수 변환, log-linear 모델과 자연스러운 결합.',
  },
  {
    label: '② Softmax Step 2 — 정규화 → 확률 분포',
    body:
      'sum = 1.859 + 1.405 + 1.649 = 4.913.\n' +
      'p₁ = 1.859/4.913 = 0.378, p₂ = 1.405/4.913 = 0.286, p₃ = 1.649/4.913 = 0.336.\n' +
      '합 = 1.0 — 확률 분포 성립. 각 인코더 상태에 부여할 가중치.\n' +
      '큰 score(0.62)의 weight(0.378)가 가장 높음 — 유사도 높은 상태에 더 집중.',
  },
  {
    label: '③ 수치 안정성 — max 빼기 트릭',
    body:
      'softmax(x) = softmax(x − max(x)) — 수학적으로 동일한 결과.\n' +
      'max=0.62 → shifted=[0.00, −0.28, −0.12] → exp=[1.00, 0.756, 0.887].\n' +
      'sum=2.643 → prob=[0.378, 0.286, 0.336] — 동일 결과, overflow 방지.\n' +
      'score가 100+ 이면 exp(100)=2.69×10⁴³ → float64 범위 초과. 실무 필수 기법.',
  },
  {
    label: '④ Temperature 조정',
    body:
      'softmax(scores / T) — T로 score를 나눈 후 softmax.\n' +
      'T<1: sharp (confident) — 최고 score에 더 집중. T=0.5 → [0.44, 0.23, 0.33].\n' +
      'T>1: flat (uniform) — 분포 평탄화. T=2.0 → [0.36, 0.31, 0.33].\n' +
      'Attention에서는 T=1 표준. 언어 생성(GPT)에서 T=0.7~1.2로 다양성 조절.',
  },
];

export const EXP_C = '#6366f1';
export const NORM_C = '#10b981';
export const SAFE_C = '#f59e0b';
export const TEMP_C = '#ef4444';
