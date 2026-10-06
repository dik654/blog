import type { Category } from "../types";
import { philosophyOfScienceArticles } from "./articles";

const philosophyOfScience: Category = {
  slug: "philosophy-of-science",
  name: "과학철학",
  description: "관측과 모형이 예측·인과·설명 가운데 무엇을 뒷받침하는지 구분합니다.",
  subcategories: [{ slug: "philosophy-of-science-explanation", name: "증거와 설명", description: "같은 예측을 만드는 경쟁 모형과 인과 주장을 검사합니다.", icon: "∵" }],
  articles: philosophyOfScienceArticles,
};
export default philosophyOfScience;
