import type { AiInfrastructureArticleData } from "./Article";
import { ncaAiioDepth } from "./ncaAiioDepth";

export const ncaAiioStudyGuideData: AiInfrastructureArticleData = {
  engineeringDepth: ncaAiioDepth,
  formulas: [
    {
      section: "case",
      content: {
        question: "공식 비중을 50문항짜리 학습 장부에 적용하면 영역별로 몇 문제를 준비해야 하나요?",
        idea: "전체 연습 문제 수에 공식 비중을 곱합니다. 세 결과의 합이 다시 50인지 확인합니다.",
        formula: String.raw`Q_i = 50 \times w_i`,
        annotatedFormula: String.raw`\underbrace{Q_i}_{\text{영역별 연습 문제}}=\underbrace{50}_{\text{학습 장부의 전체 문제}}\times\underbrace{w_i}_{\text{공식 영역 비중}}`,
        operations: [
          { expression: String.raw`50\times0.38=19`, annotation: "AI 기초 영역 연습 문제를 19개로 둡니다." },
          { expression: String.raw`50\times0.40=20`, annotation: "인프라 영역 연습 문제를 20개로 둡니다." },
          { expression: String.raw`50\times0.22=11`, annotation: "운영 영역 연습 문제를 11개로 둡니다." },
          { expression: String.raw`19+20+11=50`, annotation: "세 영역이 전체 학습 장부를 빠짐없이 채우는지 검산합니다." },
        ],
        terms: [
          { symbol: String.raw`Q_i`, name: "영역별 연습 문제 수", description: "공식 비중을 반영해 직접 만들거나 푸는 학습 장부의 문제 수입니다." },
          { symbol: String.raw`w_i`, name: "영역 비중", description: "공식 blueprint의 38%, 40%, 22%를 소수로 바꾼 값입니다." },
        ],
        assumptions: [
          "50은 실제 시험 문항 수와 같은 크기로 만든 학습 장부입니다.",
          "공식 비중은 학습 배분에 사용하며 실제 시험의 영역별 문항 수가 정확히 19·20·11개라고 가정하지 않습니다.",
        ],
        interpretation: "이 계산은 공부 누락을 찾는 배분표입니다. 지원 직무의 핵심인 인프라·운영 실습 시간은 시험 비중보다 더 크게 배정할 수 있습니다.",
      },
    },
  ],
  sections: [
    {
      id: "overview",
      level: "S",
      title: "1. GPU는 열여섯 개 모두 보이는데 작업은 시작하지 못합니다",
      bridge: "자격 이름보다 먼저, 지금 답하지 못하는 현장 질문을 한 장면에 놓습니다.",
      paragraphs: [
        "(가정) 8-GPU node 두 대에서 장치 16개가 모두 보입니다. 단일 GPU test도 통과했습니다. 그런데 두 node가 함께 참여하는 학습 작업은 연결을 만드는 단계에서 멈추고, 대기열에는 사용 가능한 GPU가 남아 있다고 표시됩니다.",
        "면접관이 ‘연산 장치, node 사이 연결, 작업 배치, 전력·냉각 가운데 어디부터 확인하겠습니까?’라고 묻습니다. Kubernetes와 LLM serving은 설명할 수 있지만 이 네 구간을 한 흐름으로 잇지 못한다면 NCA-AIIO는 쓸모가 있습니다. 다만 자격증을 땄다는 사실보다 이 사건을 어디까지 추적할 수 있는지가 최종 목표입니다.",
      ],
    },
    {
      id: "black-box",
      level: "B",
      title: "2. 작업 하나가 준비되고 끝나는 네 구간을 엽니다",
      bridge: "작업이 멈춘 장면을 봤습니다. 제품 이름을 붙이기 전에 책임이 바뀌는 경로부터 따라갑니다.",
      paragraphs: [
        "첫 구간은 어떤 계산과 data 이동이 필요한지 정합니다. 둘째 구간은 연산 장치, memory, 저장 경로, node 사이 통로와 전기·열 제거 조건을 준비합니다. 셋째 구간은 여러 사용자의 요청 가운데 필요한 장치 묶음을 한 작업에 내줍니다. 넷째 구간은 온도·오류·대기·처리량을 보고 고장 난 자원을 격리한 뒤 되돌립니다.",
        "한 구간의 초록불은 다음 구간의 성공을 보장하지 않습니다. 장치 목록이 정상이어도 node 사이 통로가 막힐 수 있고, 통로가 정상이어도 필요한 GPU가 동시에 배정되지 않을 수 있습니다. NCA-AIIO의 세 영역은 이 전체 경로를 빠뜨리지 않았는지 확인하는 지도입니다.",
      ],
    },
    {
      id: "case",
      level: "0",
      title: "3. 공식 38·40·22%를 19·20·11개의 학습 장부로 바꿉니다",
      bridge: "네 책임 구간을 펼쳤습니다. 이제 공식 비중을 실제 공부 단위로 바꿉니다.",
      paragraphs: [
        "현재 공식 blueprint는 AI 기초 38%, AI 인프라 40%, AI 운영 22%입니다. 50칸짜리 연습 장부를 만든다면 각각 19개, 20개, 11개의 질문으로 배분할 수 있습니다. 합계가 50이므로 어느 영역도 사라지지 않습니다.",
        "이 숫자는 실제 시험에 정확히 19·20·11문항이 나온다는 예측이 아닙니다. ‘GPU 제품만 공부하다 운영 22%를 빼먹는 일’을 막는 학습 도구입니다. 오답마다 공식 목표 ID와 이어서 실행할 실습을 한 줄로 붙입니다.",
      ],
    },
    {
      id: "picture",
      level: "1",
      title: "4. 같은 장애도 첫 확인 문은 세 갈래입니다",
      bridge: "학습량을 세 영역에 나눴습니다. 이제 증상에 따라 어느 책임 구간부터 열지 고릅니다.",
      paragraphs: [
        "장치 하나가 진단에서 실패하면 작업 배치보다 그 장치의 상태와 연결 경로를 먼저 봅니다. 장치는 정상인데 필요한 여덟 GPU가 따로 흩어져 있으면 자원 할당 규칙을 봅니다. 작업이 시작된 뒤 data를 기다리거나 온도가 오르면 저장 경로와 열 제거 조건을 봅니다.",
        "이 선택은 원인을 미리 단정하는 규칙이 아닙니다. 첫 확인 지점을 정한 뒤 같은 시각의 상태와 출력을 모아 다음 문으로 이동하는 순서입니다.",
      ],
    },
    {
      id: "need",
      level: "2",
      title: "5. 합격 점수와 현장 수행 증거를 분리해야 합니다",
      bridge: "증상에서 첫 확인 문을 골랐습니다. 이제 자격의 폭과 실무의 깊이를 서로 다른 증거로 둡니다.",
      paragraphs: [
        "공식 Study Guide는 이 자격을 AI 인프라·운영에 새로 들어오는 IT 전문가를 위한 entry-level credential로 설명합니다. 세부 목표의 동사도 describe, identify, explain, articulate가 중심입니다. 구성요소의 목적과 선택 이유를 설명하는 폭을 확인하는 시험입니다.",
        "반면 엘리스 포지션은 workload 요구를 BOM, network topology, 전력·냉각, 구축·검수로 바꾸는 역할입니다. NCA-AIIO 합격은 좋은 출발점입니다. 여기에 실제 명령 출력·설계 원장·장애 복구 기록을 붙여야 ‘안다’가 ‘해봤다’에 가까워집니다.",
      ],
    },
    {
      id: "names",
      level: "3",
      title: "6. Blueprint·증거 지도·역할 경계에 이름을 붙입니다",
      bridge: "자격과 실무의 증거를 나눴습니다. 지금까지 쓴 세 도구의 표준 이름을 붙입니다.",
      paragraphs: [
        "시험 청사진(exam blueprint)은 무엇을 어느 비중으로 확인하는지 밝힌 공식 범위표입니다. 증거 지도(evidence map)는 각 목표를 설명할 사례, 실행할 명령, 보관할 출력과 면접 산출물에 연결한 개인 학습표입니다.",
        "역할 경계(role boundary)는 Associate가 설명할 범위와 Professional·현장 담당자가 직접 배포하고 복구할 범위를 나눈 선입니다. NCA-AIIO는 NVIDIA-Certified Associate: AI Infrastructure and Operations의 공식 약칭입니다.",
      ],
    },
    {
      id: "mechanism",
      level: "4",
      title: "7. 한 목표를 설명·실행·증거·복습의 고리로 바꿉니다",
      bridge: "세 도구에 이름을 붙였습니다. 이제 시험 목표 하나를 실제 학습 행동으로 변환합니다.",
      paragraphs: [
        "공식 목표를 한 줄 고른 뒤 먼저 16-GPU 사건으로 설명합니다. 다음으로 그 설명이 맞는지 확인할 명령이나 계산을 하나 실행합니다. 원본 출력과 실패 판독을 저장하고, 마지막에 기존 P0 글의 어느 원장으로 이어지는지 기록합니다.",
        "예를 들어 host GPU 열거 뒤 container GPU 주입, Triton model readiness, Slurm allocation, DCGM health를 차례로 보되 초록불 네 개를 같은 뜻으로 읽지 않습니다. Base Command Manager는 cluster provisioning을, GPU Operator는 Kubernetes GPU software의 수렴을 맡습니다. 이 책임 경계를 목표마다 반복하면 시험 오답과 포트폴리오 빈칸이 같은 표에 남습니다.",
      ],
    },
    {
      id: "source",
      level: "5",
      title: "8. 공식 Study Guide를 실제 첫 점검과 연결합니다",
      bridge: "학습 고리를 만들었습니다. 이제 공식 문서의 역할 설명과 실제 명령을 같은 자리에서 봅니다.",
      paragraphs: [
        "2026년 1월 공식 Study Guide는 AI workload와 GPU·DPU·CPU의 차이를 다룹니다. Network 요구, cluster orchestration, job scheduling, monitoring과 virtualization도 범위에 들어갑니다. 역할은 전문 관리자와 협력해 AI data center 운영에 기여하는 수준으로 한정합니다.",
        "따라서 처음부터 모든 제품 명령을 외울 필요는 없습니다. 다만 host·container에서 GPU가 보이는지, inference server가 model을 준비했는지, scheduler가 자원을 할당했는지, 기본 health가 통과했는지를 서로 다른 출력으로 남깁니다. 그 다음 node 사이 통신과 실제 workload 성능은 별도 P0 실습에서 확인합니다.",
      ],
    },
    {
      id: "comparison",
      level: "6",
      title: "9. 현행 시험 범위와 다음 Professional 단계를 구분합니다",
      bridge: "Associate 목표를 첫 점검까지 내렸습니다. 현재 시험 정보와 다음 단계가 요구하는 행동을 비교합니다.",
      paragraphs: [
        "2026년 10월 8일 확인 기준으로 NCA-AIIO는 영어 50문항, 60분, 미화 125달러의 원격 감독 시험이며 유효기간은 2년입니다. NVIDIA는 응시 전 현재 페이지와 정책을 다시 확인하라고 안내합니다.",
        "NCP-AII는 server·network 설치, physical layer, firmware와 system 검증으로 내려갑니다. NCP-AIO는 monitoring·troubleshooting·optimization과 실제 cluster 도구 숙련을 요구합니다. 지금은 NCA로 전체 지도를 닫고, P0 case study로 지원 직무의 깊이를 별도로 증명합니다.",
      ],
    },
    {
      id: "limits",
      level: "7",
      title: "10. 자격증은 BOM·RFP·시설 승인과 장애 복구를 대신하지 않습니다",
      bridge: "현행 범위와 다음 단계를 구분했습니다. 마지막으로 이 자격을 이력서에서 어디까지 말할지 닫습니다.",
      paragraphs: [
        "NCA-AIIO가 있어도 B300 128개가 필요한 이유를 자동으로 설명할 수 있는 것은 아닙니다. Switch·optic·cable 수량, storage 처리량, rack A/B feed와 냉각 유량도 따로 설계해야 합니다. 공공 RFP, 가격·납기·support, FAT·SAT와 고객 인수 역시 시험 밖의 프로젝트 역량입니다.",
        "이력서에는 ‘NCA-AIIO로 기초를 검증했다’와 ‘공개 기준으로 B300 128-GPU case를 역설계했다’를 분리해 적습니다. 후자에는 명령·계산·검수 원장을 붙입니다. 실제 담당 범위와 개인 학습 산출물도 구분하면 과장 없이 확장 속도를 보여 줄 수 있습니다.",
      ],
    },
  ],
  overviewFlow: {
    title: "한 AI 작업이 준비되고 복구되기까지",
    steps: [
      { actor: "요구", movement: "학습·추론 목표와 data 조건을 정함", receives: "완료 시간·동시성·가용성" },
      { actor: "기반", movement: "연산·memory·연결·저장·전기·열 제거를 준비", receives: "실행 가능한 자원 묶음" },
      { actor: "배치", movement: "필요한 장치를 한 작업에 동시에 할당", receives: "queue·allocation·실행 상태" },
      { actor: "운영", movement: "지표를 보고 격리·복구·재검증", receives: "정상 결과와 증거" },
    ],
  },
  numericCase: {
    title: "50문항 크기의 학습 장부",
    steps: [
      { label: "AI 기초", value: "50×38%=19", detail: "AI·ML·DL, GPU/CPU, NVIDIA software와 training/inference" },
      { label: "AI 인프라", value: "50×40%=20", detail: "Compute·cluster·network·DPU·power·cooling·facility·cloud/on-prem" },
      { label: "AI 운영", value: "50×22%=11", detail: "Management·monitoring·orchestration·scheduling·virtualization" },
      { label: "검산", value: "19+20+11=50", detail: "실제 출제 수 예측이 아니라 학습 누락 방지용 배분" },
    ],
  },
  decision: {
    title: "16-GPU 작업이 멈췄을 때 첫 확인 문",
    question: "관측된 첫 증상은 무엇입니까? 증상과 가장 가까운 책임 구간부터 열되 원인으로 단정하지 않습니다.",
    options: [
      { signal: "한 GPU의 health 또는 예상 topology가 다름", choose: "장치·software path부터", why: "Firmware·driver·PCIe·GPU 경계를 통과하기 전 scheduler를 바꿔도 원인이 남습니다." },
      { signal: "장치는 정상인데 필요한 GPU가 흩어져 작업이 대기", choose: "자원 배치부터", why: "공동 시작, queue 정책과 자원 소유권을 확인해야 합니다." },
      { signal: "작업 시작 뒤 data wait 또는 열·전력 제한 발생", choose: "저장·시설 경로부터", why: "Compute 사용률만으로는 I/O 대기와 thermal throttling을 구분할 수 없습니다." },
    ],
  },
  terms: {
    title: "자격 준비를 현장 학습으로 바꾸는 세 도구",
    items: [
      { term: "시험 청사진 (exam blueprint)", description: "공식 평가 영역과 비중, 세부 목표를 적은 범위표입니다.", example: "38%·40%·22%를 50칸 학습 장부에 배분합니다.", boundary: "실제 문항 내용과 정확한 영역별 문항 수를 공개하는 표는 아닙니다." },
      { term: "증거 지도 (evidence map)", description: "시험 목표를 설명·명령·출력·산출물에 연결한 개인 학습표입니다.", example: "GPU monitoring 목표를 DCGM 출력과 검수 원장에 연결합니다.", boundary: "출력을 모았다는 사실만으로 원인 분석과 복구가 끝나지는 않습니다." },
      { term: "역할 경계 (role boundary)", description: "Associate의 설명 범위와 Professional·현장 수행 범위를 나눈 선입니다.", example: "Power·cooling 개념 설명과 실제 PDU·CDU 승인 계산을 구분합니다.", boundary: "경계는 공부를 멈추는 선이 아니라 주장과 증거를 정직하게 맞추는 선입니다." },
    ],
  },
  algorithm: {
    title: "공식 목표 하나를 포트폴리오 증거로 바꾸기",
    input: ["공식 Study Guide의 목표 한 줄", "16-GPU running case", "연결할 P0 정본과 실습 환경"],
    steps: [
      { code: "question = field_question(objective)", note: "‘설명한다’를 ‘어떤 증상에서 무엇을 먼저 확인하는가’라는 현장 질문으로 바꿉니다." },
      { code: "explain(question, case_16_gpu)", note: "16개 GPU가 보이지만 작업이 멈춘 같은 사건에서 원인 후보와 책임 경계를 설명합니다." },
      { code: "artifact = run(nearest_command_or_calculation)", note: "Inventory·topology·health·queue·I/O·power 가운데 목표와 가장 가까운 실물 하나를 확인합니다." },
      { code: "reading = compare(normal, failure, artifact)", note: "원본 출력, 기준값, 첫 실패 지점과 다음 확인 순서를 한 묶음으로 저장합니다." },
      { code: "update(p0_ledger, reading)", note: "호환성 원장·선택표·I/O 예산·전력 예산·acceptance ledger 가운데 하나를 갱신합니다." },
      { code: "retry(case = changed_scale_or_workload)", note: "2 node를 16 node로, 학습을 추론으로 바꿔 같은 설명이 유지되는지 확인합니다." },
    ],
    output: "공식 목표 ID, 2분 설명, 실행 명령, 정상·실패 출력, P0 산출물 링크가 붙은 오답 장부",
    repeatUntil: "공식 세 영역의 모든 목표가 설명과 증거에 연결되고, 모르는 항목이 다음 실습으로 명시될 때까지",
  },
  relatedArticles: {
    title: "NCA-AIIO 뒤에 바로 이어서 만들 여섯 산출물",
    description: "순서대로 모두 읽을 필요는 없습니다. 오답이나 면접 질문이 생긴 책임 구간에서 시작하고, 각 글의 원장을 한 개씩 완성합니다.",
    items: [
      { label: "B300 128 GPU 설계", href: "/cs/gpu/ai-infrastructure-b300-128-blueprint", task: "Workload 요구를 node·network·storage·facility·operations와 BOM 후보로 내립니다.", evidence: "요구사항→BOM→검수 추적 원장" },
      { label: "GPU 클러스터 software 호환성", href: "/cs/gpu/ai-cluster-software-compatibility", task: "OS부터 driver·firmware·CUDA·NCCL·DOCA-OFED까지 한 release 행으로 묶습니다.", evidence: "16/16 node compatibility manifest와 canary 결과" },
      { label: "Kubernetes와 Slurm", href: "/cs/gpu/kubernetes-vs-slurm-gpu-scheduling", task: "서비스와 다중 node batch의 생애에서 queue·공동 시작·회수 책임을 정합니다.", evidence: "Scheduler 선택표와 대기·할당 출력" },
      { label: "AI 클러스터 스토리지", href: "/cs/gpu/ai-cluster-storage-io", task: "Dataset read와 checkpoint를 IOPS·처리량·tail·restore 시간으로 예산화합니다.", evidence: "I/O fingerprint와 정상·degraded·restore 결과" },
      { label: "B300 전력·냉각", href: "/cs/gpu/b300-rack-power-cooling", task: "Node 전력을 rack A/B feed와 air·water 열 제거 요구로 바꿉니다.", evidence: "평균·피크·N−1·유량 계산 원장" },
      { label: "구축·검수·인수", href: "/cs/gpu/ai-infrastructure-commissioning-acceptance", task: "Power-on과 납품 완료를 나누고 FAT·SAT·성능·장애·handover를 닫습니다.", evidence: "Acceptance ledger와 예외·재시험 기록" },
    ],
  },
  examScope: {
    title: "NCA-AIIO 공식 시험 청사진",
    asOf: "2026-10-08 · NVIDIA certification page와 Jan 2026 Study Guide",
    domains: [
      { name: "Essential AI Knowledge", weight: "38%", focus: "AI·ML·DL, GPU와 CPU, NVIDIA software stack, training과 inference, AI lifecycle" },
      { name: "AI Infrastructure", weight: "40%", focus: "Hardware scaling, cluster, network·protocol·DPU, power·cooling·facility, on-prem과 cloud" },
      { name: "AI Operations", weight: "22%", focus: "Data center management·monitoring, orchestration·job scheduling, GPU 지표, virtualization" },
    ],
  },
  currentNotice: {
    label: "응시 전 재확인",
    body: "문항 수·가격·정책과 시험 범위는 바뀔 수 있습니다. 접수 직전에 NVIDIA의 현재 자격 페이지와 Study Guide를 다시 확인하세요.",
    href: "https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/",
    linkLabel: "NVIDIA NCA-AIIO 공식 페이지 열기",
  },
  sources: [
    {
      source: "NVIDIA NCA-AIIO Exam Study Guide · Jan 2026",
      excerpt: "AI 인프라·운영에 새로 들어오는 IT 전문가가 전문 관리자와 협력할 기초 범위를 제시합니다.",
      application: "이 문장을 역할 경계로 사용합니다. 자격 취득을 독립적인 128-GPU 설계·구축 경험으로 확대하지 않습니다.",
      citation: "NVIDIA · NCA-AIIO Exam Study Guide",
      href: "https://dam-cdn.nvd.orangelogic.com/AssetLink/x874j05hy3m3r2sor84kpvp70750m468.pdf",
      note: "2026년 1월판의 job description, responsibilities와 세 영역 세부 목표를 확인했습니다.",
    },
    {
      source: "NVIDIA Certification Program",
      excerpt: "Associate는 기초 개념을, Professional은 배포·검증 또는 운영·최적화 능력을 각각 구분해 검증합니다.",
      application: "NCA-AIIO는 지금의 폭 점검에 쓰고, NCP-AII·NCP-AIO는 실제 구축·운영 경험을 쌓은 뒤의 다음 단계로 둡니다.",
      citation: "NVIDIA · Certification Programs",
      href: "https://www.nvidia.com/en-us/learn/certification/",
      note: "2026년 10월 8일 현재 AI Infrastructure 분야의 Associate와 Professional 자격 구성을 확인했습니다.",
    },
  ],
  review: [
    "19·20·11을 실제 영역별 출제 문항 수가 아니라 학습 장부로 써야 하는 이유를 설명하세요. (답: 3절)",
    "GPU 16개가 보이지만 작업이 멈출 때 장치·배치·저장·시설 중 첫 확인 문을 고르는 기준을 설명하세요. (답: 4절)",
    "NCA-AIIO 합격 뒤에도 B300 지원 포트폴리오에 별도로 남겨야 할 증거를 쓰세요. (답: 10절)",
  ],
};
