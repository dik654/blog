import { defineArticleFlow } from "@/components/viz/article-flow";

export const STEPS = defineArticleFlow([
  {
    id: "tool-capable-agent",
    stage: "background",
    label: "모델은 외부 tool로 실제 데이터를 다룬다",
    body: "MCP와 function calling은 모델의 판단을 API 실행으로 연결합니다.",
  },
  {
    id: "round-trip-pressure",
    stage: "problem",
    label: "문제: 반복 호출과 중간 결과가 context를 키운다",
    body: "loop마다 schema와 결과가 모델로 돌아오면 token·latency·오류 지점이 누적됩니다.",
  },
  {
    id: "program-as-plan",
    stage: "idea",
    label: "아이디어: tool workflow를 program으로 표현한다",
    body: "반복·분기·병렬 처리와 데이터 가공을 일반 runtime이 결정적으로 수행합니다.",
  },
  {
    id: "sandboxed-capabilities",
    stage: "implementation",
    label: "구현: typed tool을 sandbox에 묶고 결과만 반환한다",
    body: "발견한 API만 capability로 제공하고 시간·출력·effect를 제한합니다.",
  },
]);
