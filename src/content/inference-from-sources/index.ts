import type { Category } from "../types";
import { inferenceFromSourcesArticles } from "./articles";

const inferenceFromSources: Category = {
  slug: "inference-from-sources",
  name: "사료에서 주장으로",
  description:
    "남은 기록에서 지난 일에 대한 주장으로 건너갈 때 무엇이 보태지는지, 그 보탬이 어디까지 허용되는지를 봅니다.",
  subcategories: [
    {
      slug: "what-survived",
      name: "남은 것과 사라진 것",
      description: "기록이 남는 과정 자체가 만들어 내는 치우침",
      icon: "🗂️",
    },
    {
      slug: "reading-back",
      name: "지금 말로 옛 일을 부를 때",
      description: "오늘의 범주를 과거에 씌울 때 생기는 일",
      icon: "🔁",
    },
  ],
  articles: inferenceFromSourcesArticles,
};

export default inferenceFromSources;
