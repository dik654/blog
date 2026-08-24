import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import IsmsFoundationsViz from "./isms-foundations-viz";

const KISA_GUIDE = "https://www.isms-p.or.kr/ntcn/rcsrm/selectGnrlRcsrmList.do";
const VASP_REPORTING = "https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lspttninfSeq=167095";
const SAFE_MEASURES = "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281400&chrClsCd=010201";

export default function IsmsPracticalGuide() {
  return (
    <div className="space-y-12">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">VASP ISMS 준비는 결함 목록이 아니라 하나의 서비스 trace로 시작합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            “비밀번호를 bcrypt로 바꿨다”거나 “DB 접근제어 솔루션을 샀다”는 사실만으로는
            통제가 작동했다고 설명할 수 없습니다. 가상자산사업자(VASP)의 한 출금 요청을
            따라가며 고객 인증, API·관리자 권한, 원장 DB, hot/cold wallet 승인, 이상거래
            탐지, 배포와 incident response가 같은 인증범위에서 어떻게 연결되는지 먼저
            그려야 합니다.
          </p>
          <p>
            이 글은 특정 심사에서 실제로 받은 결함을 보편 규칙처럼 나열하지 않습니다.
            대신 요구사항을 <strong>설계 → 구현 → 운영 → 검토 증거</strong>로 변환하고,
            gap을 원인과 영향 범위까지 보완하는 재현 가능한 방법을 다룹니다. 관할은
            대한민국이며 법령·고시 상태는 2026-08-14에 확인했습니다.
          </p>
        </div>

        <ContentBoundary article="isms-practical-guide" />
        <IsmsFoundationsViz mode="evidence-chain" />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>먼저 scope와 control owner를 고정합니다</h3>
          <p>
            VASP 신고 서류에는 정보보호 관리체계 인증 자료가 포함됩니다. 그렇다고 모든
            조직이 같은 범위와 구조를 가져야 한다는 뜻은 아닙니다. 거래·보관·이전 중 실제
            제공 업무, 고객과 관리자 접점, wallet key와 승인자, cloud·IDC·수탁자,
            개발·운영 조직을 data flow로 연결하고 각 control의 책임자와 대체자를 정합니다.
            인증 특례 대상에서는 VASP가 제외된다는 현행 시행령도 별도로 확인해야 합니다.
          </p>
        </div>

        <div id="paper-vasp-reporting" className="scroll-mt-24">
          <CitationBlock citeKey={1} source="특정금융정보법 시행령 제10조의11 · VASP 신고" href={VASP_REPORTING}>
            문제: VASP가 FIU 신고 시 어떤 자료를 제출해야 하는지 정합니다. 기여: 2026-01-02 시행 조문은 정보보호 관리체계 인증 자료를 신고 첨부서류로 둡니다. 전제: 대한민국에서 특정금융정보법상 VASP 신고를 하려는 자에게 적용하며 사업 모델과 신고 유형을 별도로 확인합니다. 근거 범위: 신고 서류의 법적 요구입니다. 비주장: ISMS 인증 하나가 AML·고객자산 보호·서비스 품질 전체를 충족하거나 신고 수리를 보장하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-isms-practice-guide" className="scroll-mt-24">
          <CitationBlock citeKey={2} source="KISA ISMS-P 인증기준 안내서 · 2023.11" href={KISA_GUIDE}>
            문제: 인증기준을 일상 운영과 심사 가능한 증적으로 바꿔야 합니다. 기여: 항목별 주요 확인사항·결함사례·증적 예를 제공해 gap analysis의 공통 출발점을 만듭니다. 전제: 2023.11 해설 자료이므로 2026-08-14 시행 법령과 조직의 실제 위험평가를 우선합니다. 근거 범위: 준비·심사 해설입니다. 비주장: 예시와 동일한 제품·주기·문서 형식을 사용해야만 적합하다는 의미가 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="crypto-auth" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">암호화와 인증은 알고리즘 이름보다 key·parameter·migration 경로를 심사합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            사용자 비밀번호는 복호화 가능한 암호문이 아니라 salt와 cost가 있는 password
            hashing scheme으로 저장해야 합니다. bcrypt·scrypt·Argon2id 중 이름만 고르는
            것으로 끝나지 않고, production hardware에서 login latency와 공격 비용을 함께
            재어 work factor를 정하고 algorithm·parameter·salt·version을 record에 남깁니다.
            오래된 hash는 로그인 성공 시 rehash하거나 강제 재설정하는 migration 상태로
            추적하며, 원문 비밀번호를 log나 analytics에 남기지 않습니다.
          </p>
          <p>
            데이터 암호화는 data key와 key-encryption key, 생성·보관·사용·rotation·폐기
            owner를 나눕니다. 애플리케이션 환경변수에 key를 넣었다는 사실만으로 key
            management가 되지 않으며, backup·replica·log·export까지 plaintext가 흐르는
            경로를 확인해야 합니다. 고객과 관리자 인증은 위험도가 다르므로 고위험 관리자·
            wallet 승인에는 phishing-resistant MFA를 우선 검토하고, recovery가 MFA보다
            약한 우회 경로가 되지 않게 같은 assurance로 설계합니다.
          </p>
        </div>
      </section>

      <section id="access-db" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">DB 접근은 개인 계정·승인 session·query 결과를 한 trace로 묶습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            운영자가 DB에 직접 접속해야 한다면 개인 identity로 bastion 또는 DB access
            gateway에 인증하고, ticket의 목적·대상 DB·role·시간창을 승인받은 뒤 짧은
            credential을 발급받습니다. 애플리케이션 service account와 사람 계정을 분리하고,
            read·write·DDL·grant 권한을 업무 역할에 맞춰 나눕니다. shared root 계정을 피할 수
            없는 legacy 구간은 password vault checkout, 단일 session, command logging,
            즉시 rotation과 종료 계획을 보상통제로 둡니다.
          </p>
          <p>
            감사 log에는 actor, 승인 ticket, source, session ID, query 또는 행위 유형,
            대상, 결과, timestamp, policy revision을 연결합니다. SQL 전문에 개인정보가
            포함될 수 있으므로 무조건 장기 보관하는 대신 masking·접근권한·무결성·보관기간을
            함께 설계합니다. “접근제어 제품 도입”이 아니라 우회 port와 cloud console,
            replica·backup에도 같은 경계가 적용되는지 test해야 합니다.
          </p>
        </div>
      </section>

      <section id="webapp-security" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">웹 보안은 scanner 결과가 code-to-production 경로를 실제로 바꾸는지 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            보안 요구사항을 threat scenario와 acceptance criterion으로 작성하고 code review,
            dependency·secret scan, SAST·DAST, penetration test 중 위험에 맞는 검사를 CI/CD
            gate에 배치합니다. finding에는 asset·version·severity 근거·owner·기한·exception
            승인과 retest 결과가 있어야 하며, “false positive” 판단도 재현 가능한 입력과
            검토자를 남깁니다.
          </p>
          <p>
            WAF는 입력 검증과 authorization bug를 대신하지 않습니다. SQL injection은
            parameterized query와 최소 DB role에서, XSS는 context-aware output encoding과
            CSP에서, secret 노출은 build artifact와 runtime secret injection 경로에서 각각
            줄입니다. 배포 후에는 version·change ticket·approval·test receipt와 rollback
            target을 연결해 어떤 수정이 어느 production instance에 반영됐는지 확인합니다.
          </p>
        </div>
      </section>

      <section id="wallet-ops" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Wallet 운영은 key를 누가 어떤 조건에서 사용했는지까지 통제합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Hot·warm·cold라는 이름만으로 보안 수준이 정해지지 않습니다. 각 wallet의 network
            reachability, key storage와 export 가능성, signer quorum, transaction policy,
            일·건별 한도, address allowlist, emergency halt와 복구 절차를 문서와 실제 signer
            configuration에서 대조합니다. 생성 ceremony, backup, shard·device 보관, rotation,
            파기에는 서로 다른 담당자와 증인이 필요합니다.
          </p>
          <p>
            출금 trace는 request ID에서 customer authentication, risk/FDS decision, 승인자,
            unsigned transaction digest, signer attestation, broadcast hash, chain confirmation과
            회계 원장 반영까지 이어집니다. 서로 다른 단계의 hash·amount·network가 달라지면
            중단해야 하며, emergency 권한은 짧은 만료와 사후 검토가 있는 break-glass
            절차로만 사용합니다. 이는 ISMS 통제와 AML/FDS 판단을 연결하지만 두 제도를 같은
            것으로 합치지는 않습니다.
          </p>
        </div>
      </section>

      <section id="audit-evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">증적은 캡처 파일이 아니라 모집단에서 결론까지 재현하는 record입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            심사기간의 퇴직자 계정 회수를 확인한다고 가정해 보겠습니다. HR 퇴직자 모집단과
            IAM·VPN·cloud·DB 계정 목록을 같은 identifier와 cutoff time으로 join하고, 미매칭과
            SLA 초과를 예외 목록으로 만듭니다. 그중 표본을 골라 승인·disable·token revocation·
            login deny를 확인한 뒤 전체 모집단 coverage와 남은 예외를 함께 보고해야 합니다.
          </p>
        </div>

        <ExplainedFormula
          question="요구한 통제 모집단 중 재현 가능한 검토 증거가 있는 비율을 어떻게 표시할까?"
          idea="분자는 정책과 일치하는 증거 chain이 끝까지 연결된 항목 수, 분모는 같은 기간·범위의 전체 모집단 수로 둡니다. 비율과 함께 미매칭 건수·예외 사유를 공개해야 높은 숫자가 누락을 숨기지 않습니다."
          formula={String.raw`C=\frac{N_{\mathrm{verified}}}{N_{\mathrm{population}}}\times100\%`}
          annotatedFormula={String.raw`C=\underbrace{\frac{N_{\mathrm{verified}}}{N_{\mathrm{population}}}\times100\%}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\frac{N_{\mathrm{verified}}}{N_{\mathrm{population}}}\times100\%`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","분자는 정책과 일치하는 증거 chain이 끝까지 연결된 항목","수, 분모는 같은 기간·범위의 전체 모집단 수로 둡니다."] },
          ]}
          terms={[
            { symbol: "N_{\\mathrm{population}}", name: "검토 모집단", description: "예를 들어 심사기간 퇴직자 52명처럼 source와 cutoff가 고정된 전체 대상입니다." },
            { symbol: "N_{\\mathrm{verified}}", name: "검증 완료 건", description: "계정 회수·token 폐기·SLA·실패 test까지 정해진 checklist를 통과한 대상입니다." },
            { symbol: "C", name: "Evidence coverage", description: "모집단 가운데 완전한 증거 chain을 가진 비율입니다." },
          ]}
          assumptions={[
            "분모 source·기간·scope가 고정돼야 하며 발견하기 쉬운 계정만 분모에 넣지 않습니다.",
            "Coverage 100%는 통제 효과의 완전한 보장이 아니므로 표본 내용과 exception severity를 별도로 검토합니다.",
          ]}
          interpretation="퇴직자 52명 중 50명은 모든 하위 시스템 회수가 확인됐고 2명은 cloud API key가 남아 있다면 C=96.2%입니다. 이를 반올림해 100%라고 보고하지 않고 두 예외의 차단·원인·전수 재검증까지 추적합니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            화면 촬영이 금지된 IDC처럼 원본 반출이 어려우면 심사 편의를 이유로 정책을
            우회하지 않습니다. read-only 현장 조회, 승인된 export, hash와 timestamp가 있는
            report, 심사원 동석 확인처럼 보안정책 안에서 재현 가능한 방식을 사전에 합의합니다.
            Evidence package에는 source URI, query·filter, 추출 시각, tool version, checksum,
            작성자·검토자, redaction 이유와 보관기간을 붙입니다.
          </p>
          <p>
            개인정보 처리시스템의 권한 부여·변경·말소 기록은 현행 안전성 확보조치 기준상
            최소 3년 보관 대상입니다. 모든 ISMS 증적이 일률적으로 3년이라는 뜻은 아니므로
            개별 법령·인증기준·업무 필요와 위험을 기준으로 record type별 보관표를 정해야 합니다.
          </p>
        </div>

        <div id="paper-personal-data-safeguards" className="scroll-mt-24">
          <CitationBlock citeKey={3} source="개인정보의 안전성 확보조치 기준 · 제2026-9호" href={SAFE_MEASURES}>
            문제: 개인정보처리자가 적용해야 할 최소 기술적·관리적·물리적 안전조치를 정합니다. 기여: 2026-07-01 시행 기준은 최소 권한, 업무 변경 시 지체 없는 변경·말소, 권한 기록 최소 3년 보관, 개인별 계정과 안전한 인증수단을 규정합니다. 전제: 개인정보 보호법상 개인정보처리시스템과 처리자에게 적용하며 조문별 시행 유예·유형 조건을 확인합니다. 근거 범위: 개인정보 안전조치의 법정 최소선입니다. 비주장: 모든 ISMS 통제의 보관기간이나 특정 IAM·DB 제품을 일률적으로 지정하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
