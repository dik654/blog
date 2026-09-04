import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import IsmsFoundationsViz from "./isms-foundations-viz";

const KISA_GUIDE = "https://www.isms-p.or.kr/ntcn/rcsrm/selectGnrlRcsrmList.do";
const SAFE_MEASURES = "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281400&chrClsCd=010201";
const NIST_AUTH = "https://pages.nist.gov/800-63-4/sp800-63b/authenticators/";

export default function IsmsAuthManagement() {
  return (
    <div className="space-y-12">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">인증은 주체를 확인하고, 권한관리는 그 주체가 할 수 있는 일을 제한합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Authentication은 “이 요청자가 등록된 Alice인가?”를 확인하고 authorization은 “Alice가 지금 production customer table을
            읽어도 되는가?”를 결정합니다. 두 단계를 합치면 MFA에 성공한 사용자에게 오래된 관리자 권한이 그대로 허용되거나 강한 password policy를 적용했는데 퇴직자의
            API key는 계속 살아 있는 문제가 생깁니다.
          </p>
          <p>
            안전한 identity lifecycle은 계정, authenticator, entitlement, session·token을 서로 다른 상태로 추적하면서
            joiner·mover·leaver event에 맞춰 함께 전이시킵니다. 이 글은 초심자가 세 인증요소, MFA, password hash, recovery, 계정
            review와 퇴직 회수를 한 흐름으로 이해하도록 설명합니다. 국내 규정은 2026-08-14 현재를 기준으로 하며 NIST SP 800-63B-4는 한국의 법적 의무가 아니라
            기술 설계 비교 기준입니다.
          </p>
        </div>

        <ContentBoundary article="isms-auth-management" />
        <IsmsFoundationsViz mode="identity-lifecycle" />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>서로 다른 factor를 결합해야 MFA입니다</h3>
          <p>
            인증요소는 아는 것(비밀번호·PIN), 가진 것(cryptographic key·OTP device), 신체적
            특성(biometric)으로 나눕니다. 비밀번호와 보안질문은 둘 다 지식요소이므로 두 번
            물어도 MFA가 아닙니다. 비밀번호와 TOTP는 두 요소지만 사용자가 코드를 phishing
            site에 입력하면 실시간 relay될 수 있습니다. WebAuthn/FIDO2처럼 authenticator
            output을 실제 verifier domain에 cryptographically bind하는 방식은 phishing
            resistance를 제공합니다.
          </p>
          <p>
            관리자·remote access·wallet 승인처럼 영향이 큰 작업에는 risk와 법적 요구에 맞춘 높은 assurance를 적용하고 enrollment·새 device
            binding·factor 교체·recovery도 같은 수준으로 보호합니다. Recovery email 하나로 MFA를 우회할 수 있다면 정상 login의 강도는 의미가
            없습니다. Factor 변경에는 기존 강한 인증, 독립 알림, cooling-off 또는 관리자 검토, 기존 token 폐기와 audit receipt를 둡니다.
          </p>
        </div>

        <div id="paper-isms-auth-guide" className="scroll-mt-24">
          <CitationBlock citeKey={1} source="KISA ISMS-P 인증기준 안내서 · 인증 및 권한관리" href={KISA_GUIDE}>
            문제: 사용자 계정·고유 식별·인증·비밀번호를 조직 운영과 심사 가능한 통제로 바꿉니다. 기여: 2.5.1~2.5.4의 확인사항·결함사례·증적 예를 제공해 계정 lifecycle과 인증 기준을 점검하게 합니다. 전제: 2023.11 해설 자료이므로 2026-08-14 시행 법령, 대상 시스템과 위험평가를 함께 확인합니다. 근거 범위: ISMS-P 심사 해설입니다. 비주장: 모든 사용자에게 동일한 factor·변경주기·제품을 적용해야 한다는 기술 표준은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-nist-auth" className="scroll-mt-24">
          <CitationBlock citeKey={2} source="NIST SP 800-63B-4 · Authenticator Management" href={NIST_AUTH}>
            문제: password·OTP·cryptographic authenticator의 위협과 lifecycle 요구를 일관된 assurance level로 다룹니다. 기여: 긴 password와 blocklist·rate limit·salted cost hash, phishing-resistant cryptographic authentication, binding·recovery 규칙을 제시합니다. 전제: 2025년 발행 미국 연방 digital identity 지침이며 서비스 위험과 국내 규정을 별도로 적용합니다. 근거 범위: 현대 인증 설계의 기술 기준입니다. 비주장: NIST의 주기적 변경 금지가 한국 ISMS-P 심사 해설이나 조직의 별도 법적 의무를 자동으로 폐기하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="password-policy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">비밀번호 정책은 외우기 어려운 조합보다 online·offline 공격 경로를 나눠 설계합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Online guessing은 rate limit, progressive delay, bot detection과 account lock 정책으로 시도 속도를 낮춥니다. 무작정
            영구 잠금을 걸면 공격자가 다른 사용자를 lockout하는 denial-of-service를 만들 수 있으므로 위험 기반 challenge·알림·복구 경로를 함께 둡니다.
            Password 생성 시에는 충분한 길이, 유출·흔한 값 blocklist, password manager 와 paste 지원을 우선하며 username·서비스명 같은
            context-specific guess도 거릅니다.
          </p>
          <p>
            Offline attack은 password DB를 탈취한 공격자가 verifier를 거치지 않고 후보를 계산하는 상황입니다. 계정별 random salt는 같은
            password의 hash를 다르게 만들고 Argon2id·scrypt·bcrypt 같은 password hashing scheme의 memory/time cost는 각 후보의
            비용을 높입니다. Algorithm, parameter, salt와 version을 record에 저장하고 target hardware에서 정상 login
            latency·peak concurrency를 측정해 cost를 정기 상향합니다.
          </p>
        </div>

        <ExplainedFormula
          question="Hash DB가 유출됐을 때 한 계정의 후보를 G개 시험하는 시간이 무엇에 좌우될까?"
          idea="후보 하나를 계산하는 실제 평균 시간에 후보 수를 곱하고 공격자의 유효 병렬 처리량으로 나눕니다. Salt는 여러 계정의 사전계산 재사용을 막지만 한 계정의 약한 password를 강하게 만들지는 않습니다."
          formula={String.raw`T_{\mathrm{guess}}\approx\frac{G\,t_{\mathrm{hash}}}{p_{\mathrm{eff}}}`}
          annotatedFormula={String.raw`\underbrace{T_{\mathrm{guess}}\approx\frac{G\,t_{\mathrm{hash}}}{p_{\mathrm{eff}}}}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`T_{\mathrm{guess}}\approx\frac{G\,t_{\mathrm{hash}}}{p_{\mathrm{eff}}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","후보 하나를 계산하는 실제 평균 시간에 후보 수를 곱하고","공격자의 유효 병렬 처리량으로 나눕니다."] },
          ]}
          terms={[
            { symbol: "G", name: "후보 수", description: "공격자가 해당 계정에 대해 시험하는 password guess 개수입니다." },
            { symbol: "t_{\\mathrm{hash}}", name: "후보당 비용", description: "저장된 algorithm·memory/time parameter로 후보 하나를 검증하는 평균 시간입니다." },
            { symbol: "p_{\\mathrm{eff}}", name: "유효 병렬도", description: "공격 hardware와 memory bandwidth가 실제로 동시에 처리할 수 있는 후보 수입니다." },
            { symbol: "T_{\\mathrm{guess}}", name: "근사 공격 시간", description: "정해진 G개 후보를 시험하는 데 드는 wall-clock time의 단순 근사입니다." },
          ]}
          assumptions={[
            "후보 순서와 password 분포가 균일하지 않으므로 실제 약한 password는 평균보다 훨씬 일찍 발견될 수 있습니다.",
            "GPU·ASIC·memory contention과 구현 최적화가 p_eff와 t_hash를 바꾸므로 production parameter를 benchmark합니다.",
          ]}
          interpretation="후보당 0.2초, G=100만, 유효 병렬도 100이면 약 2,000초입니다. 이 숫자는 password가 100만 번째 후보라는 가정의 계산일 뿐입니다. 흔한 password는 초반에 나오므로 blocklist와 충분한 길이가 cost factor만큼 중요합니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>주기적 변경과 침해 기반 변경을 구분합니다</h3>
          <p>
            NIST SP 800-63B-4는 사용자 password의 기계적 주기 변경을 요구하지 않고 침해 증거가 있을 때 강제 변경하도록 권고합니다. 반면 조직은 KISA 인증기준
            해설, 계약·업종별 규정과 현재 심사 기대를 별도로 확인해야 합니다. 따라서 “90일이 세계 표준” 또는 “주기 변경은 언제나 금지”라고 단정하지 않고 적용 근거·계정
            유형·MFA 강도·유출 탐지·예외를 compliance profile로 versioning합니다. Service account는 사람의 password 변경 화면이 아니라
            vault와 short-lived credential, 자동 rotation과 dependency test로 관리합니다.
          </p>
          <h3>Reset은 별도의 고위험 protocol입니다</h3>
          <p>
            Reset token은 한 번만 사용하고 짧게 만료하며 account identifier나 token을 URL log· analytics·referrer에 노출하지 않습니다.
            성공하면 기존 session·refresh token과 위험한 device binding을 폐기하고 사용자에게 독립 알림을 보냅니다. Help desk가 지식형 질문 몇
            개만으로 관리자 password를 초기화하지 않도록 identity proofing, dual approval, recording과 escalation 절차를 둡니다.
          </p>
        </div>
      </section>

      <section id="account-lifecycle" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">계정 생명주기는 인사 원장과 모든 하위 credential을 같은 event에 연결합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Joiner 단계에서는 authoritative HR/vendor record와 고유 account ID를 연결하고 manager가
            요청한 최소 역할, 시작·종료일, data scope를 승인합니다. 초기 password를 이메일로
            오래 노출하지 않고 secure enrollment에서 authenticator를 binding합니다. Shared·
            generic account가 불가피하면 owner, 사용 목적, vault checkout, session attribution,
            rotation과 폐기일을 별도 관리합니다.
          </p>
          <p>
            Mover 단계는 새 권한을 더하는 작업이 아니라 기존 역할을 제거하고 새 역할과 SoD
            conflict를 다시 계산하는 작업입니다. Leaver event가 오면 interactive login만
            disable하지 않고 active session, refresh token, API key, SSH key, VPN certificate,
            cloud role, database grant, SaaS account와 shared secret을 SLA 안에 폐기합니다.
            Unknown outcome은 성공으로 처리하지 않고 connector별 reconciliation queue에 남깁니다.
          </p>
          <h3>정기 review와 event-driven revocation을 함께 둡니다</h3>
          <p>
            정기 review는 HR·vendor roster와 IAM·cloud·OS·DB·SaaS account 모집단을 같은 시점에
            join해 orphan, dormant, duplicate, direct grant, expired account를 찾습니다. Reviewer에게
            role 이름뿐 아니라 실제 entitlement, 최근 사용, resource owner와 민감도를 보여 주고
            approve·remove·exception 결정과 수행 결과를 분리해 기록합니다. 퇴직·계약 종료·보안
            사고는 정기 review를 기다리지 않는 event-driven revocation입니다.
          </p>
          <p>
            Privileged access는 상시 admin보다 JIT elevation을 우선합니다. Ticket과 위험 등급,
            approver, requested resource-action, start/end, MFA, issued credential ID, session recording,
            command/result, revocation과 reviewer를 하나의 privileged-session receipt로 연결합니다.
            긴급 break-glass는 정상 승인 없이도 쓸 수 있지만 별도 보관한 authenticator, 좁은
            resource, 자동 만료, 즉시 경보와 독립 사후검토가 있어야 합니다.
          </p>
        </div>

        <div id="paper-personal-data-auth" className="scroll-mt-24">
          <CitationBlock citeKey={3} source="개인정보의 안전성 확보조치 기준 · 제2026-9호" href={SAFE_MEASURES}>
            문제: 개인정보처리시스템에 누가 접근할 수 있고 업무 변경 후 언제 회수해야 하는지 최소선을 정합니다. 기여: 2026-07-01 시행 제5조는 최소 권한, 지체 없는 변경·말소, 관련 기록 최소 3년, 정당한 사유 없는 계정 공유 금지, 안전한 인증수단과 실패 제한 조치를 규정합니다. 전제: 대한민국 개인정보처리자와 해당 시스템에 적용하며 유형·시행 조건을 확인합니다. 근거 범위: 법정 최소 안전조치입니다. 비주장: 구체적인 password 길이·MFA 제품·퇴직 SLA를 이 조문 하나가 일률적으로 정하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
