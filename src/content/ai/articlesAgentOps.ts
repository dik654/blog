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
  {
    slug: "cross-review-error-classes",
    title: "검증이 잡아낸 것은 지식이 아니라 비교의 모양이었습니다",
    subcategory: "ai-agents-ops",
    sections: [
      {
        id: "overview",
        title: "틀린 자리가 한 종류에 몰려 있었습니다",
      },
      {
        id: "unit-mismatch",
        title: "유형 1. 두 숫자를 다른 자로 재고 나란히 놓습니다",
      },
      {
        id: "guarantee",
        title: "유형 2. 보장이 아닌 것을 보장으로 적습니다",
      },
      {
        id: "overgeneralization",
        title: "유형 3. 한 사례를 보편 규칙으로 올립니다",
      },
      {
        id: "repeated-fix",
        title: "유형을 다 알아도 고치는 과정에서 새로 생깁니다",
      },
      {
        id: "boundary",
        title: "이것은 모델 비교가 아니고 표본도 하나입니다",
      },
    ],
    component: () => import("@/pages/articles/ai/cross-review-error-classes"),
  },
];
