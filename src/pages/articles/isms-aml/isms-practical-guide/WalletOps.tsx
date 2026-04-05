import WalletOpsViz from './viz/WalletOpsViz';

export default function WalletOps() {
  return (
    <section id="wallet-ops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">월렛 운영과 이상거래</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          VASP 심사에서 일반 기업과 가장 다른 부분이 월렛 운영과 이상거래 탐지다.<br />
          가상자산을 직접 보관하고 이전하는 VASP 특유의 리스크를 심사원이 집중적으로 확인한다.<br />
          이 섹션의 사례들은 "VASP이기 때문에" 결함을 받은 항목들이다.
        </p>

        <div className="my-8">
          <WalletOpsViz />
        </div>

        {/* ── 월렛룸 상호보완 통제 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">월렛룸 상호보완 통제 — 직무 분리의 핵심</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          우리 거래소에는 콜드월렛(Cold Wallet, 인터넷에 연결되지 않은 오프라인 지갑)을 보관하는 월렛룸이 있었다.<br />
          월렛룸 출입 권한은 다음 세 명에게 부여되어 있었다:
        </p>
        <ul>
          <li>정보보호최고책임자(CISO)</li>
          <li>월렛 운영 담당자</li>
          <li>콜드월렛 서명 담당자</li>
        </ul>
        <p>
          이 구성이 문제가 될 줄은 몰랐다. 셋 다 보안이나 월렛 관련 업무를 담당하는 사람이므로 합리적이라고 생각했다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">심사원 지적</h4>
        <p>
          심사원의 지적은 이랬다:<br />
          <em>"월렛 관련 직무를 수행하는 인원이 월렛룸 물리적 접근 통제 권한까지 보유하면 상호보완 통제가 되지 않습니다."</em>
        </p>
        <p>
          월렛 담당자와 서명 담당자는 이미 가상자산을 이동시킬 수 있는 권한을 가지고 있다.<br />
          이 사람들이 물리적 접근까지 통제하면, "자산을 이동시킬 수 있는 권한"과 "자산이 보관된 물리 공간에 대한 통제"가 같은 사람에게 집중된다.<br />
          이것은 직무 분리(Segregation of Duties, SoD) 원칙에 위배되는 것이다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          월렛룸 출입 권한자를 재구성했다:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">변경 전</th>
                <th className="text-left px-3 py-2 border-b border-border">변경 후</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">출입 권한자 1</td>
                <td className="px-3 py-1.5 border-b border-border/30">CISO</td>
                <td className="px-3 py-1.5 border-b border-border/30">CISO (유지 — 총괄 책임자)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">출입 권한자 2</td>
                <td className="px-3 py-1.5 border-b border-border/30">월렛 운영 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">일반 개발자 A (월렛 무관 업무)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">출입 권한자 3</td>
                <td className="px-3 py-1.5">콜드월렛 서명 담당자</td>
                <td className="px-3 py-1.5">일반 개발자 B (월렛 무관 업무)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          월렛 담당자가 콜드월렛에 접근해야 할 때는 출입 권한자(일반 개발자)에게 동행을 요청해야 한다.<br />
          "자산을 옮길 수 있는 사람"과 "물리 공간을 열 수 있는 사람"이 분리되어, 단독으로 자산에 접근하는 것이 불가능한 구조.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈: 직무 분리는 "불편해야" 맞는 것</strong><br />
          직무 분리의 핵심은 "한 사람이 전체 프로세스를 단독으로 완료할 수 없게 만드는 것"이다.
          편의성을 위해 관련 업무 인원에게 모든 권한을 집중시키면, 통제가 무력화된다.
          월렛룸 출입에 월렛 무관 인원이 필요한 것은 불편하지만, 그 불편함이 곧 보안이다.
        </p>

        {/* ── 이상거래 탐지 기준 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">이상거래 탐지 기준 수립</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          이상거래 탐지 시스템(FDS, Fraud Detection System)은 존재했지만, 구체적인 수치 기준이 없었다.<br />
          "비정상적으로 큰 금액"이라는 모호한 기준으로 운영되고 있었고, 무엇이 "비정상적"인지 정의되지 않았다.<br />
          심사원이 "이상거래 판단 기준이 뭡니까?"라고 물었을 때, 명확한 수치를 제시하지 못했다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          구체적인 수치 기준을 수립하고 시스템에 적용했다:
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">금액 기반 탐지</h4>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">조건</th>
                <th className="text-left px-3 py-2 border-b border-border">기준</th>
                <th className="text-left px-3 py-2 border-b border-border">조치</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">단일 거래 금액</td>
                <td className="px-3 py-1.5 border-b border-border/30">해당 사용자 월평균 거래 금액의 3배 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">알림 + 수동 검토</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">단기간 집중 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">30분 이내에 일평균 거래 금액의 50% 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">알림 + 추가 인증 요구</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">보유액 대비 대량 이체</td>
                <td className="px-3 py-1.5">보유 자산의 90% 이상을 실시간 이체</td>
                <td className="px-3 py-1.5">이체 보류 + 본인 확인</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">행동 기반 탐지</h4>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">조건</th>
                <th className="text-left px-3 py-2 border-b border-border">상세</th>
                <th className="text-left px-3 py-2 border-b border-border">조치</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">위치정보 급변</td>
                <td className="px-3 py-1.5 border-b border-border/30">서울에서 로그인 후 10분 내 해외 IP에서 접속</td>
                <td className="px-3 py-1.5 border-b border-border/30">세션 차단 + 재인증</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">사용자 프로필 불일치</td>
                <td className="px-3 py-1.5 border-b border-border/30">기존 거래 패턴과 현저히 다른 코인/금액 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">알림 + 수동 검토</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">접속 환경 변화</td>
                <td className="px-3 py-1.5 border-b border-border/30">평소와 다른 브라우저/디바이스/OS에서 접속</td>
                <td className="px-3 py-1.5 border-b border-border/30">추가 인증 요구</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">출금계좌 변경</td>
                <td className="px-3 py-1.5">출금 주소를 변경한 직후 대량 출금 시도</td>
                <td className="px-3 py-1.5">출금 보류 + 본인 확인</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          각 탐지 기준에는 조치 단계가 명시되어 있다. 단순 알림 → 추가 인증 요구 → 거래 보류 → 계정 잠금 순서로 단계적 대응.<br />
          월간 탐지 현황 보고서를 작성하여 탐지 건수, 오탐(False Positive) 비율, 조치 결과를 기록한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈: 수치 기준 없이는 "이상"을 정의할 수 없다</strong><br />
          "비정상적 거래"라는 표현만으로는 심사를 통과할 수 없다.
          "무엇이 비정상인가"를 숫자로 정의해야 한다.
          기준은 사업 특성에 맞게 설정하되, 설정 근거(월평균 거래 금액 통계 등)도 문서화해야 한다.
          심사원이 "이 3배라는 기준은 어디서 나온 건가요?"라고 물을 수 있기 때문.
        </p>

        {/* ── 회원탈퇴 분리보관 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">회원탈퇴 분리보관 — 삭제가 아니라 분리</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          회원이 탈퇴하면 회원 테이블에서 <code>status</code> 컬럼을 <code>inactive</code>로 변경하는 것이 전부였다.<br />
          탈퇴 회원 데이터가 일반 회원 데이터와 같은 테이블에 계속 남아있었다.<br />
          보유 기간이 지나도 자동 삭제되지 않았고, 삭제 시점에 대한 정책도 없었다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">심사원 지적</h4>
        <p>
          개인정보보호법상, 탈퇴 회원의 개인정보는 "분리 보관"해야 한다.<br />
          일반 회원 테이블에 그대로 두면 "분리"가 아니다. 물리적으로 다른 테이블이나 DB에 옮겨야 분리 보관으로 인정된다.<br />
          또한 법정 보유기간(5년, 전자상거래법)이 지나면 지체 없이 파기해야 한다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          탈퇴 처리 프로세스를 전면 개편했다:
        </p>
        <ol>
          <li>
            <strong>분리보관 테이블 생성</strong> — <code>cancel_user_info</code> 테이블을 별도로 생성.
            탈퇴 일시, 탈퇴 사유, 보유 만료일(탈퇴일 + 5년)을 함께 기록
          </li>
          <li>
            <strong>탈퇴 시 자동 이동</strong> — 회원 탈퇴 요청 처리 시, 원본 테이블에서 <code>cancel_user_info</code>로 데이터 이동(INSERT → DELETE). 원본 테이블에는 데이터가 남지 않음
          </li>
          <li>
            <strong>자동 삭제 프로시저</strong> — MySQL 저장 프로시저 <code>DeleteOldCancelUserData</code>를 작성.
            <code>cancel_user_info</code>에서 보유 만료일이 지난 레코드를 영구 삭제
          </li>
          <li>
            <strong>자동 실행</strong> — MySQL 이벤트 스케줄러로 프로시저를 매일 자동 실행.
            수동 삭제에 의존하면 누락이 발생하므로, 시스템 자동화가 핵심
          </li>
        </ol>

        <p>
          운영 DB에 프로시저와 이벤트를 적용한 뒤, 실행 로그를 캡처하여 증적으로 제출했다.<br />
          "분리보관 → 보유기간 경과 → 자동 파기"의 전 과정이 시스템에 의해 자동으로 관리되므로, 인적 오류가 개입할 여지가 없다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈: "삭제"와 "분리보관" 그리고 "파기"는 다르다</strong><br />
          status 변경은 삭제가 아니다. 같은 테이블에 있으면 분리보관이 아니다.
          법정 보유기간을 넘겨서 보관하면 위법이다.
          탈퇴 처리 = 분리보관(별도 테이블) + 보유기간 관리 + 자동 파기.
          이 세 가지가 코드와 DB에 구현되어 있어야 심사를 통과한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈 종합: VASP 특수 영역</strong><br />
          월렛 보안과 이상거래 탐지는 일반 ISMS에는 없는 VASP 고유 심사 항목이다.
          월렛룸 직무 분리, 이상거래 수치 기준, 탈퇴 데이터 분리보관 — 이 세 가지는 VASP라면 반드시 준비해야 한다.
          특히 직무 분리는 "편의성을 포기하는 결정"이므로, 경영진의 이해와 승인이 선행되어야 한다.
        </p>

      </div>
    </section>
  );
}
