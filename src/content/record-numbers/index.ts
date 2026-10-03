import type { Category } from "../types";
import { recordNumbersArticles } from "./articles";

const recordNumbers: Category = {
  slug: "record-numbers",
  name: "사료에 적힌 숫자",
  description:
    "옛 기록의 숫자는 세어 본 결과가 아닐 때가 많습니다. 무엇을 어떻게 셌는지, 셀 수 없었다면 그 자리에 무엇이 들어갔는지를 봅니다.",
  subcategories: [
    {
      slug: "counting",
      name: "셀 수 있었는가",
      description: "그 숫자를 만들어 낼 수단이 당시에 있었는지부터 묻는 자리",
      icon: "🔢",
    },
    {
      slug: "what-numbers-do",
      name: "숫자가 하는 일",
      description: "기록 속 숫자가 사실 말고 무엇을 더 하고 있었는지",
      icon: "📜",
    },
  ],
  articles: recordNumbersArticles,
};

export default recordNumbers;
