import type { Category } from "../types";
import { deviceArticles } from "./articles";

const devices: Category = {
  slug: "devices",
  name: "전자소자",
  description: "반도체 안의 전하를 한 방향으로 보내고, 전압으로 흐름을 조절하는 소자를 차례로 읽습니다.",
  subcategories: [
    { slug: "junction-devices", name: "접합과 정류", description: "두 영역을 붙였을 때 생기는 전기장과 전류를 셉니다.", icon: "◇" },
    { slug: "field-effect-devices", name: "전기장으로 조절", description: "절연막 너머 전압이 표면 전하와 스위치의 흐름을 어떻게 바꾸는지 읽습니다.", icon: "▤" },
  ],
  articles: deviceArticles,
};

export default devices;
