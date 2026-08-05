import type { Article } from '../types';

export const agentOpsArticles: Article[] = [
  {
    slug: 'agent-devlog-patterns',
    title: 'Agent 운영 증거: Trace에서 ADR·Lesson까지',
    subcategory: 'ai-agents-ops',
    learningPath: 'ai-agent-ops-evidence',
    summary: '실행 trace와 paired eval을 release record, ADR, 재사용 Lesson으로 승격하되 같은 사실을 복제하지 않고 source ID·version·owner·rollback으로 연결합니다.',
    level: '중급',
    estimatedMinutes: 34,
    prerequisites: ['Agent 실행 trace와 최종 state', '실패 원인과 수정 결과의 차이'],
    sections: [
      { id: 'boundary', title: 'Trace와 결정 기억의 경계' },
      { id: 'evidence-ledger', title: 'Evidence Ledger' },
      { id: 'promotion-rules', title: 'ADR·Lesson 승격 조건' },
      { id: 'worked-incident', title: 'Fail-open 사건 기록' },
      { id: 'release-gate', title: 'Evidence Chain 출시' },
    ],
    component: () => import('@/pages/articles/ai/agent-devlog-patterns'),
  },
];
