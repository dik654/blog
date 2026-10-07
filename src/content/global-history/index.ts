import type { Category } from "../types";
import { globalHistoryArticles } from "./articles";

const globalHistory: Category = {
  slug: "global-history",
  name: "세계사",
  description: "인류의 이동과 농경·도시에서 열린 웹과 플랫폼까지, 한 지역의 연표가 아니라 같은 시기의 연결·충돌·서로 다른 속도를 함께 읽습니다.",
  subcategories: [
    { slug: "global-history-human-dispersal", name: "인류의 이동과 사회망", description: "계절 이동·채집·교환 관계로 환경 위험을 나눈 방식", icon: "Ⅰ" },
    { slug: "global-history-agriculture", name: "농경과 정착", description: "재배·가축화·저장·질병·권력의 변화", icon: "Ⅱ" },
    { slug: "global-history-cities-writing", name: "도시·문자·법", description: "곡물 장부·전문 노동·재판으로 낯선 사람을 맞춘 방식", icon: "Ⅲ" },
    { slug: "global-history-empires", name: "고대 제국과 행정", description: "도로·세금·법으로 넓은 영토를 묶은 방식", icon: "Ⅳ" },
    { slug: "global-history-networks", name: "중세의 교역과 지식", description: "육상·해상망을 따라 물건·종교·번역이 이동한 과정", icon: "Ⅴ" },
    { slug: "global-history-learning-institutions", name: "배움과 문헌의 전승", description: "사원·수도원·학교·시장이 지식을 이어 준 방식", icon: "Ⅵ" },
    { slug: "global-history-steppe", name: "이동 목축과 초원 제국", description: "목초지·가축·도시·역참을 한 정치 공간으로 이은 방식", icon: "Ⅶ" },
    { slug: "global-history-oceanic", name: "대양 정복과 생태 교환", description: "정복·질병·은·강제 노동이 대륙을 이은 경로", icon: "Ⅷ" },
    { slug: "global-history-revolutions", name: "혁명·국민국가·제국", description: "권리 선언과 시민 경계, 산업 제국의 팽창", icon: "Ⅸ" },
    { slug: "global-history-world-wars", name: "세계대전과 대중 국가", description: "총력전·대공황·국제연맹·식민 통치의 재편", icon: "Ⅹ" },
    { slug: "global-history-postwar", name: "탈식민·냉전·세계화", description: "새 국가·양극 질서·비동맹·다자 무역의 선택지", icon: "Ⅺ" },
    { slug: "global-history-digital-order", name: "열린 웹과 정보 질서", description: "접속·검색·추천·플랫폼 규칙이 보이는 정보를 정하는 방식", icon: "Ⅻ" },
  ],
  articles: globalHistoryArticles,
};

export default globalHistory;
