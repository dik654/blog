import type { Category } from "../types";
import { pricesArticles } from "./articles";

const prices: Category = {
  slug: "prices",
  name: "가격이 하는 일",
  description:
    "아무도 정하지 않은 숫자가 어떻게 정해지고, 그 숫자가 무엇을 채점하고 무엇을 실어 나르는지",
  subcategories: [
    {
      slug: "price-equilibrium",
      name: "균형 가격",
      description: "사려는 쪽과 팔려는 쪽이 만나는 자리와 그 자리가 움직이는 방식",
      icon: "📉",
    },
    {
      slug: "price-welfare",
      name: "잉여와 효율",
      description: "거래가 만든 값을 재는 자와 그 자가 놓치는 것",
      icon: "📐",
    },
    {
      slug: "price-information",
      name: "가격과 정보",
      description: "아무도 전부 알지 못하는 사정이 숫자 하나로 전달되는 경로",
      icon: "📡",
    },
  ],
  articles: pricesArticles,
};

export default prices;
