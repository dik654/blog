import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① FC 신경망의 한계 — 고정 크기 입력',
    body: '길이가 다른 시퀀스를 같은 네트워크에 넣을 수 없음.',
  },
  {
    label: '② 순서가 의미를 결정',
    body: '단어 순서가 바뀌면 의미가 완전히 달라진다.',
  },
  {
    label: '③ 기억이 번역을 바꾼다',
    body: '이전 단어의 기억이 현재 단어 해석에 영향.',
  },
  {
    label: '④ RNN의 해답 — 순환 구조',
    body: '은닉 상태가 이전 정보를 압축하여 다음 단계로 전달.',
  },
];

export const FC_C = '#ef4444';
export const RNN_C = '#10b981';
