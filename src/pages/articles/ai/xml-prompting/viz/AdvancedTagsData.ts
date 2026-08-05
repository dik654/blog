import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '<evidence> + <answer> — 검산 가능한 출력',
    body: '비공개 사고 과정을 요구하는 대신 확인 가능한 근거와 최종 답을 분리한다.\n근거에는 문서 ID나 인용 위치를 남긴다.',
  },
  {
    label: '<rules> + <constraints> — 행동 규칙 분리',
    body: '<rules>에는 요구 행동, <constraints>에는 금지 조건을 둔다.\n태그는 검토를 돕지만 실제 위반 차단은 policy gate가 맡는다.',
  },
  {
    label: '중첩 태그 — 작업 분해',
    body: '<task> 안에 실제로 소속된 <subtask>를 배치한다.\nXML과 JSON 모두 중첩을 표현하므로 형식은 소비자와 검증 방식에 맞춰 고른다.',
  },
  {
    label: '<user_input> — 신뢰하지 않은 값 표시',
    body: '외부 입력을 데이터로 표시해 읽기 경계를 만든다.\n이 태그만으로 injection을 막을 수 없으며 tool·data 권한은 코드로 제한한다.',
  },
];
