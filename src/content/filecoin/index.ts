import type { Category } from '../types';

const filecoin: Category = {
  slug: 'filecoin',
  name: 'Filecoin',
  description: '파일코인 합의, 스토리지 증명, 네트워크 프로토콜 학습 노트',
  subcategories: [
    { slug: 'consensus', name: 'Consensus' },
    { slug: 'storage-proof', name: 'Storage Proof' },
    { slug: 'network', name: 'Network' },
  ],
  articles: [
    {
      slug: 'expected-consensus',
      title: 'Expected Consensus',
      subcategory: 'consensus',
      sections: [
        { id: 'sortition', title: 'Poisson Sortition' },
        { id: 'tipset', title: 'Tipset 선택' },
      ],
      component: () => import('@/pages/articles/filecoin/expected-consensus'),
    },
    {
      slug: 'bittorrent',
      title: 'BitTorrent 아키텍처',
      subcategory: 'network',
      sections: [
        { id: 'overview', title: '개요' },
        { id: 'architecture', title: '아키텍처' },
      ],
      component: () => import('@/pages/articles/filecoin/bittorrent'),
    },
  ],
};

export default filecoin;
