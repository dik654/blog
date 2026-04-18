import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  { label: '고급 XML 패턴 10가지', body: '① CoT with tags: <thinking>→<answer> 추론 분리\n② Self-critique: <draft>→<critique>→<revised> 자기 비평 루프\n③ Multi-step: <step number="1"><action/><output/></step> 순차 워크플로우\n④ Conditional: <if condition="..."><response/></if> 조건 분기\n⑤ Nested docs: <knowledge_base><category name="..."><fact/></category>\n⑥ Tool definitions: <tools><tool name="search"><parameters/></tool>\n⑦ Validation: <output><answer/><confidence/><sources/></output>\n⑧ Personas: <persona><expertise/><style/></persona>\n⑨ Comparison: <option><pros/><cons/></option><recommendation/>\n⑩ Extraction: <extracted><entities/><relationships/></extracted>\n\nBest: nest 2-3 levels, meaningful names, clear schema, examples' },
];

const visuals = [
  { title: '고급 패턴 10가지', color: '#10b981', rows: [
    { label: 'CoT', value: '<thinking> → <answer> 추론 분리' },
    { label: 'Self-critique', value: '<draft> → <critique> → <revised>' },
    { label: 'Multi-step', value: '<step number="N"><action/><output/>' },
    { label: 'Tool defs', value: '<tool name="..."><parameters/>' },
    { label: 'Validation', value: '<answer> + <confidence> + <sources>' },
    { label: 'Extraction', value: '<entities> + <relationships>' },
  ]},
];

export default function AdvancedTagsDetailViz() {
  return <SimpleStepViz steps={steps} visuals={visuals} />;
}
