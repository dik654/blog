export default function AccountAccessAudit() {
  return (
    <section id="account-access-audit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">계정 · 접근통제 점검</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          ISMS-P 2.5(인증 및 권한관리)와 2.6(접근통제) 영역의 핵심.<br />
          심사원은 "계정이 적절히 관리되고, 접근이 통제되고, 기록이 남는가"를 확인한다.<br />
          결함이 가장 많이 나오는 영역 중 하나 — 모든 시스템에 계정이 있기 때문에 점검 범위가 넓다.
        </p>

        {/* --- 비밀번호 정책 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">1. 비밀번호 정책 확인</h3>
        <p>
          심사원: "비밀번호 정책 설정 화면 보여주세요."<br />
          확인하는 설정:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">기준</th>
                <th className="text-left px-3 py-2 border-b border-border">확인 방법</th>
                <th className="text-left px-3 py-2 border-b border-border">결함 조건</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">변경 주기</td>
                <td className="px-3 py-1.5 border-b border-border/30">90일 이하</td>
                <td className="px-3 py-1.5 border-b border-border/30"><code>/etc/login.defs</code> PASS_MAX_DAYS</td>
                <td className="px-3 py-1.5 border-b border-border/30">99999(기본값)이면 미설정</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">최소 길이</td>
                <td className="px-3 py-1.5 border-b border-border/30">8자 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">PAM pam_pwquality 설정</td>
                <td className="px-3 py-1.5 border-b border-border/30">minlen 미설정</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">복잡도</td>
                <td className="px-3 py-1.5 border-b border-border/30">영문+숫자+특수문자 조합</td>
                <td className="px-3 py-1.5 border-b border-border/30">pam_pwquality dcredit/ucredit/lcredit</td>
                <td className="px-3 py-1.5 border-b border-border/30">단일 유형만 허용</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">로그인 실패 잠금</td>
                <td className="px-3 py-1.5 border-b border-border/30">5회 실패 시 잠금</td>
                <td className="px-3 py-1.5 border-b border-border/30">pam_tally2 또는 pam_faillock</td>
                <td className="px-3 py-1.5 border-b border-border/30">잠금 미설정</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">이전 비밀번호 재사용</td>
                <td className="px-3 py-1.5">최근 3~5개 금지</td>
                <td className="px-3 py-1.5">pam_pwhistory remember 설정</td>
                <td className="px-3 py-1.5">재사용 제한 없음</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          서버(Linux)만이 아니다. 심사원은 모든 시스템의 비밀번호 정책을 확인한다:<br />
          웹 애플리케이션 관리자 페이지, DB 콘솔, 클라우드 콘솔(AWS IAM), VPN, 메일 시스템 등.
        </p>

        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># PAM 비밀번호 복잡도 설정 확인</p>
          <p>$ cat /etc/pam.d/system-auth | grep pam_pwquality</p>
          <p className="mt-1">password requisite pam_pwquality.so minlen=8 dcredit=-1 ucredit=-1 lcredit=-1 ocredit=-1</p>
          <p className="text-muted-foreground mt-2"># dcredit=-1: 숫자 최소 1자 / ucredit=-1: 대문자 최소 1자</p>
          <p className="text-muted-foreground"># lcredit=-1: 소문자 최소 1자 / ocredit=-1: 특수문자 최소 1자</p>
        </div>

        {/* --- 계정 분리 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2. 계정 분리 상황</h3>
        <p>
          심사원: "DB 계정 목록 보여주세요." "root로 서비스 접속하나요?"<br />
          확인하는 것 — 하나의 계정이 모든 용도로 사용되고 있지 않은지.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">계정 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">용도</th>
                <th className="text-left px-3 py-2 border-b border-border">권한 범위</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">서비스 계정</td>
                <td className="px-3 py-1.5 border-b border-border/30">애플리케이션이 DB 접속할 때 사용</td>
                <td className="px-3 py-1.5 border-b border-border/30">필요한 테이블에 SELECT/INSERT만</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">관리자 계정</td>
                <td className="px-3 py-1.5 border-b border-border/30">DBA가 스키마 변경, 백업 수행 시 사용</td>
                <td className="px-3 py-1.5 border-b border-border/30">DDL 권한 포함</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">백업 계정</td>
                <td className="px-3 py-1.5 border-b border-border/30">자동 백업 스크립트 전용</td>
                <td className="px-3 py-1.5 border-b border-border/30">SELECT + LOCK TABLES만</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">비상 계정</td>
                <td className="px-3 py-1.5">장애 시 긴급 접속용</td>
                <td className="px-3 py-1.5">별도 보관, 사용 후 비밀번호 변경</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># MySQL 계정 목록 조회</p>
          <p>mysql{'>'} SELECT user, host FROM mysql.user;</p>
          <br />
          <p>+------------------+-----------+</p>
          <p>| user             | host      |</p>
          <p>+------------------+-----------+</p>
          <p>| root             | localhost |  <span className="text-muted-foreground">← 양호: localhost만 허용</span></p>
          <p>| app_service      | 10.0.1.%  |  <span className="text-muted-foreground">← 양호: 앱 서버 대역만</span></p>
          <p>| backup_user      | 10.0.2.10 |  <span className="text-muted-foreground">← 양호: 백업 서버 IP만</span></p>
          <p>| admin            | %         |  <span className="text-muted-foreground">← 결함: 모든 IP에서 접속 가능</span></p>
          <p>+------------------+-----------+</p>
        </div>

        <p>
          <code>host</code> 컬럼이 <code>%</code>(모든 호스트)인 계정이 있으면 결함.<br />
          특히 root 계정의 host가 <code>%</code>면 — 외부에서 최고 권한 계정으로 직접 접속 가능하므로 중결함.
        </p>

        {/* --- 장기 미접속 계정 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3. 장기 미접속 계정</h3>
        <p>
          심사원: "6개월 이상 미접속 계정 조회해주세요."<br />
          퇴직자 계정이 남아있거나, 프로젝트 종료 후 삭제되지 않은 계정이 대표적 결함.
        </p>

        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># 애플리케이션 DB — 장기 미접속 사용자 조회</p>
          <p>SELECT user_id, name, last_login_at</p>
          <p>FROM users</p>
          <p>WHERE last_login_at {'<'} DATE_SUB(NOW(), INTERVAL 6 MONTH)</p>
          <p>  AND status = 'ACTIVE';</p>
          <br />
          <p className="text-muted-foreground"># Linux 서버 — 계정별 마지막 로그인</p>
          <p>$ lastlog | grep -v "Never"</p>
          <br />
          <p className="text-muted-foreground"># 결과에 "Active" 상태인 장기 미접속 계정이 있으면 결함</p>
          <p className="text-muted-foreground"># → 계정 비활성화 또는 삭제 조치 필요</p>
        </div>

        <p>
          증적 준비:
        </p>
        <ul>
          <li>정기 계정 점검 보고서 — 최소 분기 1회, 점검일·점검자·미접속 계정 목록·조치 내역</li>
          <li>퇴직자 계정 삭제 대장 — 퇴직일, 계정 삭제일, 처리자</li>
          <li>계정 생성/삭제 절차서 — 신청→승인→생성→검토의 전 과정 문서화</li>
        </ul>

        {/* --- 공용 계정 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">4. 공용 계정</h3>
        <p>
          심사원: "공용 계정 사용 현황 보여주세요."<br />
          공용 계정(Shared Account)은 여러 사람이 하나의 아이디로 접속하는 계정 — 원칙적으로 사용 금지.
        </p>
        <ul>
          <li><strong>왜 문제인가</strong> — 누가 어떤 작업을 했는지 추적 불가. 사고 발생 시 책임 소재 불분명</li>
          <li><strong>불가피한 경우</strong> — 시스템 구조상 개인 계정 생성이 불가한 레거시 시스템</li>
          <li><strong>필수 증적</strong> — 공용계정 사용대장. 사용자명, 사용기간, 사유, 승인자를 기록</li>
        </ul>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">사용자</th>
                <th className="text-left px-3 py-2 border-b border-border">공용계정</th>
                <th className="text-left px-3 py-2 border-b border-border">사용기간</th>
                <th className="text-left px-3 py-2 border-b border-border">사유</th>
                <th className="text-left px-3 py-2 border-b border-border">승인자</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">홍길동</td>
                <td className="px-3 py-1.5 border-b border-border/30">legacy_admin</td>
                <td className="px-3 py-1.5 border-b border-border/30">2025.01.15 ~ 01.16</td>
                <td className="px-3 py-1.5 border-b border-border/30">레거시 시스템 장애 조치</td>
                <td className="px-3 py-1.5 border-b border-border/30">팀장</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">이철수</td>
                <td className="px-3 py-1.5">legacy_admin</td>
                <td className="px-3 py-1.5">2025.02.03 ~ 02.03</td>
                <td className="px-3 py-1.5">설정 변경 작업</td>
                <td className="px-3 py-1.5">팀장</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          대장 없이 공용 계정을 사용하고 있으면 즉시 결함.<br />
          심사원은 "이 계정으로 마지막에 접속한 사람이 누구인지 알 수 있나요?"라고 질문한다 — 답변 불가면 결함.
        </p>

        {/* --- 관리자 2차인증 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">5. 관리자 2차인증(MFA)</h3>
        <p>
          심사원: "관리자 페이지에 로그인해주세요."<br />
          이때 ID/PW만으로 로그인이 완료되면 — "2차인증(MFA, Multi-Factor Authentication) 미적용" 결함.
        </p>
        <ul>
          <li><strong>확인 대상</strong> — 서비스 관리자 페이지, 클라우드 콘솔, DB 접근제어 솔루션, VPN, 서버 SSH</li>
          <li><strong>인정되는 2차인증</strong> — OTP(One-Time Password) 앱(Google Authenticator 등), SMS 인증, 하드웨어 토큰, 생체인증</li>
          <li><strong>인정 안 되는 것</strong> — 이메일 인증(탈취 가능성 높음), 보안 질문(추측 가능)</li>
        </ul>

        <p>
          증적 준비:
        </p>
        <ul>
          <li>관리자 로그인 시 OTP 입력 화면 캡처</li>
          <li>MFA 설정 화면 캡처 (적용 대상, 인증 방식)</li>
          <li>MFA 미적용 예외 목록 — 있으면 사유와 승인자 기록</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} AWS 콘솔의 함정</strong><br />
          AWS root 계정에 MFA를 설정했더라도 IAM 사용자에 MFA가 없으면 결함.
          심사원은 IAM 콘솔에서 "MFA 디바이스 할당" 컬럼을 확인한다.
          전체 IAM 사용자 목록에서 MFA 미설정 계정이 하나라도 있으면 지적.
        </p>

        {/* --- 접근제어 로그 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">6. 접근제어 로그</h3>
        <p>
          심사원: "DB 접근 로그 최근 1개월분 보여주세요."<br />
          ISMS-P 2.9.4(로그 및 접속기록 관리) 항목에 해당하는 핵심 점검.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">확인 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">상세</th>
                <th className="text-left px-3 py-2 border-b border-border">결함 조건</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">접근제어 솔루션 운영</td>
                <td className="px-3 py-1.5 border-b border-border/30">DB 접근제어(DAC) 솔루션 — PETRA, Chakra, QueryPie 등</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보 처리 DB에 솔루션 없으면 결함</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">로그 항목</td>
                <td className="px-3 py-1.5 border-b border-border/30">접속자 ID, 접속 일시, IP, 실행 쿼리, 결과</td>
                <td className="px-3 py-1.5 border-b border-border/30">필수 항목 누락</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보존 기간</td>
                <td className="px-3 py-1.5 border-b border-border/30">최소 6개월 (개인정보 처리 시스템은 법적 1년 이상)</td>
                <td className="px-3 py-1.5 border-b border-border/30">보존 기간 미달</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">비인가 접근 대응</td>
                <td className="px-3 py-1.5 border-b border-border/30">비인가 접근 시도 탐지 시 알림 + 조치 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">탐지/알림 체계 없음</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">위변조 방지</td>
                <td className="px-3 py-1.5">로그를 별도 서버에 전송하여 원본 보호</td>
                <td className="px-3 py-1.5">로그가 같은 서버에만 저장</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          심사원이 비인가 접근 시도 로그를 발견하면 후속 질문이 이어진다:<br />
          "이 접근 시도를 인지했나요?" → "어떻게 조치했나요?" → "재발 방지 조치는?"<br />
          일련의 대응 기록이 없으면 "모니터링 체계 미흡"으로 추가 결함.
        </p>

        {/* --- 권한 검토 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">7. 접근 권한 정기 검토</h3>
        <p>
          심사원: "접근 권한 검토 기록 보여주세요."<br />
          ISMS-P 2.5.6(접근권한 검토) — 최소 반기 1회 이상 전체 시스템의 접근 권한을 검토해야 한다.
        </p>
        <ul>
          <li><strong>검토 대상</strong> — 서버 계정, DB 계정, 애플리케이션 관리자 권한, 클라우드 IAM 정책, VPN 접속 권한</li>
          <li><strong>검토 내용</strong> — 불필요 권한 회수, 퇴직자 계정 삭제, 과도한 권한 조정</li>
          <li><strong>증적</strong> — 검토 보고서(검토일, 검토자, 대상 시스템, 발견 사항, 조치 결과)</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 최소 권한 원칙</strong><br />
          모든 계정은 업무 수행에 필요한 최소한의 권한만 부여해야 한다(Principle of Least Privilege).
          심사원은 "이 계정에 왜 이 권한이 필요한가?"를 질문한다.
          "편의상" 또는 "원래부터 이렇게 돼 있었다"는 답변은 결함 사유가 된다.
          권한 부여에는 반드시 업무적 근거가 있어야 하고, 그 근거가 문서화돼 있어야 한다.
        </p>

      </div>
    </section>
  );
}
