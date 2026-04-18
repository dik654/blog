import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: '3가지 프리미티브 상세 — Tools · Resources · Prompts', body: '① Tools (Actions): LLM이 호출하는 함수 — 외부 상태 수정\n예: send_email(to,subject,body), execute_sql(query)\nJSON Schema로 inputSchema 정의 → LLM 자동 파라미터 이해\n\n② Resources (Data): LLM이 읽는 데이터 소스\n예: files, DB rows, API responses — uri+name+mimeType\nlist/read/subscribe 지원\n\n③ Prompts (Templates): 재사용 프롬프트 템플릿\n예: code_review(file), summarize(text, length)\narguments로 파라미터화\n\n방향: Tools = LLM→World | Resources = World→LLM | Prompts = Pre-defined\nJSON Schema가 self-documenting API 역할 → type validation + 올바른 호출\n생태계: Filesystem, Git, SQLite, Brave Search, Playwright, Memory' },
];
const visuals = [
  { title: 'Tools · Resources · Prompts', color: '#f59e0b', rows: [
    { label: 'Tools', value: 'LLM → World (행동): send_email, SQL' },
    { label: 'Resources', value: 'World → LLM (정보): files, DB, API' },
    { label: 'Prompts', value: 'Pre-defined templates (재사용)' },
    { label: 'Schema', value: 'JSON Schema → LLM 자동 파라미터 이해' },
    { label: '생태계', value: 'Filesystem, Git, SQLite, Playwright' },
  ]},
];
export default function PrimitivesDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
