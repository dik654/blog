import type { DomainSlug } from "./domains";

export interface DomainReadingStage {
  eyebrow: string;
  title: string;
  description: string;
  categories: readonly string[];
}

export interface DomainReadingPath {
  title: string;
  description: string;
  stages: readonly DomainReadingStage[];
  /**
   * 대분류 전체가 선수 관계로 닫힌 하나의 커리큘럼일 때만 켭니다. 켜면 대분류
   * 페이지가 카테고리 카드 아래에 글 전편을 읽는 순서대로 번호를 매겨 보여 줍니다.
   * CS처럼 카테고리끼리 독립적이고 글이 수백 편인 대분류에서는 끕니다.
   */
  showFullSequence: boolean;
}

/**
 * 카테고리 안의 읽는 순서는 `category-reading-paths.ts`가 맡습니다. 이 파일은
 * 그 한 층 위, **카테고리 사이의 순서**만 다룹니다.
 *
 * 둘을 나눈 이유는 단위가 다르기 때문입니다. AI처럼 소분류가 열 개가 넘는
 * 카테고리는 카테고리 안에서 길을 안내해야 하지만, 금융·정치·법은 카테고리마다
 * 글이 두세 편뿐이고 진짜 커리큘럼은 네 카테고리를 가로지르는 아홉 편의 사슬입니다.
 * 그 사슬은 카테고리 단위 지도로는 표현되지 않습니다.
 */
export const DOMAIN_READING_PATHS: Readonly<
  Partial<Record<DomainSlug, DomainReadingPath>>
