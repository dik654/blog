export const LOOP_STEPS = [
  {
    label: '① ScopeContext 생성',
    body: 'sync.Pool에서 Memory, Stack을 꺼내고 Contract와 합쳐 ScopeContext 구성',
  },
  {
    label: '② Fetch — 바이트코드에서 opcode 읽기',
    body: 'op = contract.Code[pc]',
  },
  {
    label: '③ Decode — JumpTable에서 operation 조회',
    body: 'operation = jumpTable[op]',
  },
  {
    label: '④ Gas — 가스 차감',
    body: 'constantGas: opcode마다 고정 비용 (ADD=3, MUL=5, SLOAD=2100)',
  },
  {
    label: '⑤ Execute — opcode 실행',
    body: 'operation.execute(pc, evm, scope) 호출',
  },
  {
    label: '⑥ pc++ → 루프 반복',
    body: 'JUMP/JUMPI가 아니면 pc를 1 증가시키고 ①로 돌아감',
  },
];
