import OverviewViz from './viz/OverviewViz';
import RequiredItemsInlineViz from './viz/RequiredItemsInlineViz';
import ChangeProcessInlineViz from './viz/ChangeProcessInlineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개인정보 처리방침이란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">법적 근거: 개인정보보호법 제30조</h3>
        <p>
          개인정보 처리방침(Privacy Policy)은 개인정보처리자가 개인정보를 어떻게 수집·이용·보관·파기하는지 정보주체(Data Subject, 개인정보의 주인)에게 알리는 공식 문서.<br />
          개인정보보호법 제30조 제1항은 모든 개인정보처리자에게 처리방침 수립 및 공개 의무를 부과한다.<br />
          "수립"은 내부 규정으로 확정하는 것, "공개"는 정보주체가 쉽게 확인할 수 있도록 외부에 게시하는 것을 의미.
        </p>
        <p>
          이 의무를 위반하면 개인정보보호법 제75조에 따라 1천만 원 이하의 과태료가 부과된다.<br />
          VASP(Virtual Asset Service Provider, 가상자산사업자)는 ISMS-P 인증 심사 시 처리방침의 적정성을 별도 항목으로 검증받는다 — 인증 기준 3.1(개인정보 수집 시 보호조치)과 직접 연동.
        </p>

        <div className="my-8">
          <OverviewViz />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">ISMS-P 3.x 영역과의 관계</h3>
        <p>
          ISMS-P 인증의 3.x 영역은 "개인정보 처리단계별 요구사항"으로, 총 22개 항목으로 구성.<br />
          처리방침은 이 22개 항목의 요약본 성격을 갖는다 — 조직 내부에서 실행하는 개인정보 보호 조치를 외부에 공개하는 창구.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">ISMS-P 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">주제</th>
                <th className="text-left px-3 py-2 border-b border-border">처리방침 연동</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">3.1</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보 수집 시 보호조치</td>
                <td className="px-3 py-1.5 border-b border-border/30">수집 목적·항목·보유기간 기재</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">3.2</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보 이용 및 제공</td>
                <td className="px-3 py-1.5 border-b border-border/30">제3자 제공·위탁 현황 기재</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">3.3</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보 보관 및 파기</td>
                <td className="px-3 py-1.5 border-b border-border/30">보유기간·파기 방법 기재</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">3.4</td>
                <td className="px-3 py-1.5 border-b border-border/30">정보주체 권리보호</td>
                <td className="px-3 py-1.5 border-b border-border/30">열람·정정·삭제 절차 기재</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">3.5</td>
                <td className="px-3 py-1.5">개인정보처리업무 위탁</td>
                <td className="px-3 py-1.5">위탁업체·업무 범위 기재</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">필수 기재 항목 (제30조 제1항 각호)</h3>
        <div className="my-6">
          <RequiredItemsInlineViz />
        </div>
        <p>
          개인정보보호법 제30조 제1항은 처리방침에 반드시 포함해야 할 항목을 열거한다.<br />
          시행령 제31조는 이를 더 구체화하여 세부 기재 사항을 규정.
        </p>
        <ol>
          <li>
            <strong>개인정보 처리 목적</strong> — 왜 수집하는가. 예: "회원 가입 및 관리", "본인확인(KYC)", "이상거래 모니터링".<br />
            목적은 구체적이어야 하며, "서비스 개선"처럼 포괄적 표현은 부적합 판정 대상.
          </li>
          <li>
            <strong>처리하는 개인정보 항목</strong> — 무엇을 수집하는가. 필수항목과 선택항목을 구분하여 기재.<br />
            VASP의 경우: 성명, 생년월일, 주민등록번호(또는 외국인등록번호), 연락처, 주소, 은행 계좌번호, 지갑주소 등.
          </li>
          <li>
            <strong>보유 및 이용 기간</strong> — 얼마나 보관하는가. 법령에 따른 보존 의무가 있으면 해당 기간과 근거 법률을 명시.<br />
            예: "특정금융정보법에 따라 고객확인 자료 5년 보관".
          </li>
          <li>
            <strong>제3자 제공 현황</strong> — 누구에게 전달하는가. 제공받는 자, 제공 목적, 제공 항목, 보유기간을 각각 기재.<br />
            VASP 예시: Travel Rule 이행을 위한 상대 VASP 제공.
          </li>
          <li>
            <strong>위탁 처리 현황</strong> — 어떤 업무를 외부에 맡기는가. 수탁자명과 위탁 업무 내용을 기재.<br />
            예: "KYC 본인인증 — 본인인증 서비스 제공업체", "클라우드 인프라 운영 — 클라우드 서비스 제공업체".
          </li>
          <li>
            <strong>정보주체의 권리·의무 및 행사 방법</strong> — 열람, 정정, 삭제, 처리정지를 어떻게 요청하는가.<br />
            온라인(웹 폼, 이메일) 및 오프라인(서면) 경로를 모두 안내해야 한다.
          </li>
          <li>
            <strong>개인정보보호책임자(CPO) 연락처</strong> — 성명, 직위, 부서, 연락처(전화/이메일).<br />
            CPO는 개인정보보호법 제31조에 따라 지정하며, 정보주체의 민원을 접수·처리하는 창구.
          </li>
          <li>
            <strong>처리방침 변경 이력</strong> — 변경 일자와 변경 내용을 기록하여 정보주체가 이전 버전과 비교 가능하도록 한다.<br />
            시행일(시행 시작 날짜)을 반드시 명시.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">공개 방법과 위치</h3>
        <p>
          처리방침은 정보주체가 쉽게 확인할 수 있는 위치에 지속적으로 게시해야 한다.<br />
          개인정보보호법 시행령 제31조 제3항은 다음과 같은 공개 방법을 규정:
        </p>
        <ul>
          <li><strong>홈페이지 메인</strong> — 첫 화면 하단(Footer) 또는 메뉴에서 1클릭 이내 접근 가능한 위치에 링크 게시</li>
          <li><strong>회원가입 페이지</strong> — 가입 절차 중 처리방침 전문을 확인할 수 있도록 팝업 또는 별도 페이지 연결</li>
          <li><strong>모바일 앱</strong> — 설정(Settings) 메뉴 내 개인정보 처리방침 항목 배치</li>
          <li><strong>오프라인</strong> — 사업장에 비치하거나, 관보·신문에 게재 (인터넷 서비스가 없는 경우)</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP 실무 포인트</strong><br />
          VASP는 KYC 과정에서 수집하는 개인정보 항목이 일반 서비스보다 많다 — 신분증 사본, 은행 계좌, 가상자산 지갑주소 등.<br />
          처리방침에서 이 항목들을 누락하면 ISMS-P 심사에서 3.1 항목 부적합 판정을 받게 되며,
          정보주체가 "내 신분증 사본이 어디에 쓰이는지 몰랐다"고 민원을 제기하면 개인정보보호위원회 조사 대상이 된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">처리방침 변경 절차</h3>
        <div className="my-6">
          <ChangeProcessInlineViz />
        </div>
        <p>
          처리방침을 변경할 때는 다음 절차를 거쳐야 한다:
        </p>
        <ol>
          <li><strong>변경 사유 발생</strong> — 새로운 개인정보 항목 수집, 제3자 제공 추가, 보유기간 변경 등</li>
          <li><strong>내부 검토</strong> — CPO가 변경안을 검토하고 법적 적합성을 확인</li>
          <li><strong>사전 고지</strong> — 변경 시행 7일 전(중요 사항은 30일 전)에 홈페이지 공지사항으로 알림</li>
          <li><strong>게시 및 시행</strong> — 시행일에 맞춰 처리방침을 교체하고, 이전 버전을 아카이브로 보관</li>
        </ol>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 심사 증적</strong><br />
          ISMS-P 심사에서는 처리방침의 "변경 이력"을 별도 증적으로 요구한다.<br />
          변경 일자, 변경 전후 비교표, 사전 고지 화면 캡처, CPO 검토 서명이 세트로 필요.
        </p>

      </div>
    </section>
  );
}
