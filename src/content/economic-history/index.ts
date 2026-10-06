import type { Category } from "../types";
import { economicHistoryArticles } from "./articles";

const economicHistory: Category = {
  slug: "economic-history",
  name: "경제사",
  description: "생산물을 세고 나누던 장부에서 교역·식민 상품망·산업화·국제 통화와 부채까지, 제도가 다음 선택을 만든 순서로 읽습니다.",
  subcategories: [
    { slug: "economic-history-early-state", name: "잉여와 국가 장부", description: "저장·측정·배분 권한이 함께 생긴 조건", icon: "𒀭" },
    { slug: "economic-history-trade", name: "교역과 신용", description: "거리·시간·불확실성을 장부와 중개로 나눈 방법", icon: "⇄" },
    { slug: "economic-history-colonial", name: "식민 경제와 강제 노동", description: "상품망의 이익과 강제·수탈을 같은 장부에서 읽기", icon: "◫" },
    { slug: "economic-history-industry", name: "산업화와 생활", description: "임금·에너지·기계 선택과 생활 수준의 다른 속도", icon: "⚙" },
    { slug: "economic-history-money", name: "국제 통화 질서", description: "금본위제의 붕괴와 브레턴우즈의 조정 장치", icon: "¤" },
    { slug: "economic-history-development", name: "탈식민과 국제 부채", description: "독립·원자재·석유 충격·금리·외채가 이어진 경로", icon: "↗" },
  ],
  articles: economicHistoryArticles,
};
export default economicHistory;
