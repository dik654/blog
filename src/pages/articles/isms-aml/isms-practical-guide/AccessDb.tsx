import AccessDbViz from './viz/AccessDbViz';

export default function AccessDb() {
  return (
    <section id="access-db" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DB 접근통제 — 계정 분리 대작전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          DB 접근통제는 ISMS 심사에서 가장 까다롭게 지적당한 영역이었다.<br />
          처음에는 "DB 접속이 되면 되는 거 아닌가"라고 생각했는데, 심사원이 보는 관점은 완전히 달랐다.<br />
          누가, 어떤 권한으로, 어디서, 어떤 데이터에 접근하는지 — 이 네 가지가 모두 분리되어야 한다.
        </p>

        <AccessDbViz />

        {/* ── 계정 분리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DB 계정 분리 — root 하나로 다 하던 시절</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          솔직하게 말하면, 원래 root 계정이나 공용 계정 하나로 모든 작업을 하고 있었다.<br />
          개발자가 root로 접속해서 쿼리를 날리고, 애플리케이션도 root로 DB에 연결하고, 백업 스크립트도 root로 실행했다.<br />
          서비스 DB와 원장(Ledger) DB도 같은 인스턴스에 같이 있었다.<br />
          "어차피 우리끼리 쓰는 건데"라는 인식이 팀 전체에 깔려 있었다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">심사원 지적</h4>
        <p>
          심사원이 DB 계정 목록을 뽑아보라고 했을 때, root 하나와 공용 계정 하나만 나왔다.<br />
          즉각 결함이 도출되었다:
        </p>
        <ul>
          <li>"업무 역할별 계정 분리가 되어 있지 않다"</li>
          <li>"프로그램 계정과 사람 계정이 구분되지 않는다"</li>
          <li>"서비스 데이터와 원장 데이터가 동일 DB에 혼재되어 있다"</li>
        </ul>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          보완조치로 대규모 계정 재구성 작업을 진행했다.
        </p>

        <p>
          <strong>1단계: DB 물리 분리</strong>
        </p>
        <p>
          서비스 DB와 원장 DB를 별도 인스턴스로 분리. 원장 DB에는 거래 기록, 입출금 내역 등 금융 데이터만 보관.<br />
          서비스 DB에는 회원 정보, 게시판, 설정 등 일반 서비스 데이터를 보관.<br />
          물리적으로 분리된 인스턴스이므로, 서비스 DB 계정으로 원장 DB에 접근하는 것이 원천 불가.
        </p>

        <p>
          <strong>2단계: 프로그램용 계정 5종 생성</strong>
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">계정명</th>
                <th className="text-left px-3 py-2 border-b border-border">용도</th>
                <th className="text-left px-3 py-2 border-b border-border">권한</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-mono text-sm">filadmin</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 DB 관리</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 DB 전체 DDL/DML</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-mono text-sm">filuser</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 애플리케이션</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 DB 특정 테이블 SELECT/INSERT/UPDATE</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-mono text-sm">filledger</td>
                <td className="px-3 py-1.5 border-b border-border/30">원장 애플리케이션</td>
                <td className="px-3 py-1.5 border-b border-border/30">원장 DB 특정 테이블 SELECT/INSERT</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-mono text-sm">petra</td>
                <td className="px-3 py-1.5 border-b border-border/30">DB 접근제어 소프트웨어</td>
                <td className="px-3 py-1.5 border-b border-border/30">메타데이터 조회 (테이블 목록, 컬럼 정보)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-mono text-sm">backup</td>
                <td className="px-3 py-1.5">백업 스크립트</td>
                <td className="px-3 py-1.5">SELECT + LOCK TABLES + RELOAD</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>3단계: 사람용 계정 3종 생성</strong>
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">계정명</th>
                <th className="text-left px-3 py-2 border-b border-border">사용자</th>
                <th className="text-left px-3 py-2 border-b border-border">기본 권한</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-mono text-sm">super_admin</td>
                <td className="px-3 py-1.5 border-b border-border/30">DBA / 정보보호담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">전체 DB 관리 권한 (사용 빈도 최소화)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-mono text-sm">service_admin</td>
                <td className="px-3 py-1.5 border-b border-border/30">개발자 / 운영자</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 DB SELECT만 (추가 권한은 신청 후 부여)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-mono text-sm">ledger_admin</td>
                <td className="px-3 py-1.5">원장 담당자</td>
                <td className="px-3 py-1.5">원장 DB SELECT만 (추가 권한은 신청 후 부여)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          핵심은 "최소 권한 원칙(Principle of Least Privilege)"이다.<br />
          <code>service_admin</code>은 기본적으로 SELECT만 가능하다. UPDATE나 DELETE가 필요하면 별도 신청이 필요하다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈: root 공용 계정은 즉시 제거</strong><br />
          ISMS 준비 시 가장 먼저 할 일은 root/공용 계정 사용을 중단하는 것.
          계정을 분리하는 작업은 시간이 걸리므로, 심사 직전에 하면 실수가 생긴다.
          최소 2개월 전에 분리를 완료하고, 실제 운영에서 문제가 없는지 확인해야 한다.
        </p>

        {/* ── PETRA 도입 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">PETRA 도입 — DB 접근제어 소프트웨어</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          DB에 직접 접속하는 경로가 통제되지 않았다.<br />
          개발자가 자기 노트북에서 MySQL Workbench로 직접 접속하거나, 서버에 SSH로 접속한 뒤 <code>mysql</code> CLI를 사용했다.<br />
          누가 언제 어떤 쿼리를 날렸는지 추적할 수 없었다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          DB 접근제어 소프트웨어 PETRA를 도입했다. PETRA는 국내 DB 접근제어 솔루션으로, DB로 가는 모든 쿼리를 중간에서 가로채서 정책에 따라 허용/차단한다.
        </p>
        <p>
          도입 후 3중 통제 체계가 구축되었다:
        </p>
        <ul>
          <li><strong>세션 통제</strong> — 망분리 PC에서만 PETRA UI 접근 허용. 외부 네트워크에서는 PETRA 자체에 접근 불가</li>
          <li><strong>쿼리 통제</strong> — 계정별로 실행 가능한 쿼리 유형을 제한. <code>service_admin</code>은 SELECT만 허용, DROP/TRUNCATE는 모든 사람 계정에서 차단</li>
          <li><strong>IP 통제</strong> — 등록된 IP에서만 접속 허용. 사무실 네트워크 외 IP는 자동 차단</li>
        </ul>
        <p>
          PETRA를 경유하지 않는 직접 DB 접속은 방화벽에서 차단. DB 서버의 3306(MySQL 기본 포트)은 PETRA 서버의 IP에서만 허용.
        </p>

        {/* ── 월간 로그 검토 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">월간 로그 검토 프로세스</h3>

        <p>
          PETRA를 설치만 하면 끝이 아니다. ISMS에서는 "로그를 생성하는 것"뿐 아니라 "로그를 정기적으로 검토하는 것"까지 요구한다.<br />
          매월 다음 3가지 로그를 검토하는 프로세스를 구축했다:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">순서</th>
                <th className="text-left px-3 py-2 border-b border-border">로그 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">검토 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">1</td>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">쿼리 실행 로그</td>
                <td className="px-3 py-1.5 border-b border-border/30">누가 어떤 쿼리를 실행했는지 확인. 대량 SELECT, 비정상적 시간대 실행 여부</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">2</td>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">차단 로그</td>
                <td className="px-3 py-1.5 border-b border-border/30">정책에 의해 차단된 쿼리/접속 시도. 반복적 차단은 공격 시도 또는 권한 미부여 사안</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">3</td>
                <td className="px-3 py-1.5 font-medium">로그인 허용/차단 로그</td>
                <td className="px-3 py-1.5">계정별 로그인 성공/실패 횟수. 퇴사자 계정 사용 시도, 비인가 IP에서의 접속 시도</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          검토 완료 후 이상 유무를 판단하여 구글 폼으로 최종 보고서를 제출한다.<br />
          보고서에는 검토 기간, 검토자, 이상 여부, 조치 내역을 기록.<br />
          이 보고서 자체가 ISMS 심사 증적이 된다 — "로그를 검토하고 있다"는 것을 증명하는 문서.
        </p>

        {/* ── 임시 권한 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">작업 신청서 기반 임시 권한</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          개발자가 "이 테이블에 UPDATE 해야 돼요"라고 구두로 요청하면, DBA가 구두로 "해도 돼요"라고 답하고 권한을 줬다.<br />
          권한 부여/회수 이력이 남지 않았고, 부여된 권한이 언제 회수되는지 관리되지 않았다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          공식적인 DB 작업 신청 프로세스를 구축했다:
        </p>
        <ol>
          <li><strong>작업 신청서 작성</strong> — 작업 목적, 대상 DB/테이블, 필요 권한, 작업 기간을 명시하여 신청</li>
          <li><strong>super_admin 승인</strong> — DBA 또는 정보보호담당자가 신청 내용을 검토한 뒤 PETRA에서 기간 한정 권한 부여</li>
          <li><strong>작업 수행</strong> — 부여된 기간 내에만 해당 권한 사용 가능</li>
          <li><strong>자동 회수</strong> — 설정된 기간이 만료되면 PETRA가 자동으로 권한 회수. 수동 회수 누락 방지</li>
          <li><strong>사후 검토</strong> — 작업 완료 후 실행된 쿼리 로그를 신청서와 대조. 신청 범위를 벗어난 쿼리가 있으면 보안 사고로 보고</li>
        </ol>

        <p>
          이 프로세스의 핵심은 "모든 권한 변경에 사유와 기한이 존재"한다는 것.<br />
          심사원이 "이 계정에 UPDATE 권한이 있는 이유가 뭡니까?"라고 물었을 때, 작업 신청서를 보여주면 된다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈 종합</strong><br />
          DB 접근통제의 핵심은 세 가지: 계정 분리, 경로 통제, 로그 검토.
          계정을 분리하지 않으면 "누가 했는지" 추적할 수 없고,
          경로를 통제하지 않으면 "어디서 접속했는지" 알 수 없고,
          로그를 검토하지 않으면 "실제로 관리하고 있는지" 증명할 수 없다.
          PETRA 같은 접근제어 솔루션은 이 세 가지를 한 번에 해결해주지만,
          도입만 하고 로그 검토를 안 하면 심사에서 "형식적 도입"으로 지적당한다.
        </p>

      </div>
    </section>
  );
}
