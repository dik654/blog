import type { Category } from "../types";
import { economicHistoryArticles } from "./articles";

const economicHistory: Category = {
  slug: "economic-history",
  name: "경제사",
  description: "생산물을 세고 나누던 장부에서 산업화와 국제 통화 질서까지, 제도가 다음 선택을 만든 순서로 읽습니다.",
  subcategories: [
    { slug: "economic-history-early-state", name: "잉여와 국가 장부", description: "저장·측정·배분 권한이 함께 생긴 조건", icon: "𒀭" },
    { slug: "economic-history-industry", name: "산업화와 생활", description: "임금·에너지·기계 선택과 생활 수준의 다른 속도", icon: "⚙" },
    { slug: "economic-history-money", name: "국제 통화 질서", description: "금본위제의 붕괴와 브레턴우즈의 조정 장치", icon: "¤" },
  ],
  articles: economicHistoryArticles,
};
export default economicHistory;
