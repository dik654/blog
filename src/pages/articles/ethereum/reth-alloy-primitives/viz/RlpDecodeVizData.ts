export const C = {
  header: '#6366f1', str: '#10b981', list: '#f59e0b',
  err: '#ef4444', ok: '#8b5cf6', dim: '#94a3b8',
};

export const STEPS = [
  {
    label: 'decode 경로: Header 파싱 → 타입 판별',
    body: '첫 바이트 읽기 → match 분기\n0x00~0x7f: 단일 바이트\n0x80~0xb7: 문자열 / 0xc0~0xf7: 리스트',
  },
  {
    label: '재귀 디코딩 — 리스트 내부 요소 처리',
    body: 'Header.list == true → 페이로드를 재귀적으로 파싱\n각 요소마다 decode()를 다시 호출\n중첩 리스트도 동일한 경로로 처리',
  },
  {
    label: '에러 타입: 4가지 디코딩 실패 경로',
    body: 'UnexpectedLength: 선언 길이 != 실제 데이터\nLeadingZero: 정수 앞 불필요한 0x00\nOverflow: 대상 타입 초과 / InputTooShort: 버퍼 부족',
  },
  {
    label: '재귀 depth limit — 중첩 리스트 공격 방어',
    body: '공격자가 [[[[...]]]] 깊은 중첩 전송 가능\n재귀 깊이 제한으로 스택 오버플로 방지\nReth는 디코딩 시 depth counter를 유지',
  },
  {
    label: 'decode_exact — 입력 완전 소진 검증',
    body: 'T::decode() 후 남은 바이트가 있으면 에러\n정확히 하나의 값만 디코딩되었음을 보장\n트랜잭션 해시 검증에 필수적',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'rlp-decode-header', 1: 'rlp-decode-header',
  2: 'rlp-decode-errors', 3: 'rlp-decode-errors',
  4: 'rlp-decode-exact',
};
