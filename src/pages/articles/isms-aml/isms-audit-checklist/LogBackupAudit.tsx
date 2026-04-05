export default function LogBackupAudit() {
  return (
    <section id="log-backup-audit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">로그 · 백업 점검</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          ISMS-P 2.9.4(로그 및 접속기록 관리)와 2.12(재해복구) 영역.<br />
          로그가 없으면 사고 원인 분석이 불가능하고, 백업이 없으면 복구가 불가능하다.<br />
          심사원은 "로그가 남고 있는가 → 안전하게 보관되는가 → 복구할 수 있는가"의 순서로 확인한다.
        </p>

        {/* --- 로그 저장 확인 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">1. 로그 저장 확인</h3>
        <p>
          심사원: "어떤 로그를 수집하나요? 보존 기간은?"<br />
          수집해야 하는 로그 종류와 확인 방법:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">로그 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">확인 경로</th>
                <th className="text-left px-3 py-2 border-b border-border">필수 기록 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">법적 보존 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">서버 접속 로그</td>
                <td className="px-3 py-1.5 border-b border-border/30"><code>/var/log/auth.log</code> (Ubuntu)<br /><code>/var/log/secure</code> (RHEL)</td>
                <td className="px-3 py-1.5 border-b border-border/30">접속자, 일시, IP, 성공/실패</td>
                <td className="px-3 py-1.5 border-b border-border/30">6개월 이상</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">애플리케이션 로그</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스별 로그 경로</td>
                <td className="px-3 py-1.5 border-b border-border/30">사용자 행위, 에러, 트랜잭션</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 정책에 따름</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">DB 접속 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">접근제어 솔루션 로그</td>
                <td className="px-3 py-1.5 border-b border-border/30">접속자 ID, IP, 쿼리, 결과</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보 DB: 1년 이상</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">방화벽 로그</td>
                <td className="px-3 py-1.5 border-b border-border/30">방화벽 콘솔 또는 Syslog 서버</td>
                <td className="px-3 py-1.5 border-b border-border/30">출발지/목적지 IP, 포트, 허용/차단</td>
                <td className="px-3 py-1.5 border-b border-border/30">6개월 이상</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">개인정보 처리 시스템 접속기록</td>
                <td className="px-3 py-1.5">별도 접속기록 관리 시스템</td>
                <td className="px-3 py-1.5">접속자 ID, 접속 일시, IP, 처리한 정보주체 정보</td>
                <td className="px-3 py-1.5">최소 1년 (5만 명 이상: 2년)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          심사원이 서버에서 직접 확인하는 명령어:
        </p>

        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># 로그 파일 존재 및 크기 확인</p>
          <p>$ ls -la /var/log/</p>
          <p className="text-muted-foreground mt-2"># 최근 로그 내용 확인 (실제로 기록되고 있는지)</p>
          <p>$ tail -20 /var/log/auth.log</p>
          <br />
          <p className="text-muted-foreground"># 로그 로테이션 설정 확인</p>
          <p>$ cat /etc/logrotate.d/syslog</p>
          <p className="text-muted-foreground mt-1"># rotate 52 weekly → 52주(1년) 보관</p>
          <p className="text-muted-foreground"># compress → 압축 저장으로 용량 절약</p>
          <br />
          <p className="text-muted-foreground"># 가장 오래된 로그 파일 확인 (보존 기간 검증)</p>
          <p>$ ls -lt /var/log/auth.log* | tail -3</p>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 로그 위변조 방지</strong><br />
          개인정보 처리 시스템의 접속기록은 "위변조 방지" 조치가 법적 의무(개인정보보호법 시행령 제48조의2).<br />
          가장 일반적인 방법: 로그를 별도의 중앙 로그 서버(Syslog, ELK Stack, Splunk 등)로 실시간 전송하여
          원본 서버에서 삭제하더라도 기록이 남도록 하는 것.<br />
          "같은 서버에만 저장하고 있다"면 위변조 방지 미흡으로 결함.
        </p>

        {/* --- 백업 정상 수행 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2. 백업 정상 수행 확인</h3>
        <p>
          심사원: "최근 백업 결과 보여주세요."<br />
          심사원이 확인하는 것:
        </p>

        <h4 className="text-lg font-medium mt-4 mb-2">크론 작업 설정</h4>
        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># 백업 스케줄 확인</p>
          <p>$ crontab -l</p>
          <br />
          <p className="text-muted-foreground"># 출력 예시</p>
          <p>0 2 * * * /opt/backup/daily_backup.sh {'>'} /var/log/backup/daily.log 2{'>'}&1</p>
          <p>0 3 * * 0 /opt/backup/weekly_full.sh {'>'} /var/log/backup/weekly.log 2{'>'}&1</p>
          <p className="text-muted-foreground mt-1"># 매일 02시 일일 백업, 매주 일요일 03시 전체 백업</p>
        </div>

        <h4 className="text-lg font-medium mt-4 mb-2">백업 파일 확인</h4>
        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># 최근 백업 파일 타임스탬프 확인</p>
          <p>$ ls -lh /backup/daily/</p>
          <p>-rw-r--r-- 1 root root 2.3G Apr  4 02:15 db_backup_20260404.sql.gz</p>
          <p>-rw-r--r-- 1 root root 2.1G Apr  3 02:12 db_backup_20260403.sql.gz</p>
          <p>-rw-r--r-- 1 root root 2.2G Apr  2 02:18 db_backup_20260402.sql.gz</p>
          <br />
          <p className="text-muted-foreground"># 클라우드 백업 시 — S3 버킷 목록</p>
          <p>$ aws s3 ls s3://company-backup/daily/ --recursive | tail -5</p>
        </div>

        <p>
          심사원이 확인하는 포인트:
        </p>
        <ul>
          <li><strong>백업 연속성</strong> — 빠진 날짜가 없는지. 3일치만 있고 4일 전 파일이 없으면 "백업 실패 발생" 의심</li>
          <li><strong>백업 크기 일관성</strong> — 갑자기 크기가 0이거나 평소의 1/10이면 비정상 백업 가능성</li>
          <li><strong>백업 실패 알림</strong> — 백업이 실패했을 때 알림이 발송되는지. Slack/이메일/SMS 알림 설정 화면 제출</li>
          <li><strong>암호화 여부</strong> — 백업 파일에 개인정보가 포함되어 있으면 AES-256 등으로 암호화 필수. 평문 백업은 결함</li>
          <li><strong>소산 백업</strong> — 백업 파일이 원본과 같은 장소에만 있으면 재해 시 둘 다 소실. 물리적으로 분리된 위치에 사본 보관</li>
        </ul>

        {/* --- 복구 테스트 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3. 복구 테스트</h3>
        <p>
          심사원: "마지막 복구 테스트는 언제 했나요?"<br />
          백업이 있어도 복구할 수 없으면 의미 없다. 심사원은 "실제로 복구해본 기록"을 요구한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">필수 기재 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">테스트 일시</td>
                <td className="px-3 py-1.5 border-b border-border/30">최소 연 1회 이상 수행 (반기 1회 권장)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">복구 대상</td>
                <td className="px-3 py-1.5 border-b border-border/30">어떤 시스템/DB를 복구했는지 명시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">복구 목표 시점(RPO)</td>
                <td className="px-3 py-1.5 border-b border-border/30">RPO(Recovery Point Objective) — 어느 시점까지의 데이터를 복구할 수 있는지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">복구 목표 시간(RTO)</td>
                <td className="px-3 py-1.5 border-b border-border/30">RTO(Recovery Time Objective) — 복구 완료까지 소요 시간</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">테스트 결과</td>
                <td className="px-3 py-1.5 border-b border-border/30">성공/실패, 데이터 무결성 확인 결과</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">개선 사항</td>
                <td className="px-3 py-1.5">복구 과정에서 발견된 문제점과 조치 계획</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          복구 테스트 기록이 전혀 없으면 결함.<br />
          "작년에 한 번 했다"라고 구두로 말해도 보고서가 없으면 증적 미비.<br />
          보고서 양식이 정형화돼 있으면 심사 대응이 빠르다 — 매 테스트마다 동일 양식으로 작성.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 복구 테스트 실무 팁</strong><br />
          운영 환경에서 복구 테스트를 하면 서비스 중단 위험이 있으므로,
          별도의 테스트 환경(스테이징 서버)에서 백업 파일을 복원하여 검증하는 것이 일반적.
          테스트 환경 구축이 어려우면 — Docker 컨테이너에 DB를 올려서 백업 파일을 import하고
          핵심 테이블의 레코드 수를 비교하는 것만으로도 유효한 증적이 된다.
        </p>

        {/* --- NTP 동기화 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">4. NTP 동기화</h3>
        <p>
          심사원이 의외로 자주 확인하는 항목. 서버 시간이 동기화돼 있지 않으면 로그의 시간 정합성이 깨진다.<br />
          사고 분석 시 "서버 A의 14:03 로그와 서버 B의 14:05 로그 중 어느 것이 먼저인가"를 판단할 수 없게 된다.
        </p>

        <div className="not-prose bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm overflow-x-auto">
          <p className="text-muted-foreground"># 시간 동기화 상태 확인</p>
          <p>$ timedatectl</p>
          <p className="mt-1">               Local time: Sat 2026-04-05 09:30:15 KST</p>
          <p>           Universal time: Sat 2026-04-05 00:30:15 UTC</p>
          <p>                 RTC time: Sat 2026-04-05 00:30:15</p>
          <p>                Time zone: Asia/Seoul (KST, +0900)</p>
          <p>System clock synchronized: <strong>yes</strong>    <span className="text-muted-foreground">← "no"면 결함</span></p>
          <p>              NTP service: active  <span className="text-muted-foreground">← "inactive"면 결함</span></p>
          <br />
          <p className="text-muted-foreground"># NTP 서버 연결 상태 확인</p>
          <p>$ ntpq -p</p>
          <p className="text-muted-foreground mt-1"># 또는 chrony 사용 시</p>
          <p>$ chronyc sources</p>
        </div>

        <p>
          심사원이 확인하는 포인트:
        </p>
        <ul>
          <li><strong>NTP(Network Time Protocol) 서비스 활성화</strong> — 비활성이면 시간 동기화가 안 되므로 결함</li>
          <li><strong>동기화 대상 서버</strong> — 내부 NTP 서버를 사용하는지 외부 공개 NTP를 사용하는지 확인. 보안 네트워크에서 외부 NTP 직접 접속은 지적 가능</li>
          <li><strong>시간 오차</strong> — offset이 수 초 이상이면 동기화 불량</li>
          <li><strong>모든 서버 동일 설정</strong> — 서버마다 다른 NTP 소스를 사용하면 시간 불일치 발생 가능</li>
        </ul>

        {/* --- 변경관리 --- */}
        <h3 className="text-xl font-semibold mt-6 mb-3">5. 변경관리 기록</h3>
        <p>
          로그·백업 영역과 함께 확인되는 항목 — "시스템에 변경이 생겼을 때 기록을 남기고 있는가."<br />
          ISMS-P 2.9.1(변경관리) 항목에 해당.
        </p>
        <ul>
          <li><strong>변경 요청서</strong> — 변경 내용, 영향 범위, 롤백 계획, 요청자, 승인자</li>
          <li><strong>변경 이력 대장</strong> — 변경 일시, 변경 대상, 변경 내용, 수행자, 결과</li>
          <li><strong>긴급 변경 절차</strong> — 사전 승인 없이 긴급 변경한 경우 사후 보고서 작성 여부</li>
        </ul>

        <p>
          심사원은 "최근 3개월 내 서버 설정 변경 건이 있었나요?"라고 질문한다.<br />
          변경 건이 있는데 변경 이력이 없으면 — "변경관리 절차 미준수" 결함.<br />
          변경 건이 없다고 답변하면 — 실제 서버 설정 변경 로그(<code>/var/log/audit/audit.log</code> 등)와 대조하여 검증할 수 있다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 로그 중앙화 권장 구조</strong><br />
          심사 대응의 편의와 실질적 보안을 동시에 달성하는 구조:
          모든 서버 → Rsyslog/Fluentd → 중앙 로그 서버(ELK, Splunk, CloudWatch Logs 등).<br />
          중앙 서버에서 대시보드를 만들어두면 심사원에게 "전체 로그 현황"을 한 화면으로 보여줄 수 있다.
          심사원 입장에서도 효율적이므로 좋은 인상을 준다.
        </p>

      </div>
    </section>
  );
}
