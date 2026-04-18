import DetectionPatternsViz from './viz/DetectionPatternsViz';
import StructuringViz from './viz/StructuringViz';
import LaunderingPathViz from './viz/LaunderingPathViz';

export default function DetectionPatterns() {
  return (
    <section id="detection-patterns" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">주요 탐지 패턴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          FDS는 알려진 자금세탁 수법을 패턴으로 정의하고, 실시간 거래와 대조한다.<br />
          패턴은 단독으로 사용되기보다 여러 패턴이 조합되어 하나의 세탁 시나리오를 구성한다.<br />
          아래 9가지는 가상자산 거래소에서 가장 빈번하게 적용되는 핵심 탐지 패턴.
        </p>

        <DetectionPatternsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">1. 구조화 거래(Structuring)</h3>
        <p>
          보고 기준 금액(예: CTR 기준 1천만 원) 바로 아래로 거래를 분할하는 수법.<br />
          "스머핑(Smurfing)"이라고도 한다 — 여러 사람(스머프)이 소액씩 나눠 입금하는 형태에서 유래한 명칭.<br />
          단일 거래는 기준 이하지만, 누적 금액이 기준을 초과하거나 일정 패턴(동일 금액 반복, 특정 시간대 집중)을 보인다.
        </p>
        <p>
          FDS 탐지 조건: 24시간 내 동일 계정에서 기준 금액의 80~99% 범위 거래가 3회 이상 발생.<br />
          또는 다수 계정에서 동일 금액이 동일 수신 주소로 집중되는 패턴.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2. 빠른 이동(Rapid Movement)</h3>
        <p>
          원화 입금 직후 가상자산을 매수하고 즉시 외부 지갑으로 전액 출금하는 행위.<br />
          거래소를 단순 "경유지"로 활용하는 전형적인 계층화(Layering) 수법.<br />
          정상 투자자는 매수 후 보유(Hold)하거나 시장 상황에 따라 매도하지만,
          세탁 목적의 거래는 보유 시간이 극단적으로 짧다 — 입금~출금까지 수분 이내.
        </p>
        <p>
          FDS 탐지 조건: 입금 후 30분 이내 전액(90% 이상) 외부 출금 시 경보.<br />
          거래 금액이 클수록, 반복될수록 경보 등급 상승.
        </p>

        <StructuringViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">3. 분산 출금(Fan-out)</h3>
        <p>
          하나의 계정에서 대량 입금 후 다수의 외부 지갑 주소로 소액 분산 전송하는 패턴.<br />
          자금 흐름을 복잡하게 만들어 추적 난이도를 높이는 것이 목적.<br />
          10개, 50개, 100개 이상의 주소로 분산하면 각 경로를 개별 추적해야 하므로 수사 비용이 급증한다.
        </p>
        <p>
          FDS 탐지 조건: 1시간 내 10개 이상 서로 다른 외부 주소로 출금 시 경보.<br />
          수신 주소가 신규 생성(온체인에서 거래 이력 없음)인 경우 경보 등급 추가 상승.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4. 집중 입금(Fan-in)</h3>
        <p>
          분산 출금의 역방향 — 다수의 외부 지갑에서 하나의 거래소 계정으로 자금이 집중되는 패턴.<br />
          세탁의 통합(Integration) 단계에서 자주 나타난다.<br />
          분산된 자금을 하나로 모아 원화로 환전하려는 시도.
        </p>
        <p>
          FDS 탐지 조건: 24시간 내 5개 이상 서로 다른 외부 주소에서 동일 계정으로 입금.<br />
          특히 송금 주소들이 동일 클러스터(같은 소유자로 추정되는 주소 그룹)에 속할 경우 강한 의심 신호.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">5. 믹서/텀블러 사용</h3>
        <p>
          믹서(Mixer)는 여러 사용자의 자금을 섞어 출처를 불분명하게 만드는 서비스.<br />
          텀블러(Tumbler)도 동일 개념 — 입금한 금액과 다른 출처의 금액을 섞어 돌려준다.<br />
          대표적으로 이더리움 기반의 Tornado Cash, 비트코인 기반의 Wasabi Wallet CoinJoin이 있다.
        </p>
        <p>
          Tornado Cash는 2022년 미 재무부 OFAC의 제재 대상으로 지정되어 관련 주소와의 거래 자체가 제재 위반이 될 수 있다.<br />
          FDS 탐지 조건: 입출금 주소가 알려진 믹서 컨트랙트 주소와 1~2홉(hop) 이내에 연결된 경우 경보.<br />
          블록체인 분석 도구의 라벨링 DB를 활용하여 믹서 연계 여부를 자동 판별한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">6. 프라이버시 코인 교환</h3>
        <p>
          프라이버시 코인은 거래 내역 자체를 암호화하여 추적을 원천 차단하는 가상자산.<br />
          Monero(XMR)는 링 서명(Ring Signature)과 스텔스 주소(Stealth Address)를 사용하고,
          Zcash(ZEC)는 영지식 증명(zk-SNARK)으로 거래를 숨긴다.
        </p>
        <p>
          BTC나 ETH를 거래소에서 매수한 후 DEX를 통해 XMR로 교환하면 이후 자금 흐름 추적이 사실상 불가능.<br />
          FDS 탐지 조건: 프라이버시 코인 관련 DEX 컨트랙트와의 상호작용 감지.<br />
          일부 거래소는 아예 프라이버시 코인의 입출금을 차단하거나 상장 폐지하는 방식으로 대응한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">7. 크로스체인 이동</h3>
        <p>
          서로 다른 블록체인 간에 자금을 이동시켜 추적을 어렵게 만드는 수법.<br />
          DEX(탈중앙화 거래소)나 브릿지(Bridge) 프로토콜을 경유하면 중앙화 거래소의 KYC를 우회할 수 있다.<br />
          예: ETH → 브릿지 → AVAX → DEX → USDT → 다른 거래소에서 환전.<br />
          여러 블록체인에 걸친 복잡한 트랜잭션 웹을 생성하여 단일 체인 분석 도구로는 전체 흐름 파악이 어렵다.
        </p>
        <p>
          FDS 탐지 조건: 알려진 브릿지 컨트랙트와의 상호작용 후 즉시 출금하는 패턴.<br />
          크로스체인 분석은 단일 체인 분석보다 기술적으로 훨씬 난이도가 높아 전문 분석 도구에 의존한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">8. 신규 고액 거래</h3>
        <p>
          계정 생성 직후 대규모 거래를 시도하는 패턴.<br />
          자금세탁 전용으로 만들어진 "깡통 계좌" 의심 — 실 사용자가 아닌 명의 도용 가능성이 높다.<br />
          정상 사용자는 소액부터 시작하여 점진적으로 거래 규모를 늘리는 경향이 있다.
        </p>
        <p>
          FDS 탐지 조건: 가입 후 7일 이내 누적 입금 1천만 원 이상 또는 단일 거래 5백만 원 이상 시 경보.<br />
          KYC 등급(기본/강화)에 따라 임계값이 달라지며, EDD(강화된 고객확인) 미완료 고객에게 더 엄격한 기준 적용.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">9. 휴면 계정 활성화</h3>
        <p>
          오랜 기간(6개월~1년 이상) 미사용된 계정이 갑작스럽게 대규모 거래를 시작하는 패턴.<br />
          계정 탈취(해킹) 또는 명의 매매의 징후일 수 있다.<br />
          세탁 조직이 오래된 계정을 매입하여 사용하는 이유는 "신규 계정 감시"를 우회하기 위함.
        </p>
        <p>
          FDS 탐지 조건: 180일 이상 미사용 후 접속 시 본인확인 재요청(re-KYC) 트리거.<br />
          접속 IP/디바이스가 과거와 완전히 다른 경우 경보 등급 추가 상승.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 패턴 조합의 위험도</strong><br />
          단일 패턴 매칭만으로는 오탐이 많다 — 정상적인 대량 거래도 경보를 유발할 수 있기 때문.<br />
          실무에서는 여러 패턴의 동시 매칭으로 위험도를 산정한다.<br />
          예: "신규 고액(패턴8) + 빠른 이동(패턴2) + 믹서 경유(패턴5)"가 동시 발생하면 최고 등급 경보.<br />
          이러한 조합 로직이 FDS의 핵심 경쟁력이며, AI 모델이 자동으로 학습하는 영역이기도 하다.
        </p>

        <LaunderingPathViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">가상자산 특유의 세탁 경로</h3>
        <p>
          전통 금융과 달리 가상자산 자금세탁은 온체인에서 이루어지는 고유한 경로가 있다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">세탁 단계</th>
                <th className="text-left px-3 py-2 border-b border-border">전통 금융</th>
                <th className="text-left px-3 py-2 border-b border-border">가상자산</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">배치(Placement)</td>
                <td className="px-3 py-1.5 border-b border-border/30">현금을 은행에 소액 분산 입금</td>
                <td className="px-3 py-1.5 border-b border-border/30">범죄 수익으로 가상자산 매수 또는 P2P 거래</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">계층화(Layering)</td>
                <td className="px-3 py-1.5 border-b border-border/30">해외 계좌 이체, 위장 법인 경유</td>
                <td className="px-3 py-1.5 border-b border-border/30">믹서, 크로스체인 브릿지, DEX, 프라이버시 코인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">통합(Integration)</td>
                <td className="px-3 py-1.5">부동산/사업 투자로 합법화</td>
                <td className="px-3 py-1.5">거래소에서 원화/스테이블코인으로 환전</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          자금세탁의 약 80%가 중개 지갑이나 여러 번의 홉(Hop)을 경유한다.<br />
          FDS는 이 홉 체인을 역추적하여 최초 출처 지갑의 위험도를 평가해야 한다.<br />
          이것이 단순 규칙 기반만으로는 한계인 이유 — 온체인 거래 그래프 분석이 필수적이다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 김치 프리미엄 악용 패턴</strong><br />
          국내 가상자산 가격이 해외보다 높을 때(김치 프리미엄), 해외에서 저렴하게 매수한 가상자산을 국내 거래소로 이전하여 차익을 실현하는 패턴.<br />
          이 자체는 차익거래이지만, 외국환거래법 위반(불법 외환 유출)과 결합되면 자금세탁으로 분류된다.<br />
          FIU는 이러한 유형을 "범죄 가능성이 높은 사례"로 유형화하여 금융회사에 제공하고 있다.
        </p>

      </div>
    </section>
  );
}
