import type { Article } from "../types";

export const agentOpsArticles: Article[] = [
  {
    slug: "agent-devlog-patterns",
    title: "에이전트 개발 기록: Changelog·ADR·Lessons",
    subcategory: "ai-agents-ops",
    sections: [
      { id: "overview", title: "Evidence와 문서 소유권" },
      { id: "changelog", title: "Changelog: 검증된 변화" },
      { id: "adr", title: "ADR: 선택과 Trade-off" },
      { id: "lessons", title: "Lessons: 재사용할 원칙" },
      { id: "three-layers", title: "작성·조회·승격 흐름" },
    ],
    component: () => import("@/pages/articles/ai/agent-devlog-patterns"),
  },
];
