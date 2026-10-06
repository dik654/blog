import type { Category } from "../types";
import { politicalPhilosophyArticles } from "./articles";

const politicalPhilosophy: Category = {
  slug: "political-philosophy",
  name: "정치철학",
  description: "규칙과 강제력이 정당해지는 조건을 동의·자유·권리·공공의 이유로 검사합니다.",
  subcategories: [{ slug: "political-philosophy-legitimacy", name: "권력의 정당성", description: "동의와 해악을 기준으로 강제력의 한계를 묻습니다.", icon: "§" }],
  articles: politicalPhilosophyArticles,
};
export default politicalPhilosophy;
