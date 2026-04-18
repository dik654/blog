import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: '비선형성이 필요한 수학적 이유', body: '활성화 함수 없는 신경망:\nLayer 1: y1 = W1·x + b1\nLayer 2: y2 = W2·y1 + b2\nLayer 3: y3 = W3·y2 + b3\n\n전개하면:\ny3 = W3·W2·W1·x + (W3·W2·b1 + W3·b2 + b3)\n= W_eff·x + b_eff\n\n결론: 선형 변환의 조합 = 단일 선형 변환\n아무리 깊이 쌓아도 단일 layer와 동일한 표현력\n\n활성화 함수 추가: y1 = σ(W1·x + b1)\n→ y = f(x)는 어떤 선형 변환으로도 표현 불가\n→ Universal Approximation Theorem (Cybenko 1989)\n충분히 많은 hidden units + 비선형 activation → 임의의 연속 함수 근사 가능' },
];
const visuals = [
  { title: '비선형성이 필요한 이유', color: '#6366f1', rows: [
    { label: '선형만', value: 'W3·W2·W1 = 단일 W (동일 표현력)' },
    { label: '비선형 추가', value: 'σ(W·x+b) → 복잡한 함수 표현' },
    { label: 'Cybenko 1989', value: 'Universal Approximation Theorem' },
    { label: '직관', value: '선형=혼합 | 활성화=신호 선택' },
  ]},
];
export default function NonlinearityDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
