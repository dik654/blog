/** OverviewViz — 색상 상수 + step 정의 */

export const C = {
  reth: '#f59e0b',      // Reth 풀노드 (앰버)
  helios: '#6366f1',    // Helios 경량 (인디고)
  verify: '#10b981',    // 검증/성공 (에메랄드)
  rpc: '#8b5cf6',       // RPC 네트워크 (보라)
  cache: '#06b6d4',     // 캐시 (시안)
  danger: '#ef4444',    // 경고 (레드)
};

export const STEPS = [
  {
    label: 'Reth MDBX vs Helios ProofDB — DB 레이어만 다르다',
    body: 'Reth는 MDBX(700GB) 디스크에서 값을 읽는다. Helios는 ProofDB가 RPC에 증명을 요청하고 검증 후 값을 반환한다.\nrevm 입장에서 둘 다 Database trait — EVM 코드는 동일.',
  },
  {
    label: 'ProofDB lazy loading — 첫 접근 시에만 증명 요청',
    body: 'EVM이 계정에 처음 접근하면 ProofDB가 eth_getProof를 호출한다. 이후 접근은 내부 캐시에서 즉시 반환.\n불필요한 RPC 왕복을 방지하는 핵심 전략.',
  },
  {
    label: 'revm 빌더 패턴 — ProofDB → EVM → transact()',
    body: 'ProofDB::new(rpc, block)으로 가상 DB 생성. Evm::builder().with_db(proof_db).build()로 EVM 구성.\ntransact() 한 번으로 로컬 실행 완료 — Reth와 완전히 동일한 revm 코드.',
  },
];
