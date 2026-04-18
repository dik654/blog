import SiemMonitoringViz from './viz/SiemMonitoringViz';
import SiemCorrelationInline from './viz/SiemCorrelationInline';
import LogRetentionInline from './viz/LogRetentionInline';

export default function SiemMonitoring() {
  return (
    <section id="siem-monitoring" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SIEM과 통합 모니터링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SiemMonitoringViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">SIEM이란</h3>
        <p>
          SIEM(Security Information and Event Management)은 조직 내 모든 보안 장비와 시스템의 로그를 중앙에서 수집하고,
          상관분석(Correlation)을 통해 단일 장비로는 발견할 수 없는 공격 시나리오를 탐지하는 플랫폼.<br />
          "보안 관제의 두뇌" 역할 — 방화벽, IDS/IPS, WAF, 서버, DB, 인증 시스템 등 모든 곳의 로그를 한 곳에 모아 분석한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 필요한가</h3>
        <p>
          개별 보안 장비의 로그만으로는 공격의 전체 그림(Kill Chain, 공격 단계)을 파악할 수 없다.<br />
          공격자는 여러 단계를 거쳐 목표에 도달하며, 각 단계의 흔적이 서로 다른 장비에 남는다.
        </p>
        <ul>
          <li><strong>방화벽 로그</strong>만 보면 — "외부 IP에서 포트 스캔이 있었다" (그 후 무슨 일이 있었는지 모름)</li>
          <li><strong>인증 로그</strong>만 보면 — "관리자 계정 로그인 실패가 50회 발생했다" (어디서 시도했는지 모름)</li>
          <li><strong>IPS 로그</strong>만 보면 — "SQL Injection 시도가 차단되었다" (같은 공격자가 다른 경로로 시도하는지 모름)</li>
        </ul>
        <p>
          SIEM이 이 세 로그를 상관분석하면: "특정 외부 IP → 포트 스캔(방화벽) → 로그인 무차별 대입(인증) → SQL Injection 시도(IPS)"라는 공격 체인을 하나의 사건으로 연결할 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">수집 대상</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">로그 소스</th>
                <th className="text-left px-3 py-2 border-b border-border">수집 내용</th>
                <th className="text-left px-3 py-2 border-b border-border">활용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">방화벽 / UTM</td>
                <td className="px-3 py-1.5 border-b border-border/30">허용/차단 트래픽 로그, 세션 정보</td>
                <td className="px-3 py-1.5 border-b border-border/30">비인가 접근 시도, 아웃바운드 이상 트래픽 탐지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">IDS/IPS</td>
                <td className="px-3 py-1.5 border-b border-border/30">탐지/차단 이벤트, 시그니처 매칭 로그</td>
                <td className="px-3 py-1.5 border-b border-border/30">공격 유형 분류, 오탐/미탐 분석</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">WAF</td>
                <td className="px-3 py-1.5 border-b border-border/30">웹 공격 탐지 로그, 차단된 요청 상세</td>
                <td className="px-3 py-1.5 border-b border-border/30">웹 공격 트렌드 분석, 특정 URL 대상 공격 집중 탐지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">서버 (OS)</td>
                <td className="px-3 py-1.5 border-b border-border/30">로그인 이벤트, 프로세스 실행, 파일 변경</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 침투 후 행위 탐지, 악성코드 실행 흔적</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">데이터베이스</td>
                <td className="px-3 py-1.5 border-b border-border/30">쿼리 로그, 접근 이력, 권한 변경</td>
                <td className="px-3 py-1.5 border-b border-border/30">대량 데이터 조회, 비인가 테이블 접근 탐지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">애플리케이션</td>
                <td className="px-3 py-1.5 border-b border-border/30">에러 로그, 비즈니스 로직 이벤트</td>
                <td className="px-3 py-1.5 border-b border-border/30">비정상 API 호출, 출금 요청 이상 패턴</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">인증 시스템</td>
                <td className="px-3 py-1.5">로그인 성공/실패, MFA 인증 이벤트, 세션 관리</td>
                <td className="px-3 py-1.5">크리덴셜 스터핑, 계정 탈취 시도 탐지</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">수집 방식</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">방식</th>
                <th className="text-left px-3 py-2 border-b border-border">동작</th>
                <th className="text-left px-3 py-2 border-b border-border">적합 대상</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Syslog</td>
                <td className="px-3 py-1.5 border-b border-border/30">장비가 SIEM으로 로그를 자동 전송 (UDP 514 또는 TCP 514)</td>
                <td className="px-3 py-1.5 border-b border-border/30">방화벽, 스위치, 라우터 등 네트워크 장비</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">SNMP (Simple Network Management Protocol)</td>
                <td className="px-3 py-1.5 border-b border-border/30">네트워크 장비 상태(CPU, 메모리, 인터페이스)를 주기적으로 폴링</td>
                <td className="px-3 py-1.5 border-b border-border/30">네트워크 장비 상태 모니터링</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Agent (에이전트)</td>
                <td className="px-3 py-1.5 border-b border-border/30">서버에 설치한 소프트웨어가 로그를 수집하여 SIEM으로 전송</td>
                <td className="px-3 py-1.5 border-b border-border/30">서버 OS 로그, 애플리케이션 로그</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">API 연동</td>
                <td className="px-3 py-1.5">SIEM이 외부 서비스의 API를 호출하여 로그 수집</td>
                <td className="px-3 py-1.5">클라우드 서비스(AWS CloudTrail, Azure AD 등)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SiemCorrelationInline />

        <h3 className="text-xl font-semibold mt-6 mb-3">상관분석 (Correlation)</h3>
        <p>
          상관분석은 SIEM의 핵심 기능.<br />
          서로 다른 소스에서 발생한 이벤트들을 시간순으로 연결하여 공격 시나리오를 재구성한다.<br />
          이를 위해 모든 로그의 필드를 공통 형식으로 정규화(Normalization)하는 전처리가 필수.
        </p>
        <p>
          정규화란: 각 장비마다 다른 로그 형식을 통일된 필드명으로 변환하는 과정.<br />
          예를 들어, 방화벽은 "src_ip", IPS는 "source_address", 서버는 "remote_addr"로 같은 정보를 다르게 표현한다.
          이를 모두 "s_ip"(출발지 IP)라는 공통 필드로 매핑해야 상관분석이 가능하다.
        </p>

        <p className="mt-4"><strong>상관분석 시나리오 예시:</strong></p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">로그 소스</th>
                <th className="text-left px-3 py-2 border-b border-border">이벤트</th>
                <th className="text-left px-3 py-2 border-b border-border">개별로 보면</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1</td>
                <td className="px-3 py-1.5 border-b border-border/30">방화벽</td>
                <td className="px-3 py-1.5 border-b border-border/30">외부 IP 203.0.113.5에서 포트 1-1024 스캔</td>
                <td className="px-3 py-1.5 border-b border-border/30">흔한 스캔 — 경미한 이벤트</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2</td>
                <td className="px-3 py-1.5 border-b border-border/30">인증 시스템</td>
                <td className="px-3 py-1.5 border-b border-border/30">같은 IP에서 SSH 로그인 실패 30회 (5분 내)</td>
                <td className="px-3 py-1.5 border-b border-border/30">브루트포스 — 중간 수준 이벤트</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3</td>
                <td className="px-3 py-1.5 border-b border-border/30">IPS</td>
                <td className="px-3 py-1.5 border-b border-border/30">같은 IP에서 SQL Injection 시도 탐지</td>
                <td className="px-3 py-1.5 border-b border-border/30">웹 공격 — 중간 수준 이벤트</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">상관분석</td>
                <td className="px-3 py-1.5">SIEM</td>
                <td className="px-3 py-1.5">동일 출발지 IP의 3개 이벤트를 하나의 공격 체인으로 연결</td>
                <td className="px-3 py-1.5 text-red-500 font-medium">높은 위험 — 즉각 대응 필요</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">대시보드와 알림</h3>
        <p>
          SIEM 대시보드는 보안 관제 센터(SOC, Security Operation Center)의 주요 화면 구성 요소:
        </p>
        <ul>
          <li><strong>실시간 위협 현황</strong> — 현재 탐지된 이벤트 수, 심각도별 분류(Critical/High/Medium/Low), 공격 유형 분포</li>
          <li><strong>이벤트 트렌드</strong> — 시간별/일별 이벤트 발생 추이. 급격한 증가는 공격 진행 또는 새로운 취약점 악용을 시사</li>
          <li><strong>Top 공격 IP / Top 타깃</strong> — 가장 많은 공격을 시도하는 출발지 IP, 가장 많은 공격을 받는 내부 자산</li>
          <li><strong>미처리 알림</strong> — 아직 분석/대응되지 않은 알림 목록. SLA(Service Level Agreement) 기준에 따라 대응 시한 관리</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">SOAR (Security Orchestration, Automation and Response)</h3>
        <p>
          SOAR는 SIEM이 탐지한 이벤트에 대해 자동으로 대응 조치를 실행하는 시스템.<br />
          SIEM이 "탐지"라면 SOAR는 "자동 대응"에 해당한다.
        </p>
        <ul>
          <li><strong>플레이북(Playbook)</strong> — 특정 유형의 이벤트에 대한 사전 정의된 대응 절차. 예: "브루트포스 탐지 → 해당 IP 방화벽 자동 차단 → 담당자 알림 → 티켓 생성"</li>
          <li><strong>자동화 범위</strong> — IP 차단, 계정 잠금, 격리 VLAN 이동, 악성 파일 삭제 등 반복적 대응 작업을 자동화하여 대응 시간(MTTR, Mean Time to Respond)을 단축</li>
          <li><strong>인간 승인 단계</strong> — 서비스 영향이 큰 조치(서버 격리, 전체 IP 대역 차단 등)는 자동 실행 전에 관리자 승인을 거치도록 설정</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 SIEM 솔루션</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">솔루션</th>
                <th className="text-left px-3 py-2 border-b border-border">특징</th>
                <th className="text-left px-3 py-2 border-b border-border">적합 환경</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Splunk</td>
                <td className="px-3 py-1.5 border-b border-border/30">강력한 검색 엔진(SPL), 대규모 데이터 처리, 풍부한 앱 마켓</td>
                <td className="px-3 py-1.5 border-b border-border/30">대규모 조직, 복잡한 분석 요구</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Elastic SIEM</td>
                <td className="px-3 py-1.5 border-b border-border/30">Elasticsearch 기반 오픈소스, ELK 스택 활용</td>
                <td className="px-3 py-1.5 border-b border-border/30">비용 효율 중시, 커스터마이징 필요</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">IBM QRadar</td>
                <td className="px-3 py-1.5 border-b border-border/30">자동 상관분석, 네트워크 플로우 분석 내장</td>
                <td className="px-3 py-1.5 border-b border-border/30">엔터프라이즈, 규제 준수 중시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">국산 솔루션</td>
                <td className="px-3 py-1.5">SPiDER TM(이글루코퍼레이션), eyeCloudSIM(시큐레이어) 등 — 국내 규제 대응, 한글 지원</td>
                <td className="px-3 py-1.5">국내 중소·중견 조직, ISMS 인증 대응</td>
              </tr>
            </tbody>
          </table>
        </div>

        <LogRetentionInline />

        <h3 className="text-xl font-semibold mt-6 mb-3">로그 보관 정책</h3>
        <p>
          ISMS는 보안 관련 로그의 최소 보관 기간을 요구한다.<br />
          법적 요구사항과 ISMS 심사 기준에 따라 보관 기간을 설정해야 한다.
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">로그 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">최소 보관 기간</th>
                <th className="text-left px-3 py-2 border-b border-border">근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">접속 기록 (서버, DB)</td>
                <td className="px-3 py-1.5 border-b border-border/30">6개월 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">ISMS 2.9.4 (로그관리 및 모니터링)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">개인정보 접속 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">1년 이상 (5만 건 이상 처리 시 2년)</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보보호법 시행령</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래 기록 (VASP)</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">특정금융정보법</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">보안 이벤트 로그</td>
                <td className="px-3 py-1.5">1년 이상 (권장 3년)</td>
                <td className="px-3 py-1.5">ISMS 심사 관행, 포렌식 목적</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          로그 보관 시 무결성 보장이 중요 — 로그가 위변조되면 사고 조사와 법적 증거로서의 가치를 잃는다.<br />
          WORM(Write Once Read Many) 스토리지, 해시값 기록, 별도 로그 서버 분리 등의 조치를 적용해야 한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} SIEM 도입의 현실적 고려</strong><br />
          SIEM은 도입만으로 끝나지 않는다 — 수집 로그의 정규화, 상관분석 규칙 작성, 오탐 튜닝, 대시보드 커스터마이징까지
          최소 3~6개월의 안정화 기간이 필요하다.
          "로그만 모아 놓으면 된다"는 접근은 실패의 지름길.
          핵심 자산부터 우선 연동하고, 단계적으로 수집 범위를 확대하는 것이 현실적 전략.
        </p>

      </div>
    </section>
  );
}
