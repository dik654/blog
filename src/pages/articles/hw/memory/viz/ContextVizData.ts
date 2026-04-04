export const C = { ddr4: '#71717a', ddr5: '#6366f1', ecc: '#10b981', err: '#ef4444', ok: '#10b981' };

export const STEPS = [
  { label: 'DDR4 vs DDR5: 전송률 + 채널 구조 비교', body: 'DDR4: 3200MT/s 듀얼채널 / DDR5: 5600MT/s 2x 서브채널, 전력 1.1V(DDR5) vs 1.2V(DDR4)' },
  { label: 'DDR5 서브채널: 32비트 × 2 = 64비트 대역폭', body: 'DDR5: DIMM당 2개 서브채널(32비트), 독립 어드레싱 → 동시 2개 요청 처리, 실효 대역폭 2배' },
  { label: 'ECC: SEC-DED (1비트 정정, 2비트 감지)', body: 'Hamming(72,64): 8비트 ECC / 64비트 데이터, 비트 플립 자동 정정 → 서버/블록체인 노드 필수' },
  { label: 'Filecoin PC1: 32GiB 섹터 = 최소 64GB RAM', body: '단일 봉인: 64GB, 병렬 2~4개: 128~256GB → RDIMM(Registered DIMM) 대용량 구성 필수' },
];