> = {
  cs: {
    title: "컴퓨터 기술을 네 덩어리로 나눠 읽기",
    description:
      "카테고리끼리 선수 관계가 아니라 다루는 층이 다릅니다. 필요한 덩어리부터 열어도 됩니다.",
    stages: [
      {
        eyebrow: "01 · 모델",
        title: "학습하고 추론하는 층",
        description:
          "데이터가 모델이 되고 모델이 서빙·에이전트로 나가기까지를 논문과 구현으로 따라갑니다.",
        categories: ["ai"],
      },
      {
        eyebrow: "02 · 분산",
        title: "합의하고 전파하는 층",
        description:
          "노드가 서로를 믿지 않는 상태에서 하나의 상태에 도달하고, 그 상태를 퍼뜨리는 방법입니다.",
        categories: ["blockchain", "p2p"],
      },
      {
        eyebrow: "03 · 신뢰",
        title: "증명하고 격리하는 층",
        description:
          "수학으로 보장하는 쪽(암호·영지식)과 하드웨어로 보장하는 쪽(TEE)을 나란히 둡니다.",
        categories: ["crypto", "tee"],
      },
      {
        eyebrow: "04 · 실행과 운영",
        title: "돌리고 지키는 층",
        description:
          "연산을 실제로 수행하는 하드웨어와, 서비스를 운영하며 통제를 증명하는 절차입니다.",
        categories: ["gpu", "isms-aml", "saas"],
      },
    ],
    showFullSequence: false,
  },

  finance: {
    title: "금융을 아홉 편으로 쌓아 올리는 순서",
    description:
      "돈이 무엇인지에서 시작해 그것을 만드는 곳, 값이 정해지는 곳, 무너지지 않게 붙드는 장치 순으로 내려갑니다. 앞 글이 뒤 글의 선수라 순서대로 읽는 것이 가장 짧습니다.",
    stages: [
      {
        eyebrow: "01 · 기준선",
        title: "돈과 시간",
        description:
          "오늘의 돈이 누구의 빚인지, 그리고 시점이 다른 돈을 어떻게 같은 자리에 놓는지를 먼저 정합니다.",
        categories: ["money"],
      },
      {
        eyebrow: "02 · 만드는 곳",
        title: "은행과 통화",
        description:
          "예금이 대출에서 생기고, 기준금리 한 번이 시장금리로 번지고, 송금이 최종성에 도달하는 경로입니다.",
        categories: ["banking"],
      },
      {
        eyebrow: "03 · 값이 정해지는 곳",
        title: "시장과 가격",
        description:
          "01의 할인을 그대로 채권에 대면 가격이 나오고, 남는 것을 갖는 청구권에 대면 주식이 나옵니다.",
        categories: ["markets"],
      },
      {
        eyebrow: "04 · 무너지지 않게",
        title: "위험과 규제",
        description:
          "나눌 수 있는 위험과 없는 위험을 가른 뒤, 자본 규제가 무엇을 막으려는 장치인지로 닫습니다.",
        categories: ["risk"],
      },
    ],
    showFullSequence: true,
  },

  politics: {
    title: "정치를 아홉 편으로 쌓아 올리는 순서",
    description:
      "한 사회에 하나만 존재할 수 있는 결정을 누가 어떻게 내리는가 하나를 붙들고, 강제력이 어디에 모이는지에서 시작해 그 자리가 비어 있는 곳까지 갑니다.",
    stages: [
      {
        eyebrow: "01 · 무엇을 정하는가",
        title: "정치체",
        description:
          "혼자 정할 수 없는 결정이 왜 생기는지, 그리고 그 결정을 강제하는 힘이 어디에 모이는지입니다.",
        categories: ["polity"],
      },
      {
        eyebrow: "02 · 무엇이 묶는가",
        title: "헌법과 권력 구조",
        description:
          "모인 힘을 묶는 장치와, 그 장치를 어떻게 배치하느냐에 따라 갈리는 정부 형태입니다.",
        categories: ["constitution"],
      },
      {
        eyebrow: "03 · 누가 그 자리를 채우는가",
        title: "선거와 대표",
        description:
          "표를 의석으로 바꾸는 규칙이 결과를 바꾸고, 집계 자체에 한계가 있으며, 그 사이를 조직이 메웁니다.",
        categories: ["elections"],
      },
      {
        eyebrow: "04 · 누가 집행하는가",
        title: "거버넌스",
        description:
          "정해진 것을 실제로 집행하는 조직과, 그 위에 아무도 없는 영역에서 협력이 생기는 조건입니다.",
        categories: ["governance"],
      },
    ],
    showFullSequence: true,
  },

  law: {
    title: "법을 아홉 편으로 쌓아 올리는 순서",
    description:
      "일반적인 문장 하나가 내 앞에 놓인 판결문 한 줄이 되기까지 무엇이 필요한지를 따라갑니다. 정치 시리즈가 규범이 정해지는 자리에서 멈춘 지점부터 시작합니다.",
    stages: [
      {
        eyebrow: "01 · 무엇이 법인가",
        title: "법 체계",
        description:
          "무엇이 규범에 효력을 주는지, 조문을 사안에 대는 일은 어떻게 이뤄지는지, 판단이 어떻게 규범이 되는지입니다.",
        categories: ["legal-system"],
      },
      {
        eyebrow: "02 · 사람 사이",
        title: "사법",
        description:
          "약속을 구속력 있게 만드는 것, 무엇을 누구의 것으로 두는 방식, 사고의 비용을 누구에게 지우는 기준입니다.",
        categories: ["private-law"],
      },
      {
        eyebrow: "03 · 국가가 벌할 때",
        title: "형사법",
        description:
          "왜 피해자가 아니라 국가가 직접 벌하는지, 그리고 얼마나 확실해야 벌할 수 있는지입니다.",
        categories: ["criminal-law"],
      },
      {
        eyebrow: "04 · 실제로 끝나는 자리",
        title: "분쟁 해결",
        description:
          "대부분의 분쟁은 재판까지 가지 않습니다. 그런데도 규칙이 작동하는 이유로 네 대분류를 닫습니다.",
        categories: ["dispute-resolution"],
      },
    ],
    showFullSequence: true,
  },
};
