import type { Category } from "../types";
import { institutionsArticles } from "./articles";

const institutions: Category = {
  slug: "institutions",
  name: "나라와 제도의 장부",
  description: "보험·의료·인구·돌봄·교육·문화·정보를 살피고, 근거와 국가별 자료를 같은 질문으로 비교합니다.",
  subcategories: [
    { slug: "institutions-risk", name: "위험과 돌봄", description: "보험과 의료비가 모이고 지급되는 방식", icon: "🏥" },
    { slug: "institutions-capacity", name: "사람의 역량", description: "인구와 돌봄, 교육과 근거를 읽는 능력", icon: "🎓" },
    { slug: "institutions-country", name: "국가 읽기", description: "나라가 달라도 통하는 비교 질문", icon: "🌍" },
  ],
  articles: institutionsArticles,
};

export default institutions;
