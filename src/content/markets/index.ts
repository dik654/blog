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
      name: "금융상품과 청구권",
      description: "상품별 지급 권리·펀드·ETF·ETN·유동화 손실 순서",
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
