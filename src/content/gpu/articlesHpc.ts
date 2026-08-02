import type { Article } from '../types';

export const hpcArticles: Article[] = [
  {
    slug: 'gpu-hpc-from-scratch',
    title: 'GPU HPC 바닥부터: 한 장의 GPU에서 RoCEv2 멀티노드까지',
    subcategory: 'gpu-cluster-hpc',
    summary: 'GPU 서버와 HPC의 차이, scale-up과 scale-out, NCCL·RDMA·RoCEv2·스케줄러의 경계를 한 흐름으로 잇는다.',
    level: '기초',
    estimatedMinutes: 38,
    prerequisites: ['CPU와 GPU가 메모리에서 데이터를 읽어 계산한다는 이해', 'Gbps가 초당 전송 가능한 bit 수라는 이해'],
    learningPath: 'gpu-hpc-current-first',
    sections: [
      { id: 'server-vs-hpc', title: 'GPU 서버 여러 대면 바로 HPC일까?' },
      { id: 'scale-up-out', title: 'GPU는 어디까지 같은 컴퓨터처럼 묶일까?' },
      { id: 'collectives', title: '분산 학습은 무엇을 계속 주고받을까?' },
      { id: 'tcp-rdma', title: '100G와 RoCEv2는 무엇이 다를까?' },
      { id: 'stack-boundaries', title: '하드웨어와 소프트웨어는 어디서 나뉠까?' },
      { id: 'two-node-job', title: '두 노드 학습 작업은 어떤 순서로 살아날까?' },
      { id: 'mig-scheduling', title: 'MIG와 스케줄러는 언제 필요할까?' },
      { id: 'design-checklist', title: '내 클러스터는 무엇부터 설계해야 할까?' },
    ],
    component: () => import('@/pages/articles/gpu/gpu-hpc-from-scratch'),
  },
];
