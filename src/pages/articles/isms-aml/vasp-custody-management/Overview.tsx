export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가상자산 보관 의무</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-4">왜 보관 의무가 필요한가</h3>
        <p className="leading-7">
          가상자산사업자(VASP)는 이용자의 가상자산을 위탁받아 관리한다.
          <br />
          블록체인 거래는 되돌릴 수 없으므로(irreversible), 한 번 유출된 자산은 복구가 사실상 불가능하다.
          <br />
          전통 금융에서 은행이 예금을 보호하듯, VASP는 이용자의 디지털 자산을 안전하게 보관할 법적 의무를 진다.
          <br />
          이 의무의 근거는 가상자산 이용자 보호 등에 관한 법률(가상자산이용자보호법)이다.
          2024년 7월 19일 시행된 이 법률은 이용자 자산 보관, 불공정거래 금지, 손해배상 책임을 체계적으로 규정한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">이용자 자산 vs 회사 자산 분리</h3>
        <p className="leading-7">
          가상자산이용자보호법의 핵심 원칙은 분리 보관이다.
          <br />
          VASP가 보유한 자기 자산(고유재산)과 이용자가 위탁한 자산은 반드시 별도로 관리해야 한다.
          <br />
          분리 보관의 대상은 두 가지로 나뉜다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">보관 방법</th>
                <th className="text-left px-3 py-2 border-b border-border">법적 근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">예치금(원화)</td>
                <td className="px-3 py-1.5 border-b border-border/30">은행 등 공신력 있는 기관에 예치 또는 신탁</td>
                <td className="px-3 py-1.5 border-b border-border/30">법 제6조</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">가상자산</td>
                <td className="px-3 py-1.5">자기 자산과 이용자 자산을 별도 지갑으로 분리 보관</td>
                <td className="px-3 py-1.5">법 제7조</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          예치금의 경우, 이용자 재산이라는 사실을 명시해야 하며, 누구도 상계하거나 압류(가압류 포함)할 수 없다.
          <br />
          VASP가 파산하더라도 이용자 예치금은 VASP의 채무에 영향받지 않는다 -- 이것이 분리 보관의 핵심 효과다.
          <br />
          가상자산 역시 마찬가지로, VASP 자체가 보유한 코인과 이용자가 맡긴 코인을 혼합하면 안 된다.
          <br />
          혼합 보관은 장부 조작, 횡령, 지급 불능 시 이용자 자산 훼손의 직접적 원인이 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">수량 동일성과 종류 동일성</h3>
        <p className="leading-7">
          단순히 "지갑을 나눠라"만으로는 부족하다.
          <br />
          법률은 이용자로부터 위탁받은 가상자산과 동일한 종류, 동일한 수량의 가상자산을 실질적으로 보유할 것을 요구한다.
          <br />
          "종류 동일성"은 이용자가 비트코인을 맡겼으면 비트코인으로 보유해야 한다는 뜻이다.
          이더리움이나 다른 자산으로 대체 보유하는 것은 불가하다.
          <br />
          "수량 동일성"은 이용자 전체의 위탁 수량 합계를 항상 보유해야 한다는 뜻이다.
          일부를 운용하거나 대출해서 부족분이 발생하면 위반이다.
          <br />
          이 두 조건이 "상시 보유" 의무와 결합되어, VASP는 어떤 시점에도 이용자 자산의 전량을 보유하고 있어야 한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 왜 상시 보유가 중요한가</strong><br />
          전통 은행은 부분지급준비금(fractional reserve) 제도 하에서 예금의 일부만 보유해도 된다.
          <br />
          그러나 가상자산은 예금자보호법 적용을 받지 않으므로, VASP가 지급 불능에 빠지면 이용자가 전액 손실을 입을 수 있다.
          <br />
          100% 보유 의무는 이 위험을 원천 차단하기 위한 장치다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">이용자명부 작성 의무</h3>
        <p className="leading-7">
          VASP는 이용자로부터 가상자산 보관을 위탁받을 때 이용자명부를 작성하고 비치해야 한다.
          <br />
          이용자명부에 기재하는 항목은 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">기재 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">주소 및 성명</td>
                <td className="px-3 py-1.5 border-b border-border/30">이용자의 실명과 연락 가능한 주소</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">가상자산 종류 및 수량</td>
                <td className="px-3 py-1.5 border-b border-border/30">위탁한 가상자산의 종목과 보유량</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">가상자산주소</td>
                <td className="px-3 py-1.5">전송 기록 및 보관 내역 관리를 위해 전자적으로 생성시킨 고유식별번호</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          이용자명부는 개인정보가 포함되므로 암호화 저장이 필수다.
          <br />
          접근 권한은 최소 인원에게만 부여하고, 접근 로그를 기록해 사후 추적이 가능하도록 한다.
          <br />
          명부의 존재 이유는 두 가지다 -- 첫째, 이용자가 자신의 자산 현황을 확인할 수 있는 근거 자료.
          둘째, 감독 기관이 VASP의 보관 의무 이행 여부를 점검할 때 대조 기준이 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">보관 책임의 범위</h3>
        <p className="leading-7">
          보관 의무는 단순히 "해킹당하지 않으면 된다"가 아니다.
          <br />
          VASP는 해킹, 전산장애, 임직원 횡령 등으로 이용자 자산에 손해가 발생하면 손해배상 책임을 진다(법 제9조).
          <br />
          다만, VASP가 "고의 또는 과실이 없었다"를 스스로 증명하면 면책될 수 있다 -- 입증 책임이 VASP에게 전환된 것이다.
          <br />
          또한 해킹 등 사고에 대비하여 보험 또는 공제에 가입하거나 준비금을 적립해야 한다(법 제8조).
          <br />
          적립 기준은 콜드월렛 보관 부분을 제외한 나머지의 5%와 30억 원(교환 업무가 없는 사업자는 5억 원) 이상이다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 입증 책임 전환의 의미</strong><br />
          일반 민사소송에서는 피해자가 가해자의 과실을 증명해야 한다.
          <br />
          가상자산이용자보호법은 이를 뒤집어, VASP가 자신에게 과실이 없음을 증명하도록 요구한다.
          <br />
          이용자가 기술적 원인을 파악하기 어려운 현실을 반영한 설계로, 금융소비자 보호법의 패턴과 유사하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">보관 체계의 전체 구조</h3>
        <p className="leading-7">
          정리하면, VASP의 보관 의무는 다음 5개 층으로 구성된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">층위</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 분리 보관</td>
                <td className="px-3 py-1.5 border-b border-border/30">자기 자산과 이용자 자산을 물리적·논리적으로 분리</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 동일성 유지</td>
                <td className="px-3 py-1.5 border-b border-border/30">종류와 수량을 항상 일치시켜 보유</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 콜드월렛 80%</td>
                <td className="px-3 py-1.5 border-b border-border/30">경제적 가치의 80% 이상을 오프라인 보관</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">4. 이용자명부</td>
                <td className="px-3 py-1.5 border-b border-border/30">보관 내역을 암호화하여 기록·비치</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">5. 손해배상 대비</td>
                <td className="px-3 py-1.5">보험 가입 또는 준비금 적립으로 사고 시 배상 능력 확보</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          각 층위는 독립적이 아니라 서로 보완한다.
          <br />
          분리 보관만으로는 해킹을 막을 수 없고, 콜드월렛만으로는 내부 횡령을 방지할 수 없다.
          <br />
          5개 층위가 중첩되어야 비로소 이용자 자산이 "제도적으로" 보호받는 구조가 완성된다.
          <br />
          다음 섹션에서는 3번째 층위인 콜드월렛 80% 보관 규정의 세부 사항을 다룬다.
        </p>

      </div>
    </section>
  );
}
