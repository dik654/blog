import type { Article } from "../types";

export const agentOpsArticles: Article[] = [
  {
    slug: "agent-devlog-patterns",
    title: "개발 기록 라우팅: Evidence에서 정본 문서까지",
    subcategory: "ai-agents-ops",
    sections: [
      { id: "overview", title: "Evidence와 Claim" },
      { id: "question-owner", title: "질문별 정본" },
      { id: "promotion", title: "조건부 승격" },
      { id: "agent-review", title: "Agent 초안 검토" },
    ],
    component: () => import("@/pages/articles/ai/agent-devlog-patterns"),
  },
  {
    slug: "agent-changelog-evidence",
    title: "Changelog: 검증된 변화를 공개하는 법",
    subcategory: "ai-agents-ops",
    sections: [
      { id: "overview", title: "Changelog Entry" },
      { id: "notability", title: "Notable 변화" },
      { id: "publication", title: "검증과 공개 상태" },
      { id: "links", title: "근거 링크" },
    ],
    component: () => import("@/pages/articles/ai/agent-changelog-evidence"),
  },
  {
    slug: "architecture-decision-records",
    title: "ADR: 선택의 이유와 대가를 보존하기",
    subcategory: "ai-agents-ops",
    sections: [
      { id: "overview", title: "Decision Record" },
      { id: "drivers", title: "Decision Driver" },
      { id: "status", title: "Accepted와 Implemented" },
      { id: "supersession", title: "Supersession" },
    ],
    component: () => import("@/pages/articles/ai/architecture-decision-records"),
  },
  {
    slug: "engineering-lessons-ledger",
    title: "Engineering Lessons: 사건을 실행 가능한 규칙으로",
    subcategory: "ai-agents-ops",
    sections: [
      { id: "overview", title: "Reusable Lesson" },
      { id: "scope-test", title: "Scope·Exception·Test" },
      { id: "provisional", title: "Provisional Lesson" },
      { id: "postmortem", title: "Postmortem 경계" },
    ],
    component: () => import("@/pages/articles/ai/engineering-lessons-ledger"),
  },
];
