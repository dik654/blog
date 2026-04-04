export const C = {
  registry: '#6366f1', hash: '#10b981', resolver: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 1: ENS 레지스트리 → 리졸버 주소',
    body: 'helios.call(ens_registry, "resolver(namehash)")\n레지스트리 컨트랙트에서 도메인의 리졸버 주소를 조회.',
  },
  {
    label: 'Line 2: namehash 계산 (재귀 해싱)',
    body: 'namehash = keccak256(keccak256(0x0 || keccak256("eth")) || keccak256("vitalik"))\n도메인 라벨을 오른쪽부터 재귀적으로 해싱.',
  },
  {
    label: 'Line 3: 리졸버 → 이더리움 주소',
    body: 'helios.call(resolver_addr, "addr(namehash)")\n리졸버 컨트랙트에서 실제 이더리움 주소를 반환.',
  },
  {
    label: '보안: 모든 조회가 Merkle 증명으로 검증됨',
    body: 'Helios 경량 클라이언트가 응답의 Merkle 증명을 검증.\n악의적 RPC가 가짜 주소를 반환해도 증명 불일치로 즉시 감지.',
  },
];
