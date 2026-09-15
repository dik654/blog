import type { Category } from "../types";
import { disputeResolutionArticles } from "./articles";

const disputeResolution: Category = {
  slug: "dispute-resolution",
  name: "분쟁이 끝나는 자리",
  description:
    "대부분의 분쟁은 판결이 아니라 합의로 끝납니다. 그 계산과 거기서 걸러지는 것",
  subcategories: [
    {
      slug: "disp-settlement",
      name: "합의와 재판",
      description: "재판까지 가는 사건과 그 전에 끝나는 사건을 가르는 것",
      icon: "🪑",
    },
  ],
  articles: disputeResolutionArticles,
};

export default disputeResolution;
