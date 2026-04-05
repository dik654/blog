export default function InsiderTrading() {
  return (
    <section id="insider-trading" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">미공개중요정보 이용 금지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-4">미공개중요정보란</h3>
        <p className="leading-7">
          미공개중요정보(Material Non-Public Information, MNPI)란 이용자의 투자판단에 중대한 영향을 미칠 수 있는 정보로서,
          아직 불특정 다수인이 알 수 있도록 공개되지 않은 정보를 뜻한다.
          <br />
          두 가지 요건을 동시에 충족해야 한다 --
          "중대한 영향"(materality)이 있어야 하고, "공개 전"(non-public)이어야 한다.
          <br />
          단순히 사소한 정보(예: 사무실 이전)는 투자판단에 중대한 영향을 미치지 않으므로 해당하지 않는다.
          반대로 아무리 중대한 정보라도 이미 공개된 후에는 규제 대상이 아니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">어떤 정보가 해당하는가</h3>
        <p className="leading-7">
          시행령은 미공개중요정보의 범위를 구체적으로 열거하지 않고 포괄적으로 정의한다.
          <br />
          "이용자의 투자판단에 중대한 영향"이라는 기준에 따라 개별 판단하되, 대표적인 유형은 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">유형</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">예상 영향</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">상장/상폐 결정</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래소의 특정 가상자산 거래 지원 개시 또는 중단</td>
                <td className="px-3 py-1.5 border-b border-border/30">가격 급등 또는 급락</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">에어드롭</td>
                <td className="px-3 py-1.5 border-b border-border/30">보유자에게 무상으로 새 토큰 배포</td>
                <td className="px-3 py-1.5 border-b border-border/30">보유 수요 증가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">하드포크</td>
                <td className="px-3 py-1.5 border-b border-border/30">블록체인 프로토콜의 호환 불가 업그레이드</td>
                <td className="px-3 py-1.5 border-b border-border/30">체인 분기 시 신규 코인 발생</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">대규모 파트너십</td>
                <td className="px-3 py-1.5 border-b border-border/30">주요 기업·기관과의 기술 제휴 또는 투자 유치</td>
                <td className="px-3 py-1.5 border-b border-border/30">프로젝트 신뢰도 급상승</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보안 취약점 발견</td>
                <td className="px-3 py-1.5 border-b border-border/30">스마트 컨트랙트 또는 프로토콜의 심각한 버그</td>
                <td className="px-3 py-1.5 border-b border-border/30">신뢰 훼손, 가격 하락</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">규제 조치</td>
                <td className="px-3 py-1.5">감독기관의 시정 명령, 업무 정지 등</td>
                <td className="px-3 py-1.5">시장 전체 심리 위축</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          가상자산 시장에서 가장 빈번하고 영향이 큰 것은 거래소의 상장/상폐 결정이다.
          <br />
          국내 주요 거래소에 상장되면 가격이 수배~수십 배 뛰는 경우가 있으므로,
          상장 심사 결과를 사전에 아는 것은 극히 큰 경제적 이득으로 연결된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">적용 대상: 누가 규제를 받는가</h3>
        <p className="leading-7">
          미공개중요정보 이용 금지 규정은 정보 접근 경로에 따라 적용 대상을 넓게 설정한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">대상</th>
                <th className="text-left px-3 py-2 border-b border-border">설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">VASP 임직원</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래소, 수탁업체 등의 모든 직원과 경영진</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">대리인·위탁업체</td>
                <td className="px-3 py-1.5 border-b border-border/30">VASP 업무를 대리하거나 위탁받은 자</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">주요주주</td>
                <td className="px-3 py-1.5 border-b border-border/30">VASP의 의결권 있는 주식을 일정 비율 이상 보유한 자</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">계약 상대방</td>
                <td className="px-3 py-1.5 border-b border-border/30">VASP와 거래 계약을 체결 중이거나 협상 중인 자</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">정보 수령자</td>
                <td className="px-3 py-1.5">위 대상자로부터 정보를 전달받은 자(2차, 3차 수령 포함)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          핵심은 "정보 수령자"까지 포함된다는 점이다.
          <br />
          임직원이 가족이나 지인에게 정보를 전달하고, 그 사람이 거래하면 정보를 전달한 임직원과 거래한 수령자 모두 처벌 대상이다.
          <br />
          "나는 직접 거래하지 않았다"는 변명이 통하지 않는다 -- 타인에게 이용하게 하는 것 자체가 금지 행위다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">정보 공개 기준: 언제부터 거래해도 되는가</h3>
        <p className="leading-7">
          미공개중요정보가 "공개"되면 더 이상 규제 대상이 아니다.
          <br />
          시행령 제15조는 공개의 기준을 구체적으로 정한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">공개 방법</th>
                <th className="text-left px-3 py-2 border-b border-border">공개 완료 시점</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">신문 게재(종이)</td>
                <td className="px-3 py-1.5 border-b border-border/30">게재된 날의 다음 날 0시부터 6시간 경과 후</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">전자 간행물 게재</td>
                <td className="px-3 py-1.5 border-b border-border/30">게재된 때부터 6시간 경과 후</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">발행자 홈페이지 공개</td>
                <td className="px-3 py-1.5">공개된 때부터 1일(24시간) 경과 후</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          "불특정 다수인이 알 수 있도록" 공개해야 하므로, 비공개 채팅방이나 소수에게만 전달하는 것은 공개로 인정되지 않는다.
          <br />
          공개 후에도 일정 시간이 경과해야 하는 이유는, 정보가 시장에 충분히 반영될 시간을 보장하기 위함이다.
          <br />
          홈페이지 공개가 6시간이 아닌 24시간인 이유는, 발행자 홈페이지는 신문이나 언론에 비해 접근 빈도가 낮아
          시장 참여자 전체에 전파되는 데 더 오래 걸린다는 판단 때문이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">임직원 거래 제한</h3>
        <p className="leading-7">
          VASP 임직원은 미공개중요정보를 취득한 가상자산에 대해 매매가 불가하다.
          <br />
          "취득한 가상자산"이란 정보의 대상이 되는 특정 가상자산을 뜻한다.
          예를 들어 A코인의 상장 정보를 알게 된 임직원은 A코인의 매매가 금지되지만, B코인의 매매는 별개다(단, B코인에 대한 별도 정보가 없을 때).
        </p>

        <p className="leading-7">
          실무적으로 VASP는 임직원의 가상자산 거래 자체를 사전 승인제로 운영하는 경우가 많다.
          <br />
          매매 전에 준법감시부서에 신고하고, 보유 기간 제한(예: 최소 30일 보유)을 두며,
          단기 매매(예: 7일 이내 매수 후 매도)를 금지하는 방식이다.
          <br />
          이렇게 하면 미공개정보 이용을 사전에 차단할 수 있고, 사후 조사 시에도 거래 이력이 투명하게 남는다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">정보 관리 체계</h3>
        <p className="leading-7">
          미공개중요정보의 누설을 방지하려면 정보 자체를 엄격하게 관리해야 한다.
          <br />
          VASP 내부에서는 다음과 같은 정보 관리 체계를 구축한다.
        </p>

        <p className="leading-7">
          <strong>보안등급 '기밀' 지정</strong> -- 미공개중요정보에 해당하는 자료는 생성 즉시 '기밀(Confidential)' 등급으로 분류한다.
          기밀 자료는 암호화 저장, 접근 로그 기록, 출력 제한이 적용된다.
          <br />
          <strong>최소 인원 접근(Need-to-Know)</strong> -- 해당 정보에 접근할 수 있는 인원을 업무상 반드시 필요한 최소한으로 제한한다.
          접근 가능 인원 명단을 작성하고, 명단 외 인원의 접근은 차단한다.
          <br />
          <strong>생성~폐기 전 과정 기록</strong> -- 정보의 생성 시점, 접근 이력, 공유 이력, 공개 시점, 폐기 시점을 전 과정에 걸쳐 기록한다.
          사후 조사 시 "누가, 언제, 어떤 정보에 접근했는가"를 추적할 수 있어야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">정보 차단벽(Chinese Wall)</h3>
        <p className="leading-7">
          정보 차단벽(Chinese Wall, 또는 Information Barrier)은 부서 간 미공개정보가 흐르지 않도록 차단하는 내부 통제 장치다.
          <br />
          증권사에서 오래전부터 사용해 온 제도로, 가상자산 영역에도 그대로 적용된다.
        </p>

        <p className="leading-7">
          예를 들어 거래소의 "상장심사팀"과 "트레이딩팀"은 물리적·논리적으로 분리되어야 한다.
          <br />
          상장심사팀은 어떤 코인이 상장될지 알고 있지만, 이 정보가 트레이딩팀에 전달되면 내부자 거래의 온상이 된다.
          <br />
          차단벽의 구체적 운영 방법은 다음과 같다.
        </p>

        <p className="leading-7">
          <strong>물리적 분리</strong> -- 다른 층이나 다른 사무실에 배치. 출입 카드로 접근 제한.
          <br />
          <strong>시스템 분리</strong> -- 상장심사 시스템과 거래 시스템의 접근 권한을 완전히 분리. 동일 계정으로 양쪽에 접근 불가.
          <br />
          <strong>커뮤니케이션 통제</strong> -- 차단벽 대상 부서 간 업무 관련 대화·이메일·메신저 교환을 금지.
          불가피한 교류가 필요하면 준법감시인의 사전 승인을 받고, 교류 내용을 기록한다.
          <br />
          <strong>벽 넘기(Wall Crossing) 기록</strong> -- 예외적으로 차단벽을 넘어 정보를 공유해야 할 때(예: M&A 검토),
          준법감시인 승인 + 정보 수령자의 거래 제한 + 전 과정 기록이 필수다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 왜 Chinese Wall이라 부르는가</strong><br />
          만리장성(Great Wall of China)에서 유래한 비유적 표현이다.
          <br />
          금융업계에서는 1960년대부터 사용해 온 용어로, 최근에는 정치적 올바름을 고려해 "정보 차단벽(Information Barrier)"으로 대체하는 추세다.
          <br />
          명칭과 무관하게, 부서 간 정보 차단은 불공정거래 예방의 가장 기본적이고 효과적인 수단이다.
        </p>

      </div>
    </section>
  );
}
