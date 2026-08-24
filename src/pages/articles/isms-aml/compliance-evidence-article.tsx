import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";

type ArticleKey =
  | "aml-fds-deep"
  | "isms-audit-checklist"
  | "isms-privacy-lifecycle"
  | "isms-privacy-policy";

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

const KISA_ISMS = "https://pims.kisa.or.kr/board/file/bbs_0000000000000014/21/FILE_000000000001002/202311231554317701147901071.pdf";
const KOFIU_STR = "https://kofiu.go.kr/kor/policy/amls03.do";
const FATF_VASP = "https://www.fatf-gafi.org/content/dam/fatf/documents/recommendations/Updated-Guidance-VA-VASP.pdf";
const PIPA = "https://www.law.go.kr/법령/개인정보보호법";
const PRIVACY_GUIDE = "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000257592&chrClsCd=010201";
const PIPC_BEHAVIOR = "https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=9888";

const CONFIG: Record<ArticleKey, Config> = {
  "aml-fds-deep": {
    key: "aml-fds-deep",
    eyebrow: "FDS · 신호에서 재현 가능한 case까지",
    title: "이상거래 탐지는 거래를 유죄로 판정하는 AI가 아니라 검토할 사건을 놓치지 않게 만드는 증거 파이프라인이다",
    lead: "한울무역이 국내 급여·매입을 주로 하다가 신규 해외 상대방에게 짧은 시간 동안 송금을 나눠 보냅니다. FDS는 고객 profile revision과 원거래를 rule·model generation에 넣어 alert를 만들고, analyst가 invoice·상대방·실제소유자·과거 행동을 검토할 case를 엽니다. Alert 점수, case 결론, STR 제출은 서로 다른 상태입니다.",
    boundary: "FDS는 Fraud Detection System 또는 이상거래 탐지 시스템입니다. Rule hit·model score·blockchain address tag는 조사 순서를 정하는 신호이지 범죄·합리적 의심·STR를 자동 확정하는 법적 oracle이 아닙니다. 거래 차단·보류 또한 별도의 권한과 정책이 필요합니다.",
    firstId: "signal-case-pipeline",
    firstTitle: "원거래와 고객 profile을 시점이 맞는 feature로 만들고 alert를 case에 연결한다",
    firstBody: [
      "Feature lineage는 어떤 raw field가 어느 event time·ingestion time·normalization·window에서 계산됐는지 남기는 계보입니다. 한울무역의 24시간 송금 횟수는 판단 시각 이전 거래만 포함해야 하며, 나중에 도착한 record를 과거 score에 몰래 넣지 않습니다. Customer·transaction·rule/model generation·alert·case ID를 함께 보존해야 같은 판단을 재생할 수 있습니다.",
      "Rule은 알려진 typology와 명시 조건을 빠르게 설명하지만 임계값 경계와 패턴 변화에 약합니다. Model은 여러 feature 조합을 rank할 수 있지만 label delay·drift·bias와 설명 한계를 가집니다. 둘은 독립 신호와 공통 금지조건을 가진 ensemble로 쓰고, 어느 신호가 왜 case를 열었는지 contribution과 version을 남깁니다.",
      "Blockchain analysis의 address tag는 source·관측시각·confidence·cluster heuristic·chain과 hop을 포함한 versioned evidence입니다. 한 업체의 고위험 label이나 한 hop 관계를 고객 identity·자금 출처·범죄 사실로 확대하지 않습니다. Raw transaction과 tag snapshot을 보존해 vendor 변경 뒤에도 당시 판단을 설명합니다.",
    ],
    secondId: "rules-model-chain",
    secondTitle: "탐지 성능과 analyst 처리용량을 함께 보며 threshold를 정한다",
    secondBody: [
      "Precision은 열린 alert 중 실제 검토 대상 비율이고 recall은 검증된 대상 중 잡아낸 비율입니다. 둘은 label population과 기간에 의존합니다. 알려진 STR만 positive로 두면 보고되지 않은 누락이 label에 사라지므로, quality-reviewed case·synthetic typology·독립 표본을 나눠 씁니다.",
      "좋은 offline AUC도 운영 성공을 보장하지 않습니다. 하루 alert 수, 건당 검토시간, analyst의 가용시간으로 queue 부하를 계산하고 customer·상품·지역·신규/기존 고객 slice의 miss·precision·case age를 봅니다. Threshold는 법적 의심 기준이 아니라 triage capacity와 탐지 위험을 조정하는 운영값입니다.",
      "Base와 candidate는 같은 event-time replay, 고정 rule/model·tag versions와 blinded holdout에서 비교합니다. Canary에서는 alert만 생성하고 외부 제출·거래 effect는 막은 뒤, 고위험 miss·queue age·설명 completeness·override·drift를 확인합니다. Reviewer 승인과 rollback generation을 release receipt에 넣습니다.",
    ],
    releaseId: "fds-release",
    stages: [
      ["INPUT", "시점이 맞는 원거래", "Customer profile·transaction·tag source와 event/ingestion time을 보존합니다."],
      ["DETECT", "Rule·model의 독립 신호", "Generation과 reason을 남기되 hit를 의심 판정으로 승격하지 않습니다."],
      ["CASE", "사람의 맥락 검토", "원자료·CDD·연결 거래·설명을 검토하고 close·escalate 근거를 기록합니다."],
      ["RELEASE", "용량·누락·rollback", "Holdout·canary·queue와 forbidden external effect를 함께 확인합니다."],
    ],
    controls: [
      ["LINEAGE", "Feature가 언제 무엇에서 왔는가", "Event-time cutoff, source digest, transform·window generation을 기록합니다."],
      ["SIGNAL", "Rule과 model이 무엇을 말하는가", "Reason·score·version·비보장을 분리하고 공통 case ID로 연결합니다."],
      ["HUMAN", "맥락과 합리적 의심을 누가 판단하는가", "Analyst·reviewer·evidence·close/escalate reason을 남깁니다."],
      ["CAPACITY", "운영 가능한 alert 양인가", "Slice별 miss와 precision뿐 아니라 queue age·가용 analyst 시간을 봅니다."],
    ],
    failures: [
      ["미래 거래가 과거 window에 포함", "Point-in-time join을 실패시키고 feature generation을 되돌립니다.", "lineage fail"],
      ["고위험 address tag만으로 계정 동결", "Tag를 신호로만 보존하고 별도 authority 없는 effect를 거부합니다.", "authority fail"],
      ["Candidate가 alert를 8배 생성", "Recall 개선과 analyst capacity·case age를 함께 비교해 canary를 중단합니다.", "capacity gate"],
      ["Score cutoff를 STR 기준으로 사용", "Case review와 합리적 의심 판단이 없으므로 자동 제출을 차단합니다.", "decision boundary"],
    ],
    question: "새 detector의 하루 alert가 analyst 처리용량을 넘는지 어떻게 계산하는가?",
    idea: "Alert가 소비하는 총 검토시간을 analyst의 실제 가용시간으로 나누면 queue가 계속 쌓일 조건을 작은 수치로 확인할 수 있습니다.",
    formula: String.raw`Q=\frac{A\,m}{H}`,
    terms: [
      { symbol: "A", name: "Alerts per day", description: "Candidate가 하루에 여는 alert 수입니다." },
      { symbol: "m", name: "Minutes per alert", description: "Quality를 유지하며 한 alert를 검토하는 평균 분입니다." },
      { symbol: "H", name: "Available analyst minutes", description: "회의·교육·휴식을 제외한 analyst 전체 일일 가용 분입니다." },
      { symbol: "Q", name: "Capacity load", description: "1보다 크면 신규 alert의 평균 유입이 평균 처리용량을 넘습니다." },
    ],
    assumptions: ["같은 alert definition과 충분히 안정된 평균을 사용합니다.", "Severity별 service time과 p95 queue는 별도로 측정합니다.", "Q는 법적 의심 threshold나 STR 제출 조건이 아닙니다."],
    interpretation: "하루 600건, 건당 12분, 가용시간 6명×360분이면 Q=7200/2160≈3.33입니다. Recall 숫자만 보고 배포하지 말고 threshold·인력·workflow를 다시 설계합니다.",
    citations: [
      { id: "paper-fatf-vasp-monitoring", title: "FATF · Updated Guidance for VA and VASPs", href: FATF_VASP, problem: "대량 가상자산 거래를 고객 위험과 관계 목적에 맞춰 지속적으로 모니터링해야 합니다.", contribution: "자동 monitoring 뒤 flagged transaction을 사람·전문가가 분석하고 rule integrity를 정기 검증하는 위험기반 경계를 설명합니다.", assumptions: "국내 법령·기관 위험평가·customer profile과 적용 시점의 FATF 문서를 함께 확인합니다.", scope: "VASP의 ongoing CDD와 transaction monitoring 원칙에 한정합니다.", notClaim: "특정 rule, vendor tag, model score나 cutoff가 합리적 의심을 자동 증명한다는 뜻은 아닙니다." },
      { id: "paper-kofiu-str-fds", title: "KoFIU · 의심거래보고제도", href: KOFIU_STR, problem: "내부 탐지 결과와 법률상 의심거래보고 판단을 구분해야 합니다.", contribution: "합리적 의심 근거와 보고 내용·절차의 국내 공식 경계를 제공합니다.", assumptions: "2026-08-14 현행 법령·감독규정과 기관별 승인 권한을 다시 확인합니다.", scope: "대한민국 STR의 공식 제도 설명입니다.", notClaim: "Alert·case·STR가 거래 동결, 고객 유죄나 수사 착수를 자동 의미하지 않습니다." },
    ],
  },
  "isms-audit-checklist": {
    key: "isms-audit-checklist",
    eyebrow: "ISMS 현장심사 · 문서에서 운영 증거까지",
    title: "현장심사는 체크 표시를 모으는 일이 아니라 같은 기간의 모집단·표본·통제 결과를 다시 연결하는 검증이다",
    lead: "급여 API의 2026년 7월 운영을 심사한다고 가정합니다. 먼저 서비스·서버·계정·방화벽·배포·로그·백업의 범위와 owner를 고정하고, 전체 모집단에서 표본을 뽑아 정책·설정·승인·실행 log·업무 결과가 같은 사건을 가리키는지 추적합니다. 한 표본의 결함은 그 한 건으로 끝내지 않고 영향을 받을 모집단을 다시 계산합니다.",
    boundary: "인증 심사는 법률 자문이나 침투테스트 하나가 아닙니다. Design effectiveness는 통제가 위험을 다루도록 설계됐는지, operating effectiveness는 정한 기간과 모집단에서 실제로 작동했는지를 묻습니다. 정책 파일의 존재는 운영 효과의 증거가 아닙니다.",
    firstId: "scope-population-sample",
    firstTitle: "서비스 의존성으로 범위를 정하고 완전한 모집단에서 추적 가능한 표본을 고른다",
    firstBody: [
      "Scope는 급여 API URL만이 아니라 identity provider, CI/CD, database, KMS, logging, backup, operator와 외부 processor까지 데이터·권한·복구 의존성으로 정합니다. 제외한 asset도 왜 위험과 통제에서 독립적인지 근거를 남깁니다. 최신 network·data-flow diagram과 실제 discovery 결과가 다르면 inventory부터 수정합니다.",
      "Population은 심사기간의 모든 계정 변경, 배포, firewall rule, privileged DB session, backup job처럼 경계와 건수를 재현할 수 있어야 합니다. Query·export time·source digest·누락 조건을 보존합니다. 심사자가 고른 10건만 별도 폴더에 모으면 cherry-picking 여부와 전체성을 검증할 수 없습니다.",
      "표본은 random, risk-based, exceptional case를 목적에 따라 섞습니다. 각 표본에서 request→approval→enforcement→log→business outcome을 stable ID로 연결합니다. 표본 20건이 모두 정상이더라도 모집단 전체가 정상이라고 단정하지 않고, 설계된 sampling risk와 발견 결함의 확장 절차를 명시합니다.",
    ],
    secondId: "trace-findings-remediation",
    secondTitle: "발견사항의 원인·영향 모집단을 정하고 수정 뒤 새 증거로 재검증한다",
    secondBody: [
      "퇴직자 계정 하나가 살아 있다면 그 계정만 삭제하지 않습니다. HR termination feed, IAM disable job, exception queue, 관리자 override와 전체 퇴직자 population을 확인합니다. Finding에는 condition, violated criterion, cause, risk/effect, affected population, owner와 due date를 구분합니다.",
      "서버·network는 asset baseline, vulnerability, patch exception, firewall request·expiry·hit log를 봅니다. Account는 joiner/mover/leaver와 privileged session을, log·backup은 source coverage·clock·immutability·restore oracle을, privacy·web은 data flow·notice·consent·access control과 change receipt를 같은 기간에서 대조합니다.",
      "Remediation은 문구 수정이 아니라 원인을 제거하고 과거 영향범위를 닫은 뒤 새 population에서 retest하는 일입니다. Base와 fixed generation을 같은 fixture로 비교하고 negative case, bypass, restore, rollback까지 확인합니다. 발견을 닫은 reviewer는 구현 owner와 분리하고 residual risk 승인자를 기록합니다.",
    ],
    releaseId: "audit-release",
    stages: [["SCOPE", "서비스와 의존성", "Data·identity·network·key·backup·processor까지 경계를 그립니다."], ["POPULATION", "전체성과 기간", "Source query·count·digest·누락 조건으로 모집단을 재현합니다."], ["TRACE", "표본의 end-to-end 증거", "Request·approval·enforcement·log·outcome을 같은 ID로 잇습니다."], ["RETEST", "원인 제거와 재검증", "영향 모집단·새 증거·negative test·residual risk를 닫습니다."]],
    controls: [["DESIGN", "통제가 위험을 다루는가", "Policy·owner·trigger·exception·evidence·failure response를 봅니다."], ["OPERATE", "기간 내 실제로 작동했는가", "완전한 population과 대표·고위험 표본의 source receipt를 확인합니다."], ["FINDING", "무엇이 왜 실패했는가", "Condition·criterion·cause·effect·affected population을 분리합니다."], ["RETEST", "수정이 지속 가능한가", "새 generation과 population에서 bypass·negative·rollback을 재검증합니다."]],
    failures: [["심사용 표본만 수동 생성", "원 source population query와 digest가 없어 completeness 실패로 판정합니다.", "population fail"], ["퇴직자 한 명만 삭제", "동일 cause의 전체 영향 모집단과 feed/job failure를 확장 조사합니다.", "scope expansion"], ["Policy 문구만 수정", "Enforcement와 운영 evidence가 바뀌지 않아 remediation을 닫지 않습니다.", "design only"], ["Backup 성공 log만 제시", "복구 fixture·업무 oracle·key dependency가 없어 effectiveness를 통과시키지 않습니다.", "restore gap"]],
    question: "모집단 중 end-to-end trace가 완성된 비율은 어떻게 계산하고 해석하는가?",
    idea: "같은 기간의 population에서 request부터 outcome까지 요구 증거가 모두 연결된 항목 수를 나눠 coverage gap을 드러냅니다.",
    formula: String.raw`C=\frac{N_{\mathrm{traceable}}}{N_{\mathrm{population}}}`,
    terms: [{ symbol: "N_{\\mathrm{traceable}}", name: "Traceable records", description: "필수 단계·ID·source receipt가 모두 연결된 항목 수입니다." }, { symbol: "N_{\\mathrm{population}}", name: "Population size", description: "명시 기간·source·query로 재현한 전체 항목 수입니다." }, { symbol: "C", name: "Trace coverage", description: "0~1 범위의 증거 연결 비율입니다." }],
    assumptions: ["분자와 분모가 같은 기간·scope·dedupe rule을 씁니다.", "Traceable은 통제 결과가 합격했다는 뜻이 아니라 검증 가능한 상태라는 뜻입니다.", "C=1도 sampling과 evidence 진실성·통제 설계 적정성을 대신하지 않습니다."],
    interpretation: "배포 200건 중 184건만 request·approval·artifact·production receipt가 연결되면 C=0.92입니다. 나머지 16건의 공통 source와 영향범위를 조사한 뒤 표본 결과를 해석합니다.",
    citations: [
      { id: "paper-kisa-isms-audit", title: "KISA · ISMS-P 인증기준 안내서 2023.11", href: KISA_ISMS, problem: "인증기준을 실제 운영 증거·결함사례와 연결해야 합니다.", contribution: "관리체계·보호대책·개인정보 단계별 기준에 확인사항, 증거자료와 결함사례를 제시합니다.", assumptions: "2024-01-02 이후 적용 세부점검항목과 2026-08-14 현행 법령·조직 scope를 함께 확인합니다.", scope: "국내 ISMS-P 심사의 공식 해설과 증거 예시에 한정합니다.", notClaim: "예시 문서 목록을 모두 모으면 인증되거나 한 표본이 모집단 전체를 증명한다는 뜻은 아닙니다." },
      { id: "paper-kisa-isms-site", title: "KISA · ISMS-P 인증 제도·자료실", href: "https://pims.kisa.or.kr/", problem: "안내서·세부점검항목·적용일의 최신 게시본을 확인해야 합니다.", contribution: "KISA의 인증제도와 최신 공지·자료의 공식 진입점을 제공합니다.", assumptions: "심사 신청일과 적용 공지, 인증기관 요구를 release마다 확인합니다.", scope: "ISMS-P 현행 자료 탐색의 공식 출발점입니다.", notClaim: "이 글의 checklist가 실제 심사 범위·표본·판정을 고정한다는 뜻은 아닙니다." },
    ],
  },
  "isms-privacy-lifecycle": {
    key: "isms-privacy-lifecycle",
    eyebrow: "개인정보 생명주기 · 목적에서 검증된 파기까지",
    title: "개인정보 파기는 한 행을 지우는 일이 아니라 목적·법적 근거·보유기한과 모든 파생 사본을 닫는 과정이다",
    lead: "채용 지원자의 이력서가 원본 DB뿐 아니라 검색 index, analytics table, feature store, backup과 support export에 복제됐다고 가정합니다. 처리 목적과 법적 근거가 끝나면 보유기한·legal hold를 계산하고, primary와 파생물을 삭제하며, 즉시 덮어쓸 수 없는 backup에는 tombstone과 restore 뒤 재삭제 절차를 남깁니다.",
    boundary: "Retention은 ‘언젠가 필요할 수 있음’이 아니라 목적·법적 근거·기간·시작 event·owner가 있는 계약입니다. 분리 보관은 보유 근거가 남은 최소 항목을 다른 목적의 데이터와 분리하는 통제이지 무기한 보유 허가가 아닙니다. 익명화·가명처리·암호화와 파기는 서로 다른 상태입니다.",
    firstId: "purpose-retention-ledger",
    firstTitle: "개인정보 항목마다 목적·근거·시계·보존 예외를 versioned ledger로 만든다",
    firstBody: [
      "Data inventory는 이름 같은 field 목록을 넘어 source, subject, purpose, legal basis, processor, storage, transfer, derived artifact와 owner를 연결합니다. 보유기한은 수집일·계약 종료·채용 종료 같은 시작 event와 기간을 함께 가져야 합니다. 정책 version과 적용 대상이 없으면 같은 값의 deadline을 재현할 수 없습니다.",
      "Legal hold나 다른 법률상 보존은 자동 연장이 아닙니다. Hold authority, reason, 최소 항목, 시작·해제 조건과 access restriction을 별도 상태로 기록합니다. 원래 목적 처리와 섞지 않고 보존 근거가 끝나면 즉시 기존 deletion workflow에 다시 넣습니다.",
      "새 AI feature나 analytics table은 원본과 별개로 lineage에 등록합니다. 개인과 연결 가능한 embedding·feature·label도 처리 목적·보유·access·삭제 경계를 검토합니다. 모델 전체에서 한 record의 영향을 제거했다고 검증할 수 없다면 ‘원본 삭제=모델에서 완전 삭제’라고 주장하지 않습니다.",
    ],
    secondId: "deletion-derived-data",
    secondTitle: "Primary·cache·검색·analytics·backup의 삭제 상태와 restore 재삭제를 검증한다",
    secondBody: [
      "Deletion job은 subject request 또는 deadline event를 받아 artifact manifest를 펼치고 각 system에 idempotent command를 보냅니다. 결과는 deleted·not found·held·failed 같은 typed receipt로 모읍니다. Primary 404 하나로 search index·object storage·support export까지 지워졌다고 보지 않습니다.",
      "Backup은 보존·복구 목적과 immutability 때문에 개별 record를 즉시 덮어쓰지 못할 수 있습니다. 이때 backup expiry, access isolation, tombstone, restore environment의 pre-serve deletion과 evidence를 계약합니다. Crypto erase는 정확한 key scope와 모든 copy가 그 key에만 의존할 때만 해당 ciphertext의 접근 불능을 뒷받침합니다.",
      "고위험 신규 처리나 큰 변경에는 PIA를 change gate 앞에 둡니다. Data flow, necessity·proportionality, subject harm, third party, security, residual risk와 승인 owner를 문서화하고 mitigation을 testable control로 바꿉니다. 법정 영향평가 대상 여부와 내부 privacy review를 혼동하지 않습니다.",
    ],
    releaseId: "lifecycle-release",
    stages: [["PURPOSE", "왜 처리하는가", "항목·정보주체·목적·근거·processor를 inventory에 연결합니다."], ["CLOCK", "언제까지 보유하는가", "시작 event·기간·legal hold·policy version으로 deadline을 계산합니다."], ["DELETE", "어디까지 닫는가", "Primary·cache·index·analytics·export·backup manifest를 추적합니다."], ["VERIFY", "복구 뒤에도 지워졌는가", "Typed receipt·restore 재삭제·hold 해제·PIA release를 검사합니다."]],
    controls: [["LEDGER", "목적과 보유 시계", "Purpose·legal basis·trigger·period·owner·version을 결속합니다."], ["LINEAGE", "원본에서 생긴 사본", "Cache·index·analytics·feature·export·backup을 stable artifact ID로 연결합니다."], ["DELETE", "삭제 요청과 결과", "Idempotent command와 deleted·held·failed receipt를 분리합니다."], ["RESTORE", "Backup 복원 경계", "Tombstone을 적용한 뒤에만 service하고 재삭제 evidence를 남깁니다."]],
    failures: [["Primary DB만 삭제", "Index·analytics·export가 manifest에 남아 lifecycle을 완료하지 않습니다.", "derivative gap"], ["Legal hold를 무기한 flag로 사용", "Authority·최소 범위·해제 조건이 없어 fail closed 검토로 보냅니다.", "hold gap"], ["Backup restore 뒤 삭제 대상 재등장", "Service 전 tombstone 재적용과 restore test를 실패시킵니다.", "resurrection"], ["새 AI feature store가 inventory에 없음", "PIA·purpose·retention·deletion contract가 생길 때까지 release를 막습니다.", "unknown processing"]],
    question: "보유기한은 어떤 두 요소로 계산하며 legal hold는 어디에 붙는가?",
    idea: "정책 기간만 적지 않고 시계를 시작하는 사건에 기간을 더해 deadline을 만들며, 유효한 hold는 별도 권한으로 그 deadline의 실행을 제한합니다.",
    formula: String.raw`t_{\mathrm{delete}}=t_{\mathrm{event}}+T_{\mathrm{basis}}`,
    terms: [{ symbol: "t_{\\mathrm{event}}", name: "Retention start event", description: "계약 종료·채용 종료처럼 보유 시계를 시작하는 검증된 시각입니다." }, { symbol: "T_{\\mathrm{basis}}", name: "Permitted retention period", description: "해당 목적·법적 근거·정책 version이 허용하는 기간입니다." }, { symbol: "t_{\\mathrm{delete}}", name: "Deletion deadline", description: "보존 예외가 없을 때 파기 workflow가 실행돼야 하는 시각입니다." }],
    assumptions: ["Event와 기간의 timezone·calendar rule·policy generation을 고정합니다.", "Legal hold는 권한·최소범위·해제 조건이 있는 별도 state입니다.", "Deadline 계산만으로 모든 사본의 실제 삭제가 증명되지는 않습니다."],
    interpretation: "채용 절차가 8월 14일 끝나고 적용 정책이 30일 보유라면 deadline은 policy calendar에 따른 9월 13일입니다. 유효한 hold가 없다면 그 시각에 artifact manifest 전체를 삭제·검증합니다.",
    citations: [
      { id: "paper-pipa-lifecycle", title: "국가법령정보센터 · 개인정보 보호법", href: PIPA, problem: "처리 목적·보유·파기·정보주체 권리와 법적 예외를 현행 조문에서 확인해야 합니다.", contribution: "대한민국 개인정보 보호법의 현재 법령 원문과 시행 이력을 제공합니다.", assumptions: "2026-08-14 효력, 처리자 유형·사실관계와 다른 법률의 보존 의무를 법무·privacy owner가 확인합니다.", scope: "국내 개인정보 처리·파기의 상위 법률 근거입니다.", notClaim: "이 글의 30일 예시가 법정 공통 보유기간이거나 암호화·분리보관이 파기를 대체한다는 뜻은 아닙니다." },
      { id: "paper-kisa-privacy-lifecycle", title: "KISA · ISMS-P 인증기준 안내서 2023.11", href: KISA_ISMS, problem: "보유기간 경과·목적 달성 뒤 안전하고 완전한 파기 운영을 검증해야 합니다.", contribution: "개인정보 처리단계별 보유·파기·분리보관의 확인사항과 결함사례를 제공합니다.", assumptions: "최신 세부점검항목과 현행 법령, 조직의 실제 system lineage를 함께 적용합니다.", scope: "국내 ISMS-P 인증 확인사항과 증거 예시에 한정합니다.", notClaim: "문서상 파기 정책이나 DB delete log 한 건이 파생물·backup까지 완전 삭제됐음을 증명하지 않습니다." },
    ],
  },
  "isms-privacy-policy": {
    key: "isms-privacy-policy",
    eyebrow: "개인정보 처리방침 · 공시와 실제 통제의 일치",
    title: "처리방침은 법률 문구 모음이 아니라 이용자가 이해한 선택과 실제 데이터 흐름을 연결하는 공개 통제 계약이다",
    lead: "채용 서비스가 이력서, 접속 log, analytics SDK와 맞춤형 광고 cookie를 처리한다고 가정합니다. 먼저 실제 수집·이용·제공·위탁·국외이전·보유 흐름을 inventory로 만든 뒤, 목적·항목·근거·기간·권리행사 방법을 읽을 수 있게 공개합니다. 화면의 선택, backend enforcement와 감사 receipt가 방침의 문장과 같아야 합니다.",
    boundary: "처리방침 공개, 동의, 계약 이행·법적 의무 같은 처리 근거는 같은 것이 아닙니다. 모든 처리를 동의로 포장하지 않고 각 목적의 실제 법적 근거를 확인합니다. 제3자 제공과 처리위탁도 상대방이 자기 목적으로 쓰는지, 위탁받은 범위에서 처리하는지에 따라 책임·고지·통제가 달라집니다.",
    firstId: "notice-consent-boundary",
    firstTitle: "Data inventory에서 처리방침 문구를 만들고 선택 가능한 동의를 별도 receipt로 남긴다",
    firstBody: [
      "Inventory에는 data category, source, 목적, 법적 근거, 필수/선택, 보유기간, recipient·processor, 국외이전, cookie·SDK와 owner를 넣습니다. 처리방침의 한 문장이 어느 flow와 control generation을 설명하는지 stable ID로 연결합니다. 실제 SDK가 추가됐는데 문구만 그대로면 공시와 처리가 어긋납니다.",
      "Consent가 필요한 목적은 구체적이고 이해 가능하며 자유로운 선택이어야 합니다. 선택항목 거절을 서비스 전체 거절로 만들지 않고 accept와 reject를 비슷한 노력으로 제공합니다. Consent receipt에는 subject/session, purpose version, 선택, time, UI version과 withdrawal 결과를 남깁니다.",
      "방침 변경은 diff, effective date와 영향을 받는 data flow를 공개하고 필요한 경우 새 동의·통지를 수행합니다. 단순 typo와 새로운 광고 목적은 같은 변경이 아닙니다. 과거 receipt를 새 purpose에 소급하지 않고 backend가 withdrawal과 version별 선택을 enforcement하는지 검사합니다.",
    ],
    secondId: "sharing-cookie-controls",
    secondTitle: "제3자·processor·cookie·SDK의 실제 네트워크 효과를 inventory와 대조한다",
    secondBody: [
      "제3자 제공에는 recipient, 목적, 항목, 보유기간과 근거를, 위탁에는 위탁업무·processor·계약·감독·재위탁을 연결합니다. 명칭이 ‘partner’라는 이유로 분류하지 않고 실제 목적 결정권과 처리 instruction을 봅니다. 국외이전은 recipient·국가·시기·방법·근거와 보호조치를 현행 법령에 맞게 확인합니다.",
      "Cookie, local storage, mobile advertising ID와 SDK는 각각 identifier·domain·purpose·duration·first/third party·network destination을 inventory합니다. 로그인 유지처럼 필수인 저장과 analytics·맞춤형 광고를 분리하고, 선택 전 불필요한 tracker가 전송되지 않는지 browser trace로 검증합니다. Cookie라는 기술 이름만으로 필수나 비개인정보가 되지 않습니다.",
      "Release에서는 crawler로 공개문서 접근성·항목을 확인하고, browser/network fixture로 accept·reject·withdraw·expired receipt를 replay합니다. Backend, tag manager와 processor route가 같은 policy generation을 적용해야 합니다. Unknown SDK·recipient·purpose가 나오면 공개 전 fail closed하고 inventory·legal review·control을 갱신합니다.",
    ],
    releaseId: "policy-release",
    stages: [["INVENTORY", "실제 데이터 흐름", "Field·purpose·basis·recipient·cookie·SDK·retention을 발견합니다."], ["NOTICE", "이해 가능한 공개", "목적·항목·근거·기간·권리·제공·위탁을 flow ID에 연결합니다."], ["CHOICE", "동의와 철회 receipt", "필요한 목적만 versioned choice로 받고 backend에서 enforcement합니다."], ["PARITY", "문구와 runtime 일치", "Crawler·network trace·recipient·rollback으로 release를 검증합니다."]],
    controls: [["INVENTORY", "무엇이 실제로 흐르는가", "Schema·SDK·cookie·recipient·processor와 owner를 version으로 묶습니다."], ["NOTICE", "정보주체가 무엇을 아는가", "구체 목적·항목·근거·기간·권리행사와 변경일을 공개합니다."], ["CHOICE", "선택이 자유롭고 실행되는가", "Accept·reject·withdraw UI와 backend receipt를 같은 purpose ID로 잇습니다."], ["PARITY", "공시와 runtime이 같은가", "Browser trace·API effect·processor contract·data inventory를 paired 검사합니다."]],
    failures: [["Reject 전 광고 SDK가 전송", "선택 receipt 이전 network effect를 차단하고 배포를 되돌립니다.", "pre-consent effect"], ["위탁업체가 자기 광고 목적으로 재사용", "Processor 지시 범위를 벗어나므로 recipient 분류·근거·통제를 재검토합니다.", "purpose drift"], ["철회 UI만 있고 backend 계속 처리", "Runtime enforcement와 삭제·중단 receipt가 없어 parity를 실패시킵니다.", "withdrawal gap"], ["새 SDK가 방침·inventory에 없음", "Unknown recipient·purpose를 차단하고 review 뒤 새 generation을 발행합니다.", "unknown flow"]],
    question: "공시와 실제 처리의 일치를 release gate로 어떻게 표현할 수 있는가?",
    idea: "Inventory, 읽을 수 있는 notice, 실제 선택 enforcement, 재현 가능한 evidence가 모두 있어야 한 generation을 공개합니다.",
    formula: String.raw`P=I\land N\land C\land E`,
    terms: [{ symbol: "I", name: "Inventory completeness", description: "실제 data·cookie·SDK·recipient flow가 발견·분류됐습니다." }, { symbol: "N", name: "Notice accuracy", description: "목적·항목·근거·기간·권리와 상대방을 읽을 수 있게 공개했습니다." }, { symbol: "C", name: "Choice enforcement", description: "필요한 동의·거절·철회가 UI와 backend에서 같은 version으로 작동합니다." }, { symbol: "E", name: "Evidence receipt", description: "Crawler·network trace·API·processor evidence가 release artifact에 묶였습니다." }, { symbol: "P", name: "Policy release", description: "해당 처리방침과 runtime generation을 공개할 수 있는 내부 승인입니다." }],
    assumptions: ["각 Boolean은 문서 존재가 아니라 같은 fixture·generation에서 검증된 상태입니다.", "어떤 처리가 동의를 요구하는지는 현행 법령과 사실관계로 별도 판단합니다.", "P는 법적 적법성 전체를 수학적으로 증명하는 식이 아니라 누락 방지용 내부 gate입니다."],
    interpretation: "방침 문구가 정확해 N=1이어도 reject 뒤 광고 SDK가 호출돼 C=0이면 P=0입니다. Runtime을 고치고 새 network trace와 withdrawal receipt를 만든 뒤 다시 승인합니다.",
    citations: [
      { id: "paper-pipa-policy", title: "국가법령정보센터 · 개인정보 보호법", href: PIPA, problem: "처리방침·처리 근거·제공·위탁·국외이전·권리의 현행 의무를 확인해야 합니다.", contribution: "대한민국 개인정보 보호법의 현재 원문과 시행 이력을 제공합니다.", assumptions: "2026-08-14 효력, 처리자·정보주체·목적·상대방의 사실관계를 privacy/legal owner가 확인합니다.", scope: "국내 개인정보 처리의 상위 법률 근거입니다.", notClaim: "처리방침 공개나 동의 한 번이 모든 수집·이용·제공을 자동 적법하게 만든다는 뜻은 아닙니다." },
      { id: "paper-privacy-standard-guideline", title: "개인정보위 · 표준 개인정보 보호지침", href: PRIVACY_GUIDE, problem: "처리방침을 명확하고 구체적인 항목으로 작성하고 실제 처리와 연결해야 합니다.", contribution: "처리방침 작성과 개인정보 처리의 세부 기준을 공식 행정규칙으로 제공합니다.", assumptions: "법률·시행령·고시의 최신 효력과 서비스별 실제 flow를 함께 적용합니다.", scope: "국내 처리방침 작성·공개의 일반 기준입니다.", notClaim: "예시 문구 복사가 서비스의 실제 처리·권리보장·보안 통제를 증명하지 않습니다." },
      { id: "paper-pipc-behavior-data", title: "개인정보위 · 맞춤형 광고 행태정보 정책 방안", href: PIPC_BEHAVIOR, problem: "Cookie·광고 ID 등 누적 행태정보의 식별·추론 위험과 이용자 통제를 다뤄야 합니다.", contribution: "맞춤형 광고 행태정보의 명확한 고지, 적법한 수집요건과 사후 거부 경계를 설명합니다.", assumptions: "후속 개정 guidance와 2026-08-14 현행 법령·실제 identifier flow를 다시 확인합니다.", scope: "온라인 행태정보와 맞춤형 광고의 국내 정책 방향에 한정합니다.", notClaim: "모든 cookie가 동의 대상이거나 browser 차단 하나로 모든 SDK·server-side 처리가 중단된다는 뜻은 아닙니다." },
    ],
  },
};

