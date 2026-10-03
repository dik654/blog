import type { Category } from "../types";
import { semiconductorArticles } from "./articles";

const semiconductors: Category = {
  slug: "semiconductors",
  name: "반도체와 공정",
  description: "전자가 움직일 수 있는 상태에서 시작해 불순물, 접합, 제조 공정과 칩의 한계로 이어갑니다.",
  subcategories: [
    { slug: "semiconductor-physics", name: "재료의 전기적 성질", description: "에너지 상태와 도핑이 전자·정공의 수를 어떻게 바꾸는지 셉니다.", icon: "◈" },
  ],
  articles: semiconductorArticles,
};

export default semiconductors;
