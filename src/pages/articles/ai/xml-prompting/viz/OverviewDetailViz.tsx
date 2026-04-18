import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  { label: 'XML Prompting 4가지 장점', body: '① 명확한 구조: 태그로 섹션 구분 → LLM이 쉽게 파싱, ambiguity 감소\n② Claude 친화적: Anthropic 공식 추천, 학습 데이터에 XML 많이 포함\n③ 파싱 가능: 출력도 XML로 유도, 프로그램이 쉽게 추출\n④ 명시적 지시: instruction vs context vs example 구분 → 역할 분리 명확' },
  { label: 'Plain text vs XML 비교', body: 'Plain text:\n"You are a helpful assistant. What is AI? Provide a clear answer."\n→ 역할·질문·지시가 구분 없이 섞임\n\nXML:\n<role>helpful assistant</role>\n<question>What is AI?</question>\n<instructions>clear answer with examples</instructions>\n→ 각 요소가 태그로 명확 분리' },
  { label: 'XML vs 대안 비교 + 2024 현황', body: 'Markdown: ambiguous, less explicit → GPT-4도 잘 작동\nJSON: verbose, escaping issues → 구조적이나 비용 높음\nNumbers: brittle, no semantics → 순서만 표현\nXML: explicit + semantic + parseable → Claude 최적\n\n2024: XML prompting widely adopted\nAnthropic best practice, enterprise 표준\n토큰 오버헤드 10-20%지만 reliability로 상쇄' },
];

const visuals = [
  { title: 'XML 4대 장점', color: '#6366f1', rows: [
    { label: '명확한 구조', value: '태그로 섹션 구분 → ambiguity 감소' },
    { label: 'Claude 친화적', value: 'Anthropic 공식 추천, 학습 데이터 최적화' },
    { label: '파싱 가능', value: '출력도 XML → 프로그램 추출 용이' },
    { label: '명시적 지시', value: 'instruction/context/example 분리' },
  ]},
  { title: 'Plain text vs XML', color: '#10b981', rows: [
    { label: 'Plain text', value: '역할·질문·지시가 구분 없이 섞임' },
    { label: 'XML', value: '<role> + <question> + <instructions> 분리' },
    { label: '핵심 차이', value: '각 요소의 역할이 태그로 명시' },
    { label: '효과', value: 'LLM 파싱 정확도 ↑, 응답 품질 ↑' },
  ]},
  { title: '대안 비교 + 현황', color: '#f59e0b', rows: [
    { label: 'Markdown', value: 'ambiguous — GPT-4도 작동하지만' },
    { label: 'JSON', value: 'verbose, escaping 문제' },
    { label: 'XML', value: 'explicit + semantic + parseable' },
    { label: '2024', value: 'Anthropic best practice, enterprise 표준' },
    { label: '비용', value: '10-20% overhead, reliability로 상쇄' },
  ]},
];

export default function OverviewDetailViz() {
  return <SimpleStepViz steps={steps} visuals={visuals} />;
}
