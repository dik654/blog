import SimpleStepViz from '@/components/viz/SimpleStepViz';
import { LAYER_STEPS, GUARD_STEPS } from './SystemPromptDetailVizData';

const layerVisuals = [
  { title: 'Layer 1-2: Role + Context', color: '#6366f1', rows: [
    { label: 'Role & Identity', value: '페르소나 설정, 전문성 확립' },
    { label: '예시', value: '"경험 많은 Python 백엔드 엔지니어"' },
    { label: 'Context & Background', value: '배경 정보, 사용자 프로필' },
    { label: '예시', value: '"스타트업 CTO, Python/FastAPI 스택"' },
  ]},
  { title: 'Layer 3-5: Task + Rules + Format', color: '#10b981', rows: [
    { label: 'Task Instructions', value: '문제 재정의 → 해결책 → trade-off → 권장' },
    { label: 'Constraints', value: '한국어, 실행 가능 코드, 추측 금지' },
    { label: 'Output Format', value: '## 문제 분석 / ## 해결책 (Pros/Cons)' },
    { label: '핵심', value: '구체적일수록 LLM 자의적 해석 감소' },
  ]},
  { title: 'Claude XML 실전 예시', color: '#f59e0b', rows: [
    { label: '<background>', value: 'beginner programmer, CLI tools' },
    { label: '<tasks>', value: '개념 설명 + 실행 예제 + 다음 단계' },
    { label: '<rules>', value: '간단한 언어, 고급 주제 금지' },
    { label: '<format>', value: '## 개념 / ## 예제 / ## 다음 단계' },
    { label: '장점', value: 'XML 태그: 섹션 경계 명확, 중첩 가능' },
  ]},
];

const guardVisuals = [
  { title: 'Positive Framing + Refusal', color: '#ef4444', rows: [
    { label: 'Positive', value: '"공개 가능한 정보만 포함" (not "금지")' },
    { label: 'Refusal Triggers', value: '프라이버시 침해, 불법 조언, 폭력/자해' },
    { label: '왜?', value: 'Negative는 해당 개념을 activation 시킴' },
  ]},
  { title: 'Scope + Injection 방어', color: '#10b981', rows: [
    { label: 'Scope Limit', value: '"이 시스템은 Python 코딩만 다룹니다"' },
    { label: 'Citation', value: '"소스 인용 필수, 출처 없으면 확실치 않음"' },
    { label: 'Jailbreak', value: '역할 고수, 매 턴 검증, Red-teaming' },
    { label: 'Injection', value: 'XML 태그로 사용자 입력 구분, 출력 검증' },
  ]},
  { title: '모델별 차이', color: '#f59e0b', rows: [
    { label: 'GPT-4', value: 'markdown, JSON mode, Structured Output' },
    { label: 'Claude', value: 'XML tags, longer context (200K)' },
    { label: 'Gemini', value: 'structured output, 기본 JSON' },
    { label: 'LLaMA/OSS', value: 'prompt engineering 더 세심 필요' },
  ]},
];

export function LayerViz() {
  return <SimpleStepViz steps={LAYER_STEPS} visuals={layerVisuals} />;
}

export function GuardViz() {
  return <SimpleStepViz steps={GUARD_STEPS} visuals={guardVisuals} />;
}
