import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Hooks (이벤트 콜백) + Skills (재사용 능력)', body: 'Hooks (Claude Code 방식):\nevent-driven callbacks, shell commands on agent events\nEvent types: PreToolUse, PostToolUse, UserPromptSubmit, Stop, SessionStart\n예: {"hooks":{"PreToolUse":[{"matcher":"Bash","hooks":[{"type":"command","command":"echo..."}]}]}}\n용도: logging, 승인, 알림, validation, rate limiting\nvs direct modification: hooks = config only (코드 변경 불필요)\n\nSkills (capability extensions):\nSKILL.md (description+instructions) + code/scripts + metadata\nLLM이 필요 시 SKILL.md 읽고 실행\n예: pdf-processing, web-scraping, database-queries\n\nTools vs Skills:\nTools = low-level API calls, 단일 operation\nSkills = high-level capability, multi-step workflows, orchestration\nProgressive disclosure: description만 먼저 → 필요시 전체 로드 → 100+ 확장' },
];
const visuals = [
  { title: 'Hooks + Skills', color: '#ef4444', rows: [
    { label: 'Hooks', value: 'event-driven callbacks (config only)' },
    { label: 'Events', value: 'PreToolUse, PostToolUse, Stop, ...' },
    { label: 'Skills', value: 'SKILL.md + code (workflow)' },
    { label: 'Tools vs Skills', value: 'API call vs multi-step workflow' },
    { label: 'Disclosure', value: 'description → 필요시 전체 로드' },
  ]},
];
export default function HooksSkillsDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
