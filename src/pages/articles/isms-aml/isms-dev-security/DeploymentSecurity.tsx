import DeploymentSecurityViz from './viz/DeploymentSecurityViz';
import CiCdPipelineViz from './viz/CiCdPipelineViz';
import ChangeManagementViz from './viz/ChangeManagementViz';

export default function DeploymentSecurity() {
  return (
    <section id="deployment-security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">배포와 변경관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <DeploymentSecurityViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">Git 기반 버전관리</h3>
        <p className="leading-7">
          모든 소스코드 변경은 Git과 같은 분산 버전관리 시스템(DVCS)을 통해 추적해야 한다.
          <br />
          버전관리의 핵심 가치는 "누가, 언제, 무엇을, 왜 변경했는가"를 완벽히 기록하는 것이다.
          <br />
          보안 사고 발생 시 특정 시점의 코드 상태를 복원하거나, 취약점이 도입된 커밋을 추적하는 데 필수적이다.
        </p>
        <p className="leading-7">
          커밋 메시지는 변경의 이유와 범위를 명확히 기술해야 한다.
          <br />
          "버그 수정"이 아니라 "로그인 API의 SQL Injection 취약점 수정 -- PreparedStatement로 전환"처럼 구체적으로 작성한다.
          <br />
          이렇게 하면 보안 감사(audit) 시 취약점 수정 이력을 커밋 로그만으로 추적할 수 있다.
          <br />
          서명된 커밋(GPG signed commit)을 사용하면 커밋 작성자를 위조할 수 없어 코드 변경의 무결성이 보장된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">브랜치 전략</h3>
        <p className="leading-7">
          브랜치(branch)는 코드 변경을 격리하여 안정적인 버전에 영향을 주지 않고 작업할 수 있게 하는 메커니즘이다.
          <br />
          표준 브랜치 전략은 feature → dev → staging → production 순서의 승격(promotion) 구조다.
        </p>
        <p className="leading-7">
          feature 브랜치는 개별 기능 개발용이다. 하나의 기능이 완료되면 dev 브랜치로 병합(merge)을 요청한다.
          <br />
          dev 브랜치는 여러 feature가 통합되는 개발 환경이다. 통합 테스트와 기능 충돌 확인이 이루어진다.
          <br />
          staging 브랜치는 운영과 동일한 환경에서 최종 테스트를 수행하는 단계다.
          보안 스캔, 성능 테스트, 운영팀 검수가 여기서 이루어진다.
          <br />
          production 브랜치는 실제 이용자에게 제공되는 코드다.
          staging에서 모든 검증을 통과한 코드만 production에 병합되고, 이 병합은 승인권자의 명시적 승인이 필요하다.
        </p>
        <p className="leading-7">
          보호 브랜치(protected branch) 규칙을 설정하여 production과 staging 브랜치에 직접 커밋을 금지한다.
          <br />
          반드시 PR(Pull Request)을 통해서만 코드가 병합되도록 강제하면,
          코드 리뷰 없이 운영 환경에 변경이 적용되는 사고를 방지한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">코드 리뷰: PR 기반 보안 검수</h3>
        <p className="leading-7">
          PR(Pull Request)은 코드 변경을 병합하기 전에 리뷰어가 검토하고 승인하는 절차다.
          <br />
          보안 관점의 리뷰 체크리스트는 다음 항목을 포함한다.
          <br />
          입력값 검증이 서버 측에서 수행되는가.
          SQL 쿼리가 Prepared Statement로 작성되었는가.
          인증/인가 로직이 정확한가 -- 특히 다른 이용자의 리소스에 접근하는 것을 차단하는가.
          민감 정보(키, 토큰, 비밀번호)가 코드에 포함되어 있지 않은가.
          에러 메시지에 시스템 내부 정보가 노출되지 않는가.
        </p>
        <p className="leading-7">
          최소 1명 이상의 리뷰어 승인을 PR 병합의 필수 조건으로 설정한다.
          <br />
          보안에 민감한 변경(인증 로직, 암호화, 권한 관리)은 보안 담당자의 추가 리뷰를 요구하는 CODEOWNERS 규칙을 활용한다.
          <br />
          리뷰어가 지적한 사항은 수정 후 재검토를 거쳐야 하며, 승인 없이 강제 병합(force merge)하는 것은 금지한다.
          <br />
          자체 코드를 자체 승인하는 것도 허용하지 않는다 -- 리뷰는 작성자가 아닌 제3자가 수행해야 효과가 있다.
        </p>

        <CiCdPipelineViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">CI/CD 파이프라인: 자동 보안 검증</h3>
        <p className="leading-7">
          CI(Continuous Integration, 지속적 통합)는 코드 변경을 자동으로 빌드하고 테스트하는 프로세스다.
          <br />
          CD(Continuous Deployment/Delivery, 지속적 배포)는 테스트를 통과한 코드를 자동으로 운영 환경에 배포하는 프로세스다.
          <br />
          CI/CD 파이프라인에 보안 검증 단계를 통합하면 매 배포마다 일관된 수준의 보안 검사가 이루어진다.
        </p>
        <p className="leading-7">
          파이프라인의 보안 단계는 다음과 같이 구성한다.
          <br />
          SAST(정적 분석)는 코드가 커밋될 때 자동 실행된다. 소스코드를 파싱하여 SQL Injection, XSS, 하드코딩된 시크릿 등 알려진 취약 패턴을 탐지한다.
          <br />
          의존성 검사(Dependency Check)는 사용 중인 라이브러리에 알려진 취약점(CVE, Common Vulnerabilities and Exposures)이 있는지 확인한다.
          npm audit, Snyk, Dependabot이 대표적 도구다.
          <br />
          DAST(동적 분석)는 staging 환경에 배포된 후 실행 중인 애플리케이션을 대상으로 모의 공격을 수행한다.
          실제 HTTP 요청을 보내 인젝션, 인증 우회, 정보 노출을 테스트한다.
        </p>
        <p className="leading-7">
          보안 검사 실패 시 파이프라인을 중단(fail)하여 취약한 코드가 운영에 도달하지 않도록 한다.
          <br />
          심각도(severity)에 따라 Critical/High는 즉시 차단, Medium은 경고 후 일정 기간 내 수정, Low는 로그만 기록하는 정책을 수립한다.
          <br />
          파이프라인 자체의 보안도 중요하다. CI/CD 서버에 저장된 배포 키와 시크릿이 유출되면 운영 환경을 직접 장악할 수 있으므로,
          시크릿은 파이프라인 변수(environment variable)에 마스킹하여 저장하고 로그에 노출되지 않도록 설정한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">스마트 계약 배포: 추가 보안 절차</h3>
        <p className="leading-7">
          블록체인 스마트 계약(smart contract)은 한 번 배포하면 수정이 불가능하거나(immutable) 극히 제한적인 업그레이드만 가능하다.
          <br />
          일반 웹 서비스의 "배포 후 패치" 전략이 통하지 않으므로 배포 전 검증이 일반 소프트웨어보다 훨씬 엄격해야 한다.
        </p>
        <p className="leading-7">
          테스트넷(testnet) 배포는 필수 사전 단계다.
          메인넷과 동일한 환경에서 시뮬레이션하여 예상치 못한 동작, 가스 비용 초과, 재진입 공격(reentrancy) 등을 확인한다.
          <br />
          외부 보안 감사(audit)는 제3자 전문 업체가 소스코드를 정밀 분석하여 취약점을 발견하는 과정이다.
          내부 리뷰에서 놓친 로직 오류, 오버플로우, 접근 제어 결함을 독립적 시각에서 검증한다.
          <br />
          감사 완료 후에도 버그 바운티(bug bounty) 프로그램을 운영하여 지속적으로 취약점을 수집한다.
          <br />
          프록시 패턴(proxy pattern)으로 업그레이드 가능한 구조를 설계하되,
          업그레이드 권한은 Multi-sig 또는 타임락(timelock)으로 통제하여 단일 관리자의 임의 변경을 방지한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">롤백 절차</h3>
        <p className="leading-7">
          배포 후 장애가 발생하면 이전 버전으로 즉시 복원(rollback)할 수 있어야 한다.
          <br />
          롤백이 불가능한 상태에서 장애가 지속되면 피해가 시간에 비례하여 확대된다.
        </p>
        <p className="leading-7">
          블루-그린 배포(blue-green deployment)는 동일한 환경 두 벌을 유지하여 트래픽을 전환하는 방식이다.
          <br />
          현재 운영 중인 환경(blue)과 새 버전이 배포된 환경(green)을 동시에 유지하고,
          로드밸런서가 트래픽을 green으로 전환한다.
          장애 발생 시 트래픽을 다시 blue로 돌리면 수 초 내에 롤백이 완료된다.
          <br />
          카나리 배포(canary deployment)는 새 버전을 전체 트래픽의 일부(예: 5%)에만 먼저 적용하여 안정성을 확인한 후 점진적으로 비율을 높이는 방식이다.
          이상 징후가 감지되면 카나리 비율을 0%로 되돌려 피해를 최소화한다.
        </p>
        <p className="leading-7">
          DB 스키마 변경이 포함된 배포는 롤백이 복잡하다.
          <br />
          forward-compatible 마이그레이션 원칙을 따르면 롤백이 용이하다:
          컬럼 추가는 안전하지만, 컬럼 삭제나 이름 변경은 이전 버전과 호환되지 않으므로 별도 단계로 분리한다.
          <br />
          롤백 절차는 문서화하고, 정기적으로 롤백 훈련(drill)을 수행하여 실제 장애 시 혼란 없이 실행할 수 있도록 한다.
        </p>

        <ChangeManagementViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">변경관리 프로세스</h3>
        <p className="leading-7">
          변경관리(change management)는 시스템 변경이 통제된 절차를 거쳐 이루어지도록 보장하는 프로세스다.
          <br />
          무계획적 변경은 장애의 가장 흔한 원인이며, ISMS 인증에서도 변경관리 절차 수립을 요구한다.
        </p>
        <p className="leading-7">
          표준 변경관리 절차는 다섯 단계로 구성된다.
          <br />
          변경 요청(Request for Change, RFC) -- 변경 내용, 목적, 영향 범위를 문서화한다.
          <br />
          영향 분석(Impact Analysis) -- 변경이 다른 시스템에 미치는 영향, 롤백 가능성, 필요 자원을 평가한다.
          <br />
          승인(Approval) -- 변경관리위원회(CAB, Change Advisory Board) 또는 지정된 승인권자가 검토 후 승인한다.
          긴급 변경(emergency change)은 사후 승인이 가능하지만, 48시간 이내에 소급 검토를 완료해야 한다.
          <br />
          배포(Deployment) -- 승인된 계획에 따라 CI/CD 파이프라인을 통해 배포한다.
          <br />
          검증(Verification) -- 배포 후 서비스 정상 동작, 성능 지표, 보안 로그를 확인한다.
          이상이 없으면 변경을 "완료"로 기록하고, 이상이 있으면 롤백 후 원인 분석을 수행한다.
        </p>
        <p className="leading-7">
          모든 변경 이력은 기록으로 남겨 추후 감사에 대응할 수 있어야 한다.
          <br />
          "언제, 누가, 무엇을 변경했고, 누가 승인했으며, 결과가 어땠는가"가 추적 가능한 상태를 유지하는 것이 변경관리의 최종 목표다.
        </p>
      </div>
    </section>
  );
}
