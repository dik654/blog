import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① Forward Pass — hₜ 계산 과정',
    body:
      'hₜ = tanh(Wₕₕ·hₜ₋₁ + Wₓₕ·xₜ + bₕ)\n' +
      'Wₓₕ ∈ R^{H×I}: 입력 xₜ(크기 I)를 hidden 공간(크기 H)으로 매핑.\n' +
      'Wₕₕ ∈ R^{H×H}: 이전 hidden state를 현재로 전달 — 시간 순환의 핵심.\n' +
      'tanh 활성화: 출력 범위 [-1,1] → sigmoid(0~1)보다 중심 0이라 gradient 안정.\n' +
      '예: I=100, H=128이면 Wₓₕ=12,800 + Wₕₕ=16,384 + bₕ=128 = 29,312 파라미터.',
  },
  {
    label: '② 초기 상태 h₀와 시간 복잡도',
    body:
      'h₀ = zeros(H): 가장 일반적. 또는 학습 가능 파라미터(nn.Parameter)로 설정 가능.\n' +
      '시간 복잡도: O(T·H²) — 매 step마다 H×H 행렬곱. T=100, H=256이면 ~6.5M 연산.\n' +
      '공간 복잡도: O(T·H) — BPTT를 위해 모든 hₜ 저장. T=1000, H=512 → 2MB(FP32).\n' +
      '시퀀스 길이 T에 선형 비례 → Transformer의 O(T²)보다 메모리 효율적.\n' +
      '단, 순차 처리라 GPU 병렬화 불가 — 이것이 Transformer 등장의 주요 동기.',
  },
  {
    label: '③ Deep RNN — 레이어 쌓기',
    body:
      'h_t^(1) = tanh(W^(1)·h_{t-1}^(1) + U^(1)·xₜ) — 첫째 층, 입력 직접 받음.\n' +
      'h_t^(2) = tanh(W^(2)·h_{t-1}^(2) + U^(2)·h_t^(1)) — 둘째 층, 아래 층의 출력이 입력.\n' +
      '2-3층이 일반적. 층이 깊을수록 추상적 표현 학습 (음소 → 단어 → 구문).\n' +
      '층간 dropout 적용: 시간축 dropout은 정보 손실 위험 → 층 사이만 드롭.\n' +
      '파라미터: L층 × (H² + I·H) — 2층 H=256이면 ~196K, 3층이면 ~327K.',
  },
  {
    label: '④ Bidirectional RNN — 양방향 문맥',
    body:
      '→ forward hₜ: 과거 문맥 (왼쪽→오른쪽). ← backward h\'ₜ: 미래 문맥 (오른쪽→왼쪽).\n' +
      '출력: concat(hₜ, h\'ₜ) ∈ R^{2H} — 양방향 정보 결합. "은행에서 돈을 ___" → 과거+미래 필요.\n' +
      'NER 태깅: "Apple이 새 ___를 출시" — "Apple"이 회사인지 과일인지 미래 문맥("출시")이 결정.\n' +
      '제약: 전체 시퀀스 필요 → 실시간 스트리밍/자기회귀 생성에는 사용 불가.\n' +
      'BERT가 이 아이디어를 Transformer에 적용: Masked LM으로 양방향 사전학습.',
  },
];

export const CELL_C = '#6366f1';
export const HIDDEN_C = '#10b981';
export const INPUT_C = '#f59e0b';
export const OUTPUT_C = '#8b5cf6';
export const DEEP_C = '#ec4899';
