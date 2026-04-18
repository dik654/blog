import type { Article } from '../types';

export const agentOpsArticles: Article[] = [
  {
    slug: 'agent-devlog-patterns',
    title: '에이전트 개발 로그 패턴: Changelog, ADR, Lessons',
    subcategory: 'ai-agents-ops',
    sections: [
      { id: 'overview', title: '왜 git log만으로 부족한가' },
      { id: 'changelog', title: 'Changelog — 시간순 단일 파일' },
      { id: 'adr', title: 'ADR — 결정의 근거 기록' },
      { id: 'lessons', title: 'Lessons — 주제별 원칙 저장소' },
      { id: 'three-layers', title: '세 층의 역할 분담과 유지 규칙' },
    ],
    component: () => import('@/pages/articles/ai/agent-devlog-patterns'),
  },
];
