export default function NetworkSegmentation() {
  return (
    <section id="network-segmentation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">망분리와 네트워크 보안</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">왜 망분리가 필요한가</h3>
        <p>
          망분리(Network Segmentation)는 네트워크를 보안 수준이 다른 구간으로 나누어 구간 간 통신을 제한하는 것.<br />
          모든 서버가 하나의 네트워크에 있으면 웹서버 하나가 뚫리는 순간 DB 서버까지 도달하는 데 장벽이 없다.<br />
          이를 측면 이동(Lateral Movement)이라 하며, 실제 침해사고의 대부분은 초기 침투 후 측면 이동을 통해 핵심 자산에 도달하는 패턴을 따른다.
        </p>

        <p>
          ISMS 2.6.1은 "서비스 및 네트워크를 보안 등급에 따라 분리하고, 접근을 통제하라"는 요구사항.<br />
          VASP는 특히 고객 자산(지갑)과 개인정보(KYC 데이터)를 보호해야 하므로 망분리의 중요성이 더 크다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3-Zone 설계</h3>
        <p>
          가장 일반적인 망분리 모델은 3개 구간(Zone)으로 나누는 것.<br />
          외부에서 내부로 갈수록 보안 수준이 높아지며, 구간 간 통신은 방화벽을 통해서만 가능.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구간</th>
                <th className="text-left px-3 py-2 border-b border-border">배치 자원</th>
                <th className="text-left px-3 py-2 border-b border-border">허용 접근</th>
                <th className="text-left px-3 py-2 border-b border-border">보안 수준</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">DMZ</td>
                <td className="px-3 py-1.5 border-b border-border/30">웹서버, API Gateway, SSL 종단, CDN 오리진</td>
                <td className="px-3 py-1.5 border-b border-border/30">외부(인터넷) → DMZ: HTTP/HTTPS만 허용</td>
                <td className="px-3 py-1.5 border-b border-border/30">중</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">서비스망</td>
                <td className="px-3 py-1.5 border-b border-border/30">WAS(Web Application Server), API 서버, 매칭엔진, 블록체인 노드</td>
                <td className="px-3 py-1.5 border-b border-border/30">DMZ → 서비스망: 특정 포트만. 외부 직접 접근 차단</td>
                <td className="px-3 py-1.5 border-b border-border/30">상</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">내부망</td>
                <td className="px-3 py-1.5">DB, 관리 콘솔, 월렛 서버, 로그 서버, 백업 스토리지</td>
                <td className="px-3 py-1.5">서비스망 → 내부망: DB 포트만. 관리 접근은 점프서버 경유</td>
                <td className="px-3 py-1.5">최상</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">DMZ(Demilitarized Zone, 비무장지대)</h3>
        <p>
          외부 인터넷과 내부 네트워크 사이에 위치하는 완충 구간.<br />
          외부에 직접 노출되는 서비스를 이 구간에 배치하여, 침해 시에도 내부망까지의 도달을 차단.
        </p>
        <ul>
          <li><strong>웹서버/리버스 프록시</strong> — HTTPS 요청을 수신하여 서비스망의 WAS로 전달. 정적 리소스 캐싱, SSL/TLS 종단(Termination, 암호화된 통신을 복호화하는 지점) 처리</li>
          <li><strong>API Gateway</strong> — 외부 API 호출의 진입점. 인증 토큰 검증, 요청 속도 제한(Rate Limiting), IP 필터링을 이 계층에서 수행</li>
          <li><strong>WAF(Web Application Firewall)</strong> — SQL 인젝션(SQL Injection, 입력값에 SQL 구문을 삽입하여 DB를 조작하는 공격), XSS(Cross-Site Scripting, 웹 페이지에 악성 스크립트를 삽입하는 공격) 등 애플리케이션 레벨 공격을 필터링</li>
          <li><strong>DMZ 원칙</strong> — DMZ 서버에는 민감 데이터를 저장하지 않는다. DB 직접 접속 금지, 로그만 임시 보관 후 내부망 로그 서버로 전송</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">서비스망</h3>
        <p>
          실제 비즈니스 로직이 실행되는 구간.<br />
          DMZ를 통과한 요청만 수신하며, 외부에서 직접 접근은 불가.
        </p>
        <ul>
          <li><strong>WAS / API 서버</strong> — 거래 매칭, 주문 처리, 잔고 관리 등 핵심 비즈니스 로직 수행. DMZ의 리버스 프록시에서 전달받은 요청만 처리</li>
          <li><strong>블록체인 노드</strong> — 체인 데이터 동기화를 위해 외부 P2P 통신이 필요한 특수 케이스. P2P 포트(예: 30303)만 외부 노출하되, RPC 포트(예: 8545)는 서비스망 내부에서만 접근 가능하도록 분리</li>
          <li><strong>메시지 큐</strong> — 서비스 간 비동기 통신용. 서비스망 내부에서만 접근. 외부 노출 절대 금지</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 블록체인 노드의 네트워크 위치</strong><br />
          블록체인 노드는 P2P 프로토콜 특성상 외부 통신이 필수.
          DMZ에 배치하면 RPC 접근 제어가 어려워지고, 서비스망에 배치하면 P2P 포트를 외부에 노출해야 한다.
          일반적인 해결책: 서비스망에 배치하되, P2P 포트만 방화벽에서 외부 통과를 허용. RPC는 서비스망 내부 IP에서만 접근 가능하도록 호스트 방화벽과 네트워크 방화벽 이중 통제.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">내부망</h3>
        <p>
          가장 높은 보안 수준을 요구하는 구간.<br />
          고객 데이터, 자산 잔고, 지갑 개인키 등 핵심 자산이 위치.
        </p>
        <ul>
          <li><strong>DB 서버</strong> — 서비스망의 WAS에서 DB 접속 포트(예: 3306, 5432)로만 접근 허용. 접근제어 소프트웨어를 DB 앞단에 배치하여 모든 쿼리를 감시</li>
          <li><strong>월렛 서버</strong> — 핫월렛 서명 기능 수행. 서비스망의 출금 서비스에서만 API 호출 가능, 그 외 모든 접근 차단. 콜드월렛은 에어갭(Air-gap, 네트워크 미연결) 환경이므로 네트워크에 존재하지 않음</li>
          <li><strong>관리 콘솔</strong> — 인프라 관리 도구(모니터링, 배포 등). 점프서버(Jump Server, 내부 서버 접근을 위한 중계 서버)를 경유해서만 접근 가능</li>
          <li><strong>로그/백업 서버</strong> — 감사 로그와 백업 데이터 저장. 쓰기만 허용(Append-only), 삭제 권한은 슈퍼관리자에게만 부여하여 로그 변조 방지</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">VPN 필수: 외부에서 내부망 접근</h3>
        <p>
          원격 근무, 장애 대응, 외부 감사 등으로 사무실 밖에서 내부 자원에 접근해야 하는 경우 반드시 VPN(Virtual Private Network)을 사용.<br />
          VPN 없이 내부 자원을 인터넷에 직접 노출하는 것은 ISMS 부적합 사유.
        </p>
        <ul>
          <li><strong>인증</strong> — VPN 접속 시 인증서 + OTP 이중 인증. 비밀번호만으로는 불가</li>
          <li><strong>접속 범위 제한</strong> — VPN을 통해 내부 전체에 접근하는 것이 아니라, 사용자 역할에 따라 접근 가능한 서브넷(Subnet, 네트워크를 논리적으로 분할한 단위)을 제한</li>
          <li><strong>접속 이력</strong> — 접속 시간, 접속 IP, 접속 지역을 기록. 비정상 지역(해외 등)에서의 접속 시 즉시 알림</li>
          <li><strong>세션 제한</strong> — VPN 세션 타임아웃 설정(예: 8시간). 장시간 미사용 시 자동 종료</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">방화벽 규칙: 화이트리스트 기반</h3>
        <p>
          방화벽 정책은 반드시 화이트리스트(Whitelist, 허용 목록) 방식으로 운영.<br />
          블랙리스트(Blacklist, 차단 목록) 방식은 "알려진 위협만 차단"하므로 새로운 공격을 막을 수 없다.<br />
          화이트리스트는 "허용된 것만 통과, 나머지는 전부 차단" — 기본 규칙이 DENY ALL.
        </p>
        <ul>
          <li><strong>기본 규칙</strong> — 모든 트래픽 차단(DENY ALL)을 기본으로 설정한 후, 필요한 통신만 개별적으로 허용</li>
          <li><strong>규칙 구성</strong> — 출발지 IP + 목적지 IP + 목적지 포트 + 프로토콜(TCP/UDP) 조합으로 허용 규칙 정의</li>
          <li><strong>ANY 규칙 금지</strong> — 출발지 또는 목적지에 ANY(모든 IP)를 사용하는 규칙은 원칙적으로 금지. 불가피한 경우 사유 기록과 정기 검토 대상</li>
          <li><strong>정기 검토</strong> — 분기별 방화벽 규칙 전수 검토. 더 이상 사용하지 않는 규칙(폐기된 서버, 종료된 프로젝트 관련) 삭제. 규칙이 누적될수록 관리 복잡도 증가와 보안 취약점 발생</li>
          <li><strong>변경 관리</strong> — 방화벽 규칙 추가/변경 시 작업신청서 → 정보보호팀 검토 → 승인 → 적용 → 사후 확인 절차 준수</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 마이크로세그멘테이션</strong><br />
          클라우드 환경에서는 전통적인 3-Zone 모델을 넘어 마이크로세그멘테이션(Microsegmentation)을 적용하는 추세.
          각 워크로드(컨테이너, VM)마다 독립적인 보안 그룹을 설정하여 워크로드 간 통신도 최소한으로 제한.
          AWS Security Group, Kubernetes Network Policy 등이 대표적 구현 수단.
        </p>

      </div>
    </section>
  );
}
