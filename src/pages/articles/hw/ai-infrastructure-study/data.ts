import type { AiInfrastructureArticleData } from "./Article";
import {
  b300BlueprintDepth,
  commissioningAcceptanceDepth,
  rackPowerCoolingDepth,
  schedulerChoiceDepth,
  softwareCompatibilityDepth,
  storageIoDepth,
} from "./depthData";

export const b300BlueprintData: AiInfrastructureArticleData = {
  engineeringDepth: b300BlueprintDepth,
  formulas: [
    {
      section: "case",
      content: {
        question: "GPU 128개를 8-GPU 노드로 구성하면 연산 노드가 몇 대 필요한가요?",
        idea: "전체 GPU 수를 노드당 GPU 수로 나눕니다. 일부 GPU만 남더라도 물리 노드 한 대가 더 필요하므로 일반식에서는 올림합니다.",
        formula: String.raw`N_{\mathrm{node}}=\left\lceil\frac{N_{\mathrm{GPU}}}{G_{\mathrm{node}}}\right\rceil=\left\lceil\frac{128}{8}\right\rceil=16`,
        annotatedFormula: String.raw`\underbrace{N_{\mathrm{node}}}_{\text{필요한 연산 노드}}=\left\lceil\frac{\overbrace{N_{\mathrm{GPU}}}^{\text{전체 GPU}}}{\underbrace{G_{\mathrm{node}}}_{\text{노드당 GPU}}}\right\rceil=\left\lceil\frac{128}{8}\right\rceil=16`,
        operations: [
          { expression: String.raw`\frac{128}{8}=16`, annotation: "전체 GPU를 노드 한 대의 GPU 수로 나눕니다." },
          { expression: String.raw`\left\lceil 16\right\rceil=16`, annotation: "분수 노드는 설치할 수 없으므로 결과를 노드 단위로 올림합니다." },
        ],
        terms: [
          { symbol: String.raw`N_{\mathrm{node}}`, name: "연산 노드 수", description: "GPU 서버로 실제 설치할 최소 대수입니다." },
          { symbol: String.raw`N_{\mathrm{GPU}}`, name: "전체 GPU 수", description: "이 사례에서 사업 조건으로 주어진 128개입니다." },
          { symbol: String.raw`G_{\mathrm{node}}`, name: "노드당 GPU 수", description: "선택한 기준 구성의 8개입니다." },
        ],
        assumptions: ["모든 연산 노드는 같은 8-GPU 구성입니다.", "예비 노드와 유지보수 여유분은 이 최소 수량에 포함하지 않습니다."],
        interpretation: "최소 연산 노드는 16대입니다. 이 계산만으로 스위치·스토리지·예비품·랙 수량까지 결정되지는 않습니다.",
      },
    },
  ],
  sections: [
    { id: "overview", level: "S", title: "1. B300 128개라는 주문만 먼저 도착했습니다", bridge: "장비 이름과 수량은 있지만 성공 조건은 비어 있습니다. 무엇을 먼저 물어야 설계를 시작할 수 있는지 따라갑니다.", paragraphs: [
      "(가정) 고객이 ‘싱가포르에 B300 128개를 설치해 달라’고 요청했습니다. 견적 일정은 잡혔지만 어떤 모델을 언제까지 학습할지, 128개를 한 작업이 함께 쓸지, 64개로 먼저 가동할 수 있는지, 장애 뒤 몇 시간 안에 돌아와야 하는지는 적혀 있지 않습니다.",
      "이 상태에서 서버 16대와 스위치 수를 먼저 쓰면 그럴듯한 장비 목록은 만들 수 있습니다. 그러나 저장 처리량, 포트 수, 랙 전력, 냉각과 검수 기준은 모두 빈칸으로 남습니다. 이 글은 ‘128개’라는 주문을 고객의 완료 조건과 발주 가능한 구성으로 바꾸는 순서만 따라갑니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 요구사항이 여섯 설계 원장으로 내려갑니다", bridge: "목표를 숫자로 바꿨습니다. 이제 숫자가 서로 다른 담당자의 설계로 어떻게 전달되는지 봅니다.", paragraphs: [
      "입력은 모델과 데이터, 목표 완료 시간, 사용자 수, 가용성, 예산과 확장 시점입니다. 출력은 연산 노드, 노드 사이 통신, 데이터 이동, 랙 전력과 열 제거, 운영 소프트웨어, 구축·검수 항목입니다.",
      "어느 한 원장만 먼저 확정하면 나머지가 따라오지 못할 수 있습니다. 예를 들어 노드 수를 늘리면 통신 포트와 케이블, 저장 처리량, 랙 수와 전력도 함께 늘어납니다. 각 결정에는 입력 근거와 아직 모르는 값을 같이 적어야 합니다.",
    ] },
    { id: "case", level: "0", title: "3. GPU 128개를 8개짜리 노드 16대로 셉니다", bridge: "전체 수량을 실제 설치 단위로 나눴습니다. 이제 이 단위에서 메모리·망·시설 수량을 검산합니다.", paragraphs: [
      "(가정) B300 GPU 128개를 GPU 8개짜리 노드로 구성하면 16노드입니다. 공개 HGX B300 기준인 GPU당 288GB를 쓰면 노드당 약 2.3TB, 전체 HBM은 36,864GB입니다. 이 값은 모델 하나가 쓸 수 있는 연속 메모리가 아니라 128개 장치에 나뉜 총량입니다.",
      "노드마다 동서 통신용 ConnectX-8이 8개라면 동서 어댑터는 128개입니다. 북남 트래픽용 DPU는 노드당 하나라면 16개입니다. 이 셈은 기준 구성을 펼친 수량이며 실제 OEM 섀시·스위치·케이블 BOM은 선택한 토폴로지와 포트 분할 방식으로 다시 확정합니다.",
    ] },
    { id: "picture", level: "1", title: "4. 학습·추론·혼합 용도에서 망 구성이 갈립니다", bridge: "같은 16노드도 워크로드에 따라 중요한 통로가 달라짐을 확인했습니다. 선택 기준을 세 갈래로 나눕니다.", paragraphs: [
      "하나의 학습 작업이 16노드에 걸치면 노드 사이 집단 통신이 자주 일어나므로 동서 통신망의 지연·처리량·무손실 동작을 우선합니다. 서로 독립적인 추론 복제본만 놓는다면 모든 노드가 촘촘하게 통신할 필요가 줄어 북남 요청과 저장 경로가 더 중요할 수 있습니다.",
      "혼합 환경에서는 한 망을 모든 트래픽에 공유할지, 계산·저장·관리 경로를 분리할지 결정해야 합니다. 분리는 장애와 혼잡의 영향을 줄이지만 스위치·광모듈·운영 대상이 늘어납니다.",
    ] },
    { id: "need", level: "2", title: "5. 결정과 미확정을 같은 표에서 분리합니다", bridge: "구성 선택이 서로 얽혀 있음을 봤습니다. 독단적인 숫자를 설계 근거로 바꾸는 최소 장치를 만듭니다.", paragraphs: [
      "요구사항표의 각 행에는 값, 출처, 담당자, 결정일, 변경 조건을 둡니다. ‘GPU 128개’는 사업 조건으로 고정됐더라도 워크로드 근거는 미확정으로 남길 수 있습니다. 모르는 값을 아는 척하지 않되, 어느 시험으로 닫을지도 함께 적습니다.",
      "이 방식은 실제 회사가 정석 절차로 결정하지 않았을 때 더 유용합니다. 당시 결정을 자신이 설계했다고 포장하지 않고, 공개 사양과 별도 가정으로 다시 검토한 안임을 분명히 할 수 있기 때문입니다.",
    ] },
    { id: "names", level: "3", title: "6. 기준 구성과 BOM에 이름을 붙입니다", bridge: "결정 근거를 적는 표를 만들었습니다. 이제 제안서에서 쓰는 두 산출물의 범위를 정확히 붙입니다.", paragraphs: [
      "요구사항에서 반복해 쓸 표준 묶음을 기준 구성(reference architecture)이라고 합니다. 장비·수량·부품 번호·라이선스·케이블·예비품을 발주 가능한 행으로 펼친 목록은 자재 명세서(Bill of Materials, BOM)입니다.",
      "기준 구성은 설계 출발점이지 고객 현장의 완성 설계가 아닙니다. BOM도 서버 수만 적는 표가 아닙니다. 광모듈 양 끝, 케이블 길이, 랙 부속, 전원 연결, 지원 기간과 설치 서비스까지 빠짐없이 닫혀야 합니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 고객 질문을 납품 가능한 구성으로 바꿉니다", bridge: "산출물의 이름을 붙였습니다. 이제 한 고객 질문을 BOM과 검수 기준으로 변환합니다.", paragraphs: [
      "먼저 학습·추론 구분, 모델 크기, 정밀도, 데이터량, 목표 완료 시간과 동시성을 묻습니다. MoE 모델이면 전체 가중치와 token당 활성 가중치를 나눠 적습니다. 전자는 저장·장치 상주량에, 후자는 계산·expert 통신량에 영향을 주지만 둘 다 context·batch·runtime state를 대신하지는 않습니다.",
      "다음으로 8-GPU 노드 한 대의 실측을 얻고 16노드에서 계산·통신·I/O가 어떻게 늘어나는지 검증합니다. 모든 BOM 행은 요구사항과 시험 항목에 연결합니다. Logic·HBM·package·NIC·전력 가운데 하나가 늦어질 때 막히는 시험도 같이 적어야 ‘보통 필요해서’ 넣은 장비 목록을 납품 계획으로 바꿀 수 있습니다.",
    ] },
    { id: "source", level: "5", title: "8. 공개 B300 기준 구성에 수량을 대입합니다", bridge: "변환 절차를 세웠습니다. NVIDIA 공개 기준 구성의 한 노드 사양을 16배로 펼쳐 봅니다.", paragraphs: [
      "NVIDIA HGX AI Factory 문서는 B300 노드에 GPU 8개, 동서용 ConnectX-8 8개, 북남용 BlueField-3 한 개, 최소 2TB 시스템 메모리를 둡니다. 본문의 16노드 예에서는 GPU 128개, 동서 어댑터 128개, DPU 16개, 시스템 메모리 최소 32TB가 기준선입니다. DGX B300 완제품은 user guide 기준 dual-port BlueField-3 DPU를 2장(2×400Gb/s) 싣기 때문에, DGX로 사면 DPU는 32개가 되고 HGX 권장안과 수량이 달라집니다.",
      "이 대입은 수량 누락을 찾는 출발점입니다. 모델 이름도 같은 방식으로 검증합니다. 실제 GLM-5.3-Flash의 320B total·18B active와 교육 과정의 25.7M 축소 모델은 구조 학습에는 연결되지만 같은 memory·성능 실측이 아닙니다. 32·64·128노드용 공식 스위치 표도 16노드에 단순히 절반 내지 않고 포트와 이중화, 확장 단위로 다시 설계합니다.",
    ] },
    { id: "comparison", level: "6", title: "9. 128개와 256개 확장 경계를 비교합니다", bridge: "16노드 기준선을 얻었습니다. 처음부터 32노드까지 열어 둘 때 무엇을 선투자할지 가릅니다.", paragraphs: [
      "GPU 256개는 같은 8-GPU 기준에서 32노드입니다. 서버는 두 배지만 스위치는 포트와 이중화 단위 때문에 정확히 두 배가 아닐 수 있습니다. 랙 공간·배전·냉각수·케이블 트레이는 나중에 늘리기 어려워 초기 여유를 둘 가치가 큽니다.",
      "반대로 모든 스위치·스토리지·라이선스를 첫날 32노드 크기로 사면 유휴 자본이 생깁니다. 첫 단계가 독립적으로 검수되고 두 번째 단계에서 교체 없이 증설되는 최소 공통 기반을 제안해야 합니다.",
    ] },
    { id: "limits", level: "7", title: "10. 이 설계는 실제 벤더 견적이 아닙니다", bridge: "확장안까지 만들었습니다. 마지막으로 공개 사례가 대신할 수 없는 현장 결정을 남깁니다.", paragraphs: [
      "이 글의 16노드 계산은 공개 HGX 기준과 설명용 가정을 결합한 역설계입니다. 실제 DGX인지 OEM HGX인지, Ethernet인지 InfiniBand인지, 공랭인지 액랭인지가 확정돼야 부품 번호·가격·납기·지원 범위가 나옵니다.",
      "면접에서는 ‘B300 128개를 설계했다’고 말하지 않습니다. 실제로 맡은 상위 플랫폼 범위와, 별도로 다시 만든 요구사항·BOM 검토안을 구분합니다. 이 구분 자체가 기술 범위와 증거의 경계를 아는 사람이라는 신뢰를 만듭니다.",
    ] },
  ],
  overviewFlow: { title: "고객 목표가 납품 구성으로 내려가는 경로", steps: [
    { actor: "업무 목표", movement: "완료 시간·동시성·데이터·확장·복구를 숫자로 적습니다.", receives: "검증 가능한 요구사항" },
    { actor: "통합 설계", movement: "연산·통신·저장·시설·운영을 같은 가정으로 맞춥니다.", receives: "16노드 기준 구성" },
    { actor: "납품 계약", movement: "각 부품을 시험 항목과 연결합니다.", receives: "BOM과 acceptance 기준" },
  ] },
  numericCase: { title: "GPU 128개를 설치 단위로 펼치기", steps: [
    { label: "연산 노드", value: "16대", detail: "128÷8" },
    { label: "전체 HBM", value: "36,864GB", detail: "128×288GB, 분산된 총량" },
    { label: "동서 어댑터", value: "128개", detail: "노드당 8개 기준" },
  ] },
  decision: { title: "워크로드가 먼저 바꾸는 구성", question: "128개가 한 작업을 함께 처리합니까, 독립 요청을 나눠 받습니까?", options: [
    { signal: "16노드가 한 학습 작업의 collective에 참여합니다.", choose: "동서 fabric 우선", why: "노드 사이 통신의 지연·처리량·혼잡이 전체 GPU 대기를 만듭니다." },
    { signal: "노드별 추론 복제본이 독립 요청을 처리합니다.", choose: "북남·서비스 경로 우선", why: "요청 분산과 저장 접근, 장애 격리가 더 직접적인 병목입니다." },
    { signal: "학습과 추론을 같은 자원에서 시간대별로 운영합니다.", choose: "분리된 망과 운영 정책", why: "트래픽과 점유 정책의 충돌을 측정하고 작업별로 격리합니다." },
  ] },
  terms: { title: "제안의 두 핵심 산출물", items: [
    { term: "기준 구성", description: "검증된 노드·망·저장·소프트웨어 조합을 반복 가능한 출발점으로 묶은 설계입니다.", example: "8-GPU 노드, 동서 8개 어댑터, 북남 DPU 한 개를 한 단위로 둡니다.", boundary: "현장 전력·케이블·워크로드를 반영한 상세 설계 자체는 아닙니다." },
    { term: "자재 명세서(BOM)", description: "발주·설치할 장비와 부속을 수량·부품 번호·지원 조건까지 펼친 목록입니다.", example: "서버 16대뿐 아니라 광모듈 양 끝과 케이블, 예비품을 셉니다.", boundary: "가격표만으로 요구사항 충족과 상호 호환이 증명되지는 않습니다." },
    { term: "추적성", description: "요구사항·설계 결정·BOM 행·시험 결과가 서로 어느 항목인지 따라갈 수 있는 성질입니다.", example: "‘32노드 무중단 증설’ 요구를 여유 포트와 증설 시험에 연결합니다.", boundary: "문서 링크가 있어도 시험 결과와 변경 이력이 없으면 닫히지 않습니다." },
  ] },
  algorithm: { title: "128 GPU 요구를 제안서로 변환하기", input: ["GPU=128(사업 조건)", "8-GPU 노드", "학습·추론 미확정", "향후 256 GPU"], steps: [
    { code: "요구사항 = 목표_시간·동시성·데이터·가용성·확장으로_분해", note: "모르는 값은 미확정과 담당자로 남깁니다." },
    { code: "노드_수 = ceil(128 / 8)", note: "16노드와 노드당 자원을 기준선으로 만듭니다." },
    { code: "망·저장·시설 = 워크로드_트래픽과_피크에서_산정", note: "평균과 피크, 정상과 고장 상태를 나눕니다." },
    { code: "BOM_각_행 -> 요구사항_ID + 시험_ID", note: "부품을 넣은 이유와 확인 방법을 연결합니다." },
    { code: "16→32노드_증설에서_교체_항목을_찾는다", note: "선투자와 유휴 비용을 비교합니다." },
  ], output: "요구사항표 + 16노드 기준 구성 + BOM 초안 + 32노드 확장안", repeatUntil: "미확정 요구가 시험이나 고객 결정으로 닫힐 때마다 다시 산정합니다." },
  sources: [
    { source: "NVIDIA HGX AI Factory · Components", excerpt: "Eight NVIDIA B300 GPUs on an HGX B300 baseboard", application: "한 노드를 GPU 8개 단위로 잡고 128개를 16노드로 나누는 공개 근거로 씁니다.", citation: "NVIDIA, HGX AI Factory Components", href: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/components.html", note: "GPU·메모리·ConnectX-8·BlueField-3·로컬 NVMe 등 HGX B300 한 노드의 공개 기준을 설명합니다." },
    { source: "NVIDIA HGX AI Factory · Logical Architecture", excerpt: "This Enterprise RA is built on scalable units (SU) based on 4 compute nodes.", application: "확장을 임의의 한 노드가 아니라 검증 단위와 스위치 포트 예산으로 계획하는 기준으로 씁니다.", citation: "NVIDIA, HGX AI Factory Logical Architecture", href: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/network-logical-architecture.html", note: "확장 단위와 동서·북남·관리망의 분리를 설명하는 공식 reference architecture입니다." },
  ],
  review: [
    "GPU 128개가 16노드가 되는 계산과 그 숫자가 아직 말하지 않는 것은 무엇입니까? (답: 3절)",
    "기준 구성과 BOM은 어떻게 다르며 왜 요구사항 ID가 필요합니까? (답: 6·7절)",
    "실제 회사 설계와 개인 역설계 사례를 면접에서 어떻게 구분해야 합니까? (답: 10절)",
  ],
};

export const softwareCompatibilityData: AiInfrastructureArticleData = {
  engineeringDepth: softwareCompatibilityDepth,
  formulas: [
    {
      section: "case",
      content: {
        question: "16노드가 하나의 작업에 들어가기 전에 어떤 조건을 모두 통과해야 하나요?",
        idea: "각 노드의 소프트웨어 명세가 승인 기준과 일치하고 사전 통신 시험도 통과해야 합니다. 하나라도 거짓이면 16노드 작업을 시작하지 않습니다.",
        formula: String.raw`A_{\mathrm{cluster}}=\bigwedge_{n=1}^{16}\left[(M_n=M_{\mathrm{base}})\land(C_n=1)\right]`,
        annotatedFormula: String.raw`\underbrace{A_{\mathrm{cluster}}}_{\text{작업 투입 가능}}=\bigwedge_{n=1}^{16}\left[\underbrace{(M_n=M_{\mathrm{base}})}_{\text{명세 일치}}\land\underbrace{(C_n=1)}_{\text{사전 시험 통과}}\right]`,
        operations: [
          { expression: String.raw`M_n=M_{\mathrm{base}}`, annotation: "노드의 OS·커널·펌웨어·드라이버·라이브러리 명세를 승인 기준과 비교합니다." },
          { expression: String.raw`C_n=1`, annotation: "해당 노드가 계산과 RDMA·NCCL 사전 시험을 통과했음을 뜻합니다." },
          { expression: String.raw`\bigwedge_{n=1}^{16}`, annotation: "16대 가운데 한 대라도 조건을 만족하지 않으면 전체 입장을 막습니다." },
        ],
        terms: [
          { symbol: String.raw`A_{\mathrm{cluster}}`, name: "클러스터 입장 판정", description: "이번 16노드 작업을 시작해도 되는지를 나타냅니다." },
          { symbol: String.raw`M_n`, name: "노드별 명세", description: "패키지 이름만이 아니라 펌웨어부터 컨테이너까지의 버전 지문입니다." },
          { symbol: String.raw`M_{\mathrm{base}}`, name: "승인 기준 명세", description: "시험을 마치고 변경 관리 대상으로 고정한 조합입니다." },
          { symbol: String.raw`C_n`, name: "사전 시험 결과", description: "통과는 1, 실패는 0으로 둔 단순 판정입니다." },
        ],
        assumptions: ["16대가 하나의 분산 작업에 동시에 참여합니다.", "승인된 예외는 별도 명세와 시험 결과로 관리합니다."],
        interpretation: "15대가 같아도 한 대가 다르면 16노드 작업의 재현성을 보장할 수 없습니다. 단순한 설치 성공률 계산이 아니라 작업 투입 전 gate입니다.",
      },
    },
  ],
  sections: [
    { id: "overview", level: "S", title: "1. 열다섯 대는 통과했는데 마지막 한 대에서 작업이 멈췄습니다", bridge: "같은 컨테이너를 썼는데도 한 노드가 전체 작업을 막았습니다. 컨테이너 바깥의 두 실행 경로를 엽니다.", paragraphs: [
      "(가정) B300 16노드에 같은 컨테이너 이미지를 배포했습니다. 한 노드 시험은 모두 성공했지만 16노드 작업은 rank 하나가 통신을 시작하지 못해 멈췄습니다. 확인해 보니 그 노드만 커널과 NIC 펌웨어 조합이 달랐고, 컨테이너 안 통신 라이브러리는 조용히 다른 경로로 물러났습니다.",
      "여기서 질문은 ‘어느 패키지가 최신인가’가 아닙니다. 한 작업이 계산 장치를 열고 다른 노드의 메모리와 통신할 때 실제로 어떤 층을 지나며, 열여섯 대가 같은 조합임을 어떤 출력과 시험으로 증명할 것인지가 핵심입니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 계산 경로와 통신 경로를 나눠 봅니다", bridge: "호환성이 한 줄 버전이 아님을 확인했습니다. 어떤 층이 계산과 통신을 각각 떠받치는지 봅니다.", paragraphs: [
      "계산 경로는 프로그램이 사용자 라이브러리를 거쳐 호스트의 장치 드라이버와 가속기를 사용합니다. 통신 경로는 여러 프로세스의 집단 연산이 네트워크 라이브러리, RDMA 사용자 공간, 커널 모듈, NIC 펌웨어를 지나 다른 노드에 닿습니다.",
      "두 경로는 운영체제와 커널을 공유합니다. 그래서 커널만 올려도 GPU 드라이버와 NIC 모듈이 다시 빌드되거나 로드되지 않을 수 있습니다. 업데이트 전후에 패키지 이름보다 실제 경로의 동작을 시험해야 합니다.",
    ] },
    { id: "case", level: "0", title: "3. 16대 중 한 대의 버전 차이가 전체 작업을 막습니다", bridge: "두 경로를 분리했습니다. 같은 작업에 참여하는 노드 하나가 달라졌을 때 영향을 숫자로 봅니다.", paragraphs: [
      "(가정) 16노드가 하나의 학습 작업에 참여하고 15대는 같은 이미지 A, 한 대만 이미지 B라고 하겠습니다. 그 한 대에서 네트워크 장치 이름이나 집단 통신 라이브러리의 동작이 달라 communicator 초기화가 멈추면 16대의 GPU 128개가 모두 기다립니다.",
      "따라서 배포 성공률 15/16=93.75%는 충분하지 않습니다. 한 작업의 최소 단위가 16노드라면 16/16이 같은 manifest와 preflight를 통과해야 합니다. 차이가 허용되는 항목은 예외 사유와 호환 시험을 별도로 남깁니다.",
    ] },
    { id: "picture", level: "1", title: "4. 바꿀 수 있는 층과 묶어서 바꿀 층을 가릅니다", bridge: "한 노드의 차이가 전체 작업을 막는 이유를 봤습니다. 독립 변경과 결합 변경을 구분합니다.", paragraphs: [
      "애플리케이션과 Python 패키지는 컨테이너 이미지로 비교적 자주 바꿀 수 있습니다. 그러나 커널·GPU 드라이버·NIC 커널 모듈·펌웨어는 호스트와 장치 경계에 걸쳐 있습니다. 따라서 유지보수 창과 재부팅, rollback 이미지를 함께 준비해야 합니다.",
      "컨테이너는 사용자 공간의 재현성을 높이지만 호스트 커널과 실제 장치 펌웨어를 담지 않습니다. 따라서 이미지 digest와 별도로 호스트 manifest가 필요합니다.",
    ] },
    { id: "need", level: "2", title: "5. 컨테이너만 고정해서는 호스트 차이를 못 막습니다", bridge: "변경 범위를 나눴습니다. 이제 컨테이너가 해결하는 부분과 남겨 두는 부분을 분명히 합니다.", paragraphs: [
      "컨테이너 안의 CUDA runtime과 프레임워크를 고정해도 GPU kernel driver는 호스트에서 제공합니다. NIC의 RDMA kernel module과 펌웨어도 호스트에 남습니다. 같은 컨테이너가 두 노드에서 다른 통신 경로를 고를 수 있습니다.",
      "그래서 재현 가능한 실행 단위는 image digest 하나가 아니라 host image ID, kernel, GPU driver, CUDA user libraries, NCCL, NIC stack, NIC firmware, container runtime과 scheduler 설정을 묶은 compatibility manifest입니다.",
    ] },
    { id: "names", level: "3", title: "6. NCCL·DOCA·OFED가 맡는 자리를 붙입니다", bridge: "호스트와 컨테이너의 경계를 봤습니다. 이제 자주 섞이는 세 이름을 실제 경로의 자리로 구분합니다.", paragraphs: [
      "여러 GPU가 합계·복사·모으기 같은 집단 연산을 수행하도록 토폴로지에 맞는 경로를 고르는 라이브러리가 NVIDIA Collective Communications Library(NCCL, ‘니클’)입니다. NCCL은 스케줄러가 아니며 케이블과 스위치를 대신하지 않습니다.",
      "OpenFabrics Enterprise Distribution(OFED)은 RDMA용 커널 드라이버·사용자 라이브러리·도구 묶음을 가리킵니다. NVIDIA Data Center Infrastructure-on-a-Chip Architecture(DOCA)는 BlueField·ConnectX용 더 넓은 SDK와 패키지 체계입니다. 현재 `doca-ofed` profile은 MLNX_OFED와 비슷한 드라이버·도구만 설치하고 추가 DOCA 기능은 넣지 않습니다.",
      "이름에 같은 OFED가 붙어도 만든 곳은 둘입니다. OpenFabrics Alliance는 OFED를 linux-rdma와 kernel.org 코드에서 가져온 OpenFabrics 배포판이라고 소개합니다. MLNX_OFED는 NVIDIA가 자사 network adapter 전체에 맞춘 별도 software stack입니다. NVIDIA 문서는 MLNX_OFED가 DOCA-OFED로 옮겨 갔고, 2024년 10월 LTS가 마지막 단독 release이며, 2025년 1월부터 새 기능은 DOCA-OFED에만 들어간다고 적습니다(2026-10-09 확인). 그래서 원장에는 ‘OFED’라고만 쓰지 않고 어느 배포판의 몇 버전인지까지 적습니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 한 행짜리 호환성 원장으로 검증합니다", bridge: "각 이름의 자리를 찾았습니다. 이제 버전 목록을 실제 변경 절차로 바꿉니다.", paragraphs: [
      "먼저 벤더가 함께 검증한 OS release를 기준 행으로 잡습니다. 그 행에 kernel, GPU driver, system firmware, NIC firmware, CUDA, NCCL, DOCA-OFED, container runtime과 orchestration version을 적고 package repository snapshot과 image digest를 붙입니다.",
      "canary 한 대에서 재부팅·장치 열거·단일 GPU·노드 내부 P2P·노드 사이 RDMA·NCCL collective를 차례로 시험합니다. 그다음 한 작은 작업 묶음, 전체 16노드로 넓힙니다. 실패하면 어느 층에서 처음 달라졌는지 원장 diff로 찾습니다.",
    ] },
    { id: "source", level: "5", title: "8. DGX OS release 조합을 원장에 옮깁니다", bridge: "원장 작성 순서를 세웠습니다. 기준일이 있는 실제 release 조합을 예로 옮겨 봅니다.", paragraphs: [
      "2026년 10월 8일 확인한 DGX OS 7 release notes는 현재 버전 표에서 GPU driver, CUDA Toolkit, DOCA OFED, NCCL, kernel과 firmware 조합을 함께 제공합니다. 이 글은 숫자 하나를 추천하는 대신 그 표의 한 행 전체를 검토 단위로 삼습니다.",
      "문서의 current 표는 이후 바뀔 수 있습니다. 제안서에는 확인일과 release ID를 적고, 운영 배포에는 실제 repository snapshot과 노드 manifest를 남겨야 같은 이름의 ‘최신’이 달라지는 일을 막을 수 있습니다.",
    ] },
    { id: "comparison", level: "6", title: "9. DOCA profile을 필요한 기능으로 고릅니다", bridge: "검증된 release 행을 봤습니다. 같은 DOCA라는 이름 안에서 설치 범위를 선택합니다.", paragraphs: [
      "NVIDIA의 현재 profile 문서는 ConnectX 환경에는 networking profile을 권장하고, MLNX_OFED와 같은 드라이버·도구만 필요하면 `doca-ofed`, RoCE만 필요하면 `doca-roce`를 제시합니다. BlueField의 추가 가속 기능을 쓸 때는 더 넓은 profile이 필요할 수 있습니다.",
      "패키지가 많을수록 좋은 것은 아닙니다. 쓰지 않는 사용자 공간 기능은 업데이트와 검증 범위를 늘립니다. 필요한 NIC·DPU 기능, 지원 OS와 firmware를 먼저 정하고 가장 작은 검증 profile을 고릅니다.",
    ] },
    { id: "limits", level: "7", title: "10. 최신 버전이 곧 안전한 조합은 아닙니다", bridge: "profile 선택까지 마쳤습니다. 마지막으로 호환성 표가 대신하지 못하는 실제 시험을 남깁니다.", paragraphs: [
      "CUDA의 minor version compatibility는 모든 조합과 모든 기능의 동작을 보장하는 말이 아닙니다. 애플리케이션이 새 driver 기능을 요구하거나 프레임워크 wheel이 특정 CUDA build를 기대하면 별도 확인이 필요합니다.",
      "공식 matrix를 통과한 뒤에도 실제 모델, message size, topology에서 correctness·성능·장시간 안정성을 측정해야 합니다. 원장은 시작 조건을 고정하고 rollback을 가능하게 할 뿐, 현장 acceptance test를 대신하지 않습니다.",
    ] },
  ],
  overviewFlow: { title: "한 작업이 계산하고 다른 노드와 통신하는 두 경로", steps: [
    { actor: "사용자 실행물", movement: "컨테이너의 프레임워크와 사용자 라이브러리를 읽습니다.", receives: "고정된 image digest" },
    { actor: "호스트 경계", movement: "커널·GPU/NIC 드라이버가 실제 장치를 엽니다.", receives: "검증된 host manifest" },
    { actor: "장치와 통신", movement: "GPU 계산과 NIC 전송이 firmware를 거쳐 완료됩니다.", receives: "단일·P2P·RDMA·collective 결과" },
  ] },
  numericCase: { title: "16노드 한 작업의 호환성 문턱", steps: [
    { label: "동일 이미지", value: "15대", detail: "host manifest A" },
    { label: "다른 이미지", value: "1대", detail: "manifest B" },
    { label: "작업 가능", value: "0개", detail: "16/16 preflight가 문턱" },
  ] },
  decision: { title: "변경 범위를 고르는 기준", question: "이번 변경은 사용자 공간 안에 머무릅니까, 호스트와 장치를 함께 바꿉니까?", options: [
    { signal: "Python·framework·CUDA user library만 바뀝니다.", choose: "새 container canary", why: "호스트 manifest를 유지하고 이미지별 correctness·성능을 비교합니다." },
    { signal: "kernel·GPU/NIC driver 또는 firmware가 바뀝니다.", choose: "host image rollout", why: "재부팅·장치 열거·통신과 rollback image까지 한 변경으로 시험합니다." },
    { signal: "BlueField 기능 없이 ConnectX RDMA만 필요합니다.", choose: "최소 DOCA profile", why: "필요 없는 SDK 구성요소를 줄여 검증 표면을 좁힙니다." },
  ] },
  terms: { title: "통신 경로의 세 이름", items: [
    { term: "NCCL", description: "여러 NVIDIA GPU 사이의 broadcast·all-reduce 같은 collective를 토폴로지에 맞춰 실행하는 라이브러리입니다.", example: "16노드의 gradient 합계를 ring 또는 tree 경로로 전달합니다.", boundary: "자원 큐·사용자 우선순위를 관리하는 scheduler가 아닙니다." },
    { term: "OFED", description: "RDMA를 위해 커널 드라이버와 사용자 라이브러리, 진단 도구를 묶은 배포판 계열입니다.", example: "mlx5 장치를 열고 verbs 기반 통신 시험을 수행합니다.", boundary: "NCCL collective 의미나 Ethernet fabric 설정 전체를 대신하지 않습니다." },
    { term: "DOCA", description: "BlueField DPU와 ConnectX를 위한 드라이버·SDK·도구를 profile별로 제공하는 NVIDIA 패키지 체계입니다.", example: "드라이버만 필요하면 doca-ofed, networking 기능이면 더 넓은 profile을 검토합니다.", boundary: "ConnectX가 모든 BlueField 전용 DOCA library를 실행한다는 뜻은 아닙니다." },
  ] },
  algorithm: { title: "호환성 원장을 바꾸는 순서", input: ["16노드 host manifest", "container digest", "공식 release matrix", "rollback image"], steps: [
    { code: "기준_행 = OS+kernel+GPU_driver+firmware+NIC_stack", note: "현재 정상 조합을 먼저 snapshot합니다." },
    { code: "후보_행 = 공식_matrix에서_한_조합으로_고정", note: "패키지를 각자 최신으로 올리지 않습니다." },
    { code: "canary = 재부팅→장치→단일_GPU→P2P→RDMA→NCCL", note: "처음 실패한 층을 기록합니다." },
    { code: "1대→4대→16대로_같은_시험을_확대", note: "단일 노드 성공을 클러스터 성공으로 보지 않습니다." },
    { code: "실패하면_기준_행과_diff하고_rollback", note: "변경 창 안에 정상 조합으로 돌아갑니다." },
  ], output: "버전·firmware·image digest와 시험 결과가 묶인 compatibility ledger", repeatUntil: "모든 노드가 같은 manifest와 acceptance threshold를 통과할 때까지 반복합니다." },
  sources: [
    { source: "NVIDIA DGX OS 7 Release Notes", excerpt: "Carefully review release information and advisories", application: "각 패키지의 최신값이 아니라 release notes가 함께 제시한 OS·driver·CUDA·DOCA·firmware 조합을 원장 한 행으로 묶습니다.", citation: "NVIDIA, DGX OS 7 Release Notes", href: "https://docs.nvidia.com/dgx/dgx-os-7-user-guide/release_notes.html", note: "기준일별 DGX 지원 장비와 kernel·driver·CUDA·NCCL·DOCA OFED·firmware 조합을 함께 제시한 공식 문서입니다." },
    { source: "NVIDIA DOCA Profiles", excerpt: "doca-ofed (no additional DOCA functionality)", application: "DOCA를 하나의 기능으로 보지 않고 드라이버 전용·RoCE 전용·networking·전체 profile로 나눠 필요한 범위를 고릅니다.", citation: "NVIDIA, DOCA Profiles", href: "https://docs.nvidia.com/doca/sdk/doca-profiles/", note: "DOCA Host profile의 포함 구성요소, 권장 device와 기능 경계를 비교하는 공식 문서입니다." },
  ],
  review: [
    "16대 중 한 대의 차이가 GPU 128개 전체를 기다리게 하는 이유는 무엇입니까? (답: 3절)",
    "NCCL·OFED·DOCA는 통신 경로에서 각각 어느 자리를 맡습니까? (답: 6절)",
    "컨테이너 digest만으로 재현성을 닫을 수 없는 이유는 무엇입니까? (답: 4·5절)",
  ],
};

export const schedulerChoiceData: AiInfrastructureArticleData = {
  engineeringDepth: schedulerChoiceDepth,
  sections: [
    { id: "overview", level: "S", title: "1. GPU는 남아 있는데 네 학습 작업이 하나도 시작하지 못했습니다", bridge: "자원을 잘게 나눠 준 결과 모든 작업이 기다립니다. 작업이 태어나고 끝나는 순서부터 다시 봅니다.", paragraphs: [
      "(가정) 16노드 클러스터에 각각 8노드를 동시에 요구하는 학습 작업 네 개가 들어왔습니다. 관리 도구가 공평하게 보이도록 작업마다 노드 두 대씩 먼저 나눠 줬지만, 어느 작업도 필요한 여덟 대를 한꺼번에 얻지 못해 GPU 16대가 비어 있는 채로 기다렸습니다.",
      "반대편에는 항상 떠 있어야 하는 추론 API도 있습니다. 이 서비스는 여덟 노드의 동시 시작보다 죽은 복제본 교체와 점진 배포가 중요합니다. 같은 GPU와 컨테이너를 쓴다는 이유만으로 두 작업을 같은 방식으로 관리할 수 있는지부터 따져야 합니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 요청·대기·할당·실행·회수를 추적합니다", bridge: "작업 형태가 선택을 바꾼다는 결론을 얻었습니다. 두 도구를 비교하기 전에 공통 생애를 그립니다.", paragraphs: [
      "사용자는 필요한 노드·GPU·메모리·시간을 요청합니다. 관리 계층은 현재 사용량과 우선순위를 보고 대기시키거나 자원을 할당합니다. 실행을 시작한 뒤 상태와 사용량을 기록하고, 성공·실패·시간 초과에서 자원을 회수합니다.",
      "차이는 어느 단계의 정책이 더 강한지에서 생깁니다. 긴 연구 작업은 대기열과 공동 시작, 계정별 사용량이 중요합니다. 온라인 서비스는 선언한 복제 수와 상태 검사, 네트워크 이름, 점진 배포가 중요합니다.",
    ] },
    { id: "case", level: "0", title: "3. 16개 노드에서 8개짜리 작업 네 개를 받습니다", bridge: "공통 생애를 정했습니다. 자원이 부족한 작은 사례에서 기다림과 할당을 계산합니다.", paragraphs: [
      "(가정) 16노드 클러스터에 각 8노드를 동시에 요구하는 학습 작업 네 개 A·B·C·D가 들어왔습니다. 동시에 실행할 수 있는 것은 두 개뿐입니다. A와 B가 8시간씩 실행되면 C와 D는 자원이 반환될 때까지 기다립니다.",
      "노드 하나씩 네 작업에 흩어 주면 어느 작업도 필요한 8노드를 얻지 못해 모두 시작하지 못할 수 있습니다. 여러 프로세스가 함께 시작해야 하는 작업에는 필요한 묶음이 모두 준비될 때 할당하는 정책이 필요합니다.",
    ] },
    { id: "picture", level: "1", title: "4. 서비스와 배치 작업의 우선순위가 다릅니다", bridge: "자원을 잘게 나누는 것이 항상 이용률을 높이지 않음을 봤습니다. 작업 형태별 첫 질문을 나눕니다.", paragraphs: [
      "대규모 학습은 몇 시간 또는 며칠 뒤 끝나며 같은 시점에 여러 노드의 process를 시작합니다. 대기 시간이 생겨도 전체 묶음을 확보하고 checkpoint·재시작·회계가 분명해야 합니다.",
      "추론 API는 계속 떠 있고 요청량에 따라 복제본 수가 바뀝니다. 한 복제본이 죽으면 새 복제본을 만들고, 주소와 인증·비밀·관측을 애플리케이션 운영 방식에 맞춰야 합니다.",
    ] },
    { id: "need", level: "2", title: "5. GPU 개수만 맞아도 함께 시작하지 않으면 멈춥니다", bridge: "작업 형태를 나눴습니다. 분산 작업에서 자원 묶음과 topology가 필요한 이유를 봅니다.", paragraphs: [
      "분산 학습의 rank들은 같은 communicator에 참여합니다. 일부만 실행되고 나머지가 대기하면 먼저 뜬 process도 상대를 기다립니다. 이런 공동 시작 요구를 gang scheduling이라고 부릅니다.",
      "노드 수만 맞아도 충분하지 않습니다. 선택된 노드가 같은 고속 fabric에 있고 GPU와 NIC의 배치가 의도한 rail과 맞아야 합니다. scheduler가 topology 정보를 모르거나 잘못된 label을 믿으면 자원은 할당됐지만 성능은 나오지 않습니다.",
    ] },
    { id: "names", level: "3", title: "6. Job·Pod·partition·allocation을 구분합니다", bridge: "동시 시작과 topology의 필요를 봤습니다. 두 생태계가 같은 말을 다르게 나누는 지점을 붙입니다.", paragraphs: [
      "Slurm은 계산 노드의 일정 시간 사용권을 allocation으로 주고, job 안에서 하나 이상의 job step을 실행합니다. partition은 노드를 정책별로 묶은 대기열 경계입니다. `sbatch`는 나중 실행할 script를 넣고 `srun`은 allocation 안의 병렬 task를 시작합니다.",
      "Kubernetes의 Pod는 함께 배치되는 container 묶음이고 Job은 정해진 완료까지 Pod를 다시 실행합니다. 계속 서비스하는 workload에는 Deployment 같은 controller를 씁니다. NVIDIA GPU Operator는 driver·device plugin·container toolkit·monitoring 구성요소의 설치와 생애를 자동화합니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 작업 형태에서 스케줄러를 선택합니다", bridge: "공식 용어를 구분했습니다. 이제 제품 선호 대신 질문 순서로 선택합니다.", paragraphs: [
      "첫째, 결과가 끝나는 batch인지 계속 요청을 받는 service인지 묻습니다. 둘째, 여러 노드가 동시에 시작해야 하는지, MPI·NCCL launcher와 queue fairness가 중요한지 확인합니다. 셋째, service discovery·autoscaling·rolling update·tenant API가 필요한지 봅니다.",
      "대규모 학습 queue가 중심이면 Slurm을 기본 후보로, 서비스 생애와 cloud-native API가 중심이면 Kubernetes를 기본 후보로 둡니다. 혼합이면 한 GPU를 두 control plane이 동시에 소유하지 않게 cluster·node pool·시간대를 분리하고 경계를 운영 문서로 고정합니다.",
    ] },
    { id: "source", level: "5", title: "8. Slurm의 자원 할당과 job step을 적용합니다", bridge: "선택 질문을 만들었습니다. Slurm 공식 정의를 16노드 사례에 대입합니다.", paragraphs: [
      "SchedMD는 Slurm의 세 기능을 자원 접근 할당, 할당된 노드에서 병렬 작업의 시작·실행·관측, 대기 작업 사이의 자원 경쟁 조정으로 설명합니다. A와 B에 8노드씩 allocation을 주고 C와 D를 pending queue에 두는 것이 이 사례의 기본 동작입니다.",
      "작업이 끝난 뒤에는 `sacct`로 실제 사용량을 남기고, `squeue`의 pending reason이 Resources인지 Priority인지 구분합니다. 단순히 ‘대기 중’이라고만 알리면 사용자와 운영자가 용량 부족과 정책 순서를 구분할 수 없습니다.",
    ] },
    { id: "comparison", level: "6", title: "9. Kubernetes의 Job과 GPU Operator를 적용합니다", bridge: "배치 queue의 동작을 확인했습니다. 같은 자원을 서비스 운영 관점에서 비교합니다.", paragraphs: [
      "Kubernetes Job은 지정한 수의 Pod가 성공적으로 끝나도록 관리합니다. 그러나 8노드 분산 작업의 공동 시작·queue fairness·topology 묶음은 기본 Job 이름만으로 완성되지 않으므로 현재 workload API와 별도 queueing 구성의 지원 상태를 확인해야 합니다.",
      "GPU Operator는 GPU driver와 device plugin 등 노드 준비 상태를 선언한 값으로 되돌리는 controller입니다. 같은 event가 다시 와도 결과가 달라지지 않아야 하며, spec 세대와 처리한 세대, update 충돌, 삭제 전 정리를 구분해야 합니다. 그래도 작업이 어떤 8노드를 함께 받아야 하는지와 사용자 우선순위를 결정하지는 않습니다. 장치 준비와 workload scheduling은 다른 책임입니다.",
    ] },
    { id: "limits", level: "7", title: "10. 둘을 함께 쓸 때 소유권부터 정합니다", bridge: "각 도구가 잘하는 일을 비교했습니다. 혼합 운영에서 가장 먼저 막아야 할 충돌을 남깁니다.", paragraphs: [
      "같은 노드와 GPU를 Slurm과 Kubernetes가 각각 빈 자원으로 보고 할당하면 이중 예약이 생깁니다. bridge나 operator를 쓰더라도 최종 자원 소유자, accounting 원장, drain·maintenance 권한과 장애 시 복구 주체를 하나로 정해야 합니다.",
      "면접에서는 ‘Kubernetes가 좋다’ 또는 ‘HPC는 Slurm’으로 끝내지 않습니다. 대표 workload 두세 개와 운영팀 역량, multi-tenancy·queue·service 요구를 표로 놓고 선택 근거와 남는 통합 비용을 설명합니다.",
    ] },
  ],
  overviewFlow: { title: "작업 하나의 공통 생애", steps: [
    { actor: "자원 요청", movement: "노드·GPU·메모리·시간과 topology 조건을 냅니다.", receives: "검증 가능한 workload specification" },
    { actor: "대기와 할당", movement: "우선순위·공정성·공동 시작 조건으로 자원을 고릅니다.", receives: "allocation 또는 scheduled Pod" },
    { actor: "실행과 회수", movement: "상태·사용량·결과를 남기고 자원을 반환합니다.", receives: "accounting과 복구 증거" },
  ] },
  numericCase: { title: "16노드에 8노드 작업 네 개", steps: [
    { label: "전체 자원", value: "16노드", detail: "GPU 128개" },
    { label: "동시 실행", value: "2개", detail: "A·B가 각 8노드" },
    { label: "대기 작업", value: "2개", detail: "C·D는 자원 반환 대기" },
  ] },
  decision: { title: "작업 생애로 첫 후보 고르기", question: "운영의 중심이 완료되는 병렬 작업입니까, 계속 떠 있는 서비스입니까?", options: [
    { signal: "8~16노드를 함께 받아 수시간 학습하고 끝납니다.", choose: "Slurm 우선 검토", why: "allocation·queue fairness·job accounting·MPI/NCCL launch가 중심입니다." },
    { signal: "복제본이 계속 요청을 받고 점진 배포와 자동 복구가 필요합니다.", choose: "Kubernetes 우선 검토", why: "service API·controller·autoscaling·rolling update가 중심입니다." },
    { signal: "학습 queue와 추론 service를 같은 조직이 운영합니다.", choose: "분리 또는 명시적 bridge", why: "한 GPU의 최종 소유자와 accounting·maintenance 경계를 하나로 고정합니다." },
  ] },
  terms: { title: "두 scheduler의 실행 단위", items: [
    { term: "Slurm allocation", description: "사용자 작업이 일정 시간 동안 쓸 node·CPU·GPU·memory 묶음입니다.", example: "A 작업이 8노드를 받고 그 안에서 64개 GPU rank를 시작합니다.", boundary: "공유 파일을 자동으로 노드에 복제하거나 application service를 만들어 주지는 않습니다." },
    { term: "Kubernetes Job", description: "지정한 완료 조건을 만족할 때까지 하나 이상의 Pod 실행을 관리하는 workload object입니다.", example: "전처리 shard 16개가 각각 성공할 때까지 실패한 Pod를 다시 만듭니다.", boundary: "다중 노드 GPU 작업의 queue fairness와 gang scheduling 전체를 단독으로 보장하지 않습니다." },
    { term: "GPU Operator", description: "Kubernetes node에서 NVIDIA driver·device plugin·container toolkit·monitoring 구성요소를 관리합니다.", example: "새 GPU node에 장치 노출과 DCGM monitoring stack을 맞춥니다.", boundary: "사용자 작업의 우선순위와 node 묶음 정책을 정하는 scheduler 자체는 아닙니다." },
  ] },
  algorithm: { title: "대표 workload에서 scheduler 고르기", input: ["16노드", "학습 job 4개", "추론 API", "운영팀 1개"], steps: [
    { code: "workload를 batch·service·interactive로_분류", note: "끝나는 조건과 실행 시간을 적습니다." },
    { code: "공동_시작·queue·topology·accounting을_점검", note: "분산 학습의 자원 묶음 요구를 봅니다." },
    { code: "service·autoscale·rolling_update·tenant_API를_점검", note: "온라인 서비스의 생애 요구를 봅니다." },
    { code: "주_control_plane과_최종_GPU_소유자를_지정", note: "이중 예약을 막습니다." },
    { code: "A·B 실행, C·D 대기 사례로_정책을_시험", note: "pending reason과 accounting까지 확인합니다." },
  ], output: "workload별 scheduler 선택표 + 자원 소유권·accounting·maintenance 경계", repeatUntil: "새 workload 유형이나 운영 조직이 추가될 때마다 다시 판정합니다." },
  sources: [
    { source: "SchedMD · Slurm Quick Start", excerpt: "allocates exclusive and/or non-exclusive access to resources", application: "16노드 중 8노드씩 A와 B에 allocation하고 C와 D를 queue에 두는 공통 모델로 적용합니다.", citation: "SchedMD, Slurm Quick Start User Guide", href: "https://slurm.schedmd.com/quickstart.html", note: "Slurm의 자원 할당·병렬 실행·대기열 조정 기능과 node·partition·job·job step의 공식 정의입니다." },
    { source: "Kubernetes · Jobs", excerpt: "creates one or more Pods", application: "완료되는 작업을 Job으로 표현하되 분산 GPU 공동 시작과 fairness는 별도 지원 상태를 확인하는 경계로 씁니다.", citation: "Kubernetes Documentation, Jobs", href: "https://kubernetes.io/docs/concepts/workloads/controllers/job/", note: "Job의 완료·재시도·병렬 실행 semantics를 정의하는 공식 문서입니다." },
  ],
  review: [
    "16노드에 8노드 작업 네 개가 오면 왜 두 개만 동시에 실행됩니까? (답: 3절)",
    "Slurm allocation과 Kubernetes Job은 각각 무엇을 관리합니까? (답: 6절)",
    "두 control plane이 같은 GPU를 관리할 때 가장 먼저 정할 것은 무엇입니까? (답: 10절)",
  ],
};

export const storageIoData: AiInfrastructureArticleData = {
  engineeringDepth: storageIoDepth,
  formulas: [
    {
      section: "case",
      content: {
        question: "4MiB 요청으로 8GiB/s를 내려면 몇 IOPS와 몇 개의 진행 중 요청이 필요한가요?",
        idea: "처리량을 요청 크기로 나누면 초당 요청 수가 나옵니다. 여기에 평균 응답 시간을 곱하면 경로 안에 머무는 요청 수를 가늠할 수 있습니다.",
        formula: String.raw`I=\frac{B}{S}=\frac{8\,\mathrm{GiB/s}}{4\,\mathrm{MiB}}=2{,}048\,\mathrm{IOPS},\qquad N\approx I\times L=2{,}048\times0.004\approx8.2`,
        annotatedFormula: String.raw`\underbrace{I}_{\text{초당 완료 요청}}=\frac{\overbrace{B}^{8\,\mathrm{GiB/s}}}{\underbrace{S}_{4\,\mathrm{MiB}}}=2{,}048\,\mathrm{IOPS},\qquad\underbrace{N}_{\text{진행 중 요청}}\approx I\times\underbrace{L}_{4\,\mathrm{ms}}\approx8.2`,
        operations: [
          { expression: String.raw`8\,\mathrm{GiB/s}=8{,}192\,\mathrm{MiB/s}`, annotation: "이 예에서는 이진 접두사를 사용해 단위를 먼저 맞춥니다." },
          { expression: String.raw`8{,}192\div4=2{,}048\,\mathrm{requests/s}`, annotation: "요청 하나가 4MiB일 때 필요한 완료율입니다." },
          { expression: String.raw`2{,}048\times4\,\mathrm{ms}=8.192`, annotation: "Little's law를 적용하면 평균 약 8.2개 요청이 경로 안에 있어야 합니다." },
        ],
        terms: [
          { symbol: String.raw`B`, name: "payload 처리량", description: "application이 요구하는 초당 유효 byte입니다." },
          { symbol: String.raw`S`, name: "요청 크기", description: "한 번의 read 또는 write가 옮기는 byte입니다." },
          { symbol: String.raw`L`, name: "평균 응답 시간", description: "요청 제출부터 완료까지의 평균 시간입니다." },
        ],
        assumptions: ["모든 요청의 payload가 4MiB이고 평균 latency가 4ms인 설명용 정상 상태입니다.", "retry·metadata·replication·tail latency·client CPU 병목은 아직 넣지 않았습니다."],
        interpretation: "약 8.2는 시험을 시작할 최소 동시성 힌트입니다. queue depth를 계속 올리면 빨라진다는 뜻이 아니며, 포화 뒤에는 p99 latency와 application wall time을 함께 봅니다.",
      },
    },
    {
      section: "mechanism",
      content: {
        question: "Raw 2PB를 8+2 erasure coding과 20% 운영 여유로 구성하면 얼마를 계획 용량으로 볼 수 있나요?",
        idea: "먼저 보호 방식의 data 비율을 적용하고, 그다음 rebuild와 성장에 남길 여유를 뺍니다. snapshot·metadata·filesystem reserve는 별도 열로 남깁니다.",
        formula: String.raw`C_{\mathrm{plan}}=C_{\mathrm{raw}}\times\frac{k}{k+m}\times(1-r)=2\,\mathrm{PB}\times\frac{8}{10}\times0.8=1.28\,\mathrm{PB}`,
        annotatedFormula: String.raw`\underbrace{C_{\mathrm{plan}}}_{\text{계획 가능 용량}}=\overbrace{2\,\mathrm{PB}}^{\text{raw}}\times\underbrace{\frac{8}{8+2}}_{\text{EC data 비율}}\times\underbrace{(1-0.2)}_{\text{운영 여유}}=1.28\,\mathrm{PB}`,
        operations: [
          { expression: String.raw`2\,\mathrm{PB}\times8/10=1.6\,\mathrm{PB}`, annotation: "두 parity shard의 보호 비용을 반영한 usable 값입니다." },
          { expression: String.raw`1.6\,\mathrm{PB}\times0.8=1.28\,\mathrm{PB}`, annotation: "20%를 rebuild·성장·불균형 여유로 남긴 설명용 값입니다." },
        ],
        terms: [
          { symbol: String.raw`k`, name: "data shard 수", description: "원본 payload를 나눠 담는 조각 수입니다." },
          { symbol: String.raw`m`, name: "parity shard 수", description: "허용하려는 실패를 복구하는 보호 조각 수입니다." },
          { symbol: String.raw`r`, name: "운영 reserve", description: "가득 차기 전에 rebuild와 성장을 위해 비워 둘 비율입니다." },
        ],
        assumptions: ["(가정) 8+2 EC와 20% reserve를 사용합니다.", "작은 object space amplification, metadata, snapshot, temporary compaction 공간은 아직 차감하지 않았습니다."],
        interpretation: "2PB를 고객 사용 가능 용량이라고 약속하면 안 됩니다. 제안서에는 raw·보호 후 usable·운영 effective와 제외 항목을 각각 적습니다.",
      },
    },
  ],
  sections: [
    { id: "overview", level: "S", title: "1. 저장 완료 표시가 있었지만 복구하지 못했습니다", bridge: "하나의 실패 사건에서 출발합니다. 글 전체가 이 실패의 다음 질문만 따라갑니다.", paragraphs: [
      "(가정) B300 128개를 쓰는 16-node 학습 작업이 있습니다. 작업은 dataset을 읽으며 학습하다가 8TB checkpoint를 저장하기 시작했습니다. 계산은 곧 다시 시작됐고 화면에는 최신 저장 세대가 보였습니다. 그런데 저장 중 node 하나가 사라지자 그 세대로 재시작하지 못했습니다.",
      "처리량이 높았는데도 복구하지 못한 이유는 byte 전송, 요청 반환, 장애 뒤 남는 저장, application restore가 서로 다른 완료 조건이기 때문입니다. 스토리지를 깊게 이해한다는 말은 제품을 많이 아는 데서 끝나지 않습니다. 이 네 완료 조건을 한 요청의 경로와 같은 시간축에서 증명할 수 있어야 합니다.",
      "이 글의 질문은 하나입니다. 4MiB read 한 건과 checkpoint write 한 건은 어디를 지나며, 어느 응답을 받아야 복구 가능한 완료라고 말할 수 있을까요?",
    ] },
    { id: "black-box", level: "B", title: "2. 요청은 네 책임 구간을 지나갑니다", bridge: "복구 실패는 완료 조건이 섞여서 생겼습니다. 먼저 제품명 없이 책임 구간만 나눕니다.", paragraphs: [
      "학습 작업은 파일 이름, 읽을 위치와 4MiB buffer를 첫 구간에 건넵니다. 두 번째 구간은 같은 내용이 메모리에 있는지 보고 파일의 위치를 찾습니다. 세 번째 구간은 요청을 줄 세워 장치나 원격 서버로 옮깁니다. 마지막 구간은 data copy가 합의한 고장 범위 뒤에도 남았는지 판단합니다.",
      "읽기는 마지막 구간에서 가져온 4MiB가 학습 작업에 돌아와야 끝납니다. 쓰기는 더 깁니다. 한 process가 byte를 넘긴 뒤에도 다른 process의 조각, 전체 세대를 가리키는 목록, 장애 뒤 다시 읽을 수 있다는 확인이 남습니다.",
      "그래서 GPU 사용률과 disk 사용률만 나란히 봐서는 첫 대기 지점을 찾을 수 없습니다. 네 구간의 시작·완료 시각을 맞춘 뒤 같은 요청이 어느 구간에서 오래 머물렀는지 찾아야 합니다.",
    ] },
    { id: "case", level: "0", title: "3. 4MiB read를 2,048 IOPS로 바꿉니다", bridge: "네 구간을 그렸으니, PoC의 처리량을 실제 요청 수로 바꿉니다.", paragraphs: [
      "(가정) client 16개가 합계 8GiB/s로 읽고 요청 하나가 4MiB라면, 1초에 2,048개가 완료돼야 합니다. Client 하나로 나누면 평균 512MiB/s, 즉 초당 4MiB 요청 128개입니다. 같은 숫자를 client 수 없이 적으면 한 process의 요구인지 전체 요구인지 알 수 없습니다.",
      "평균 응답 시간이 4ms라면 Little's law로 경로 안에 요청이 평균 약 8.2개 있어야 합니다. 이 값은 `iodepth=8`을 정답으로 고르라는 뜻이 아닙니다. 실제 client 수, 요청 분포와 achieved depth를 확인할 첫 검산값입니다.",
      "요청 크기를 4KiB로 바꾸면 같은 8GiB/s에 약 210만 IOPS가 필요합니다. 처리량은 같지만 문제의 모양이 달라졌으므로, 다음에는 모든 data를 GPU 가까이에 두면 해결되는지 확인합니다.",
    ] },
    { id: "picture", level: "1", title: "4. 전부 가까이 두면 node 하나와 함께 사라집니다", bridge: "요청 수는 계산됐습니다. 가장 가까운 저장 공간 하나로 모든 일을 맡길 때 생기는 문제를 엽니다.", paragraphs: [
      "Dataset 조각을 계산 node 안에 복사하면 반복 read는 짧아집니다. 하지만 node가 사라지면 복사본도 함께 사라지므로, 원본에서 다시 만들 수 있는 data만 이곳에 둘 수 있습니다.",
      "여러 worker가 같은 파일 이름을 열고 한 checkpoint 세대를 함께 공개하려면 공통으로 보이는 파일 tree가 필요합니다. 반면 장기 원본과 여러 version을 보존하는 일은 file rename보다 key와 lifecycle이 더 중요한 별도 문제입니다.",
      "결국 한 계층을 가장 빠르게 만드는 문제가 아닙니다. 다시 만들 수 있는 복사본, 여러 worker가 함께 쓰는 현재 상태, 오래 남길 원본을 나누고 각 data가 잃어도 되는 범위를 정해야 합니다.",
    ] },
    { id: "need", level: "2", title: "5. 데이터마다 살아남아야 하는 시간이 다릅니다", bridge: "세 저장 역할이 갈린 이유를 알았습니다. 이제 사건 속 data를 한 항목씩 배치합니다.", paragraphs: [
      "Dataset 원본은 학습 node를 교체한 뒤에도 남아야 합니다. 원본에서 만든 읽기 복사본은 사라져도 다시 채울 수 있으므로, node 가까이에 두고 속도를 얻을 수 있습니다. 두 data를 같은 ‘저장본’으로 부르면 장애 뒤 무엇을 다시 받아야 하는지 정할 수 없습니다.",
      "Checkpoint는 한 process의 쓰기가 끝났다고 완성되지 않습니다. 모든 rank의 shard가 쓰였고, 전체 세대를 가리키는 목록이 공개됐으며, restart가 그 세대를 실제로 읽을 수 있어야 합니다. 그래서 계산이 다시 시작된 시각과 복구 가능한 저장이 끝난 시각을 따로 기록합니다.",
      "이제 역할은 충분히 보았습니다. 다음 절에서 이 세 계층과 메모리·지연 현상에 표준 이름을 붙입니다.",
    ] },
    { id: "names", level: "3", title: "6. 앞에서 본 역할에 storage 이름을 붙입니다", bridge: "역할을 먼저 보았으니, 이제부터 같은 대상을 표준 용어로만 부릅니다.", paragraphs: [
      "Node 안에서 다시 만들 수 있는 읽기 복사본은 local NVMe cache입니다. 여러 client가 같은 file tree를 보는 계층은 shared 또는 parallel filesystem입니다. Key와 version을 기준으로 장기 원본을 두는 계층은 object storage입니다.",
      "Linux가 file 내용을 memory에 보관하는 영역은 page cache입니다. Page cache의 영향을 줄여 buffer와 device 사이 I/O를 요청하는 방식은 direct I/O입니다. 대부분의 요청보다 유난히 느린 끝부분의 응답 시간은 tail latency입니다.",
      "이제부터 local NVMe cache·shared filesystem·object storage를 서로 바꾸어 부르지 않습니다. 세 계층은 속도 순위가 아니라 source of truth, 공유 방식과 완료 조건으로 고릅니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 같은 4MiB read와 checkpoint를 끝까지 따라갑니다", bridge: "이름을 얻었습니다. 처음 사건의 literal value가 각 구간에서 어떻게 바뀌는지 따라갑니다.", paragraphs: [
      "Read는 `pread64(fd, buffer, 4MiB, offset)`로 시작합니다. Page cache miss라면 filesystem이 file offset을 data 위치로 바꾸고, local NVMe 또는 shared filesystem client가 요청을 queue에 넣습니다. 4MiB가 buffer로 돌아온 뒤 decode와 host-to-device copy까지 끝나야 GPU가 그 batch를 계산할 수 있습니다.",
      "Checkpoint write는 임시 shard에 byte를 쓴 뒤 file data의 완료를 기다리고, 같은 filesystem 안에서 최종 이름으로 바꿉니다. Rank별 shard가 모두 성공한 뒤에만 global manifest를 공개하며, 마지막으로 restore checksum을 통과한 세대를 complete로 기록합니다.",
      "(가정) 8TB를 120초에 쓰려면 payload만 약 66.7GB/s입니다. NVIDIA의 약 12.5Gb/s/GPU 지침을 128 GPU에 적용한 200GB/s는 별도의 aggregate sizing 기준입니다. 두 숫자는 같은 시간창에 겹치는지 확인한 뒤 network·metadata·보호 비용을 더합니다.",
    ] },
    { id: "source", level: "5", title: "8. Linux에서 처음 느려진 지점을 찾습니다", bridge: "한 요청의 변화를 따라왔습니다. 이제 kernel 구조와 실제 관측값을 맞춥니다.", paragraphs: [
      "Linux VFS의 `address_space`에는 cached page, page 수, 다음 writeback 위치와 최근 writeback error가 들어 있습니다. Filesystem이 block I/O를 만들면 `bio`가 device·operation·payload 위치와 완료 상태를 들고 내려갑니다. blk-mq는 이를 `request`로 묶어 CPU 쪽 queue와 hardware dispatch queue를 거쳐 driver에 넘깁니다.",
      "구조 이름을 외우는 것이 목표는 아닙니다. `strace`로 4MiB 요청과 `fsync` 시간을 보고, 같은 시각의 `iostat -x`에서 await·queue·utilization을 확인합니다. Shared filesystem이면 client protocol·NIC·server 지표를 그 사이에 넣어 처음 늘어난 대기 시간을 찾습니다.",
      "이 단계가 끝나면 ‘disk가 바쁘다’가 아니라 ‘어느 process의 어느 요청이 어느 queue에서 기다렸다’고 말할 수 있습니다.",
    ] },
    { id: "comparison", level: "6", title: "9. Elice 공개 정보로 PoC 질문을 만듭니다", bridge: "관측할 위치를 찾았습니다. 이제 공개된 interface와 아직 물어야 할 구현을 분리합니다.", paragraphs: [
      "Elice 공개 가이드는 ECI의 block storage·object storage·parallel filesystem을 구분합니다. 따라서 가상 사건의 OS disk, shared checkpoint tree와 장기 dataset 원본을 어느 interface에 둘지 먼저 묻습니다. 하지만 공개 문서만으로 parallel filesystem의 제품·보호 방식·metadata 구조·보장 처리량을 정할 수는 없습니다.",
      "Elice B300 기술 글은 host의 GPU·NIC·NVMe 역할과 물리 topology를 확인하고, guest에서도 의미 있는 인접 관계를 재현한 뒤 같은 software와 benchmark 조건으로 비교했습니다. Storage PoC도 이 방법을 그대로 씁니다. VM에 보이는 volume부터 physical device·network·cache까지 경로를 적고, 같은 manifest로 local·shared·object 후보를 비교합니다.",
      "fio는 local block path를, IOR는 shared payload를, mdtest는 metadata를 나눠 봅니다. PyTorch DCP의 `async_save()`를 쓸 때는 GPU 재개 시각과 반환 Future의 완료 시각을 따로 기록합니다. 마지막 판정은 실제 data loader와 checkpoint restore가 내립니다.",
      "새 NVMe에 fio를 바로 돌리면 처음 몇 라운드는 높게 나옵니다. SNIA SSS PTS 2.0.2(2020년 10월 1일 발행)는 갓 꺼낸 FOB(Fresh Out of the Box) 장치가 잠깐 높은 성능을 보이다가 그 workload에 맞는 안정 상태로 내려온다고 적고, 측정은 그 안정 상태인 Steady State에서만 하라고 합니다(3.1절). 첫 성능은 수명 대부분을 대표하지 않는 일시적 거동이라는 이유입니다.",
      "Steady State 판정은 정의 2.1.24의 두 조건입니다. 추적 변수가 라운드별 평균 IOPS라면, 측정 창 안에서 최대−최소가 창 평균의 20% 이내이고, 그 값들에 맞춘 최적 직선의 최대−최소가 창 평균의 10% 이내여야 합니다. (가정) 창 평균이 100,000 IOPS면 실측 범위는 20,000 이내, 직선 기울기로 생기는 차이는 10,000 이내입니다. 측정 창은 Steady State를 유지했다고 본 라운드 x와 그 앞 네 라운드, 즉 x−4부터 x까지 다섯 라운드입니다(정의 2.1.13).",
      "그 앞의 사전 쓰기가 pre-conditioning입니다. 규격은 시험 workload와 무관한 쓰기로 수렴을 돕는 Workload Independent Pre-conditioning과 시험 workload 자체로 쓰는 Workload Dependent Pre-conditioning을 나눕니다(정의 2.1.18). IOPS 시험(7.2절)의 WIPC는 128KiB 순차 쓰기로 사용자 용량의 2배를 쓰고, 25라운드까지 Steady State에 닿지 않으면 계속 돌리거나 x라운드에서 멈추되 측정 창은 x−4부터 x로 둡니다. 아래 원장에서 ‘precondition’이라 쓴 조건은 이 절차를 뜻하며, 장치 규격이지 filesystem·application 시험을 대신하지는 않습니다(2026-10-10 PDF 확인).",
      "NAVER·Kakao·우아한형제들·당근 사례는 이 질문을 보충합니다. Cache의 원본, small-file 유지비, 실제 workload 재현, online source 부하 격리만 가져오며 당시 version과 수치를 B300 환경의 보장값으로 쓰지 않습니다.",
    ] },
    { id: "limits", level: "7", title: "10. Restore가 끝나야 storage를 채택합니다", bridge: "PoC가 정상 상태를 통과했습니다. 처음 사건처럼 node가 사라진 뒤에도 같은 답이 나오는지 확인합니다.", paragraphs: [
      "먼저 대표 dataset read와 checkpoint write를 정상 상태에서 실행합니다. 다음에는 drive·storage node·network path 하나를 중단하고 같은 작업을 계속합니다. Degraded 상태와 rebuild 중에는 p99, slowest rank, error, 남은 공간과 복구 예상 시간을 한 시간축에 남깁니다.",
      "Raw 2PB에 8+2 EC를 적용하면 설명용 usable capacity는 1.6PB입니다. 여기서 rebuild와 성장을 위한 20%를 남기면 계획값은 1.28PB가 됩니다. Snapshot·metadata·작은 object·compaction 임시 공간은 아직 빼지 않았으므로 별도 열에 기록합니다.",
      "마지막으로 기존과 다른 node 수에서 마지막 complete checkpoint를 읽어 checksum과 optimizer step을 확인합니다. 이 restore가 RPO·RTO 안에 끝나야 채택합니다. Replication 수, snapshot 존재와 정상 상태 GB/s만으로는 이 결론을 대신할 수 없습니다.",
      "면접에서는 실제 담당 범위와 이 역설계안을 구분하면 됩니다. 현재 프로젝트에서 맡은 일, 공개 자료로 확인한 사실, 가정한 숫자, 벤더·DC·application owner에게 확인할 값을 차례로 밝히면 과장 없이도 설계 사고를 보여 줄 수 있습니다.",
    ] },
  ],
  overviewFlow: { title: "아직 제품명을 붙이지 않은 네 책임 구간", steps: [
    { actor: "요청을 만드는 곳", movement: "파일 이름·위치·4MiB buffer와 언제 끝났다고 볼지를 넘깁니다.", receives: "read 또는 write" },
    { actor: "잠시 보관하고 위치를 찾는 곳", movement: "같은 내용이 memory에 있는지 확인하고 file의 논리 위치를 찾습니다.", receives: "cache hit 또는 다음 요청" },
    { actor: "줄 세우고 옮기는 곳", movement: "요청을 device나 원격 server로 보내고 완료를 위로 돌려줍니다.", receives: "진행 중인 요청과 응답" },
    { actor: "장애 뒤에도 남기는 곳", movement: "합의한 수의 copy 또는 shard가 남고 다시 읽히는지 확인합니다.", receives: "복구 가능한 data" },
  ] },
  numericCase: { title: "처리량을 요청과 queue로 바꾸기", steps: [
    { label: "Payload 목표", value: "8GiB/s", detail: "설명용 application requirement" },
    { label: "4MiB 요청", value: "2,048 IOPS", detail: "8,192MiB/s ÷ 4MiB" },
    { label: "평균 4ms", value: "약 8.2 in flight", detail: "2,048/s × 0.004s" },
  ] },
  decision: { title: "세 data 역할을 먼저 나누기", question: "Node를 잃었을 때 무엇을 다시 만들 수 있고 무엇이 반드시 남아야 하나요?", options: [
    { signal: "원본에서 다시 만들 수 있고 한 node에서 반복해 읽습니다.", choose: "node 안의 읽기 복사본", why: "가까이 두어 read를 줄이되 node loss 뒤 다시 채웁니다." },
    { signal: "여러 worker가 같은 file tree와 완료 세대를 함께 봐야 합니다.", choose: "공동 작업 공간", why: "이름·동시 접근·완료 공개와 장애 복구를 함께 시험합니다." },
    { signal: "장기 원본과 여러 version을 key 기준으로 남겨야 합니다.", choose: "오래 남길 원본 공간", why: "Lifecycle과 consistency를 확인하고 학습 앞에 읽기 복사본을 둘 수 있습니다." },
  ] },
  terms: { title: "앞에서 본 역할의 실제 이름", items: [
    { term: "Local NVMe cache", description: "원본에서 다시 만들 수 있는 shard를 compute node 가까이에 두는 계층입니다.", example: "같은 dataset shard를 여러 epoch에서 반복해 읽습니다.", boundary: "Node와 함께 사라질 수 있으므로 유일한 원본이나 마지막 checkpoint로 두지 않습니다." },
    { term: "Shared·parallel filesystem", description: "여러 client가 같은 file namespace를 보고 병렬로 읽고 쓰는 계층입니다.", example: "128 ranks가 shard를 쓰고 하나의 checkpoint 세대를 공개합니다.", boundary: "POSIX라는 이름만으로 metadata scale·stripe·장애 중 성능이 보장되지는 않습니다." },
    { term: "Object storage", description: "File tree보다 key·version·lifecycle을 중심으로 원본과 artifact를 보관하는 계층입니다.", example: "장기 dataset과 완료 checkpoint를 version별 key로 남깁니다.", boundary: "여러 file의 atomic rename이나 POSIX lock을 그대로 기대할 수 없습니다." },
    { term: "페이지 캐시(page cache)", description: "파일 내용을 메모리에 보관하고 dirty·writeback 상태를 관리하는 OS 영역입니다.", example: "짧은 buffered read가 장치가 아니라 DRAM의 cached page를 읽을 수 있습니다.", boundary: "Cache hit 처리량을 장치나 공유 storage의 성능으로 보고하면 안 됩니다." },
    { term: "직접 입출력(direct I/O)", description: "Page cache 영향을 줄이고 application buffer와 장치 사이 전송을 시도하는 방식입니다.", example: "fio의 `direct=1`로 local NVMe baseline을 잽니다.", boundary: "`O_DIRECT`만으로 data·metadata의 영속 저장을 보장하지 않습니다. open(2)에 따르면 buffer 주소·길이·file offset의 정렬 조건은 filesystem과 kernel마다 다르고, Linux 2.6부터는 대개 장치의 logical block size(보통 512바이트) 배수입니다. 어긋난 요청은 EINVAL로 실패하거나 buffered I/O로 바뀔 수 있습니다." },
    { term: "꼬리 지연(tail latency)", description: "요청 분포에서 가장 느린 쪽의 응답 시간입니다.", example: "128 ranks 중 가장 느린 rank의 p99 read가 다음 training step을 늦춥니다.", boundary: "평균 latency와 aggregate 처리량만으로는 tail을 알 수 없습니다." },
  ] },
  algorithm: { title: "4MiB read와 checkpoint 한 세대의 완료 경로", input: ["path", "offset", "4MiB buffer", "8TB checkpoint", "120초 deadline"], steps: [
    { code: "pread64(path, offset, 4MiB)", note: "Page cache hit인지 miss인지와 syscall 시간을 기록합니다." },
    { code: "file_offset→data_location→request_queue", note: "Local NVMe면 block queue를, shared filesystem이면 client·network·server queue를 표시합니다." },
    { code: "4MiB→decode→host_to_device→GPU", note: "Storage 응답과 GPU가 batch를 받은 시각을 나눕니다." },
    { code: "write(tmp_shard)→fsync(file)→rename(final_shard)", note: "Rank 하나의 shard를 임시 이름에서 최종 이름으로 바꿉니다." },
    { code: "all_ranks_complete→publish(global_manifest)", note: "모든 shard가 성공하기 전에는 해당 세대를 restart 후보로 공개하지 않습니다." },
    { code: "restore(global_manifest)→checksum·optimizer_step", note: "다른 node 수에서도 읽힌 세대만 complete로 기록합니다." },
  ], output: "요청 반환·durable publish·restore가 각각 찍힌 한 세대의 timeline", repeatUntil: "Request size, client 수, cache 상태, software manifest 또는 failure domain이 바뀔 때마다 다시 실행합니다." },
  sources: [
    { source: "Linux Kernel · VFS", excerpt: "This tree maintains information about the PG_Dirty and PG_Writeback status of each page, so that pages with either of these flags can be found quickly.", application: "Buffered write의 `write()` 반환과 backing storage writeback·error 보고를 다른 완료 시점으로 설명합니다.", citation: "Linux Kernel Documentation, Overview of the Linux Virtual File System", href: "https://docs.kernel.org/filesystems/vfs.html", note: "Page cache의 address_space, Dirty·Writeback과 fsync에서 writeback error를 회수하는 현재 kernel 문서입니다." },
    { source: "NVIDIA HGX AI Factory · Certified Storage", excerpt: "approximately 12.5 Gb/s per GPU", application: "GPU 128개에 곱해 1.6Tb/s, 200GB/s aggregate sizing 기준선을 만들되 workload 보장값과 분리합니다.", citation: "NVIDIA, HGX AI Factory Certified Storage", href: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/nvidia-certified-storage.html", note: "HGX B300 cluster용 공개 sizing guideline과 certified storage program의 범위를 확인합니다." },
  ],
  review: [
    "4MiB 요청으로 8GiB/s를 내고 평균 latency가 4ms라면 필요한 IOPS와 in-flight 수는 얼마입니까? (답: 3절)",
    "`write()` 성공, `fsync()` 완료, distributed checkpoint publish는 왜 같은 뜻이 아닙니까? (답: 5절)",
    "스토리지 채택 전에 정상 상태 외에 어떤 고장·복구 시험을 해야 합니까? (답: 10절)",
  ],
};

export const rackPowerCoolingData: AiInfrastructureArticleData = {
  engineeringDepth: rackPowerCoolingDepth,
  formulas: [
    {
      section: "mechanism",
      content: {
        question: "B300 16대의 평균 열 가운데 90%를 물로 받고 온도차를 10°C로 두면 필요한 유량은 얼마인가요?",
        idea: "서버 평균 전력을 열부하로 보고, 물이 받는 몫을 비열과 공급·환수 온도차로 나눕니다. 먼저 평균과 피크 전력을 따로 계산합니다.",
        formula: String.raw`P_{\mathrm{avg}}=16\times14.5=232\,\mathrm{kW},\quad P_{\mathrm{peak}}=16\times19=304\,\mathrm{kW},\quad\dot m=\frac{0.9P_{\mathrm{avg}}}{c_p\Delta T}\approx4.99\,\mathrm{kg/s}`,
        annotatedFormula: String.raw`\underbrace{P_{\mathrm{avg}}}_{\text{평균 IT 부하}}=232\,\mathrm{kW},\quad\underbrace{P_{\mathrm{peak}}}_{\text{피크 IT 부하}}=304\,\mathrm{kW},\quad\underbrace{\dot m}_{\text{필요 질량 유량}}=\frac{\overbrace{0.9P_{\mathrm{avg}}}^{\text{물이 받는 열}}}{\underbrace{c_p\Delta T}_{\text{물 1kg의 운반량}}}\approx4.99\,\mathrm{kg/s}`,
        operations: [
          { expression: String.raw`16\times14.5=232\,\mathrm{kW}`, annotation: "16대의 설명용 평균 전력을 합합니다." },
          { expression: String.raw`0.9\times232=208.8\,\mathrm{kW}`, annotation: "전체 평균 열의 90%를 물이 받는다고 가정합니다." },
          { expression: String.raw`\frac{208.8}{4.186\times10}\approx4.99\,\mathrm{kg/s}`, annotation: "물의 비열과 10°C 온도차로 나눠 질량 유량을 구합니다." },
        ],
        terms: [
          { symbol: String.raw`P_{\mathrm{avg}},P_{\mathrm{peak}}`, name: "평균·피크 IT 부하", description: "같은 16대라도 배전과 냉각에서 쓰임이 다른 두 planning 값입니다." },
          { symbol: String.raw`\dot m`, name: "질량 유량", description: "매초 열교환기를 지나는 물의 질량입니다." },
          { symbol: String.raw`c_p`, name: "물의 비열", description: "이 계산에서는 약 4.186kJ/(kg·°C)를 씁니다." },
          { symbol: String.raw`\Delta T`, name: "공급·환수 온도차", description: "설명용으로 10°C를 가정합니다." },
        ],
        assumptions: ["정상 상태에서 물의 물성이 일정하고 평균 열의 90%가 수측으로 포집됩니다.", "펌프 열·압력 손실·열교환기 접근 온도·수질·N+1 여유는 포함하지 않습니다."],
        interpretation: "약 4.99kg/s는 시설팀과 용량을 대화하기 위한 1차 검산값입니다. 배관 직경이나 CDU 승인 용량을 대신하지 않습니다.",
      },
    },
  ],
  sections: [
    { id: "overview", level: "S", title: "1. 랙 공간은 남았지만 네 번째 서버를 켤 수 없습니다", bridge: "빈 U가 설치 가능성을 보장하지 않았습니다. 들어온 전력이 열이 되어 밖으로 나갈 때까지 같은 부하를 따라갑니다.", paragraphs: [
      "(가정) 랙 하나에 B300 서버 네 대를 올렸습니다. 물리 공간은 맞았지만 피크 부하에서 한쪽 급전이 정격에 가까워졌고, 냉각수 환수 온도도 계속 올랐습니다. 평균 전력만 보고 승인한 탓에 feed 하나나 pump 하나가 빠지면 네 대를 유지할 수 없습니다.",
      "이 사건은 전기와 냉방을 별도 표로 계산하면 왜 안 되는지 보여 줍니다. 서버가 받은 전력은 거의 전부 열로 바뀝니다. 따라서 같은 16노드의 평균·피크·고장 상태를 전원 입구에서 실외 열 방출까지 한 번도 바꾸지 않고 추적해야 합니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 콘센트에서 실외 열 방출까지 이어 봅니다", bridge: "전력과 열이 같은 장부라는 결론을 얻었습니다. 에너지가 지나가는 관문을 차례로 봅니다.", paragraphs: [
      "시설 전원은 변압·UPS·배전·rack feed를 거쳐 서버 입력에 닿습니다. 서버 안에서 계산과 fan에 쓰인 전력은 열이 되어 공기 또는 냉각수로 옮겨지고, 열교환기와 facility loop를 거쳐 chiller·cooling tower 같은 최종 방출 설비로 갑니다.",
      "어느 한 구간의 용량이 작아도 전체가 그 값에 묶입니다. PDU가 충분해도 한쪽 feed 장애에서 남은 경로가 피크를 받지 못하거나, 열교환기는 충분해도 facility water 온도·유량이 맞지 않으면 rack을 가동할 수 없습니다.",
    ] },
    { id: "case", level: "0", title: "3. 16대의 평균 232kW와 피크 304kW를 셉니다", bridge: "전체 경로를 정했습니다. NVIDIA 공개 planning 값에 16노드를 대입해 시설 기준선을 만듭니다.", paragraphs: [
      "NVIDIA의 B300 data center guide는 DC busbar 시스템당 예상 시스템 전력 14.5kW와 예상 피크 19kW를 제시합니다. 둘 다 공급 공기 25°C를 전제로 한 추정치이고, ‘평균’이라는 말은 rack 표(58kW Average)에만 붙습니다. 이 글은 14.5kW를 평균으로 읽습니다. 16대면 서버만 평균 232kW, 피크 304kW입니다. AC rack PDU 모델은 대당 15kW와 19.7kW라서 같은 16대도 평균 240kW, 피크 315.2kW입니다. 스위치·스토리지·관리 노드와 냉각 장치 자체 전력은 어느 합에도 아직 들어가지 않았습니다.",
      "그 빠진 몫이 얼마나 되는지는 같은 guide의 64-node SU 전력표가 보여 줍니다. B300 rack 16개가 평균 820kVA·피크 1228kVA일 때 network·management·storage rack 8개가 104/105kVA, CDU 2대가 24/70kVA, RDHx 24대가 27/47kVA를 더해 합계는 975/1450kVA입니다. 냉각 장치만 평균 51kVA, 피크 117kVA이므로 cooling auxiliary 전력은 서버 합과 별도 행으로 잡아야 합니다.",
      "DC 고밀도안으로 4대씩 넣으면 compute rack 4개이고 rack당 평균 58kW, 피크 76kW입니다. AC 저밀도안으로 2대씩 넣으면 8개 rack, rack당 평균 30kW, 피크 39.4kW입니다. 서버 수가 같아도 전원 방식과 rack·공조·케이블 경로가 달라집니다.",
    ] },
    { id: "picture", level: "1", title: "4. 저밀도와 고밀도 랙을 현장 제약으로 고릅니다", bridge: "같은 총전력이 다른 rack 수로 갈릴 수 있음을 봤습니다. 밀도 선택의 비용을 나눕니다.", paragraphs: [
      "고밀도는 바닥 면적과 cable 거리를 줄이지만 rack당 76kW 피크와 높은 airflow, 특수 배전·보조 냉각을 요구합니다. 기존 전산실이 rack당 30~40kW만 받을 수 있다면 서버 수가 맞아도 4대 rack은 불가능합니다.",
      "저밀도는 기존 시설에 맞추기 쉽지만 rack 수와 floor space, cable 길이, PDU·rack 부속이 늘어납니다. 계산 결과가 한 가지 ‘정답 rack’이 아니라 site constraint에 따른 두 후보가 되는 이유입니다.",
    ] },
    { id: "need", level: "2", title: "5. RDHx와 DLC를 같은 수랭으로 부르지 않습니다", bridge: "밀도 선택이 냉각 방식과 연결됨을 봤습니다. 물이 어느 지점에서 열을 받는지 구분합니다.", paragraphs: [
      "후면 도어 열교환기(Rear Door Heat Exchanger, RDHx)는 서버가 공기로 내보낸 열을 rack 뒤에서 물로 옮깁니다. 서버 내부는 여전히 공랭입니다. 직접 액체 냉각(Direct Liquid Cooling, DLC)은 cold plate가 GPU·CPU 같은 부품의 열을 서버 안에서 냉각수로 직접 받습니다.",
      "둘 다 facility water와 열교환이 필요할 수 있지만 누수 경계·공기 잔열·공급수 조건·서비스 절차가 다릅니다. B300 공랭 시스템에 active RDHx를 쓰는 공개 배치를 곧바로 DLC 사례라고 부르면 안 됩니다. 같은 guide는 “Passive Rear Door Heat Exchangers are not recommended for DGX B300 Systems”라고 적습니다. 자체 fan이 없는 passive door는 이 시스템의 권장 선택지가 아니므로 고밀도안의 door는 active 방식으로 검토합니다.",
    ] },
    { id: "names", level: "3", title: "6. PDU·UPS·RDHx·CDU의 경계를 붙입니다", bridge: "물의 접점을 구분했습니다. 전기와 액체 경로에서 자주 섞이는 네 장치의 역할을 붙입니다.", paragraphs: [
      "무정전 전원 장치(UPS)는 입력 정전·품질 문제에서 저장 에너지와 전력 변환으로 부하를 이어 줍니다. 전원 분배 장치(PDU)는 rack 또는 설비 구간에 전원을 나누고 계측·보호합니다. 둘 다 발전기와 branch circuit 전체를 뜻하지 않습니다.",
      "RDHx는 rack 배기 공기와 물 사이의 열교환기입니다. 냉각수 분배 장치(Coolant Distribution Unit, CDU)는 IT loop와 facility water loop 사이에서 열을 교환하고 유량·압력·수질을 관리합니다. 실제 제품에 따라 pump·이중화·열교환기 배치가 다릅니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 전력과 냉각 예산을 같은 원장으로 만듭니다", bridge: "각 장치의 경계를 찾았습니다. 이제 rack 한 행에서 전력과 열 제거를 함께 검산합니다.", paragraphs: [
      "rack마다 서버 수, 평균·피크 kW, A/B feed와 upstream UPS, PDU connector·phase, 한 feed 상실 뒤 허용 용량을 적습니다. 같은 행에 air heat와 water-captured heat, 요구 inlet 조건, facility supply/return 온도와 flow, N+1 장치 상태를 붙입니다.",
      "(가정) DC 고밀도안의 평균 232kW 중 90%를 RDHx가 물로 옮기고 공급·환수 온도차를 10°C로 유지하면 물이 운반할 열은 208.8kW입니다. 물의 비열을 약 4.18kJ/kg·K로 두면 필요한 질량 유량은 약 5.0kg/s입니다. 피크 304kW에 같은 가정을 적용하면 약 6.5kg/s가 필요합니다. 잔여 공기열과 pump·fan 열은 시설 경로에서 따로 제거합니다.",
    ] },
    { id: "source", level: "5", title: "8. B300 공개 평균·피크를 랙 수에 적용합니다", bridge: "같은 원장에 전력과 유량을 넣었습니다. NVIDIA의 두 deployment pattern을 현 사례에 대입합니다.", paragraphs: [
      "NVIDIA guide는 48U MGX rack에 공랭 B300 4대와 active RDHx를 쓰는 고밀도안, 전통 공랭 rack에 2대를 넣는 저밀도안을 제시합니다. 16대 사례는 각각 compute rack 4개와 8개입니다.",
      "공개 값은 planning estimate입니다. 실제 OEM configuration, workload power cap, ambient와 fan curve, AC·DC power option에 따라 달라지므로 발주 전 vendor submittal과 현장 measurement로 교체해야 합니다.",
    ] },
    { id: "comparison", level: "6", title: "9. 싱가포르의 고온 운영 기준을 별도로 확인합니다", bridge: "장비 쪽 deployment 기준을 적용했습니다. 이제 설치 지역의 facility 운영 기준을 별도 축으로 확인합니다.", paragraphs: [
      "싱가포르 IMDA는 SS 697:2023을 tropical climate에서 data center 운영 온도를 26°C 이상으로 단계적으로 높이는 방법과 지침으로 설명합니다. 이 기준을 이유로 장비 inlet 한계를 임의로 올리면 안 됩니다. server vendor 환경 범위와 facility risk assessment를 함께 만족해야 합니다.",
      "B300 쪽 숫자는 NVIDIA guide에 있습니다. 사양표의 operating temperature는 10–35°C이지만, 공급 공기는 ASHRAE Class A2를 따르되 최대 30°C로 제한하라고 적습니다. ASHRAE 표의 권장(recommended) 범위는 모든 A 등급 공통 18–27°C이고, 30°C까지는 허용(allowable) 구간입니다. 고도 조건도 붙어서 30°C 운전은 해발 1000ft 이하에서만 열립니다. 따라서 26°C 공급은 권장 상한 27°C 바로 아래, 28–30°C는 권장 밖 허용 구간이 됩니다. 3절의 14.5kW·19kW는 25°C 공급 공기 기준 추정치라 26°C 이상에서는 그대로 쓰지 말고 현장 측정값으로 바꿉니다(확인일 2026-10-09).",
      "높은 공급 온도는 냉각 에너지를 줄일 수 있지만 고밀도 rack의 실제 inlet 분포와 습도·hotspot을 측정해야 합니다. 평균 room temperature 하나로 모든 server inlet이 안전하다고 결론내리지 않습니다.",
    ] },
    { id: "limits", level: "7", title: "10. 유량 계산은 설비 승인 도면이 아닙니다", bridge: "지역 기준까지 대조했습니다. 마지막으로 빠른 sizing과 전문 설계의 경계를 남깁니다.", paragraphs: [
      "약 5.0kg/s 계산은 steady state, 일정한 비열과 10°C 온도차, 90% heat capture라는 설명용 가정입니다. pipe 직경·압력 손실·pump curve·water chemistry·condensation·leak detection·CDU heat exchanger approach temperature는 포함하지 않습니다.",
      "솔루션 엔지니어는 이 숫자로 시설팀과 질문할 수 있어야 하지만 전기 single-line과 수배관 도면을 무자격으로 승인하지 않습니다. vendor·MEP·data center operator가 낸 설계와 N−1 시험 결과를 요구사항 원장에 연결하는 것이 역할입니다.",
    ] },
  ],
  overviewFlow: { title: "전기가 열로 바뀌어 시설 밖으로 나가는 길", steps: [
    { actor: "전원 경로", movement: "UPS·배전·A/B feed가 rack과 server에 전력을 보냅니다.", receives: "평균·피크·N−1 kW" },
    { actor: "서버와 rack", movement: "계산에 쓴 전력이 공기와 물의 열로 바뀝니다.", receives: "air heat와 captured heat" },
    { actor: "열 방출", movement: "열교환기·facility loop가 열을 외부로 옮깁니다.", receives: "온도·유량·압력·예비 용량" },
  ] },
  numericCase: { title: "B300 16대의 공개 planning 값", steps: [
    { label: "평균", value: "232kW", detail: "16×14.5kW" },
    { label: "피크", value: "304kW", detail: "16×19kW" },
    { label: "고밀도", value: "4 racks", detail: "DC rack당 4대, 피크 76kW" },
  ] },
  decision: { title: "rack density 선택", question: "현장이 rack당 피크 전력과 열 제거를 어디까지 보장합니까?", options: [
    { signal: "76kW peak와 active RDHx, 특수 배전·구조를 지원합니다.", choose: "4대 고밀도 후보", why: "면적과 cable 거리를 줄이되 시설 의존성과 장애 영향이 커집니다." },
    { signal: "rack당 39.4kW 피크와 전통 공랭만 안정적으로 지원합니다.", choose: "2대 저밀도 후보", why: "rack 수는 늘지만 기존 시설 제약에 맞출 가능성이 큽니다." },
    { signal: "어느 방식도 N−1과 server inlet을 증명하지 못합니다.", choose: "site remediation 또는 다른 위치", why: "server를 주문하기 전에 배전·냉각·바닥·배관 조건을 먼저 닫습니다." },
  ] },
  terms: { title: "전기와 물 경로의 네 장치", items: [
    { term: "PDU·UPS", description: "PDU는 전원을 나누고 계측·보호하며 UPS는 입력 이상에서 부하를 이어 주는 전력 장치입니다.", example: "A feed 상실 뒤 B feed와 upstream UPS가 rack peak를 혼자 받습니다.", boundary: "두 PDU가 같은 upstream에 묶이면 독립 failure domain이 아닙니다." },
    { term: "RDHx", description: "rack 뒤에서 server 배기 공기의 열을 물로 옮기는 후면 도어 열교환기입니다.", example: "공랭 B300 4대의 뜨거운 배기를 active rear door가 받습니다.", boundary: "GPU cold plate에 물이 직접 흐르는 DLC와 다릅니다." },
    { term: "CDU", description: "IT 냉각수와 facility water 사이에서 열을 교환하고 유량·압력·수질을 관리하는 장치입니다.", example: "열교환기와 pump를 N+1로 두고 한 unit 정지 상태를 시험합니다.", boundary: "chiller·cooling tower 등 최종 heat rejection 전체를 대신하지 않습니다." },
  ] },
  algorithm: { title: "16대 power·cooling budget 만들기", input: ["16 systems", "14.5kW average", "19kW peak", "site rack limit", "facility water 조건"], steps: [
    { code: "server·network·storage·cooling_aux 전력을_분리", note: "서버 합만으로 site total을 끝내지 않습니다." },
    { code: "2대·4대_rack의_평균·피크를_계산", note: "rack 수와 density 후보를 만듭니다." },
    { code: "A/B 한쪽_상실에서_남은_path_용량을_검산", note: "정상 합계가 아니라 N−1을 봅니다." },
    { code: "air·water heat와_온도차·유량을_같은_행에_기록", note: "RDHx와 DLC의 capture boundary를 구분합니다." },
    { code: "실제_workload로_power·inlet·flow·throttle을_측정", note: "planning 값을 현장 acceptance 값으로 교체합니다." },
  ], output: "rack별 average·peak·N−1 전력과 air/water 열 제거 원장", repeatUntil: "rack population·power cap·facility 조건이 바뀔 때마다 다시 산정합니다." },
  sources: [
    { source: "NVIDIA · Data Center Best Practices with DGX B300", excerpt: "Four air-cooled DGX B300s per 48U MGX rack", application: "16대 예를 4대×4 racks 또는 2대×8 racks로 나누고 rack 평균·피크를 계산합니다.", citation: "NVIDIA, Data Center Best Practices with DGX B300", href: "https://docs.nvidia.com/dgx-pdf/data-center-best-practices-with-dgx-b300-v1.pdf", note: "B300의 고밀도·저밀도 배치, 평균·피크 전력(25°C 공급 공기 기준 추정), 10–35°C operating temperature와 최대 30°C 공급 공기, passive RDHx 비권장, 64-node SU 보조 전력표를 다루는 공식 planning guide입니다(확인일 2026-10-09)." },
    { source: "Singapore IMDA · Tropical DC Standard", excerpt: "gradual increase in the DC operating temperatures to 26°C and above", application: "싱가포르 고온 운영은 임의 setpoint가 아니라 SS 697 방법과 vendor 환경 범위를 함께 검증하는 별도 조건으로 둡니다.", citation: "IMDA, Tropical Data Centre Standard SS 697:2023", href: "https://www.imda.gov.sg/how-we-can-help/green-dc-roadmap/tropical-dc-standard", note: "tropical climate에서 운영 온도를 안전하게 높이는 방법과 냉각 에너지 절감 범위를 설명하는 싱가포르 공식 안내입니다." },
  ],
  review: [
    "B300 16대의 평균 232kW와 피크 304kW는 어떻게 계산합니까? (답: 3절)",
    "RDHx와 DLC는 물이 어느 지점에서 열을 받는지가 어떻게 다릅니까? (답: 5절)",
    "약 5.0kg/s 유량이 실제 배관 승인값이 아닌 이유는 무엇입니까? (답: 7·10절)",
  ],
};

export const commissioningAcceptanceData: AiInfrastructureArticleData = {
  engineeringDepth: commissioningAcceptanceDepth,
  formulas: [
    {
      section: "case",
      content: {
        question: "16노드에서 노드마다 네 묶음의 검수 증거를 요구하면 최소 몇 개가 필요한가요?",
        idea: "각 노드에서 빠짐없이 남겨야 하는 증거 묶음 수를 노드 수와 곱합니다. 클러스터·시설 시험은 이 값에 별도로 더합니다.",
        formula: String.raw`E_{\min}=N_{\mathrm{node}}\times K_{\mathrm{evidence}}=16\times4=64`,
        annotatedFormula: String.raw`\underbrace{E_{\min}}_{\text{최소 노드별 결과}}=\underbrace{N_{\mathrm{node}}}_{\text{검수 노드}}\times\underbrace{K_{\mathrm{evidence}}}_{\text{노드당 증거 묶음}}=16\times4=64`,
        operations: [
          { expression: String.raw`16\times4=64`, annotation: "16대 각각에서 inventory·health·stress·network 증거를 하나씩 남깁니다." },
        ],
        terms: [
          { symbol: String.raw`E_{\min}`, name: "최소 노드별 결과 수", description: "노드 단위로 추적해야 할 결과 묶음의 하한입니다." },
          { symbol: String.raw`N_{\mathrm{node}}`, name: "검수 노드 수", description: "이 사례에서는 GPU 서버 16대입니다." },
          { symbol: String.raw`K_{\mathrm{evidence}}`, name: "노드당 증거 묶음", description: "이 사례에서 정의한 네 종류입니다." },
        ],
        assumptions: ["네 증거 묶음은 모든 노드에 동일하게 적용합니다.", "node pair·rail·collective·storage·전력·냉각 시험은 별도입니다."],
        interpretation: "64개는 node-level 증거의 최소 수입니다. 파일 개수만 채우는 것이 아니라 serial·명령·버전·threshold·결과를 함께 남겨야 합니다.",
      },
    },
  ],
  sections: [
    { id: "overview", level: "S", title: "1. 서버 16대에 초록불이 켜졌지만 고객은 인수를 거절했습니다", bridge: "전원과 수량은 맞았지만 완료를 증명할 자료가 없습니다. 계약의 한 문장이 어떤 시험과 파일로 바뀌어야 하는지 추적합니다.", paragraphs: [
      "(가정) 서버 16대가 모두 켜졌고 GPU도 128개로 보였습니다. 그러나 고객 workload는 목표 시간 안에 끝나지 않았고, cable 하나를 뽑자 여러 rank가 멈췄습니다. 어떤 firmware 조합으로 시험했는지와 직전 정상 결과도 남아 있지 않아 납품 완료에 서명할 수 없었습니다.",
      "이 글의 질문은 ‘장비가 동작하는가’보다 좁고 엄격합니다. 계약 전에 정한 기능·성능·장애·운영 조건을 누가 어떤 명령으로 시험하고, 어느 수치를 넘으면 합격이며, 예외와 복구 절차를 어떤 원문 파일로 넘길 것인가를 정합니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 설계 기준이 시험과 인수 증거로 이어집니다", bridge: "완료의 뜻을 증거로 바꿨습니다. 한 요구가 납품까지 어떻게 추적되는지 봅니다.", paragraphs: [
      "요구사항 하나마다 설계 결정과 BOM 행, 설치 확인, 시험 절차, 합격 문턱, 결과 파일, 예외 승인과 운영 문서를 연결합니다. 어느 단계에서 값이 바뀌면 뒤의 항목도 다시 검토합니다.",
      "시험은 정상 상태만 보지 않습니다. cable·NIC·node·feed·pump 같은 한 구성요소를 잃은 상태, 장시간 부하, 재부팅과 재시작, 잘못된 version을 탐지하는 절차까지 포함합니다.",
    ] },
    { id: "case", level: "0", title: "3. 16대의 네 단계 검수에서 64개 증거를 남깁니다", bridge: "요구에서 결과까지 연결했습니다. 작은 증거 수로 누락을 눈에 보이게 만듭니다.", paragraphs: [
      "(가정) 16노드 각각에 inventory, health, 단일-node stress, network identity 네 묶음의 증거를 요구하면 최소 64개 node-level 결과가 생깁니다. 여기에 node pair·rail·16노드 collective와 전력·냉각 N−1 시험이 별도로 붙습니다.",
      "64개 파일만 모았다고 끝나지는 않습니다. 같은 manifest와 timestamp, serial·rack·port identity, command·입력·threshold·pass/fail이 있어야 어느 장비의 어떤 상태인지 다시 확인할 수 있습니다.",
    ] },
    { id: "picture", level: "1", title: "4. 공장·현장·성능·운영 인수를 나눕니다", bridge: "증거의 최소 개수를 셌습니다. 한 번에 섞기 쉬운 네 검수 경계를 나눕니다.", paragraphs: [
      "출하 전 공장 시험은 주문 구성과 기본 기능을 확인합니다. 현장 시험은 실제 rack·전원·cable·주소·냉각 연결을 확인합니다. 성능 시험은 대표 workload와 collective·storage 목표를 검증합니다. 운영 인수는 monitoring·backup·patch·장애 대응·교육과 support escalation을 넘깁니다.",
      "공장 시험 합격이 현장 cable과 facility를 증명하지 않으며, benchmark 합격이 운영팀의 복구 준비를 증명하지 않습니다. 각 단계의 분모와 책임자를 분리합니다.",
    ] },
    { id: "need", level: "2", title: "5. 합격 기준을 발주 뒤에 정하면 분쟁이 생깁니다", bridge: "검수 경계를 나눴습니다. acceptance threshold를 제안서에서 먼저 정해야 하는 이유를 봅니다.", paragraphs: [
      "‘NCCL이 빠르게 동작한다’는 문구는 합격 기준이 아닙니다. node 수, message size, operation, 반복 수, software manifest, 허용 편차와 correctness를 적어야 납품자와 고객이 같은 결과를 판단합니다.",
      "수치가 아직 없다면 기준선 측정 절차와 합의 시점을 계약에 둡니다. 장비 도착 뒤 한쪽이 임의로 threshold를 정하면 성능 부족인지 비현실적 요구인지 구분하기 어렵습니다.",
    ] },
    { id: "names", level: "3", title: "6. FAT·SAT·acceptance ledger에 이름을 붙입니다", bridge: "합격 문턱의 필요를 봤습니다. 제안과 프로젝트에서 쓰는 세 산출물의 범위를 붙입니다.", paragraphs: [
      "공장 인수 시험(Factory Acceptance Test, FAT)은 출하 전 공급자 환경에서 구성·기능을 확인합니다. 현장 인수 시험(Site Acceptance Test, SAT)은 실제 설치 장소의 전원·망·냉각·주소·운영 연결을 확인합니다.",
      "인수 원장(acceptance ledger)은 요구사항 ID, 시험 ID, version manifest, 입력·명령·threshold·결과 artifact·예외·서명과 재시험 이력을 한 행으로 잇는 기록입니다. 완료 보고서의 체크 표시만으로 이 추적성을 대신할 수 없습니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 요구사항을 검수 항목으로 바꿉니다", bridge: "검수 산출물의 이름을 붙였습니다. 이제 ‘128 GPU 정상 운영’을 실행 가능한 시험으로 분해합니다.", paragraphs: [
      "먼저 16대의 serial·rack·port·firmware·software inventory를 baseline으로 고정합니다. node health와 stress를 통과한 뒤 link·RDMA·node pair를 확인하고, 작은 node group에서 16노드 collective로 넓힙니다. storage checkpoint와 대표 training·inference workload를 같은 manifest로 실행합니다.",
      "그다음 cable·node·feed·cooling component를 하나씩 잃고 alarm·degraded mode·job 영향·복구 시간을 기록합니다. 마지막으로 monitoring dashboard, runbook, backup·restore, spare와 support 연락망을 운영팀이 직접 실행하게 합니다.",
    ] },
    { id: "source", level: "5", title: "8. NVSM·Slurm·NCCL로 층별 상태를 확인합니다", bridge: "계층별 시험 순서를 만들었습니다. NVIDIA 공개 deployment 절차의 실제 명령과 비교합니다.", paragraphs: [
      "DGX B300 user guide는 production 전 NVSM health와 약 20분 stress test를 권합니다. B300 deployment guide는 node 상태, openibd·fabric manager, Slurm `sinfo`, GPU test, multi-node NCCL test로 범위를 넓힙니다.",
      "각 명령은 다른 층을 봅니다. `nvidia-smi` 성공으로 RDMA와 collective를 통과했다고 보지 않으며, NCCL bus bandwidth 하나로 storage·전력 N−1과 application SLA를 통과했다고 보지 않습니다.",
    ] },
    { id: "comparison", level: "6", title: "9. 공공 제안에서는 CSAP 범위를 따로 적습니다", bridge: "기술 시험을 공식 deployment 절차와 맞췄습니다. 공공 사업의 인증 주장을 기술 검수와 분리합니다.", paragraphs: [
      "클라우드서비스 보안인증(CSAP)은 제공하는 cloud service가 정해진 정보보호 기준을 준수하는지 평가하는 제도입니다. GPU server·rack을 납품했다는 사실만으로 고객에게 제공할 cloud service 전체가 인증됐다고 말할 수 없습니다.",
      "RFP에서는 인증 대상 service·등급·유효 범위와 subcontractor·data location·운영 통제를 현재 KISA 안내서와 증서에서 확인합니다. 기술 BOM의 보안 기능과 service certification claim을 별도 추적 행으로 둡니다.",
    ] },
    { id: "limits", level: "7", title: "10. 벤치마크 한 번으로 운영 인수를 끝내지 않습니다", bridge: "공공 인증 범위까지 분리했습니다. 마지막으로 pass 한 번 뒤에도 남는 운영 위험을 닫습니다.", paragraphs: [
      "짧은 benchmark는 초기 성능 기준선일 뿐 장시간 열 포화, 간헐적 ECC·link error, checkpoint 복구, patch 뒤 regression을 모두 보여 주지 않습니다. soak test와 정기 재검증, monitoring threshold를 운영 계획에 넣습니다.",
      "면접에서는 프로젝트를 비판하는 대신 ‘실제 맡은 범위’와 ‘이렇게 acceptance를 다시 설계했다’를 구분합니다. 요구사항→BOM→시험→증거→운영 인수의 한 행을 실제 예로 설명하면 직접 rack을 설계하지 않았던 경계도 정직하게 드러납니다.",
    ] },
  ],
  overviewFlow: { title: "요구사항이 인수 증거가 되는 경로", steps: [
    { actor: "설계 계약", movement: "요구사항을 BOM 행과 정량 threshold에 연결합니다.", receives: "검수 가능한 acceptance plan" },
    { actor: "층별 시험", movement: "inventory→health→link→collective→workload→failure를 실행합니다.", receives: "재현 가능한 artifact" },
    { actor: "운영 인수", movement: "runbook·monitoring·spare·support를 운영팀이 직접 확인합니다.", receives: "서명·예외·재시험이 남은 ledger" },
  ] },
  numericCase: { title: "16노드의 최소 node-level 증거", steps: [
    { label: "노드", value: "16대", detail: "serial과 rack identity" },
    { label: "시험 묶음", value: "4개/노드", detail: "inventory·health·stress·network" },
    { label: "최소 결과", value: "64개", detail: "cluster·facility 시험은 별도" },
  ] },
  decision: { title: "검수 단계를 어디서 수행할까", question: "이 항목은 주문 구성, 실제 현장 연결, 성능, 운영 능력 중 무엇을 증명합니까?", options: [
    { signal: "serial·부품·firmware와 기본 기능을 출하 전에 확인합니다.", choose: "FAT", why: "잘못된 구성의 현장 반입을 줄이되 site 상태를 증명하지는 않습니다." },
    { signal: "rack·전원·cable·주소·냉각 연결을 실제 위치에서 확인합니다.", choose: "SAT", why: "현장 installation과 facility interface를 닫습니다." },
    { signal: "운영팀이 장애·복구·patch·support 절차를 직접 수행합니다.", choose: "운영 acceptance", why: "benchmark 결과와 별도로 독립 운영 가능성을 확인합니다." },
  ] },
  terms: { title: "납품을 닫는 세 기록", items: [
    { term: "FAT", description: "출하 전에 공급자 환경에서 주문 구성과 기본 기능을 확인하는 공장 인수 시험입니다.", example: "serial·GPU/NIC 수량·firmware와 기본 health를 확인합니다.", boundary: "고객 현장의 전원·cable·cooling 연결을 증명하지 않습니다." },
    { term: "SAT", description: "실제 설치 장소에서 시설 interface와 system 동작을 확인하는 현장 인수 시험입니다.", example: "A/B feed, port map, RDMA, storage와 alert를 현장 연결에서 시험합니다.", boundary: "운영팀의 patch·backup·장기 장애 대응 능력을 자동으로 증명하지 않습니다." },
    { term: "Acceptance ledger", description: "요구·시험·환경·threshold·결과·예외·서명을 한 행으로 추적하는 인수 원장입니다.", example: "REQ-NET-03을 TEST-NCCL-07과 log artifact, 재시험 날짜에 연결합니다.", boundary: "체크리스트가 있어도 원본 결과와 version manifest가 없으면 재현할 수 없습니다." },
  ] },
  algorithm: { title: "128 GPU 납품을 증거로 닫기", input: ["요구사항 ID", "BOM과 serial", "threshold", "version manifest", "운영팀"], steps: [
    { code: "각_요구를_BOM행·시험ID·담당자에_연결", note: "발주 전에 acceptance 범위를 고정합니다." },
    { code: "16노드_inventory→health→stress를_실행", note: "node-level baseline을 만듭니다." },
    { code: "link→RDMA→pair→16-node collective로_확대", note: "첫 실패한 통신 층을 분리합니다." },
    { code: "storage·workload·전력·냉각_N−1을_검증", note: "성능과 facility 장애를 함께 봅니다." },
    { code: "운영팀이_runbook·restore·escalation을_재현", note: "문서 전달이 아니라 실제 handover를 확인합니다." },
    { code: "예외는_위험·기한·owner·재시험으로_서명", note: "미해결 항목을 완료로 숨기지 않습니다." },
  ], output: "FAT·SAT·성능·운영 evidence와 예외가 연결된 acceptance ledger", repeatUntil: "모든 필수 요구가 통과하거나 명시적으로 승인된 예외로 닫힐 때까지 반복합니다." },
  sources: [
    { source: "NVIDIA B300 Deployment Guide", excerpt: "run sinfo to verify that all the nodes are up and ready", application: "node health 뒤 Slurm·GPU·multi-node NCCL로 범위를 넓히는 현장 시험 순서에 적용합니다.", citation: "NVIDIA, B300 BasePOD and SuperPOD Deployment Guide", href: "https://docs.nvidia.com/dgx-basepod/deployment-guides/dgx-basepod-b200/latest/b300/b300-nmc.html", note: "B300 network·provisioning·service 상태와 Slurm·NCCL validation 명령을 담은 공식 deployment guide입니다." },
    { source: "KISA · CSAP 안내", excerpt: "클라우드컴퓨팅서비스 사업자가 제공하는 서비스에 대해 정보보호 기준의 준수여부를 평가․인증하는 제도", application: "hardware 납품의 보안 기능과 cloud service certification claim을 분리하고 현재 인증 범위를 증서로 확인합니다.", citation: "KISA, 클라우드 보안인증제(CSAP) 소개", href: "https://www.kisa.or.kr/1050603", note: "KISA 공식 사이트의 CSAP 제도 소개입니다. 이전에 인용한 isms.kisa.or.kr 공지 경로는 2026-10-09 확인 시 DNS가 해석되지 않고 보관 사본도 없어 이 페이지로 바꿨습니다." },
  ],
  review: [
    "16노드×4개 시험이 64개 결과가 되어도 cluster 검수가 끝나지 않는 이유는 무엇입니까? (답: 3절)",
    "FAT와 SAT, 운영 acceptance는 각각 무엇을 증명합니까? (답: 4·6절)",
    "GPU server 납품과 CSAP 인증 주장을 분리해야 하는 이유는 무엇입니까? (답: 9절)",
  ],
};