function FlowViz({ config }: { config: Config }) {
  return (
    <figure data-viz={`${config.key}-evidence-flow`} data-viz-canvas className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 px-4 py-4 sm:px-5">
        <p className="text-sm font-semibold">한 사건을 입력에서 검증된 release까지 추적합니다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">각 칸은 입력·판단 owner·receipt·비보장이 다르며 앞 단계의 이름만으로 뒤 단계를 통과하지 않습니다.</p>
      </figcaption>
      <div className="grid gap-px bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
        {config.stages.map(([tag, title, body], index) => (
          <div key={tag} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-center gap-2"><span className="text-[11px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</span><span className="text-[11px] font-bold tracking-[.08em] text-muted-foreground">{tag}</span></div>
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
        <p><strong>문제:</strong> {item.problem}</p><p><strong>기여:</strong> {item.contribution}</p><p><strong>전제:</strong> {item.assumptions}</p><p><strong>근거 범위:</strong> {item.scope}</p><p><strong>하지 않는 주장:</strong> {item.notClaim}</p>
      </CitationBlock>
    </div>
  );
}

export default function ComplianceEvidenceArticle({ article }: { article: ArticleKey }) {
  const config = CONFIG[article];
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">{config.eyebrow}</p><h2 className="text-3xl font-bold tracking-tight">{config.title}</h2></header>
        <p className="text-lg leading-8 text-foreground/90">{config.lead}</p>
        <aside className="rounded-lg border border-border p-4 text-sm leading-6">{config.boundary}</aside>
        <FlowViz config={config} />
        <ContentBoundary article={config.key} />
      </section>

      <section id={config.firstId} className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · 개념과 증거 경계</p><h2 className="mt-2 text-2xl font-bold">{config.firstTitle}</h2></header>
        {config.firstBody.map((paragraph) => <p key={paragraph} className="leading-7">{paragraph}</p>)}
        <div className="grid gap-3 md:grid-cols-2">{config.controls.map(([tag, title, body]) => <div key={tag} className="min-w-0 rounded-lg border border-border p-4"><p className="text-xs font-bold tracking-[.08em] text-primary">{tag}</p><p className="mt-2 font-semibold">{title}</p><p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{body}</p></div>)}</div>
      </section>

      <section id={config.secondId} className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · 실행·계산·근거</p><h2 className="mt-2 text-2xl font-bold">{config.secondTitle}</h2></header>
        {config.secondBody.map((paragraph) => <p key={paragraph} className="leading-7">{paragraph}</p>)}
        <ExplainedFormula question={config.question} idea={config.idea} formula={config.formula} terms={config.terms} assumptions={config.assumptions} interpretation={config.interpretation} />
        {config.citations.map((item, index) => <Evidence key={item.id} item={item} index={index} />)}
      </section>

      <section id={config.releaseId} className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 실패 주입과 release gate</p><h2 className="mt-2 text-2xl font-bold">정상 화면보다 누락·우회·잘못된 권한·복구 뒤 재발을 먼저 시험한다</h2></header>
        <div className="overflow-hidden rounded-lg border border-border"><div className="grid grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] gap-3 bg-muted/40 px-4 py-3 text-xs font-semibold"><span>실패 주입</span><span>기대 결과</span></div>{config.failures.map(([fault, oracle, receipt]) => <div key={fault} className="grid grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] gap-3 border-t border-border px-4 py-3 text-sm"><span className="font-medium">{fault}</span><span className="min-w-0 break-words text-muted-foreground">{oracle} <strong className="text-foreground">[{receipt}]</strong></span></div>)}</div>
        <p className="leading-7">Base와 candidate는 같은 population·fixture·effective date·policy·code·model generation에서 비교합니다. Missing·unknown은 pass가 아니며, owner·reviewer·artifact digest·canary·rollback과 외부 effect receipt를 하나의 release record로 남깁니다.</p>
        <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3>
        <p className="leading-7">기초 6문제는 용어·흐름·작은 계산을, 심화 4문제는 반례·실패 주입·독립 평가·rollback을 묻습니다. 정답 체크리스트의 전제와 비보장은 위 절에서 직접 회수할 수 있어야 합니다.</p>
      </section>
    </article>
  );
}
