import { defineArticleFlow } from "@/components/viz/article-flow";

export const STEPS = defineArticleFlow([
  {
    id: "structured-interfaces",
    stage: "background",
    label: "LLM 출력이 JSON·tool call·program의 입력이 된다",
    body: "사람이 읽는 문장뿐 아니라 downstream system이 parse하는 구조가 필요합니다.",
  },
  {
    id: "prompt-only",
    stage: "problem",
    label: "문제: prompt는 잘못된 token을 금지하지 못한다",
    body: "형식 지시를 이해해도 괄호·type·여분 문장에서 실패할 수 있습니다.",
  },
  {
    id: "parser-in-loop",
    stage: "idea",
    label: "아이디어: parser state를 generation loop에 넣는다",
    body: "현재 prefix에서 문법상 이어질 수 있는 continuation을 매 step 계산합니다.",
  },
  {
    id: "token-mask",
    stage: "implementation",
    label: "구현: tokenizer별 grammar를 compile해 logits를 mask한다",
    body: "금지 token 확률을 0으로 만들고 선택한 token으로 matcher state를 갱신합니다.",
  },
]);
