import type { Category } from '../types';
import { p2pArticles } from './articles';
import { p2pArticles2 } from './articles2';

const p2p: Category = {
  slug: 'p2p',
  name: 'P2P / Networking',
  description: 'P2P 프로토콜, 콘텐츠 주소, DHT, 분산 전송 학습 노트',
  subcategories: [
    { slug: 'p2p-fundamentals', name: 'Fundamentals', description: 'P2P 네트워크 기초, 토폴로지, 라우팅', icon: '🌐' },
    { slug: 'p2p-discovery', name: 'DHT & Discovery', description: 'Kademlia DHT, 피어 탐색 프로토콜', icon: '🔍' },
    {
      slug: 'p2p-transport',
      name: 'Transport & Connectivity',
      description: '전송 계층, NAT 우회, 멀티플렉싱',
      icon: '🔀',
      children: [
        { slug: 'p2p-libp2p', name: 'libp2p', description: '모듈형 P2P 네트워킹 프레임워크', icon: '🧩' },
        { slug: 'p2p-bittorrent', name: 'BitTorrent', description: '파일 공유, 피스 교환, 트래커 프로토콜', icon: '🌊' },
        { slug: 'p2p-iroh', name: 'Iroh (QUIC P2P)', description: 'QUIC 기반 고성능 P2P 전송', icon: '⚡' },
        { slug: 'p2p-ipfs', name: 'IPFS', description: 'CID, Merkle DAG, 콘텐츠 주소 기반 저장 & 구현체', icon: '🏷️' },
      ],
    },
  ],
  articles: [...p2pArticles, ...p2pArticles2],
};

export default p2p;
