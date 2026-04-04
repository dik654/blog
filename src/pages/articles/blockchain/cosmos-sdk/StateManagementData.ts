export const MULTISTORE_CODE = `이더리움의 단일 State Trie vs Cosmos의 MultiStore

이더리움:
  stateRoot ─── 하나의 MPT
                 ├── account1 → {nonce, balance, storageRoot, codeHash}
                 ├── account2 → ...
                 └── ...

Cosmos SDK:
  app_hash ─── MultiStore (루트 해시 = 모든 서브스토어 해시의 Merkle)
                 ├── bank/store     ─── IAVL Tree (잔액 데이터)
                 ├── staking/store  ─── IAVL Tree (검증자 데이터)
                 ├── gov/store      ─── IAVL Tree (거버넌스 데이터)
                 ├── ibc/store      ─── IAVL Tree (IBC 상태)
                 └── ...

장점: 모듈별 독립적인 상태 증명(proof) 생성 가능
     → IBC에서 특정 모듈의 상태만 증명하면 됨`;

export const MULTISTORE_ANNOTATIONS = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: '이더리움: 단일 MPT' },
  { lines: [9, 15] as [number, number], color: 'emerald' as const, note: 'Cosmos: 모듈별 IAVL Tree' },
  { lines: [17, 18] as [number, number], color: 'amber' as const, note: 'IBC 상태 증명 장점' },
];
