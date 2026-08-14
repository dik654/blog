import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";

type ArticleKey =
  | "aml-compliance"
  | "aml-cdd-deep"
  | "aml-rba-deep"
  | "aml-str-reporting";

type Row = readonly [string, string, string];
type Citation = {
  id: string;
  title: string;
  href: string;
  problem: string;
  contribution: string;
  assumptions: string;
  scope: string;
  notClaim: string;
};

type Config = {
  key: ArticleKey;
  eyebrow: string;
  title: string;
  lead: string;
  boundary: string;
  firstId: string;
  firstTitle: string;
  firstBody: readonly string[];
  secondId: string;
  secondTitle: string;
  secondBody: readonly string[];
  releaseId: string;
  stages: readonly Row[];
  controls: readonly Row[];
  failures: readonly Row[];
  question: string;
  idea: string;
  formula: string;
  terms: readonly { symbol: string; name: string; description: string }[];
  assumptions: readonly string[];
  interpretation: string;
  citations: readonly Citation[];
};

const KOFIU_CDD = "https://www.kofiu.go.kr/kor/policy/amls05.do";
const KOFIU_STR = "https://www.kofiu.go.kr/kor/policy/amls03.do";
const KOFIU_LAWS = "https://www.kofiu.go.kr/kor/law/law.do";
const FATF_RECOMMENDATIONS =
  "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html";
const FATF_RBA =
  "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Risk-based-approach-banking-sector.html";
const FATF_DIGITAL_ID =
  "https://www.fatf-gafi.org/content/dam/fatf-gafi/guidance/Guidance-on-Digital-Identity.pdf.coredownload.pdf";
const FSC_TRAVEL_RULE = "https://www.fsc.go.kr/po010102/77579";

