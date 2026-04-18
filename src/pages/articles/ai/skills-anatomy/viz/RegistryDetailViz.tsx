import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Skill Registry 계층 + 보안 + 생태계', body: 'Location hierarchy:\n① Project: ./.claude/skills/ — version-controlled, project-specific\n② User: ~/.claude/skills/ — personal, cross-project\n③ System: /usr/share/claude/skills/ — Anthropic-provided, org-wide\n\n보안: skill signing (GPG), 감사 로그, 샌드박싱\nPermission manifest: network, filesystem, commands 범위 정의\n\n설치: manual copy | claude-skills install | git clone | URL fetch\n품질: documented + tested + maintained + safe + performant\nVersioning: semver, breaking changes=major, migration guides\n\n2024-2025: Anthropic official + community + enterprise registries\n비교: npm(JS) | pip(Python) | Docker Hub | HuggingFace | MCP servers' },
];
const visuals = [
  { title: 'Registry 계층 + 보안', color: '#f59e0b', rows: [
    { label: 'Project', value: './.claude/skills/ — version-controlled' },
    { label: 'User', value: '~/.claude/skills/ — cross-project' },
    { label: 'System', value: '/usr/share/claude/ — org-wide' },
    { label: '보안', value: 'GPG signing, sandbox, permissions' },
    { label: '생태계', value: 'Anthropic + community + enterprise' },
  ]},
];
export default function RegistryDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
