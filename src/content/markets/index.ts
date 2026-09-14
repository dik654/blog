import type { Category } from "../types";
import { marketsArticles } from "./articles";

const markets: Category = {
  slug: "markets",
  name: "시장과 가격",
  description:
    "채권과 주식이 각각 어떤 청구권이고, 그 값이 어떤 계산으로 정해지는가",
  subcategories: [
    {
      slug: "markets-bond",
      name: "채권",
      description: "현금흐름 할인·만기수익률·듀레이션과 수익률 곡선",
      icon: "📉",
    },
    {
      slug: "markets-equity",
      name: "주식",
      description: "잔여청구권·자본구조·배당할인과 기업가치",
      icon: "📈",
    },
  ],
  articles: marketsArticles,
};

export default markets;
