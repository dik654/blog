import type { StepDef } from '@/components/ui/step-viz';

export const C = { q: '#6366f1', k: '#10b981', v: '#f59e0b', out: '#3b82f6', muted: '#64748b' };

export const STEPS: StepDef[] = [
  {
    label: '초기화: W_Q, W_K, W_V 선형 변환',
    body: 'd_model=512, d_k=64일 때 각 가중치 행렬 (512×64).\nself.W_Q = nn.Linear(512, 64) → Q 투영.\nself.W_K = nn.Linear(512, 64) → K 투영.\nself.W_V = nn.Linear(512, 64) → V 투영.\n총 파라미터: 3 × 512 × 64 = 98,304.\n__init__에서 생성, forward에서 사용.',
  },
  {
    label: 'Forward: 3단계 파이프라인',
    body: '입력 x: (batch=2, seq=10, d_model=512).\nStep 1: Q = W_Q(x) → (2, 10, 64). K, V도 동일.\nStep 2: scores = Q @ K^T / √64 → (2, 10, 10).\nStep 3: attn = softmax(scores) → 행별 확률 분포.\n출력: output = attn @ V → (2, 10, 64).\n전체가 행렬 연산 → GPU에서 완전 병렬 처리.',
  },
  {
    label: '시간 복잡도: O(n²·d)',
    body: 'Q·K^T: O(n² · d) ← 주 병목 연산.\nsoftmax: O(n²) — 각 행 정규화.\n·V: O(n² · d) — 가중 합산.\n전체: O(n² · d). n=1024, d=512 → 5.3×10⁸ 연산.\nn=4096이면 8.6×10⁹ → 16배 증가.\n메모리도 O(n²): attention 행렬 저장 필요.',
  },
  {
    label: '최적화 해결책: Flash / Sparse / Linear',
    body: 'Flash Attention: IO-aware 타일링. 메모리 O(n) 달성.\nSparse Attention (Longformer): 지역 + 전역 패턴.\nLinear Attention (Performer): 커널 근사로 O(n).\nRing Attention: 장문맥 분산 처리.\n장점: O(1) 경로 길이, 완전 병렬, 해석 가능.\nattention matrix 시각화로 모델 내부 관찰 가능.',
  },
];
