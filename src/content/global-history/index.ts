import type { Category } from "../types";
import { globalHistoryArticles } from "./articles";

const globalHistory: Category = {
  slug: "global-history",
  name: "세계사",
  description: "고대 제국에서 냉전 뒤의 세계 질서까지, 한 지역의 연표가 아니라 같은 시기의 연결·충돌·서로 다른 속도를 시간순으로 읽습니다.",
  subcategories: [
    { slug: "global-history-empires", name: "고대 제국과 행정", description: "도로·세금·법으로 넓은 영토를 묶은 방식", icon: "Ⅰ" },
    { slug: "global-history-networks", name: "중세의 교역과 지식", description: "육상·해상망을 따라 물건·종교·번역이 이동한 과정", icon: "Ⅱ" },
    { slug: "global-history-oceanic", name: "대양 정복과 생태 교환", description: "정복·질병·은·강제 노동이 대륙을 이은 경로", icon: "Ⅲ" },
    { slug: "global-history-revolutions", name: "혁명·국민국가·제국", description: "권리 선언과 시민 경계, 산업 제국의 팽창", icon: "Ⅳ" },
    { slug: "global-history-world-wars", name: "세계대전과 대중 국가", description: "총력전·대공황·국제연맹·식민 통치의 재편", icon: "Ⅴ" },
    { slug: "global-history-postwar", name: "탈식민·냉전·세계화", description: "새 국가·양극 질서·비동맹·다자 무역의 선택지", icon: "Ⅵ" },
  ],
  articles: globalHistoryArticles,
};

export default globalHistory;
