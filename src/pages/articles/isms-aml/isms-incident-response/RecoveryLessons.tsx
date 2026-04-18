import RecoveryLessonsViz from './viz/RecoveryLessonsViz';
import EradicationRecoveryInline from './viz/EradicationRecoveryInline';
import PreventionDrillInline from './viz/PreventionDrillInline';

export default function RecoveryLessons() {
  return (
    <section id="recovery-lessons" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">복구와 재발방지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RecoveryLessonsViz />
        <h3 className="text-xl font-semibold mt-8 mb-4">근절: 원인 제거</h3>
        <p className="leading-7">
          근절(Eradication)은 시스템에 남아 있는 공격의 흔적을 완전히 제거하는 단계다.
          <br />
          악성코드가 발견되면 안티바이러스 엔진뿐 아니라 수동 분석을 병행하여 변종이나 잔여 파일까지 확인한다.
          레지스트리, 크론탭(crontab, 리눅스 예약 작업), 서비스 목록에 공격자가 등록해 둔 항목을 하나씩 점검한다.
        </p>
        <p className="leading-7">
          백도어(backdoor) 확인은 근절의 핵심이다.
          <br />
          공격자는 재침입을 위해 웹셸(webshell, 웹 서버에 심는 원격 실행 스크립트), 변조된 SSH 인증키, 숨겨진 관리자 계정을 남겨두는 경우가 많다.
          전체 시스템의 파일 무결성을 기준 해시값(baseline hash)과 비교하여 변조 여부를 확인한다.
          <br />
          취약점이 원인이었다면 해당 소프트웨어의 보안 패치를 적용한다.
          패치가 아직 제공되지 않은 제로데이(zero-day)의 경우 WAF 규칙 추가나 해당 기능 비활성화로 임시 방어한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">복구: 정상 서비스 재개</h3>
        <p className="leading-7">
          복구(Recovery)는 시스템을 사고 이전의 정상 상태로 되돌리는 과정이다.
          <br />
          가장 안전한 방법은 검증된 백업 이미지에서 시스템을 복원하는 것이다.
          감염된 시스템 위에 패치만 적용하는 방식은 잔여 악성코드가 남아 있을 위험이 있으므로, 클린 복원이 권장된다.
        </p>
        <p className="leading-7">
          복원 후에는 서비스 정상 동작을 단계별로 확인한다.
          <br />
          DB 무결성 검증(테이블 수, 레코드 수, 최근 트랜잭션 대조), 애플리케이션 기능 테스트, 외부 API 연동 확인을 순차적으로 수행한다.
          <br />
          서비스를 재개한 직후에는 모니터링을 평소보다 강화한다.
          동일 공격이 재발하는지, 공격자가 다른 경로로 재침입을 시도하는지 집중 감시하는 기간을 최소 2주 이상 유지한다.
        </p>

        <EradicationRecoveryInline />

        <h3 className="text-xl font-semibold mt-8 mb-4">사후 보고서</h3>
        <p className="leading-7">
          사고가 종료되면 반드시 사후 보고서(Post-Incident Report)를 작성한다.
          <br />
          보고서에는 타임라인(사고 인지 시각, 각 대응 조치 시각, 복구 완료 시각), 원인 분석(root cause analysis),
          피해 규모(유출된 데이터 건수, 영향받은 시스템 수, 재무적 손실), 대응 과정 평가가 포함된다.
        </p>
        <p className="leading-7">
          타임라인은 분 단위로 기록하는 것이 원칙이다.
          <br />
          "언제 탐지했는가 → 언제 격리를 시작했는가 → 언제 봉쇄를 완료했는가 → 언제 복구를 시작했는가 → 언제 서비스를 재개했는가"를 정확히 남긴다.
          <br />
          원인 분석은 표면적 원인(어떤 취약점이 이용되었는가)과 근본 원인(왜 그 취약점이 존재했는가, 왜 탐지가 늦었는가)을 모두 다룬다.
          대응 평가에서는 잘한 점과 개선이 필요한 점을 솔직하게 기록하여 다음 사고 대응의 기준선(baseline)으로 삼는다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">유관기관 신고</h3>
        <p className="leading-7">
          개인정보 유출 사고는 KISA(한국인터넷진흥원)에 24시간 이내 신고해야 한다.
          신고 내용에는 유출 항목, 유출 시점, 유출 규모, 대응 조치, 이용자 통지 계획이 포함된다.
          <br />
          금융 관련 침해사고는 금융감독원 전자금융사고 보고 체계를 통해 별도 신고한다.
          가상자산 사업자는 금융정보분석원(FIU)에도 보고 의무가 있을 수 있다.
        </p>
        <p className="leading-7">
          범죄가 의심되는 경우 경찰 사이버수사대에 수사를 의뢰한다.
          <br />
          포렌식 과정에서 확보한 증거(디스크 이미지, 로그, 네트워크 패킷)를 증거 보관 체인(chain of custody) 기록과 함께 제출한다.
          수사 과정에서 추가 증거가 필요하면 협조하되, 내부 시스템 접근 권한은 최소 범위로 제한하여 제공한다.
        </p>

        <PreventionDrillInline />

        <h3 className="text-xl font-semibold mt-8 mb-4">재발방지</h3>
        <p className="leading-7">
          재발방지는 보안 정책 개정에서 시작한다.
          <br />
          사고 원인에 해당하는 정책 조항을 강화하거나 새로 신설한다.
          예를 들어 피싱으로 인한 사고 후에는 MFA 의무화 범위를 확대하고, 이메일 보안 게이트웨이 도입을 검토한다.
        </p>
        <p className="leading-7">
          시스템 강화(Hardening)는 기술적 재발방지 조치다.
          <br />
          불필요한 서비스 비활성화, OS 및 애플리케이션 보안 설정 점검, 네트워크 세분화(micro-segmentation)를 통해 공격 표면을 줄인다.
          <br />
          교육은 재발방지의 가장 효과적인 수단 중 하나로, 전 직원 대상 보안 인식 교육과 기술 담당자 대상 심화 교육을 분리하여 실시한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">내부자 모니터링</h3>
        <p className="leading-7">
          내부자 위협은 외부 공격보다 탐지가 어렵고 피해가 클 수 있다.
          <br />
          UBA(User Behavior Analytics, 사용자 행위 분석)는 각 직원의 평소 행동 패턴(로그인 시간, 접근 리소스, 데이터 전송량)을 학습하여 이상 행위를 탐지하는 기술이다.
          <br />
          평소 업무 시간 외에 대량의 데이터를 다운로드하거나, 권한 밖의 시스템에 반복 접근을 시도하거나, 외부 클라우드 스토리지로 파일을 업로드하면 자동 경보가 발생한다.
        </p>
        <p className="leading-7">
          이상 로그인 감시도 내부자 모니터링의 핵심 요소다.
          <br />
          동일 계정의 동시 다중 로그인, 지리적으로 불가능한 위치 이동(임파서블 트래블), 비인가 장치에서의 접근을 실시간으로 감시한다.
          <br />
          단, 내부자 모니터링은 직원의 프라이버시와 균형을 맞춰야 한다.
          모니터링 사실을 사전에 고지하고, 수집 범위를 업무 관련 활동으로 한정하며, 수집된 데이터의 열람 권한을 보안팀으로 제한한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">정기 모의훈련</h3>
        <p className="leading-7">
          침해사고 대응 절차는 실제로 실행해 봐야 비로소 문제점이 드러난다.
          <br />
          연 1회 이상 모의훈련(tabletop exercise 또는 simulation drill)을 실시하여 절차서의 실효성을 검증한다.
          <br />
          탁상 훈련(Tabletop Exercise)은 가상 시나리오를 놓고 각 역할 담당자가 대응 절차를 구두로 진행하는 방식이다.
          비용이 적고 빠르게 실행할 수 있어 분기별로 수행하기에 적합하다.
        </p>
        <p className="leading-7">
          시뮬레이션 훈련(Simulation Drill)은 실제 시스템 환경에서 가짜 공격을 수행하여 실전에 가까운 경험을 제공한다.
          <br />
          레드팀(Red Team)이 공격자 역할을, 블루팀(Blue Team)이 방어자 역할을 맡아 실시간으로 공방을 진행한다.
          훈련 종료 후 AAR(After Action Review, 사후 행동 검토)을 통해 개선점을 도출하고, 절차서에 반영한다.
          <br />
          훈련 결과는 경영진에게 보고하여, 예산 확보와 인력 배치의 근거로 활용한다.
          훈련 미실시는 ISMS 인증 심사에서 결함(deficiency)으로 판정될 수 있으므로 일정 관리가 중요하다.
        </p>
      </div>
    </section>
  );
}
