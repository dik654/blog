import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { SimpleStepItem } from '@/components/viz/SimpleStepViz';

const STEPS = [
  { label: 'mDNS — RFC 6762' },
  { label: 'Kademlia DHT — global' },
  { label: 'Rendezvous Protocol' },
  { label: 'Bootstrap Nodes' },
  { label: 'Peer Exchange (PEX)' },
  { label: '실전 조합 — IPFS / Eth2' },
];

const VISUALS: SimpleStepItem[] = [
  {
    title: 'mDNS (Multicast DNS)',
    color: '#10b981',
    rows: [
      { label: '용도', value: 'LAN 내 zero-config discovery' },
      { label: '방법', value: 'UDP multicast 224.0.0.251:5353' },
      { label: 'Service', value: '"_p2p._udp.local" 쿼리 + 응답' },
      { label: '장점', value: '자동 설정, bootstrap 불필요' },
      { label: '제한', value: 'LAN 만 (multicast 범위), 방화벽 차단' },
      { label: '용처', value: 'Dev environment, IoT 메시 친화' },
    ],
  },
  {
    title: 'Kademlia DHT',
    color: '#6366f1',
    rows: [
      { label: '구조', value: 'XOR 기반 distance metric' },
      { label: '조회', value: 'iterative FIND_NODE' },
      { label: 'Random walk', value: '주기적 임의 키 조회' },
      { label: 'Provider', value: 'Provider records (content routing)' },
      { label: '복잡도', value: 'O(log n) lookup, k-bucket per prefix' },
      { label: '의존', value: 'Bootstrap peers 필요 — DHT 진입점' },
    ],
  },
  {
    title: 'Rendezvous Protocol',
    color: '#ec4899',
    rows: [
      { label: '구조', value: 'Named meeting points (server)' },
      { label: 'REGISTER', value: '"나 여기 있어" — topic + multiaddr' },
      { label: 'DISCOVER', value: '"X 찾아줘" — topic match' },
      { label: '의존', value: '중앙 server 필요 (rendezvous node)' },
      { label: '용도', value: 'App-specific peers, private network' },
      { label: '예시', value: 'Berty, IPFS private cluster' },
    ],
  },
  {
    title: 'Bootstrap Nodes',
    color: '#f59e0b',
    rows: [
      { label: '구조', value: 'Hard-coded reliable peers' },
      { label: '저장', value: 'config 파일에 multiaddr list' },
      { label: '용도', value: '첫 연결 + 다른 peer entry point' },
      { label: '특징', value: '가장 간단한 발견 메커니즘' },
      { label: '단점', value: '중앙화 (vendor 지정)' },
      { label: '필수', value: 'DHT 시작점으로 거의 항상 사용' },
    ],
  },
  {
    title: 'Peer Exchange (PEX)',
    color: '#8b5cf6',
    rows: [
      { label: '원리', value: '연결된 peer 가 자기 peer list 공유' },
      { label: '전파', value: 'transitive — peer-of-peer 발견' },
      { label: '내장', value: 'GossipSub v1.1 X (peer exchange)' },
      { label: '효과', value: 'DHT 보완, organic spreading' },
      { label: '보안', value: 'acceptPXThreshold 점수 이상만 수용' },
      { label: '예시', value: 'BitTorrent PEX, Eth2 GossipSub PX' },
    ],
  },
  {
    title: '실전 Discovery 조합',
    color: '#0ea5e9',
    rows: [
      { label: 'IPFS', value: 'Bootstrap → Kademlia → mDNS' },
      { label: 'Ethereum 2.0', value: 'discv5 + GossipSub PX + ENR filter' },
      { label: 'Filecoin', value: 'Kademlia + DHT-based content routing' },
      { label: 'Polkadot', value: 'Bootstrap + Kademlia + mDNS (LAN)' },
      { label: '핵심 원칙', value: 'cold-start + censorship resistance 양립' },
      { label: 'Behaviour', value: 'libp2p-mdns/-kad/-rendezvous/-relay/-autonat' },
    ],
  },
];

export default function DiscoveryMechanismDetailViz() {
  return <SimpleStepViz steps={STEPS} visuals={VISUALS} />;
}
