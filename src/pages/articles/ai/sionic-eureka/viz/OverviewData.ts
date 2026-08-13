import { defineArticleFlow } from "@/components/viz/article-flow";

export const STEPS = defineArticleFlow([
  {
    id: "retrieval-reality",
    stage: "background",
    label: "검색은 언어·도메인·길이·질의 형태가 함께 바뀐다",
    body: "한 문장 답변부터 장문, factoid부터 분석형 질의까지 같은 공간에서 다뤄야 합니다.",
  },
  {
    id: "shortcut",
    stage: "problem",
    label: "편향된 학습쌍은 위치·형식·1:1 대응이라는 지름길을 만든다",
    body: "쉬운 negative와 누락된 positive까지 더해지면 특정 조건의 점수만 높은 retriever가 됩니다.",
  },
  {
    id: "data-distribution",
    stage: "idea",
    label: "robustness를 데이터 분포와 후보 순위 supervision으로 설계한다",
    body: "쿼리 다양성, answer position, multi-positive와 positive-aware mining을 명시적 축으로 둡니다.",
  },
  {
    id: "distill-evaluate",
    stage: "implementation",
    label: "scalar teacher score를 저장하고 동일 후보군에서 student를 평가한다",
    body: "여섯 단계 artifact와 slice별 평가를 남겨 새로운 도메인도 같은 계약으로 추가합니다.",
  },
]);
