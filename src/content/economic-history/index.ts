import type { Category } from "../types";
import { economicHistoryArticles } from "./articles";

const economicHistory: Category = {
  slug: "economic-history",
  name: "경제사",
  description: "생산물을 세고 나누던 장부에서 교역·산업화·국제 통화와 부채를 지나 지역별 경로와 토지·가족·금융기관·노동·물가·세계 생산망의 공통 구조까지 읽습니다.",
  subcategories: [
    { slug: "economic-history-early-state", name: "잉여와 국가 장부", description: "저장·측정·배분 권한이 함께 생긴 조건", icon: "𒀭" },
    { slug: "economic-history-trade", name: "교역과 신용", description: "거리·시간·불확실성을 장부와 중개로 나눈 방법", icon: "⇄" },
    { slug: "economic-history-colonial", name: "식민 경제와 강제 노동", description: "상품망의 이익과 강제·수탈을 같은 장부에서 읽기", icon: "◫" },
    { slug: "economic-history-industry", name: "산업화와 생활", description: "임금·에너지·기계 선택과 생활 수준의 다른 속도", icon: "⚙" },
    { slug: "economic-history-money", name: "국제 통화 질서", description: "금본위제의 붕괴와 브레턴우즈의 조정 장치", icon: "¤" },
    { slug: "economic-history-development", name: "탈식민과 국제 부채", description: "독립·원자재·석유 충격·금리·외채가 이어진 경로", icon: "↗" },
    { slug: "economic-history-china", name: "중국 1800년 이후", description: "가구의 잔여 몫·국가 계획·지역 실험·세계 무역", icon: "中" },
    { slug: "economic-history-japan", name: "일본 산업화와 추격", description: "통화·은행·산업정책·민간 경쟁의 결합", icon: "円" },
    { slug: "economic-history-south-asia", name: "남아시아의 시장과 국가", description: "식민 교통망·분할·계획·외환 자유화", icon: "南" },
    { slug: "economic-history-africa", name: "아프리카와 세계경제", description: "노예무역·식민 조세·독립·원자재 의존", icon: "◎" },
    { slug: "economic-history-mena", name: "중동·북아프리카", description: "토지·외채·석유 계약·국가 예산과 다각화", icon: "◈" },
    { slug: "economic-history-latin-america", name: "라틴아메리카와 세계시장", description: "수출 호황·수입대체·외채 위기와 분배", icon: "◇" },
    { slug: "economic-history-land", name: "토지 권리와 도시화", description: "공동 이용권·인클로저·임대료와 위치 가치", icon: "▱" },
    { slug: "economic-history-family", name: "인구와 가족경제", description: "출생·사망·가구 노동·돌봄과 세대 구조", icon: "◌" },
    { slug: "economic-history-financial-institutions", name: "기업·은행·보험", description: "자본·신용·위험과 기관투자자의 형성", icon: "▦" },
    { slug: "economic-history-labor-welfare", name: "노동과 복지국가", description: "임금·교섭·사회보험과 보장의 범위", icon: "⚖" },
    { slug: "economic-history-inflation-finance", name: "인플레이션과 금융화", description: "물가 기대·긴축의 비용·시장금융의 확대", icon: "↕" },
    { slug: "economic-history-global-production", name: "세계 생산망과 플랫폼", description: "컨테이너·가치사슬·플랫폼·기후 전환", icon: "▤" },
  ],
  articles: economicHistoryArticles,
};
export default economicHistory;
