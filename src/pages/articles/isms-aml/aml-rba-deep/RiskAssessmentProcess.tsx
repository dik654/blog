export default function RiskAssessmentProcess() {
  return (
    <section id="risk-assessment-process" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">전사 위험평가 4단계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          전사 위험평가(Enterprise-wide Risk Assessment)는 RBA의 출발점.<br />
          "우리 사업에 어떤 자금세탁 위험이 있고, 얼마나 심각한가"를 체계적으로 파악하는 과정이다.<br />
          FATF 권고사항 R.1은 이 평가를 금융기관(VASP 포함)의 필수 의무로 규정한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">1단계 — 위험 식별(Risk Identification)</h3>
        <p>
          첫 단계는 "어떤 위험이 존재하는가"를 찾아내는 것.<br />
          위험 식별은 4가지 위험 범주를 축으로 수행한다.
        </p>

        <p>
          <strong>고객 위험(Customer Risk)</strong><br />
          고객 유형에 따른 자금세탁 위험 수준.<br />
          PEP(정치적 주요인물), 비거주 외국인, 복잡한 법인 구조,
          현금 집약적 사업을 영위하는 고객, 제재 대상국 국적자 등이 고위험.<br />
          개인 고객보다 법인 고객의 위험이 일반적으로 높고,
          법인 중에서도 실제소유자 파악이 어려운 다단계 구조가 최고 위험.
        </p>

        <p>
          <strong>상품·서비스 위험(Product/Service Risk)</strong><br />
          제공하는 상품의 특성에 따른 위험.<br />
          가상자산의 경우: 프라이버시 코인(Monero, Zcash 등)의 익명성,
          크로스체인 브릿지의 자금 추적 난이도, OTC(장외 거래)의 대면 검증 부재 등.<br />
          신규 상품일수록 위험 데이터가 부족하므로 초기에는 고위험으로 분류하는 것이 원칙.
        </p>

        <p>
          <strong>지역 위험(Geographic Risk)</strong><br />
          거래 관련 국가·지역의 AML 체계 수준에 따른 위험.<br />
          FATF가 공표하는 "고위험 관할권(High-Risk Jurisdictions)" 목록과
          "강화된 모니터링 대상(Jurisdictions under Increased Monitoring)" 목록이 핵심 참조 자료.<br />
          이란, 북한 등은 FATF가 "대응 조치(counter-measures)"를 촉구하는 최고 위험 국가.
        </p>

        <p>
          <strong>채널 위험(Channel/Delivery Risk)</strong><br />
          고객과의 접촉 방식에 따른 위험.<br />
          비대면(non-face-to-face) 채널은 대면보다 위험이 높다.<br />
          VASP는 대부분 비대면 서비스이므로 채널 위험이 구조적으로 높은 편이며,
          이를 상쇄하기 위해 eKYC, 안면인식, 실명 계좌 연동 같은 보완 통제가 필요하다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">위험 범주</th>
                <th className="text-left px-3 py-2 border-b border-border">고위험 예시</th>
                <th className="text-left px-3 py-2 border-b border-border">저위험 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">고객</td>
                <td className="px-3 py-1.5 border-b border-border/30">PEP, 제재국 국적자, 셸컴퍼니</td>
                <td className="px-3 py-1.5 border-b border-border/30">상장사, 정부기관</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">상품</td>
                <td className="px-3 py-1.5 border-b border-border/30">프라이버시 코인, OTC 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">주요 가상자산(BTC, ETH) 현물</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">지역</td>
                <td className="px-3 py-1.5 border-b border-border/30">이란, 북한, FATF 회색목록 국가</td>
                <td className="px-3 py-1.5 border-b border-border/30">FATF 회원국, OECD 국가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">채널</td>
                <td className="px-3 py-1.5">비대면, 제3자 입금</td>
                <td className="px-3 py-1.5">대면 확인, 실명 계좌 연동</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 — 위험 분석(Risk Analysis)</h3>
        <p>
          식별된 위험을 정량적으로 분석하는 단계.<br />
          각 위험 요소에 대해 발생 가능성(Likelihood)과 영향도(Impact)를 평가하고,
          두 값을 조합하여 위험 등급을 산출한다.
        </p>

        <p>
          <strong>발생 가능성(Likelihood)</strong><br />
          해당 위험이 실현될 확률.<br />
          과거 사례, 산업 통계, 규제 보고서, FIU 유형 분석 보고서 등을 근거로 판단.<br />
          예: "프라이버시 코인을 이용한 자금세탁 시도가 전체 의심거래의 15%를 차지" → 높은 발생 가능성.
        </p>

        <p>
          <strong>영향도(Impact)</strong><br />
          위험이 실현되었을 때의 피해 규모.<br />
          재무적 손실(과태료, 배상), 평판 손상, 영업정지, 형사 처벌 가능성 등을 종합 평가.<br />
          예: PEP 관련 자금세탁 적발 → 언론 보도 + 감독 당국 특별 검사 → 영향도 "매우 높음".
        </p>

        <div className="not-prose my-4 p-3 bg-muted/20 rounded border border-border/30 text-sm">
          <p className="font-medium mb-2">위험 등급 산출 공식</p>
          <p><strong>위험 점수 = 발생 가능성(1~5) x 영향도(1~5)</strong></p>
          <p className="mt-1">1~8점: 저위험(Low) / 9~15점: 중위험(Medium) / 16~25점: 고위험(High)</p>
        </div>

        <p>
          위험 등급은 3단계(고/중/저)가 일반적이지만,
          규모가 큰 VASP는 4~5단계로 세분화하기도 한다.<br />
          중요한 것은 등급 분류 기준이 문서화되어 있고,
          동일한 위험 요소에 대해 일관된 등급이 부여되는 것.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3단계 — 위험 평가(Risk Evaluation)</h3>
        <p>
          분석된 위험에 대해 현재의 통제(control)가 얼마나 효과적인지를 반영하여
          최종 위험 수준을 결정하는 단계.
        </p>

        <div className="not-prose my-4 p-3 bg-muted/20 rounded border border-border/30 text-sm">
          <p className="font-medium mb-2">위험 평가 공식</p>
          <p><strong>고유위험(Inherent Risk) - 통제효과(Control Effectiveness) = 잔여위험(Residual Risk)</strong></p>
          <p className="mt-2">고유위험: 통제가 전혀 없다고 가정했을 때의 원시 위험 수준</p>
          <p>통제효과: 현재 운영 중인 CDD, 모니터링, 교육 등의 위험 감소 효과</p>
          <p>잔여위험: 통제를 적용한 후에도 남아 있는 위험 수준</p>
        </div>

        <p>
          예를 들어, 프라이버시 코인의 고유위험이 "매우 높음(20점)"이지만
          해당 코인의 거래를 전면 차단하는 통제를 적용하면 통제효과가 높아
          잔여위험은 "저위험(5점)"으로 낮아진다.
        </p>

        <p>
          반대로, OTC 거래의 고유위험이 "높음(16점)"이고
          대면 확인과 자금출처 소명만 요구하는 통제를 적용하면
          통제효과가 중간 수준이어서 잔여위험은 "중위험(10점)"으로 남을 수 있다.
        </p>

        <p>
          경영진은 잔여위험이 "수용 가능 수준(risk appetite)" 이내인지 판단.<br />
          수용 불가 수준이면 추가 통제를 도입하거나 해당 서비스를 중단해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4단계 — 지속 평가(Ongoing Assessment)</h3>
        <p>
          위험평가는 한 번 수행하고 끝나는 것이 아니다.<br />
          환경 변화에 따라 위험 수준이 변동하므로 정기적·수시적으로 재평가해야 한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">주기</th>
                <th className="text-left px-3 py-2 border-b border-border">트리거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정기 평가</td>
                <td className="px-3 py-1.5 border-b border-border/30">연 1회 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">회계연도 종료, 감사 주기 연동</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">수시 평가</td>
                <td className="px-3 py-1.5">즉시</td>
                <td className="px-3 py-1.5">법규 변경, 신상품 출시, 신규 시장 진출, 중대 사고 발생</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          특히 가상자산 산업은 변화 속도가 빨라 수시 평가의 중요성이 높다.<br />
          새로운 프로토콜(예: 크로스체인 브릿지), 새로운 토큰 유형(예: NFT),
          새로운 규제(예: Travel Rule 확대)가 등장하면
          기존 위험평가의 전제가 바뀔 수 있으므로 즉시 재평가가 필요하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">위험평가 매트릭스 작성</h3>
        <p>
          위험평가 결과는 매트릭스(matrix) 형태로 문서화하는 것이 표준 관행.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">위험 요소</th>
                <th className="text-left px-3 py-2 border-b border-border">발생 가능성</th>
                <th className="text-left px-3 py-2 border-b border-border">영향도</th>
                <th className="text-left px-3 py-2 border-b border-border">고유위험</th>
                <th className="text-left px-3 py-2 border-b border-border">통제 수단</th>
                <th className="text-left px-3 py-2 border-b border-border">통제효과</th>
                <th className="text-left px-3 py-2 border-b border-border">잔여위험</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">PEP 고객</td>
                <td className="px-3 py-1.5 border-b border-border/30">3</td>
                <td className="px-3 py-1.5 border-b border-border/30">5</td>
                <td className="px-3 py-1.5 border-b border-border/30">15 (고)</td>
                <td className="px-3 py-1.5 border-b border-border/30">EDD + 경영진 승인</td>
                <td className="px-3 py-1.5 border-b border-border/30">-7</td>
                <td className="px-3 py-1.5 border-b border-border/30">8 (저)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">프라이버시 코인</td>
                <td className="px-3 py-1.5 border-b border-border/30">4</td>
                <td className="px-3 py-1.5 border-b border-border/30">4</td>
                <td className="px-3 py-1.5 border-b border-border/30">16 (고)</td>
                <td className="px-3 py-1.5 border-b border-border/30">취급 금지</td>
                <td className="px-3 py-1.5 border-b border-border/30">-12</td>
                <td className="px-3 py-1.5 border-b border-border/30">4 (저)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">비대면 가입</td>
                <td className="px-3 py-1.5">4</td>
                <td className="px-3 py-1.5">3</td>
                <td className="px-3 py-1.5">12 (중)</td>
                <td className="px-3 py-1.5">eKYC + 실명계좌</td>
                <td className="px-3 py-1.5">-5</td>
                <td className="px-3 py-1.5">7 (저)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 위험평가의 주관성 함정</strong><br />
          발생 가능성과 영향도 점수는 결국 평가자의 판단에 의존한다.<br />
          이 주관성을 최소화하려면 평가 기준표(scoring criteria)를 사전에 문서화하고,
          복수의 평가자가 독립적으로 점수를 부여한 뒤 합의하는 과정(calibration)이 필요하다.<br />
          FIU 가이드라인은 외부 전문가 참여를 권장하며,
          이전 평가 결과와의 일관성도 검증 항목으로 포함하고 있다.
        </p>

      </div>
    </section>
  );
}
