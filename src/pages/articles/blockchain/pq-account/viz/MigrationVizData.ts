export const C = { ecdsa: '#f59e0b', pq: '#6366f1', hybrid: '#10b981', final: '#8b5cf6' };

export const STEPS = [
  {
    label: 'Phase 1: 기존 ECDSA 계정 유지, AA 스마트 계정 배포',
    body: 'EOA에서 ERC-4337 스마트 계정으로 자산을 이전합니다.\n스마트 계정은 서명 검증 로직을 코드로 교체할 수 있습니다.',
  },
  {
    label: 'Phase 2: addDilithiumKey(dilithiumPubkey)',
    body: '스마트 계정에 Dilithium 공개키를 추가합니다.\n이 시점에서는 ECDSA만으로도 계정을 사용할 수 있습니다.',
  },
  {
    label: 'Phase 3: setHybridMode() — 두 서명 모두 검증',
    body: 'require(ecdsaValid && dilithiumValid) 모드로 전환합니다.\n두 서명 중 하나라도 실패하면 트랜잭션이 거부됩니다.',
  },
  {
    label: 'Phase 4: removeECDSA() — PQ 전용 전환',
    body: 'ecdsaKey = address(0)으로 설정하여 ECDSA를 비활성화합니다.\n양자 컴퓨터가 ECDSA를 해독해도 이 계정은 안전합니다.',
  },
];
