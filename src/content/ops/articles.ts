import type { Article } from '../types';

export const opsArticles: Article[] = [
  {
    slug: 'cicd-pipeline-security',
    title: 'CI/CD 파이프라인 보안 — 표준 워크플로우 + GitHub RCE 사례',
    subcategory: 'ops-cicd',
    sections: [
      { id: 'cicd-foundations', title: 'A. 기초 개념' },
      { id: 'cicd-workflow', title: '표준 워크플로우 (10 단계)' },
      { id: 'cicd-security', title: '사고 사례 + 공급망 게이트' },
    ],
    component: () => import('@/pages/articles/ops/cicd-pipeline-security'),
  },
  {
    slug: 'k8s-node-management',
    title: '쿠버네티스 노드 운영 — 표준 워크플로우 + StatefulSet · etcd',
    subcategory: 'ops-k8s',
    sections: [
      { id: 'k8s-foundations', title: 'B. 기초 개념' },
      { id: 'k8s-workflow', title: '표준 워크플로우 (11 단계)' },
      { id: 'k8s-isolation', title: '격리 · etcd · 사고 카탈로그' },
    ],
    component: () => import('@/pages/articles/ops/k8s-node-management'),
  },
  {
    slug: 'cicd-k8s-eth-nodes',
    title: '이더리움 노드·검증자 운영 — 표준 워크플로우 + 슬래싱·DR',
    subcategory: 'ops-nodes',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'eth-workflow', title: '표준 워크플로우 (검증자 추가 11 단계)' },
      { id: 'eth-nodes', title: '이더리움 노드 운영 (EL · CL · VC)' },
      { id: 'slashing-dr', title: '슬래싱 · 클라이언트 다양성 · DR' },
    ],
    component: () => import('@/pages/articles/ops/cicd-k8s-eth-nodes'),
  },
  {
    slug: 'filecoin-storage-ops',
    title: 'Filecoin Storage Provider 운영 — 표준 워크플로우 + Sealing · Groth16 · PoSt',
    subcategory: 'ops-nodes',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'sp-workflow', title: '표준 워크플로우 (SP 부트스트랩 11 단계)' },
      { id: 'sealing', title: '봉인 파이프라인 (PC1·PC2·C1·C2)' },
      { id: 'ssd-storage', title: 'SSD 마모와 스토리지 계층' },
      { id: 'post-incidents', title: 'PoSt 운영과 사고 시나리오' },
    ],
    component: () => import('@/pages/articles/ops/filecoin-storage-ops'),
  },
  {
    slug: 'x402-payment',
    title: 'x402 — HTTP 402 + 온체인 micropayment (AI 에이전트 결제)',
    subcategory: 'ops-payment',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'protocol', title: '프로토콜 (HTTP 402 + EIP-3009)' },
      { id: 'operations', title: '운영 (facilitator · 가격 · 보안)' },
    ],
    component: () => import('@/pages/articles/ops/x402-payment'),
  },
  {
    slug: 'network-log-anomaly',
    title: '네트워크 로그 이상 감지 — DDoS · exfiltration · C2 · cryptojacking',
    subcategory: 'ops-observability',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'detection', title: '로그 수집 + baseline 학습' },
      { id: 'patterns', title: '실전 사고 패턴 카탈로그' },
    ],
    component: () => import('@/pages/articles/ops/network-log-anomaly'),
  },
  {
    slug: 'ai-log-anomaly',
    title: 'AI 에이전트 / LLM 로그 이상 감지',
    subcategory: 'ops-observability',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'detection', title: '로그 수집 + 검출 방법' },
      { id: 'agent-safety', title: 'Prompt injection · Agent loop · Tool 오용' },
    ],
    component: () => import('@/pages/articles/ops/ai-log-anomaly'),
  },
  {
    slug: 'data-log-analysis',
    title: 'DB · 로그 직접 분석 — SQL · jq · LLM trace · 네트워크 분석',
    subcategory: 'ops-observability',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'sql-patterns', title: 'SQL 분석 패턴 (window · CTE · explain)' },
      { id: 'log-tooling', title: '로그 도구 (jq · ripgrep · LogQL)' },
      { id: 'scenarios', title: '실전 분석 시나리오 5 종' },
    ],
    component: () => import('@/pages/articles/ops/data-log-analysis'),
  },
];
