import DetectionContainmentViz from './viz/DetectionContainmentViz';
import DetectionToolsInline from './viz/DetectionToolsInline';
import ContainmentProcInline from './viz/ContainmentProcInline';

export default function DetectionContainment() {
  return (
    <section id="detection-containment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">탐지와 초동 대응</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <DetectionContainmentViz />
        <h3 className="text-xl font-semibold mt-8 mb-4">탐지 수단</h3>
        <p className="leading-7">
          침해사고 탐지의 첫 번째 방어선은 IDS/IPS(Intrusion Detection/Prevention System, 침입탐지/방지시스템)다.
          <br />
          IDS는 네트워크 트래픽이나 시스템 로그에서 알려진 공격 패턴(시그니처)을 탐지하여 경보를 발생시킨다.
          IPS는 여기서 한 걸음 더 나아가 탐지된 공격을 자동으로 차단한다.
          <br />
          시그니처 기반(signature-based)은 알려진 공격에 강하고, 이상 탐지(anomaly-based)는 정상 패턴에서 벗어나는 행위를 감지하므로 미지의 공격에 유리하다.
        </p>
        <p className="leading-7">
          WAF(Web Application Firewall, 웹 애플리케이션 방화벽)는 HTTP/HTTPS 트래픽을 검사하여 SQL Injection, XSS(Cross-Site Scripting), 파일 업로드 공격 등을 차단한다.
          <br />
          일반 방화벽이 IP/포트 수준에서 필터링하는 것과 달리, WAF는 애플리케이션 계층(Layer 7)의 요청 내용을 분석한다.
          <br />
          WAF 로그는 어떤 공격이 시도되었고 어떤 것이 차단되었는지 파악하는 핵심 소스다.
        </p>
        <p className="leading-7">
          SIEM(Security Information and Event Management, 보안 정보 이벤트 관리)은 여러 보안 장비와 시스템의 로그를 한 곳에 수집하여 상관분석(correlation analysis)을 수행한다.
          <br />
          개별 이벤트로는 정상처럼 보이지만, 여러 이벤트를 연결하면 공격 패턴이 드러나는 경우가 많다.
          예를 들어 "새벽 3시 VPN 접속 → 비인가 서버 접근 → 대용량 파일 다운로드"는 각각은 허용된 행위지만, 연속으로 발생하면 내부자 유출 징후로 판단한다.
          <br />
          FDS(Fraud Detection System, 이상거래탐지시스템)는 금융/가상자산 거래에 특화된 탐지 체계로, 평소와 다른 거래 패턴(금액, 빈도, 시간대, 상대방)을 실시간으로 감시한다.
        </p>

        <DetectionToolsInline />

        <h3 className="text-xl font-semibold mt-8 mb-4">로그 모니터링</h3>
        <p className="leading-7">
          효과적인 탐지를 위해서는 로그의 실시간 수집과 중앙 집중 관리가 필수다.
          <br />
          시스템 로그는 OS 수준의 이벤트(로그인 시도, 프로세스 생성, 파일 접근)를 기록한다.
          네트워크 로그는 방화벽, 라우터, 스위치의 트래픽 기록으로, 외부와의 비정상적 통신을 추적하는 데 쓰인다.
          <br />
          애플리케이션 로그는 웹 서버, API 서버, DB 서버 등 개별 서비스의 동작 기록이다.
          로그인 실패 기록, 권한 변경 이력, 쿼리 실행 내역 등이 포함된다.
        </p>
        <p className="leading-7">
          로그 수집 시 시간 동기화(NTP, Network Time Protocol)는 반드시 선행되어야 한다.
          <br />
          서버마다 시간이 어긋나면 사고 타임라인 재구성이 불가능하므로, 전체 시스템을 단일 NTP 서버에 동기화한다.
          <br />
          로그는 최소 6개월 이상 보관하며, 개인정보보호법이나 전자금융감독규정에 따라 보관 기간이 더 길어질 수 있다.
          원본 로그의 무결성을 보장하기 위해 WORM(Write Once Read Many) 스토리지나 해시 체인을 적용하는 것이 권장된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">초동 대응</h3>
        <p className="leading-7">
          사고가 확인되면 가장 먼저 해야 할 일은 감염 시스템을 네트워크에서 격리하는 것이다.
          <br />
          격리의 목적은 두 가지다 -- 공격자의 추가 침투를 차단하고, 감염이 다른 시스템으로 전파(lateral movement)되는 것을 막는다.
          물리적으로 네트워크 케이블을 뽑거나, 스위치 포트를 비활성화하거나, 방화벽 규칙으로 해당 IP를 차단한다.
        </p>
        <p className="leading-7">
          격리와 동시에 증거 보전(포렌식)을 시작한다.
          <br />
          포렌식(Digital Forensics)은 디지털 증거를 법적으로 유효한 형태로 수집하고 분석하는 절차다.
          감염 시스템의 메모리 덤프(RAM 내용 추출), 디스크 이미지(bit-for-bit 복제), 네트워크 패킷 캡처를 확보한다.
          <br />
          증거 수집 시 원본을 훼손하지 않는 것이 원칙이므로, 쓰기 방지(write blocker) 장치를 사용하여 디스크를 복제한다.
          수집 과정은 해시값(SHA-256 등)으로 무결성을 검증하고, 증거 보관 체인(chain of custody)을 기록한다.
        </p>
        <p className="leading-7">
          영향 범위 파악은 초동 대응의 마지막 단계다.
          <br />
          감염 시스템이 접근했던 다른 서버, 데이터베이스, 외부 서비스를 로그 분석으로 추적한다.
          유출된 데이터의 종류(개인정보, 금융정보, 영업비밀)와 규모를 파악하여 보고 의무 여부를 결정한다.
        </p>

        <ContainmentProcInline />

        <h3 className="text-xl font-semibold mt-8 mb-4">봉쇄</h3>
        <p className="leading-7">
          봉쇄(Containment)는 공격 경로를 완전히 차단하는 단계다.
          <br />
          공격자가 이용한 취약점에 임시 패치(hotfix)를 적용하거나, 해당 서비스를 일시 중단한다.
          침해된 계정은 즉시 잠금(lock) 처리하고, 비밀번호를 강제 초기화한다.
          <br />
          공격자가 심어둔 백도어(backdoor, 재침입을 위한 숨겨진 접근 경로)가 없는지 전체 시스템을 점검한다.
          백도어는 웹셸(webshell), 변조된 SSH 키, 스케줄러에 등록된 악성 스크립트 형태로 존재할 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">내부 사고 대응 절차</h3>
        <p className="leading-7">
          VASP(가상자산사업자) 환경에서 내부 사고는 자산 유출로 직결될 수 있으므로 별도 절차가 필요하다.
          <br />
          비정상 출금이 감지되면 즉시 지갑 출금을 정지한다.
          정지와 동시에 해당 지갑과 연관된 모든 계정을 동결(freeze)하여 추가 이체를 차단한다.
          <br />
          블록체인 분석 도구를 활용하여 유출된 자산의 이동 경로를 추적한다.
          온체인(on-chain) 데이터를 분석하면 자금이 어떤 주소로 분산되었는지, 어떤 거래소로 입금되었는지 파악할 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">외부 사고 대응 절차</h3>
        <p className="leading-7">
          외부 공격에 의한 사고는 FDS 자동 보류에서 시작한다.
          <br />
          FDS가 이상 패턴을 감지하면 해당 거래를 자동으로 보류(hold) 상태로 전환한다.
          보류된 거래의 계정을 정지시키고, 계정 소유자에게 본인 확인 절차를 요청한다.
          <br />
          본인이 아닌 거래로 확인되면 고객에게 즉시 통지하고, 비밀번호 변경과 MFA(다중인증) 재설정을 안내한다.
          피해 규모에 따라 유관기관 신고와 병행하여 처리한다.
        </p>
      </div>
    </section>
  );
}
