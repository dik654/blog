export default function ThirdPartySharing() {
  return (
    <section id="third-party-sharing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">제3자 제공과 위탁</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">제3자 제공: 별도 동의 원칙</h3>
        <p>
          개인정보보호법 제17조 — 개인정보를 제3자에게 제공하려면 정보주체의 별도 동의가 필요.<br />
          "제3자 제공"이란 개인정보처리자가 수집한 개인정보를 다른 법인·기관·개인에게 전달하여 그들이 자체 목적으로 이용하도록 하는 것.<br />
          단순히 업무를 대신 처리하는 "위탁"과는 구별된다 — 위탁은 처리자의 업무를 대행하는 것이고, 제공은 제3자가 자기 목적으로 사용하는 것.
        </p>
        <p>
          동의를 받을 때 반드시 고지해야 하는 사항(제17조 제2항):
        </p>
        <ol>
          <li><strong>제공받는 자</strong> — 누구에게 제공하는지. 기관명 또는 업체명을 구체적으로 명시</li>
          <li><strong>제공 목적</strong> — 제공받는 자가 개인정보를 무엇에 사용하는지</li>
          <li><strong>제공 항목</strong> — 어떤 개인정보 항목을 전달하는지</li>
          <li><strong>보유 및 이용 기간</strong> — 제공받는 자가 얼마나 보관하는지</li>
          <li><strong>동의 거부 권리</strong> — 동의를 거부할 수 있으며, 거부 시 불이익 내용을 안내</li>
        </ol>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">제공받는 자</th>
                <th className="text-left px-3 py-2 border-b border-border">제공 목적</th>
                <th className="text-left px-3 py-2 border-b border-border">제공 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">보유기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">상대 VASP</td>
                <td className="px-3 py-1.5 border-b border-border/30">Travel Rule 이행</td>
                <td className="px-3 py-1.5 border-b border-border/30">성명, 지갑주소</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">금융정보분석원(FIU)</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심거래 보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 내역, 고객 정보</td>
                <td className="px-3 py-1.5 border-b border-border/30">법정 보존기간</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">수사기관</td>
                <td className="px-3 py-1.5">법원 영장에 의한 제공</td>
                <td className="px-3 py-1.5">요청 범위 내</td>
                <td className="px-3 py-1.5">수사 종결 시</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 동의 없이 제공 가능한 경우</strong><br />
          법률에 특별한 규정이 있는 경우(수사기관 영장 집행, 특금법에 따른 FIU 보고)에는 정보주체 동의 없이 제공 가능.<br />
          단, 이 경우에도 처리방침에 "법령에 따른 예외적 제공"이 있음을 명시하고, 제공 기록을 5년간 보관해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">업무 위탁: 수탁자 관리·감독</h3>
        <p>
          개인정보보호법 제26조 — 개인정보 처리 업무를 위탁(Outsourcing)하는 경우, 위탁자는 수탁자(Processor, 업무를 대행하는 자)를 관리·감독해야 한다.<br />
          "위탁"은 제3자 제공과 다르다: 수탁자는 위탁자의 지시 범위 내에서만 개인정보를 처리하며, 자체 목적으로 이용할 수 없다.
        </p>
        <p>
          위탁 시 필수 조치:
        </p>
        <ul>
          <li><strong>위탁 계약서 체결</strong> — 위탁 업무 내용, 처리 제한, 기술적·관리적 보호조치, 재위탁 제한, 손해배상 책임을 명시한 서면 계약</li>
          <li><strong>수탁자 공개</strong> — 처리방침에 수탁자명과 위탁 업무 내용을 게시</li>
          <li><strong>관리·감독</strong> — 수탁자의 개인정보 처리 실태를 정기적으로 점검. 연 1회 이상 교육 실시</li>
          <li><strong>재위탁 제한</strong> — 수탁자가 다시 제3자에게 재위탁하려면 위탁자의 서면 동의 필요</li>
        </ul>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">수탁자</th>
                <th className="text-left px-3 py-2 border-b border-border">위탁 업무</th>
                <th className="text-left px-3 py-2 border-b border-border">처리 항목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">KYC 인증 서비스 업체</td>
                <td className="px-3 py-1.5 border-b border-border/30">본인확인(신분증 OCR, 얼굴 대조)</td>
                <td className="px-3 py-1.5 border-b border-border/30">신분증 이미지, 셀카</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">AML 솔루션 업체</td>
                <td className="px-3 py-1.5 border-b border-border/30">이상거래 탐지, 제재 목록 조회</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 기록, 고객 식별정보</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">클라우드 서비스 업체</td>
                <td className="px-3 py-1.5 border-b border-border/30">서버 인프라 운영, 데이터 저장</td>
                <td className="px-3 py-1.5 border-b border-border/30">전체 개인정보 (암호화 저장)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">고객센터 대행 업체</td>
                <td className="px-3 py-1.5">고객 문의 응대, 민원 처리</td>
                <td className="px-3 py-1.5">성명, 연락처, 문의 내용</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">국외 이전</h3>
        <p>
          개인정보보호법 제28조의8 — 개인정보를 국외로 이전하는 경우 추가 보호조치가 필요.<br />
          국외 이전(Cross-border Transfer)은 해외 서버에 데이터를 저장하거나, 해외 법인에 개인정보를 전송하는 것을 포함.
        </p>
        <p>
          국외 이전 시 고지해야 하는 사항:
        </p>
        <ol>
          <li><strong>이전받는 자</strong> — 해외 법인명, 연락처</li>
          <li><strong>이전 국가</strong> — 데이터가 저장·처리되는 국가명</li>
          <li><strong>이전 일시 및 방법</strong> — 실시간 전송, 배치 전송 등</li>
          <li><strong>이전 항목</strong> — 전달되는 개인정보 항목</li>
          <li><strong>이전받는 자의 이용 목적</strong> — 해당 개인정보를 무엇에 사용하는지</li>
          <li><strong>보호조치</strong> — 이전받는 자가 적용하는 개인정보 보호조치 (암호화, 접근통제 등)</li>
        </ol>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 클라우드와 국외 이전</strong><br />
          해외 클라우드(AWS, GCP 등)를 이용하면서 한국 리전(Region, 데이터센터 소재지)만 사용하더라도,
          클라우드 제공자의 글로벌 관리 인력이 데이터에 접근할 수 있으면 국외 이전에 해당할 수 있다.<br />
          이 경우 처리방침에 국외 이전 사실을 고지하거나, 클라우드 제공자와 "한국 리전 내 데이터 접근 제한" 계약을 체결해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">제공/위탁/이전 현황표</h3>
        <p>
          처리방침에는 제3자 제공, 위탁, 국외 이전의 현황을 표 형태로 일목요연하게 정리해야 한다.<br />
          현황표는 정보주체가 "내 개인정보가 누구에게, 왜, 어떻게 전달되는지"를 한눈에 파악할 수 있는 투명성 도구.
        </p>
        <p>
          ISMS-P 심사에서 확인하는 포인트:
        </p>
        <ul>
          <li>현황표와 실제 데이터 흐름이 일치하는가</li>
          <li>새로운 제공·위탁이 추가될 때 처리방침을 즉시 갱신하는가</li>
          <li>위탁 계약서가 존재하며, 수탁자 관리·감독 증적이 있는가</li>
          <li>국외 이전 시 정보주체에게 고지하고 동의를 받았는가 (또는 법적 예외에 해당하는가)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">제공 vs 위탁 vs 이전: 비교</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">제3자 제공</th>
                <th className="text-left px-3 py-2 border-b border-border">업무 위탁</th>
                <th className="text-left px-3 py-2 border-b border-border">국외 이전</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">이용 목적</td>
                <td className="px-3 py-1.5 border-b border-border/30">제3자 자체 목적</td>
                <td className="px-3 py-1.5 border-b border-border/30">위탁자 업무 대행</td>
                <td className="px-3 py-1.5 border-b border-border/30">제공 또는 위탁 목적</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">법적 근거</td>
                <td className="px-3 py-1.5 border-b border-border/30">제17조 (별도 동의)</td>
                <td className="px-3 py-1.5 border-b border-border/30">제26조 (계약 + 공개)</td>
                <td className="px-3 py-1.5 border-b border-border/30">제28조의8 (고지 + 보호조치)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정보주체 동의</td>
                <td className="px-3 py-1.5 border-b border-border/30">필수 (예외 제한적)</td>
                <td className="px-3 py-1.5 border-b border-border/30">불필요 (공개 의무)</td>
                <td className="px-3 py-1.5 border-b border-border/30">이전 유형에 따라 상이</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">관리 책임</td>
                <td className="px-3 py-1.5">제공받는 자가 독립 책임</td>
                <td className="px-3 py-1.5">위탁자가 관리·감독</td>
                <td className="px-3 py-1.5">이전자가 보호조치 확인</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 구별이 중요한 이유</strong><br />
          실무에서 "제공"과 "위탁"을 혼동하면 법적 의무가 달라진다.<br />
          위탁인데 제공으로 처리하면 불필요한 동의를 받게 되고, 제공인데 위탁으로 처리하면 동의 누락으로 법 위반.<br />
          판단 기준: "개인정보를 받는 자가 자기 목적으로 쓰는가?" — 예라면 제공, 아니라면 위탁.
        </p>

      </div>
    </section>
  );
}
