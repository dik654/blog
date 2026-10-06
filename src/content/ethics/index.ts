import type { Category } from "../types";
import { ethicsArticles } from "./articles";

const ethics: Category = {
  slug: "ethics",
  name: "행위 판단",
  description: "결과, 지켜야 할 원칙, 어떤 사람이 되는지를 한 결정 위에서 비교합니다.",
  subcategories: [{ slug: "ethics-action", name: "선택의 세 기준", description: "일상적인 안전 결정을 세 윤리 관점으로 검사합니다.", icon: "⚖" }],
  articles: ethicsArticles,
};
export default ethics;
