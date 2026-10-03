import type { Category } from "../types";
import { marketsArticles } from "./articles";

const markets: Category = {
  slug: "markets",
  name: "시장과 가격",
  description:
    "채권·주식·펀드·ETF·ETN과 파생상품의 청구권과 위험 이전을 현금흐름으로 읽습니다.",
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
    {
      slug: "markets-products",
      name: "펀드와 상장 상품",
      description: "펀드 지분·ETF 가격·ETN 발행자 채무",
      icon: "🧺",
    },
    {
      slug: "markets-derivatives",
      name: "파생상품",
      description: "선도·선물·옵션·스왑의 지급과 위험 이전",
      icon: "🔀",
    },
  ],
  articles: marketsArticles,
};

export default markets;
