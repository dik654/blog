import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'SKILL.md 포맷 — Frontmatter + Body', body: 'Frontmatter (YAML):\n필수: name (unique ID), description (<100 chars)\n권장: version (semver), author, tags\n선택: dependencies, prerequisites, license\n\nBody:\n① Introduction: 무엇을, 언제 사용, 고수준 워크플로우\n② Usage: 실행 명령어, 파라미터, 예상 출력\n③ Examples: 구체적 use case, 입출력, 엣지 케이스\n\n설계 원칙: Clarity(명확) + Conciseness(간결) + Testability(검증 가능) + Composability(결합 가능)\n안티패턴: 긴 에세이(LLM focus 저하), 모호한 지시, 하드코딩 경로' },
];
const visuals = [
  { title: 'SKILL.md 구조', color: '#10b981', rows: [
    { label: 'name', value: 'unique identifier (필수)' },
    { label: 'description', value: '<100 chars 요약 (필수)' },
    { label: 'version', value: 'semver (권장)' },
    { label: 'Body', value: 'Introduction + Usage + Examples' },
    { label: '설계', value: 'Clarity + Conciseness + Testability' },
  ]},
];
export default function FormatDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
