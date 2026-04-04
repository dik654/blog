export const PROTOS = [
  { name: 'PBFT', color: '#ef4444', complexity: 'O(n²)', delays: 5, edges: 6 },
  { name: 'HotStuff', color: '#6366f1', complexity: 'O(n)', delays: 7, edges: 3 },
  { name: 'Autobahn', color: '#10b981', complexity: 'O(n)', delays: 3, edges: 3 },
];

export const STEPS = [
  { label: 'BFT 프로토콜 비교 (n=4)', body: 'PBFT, HotStuff, Autobahn의 메시지 복잡도와 지연 비교' },
  { label: 'PBFT — O(n²) 브로드캐스트', body: '모든 노드가 서로 통신 → 6 연결, View Change O(n³)' },
  { label: 'HotStuff — O(n) 스타 토폴로지', body: '리더 경유 Star → 3 연결, 단 7 message delays' },
  { label: 'Autobahn — O(n) + 최저 지연', body: 'Lanes 분리로 3 delays — Hangover 없이 최저 지연' },
];

export const BAR_MAX = 140;
