export const STEPS = [
  { label: '프리컴파일 레지스트리 전체 맵', body: '주소 0x01~0x0a에 매핑된\n10개 프리컴파일 함수 목록' },
  { label: 'EVM이 CALL 명령 실행', body: 'to 주소가 0x01~0x0a 범위인지 확인\n범위 내면 바이트코드 실행을 건너뜀' },
  { label: 'HashMap에서 주소로 함수 조회', body: 'PrecompileSpecId별 HashMap\nOnceLock으로 지연 초기화' },
  { label: '입력 바이트 + 가스 체크', body: '입력 크기·쌍 수에 따라 필요 가스 산출\ngas_limit < 필요 가스 → OOG 리턴' },
  { label: '결과 반환 — 고정 크기 출력', body: '32B 또는 64B 바이트 배열\nEVM 스택에 success=1 + output data' },
];

export const PRECOMPILES = [
  { addr: '0x01', name: 'ecRecover', gas: '3,000', color: '#6366f1' },
  { addr: '0x02', name: 'SHA256', gas: '60+12/w', color: '#8b5cf6' },
  { addr: '0x06', name: 'bn128Add', gas: '150', color: '#10b981' },
  { addr: '0x08', name: 'bn128Pair', gas: '34k*n+45k', color: '#f59e0b' },
  { addr: '0x0a', name: 'KZG Eval', gas: '50,000', color: '#ef4444' },
];
