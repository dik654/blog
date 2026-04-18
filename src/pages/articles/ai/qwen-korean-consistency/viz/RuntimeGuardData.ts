import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. 런타임 가드 — 출력단 사후 검증',
    body: '모델은 그대로 둔다. 생성된 출력을 검사하고 실패하면 retry 한다.\n모델 가중치, 학습, 디코더를 전혀 건드리지 않는 블랙박스 접근.\nSmoothie로도 못 잡은 잔여 leakage를 사후에 걸러내는 안전망.\n제일 큰 장점: 모델 교체 자유도. Qwen만이 아니라 어느 모델에도 붙는다.',
  },
  {
    label: '2. regex 1차 검사 — CJK Unified Ideographs 범위',
    body: '정규식 한 줄로 한자 유무를 판정한다.\n패턴: /[\\u4E00-\\u9FFF]/\n비용은 마이크로초, 모든 응답에 부담 없이 적용.\n실패 기준을 유연하게: "한자 비율 > 5%" 또는 "연속 한자 3자 이상".\n빠른 판정에 80~90% 충분하다 — 대부분의 leakage는 명백하다.',
  },
  {
    label: '3. regex의 한계 — false positive와 false negative',
    body: 'False positive (잘못 걸림): "李舜臣", "新羅", "漢江" 같은 고유명사는 정상.\n사용자가 한자를 명시적으로 요청한 경우 — 한자 학습, 한문 번역.\nFalse negative (못 걸림): 음차("분시"처럼 한자 없이 어색한 단어)는 regex가 못 잡는다.\nregex는 유니코드 판정만 할 뿐 의미를 모른다.',
  },
  {
    label: '4. LLM judge — 의미까지 판정',
    body: '작은 판정용 LLM (예: Haiku, Qwen3-4B)에게 "이 응답이 자연스러운 한국어인가" 를 묻는다.\nyes / no / partial 삼단 분류 + 짧은 이유.\n비용은 추가 추론 1회 — latency +500ms~1s, 토큰 비용도 증가.\n의미 보존, 고유명사 허용, 음차 탐지 등 regex가 못 하는 모든 것.',
  },
  {
    label: '5. hybrid fast/slow path — 비용 최소화',
    body: 'regex로 먼저 걸러낸다. 명백히 OK인 응답은 그대로 반환.\n의심스러운 응답만 LLM judge로 보낸다.\n실측: 응답의 85~90%가 regex fast path에서 통과 → judge 호출 10~15%만 남음.\n전체 latency 오버헤드는 평균 50~100ms 수준으로 억제 가능.',
  },
  {
    label: '6. retry 전략 — 실패 시 어떻게 재생성하나',
    body: '단순 retry(동일 프롬프트)는 효과가 약하다 — 같은 분포에서 다시 샘플링할 뿐.\n효과적인 변형 3가지:\n• temperature 낮추기 (1.0 → 0.3): 덜 창의적 = 덜 실험적 = 한자 덜 뽑힘.\n• system prompt 강화: "이전 응답에 한자가 섞였습니다. 한국어로만 재작성하세요."\n• few-shot에 실패한 응답을 negative example로 삽입.',
  },
  {
    label: '7. retry 상한 — 무한 루프 방지',
    body: '최대 N회 재시도 (기본 2~3). 이후에도 실패하면 마지막 응답을 regex로 후처리하거나 에러를 뱉는다.\nretry 횟수는 latency budget과 직결 — 1회 retry = latency 2배.\nmetric: retry rate, judge pass rate, 평균 latency 를 지속 추적.\nretry rate > 20%면 모델을 교체해야 한다는 신호.',
  },
  {
    label: '8. runWithQualityGuard 패턴 — 실전 구조',
    body: 'async function runWithQualityGuard(prompt, maxRetries=2):\n  for attempt in 0..maxRetries:\n    resp = await model.generate(prompt, temp=1.0 - attempt*0.3)\n    if regexCheck(resp).ok: return resp\n    if attempt < maxRetries and judge(resp) == "fail":\n      prompt = reinforce(prompt, resp)\n      continue\n  return postProcess(resp)  # 또는 throw.\n핵심: 가드를 생성 경로의 일부로 encapsulate 하고 호출자는 가드 존재를 모른다.',
  },
];

export const CHECK_MODES = [
  { name: 'regex', latency: 0.1, cost: 0.1, accuracy: 70, color: '#3b82f6' },
  { name: 'LLM judge', latency: 700, cost: 5, accuracy: 95, color: '#a855f7' },
  { name: 'hybrid', latency: 80, cost: 0.8, accuracy: 92, color: '#10b981' },
];

export const RETRY_DISTRIBUTION = [
  { attempt: 0, success: 82 },
  { attempt: 1, success: 13 },
  { attempt: 2, success: 4 },
  { attempt: 3, success: 1 },
];
