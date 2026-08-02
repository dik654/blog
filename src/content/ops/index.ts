import type { Category } from '../types';
import { opsArticles } from './articles';

const ops: Category = {
  slug: 'ops',
  name: '운영',
  description: 'CI/CD 보안 · 쿠버네티스 · 노드 운영 · 결제 · 옵저버빌리티 — 운영 관점의 실전 정리',
  group: 'operations',
  subcategories: [
    {
      slug: 'ops-cicd',
      name: 'CI/CD',
      description: '파이프라인 보안, 공급망, 사례 분석',
      icon: '🔁',
    },
    {
      slug: 'ops-k8s',
      name: 'Kubernetes',
      description: '워크로드 격리, StatefulSet, 노드 운영',
      icon: '☸️',
    },
    {
      slug: 'ops-nodes',
      name: 'Node Operations',
      description: '이더리움 EL/CL/VC, Filecoin SP, 슬래싱, DR',
      icon: '🖥️',
    },
    {
      slug: 'ops-payment',
      name: 'Payment',
      description: 'x402 · on-chain micropayment · AI agent 결제',
      icon: '💰',
    },
    {
      slug: 'ops-observability',
      name: 'Observability · Anomaly',
      description: '네트워크 / AI / DB 로그 분석, 이상 감지, 사고 대응',
      icon: '📡',
    },
  ],
  articles: opsArticles,
};

export default ops;
