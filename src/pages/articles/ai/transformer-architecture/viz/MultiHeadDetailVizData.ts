import type { StepDef } from '@/components/ui/step-viz';

export const C = { head: '#6366f1', concat: '#10b981', wo: '#f59e0b', param: '#3b82f6', muted: '#64748b' };

export const STEPS: StepDef[] = [
  {
    label: 'Multi-Head 수식: 병렬 어텐션',
    body: 'head_i = Attention(Q·W_Q^i, K·W_K^i, V·W_V^i).\n각 헤드가 독립 가중치 행렬 보유.\nd_model=512, h=8 → d_k = d_v = 64.\n8개 헤드가 64차원에서 독립 어텐션 수행.\n서로 다른 관계 유형(구문/의미/위치) 동시 학습.\n단일 512차원 헤드보다 다양한 패턴 포착.',
  },
  {
    label: 'Concat + W_O: 차원 복원',
    body: 'MultiHead = Concat(head_0, ..., head_7) · W_O.\nConcat: 8개 × 64차원 = 512차원으로 이어붙이기.\nW_O: (512, 512) 행렬로 최종 투영.\n헤드별 정보를 섞어 통합된 표현 생성.\n출력: (n, 512) — 입력과 동일한 차원.\nAdd & Norm에 바로 전달 가능.',
  },
  {
    label: '파라미터 수: 단일 헤드와 동일',
    body: 'W_Q^i, W_K^i: 각 (512, 64) × 8 = (512, 512).\nW_V^i: (512, 64) × 8 = (512, 512).\nQKV 합계: 3 × 512² = 786,432.\nW_O: (512, 512) = 262,144.\n블록당 총: 약 1.05M 파라미터.\n단일 헤드 (512, 512) × 4와 파라미터 수 동일.',
  },
  {
    label: 'PyTorch 구현: reshape로 헤드 분리',
    body: 'Q = W_Q(x).view(B, N, h, d_k).transpose(1, 2).\nshape: (B, 8, N, 64) — 배치·헤드·시퀀스·차원.\nscores = Q @ K^T / √64 → (B, 8, N, N).\nattn = softmax(scores). out = attn @ V.\nconcat: out.transpose(1,2).view(B, N, 512).\nreturn W_O(out) → (B, N, 512). 완전 병렬.',
  },
];
