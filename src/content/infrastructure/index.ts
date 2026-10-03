import type { Category } from "../types";
import { infrastructureArticles } from "./articles";

const infrastructure: Category = {
  slug: "infrastructure",
  name: "삶을 움직이는 기반",
  description: "전력·식량·물·교통·주거·기후 위험을 비용과 권리의 흐름으로 읽습니다.",
  subcategories: [
    { slug: "infrastructure-networks", name: "연결망", description: "전력·수도·교통망의 접속과 유지", icon: "🔌" },
    { slug: "infrastructure-supply", name: "공급과 땅", description: "식품과 주택이 공급되는 경로", icon: "🏠" },
    { slug: "infrastructure-risk", name: "기후와 노출", description: "위험이 사람과 자산에 닿는 방식", icon: "🌊" },
  ],
  articles: infrastructureArticles,
};

export default infrastructure;
