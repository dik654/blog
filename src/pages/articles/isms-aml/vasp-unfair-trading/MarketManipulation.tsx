import MarketManipulationViz from './viz/MarketManipulationViz';
import SpoofingFlowViz from './viz/SpoofingFlowViz';
import PumpDumpFlowViz from './viz/PumpDumpFlowViz';

export default function MarketManipulation() {
  return (
    <section id="market-manipulation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시세조종과 부정거래</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <MarketManipulationViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">시세조종이란</h3>
        <p className="leading-7">
          시세조종(Market Manipulation)은 인위적 수단으로 가상자산의 가격이나 거래량을 왜곡하는 행위다.
          <br />
          시장가격은 수요와 공급에 의해 자연스럽게 형성되어야 하는데,
          이를 인위적으로 변동시켜 "성황을 이루고 있는 듯이" 오인하게 하거나 "타인에게 그릇된 판단"을 하게 만드는 것이 핵심이다.
          <br />
          가상자산이용자보호법 제10조 제2항은 시세조종을 명시적으로 금지한다.
        </p>

        <SpoofingFlowViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">허수 주문(Spoofing)</h3>
        <p className="leading-7">
          스푸핑(Spoofing)은 체결할 의사가 없는 대량 주문을 넣었다가, 시장이 반응하면 즉시 취소하는 수법이다.
          <br />
          작동 원리는 다음과 같다.
        </p>

        <p className="leading-7">
          공격자가 특정 코인의 매수 호가에 대량 주문을 넣는다.
          <br />
          다른 이용자는 "대량 매수 수요가 있다"고 판단하여 매수에 동참한다.
          <br />
          가격이 오르기 시작하면 공격자는 원래 주문을 전량 취소한다.
          <br />
          동시에 미리 보유하고 있던 물량을 올라간 가격에 매도하여 차익을 실현한다.
          <br />
          주문 취소 후 매수 지지가 사라지면서 가격은 다시 하락한다.
        </p>

        <p className="leading-7">
          전통 증권시장에서는 스푸핑이 이미 오래전부터 규제 대상이었지만,
          가상자산 시장에서는 주문-취소 수수료가 없는 거래소가 많아 더 쉽게 실행할 수 있다.
          <br />
          탐지 방법은 주문 생존 시간 분석이다 -- 주문이 수초 이내에 반복적으로 넣어졌다 취소되면 스푸핑 의심 대상이 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">가장 거래(Wash Trading)</h3>
        <p className="leading-7">
          워시 트레이딩(Wash Trading)은 동일인 또는 공모한 복수인이 자기 자신과 거래하여 거래량을 부풀리는 행위다.
          <br />
          법률 용어로는 "권리의 이전을 목적으로 하지 않는 거짓으로 꾸민 매매"에 해당한다.
        </p>

        <p className="leading-7">
          목적은 크게 두 가지다.
          <br />
          <strong>거래량 위장</strong> -- 거래량이 많아 보이면 이용자가 "인기 있는 코인"으로 오인하여 매수에 참여한다.
          거래소 순위(코인마켓캡 등)에서 거래량은 중요한 지표이므로, 인위적으로 부풀리면 노출도가 높아진다.
          <br />
          <strong>가격 설정</strong> -- 유동성이 극히 낮은 코인에서 자전 거래로 원하는 가격을 만들어낸다.
          이후 이 가격을 "시장가"로 제시하여 타인에게 매도한다.
        </p>

        <p className="leading-7">
          탐지 신호는 다음과 같다 --
          동일 IP에서 매수/매도가 동시 발생, 동일 기기 지문(device fingerprint), 주문 패턴의 기계적 반복,
          거래량 대비 호가 스프레드가 비정상적으로 넓은 경우.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">통정 매매</h3>
        <p className="leading-7">
          통정 매매(Prearranged Trading)는 두 명 이상이 사전에 가격과 시간을 합의한 뒤 거래하는 행위다.
          <br />
          법률은 "자기가 매도하는 것과 같은 시기에 같은 가격으로 타인이 매수할 것을 사전에 짠 후 매매하는 행위"로 정의한다.
          <br />
          워시 트레이딩이 "혼자서 자전"이라면, 통정 매매는 "여럿이 공모"하는 것이다.
        </p>

        <p className="leading-7">
          가상자산 시장에서 통정 매매가 위험한 이유는, 여러 거래소에 걸쳐 실행하면 탐지가 매우 어렵다는 점이다.
          <br />
          A거래소에서 갑이 매도하고, B거래소에서 을이 매수하면 개별 거래소의 감시 시스템으로는 연관성을 파악하기 어렵다.
          <br />
          거래소 간 감시 정보 공유 체계가 구축되어야 실효적 탐지가 가능하다.
        </p>

        <PumpDumpFlowViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">펌프 앤 덤프(Pump and Dump)</h3>
        <p className="leading-7">
          펌프 앤 덤프는 허위 또는 과장 정보를 유포하여 가격을 끌어올린(Pump) 뒤,
          고점에서 보유 물량을 대량 매도하여 차익을 실현하는(Dump) 수법이다.
          <br />
          가상자산 시장에서 가장 빈번하고 피해가 큰 시세조종 유형이다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">행위</th>
                <th className="text-left px-3 py-2 border-b border-border">수단</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 사전 매집</td>
                <td className="px-3 py-1.5 border-b border-border/30">저가에 대량 매수</td>
                <td className="px-3 py-1.5 border-b border-border/30">다수 계정 분산, 소량씩 장기간</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 정보 유포(Pump)</td>
                <td className="px-3 py-1.5 border-b border-border/30">허위·과장 호재 유포</td>
                <td className="px-3 py-1.5 border-b border-border/30">텔레그램·SNS·유튜브</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 가격 상승</td>
                <td className="px-3 py-1.5 border-b border-border/30">일반 이용자의 매수 쏠림</td>
                <td className="px-3 py-1.5 border-b border-border/30">FOMO(놓칠까 봐 두려운 심리)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">4. 대량 매도(Dump)</td>
                <td className="px-3 py-1.5">고점에서 전량 매도</td>
                <td className="px-3 py-1.5">가격 급락, 일반 이용자 손실</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          FOMO(Fear Of Missing Out)는 "나만 놓치는 것 아닌가"라는 심리로, 가격이 오를 때 근거 없이 매수에 뛰어드는 행동을 유발한다.
          <br />
          펌프 앤 덤프 세력은 이 심리를 의도적으로 자극한다.
          <br />
          텔레그램 "시그널 방"이나 SNS 인플루언서를 통한 유포가 대표적 경로이며,
          이러한 행위는 가상자산이용자보호법상 부정거래(허위·기망적 수단)에도 해당한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">부정거래: 허위·기망적 수단</h3>
        <p className="leading-7">
          부정거래는 시세조종과 별도로, 허위의 시세를 이용하거나 기망적 수단을 사용하여 거래하는 행위를 포괄한다.
          <br />
          시세조종이 "가격을 직접 움직이는 것"이라면, 부정거래는 "거짓 정보로 사람을 속이는 것"에 가깝다.
        </p>

        <p className="leading-7">
          구체적인 예시로는 다음이 있다.
          <br />
          <strong>허위 시세 이용</strong> -- 실제 시장가와 다른 가격을 표시하여 이용자를 속이는 행위.
          호가창을 조작하거나, 거래소가 표시하는 가격 데이터를 왜곡하는 것이 해당한다.
          <br />
          <strong>기망적 수단</strong> -- 존재하지 않는 기술, 허위 파트너십, 가짜 감사 보고서 등을 사용하여 투자를 유인하는 행위.
          <br />
          <strong>허위 유동성 표시</strong> -- 실제로는 거래가 거의 없는 코인의 거래량이나 시가총액을 허위로 표시하는 것.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">자기발행 가상자산 거래 제한</h3>
        <p className="leading-7">
          가상자산이용자보호법은 VASP 또는 그 특수관계인이 발행한 가상자산의 매매를 중개하는 것을 금지한다.
          <br />
          이 규정의 취지는 이해상충 방지다.
          <br />
          거래소가 자체 발행한 코인을 자기 플랫폼에서 거래하게 하면,
          거래소는 가격 정보, 상장/상폐 권한, 유동성 통제를 모두 가지게 되어 이용자와의 정보 비대칭이 극단적으로 커진다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">금지 대상</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">VASP 자체 발행</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래소가 직접 발행한 가상자산의 매매 중개 금지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">특수관계인 발행</td>
                <td className="px-3 py-1.5 border-b border-border/30">계열사, 대주주, 임원 등이 발행한 가상자산도 동일하게 제한</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">예외: 시행령 정해진 취득</td>
                <td className="px-3 py-1.5">정당한 사유로 취득한 경우라도 공시 의무를 부담</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          예외적으로 시행령이 정하는 방법에 따라 취득한 가상자산은 보유가 가능하지만,
          취득 사실과 보유 현황을 공시해야 한다.
          <br />
          이 공시 의무는 이용자가 이해상충 가능성을 판단할 수 있도록 하기 위한 장치다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 시세조종 탐지의 기술적 과제</strong><br />
          가상자산 시세조종은 전통 증권시장보다 탐지가 어렵다.
          <br />
          거래소마다 API 형식과 로그 체계가 다르고, 교차 거래소 조종은 단일 플랫폼에서 포착할 수 없다.
          <br />
          이 때문에 금융감독원은 거래소 전체의 거래 데이터를 수집하는 상시 감시체계를 구축하고 있으며,
          AI 기반 패턴 인식으로 비정상 거래를 실시간 탐지하는 시스템을 고도화하고 있다.
        </p>

      </div>
    </section>
  );
}
