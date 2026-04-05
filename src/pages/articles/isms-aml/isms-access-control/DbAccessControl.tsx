export default function DbAccessControl() {
  return (
    <section id="db-access-control" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DB 접근제어와 로그 감사</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">DB 접근제어 소프트웨어 도입 이유</h3>
        <p>
          데이터베이스는 조직의 핵심 자산이 집중된 곳 — 고객 개인정보, 거래 내역, 자산 잔고가 모두 DB에 존재한다.<br />
          DB 자체의 계정/권한 관리 기능만으로는 ISMS 2.6.4가 요구하는 수준의 접근통제와 감사를 달성하기 어렵다.
        </p>
        <ul>
          <li><strong>DB 내장 기능의 한계</strong> — DB 계정만으로는 "누가 언제 어떤 쿼리를 실행했는가"를 체계적으로 추적하기 어렵다. 감사 로그 기능이 있더라도 성능 저하가 크거나 로그 관리가 복잡</li>
          <li><strong>IP 기반 통제 불가</strong> — DB 자체는 접속 IP를 세밀하게 제어하는 기능이 제한적. 호스트 방화벽으로 보완해도 관리 포인트가 분산</li>
          <li><strong>쿼리 수준 필터링</strong> — "SELECT는 허용하되 DELETE는 차단", "특정 테이블 접근만 허용" 같은 쿼리 수준 통제가 DB 자체로는 복잡</li>
        </ul>

        <p>
          DB 접근제어 소프트웨어(DAC, Database Access Control)는 DB 앞단에 프록시(Proxy)로 배치되어 모든 DB 접속을 중계한다.<br />
          접속 세션, 실행 쿼리, 접속 IP를 하나의 지점에서 통합 관리하고, 정책 위반 시 차단 또는 알림을 발생시킨다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3중 통제: 세션 + 쿼리 + IP</h3>
        <p>
          효과적인 DB 접근제어는 세 가지 축을 동시에 통제한다.<br />
          하나의 축만 통제하면 우회가 가능하므로 반드시 3중으로 적용.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">통제 축</th>
                <th className="text-left px-3 py-2 border-b border-border">확인 대상</th>
                <th className="text-left px-3 py-2 border-b border-border">통제 예시</th>
                <th className="text-left px-3 py-2 border-b border-border">우회 시나리오</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">세션(누가)</td>
                <td className="px-3 py-1.5 border-b border-border/30">접속자 신원</td>
                <td className="px-3 py-1.5 border-b border-border/30">DB 계정 + 개인 OTP로 세션 인증</td>
                <td className="px-3 py-1.5 border-b border-border/30">세션만 통제 시: 인가된 사용자가 권한 밖 쿼리 실행 가능</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">쿼리(무엇을)</td>
                <td className="px-3 py-1.5 border-b border-border/30">실행 SQL 내용</td>
                <td className="px-3 py-1.5 border-b border-border/30">SELECT만 허용, DROP/DELETE 차단, 특정 테이블 접근 제한</td>
                <td className="px-3 py-1.5 border-b border-border/30">쿼리만 통제 시: 누가 실행했는지 특정 불가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">IP(어디서)</td>
                <td className="px-3 py-1.5">접속 출발지</td>
                <td className="px-3 py-1.5">허용된 IP 그룹에서만 접속 가능</td>
                <td className="px-3 py-1.5">IP만 통제 시: 허용 IP에서 비인가자가 접속 가능</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          3중 통제를 결합하면: "허용된 IP에서(IP) → 본인 인증을 거친 사용자가(세션) → 허가된 쿼리만 실행(쿼리)".<br />
          세 축 모두를 동시에 만족해야 쿼리가 DB에 도달한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">계정 분리 체계</h3>
        <p>
          DB 계정을 용도별로 분리하는 것은 최소 권한 원칙의 DB 적용.<br />
          하나의 "만능 계정"으로 모든 작업을 수행하면 사고 시 피해 범위가 무한대로 확장된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">계정 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">권한</th>
                <th className="text-left px-3 py-2 border-b border-border">허용 IP</th>
                <th className="text-left px-3 py-2 border-b border-border">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">서비스 계정</td>
                <td className="px-3 py-1.5 border-b border-border/30">readWrite — 서비스 테이블에 SELECT/INSERT/UPDATE</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스망 WAS IP만</td>
                <td className="px-3 py-1.5 border-b border-border/30">애플리케이션의 DB 접속용. DELETE 권한 미부여가 원칙</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">관리자 계정</td>
                <td className="px-3 py-1.5 border-b border-border/30">DDL(Data Definition Language, 테이블 구조 변경) 포함</td>
                <td className="px-3 py-1.5 border-b border-border/30">점프서버 IP만</td>
                <td className="px-3 py-1.5 border-b border-border/30">스키마 변경, 인덱스 관리. 기간 한정 접근, 작업 완료 후 세션 종료 필수</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">백업 계정</td>
                <td className="px-3 py-1.5 border-b border-border/30">SELECT + LOCK TABLES — 읽기 전용</td>
                <td className="px-3 py-1.5 border-b border-border/30">백업 서버 IP만</td>
                <td className="px-3 py-1.5 border-b border-border/30">일일 백업 수행용. 데이터 변경 권한 없음</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">로그 계정</td>
                <td className="px-3 py-1.5 border-b border-border/30">SELECT — 특정 로그 테이블만</td>
                <td className="px-3 py-1.5 border-b border-border/30">로그 수집 서버 IP만</td>
                <td className="px-3 py-1.5 border-b border-border/30">감사 로그 수집용. 비즈니스 테이블 접근 불가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">비상 계정</td>
                <td className="px-3 py-1.5">슈퍼 권한(ALL PRIVILEGES)</td>
                <td className="px-3 py-1.5">점프서버 IP만</td>
                <td className="px-3 py-1.5">장애 복구, 긴급 데이터 수정용. 평소 비활성화, 사용 시 CISO 승인 + 사후 감사</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 서비스 계정에 DELETE 미부여</strong><br />
          서비스 로직에서 데이터 삭제가 필요한 경우 물리적 삭제(DELETE)가 아닌 논리적 삭제(Soft Delete, is_deleted 플래그)를 적용.
          물리적 삭제가 불가피한 경우에도 배치(Batch) 프로세스로 분리하여 별도 계정에서 수행.
          이렇게 하면 SQL 인젝션 공격이 서비스 계정을 탈취하더라도 DELETE/DROP을 실행할 수 없다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">IP 그룹 바인딩</h3>
        <p>
          각 DB 계정은 허용된 IP 그룹에서만 접속 가능하도록 바인딩.<br />
          IP 그룹은 접근제어 소프트웨어에서 관리하며, 변경 시 승인 절차를 거친다.
        </p>
        <ul>
          <li><strong>서비스 그룹</strong> — WAS 서버 IP들. 서비스 확장(Scale-out) 시 새 서버 IP를 그룹에 추가하는 절차 수립 필요</li>
          <li><strong>관리 그룹</strong> — 점프서버 IP. 점프서버는 1~2대로 제한하고, 다중 인증(MFA) 후 접속</li>
          <li><strong>백업 그룹</strong> — 백업 서버 IP. 백업 스케줄 시간대에만 접속 허용하는 시간 기반 정책 추가 가능</li>
          <li><strong>긴급 그룹</strong> — 비상 시에만 활성화. 평소 그룹 내 IP가 0개(빈 그룹)로 설정, 긴급 상황에서 점프서버 IP를 임시 추가 후 작업 완료 시 즉시 제거</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">월간 로그 검토</h3>
        <p>
          DB 접근제어 소프트웨어가 기록한 로그는 쌓아두기만 해서는 의미가 없다.<br />
          월 1회 이상 정기 검토를 수행하여 비정상 접근을 식별해야 한다.<br />
          ISMS 심사에서 "로그 검토를 실시했는가, 이상 징후를 발견했을 때 어떻게 조치했는가"를 확인.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">검토 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">탐지 대상</th>
                <th className="text-left px-3 py-2 border-b border-border">조치</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">비인가 접근 시도</td>
                <td className="px-3 py-1.5 border-b border-border/30">허용되지 않은 IP에서의 접속 시도, 차단된 계정으로의 접속 시도</td>
                <td className="px-3 py-1.5 border-b border-border/30">출발지 추적, 반복 시 IP 영구 차단, 내부 침해 여부 확인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">대량 조회</td>
                <td className="px-3 py-1.5 border-b border-border/30">일일 조회 건수 기준치 초과, 전체 테이블 스캔(SELECT *), 대량 데이터 다운로드</td>
                <td className="px-3 py-1.5 border-b border-border/30">사유 확인, 업무 연관성 검증, 데이터 유출 가능성 조사</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">권한 밖 쿼리</td>
                <td className="px-3 py-1.5 border-b border-border/30">읽기 전용 계정에서의 INSERT/UPDATE 시도, 비인가 테이블 접근</td>
                <td className="px-3 py-1.5 border-b border-border/30">계정 사용자에게 경고, 반복 시 계정 비활성화</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">비업무 시간 접속</td>
                <td className="px-3 py-1.5 border-b border-border/30">심야/주말 접속, 예정된 작업 없는 시간대의 관리자 계정 활동</td>
                <td className="px-3 py-1.5 border-b border-border/30">사전 승인된 작업인지 확인, 미승인 접속 시 보안 사고 조사</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">비상 계정 사용</td>
                <td className="px-3 py-1.5">슈퍼 권한 계정 활성화 및 사용 내역</td>
                <td className="px-3 py-1.5">승인 이력 대조, 사용 쿼리 전수 검토, 데이터 변경 영향 분석</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">산출물 목록</h3>
        <p>
          DB 접근제어와 로그 감사의 결과물은 ISMS 심사 증적으로 제출해야 한다.<br />
          아래 문서를 체계적으로 관리하는 것이 심사 대응의 핵심.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">산출물</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">갱신 주기</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">접근제어 정책서</td>
                <td className="px-3 py-1.5 border-b border-border/30">3중 통제 원칙, 계정 분류 기준, IP 그룹 정의, 로그 검토 절차를 문서화</td>
                <td className="px-3 py-1.5 border-b border-border/30">연 1회 + 정책 변경 시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">DB 계정 목록</td>
                <td className="px-3 py-1.5 border-b border-border/30">모든 DB 계정의 용도, 권한, 허용 IP, 소유자(담당자)를 명시한 대장</td>
                <td className="px-3 py-1.5 border-b border-border/30">분기 + 계정 변경 시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">방화벽 규칙 현황</td>
                <td className="px-3 py-1.5 border-b border-border/30">DB 관련 방화벽 규칙(출발지, 목적지, 포트) 목록</td>
                <td className="px-3 py-1.5 border-b border-border/30">분기</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">월간 로그 검토서</td>
                <td className="px-3 py-1.5 border-b border-border/30">비인가 접근 시도 건수, 대량 조회 건수, 이상 징후 목록, 조치 내역</td>
                <td className="px-3 py-1.5 border-b border-border/30">월 1회</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">비상 계정 사용 이력</td>
                <td className="px-3 py-1.5">슈퍼 권한 계정 활성화 일시, 승인자, 사유, 실행 쿼리, 비활성화 일시</td>
                <td className="px-3 py-1.5">사용 시마다</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 로그 보관 기간</strong><br />
          개인정보보호법은 접속 기록을 최소 1년간 보관할 것을 요구(5만 명 이상 정보주체 처리 시 2년).
          VASP는 특금법상 거래 기록 5년 보관 의무가 있으므로, DB 접근 로그도 5년 보관을 권장.
          로그 저장소는 별도 서버에 격리하여 운영자가 로그를 변조하거나 삭제할 수 없도록 보호한다.
        </p>

        <p>
          접근제어는 기술적 솔루션 도입만으로 완성되지 않는다.<br />
          정책 수립 → 솔루션 구현 → 로그 생성 → 정기 검토 → 이상 징후 조치 → 정책 개선의 순환 구조가 지속적으로 운영되어야 ISMS 심사에서 적합 판정을 받을 수 있다.<br />
          "도구를 샀다"가 아니라 "도구를 통해 무엇을 발견하고 어떻게 대응했는가"가 심사의 핵심 관점.
        </p>

      </div>
    </section>
  );
}
