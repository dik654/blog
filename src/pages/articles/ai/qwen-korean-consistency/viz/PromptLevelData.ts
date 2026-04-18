import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. 프롬프트 instruction은 logit에 약한 bias만 더한다',
    body: '"한국어로만 답변하세요"는 입력 토큰 시퀀스의 일부일 뿐이다.\n모델 입장에서 이 문장은 hidden state h를 약간 회전시키는 정도의 효과만 갖는다.\nlm_head W는 그대로다. 한자 토큰 row의 학습된 강도는 그대로 살아 있다.\n결과: instruction은 logit 격차의 일부를 줄일 뿐, 부호를 뒤집지 못한다.',
  },
  {
    label: '2. 실패 모드 ① — Reasoning bypass: think 블록은 가드를 무시한다',
    body: '<think>...</think> 학습 분포는 거의 중국어와 영어다.\n모델이 추론 모드에 진입하면 그 모드의 attractor가 강하게 작동한다.\n시스템 프롬프트는 멀리 있고, reasoning 토큰의 self-conditioning이 압도한다.\n관찰: 최종 답은 한국어인데 think 안은 통째 중국어인 패턴이 가장 흔하다.',
  },
  {
    label: '3. 실패 모드 ② — Position decay: 응답이 길어질수록 가드가 흐려진다',
    body: '시스템 프롬프트는 컨텍스트 맨 앞에 있다.\n응답이 1000토큰을 넘기면 attention 거리가 멀어지고, 최근 토큰들이 self-prime 한다.\n한 번 한자가 등장하면 그 한자가 다음 한자를 부른다 — self-reinforcement.\n그래프로 보면 한자 비율이 응답 길이에 monotonic하게 증가한다.',
  },
  {
    label: '4. 실패 모드 ③ — Domain trigger: 코드·수식 주변에서 한자가 폭증한다',
    body: '학습 데이터에서 코드 + 중국어 주석/설명 패턴이 풍부했다.\n한국어 컨텍스트라도 코드 블록이나 LaTeX 수식이 등장하면 모델이 그 학습된 분포로 회귀한다.\n프롬프트로 "코드 주변에서도 한국어로"라고 강조해도 효과가 미미하다.\n원인: 도메인 전환 시점에서 hidden state가 학습 분포의 mode로 끌려간다.',
  },
  {
    label: '5. 실패 모드 ④ — Few-shot 오염: 예시 자체가 한자를 정당화한다',
    body: '"이렇게 답변하세요"라며 보여준 few-shot 예시에 한자어가 한 글자라도 섞이면, 모델은 그것을 허용 신호로 해석한다.\n in-context learning은 부정 신호("이건 하지 마")보다 긍정 신호("이렇게 해")에 압도적으로 강하다.\n결과: 가드를 강화하려 넣은 예시가 오히려 leakage 비율을 높이는 역설.',
  },
  {
    label: '6. 실패 모드 ⑤ — Instruction conflict: 정확성 vs 언어 강제',
    body: '"가장 정확한 표현을 쓰되 반드시 한국어로"는 두 목표를 동시에 요구한다.\n모델은 정확성을 우선하도록 RLHF 학습돼 있다.\n"가장 적합한" 토큰을 찾을수록 한자 후보가 우위를 점하는 lm_head 구조 때문에, 정확성 추구가 곧 한자 채택으로 이어진다.\n프롬프트 강도를 올려도 두 목표의 충돌이 해소되지 않는다.',
  },
  {
    label: '7. 결론 — 가드는 입력 차원, 문제는 출력 차원',
    body: '5가지 실패 모드는 모두 같은 구조를 공유한다.\n프롬프트는 입력 시퀀스의 일부 → hidden state에 약한 bias → lm_head logit 격차를 못 뒤집음.\n해법은 입력보다 더 가까운 곳, 즉 lm_head weight나 보상 함수 차원으로 옮겨가야 한다.\n이 글의 나머지 섹션은 그 이동을 따라간다.',
  },
];

export const FAILURE_MODES = [
  { id: 'reason', label: 'Reasoning bypass', short: 'think 누출', color: '#ef4444', severity: 4 },
  { id: 'pos', label: 'Position decay', short: '응답 후반 drift', color: '#f59e0b', severity: 3 },
  { id: 'domain', label: 'Domain trigger', short: '코드/수식 주변', color: '#a855f7', severity: 3 },
  { id: 'fewshot', label: 'Few-shot 오염', short: '예시가 허용 신호', color: '#10b981', severity: 2 },
  { id: 'conflict', label: 'Instruction conflict', short: '정확성 vs 강제', color: '#3b82f6', severity: 4 },
];

// 응답 길이별 한자 비율 (실측 추정 곡선)
export const POSITION_DECAY = [
  { x: 0, y: 5 },
  { x: 200, y: 8 },
  { x: 400, y: 14 },
  { x: 600, y: 22 },
  { x: 800, y: 31 },
  { x: 1000, y: 38 },
  { x: 1200, y: 44 },
];
