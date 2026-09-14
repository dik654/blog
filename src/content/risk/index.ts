import type { Category } from "../types";
import { riskArticles } from "./articles";

const risk: Category = {
  slug: "risk",
  name: "위험과 규제",
  description:
    "나눌 수 있는 위험과 없는 위험을 가르는 계산, 그리고 규제가 은행에 자본을 쌓게 하는 이유",
  subcategories: [
    {
      slug: "risk-portfolio",
      name: "위험의 값",
      description: "분산·상관·포트폴리오 분산과 체계적 위험의 보상",
      icon: "🎲",
    },
    {
      slug: "risk-capital",
      name: "자본 규제",
      description: "손실흡수·위험가중자산·자기자본비율과 시스템 리스크",
      icon: "🛡️",
    },
  ],
  articles: riskArticles,
};

export default risk;
