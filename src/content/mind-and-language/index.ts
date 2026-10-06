import type { Category } from "../types";
import { mindAndLanguageArticles } from "./articles";

const mindAndLanguage: Category = {
  slug: "mind-and-language",
  name: "마음과 언어",
  description: "겉으로 드러난 행동, 기호 처리, 의미 이해와 의식을 같은 말로 뭉치지 않고 검사합니다.",
  subcategories: [{ slug: "mind-and-language-ai", name: "기계와 이해", description: "행동 검사와 의미 이해에 대한 경쟁 주장을 비교합니다.", icon: "◎" }],
  articles: mindAndLanguageArticles,
};
export default mindAndLanguage;
