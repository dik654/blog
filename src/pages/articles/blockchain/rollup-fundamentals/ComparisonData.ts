export interface CompareCategory {
  id: string;
  label: string;
  icon: string;
  optimistic: { value: string; detail: string };
  zk: { value: string; detail: string };
}

export const CATEGORIES: CompareCategory[] = [
  {
    id: 'finality',
    label: '최종성 (Finality)',
    icon: '⏱',
    optimistic: {
      value: '~7일',
      detail:
        '챌린지 기간 동안 누구든 분쟁을 제기할 수 있다. ' +
        '기간이 지나면 상태가 확정된다. ' +
        '브릿지 출금에 7일 대기가 필요한 이유.',
    },
    zk: {
      value: '수분~수십분',
      detail:
        '증명 생성 후 L1 검증이 완료되면 즉시 확정. ' +
        '증명 생성 시간이 병목이지만, 하드웨어 발전으로 계속 단축 중.',
    },
  },
  {
    id: 'cost',
    label: '비용 구조',
    icon: '💰',
    optimistic: {
      value: 'L1 DA 비용',
      detail:
        'calldata/blob으로 트랜잭션 데이터를 L1에 게시하는 비용이 지배적. ' +
        'EIP-4844 이후 blob 사용 시 대폭 절감. 분쟁 비용은 평시에 0.',
    },
    zk: {
      value: 'DA + 증명 비용',
      detail:
        'L1 DA 비용에 더해 증명 생성 비용(GPU 서버)이 추가된다. ' +
        'state diff만 게시하면 DA 비용은 적지만 증명 비용이 상당.',
    },
  },
  {
    id: 'security',
    label: '보안 모델',
    icon: '🔒',
    optimistic: {
      value: '1-of-N 정직 가정',
      detail:
        '정직한 검증자 1명이 분쟁을 제기하면 부정 방지. ' +
        '경제적 인센티브(보증금)가 정직 행동을 유도한다. ' +
        '증명 회로 버그 위험은 없지만, 챌린지 기간이 보안의 핵심.',
    },
    zk: {
      value: '수학적 증명',
      detail:
        '정직 가정 불필요 — 증명이 곧 보안. ' +
        '하지만 증명 회로(circuit) 자체의 버그가 위험 요소. ' +
        '회로 감사(audit)가 매우 중요하며, 버그 시 전액 손실 가능.',
    },
  },
  {
    id: 'evm',
    label: 'EVM 호환성',
    icon: '⚙',
    optimistic: {
      value: '네이티브 EVM',
      detail:
        'geth 포크를 그대로 사용. 모든 Solidity 컨트랙트가 수정 없이 동작. ' +
        '개발 도구(Hardhat, Foundry)도 그대로 사용 가능.',
    },
    zk: {
      value: 'zkEVM',
      detail:
        'EVM opcode를 산술 회로로 변환해야 한다. ' +
        'Type 1(완전 호환) ~ Type 4(언어 호환)까지 호환성 수준이 다르다. ' +
        '호환성이 높을수록 증명 비용이 증가하는 트레이드오프.',
    },
  },
];
