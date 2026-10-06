import type { Category } from "../types";
import { reasoningArticles } from "./articles";

const reasoning: Category = {
  slug: "reasoning",
  name: "논증과 반례",
  description: "전제가 참인지와 결론이 따라오는지를 나누고, 작은 반례로 추론의 빈틈을 찾습니다.",
  subcategories: [{ slug: "reasoning-arguments", name: "논증 검사", description: "주장의 구조와 반례를 가장 작은 사례로 익힙니다.", icon: "↳" }],
  articles: reasoningArticles,
};
export default reasoning;
