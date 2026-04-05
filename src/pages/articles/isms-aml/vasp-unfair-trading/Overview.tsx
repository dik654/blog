export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가상자산 불공정거래란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-4">법적 정의와 근거</h3>
        <p className="leading-7">
          불공정거래란 시장의 공정성을 훼손하여 특정인이 부당한 이익을 얻거나 타인에게 손해를 끼치는 거래 행위를 뜻한다.
          <br />
          가상자산 이용자 보호 등에 관한 법률(가상자산이용자보호법) 제10조는 가상자산 시장에서의 불공정거래를 명시적으로 금지한다.
          <br />
          이 법률은 2023년 7월 제정되어 2024년 7월 19일부터 시행되었으며,
          기존 자본시장법의 불공정거래 규제를 가상자산의 특수성에 맞게 재설계한 것이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">3대 유형</h3>
        <p className="leading-7">
          제10조가 금지하는 불공정거래는 크게 세 가지 유형으로 나뉜다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">유형</th>
                <th className="text-left px-3 py-2 border-b border-border">핵심 행위</th>
                <th className="text-left px-3 py-2 border-b border-border">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">미공개중요정보 이용</td>
                <td className="px-3 py-1.5 border-b border-border/30">공개 전 내부 정보로 매매하여 이득</td>
                <td className="px-3 py-1.5 border-b border-border/30">상장 결정 사전 매수</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">시세조종</td>
                <td className="px-3 py-1.5 border-b border-border/30">인위적으로 가격·거래량을 왜곡</td>
                <td className="px-3 py-1.5 border-b border-border/30">허수 주문, 자전 거래</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">부정거래</td>
                <td className="px-3 py-1.5">허위·기망적 수단으로 거래 유도</td>
                <td className="px-3 py-1.5">가짜 정보 유포 후 매매</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          이 세 유형은 자본시장법(증권)의 불공정거래 유형과 구조적으로 유사하다.
          <br />
          자본시장법이 주식·채권 시장을 보호하듯, 가상자산이용자보호법은 가상자산 시장을 보호한다.
          <br />
          다만 가상자산의 특수성(24시간 거래, 글로벌 접근, 의사 익명성)을 반영한 차이가 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">자본시장법과의 비교</h3>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">자본시장법(증권)</th>
                <th className="text-left px-3 py-2 border-b border-border">가상자산이용자보호법</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">적용 대상</td>
                <td className="px-3 py-1.5 border-b border-border/30">상장 증권</td>
                <td className="px-3 py-1.5 border-b border-border/30">가상자산</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래 시간</td>
                <td className="px-3 py-1.5 border-b border-border/30">평일 6시간(정규장)</td>
                <td className="px-3 py-1.5 border-b border-border/30">24시간 365일</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">감시 기관</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래소 시장감시위원회, 금감원</td>
                <td className="px-3 py-1.5 border-b border-border/30">금융위, 금감원</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">가격제한</td>
                <td className="px-3 py-1.5 border-b border-border/30">상·하한가(30%)</td>
                <td className="px-3 py-1.5 border-b border-border/30">없음(무제한 변동)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">추가 규제</td>
                <td className="px-3 py-1.5">없음</td>
                <td className="px-3 py-1.5">자기발행 가상자산 거래 제한</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          가장 큰 차이는 거래 시간과 가격 변동 폭이다.
          <br />
          주식시장은 정규 거래 시간이 있어 감시 인력이 집중할 수 있지만,
          가상자산은 24시간 쉬지 않으므로 자동화된 감시 시스템이 필수다.
          <br />
          또한 상·하한가가 없으므로 시세조종의 효과가 극단적으로 나타날 수 있다 --
          단 몇 시간 만에 가격이 10배 폭등했다가 원래 수준으로 폭락하는 일이 가능하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">처벌 수준</h3>
        <p className="leading-7">
          불공정거래에 대한 처벌은 형사처벌과 행정 제재로 나뉜다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">기본</th>
                <th className="text-left px-3 py-2 border-b border-border">가중(부당이득 5억~50억)</th>
                <th className="text-left px-3 py-2 border-b border-border">가중(50억 이상)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">형사처벌</td>
                <td className="px-3 py-1.5 border-b border-border/30">1년 이상 징역</td>
                <td className="px-3 py-1.5 border-b border-border/30">3년 이상 징역</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년 이상 또는 무기징역</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">벌금</td>
                <td className="px-3 py-1.5 border-b border-border/30" colSpan={3}>부당이득의 3배~5배</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">과징금</td>
                <td className="px-3 py-1.5" colSpan={3}>부당이득의 2배 (금융위 부과)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          부당이득이 50억 원을 넘으면 무기징역까지 선고할 수 있다는 점이 주목할 만하다.
          <br />
          이는 자본시장법의 증권 불공정거래 처벌 수준과 동일한 체계로, 가상자산 시장의 심각성을 법률이 동등하게 인식하고 있음을 보여준다.
          <br />
          벌금은 부당이득의 3배~5배로, "범죄 수익보다 더 큰 불이익"을 주어 경제적 유인을 차단하는 구조다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 2026년 첫 실형 선고</strong><br />
          가상자산이용자보호법 시행 이후 최초의 시세조종 사건에 대해 2026년 2월 법원이 실형을 선고했다.
          <br />
          이는 법률이 실제로 집행되고 있음을 보여주는 사례로, 시장 참여자에게 강한 경고 효과를 발생시켰다.
          <br />
          또한 금융위원회는 별도로 불공정거래에 대한 과징금을 최초 부과하며 행정 제재도 본격화하고 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">왜 가상자산에서 특히 심각한가</h3>
        <p className="leading-7">
          가상자산 시장이 불공정거래에 특히 취약한 이유는 구조적이다.
        </p>

        <p className="leading-7">
          <strong>24시간 거래</strong> -- 주식시장은 폐장 후 시세조종이 불가능하지만, 가상자산은 새벽이나 주말에도 조종할 수 있다.
          감시 인력이 부재한 시간대를 노린 조종이 빈번하다.
          <br />
          <strong>글로벌 접근</strong> -- 해외 거래소에서 매수한 후 국내 거래소에서 매도하는 교차 거래소 조종이 가능하다.
          관할권이 다르면 수사 공조가 어렵다.
          <br />
          <strong>의사 익명성</strong> -- 블록체인 주소만으로는 실제 거래자를 특정하기 어렵다.
          믹싱 서비스나 프라이버시 코인을 사용하면 자금 추적이 더 어려워진다.
          <br />
          <strong>낮은 유동성</strong> -- 시가총액이 작은 코인은 소액으로도 가격을 크게 움직일 수 있다.
          수백만 원이면 가격을 수십 퍼센트 변동시킬 수 있는 코인이 수천 종 존재한다.
          <br />
          <strong>정보 비대칭</strong> -- 가상자산 프로젝트의 내부 정보(상장, 파트너십, 기술 업데이트)는 소수만 알고 있으며,
          공식 공시 체계가 주식시장에 비해 미비하다.
        </p>

        <p className="leading-7">
          이러한 구조적 취약성 때문에, 가상자산이용자보호법은 자본시장법과 유사한 수준의 강력한 처벌 규정을 도입했다.
          <br />
          다음 섹션에서는 세 가지 유형 각각의 세부 구성 요건과 판단 기준을 다룬다.
        </p>

      </div>
    </section>
  );
}
