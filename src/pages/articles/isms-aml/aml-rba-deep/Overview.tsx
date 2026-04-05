export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">위험기반 접근법(RBA)이란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          RBA(Risk-Based Approach, 위험기반 접근법)는 AML/CFT 체계의 설계 원칙.<br />
          자금세탁·테러자금조달 위험이 높은 곳에 더 많은 자원을 투입하고,
          위험이 낮은 곳에는 간소화된 조치를 허용하여
          한정된 컴플라이언스 자원을 효과적으로 배분하는 방법론이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">FATF 권고 R.1 — RBA 전면 도입</h3>
        <p>
          FATF는 2012년 40개 권고사항을 전면 개정하면서
          권고사항 R.1(Recommendation 1)에 위험기반 접근법을 명시했다.<br />
          "각국은 자국의 ML/TF 위험을 식별·평가하고,
          위험에 상응하는 조치를 적용해야 한다"는 것이 R.1의 핵심.
        </p>

        <p>
          2012년 이전에는 규정 기반(Rule-based) 접근법이 주류였다.<br />
          모든 고객에게 동일한 수준의 확인을 적용하고,
          정해진 임계값(예: 1천만 원 이상 현금 거래)에 기계적으로 보고하는 방식.<br />
          이 방식은 공평하지만, 진짜 위험한 거래를 놓치고 저위험 거래에 자원을 낭비하는 비효율이 있었다.
        </p>

        <p>
          RBA는 이 한계를 해결하기 위해 도입되었다.<br />
          "모든 고객을 같은 수준으로"가 아니라
          "위험에 비례하는 수준으로" 확인과 모니터링을 수행하는 것이 핵심 전환.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">규정 기반 vs 위험 기반 비교</h3>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">규정 기반 (Rule-based)</th>
                <th className="text-left px-3 py-2 border-b border-border">위험 기반 (Risk-based)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">접근 방식</td>
                <td className="px-3 py-1.5 border-b border-border/30">모든 고객에게 동일 기준 적용</td>
                <td className="px-3 py-1.5 border-b border-border/30">위험 수준에 따라 차등 적용</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">자원 배분</td>
                <td className="px-3 py-1.5 border-b border-border/30">균등 배분 → 고위험에 부족</td>
                <td className="px-3 py-1.5 border-b border-border/30">고위험에 집중 → 효율적</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보고 기준</td>
                <td className="px-3 py-1.5 border-b border-border/30">기계적 임계값 (예: 1천만 원)</td>
                <td className="px-3 py-1.5 border-b border-border/30">위험 판단에 기반한 유연한 기준</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">장점</td>
                <td className="px-3 py-1.5 border-b border-border/30">명확, 일관성 높음</td>
                <td className="px-3 py-1.5 border-b border-border/30">실효성 높음, 유연함</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">단점</td>
                <td className="px-3 py-1.5">과잉 보고, 실질 위험 간과</td>
                <td className="px-3 py-1.5">판단 재량 → 일관성 유지 어려움</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          실무에서는 두 접근법이 완전히 분리되지 않는다.<br />
          RBA를 채택하더라도 일정 금액 이상의 현금거래보고(CTR)처럼
          규정 기반의 의무 보고는 유지된다.<br />
          RBA는 규정 기반의 "위"에 더해지는 추가 레이어로 이해해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RBA의 3대 이점</h3>

        <p>
          <strong>1. 효율성(Efficiency)</strong><br />
          컴플라이언스 비용은 VASP 운영비의 상당 부분을 차지한다.<br />
          모든 고객에게 EDD 수준의 확인을 적용하면 비용이 기하급수적으로 증가.<br />
          RBA는 저위험 고객에 간소화 CDD를 허용하여 비용을 절감하면서도
          고위험 영역의 통제 수준은 강화한다.
        </p>

        <p>
          <strong>2. 유연성(Flexibility)</strong><br />
          가상자산 산업은 변화 속도가 빠르다.<br />
          새로운 토큰, 새로운 프로토콜, 새로운 거래 패턴이 지속적으로 등장하며,
          규정 기반의 고정된 규칙으로는 대응이 어렵다.<br />
          RBA는 위험 평가를 주기적으로 갱신하므로
          새로운 위험에 유연하게 대응할 수 있다.
        </p>

        <p>
          <strong>3. 실효성(Effectiveness)</strong><br />
          규정 기반 접근에서 흔히 발생하는 문제가 "defensive reporting" — 제재를 피하기 위해
          의미 없는 보고를 대량으로 제출하는 현상.<br />
          이런 과잉 보고는 FIU의 분석 역량을 소모시키고 실질적인 의심거래를 묻히게 만든다.<br />
          RBA는 위험 판단에 기반한 선별적 보고를 유도하여 FIU가 집중해야 할 거래에 자원을 배분하게 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">국내 법적 근거</h3>
        <p>
          한국에서 RBA의 법적 근거는 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">법규</th>
                <th className="text-left px-3 py-2 border-b border-border">관련 조항</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">특금법</td>
                <td className="px-3 py-1.5 border-b border-border/30">제5조의2</td>
                <td className="px-3 py-1.5 border-b border-border/30">고객확인 시 위험도에 따른 차등 적용 근거</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">특금법 시행령</td>
                <td className="px-3 py-1.5 border-b border-border/30">제10조의5 ~ 10조의7</td>
                <td className="px-3 py-1.5 border-b border-border/30">고위험·저위험 고객 분류 기준</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">FIU 가이드라인</td>
                <td className="px-3 py-1.5">가상자산사업자 신고매뉴얼</td>
                <td className="px-3 py-1.5">위험평가 수행 방법, 위험 요소 목록, 평가 주기</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          금융정보분석원(FIU)이 2024년 7월 발간한 "가상자산사업자 신고매뉴얼"은
          RBA의 실무 이행 방법을 상세히 안내하고 있으며,
          VASP 신고 심사 시 위험평가 체계의 적정성을 핵심 심사 항목으로 다룬다.
        </p>

        <p>
          2026년 2월 FATF 총회에서 한국은
          민간 부문과 감독 당국 간 긴밀한 협력이 RBA와 RBS(Risk-Based Supervision)의
          실효성을 높이는 데 필수적이라는 점을 강조했다.<br />
          부산 TRAIN(Training and Research Institute Network) 센터를 통해
          지역 금융 시장 특성을 반영한 맞춤형 RBA/RBS 교육을 강화하겠다는 입장도 밝혔다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} RBA의 전제 — 위험평가 역량</strong><br />
          RBA는 "위험을 정확히 평가할 수 있다"는 전제 위에 성립한다.<br />
          위험평가가 부실하면 고위험 고객을 저위험으로 분류하는 오류가 발생하고,
          이 경우 RBA 자체가 자금세탁의 통로가 될 수 있다.<br />
          따라서 FATF는 RBA 도입과 함께 "전사 위험평가(Enterprise-wide Risk Assessment)"를
          의무화하고 있으며, 이를 다음 섹션에서 상세히 다룬다.
        </p>

      </div>
    </section>
  );
}
