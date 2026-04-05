export default function TravelRule() {
  return (
    <section id="travel-rule" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가상자산 이전 시 정보제공 (Travel Rule)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          Travel Rule(자금이동규칙)은 가상자산을 한 사업자에서 다른 사업자로 이전할 때
          송신인과 수신인의 신원 정보를 함께 전송하도록 의무화한 규정.<br />
          전통 금융의 전신환(wire transfer)에 적용되던 규칙을 가상자산에 확장한 것이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">FATF 권고 R.16 — 국제 기준</h3>
        <p>
          FATF 권고사항 R.16(Recommendation 16)은 금융기관 간 전신환 시
          송금인 정보(originator information)와 수취인 정보(beneficiary information)를
          거래 메시지에 포함시키도록 요구한다.<br />
          2019년 FATF가 가상자산과 VASP에 대한 해석 노트를 개정하면서
          R.16이 VASP 간 가상자산 이전에도 동일하게 적용됨을 명확히 했다.
        </p>

        <p>
          FATF가 Travel Rule을 가상자산에 적용하는 이유 — 블록체인 거래는 지갑 주소만 기록되고
          송수신인의 실명이 포함되지 않는다.<br />
          법 집행 기관이 자금 흐름을 추적하려면 "이 지갑 주소의 주인이 누구인가"를
          알 수 있어야 하며, Travel Rule이 그 연결 고리를 제공한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">특금법 제5조의4 — 국내 시행</h3>
        <p>
          한국에서 Travel Rule의 법적 근거는 특금법 제5조의4(가상자산의 이전 시 정보 제공).<br />
          2022년 3월 25일부터 시행되었으며, 핵심 내용은 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">적용 기준</td>
                <td className="px-3 py-1.5 border-b border-border/30">100만 원 이상의 가상자산 이전 (시행 당시 기준)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">의무 주체</td>
                <td className="px-3 py-1.5 border-b border-border/30">가상자산을 보내는 VASP (송신 사업자)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정보 수신자</td>
                <td className="px-3 py-1.5 border-b border-border/30">가상자산을 받는 VASP (수신 사업자)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정보 보관</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 관계 종료일로부터 5년</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">위반 시 제재</td>
                <td className="px-3 py-1.5">최대 3천만 원 과태료</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">필수 전송 정보</h3>
        <p>
          Travel Rule에 따라 송신 VASP가 수신 VASP에게 제공해야 하는 정보는 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium" rowSpan={3}>송신인 정보</td>
                <td className="px-3 py-1.5 border-b border-border/30">성명</td>
                <td className="px-3 py-1.5 border-b border-border/30">CDD를 통해 확인된 실명</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">가상자산 주소</td>
                <td className="px-3 py-1.5 border-b border-border/30">출금 지갑 주소 (또는 거래 식별번호)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">계정 번호 등</td>
                <td className="px-3 py-1.5 border-b border-border/30">VASP 내부 고객 식별자</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium" rowSpan={2}>수신인 정보</td>
                <td className="px-3 py-1.5 border-b border-border/30">성명</td>
                <td className="px-3 py-1.5 border-b border-border/30">수신 VASP가 확인한 실명</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">가상자산 주소</td>
                <td className="px-3 py-1.5">입금 지갑 주소</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          FATF 기준으로는 송금액, 날짜, 거래 유형까지 포함을 권고하나,
          한국 특금법은 현재 성명과 가상자산 주소를 필수로 규정.<br />
          향후 시행령 개정으로 추가 정보 요구가 확대될 가능성이 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Travel Rule 솔루션</h3>
        <p>
          문제는 VASP 간에 이 정보를 "어떻게" 전달하느냐는 것.<br />
          블록체인 트랜잭션 자체에는 실명 정보를 포함할 수 없으므로
          별도의 통신 채널(off-chain messaging)이 필요하다.<br />
          이를 위해 다양한 Travel Rule 솔루션이 개발되었다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">솔루션</th>
                <th className="text-left px-3 py-2 border-b border-border">주요 특징</th>
                <th className="text-left px-3 py-2 border-b border-border">적용 지역</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CODE</td>
                <td className="px-3 py-1.5 border-b border-border/30">한국 VASP 연합이 공동 개발한 표준 프로토콜. 국내 VASP 간 정보 교환에 사용</td>
                <td className="px-3 py-1.5 border-b border-border/30">한국</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">TRISA</td>
                <td className="px-3 py-1.5 border-b border-border/30">Travel Rule Information Sharing Architecture. 분산형 피어투피어 구조, mTLS 암호화</td>
                <td className="px-3 py-1.5 border-b border-border/30">글로벌</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Notabene</td>
                <td className="px-3 py-1.5 border-b border-border/30">SaaS 기반, 다중 프로토콜 지원, VASP 식별 디렉토리 제공</td>
                <td className="px-3 py-1.5 border-b border-border/30">글로벌</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">Sygna Bridge</td>
                <td className="px-3 py-1.5">아시아 중심, VASP 간 암호화된 메시지 교환</td>
                <td className="px-3 py-1.5">아시아</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          한국 내에서는 CODE가 사실상 표준(de facto standard)으로 자리 잡았다.<br />
          국내 주요 VASP(업비트, 빗썸, 코인원, 코빗 등)가 CODE를 통해 상호 정보를 교환하며,
          해외 VASP와의 교환을 위해 TRISA나 Notabene을 병행 연동하는 구조.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">미신고 VASP와의 거래</h3>
        <p>
          Travel Rule의 전제는 "상대방도 신고된 VASP"라는 점.<br />
          미신고 VASP(unregistered VASP)나 개인 지갑(unhosted wallet)으로의 이전 시에는
          정보를 수신할 상대방이 없다.
        </p>

        <p>
          한국 규제 당국은 미신고 VASP와의 거래를 사실상 제한하는 방향으로 가이드라인을 운영 중.<br />
          국내 거래소들은 미신고 해외 사업자의 지갑 주소로의 출금을 차단하거나,
          추가 확인 절차(출금 목적 소명, 수신 지갑 소유자 확인)를 요구한다.
        </p>

        <p>
          개인 지갑(unhosted wallet)의 경우,
          고객이 본인 소유임을 증명하는 절차(address ownership proof)를 거친 뒤
          출금을 허용하는 방식이 일반적.<br />
          소량의 가상자산을 보내고 돌려받는 마이크로 트랜잭션(micro-deposit) 검증이나,
          서명(signed message) 검증이 주로 사용된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">100만 원 이하 확대 — 최근 동향</h3>
        <p>
          2025년 말부터 금융당국은 Travel Rule 적용 범위를 100만 원 이하 거래로 확대하는 방안을 추진 중.<br />
          현행 100만 원 기준은 자금세탁자가 거래를 분할(structuring)하여 우회하는 데 악용될 수 있다는 지적이 있었다.
        </p>

        <p>
          FATF 역시 2025년 6월 발간한 6차 가상자산 이행 보고서에서
          117개 회원국 중 85개국이 Travel Rule 입법을 완료했거나 진행 중이라고 밝히며
          적용 범위 확대를 권고했다.
        </p>

        <p>
          2026년 상반기 입법 완료를 목표로 하는 "가상자산 2단계 법안"은
          Travel Rule 위반에 대한 제재를 강화하고,
          스테이블코인(Stablecoin) 이전에도 동일한 규제를 적용하는 내용을 포함하고 있다.<br />
          FATF의 2026년 3월 보고서에 따르면, 스테이블코인 시장 규모가 3,000억 달러를 초과하면서
          불법 가상자산 거래의 84%가 스테이블코인을 통해 이루어지고 있어
          규제 사각지대 해소가 시급한 상황이다.
        </p>

        <div className="not-prose my-4 p-3 bg-muted/20 rounded border border-border/30 text-sm">
          <p className="font-medium mb-2">Travel Rule 시행 연혁</p>
          <p className="mb-1"><strong>2019.06</strong> — FATF, 가상자산에 R.16 적용 해석 노트 발표</p>
          <p className="mb-1"><strong>2021.03</strong> — 한국 특금법 개정 시행 (VASP 포함)</p>
          <p className="mb-1"><strong>2022.03</strong> — 한국 Travel Rule 시행 (100만 원 이상)</p>
          <p className="mb-1"><strong>2025.06</strong> — FATF 6차 가상자산 이행 보고서 (85/117국 입법 완료·진행)</p>
          <p className="mb-1"><strong>2025.12</strong> — 한국 100만 원 이하 확대 추진 발표</p>
          <p><strong>2026.상반기</strong> — 가상자산 2단계 법안 입법 목표 (제재 강화, 스테이블코인 포함)</p>
        </div>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} Travel Rule과 프라이버시의 균형</strong><br />
          Travel Rule은 사실상 "가상자산의 실명제"에 해당하며, 프라이버시 침해 논란이 존재한다.<br />
          FATF는 개인정보 보호와 자금세탁 방지 사이의 균형을 강조하며,
          정보는 AML/CFT 목적으로만 사용하고, VASP 간 전송 시 암호화를 적용하며,
          불필요한 제3자 공유를 금지하는 원칙을 제시하고 있다.<br />
          한국에서도 개인정보보호법과의 정합성 확보가 향후 입법 과정의 쟁점이 될 전망이다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} DeFi와 Travel Rule의 한계</strong><br />
          현행 Travel Rule은 VASP(중앙화된 사업자) 간 이전을 전제로 설계되었다.<br />
          DeFi 프로토콜(탈중앙화 금융)에는 "정보를 수신할 사업자"가 존재하지 않아
          Travel Rule 적용이 구조적으로 어렵다.<br />
          FATF는 2026년 2월 총회에서 DeFi 관련 위험 분석을 채택하며
          "중앙화 요소가 있는 DeFi에는 VASP 기준을 적용해야 한다"는 입장을 재확인했으나,
          완전한 탈중앙화 프로토콜에 대한 규제 방안은 아직 합의에 이르지 못한 상태다.
        </p>

      </div>
    </section>
  );
}
