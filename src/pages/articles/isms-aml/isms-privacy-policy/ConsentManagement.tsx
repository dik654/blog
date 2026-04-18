import ConsentManagementViz from './viz/ConsentManagementViz';
import ActiveConsentInlineViz from './viz/ActiveConsentInlineViz';
import WithdrawalInlineViz from './viz/WithdrawalInlineViz';

export default function ConsentManagement() {
  return (
    <section id="consent-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">수집/이용 동의 체계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">동의의 법적 근거</h3>
        <p>
          개인정보보호법 제15조(수집·이용)는 개인정보를 수집할 수 있는 6가지 법적 근거를 규정.<br />
          그 중 가장 일반적인 근거가 "정보주체의 동의"(제15조 제1항 제1호).<br />
          동의 외에도 "법률에 특별한 규정이 있는 경우", "계약의 체결·이행에 불가피한 경우" 등이 있으나, VASP는 대부분 동의 기반으로 수집한다 — KYC 항목의 범위가 넓어 다른 근거만으로 정당화하기 어렵기 때문.
        </p>
        <p>
          제17조(제3자 제공)는 별도의 동의를 요구한다.<br />
          수집 동의와 제3자 제공 동의는 반드시 분리해야 하며, 하나의 체크박스로 묶으면 무효 처리된다.
        </p>

        <div className="my-8">
          <ConsentManagementViz />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">필수항목 vs 선택항목</h3>
        <p>
          개인정보보호법 제16조 제2항 — "필요한 최소한의 정보 외의 개인정보 수집에는 동의하지 않을 수 있다는 사실을 구체적으로 알리고 개인정보를 수집하여야 한다."<br />
          이를 실무에서는 "필수항목"과 "선택항목"으로 구분하여 구현한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">정의</th>
                <th className="text-left px-3 py-2 border-b border-border">미동의 시</th>
                <th className="text-left px-3 py-2 border-b border-border">VASP 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">필수항목</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 제공에 반드시 필요한 최소 정보</td>
                <td className="px-3 py-1.5 border-b border-border/30">서비스 이용 불가</td>
                <td className="px-3 py-1.5 border-b border-border/30">성명, 생년월일, 연락처, 신분증 사본</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">선택항목</td>
                <td className="px-3 py-1.5">서비스 품질 향상 등 부가 목적의 정보</td>
                <td className="px-3 py-1.5">서비스 거부 불가 (이용 가능)</td>
                <td className="px-3 py-1.5">마케팅 수신 동의, 투자 성향 설문</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          핵심 원칙: 선택항목에 동의하지 않았다는 이유로 서비스 가입을 거부하면 법 위반.<br />
          ISMS-P 심사에서는 실제 가입 화면을 시연하며, 선택항목 미동의 상태로 가입이 완료되는지 확인한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">동의 받는 방법: 적극적 동의</h3>
        <div className="my-6">
          <ActiveConsentInlineViz />
        </div>
        <p>
          개인정보보호법 시행령 제17조는 동의를 받을 때 "각각의 동의 사항을 구분하여 정보주체가 이를 명확하게 인지할 수 있도록" 하라고 규정.<br />
          실무에서 유효한 동의로 인정받으려면 다음 조건을 충족해야 한다:
        </p>
        <ul>
          <li><strong>명확한 고지</strong> — 수집 목적, 항목, 보유기간, 거부 시 불이익을 사전에 알린다</li>
          <li><strong>적극적 의사 표시</strong> — 체크박스(기본값 미선택), 전자서명, 구두 확인 등 능동적 행위 필요. 사전 체크된 체크박스는 무효</li>
          <li><strong>개별 동의</strong> — 필수/선택, 수집/제3자제공, 마케팅을 각각 분리하여 동의</li>
          <li><strong>중요사항 강조</strong> — 수집 목적, 항목 중 민감정보(Sensitive Information, 건강·사상·신용정보 등), 보유기간을 다른 내용보다 명확하게 표시 (굵은 글씨, 색상 구분 등)</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 포괄 동의의 함정</strong><br />
          "위 내용에 모두 동의합니다" 하나의 체크박스로 필수+선택+제3자제공+마케팅을 묶으면
          개인정보보호법 제22조 위반으로 과태료 부과 대상. 각 동의는 반드시 분리해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">만 14세 미만 아동</h3>
        <p>
          개인정보보호법 제22조 제6항 — 만 14세 미만 아동의 개인정보를 수집하려면 법정대리인(Legal Guardian, 부모 또는 후견인)의 동의가 필수.<br />
          법정대리인 동의 확인 방법:
        </p>
        <ul>
          <li>법정대리인의 휴대전화 본인인증</li>
          <li>법정대리인의 신용카드 인증</li>
          <li>법정대리인의 공인전자서명</li>
          <li>서면 동의서 제출</li>
        </ul>
        <p>
          VASP의 경우 대부분 만 19세(성인) 이상만 가입을 허용하여 이 문제를 회피하지만, 서비스 약관에 연령 제한을 명시하고 본인인증 단계에서 연령을 검증해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">마케팅 동의와 재동의</h3>
        <p>
          마케팅(광고성 정보 전송) 동의는 다른 동의와 별도로 받아야 한다.<br />
          정보통신망법 제50조 — 영리 목적의 광고성 정보를 전송하려면 사전 수신 동의가 필요.
        </p>
        <ul>
          <li><strong>별도 동의</strong> — 서비스 이용 동의와 분리. 마케팅 미동의 시에도 핵심 서비스 이용 가능</li>
          <li><strong>2년 주기 재동의</strong> — 정보통신망법 시행령 제62조에 따라 마케팅 동의는 2년마다 재확인. 재동의를 받지 않으면 기존 동의는 효력 상실</li>
          <li><strong>야간 광고 제한</strong> — 오후 9시부터 오전 8시까지는 별도의 사전 동의 없이 광고 전송 불가</li>
          <li><strong>수신 거부 안내</strong> — 모든 광고 메시지에 무료 수신 거부 방법을 명시</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">동의 철회</h3>
        <div className="my-6">
          <WithdrawalInlineViz />
        </div>
        <p>
          개인정보보호법 제37조 — 정보주체는 언제든지 동의를 철회(Withdrawal of Consent)할 수 있다.<br />
          핵심 원칙: "수집 경로보다 쉬운 방법으로 철회할 수 있어야 한다."
        </p>
        <ul>
          <li>온라인으로 수집했으면 온라인으로 철회 가능해야 함</li>
          <li>앱에서 수집했으면 앱 내에서 철회 가능해야 함</li>
          <li>전화·방문으로만 철회 가능하게 하면 법 위반 — 수집보다 어려운 방법</li>
          <li>철회 요청 후 10일 이내에 처리 완료 의무</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">동의 기록 보관</h3>
        <p>
          동의를 받은 사실에 대한 증적(Evidence)을 보관해야 한다.<br />
          "동의를 받았는가"에 대한 입증 책임은 개인정보처리자에게 있으므로 — 정보주체가 "동의한 적 없다"고 주장하면 처리자가 동의 사실을 증명해야 한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">보관 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">보관 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">동의 일시</td>
                <td className="px-3 py-1.5 border-b border-border/30">연-월-일 시:분:초 단위</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">동의 방법</td>
                <td className="px-3 py-1.5 border-b border-border/30">웹 체크박스, 전자서명, 서면 등</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">동의 내용</td>
                <td className="px-3 py-1.5 border-b border-border/30">동의 시점의 처리방침 버전</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">동의 버전</td>
                <td className="px-3 py-1.5">처리방침 v1.0, v1.1 등 버전 번호</td>
                <td className="px-3 py-1.5">영구</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP 특수성: KYC와 동의</strong><br />
          VASP의 KYC(Know Your Customer) 절차에서는 신분증 사본, 은행 계좌 정보, 셀카(생체인증용) 등 민감도가 높은 항목을 수집한다.<br />
          이 항목들은 모두 필수항목에 해당하지만, 수집 목적(본인확인, 자금세탁방지)과 보유기간(특금법 5년)을 구체적으로 고지해야 한다.<br />
          "KYC 인증"이라는 포괄적 목적 표시로는 부족하다 — 신분증은 "본인확인", 계좌정보는 "원화 입출금 연동", 셀카는 "얼굴 대조를 통한 신원 검증"처럼 항목별 목적을 분리 고지해야 한다.
        </p>

      </div>
    </section>
  );
}
