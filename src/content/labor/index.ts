import type { Category } from "../types";
import { laborArticles } from "./articles";

const labor: Category = {
  slug: "labor",
  name: "일하는 사람의 몫",
  description:
    "값이 조정한다는 설명을 사람이 파는 시간에 적용하면 어디까지 맞고 어디서부터 어긋나는지, 그리고 그렇게 정해진 몫들이 사람 사이에서 어떻게 벌어지는지",
  subcategories: [
    {
      slug: "wage-formation",
      name: "임금이 정해지는 자리",
      description:
        "사는 쪽이 여럿일 때와 하나일 때 임금이 어디서 멈추는지, 그리고 그 예측을 실제로 재 본 결과",
      icon: "⏱️",
    },
    {
      slug: "distribution",
      name: "몫이 벌어지는 자리",
      description: "같은 방식으로 정해진 몫들이 사람 사이에서 어떻게 갈리는지",
      icon: "📐",
    },
  ],
  articles: laborArticles,
};

export default labor;
