import type { Category } from '../types';

const gpu: Category = {
  slug: 'gpu',
  name: 'HW / GPU',
  description: 'GPU 컴퓨팅, CUDA, 하드웨어 가속 학습 노트',
  subcategories: [
    { slug: 'gpu-fundamentals', name: 'Fundamentals' },
    { slug: 'gpu-blockchain', name: 'Blockchain Acceleration' },
  ],
  articles: [
    {
      slug: 'cuda-basics',
      title: 'CUDA 기초 (GPU 병렬처리와 블록체인)',
      subcategory: 'gpu-fundamentals',
      sections: [
        { id: 'overview', title: 'CUDA 기초 & 블록체인 활용' },
        { id: 'memory-model', title: '메모리 계층 & 최적화' },
        { id: 'blockchain-gpu', title: '블록체인 GPU 가속 실전' },
      ],
      component: () => import('@/pages/articles/blockchain/cuda-basics'),
    },
    {
      slug: 'filecoin-gpu-proofs',
      title: 'Filecoin 증명 GPU 가속 (bellperson, sppark)',
      subcategory: 'gpu-blockchain',
      sections: [
        { id: 'overview', title: '증명 시스템 & GPU 가속 개요' },
        { id: 'gpu-acceleration', title: 'GPU 가속 라이브러리 & 구현' },
      ],
      component: () => import('@/pages/articles/blockchain/filecoin-gpu-proofs'),
    },
  ],
};

export default gpu;
