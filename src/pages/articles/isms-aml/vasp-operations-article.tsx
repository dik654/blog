import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";

type ArticleKey =
  | "vasp-custody-management"
  | "vasp-wallet-security"
  | "vasp-unfair-trading";

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
  stages: readonly (readonly [string, string, string])[];
  failures: readonly (readonly [string, string])[];
  question: string;
  idea: string;
  formula: string;
  terms: readonly { symbol: string; name: string; description: string }[];
  assumptions: readonly string[];
  interpretation: string;
  citations: readonly Citation[];
};

const FSC_LAW = "https://www.fsc.go.kr/po020201/83937";
const FSC_SURVEILLANCE = "https://www.fsc.go.kr/po010101/82943";
const FSC_RESULTS = "https://www.fsc.go.kr/po010105/87357";
const FATF_VASP = "https://www.fatf-gafi.org/content/dam/fatf/documents/recommendations/Updated-Guidance-VA-VASP.pdf";

const CONFIG: Record<ArticleKey, Config> = {
  "vasp-custody-management": {
    key: "vasp-custody-management",
    eyebrow: "VASP custody · 고객 자산에서 검증된 출금까지",
    title: "보관은 주소 잔액을 보여 주는 일이 아니라 고객별 채무와 통제 가능한 자산을 계속 맞추는 일이다",
    lead: "고객 민지가 2 BTC를 맡기고 0.3 BTC 출금을 요청한다고 가정합니다. 시스템은 고객 원장에 채무 2 BTC를 기록하고, 주소·외부 수탁자별 자산을 inventory에 묶으며, 승인된 출금만 서명·broadcast·confirmation·고객 원장 반영으로 이어야 합니다. 온체인 주소 잔액 하나만으로는 고객별 채무의 완전성이나 출금 권한을 알 수 없습니다.",
    boundary: "Custody는 타인의 자산을 보관·통제하는 책임입니다. Proof of Reserves(PoR, 준비자산 증명)는 특정 시점의 검증된 자산과 포함된 고객 채무를 대조하는 증거일 뿐, 누락 채무·차입·법적 권리·미래 지급능력까지 증명하는 solvency oracle이 아닙니다. 80%는 현재 국내 감독규정의 경제적 가치 기준 콜드월렛 보관비율이며 모든 국가·모든 자산의 보편 설계값이 아닙니다.",
    firstId: "asset-liability-control",
    firstTitle: "고객 채무, 통제 가능한 자산, 지갑 tier를 서로 다른 원장으로 잇는다",
    firstBody: [
      "Liability ledger는 고객별 입금·거래·수수료·출금으로 사업자가 돌려줘야 할 수량을 계산합니다. Asset inventory는 chain·network·address·custodian·key authority·confirmation policy·generation을 기록합니다. 두 원장은 stable asset ID와 cutoff time으로 맞추되, omnibus 주소의 잔액을 특정 고객 소유권으로 바로 간주하지 않습니다.",
      "Hot·warm·cold는 인터넷 연결 여부만이 아니라 누가 어떤 절차로 signing authority를 사용할 수 있는지를 나타내는 운영 tier입니다. 국내 80% 비율은 이용자 가상자산의 경제적 가치를 매일 산정해 상시 유지하는 규제 경계입니다. 수량비율·주소 개수·월말 snapshot으로 바꾸어 계산하지 않습니다.",
      "외부 수탁자를 써도 VASP의 고객 원장·withdrawal authorization·reconciliation 책임이 사라지지 않습니다. Custodian statement, on-chain balance, contract/SLA, key-control attestation, withdrawal receipt와 장애 escalation을 같은 cutoff에서 대조하고 unknown·late receipt는 자동 성공으로 바꾸지 않습니다.",
    ],
    secondId: "proof-withdrawal-boundary",
    secondTitle: "PoR snapshot과 실제 출금 lifecycle을 분리해 검증한다",
    secondBody: [
      "PoR manifest에는 포함한 고객·자산·chain·주소·custodian·cutoff·price source·liability root와 verifier version이 필요합니다. 고객은 자기 leaf 포함을 확인할 수 있어야 하지만, 그 사실만으로 다른 고객이 모두 포함됐거나 자산이 담보로 묶이지 않았음을 알 수는 없습니다.",
      "민지의 0.3 BTC 출금은 request→risk/policy→분리 승인→signing→broadcast→confirmation→고객 채무 감소의 순서로 추적합니다. Broadcast hash는 chain confirmation이나 내부 원장 반영이 아니며, 실패·replacement·reorg가 생기면 같은 intent ID로 reconcile합니다.",
      "Release에서는 누락 liability, 중복 주소, borrowed snapshot asset, stale custodian statement, signer timeout, reorg와 원장 crash를 주입합니다. 자산·채무·key generation·policy와 verifier를 함께 pin하고 이전 generation으로 되돌릴 수 있어야 합니다.",
    ],
    releaseId: "custody-release",
    stages: [["LIABILITY", "고객에게 얼마를 돌려줘야 하는가", "고객·asset·cutoff가 있는 채무 원장을 만듭니다."], ["ASSET", "어떤 자산을 실제 통제하는가", "주소·custodian·key authority와 확인 상태를 inventory합니다."], ["EFFECT", "승인된 출금만 실행한다", "Request부터 confirmation·ledger까지 같은 intent ID로 잇습니다."], ["RELEASE", "누락·차입·장애를 실패시킨다", "PoR 한계와 rollback receipt까지 함께 검사합니다."]],
    failures: [["고객 한 명의 liability leaf 누락", "Root가 계산돼도 population completeness 실패로 release를 막습니다."], ["Snapshot 직전 빌린 자산", "Cutoff balance는 보존하되 지급능력 결론으로 승격하지 않습니다."], ["Custodian API timeout", "Unknown receipt로 남기고 자체 장부를 임의로 성공 처리하지 않습니다."], ["Broadcast 뒤 reorg", "Intent·replacement·confirmation을 재조정하고 이중 출금을 막습니다."]],
    question: "검증한 자산 105 BTC와 포함 채무 100 BTC를 어떻게 읽어야 하는가?",
    idea: "단순 비율은 snapshot 안에서 검증된 자산이 포함 채무보다 얼마나 큰지만 보여 줍니다. 채무 모집단 완전성과 자산의 법적·운영 통제는 별도 증거입니다.",
    formula: String.raw`R=\frac{A_{\mathrm{verified}}}{L_{\mathrm{included}}}=\frac{105}{100}=1.05`,
    terms: [{ symbol: "A_verified", name: "Verified assets", description: "고정 cutoff와 방법으로 통제·잔액을 확인한 자산입니다." }, { symbol: "L_included", name: "Included liabilities", description: "PoR manifest가 포함했다고 밝힌 고객 채무입니다." }, { symbol: "R", name: "Snapshot coverage ratio", description: "선택 snapshot의 자산/포함 채무 비율입니다." }],
    assumptions: ["같은 asset unit·cutoff·valuation rule을 사용합니다.", "Liability population completeness와 asset encumbrance는 별도 검증합니다.", "R≥1은 지급능력·감사·미래 출금 성공을 증명하지 않습니다."],
    interpretation: "R=1.05는 포함 채무 100 BTC에 대해 검증 자산 105 BTC가 보였다는 뜻뿐입니다. 숨은 채무 20 BTC가 있으면 전체 비율은 달라지므로 PoR와 solvency를 구분합니다.",
    citations: [
      { id: "paper-fsc-vasp-custody", title: "금융위원회 · 가상자산이용자보호법 시행 Q&A", href: FSC_LAW, problem: "국내 이용자 자산 보관비율과 산정·유지 시점을 확인해야 합니다.", contribution: "경제적 가치 기준 80% 이상 콜드월렛 보관과 일일 산정·상시 유지 경계를 설명합니다.", assumptions: "2026-08-14 현행 법령·감독규정과 사업자 사실관계를 준법 owner가 재확인합니다.", scope: "대한민국 VASP의 이용자 자산 보관 관련 공식 설명입니다.", notClaim: "80%가 모든 국가의 보편값이거나 PoR·지급능력·key safety를 자동 증명한다는 뜻은 아닙니다." },
      { id: "paper-fatf-vasp-custody", title: "FATF · Updated Guidance for VA and VASPs", href: FATF_VASP, problem: "외부 수탁·wallet·거래 통제를 고객 위험과 책임에 연결해야 합니다.", contribution: "VASP risk-based control과 third-party 관계의 국제 정책 경계를 제공합니다.", assumptions: "국내 법령과 실제 custody 역할·계약·위험평가를 함께 적용합니다.", scope: "FATF의 VASP risk-control 원칙에 한정합니다.", notClaim: "특정 wallet architecture·PoR 방식·custodian 제품을 승인하지 않습니다." },
    ],
  },
  "vasp-wallet-security": {
    key: "vasp-wallet-security",
    eyebrow: "VASP wallet · 요청에서 검증된 원장 효과까지",
    title: "지갑 보안은 private key를 숨기는 일보다 누가 어떤 출금을 어떤 세대로 승인했는지 증명하는 일이다",
    lead: "민지가 0.3 BTC 출금을 요청하면 customer authentication, destination·amount risk, policy approval, signing authority, broadcast, confirmation과 고객 원장 반영이 하나의 intent로 이어져야 합니다. 서명 장비가 안전해도 승인되지 않은 calldata를 서명하면 통제는 실패합니다.",
    boundary: "HSM(Hardware Security Module)은 key operation을 격리하는 장치이고 MPC(Multi-Party Computation)는 여러 참여자가 key share로 공동 계산하는 방식입니다. 둘 다 고객 인증·업무 승인·destination policy·chain confirmation을 대신하지 않습니다. M-of-N key share와 M-of-N 업무 승인은 같은 숫자여도 다른 통제입니다.",
    firstId: "key-signing-boundary",
    firstTitle: "Key share, signing policy, 업무 승인을 서로 다른 권한으로 둔다",
    firstBody: [
      "Key ceremony는 생성 참여자, entropy·algorithm·parameter, share distribution, backup, recovery, rotation, revocation과 destroy receipt를 남깁니다. Hot·warm·cold tier마다 online authority, value/velocity limit, destination rule과 recovery owner를 다르게 둡니다.",
      "서명 대상은 화면의 ‘0.3 BTC’가 아니라 chain, network, asset, destination, amount, fee, nonce, calldata와 policy generation을 canonical digest로 묶은 intent입니다. Approver가 본 값과 signer가 받은 byte가 다르면 fail closed합니다.",
      "Dual control은 한 사람이 request·approve·sign·reconcile을 모두 지배하지 못하게 합니다. Emergency override도 named authority, 좁은 scope, expiry, reason과 사후 review가 필요하며 평상시 policy를 조용히 우회하는 master key로 만들지 않습니다.",
    ],
    secondId: "withdrawal-operations",
    secondTitle: "Broadcast·confirmation·고객 원장 반영을 별도 상태로 reconcile한다",
    secondBody: [
      "Signer success는 valid signature bytes를 만들었다는 뜻입니다. Broadcast accepted, mempool, chain confirmation, finality policy, 고객 채무 감소는 뒤의 상태입니다. 각 단계에 typed receipt와 idempotency key를 붙여 retry가 중복 출금을 만들지 않게 합니다.",
      "Nonce conflict·fee replacement·chain reorg·RPC timeout·partial ledger commit을 실패 주입합니다. Unknown external effect는 새 transaction을 즉시 만들지 않고 transaction hash·nonce·intent digest로 reconcile합니다.",
      "Release manifest에는 wallet code, policy, key/share generation, approver roster, chain config, signer firmware와 recovery artifact를 넣습니다. Base/candidate의 승인 없는 effect 0, negative fixtures, recovery와 reconciliation을 통과한 뒤 작은 한도로 canary합니다.",
    ],
    releaseId: "wallet-release",
    stages: [["INTENT", "고객 요청을 canonical byte로", "Chain·destination·amount·nonce·policy generation을 묶습니다."], ["AUTHORIZE", "사람·정책·key 권한을 분리", "Customer/risk/approval/signing 조건을 각 owner가 확인합니다."], ["EFFECT", "서명 뒤 외부 상태", "Broadcast·confirmation·ledger receipt를 따로 기록합니다."], ["RECOVER", "Unknown·reorg·key loss", "Reconcile·recovery·rollback을 새 generation에서 검증합니다."]],
    failures: [["UI destination과 signer byte 불일치", "Canonical intent digest가 달라 서명을 거절합니다."], ["Approver 1명이 두 역할 사용", "업무 분리 위반으로 effect 전 중단합니다."], ["RPC timeout 뒤 blind retry", "기존 hash·nonce를 reconcile하기 전 새 출금을 만들지 않습니다."], ["Backup share 복원 실패", "새 key generation으로 전환하기 전 recovery test를 실패시킵니다."]],
    question: "출금 release gate는 어떤 독립 조건이 모두 참이어야 하는가?",
    idea: "고객 의도, 정책, 분리 승인, signer binding, chain/ledger reconciliation이 같은 generation에서 검증돼야 외부 효과를 허용합니다.",
    formula: String.raw`W=I\land P\land A\land S\land R`,
    terms: [{ symbol: "I", name: "Intent binding", description: "고객이 승인한 chain·destination·amount가 canonical bytes와 같습니다." }, { symbol: "P", name: "Policy pass", description: "한도·velocity·allowlist·risk policy가 통과했습니다." }, { symbol: "A", name: "Separated approval", description: "요구된 독립 업무 승인과 authority가 확인됐습니다." }, { symbol: "S", name: "Signer binding", description: "승인한 digest와 key generation을 signer가 그대로 사용합니다." }, { symbol: "R", name: "Reconciliation readiness", description: "Broadcast·confirmation·ledger 상태를 idempotent하게 조정할 수 있습니다." }],
    assumptions: ["각 Boolean은 같은 intent와 policy/key generation을 가리킵니다.", "MPC share 수와 업무 승인자 수를 구분합니다.", "W=1은 chain finality·고객 기기 안전·법률 준수 전체의 증명이 아닙니다."],
    interpretation: "HSM 서명이 가능해 S=1이어도 approver 분리가 깨져 A=0이면 W=0입니다. 서명 장비 하나만 통과했다고 출금을 release하지 않습니다.",
    citations: [
      { id: "paper-fsc-vasp-wallet", title: "금융위원회 · 가상자산이용자보호법 시행 Q&A", href: FSC_LAW, problem: "이용자 자산의 안전한 보관과 손실 대응 경계를 현행 기준에서 확인해야 합니다.", contribution: "콜드월렛 비율·보험/공제/준비금 등 국내 보호조치의 공식 설명을 제공합니다.", assumptions: "2026-08-14 현행 규정과 실제 wallet·보험·준비금 scope를 다시 확인합니다.", scope: "국내 VASP 이용자 자산 보호의 상위 운영 경계입니다.", notClaim: "특정 HSM·MPC·multisig architecture나 한계값을 승인하지 않습니다." },
      { id: "paper-fatf-vasp-wallet", title: "FATF · Updated Guidance for VA and VASPs", href: FATF_VASP, problem: "Wallet transaction과 고객·counterparty 위험을 지속적으로 통제해야 합니다.", contribution: "VASP risk-based controls와 ongoing monitoring의 국제 원칙을 제공합니다.", assumptions: "국내 법령·chain 위험·service model과 함께 적용합니다.", scope: "VASP의 일반 risk-control 원칙입니다.", notClaim: "FATF가 특정 key ceremony·signer·blockchain finality 정책을 정했다는 뜻은 아닙니다." },
    ],
  },
  "vasp-unfair-trading": {
    key: "vasp-unfair-trading",
    eyebrow: "Market surveillance · 신호에서 권한 있는 판단까지",
    title: "이상거래 감시는 가격 급등을 유죄로 부르는 규칙이 아니라 주문 사건을 재구성해 사람이 조사할 근거를 만드는 과정이다",
    lead: "상장 예정 토큰 X의 비공개 일정에 접근한 직원 계정과 연결된 외부 계정이 공지 20분 전에 매수했다고 가정합니다. 동시에 다른 계정군은 매수·매도 주문을 반복해 거래량을 부풀립니다. 감시 시스템은 정보 접근·주문·체결·취소·계정 연결을 event time으로 재구성해 alert와 case를 만들지만 위법 판단은 권한 있는 조사 절차의 몫입니다.",
    boundary: "Market surveillance(시장감시)는 조사할 후보를 찾는 운영이고 market manipulation·미공개중요정보 이용의 법률 판단은 별도입니다. 높은 score, 짧은 취소시간, 연결 graph는 증거의 일부이지 행위·의도·부당이득을 자동 확정하지 않습니다.",
    firstId: "information-order-boundary",
    firstTitle: "정보 접근과 주문 사건을 같은 시계·identity·version으로 재구성한다",
    firstBody: [
      "Material nonpublic information ledger에는 정보 내용·생성·공개 시각, 접근 가능한 역할, 실제 access log와 정책 version을 둡니다. 공지 전 매수라는 시간 순서만으로 내부자 접근을 추정하지 않고 account/KYC/device/funding 관계도 source·confidence와 함께 보존합니다.",
      "Order event에는 client/order/trade ID, event/ingestion time, side, price, quantity, cancel/replace, book snapshot과 matching-engine sequence가 필요합니다. 늦게 도착한 event를 원래 시점에 몰래 삽입하지 않고 correction generation을 남겨 spoofing·layering·wash 후보를 재현합니다.",
      "Alert reason은 비공개정보 접근, self/linked trade, 취소율, 가격·거래량 영향처럼 분리합니다. 하나의 score로 눌러도 원 signal과 counterevidence를 잃지 않으며, alert→analyst case→감독당국 통보/수사 신고를 서로 다른 authority state로 둡니다.",
    ],
    secondId: "manipulation-surveillance-case",
    secondTitle: "탐지 품질과 검토용량을 함께 맞춘 뒤 case로 넘긴다",
    secondBody: [
      "Wash 후보는 beneficial owner·device·funding·order timing과 self-match prevention 결과를 함께 봅니다. Spoof/layering 후보는 보이는 주문, 취소, 반대편 체결과 시장영향을 재구성합니다. 빠른 취소나 큰 주문 하나는 market making·오류·news response 같은 반례와 구분합니다.",
      "Calibration set에서 threshold를 정하고 별도 기간·자산·시장 regime holdout에서 miss·precision·queue를 확인합니다. Analyst는 원 event, 정보 접근, 계정 연결 근거와 반증을 보고 close·escalate를 기록합니다. 모델은 법적 결론이나 고발 버튼이 아닙니다.",
      "Release에서는 clock skew, missing cancel, duplicated trade, identity merge 오류, listing leak, manipulative replay와 정상 market-making 반례를 paired 실행합니다. 외부 통보·계정제한 effect는 shadow에서 0이어야 하며 reviewer·policy/model generation과 rollback을 남깁니다.",
    ],
    releaseId: "market-release",
    stages: [["EVENT", "주문·체결·정보 접근", "원 event와 두 시계·source sequence를 보존합니다."], ["SIGNAL", "행동 후보를 분리", "Access·linked trade·cancel·impact reason을 version으로 남깁니다."], ["CASE", "사람이 맥락과 반증 검토", "Alert를 법적 결론으로 자동 승격하지 않습니다."], ["RELEASE", "누락·오탐·용량을 검증", "Holdout·shadow·rollback으로 effect를 통제합니다."]],
    failures: [["Cancel event 5% 누락", "Spoof score를 신뢰하지 않고 feed completeness를 실패시킵니다."], ["두 고객 identity 오병합", "Linked-trade signal을 철회하고 graph generation을 rollback합니다."], ["정상 market maker를 조작으로 분류", "반례 slice와 human close reason을 calibration에 반영합니다."], ["Alert를 자동 고발", "권한·case review가 없으므로 외부 effect를 거절합니다."]],
    question: "하루 alert 480건을 4명이 건당 10분씩, 각 360분 검토할 수 있으면 부하는 얼마인가?",
    idea: "총 검토 필요시간을 실제 analyst 가용시간으로 나눠 threshold가 운영 가능한지 확인합니다.",
    formula: String.raw`Q=\frac{A m}{H}=\frac{480\times 10}{4\times 360}\approx 3.33`,
    terms: [{ symbol: "A", name: "Alerts per day", description: "하루 생성되는 조사 후보 수입니다." }, { symbol: "m", name: "Minutes per alert", description: "Quality를 유지한 평균 검토시간입니다." }, { symbol: "H", name: "Available analyst minutes", description: "전체 analyst의 실제 일일 가용시간입니다." }, { symbol: "Q", name: "Capacity load", description: "1보다 크면 평균 유입이 처리용량보다 큽니다." }],
    assumptions: ["같은 alert definition과 severity mix를 사용합니다.", "P95 queue age와 고위험 miss를 별도로 봅니다.", "Q는 위법 판단 threshold나 신고 의무 조건이 아닙니다."],
    interpretation: "Q≈3.33이면 queue가 계속 쌓입니다. Recall 숫자만 보고 배포하지 말고 threshold·workflow·인력을 조정한 뒤 독립 holdout으로 다시 확인합니다.",
    citations: [
      { id: "paper-fsc-market-surveillance", title: "금융위원회 · 가상자산 이상거래 상시감시 현장점검", href: FSC_SURVEILLANCE, problem: "거래소의 이상거래 상시감시와 당국 통보 책임을 구분해야 합니다.", contribution: "가격·거래량 감시, 예방조치, 의심거래 통보의 국내 공식 운영 경계를 설명합니다.", assumptions: "2026-08-14 현행 법령과 거래소별 업무규정·권한을 재확인합니다.", scope: "대한민국 가상자산거래소의 이상거래 상시감시입니다.", notClaim: "Alert나 거래소 심리가 위법·유죄·부당이득을 자동 확정한다는 뜻은 아닙니다." },
      { id: "paper-fsc-unfair-results", title: "금융위원회 · 가상자산 불공정거래 조사 2년 성과", href: FSC_RESULTS, problem: "감시·혐의통보·조사·조치의 실제 authority chain을 구분해야 합니다.", contribution: "2026년 현재 조사 전담조직·거래소 상시감시·혐의 확인 뒤 조사 흐름을 공식 설명합니다.", assumptions: "보도자료의 집계 시점과 개별 사건 사실관계를 구분합니다.", scope: "2024-07-19 법 시행 뒤 국내 조사 운영의 공개 snapshot입니다.", notClaim: "공개 건수·평균 부당이득을 모든 사건의 base rate나 detector 성능으로 일반화하지 않습니다." },
    ],
  },
};

