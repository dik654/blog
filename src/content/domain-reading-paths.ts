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
  organizingPrinciple?: "시간순" | "주제순" | "선수 개념순" | "혼합";
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
 * 카테고리는 카테고리 안에서 길을 안내해야 하지만, 경제·금융·정치·법은 카테고리마다
 * 글이 두세 편뿐이고 진짜 커리큘럼은 네 카테고리를 가로지르는 아홉 편의 사슬입니다.
 * 그 사슬은 카테고리 단위 지도로는 표현되지 않습니다.
 */
export const DOMAIN_READING_PATHS: Readonly<
  Partial<Record<DomainSlug, DomainReadingPath>>
> = {
  electronics: {
    organizingPrinciple: "선수 개념순",
    title: "전류에서 펌웨어까지 이어 읽기",
    description: "회로에서 읽은 전압과 전류가 소자의 상태, 칩의 동작, 임베디드 시스템의 시간 약속으로 이어지는 경로입니다.",
    stages: [
      { eyebrow: "01 · 회로", title: "흐름을 계산하기", description: "전하와 에너지의 보존을 한 회로의 전압·전류·전력으로 옮깁니다.", categories: ["circuits"] },
      { eyebrow: "02 · 반도체", title: "흐름을 바꿀 재료", description: "움직일 수 있는 전하의 수를 에너지 상태와 도핑에서 설명하고 공정으로 확장합니다.", categories: ["semiconductors"] },
      { eyebrow: "03 · 소자", title: "흐름을 조절하기", description: "반도체 소자의 전류와 전압을 이용해 정류·증폭·스위칭을 설명합니다.", categories: ["devices"] },
      { eyebrow: "04 · 임베디드", title: "물리 시간에 맞춰 제어하기", description: "칩 안의 레지스터부터 인터럽트·실시간 스케줄링까지 따라갑니다.", categories: ["embedded"] },
    ],
    showFullSequence: true,
  },
  cs: {
    organizingPrinciple: "주제순",
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

  economics: {
    organizingPrinciple: "선수 개념순",
    title: "가격에서 실제 사업과 국가의 장부까지",
    description:
      "가격과 기업의 원리를 배운 뒤 가게·임대·개발·공급망·보험·의료에 적용하고, 나라 사이의 자금과 인식이 시장으로 전달되는 경로를 읽습니다.",
    stages: [
      {
        eyebrow: "01 · 왜 골라야 하는가",
        title: "모자람과 선택",
        description:
          "고른 것의 값이 아니라 포기한 것의 값으로 재기 시작하면, 혼자 다 하는 것이 왜 손해인지까지 따라옵니다.",
        categories: ["scarcity"],
      },
      {
        eyebrow: "02 · 무엇이 정하는가",
        title: "가격이 하는 일",
        description:
          "아무도 정하지 않은 숫자가 정해지고, 그 숫자가 결과를 채점하고, 아무도 갖지 않은 지식을 실어 나릅니다.",
        categories: ["prices"],
      },
      {
        eyebrow: "03 · 어디서 어긋나는가",
        title: "가격이 놓치는 것",
        description:
          "값이 장부에 안 적히거나, 값을 받을 수 없거나, 한쪽만 아는 것이 있으면 같은 장치가 반대로 작동합니다.",
        categories: ["market-failure"],
      },
      {
        eyebrow: "04 · 합이 아닌 것",
        title: "전체와 부분",
        description:
          "여기까지는 전부 한 시장 이야기입니다. 모두가 동시에 같은 판단을 하면 그 판단이 뒤집힙니다.",
        categories: ["macro"],
      },
      {
        eyebrow: "05 · 값이 아니라 지시가 정하는 자리",
        title: "조직과 값을 정하는 힘",
        description:
          "생산의 대부분은 값이 아니라 지시로 조정됩니다. 그 범위가 어디서 멈추고, 그 안에서 값이 왜 내려가며, 파는 쪽이 하나면 값이 어디에 멈추는지를 셉니다.",
        categories: ["firms"],
      },
      {
        eyebrow: "06 · 사람이 파는 시간",
        title: "일하는 사람의 몫",
        description:
          "같은 셈을 사람이 파는 시간에 적용하면 어디까지 맞는지, 그리고 그 예측을 실제로 재면 무엇이 나오는지를 봅니다.",
        categories: ["labor"],
      },
      {
        eyebrow: "07 · 사업 현장",
        title: "가게와 공간",
        description: "입지·공사·임대·가맹·양도·폐업과 토지 개발에서 누가 돈과 권리를 갖는지 봅니다.",
        categories: ["business", "property"],
      },
      {
        eyebrow: "08 · 국경과 제도",
        title: "자금·위험·생활",
        description: "국제 자금과 시장 기대를 공공예산·정보·생활 기반과 국가 비교의 장부로 연결합니다.",
        categories: ["institutions", "infrastructure"],
      },
    ],
    showFullSequence: false,
  },

  finance: {
    organizingPrinciple: "선수 개념순",
    title: "금융의 청구권과 위험 이전을 읽는 순서",
    description:
      "돈과 은행에서 채권·주식으로 간 뒤 펀드·ETF·ETN과 파생상품의 현금흐름, 담보와 강제 매도까지 따라갑니다.",
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
          "채권·주식의 청구권을 먼저 세운 뒤 펀드·ETF·ETN과 선도·선물·옵션·스왑의 지급 구조로 확장합니다.",
        categories: ["markets"],
      },
      {
        eyebrow: "04 · 무너지지 않게",
        title: "위험과 규제",
        description:
          "위험 분산과 자본 규제에 이어 증거금·레버리지·유동성이 포지션을 언제 닫게 하는지 봅니다.",
        categories: ["risk"],
      },
    ],
    showFullSequence: true,
  },

  politics: {
    organizingPrinciple: "선수 개념순",
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
    organizingPrinciple: "선수 개념순",
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

  history: {
    organizingPrinciple: "혼합",
    title: "사료를 읽는 법에서 세계사와 경제사의 시간축으로",
    description:
      "먼저 남은 기록을 어디까지 믿을 수 있는지 배웁니다. 그 뒤 제국·교역망·대양 정복·혁명·세계대전·탈식민의 세계사와 생산·교역·통화·부채의 경제사를 각각 시간순으로 따라갑니다.",
    stages: [
      {
        eyebrow: "01 · 기록은 누가 만들었는가",
        title: "누가 왜 적었는가",
        description:
          "사료는 지난 일이 아니라 지난 일에 대한 누군가의 기록입니다. 적은 사람이 그 자리에서 무엇을 할 수 있었는지가 적힌 것의 모양을 정합니다.",
        categories: ["testimony"],
      },
      {
        eyebrow: "02 · 숫자는 어디서 왔는가",
        title: "사료에 적힌 숫자",
        description:
          "옛 기록의 숫자는 세어 본 결과가 아닐 때가 많습니다. 셀 수단이 있었는지부터 묻고, 없었다면 그 자리에 무엇이 들어갔는지를 봅니다.",
        categories: ["record-numbers"],
      },
      {
        eyebrow: "03 · 어디까지 말할 수 있는가",
        title: "사료에서 주장으로",
        description:
          "남은 기록에서 주장으로 건너갈 때 무엇이 보태지는지, 그 보탬이 어디까지 허용되는지를 정합니다.",
        categories: ["inference-from-sources"],
      },
      {
        eyebrow: "04 · 기원전 3세기 무렵부터 1990년대 이후까지",
        title: "제국과 연결, 전쟁과 독립이 바뀐 순서",
        description:
          "도로와 세금으로 묶은 제국에서 교역·종교의 연결망, 대양 정복, 시민 혁명과 산업 제국, 세계대전, 탈식민과 세계화까지 시간순으로 잇습니다.",
        categories: ["global-history"],
      },
      {
        eyebrow: "05 · 기원전 4천년기부터 1980년대까지",
        title: "생산·교역·돈의 제도가 바뀐 순서",
        description:
          "곡물 장부에서 장거리 교역과 식민 상품망을 거쳐 산업화, 국제 통화 질서, 탈식민 뒤의 부채 위기까지 시간순으로 잇습니다.",
        categories: ["economic-history"],
      },
    ],
    showFullSequence: true,
  },
  philosophy: {
    organizingPrinciple: "혼합",
    title: "생각을 검사하는 여섯 도구와 서로 다른 사상의 출발점",
    description:
      "논증과 지식의 기준에서 시작해 행동·정치·과학·인공지능을 검사한 뒤, 중국·인도·불교·이슬람·아칸 전통이 다른 생활 문제에서 만든 질문을 주제별로 읽습니다.",
    stages: [
      {
        eyebrow: "01 · 결론이 따라오는가",
        title: "논증과 반례",
        description: "전제가 참인지와 결론이 전제에서 따라오는지를 나누고, 작은 반례로 추론의 빈틈을 찾습니다.",
        categories: ["reasoning"],
      },
      {
        eyebrow: "02 · 안다고 할 수 있는가",
        title: "지식과 우연",
        description: "믿음이 참이고 근거가 있어도 우연히 맞은 경우가 왜 남는지 같은 사례로 추적합니다.",
        categories: ["epistemology"],
      },
      {
        eyebrow: "03 · 무엇을 해야 하는가",
        title: "결과·의무·성품",
        description: "한 행동의 결과, 지켜야 할 원칙, 어떤 사람이 되는지를 같은 결정 위에 겹쳐 봅니다.",
        categories: ["ethics"],
      },
      {
        eyebrow: "04 · 강제력은 언제 정당한가",
        title: "동의·자유·정당한 권력",
        description: "결정에 참여하지 않은 사람에게도 규칙을 강제할 수 있는 조건을 동의·권리·해악으로 나눕니다.",
        categories: ["political-philosophy"],
      },
      {
        eyebrow: "05 · 설명은 무엇을 더 주는가",
        title: "증거·모형·인과 설명",
        description: "예측이 맞는 것, 원인을 찾는 것, 쓸모 있는 모형을 만드는 것이 어디서 갈리는지 봅니다.",
        categories: ["philosophy-of-science"],
      },
      {
        eyebrow: "06 · 행동이 곧 이해인가",
        title: "행동·의미·기계 이해",
        description: "정답을 내는 행동과 뜻을 이해하는 상태를 튜링의 검사와 중국어 방 반례로 비교합니다.",
        categories: ["mind-and-language"],
      },
      {
        eyebrow: "07 · 질문은 어디서 달라졌는가",
        title: "서로 다른 사상 전통의 출발점",
        description: "유가의 역할, 도가의 개입, 불교의 경험, 『기타』의 행위, 이슬람 인과론과 아칸 인격론을 하나의 서양 연표에 억지로 넣지 않고 주제별로 비교합니다.",
        categories: ["philosophical-traditions"],
      },
    ],
    showFullSequence: true,
  },
};
