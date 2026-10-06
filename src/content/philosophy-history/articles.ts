import type { Article } from "../types";

export const philosophyHistoryArticles: Article[] = [
  {
    slug: "ancient-mediterranean-inquiry-virtue-and-control",
    title: "좋은 삶을 누가 판단하는가: 고대 지중해의 문답·덕·통제",
    subcategory: "philosophy-history-ancient-mediterranean",
    sections: [
      { id: "overview", title: "1. 좋은 삶은 정답 목록보다 자기 이유를 검사하는 일에서 시작합니다" },
      { id: "black-box", title: "2. 질문·성품·공동체·통제의 네 갈래를 엽니다" },
      { id: "case", title: "3. 10시간의 계획과 경기 결과를 같은 장부에 넣지 않습니다" },
      { id: "picture", title: "4. 아테네의 문답에서 제국 시대의 생활 훈련까지 이동합니다" },
      { id: "need", title: "5. 이름을 외우는 연표만으로는 논쟁의 이유를 알 수 없습니다" },
      { id: "names", title: "6. 문답 검사·덕의 습관·통제 구분에 이름을 붙입니다" },
      { id: "mechanism", title: "7. 믿음을 질문하고 행동을 고른 뒤 결과를 다시 해석합니다" },
      { id: "source", title: "8. MIT 과정은 플라톤에서 칸트까지 질문과 시대 변화를 함께 읽습니다" },
      { id: "comparison", title: "9. 고대 윤리는 소크라테스에서 스토아까지 하나의 덕 이론이 아닙니다" },
      { id: "limits", title: "10. 그리스 철학을 서양 전체의 시작이나 보편 이성의 단일 원천으로 만들지 않습니다" },
    ],
    component: () => import("@/pages/articles/philosophy-history/ancient-mediterranean-inquiry-virtue-and-control"),
  },
  {
    slug: "warring-states-china-care-ritual-and-standards",
    title: "전쟁을 줄일 기준은 무엇인가: 전국시대 중국의 겸애·예·법",
    subcategory: "philosophy-history-warring-states",
    sections: [
      { id: "overview", title: "1. 전쟁 중인 나라의 예산 100을 어디에 쓰느냐가 철학 논쟁이 됩니다" },
      { id: "black-box", title: "2. 목적·판단 기준·사람에 대한 가정·행정 수단을 엽니다" },
      { id: "case", title: "3. 군비 50과 의례 20을 줄이면 구제 재원이 얼마나 늘어나는지 봅니다" },
      { id: "picture", title: "4. 스승의 학파보다 서로 비판하고 빌린 논쟁망을 봅니다" },
      { id: "need", title: "5. 겸애를 모두를 똑같이 좋아하라는 감정 명령으로 줄이지 않습니다" },
      { id: "names", title: "6. 겸애·의례 수양·행정 표준에 이름을 붙입니다" },
      { id: "mechanism", title: "7. 예산 변경을 결과·행동·권력의 세 장부로 검사합니다" },
      { id: "source", title: "8. Stanford의 묵가 개관은 윤리·정치·논리의 결합을 보여 줍니다" },
      { id: "comparison", title: "9. 법가라는 이름은 법 하나보다 표준·기술·권세의 묶음을 가리킵니다" },
      { id: "limits", title: "10. 전국시대 사상을 현대 진보·보수나 유교 대 법치로 바로 번역하지 않습니다" },
    ],
    component: () => import("@/pages/articles/philosophy-history/warring-states-china-care-ritual-and-standards"),
  },
  {
    slug: "classical-india-pramana-self-and-liberation",
    title: "무엇이 지식이 되는가: 고전 인도의 프라마나·자아·해탈 논쟁",
    subcategory: "philosophy-history-classical-india",
    sections: [
      { id: "overview", title: "1. ‘내일 시장이 열린다’는 한 문장을 무엇으로 믿을지 묻습니다" },
      { id: "black-box", title: "2. 인식 사건·지식 통로·오류 검사·삶의 목표를 나눕니다" },
      { id: "case", title: "3. 네 근거를 세어도 독립된 지식 통로 수는 학파마다 다릅니다" },
      { id: "picture", title: "4. 베다 해석·논쟁 규칙·불교 비판이 서로의 이론을 정교하게 만듭니다" },
      { id: "need", title: "5. 지각이 기본이라는 말도 착각과 개념 작용을 설명해야 합니다" },
      { id: "names", title: "6. 프라마나·나이야의 네 통로·불교의 두 통로에 이름을 붙입니다" },
      { id: "mechanism", title: "7. 시장 정보를 행동으로 옮기기 전에 통로별 실패를 찾습니다" },
      { id: "source", title: "8. Stanford 개관은 고전 인도 인식론을 거의 스무 세기의 논쟁으로 봅니다" },
      { id: "comparison", title: "9. 디그나가와 다르마키르티는 불교 인식론의 방향을 바꿨습니다" },
      { id: "limits", title: "10. 인도 철학을 여섯 정통 학파 목록이나 종교적 신비로 줄이지 않습니다" },
    ],
    component: () => import("@/pages/articles/philosophy-history/classical-india-pramana-self-and-liberation"),
  },
  {
    slug: "islamic-philosophy-translation-illumination-and-being",
    title: "번역은 끝이 아니라 새 논쟁의 시작이었다: 이슬람 철학의 존재·빛·종합",
    subcategory: "philosophy-history-islamic",
    sections: [
      { id: "overview", title: "1. 번역된 책 한 권은 답이 아니라 새 질문을 만드는 재료였습니다" },
      { id: "black-box", title: "2. 번역·논증·직관·경전 해석의 네 지식 작업을 엽니다" },
      { id: "case", title: "3. 9세기·11세기·12세기·17세기의 네 정거장을 잇습니다" },
      { id: "picture", title: "4. 바그다드에서 라틴 서방과 이스파한까지 여러 갈래가 뻗습니다" },
      { id: "need", title: "5. 알가잘리 이후 철학이 끝났다는 이야기를 자료와 맞춰 봅니다" },
      { id: "names", title: "6. 번역·주석 사슬·조명적 앎·존재의 우위에 이름을 붙입니다" },
      { id: "mechanism", title: "7. 한 개념이 번역되고 반박되고 다시 종합되는 과정을 추적합니다" },
      { id: "source", title: "8. 아랍어 철학은 라틴 서방의 거의 모든 분야를 바꿨습니다" },
      { id: "comparison", title: "9. 수흐라와르디와 물라 사드라는 논증과 직관의 경계를 다시 그렸습니다" },
      { id: "limits", title: "10. 이슬람 철학을 한 종교·한 언어·한 문명 블록으로 만들지 않습니다" },
    ],
    component: () => import("@/pages/articles/philosophy-history/islamic-philosophy-translation-illumination-and-being"),
  },
  {
    slug: "early-modern-europe-doubt-experience-and-causality",
    title: "확실성에서 경험의 조건까지: 근대 유럽의 의심·인과·마음",
    subcategory: "philosophy-history-early-modern",
    sections: [
      { id: "overview", title: "1. 당구공이 열 번 움직였어도 열한 번째 원인을 눈으로 본 것은 아닙니다" },
      { id: "black-box", title: "2. 의심·경험·습관·경험의 조건을 나눕니다" },
      { id: "case", title: "3. 관찰 10회와 11번째 예측 사이의 빈칸을 찾습니다" },
      { id: "picture", title: "4. 종교전쟁·인쇄·실험과 기계론이 지식의 무대를 바꿉니다" },
      { id: "need", title: "5. 몸과 마음을 나눈 뒤 둘이 어떻게 작용하는지 설명해야 합니다" },
      { id: "names", title: "6. 방법적 의심·인과 습관·선험적 인과 범주에 이름을 붙입니다" },
      { id: "mechanism", title: "7. 같은 10회 기록을 데카르트·흄·칸트의 질문으로 다시 씁니다" },
      { id: "source", title: "8. MIT 과정은 정전과 동시대 비판자를 같은 읽기 훈련에 놓습니다" },
      { id: "comparison", title: "9. 흄이 흔든 인과를 칸트가 그대로 되돌린 것은 아닙니다" },
      { id: "limits", title: "10. 합리론 대 경험론 두 편으로 근대 철학 전체를 나누지 않습니다" },
    ],
    component: () => import("@/pages/articles/philosophy-history/early-modern-europe-doubt-experience-and-causality"),
  },
  {
    slug: "colonial-modernity-race-and-decolonization",
    title: "식민 질서는 사람의 자기 인식까지 바꾼다: 뒤부아·파농과 탈식민 철학",
    subcategory: "philosophy-history-colonial-modernity",
    sections: [
      { id: "overview", title: "1. 같은 지원서 100장도 누가 기준을 만들었는지에 따라 다르게 읽힙니다" },
      { id: "black-box", title: "2. 제도·타인의 시선·자기 이해·집단 행동을 나눕니다" },
      { id: "case", title: "3. 100명 중 40명의 준비 조건을 지우면 같은 시험도 다른 비용을 숨깁니다" },
      { id: "picture", title: "4. 노예제 폐지 뒤의 인종 질서와 식민 통치가 철학의 대상을 바꿉니다" },
      { id: "need", title: "5. 억압의 경험을 개인의 낮은 자존감으로 치료하면 제도가 남습니다" },
      { id: "names", title: "6. 이중의식·식민 주체 형성·탈식민 실천에 이름을 붙입니다" },
      { id: "mechanism", title: "7. 지원서에서 시선이 만들어지고 다시 제도로 돌아가는 경로를 봅니다" },
      { id: "source", title: "8. 뒤부아의 이중의식은 타고난 분열이 아니라 억압적 환경에서 생깁니다" },
      { id: "comparison", title: "9. 파농은 식민 폭력이 독립 뒤의 정치와 문화에도 남는다고 봅니다" },
      { id: "limits", title: "10. 뒤부아와 파농을 모든 흑인·식민 경험의 한 목소리로 만들지 않습니다" },
    ],
    component: () => import("@/pages/articles/philosophy-history/colonial-modernity-race-and-decolonization"),
  },
  {
    slug: "medieval-translation-reason-and-revelation",
    title: "중세의 책은 여러 방향으로 이동했다: 번역·문답·이성과 계시",
    subcategory: "philosophy-history-medieval",
    sections: [
      {
        id: "overview",
        title: "1. 같은 질문이 네 언어의 책상에서 서로 다른 문제가 됩니다",
      },
      { id: "black-box", title: "2. 원문·번역·권위·논증의 네 층을 엽니다" },
      {
        id: "case",
        title: "3. 한 질문이 세 번 옮겨질 때 생기는 네 기록을 비교합니다",
      },
      {
        id: "picture",
        title:
          "4. 아랍어에서 히브리어와 라틴어로 뻗고 다시 서로 읽는 그물을 봅니다",
      },
      {
        id: "need",
        title:
          "5. 이성과 계시를 서로 싸우는 두 진영으로 놓으면 실제 선택이 사라집니다",
      },
      {
        id: "names",
        title: "6. 번역·주석망·스콜라식 문답·부정 신학에 이름을 붙입니다",
      },
      {
        id: "mechanism",
        title: "7. ‘세계의 시작’ 주장을 질문·반론·답변·경계로 추적합니다",
      },
      {
        id: "source",
        title:
          "8. 중세 철학 개관은 네 언어 전통과 서로 되돌아간 번역을 함께 봅니다",
      },
      {
        id: "comparison",
        title:
          "9. 마이모니데스는 철학과 율법을 잇되 인간 지식의 한계도 남겼습니다",
      },
      {
        id: "limits",
        title:
          "10. 중세 철학을 라틴 기독교나 세 종교의 조화 이야기로 줄이지 않습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/philosophy-history/medieval-translation-reason-and-revelation"),
  },
  {
    slug: "song-ming-confucianism-pattern-heartmind-and-action",
    title: "안다는 것은 언제 행동이 되는가: 송명 유학의 이치·마음·지행합일",
    subcategory: "philosophy-history-song-ming",
    sections: [
      {
        id: "overview",
        title:
          "1. 곡물 100자루 가운데 썩은 자루를 찾는 일이 앎과 행동의 문제가 됩니다",
      },
      {
        id: "black-box",
        title: "2. 이치·구체적 기운·마음·실천의 네 층을 엽니다",
      },
      {
        id: "case",
        title: "3. 10자루의 표본과 100자루의 책임을 같은 숫자로 쓰지 않습니다",
      },
      {
        id: "picture",
        title: "4. 불교·도가와의 논쟁에서 과거시험의 정전까지 긴 변화를 봅니다",
      },
      {
        id: "need",
        title:
          "5. 격물을 바깥 사물 수집이나 마음속 직감 하나로 줄이지 않습니다",
      },
      {
        id: "names",
        title: "6. 이치와 기·격물궁리·지행합일에 이름을 붙입니다",
      },
      {
        id: "mechanism",
        title: "7. 발견·욕망 검사·행동·되돌아보기를 한 바퀴로 묶습니다",
      },
      {
        id: "source",
        title:
          "8. 송명 유학 개관은 주희와 왕양명을 한 전통 안의 경쟁자로 봅니다",
      },
      {
        id: "comparison",
        title: "9. 왕양명에게 도덕적 앎은 행동을 일으키는 마음의 능력입니다",
      },
      {
        id: "limits",
        title:
          "10. 성리학을 동아시아 전체의 고정 질서나 복종 윤리로 만들지 않습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/philosophy-history/song-ming-confucianism-pattern-heartmind-and-action"),
  },
  {
    slug: "early-modern-india-new-nyaya-analysis-and-language",
    title: "모호한 문장을 관계 지도로 바꾸다: 초기 근대 인도의 새 나이야",
    subcategory: "philosophy-history-new-nyaya",
    sections: [
      {
        id: "overview",
        title:
          "1. ‘연못 옆 나무의 땅’이라는 말은 경계를 하나도 확정하지 못합니다",
      },
      { id: "black-box", title: "2. 대상·한정자·관계·인식 경로를 엽니다" },
      {
        id: "case",
        title: "3. 땅 네 구획과 표식 세 개를 관계 문장으로 다시 씁니다",
      },
      {
        id: "picture",
        title: "4. 강게샤에서 라구나타·가다다라까지 분석 언어가 정교해집니다",
      },
      {
        id: "need",
        title: "5. 분석이라는 이름을 20세기 영미 철학의 전유물로 두지 않습니다",
      },
      {
        id: "names",
        title: "6. 새 나이야·한정 관계·인식 사건 분석에 이름을 붙입니다",
      },
      {
        id: "mechanism",
        title: "7. 후보를 좁히고 권리 종류를 붙인 뒤 증거 실패를 다시 찾습니다",
      },
      {
        id: "source",
        title:
          "8. 초기 근대 인도 분석 철학은 네 세기 동안 여러 분야에 쓰였습니다",
      },
      {
        id: "comparison",
        title:
          "9. 분석은 쪼개기만이 아니라 숨은 관계와 전제를 드러내는 여러 방법입니다",
      },
      {
        id: "limits",
        title:
          "10. 새 나이야를 인도 전체나 현대 기호논리의 옛 이름으로 만들지 않습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/philosophy-history/early-modern-india-new-nyaya-analysis-and-language"),
  },
  {
    slug: "modern-methods-pragmatism-analysis-and-phenomenology",
    title: "고장 난 가로등을 세 번 묻다: 프래그머티즘·분석·현상학",
    subcategory: "philosophy-history-modern-methods",
    sections: [
      {
        id: "overview",
        title:
          "1. 고장 난 가로등 하나도 질문하는 방법에 따라 다른 사실을 보여 줍니다",
      },
      { id: "black-box", title: "2. 결과·개념·경험·역사의 네 층을 엽니다" },
      {
        id: "case",
        title: "3. 민원 10건과 세 번의 개입을 같은 실험표에 놓습니다",
      },
      {
        id: "picture",
        title:
          "4. 1870년대 프래그머티즘에서 여러 20세기 분석 방법으로 갈라집니다",
      },
      {
        id: "need",
        title:
          "5. 분석 대 대륙이라는 두 상자는 철학자가 실제로 한 일을 가립니다",
      },
      {
        id: "names",
        title: "6. 프래그머틱 격률·개념 분석·현상학적 기술에 이름을 붙입니다",
      },
      {
        id: "mechanism",
        title:
          "7. 고장 원인을 시험하고 기준을 고친 뒤 경험의 빠진 부분을 찾습니다",
      },
      {
        id: "source",
        title: "8. 프래그머티즘은 앎을 세계 안의 행위와 떼지 않습니다",
      },
      {
        id: "comparison",
        title:
          "9. 분석 철학과 현상학 모두 ‘분석’을 했지만 무엇을 보존할지가 달랐습니다",
      },
      {
        id: "limits",
        title:
          "10. 세 방법을 서구 철학 전체나 세계 철학의 현대화 기준으로 만들지 않습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/philosophy-history/modern-methods-pragmatism-analysis-and-phenomenology"),
  },
  {
    slug: "feminist-philosophy-standpoint-care-and-intersectionality",
    title: "누구의 경험이 보편에서 빠졌는가: 입장·돌봄·교차성의 철학",
    subcategory: "philosophy-history-feminist",
    sections: [
      {
        id: "overview",
        title:
          "1. 승진율 두 개만 비교하면 누구의 경험이 지워졌는지 알 수 없습니다",
      },
      {
        id: "black-box",
        title: "2. 규칙·사회적 위치·보이지 않는 노동·교차 권력을 엽니다",
      },
      {
        id: "case",
        title: "3. 여성 20%와 남성 30%라는 평균 아래 네 집단을 다시 엽니다",
      },
      {
        id: "picture",
        title:
          "4. 권리 요구에서 지식·돌봄·몸·교차성의 철학으로 범위가 넓어집니다",
      },
      {
        id: "need",
        title: "5. 주변 위치가 자동으로 더 참된 지식을 주는 것은 아닙니다",
      },
      {
        id: "names",
        title: "6. 입장 인식론·돌봄 윤리·교차성에 이름을 붙입니다",
      },
      {
        id: "mechanism",
        title:
          "7. 승진 장부에서 빠진 노동과 교차 집단, 결정 권한을 다시 넣습니다",
      },
      {
        id: "source",
        title:
          "8. 페미니즘 철학은 기존 분야에 여성을 더하는 데서 멈추지 않습니다",
      },
      {
        id: "comparison",
        title:
          "9. 교차성은 단일 축 법과 통계가 흑인 여성을 놓친 문제에서 구체화됐습니다",
      },
      {
        id: "limits",
        title:
          "10. 페미니즘 철학을 서구 여성의 한 역사나 모든 차이를 푸는 만능 틀로 만들지 않습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/philosophy-history/feminist-philosophy-standpoint-care-and-intersectionality"),
  },
  {
    slug: "indigenous-land-and-latin-american-liberation",
    title:
      "빈 땅이라는 지도는 무엇을 지우는가: 원주민의 땅과 라틴아메리카 해방 철학",
    subcategory: "philosophy-history-indigenous-latin",
    sections: [
      {
        id: "overview",
        title:
          "1. 지도에 빈 땅으로 표시된 100헥타르는 실제로 비어 있지 않을 수 있습니다",
      },
      { id: "black-box", title: "2. 지도·관계·권한·지식의 네 층을 엽니다" },
      {
        id: "case",
        title: "3. 60·20·20의 이용을 더하면 ‘빈 땅 100’이라는 분류가 깨집니다",
      },
      {
        id: "picture",
        title:
          "4. 정복의 토지 명명에서 독립·개발·해방 철학까지 긴 충돌을 봅니다",
      },
      {
        id: "need",
        title:
          "5. 토착 지식을 자연 친화적 지혜 한 문장으로 칭찬하면 정치와 차이가 사라집니다",
      },
      {
        id: "names",
        title: "6. 땅에 근거한 규범·식민적 지움·해방 철학에 이름을 붙입니다",
      },
      {
        id: "mechanism",
        title: "7. 개발 지도에 공동체의 계절·법·동의 기록을 다시 겹칩니다",
      },
      {
        id: "source",
        title: "8. 식민주의 개관은 정착 식민주의를 계속되는 구조로 봅니다",
      },
      {
        id: "comparison",
        title:
          "9. 라틴아메리카 해방 철학은 보편을 말해 온 위치 자체를 묻습니다",
      },
      {
        id: "limits",
        title:
          "10. 원주민 사상과 라틴아메리카 철학을 같은 지역 이름으로 합치지 않습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/philosophy-history/indigenous-land-and-latin-american-liberation"),
  }
];
