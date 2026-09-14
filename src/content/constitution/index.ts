import type { Category } from "../types";
import { constitutionArticles } from "./articles";

const constitution: Category = {
  slug: "constitution",
  name: "헌정과 정부 형태",
  description:
    "모아 준 힘이 마음대로 쓰이지 않게 묶는 장치와, 그 힘을 기관들에 나누는 서로 다른 방식",
  subcategories: [
    {
      slug: "const-limits",
      name: "권력을 묶는 장치",
      description: "헌정주의·권력분립·위헌심사가 각각 무엇을 막는가",
      icon: "⚖️",
    },
    {
      slug: "const-forms",
      name: "정부 형태",
      description: "대통령제와 의원내각제가 무엇을 다르게 배분하는가",
      icon: "🏢",
    },
  ],
  articles: constitutionArticles,
};

export default constitution;
