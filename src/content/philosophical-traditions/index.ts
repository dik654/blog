import type { Category } from "../types";
import { philosophicalTraditionsArticles } from "./articles";

const philosophicalTraditions: Category = {
  slug: "philosophical-traditions",
  name: "사상 전통",
  description: "하나의 서양 철학 연표로 줄이지 않고, 중국·인도·불교·이슬람·아프리카의 서로 다른 질문과 원문을 주제별로 읽습니다.",
  subcategories: [
    { slug: "traditions-confucian", name: "유가의 역할과 예", description: "덕·역할·예가 욕망과 공동 결정을 조정하는 방식", icon: "禮" },
    { slug: "traditions-daoist", name: "도가의 이름과 무위", description: "이름이 만든 구분과 억지 개입의 한계", icon: "道" },
    { slug: "traditions-buddhist", name: "초기 불교의 경험 분석", description: "다섯 집합·무상·무아로 붙잡음을 검사하는 방법", icon: "輪" },
    { slug: "traditions-gita", name: "인도의 행위와 해탈", description: "행위·결과·의무·집착을 나누는 질문", icon: "क" },
    { slug: "traditions-islamic", name: "이슬람 철학의 인과", description: "자연의 규칙·필연성·신의 행위를 둘러싼 논쟁", icon: "ع" },
    { slug: "traditions-akan", name: "아칸의 인격과 공동체", description: "인간으로 태어남과 도덕적 사람됨, 공동체와 행위자성", icon: "◎" },
  ],
  articles: philosophicalTraditionsArticles,
};

export default philosophicalTraditions;
