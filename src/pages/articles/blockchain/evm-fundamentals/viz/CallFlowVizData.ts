export const CALL_STEPS = [
  {
    label: '① Depth Check — 호출 깊이 제한',
    body: 'depth > 1024이면 ErrDepth 반환',
  },
  {
    label: '② Balance Check — 잔액 확인',
    body: 'value가 0이 아니면 CanTransfer()로 caller 잔액 확인',
  },
  {
    label: '③ State Snapshot — 상태 스냅샷 저장',
    body: 'StateDB.Snapshot()으로 현재 상태의 체크포인트 생성',
  },
  {
    label: '④ Value Transfer — ETH 전송',
    body: 'caller → addr로 value만큼 이체',
  },
  {
    label: '⑤ Code Check — 프리컴파일 vs 일반 컨트랙트',
    body: '주소 0x01~0x11 → RunPrecompiledContract() (네이티브 Go 실행)',
  },
  {
    label: '⑥ Run() — 인터프리터 실행',
    body: 'Contract에 코드와 가스를 세팅 후 evm.Run(contract, input, readOnly) 호출',
  },
  {
    label: '⑦ Error → RevertToSnapshot',
    body: '실행 중 에러 발생 시 ③의 스냅샷으로 상태 복원',
  },
  {
    label: '⑧ Return — 결과 반환',
    body: '(ret []byte, leftOverGas uint64, err error) 반환',
  },
];
