import OverviewViz from './viz/OverviewViz';
import IncidentLifecycleInline from './viz/IncidentLifecycleInline';
import CertContactInline from './viz/CertContactInline';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">침해사고 대응 체계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <OverviewViz />
        <h3 className="text-xl font-semibold mt-8 mb-4">ISMS 2.11 요구사항</h3>
        <p className="leading-7">
          ISMS-P 인증 기준 2.11은 "사고 예방 및 대응"을 다룬다.
          <br />
          핵심 요구는 세 가지로 압축된다 -- 침해사고 대응 절차를 문서화할 것, 대응 조직을 지정할 것, 사고 발생 시 즉시 보고하고 기록을 남길 것.
          <br />
          단순히 절차서를 작성해 두는 것만으로는 부족하며, 실제 훈련을 통해 절차가 작동하는지 검증해야 인증 심사를 통과할 수 있다.
        </p>
        <p className="leading-7">
          이 요구사항은 "사전 예방 → 탐지 → 대응 → 복구 → 사후관리"라는 전체 생명주기를 포괄한다.
          <br />
          예방만 강조하면 사고가 터졌을 때 대응이 늦어지고, 대응만 강조하면 같은 사고가 반복된다.
          <br />
          전체 생명주기를 빠짐없이 커버해야 비로소 "관리체계"라 부를 수 있다.
        </p>

        <IncidentLifecycleInline />

        <h3 className="text-xl font-semibold mt-8 mb-4">침해사고 유형</h3>
        <p className="leading-7">
          침해사고란 정보 시스템의 기밀성(Confidentiality), 무결성(Integrity), 가용성(Availability) 중 하나 이상이 침해되는 사건을 말한다.
          <br />
          외부 공격과 내부 위협으로 크게 나뉘며, 각 유형마다 탐지 방법과 대응 절차가 다르다.
        </p>
        <p className="leading-7">
          해킹(Hacking)은 외부 공격자가 취약점을 이용해 시스템에 무단 침입하는 것으로, 웹 애플리케이션 취약점(SQL Injection, XSS 등)이나 제로데이(zero-day) 취약점을 경로로 사용한다.
          <br />
          내부자 유출은 권한을 가진 직원이 의도적으로 데이터를 빼돌리는 행위로, 기술적 탐지보다 행위 분석이 핵심이다.
          <br />
          랜섬웨어(Ransomware)는 시스템의 파일을 암호화한 뒤 복호화 대가를 요구하는 악성코드로, 가용성을 직접 파괴한다.
        </p>
        <p className="leading-7">
          DDoS(Distributed Denial of Service, 분산 서비스 거부)는 대량의 트래픽으로 서비스를 마비시키는 공격이다.
          직접적인 데이터 유출은 없지만 서비스 중단으로 인한 매출 손실과 신뢰도 하락이 크다.
          <br />
          피싱(Phishing)은 이메일이나 메신저로 위장 링크를 보내 사용자의 계정 정보를 탈취하는 사회공학적(Social Engineering) 공격이다.
          기술적 방어만으로는 완전히 차단하기 어렵고, 보안 인식 교육이 병행되어야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">대응 5단계</h3>
        <p className="leading-7">
          침해사고 대응은 국제 표준(NIST SP 800-61)을 기반으로 5단계로 구성한다.
          <br />
          1단계 준비(Preparation)는 사고가 발생하기 전에 대응 역량을 갖추는 과정이다.
          대응 절차서 작성, 도구 확보, 연락망 정비, 교육/훈련이 여기에 해당한다.
          <br />
          2단계 탐지/분석(Detection & Analysis)은 사고 징후를 식별하고 실제 사고인지 판별하는 과정이다.
          오탐(false positive)을 걸러내고, 사고의 범위와 심각도를 초기 평가한다.
        </p>
        <p className="leading-7">
          3단계 봉쇄(Containment)는 피해 확산을 막는 즉각적인 조치다.
          감염 시스템 격리, 네트워크 차단, 계정 잠금 등이 포함된다.
          <br />
          4단계 근절/복구(Eradication & Recovery)는 원인을 제거하고 시스템을 정상 상태로 되돌리는 과정이다.
          악성코드 제거, 패치 적용, 백업 복원, 서비스 재개가 순차적으로 진행된다.
          <br />
          5단계 사후활동(Post-Incident Activity)은 사고 경위를 분석하고 재발방지 대책을 수립하는 단계다.
          사후 보고서 작성, 정책 개선, 추가 훈련 실시가 핵심이다.
        </p>

        <CertContactInline />

        <h3 className="text-xl font-semibold mt-8 mb-4">대응 조직: CERT 구성</h3>
        <p className="leading-7">
          CERT(Computer Emergency Response Team, 침해사고대응팀)는 사고 발생 시 즉각 가동되는 전담 조직이다.
          <br />
          상시 운영 형태와 비상 소집 형태로 나뉘는데, 중소 규모 조직은 비상 소집 방식이 현실적이다.
          평상시에는 각자 본업을 수행하되, 사고 발생 시 지정된 역할로 즉시 전환한다.
        </p>
        <p className="leading-7">
          CERT의 핵심 역할 분담은 다음과 같다.
          <br />
          총괄 책임자(CISO 또는 지정 임원)는 의사결정과 외부 보고를 담당한다.
          기술 분석관은 로그 분석, 포렌식(forensics, 디지털 증거 수집/분석), 악성코드 분석을 수행한다.
          <br />
          시스템 운영자는 네트워크 격리, 패치 적용, 시스템 복구를 실행한다.
          커뮤니케이션 담당은 내부 직원 공지, 고객 통지, 유관기관 신고를 처리한다.
          <br />
          역할이 명확하지 않으면 사고 현장에서 혼선이 발생하므로, 사전에 문서로 지정하고 정기적으로 갱신해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">비상연락망 체계</h3>
        <p className="leading-7">
          사고 인지 후 보고 지연은 피해를 확대시키는 가장 흔한 원인이다.
          <br />
          비상연락망은 단계별 보고 시한을 명확히 정의해야 한다.
          1차 보고는 사고 인지 후 1시간 이내에 CISO(정보보호최고책임자)에게 전달한다.
          <br />
          CISO는 사고 심각도를 판단하여 경영진에게 즉시 에스컬레이션(escalation, 상위 보고)할지 결정한다.
        </p>
        <p className="leading-7">
          개인정보 유출이 확인되면 24시간 이내에 KISA(한국인터넷진흥원)에 신고해야 하며, 이는 개인정보보호법상 의무다.
          <br />
          금융 관련 사고는 금융감독원에도 병행 보고한다.
          형사 사건으로 발전할 가능성이 있으면 경찰 사이버수사대에 수사를 의뢰한다.
          <br />
          연락망은 최소 분기 1회 갱신하며, 담당자 부재 시 대리인(backup contact)도 반드시 지정해 둔다.
          야간/휴일 사고에 대비해 당직 체계를 운영하거나, 외부 보안관제(MSSP) 서비스를 활용하는 것도 방법이다.
        </p>
      </div>
    </section>
  );
}
