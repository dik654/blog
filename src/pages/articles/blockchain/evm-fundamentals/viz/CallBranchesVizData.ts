export const BRANCH_STEPS = [
  {
    label: '① Snapshot — 상태 체크포인트 저장',
    body: 'StateDB.Snapshot()이 journal의 현재 길이를 기록',
  },
  {
    label: '② Transfer — ETH 값 전송',
    body: 'caller의 잔액에서 value만큼 차감(SubBalance)',
  },
  {
    label: '③ 프리컴파일 분기',
    body: '주소 0x01~0x0a는 프리컴파일 컨트랙트 — 네이티브 Go 코드로 실행',
  },
  {
    label: '④ NewContract — 실행 단위 생성',
    body: 'caller, address, value, gas를 묶어 Contract 구조체 생성',
  },
  {
    label: '⑤ Run() 호출 → 인터프리터 진입',
    body: 'evm.Run(contract, input, readOnly)',
  },
  {
    label: '⑥ 에러 처리 — Revert or 전소',
    body: 'err != nil → RevertToSnapshot()으로 상태 복원',
  },
];
