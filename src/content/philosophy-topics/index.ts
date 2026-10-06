import type { Category } from "../types";
import { philosophyTopicsArticles } from "./articles";

const philosophyTopics: Category = {
  slug: "philosophy-topics",
  name: "철학의 핵심 질문",
  description: "정체성·자유의지·언어·의식·미학·삶의 의미를 일상 사례, 개념 구분, 고전과 현대 연구의 순서로 읽습니다.",
  subcategories: [
    { slug: "topics-identity", name: "변화와 정체성", description: "시간이 지나고 부분이 바뀌어도 같은 것인지 판단하는 기준", icon: "≡" },
    { slug: "topics-freedom", name: "자유와 책임", description: "선택·이유·강제·통제가 책임을 만드는 조건", icon: "↯" },
    { slug: "topics-language", name: "언어와 말행위", description: "말이 대상을 가리키고 관계 속에서 일을 하는 방식", icon: "“”" },
    { slug: "topics-consciousness", name: "의식과 다른 마음", description: "느낌의 1인칭 성격과 다른 사람의 경험을 아는 근거", icon: "◉" },
    { slug: "topics-aesthetics", name: "미적 경험과 판단", description: "취향 차이 속에서 작품의 특징과 판단 이유를 주고받는 법", icon: "♪" },
    { slug: "topics-meaning", name: "삶의 의미", description: "마음이 끌리는 일과 가치 있는 일이 삶에서 만나는 방식", icon: "∞" },
  ],
  articles: philosophyTopicsArticles,
};

export default philosophyTopics;
