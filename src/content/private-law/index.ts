import type { Category } from "../types";
import { privateLawArticles } from "./articles";

const privateLaw: Category = {
  slug: "private-law",
  name: "사람 사이의 법",
  description:
    "약속과 소유와 사고라는 세 가지 관계에서 법이 무엇을 정하고 무엇을 값으로 치르는지",
  subcategories: [
    {
      slug: "priv-contract",
      name: "계약",
      description: "어떤 약속을 법이 지켜 주고, 어겼을 때 무엇을 물리는가",
      icon: "🤝",
    },
    {
      slug: "priv-property",
      name: "재산",
      description: "소유가 주는 것과, 동의 없이 옮길 수 있는 경우",
      icon: "🏷️",
    },
    {
      slug: "priv-tort",
      name: "불법행위",
      description: "사고의 비용을 누구에게 지우는가",
      icon: "⚠️",
    },
  ],
  articles: privateLawArticles,
};

export default privateLaw;
