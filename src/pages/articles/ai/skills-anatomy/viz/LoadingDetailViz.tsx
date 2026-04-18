import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Skill 동적 로딩 — scan → index → lazy load', body: 'Discovery (startup):\n1. Scan: ~/.claude/skills/ + ./project/.claude/skills/ + system\n2. Read SKILL.md frontmatter → name + description 추출\n3. Build skill index (in-memory)\n\nProgressive Disclosure:\ninitial context: ~50-100 tokens/skill (description only)\n100 skills = 5K-10K tokens (manageable) vs 전체 로드: 100K+ (overflow)\n\nInvocation flow:\n1. User query → 2. LLM sees skill index → 3. Matches skill\n4. System loads full SKILL.md → 5. Injected into context → 6. Execute\n\nResolution: exact name → description similarity → fuzzy → user override\nCaching: recently-used 캐시, modification 시 무효화\n성능: scan <100ms, selection <10ms, load = disk I/O' },
];
const visuals = [
  { title: 'Skill 로딩 흐름', color: '#6366f1', rows: [
    { label: '1. Scan', value: 'skill 디렉토리 탐색 (project→user→system)' },
    { label: '2. Index', value: 'name+description 추출 → in-memory' },
    { label: '3. Match', value: 'LLM이 쿼리에 맞는 skill 선택' },
    { label: '4. Load', value: 'full SKILL.md 읽어 context 주입' },
    { label: '5. Execute', value: 'LLM이 instructions 따라 실행' },
    { label: '효율', value: '50-100 tokens/skill → 100+ 관리 가능' },
  ]},
];
export default function LoadingDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