function Flow({ config }: { config: Config }) {
  return <figure data-viz={`${config.key}-flow`} data-viz-canvas className="not-prose overflow-hidden rounded-xl border border-border bg-card"><figcaption className="border-b border-border px-4 py-4 text-sm font-semibold">한 사건을 입력에서 검증된 release까지 추적합니다</figcaption><div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">{config.stages.map(([tag, title, body], index) => <div key={tag} className="min-w-0 bg-background p-4"><p className="text-xs font-bold text-primary">{String(index + 1).padStart(2, "0")} · {tag}</p><p className="mt-2 break-keep text-sm font-semibold">{title}</p><p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div></figure>;
}

function Evidence({ item, index }: { item: Citation; index: number }) {
  return <div id={item.id} className="scroll-mt-24"><CitationBlock source={item.title} citeKey={index + 1} type="paper" href={item.href}><p><strong>문제:</strong> {item.problem}</p><p><strong>기여:</strong> {item.contribution}</p><p><strong>전제:</strong> {item.assumptions}</p><p><strong>근거 범위:</strong> {item.scope}</p><p><strong>하지 않는 주장:</strong> {item.notClaim}</p></CitationBlock></div>;
}

export default function VaspOperationsArticle({ article }: { article: ArticleKey }) {
  const c = CONFIG[article];
  return <article className="space-y-14">
    <section id="overview" className="space-y-6"><p className="text-sm font-semibold text-primary">{c.eyebrow}</p><h2 className="text-3xl font-bold tracking-tight">{c.title}</h2><p className="text-lg leading-8">{c.lead}</p><aside className="rounded-lg border border-border p-4 text-sm leading-6">{c.boundary}</aside><Flow config={c}/><ContentBoundary article={c.key}/></section>
    <section id={c.firstId} className="space-y-5"><p className="text-sm font-semibold text-primary">01 · 개념과 통제 경계</p><h2 className="text-2xl font-bold">{c.firstTitle}</h2>{c.firstBody.map((p) => <p key={p} className="leading-7">{p}</p>)}</section>
    <section id={c.secondId} className="space-y-5"><p className="text-sm font-semibold text-primary">02 · 계산과 운영 증거</p><h2 className="text-2xl font-bold">{c.secondTitle}</h2>{c.secondBody.map((p) => <p key={p} className="leading-7">{p}</p>)}<ExplainedFormula question={c.question} idea={c.idea} formula={c.formula} terms={c.terms} assumptions={c.assumptions} interpretation={c.interpretation}/>{c.citations.map((item, index) => <Evidence key={item.id} item={item} index={index}/>)}</section>
    <section id={c.releaseId} className="space-y-5"><p className="text-sm font-semibold text-primary">03 · 실패 주입과 release gate</p><h2 className="text-2xl font-bold">정상 예시보다 누락·우회·외부 effect의 불확실성을 먼저 시험합니다</h2><div className="overflow-hidden rounded-lg border border-border">{c.failures.map(([fault, oracle]) => <div key={fault} className="grid grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] gap-3 border-b border-border p-4 text-sm last:border-b-0"><strong>{fault}</strong><span className="min-w-0 break-words text-muted-foreground">{oracle}</span></div>)}</div><p className="leading-7">Base와 candidate는 같은 사건·기간·policy·code·key/model generation에서 비교합니다. Missing·unknown은 pass가 아니며 owner, reviewer, source digest, canary와 rollback receipt를 하나의 release record로 남깁니다.</p><h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p className="leading-7">기초 6문제는 용어·흐름·작은 계산을, 심화 4문제는 반례·실패 주입·독립 검증·rollback을 묻습니다. 각 답의 전제와 비보장은 위 절에서 직접 찾을 수 있습니다.</p></section>
  </article>;
}
