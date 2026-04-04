export interface GlossaryTerm {
  icon: string;
  name: string;
  en: string;
  desc: string;
  why: string;
  articleLink?: string;
  articleTitle?: string;
}

export const ROLLUP_TERMS: GlossaryTerm[] = [
  {
    icon: '🔄', name: '롤업 (Rollup)', en: 'Rollup',
    desc: '트랜잭션 실행은 오프체인(L2), 데이터와 상태 루트는 온체인(L1)에 게시하는 확장 솔루션. L1의 보안을 상속받으면서 처리량을 수백~수천 배 향상시킨다. Optimistic(사기 증명)과 ZK(유효성 증명) 두 가지 방식이 있다.',
    why: '이더리움 확장 로드맵의 핵심. L1 처리량(~15 TPS) 한계를 L2에서 해결한다.',
    articleLink: '/blockchain/da-theory',
    articleTitle: '데이터 가용성 이론: 롤업 데이터가 L1에 어떻게 게시되는지',
  },
  {
    icon: '🎯', name: '시퀀서 (Sequencer)', en: 'Sequencer',
    desc: 'L2에서 트랜잭션을 수집·정렬·실행하여 블록을 생성하는 노드. OP Stack에서는 op-node가 시퀀서 역할을 수행한다. 현재 대부분의 롤업은 중앙화된 단일 시퀀서를 사용하지만, 시퀀서가 다운되어도 L1 데이터로 L2 상태를 재구성(derivation)할 수 있어 검열 저항성을 유지한다.',
    why: '시퀀서 의존 없이 L2 상태 복원이 가능한 "탈출 해치(escape hatch)"가 보안의 핵심이다.',
  },
  {
    icon: '🔍', name: 'Derivation (도출)', en: 'Derivation Pipeline',
    desc: 'L1에 게시된 배치 데이터로부터 L2 블록을 재구성하는 과정. OP Stack에서는 7단계 pull 파이프라인(L1Traversal → FrameQueue → ChannelBank → BatchMux → AttributesQueue)으로 구현된다. 각 단계가 이전 단계에서 데이터를 당겨오는(pull) 방식이라 메모리 효율적이다.',
    why: 'L2의 "신뢰 불필요(trustless)" 속성의 근간. 누구나 L1 데이터만으로 L2 상태를 독립 재현 가능하다.',
  },
  {
    icon: '🚨', name: 'Fraud Proof (사기 증명)', en: 'Fraud Proof',
    desc: 'Optimistic Rollup에서 사용. 제출된 상태 루트가 잘못됐음을 증명하는 메커니즘. 챌린지 기간(보통 7일) 동안 아무도 이의를 제기하지 않으면 확정된다. OP Stack에서는 op-challenger가 Bisection Game으로 분쟁을 단일 명령어까지 좁힌다.',
    why: '"일단 믿고, 틀리면 증명" — 정직한 검증자 1명만 있으면 안전하다(1-of-N 보안 모델).',
  },
  {
    icon: '✅', name: 'Validity Proof (유효성 증명)', en: 'Validity Proof',
    desc: 'ZK Rollup에서 사용. 상태 전이가 올바름을 SNARK/STARK 증명으로 수학적으로 검증한다. 증명이 L1 검증 컨트랙트에서 통과하면 즉시 확정된다. 챌린지 기간이 불필요하므로 최종성(finality)이 빠르다.',
    why: '수학적 보장으로 챌린지 기간 없이 L1 확정. 단, 증명 생성에 높은 연산 비용이 든다.',
    articleLink: '/blockchain/snark-overview',
    articleTitle: 'SNARK 개론: Setup·Prove·Verify',
  },
  {
    icon: '🪓', name: 'Bisection Game (이진 분할 게임)', en: 'Bisection / Dispute Game',
    desc: 'Fault Proof의 핵심 메커니즘. Claim의 Position이 이진 트리 좌표를 나타내고, Attack/Defend로 분쟁 범위를 반씩 좁힌다. 최대 깊이 도달 시 단일 명령어(MIPS 또는 Cannon) 실행으로 옳고 그름을 판정한다. L1에서 전체 실행을 재현하면 가스 비용이 막대하므로 검증 범위를 O(log n)으로 축소한다.',
    why: 'L1 가스 비용을 O(n)에서 O(log n)으로 줄이는 핵심 최적화.',
  },
  {
    icon: '🌲', name: 'State Root (상태 루트)', en: 'State Root',
    desc: 'L2 전체 상태(계정·잔고·컨트랙트·스토리지)의 Merkle 해시. 32바이트 해시 하나로 전체 상태를 대표한다. L1에 주기적으로 게시되며, 검증자가 이를 통해 L2 상태의 정확성을 확인한다.',
    why: '32바이트 해시 하나로 수백만 계정의 상태를 검증 가능하게 만드는 핵심 자료구조.',
    articleLink: '/blockchain/merkle-patricia-trie',
    articleTitle: 'Modified Merkle-Patricia Trie (MPT)',
  },
  {
    icon: '📦', name: '배치 (Batch)', en: 'Batch',
    desc: '여러 L2 트랜잭션을 묶어 L1에 한 번에 제출하는 단위. OP Stack에서는 channelManager가 L2 블록을 zlib 압축 → 프레임 분할 → blob 또는 calldata로 제출한다. DA 타입(blob vs calldata)은 가스 가격에 따라 동적으로 전환된다.',
    why: 'L1 고정 비용(21,000 gas 기본료 등)을 수백~수천 TX가 분담하는 핵심 경제 메커니즘.',
  },
];
