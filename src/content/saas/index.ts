import type { Category } from "../types";
import { saasEdgeArticles } from "./articlesEdge";
import { saasDeliveryArticles } from "./articlesDelivery";

const saas: Category = {
  slug: "saas",
  name: "SaaS / Infra Services",
  description:
    "외부 서비스가 내부적으로 어떻게 동작하는지 — 엣지 보안, 무중단 전달, 사설 접근",
  subcategories: [
    {
      slug: "saas-edge",
      name: "Edge Security",
      description: "요청이 오리진에 닿기 전 거치는 방어 계층",
      icon: "🛡️",
    },
    {
      slug: "saas-delivery",
      name: "Always-on Delivery",
      description: "애니캐스트·헬스체크·무중단 운영",
      icon: "🌐",
    },
    {
      slug: "saas-access",
      name: "Private Access",
      description: "터널·사설 연결·원격 접근",
      icon: "🔐",
    },
  ],
  articles: [...saasEdgeArticles, ...saasDeliveryArticles],
};

export default saas;