const CONFIG: Record<ArticleKey, Config> = {
  "aml-compliance": {
    key: "aml-compliance",
    eyebrow: "AML/CFT 운영 · 고객에서 신고 증거까지",
    title: "AML 체계는 탐지 규칙 목록이 아니라 고객·거래·판단·책임을 잇는 통제 사슬이다",
    lead:
      "법인 고객 ‘한울무역’이 급여와 국내 매입대금 지급을 목적으로 계좌를 엽니다. 고객과 실제소유자를 확인하고 예상 거래를 위험 프로필로 남긴 뒤, 이후 발생한 해외 분할송금을 그 프로필과 비교합니다. 경보는 analyst case를 여는 입력일 뿐이고, 합리적 의심에 관한 검토와 승인된 STR 결정은 별도 단계입니다. 이 한 사례로 고객확인(CDD), 위험기반 접근(RBA), 거래 모니터링, STR과 기록·감독을 연결합니다.",
    boundary:
      "AML은 Anti-Money Laundering, CFT는 Countering the Financing of Terrorism입니다. CDD는 고객확인, EDD는 고위험 상황의 강화된 고객확인, STR은 의심거래보고입니다. 탐지 점수·거래 보류·STR 제출·수사기관 판단은 서로 다른 owner와 법적 근거를 가지며 자동으로 이어지지 않습니다.",
    firstId: "aml-control-system",
    firstTitle: "이사회·준법·영업·분석·감사가 같은 사건의 서로 다른 결정을 소유한다",
    firstBody: [
      "이사회와 경영진은 위험 수용 수준, 인력·시스템, 독립 보고선을 승인합니다. 준법 책임자는 정책·규칙·사례 품질과 신고 체계를 운영하고, 영업·온보딩은 고객 자료를 수집하되 고위험 승인이나 STR 결정을 대신하지 않습니다. Analyst는 경보를 원자료·CDD 프로필·거래 맥락으로 검토하고, 내부감사는 통제 설계와 실제 표본을 독립적으로 검사합니다.",
      "고객 record에는 identity와 실제소유자, 목적·자금 원천, 위험 분류, 검토 시점과 근거를 version으로 묶습니다. 거래 record는 payer·payee·amount·asset·time·channel·jurisdiction과 원장 receipt를 가집니다. Case는 어떤 alert가 어떤 고객·거래·규칙 revision에서 생겼고 누가 무엇을 검토했는지 연결합니다. 이 세 식별자가 끊기면 신고 narrative도, 사후 재현도 약해집니다.",
      "법과 감독 지침은 최소 의무를 정하지만 detector threshold와 workflow는 기관의 위험평가·상품·고객·지역에 맞게 설계합니다. 규칙 hit 수를 AML 성과로 쓰지 않고, 누락·오탐·case aging·품질 review·신고 후 보완 요청·통제 예외를 함께 봅니다. 모델이나 vendor score는 증거 중 하나이지 합리적 의심을 자동 선고하는 법적 oracle이 아닙니다.",
    ],
    secondId: "cdd-monitor-str",
    secondTitle: "CDD profile을 거래 모니터링의 비교 기준으로 쓰고 case에서 신고 여부를 판단한다",
    secondBody: [
      "한울무역은 국내 급여·매입, 월 5천만 원 내외를 예상한다고 기록합니다. 이후 신규 해외 상대방에게 짧은 시간 동안 금액을 나눠 송금하면 규칙은 profile mismatch를 신호로 냅니다. Analyst는 단순 분할 여부만 보지 않고 invoice, counterparty, 실제소유자, 자금 원천, 과거 거래, 관련 계정과 제재·부정행위 통제를 함께 검토합니다.",
      "설명이 충분하고 증거가 일치하면 case를 닫되 판단 근거와 reviewer를 남깁니다. 합리적 의심 근거가 있으면 지정된 승인 절차로 STR을 지체 없이 제출하고, 고객에게 신고 사실을 알려서는 안 되는 confidentiality 경계를 적용합니다. 거래 거절·보류·동결은 제재, fraud, court order, 상품 약관 등 별도의 권한으로 결정하며 STR 제출 자체가 자동 동결 명령은 아닙니다.",
      "정책 변경은 고객 sample과 transaction replay로 base·candidate를 비교합니다. 고위험 누락 0, 허용 고객에 대한 불필요한 중단, case workload, review time, evidence completeness를 slice별로 확인하고 canary 뒤 확장합니다. 신고나 외부 전송은 되돌릴 수 없으므로 test environment에서는 stub을 쓰고 production에는 승인·idempotency key·submission receipt를 요구합니다.",
    ],
    releaseId: "aml-release",
    stages: [
      ["CUSTOMER", "Identity와 위험 프로필", "고객·실제소유자·목적·자금 원천·검토 시점을 versioned record로 만듭니다."],
      ["MONITOR", "거래와 예상 행동 비교", "규칙·모델은 mismatch를 alert로 만들되 신고 판정을 대신하지 않습니다."],
      ["CASE", "근거 검토와 승인", "원거래·CDD·연결 계정·설명을 검토해 닫기·보완·보고 결정을 기록합니다."],
      ["REPORT", "제출·보존·감독", "승인된 STR, confidentiality, receipt, record retention과 독립 review를 닫습니다."],
    ],
    controls: [
      ["CDD", "누구와 왜 거래하는가", "Identity·실제소유자·목적·자금 원천과 최신성을 확인합니다."],
      ["RBA", "어디에 더 강한 통제를 둘 것인가", "고객·상품·채널·지역 위험과 완화 통제를 근거로 강도를 정합니다."],
      ["MONITORING", "예상과 다른 거래는 무엇인가", "Rule/model version과 raw transaction을 보존하고 alert를 case에 연결합니다."],
      ["STR", "합리적 의심을 어떻게 보고하는가", "사람의 검토·승인·narrative·evidence reference·submission receipt를 남깁니다."],
    ],
    failures: [
      ["실제소유자 확인 불가", "관계를 무조건 통과시키지 않고 거절·종료 및 STR 검토를 승인 경로로 보냅니다.", "CDD reason"],
      ["모델 score만으로 STR 자동 제출", "Case review와 합리적 의심 narrative가 없으므로 제출을 차단합니다.", "authority fail"],
      ["신고 사실을 영업 담당자가 고객에게 알림", "Need-to-know 접근·communication template·access log를 재검증합니다.", "confidentiality"],
      ["새 규칙이 case 수만 8배 증가", "고위험 recall·precision·queue age·고객 영향과 staffing을 paired 평가합니다.", "capacity gate"],
    ],
    question: "AML 운영 변경을 승인할 최소 통제 묶음은 무엇인가?",
    idea: "고객확인, 모니터링, case·report, governance evidence는 서로 대신할 수 없으므로 모두 검증된 경우에만 운영 변경을 승인합니다.",
    formula: String.raw`A=C\land M\land D\land G`,
    terms: [
      { symbol: "C", name: "CDD readiness", description: "고객·실제소유자·목적·자금 원천과 refresh 상태가 재현 가능합니다." },
      { symbol: "M", name: "Monitoring readiness", description: "거래 입력, rule/model version, alert reason과 case linkage가 검증됐습니다." },
      { symbol: "D", name: "Decision readiness", description: "Case review·승인·STR 또는 close reason과 external receipt 경계가 있습니다." },
      { symbol: "G", name: "Governance readiness", description: "Owner·교육·품질 review·record retention·감사와 rollback이 준비됐습니다." },
      { symbol: "A", name: "AML release acceptance", description: "해당 policy·rule·workflow generation을 제한 운영에 투입할 수 있습니다." },
    ],
    assumptions: [
      "각 Boolean은 문서 존재가 아니라 같은 fixture와 version에서 evidence가 확인된 상태입니다.",
      "Missing·unknown은 pass가 아니며 법률·감독 변경은 별도 effective date와 legal review를 가집니다.",
      "이 식은 내부 release gate이지 고객의 위험이나 STR 법적 요건을 산술화한 식이 아닙니다.",
    ],
    interpretation: "CDD와 모니터링이 정상이어도 신고 API receipt가 없거나 confidentiality access가 과도하면 D 또는 G가 0이므로 A=0입니다. 나머지 통제를 확인한 뒤 작은 canary에서 다시 평가합니다.",
    citations: [
      {
        id: "paper-fatf-recommendations-aml",
        title: "FATF Recommendations · current consolidated standards",
        href: FATF_RECOMMENDATIONS,
        problem: "국가와 금융기관이 위험에 비례하는 AML/CFT 예방조치를 공통 기준으로 연결해야 합니다.",
        contribution: "Risk-based approach, CDD, record keeping, suspicious transaction reporting과 supervision의 국제 기준을 제시합니다.",
        assumptions: "공식 영문·불문판과 대한민국의 현행 법령·감독 지침을 함께 적용합니다.",
        scope: "2026-08-14 현재 FATF가 게시한 국제 AML/CFT 표준의 범위입니다.",
        notClaim: "한 detector, 고객 score, 조직도 또는 workflow가 모든 관할과 상품에 그대로 적합하다는 뜻은 아닙니다.",
      },
      {
        id: "paper-kofiu-aml-laws",
        title: "KoFIU · 자금세탁방지 관련 법령 체계",
        href: KOFIU_LAWS,
        problem: "국내 AML/CFT 의무의 법률·시행령·규정을 현재 효력과 함께 확인해야 합니다.",
        contribution: "금융정보분석원이 관련 법령과 제도 안내의 공식 진입점을 제공합니다.",
        assumptions: "구체 기관·상품·사실관계에는 최신 조문과 감독 해석, 법률 검토를 다시 적용합니다.",
        scope: "대한민국 AML/CFT 법령을 찾고 현재 의무를 검증하는 공식 출발점입니다.",
        notClaim: "이 글이나 링크 요약이 법률 자문·사건별 STR 판단·제재 조치를 대신하지 않습니다.",
      },
    ],
  },
  "aml-cdd-deep": {
    key: "aml-cdd-deep",
    eyebrow: "CDD·EDD · 이름 확인에서 지속적 고객 이해까지",
    title: "고객확인은 신분증 한 장이 아니라 고객·실제소유자·거래 목적을 계속 검증하는 과정이다",
    lead:
      "한울무역의 등기 대표만 확인하면 법인을 실제로 지배하는 사람을 놓칠 수 있습니다. 법인 A가 한울무역 지분 60%를 보유하고 김민지가 A 지분 50%를 보유한다면 김민지의 간접 지분은 30%입니다. 신뢰할 수 있는 독립 자료로 법인과 자연인을 확인하고, 목적·자금 원천·예상 거래를 기록한 뒤 위험과 변화에 따라 갱신합니다.",
    boundary:
      "Identification은 고객이 누구라고 주장하는지 수집하는 단계이고 verification은 독립 자료로 맞는지 확인하는 단계입니다. Beneficial owner(실제소유자)는 최종 소유·지배하는 자연인입니다. EDD는 단순히 서류를 더 받는 일이 아니라 고위험 원인에 맞는 추가 정보·승인·모니터링을 적용하는 강화된 절차입니다.",
    firstId: "identity-beneficial-owner",
    firstTitle: "고객 identity와 실제소유자 지배 사슬을 분리해 검증한다",
    firstBody: [
      "자연인은 성명·생년월일·주소·국적 등 요구 정보를 수집하고 신뢰할 수 있는 독립 원천과 대조합니다. 법인은 법인격, 등록번호, 주소, 대표·권한자와 사업 활동을 확인합니다. 문서 진위 하나만 보지 않고 발급기관, 만료, tamper signal, liveness나 대리 권한의 범위와 검증 시점을 receipt로 남깁니다.",
      "법인 실제소유자는 국내 제도의 순서에 따라 지분 기준 자연인을 먼저 찾고, 없거나 불명확하면 실질 지배자, 그래도 확인할 수 없으면 대표자를 확인하는 식으로 resolution path를 기록합니다. ‘대표자=실제소유자’로 처음부터 치환하지 않습니다. 지분 사슬에는 법인별 source, 기준일, 직접·간접 비율과 계산 경로를 보존합니다.",
      "확인에 필요한 정보를 고객이 거부해 CDD를 수행할 수 없다면 신규 관계를 열지 않거나 기존 관계 종료를 검토하고, 그 상황 자체가 STR 검토 대상인지 판단합니다. 이때 고객에게 STR 검토·제출 여부를 알리지 않습니다. Missing information을 임의 기본값으로 채우거나 영업 승인으로 우회하지 않습니다.",
    ],
    secondId: "risk-refresh-edd",
    secondTitle: "목적·자금 원천·예상 거래를 갱신하고 VASP 이전 정보는 별도 메시지 경계로 전달한다",
    secondBody: [
      "한울무역에는 국내 급여·매입, 월 5천만 원, 주 거래 상대와 지역을 expected behavior로 기록합니다. Source of funds는 이번 관계·거래에 들어오는 자금의 출처이고 source of wealth는 고객의 전체 자산 형성 배경입니다. 모든 고객에게 같은 깊이를 요구하지 않고 상품·고객·지역·채널·소유구조의 위험 근거에 따라 범위를 정합니다.",
      "EDD는 복잡한 소유구조, 고위험 지역, PEP 관련성, 설명되지 않는 대규모·비정상 거래 같은 위험 원인별로 추가 source, senior approval, 목적·자금 원천 증명, 강화 monitoring을 붙입니다. Risk label만 높이고 어떤 의문을 어떤 evidence로 줄였는지 기록하지 않으면 EDD가 아닙니다.",
      "CDD는 onboarding 한 번으로 끝나지 않습니다. 위험에 따른 주기와 함께 주소·대표·실제소유자·상품·거래 패턴 변화, 기존 자료의 정확성 의심 같은 trigger가 생기면 refresh합니다. Raw document와 extracted field, normalization rule, verifier version, reviewer와 effective time을 분리해 과거 판단도 재현합니다.",
      "Travel Rule은 VASP 사이 가상자산 이전에 송·수신인 정보를 거래와 함께 전달·보존하는 별도 information-sharing control입니다. On-chain address만으로 자연인 identity가 증명되는 것은 아니므로 originator·beneficiary identity, VASP·wallet type, transfer ID와 message receipt를 묶고 최소 정보·암호화·access·retention을 적용합니다. 2022 시행 안내의 100만 원 기준을 영구 상수로 복사하지 않고 2026-08-14의 실제 법령 effective date와 금융당국의 확대 개정 여부를 release마다 확인합니다.",
    ],
    releaseId: "cdd-release",
    stages: [
      ["IDENTIFY", "주장과 권한 수집", "자연인·법인·대리인의 identity와 관계 목적을 수집합니다."],
      ["VERIFY", "독립 원천 대조", "문서·registry·권한·liveness의 source와 시점을 receipt로 남깁니다."],
      ["OWN", "실제소유자 해소", "지분·지배·대표의 법정 순서를 따라 자연인까지 계산합니다."],
      ["REFRESH", "EDD와 지속 검토", "위험 원인과 변화 trigger에 비례해 자료·승인·monitoring을 갱신합니다."],
    ],
    controls: [
      ["IDENTITY", "고객이 주장하는 정보", "이름·등록번호·주소·국적·대표와 관계를 수집합니다."],
      ["VERIFICATION", "독립적으로 맞는지 확인", "Source·발급일·만료·tamper·권한과 reviewer를 기록합니다."],
      ["BENEFICIAL OWNER", "최종 소유·지배 자연인", "직접·간접 지분과 지배 경로를 기준일과 함께 계산합니다."],
      ["PROFILE", "목적·자금·예상 행동", "CDD 결과를 monitoring의 비교 기준으로 만들고 변화 시 refresh합니다."],
      ["TRAVEL RULE", "VASP 이전 정보 동반", "On-chain transfer와 송·수신인 message·상대 VASP receipt를 transaction ID로 연결합니다."],
    ],
    failures: [
      ["법인 registry는 맞지만 지분 사슬 누락", "대표자만 통과시키지 않고 자연인까지 resolution path를 완성합니다.", "ownership path"],
      ["고객이 자금 원천 자료 거부", "관계 거절·종료 및 STR 검토를 분리해 승인·기록합니다.", "unable CDD"],
      ["오래된 주소·대표를 계속 사용", "Risk 주기 외에도 자료 의심·변경 event로 refresh를 강제합니다.", "stale profile"],
      ["EDD label만 있고 추가 검증 없음", "위험 원인별 question·source·senior approval·monitoring을 확인합니다.", "EDD evidence"],
    ],
    question: "다단계 법인 구조의 간접 지분은 어떻게 계산하는가?",
    idea: "한 경로에서 각 단계 지분을 곱하고, 동일 자연인으로 이어지는 독립 경로가 여러 개면 법적 기준과 중복 여부를 확인해 합산합니다.",
    formula: String.raw`b_{\mathrm{indirect}}=\prod_{j=1}^{k}s_j`,
    terms: [
      { symbol: "s_j", name: "Ownership share at level j", description: "소유 사슬의 j번째 법인이 다음 법인에 가진 지분율입니다." },
      { symbol: "k", name: "Path depth", description: "법인 고객에서 최종 자연인까지 지나가는 소유 단계 수입니다." },
      { symbol: "b_{\mathrm{indirect}}", name: "Indirect ownership", description: "그 한 경로를 통해 자연인이 고객 법인에 갖는 간접 지분율입니다." },
    ],
    assumptions: [
      "모든 지분은 같은 기준일의 0~1 비율이며 nominee·voting agreement 같은 별도 지배 근거를 따로 검토합니다.",
      "25% 기준과 실제소유자 확인 순서는 2026-08-14 현재 국내 공식 안내와 적용 법령을 다시 확인합니다.",
      "지분 계산만으로 실질 지배자·대표자 resolution 단계를 생략하지 않습니다.",
    ],
    interpretation: "한울무역←법인 A 60%, A←김민지 50%이면 0.60×0.50=0.30, 즉 간접 30%입니다. 계산 결과와 별도로 registry source, 기준일, 의결권·지배 근거를 함께 보존합니다.",
    citations: [
      {
        id: "paper-kofiu-cdd",
        title: "KoFIU · 고객확인제도(CDD)",
        href: KOFIU_CDD,
        problem: "금융회사가 고객·실제소유자·거래 목적을 확인하고 지속적으로 거래를 이해해야 합니다.",
        contribution: "국내 CDD·EDD, 실제소유자 확인 순서, 확인 불가 시 조치와 위험기반 절차를 공식 설명합니다.",
        assumptions: "기관 유형·상품·시점별 구체 의무는 현행 법령·시행령·업무규정을 함께 확인합니다.",
        scope: "대한민국 금융정보분석원의 고객확인제도 공식 안내입니다.",
        notClaim: "문서 한 장, 25% 계산 또는 vendor KYC pass가 모든 지배·위험 확인을 끝낸다는 뜻은 아닙니다.",
      },
      {
        id: "paper-fatf-digital-id",
        title: "FATF · Guidance on Digital Identity",
        href: FATF_DIGITAL_ID,
        problem: "Digital identity를 CDD에 사용할 때 assurance와 위험을 신뢰 가능한 방식으로 평가해야 합니다.",
        contribution: "Reliable independent source, assurance level, governance와 risk-based use의 판단 틀을 제공합니다.",
        assumptions: "Digital-ID system의 기술·법적 assurance와 기관의 customer-risk context를 실제로 평가합니다.",
        scope: "FATF Recommendation 10 CDD에 digital identity를 적용하는 공식 guidance입니다.",
        notClaim: "생체인증·liveness·한 vendor 결과가 실제소유자, 목적, 자금 원천이나 지속 monitoring을 대신하지 않습니다.",
      },
      {
        id: "paper-fsc-travel-rule",
        title: "금융위원회 · 특정금융정보법상 Travel Rule 시행 안내",
        href: FSC_TRAVEL_RULE,
        problem: "VASP 간 가상자산 이전에 송·수신인 정보를 함께 전달하고 보존해야 합니다.",
        contribution: "2022-03-25 시행 당시 적용대상, 제공정보·시기, 보존과 해외·개인지갑 경계를 공식 설명합니다.",
        assumptions: "2026-08-14의 법령 effective date와 이후 확대 개정·상대 VASP·개인지갑 정책을 별도로 확인합니다.",
        scope: "대한민국 Travel Rule 최초 시행 구조를 설명하는 금융위원회 공식 자료입니다.",
        notClaim: "2022년 금액 기준·해외 이전 절차가 이후 개정 없이 현재도 동일하거나 on-chain 주소가 identity를 증명한다는 뜻은 아닙니다.",
      },
    ],
  },
  "aml-rba-deep": {
    key: "aml-rba-deep",
    eyebrow: "Risk-based approach · 위험을 통제 강도로 번역하기",
    title: "RBA는 고객을 한 숫자로 줄이는 일이 아니라 위험 원인과 비례하는 통제를 선택하는 과정이다",
    lead:
      "같은 해외송금이라도 고객, 상품, 채널, 지역, 실제소유구조와 거래 목적에 따라 노출과 필요한 통제가 달라집니다. 한울무역 사례에서는 복잡한 간접 소유와 예상 밖 해외 분할송금이 어떤 시나리오의 가능성·영향을 높이는지 설명하고, 추가 자료·승인·monitoring이 그 위험을 얼마나 줄일지 근거로 남깁니다.",
    boundary:
      "Inherent risk는 통제 전 노출, control effectiveness는 통제가 실제로 줄이는 정도, residual risk는 통제 뒤 남은 위험입니다. Risk appetite은 경영진이 허용 가능한 범위를 정하는 governance 결정입니다. 이들은 detector score나 고객 유죄 확률이 아니며, 단일 합계가 법적 의무를 지우지 않습니다.",
    firstId: "risk-model-input",
    firstTitle: "상품·고객·지역·채널을 구체적인 자금세탁 시나리오와 관측값으로 바꾼다",
    firstBody: [
      "전사 위험평가(EWRA)는 고객 수를 세는 문서가 아니라 어떤 상품·채널에서 어떤 행위자가 어떤 경로로 자금을 이동·은닉할 수 있는지 scenario를 씁니다. 각 scenario에 population, transaction value, jurisdiction, anonymity, velocity, ownership complexity와 historical case를 연결하고 source·기간·coverage·missingness를 기록합니다.",
      "Likelihood와 impact는 관측 가능한 근거와 단위를 가져야 합니다. 낮음·중간·높음 ordinal label은 순서는 있지만 간격이 같다는 뜻이 아니므로 임의로 1·2·3을 더해 정밀 확률처럼 읽지 않습니다. 모델 score는 rank나 triage에 쓸 수 있지만 법적 threshold·EDD·STR 의무는 별도 규칙과 사람 판단으로 유지합니다.",
      "Control inventory에는 CDD source, approval, rule, model, sanctions screening, case review와 교육을 넣고 owner·population·실패 mode·evidence를 붙입니다. ‘정책 있음’을 effectiveness 100%로 두지 않고 sample replay, override, backlog, false negative, stale data와 incident를 통해 실제 작동을 검증합니다.",
    ],
    secondId: "proportional-controls",
    secondTitle: "위험이 높으면 강화하고 확립된 낮은 위험에는 허용된 범위에서 간소화한다",
    secondBody: [
      "FATF의 비례성은 모든 고객에게 최대 통제를 적용한다는 뜻이 아닙니다. 높은 위험에는 EDD·senior approval·더 촘촘한 monitoring을 적용하고, 낮은 위험이 신뢰할 만하게 확립된 경우에만 법과 정책이 허용하는 간소화 조치를 사용합니다. 확인하지 않은 위험을 낮음으로 기본 설정하지 않습니다.",
      "한울무역에는 indirect owner source와 해외 상대방 invoice, 자금 원천을 추가하고, 분할송금 pattern의 case threshold와 review SLA를 강화할 수 있습니다. 반면 이미 법으로 요구되는 실제소유자 확인이나 STR 의무를 residual score가 낮다는 이유로 생략할 수 없습니다. 통제마다 해결하는 scenario와 남는 blind spot을 명시합니다.",
      "모델·정책 변경은 time-based holdout과 고객·지역·상품 slice에서 base와 candidate를 비교합니다. High-risk miss, alert precision, case age, customer friction, analyst capacity, override와 drift를 같이 보고 owner가 canary·rollback을 승인합니다. Score cutoff를 정한 calibration data와 같은 data로 성능을 확정하지 않습니다.",
    ],
    releaseId: "rba-release",
    stages: [
      ["SCENARIO", "행위자·경로·피해", "구체 자금세탁 시나리오와 population·source를 정의합니다."],
      ["MEASURE", "가능성·영향·불확실성", "단위·기간·coverage와 missingness를 보존합니다."],
      ["CONTROL", "위험에 비례한 조치", "시나리오별 CDD·승인·monitoring과 남은 blind spot을 연결합니다."],
      ["REVIEW", "검증·승인·갱신", "Independent challenge, drift, canary·rollback과 effective date를 기록합니다."],
    ],
    controls: [
      ["INHERENT", "통제 전 노출", "고객·상품·지역·채널의 구체 scenario와 population으로 설명합니다."],
      ["MITIGATION", "통제가 줄이는 부분", "Design 존재가 아니라 sample·failure replay에서 실제 effectiveness를 봅니다."],
      ["RESIDUAL", "통제 뒤 남는 위험", "불확실성과 blind spot을 포함하고 법적 의무 면제로 쓰지 않습니다."],
      ["APPETITE", "누가 무엇을 허용하는가", "경영진 승인·exception·기한·owner·escalation을 기록합니다."],
    ],
    failures: [
      ["모든 missing 값을 low risk로 대체", "Unknown을 별도 상태로 두고 자료 보완·제한·review로 보냅니다.", "missingness"],
      ["고위험 recall은 오르지만 queue가 붕괴", "Capacity·case age·severity routing과 staged rollout을 함께 설계합니다.", "operability"],
      ["같은 표본으로 cutoff 선택·확정", "Calibration과 independent holdout을 분리하고 time slice drift를 봅니다.", "evaluation leak"],
      ["Residual score가 낮아 CDD 생략", "법정 의무와 model-based control intensity를 분리해 fail closed합니다.", "legal floor"],
    ],
    question: "여러 시나리오의 잔여 노출을 내부 planning model로 어떻게 비교하는가?",
    idea: "각 시나리오의 가능성과 영향에 통제가 줄이는 비율을 적용해 합산하되, 불확실성과 법적 최소 의무를 별도로 유지합니다.",
    formula: String.raw`R_{\mathrm{res}}=\sum_{s=1}^{n}p_sL_s(1-m_s)`,
    terms: [
      { symbol: "s", name: "Risk scenario", description: "행위자·경로·상품·피해가 구체화된 하나의 자금세탁 위험 시나리오입니다." },
      { symbol: "p_s", name: "Scenario likelihood", description: "정한 기간에 시나리오가 발생할 추정 가능성입니다." },
      { symbol: "L_s", name: "Scenario impact", description: "손실·규제·고객·운영 영향을 같은 내부 단위로 환산한 값입니다." },
      { symbol: "m_s", name: "Mitigation effectiveness", description: "검증된 통제가 해당 시나리오 노출을 줄이는 0~1 추정 비율입니다." },
      { symbol: "R_{\mathrm{res}}", name: "Residual exposure index", description: "모델 전제 아래 비교에 쓰는 내부 잔여 노출 지표입니다." },
    ],
    assumptions: [
      "p, L, m의 기간·population·단위와 confidence range를 고정하고 서로 겹치는 scenario의 이중 합산을 점검합니다.",
      "m은 정책 존재가 아니라 sample·negative test·override·backlog를 포함한 관측 근거에서 추정합니다.",
      "이 값은 고객의 범죄 확률·STR threshold·법적 의무 면제나 서로 다른 단위의 정밀 화폐값이 아닙니다.",
    ],
    interpretation: "두 scenario가 각각 (p,L,m)=(0.10,100,0.60), (0.05,200,0.25)이면 잔여 지표는 4+7.5=11.5입니다. 두 번째가 더 큰 잔여 기여를 보이므로 추가 통제를 검토하되 confidence와 법적 의무를 함께 봅니다.",
    citations: [
      {
        id: "paper-fatf-rba-recommendation",
        title: "FATF Recommendations · Recommendation 1 and proportionality",
        href: FATF_RECOMMENDATIONS,
        problem: "위험의 성격과 수준에 맞는 조치를 적용하면서 낮은 위험의 허용 가능한 간소화도 구분해야 합니다.",
        contribution: "Recommendation 1과 2025 개정이 risk-based·proportionate measures의 국제 기준을 제공합니다.",
        assumptions: "위험이 신뢰할 수 있게 식별·평가됐고 국내법의 mandatory measure와 금지 범위를 우선합니다.",
        scope: "국가·감독기관·금융기관에 적용되는 FATF RBA의 상위 표준입니다.",
        notClaim: "모든 고객에 같은 score, 가중치, threshold를 쓰거나 lower-risk 판단만으로 CDD·STR 의무를 없애지 않습니다.",
      },
      {
        id: "paper-fatf-rba-banking",
        title: "FATF · Risk-Based Approach for the Banking Sector",
        href: FATF_RBA,
        problem: "은행이 고객·상품·채널·지역 위험을 governance와 실제 통제 강도로 번역해야 합니다.",
        contribution: "위험 식별·평가, mitigation, internal control과 supervision에 관한 sector guidance를 제공합니다.",
        assumptions: "기관 규모·복잡성·상품과 관할 규제를 반영하고 guidance의 발행 시점 이후 개정도 확인합니다.",
        scope: "Banking-sector RBA를 설계·감독하는 일반 원칙과 사례입니다.",
        notClaim: "예시 risk factor나 matrix가 최신 국내 규정, VASP 특성 또는 실제 effectiveness 검증을 대신하지 않습니다.",
      },
    ],
  },
  "aml-str-reporting": {
    key: "aml-str-reporting",
    eyebrow: "STR · alert에서 설명 가능한 보고와 receipt까지",
    title: "의심거래보고는 점수를 전송하는 일이 아니라 합리적 의심의 사실과 추론을 재현하는 일이다",
    lead:
      "한울무역의 해외 분할송금 alert를 봅니다. Rule hit 자체는 STR이 아닙니다. Analyst는 원거래, CDD profile, 실제소유자, 상대방, invoice와 관련 계정을 시간순으로 검토해 정상 설명과 모순되는 사실을 정리합니다. 지정된 책임자가 합리적 의심 근거를 승인하면 FIU에 지체 없이 제출하고 receipt와 보존 record를 남깁니다.",
    boundary:
      "Alert는 기계나 규칙이 만든 조사 후보, case는 사람이 검토하는 작업 record, STR은 법적 요건에 따라 FIU에 제출한 보고입니다. 신고는 수사기관의 유죄 판정이 아니고, 거래 차단·계정 종료·자산 동결도 아닙니다. SAR은 해외 문헌에서 쓰는 유사 용어지만 이 글은 국내 STR 경계를 기준으로 씁니다.",
    firstId: "alert-case-decision",
    firstTitle: "Alert를 raw transaction과 고객 맥락이 있는 case로 바꾸고 합리적 의심의 근거를 적는다",
    firstBody: [
      "Case에는 alert ID, rule/model revision, customer와 account, 원 transaction ID·timestamp·amount·counterparty, CDD profile snapshot과 analyst를 연결합니다. 한울무역의 월 5천만 원 국내 지급 profile과 해외 신규 상대방 분할송금의 차이를 시간순으로 제시하고, invoice·자금 원천·관련 계정·과거 거래를 확인합니다.",
      "Narrative는 ‘수상하다’ 대신 누가, 언제, 얼마를, 누구에게, 어떤 방식으로 거래했고 무엇이 known profile과 달랐는지, 어떤 설명·자료를 확인했으며 왜 충분하지 않았는지를 씁니다. 사실과 추론을 분리하고 source transaction과 document reference를 붙입니다. Detector score나 typology 이름만 복사하지 않습니다.",
      "Decision maker는 close, 추가 정보, monitoring 강화, STR 제출과 별도 계정·거래 조치를 각각 권한과 근거로 결정합니다. STR 제출 여부는 need-to-know로 제한합니다. 고객 문의에는 신고 사실을 드러내지 않는 승인 문구를 사용하되 정상 고객 서비스와 법적 권리까지 무조건 막지 않습니다.",
    ],
    secondId: "report-evidence-confidentiality",
    secondTitle: "제출 payload·증거 reference·confidentiality·보존과 재전송 상태를 하나의 receipt로 닫는다",
    secondBody: [
      "제출 전 기관·고객·거래·합리적 의심 근거와 첨부·reference의 필수 field, 날짜·금액·통화·식별자 일관성을 검증합니다. Raw evidence는 변경하지 않고 normalized view와 narrative revision을 분리합니다. Reviewer·approver, 제출 schema와 endpoint generation을 case decision에 고정합니다.",
      "Submit은 external effect입니다. Attempt ID와 idempotency key를 만들고 accepted, rejected, unknown을 구분합니다. Timeout 뒤 blind resend하지 않고 FIU acknowledgement나 조회 절차로 reconcile합니다. Accepted receipt가 있어야 filed로 전이하고, reject는 schema·authority reason을 고친 새 revision으로 다시 승인합니다.",
      "관련 고객·거래·보고·검토 근거와 증빙은 현행 법령과 기관 정책이 요구하는 기간·무결성·접근통제로 보존합니다. 국내 특정금융정보법 체계의 신고 관련 자료는 5년 보존 요구를 현재 조문과 함께 확인하고, legal hold나 다른 의무가 더 길 수 있음을 별도 기록합니다. STR 존재와 내용은 최소 권한으로 제한하고 access·export를 감사합니다.",
    ],
    releaseId: "str-release",
    stages: [
      ["ALERT", "조사 후보", "Rule/model reason과 원 transaction을 보존하되 의심 확정으로 부르지 않습니다."],
      ["CASE", "사실·맥락·반증 검토", "CDD profile, 실제소유자, 설명, 관련 거래와 source를 timeline으로 묶습니다."],
      ["DECIDE", "합리적 의심과 승인", "Close·보완·STR·별도 조치를 독립 권한과 reason으로 기록합니다."],
      ["FILE", "제출·receipt·보존", "Schema, idempotency, acknowledgement, confidentiality와 retention을 닫습니다."],
    ],
    controls: [
      ["FACT", "원장·CDD에서 직접 확인", "Transaction ID·time·amount·party·profile snapshot과 source를 보존합니다."],
      ["INFERENCE", "사실에서 도출한 의심", "설명과 모순, pattern, 연결 관계를 쓰고 확정 사실과 섞지 않습니다."],
      ["AUTHORITY", "누가 무엇을 결정하는가", "Analyst recommendation, approver filing, 별도 hold/freeze owner를 구분합니다."],
      ["RECEIPT", "외부 제출 결과", "Attempt·payload hash·accepted/rejected/unknown·acknowledgement를 case에 연결합니다."],
    ],
    failures: [
      ["Rule hit만 복사한 narrative", "사실·profile mismatch·확인한 설명·추론·source reference를 다시 작성합니다.", "quality reject"],
      ["Timeout 뒤 같은 보고 두 번 전송", "Attempt ID·idempotency·ack 조회로 unknown을 reconcile합니다.", "duplicate guard"],
      ["영업 화면에 STR flag 노출", "Need-to-know field·API·export·log access를 최소화하고 negative test합니다.", "tipping-off"],
      ["보고는 됐지만 transaction source가 삭제", "Retention manifest·immutable digest·restore test와 access audit를 확인합니다.", "evidence loss"],
    ],
    question: "승인된 STR을 외부 제출해 filed 상태로 바꿀 최소 조건은 무엇인가?",
    idea: "합리적 의심 결정, 완전한 narrative, 추적 가능한 evidence, confidentiality와 authority가 모두 있어야 제출하며, accepted receipt가 있어야 filed로 기록합니다.",
    formula: String.raw`S=D\land N\land E\land C`,
    terms: [
      { symbol: "D", name: "Authorized suspicion decision", description: "지정된 책임자가 합리적 의심 근거와 제출 결정을 승인했습니다." },
      { symbol: "N", name: "Narrative completeness", description: "Who·what·when·where·how와 profile mismatch·검토 결과가 사실과 추론으로 구분됐습니다." },
      { symbol: "E", name: "Evidence traceability", description: "고객·거래·문서 source와 payload hash를 원본까지 추적할 수 있습니다." },
      { symbol: "C", name: "Confidential submission control", description: "Need-to-know access, schema, endpoint, approver와 idempotent submit 경계가 준비됐습니다." },
      { symbol: "S", name: "Submission readiness", description: "외부 제출을 시도할 수 있는 내부 gate이며 filed receipt 자체는 아닙니다." },
    ],
    assumptions: [
      "D는 detector score가 아니라 적용 법령·사실관계에 따른 승인된 사람의 판단입니다.",
      "S=1 뒤에도 accepted acknowledgement를 받아야 filed이며 timeout은 unknown입니다.",
      "거래 차단·동결·고객 종료와 형사 판단은 별도 권한·법적 근거를 갖습니다.",
    ],
    interpretation: "D=N=E=1이어도 일반 상담 직원이 payload를 볼 수 있어 C=0이면 S=0입니다. 권한을 고치고 새 access test를 통과한 뒤 제출하며, acknowledgement receipt를 case에 연결합니다.",
    citations: [
      {
        id: "paper-kofiu-str",
        title: "KoFIU · 의심거래보고(STR)",
        href: KOFIU_STR,
        problem: "불법재산·자금세탁·테러자금조달에 관한 합리적 의심을 FIU에 지체 없이 보고해야 합니다.",
        contribution: "STR 판단·보고 정보와 KoFIU의 접수·분석·법집행기관 제공 흐름을 공식 설명합니다.",
        assumptions: "기관 유형과 사건 시점의 현행 법령·시행령·업무규정, 내부 승인 권한을 확인합니다.",
        scope: "대한민국 의심거래보고 제도의 공식 개요와 처리 흐름입니다.",
        notClaim: "Alert·STR 제출이 거래 자동 동결, 범죄 확정, FIU의 즉시 수사 착수나 고객 종료를 뜻하지 않습니다.",
      },
      {
        id: "paper-kofiu-str-law",
        title: "KoFIU · 특정금융정보법 등 현행 법령",
        href: KOFIU_LAWS,
        problem: "보고 시점·기록 보존·비밀 유지 등 구체 의무를 현행 조문에서 확인해야 합니다.",
        contribution: "법률·시행령·관련 규정에 접근하는 공식 법령 체계를 제공합니다.",
        assumptions: "2026-08-14 현재 효력, 기관 scope, 사건 발생일과 후속 개정을 법무·준법이 확인합니다.",
        scope: "STR와 관련 자료 보존·confidentiality 의무를 검증하는 국내 공식 출발점입니다.",
        notClaim: "이 글의 workflow와 5년 요약이 모든 자료의 유일한 retention 기간이나 사건별 법률 자문을 대신하지 않습니다.",
      },
    ],
  },
};

