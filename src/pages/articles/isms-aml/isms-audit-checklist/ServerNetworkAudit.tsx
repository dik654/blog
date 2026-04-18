import ServerNetworkAuditViz from './viz/ServerNetworkAuditViz';
import PingTestInlineViz from './viz/PingTestInlineViz';
import FirewallRulesInlineViz from './viz/FirewallRulesInlineViz';
import OsSecurityInlineViz from './viz/OsSecurityInlineViz';

export default function ServerNetworkAudit() {
  return (
    <section id="server-network-audit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">서버 · 네트워크 점검</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          현장심사에서 가장 기술적인 영역. 심사원이 직접 서버 콘솔을 보며 설정을 확인한다.<br />
          ISMS-P 인증 기준 2.6(접근통제), 2.10(시스템 및 서비스 보안관리) 항목에 해당하며,
          아래는 심사원이 실제로 확인하는 구체적 항목과 명령어 수준의 정리.
        </p>

        <ServerNetworkAuditViz />

        {/* --- 망분리·ping 테스트 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">1. 서버 간 통신 확인 (ping 테스트)</h3>

        <div className="not-prose my-4">
          <PingTestInlineViz />
        </div>

        <p>
          심사원이 가장 먼저 확인하는 것 중 하나 — DMZ(Demilitarized Zone, 외부 접근 가능 네트워크 구간)와 내부망 사이의 통신 차단 여부.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">심사원 요청</th>
                <th className="text-left px-3 py-2 border-b border-border">기대 결과</th>
                <th className="text-left px-3 py-2 border-b border-border">결함 조건</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">"DMZ 웹서버에서 내부 DB 서버로 ping 해주세요"</td>
                <td className="px-3 py-1.5 border-b border-border/30">100% packet loss — ICMP 차단이 정상</td>
                <td className="px-3 py-1.5 border-b border-border/30">ping이 통하면 망분리 미흡</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">"내부 서버에서 외부 인터넷으로 ping 해주세요"</td>
                <td className="px-3 py-1.5 border-b border-border/30">차단 또는 프록시 경유만 허용</td>
                <td className="px-3 py-1.5 border-b border-border/30">직접 외부 통신 가능하면 지적</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">"모니터링 서버에서 대상 서버로 ping 해주세요"</td>
                <td className="px-3 py-1.5">ICMP 허용 가능 — 단, 정책 문서화 필수</td>
                <td className="px-3 py-1.5">허용 근거 문서 없으면 결함</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          증적 준비: 방화벽 ICMP 차단 규칙 스크린샷 + ping 실패 화면 캡처.<br />
          예외 허용 건이 있으면 "예외 승인서"(승인 일자, 승인자, 사유, 만료일) 함께 제출.
        </p>

        {/* --- 방화벽 규칙 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2. 방화벽 규칙 확인</h3>

        <div className="not-prose my-4">
          <FirewallRulesInlineViz />
        </div>

        <p>
          심사원: "방화벽 규칙 보여주세요."<br />
          이때 심사원이 찾는 것:
        </p>
        <ul>
          <li><strong>ANY → ANY 허용 규칙</strong> — 출발지와 목적지가 모두 "ANY"인 규칙은 즉시 결함. 사실상 방화벽이 없는 것과 동일</li>
          <li><strong>사용하지 않는 규칙</strong> — 서비스 종료 후 삭제하지 않은 규칙. Hit Count가 0인 규칙을 확인</li>
          <li><strong>과도하게 넓은 포트 범위</strong> — <code>1-65535</code> 전체 포트 허용은 지적 대상</li>
          <li><strong>규칙 검토 이력</strong> — "정기적으로 규칙을 검토하고 있나요?" → 검토 기록이 없으면 결함</li>
        </ul>

        <p>
          증적 준비:
        </p>
        <ul>
          <li>방화벽 콘솔 화면 캡처 (규칙 목록 전체)</li>
          <li>규칙 목록 CSV/Excel 추출 — 규칙번호, 출발지, 목적지, 포트, 허용/차단, 설명, 최종수정일</li>
          <li>정기 검토 보고서 — 최소 반기 1회, 검토일자·검토자·조치내역 포함</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 실무 팁</strong><br />
          방화벽 규칙이 수백 개라면 심사원이 전수 검토하지는 않는다.
          대신 "ANY 규칙 필터링" → "최근 6개월 Hit 0 규칙 필터링" → "설명이 비어있는 규칙 필터링"처럼
          문제 가능성이 높은 규칙을 선별 조회한다.
          사전에 이 필터링을 직접 돌려서 정리해두면 심사 대응 시간이 줄어든다.
        </p>

        {/* --- 불필요 포트 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3. 불필요 포트 확인</h3>
        <p>
          심사원이 서버에서 직접 실행을 요청하는 명령어:
        </p>

        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground mb-2"># Linux — 리스닝 포트 확인</p>
          <p>$ ss -tlnp</p>
          <p className="text-muted-foreground mt-1"># 또는 구버전</p>
          <p>$ netstat -tlnp</p>
          <br />
          <p className="text-muted-foreground mb-2"># 출력 예시</p>
          <p>State    Local Address:Port    Process</p>
          <p>LISTEN   0.0.0.0:22             sshd</p>
          <p>LISTEN   0.0.0.0:3306           mysqld</p>
          <p>LISTEN   0.0.0.0:8080           java</p>
          <p>LISTEN   127.0.0.1:6379         redis-server</p>
        </div>

        <p>
          심사원이 확인하는 포인트:
        </p>
        <ul>
          <li><strong>0.0.0.0:22 (SSH)</strong> — 모든 IP에서 SSH 접속 가능. 접속 IP 제한(특정 관리 IP만 허용)이 안 돼 있으면 지적</li>
          <li><strong>0.0.0.0:3306 (MySQL)</strong> — DB 포트가 모든 IP에 노출. 127.0.0.1(로컬)이나 특정 애플리케이션 서버 IP만 허용해야 정상</li>
          <li><strong>불필요 서비스 포트</strong> — 서비스 목적에 맞지 않는 포트(예: FTP 21, Telnet 23)가 LISTEN이면 결함</li>
          <li><strong>Redis 6379</strong> — 위 예시처럼 127.0.0.1만 바인딩돼 있으면 양호. 0.0.0.0이면 외부 노출 가능성으로 지적</li>
        </ul>

        {/* --- OS 보안 설정 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">4. OS 보안 설정</h3>

        <div className="not-prose my-4">
          <OsSecurityInlineViz />
        </div>

        <p>
          심사원이 확인하는 주요 설정 파일과 기대값. 모두 ISMS-P 2.5(인증 및 권한관리), 2.10(시스템 보안관리) 항목에 해당.
        </p>

        <h4 className="text-lg font-medium mt-4 mb-2">패스워드 정책 — /etc/login.defs</h4>
        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p>$ cat /etc/login.defs | grep -E "PASS_MAX|PASS_MIN"</p>
          <br />
          <p>PASS_MAX_DAYS   90    <span className="text-muted-foreground"># 최대 사용 기간 — 90일 이하 필수</span></p>
          <p>PASS_MIN_DAYS   1     <span className="text-muted-foreground"># 최소 사용 기간 — 즉시 재변경 방지</span></p>
          <p>PASS_MIN_LEN    8     <span className="text-muted-foreground"># 최소 길이 — 8자 이상</span></p>
          <p>PASS_WARN_AGE   7     <span className="text-muted-foreground"># 만료 경고 — 7일 전 알림</span></p>
        </div>

        <p>
          PASS_MAX_DAYS가 99999(기본값)로 남아있으면 → 비밀번호 만료 정책 미설정으로 즉시 결함.
        </p>

        <h4 className="text-lg font-medium mt-4 mb-2">SSH 설정 — /etc/ssh/sshd_config</h4>
        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p>$ cat /etc/ssh/sshd_config | grep -E "PermitRoot|PasswordAuth|MaxAuth"</p>
          <br />
          <p>PermitRootLogin no              <span className="text-muted-foreground"># root 원격 로그인 차단 — "yes"면 즉시 결함</span></p>
          <p>PasswordAuthentication no       <span className="text-muted-foreground"># 키 기반 인증만 허용 (권장)</span></p>
          <p>MaxAuthTries 5                  <span className="text-muted-foreground"># 인증 시도 횟수 제한</span></p>
        </div>

        <p>
          PermitRootLogin이 "yes"인 경우 — root 계정으로 원격 직접 접속이 가능하므로 인증 기준 2.5.1(사용자 계정 관리) 위반.<br />
          심사원은 추가로 <code>/etc/pam.d/sshd</code> 파일에서 PAM(Pluggable Authentication Modules) 설정도 확인할 수 있다 — 비밀번호 복잡도 강제 모듈(pam_pwquality) 설정 여부.
        </p>

        <h4 className="text-lg font-medium mt-4 mb-2">불필요 서비스 확인</h4>
        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p>$ systemctl list-unit-files --state=enabled</p>
          <br />
          <p className="text-muted-foreground"># 확인 포인트: 서비스 목적에 맞지 않는 데몬이 활성화돼 있는지</p>
          <p className="text-muted-foreground"># 예: cups.service (프린트), avahi-daemon.service (네트워크 검색)</p>
          <p className="text-muted-foreground"># 운영에 불필요한 서비스 → 비활성화 필요</p>
        </div>

        {/* --- 패치 현황 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">5. 패치 현황</h3>
        <p>
          심사원: "최근 보안 패치 적용 내역 보여주세요."<br />
          확인 항목:
        </p>

        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># Debian/Ubuntu 계열</p>
          <p>$ apt list --upgradable</p>
          <p className="text-muted-foreground"># → 업그레이드 가능한 패키지가 수십 개 이상이면 패치 미흡 가능성</p>
          <br />
          <p className="text-muted-foreground"># RHEL/CentOS 계열</p>
          <p>$ yum check-update</p>
          <br />
          <p className="text-muted-foreground"># 마지막 패치 적용 일자 확인</p>
          <p>$ rpm -qa --last | head -10</p>
          <p className="text-muted-foreground"># 또는</p>
          <p>$ cat /var/log/apt/history.log | grep "Start-Date" | tail -5</p>
        </div>

        <p>
          심사원이 확인하는 것:
        </p>
        <ul>
          <li><strong>패치 주기</strong> — 분기 1회 이상 정기 패치가 이뤄지고 있는지. 마지막 패치가 6개월 이전이면 결함</li>
          <li><strong>긴급 패치 절차</strong> — CVE(Common Vulnerabilities and Exposures, 공개 취약점 식별자)가 발표됐을 때 긴급 패치 적용 절차가 문서화돼 있는지</li>
          <li><strong>테스트 환경</strong> — 패치 적용 전 테스트 환경에서 검증했는지. 검증 없이 운영 서버에 바로 적용했으면 변경관리 절차 미준수</li>
          <li><strong>패치 관리 대장</strong> — 패치 적용일, 대상 서버, 패치 내용, 적용자를 기록한 대장이 있는지</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 커널 버전 확인</strong><br />
          심사원이 <code>uname -r</code>을 요청할 수 있다. 커널 버전이 EOL(End of Life, 지원 종료) 버전이면
          — 예: CentOS 7(2024년 6월 지원 종료) — "지원 종료 OS 사용"으로 지적될 수 있다.
          OS 마이그레이션 계획을 사전에 문서화해두면 보완조치 대응이 수월하다.
        </p>

        {/* --- 네트워크 장비 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">6. 네트워크 장비 점검</h3>
        <p>
          서버만 보는 것이 아니다. 심사원은 네트워크 장비(스위치, 라우터, VPN 장비)도 확인한다:
        </p>
        <ul>
          <li><strong>기본 계정 변경</strong> — admin/admin, cisco/cisco 같은 기본 계정이 남아있으면 즉시 결함</li>
          <li><strong>펌웨어 버전</strong> — 알려진 취약점이 있는 구버전인지 확인</li>
          <li><strong>SNMP(Simple Network Management Protocol) 커뮤니티 문자열</strong> — "public"이 기본값으로 남아있으면 결함. 추측 불가능한 문자열로 변경 필수</li>
          <li><strong>관리 접속 제한</strong> — 관리 콘솔 접속이 특정 관리 IP에서만 가능한지 확인</li>
          <li><strong>로그 전송</strong> — 네트워크 장비 로그가 중앙 로그 서버(Syslog)로 전송되고 있는지</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 클라우드 환경</strong><br />
          AWS/GCP/Azure 사용 시 심사원은 클라우드 콘솔 화면을 요청한다.
          Security Group(AWS) / 방화벽 규칙(GCP) 화면에서 인바운드 규칙을 확인하며,
          0.0.0.0/0으로 열려있는 포트가 있으면 동일하게 지적한다.
          "클라우드라서 괜찮다"는 항변은 통하지 않는다 — 동일한 접근통제 기준이 적용된다.
        </p>

      </div>
    </section>
  );
}
