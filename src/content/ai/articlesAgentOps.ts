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
  {
    "id": "overview",
    "title": "1. 무엇이 달라졌는지 사용자가 확인할 수 있어야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 변화의 영향과 검사와 공개 상태를 잇습니다"
  },
  {
    "id": "small-case",
    "title": "3. 빈 결과가 기존 기록 12개를 지웠습니다"
  },
  {
    "id": "inside-entry",
    "title": "4. 결과 문장 뒤에 검사와 공개 위치를 둡니다"
  },
  {
    "id": "why-entry",
    "title": "5. 수정 횟수보다 실제 동작의 변화가 필요합니다"
  },
  {
    "id": "entry-terms",
    "title": "6. 변경 항목과 공개 상태의 이름을 붙입니다"
  },
  {
    "id": "publication",
    "title": "7. 검사 4개가 끝나도 아직 Unreleased일 수 있습니다"
  },
  {
    "id": "entry-source",
    "title": "8. 공식 예시의 Unreleased와 Fixed에 같은 변화를 넣습니다"
  },
  {
    "id": "links",
    "title": "9. 상세 자료를 옮겨도 같은 검사로 돌아가야 합니다"
  },
  {
    "id": "entry-limits",
    "title": "10. 통과한 네 가지 조건 밖의 안정성은 따로 봅니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 검사와 공개 상태를 구분할 수 있나요"
  }
],
    component: () => import("@/pages/articles/ai/agent-changelog-evidence"),
  },
  {
    slug: "architecture-decision-records",
    title: "ADR: 선택의 이유와 대가를 보존하기",
    subcategory: "ai-agents-ops",
    sections: [
  {
    "id": "overview",
    "title": "1. 파일을 나눈 이유가 다음 담당자에게도 보여야 합니다"
  },
  {
    "id": "black-box",
    "title": "2. 조건을 비교한 뒤 선택과 후속 비용을 남깁니다"
  },
  {
    "id": "small-case",
    "title": "3. 200개 설정 중 1개만 복구하고 싶습니다"
  },
  {
    "id": "inside-decision",
    "title": "4. 한 프로필의 복구와 여러 프로필의 갱신을 나눠 봅니다"
  },
  {
    "id": "why-record",
    "title": "5. 결론만 남기면 조건이 바뀐 사실을 놓칩니다"
  },
  {
    "id": "decision-terms",
    "title": "6. 선택을 보존하는 기록의 이름을 붙입니다"
  },
  {
    "id": "drivers",
    "title": "7. 같은 기준으로 세 대안을 비교해 ADR-005를 씁니다"
  },
  {
    "id": "source-template",
    "title": "8. 원문의 다섯 필드를 실제 선택에 대응합니다"
  },
  {
    "id": "supersession",
    "title": "9. 동시 쓰기가 늘면 ADR-006으로 다시 판단합니다"
  },
  {
    "id": "decision-limits",
    "title": "10. 문서 채택과 복구 가능성은 각각 확인합니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 조건이 바뀌면 기록의 어느 부분을 보나요"
  }
],
    component: () => import("@/pages/articles/ai/architecture-decision-records"),
  },
  {
    slug: "engineering-lessons-ledger",
    title: "Engineering Lessons: 사건을 실행 가능한 규칙으로",
    subcategory: "ai-agents-ops",
    sections: [
  {
    "id": "overview",
    "title": "1. 한 번의 손실에서 다음 작업의 규칙을 만듭니다"
  },
  {
    "id": "black-box",
    "title": "2. 사건의 근거를 좁은 규칙과 검사로 바꿉니다"
  },
  {
    "id": "small-case",
    "title": "3. 기록 12개를 0개로 바꾼 두 상황을 구분합니다"
  },
  {
    "id": "inside-rule",
    "title": "4. 실행 경로와 의도와 확인된 결과를 함께 봅니다"
  },
  {
    "id": "why-exceptions",
    "title": "5. 모든 빈 결과를 막으면 정상 삭제도 실패합니다"
  },
  {
    "id": "lesson-terms",
    "title": "6. 사건 기록과 현재 행동 규칙에 이름을 붙입니다"
  },
  {
    "id": "scope-test",
    "title": "7. 같은 4가지 검사에서 보존과 교체와 삭제를 나눕니다"
  },
  {
    "id": "postmortem",
    "title": "8. 원문의 사건 항목을 사례와 후속 조치에 적용합니다"
  },
  {
    "id": "provisional",
    "title": "9. 한 사건이면 범위를 좁힌 잠정 규칙부터 둡니다"
  },
  {
    "id": "lesson-limits",
    "title": "10. 검사 개수와 사건의 수만으로 보편성을 판단하지 않습니다"
  },
  {
    "id": "prediction-questions",
    "title": "11. 같은 결과 숫자에서 다른 행동을 고를 수 있나요"
  }
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
