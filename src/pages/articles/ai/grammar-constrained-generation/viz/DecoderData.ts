import { defineNarrativeFlow } from "@/components/viz/narrative-flow";

export const STEPS = defineNarrativeFlow([
  {
    label: "Schema·EBNF·regex",
    body: "허용할 출력 구조를 선언합니다.",
  },
  {
    label: "Tokenizer-aware compile",
    body: "문자 규칙을 모델 vocabulary와 연결한 상태·cache로 바꿉니다.",
  },
  {
    label: "Matcher state",
    body: "생성된 prefix와 중첩 stack을 추적합니다.",
  },
  {
    label: "Token bitmask",
    body: "다음 step에서 가능한 vocabulary 항목만 1로 남깁니다.",
  },
  {
    label: "Logits → sampling",
    body: "금지 항목을 −∞로 만든 뒤 다음 token을 선택합니다.",
  },
  {
    label: "Accept token",
    body: "선택한 token으로 matcher를 갱신하고 반복합니다.",
  },
]);
