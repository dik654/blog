import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '의미 있는 태그 이름',
    body: '태그 이름이 역할을 드러내면 사람의 검토와 validator 연결이 쉬워진다.',
  },
  {
    label: '완전한 문서로 파싱',
    body: '여는 태그와 닫는 태그를 맞추고 응답 전체를 parser로 검증한다.',
  },
  {
    label: '실제 소속 관계만 중첩',
    body: '고정 깊이 숫자를 따르기보다 부모·자식 관계가 없으면 문서를 나눈다.',
  },
  {
    label: 'fixture로 형식 비교',
    body: 'XML, Markdown, schema output을 같은 실패 집합에서 비교해 가장 단순한 계약을 고른다.',
  },
];
