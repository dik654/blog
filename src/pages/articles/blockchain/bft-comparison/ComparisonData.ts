export const CELL = 'border border-border px-3 py-2';

export const TABLE_ROWS = [
  { attr: '년도', pbft: '1999', hotstuff: '2019', autobahn: '2024', casper: '2020' },
  { attr: '정상 경로 복잡도', pbft: 'O(n²)', hotstuff: 'O(n)', autobahn: 'O(n)', casper: 'O(n) 위원회' },
  { attr: 'View Change', pbft: 'O(n³)', hotstuff: 'O(n)', autobahn: 'O(n)', casper: 'N/A (fork choice)' },
  { attr: '커밋 지연', pbft: '5 delays', hotstuff: '7 delays', autobahn: '3 delays (fast)', casper: '~12.8분' },
  { attr: '최종성', pbft: '즉시', hotstuff: '즉시', autobahn: '즉시', casper: '지연 (2 에폭)' },
  { attr: '장애 복구', pbft: '느림 (hangover)', hotstuff: '느림 (hangover)', autobahn: '빠름 (no hangover)', casper: '자동 (fork choice)' },
  { attr: '검증자 확장성', pbft: '~20', hotstuff: '~100', autobahn: '~100', casper: '~1,000,000+' },
  { attr: '채택 사례', pbft: 'Hyperledger', hotstuff: 'Diem, Aptos', autobahn: 'Sei Giga', casper: '이더리움' },
] as const;

export const TRADEOFFS = [
  {
    title: '💡 Safety vs Liveness 우선순위',
    body: 'BFT는 Safety 우선(멈춤), 이더리움은 Liveness 우선(포크 허용)',
  },
  {
    title: '💡 검증자 수 vs 최종성 속도',
    body: 'BFT: 소수 검증자 + 즉시 최종성 / 이더리움: 대규모 참여 + 지연된 최종성',
  },
] as const;
