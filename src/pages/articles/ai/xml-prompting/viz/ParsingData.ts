import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '전체 문법 파싱',
    body: '응답 전체를 XML parser에 넣는다.\n닫는 태그, escape, 중첩이 깨지면 syntax failure로 보존한다.',
  },
  {
    label: '필수 필드 검증',
    body: '<summary>, <confidence>, <sources>의 존재와 중복 여부를 검사한다.\n파싱 성공과 schema 성공은 다른 판정이다.',
  },
  {
    label: '타입·범위 검증',
    body: '<item> 반복을 배열로 변환하고 숫자 범위와 enum을 확인한다.\n문법이 맞아도 의미가 틀릴 수 있다.',
  },
  {
    label: '제한된 복구 또는 실패',
    body: 'validator 오류와 schema를 제공해 제한된 횟수만 재시도한다.\n관대한 parser나 regex로 원본 오류를 성공으로 바꾸지 않는다.',
  },
];
