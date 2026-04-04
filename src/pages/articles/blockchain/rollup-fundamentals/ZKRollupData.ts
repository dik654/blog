export interface ZKStep {
  id: string;
  label: string;
  desc: string;
  detail: string;
  color: string;
}

export const ZK_PIPELINE: ZKStep[] = [
  {
    id: 'execute',
    label: 'Execute',
    desc: '트랜잭션 실행',
    detail:
      'Sequencer가 L2 트랜잭션을 실행하고 상태 변화(state diff)를 기록한다. ' +
      'Optimistic과 동일하게 오프체인에서 EVM을 실행하지만, 실행 트레이스(trace)를 함께 생성한다. ' +
      '이 트레이스가 이후 증명 생성의 입력이 된다.',
    color: '#6366f1',
  },
  {
    id: 'prove',
    label: 'Prove',
    desc: '영지식 증명 생성',
    detail:
      '실행 트레이스를 산술 회로(arithmetic circuit)로 변환하고 증명을 생성한다. ' +
      'GPU 가속에도 분~십분 단위 소요. Prover는 보통 별도의 고성능 서버에서 병렬 실행된다. ' +
      'SNARK(Groth16, PLONK) 또는 STARK 중 선택 — 각각 증명 크기와 검증 비용이 다르다.',
    color: '#0ea5e9',
  },
  {
    id: 'verify',
    label: 'Verify',
    desc: 'L1 온체인 검증',
    detail:
      'L1의 Verifier 컨트랙트가 증명을 O(1) 시간에 검증한다. ' +
      '검증에 필요한 가스는 약 200K~500K — 일반 트랜잭션 수준. ' +
      'Optimistic의 7일 대기와 달리 수학적 확실성으로 즉시 판정한다.',
    color: '#10b981',
  },
  {
    id: 'finalize',
    label: 'Finalize',
    desc: '상태 확정',
    detail:
      '증명 검증 성공 시 L2 상태가 즉시 확정(finalized)된다. ' +
      'L1 → L2 브릿지 출금이 챌린지 기간 없이 바로 완료된다. ' +
      '이것이 ZK Rollup의 최대 장점 — 사용자가 7일을 기다릴 필요가 없다.',
    color: '#f59e0b',
  },
];

export interface Tradeoff {
  category: string;
  zk: string;
  optimistic: string;
  winner: 'zk' | 'optimistic' | 'draw';
}

export const TRADEOFFS: Tradeoff[] = [
  {
    category: '증명 비용',
    zk: 'GPU 가속에도 분 단위 소요. 별도 Prover 인프라 필요',
    optimistic: '분쟁 시에만 비용 발생. 평시에는 거의 무비용',
    winner: 'optimistic',
  },
  {
    category: '확정 지연',
    zk: '증명 생성 후 즉시 확정 (수분~수십분)',
    optimistic: '7일 챌린지 기간 대기 필요',
    winner: 'zk',
  },
  {
    category: 'EVM 호환성',
    zk: 'zkEVM 호환 레이어 필요. 일부 opcode 미지원 가능',
    optimistic: '네이티브 EVM. geth 포크 그대로 사용',
    winner: 'optimistic',
  },
];
