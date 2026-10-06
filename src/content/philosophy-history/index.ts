import type { Category } from "../types";
import { philosophyHistoryArticles } from "./articles";

const philosophyHistory: Category = {
  slug: "philosophy-history",
  name: "철학사",
  description: "고대 지중해·전국시대 중국·고전 인도·이슬람 철학·근대 유럽·식민 근대의 서로 다른 시간축을 논쟁과 제도 변화로 교차해 읽습니다.",
  subcategories: [
    { slug: "philosophy-history-ancient-mediterranean", name: "고대 지중해", description: "문답·덕·통제의 구분이 도시와 제국의 변화 속에서 맡은 역할", icon: "Α" },
    { slug: "philosophy-history-warring-states", name: "전국시대 중국", description: "겸애·예·행정 표준이 전쟁과 통치 문제에 내놓은 경쟁 답안", icon: "諸" },
    { slug: "philosophy-history-classical-india", name: "고전 인도", description: "무엇이 지식인지, 자아와 해탈을 어떻게 설명할지를 둘러싼 논쟁", icon: "प्र" },
    { slug: "philosophy-history-islamic", name: "이슬람 철학의 전개", description: "번역과 주석에서 조명 철학·존재론의 새 종합으로 이어진 흐름", icon: "نور" },
    { slug: "philosophy-history-early-modern", name: "근대 유럽", description: "의심·경험·인과를 새 과학과 지식의 조건 속에서 다시 묻는 과정", icon: "∞" },
    { slug: "philosophy-history-colonial-modernity", name: "식민 근대와 탈식민", description: "인종 질서와 식민 통치가 자기 인식과 해방의 문제를 바꾼 과정", icon: "↺" },
  ],
  articles: philosophyHistoryArticles,
};

export default philosophyHistory;
