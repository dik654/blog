export const C = { call: '#6366f1', state: '#10b981', event: '#f59e0b' };

export const STEPS = [
  {
    label: 'op.sender.call{gas: callGasLimit}(op.callData)',
    body: 'EntryPoint가 스마트 계정에 callData를 전달하여 실행합니다.\ncallGasLimit만큼의 가스를 할당하고, 초과 시 out-of-gas로 실패합니다.',
  },
  {
    label: 'callData 디코딩: transfer(to=0x5678, amount=500)',
    body: '4바이트 함수 선택자 + ABI 인코딩된 파라미터를 디코딩합니다.\n이 경우 USDC transfer 함수를 호출합니다.',
  },
  {
    label: 'balances[sender] -= 500, balances[to] += 500',
    body: '상태 변경: sender 잔고 2000→1500, to 잔고 300→800.\nERC-20 Transfer 이벤트도 함께 발행됩니다.',
  },
  {
    label: 'emit UserOperationEvent(hash, sender, success, gas)',
    body: 'UserOp 실행 결과를 이벤트로 기록합니다.\n번들러와 인덱서가 이 이벤트를 모니터링하여 결과를 추적합니다.',
  },
];
