export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">의심거래 보고 의무</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          가상자산 거래에서 자금세탁이 의심되면 금융정보분석원(FIU)에 보고해야 한다.<br />
          이 보고를 STR(Suspicious Transaction Report, 의심거래보고)이라 하며,
          국제적으로는 SAR(Suspicious Activity Report, 의심활동보고)로 불린다.<br />
          한국 특금법에서는 "의심되는 거래의 보고"로 표현하지만, 실무에서 STR과 SAR은 혼용된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">STR과 SAR — 같은 개념, 다른 이름</h3>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">용어</th>
                <th className="text-left px-3 py-2 border-b border-border">정식 명칭</th>
                <th className="text-left px-3 py-2 border-b border-border">사용 맥락</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">STR</td>
                <td className="px-3 py-1.5 border-b border-border/30">Suspicious Transaction Report (의심거래보고)</td>
                <td className="px-3 py-1.5 border-b border-border/30">한국 특금법, FATF 용어. 거래 자체에 초점</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">SAR</td>
                <td className="px-3 py-1.5 border-b border-border/30">Suspicious Activity Report (의심활동보고)</td>
                <td className="px-3 py-1.5 border-b border-border/30">미국 FinCEN 용어. 거래뿐 아니라 행위 전반에 초점</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">CTR</td>
                <td className="px-3 py-1.5">Currency Transaction Report (고액현금거래보고)</td>
                <td className="px-3 py-1.5">의심 여부와 무관하게 일정 금액(1천만 원) 이상 현금 거래 시 자동 보고</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          STR과 CTR의 결정적 차이 — STR은 "의심"이 전제되고, CTR은 "금액"이 전제된다.<br />
          CTR은 기계적으로 보고하면 되지만, STR은 "이 거래가 왜 의심스러운지" 판단이 필요하다.<br />
          이 판단이 AML 담당자의 핵심 역량이며, 보고의 질(quality)이 FIU 분석의 효과를 결정한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">법적 근거 — 특금법 제4조</h3>
        <p>
          특정금융거래정보의 보고 및 이용 등에 관한 법률(특금법) 제4조:<br />
          "금융회사등은 수수한 거래 또는 수수할 거래에 관하여 수수하는 금액이 불법재산이라고 의심되는 합당한 근거가 있는 경우
          또는 거래 상대방이 자금세탁행위를 하고 있다고 의심되는 합당한 근거가 있는 경우 이를 금융정보분석원장에게 보고하여야 한다."
        </p>
        <p>
          여기서 "금융회사등"에 VASP(가상자산사업자)가 포함된다 — 특금법 제2조에서 정의.<br />
          보고 대상은 세 가지 유형:
        </p>
        <ul>
          <li><strong>불법재산 의심</strong> — 거래 자금이 사기, 횡령, 마약 등 범죄 수익에서 유래했다는 합리적 의심</li>
          <li><strong>자금세탁행위 의심</strong> — 범죄 수익의 출처를 은닉하거나 위장하려는 행위 의심</li>
          <li><strong>공중협박자금 의심</strong> — 테러 활동에 자금을 제공하거나 조달하려는 행위 의심</li>
        </ul>

        <p>
          "합리적 의심(합당한 근거)"이란 — 확정적 증거까지는 아니지만,
          AML 전문가가 관련 정황을 종합했을 때 "일반적인 거래로 보기 어렵다"고 판단하는 수준.<br />
          의심의 기준을 너무 높게 잡으면 실제 세탁 거래를 놓치고(미탐),
          너무 낮게 잡으면 보고 건수가 폭증하여 FIU의 분석 역량이 희석된다(과탐).
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">보고 주체와 시기</h3>
        <p>
          <strong>보고 주체:</strong> 금융회사등(은행, 증권사, 보험사, VASP 등) → FIU(금융정보분석원).<br />
          FIU는 금융위원회 산하 기관으로, 의심거래 정보를 수집·분석하여 법집행기관에 제공하는 역할을 수행한다.
        </p>
        <p>
          <strong>보고 시기:</strong> 특금법은 "지체 없이" 보고하도록 규정한다.<br />
          실무적으로는 의심 거래를 인지(FDS 경보 또는 현업 보고)한 시점부터 보고 여부를 결정하고 제출까지 완료하는 데
          3영업일 이내가 표준 기준으로 적용된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CTR — 고액현금거래보고 병행</h3>
        <p>
          STR과 별개로 CTR(Currency Transaction Report, 고액현금거래보고)도 병행해야 한다.<br />
          CTR은 1회 1천만 원 이상의 현금 거래(입금 또는 출금)를 자동으로 보고하는 제도.
        </p>
        <p>
          가상자산에서 CTR의 적용 — 원화 입출금이 1천만 원 이상인 경우 FIU에 자동 보고.<br />
          가상자산 자체의 이전은 "현금"이 아니므로 CTR 대상이 아니지만,
          원화로 환전하는 시점에서 금액 기준에 도달하면 보고 의무가 발생한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">STR</th>
                <th className="text-left px-3 py-2 border-b border-border">CTR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보고 기준</td>
                <td className="px-3 py-1.5 border-b border-border/30">자금세탁 "의심"</td>
                <td className="px-3 py-1.5 border-b border-border/30">1천만 원 이상 "금액"</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">판단 필요</td>
                <td className="px-3 py-1.5 border-b border-border/30">사람의 분석 필요 (AML 담당자 + 준법감시인)</td>
                <td className="px-3 py-1.5 border-b border-border/30">기계적 보고 (금액 기준 충족 시 자동)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보고 시기</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심 인지 후 지체 없이 (3영업일 이내)</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 발생 후 30일 이내</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">미보고 시</td>
                <td className="px-3 py-1.5">과태료 + 형사처벌 가능</td>
                <td className="px-3 py-1.5">과태료</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 보고 건수 추이</strong><br />
          2023년 가상자산사업자의 STR 건수는 전년 대비 약 49% 증가하였고, 전체 STR 중 비중도 1.2%에서 1.7%로 상승했다.<br />
          건수 증가의 원인: FDS 고도화, 감독 당국의 점검 강화, VASP의 AML 역량 성숙.<br />
          FIU가 부과한 과태료 총액의 약 77%가 가상자산사업자에 집중되어 있다(건수 기준 4.2%).<br />
          건당 과태료가 높은 이유는 STR 미보고, CDD 미이행 등 핵심 의무 위반이 대부분이기 때문.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 신고 VASP 현황</strong><br />
          2025년 12월 기준 FIU에 적법하게 신고된 가상자산사업자는 27개소.<br />
          이 외의 사업자는 모두 "미신고" 불법 사업자에 해당하며, 미신고 VASP를 이용한 거래 자체가 위험 신호가 된다.<br />
          FIU는 미신고 VASP의 앱을 구글 플레이에서 차단하는 등 단속을 강화하고 있다.
        </p>

      </div>
    </section>
  );
}
