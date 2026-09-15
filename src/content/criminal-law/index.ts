import type { Category } from "../types";
import { criminalLawArticles } from "./articles";

const criminalLaw: Category = {
  slug: "criminal-law",
  name: "국가가 벌하는 법",
  description:
    "왜 국가가 직접 벌하는지, 그리고 그 힘을 쓰기 전에 무엇을 얼마나 증명하게 하는지",
  subcategories: [
    {
      slug: "crim-punishment",
      name: "범죄와 형벌",
      description: "벌하는 이유와 그 이유가 형량에 대해 말하는 것",
      icon: "🔒",
    },
    {
      slug: "crim-procedure",
      name: "절차와 증명",
      description: "두 종류의 오판이 같은 무게가 아닐 때 문턱을 어디에 두는가",
      icon: "🧾",
    },
  ],
  articles: criminalLawArticles,
};

export default criminalLaw;
