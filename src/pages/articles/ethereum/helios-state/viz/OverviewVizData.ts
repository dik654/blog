/** OverviewViz — 색상 상수 + step 정의 */

export const C = {
  reth: '#ef4444',       // Reth 풀노드 (레드)
  helios: '#6366f1',     // Helios 경량 (인디고)
  proof: '#10b981',      // 증명/검증 (에메랄드)
  trust: '#f59e0b',      // 신뢰/경고 (앰버)
  rpc: '#8b5cf6',        // RPC 프로바이더 (보라)
};

export const STEPS = [
  {
    label: 'Reth vs Helios — 상태 접근 방식의 차이',
    body: 'Reth는 로컬 700GB+ DB에서 직접 읽는다. 신뢰 불필요, 하지만 디스크와 시간이 필요.\nHelios는 상태 저장 없이 RPC에 증명을 요청하고 state_root로 검증한다.',
  },
  {
    label: 'EIP-1186: eth_getProof 응답 구조',
    body: 'eth_getProof(address, storageKeys, blockNumber)의 응답은 3가지:\naccountProof(상태 트라이 경로), storageProof(스토리지 트라이 경로), account 필드(balance, nonce, codeHash, storageHash).',
  },
  {
    label: '신뢰 모델 — RPC를 믿지 않으면서 RPC 데이터를 사용한다',
    body: 'RPC 응답은 거짓일 수 있다. 하지만 state_root는 BLS 검증된 finalized_header에서 온다.\nMerkle 증명이 응답 데이터가 state_root에 속함을 수학적으로 증명한다.',
  },
];
