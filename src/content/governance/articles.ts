import type { Article } from "../types";

export const governanceArticles: Article[] = [
  {
    slug: "bureaucracy-and-implementation",
    title: "차량 1,000대를 점검하라는 결정은 현장에서 어떻게 달라질까요?",
    subcategory: "gov-bureaucracy",
    sections: [
      {
        id: "overview",
        title:
          "“차량 1,000대를 점검하라”는 결정만으로는 결과가 정해지지 않습니다",
      },
      {
        id: "why-delegate",
        title:
          "1. 의회는 기준을 정할 수 있지만 차량 1,000대를 직접 볼 수는 없습니다",
      },
      {
        id: "agency",
        title: "2. 맡기는 순간 목표를 아는 쪽과 현장을 아는 쪽이 갈립니다",
      },
      {
        id: "rules-or-discretion",
        title:
          "3. 체크리스트는 같은 답을 만들지만 목록 밖 결함은 놓칠 수 있습니다",
        subsections: [
          {
            id: "street-level",
            title:
              "마지막 검사관이 200일의 정밀 점검 시간을 누구에게 쓸지 정합니다",
          },
        ],
      },
      {
        id: "measurement",
        title: "4. 완료 건수에만 보상하면 정밀 조사는 줄어들 수 있습니다",
      },
      {
        id: "control",
        title:
          "5. 통제는 차이를 없애는 일이 아니라 어디에서 다시 볼지 정하는 일입니다",
      },
      {
        id: "boundary",
        title:
          "6. 집행 실패는 누가 게을렀나보다 어느 선택이 결과를 바꿨나로 봐야 합니다",
      },
    ],
    component: () =>
      import("@/pages/articles/governance/bureaucracy-and-implementation"),
  },
  {
    slug: "international-anarchy",
    title: "강제할 곳이 없어도 국가 간 약속이 서는 조건",
    subcategory: "gov-international",
    sections: [
      {
        id: "overview",
        title: "약속을 강제로 지키게 할 곳이 없어도 협력은 가능할까요?",
      },
      {
        id: "no-sovereign",
        title: "1. 국제 무정부는 무질서가 아니라 최종 집행자가 없다는 뜻입니다",
      },
      {
        id: "security-dilemma",
        title: "2. 방어용 순찰선도 상대 눈에는 공격 수단으로 보입니다",
      },
      {
        id: "shadow",
        title: "3. 다음 해의 가치가 0.5보다 크면 제한을 지키는 편이 유리합니다",
      },
      {
        id: "institutions",
        title: "4. 국제 제도는 처벌자가 아니라 계산을 바꾸는 장치입니다",
      },
      {
        id: "limits",
        title: "5. 둘 다 이익이어도 누가 더 얻는지와 국내 비준이 남습니다",
      },
      {
        id: "boundary",
        title: "6. 협력의 핵심은 선의가 아니라 위반 뒤의 계산까지 설계하는 일입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/governance/international-anarchy"),
  },
];
