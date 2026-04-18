import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  { label: 'XML 실전 Best Practices + 5가지 패턴', body: 'Best Practices:\n① 명확한 구조: <task>+<input>+<output_format> 분리\n② 일관된 태그: 모든 prompt에서 같은 tags 사용\n③ 얕은 중첩: max 2-3 levels\n④ 명시적 출력 형식: <output_format>으로 스키마 제공\n⑤ 예시 필수: 복잡한 task → <example> 태그\n\nProduction 5대 패턴:\n① QA: <context>+<question>+<instructions>+<answer>\n② Extraction: <document>+<schema>+<extracted>\n③ Classification: <text>+<categories>+<classification>\n④ Multi-turn: <conversation><turn role="..."/></conversation>\n⑤ Tool use: <available_tools>+<reasoning>+<tool_call>\n\n토큰 오버헤드 10-20%, 안정성으로 상쇄\n안티패턴: over-engineering, deep nesting, inconsistent naming' },
];

const visuals = [
  { title: '실전 패턴 + 안티패턴', color: '#f59e0b', rows: [
    { label: '① QA', value: 'context + question + answer' },
    { label: '② Extraction', value: 'document + schema + extracted' },
    { label: '③ Classification', value: 'text + categories + classification' },
    { label: '④ Multi-turn', value: '<turn role="..."> 대화 구조' },
    { label: '⑤ Tool use', value: 'tools + reasoning + tool_call' },
    { label: '주의', value: '10-20% 오버헤드, 안정성으로 상쇄' },
  ]},
];

export default function BestPracticesDetailViz() {
  return <SimpleStepViz steps={steps} visuals={visuals} />;
}
