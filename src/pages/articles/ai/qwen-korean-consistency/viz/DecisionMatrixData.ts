import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. 4가지 해법의 적용 위치가 다르다',
    body: '프롬프트는 입력 시퀀스를 건드린다.\n런타임 가드는 출력을 사후 검사한다.\nSmoothie-Qwen은 lm_head 가중치를 직접 만진다.\nRL은 policy 전체를 재학습한다.\n"어디에서 개입하는가"가 강도와 비용을 결정한다.',
  },
  {
    label: '2. 비용 축 — 1회 비용 vs 지속 비용',
    body: '프롬프트: 0. 런타임 가드: 매 요청에 latency 오버헤드 (지속).\nSmoothie: 1회 변환(GPU 몇 분) + 이후 무비용. RL: 대규모 GPU 시간(며칠) + 데이터셋 구축.\n지속 비용이 있는 해법은 scale 할수록 총비용이 커진다.\n1회 비용 해법은 확보 후 추가 부담 없음.',
  },
  {
    label: '3. 강도 축 — 어떤 실패 모드를 얼마나 잡는가',
    body: '실패 모드 5가지 (bypass/decay/trigger/fewshot/conflict)에 각 해법의 커버리지를 점수화.\n프롬프트: 2-3점, 가장 약함.\n런타임 가드: 3점 — 걸러내기만 하면 뭐든 막음.\nSmoothie: 4점 — 대부분 모드에 강함, reasoning attractor만 약함.\nRL: 5점 — attractor까지 재정렬.',
  },
  {
    label: '4. 배포 제약 — 가중치 접근성과 인프라',
    body: '프롬프트/런타임 가드: 가중치 접근 불필요 → API 기반 모델에도 적용 가능.\nSmoothie: 가중치 접근 필요 → 오픈웨이트 모델만 (Qwen 전 사이즈 이미 변환 배포됨).\nRL: 가중치 접근 + 학습 인프라 + 데이터셋 + GPU 시간 전부 필요.\n대부분의 팀에게 현실적인 선은 Smoothie까지.',
  },
  {
    label: '5. 조합 전략 — stacking',
    body: '4가지 해법은 배타적이 아니다. 쌓아쓰는 게 정상 사용법.\n기본 레이어: Smoothie 변환된 모델로 교체.\n그 위에: 런타임 가드 (regex fast path + 의심 시 LLM judge).\n그 위에: 최소한의 프롬프트 가드레일.\nRL은 잔여 문제가 명확할 때만 추가 — 대부분은 이 3층 조합으로 충분.',
  },
  {
    label: '6. 상황별 추천 시나리오',
    body: '• POC / 프로토타입: 프롬프트 + 런타임 regex.\n• 내부 도구 / 소규모 프로덕션: Smoothie + 프롬프트.\n• 대규모 프로덕션: Smoothie + 런타임 hybrid 가드.\n• Reasoning-heavy 에이전트 + 한국어가 핵심 차별점: Smoothie + 런타임 + RL fine-tune.\n• API 기반 (가중치 접근 불가): 프롬프트 + 런타임 hybrid 가드만.',
  },
  {
    label: '7. 최종 권장 경로 — 순서가 중요',
    body: '문제를 만나면 이 순서로 시도한다.\n1) 이미 Smoothie-Qwen 변형 모델로 바로 교체 (비용 0, 효과 95%).\n2) 남는 문제 측정 (retry rate, judge pass rate).\n3) 5% 미만이면 런타임 regex만 추가. 5-20%면 hybrid 가드 추가.\n4) 20% 넘으면 워크로드를 재검토 — RL로 가기 전에 프롬프트/데이터 문제를 먼저 의심.\n순서를 거꾸로 가면 며칠을 잃는다.',
  },
];

export const METHODS = [
  { id: 'prompt', name: '프롬프트', dev: 0, run: 0, strength: 1, color: '#a3a3a3', access: 'API OK' },
  { id: 'runtime', name: '런타임 가드', dev: 1, run: 2, strength: 3, color: '#10b981', access: 'API OK' },
  { id: 'smoothie', name: 'Smoothie-Qwen', dev: 1, run: 0, strength: 4, color: '#3b82f6', access: 'weight' },
  { id: 'rl', name: 'RL fine-tune', dev: 4, run: 0, strength: 5, color: '#ef4444', access: 'weight+' },
];

// 실패 모드 × 해법 coverage 매트릭스 (0~1)
export const COVERAGE = [
  // prompt, runtime, smoothie, rl
  { mode: 'Reasoning bypass', scores: [0.2, 0.5, 0.7, 0.95] },
  { mode: 'Position decay', scores: [0.2, 0.6, 0.8, 0.9] },
  { mode: 'Domain trigger', scores: [0.3, 0.5, 0.9, 0.9] },
  { mode: 'Few-shot 오염', scores: [0.1, 0.4, 0.85, 0.9] },
  { mode: 'Instruction conflict', scores: [0.2, 0.3, 0.9, 0.95] },
];

export const SCENARIOS = [
  { id: 'poc', label: 'POC', stack: ['prompt', 'runtime'], color: '#a3a3a3' },
  { id: 'internal', label: '내부 도구', stack: ['smoothie', 'prompt'], color: '#3b82f6' },
  { id: 'prod', label: '프로덕션', stack: ['smoothie', 'runtime', 'prompt'], color: '#10b981' },
  { id: 'reasoning', label: 'Reasoning-heavy', stack: ['smoothie', 'runtime', 'rl'], color: '#ef4444' },
  { id: 'api', label: 'API 기반', stack: ['runtime', 'prompt'], color: '#a855f7' },
];
