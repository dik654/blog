import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. Smoothie가 못 끊는 것 — reasoning attractor 자체',
    body: 'Smoothie-Qwen은 token-level logit을 균일하게 다운스케일한다.\n하지만 reasoning 모드의 "사고 경로"는 token 하나하나가 아니라 시퀀스 전체의 분포다.\n모델이 "긴 사고"에 진입하는 순간 중국어 reasoning 분포로 끌려가는 현상은 lm_head 수정으로 완전히 막기 어렵다.\n그 분포 자체를 재정렬하려면 학습 신호를 다시 주어야 한다.',
  },
  {
    label: '2. 보상 함수 설계 — 4개 항목의 가중 합',
    body: '"Making Qwen3 Think in Korean with Reinforcement Learning" (2025) 저자들이 제안한 구성.\nAccuracy 1.0 / Format compliance 0.2 / Korean consistency 0.2 / Length control 0.2.\n정확성이 압도적 가중치이지만 언어 일관성이 0 이 아니면 정책은 그 방향으로 점진 이동한다.\n가중치는 exploitation vs exploration trade의 실험적 튜닝 결과.',
  },
  {
    label: '3. Korean Language Consistency 보상의 세부',
    body: '단순히 "한글 비율 ≥ 95%"로 하면 gaming 문제가 생긴다 — 모델이 한자를 음차로 대체하는 이상한 해결책을 찾는다.\n그래서 oracle judge LLM을 쓴다.\noracle은 생성된 <think> + 답변을 읽고 "한국어로 일관되게 사고했는가"를 0 / 0.5 / 1 로 채점한다.\n규칙 기반과 LLM 기반을 혼합해서 서로 보정한다.',
  },
  {
    label: '4. GRPO 학습 루프 — rollout → reward → advantage → update',
    body: 'DeepSeek의 GRPO를 차용한다.\n같은 프롬프트에 대해 N개 응답을 샘플링한다 (N=8 기본).\n각 응답의 총 보상 R = accuracy + 0.2·(format + korean + length).\n그룹 내 R의 평균을 baseline으로 advantage A = R − mean(R)를 계산한다.\nA 부호와 크기에 따라 policy gradient로 모델 파라미터를 업데이트.',
  },
  {
    label: '5. 학습 비용 — RL은 공짜가 아니다',
    body: '샘플 하나당 N=8 rollout, 각 rollout 최대 8192 토큰 생성.\n1 step 당 generation이 가장 무거운 지점 (reward 계산은 상대적으로 저렴).\n논문 보고 기준: Qwen3-8B, 약 1~2K 스텝, A100 8장 몇 일 단위.\n데이터셋도 직접 만들어야 한다 — 한국어 reasoning 문제 + 정답 + judge prompt 세트.',
  },
  {
    label: '6. 결과 — 일관성과 정확성이 함께 오른다',
    body: '저자 보고: 한자 leakage가 거의 0 에 근접, KMMLU 정확도도 오히려 상승.\n흥미로운 이유: "한국어로 사고하도록" 강제하면서 한국어 학습 데이터의 품질이 올라가는 간접 효과.\nRL은 모델에게 "어떤 모드로 사고해야 하는가"까지 가르친다 — lm_head 수정은 결코 줄 수 없는 신호.',
  },
  {
    label: '7. 언제 RL까지 가야 하는가',
    body: 'Smoothie + 런타임 가드로 해결되지 않는 잔여 leakage가 있고,\n모델이 긴 사고(8K+)를 자주 하는 워크로드이고,\nGPU 시간과 한국어 reasoning 데이터셋이 확보돼 있을 때.\n그 외는 오버킬. 대부분의 에이전트는 Smoothie + 간단한 런타임 가드만으로 충분하다.',
  },
];

export const REWARDS = [
  { name: 'Accuracy', weight: 1.0, color: '#ef4444', desc: '정답 정확도' },
  { name: 'Format', weight: 0.2, color: '#3b82f6', desc: '<think>...</think> 태그 준수' },
  { name: 'Korean consistency', weight: 0.2, color: '#10b981', desc: '한국어 일관성 (oracle judge)' },
  { name: 'Length', weight: 0.2, color: '#a855f7', desc: '8192 토큰 soft 페널티' },
];

// GRPO rollout 샘플 (mock) — 8개 응답의 보상 분포
export const ROLLOUT_REWARDS = [
  { idx: 1, r: 1.2, korean: 0.8 },
  { idx: 2, r: 0.9, korean: 0.3 },
  { idx: 3, r: 1.4, korean: 1.0 },
  { idx: 4, r: 1.1, korean: 0.7 },
  { idx: 5, r: 0.7, korean: 0.2 },
  { idx: 6, r: 1.5, korean: 1.0 },
  { idx: 7, r: 1.0, korean: 0.5 },
  { idx: 8, r: 1.3, korean: 0.9 },
];

export const COST_AXIS = [
  { label: '프롬프트', cost: 0, strength: 1, color: '#a3a3a3' },
  { label: '런타임 가드', cost: 1, strength: 2, color: '#10b981' },
  { label: 'Smoothie', cost: 1, strength: 3, color: '#3b82f6' },
  { label: 'RL fine-tune', cost: 4, strength: 4, color: '#ef4444' },
];
