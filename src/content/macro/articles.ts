import type { Article } from "../types";

export const macroArticles: Article[] = [
  {
    slug: "aggregation-and-composition",
    title: "한 사람에게 맞는 답이 모두에게 맞지는 않습니다",
    subcategory: "macro-aggregate",
    sections: [
      {
        id: "overview",
        title: "앞의 여덟 편은 전부 한 사람의 자리에서 본 것입니다",
      },
      {
        id: "spending-is-income",
        title: "부품 1. 한 사람의 지출이 다른 사람의 소득입니다",
      },
      {
        id: "thrift",
        title: "부품 2. 그래서 다 같이 아끼면 아껴지지 않습니다",
      },
      {
        id: "multiplier",
        title: "부품 3. 한 번의 지출이 몇 바퀴를 돌지는 도는 비율이 정합니다",
      },
      {
        id: "aggregates-hide",
        title: "부품 4. 합친 숫자는 그 숫자를 정한 것을 지웁니다",
      },
      {
        id: "boundary",
        title: "이 글의 계산은 값과 이자율을 세워 둔 채로 한 것입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/macro/aggregation-and-composition"),
  },
  {
    slug: "why-per-head-stalls",
    title: "총량이 늘어도 한 사람 몫은 제자리일 수 있습니다",
    subcategory: "macro-numbers",
    sections: [
      {
        id: "overview",
        title: "100년 뒤에 7,700만 명의 몫이 비어 있다는 셈이 있었습니다",
      },
      {
        id: "two-ratios",
        title: "부품 1. 한쪽은 곱으로 늘고 다른 쪽은 더하기로 늡니다",
      },
      {
        id: "per-head",
        title: "부품 2. 두 줄을 나누면 한 사람 몫이 나옵니다",
      },
      {
        id: "the-check",
        title: "부품 3. 줄어든 몫이 사람 수를 도로 눌러 제자리로 되돌립니다",
      },
      {
        id: "what-broke",
        title: "부품 4. 예측은 빗나갔고, 어느 가정이 깨졌는지 짚을 수 있습니다",
      },
      {
        id: "what-it-leaves",
        title: "부품 5. 남는 질문은 무엇이 한 사람 몫을 올리는가입니다",
      },
      {
        id: "handoff",
        title: "더한 숫자를 읽는 규칙이 세 개 더 남았습니다",
      },
    ],
    component: () => import("@/pages/articles/macro/why-per-head-stalls"),
  },
  {
    slug: "what-the-price-level-hides",
    title: "값이 올랐다는 말은 네 자리 중 어디가 움직였는지를 말하지 않습니다",
    subcategory: "macro-numbers",
    sections: [
      {
        id: "overview",
        title: "빵과 석탄과 옷감으로 1억 달러어치가 오갔습니다",
      },
      {
        id: "two-sides",
        title: "부품 1. 거래 하나가 같은 값이므로 한 해를 다 더해도 같습니다",
      },
      {
        id: "velocity",
        title: "부품 2. 같은 돈이 여러 번 쓰이므로 가진 돈만으로는 모자랍니다",
      },
      {
        id: "four-knobs",
        title: "부품 3. 셋이 정해지면 나머지 하나가 따라옵니다",
      },
      {
        id: "not-a-cause",
        title: "부품 4. 이 식은 무엇이 무엇을 움직였는지 말하지 않습니다",
      },
      {
        id: "what-to-ask",
        title: "부품 5. 쓸모는 답이 아니라 물어야 할 목록에 있습니다",
      },
      {
        id: "handoff",
        title: "다음은 사람을 세는 자리입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/macro/what-the-price-level-hides"),
  },
  {
    slug: "who-counts-as-unemployed",
    title: "실업자는 세 조건을 통과한 사람으로 정의됩니다",
    subcategory: "macro-numbers",
    sections: [
      {
        id: "overview",
        title: "일자리를 구하다 지쳐 그만둔 사람은 실업자가 아닙니다",
      },
      {
        id: "three-conditions",
        title: "부품 1. 세 조건이 각각 다른 사람을 거릅니다",
      },
      {
        id: "denominator",
        title: "부품 2. 분모는 전체 인구가 아니라 일하거나 찾는 사람입니다",
      },
      {
        id: "four-measures",
        title: "부품 3. 같은 사람들에서 네 가지 숫자가 나옵니다",
      },
      {
        id: "moving-the-line",
        title: "부품 4. 조건 하나만 바꿔도 같은 나라의 숫자가 달라집니다",
      },
      {
        id: "how-to-read",
        title: "부품 5. 숫자 하나가 아니라 숫자와 정의를 함께 읽습니다",
      },
      {
        id: "handoff",
        title: "마지막은 나라 밖과의 거래입니다",
      },
    ],
    component: () => import("@/pages/articles/macro/who-counts-as-unemployed"),
  },
  {
    slug: "what-ricardo-assumed",
    title: "리카도의 논증은 자본이 국경을 넘지 않는다는 전제 위에 있습니다",
    subcategory: "macro-numbers",
    sections: [
      {
        id: "overview",
        title: "포르투갈이 둘 다 더 잘 만드는데도 교역이 일어납니다",
      },
      {
        id: "inside-vs-outside",
        title: "부품 1. 같은 교환이 한 나라 안에서는 일어나지 않습니다",
      },
      {
        id: "the-assumption",
        title: "부품 2. 차이를 만드는 것은 자본이 국경을 넘기 어렵다는 것입니다",
      },
      {
        id: "if-it-moves",
        title: "부품 3. 전제가 풀리면 저자 자신이 다른 결론을 적습니다",
      },
      {
        id: "what-he-leaned-on",
        title: "부품 4. 전제를 떠받친 것은 사람의 마음과 제도였습니다",
      },
      {
        id: "handoff",
        title: "2단계를 여기서 닫습니다",
      },
    ],
    component: () => import("@/pages/articles/macro/what-ricardo-assumed"),
  },
  {
    slug: "global-capital-and-policy",
    title: "국가 정책은 국제 자금의 제약을 지나 환율·금리·자산값에 닿는다",
    subcategory: "macro-global",
    sections: [{"id": "overview", "title": "달러 빚은 원화 환율이 오르면 원화 장부에서 커집니다"}, {"id": "mechanism", "title": "결정권에서 가격까지 다섯 고리를 그립니다"}, {"id": "comparison", "title": "전 세계에 하나의 자금 흐름이 있어도 국가는 같지 않습니다"}, {"id": "limits", "title": "환율 변동 뒤 주가가 움직였다는 순서만으로 정책의 원인이라 말할 수 없습니다"}],
    component: () => import("@/pages/articles/macro/global-capital-and-policy"),
  },
  {
    slug: "narratives-and-market-regimes",
    title: "대세는 사람들이 믿는 이야기와 실제 자금 제약이 서로를 바꿀 때 생긴다",
    subcategory: "macro-global",
    sections: [{"id": "overview", "title": "좋은 기술 설명만으로 자산 가격이 오르지는 않습니다"}, {"id": "mechanism", "title": "이야기 → 기대 → 자금 → 주문 → 가격 → 새 이야기의 고리를 봅니다"}, {"id": "comparison", "title": "인식의 힘은 시장 구조와 나라의 제도를 통과합니다"}, {"id": "limits", "title": "서사가 틀렸는지 알려면 가격보다 검증할 지표를 먼저 정해야 합니다"}],
    component: () => import("@/pages/articles/macro/narratives-and-market-regimes"),
  },
];
