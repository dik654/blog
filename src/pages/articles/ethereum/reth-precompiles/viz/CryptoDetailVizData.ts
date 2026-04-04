export const C = { call: '#6366f1', hash: '#8b5cf6', curve: '#10b981', pair: '#f59e0b', out: '#0ea5e9' };

export const STEPS = [
  {
    label: 'CALL → 주소 체크',
    body: 'EVM이 CALL 실행 시\nto 주소가 0x01~0x0a 범위인지 확인\n범위 내면 바이트코드 실행을 건너뛰고\nPrecompile HashMap에서 함수 조회',
  },
  {
    label: 'gas_limit 체크',
    body: '프리컴파일 함수가 먼저 가스를 계산\n입력 크기·쌍 수에 따라 필요 가스 산출\ngas_limit < 필요 가스이면 즉시 OOG 리턴\n실행 전에 가스 부족을 차단',
  },
  {
    label: 'ecRecover (0x01)',
    body: 'secp256k1 서명에서 공개키를 복구\ninput = hash(32B) + v,r,s(32B*3)\nkeccak256(pubkey)의 하위 20바이트 = 주소\n가스 3,000 고정',
  },
  {
    label: 'bn128 Pairing (0x08)',
    body: '입력 = G1점 + G2점 쌍의 배열\n가스 = 34,000 * k + 45,000 (k = 쌍 수)\nsubstrate-bn으로 pairing 계산\n결과가 1이면 검증 성공 (32B 출력)',
  },
  {
    label: '결과 반환',
    body: '고정 크기 바이트 배열(32B or 64B) 리턴\nEVM 스택에 success=1 + output data\n남은 가스는 호출자에게 환불\nPrecompileOutput { gas_used, bytes }',
  },
];
