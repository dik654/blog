import WafVpnViz from './viz/WafVpnViz';
import WafDeployInline from './viz/WafDeployInline';
import VpnNacInline from './viz/VpnNacInline';

export default function WafVpn() {
  return (
    <section id="waf-vpn" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WAF와 VPN</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <WafVpnViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">WAF (Web Application Firewall, 웹 애플리케이션 방화벽)</h3>
        <p>
          WAF는 HTTP/HTTPS 트래픽을 분석하여 웹 애플리케이션 레벨의 공격을 차단하는 보안 장비.<br />
          네트워크 방화벽이 IP와 포트(L3-4)를 기준으로 필터링한다면,
          WAF는 HTTP 요청의 헤더, 쿠키, 본문(Body), URL 파라미터 등 애플리케이션 데이터(L7)를 검사한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">WAF vs 네트워크 방화벽</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">네트워크 방화벽</th>
                <th className="text-left px-3 py-2 border-b border-border">WAF</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">계층</td>
                <td className="px-3 py-1.5 border-b border-border/30">L3-4 (네트워크/전송)</td>
                <td className="px-3 py-1.5 border-b border-border/30">L7 (애플리케이션)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">검사 대상</td>
                <td className="px-3 py-1.5 border-b border-border/30">IP 주소, 포트 번호, 프로토콜</td>
                <td className="px-3 py-1.5 border-b border-border/30">HTTP 헤더, URL, 쿠키, 요청 본문</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">차단 대상</td>
                <td className="px-3 py-1.5 border-b border-border/30">비인가 IP, 비허용 포트 접근</td>
                <td className="px-3 py-1.5 border-b border-border/30">SQL Injection, XSS, CSRF 등 웹 공격</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">상호보완</td>
                <td className="px-3 py-1.5">포트 80/443을 열면 그 안의 공격은 차단 불가</td>
                <td className="px-3 py-1.5">포트가 열려 있어야 동작하므로, 방화벽이 1차 필터 역할</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">WAF 주요 탐지 대상</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">공격 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">설명</th>
                <th className="text-left px-3 py-2 border-b border-border">WAF 탐지 방식</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">SQL Injection</td>
                <td className="px-3 py-1.5 border-b border-border/30">입력값에 SQL 구문을 삽입하여 DB를 조작하는 공격</td>
                <td className="px-3 py-1.5 border-b border-border/30">요청 파라미터에서 SQL 예약어(SELECT, UNION, DROP 등) 패턴 탐지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">XSS (Cross-Site Scripting)</td>
                <td className="px-3 py-1.5 border-b border-border/30">악성 스크립트를 삽입하여 사용자 브라우저에서 실행시키는 공격</td>
                <td className="px-3 py-1.5 border-b border-border/30">{'<script>'} 태그, 이벤트 핸들러(onload, onerror 등) 패턴 탐지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CSRF (Cross-Site Request Forgery)</td>
                <td className="px-3 py-1.5 border-b border-border/30">사용자 의지와 무관하게 요청을 위조하여 행동을 강제하는 공격</td>
                <td className="px-3 py-1.5 border-b border-border/30">Referer 헤더 검증, CSRF 토큰 부재 탐지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">파일 업로드 공격</td>
                <td className="px-3 py-1.5 border-b border-border/30">악성 파일(웹셸 등)을 서버에 업로드하여 원격 제어를 확보하는 공격</td>
                <td className="px-3 py-1.5 border-b border-border/30">파일 확장자 검사, 콘텐츠 타입 불일치 탐지, 실행 파일 차단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">봇(Bot) 차단</td>
                <td className="px-3 py-1.5">자동화 도구를 이용한 무차별 대입, 스크래핑, API 남용</td>
                <td className="px-3 py-1.5">요청 빈도 제한(Rate Limiting), CAPTCHA 연동, User-Agent 패턴 분석</td>
              </tr>
            </tbody>
          </table>
        </div>

        <WafDeployInline />

        <h3 className="text-xl font-semibold mt-6 mb-3">WAF 배치: 리버스 프록시 모드</h3>
        <p>
          WAF의 가장 일반적인 배치 방식은 리버스 프록시(Reverse Proxy) 모드.<br />
          클라이언트 → WAF → 웹서버 순서로 트래픽이 흐른다.<br />
          클라이언트는 WAF의 IP에 접속하고, WAF가 검사를 통과한 요청만 실제 웹서버로 전달한다.
        </p>
        <ul>
          <li><strong>장점</strong> — 웹서버의 실제 IP를 숨겨 직접 공격 방지. SSL 종료(SSL Termination)를 WAF에서 처리하여 HTTPS 트래픽도 검사 가능</li>
          <li><strong>단점</strong> — WAF가 모든 트래픽의 경유지가 되므로 성능 병목 가능. WAF 장애 시 서비스 중단 위험 (이중화 필수)</li>
        </ul>
        <p>
          클라우드 환경에서는 클라우드 WAF(AWS WAF, Cloudflare WAF 등)를 사용하여 별도 장비 없이 구성 가능.<br />
          온프레미스 환경에서는 전용 WAF 어플라이언스를 DMZ 앞단에 배치한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">VPN (Virtual Private Network, 가상 사설 네트워크)</h3>
        <p>
          VPN은 공용 인터넷 위에 암호화된 터널을 생성하여 안전한 통신 채널을 제공하는 기술.<br />
          외부에서 내부 네트워크에 접근해야 할 때 — 원격 근무, 지사 연결, 파트너 접속 등 — VPN을 사용한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">VPN 유형: IPSec vs SSL VPN</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">IPSec VPN</th>
                <th className="text-left px-3 py-2 border-b border-border">SSL VPN</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">용도</td>
                <td className="px-3 py-1.5 border-b border-border/30">사이트 간 연결 (Site-to-Site) — 본사↔지사</td>
                <td className="px-3 py-1.5 border-b border-border/30">원격 접속 (Remote Access) — 개인 PC↔사내망</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">프로토콜</td>
                <td className="px-3 py-1.5 border-b border-border/30">IPSec (L3) — IP 패킷 전체를 암호화</td>
                <td className="px-3 py-1.5 border-b border-border/30">TLS/SSL (L4-7) — TCP 세션을 암호화</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">클라이언트</td>
                <td className="px-3 py-1.5 border-b border-border/30">전용 VPN 클라이언트 소프트웨어 필요</td>
                <td className="px-3 py-1.5 border-b border-border/30">웹 브라우저만으로 접속 가능 (Clientless 모드)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">접근 범위</td>
                <td className="px-3 py-1.5 border-b border-border/30">네트워크 전체에 대한 접근 (Full Tunnel)</td>
                <td className="px-3 py-1.5 border-b border-border/30">특정 애플리케이션/서비스만 접근 가능 (세밀한 제어)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">관리 편의성</td>
                <td className="px-3 py-1.5">양쪽 장비 설정 필요, 네트워크 변경 시 재설정</td>
                <td className="px-3 py-1.5">사용자 단에서 간편, 관리자 측에서도 접근 정책 세밀 설정</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          원격 근무 환경에서는 SSL VPN이 주로 사용된다 — 사용자가 전용 소프트웨어 없이 웹 브라우저로 접속 가능하므로 배포·관리가 용이.<br />
          사이트 간 상시 연결(본사↔데이터센터)에는 IPSec VPN이 적합 — 네트워크 계층에서의 안정적 터널링을 제공.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">VPN + MFA: ISMS 필수 요구</h3>
        <p>
          ISMS 2.6.6(원격 접근 통제)은 원격 접속 시 추가 인증을 요구한다.<br />
          VPN 접속 시 ID/PW만으로는 부족하고, MFA(Multi-Factor Authentication, 다중 인증)를 반드시 적용해야 한다.
        </p>
        <ul>
          <li><strong>OTP (One-Time Password)</strong> — 시간 기반 일회용 비밀번호. Google Authenticator, 하드웨어 OTP 토큰 등</li>
          <li><strong>인증서 기반</strong> — 클라이언트 인증서가 설치된 단말만 VPN 접속 허용. 인증서가 없는 개인 기기는 접속 불가</li>
          <li><strong>생체 인증</strong> — 지문, 안면 인식 등. 모바일 기기에서 VPN 접속 시 활용</li>
        </ul>
        <p>
          VPN 인증 로그(접속 시간, IP, 사용자, 접속 시간)는 반드시 기록하고 SIEM으로 전송.<br />
          비정상 접속 패턴(심야 시간대 접속, 해외 IP, 동시 다중 세션) 탐지에 활용한다.
        </p>

        <VpnNacInline />

        <h3 className="text-xl font-semibold mt-6 mb-3">NAC (Network Access Control, 네트워크 접근 제어)</h3>
        <p>
          NAC는 단말기가 네트워크에 접속하기 전에 보안 상태를 검증하는 솔루션.<br />
          "이 기기는 안전한가?"를 확인한 후에만 네트워크 접근을 허용한다.
        </p>
        <ul>
          <li><strong>검증 항목</strong> — 안티바이러스 설치 여부, OS 패치 최신 여부, 비인가 소프트웨어 설치 여부, 화면 잠금 설정 여부</li>
          <li><strong>미충족 시 조치</strong> — 네트워크 접속 차단 또는 격리 VLAN(Virtual LAN, 가상 랜)으로 전환. 격리 VLAN에서는 보안 업데이트 서버만 접근 가능</li>
          <li><strong>802.1X 연동</strong> — 네트워크 포트 수준에서 인증을 수행. 인증되지 않은 단말은 물리적 포트에 연결해도 통신 불가</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} WAF + VPN + NAC의 조합</strong><br />
          이 세 가지는 서로 다른 관점에서 접근을 통제한다.
          WAF는 "어떤 요청인가"(애플리케이션 레벨), VPN은 "어디서 접속하는가"(네트워크 터널),
          NAC는 "이 기기는 안전한가"(단말 상태).
          세 가지를 조합하면 "검증된 기기에서, 안전한 터널을 통해, 정상적인 요청만" 허용하는 다계층 접근 통제가 완성된다.
        </p>

      </div>
    </section>
  );
}
