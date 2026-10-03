import type { Category } from "../types";
import { embeddedArticles } from "./articles";

const embedded: Category = {
  slug: "embedded",
  name: "임베디드 시스템",
  description: "완성된 칩의 레지스터를 제어하고, 입력을 제때 읽고, 통신·작업·업데이트 실패까지 다룹니다.",
  subcategories: [
    { slug: "embedded-hardware", name: "칩과 주변 장치", description: "주소, 인터럽트, 타이머와 직렬 통신을 한 보드에서 추적합니다.", icon: "◎" },
    { slug: "embedded-software", name: "시간과 복구", description: "주기 작업의 마감 시각과 펌웨어 갱신 실패를 다룹니다.", icon: "◇" },
  ],
  articles: embeddedArticles,
};

export default embedded;
