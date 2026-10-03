import type { Category } from "../types";
import { institutionsArticles } from "./articles";

const institutions: Category = {
  slug: "institutions",
  name: "나라와 제도의 장부",
  description: "보험·의료·예산·교육·정보와 국가별 권리·생산을 같은 질문으로 비교합니다.",
  subcategories: [
    { slug: "institutions-risk", name: "위험과 돌봄", description: "보험과 의료비가 모이고 지급되는 방식", icon: "🏥" },
    { slug: "institutions-capacity", name: "사람의 역량", description: "교육비와 기술·자격의 효과", icon: "🎓" },
    { slug: "institutions-country", name: "국가 읽기", description: "나라가 달라도 통하는 비교 질문", icon: "🌍" },
  ],
  articles: institutionsArticles,
};

export default institutions;
