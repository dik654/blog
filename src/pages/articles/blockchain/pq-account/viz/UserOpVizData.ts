export const C = { addr: '#6366f1', data: '#10b981', gas: '#f59e0b', sig: '#8b5cf6' };

export const STEPS = [
  {
    label: 'sender: address = 0x1234.. (스마트 계정)',
    body: 'UserOperation의 발신자는 EOA가 아니라 스마트 계정 컨트랙트입니다.\nERC-4337에서 sender는 항상 스마트 계정 주소입니다.',
  },
  {
    label: 'nonce: uint256 = 7 (재사용 방지)',
    body: 'nonce는 같은 UserOp가 두 번 실행되는 것을 방지합니다.\nEntryPoint가 nonce를 관리하므로 스마트 계정 자체 nonce와 별도입니다.',
  },
  {
    label: 'callData: transfer(to, 500 USDC)',
    body: 'callData는 스마트 계정에서 실행할 함수 호출을 인코딩합니다.\nabi.encode(transfer(0x5678.., 500 * 1e6))으로 USDC 전송을 지정합니다.',
  },
  {
    label: 'signature: ecdsaSig(65B) || dilithiumSig(2420B)',
    body: '하이브리드 서명: ECDSA 65바이트 + Dilithium 2420바이트를 연결합니다.\n총 2485바이트로, 기존 65바이트의 38배이지만 양자 내성을 확보합니다.',
  },
];
