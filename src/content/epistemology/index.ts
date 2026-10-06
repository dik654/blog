import type { Category } from "../types";
import { epistemologyArticles } from "./articles";

const epistemology: Category = {
  slug: "epistemology",
  name: "지식과 정당화",
  description: "믿음이 참이고 근거가 있어도 우연히 맞은 경우가 왜 지식이 아닌지 살펴봅니다.",
  subcategories: [{ slug: "epistemology-knowledge", name: "안다는 것", description: "참·믿음·근거와 우연의 관계를 검사합니다.", icon: "?" }],
  articles: epistemologyArticles,
};
export default epistemology;
