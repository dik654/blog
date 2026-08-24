import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import IsmsFoundationsViz from "./isms-foundations-viz";

const KISA_GUIDE = "https://www.isms-p.or.kr/ntcn/rcsrm/selectGnrlRcsrmList.do";
const SAFE_MEASURES = "https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000281400&chrClsCd=010201";
const NIST_ZTA = "https://csrc.nist.gov/pubs/sp/800/207/final";

export default function IsmsAccessControl() {
  return (
    <div className="space-y-12">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">접근통제는 “로그인했는가”가 아니라 이 요청을 지금 허용해도 되는가를 결정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사용자 Alice가 MFA로 로그인했다는 사실은 identity를 확인한 결과일 뿐, 고객 DB의
            모든 행을 export할 권한까지 주지 않습니다. 접근통제(access control)는 검증된
            주체가 특정 resource에 action을 요청할 때 역할, 업무 목적, device·network,
            시간, 승인과 위험 신호를 평가해 allow 또는 deny를 만들고 enforcement point가
            그 결정을 실제로 강제하는 전체 경로입니다.
          </p>
          <p>
            이 글은 초심자를 위해 identity → session → policy decision → enforcement →
            audit·revocation 순서를 먼저 보여 준 뒤, 망분리와 DB 접근통제가 각각 무엇을
            막고 무엇을 막지 못하는지 설명합니다. 대한민국 법령·고시 상태는 2026-08-14에
            확인했으며, NIST Zero Trust는 국내 법적 의무가 아니라 설계 참고 기준으로만 씁니다.
          </p>
        </div>

        <ContentBoundary article="isms-access-control" />
        <IsmsFoundationsViz mode="access-path" />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>최소 권한과 직무분리를 한 권한표에서 계산합니다</h3>
          <p>
            최소 권한(least privilege)은 직급이 낮다는 뜻이 아니라 맡은 업무를 수행하는 데
            필요한 resource와 action만, 필요한 기간 동안 부여하는 원칙입니다. RBAC(Role-
            Based Access Control)는 권한을 업무 역할에 묶어 관리하고, ABAC(Attribute-Based
            Access Control)는 resource 민감도·device 상태·시간·ticket 같은 속성 조건을
            결정에 더합니다. 역할은 시작점이며 실제 사용하지 않는 권한을 계속 갖는
            entitlement creep을 정기 review로 제거해야 합니다.
          </p>
        </div>

        <ExplainedFormula
          question="한 요청에 실제로 허용할 권한 집합을 어떻게 읽어야 할까?"
          idea="직접 권한과 역할 권한을 합친 뒤, 현재 조건에서 사용할 수 있는 범위와 deny policy를 적용합니다. 집합 표기는 제품 문법이 아니라 allow가 여러 출처에서 생기고 조건·금지가 최종 결과를 줄인다는 사고 도구입니다."
          formula={String.raw`P_{\mathrm{eff}}=\bigl(P_{\mathrm{direct}}\cup P_{\mathrm{role}}\bigr)\cap P_{\mathrm{condition}}\setminus P_{\mathrm{deny}}`}
          annotatedFormula={String.raw`P_{\mathrm{eff}}=\underbrace{\bigl(P_{\mathrm{direct}}\cup P_{\mathrm{role}}\bigr)\cap P_{\mathrm{condition}}\setminus P_{\mathrm{deny}}}_{\text{조건 허용 범위 계산}}`}
          operations={[
            { expression: String.raw`\bigl(P_{\mathrm{direct}}\cup P_{\mathrm{role}}\bigr)\cap P_{\mathrm{condition}}\setminus P_{\mathrm{deny}}`, annotation: ["조건 허용 범위이(가) 식의 결과에 기여하는 방식을","계산합니다.","직접 권한과 역할 권한을 합친 뒤, 현재 조건에서 사용할 수","있는 범위와 deny policy를 적용합니다."] },
          ]}
          terms={[
            { symbol: "P_{\\mathrm{direct}}", name: "직접 권한", description: "사용자나 workload에 개별 부여된 resource-action 쌍입니다." },
            { symbol: "P_{\\mathrm{role}}", name: "역할 권한", description: "CS-readonly, DB-operator 같은 업무 역할에서 상속된 권한입니다." },
            { symbol: "P_{\\mathrm{condition}}", name: "조건 허용 범위", description: "승인 ticket·관리 단말·허용 시간·network 등 현재 요청이 충족한 범위입니다." },
            { symbol: "P_{\\mathrm{deny}}", name: "명시적 금지", description: "민감 필드 export나 production DDL처럼 allow보다 우선해 제거할 권한입니다." },
            { symbol: "P_{\\mathrm{eff}}", name: "실효 권한", description: "이 session과 요청에서 enforcement point가 최종 허용할 집합입니다." },
          ]}
          assumptions={[
            "실제 IAM의 precedence·resource hierarchy·implicit deny는 제품별로 다르므로 policy engine semantics를 test합니다.",
            "Role 이름만 같다고 권한 집합이 같지 않으며 tenant·environment·policy revision을 receipt에 남깁니다.",
          ]}
          interpretation="CS 역할에 customer:read와 customer:export가 있어도 현재 condition이 read-only이고 export가 명시적 deny라면 실효 권한에는 read만 남습니다. 반대로 direct admin grant가 섞이면 role review만으로는 이를 발견하지 못하므로 모든 grant source를 합쳐 계산해야 합니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            직무분리(Separation of Duties)는 위험한 end-to-end action을 한 사람이 혼자
            완성하지 못하게 합니다. 권한 신청자와 승인자, code 작성자와 production 배포자,
            출금 요청자와 wallet signer를 분리하되 인원이 적은 조직은 독립 사후검토·한도·
            immutable log 같은 보상통제를 명시합니다. 공유 계정은 책임추적성을 잃으므로
            원칙적으로 개인 계정을 쓰고, unavoidable break-glass는 vault checkout·MFA·
            짧은 만료·session recording·사후 review로 좁힙니다.
          </p>
        </div>

        <div id="paper-isms-access-guide" className="scroll-mt-24">
          <CitationBlock citeKey={1} source="KISA ISMS-P 인증기준 안내서 · 접근통제" href={KISA_GUIDE}>
            문제: 계정·식별·인증과 network·system·application 접근 요구를 실제 심사 항목으로 연결합니다. 기여: 2.5 인증 및 권한관리와 2.6 접근통제의 주요 확인사항·결함사례·증적 예를 제공합니다. 전제: 2023.11 안내서이므로 2026-08-14 시행 법령과 조직 위험평가를 함께 적용합니다. 근거 범위: ISMS-P 심사 해설입니다. 비주장: 특정 망분리 방식·제품·고정 주기가 모든 조직의 유일한 적합 구현이라는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-zero-trust" className="scroll-mt-24">
          <CitationBlock citeKey={2} source="NIST SP 800-207 · Zero Trust Architecture" href={NIST_ZTA}>
            문제: network 위치를 신뢰의 대리값으로 삼을 때 내부 이동과 remote·cloud resource를 충분히 통제하지 못합니다. 기여: subject·device·resource별 policy decision과 enforcement, 지속적 telemetry 원칙을 제시합니다. 전제: 미국 연방기관을 중심으로 한 기술 reference이며 조직별 architecture와 위협모델에 맞춰 적용합니다. 근거 범위: zero-trust 설계 개념입니다. 비주장: 한국 ISMS-P의 망분리 의무를 대체하거나 특정 제품을 인증하는 문서가 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="network-segmentation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">망분리는 신뢰를 만드는 벽이 아니라 이동 경로를 줄이는 통제입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Network segmentation은 internet, user, management, production, database, wallet
            zone처럼 trust와 영향이 다른 구간을 나누고 필요한 flow만 허용합니다. 먼저
            source identity·zone, destination resource, protocol·port, business purpose,
            owner, expiry를 가진 flow inventory를 만든 뒤 default deny에서 예외를 승인합니다.
            방화벽 rule의 이름만 보고 판단하지 않고 양방향 test와 packet·flow log로 실제
            reachability를 확인합니다.
          </p>
          <p>
            외부 운영자는 MFA가 적용된 VPN으로 들어와 managed device posture를 통과하고,
            bastion을 거쳐 승인된 production target에 짧은 session으로 접속하도록 설계할 수
            있습니다. 하지만 같은 zone 안의 compromised host, 허용된 HTTPS tunnel, cloud
            control plane, service-to-service credential은 network boundary를 우회할 수 있습니다.
            따라서 workload identity·application authorization·endpoint detection을 함께 두고,
            망분리만으로 내부 주체를 신뢰하지 않습니다.
          </p>

          <h3>Rule lifecycle을 운영합니다</h3>
          <ol>
            <li>요청 시 source·destination·port·목적·data sensitivity·owner·만료일을 기록합니다.</li>
            <li>security owner가 더 좁은 대안과 기존 flow 중복을 검토한 뒤 승인합니다.</li>
            <li>정책 revision을 staging에서 test하고 production 적용·rollback receipt를 남깁니다.</li>
            <li>hit count·asset inventory·owner를 정기 대조해 unused·shadowed·expired rule을 제거합니다.</li>
          </ol>
        </div>
      </section>

      <section id="db-access-control" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">DB에서는 연결, 권한, query, 결과 반출을 각각 통제합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            연결 허용은 DB 권한 허용과 다릅니다. 사람은 개인 identity로 approved gateway를
            거치고, 애플리케이션은 workload별 service account와 secret rotation을 사용합니다.
            Schema·table·column·row·procedure 수준의 read/write/DDL/grant를 분리하며,
            production write나 대량 export는 ticket·2인 승인·시간 제한이 있는 JIT(Just-in-
            Time) role로 승격합니다. DBA가 audit log를 삭제할 수 있다면 독립 저장소와 별도
            log-admin 권한으로 책임을 분리합니다.
          </p>
          <p>
            감사 record는 actor, 실제 인증된 principal, proxy chain, source, request·session ID,
            query category, object, row count, result, timestamp, policy revision을 남깁니다. 개인정보
            원문이나 secret이 query text에 들어갈 수 있으므로 masking과 제한된 reader를 두고,
            clock synchronization·append integrity·retention·alert owner를 함께 관리합니다. 단순히
            “로그를 보관한다”가 아니라 이상 대량조회·야간 DDL·반복 deny가 alert→triage→ticket→
            종결로 이어지는지 표본을 재생합니다.
          </p>
          <h3>권한 review는 모집단 대조로 수행합니다</h3>
          <p>
            IAM export, DB catalog, HR roster와 privileged access tool을 같은 cutoff로 join해 orphan,
            shared, dormant, direct grant, role conflict와 만료 초과를 찾습니다. Manager가 role 이름만
            승인하지 않도록 실제 resource-action과 최근 사용, data sensitivity를 보여 주며,
            변경·말소 내역과 검토 결정을 record로 남깁니다. 현행 개인정보 안전성 확보조치
            기준은 최소 권한의 차등 부여, 업무 변경 시 지체 없는 변경·말소, 관련 내역의 최소
            3년 보관, 정당한 사유 없는 공유 계정 금지를 규정합니다.
          </p>
        </div>

        <div id="paper-personal-data-access" className="scroll-mt-24">
          <CitationBlock citeKey={3} source="개인정보의 안전성 확보조치 기준 · 제2026-9호" href={SAFE_MEASURES}>
            문제: 개인정보처리시스템의 권한과 network 접근을 최소 안전조치로 규율합니다. 기여: 2026-07-01 시행 제5조는 최소 권한·변경/말소·3년 기록·개인별 계정·안전한 인증수단을 규정하며, 접근통제 조항은 불법 접근을 막는 기술적 조치를 다룹니다. 전제: 대한민국 개인정보처리자와 해당 개인정보처리시스템에 적용하고 유형·조문별 시행 조건을 확인합니다. 근거 범위: 법정 최소선입니다. 비주장: ISMS 전체의 모든 증적을 3년 보관하거나 network zone 하나만으로 적합하다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
