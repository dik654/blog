import type { Category } from "../types";
import { philosophyHistoryArticles } from "./articles";

const philosophyHistory: Category = {
  slug: "philosophy-history",
  name: "철학사",
  description: "고대부터 현재까지 서로 겹치는 열두 시간축을 따라 논쟁·번역·교육·정복과 제도 변화가 철학의 질문을 어떻게 바꿨는지 교차해 읽습니다.",
  subcategories: [
    { slug: "philosophy-history-ancient-mediterranean", name: "고대 지중해", description: "문답·덕·통제의 구분이 도시와 제국의 변화 속에서 맡은 역할", icon: "Α" },
    { slug: "philosophy-history-warring-states", name: "전국시대 중국", description: "겸애·예·행정 표준이 전쟁과 통치 문제에 내놓은 경쟁 답안", icon: "諸" },
    { slug: "philosophy-history-classical-india", name: "고전 인도", description: "무엇이 지식인지, 자아와 해탈을 어떻게 설명할지를 둘러싼 논쟁", icon: "प्र" },
    { slug: "philosophy-history-medieval", name: "중세 번역과 문답", description: "그리스어·아랍어·히브리어·라틴어 문헌망에서 이성과 계시를 다시 묻는 과정", icon: "Μ" },
    { slug: "philosophy-history-islamic", name: "이슬람 철학의 전개", description: "번역과 주석에서 조명 철학·존재론의 새 종합으로 이어진 흐름", icon: "نور" },
    { slug: "philosophy-history-song-ming", name: "송명 유학", description: "주희와 왕양명이 이치·마음·앎·행동의 관계를 다르게 세운 과정", icon: "理" },
    { slug: "philosophy-history-new-nyaya", name: "초기 근대 인도의 새 나이야", description: "지식·언어·관계를 정밀한 기술 언어로 분석한 장기 전통", icon: "न" },
    { slug: "philosophy-history-indigenous-latin", name: "원주민 사상과 라틴아메리카 해방", description: "땅·식민적 지움·자기 결정과 해방의 출발점을 구분해 잇는 과정", icon: "地" },
    { slug: "philosophy-history-early-modern", name: "근대 유럽", description: "의심·경험·인과를 새 과학과 지식의 조건 속에서 다시 묻는 과정", icon: "∞" },
    { slug: "philosophy-history-feminist", name: "페미니즘 철학", description: "지식의 위치·돌봄·교차 권력이 기존 철학의 질문을 바꾼 과정", icon: "♀" },
    { slug: "philosophy-history-modern-methods", name: "근현대 철학의 방법", description: "프래그머티즘·분석 철학·현상학이 결과·개념·경험을 묻는 다른 방법", icon: "?" },
    { slug: "philosophy-history-colonial-modernity", name: "식민 근대와 탈식민", description: "인종 질서와 식민 통치가 자기 인식과 해방의 문제를 바꾼 과정", icon: "↺" },
  ],
  articles: philosophyHistoryArticles,
};

export default philosophyHistory;
