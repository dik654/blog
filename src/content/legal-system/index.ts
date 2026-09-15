import type { Category } from "../types";
import { legalSystemArticles } from "./articles";

const legalSystem: Category = {
  slug: "legal-system",
  name: "법이 작동하는 방식",
  description:
    "어떤 규범이 법이 되는지, 적힌 문장이 개별 사안의 판단이 되기까지 무엇이 개입하는지",
  subcategories: [
    {
      slug: "ls-validity",
      name: "효력의 근거",
      description: "무엇이 이 규범을 법으로 만드는가",
      icon: "⚖️",
    },
    {
      slug: "ls-interpretation",
      name: "해석과 변화",
      description: "적힌 문장과 실제 판단 사이를 잇는 방법과 그 축적",
      icon: "📖",
    },
  ],
  articles: legalSystemArticles,
};

export default legalSystem;
