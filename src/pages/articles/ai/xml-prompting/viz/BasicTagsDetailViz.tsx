import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  { label: '기본 6개 태그 + Anthropic 추천 태그', body: '기본 6개: <task> 작업 정의 | <context> 배경 정보 | <input> 처리할 데이터\n<instructions> 상세 지시 | <examples> 예시 (중첩 <example>) | <output_format> 출력 형식\n\nAnthropic 추천: <document> 소스 문서 | <examples> few-shot\n<question> 사용자 질의 | <answer> 응답 | <thinking> 추론 과정 | <response> 최종 출력\n\nNaming: lowercase, snake_case, descriptive — 일관성 유지 → LLM learns patterns' },
];

const visuals = [
  { title: '기본 태그 + Anthropic 추천', color: '#6366f1', rows: [
    { label: '<task>', value: '작업 정의 — "Summarize in 3 sentences"' },
    { label: '<context>', value: '배경 정보 — 도메인, 사용자 수준' },
    { label: '<input>', value: '처리할 데이터 — 원본 텍스트' },
    { label: '<instructions>', value: '상세 지시 — 규칙 목록' },
    { label: '<examples>', value: 'Few-shot — <example> 중첩' },
    { label: '<output_format>', value: '출력 형식 — JSON/XML 스키마' },
  ]},
];

export default function BasicTagsDetailViz() {
  return <SimpleStepViz steps={steps} visuals={visuals} />;
}
