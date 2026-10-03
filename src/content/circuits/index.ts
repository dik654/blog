import type { Category } from "../types";
import { circuitsArticles } from "./articles";

const circuits: Category = {
  slug: "circuits",
  name: "회로와 신호",
  description:
    "전하와 에너지의 이동을 전압·전류로 줄여 계산하는 조건부터, 시간에 따라 변하는 회로와 증폭·신호까지 이어갑니다.",
  subcategories: [
    {
      slug: "circuit-foundations",
      name: "회로의 출발점",
      description: "전압·전류·저항과 보존 법칙으로 한 회로를 처음부터 계산합니다.",
      icon: "⚡",
    },
  ],
  articles: circuitsArticles,
};

export default circuits;
