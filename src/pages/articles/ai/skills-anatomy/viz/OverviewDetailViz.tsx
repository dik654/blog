import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Skill vs Tool vs Plugin — 3계층 비교', body: '① Tool (low-level): function signature, 단일 operation, 직접 호출\n예: bash, read_file, write_file — LLM이 언제 호출할지 결정\n\n② Plugin (medium): tool 묶음, themed capabilities, installable\n예: OpenAI plugin (deprecated) — API 컬렉션\n\n③ Skill (high-level): workflow instructions + domain expertise\n예: pdf-processing, git-ops — SKILL.md + 코드 + progressive disclosure\n\n핵심 차이: Tool=API 정의, Plugin=API 묶음, Skill=지식+워크플로우\nSkill 구조: SKILL.md(설명+지시) + scripts + examples\nProgressive Disclosure: 이름+설명만 먼저, 필요시 전체 로드 → 100+ 스킬 관리 가능' },
];
const visuals = [
  { title: 'Tool vs Plugin vs Skill', color: '#6366f1', rows: [
    { label: 'Tool (low)', value: 'function signature, 단일 operation' },
    { label: 'Plugin (mid)', value: 'tool 묶음, themed capabilities' },
    { label: 'Skill (high)', value: 'workflow + domain expertise' },
    { label: '핵심 차이', value: 'API 정의 vs API 묶음 vs 지식+워크플로우' },
    { label: 'Disclosure', value: '이름만 먼저 → 필요시 전체 로드' },
  ]},
];
export default function OverviewDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
