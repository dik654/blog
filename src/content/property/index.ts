import type { Category } from "../types";
import { propertyArticles } from "./articles";

const property: Category = {
  slug: "property",
  name: "임대와 토지",
  description: "공간을 쓸 권리, 건물주의 수입, 개발 허가와 땅값의 관계를 살핍니다.",
  subcategories: [
    { slug: "property-lease", name: "임대", description: "기간과 공간을 빌리는 계약", icon: "🏬" },
    { slug: "property-development", name: "개발", description: "허가·공사·분양의 잔여가치", icon: "🏗️" },
  ],
  articles: propertyArticles,
};

export default property;
