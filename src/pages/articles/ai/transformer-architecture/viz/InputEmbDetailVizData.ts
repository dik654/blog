import type { StepDef } from '@/components/ui/step-viz';

export const C = { sin: '#6366f1', cos: '#10b981', dim: '#f59e0b', muted: '#64748b' };

export const STEPS: StepDef[] = [
  {
    label: '요구사항: 순서 정보의 세 가지 조건',
    body: '조건 1: 각 위치가 고유한 인코딩을 가져야 한다.\n조건 2: 서로 다른 길이 시퀀스에서도 일관성 유지.\n조건 3: 상대 위치 학습 가능 — k만큼 떨어진 관계.\nRNN은 순차 처리로 순서를 암시하지만,\nTransformer는 병렬 처리 → 명시적 위치 부여 필수.\nsin/cos 함수 조합이 이 세 조건을 모두 충족.',
  },
  {
    label: '주파수 해석: 시계 비유',
    body: 'i가 작을수록(저차원) → 주파수 높음 → 빠른 변화.\ni가 클수록(고차원) → 주파수 낮음 → 느린 변화.\n마치 시계의 초침(빠름)과 시침(느림) 조합.\nd_model=4일 때 PE(0)=[0, 1, 0, 1].\nPE(1)≈[0.841, 0.540, 0.010, 1.000].\nPE(2)≈[0.909, -0.416, 0.020, 1.000].\n저차원은 급변, 고차원은 거의 변하지 않음.',
  },
  {
    label: '상대 위치: 선형 변환 관계',
    body: 'PE(pos+k) = LinearTransform(PE(pos)).\nsin/cos 덧셈 정리로 k 떨어진 위치가 선형 변환.\n모델이 "k만큼 떨어진" 관계를 학습 가능.\n핵심 특성: 최대 길이 제한 없음 (sinusoidal).\n학습 불필요 — 계산만으로 생성.\n임베딩 벡터에 직접 더해서 사용.',
  },
  {
    label: '대안 방식들: Learned → RoPE → ALiBi',
    body: 'Learned PE (BERT, GPT-2): 학습 가능 임베딩. max_len 고정.\nRelative PE (T5): attention bias로 상대 거리. b_{i-j} 더함.\nRoPE (LLaMA): 복소수 회전 기반. Q,K에 직접 적용.\nALiBi (BLOOM): attention score에 선형 bias. PE 불필요.\nYaRN / NTK scaling: RoPE 주파수 보간. 긴 문맥 적응.\n현재 LLM 표준은 RoPE — 상대 위치를 자연스럽게 표현.',
  },
];
