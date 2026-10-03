import type { Category } from "../types";
import { businessArticles } from "./articles";

const business: Category = {
  slug: "business",
  name: "사업의 돈과 권한",
  description: "매출 뒤의 현금·고정비·브랜드·공급망을 실제 장부와 계약으로 읽습니다.",
  subcategories: [
    { slug: "business-cash", name: "사업 장부", description: "돈을 먼저 내고 나중에 받는 구조", icon: "🧾" },
    { slug: "business-network", name: "사업 관계", description: "브랜드·가맹점·공급망의 협상력", icon: "🔗" },
  ],
  articles: businessArticles,
};

export default business;
