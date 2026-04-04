export interface ExExUseCase {
  id: string;
  label: string;
  category: string;
  desc: string;
  events: string;
  caveat: string;
  color: string;
}

export const USE_CASES: ExExUseCase[] = [
  {
    id: 'indexer',
    label: 'TX/로그 인덱서',
    category: '데이터 파이프라인',
    desc: 'ChainCommitted에서 모든 트랜잭션과 이벤트 로그를 순회하며 외부 DB(PostgreSQL, ClickHouse 등)에 기록한다.',
    events: 'Committed → 인덱싱, Reverted → 롤백, Reorged → 롤백 + 재인덱싱',
    caveat: 'Reorg 처리가 핵심. old 체인의 데이터를 먼저 롤백한 후 new 체인을 적용해야 일관성 유지.',
    color: '#6366f1',
  },
  {
    id: 'bridge',
    label: 'L1→L2 브릿지 릴레이',
    category: '크로스체인',
    desc: 'L1 deposit 이벤트(특정 컨트랙트의 로그)를 감지하여 L2 시퀀서에 릴레이한다. OP Stack, Arbitrum 등과 연동 가능.',
    events: 'Committed → deposit 로그 감지 → L2 제출',
    caveat: 'finality 이전 블록의 deposit을 릴레이하면, reorg 시 L2에 유효하지 않은 deposit이 존재하게 된다.',
    color: '#0ea5e9',
  },
  {
    id: 'analytics',
    label: '실시간 분석',
    category: '모니터링',
    desc: '가스 사용량, MEV 기회, DEX 거래량, NFT 민트 등을 실시간으로 수집한다. Prometheus 메트릭이나 대시보드에 연동.',
    events: 'Committed → 통계 업데이트',
    caveat: '분석 로직이 무거우면 FinishedHeight 보고가 지연되어 프루닝이 밀린다. 비동기 처리 권장.',
    color: '#10b981',
  },
];
