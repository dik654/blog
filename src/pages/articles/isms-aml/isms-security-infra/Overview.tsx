import OverviewViz from './viz/OverviewViz';
import DefenseLayersInline from './viz/DefenseLayersInline';
import IsmsLinkInline from './viz/IsmsLinkInline';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보안 인프라 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <OverviewViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">다계층 방어 (Defense in Depth)</h3>
        <p>
          보안 인프라는 단일 장비가 아니라 여러 계층으로 구성된 방어 체계.<br />
          "심층 방어(Defense in Depth)"란, 공격자가 한 계층을 뚫더라도 다음 계층에서 차단하는 전략을 뜻한다.<br />
          군사 용어에서 유래 — 전방 방어선이 뚫리면 후방 방어선이 작동하는 것과 같은 원리.
        </p>

        <p>
          네트워크 보안 장비의 배치는 외부에서 내부로 향하는 트래픽 흐름을 기준으로 설계한다.
          각 단계에서 서로 다른 종류의 위협을 걸러내므로, 하나의 장비에 모든 것을 의존해서는 안 된다.
        </p>

        <DefenseLayersInline />

        <h3 className="text-xl font-semibold mt-6 mb-3">네트워크 보안 장비 배치 흐름</h3>
        <p>
          외부(인터넷)에서 내부(업무망)까지 트래픽이 거치는 보안 계층:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">순서</th>
                <th className="text-left px-3 py-2 border-b border-border">구간</th>
                <th className="text-left px-3 py-2 border-b border-border">배치 장비</th>
                <th className="text-left px-3 py-2 border-b border-border">차단 대상</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1</td>
                <td className="px-3 py-1.5 border-b border-border/30">인터넷 → 경계</td>
                <td className="px-3 py-1.5 border-b border-border/30">외부 방화벽 / UTM</td>
                <td className="px-3 py-1.5 border-b border-border/30">비인가 포트, IP 기반 차단, DDoS 1차 필터</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2</td>
                <td className="px-3 py-1.5 border-b border-border/30">경계 → DMZ</td>
                <td className="px-3 py-1.5 border-b border-border/30">IPS, WAF</td>
                <td className="px-3 py-1.5 border-b border-border/30">알려진 공격 시그니처, 웹 공격(SQL Injection, XSS)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3</td>
                <td className="px-3 py-1.5 border-b border-border/30">DMZ (비무장지대)</td>
                <td className="px-3 py-1.5 border-b border-border/30">웹서버, 리버스 프록시, VPN 게이트웨이</td>
                <td className="px-3 py-1.5 border-b border-border/30">외부 노출 최소화 — 내부 서버 직접 노출 방지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">4</td>
                <td className="px-3 py-1.5 border-b border-border/30">DMZ → 내부망</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 방화벽</td>
                <td className="px-3 py-1.5 border-b border-border/30">DMZ 서버가 탈취당해도 내부망 접근 차단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">5</td>
                <td className="px-3 py-1.5">내부망</td>
                <td className="px-3 py-1.5">NAC, 호스트 방화벽, EDR</td>
                <td className="px-3 py-1.5">내부 측면 이동(Lateral Movement), 비인가 단말</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          DMZ(DeMilitarized Zone, 비무장지대)는 외부와 내부 사이의 완충 지대.<br />
          웹서버, 메일서버 등 외부에서 접근해야 하는 서버만 DMZ에 배치하고,
          DB, 업무 시스템 등 핵심 자산은 내부망에 격리한다.<br />
          DMZ 서버가 공격자에게 장악되더라도 내부망으로의 추가 침투를 내부 방화벽이 차단한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">각 계층의 역할</h3>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">계층</th>
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">대표 장비</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">경계 방어</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 네트워크와 외부 인터넷의 경계에서 1차 필터링</td>
                <td className="px-3 py-1.5 border-b border-border/30">방화벽, UTM, 라우터 ACL</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">세그멘테이션</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 네트워크를 업무 영역별로 분리 — 침해 확산 방지</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 방화벽, VLAN, 마이크로세그멘테이션</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">엔드포인트</td>
                <td className="px-3 py-1.5 border-b border-border/30">개별 서버·PC 단위 보호 — 악성코드, 비인가 프로세스 차단</td>
                <td className="px-3 py-1.5 border-b border-border/30">EDR(Endpoint Detection and Response), 안티바이러스, NAC</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">모니터링</td>
                <td className="px-3 py-1.5">모든 계층의 로그를 수집·분석하여 공격 전조를 탐지</td>
                <td className="px-3 py-1.5">SIEM, SOC(Security Operation Center), IDS</td>
              </tr>
            </tbody>
          </table>
        </div>

        <IsmsLinkInline />

        <h3 className="text-xl font-semibold mt-6 mb-3">ISMS 보호대책 연계</h3>
        <p>
          보안 인프라는 ISMS 보호대책 중 여러 영역과 직접 연결된다:
        </p>
        <ul>
          <li><strong>2.6 접근통제</strong> — 방화벽 규칙, 네트워크 세그멘테이션, VPN 접근 정책이 해당. 비인가 트래픽이 내부로 유입되지 않도록 통제</li>
          <li><strong>2.10 시스템 개발 보안</strong> — WAF 배치, 시큐어 코딩과 연계하여 웹 애플리케이션 계층 보호. 개발 단계의 취약점을 WAF가 런타임에서 보완</li>
          <li><strong>2.11 침해사고 관리</strong> — IDS/IPS의 탐지 결과가 사고 대응 프로세스의 입력. SIEM이 탐지한 이상 징후를 사고 대응팀(CSIRT)이 분석</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">보안 장비 종류 한눈에</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">장비</th>
                <th className="text-left px-3 py-2 border-b border-border">정식 명칭</th>
                <th className="text-left px-3 py-2 border-b border-border">핵심 기능</th>
                <th className="text-left px-3 py-2 border-b border-border">OSI 계층</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">방화벽</td>
                <td className="px-3 py-1.5 border-b border-border/30">Firewall</td>
                <td className="px-3 py-1.5 border-b border-border/30">IP/포트 기반 트래픽 허용·차단</td>
                <td className="px-3 py-1.5 border-b border-border/30">L3-4</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">UTM</td>
                <td className="px-3 py-1.5 border-b border-border/30">Unified Threat Management</td>
                <td className="px-3 py-1.5 border-b border-border/30">방화벽 + IPS + VPN + AV + URL 필터 통합</td>
                <td className="px-3 py-1.5 border-b border-border/30">L3-7</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">IDS</td>
                <td className="px-3 py-1.5 border-b border-border/30">Intrusion Detection System</td>
                <td className="px-3 py-1.5 border-b border-border/30">침입 탐지 + 관리자 알림 (차단 불가)</td>
                <td className="px-3 py-1.5 border-b border-border/30">L3-7</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">IPS</td>
                <td className="px-3 py-1.5 border-b border-border/30">Intrusion Prevention System</td>
                <td className="px-3 py-1.5 border-b border-border/30">침입 탐지 + 자동 차단 (인라인 배치)</td>
                <td className="px-3 py-1.5 border-b border-border/30">L3-7</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">WAF</td>
                <td className="px-3 py-1.5 border-b border-border/30">Web Application Firewall</td>
                <td className="px-3 py-1.5 border-b border-border/30">HTTP/HTTPS 공격 차단 (SQLi, XSS 등)</td>
                <td className="px-3 py-1.5 border-b border-border/30">L7</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">VPN</td>
                <td className="px-3 py-1.5 border-b border-border/30">Virtual Private Network</td>
                <td className="px-3 py-1.5 border-b border-border/30">암호화 터널을 통한 원격 안전 접속</td>
                <td className="px-3 py-1.5 border-b border-border/30">L3-4</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">NAC</td>
                <td className="px-3 py-1.5 border-b border-border/30">Network Access Control</td>
                <td className="px-3 py-1.5 border-b border-border/30">단말 보안 상태 검증 후 네트워크 접근 허용</td>
                <td className="px-3 py-1.5 border-b border-border/30">L2-3</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">SIEM</td>
                <td className="px-3 py-1.5">Security Information and Event Management</td>
                <td className="px-3 py-1.5">로그 수집 + 상관분석 + 실시간 알림</td>
                <td className="px-3 py-1.5">전 계층</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP 보안 인프라의 특수성</strong><br />
          일반 기업과 달리 VASP는 블록체인 노드, 핫월렛 서버, 서명 서버 등 암호화폐 특화 인프라를 운영.
          이 서버들은 내부망 중에서도 별도의 격리 구간(Wallet Zone)에 배치하고,
          접근 가능한 인원을 물리적·논리적으로 극도로 제한해야 한다.
          일반 업무망에서 Wallet Zone으로의 직접 접근은 전면 차단하고,
          점프 서버(Jump Server) + MFA(Multi-Factor Authentication, 다중 인증)를 통해서만 접근하는 것이 표준 구성.
        </p>

      </div>
    </section>
  );
}
