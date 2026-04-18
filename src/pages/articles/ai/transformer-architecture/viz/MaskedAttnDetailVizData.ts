import type { StepDef } from '@/components/ui/step-viz';

export const C = { mask: '#ef4444', allow: '#10b981', gpt: '#6366f1', bert: '#f59e0b', muted: '#64748b' };

export const STEPS: StepDef[] = [
  {
    label: 'Causal Mask: 하삼각 행렬',
    body: '4×4 mask: 상삼각에 -∞, 하삼각(+대각)에 0.\nt=0: 자기만 참조 [0, -∞, -∞, -∞].\nt=1: t=0,1 참조 [0, 0, -∞, -∞].\nt=2: t=0,1,2 참조 [0, 0, 0, -∞].\nt=3: 전부 참조 [0, 0, 0, 0].\nscores에 mask를 더한 뒤 softmax 적용.',
  },
  {
    label: 'softmax(-∞) = 0: 미래 정보 차단',
    body: 'exp(-∞) = 0 → 해당 위치 attention weight = 0.\n미래 토큰의 정보가 완전히 차단됨.\nPyTorch: mask = torch.triu(ones, diagonal=1).\nmask = mask.masked_fill(mask==1, float("-inf")).\nscores = scores + mask → 미래 위치에 -inf.\nattn = softmax(scores) → 미래 가중치 = 0.',
  },
  {
    label: 'Decoder vs Encoder: 마스크 유무',
    body: 'Decoder-only (GPT): causal mask 필수.\n학습 목표 P(x_t | x_{<t}) — 미래 보면 cheating.\nautoregressive 생성과 일관성 유지.\nEncoder-only (BERT): mask 불필요.\n학습 목표 P(x_masked | x_context) — 양방향 문맥.\nEncoder-Decoder: 인코더 양방향, 디코더 causal.',
  },
  {
    label: '학습과 생성: 효율성 최적화',
    body: '학습 시: causal mask + teacher forcing.\n전체 시퀀스를 한 번에 병렬 학습 가능.\n각 위치의 손실을 동시에 계산.\n생성 시: 한 번에 한 토큰 (autoregressive).\nKV cache: 이전 K, V를 캐시해 재계산 방지.\n생성 속도 O(n) → O(1) per token으로 최적화.',
  },
];