function FlowViz({ config }: { config: Config }) {
  return (
    <figure
      data-viz={`${config.key}-decision-flow`}
      data-viz-canvas
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b border-border/70 px-4 py-4 sm:px-5">
        <p className="text-sm font-semibold">한 고객·거래를 owner와 evidence가 바뀌는 네 단계로 추적합니다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">표현은 단순하지만 각 칸의 입력·결정·비보장과 receipt는 서로 바꿀 수 없습니다.</p>
      </figcaption>
      <div className="grid gap-px bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
        {config.stages.map(([tag, title, body], index) => (
          <div key={tag} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-[11px] font-bold tracking-[.08em] text-muted-foreground">{tag}</span>
            </div>
            <p className="mt-3 break-keep text-sm font-semibold">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function Evidence({ item, index }: { item: Citation; index: number }) {
  return (
    <div id={item.id} className="scroll-mt-24">
      <CitationBlock source={item.title} citeKey={index + 1} type="paper" href={item.href}>
        <p><strong>문제:</strong> {item.problem}</p>
        <p><strong>기여:</strong> {item.contribution}</p>
        <p><strong>전제:</strong> {item.assumptions}</p>
        <p><strong>근거 범위:</strong> {item.scope}</p>
        <p><strong>하지 않는 주장:</strong> {item.notClaim}</p>
      </CitationBlock>
    </div>
  );
}

export default function AmlControlsArticle({ article }: { article: ArticleKey }) {
  const config = CONFIG[article];
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">{config.eyebrow}</p>
          <h2 className="text-3xl font-bold tracking-tight">{config.title}</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">{config.lead}</p>
        <aside className="rounded-lg border border-border p-4 text-sm leading-6">{config.boundary}</aside>
        <FlowViz config={config} />
        <ContentBoundary article={config.key} />
      </section>

      <section id={config.firstId} className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · 개념과 판단 경계</p><h2 className="mt-2 text-2xl font-bold">{config.firstTitle}</h2></header>
        {config.firstBody.map((paragraph) => <p key={paragraph} className="leading-7">{paragraph}</p>)}
        <div className="grid gap-3 md:grid-cols-2">
          {config.controls.map(([tag, title, body]) => (
            <div key={tag} className="min-w-0 rounded-lg border border-border p-4">
              <p className="text-xs font-bold tracking-[.08em] text-primary">{tag}</p>
              <p className="mt-2 font-semibold">{title}</p>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id={config.secondId} className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · 실행·수치 예·근거</p><h2 className="mt-2 text-2xl font-bold">{config.secondTitle}</h2></header>
        {config.secondBody.map((paragraph) => <p key={paragraph} className="leading-7">{paragraph}</p>)}
        <ExplainedFormula question={config.question} idea={config.idea} formula={config.formula} terms={config.terms} assumptions={config.assumptions} interpretation={config.interpretation} />
        {config.citations.map((item, index) => <Evidence key={item.id} item={item} index={index} />)}
      </section>

      <section id={config.releaseId} className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 실패 주입과 release gate</p><h2 className="mt-2 text-2xl font-bold">정상 demo보다 잘못된 권한·누락된 증거·되돌릴 수 없는 effect를 먼저 시험한다</h2></header>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] gap-3 bg-muted/40 px-4 py-3 text-xs font-semibold"><span>실패 주입</span><span>기대 결과</span></div>
          {config.failures.map(([fault, oracle, receipt]) => (
            <div key={fault} className="grid grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] gap-3 border-t border-border px-4 py-3 text-sm">
              <span className="font-medium">{fault}</span><span className="min-w-0 break-words text-muted-foreground">{oracle} <strong className="text-foreground">[{receipt}]</strong></span>
            </div>
          ))}
        </div>
        <p className="leading-7">Base와 candidate는 같은 고객·실제소유자·거래 fixture, 법령 effective date, policy·rule·model version과 analyst capacity에서 비교합니다. 허용되지 않은 외부 제출·고객 통지·거래 effect는 0이어야 합니다. Failure reason, reviewer, artifact hash, canary 범위와 이전 generation rollback을 하나의 release receipt로 보존합니다.</p>
        <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3>
        <p className="leading-7">기초 6문제는 용어·owner·정상 흐름과 작은 계산을, 심화 4문제는 반례·failure injection·independent evaluation·rollback을 묻습니다. 정답 체크리스트의 전제와 비보장은 위 절에서 직접 회수할 수 있어야 합니다.</p>
      </section>
    </article>
  );
}
