import OverviewViz from './viz/OverviewViz';
import AuditLoopInlineViz from './viz/AuditLoopInlineViz';
import DefectGradeInlineViz from './viz/DefectGradeInlineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">현장심사 흐름과 준비</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <OverviewViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">현장심사란</h3>
        <p>
          ISMS-P 현장심사는 서면심사에서 확인한 문서가 "실제로 작동하고 있는가"를 검증하는 단계.<br />
          심사원이 사업장에 직접 방문하여 시스템 화면을 보고, 담당자를 인터뷰하고, 물리적 환경을 눈으로 확인한다.<br />
          문서에 "방화벽 규칙을 월 1회 검토한다"고 적혀 있으면 — 실제 검토 기록을 꺼내서 보여줘야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">심사 일정과 구성</h3>
        <p>
          현장심사 기간은 통상 3~5일. 조직 규모와 인증 범위에 따라 달라진다.<br />
          심사원은 보통 2~4명이 팀을 구성 — 심사팀장 1명 + 심사원 1~3명.<br />
          각 심사원이 담당 영역을 나눠서 병렬로 진행한다:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">심사원</th>
                <th className="text-left px-3 py-2 border-b border-border">담당 영역</th>
                <th className="text-left px-3 py-2 border-b border-border">주요 확인 대상</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">심사원 A</td>
                <td className="px-3 py-1.5 border-b border-border/30">1.x 관리체계 + 2.1~2.4</td>
                <td className="px-3 py-1.5 border-b border-border/30">정책 문서, 위험평가서, 인적·물리 보안</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">심사원 B</td>
                <td className="px-3 py-1.5 border-b border-border/30">2.5~2.7 인증·접근·암호화</td>
                <td className="px-3 py-1.5 border-b border-border/30">서버 설정, 계정 관리, DB 접근제어</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">심사원 C</td>
                <td className="px-3 py-1.5 border-b border-border/30">2.8~2.12 개발·운영·사고</td>
                <td className="px-3 py-1.5 border-b border-border/30">소스코드 관리, 패치, 백업, 로그</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">심사원 D</td>
                <td className="px-3 py-1.5">3.x 개인정보</td>
                <td className="px-3 py-1.5">동의 화면, 처리방침, 파기 절차</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">심사 방식: 3단계 루프</h3>

        <div className="not-prose my-4">
          <AuditLoopInlineViz />
        </div>

        <p>
          심사원은 한 항목에 대해 세 가지 방법을 조합하여 검증한다:
        </p>
        <ol>
          <li>
            <strong>문서 확인</strong> — 정책서, 지침서, 절차서가 존재하는지 확인.<br />
            "접근통제 정책이 있나요?" → 정책 문서를 제시.
          </li>
          <li>
            <strong>담당자 인터뷰</strong> — 정책이 실무에 반영되는지 질문.<br />
            "비밀번호 변경 주기를 알고 계신가요?" → 담당자가 구두로 설명.<br />
            이때 담당자의 답변이 문서와 다르면 "문서와 실행 간 괴리" 결함.
          </li>
          <li>
            <strong>시스템 실사(화면 확인)</strong> — 실제 시스템에서 설정을 확인.<br />
            "설정 화면 보여주세요" → 담당자가 화면을 열어 시연.<br />
            심사원이 직접 명령어를 요청하기도 한다 — <code>cat /etc/ssh/sshd_config</code> 등.
          </li>
        </ol>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 핵심 원칙</strong><br />
          심사원은 "증적(Evidence, 이행 근거 자료)"으로만 판단한다.
          구두 설명만으로는 절대 적합 판정을 받을 수 없다.
          "하고 있습니다"가 아니라 "여기 증거입니다"가 돼야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">증적자료란</h3>
        <p>
          증적(Evidence)은 "이 정책이 실제로 작동하고 있다"를 증명하는 모든 자료.<br />
          형태는 다양하다:
        </p>
        <ul>
          <li><strong>스크린샷</strong> — 시스템 설정 화면, 방화벽 규칙, 로그 조회 결과</li>
          <li><strong>로그 파일</strong> — 접근 기록, 변경 이력, 백업 결과 로그</li>
          <li><strong>문서</strong> — 결재된 정책서, 교육 수료증, 회의록, 점검 보고서</li>
          <li><strong>사진</strong> — 서버실 출입통제 장치, CCTV 설치 현황, 잠금장치</li>
          <li><strong>시스템 기록</strong> — 감사 로그(Audit Log), 알림 기록, 티켓 처리 이력</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">사전 준비: 체크리스트</h3>
        <p>
          현장심사 2~4주 전에 완료해야 할 준비 사항:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">준비 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">증적 정리</td>
                <td className="px-3 py-1.5 border-b border-border/30">인증 기준 번호별 폴더 생성 → 각 항목의 증적 파일 배치</td>
                <td className="px-3 py-1.5 border-b border-border/30">2.5.1_비밀번호정책/ 형태로 구성</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">담당자 배정</td>
                <td className="px-3 py-1.5 border-b border-border/30">각 인증 기준 항목별 응답 담당자 지정</td>
                <td className="px-3 py-1.5 border-b border-border/30">부재 시 대리인도 지정</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">시연 환경</td>
                <td className="px-3 py-1.5 border-b border-border/30">심사 당일 보여줄 화면 사전 테스트 — 로그인, 쿼리, 콘솔 접속</td>
                <td className="px-3 py-1.5 border-b border-border/30">VPN 끊김, 세션 만료 방지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">심사 장소</td>
                <td className="px-3 py-1.5 border-b border-border/30">프로젝터/모니터, 네트워크, 화이트보드 준비된 회의실</td>
                <td className="px-3 py-1.5 border-b border-border/30">심사원 전용 좌석 배정</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">리허설</td>
                <td className="px-3 py-1.5">주요 질문에 대한 모의 응답 연습</td>
                <td className="px-3 py-1.5">신입 담당자는 반드시 참여</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">심사원이 싫어하는 것</h3>
        <p>
          현장심사에서 결함으로 이어지는 대표적 패턴:
        </p>
        <ul>
          <li><strong>"구두 설명만"</strong> — "저희는 하고 있습니다" → 증적이 없으면 미이행으로 판정</li>
          <li><strong>"나중에 보내드리겠습니다"</strong> — 현장에서 즉시 제시하지 못하면 증적 미비로 기록</li>
          <li><strong>정책만 있고 실행 없음</strong> — 정책서에 "월 1회 점검"이라고 적혀있는데 점검 기록이 3개월치밖에 없는 경우</li>
          <li><strong>담당자 부재</strong> — 해당 영역 담당자가 출장/휴가로 부재 → 질의응답 불가</li>
          <li><strong>문서 날짜 불일치</strong> — 정책서 최종 수정일이 2년 전 → "정기적 검토가 이뤄지지 않았다" 지적</li>
          <li><strong>과도한 예외 처리</strong> — 예외 승인이 전체 건수의 절반 이상 → "정책이 현실에 맞지 않다" 판단</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">결함 등급과 대응</h3>

        <div className="not-prose my-4">
          <DefectGradeInlineViz />
        </div>

        <p>
          심사원이 발견한 문제는 결함 보고서에 기록되며, 등급에 따라 후속 조치가 다르다:
        </p>
        <ul>
          <li>
            <strong>결함(Minor)</strong> — 요구사항에 충족하지 못하지만 중대한 영향은 아닌 사항.<br />
            보완조치 기간(통상 40일) 내에 개선하면 된다.
          </li>
          <li>
            <strong>중결함(Major)</strong> — 정보보호에 중대한 위험을 초래하는 사항.<br />
            중결함이 다수 발견되면 심사가 중단될 수 있다. 심사 재개 전 현장 재확인이 필요할 수 있다.
          </li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 보완조치 전략</strong><br />
          결함이 나왔다고 인증 실패는 아니다. 대부분의 조직은 현장심사에서 5~15개의 결함을 받는다.
          중요한 것은 보완조치의 품질 — "일시적 땜질"이 아니라 "재발 방지 체계"를 증적으로 보여줘야 한다.
          예: 패치 미적용 결함 → 단순 패치 적용이 아니라 정기 패치 절차서 수립 + 자동화 스크립트 구축 + 모니터링 설정까지.
        </p>

      </div>
    </section>
  );
}
