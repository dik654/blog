import type { CloudCertificationArticleData } from "./CloudCertificationArticle";

export const awsClfData: CloudCertificationArticleData = {
  sections: [
    { id: "overview", level: "S", title: "1. CLF-C02는 서비스 암기보다 클라우드 판단 지도를 묻습니다", bridge: "기초 시험의 목적을 한 문장으로 잡았습니다. 네 영역이 한 고객 요청에서 어떻게 만나는지 펼칩니다.", paragraphs: [
      "한 문장 답은 이렇습니다. CLF-C02를 빨리 통과하려면 수백 개 서비스 이름을 같은 깊이로 외우지 말고, 보안 책임·실행·저장·네트워크·비용·지원이라는 역할 상자를 만든 뒤 문제의 요구를 알맞은 상자에 넣어야 합니다.",
      "그러면 왜 보안과 기술 영역의 비중이 큰가요? 클라우드를 쓰는 이유를 알아도 데이터 공개와 계정 권한, 실행·저장 서비스의 역할을 구분하지 못하면 기본 선택을 할 수 없기 때문입니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 문제 문장에서 요구·책임·서비스 범주·비용 단서를 찾습니다", bridge: "시험 문제를 네 단서로 분해했습니다. 65문항의 시간 배분을 숫자로 잡습니다.", paragraphs: [
      "문제에서 ‘누가 패치하는가’는 공유 책임, ‘사용량이 갑자기 늘어난다’는 탄력성, ‘파일을 키로 저장한다’는 객체 저장, ‘예산을 넘기기 전에 알린다’는 비용 관리 단서입니다. 제품명보다 이 역할을 먼저 찾습니다.",
      "그다음 같은 역할의 서비스 중 관리 범위와 사용 사례가 맞는 것을 고릅니다. 보안 탐지 서비스와 방화벽, 비용 계산기와 실제 비용 분석 도구처럼 비슷해 보이는 선택지는 시점과 입력이 다릅니다.",
    ] },
    { id: "case", level: "0", title: "3. 90분에 65문항이면 한 문항에 약 83초입니다", bridge: "시험 시간을 계산했습니다. 문항 수와 영역 비중이 공부 순서를 어떻게 정하는지 봅니다.", paragraphs: [
      "공식 안내상 CLF-C02에는 점수에 반영되는 50문항과 반영되지 않는 15문항이 섞여 있습니다. 90분이라고 놓으면 5,400초를 65로 나눠 한 문항에 평균 약 83초입니다. 어떤 문항이 미채점인지는 알 수 없습니다.",
      "따라서 모든 문항을 같은 태도로 풀고, 1차에서는 역할 단서가 선명한 문제를 먼저 확정합니다. 긴 문장에서 두 선택지로 줄이지 못하면 표시하고 넘어가 마지막에 돌아옵니다.",
    ] },
    { id: "picture", level: "1", title: "4. 네 시험 영역을 한 회사의 도입 순서로 놓습니다", bridge: "문항 처리 속도를 잡았습니다. 학습할 네 영역을 서로 떨어진 목록이 아닌 도입 흐름으로 연결합니다.", paragraphs: [
      "회사는 먼저 클라우드의 가치와 이전 이유를 따집니다. 다음으로 계정·데이터와 규정 책임을 정하고, 실행·저장·네트워크 서비스를 조합합니다. 마지막으로 사용량, 청구와 지원 경로를 운영합니다.",
      "이 순서로 보면 Well-Architected, 공유 책임, 리전과 가용 영역, EC2·Lambda·S3·RDS·VPC, 비용 도구와 Support가 한 그림에 놓입니다.",
    ] },
    { id: "need", level: "2", title: "5. 비슷한 서비스는 무엇을 입력받고 언제 쓰는지로 가릅니다", bridge: "영역을 한 흐름으로 연결했습니다. 오답을 만드는 가까운 서비스들을 가르는 방법을 봅니다.", paragraphs: [
      "AWS Pricing Calculator는 배포 전 예상 구성을 넣어 비용을 추정합니다. Cost Explorer는 이미 생긴 비용과 사용 추세를 분석합니다. Budgets는 정한 한도에 가까워질 때 알립니다. 입력 시점이 서로 다릅니다.",
      "CloudWatch는 지표·로그·경보로 워크로드를 관측하고, CloudTrail은 계정에서 누가 어떤 API 작업을 했는지 기록합니다. 이름에 Cloud가 붙었다는 공통점보다 답하는 질문이 다릅니다.",
    ] },
    { id: "names", level: "3", title: "6. 네 영역과 대표 서비스에 이름을 붙입니다", bridge: "역할과 시점을 먼저 봤습니다. 공식 영역 이름과 반드시 구분할 서비스군을 붙입니다.", paragraphs: [
      "공식 영역은 클라우드 개념 24%, 보안과 규정 준수 30%, 클라우드 기술과 서비스 34%, 청구·요금·지원 12%입니다. 기술과 보안이 합쳐 64%이므로 두 영역을 마지막에 미루지 않습니다.",
      "실행은 EC2·Lambda·ECS, 저장은 S3·EBS·EFS, 데이터베이스는 RDS·DynamoDB, 네트워크는 VPC·Route 53·CloudFront, 보안은 IAM·KMS·Shield·WAF, 관측과 감사는 CloudWatch·CloudTrail을 역할별로 묶습니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 한 문제를 역할 단서에서 정답까지 좁힙니다", bridge: "시험 지도를 만들었습니다. 배포 전 월 비용을 알고 싶다는 문제의 판단 과정을 따라갑니다.", paragraphs: [
      "문장의 동사는 ‘배포 전’과 ‘예상한다’입니다. 아직 사용 기록이 없으므로 과거 추세를 보는 도구는 탈락합니다. 사용량과 구성을 입력해 추정하는 도구를 고릅니다.",
      "선택 뒤에는 다른 보기가 왜 틀렸는지 한 줄로 적습니다. Cost Explorer는 실제 기록 분석, Budgets는 한도 경보, Billing 콘솔은 청구 확인이라는 차이를 남깁니다.",
    ] },
    { id: "source", level: "5", title: "8. 공식 가이드는 영역 비중과 과제 문장을 기준으로 삼습니다", bridge: "문제 풀이 절차를 만들었습니다. AWS가 공개한 실제 범위와 공부표를 대조합니다.", paragraphs: [
      "공식 가이드는 네 영역의 비중과 각 과제에서 알아야 할 지식·기술을 제시합니다. 서비스 목록의 순서나 위치는 중요도를 뜻하지 않는다고 밝히므로 목록 위에서부터 외우는 방법은 근거가 없습니다.",
      "기술과 개념 목록은 비포괄적이며 바뀔 수 있습니다. 접수 전 최신 PDF와 범위 내·범위 밖 서비스 목록을 다시 확인합니다.",
    ] },
    { id: "comparison", level: "6", title: "9. 자주 틀리는 쌍은 한 문장 선택 규칙으로 묶습니다", bridge: "공식 범위의 성격을 확인했습니다. 마지막 복습에서 비교할 핵심 쌍을 정리합니다.", paragraphs: [
      "리전은 지리적 배치 단위이고 가용 영역은 한 리전 안의 장애 분리 단위입니다. Security Group은 자원 경계의 상태 기반 규칙이고 Network ACL은 서브넷 경계의 양방향 규칙입니다. S3는 객체, EBS는 한 실행 자원에 붙는 블록, EFS는 공유 파일입니다.",
      "Reserved Instances와 Savings Plans의 적용 대상과 유연성은 별도로 확인하고, Spot은 중단 가능성을 받아들이는 작업에 씁니다. 가격 할인이라는 공통점만으로 같은 답으로 두지 않습니다.",
    ] },
    { id: "limits", level: "7", title: "10. 덤프 암기보다 공식 연습과 오답 규칙을 씁니다", bridge: "비교 규칙까지 만들었습니다. 시험 직전 무엇을 반복하고 무엇을 믿지 않을지 정합니다.", paragraphs: [
      "실제 시험 문항을 유출했다는 덤프는 최신성·정확성을 검증하기 어렵고 개념의 빈틈을 숨깁니다. AWS 공식 연습 자료와 가이드의 과제 문장으로 범위를 확인하고, 틀린 이유를 역할·시점·책임의 규칙으로 고칩니다.",
      "합격선은 환산 점수 700이며 영역별로 각각 통과할 필요는 없습니다. 그렇다고 낮은 비중 영역을 버리기보다, 큰 영역을 먼저 닫고 작은 영역에서 확실한 기본 문제를 놓치지 않는 전략을 씁니다.",
    ] },
  ],
  overviewFlow: { title: "한 회사가 AWS를 쓰고 운영하는 순서", steps: [
    { actor: "도입 이유", movement: "탄력성·민첩성·고가용성과 이전 방식을 판단합니다.", receives: "클라우드 개념 24%" },
    { actor: "보호와 구축", movement: "책임을 나누고 실행·저장·망 서비스를 고릅니다.", receives: "보안 30% + 기술 34%" },
    { actor: "비용과 지원", movement: "예상·실제·경보를 나누고 지원 경로를 고릅니다.", receives: "청구·요금·지원 12%" },
  ] },
  numericCase: { title: "CLF-C02 시간 장부", steps: [
    { label: "전체", value: "65문항", detail: "50 scored + 15 unscored" },
    { label: "시간", value: "90분", detail: "5,400초" },
    { label: "평균", value: "약 83초", detail: "문항당 5,400 ÷ 65" },
  ] },
  decision: { title: "CLF에서 자주 갈리는 역할", question: "문제가 묻는 시점과 입력 자료는 무엇인가요?", options: [
    { signal: "배포 전에 구성과 사용량으로 월 비용을 추정합니다.", choose: "AWS Pricing Calculator", why: "아직 실제 청구 기록이 없는 계획 단계입니다." },
    { signal: "지난 3개월 서비스별 비용 추세를 분석합니다.", choose: "AWS Cost Explorer", why: "이미 생긴 비용과 사용 기록을 봅니다." },
    { signal: "월 100달러에 가까워지면 알림을 받습니다.", choose: "AWS Budgets", why: "정한 임계와 실제·예상 비용을 비교해 알립니다." },
  ] },
  terms: { title: "CLF 문제를 읽는 세 기준", items: [
    { term: "공유 책임", description: "AWS와 고객이 서비스 종류에 따라 보안·운영할 층을 나누는 원칙입니다.", example: "EC2 운영체제 패치는 고객이, 물리 호스트는 AWS가 맡습니다.", boundary: "서비스마다 고객에게 남는 설정과 데이터 책임이 다릅니다." },
    { term: "탄력성", description: "수요에 맞춰 자원을 늘리고 줄여 필요한 용량에 가깝게 맞추는 성질입니다.", example: "점심 요청에 실행 자원을 2대에서 6대로 늘립니다.", boundary: "고가용성이나 비용 절감을 자동 보장하지 않습니다." },
    { term: "사용량 기반 과금", description: "선택한 서비스의 측정 단위와 사용량에 따라 비용을 내는 방식입니다.", example: "실행 시간·저장량·요청 수·전송량이 청구 항목이 됩니다.", boundary: "항상 직접 장비보다 싸다는 뜻은 아닙니다." },
  ] },
  algorithm: { title: "CLF 선택지 좁히기", input: ["문제 문장", "요구 동사", "시점", "책임 주체"], steps: [
    { code: "동사 = 문제에서_요구한_행동을_표시한다()", note: "예상·분석·경보·보호·배포를 구분합니다." },
    { code: "영역 = 개념 | 보안 | 기술 | 비용 중_하나로_분류", note: "서비스 후보군을 먼저 줄입니다." },
    { code: "역할이_다른_선택지를_지운다()", note: "같은 접두어보다 입력과 출력을 봅니다." },
    { code: "관리_책임과_시점을_대입한다()", note: "배포 전인지 운영 뒤인지 구분합니다." },
    { code: "남은_보기의_경계를_한_문장으로_검증한다()", note: "왜 다른 보기가 틀렸는지도 말합니다." },
  ], output: "정답 + 나머지 보기의 탈락 이유", repeatUntil: "공식 연습에서 오답을 역할 규칙으로 설명할 수 있을 때까지 반복합니다." },
  examScope: { title: "CLF-C02 공식 영역", asOf: "AWS 공식 CLF-C02 Exam Guide, 2026년 10월 확인", domains: [
    { name: "Cloud Concepts", weight: "24%", focus: "가치, 설계 원칙, 이전, 클라우드 경제를 설명합니다." },
    { name: "Security and Compliance", weight: "30%", focus: "공유 책임, 거버넌스, 접근 관리와 보안 자원을 구분합니다." },
    { name: "Cloud Technology and Services", weight: "34%", focus: "배포·운영, 글로벌 인프라, 실행·저장·망·DB·분석 서비스 역할을 고릅니다." },
    { name: "Billing, Pricing, and Support", weight: "12%", focus: "요금 모델, 예산·비용 도구와 기술 지원 자원을 구분합니다." },
  ] },
  sources: [
    { source: "AWS · CLF-C02 Exam Guide", excerpt: "34% of scored content", application: "서비스 영역을 가장 큰 비중으로 두되 보안 30%와 함께 우선 공부하는 근거로 씁니다.", citation: "AWS Certified Cloud Practitioner Exam Guide (CLF-C02)", href: "https://docs.aws.amazon.com/pdfs/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.pdf", note: "문항 구성, 합격 점수와 네 영역 비중을 밝힌 AWS 공식 PDF입니다." },
    { source: "AWS · CLF-C02 Technologies and Concepts", excerpt: "non-exhaustive and is subject to change", application: "서비스 목록을 고정된 출제 문제표로 보지 않고 최신 가이드와 역할 이해를 함께 확인합니다.", citation: "AWS, CLF-C02 Technologies and Concepts", href: "https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-technologies-concepts.html", note: "시험에 나올 수 있는 기술과 개념을 제시하되 비포괄적이라고 밝히는 공식 목록입니다." },
  ],
  review: [
    "Pricing Calculator·Cost Explorer·Budgets를 시점으로 가르면 어떻게 되나요? (답: 5·7절)",
    "기술과 보안 영역을 함께 먼저 공부할 이유는 무엇인가요? (답: 6절)",
    "서비스 목록의 위쪽부터 외우는 데 공식 근거가 없는 이유는 무엇인가요? (답: 8절)",
  ],
};

export const awsSaaData: CloudCertificationArticleData = {
  sections: [
    { id: "overview", level: "S", title: "1. SAA-C03의 답은 요구 조건을 만족하는 가장 단순한 구조입니다", bridge: "설계 시험의 결론을 먼저 잡았습니다. 보안·복원력·성능·비용이 한 사례에서 충돌하는 모습을 펼칩니다.", paragraphs: [
      "한 문장 답은 이렇습니다. SAA-C03은 가장 많은 서비스를 붙이는 시험이 아니라, 보안·복원력·성능·비용 요구를 빠짐없이 읽고 관리 부담이 작은 조합을 고른 뒤 왜 다른 조합이 탈락하는지 설명하는 시험입니다.",
      "왜 보기마다 그럴듯한 서비스가 여러 개일까요? 기술적으로 가능한 구조와 문제의 제약을 가장 잘 만족하는 구조가 다르기 때문입니다. 최소 운영, 가장 비용 효율적, 즉시 복구 같은 수식어가 최종 선택을 바꿉니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 요구를 네 축과 실패 범위로 바꿉니다", bridge: "문장의 수식어가 선택을 바꾼다는 점을 봤습니다. 작은 쇼핑몰의 수치로 설계 제약을 고정합니다.", paragraphs: [
      "먼저 누가 무엇에 접근하는지, 어떤 장애를 견뎌야 하는지, 지연과 처리량은 얼마인지, 수요 모양과 예산은 어떤지 적습니다. 데이터 손실과 중단 시간도 별도로 표시합니다.",
      "그다음 정적 콘텐츠, 상태 없는 API, 주문 데이터, 비동기 작업을 나눕니다. 각 부품마다 관리형 서비스를 우선 검토하고 연결 지점의 권한과 장애 전파를 봅니다.",
    ] },
    { id: "case", level: "0", title: "3. 평소 100, 피크 1천 요청과 15분 손실 목표를 둡니다", bridge: "요구를 숫자로 만들었습니다. 한 대의 큰 서버가 왜 답에서 밀리는지 그립니다.", paragraphs: [
      "(가정) 쇼핑몰은 평소 초당 100건, 행사 때 1천 건을 받고 정적 파일은 500GB입니다. 주문은 최대 15분치만 잃을 수 있고 60분 안에 복구해야 합니다. 운영 인원은 두 명입니다.",
      "한 대의 큰 서버와 로컬 데이터베이스는 평소에는 단순하지만 서버나 장소 장애가 전체 중단이 됩니다. 행사 뒤에도 큰 용량 비용이 남고 두 명이 패치·백업·전환을 모두 맡아야 합니다.",
    ] },
    { id: "picture", level: "1", title: "4. 요청 경로와 실패 경계를 함께 그립니다", bridge: "단일 서버의 병목을 확인했습니다. 사용자 요청과 비동기 작업을 분리합니다.", paragraphs: [
      "정적 파일은 엣지 캐시에서 가깝게 전달하고, 동적 요청은 부하 분산 장치를 거쳐 둘 이상의 장애 단위에 있는 상태 없는 앱으로 보냅니다. 주문 데이터는 관리형 다중 장소 데이터베이스에 둡니다.",
      "메일·이미지 처리처럼 즉시 끝날 필요 없는 작업은 큐에 넣어 요청과 분리합니다. 작업자가 잠시 느려져도 앞 요청이 함께 쓰러지지 않고, 실패한 항목을 다시 처리할 수 있습니다.",
    ] },
    { id: "need", level: "2", title: "5. 결합을 줄이면 장애를 흡수하지만 새 지연과 중복이 생깁니다", bridge: "큐로 요청과 작업을 분리했습니다. 이 선택의 대가를 같은 사례에서 살펴봅니다.", paragraphs: [
      "큐는 짧은 트래픽 폭증을 쌓아 두고 작업자가 처리할 시간을 줍니다. 그러나 메시지가 늦거나 두 번 전달될 수 있으므로 작업은 같은 입력을 다시 받아도 결과가 망가지지 않게 만들어야 합니다.",
      "캐시도 원본 부하와 지연을 줄이지만 오래된 값을 보여 줄 수 있습니다. 데이터의 변경 빈도와 허용할 오래된 시간에 맞춰 만료와 무효화 방식을 정합니다.",
    ] },
    { id: "names", level: "3", title: "6. 설계 부품에 AWS 이름을 붙입니다", bridge: "역할과 대가를 먼저 봤습니다. 시험에서 자주 조합하는 서비스 이름을 붙입니다.", paragraphs: [
      "정적 객체는 S3, 엣지 전달은 CloudFront, 이름 해석은 Route 53, 부하 분산은 ELB, 가상 서버 확장은 EC2 Auto Scaling이 맡을 수 있습니다. 컨테이너는 ECS·EKS, 함수는 Lambda가 후보입니다.",
      "관계형 데이터는 RDS·Aurora, 키값은 DynamoDB, 캐시는 ElastiCache, 큐는 SQS, 알림 배포는 SNS를 비교합니다. KMS는 키 관리, Secrets Manager는 비밀 수명 관리, IAM은 접근 정책을 맡습니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. SAA 문제는 제약표와 탈락표로 답을 고릅니다", bridge: "서비스 이름을 역할에 연결했습니다. 행사 쇼핑몰 보기를 순서대로 줄입니다.", paragraphs: [
      "문제의 명시 요구를 네 축으로 적고, ‘운영 인원 두 명’과 ‘행사 뒤 축소’ 같은 숨은 운영 조건도 표시합니다. 각 보기에서 한 요구라도 못 맞추면 먼저 탈락시킵니다.",
      "남은 보기 사이에서는 관리 범위와 전체 비용을 비교합니다. 마지막에는 단일 장애점, 데이터 복구와 최소 권한을 다시 확인합니다.",
    ] },
    { id: "source", level: "5", title: "8. 공식 영역은 보안·복원력·성능·비용의 네 설계 판단입니다", bridge: "풀이 절차를 만들었습니다. AWS가 공개한 비중에 학습 시간을 맞춥니다.", paragraphs: [
      "SAA-C03은 안전한 구조 30%, 복원력 있는 구조 26%, 고성능 구조 24%, 비용 최적화 구조 20%로 나뉩니다. 합치면 100%이며 한 영역만 따로 통과하는 방식은 아닙니다.",
      "공식 가이드는 1년 정도의 AWS 설계 경험을 목표 후보 설명에 둡니다. 경험이 적다면 서비스 비교표만 읽지 말고 콘솔이나 IaC로 요청 경로와 장애 전환을 직접 만들어 봅니다.",
    ] },
    { id: "comparison", level: "6", title: "9. 정답을 가르는 대표 비교축을 반복합니다", bridge: "공식 영역을 확인했습니다. 시험 직전 같은 축으로 반복할 비교를 모읍니다.", paragraphs: [
      "다중 가용 영역은 같은 리전 안의 고가용성, 읽기 복제본은 주로 읽기 확장과 별도 복구 선택지입니다. 백업은 과거 시점 복구, 복제는 현재 상태를 다른 곳에 유지하는 목적이 큽니다. NAT Gateway는 사설 자원의 출구이고 Load Balancer는 들어오는 요청의 앞문입니다.",
      "SQS는 작업을 보관해 소비자가 가져가게 하고 SNS는 한 메시지를 여러 구독자에게 밀어냅니다. Kinesis는 순서 있는 스트림 처리에 맞습니다. 모두 메시징이라는 이유로 같은 문제에 쓰지 않습니다.",
    ] },
    { id: "limits", level: "7", title: "10. 아키텍처 그림만 외우지 말고 실패를 직접 넣어 봅니다", bridge: "대표 비교축까지 잡았습니다. 합격과 면접에 함께 남길 실습 기준을 정합니다.", paragraphs: [
      "정적 사이트만 만드는 실습보다 두 가용 영역의 앱, 사설 데이터, 최소 권한과 경보를 코드로 만들고 한 앱을 내려 상태 검사가 제외하는지 확인합니다. 큐 작업을 두 번 보내도 결과가 중복되지 않게 만듭니다.",
      "시험 문제는 가이드 전체 목록을 그대로 반복하지 않습니다. 바뀌는 서비스 기능보다 요구 → 역할 → 제약 → 선택의 순서를 연습하고, 시험 전 최신 범위를 다시 확인합니다.",
    ] },
  ],
  overviewFlow: { title: "요구에서 설계 선택까지", steps: [
    { actor: "요구 분해", movement: "보안·복원력·성능·비용과 실패 범위를 숫자로 적습니다.", receives: "탈락 조건" },
    { actor: "역할 조합", movement: "정적·동적·데이터·비동기 부품에 관리형 후보를 붙입니다.", receives: "두세 개 구조 후보" },
    { actor: "교환 검증", movement: "운영 부담·단일 장애점·전체 비용으로 마지막 후보를 고릅니다.", receives: "선택 이유와 한계" },
  ] },
  numericCase: { title: "행사 쇼핑몰 요구", steps: [
    { label: "평소", value: "100 req/s", detail: "낮은 유휴 비용 필요" },
    { label: "행사", value: "1,000 req/s", detail: "10배 피크 확장" },
    { label: "데이터", value: "RPO 15분", detail: "주문 손실 상한" },
    { label: "복구", value: "RTO 60분", detail: "서비스 중단 상한" },
  ] },
  decision: { title: "비슷한 AWS 선택지 가르기", question: "문제의 핵심이 고가용성, 읽기 확장, 비동기 완충 중 무엇인가요?", options: [
    { signal: "한 가용 영역 장애 뒤 관계형 쓰기를 계속해야 합니다.", choose: "다중 AZ 배포", why: "같은 리전의 독립 장애 단위에 동기식 대기 복구 경로를 둡니다." },
    { signal: "읽기 요청이 쓰기보다 훨씬 많아 데이터베이스가 막힙니다.", choose: "읽기 복제본", why: "읽기 부하를 분산하되 복제 지연과 전환 조건을 확인합니다." },
    { signal: "행사 때 후처리 작업이 순간적으로 10배 늘어납니다.", choose: "큐 + 자동 확장 작업자", why: "앞 요청과 작업 속도를 분리하고 재시도를 흡수합니다." },
  ] },
  terms: { title: "SAA 설계의 세 핵심 이름", items: [
    { term: "단일 장애점", description: "그 부품 하나가 멈추면 전체 기능이 함께 멈추는 지점입니다.", example: "한 가용 영역의 앱 한 대와 로컬 DB만 둔 구조입니다.", boundary: "복제본 수만 늘려도 공통 설정 오류는 함께 퍼질 수 있습니다." },
    { term: "느슨한 결합", description: "한 부품의 속도나 장애가 다른 부품을 즉시 함께 멈추게 하지 않도록 경계를 두는 방식입니다.", example: "주문 후 메일 작업을 SQS에 넣어 요청과 분리합니다.", boundary: "지연·중복·순서 처리라는 새 비용이 생깁니다." },
    { term: "관리형 서비스", description: "패치·복제·확장 같은 운영 일부를 AWS가 맡는 서비스입니다.", example: "RDS 다중 AZ로 데이터베이스 복구 운영을 줄입니다.", boundary: "데이터 모델·권한·복구 목표와 비용 책임은 고객에게 남습니다." },
  ] },
  algorithm: { title: "SAA 사례 문제 풀이", input: ["문제 문장", "보안 요구", "RPO/RTO", "부하 모양", "운영·비용 조건"], steps: [
    { code: "필수_제약 = 문장의_숫자와_최상급을_표시한다()", note: "최소 운영·가장 저렴·즉시 같은 표현을 놓치지 않습니다." },
    { code: "워크로드 = 정적 | 동적 | 데이터 | 비동기로_나눈다", note: "각 부품의 역할을 분리합니다." },
    { code: "각_보기에서_필수_제약_위반을_먼저_찾는다()", note: "하나라도 어기면 탈락시킵니다." },
    { code: "남은_보기의_운영_부담과_전체_비용을_비교한다()", note: "관리형 서비스와 전송·대기 비용을 포함합니다." },
    { code: "단일_장애점·최소_권한·복구_경로를_재검사한다()", note: "마지막으로 숨은 실패를 확인합니다." },
  ], output: "요구를 모두 만족하는 구조 + 다른 보기의 탈락 이유", repeatUntil: "새 사례에서도 서비스명이 아니라 제약으로 두 보기까지 줄일 수 있을 때까지 반복합니다." },
  examScope: { title: "SAA-C03 공식 영역", asOf: "AWS 공식 SAA-C03 Exam Guide, 2026년 10월 확인", domains: [
    { name: "Design Secure Architectures", weight: "30%", focus: "접근, 워크로드와 데이터 보호를 설계합니다." },
    { name: "Design Resilient Architectures", weight: "26%", focus: "느슨한 결합, 다중 계층과 복구 경로를 설계합니다." },
    { name: "Design High-Performing Architectures", weight: "24%", focus: "저장·컴퓨팅·DB·망의 성능 요구에 맞는 자원을 고릅니다." },
    { name: "Design Cost-Optimized Architectures", weight: "20%", focus: "사용량과 운영 요구를 만족하는 비용 구조를 고릅니다." },
  ] },
  sources: [
    { source: "AWS · SAA-C03 Exam Guide", excerpt: "secure, resilient, high-performing, and cost-optimized", application: "모든 사례를 네 설계 축으로 분해하고 한 축의 최고값만 고르지 않는 기준으로 씁니다.", citation: "AWS Certified Solutions Architect – Associate Exam Guide (SAA-C03)", href: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03.html", note: "목표 역할, 문항 구성, 합격 점수와 네 영역 비중을 밝힌 AWS 공식 가이드입니다." },
    { source: "AWS Well-Architected Framework", excerpt: "stable and efficient systems", application: "기능 요구 뒤 운영·보안·안정성·성능·비용의 교환을 검토하는 설계 틀로 씁니다.", citation: "AWS, The pillars of the Well-Architected Framework", href: "https://docs.aws.amazon.com/wellarchitected/2025-02-25/framework/the-pillars-of-the-framework.html", note: "SAA 설계 판단의 바탕인 AWS 공식 아키텍처 원칙입니다." },
  ],
  review: [
    "SAA 문제에서 기술적으로 가능한 보기와 최선의 보기가 다른 이유는 무엇인가요? (답: 1·7절)",
    "큐가 피크를 흡수하면서 새로 만드는 비용은 무엇인가요? (답: 5절)",
    "다중 AZ와 읽기 복제본을 같은 답으로 볼 수 없는 이유는 무엇인가요? (답: 9절)",
  ],
};

export const awsDeveloperCloudOpsData: CloudCertificationArticleData = {
  sections: [
    { id: "overview", level: "S", title: "1. DVA-C02와 SOA-C03은 같은 시스템의 변경과 운영을 나눠 봅니다", bridge: "두 시험의 차이를 역할로 잡았습니다. 코드 한 줄이 운영 상태가 되기까지의 경로를 펼칩니다.", paragraphs: [
      "한 문장 답은 이렇습니다. 애플리케이션 코드가 AWS 서비스와 안전하게 통신하고 배포되는 과정이 중심이면 DVA-C02, 배포된 환경의 지표·용량·복구·네트워크를 운영하고 자동화하는 과정이 중심이면 SOA-C03을 고릅니다.",
      "왜 둘 다 배포와 보안을 다룰까요? 개발과 운영은 같은 변경 경로를 공유하기 때문입니다. 차이는 코드를 작성하고 서비스 API를 쓰는 판단에 더 무게를 두는지, 실행 중인 환경을 관측·복구하는 판단에 더 무게를 두는지에 있습니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 변경은 코드·빌드·배포·관측·복구를 지납니다", bridge: "공통 변경 경로를 봤습니다. 하루 배포 횟수와 실패율을 넣어 두 역할의 질문을 나눕니다.", paragraphs: [
      "개발자는 SDK 호출, 이벤트 처리, 권한, 비밀과 오류 처리를 코드에 넣습니다. 운영자는 자원 배치, 설정, 배포 자동화, 지표·로그·경보와 백업을 관리합니다. 두 역할 모두 최소 권한과 재현 가능한 변경을 알아야 합니다.",
      "DVA 문제는 실패한 API 호출을 코드와 서비스 설정에서 좁히는 경우가 많고, SOA 문제는 여러 자원의 이상을 관측 자료와 운영 절차에서 좁히는 비중이 큽니다.",
    ] },
    { id: "case", level: "0", title: "3. 하루 10회 배포 중 1회 실패를 10분 안에 되돌립니다", bridge: "같은 변경에서 개발과 운영의 수치를 잡았습니다. 한 파이프라인 안에서 책임을 나눕니다.", paragraphs: [
      "(가정) 팀은 하루 10번 배포하고 그중 1번이 사용자 오류율을 높입니다. 5분 안에 이상을 알고 10분 안에 이전 버전으로 되돌리는 목표를 둡니다. 빌드 산출물과 설정은 버전으로 추적합니다.",
      "개발자는 상태 확인 경로와 안전한 설정 읽기, 같은 이벤트의 중복 처리를 구현합니다. 운영자는 단계 배포, 오류율 경보와 자동 중단·되돌리기를 구성합니다. 한쪽만 준비하면 목표를 지키기 어렵습니다.",
    ] },
    { id: "picture", level: "1", title: "4. 코드 경로와 운영 경로가 배포 지점에서 만납니다", bridge: "책임을 한 변경에 붙였습니다. 시험 선택을 현재 업무의 동사로 좁힙니다.", paragraphs: [
      "SDK로 객체와 메시지를 다루고 함수·API를 구현하며 코드 수준 오류를 고치는 일이 많다면 개발 경로가 가깝습니다. 계정·망·용량·백업을 구성하고 경보에서 복구 절차를 실행한다면 운영 경로가 가깝습니다.",
      "둘 다 해야 하는 작은 팀이라면 먼저 채용 공고에서 더 자주 요구하는 시험을 고르고, 다른 경로의 공통 영역은 실습으로 메웁니다. 두 시험을 동시에 시작해 용어만 넓히지 않습니다.",
    ] },
    { id: "need", level: "2", title: "5. 재시도와 자동화는 실패를 줄이면서 중복 피해를 만들 수 있습니다", bridge: "두 역할의 갈림길을 정했습니다. 공통으로 반드시 이해할 실패 처리를 봅니다.", paragraphs: [
      "일시 오류 뒤 재시도하면 성공률은 높아지지만 같은 결제나 메시지를 두 번 처리할 수 있습니다. 작업에 고유 키를 두고 이미 끝난 결과를 다시 쓰지 않도록 멱등성을 설계합니다.",
      "자동 배포도 잘못된 설정을 빠르게 퍼뜨릴 수 있습니다. 작은 비율에 먼저 배포하고 사용자 지표가 나빠지면 중단하며, 이전 산출물과 설정으로 돌아갈 경로를 둡니다.",
    ] },
    { id: "names", level: "3", title: "6. 개발·배포·관측·복구 범위에 시험 이름을 붙입니다", bridge: "공통 실패 처리를 봤습니다. 두 시험의 공식 영역을 역할에 붙입니다.", paragraphs: [
      "DVA-C02는 AWS 서비스를 이용한 개발, 보안, 배포, 문제 해결과 최적화를 다룹니다. Lambda·API Gateway·DynamoDB·S3·SQS·SNS·EventBridge, SDK, IAM·KMS·Secrets Manager와 배포 도구의 개발자 관점을 봅니다.",
      "SOA-C03의 현행 명칭은 AWS Certified CloudOps Engineer – Associate입니다. 관측·분석·개선, 신뢰성과 연속성, 배포·프로비저닝·자동화, 보안·규정, 네트워크와 콘텐츠 전달을 운영자 관점에서 다룹니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. 현재 업무 기록으로 둘 중 하나를 고릅니다", bridge: "공식 범위를 붙였습니다. 최근 한 달의 작업을 시험 선택으로 바꾸는 절차를 만듭니다.", paragraphs: [
      "최근 한 달의 작업 20개에서 동사를 뽑습니다. 구현·SDK·이벤트·코드 디버깅이 많으면 DVA 쪽 점수를 올리고, 구성·감시·용량·백업·복구·망 진단이 많으면 SOA 쪽 점수를 올립니다.",
      "점수가 비슷하면 지원 공고의 필수 항목과 실습으로 증명하기 어려운 빈칸을 봅니다. 먼저 하나를 끝내고 공통 실습을 다음 시험에 재사용합니다.",
    ] },
    { id: "source", level: "5", title: "8. DVA-C02는 개발 32%와 보안 26%가 절반을 넘습니다", bridge: "개인 업무로 경로를 골랐습니다. DVA의 공식 비중에 학습 시간을 맞춥니다.", paragraphs: [
      "DVA-C02의 공식 영역은 AWS 서비스를 이용한 개발 32%, 보안 26%, 배포 24%, 문제 해결과 최적화 18%입니다. 코드 작성만 준비하면 권한·비밀·배포와 관측에서 큰 빈칸이 남습니다.",
      "실습은 함수 하나보다 이벤트 입력, 데이터 쓰기, 최소 권한, 실패 재시도, 로그와 배포를 한 경로로 연결합니다. 오류를 일부러 내고 SDK 예외와 서비스 로그를 함께 봅니다.",
    ] },
    { id: "comparison", level: "6", title: "9. SOA-C03은 관측·신뢰성·자동화가 각각 22%입니다", bridge: "DVA의 무게 중심을 봤습니다. SOA의 공식 비중과 운영 실습을 비교합니다.", paragraphs: [
      "SOA-C03은 관측·로깅·분석·개선 22%, 신뢰성과 비즈니스 연속성 22%, 배포·프로비저닝·자동화 22%, 보안과 규정 16%, 네트워크와 콘텐츠 전달 18%입니다.",
      "따라서 CloudWatch 대시보드를 만드는 데서 멈추지 않고 경보 → 진단 → 조치 → 검증을 연습합니다. 백업을 만들고 실제 복원하며, IaC 변경 계획과 드리프트를 확인합니다. 한국어 시험을 보려면 아래 종료 일정을 먼저 확인해야 합니다.",
    ] },
    { id: "limits", level: "7", title: "10. 자격 이름보다 실제로 설명할 수 있는 변경 경로를 남깁니다", bridge: "두 시험의 범위를 나눴습니다. 취업 자료에 남길 공동 실습을 정합니다.", paragraphs: [
      "작은 이벤트 API를 코드로 배포하고, 워크로드 역할로 데이터에 접근하며, 중복 메시지를 안전하게 처리합니다. 단계 배포 중 오류율을 올려 자동 중단하고 이전 버전으로 돌아오는 기록을 남깁니다.",
      "이 한 실습에서 DVA는 코드·SDK·보안·배포를, SOA는 지표·경보·자동화·복구를 설명할 수 있습니다. 시험 합격 뒤에도 지원 직무에 가까운 부분을 더 깊게 확장합니다.",
    ] },
  ],
  overviewFlow: { title: "한 변경을 보는 두 역할", steps: [
    { actor: "개발 경로", movement: "SDK·이벤트·권한·오류 처리를 코드와 테스트에 넣습니다.", receives: "배포 가능한 산출물" },
    { actor: "공동 배포", movement: "단계별로 새 버전을 내고 사용자 지표를 확인합니다.", receives: "승격 또는 자동 중단" },
    { actor: "운영 경로", movement: "지표·로그·백업과 망을 보고 복구하고 개선합니다.", receives: "검증된 운영 상태" },
  ] },
  numericCase: { title: "하루 배포의 복구 목표", steps: [
    { label: "배포", value: "10회/일", detail: "작은 변경을 자주 전달" },
    { label: "실패", value: "1회", detail: "오류율 상승 가정" },
    { label: "탐지", value: "5분", detail: "사용자 지표 경보" },
    { label: "복구", value: "10분", detail: "이전 버전 전환" },
  ] },
  decision: { title: "DVA와 SOA 선택", question: "최근 업무에서 어떤 동사를 더 자주 썼나요?", options: [
    { signal: "구현·SDK 호출·이벤트 처리·코드 디버깅이 많습니다.", choose: "DVA-C02", why: "애플리케이션이 AWS 서비스를 사용하는 코드 경로가 중심입니다." },
    { signal: "구성·관측·용량·백업·복구·망 진단이 많습니다.", choose: "SOA-C03", why: "배포된 클라우드 환경의 운영 경로가 중심입니다." },
    { signal: "두 역할을 모두 맡고 지원 공고도 섞여 있습니다.", choose: "공고 빈도 높은 하나부터", why: "공통 실습을 만든 뒤 두 번째 시험에 재사용합니다." },
  ] },
  terms: { title: "개발과 운영을 잇는 세 개념", items: [
    { term: "멱등성", description: "같은 요청이나 메시지를 여러 번 처리해도 최종 결과가 한 번 처리한 것과 같게 만드는 성질입니다.", example: "같은 결제 이벤트 ID가 다시 오면 기존 결과를 돌려줍니다.", boundary: "모든 외부 부수 효과가 자동으로 중복 제거되지는 않습니다." },
    { term: "단계 배포", description: "새 버전을 일부 트래픽이나 자원에 먼저 내고 지표가 좋을 때 범위를 넓히는 방식입니다.", example: "10% 요청에서 오류율을 본 뒤 100%로 올립니다.", boundary: "표본이 작거나 경보가 틀리면 문제를 놓칠 수 있습니다." },
    { term: "드리프트", description: "선언한 구성과 실제 실행 중인 자원 상태가 달라진 상태입니다.", example: "화면에서 연 포트가 IaC 파일에는 없습니다.", boundary: "차이가 모두 오류는 아니지만 검토되지 않은 차이는 재배포 때 사라질 수 있습니다." },
  ] },
  algorithm: { title: "DVA-C02와 SOA-C03 중 먼저 볼 시험 고르기", input: ["최근 작업 20개", "지원 공고 20개", "구현 경험", "운영 경험"], steps: [
    { code: "동사 = 최근_작업에서_행동을_뽑는다()", note: "제품 이름보다 구현·배포·관측·복구를 셉니다." },
    { code: "DVA_점수 = 구현 + SDK + 이벤트 + 코드_디버깅", note: "개발 경로의 빈도를 더합니다." },
    { code: "SOA_점수 = 구성 + 관측 + 백업 + 복구 + 망_진단", note: "운영 경로의 빈도를 더합니다." },
    { code: "if 비슷함: 공고_빈도와_경험_빈칸으로_결정", note: "채용 목표와 부족한 증거를 우선합니다." },
    { code: "공통_실습 = 이벤트_API + 단계_배포 + 경보 + 복구", note: "첫 시험 뒤 두 번째 경로에 재사용합니다." },
  ], output: "첫 시험 + 공통 실습 + 다음 시험으로 넘길 항목", repeatUntil: "목표 직무가 바뀌거나 최근 업무 비중이 달라질 때 다시 계산합니다." },
  examScope: { title: "두 Associate 시험의 공식 무게 중심", asOf: "AWS 공식 DVA-C02·SOA-C03 Exam Guide, 2026년 10월 확인", domains: [
    { name: "DVA · Development", weight: "32%", focus: "서비스 API와 애플리케이션 기능을 구현합니다." },
    { name: "DVA · Security/Deploy/Optimize", weight: "68%", focus: "보안 26%, 배포 24%, 문제 해결·최적화 18%를 함께 봅니다." },
    { name: "SOA · Observe/Reliability/Automation", weight: "66%", focus: "관측·개선, 연속성, 프로비저닝·자동화가 각각 22%입니다." },
    { name: "SOA · Security/Network", weight: "34%", focus: "보안·규정 16%, 네트워크·전달 18%를 운영 관점에서 다룹니다." },
  ] },
  currentNotice: {
    label: "2026년 한국어 시험 일정",
    body: "AWS는 한국어 SOA-C03 시험을 2026년 11월 19일 이후 폐지한다고 안내합니다. 한국어로 응시하려면 남은 일정을 확인하고, 이후 응시라면 영어 시험 준비 기간을 따로 잡습니다.",
    href: "https://aws.amazon.com/ko/certification/certified-cloudops-engineer-associate/",
    linkLabel: "AWS의 한국어 시험 안내 확인",
  },
  sources: [
    { source: "AWS · DVA-C02 Exam Guide", excerpt: "Development with AWS Services", application: "SDK·이벤트·서비스 통합을 중심으로 보안·배포·문제 해결을 함께 준비하는 범위로 씁니다.", citation: "AWS Certified Developer – Associate Exam Guide (DVA-C02)", href: "https://docs.aws.amazon.com/pdfs/aws-certification/latest/developer-associate-02/developer-associate-02.pdf", note: "DVA-C02의 대상 역할과 네 영역 비중을 밝힌 AWS 공식 PDF입니다." },
    { source: "AWS · SOA-C03 Exam Guide", excerpt: "Monitoring, Logging, Analysis, Remediation", application: "관측 화면 암기를 넘어 탐지·진단·조치·검증의 운영 고리를 준비하는 근거로 씁니다.", citation: "AWS Certified CloudOps Engineer – Associate Exam Guide (SOA-C03)", href: "https://docs.aws.amazon.com/pdfs/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.pdf", note: "명칭이 바뀐 SOA-C03의 대상 역할과 다섯 영역 비중을 밝힌 AWS 공식 PDF입니다." },
  ],
  review: [
    "DVA와 SOA가 모두 배포와 보안을 다루면서도 다른 시험인 이유는 무엇인가요? (답: 1·2절)",
    "재시도가 성공률을 높이면서 중복 피해를 만들 수 있는 이유는 무엇인가요? (답: 5절)",
    "최근 작업의 제품명이 아니라 동사를 세야 하는 이유는 무엇인가요? (답: 7절)",
  ],
};
