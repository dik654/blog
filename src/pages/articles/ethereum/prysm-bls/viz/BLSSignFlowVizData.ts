export const C = {
  curve: '#8b5cf6', bind: '#6366f1', sign: '#10b981',
  verify: '#f59e0b', agg: '#ec4899', batch: '#06b6d4',
};

export const STEPS = [
  { label: '왜 BLS 서명인가', body: '수천 서명을 덧셈으로 집계하여 블록 크기와 검증 시간을 극적으로 축소' },
  { label: '① BLS12-381 커브', body: 'G1(48B) x G2(96B) → GT 패어링, 128비트 보안' },
  { label: '② BLST CGo 바인딩', body: 'Go→CGo→blst C/asm, 순수 Go 대비 약 10배 빠른 패어링' },
  { label: '③ Sign(sk, msg)', body: 'hash-to-curve로 메시지를 G2에 매핑 후 스칼라 곱, DST 도메인 분리' },
  { label: '④ Verify & FastAggregateVerify', body: '동일 메시지면 pk 합산 → 패어링 1회로 수천 서명 검증' },
  { label: '⑤ 배치 검증 최적화', body: '서로 다른 (pk, msg) 쌍을 랜덤 계수로 한 번에 검증, rogue-key 방어' },
];

export const NODES = [
  { id: 'sk', label: 'SecretKey', x: 15, y: 20 },
  { id: 'curve', label: 'BLS12-381', x: 225, y: 20 },
  { id: 'blst', label: 'BLST (C/asm)', x: 435, y: 20 },
  { id: 'sign', label: 'Sign(sk,msg)', x: 15, y: 110 },
  { id: 'verify', label: 'Verify', x: 225, y: 110 },
  { id: 'fastagg', label: 'FastAggVerify', x: 435, y: 110 },
  { id: 'aggverify', label: 'AggregateVerify', x: 225, y: 200 },
];

export const EDGES = [
  { from: 0, to: 1, label: 'Fr 스칼라' },
  { from: 1, to: 2, label: 'CGo 호출' },
  { from: 0, to: 3, label: '서명 생성' },
  { from: 3, to: 4, label: 'sig + pk' },
  { from: 4, to: 5, label: '동일 msg' },
  { from: 5, to: 6, label: '다수 msg' },
];
