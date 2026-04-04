export const SLIVER_PAIR_CODE = `// SliverPair: 각 노드가 보유하는 슬라이버 쌍
pub struct SliverPair<const N: usize> {
    pub primary: Sliver<N>,    // 열 방향 RS 슬라이버
    pub secondary: Sliver<N>,  // 행 방향 RS 슬라이버
}

pub struct Sliver<const N: usize> {
    pub symbols: Vec<Vec<u8>>,  // RS 심볼 데이터
    pub index: usize,           // 노드 인덱스
    pub merkle_proof: Vec<[u8; 32]>, // Merkle 포함 증명
}`;

export const SLIVER_PAIR_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '노드당 Primary + Secondary 1쌍' },
  { lines: [7, 11] as [number, number], color: 'emerald' as const, note: '심볼 데이터 + Merkle 증명' },
];

export const VERIFY_CODE = `// 슬라이버 검증 흐름
// 1. Merkle 경로 검증: 수신 슬라이버가 커밋된 루트에 속하는지
fn verify_sliver(sliver: &Sliver, root: &[u8; 32]) -> bool {
    let leaf_hash = blake2b256(&sliver.symbols);
    merkle_verify(leaf_hash, &sliver.merkle_proof, sliver.index, root)
}

// 2. 무결성 인증서 (WriteCertificate)
// 2f + 1개 노드가 슬라이버 수신 확인 서명을 제출하면
// Sui 체인에 WriteCertificate 기록
// → 블롭이 영구 저장됨을 보증

// 3. 슬라이버 배포 전략
// 노드 인덱스 = epoch 기반 해시로 결정
// 에포크마다 노드 재할당 → 부하 분산`;

export const VERIFY_ANNOTATIONS = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'Blake2b256 Merkle 검증' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: '2f+1 서명 → WriteCertificate' },
  { lines: [13, 15] as [number, number], color: 'amber' as const, note: '에포크 기반 노드 할당' },
];
