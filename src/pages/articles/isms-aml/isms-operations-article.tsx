import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";

type ArticleKey =
  | "isms-backup-recovery"
  | "isms-incident-response"
  | "isms-dev-security"
  | "isms-security-infra";

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
  annotatedFormula: string;
  operations: readonly { expression: string; annotation: string | readonly string[] }[];
  terms: readonly { symbol: string; name: string; description: string }[];
  assumptions: readonly string[];
  interpretation: string;
  citations: readonly Citation[];
};

const KISA_GUIDE =
  "https://pims.kisa.or.kr/board/file/bbs_0000000000000014/21/FILE_000000000001002/202311231554317701147901071.pdf";

const CONFIG: Record<ArticleKey, Config> = {
  "isms-backup-recovery": {
    key: "isms-backup-recovery",
    eyebrow: "업무 연속성 · 복구 가능한 사본에서 서비스 승인까지",
    title: "백업은 파일을 복사하는 일이 아니라 정해진 시점의 서비스를 다시 증명하는 일이다",
    lead:
      "급여 DB가 12시 00분에 손상됐다고 가정합니다. 11시 50분의 database log가 마지막으로 검증된 복구 지점이고, object storage의 급여 명세서와 KMS key도 같은 세대로 맞아야 합니다. DB 파일 하나를 열었다고 서비스가 복구된 것은 아닙니다. Identity, key, queue, object와 외부 연계를 일관된 시점으로 맞춘 뒤 업무 검증과 traffic 전환까지 끝내야 합니다.",
    boundary:
      "RPO(복구 시점 목표)와 RTO(복구 시간 목표)는 사전에 정하는 업무 요구입니다. 실제 사고에서 잃은 시간과 복구에 걸린 시간은 별도의 측정값입니다. 이 글은 business impact analysis에서 dependency·failure domain을 찾고, backup copy·restore·업무 승인·release evidence를 연결하는 범위만 소유합니다.",
    firstId: "bia-rpo-rto",
    firstTitle: "먼저 업무 영향과 허용 손실을 정한 뒤 사본·주기·보관 위치를 고른다",
    firstBody: [
      "Business impact analysis(BIA)는 ‘중요 시스템’이라는 이름 대신 급여 지급 deadline, 미지급 인원, 법적·고객 영향과 upstream/downstream dependency를 기록합니다. 이 결과로 service tier와 목표 RPO·RTO를 정합니다. 목표가 10분이라고 적었더라도 마지막으로 복구 검증을 통과한 지점이 30분 전이면 실현한 RPO는 30분입니다.",
      "Snapshot, transaction log, object version, KMS key, schema와 application binary에는 같은 recovery generation을 붙입니다. 매체 수를 세는 3-2-1 표어만으로는 region·credential·operator mistake가 공유되는지 알 수 없습니다. Production account 삭제가 backup account까지 지우지 못하고, ransomware가 retention을 바꾸지 못하는 별도 failure domain과 immutability policy를 확인해야 합니다.",
      "Encryption은 backup을 안전하게 만들지만 key를 잃으면 복구를 막습니다. Backup ciphertext, wrapped data key, KMS policy와 break-glass 승인자를 함께 연습하되 key export를 기본값으로 만들지 않습니다. Restore role은 평상시 production write role과 나누고 모든 unseal·decrypt·copy를 attempt ID로 남깁니다.",
    ],
    secondId: "backup-restore",
    secondTitle: "격리 환경에서 복구하고 기술적 완료와 업무상 정상화를 따로 판정한다",
    secondBody: [
      "Restore는 깨끗한 infrastructure와 pinned runbook에서 시작합니다. Backup catalog의 hash·generation·보존 상태를 확인하고 DB base snapshot 뒤 ordered log를 적용합니다. Object·queue·search index는 authoritative source에서 재생하거나 같은 consistency point로 되돌립니다. 어느 component가 authoritative인지 모른 채 최신 timestamp만 고르면 서로 다른 세대가 섞입니다.",
      "기술 oracle은 row count, schema migration, checksum, key unwrap, queue offset와 referential integrity를 검사합니다. 업무 oracle은 고정 payroll fixture의 금액·수취인·중복 지급 0, 권한·감사 log, external reconciliation을 확인합니다. 이후 security owner와 service owner가 acceptance receipt에 서명하고, 제한된 canary traffic을 거쳐 DNS·route를 전환합니다.",
      "복구 훈련은 문서 낭독이 아니라 삭제·손상·region outage·KMS 거부를 하나씩 주입하는 paired exercise입니다. 실제 RPO/RTO, manual step, missing credential, 실패 지점과 owner를 기록하고 runbook·automation을 고칩니다. 성공한 demo 하나를 다음 분기의 복구 가능성으로 일반화하지 않습니다.",
    ],
    releaseId: "recovery-release",
    stages: [
      ["SCOPE", "업무와 dependency", "급여 deadline, DB·object·KMS·identity·외부 정산의 owner와 failure domain을 고정합니다."],
      ["PROTECT", "Versioned backup set", "Snapshot·log·object·key·binary를 generation과 digest가 있는 restore set으로 보존합니다."],
      ["RESTORE", "격리 복구", "깨끗한 환경에서 순서대로 복원하고 기술·업무 oracle을 모두 실행합니다."],
      ["ACCEPT", "Canary와 전환", "Owner 승인, 제한 traffic, monitoring과 rollback target이 있어야 정상화합니다."],
    ],
    controls: [
      ["RPO", "얼마나 과거까지 되돌아갈 수 있는가", "목표와 실제 latest recoverable point를 같은 clock으로 비교합니다."],
      ["RTO", "중단 뒤 언제 업무를 승인했는가", "Process 기동 시간이 아니라 검증과 traffic 전환까지 포함합니다."],
      ["Consistency", "서로 맞는 recovery generation", "DB·object·key·schema·binary가 같은 logical point를 가리켜야 합니다."],
      ["Acceptance", "기술 + 업무 + 보안 oracle", "Restore command 성공만으로 지급 재개를 허용하지 않습니다."],
    ],
    failures: [
      ["최근 snapshot 손상", "이전 검증 세대로 복구하고 realized RPO와 누락 transaction을 명시합니다.", "silent success 금지"],
      ["Backup KMS key 거부", "Break-glass 승인과 key recovery 절차를 검증하고 평문 우회를 금지합니다.", "decrypt receipt"],
      ["DB는 복구됐지만 object generation 불일치", "업무 oracle 실패로 traffic 전환을 중단합니다.", "consistency fail"],
      ["전환 뒤 외부 정산 상태 unknown", "Blind resend 대신 idempotency key와 provider receipt로 reconcile합니다.", "effect boundary"],
    ],
    question: "사고 시점과 복구 결과에서 실제 RPO·RTO를 어떻게 계산하는가?",
    idea:
      "복구 가능한 마지막 시점과 업무 승인을 받은 시점을 분리합니다. 목표치는 계획이고, 아래 값은 한 훈련이나 사고에서 관측한 결과입니다.",
    formula: String.raw`\begin{aligned}\mathrm{RPO}_{real}&=t_{failure}-t_{latest\ recoverable}\\\mathrm{RTO}_{real}&=t_{accepted\ service}-t_{failure}\end{aligned}`,
    annotatedFormula: String.raw`\begin{aligned}\mathrm{RPO}_{real}&=\underbrace{t_{failure}-t_{latest\ recoverable}}_{\text{Latest recoverable point 계산}}\\\mathrm{RTO}_{real}&=\underbrace{t_{accepted\ service}-t_{failure}}_{\text{Accepted service time 계산}}\end{aligned}`,
    operations: [
      { expression: String.raw`t_{failure}-t_{latest\ recoverable}`, annotation: ["Latest recoverable point이(가) 식의","결과에 기여하는 방식을 계산합니다.","복구 가능한 마지막 시점과 업무 승인을 받은 시점을","분리합니다."] },
      { expression: String.raw`t_{accepted\ service}-t_{failure}`, annotation: ["Accepted service time이(가) 식의 결과에","기여하는 방식을 계산합니다.","복구 가능한 마지막 시점과 업무 승인을 받은 시점을","분리합니다."] },
    ],
    terms: [
      { symbol: "t_{failure}", name: "Failure time", description: "서비스의 authoritative state가 손상되거나 사용할 수 없어진 시각입니다." },
      { symbol: "t_{latest\\ recoverable}", name: "Latest recoverable point", description: "무결성과 dependency consistency를 검증한 마지막 복구 시점입니다." },
      { symbol: "t_{accepted\\ service}", name: "Accepted service time", description: "기술·업무·보안 oracle과 canary를 통과해 서비스 owner가 승인한 시각입니다." },
      { symbol: String.raw`\mathrm{RPO}_{real}`, name: "Realized data loss window", description: "이번 사건에서 되돌아간 시간 범위입니다." },
      { symbol: String.raw`\mathrm{RTO}_{real}`, name: "Realized recovery duration", description: "장애부터 업무상 정상화 승인까지 걸린 시간입니다." },
    ],
    assumptions: [
      "모든 timestamp는 동기화된 clock과 명확한 timezone을 사용합니다.",
      "Latest recoverable은 파일 존재가 아니라 restore와 consistency oracle을 통과한 지점입니다.",
      "외부 결제처럼 되돌릴 수 없는 effect는 별도 receipt와 reconcile 절차가 필요합니다.",
    ],
    interpretation:
      "12:00 장애, 11:50 마지막 검증 log, 13:20 업무 승인이라면 실제 RPO는 10분, 실제 RTO는 80분입니다. 목표가 각각 5분·60분이었다면 훈련은 성공이 아니라 두 목표를 모두 놓친 결과입니다.",
    citations: [
      {
        id: "paper-nist-contingency-planning",
        title: "NIST SP 800-34 Rev. 1 · Contingency Planning Guide",
        href: "https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final",
        problem: "정보시스템 중단에 대비해 업무 영향부터 복구·시험까지 일관된 계획이 필요합니다.",
        contribution: "BIA, 예방 통제, recovery strategy, plan, testing·training·exercise와 maintenance의 순서를 제시합니다.",
        assumptions: "조직의 현재 system architecture·법적 의무·cloud responsibility와 위험평가를 별도로 반영합니다.",
        scope: "연방 정보시스템을 위한 일반 contingency-planning 지침과 생명주기입니다.",
        notClaim: "특정 RPO/RTO, backup 제품, 사본 수나 한 번의 restore 성공을 보장하지 않습니다.",
      },
      {
        id: "paper-kisa-isms-guide-backup",
        title: "KISA ISMS-P 인증기준 안내서 · 백업 및 복구",
        href: KISA_GUIDE,
        problem: "인증기준을 실제 backup·복구 절차와 점검 증적으로 연결해야 합니다.",
        contribution: "2023 안내서가 업무 연속성, 백업, 복구 절차와 훈련의 주요 확인사항과 결함 사례를 제공합니다.",
        assumptions: "2026-08-14 현재 법령·고시와 조직 scope·위험평가를 우선하고 안내서 사례는 해설로 사용합니다.",
        scope: "대한민국 ISMS-P 준비·심사를 위한 확인 지점과 증적 예입니다.",
        notClaim: "안내서 예시와 같은 제품·주기·문서 형식이 유일한 적합 방법이라는 뜻은 아닙니다.",
      },
    ],
  },
  "isms-incident-response": {
    key: "isms-incident-response",
    eyebrow: "사고 대응 · alert에서 검증된 정상화까지",
    title: "사고 대응은 경보를 닫는 일이 아니라 영향·증거·권한·복구 상태를 인계하는 과정이다",
    lead:
      "02시 10분, 급여 export API에서 평소와 다른 대량 다운로드 경보가 발생했다고 가정합니다. 경보 하나는 아직 침해사고 판정도, 차단 명령도 아닙니다. 누가 어떤 credential로 어느 데이터를 읽었는지 확인하고, 영향 확산을 막으면서도 조사에 필요한 증거를 보존한 뒤, credential·host·data flow가 다시 신뢰 가능한지 검증해야 합니다.",
    boundary:
      "Alert, event, incident와 breach는 같은 말이 아닙니다. 이 글은 탐지 신호를 severity·scope·owner가 있는 incident record로 승격하고 containment, evidence preservation, eradication, recovery acceptance와 post-incident control verification까지 연결하는 운영 경계를 소유합니다.",
    firstId: "triage-containment",
    firstTitle: "신호를 사건으로 분류하고 확산을 막되 증거와 업무 영향을 함께 보존한다",
    firstBody: [
      "Triage는 alert source, detection rule/version, asset·identity·data, 첫 관측과 마지막 정상 시각을 기록해 사실과 추정을 나눕니다. Severity는 제품이 준 숫자를 복사하지 않고 confidentiality·integrity·availability 영향, 확산 가능성, 규제·고객 영향과 time criticality를 근거로 정합니다. Incident commander, investigation, containment, communications와 business owner를 명시합니다.",
      "Containment는 무조건 host 전원을 끄는 행동이 아닙니다. Token revoke, account disable, network isolation, route deny, vulnerable feature flag off 중 evidence와 업무 영향에 맞는 수단을 고릅니다. Memory가 핵심 증거라면 승인된 capture 뒤 격리할 수 있고, active exfiltration이면 증거 수집을 기다리느라 차단을 늦추지 않습니다. 모든 조치는 actor·time·reason·target·result receipt를 남깁니다.",
      "원본 log·disk image·cloud audit record는 hash, 수집 시각, source, tool version, custodian과 접근 이력을 붙여 보존합니다. 조사용 사본과 원본을 분리하고 timezone·clock drift를 기록합니다. Chain of custody는 파일이 진실이라는 보장이 아니라 누가 어떻게 취급했는지 재현하는 기록입니다.",
    ],
    secondId: "evidence-recovery",
    secondTitle: "원인을 제거한 뒤 credential·data·service를 독립 oracle로 검증한다",
    secondBody: [
      "Eradication은 취약 binary 교체만으로 끝나지 않습니다. 최초 침입점, persistence, lateral movement, 추가 credential·token·key, 변경된 policy와 데이터 반출 범위를 확인합니다. Root cause가 아직 가설이면 그 사실을 숨기지 않고 containment를 유지한 채 조사 범위와 불확실성을 incident record에 남깁니다.",
      "Recovery acceptance는 네 조건을 모두 확인합니다. 악성 persistence와 취약 경로를 제거했다는 evidence, 노출 credential·key를 폐기했다는 identity evidence, clean build·restore와 business transaction을 통과한 service evidence, 동일 공격 신호와 재발 지표를 보는 monitoring evidence입니다. 단순히 endpoint가 200을 반환하거나 경보가 사라졌다는 이유로 사건을 종료하지 않습니다.",
      "Post-incident review는 사람을 탓하는 회고가 아니라 timeline·영향·탐지 지연·contributing condition을 근거로 control change를 만듭니다. Action에는 owner·기한·acceptance test가 있어야 하며, 완료 표시는 code/policy 변경과 negative fixture 재검증으로 확인합니다. 같은 공격을 다시 주입했을 때 더 빨리 탐지·차단·복구되는지까지 봅니다.",
    ],
    releaseId: "incident-release",
    stages: [
      ["TRIAGE", "사실·scope·severity", "Alert와 incident를 구분하고 영향 asset·identity·data와 owner를 지정합니다."],
      ["CONTAIN", "확산 억제", "업무·증거 영향을 고려해 token·network·feature 경계를 제한합니다."],
      ["ERADICATE", "원인·persistence 제거", "취약 경로와 파생 credential·artifact를 찾아 제거하고 receipt를 남깁니다."],
      ["RECOVER", "검증 후 정상화", "Identity·service·data·monitoring oracle과 canary를 통과해야 traffic을 복원합니다."],
    ],
    controls: [
      ["Signal", "관측된 사실", "Detection rule과 raw evidence를 보존하되 원인·공격자를 섣불리 단정하지 않습니다."],
      ["Decision", "Severity와 containment", "Owner, 근거, 기한과 승인된 action을 incident state에 기록합니다."],
      ["Evidence", "원본과 조사 사본", "Hash·clock·source·custody를 남기고 최소 접근으로 보관합니다."],
      ["Recovery", "Acceptance와 monitoring", "정상 응답뿐 아니라 credential·persistence·data integrity를 확인합니다."],
    ],
    failures: [
      ["오탐으로 판정했지만 같은 identity에서 exfiltration 지속", "Scope를 다시 열고 raw evidence·rule threshold·review owner를 보존합니다.", "false-negative drill"],
      ["Host 전원 차단으로 volatile evidence 손실", "위협 속도와 증거 가치에 따른 승인된 acquisition/isolation runbook을 보완합니다.", "decision receipt"],
      ["Password만 바꾸고 active token 유지", "모든 session·API key·refresh token·service secret을 lineage로 폐기합니다.", "identity closure"],
      ["복구 뒤 동일 fixture가 다시 성공", "Traffic을 되돌리고 detection·authorization·patch control을 재검증합니다.", "release reject"],
    ],
    question: "복구를 승인할 최소 조건을 어떻게 표현하는가?",
    idea:
      "원인 제거, identity 정리, 서비스 검증, 재발 monitoring은 서로 대신할 수 없으므로 모두 참일 때만 정상화합니다.",
    formula: String.raw`A=E\land I\land V\land M`,
    annotatedFormula: String.raw`A=\underbrace{E\land I\land V\land M}_{\text{판정 조건 결합}}`,
    operations: [
      { expression: String.raw`E\land I\land V\land M`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","원인 제거, identity 정리, 서비스 검증, 재발","monitoring은 서로 대신할 수 없으므로 모두 참일 때만","정상화합니다."] },
    ],
    terms: [
      { symbol: "E", name: "Eradication evidence", description: "취약 경로·persistence·malicious artifact 제거를 재현한 증거입니다." },
      { symbol: "I", name: "Identity recovery", description: "노출 계정·token·key를 폐기하고 최소 권한으로 재발급한 상태입니다." },
      { symbol: "V", name: "Service verification", description: "Clean artifact와 data integrity·업무 transaction·failure fixture를 통과한 상태입니다." },
      { symbol: "M", name: "Monitoring readiness", description: "동일·변형 공격과 재발 지표를 관측하고 owner에게 전달할 수 있는 상태입니다." },
      { symbol: "A", name: "Recovery acceptance", description: "제한 traffic 또는 정상 운영으로 복귀할 수 있다는 승인입니다." },
    ],
    assumptions: [
      "각 조건은 같은 incident ID, asset generation, policy·binary version과 evidence digest에 묶입니다.",
      "Unknown 또는 missing evidence를 pass로 취급하지 않습니다.",
      "Business owner의 정상화 승인과 법무·규제·고객 통지는 별도 의사결정으로 기록합니다.",
    ],
    interpretation:
      "취약 binary를 교체해 E=1이어도 active refresh token이 남아 I=0이면 A=0입니다. Service health와 monitoring이 정상이더라도 credential 정리가 끝날 때까지 제한 상태를 유지합니다.",
    citations: [
      {
        id: "paper-nist-incident-response",
        title: "NIST SP 800-61 Rev. 3 · Incident Response Recommendations",
        href: "https://csrc.nist.gov/pubs/sp/800/61/r3/final",
        problem: "사고 대응을 별도 팀의 일회성 절차가 아니라 조직 위험관리 전체에 통합해야 합니다.",
        contribution: "2025 최종판이 CSF 2.0의 Govern·Identify·Protect·Detect·Respond·Recover 전반에 incident response를 연결합니다.",
        assumptions: "조직의 법적 통지, sector playbook, service architecture와 threat intelligence를 별도로 적용합니다.",
        scope: "Cybersecurity incident response program과 lifecycle의 현재 NIST 권고입니다.",
        notClaim: "모든 사건의 고정 severity, containment 순서, forensic tool이나 종료 시간을 정하지 않습니다.",
      },
      {
        id: "paper-kisa-isms-guide-incident",
        title: "KISA ISMS-P 인증기준 안내서 · 사고 예방 및 대응",
        href: KISA_GUIDE,
        problem: "침해사고 절차가 연락망 문서에 머물지 않고 탐지·보고·복구·재발방지 증거로 이어져야 합니다.",
        contribution: "사고 예방·대응 체계, 보고·조사, 복구와 재발방지의 주요 확인사항을 제공합니다.",
        assumptions: "안내서 이후의 법령·고시와 조직 incident classification·통지 의무를 2026-08-14 기준으로 다시 확인합니다.",
        scope: "대한민국 ISMS-P 인증 준비와 심사 evidence의 해설입니다.",
        notClaim: "안내서가 법적 breach 판정, 형사 attribution이나 특정 대응 도구를 대신하지 않습니다.",
      },
    ],
  },
  "isms-dev-security": {
    key: "isms-dev-security",
    eyebrow: "Secure SDLC · source에서 production artifact까지",
    title: "개발 보안은 scanner 개수를 늘리는 일이 아니라 위험한 변경이 배포되지 않게 만드는 과정이다",
    lead:
      "급여 API의 권한 누락을 고치는 pull request 하나를 따라갑니다. Threat scenario와 acceptance criterion을 먼저 쓰고, 최소 code change를 review한 뒤 unit·integration·authorization negative test, SAST·dependency·secret scan과 DAST를 위험에 맞게 배치합니다. 최종적으로 같은 source와 dependency에서 만든 artifact만 staging·canary·production으로 승격해야 합니다.",
    boundary:
      "SAST, DAST, SCA, SBOM, code review는 업계 표준 용어이므로 유지하되 역할을 구분합니다. 이 글은 요구사항→source change→verification→artifact provenance→배포·rollback receipt를 연결합니다. Scanner 통과를 application authorization이나 runtime exploit 불가능성으로 확대하지 않습니다.",
    firstId: "secure-development",
    firstTitle: "Threat scenario를 test 가능한 요구사항으로 바꾸고 검사마다 찾을 수 있는 결함을 분리한다",
    firstBody: [
      "‘보안을 강화한다’ 대신 ‘일반 직원 token으로 다른 직원의 급여를 조회하면 403이고 data·audit effect가 없어야 한다’처럼 actor, asset, precondition, forbidden effect와 oracle을 씁니다. Design review에서는 trust boundary, data flow, abuse case와 authorization owner를 확인하고, code review에서는 변경된 control flow와 error path를 봅니다.",
      "SAST는 source·intermediate representation에서 위험 pattern과 data flow를 찾고, DAST는 실행 중인 endpoint에 입력을 보내 관측 가능한 동작을 봅니다. SCA는 dependency identity·version·known advisory와 license를, secret scan은 credential pattern을 다룹니다. 서로 다른 signal이므로 결과를 한 숫자로 합치지 않고 finding별 reproduction, reachability, exploit precondition과 owner를 기록합니다.",
      "False positive를 지우는 대신 exception에 rule/version, code location, 근거, reviewer, 만료와 재검 조건을 남깁니다. 발견했지만 즉시 고치지 못한 risk는 severity·asset exposure·compensating control·기한과 승인자를 가집니다. Production authorization은 scanner가 아니라 runtime identity·policy enforcement가 계속 소유합니다.",
    ],
    secondId: "build-deploy-gate",
    secondTitle: "Build provenance와 동일 artifact 승격으로 검사한 것과 배포한 것을 일치시킨다",
    secondBody: [
      "Build는 source commit, lockfile, build image, toolchain, test·scan receipt에서 immutable artifact digest와 SBOM을 만듭니다. Staging에서 다시 빌드한 뒤 production에서 또 빌드하면 검증 대상이 달라집니다. 같은 digest를 environment-specific configuration과 secret으로 실행하고 deploy principal의 권한을 source author와 분리합니다.",
      "Gate는 test, security review, provenance와 canary health를 모두 요구합니다. 심각도 하나만 보지 않고 exploit reachability, internet exposure, data class, compensating control과 fix availability를 함께 판단합니다. Emergency change도 승인·scope·짧은 만료·사후 review와 rollback target을 생략하지 않습니다.",
      "Release 뒤 authorization negative fixture, error rate, latency, security signal과 business invariant를 canary에서 비교합니다. Rollback은 이전 binary만 가리키지 않고 compatible schema/config/feature flag와 credential generation을 포함합니다. 이미 외부에 보낸 notification·payment는 되돌릴 수 없으므로 idempotency receipt로 reconcile합니다.",
    ],
    releaseId: "change-release",
    stages: [
      ["DESIGN", "Threat와 acceptance", "Actor·asset·forbidden effect를 고정하고 test oracle을 먼저 만듭니다."],
      ["VERIFY", "Review와 layered checks", "Deterministic test를 먼저 두고 SAST·SCA·DAST signal을 재현합니다."],
      ["BUILD", "Immutable provenance", "Source·dependency·toolchain에서 digest·SBOM·receipt가 있는 artifact를 만듭니다."],
      ["RELEASE", "Canary와 rollback", "같은 artifact를 제한 배포해 security·service oracle을 통과한 뒤 승격합니다."],
    ],
    controls: [
      ["Code review", "변경 의도와 trust boundary", "자동 scanner가 모르는 업무 권한과 failure path를 검토합니다."],
      ["SAST·SCA·secret", "Source·dependency signal", "Finding은 reproduction·reachability·rule version과 함께 triage합니다."],
      ["DAST·integration", "실행 동작", "Pinned environment와 account fixture에서 forbidden effect 0을 검사합니다."],
      ["Provenance", "검사한 artifact의 identity", "Source·builder·SBOM·signature·digest를 deploy receipt에 묶습니다."],
    ],
    failures: [
      ["SAST pass지만 IDOR negative test 실패", "업무 authorization defect로 release를 중단합니다.", "scanner boundary"],
      ["SBOM은 같지만 artifact digest가 다름", "재현 원인과 builder provenance를 확인할 때까지 승격하지 않습니다.", "identity mismatch"],
      ["Emergency 배포 뒤 schema rollback 불가", "Expand/contract migration과 compatible rollback target을 사전에 검증합니다.", "rollback drill"],
      ["Canary health는 정상이나 403 fixture가 200", "Traffic을 되돌리고 auth policy·cache·version binding을 조사합니다.", "security oracle"],
    ],
    question: "변경을 production으로 승격할 최소 gate를 어떻게 표현하는가?",
    idea:
      "기능 test, security verification, artifact provenance, canary가 서로 다른 실패를 막으므로 모두 통과해야 합니다.",
    formula: String.raw`A=T\land S\land P\land C`,
    annotatedFormula: String.raw`A=\underbrace{T\land S\land P\land C}_{\text{판정 조건 결합}}`,
    operations: [
      { expression: String.raw`T\land S\land P\land C`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","기능 test, security verification,","artifact provenance, canary가 서로 다른","실패를 막으므로 모두 통과해야 합니다."] },
    ],
    terms: [
      { symbol: "T", name: "Deterministic tests", description: "기능·회귀·authorization negative fixture가 기대 결과와 일치하는 조건입니다." },
      { symbol: "S", name: "Security verification", description: "위험에 맞는 review·SAST·SCA·DAST finding이 승인 정책을 통과한 조건입니다." },
      { symbol: "P", name: "Artifact provenance", description: "Source·dependency·builder·SBOM·signature·digest가 배포 artifact와 결속된 조건입니다." },
      { symbol: "C", name: "Canary acceptance", description: "제한 traffic에서 service·security·business invariant를 통과한 조건입니다." },
      { symbol: "A", name: "Promotion decision", description: "다음 environment 또는 production으로 승격할 수 있다는 판단입니다." },
    ],
    assumptions: [
      "각 결과는 같은 commit·artifact digest·policy와 test corpus에 속합니다.",
      "Waiver는 owner·근거·scope·만료·compensating control을 가지고 자동 만료됩니다.",
      "Pass는 알려진 검사 범위 안의 결과이며 결함이 전혀 없다는 증명이 아닙니다.",
    ],
    interpretation:
      "Test·scan·provenance가 모두 통과해도 canary에서 일반 직원이 다른 직원 급여를 읽으면 C=0이므로 A=0입니다. 오류율이 낮다는 사실은 authorization oracle을 대신하지 않습니다.",
    citations: [
      {
        id: "paper-nist-ssdf",
        title: "NIST SP 800-218 · Secure Software Development Framework 1.1",
        href: "https://csrc.nist.gov/pubs/sp/800/218/final",
        problem: "Software 개발 생명주기 전반에 재현 가능한 보안 practice를 통합해야 합니다.",
        contribution: "Prepare, Protect, Produce, Respond 범주로 secure-development outcome과 task를 정리합니다.",
        assumptions: "2022 final v1.1을 기준으로 사용하며 조직 기술 stack·threat·계약 요구에 맞게 구현을 정합니다.",
        scope: "Technology-neutral secure software development practice의 공통 결과입니다.",
        notClaim: "특정 scanner·CI 제품, 취약점 0, supply-chain integrity나 규제 준수를 자동 보장하지 않습니다.",
      },
      {
        id: "paper-owasp-asvs",
        title: "OWASP Application Security Verification Standard",
        href: "https://owasp.org/www-project-application-security-verification-standard/",
        problem: "Application security 요구와 verification 결과를 일관된 항목으로 정의해야 합니다.",
        contribution: "Architecture, authentication, access control, validation, cryptography 등 test 가능한 verification requirement를 제공합니다.",
        assumptions: "사용한 ASVS release와 level, 제외 항목·제품 context를 기록합니다.",
        scope: "Web application의 기술 보안 요구사항과 검증 기준입니다.",
        notClaim: "Checklist 완료가 business logic 안전성, 운영 설정, host·network 보안 전체를 인증하지 않습니다.",
      },
      {
        id: "paper-kisa-isms-guide-dev",
        title: "KISA ISMS-P 인증기준 안내서 · 개발 및 변경관리",
        href: KISA_GUIDE,
        problem: "개발·변경 절차와 실제 배포 evidence를 인증 통제에 연결해야 합니다.",
        contribution: "보안 요구사항, 구현·시험, 변경관리와 운영 이관의 주요 확인사항을 제공합니다.",
        assumptions: "현행 법령·고시, 조직 SDLC와 외주·cloud 책임을 별도로 적용합니다.",
        scope: "ISMS-P 심사의 개발보안·변경관리 확인 지점입니다.",
        notClaim: "특정 개발방법론이나 모든 변경에 같은 도구·승인 단계를 강제하지 않습니다.",
      },
    ],
  },
  "isms-security-infra": {
    key: "isms-security-infra",
    eyebrow: "보안 인프라 · zone에서 enforcement와 evidence까지",
    title: "Firewall·WAF·IDS·IPS·VPN·SIEM은 한 제품군이 아니라 서로 다른 결정을 맡는다",
    lead:
      "인터넷의 급여 조회 요청이 WAF를 지나 application zone에 도착하고 DB zone으로 이어지는 한 흐름을 따라갑니다. Firewall은 어느 network flow가 통과할 수 있는지, WAF는 HTTP request의 일부 공격 pattern을, IDS는 관측 신호를, IPS는 배치된 경계에서 차단을, VPN은 remote peer와 tunnel을, SIEM은 여러 telemetry의 상관·조사를 맡습니다. 어느 하나도 application authorization을 대신하지 않습니다.",
    boundary:
      "이 글은 asset·zone·flow·identity에서 enforcement point와 telemetry owner를 배치하고 rule·sensor·log generation을 운영하는 범위를 소유합니다. 제품 이름이나 ‘탐지율 100%’ 대신 허용 flow, 차단 action, 관측 evidence와 failure mode를 같은 trace에서 검증합니다.",
    firstId: "zone-flow-policy",
    firstTitle: "자산 목록보다 먼저 source·destination·service·identity가 있는 허용 flow를 그린다",
    firstBody: [
      "Zone은 신뢰 수준을 자동 부여하는 색깔이 아니라 policy를 적용할 관리 단위입니다. Payroll web→API 443, API service identity→DB 5432처럼 source, destination, protocol/service, identity, purpose, owner와 expiry를 기록합니다. ‘내부망 전체 허용’은 lateral movement의 blast radius를 키우므로 필요한 flow만 명시하고 default deny 결과를 관측합니다.",
      "Firewall은 L3/L4 또는 application-aware flow를 허용·거부하지만, port 443 통과가 사용자 권한을 증명하지는 않습니다. WAF는 HTTP parsing과 rule set 범위에서 payload를 검사하므로 business authorization·parameterized query·output encoding을 대신할 수 없습니다. VPN 성공은 authenticated tunnel과 network reachability를 만들 뿐 app role을 부여하지 않습니다.",
      "Rule lifecycle에는 request/ticket, purpose, source/destination object, service, owner, reviewer, policy revision, deploy target, expiry와 hit evidence가 필요합니다. Shadowed·duplicate·unused rule은 단순 정리 대상이 아니라 제거 전 dependency와 rollback을 검증해야 합니다. Emergency rule은 짧은 만료와 사후 review가 없는 영구 우회가 되지 않게 합니다.",
    ],
    secondId: "detect-enforce-observe",
    secondTitle: "탐지 신호, 차단 결과, 조사 evidence를 같은 의미로 합치지 않는다",
    secondBody: [
      "IDS는 packet·flow·host telemetry에서 signature·anomaly signal을 내고, IPS는 inline 위치에서 drop·reset·rate limit 같은 action을 실행할 수 있습니다. Alert가 incident라는 뜻도, IPS action이 공격 전체를 막았다는 뜻도 아닙니다. Sensor coverage, encrypted traffic visibility, bypass·fail-open/fail-closed mode, false positive와 packet loss를 기록합니다.",
      "SIEM은 firewall·WAF·IDS/IPS·VPN·identity·application log를 common identity, asset, request/session ID와 clock으로 연결합니다. Log 수집 성공과 detection rule 동작을 분리하고, parsing failure·late arrival·duplicate·retention·access control을 관측합니다. Dashboard 숫자보다 raw event에서 alert, case, response action까지 provenance를 재생할 수 있어야 합니다.",
      "Release test는 허용 payroll fixture, 금지 zone flow, application authorization 실패, known attack corpus, sensor 중단과 log pipeline backlog를 각각 주입합니다. 정상 flow가 유지되고 forbidden network effect가 0이며, alert/action/receipt가 올바른 owner에 도착하는지 확인합니다. 정책 후보는 같은 packet/request trace에서 base와 paired 비교하고 이전 generation으로 rollback합니다.",
    ],
    releaseId: "infra-release",
    stages: [
      ["MODEL", "Asset·zone·flow", "업무 request와 identity가 지나는 source·destination·service·owner를 고정합니다."],
      ["ENFORCE", "Firewall·WAF·IPS", "각 경계가 허용·거부·차단하는 조건과 fail mode를 명시합니다."],
      ["OBSERVE", "IDS·logs·SIEM", "Signal·raw event·case를 time·identity·asset·request ID로 연결합니다."],
      ["VERIFY", "Paired traffic gate", "허용·금지·attack·sensor-failure fixture와 rollback을 같은 generation에서 검사합니다."],
    ],
    controls: [
      ["Firewall", "Network reachability", "Source·destination·service flow를 제한하지만 사용자 업무 권한은 판단하지 않습니다."],
      ["WAF", "HTTP inspection", "Parsing 가능한 request의 rule signal이며 secure coding을 대체하지 않습니다."],
      ["IDS / IPS", "Detect / inline action", "Signal과 실제 drop·reset 결과, bypass와 packet loss를 나눠 기록합니다."],
      ["SIEM", "Correlation과 case evidence", "여러 log를 연결하지만 원본 누락·잘못된 clock·rule 부재를 자동 해결하지 않습니다."],
    ],
    failures: [
      ["Firewall allow지만 app role 불충분", "Application에서 403, DB query·data effect 0을 확인합니다.", "auth boundary"],
      ["IDS alert지만 IPS bypass path 사용", "실제 packet path·enforcement receipt를 확인하고 coverage gap을 표시합니다.", "signal ≠ block"],
      ["SIEM collector backlog로 40분 지연", "Detection latency·queue depth·data loss와 on-call delivery를 별도 측정합니다.", "timeliness"],
      ["새 WAF rule이 정상 급여 업로드 차단", "Canary에서 false positive를 재현하고 base policy로 rollback합니다.", "paired release"],
    ],
    question: "급여 API flow를 허용할 최소 network-policy 조건을 어떻게 나타내는가?",
    idea:
      "Zone membership, 명시된 flow, 접속 identity, 현재 policy generation이 모두 맞아야 enforcement point가 허용합니다. 그 뒤 application authorization은 다시 검사합니다.",
    formula: String.raw`A_{net}=Z\land F\land I\land P`,
    annotatedFormula: String.raw`A_{net}=\underbrace{Z\land F\land I\land P}_{\text{판정 조건 결합}}`,
    operations: [
      { expression: String.raw`Z\land F\land I\land P`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","Zone membership, 명시된 flow, 접속","identity, 현재 policy generation이 모두","맞아야 enforcement point가 허용합니다."] },
    ],
    terms: [
      { symbol: "Z", name: "Zone placement", description: "Source·destination asset이 inventory와 현재 zone에 정확히 매핑된 조건입니다." },
      { symbol: "F", name: "Flow match", description: "Protocol·port·direction·destination이 승인된 업무 flow와 일치하는 조건입니다." },
      { symbol: "I", name: "Connection identity", description: "가능한 경계에서 workload·user·device identity가 기대 대상과 일치하는 조건입니다." },
      { symbol: "P", name: "Policy generation", description: "승인·만료·배포 target이 있는 현재 rule revision을 적용한 조건입니다." },
      { symbol: "A_{net}", name: "Network allow", description: "해당 enforcement point가 flow를 통과시키는 local 결정입니다." },
    ],
    assumptions: [
      "NAT·proxy·load balancer 뒤의 실제 source identity와 IPv4/IPv6 path를 inventory에 반영합니다.",
      "Unknown asset·expired rule·policy mismatch는 default deny 또는 명시적 review 상태로 처리합니다.",
      "Network allow는 application authentication·authorization, data validity나 transaction commit를 보장하지 않습니다.",
    ],
    interpretation:
      "API가 올바른 zone·service와 policy를 사용해도 stolen device identity라 I=0이면 network allow는 0입니다. 네 조건이 모두 1이어도 사용자가 다른 직원 급여를 볼 권한이 있는지는 application이 별도로 판단합니다.",
    citations: [
      {
        id: "paper-nist-firewall-policy",
        title: "NIST SP 800-41 Rev. 1 · Guidelines on Firewalls and Firewall Policy",
        href: "https://csrc.nist.gov/pubs/sp/800/41/r1/final",
        problem: "Firewall 배치와 rule을 조직 network policy에 일관되게 연결해야 합니다.",
        contribution: "Firewall technology, policy, planning·implementation·management와 test의 공통 지침을 제공합니다.",
        assumptions: "2009 문서의 제품 예시는 역사적일 수 있으므로 현재 cloud·IPv6·zero-trust architecture와 함께 적용합니다.",
        scope: "Firewall policy와 운영 생명주기의 일반 원칙입니다.",
        notClaim: "Firewall이 application authorization, endpoint security, encrypted payload inspection이나 침해 방지를 보장하지 않습니다.",
      },
      {
        id: "paper-nist-log-management",
        title: "NIST SP 800-92 · Guide to Computer Security Log Management",
        href: "https://csrc.nist.gov/pubs/sp/800/92/final",
        problem: "여러 source의 security log를 수집·보관·분석하는 책임과 절차가 필요합니다.",
        contribution: "Log-management infrastructure와 policy, operational process의 기준을 제공합니다.",
        assumptions: "2006 지침을 현재 cloud telemetry·privacy·retention·detection engineering에 맞게 보완합니다.",
        scope: "Security log management program의 일반 설계·운영 원칙입니다.",
        notClaim: "Log 수집 자체가 incident 탐지, 무결한 원본, 정확한 clock이나 법적 증거 능력을 자동 보장하지 않습니다.",
      },
      {
        id: "paper-kisa-isms-guide-infra",
        title: "KISA ISMS-P 인증기준 안내서 · 네트워크 및 보안시스템",
        href: KISA_GUIDE,
        problem: "Network·보안시스템 통제를 실제 rule·운영·점검 evidence로 보여 줘야 합니다.",
        contribution: "네트워크 접근, 정보시스템 보호, 보안시스템 운영과 log 점검의 주요 확인사항을 제공합니다.",
        assumptions: "2026-08-14의 법령·고시와 조직 architecture·수탁/cloud 책임을 우선합니다.",
        scope: "대한민국 ISMS-P 준비·심사의 통제 확인 지점입니다.",
        notClaim: "특정 UTM·WAF·SIEM 제품 구매나 동일한 network topology를 요구하지 않습니다.",
      },
    ],
  },
};

function FlowViz({ config }: { config: Config }) {
  return (
    <figure
      data-viz={`${config.key}-topdown`}
      data-viz-canvas
      className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <figcaption className="border-b border-border/70 px-4 py-4 sm:px-5">
        <p className="text-sm font-semibold">한 요청을 네 단계의 owner와 receipt로 추적합니다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          화살표 모양보다 입력·결정·실패 결과의 경계가 중요합니다.
        </p>
      </figcaption>
      <div className="grid gap-px bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
        {config.stages.map(([tag, title, body], index) => (
          <div key={tag} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[11px] font-bold tracking-[.1em] text-muted-foreground">{tag}</span>
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

export default function IsmsOperationsArticle({ article }: { article: ArticleKey }) {
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
        <header>
          <p className="text-sm font-semibold text-primary">01 · 기준과 경계</p>
          <h2 className="mt-2 text-2xl font-bold">{config.firstTitle}</h2>
        </header>
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
        <header>
          <p className="text-sm font-semibold text-primary">02 · 실행과 계산</p>
          <h2 className="mt-2 text-2xl font-bold">{config.secondTitle}</h2>
        </header>
        {config.secondBody.map((paragraph) => <p key={paragraph} className="leading-7">{paragraph}</p>)}
        <ExplainedFormula
          question={config.question}
          idea={config.idea}
          formula={config.formula}
          annotatedFormula={config.annotatedFormula}
          operations={config.operations}
          terms={config.terms}
          assumptions={config.assumptions}
          interpretation={config.interpretation}
        />
        {config.citations.map((item, index) => <Evidence key={item.id} item={item} index={index} />)}
      </section>

      <section id={config.releaseId} className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 실패 주입과 release gate</p>
          <h2 className="mt-2 text-2xl font-bold">정상 demo가 아니라 실패했을 때 권한·effect·evidence가 남는지 확인한다</h2>
        </header>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] gap-3 bg-muted/40 px-4 py-3 text-xs font-semibold">
            <span>실패 주입</span><span>기대 결과</span>
          </div>
          {config.failures.map(([fault, oracle, receipt]) => (
            <div key={fault} className="grid grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] gap-3 border-t border-border px-4 py-3 text-sm">
              <span className="font-medium">{fault}</span>
              <span className="min-w-0 break-words text-muted-foreground">{oracle} <strong className="text-foreground">[{receipt}]</strong></span>
            </div>
          ))}
        </div>
        <p className="leading-7">
          Base와 candidate는 같은 업무 fixture, clock, account·network·data snapshot과 external stub에서 비교합니다.
          허용되지 않은 effect는 0이어야 하며, reason code·attempt ID·artifact·policy generation·owner와 recovery time을
          함께 기록합니다. 실패하면 이전 binary·policy·configuration으로 rollback하고 이미 발생한 외부 effect는
          idempotency key와 provider receipt로 reconcile합니다.
        </p>
        <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3>
        <p className="leading-7">
          기초 6문제는 용어·owner·수치 계산과 정상 흐름을 확인하고, 심화 4문제는 failure injection, paired release,
          rollback과 evidence receipt를 설계하게 합니다. 필요한 전제와 반례는 위 각 절에 모두 제시했습니다.
        </p>
      </section>
    </article>
  );
}
