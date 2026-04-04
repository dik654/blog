export const COMP_STEPS = [
  {
    label: 'EVM 구성요소',
    body: 'Machine State(휘발성): PC, gas, Stack, Memory — 호출 종료 시 소멸',
  },
  {
    label: 'JUMPI — 흐름 제어',
    body: '스택에서 조건 값(0/1)과 목적지를 pop',
  },
  {
    label: 'MSTORE — 메모리 쓰기',
    body: '스택에서 offset과 value를 pop → Memory[offset]에 32바이트 기록',
  },
  {
    label: 'SSTORE — 스토리지 쓰기',
    body: '스택에서 slot과 value를 pop → Storage[slot]에 기록',
  },
];
