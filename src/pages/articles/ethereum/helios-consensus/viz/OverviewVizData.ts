export const C = {
  bls: '#6366f1',
  reth: '#ef4444',
  flow: '#10b981',
  muted: '#94a3b8',
  grid: '#22c55e',
  gridOff: '#64748b',
};

export const STEPS = [
  {
    label: '풀 노드 vs 경량 클라이언트 — 같은 목표, 다른 경로',
    body: 'Reth: 모든 TX 실행 → state_root 재계산 (수억 TX, 수일 소요, 700GB).\nHelios: BLS 집계 서명 1회 검증 (1회 페어링, 수 ms, ~0 디스크).\n둘 다 결과는 "블록 헤더 신뢰" — 비용만 다르다.',
  },
  {
    label: 'verify 함수 5단계 파이프라인',
    body: '512비트 비트맵 → 참여 공개키 필터 → 합산(agg_pk, 48B) → signing_root(32B) → 페어링 비교(GT).\n전체 처리 ~3ms. Reth의 블록 실행 수 초와 대비.',
  },
  {
    label: '512명 위원회 — 100만+ 검증자의 대표',
    body: 'RANDAO 시드로 무작위 512명 선출. 256 에폭(~27시간)마다 교체.\n전체 0.05%지만 32ETH stake + 슬래싱으로 조작 비용 극대화.',
  },
];
