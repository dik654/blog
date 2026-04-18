import type { StepDef } from '@/components/ui/step-viz';

export const C = { sin: '#6366f1', rope: '#ef4444', alibi: '#10b981', learn: '#f59e0b', rel: '#3b82f6', muted: '#64748b' };

export const STEPS: StepDef[] = [
  {
    label: 'Sinusoidal PE (2017): 학습 불필요',
    body: 'PE(pos,2i) = sin(pos/10000^{2i/d}), 홀수는 cos.\n학습 파라미터 0개 — 순수 수학 함수.\n임의 길이 시퀀스에 적용 가능 (길이 제한 없음).\n상대 위치가 선형 변환으로 암시.\n단점: 절대 위치만 직접 표현, 상대 위치 학습은 간접적.',
  },
  {
    label: 'Learned PE (BERT, GPT-2): 위치 임베딩 학습',
    body: '각 위치에 학습 가능한 벡터 배정 (예: 512개).\nmax_seq_len 고정 — 초과 시 동작 불가.\nBERT: 512, GPT-2: 1024 위치까지.\n장점: 데이터에 맞게 최적화.\n단점: 학습 시 본 길이 이상 일반화 어려움.\nfine-tuning 없이 긴 시퀀스 처리 불가.',
  },
  {
    label: 'RoPE (LLaMA, 2021): 회전 기반 상대 위치',
    body: '복소수 회전으로 위치 인코딩. Q, K에 직접 적용.\nQ·K^T 내적에서 상대 위치가 자연스럽게 등장.\n2차원씩 묶어 θ_i 각도로 회전 (짝·홀 쌍).\n긴 문맥 extrapolation 비교적 유리.\nLLaMA-3: 고주파 조정 추가.\n현재 대부분의 LLM이 RoPE 사용.',
  },
  {
    label: 'ALiBi & YaRN: 최신 접근',
    body: 'ALiBi (BLOOM, 2022): PE 자체를 제거.\nattention score에 -m·|i-j| 선형 bias 추가.\n가까운 토큰에 높은 점수, 먼 토큰에 페널티.\nextrapolation 우수 — 학습 길이 초과해도 동작.\nYaRN: RoPE 주파수를 보간해 긴 문맥 적응.\nNTK-aware scaling: 저주파는 유지, 고주파만 보간.',
  },
];
