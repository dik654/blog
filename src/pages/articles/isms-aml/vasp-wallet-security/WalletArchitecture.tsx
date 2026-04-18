import WalletArchitectureViz from './viz/WalletArchitectureViz';
import ColdToHotTransferViz from './viz/ColdToHotTransferViz';
import ExternalCustodyViz from './viz/ExternalCustodyViz';

export default function WalletArchitecture() {
  return (
    <section id="wallet-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">지갑 구조와 보관 정책</h2>
      <WalletArchitectureViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-4">콜드월렛: 오프라인 격리 보관</h3>
        <p className="leading-7">
          콜드월렛(Cold Wallet)은 개인키(Private Key)를 인터넷에 연결되지 않은 장치에 보관하는 방식이다.
          <br />
          HSM(Hardware Security Module, 하드웨어 보안 모듈)이나 에어갭(air-gapped) 컴퓨터가 대표적이며,
          물리적으로 접근하지 않는 한 키를 추출할 수 없도록 설계한다.
        </p>
        <p className="leading-7">
          콜드월렛 장치는 물리적 안전장소(금고, 내화금고, 별도 보안 구역)에 보관한다.
          <br />
          출입 기록은 CCTV와 출입 로그로 이중 관리하고, 접근 가능 인원을 최소화한다.
          <br />
          키를 복수 조각으로 분할하는 Shamir's Secret Sharing이나 Multi-sig를 적용하면,
          단일 장치가 탈취되더라도 자금 이동이 불가능하다.
        </p>
        <p className="leading-7">
          HSM은 내부에서 키를 생성하고 서명 연산까지 수행하므로, 키가 장치 밖으로 나오지 않는다.
          <br />
          FIPS 140-2 Level 3 이상 인증을 받은 HSM을 사용하면 물리적 탐침(tamper) 시도 시 키가 자동 삭제되어
          장치를 분해하더라도 키를 복원할 수 없다.
          <br />
          에어갭 컴퓨터 방식은 USB나 QR코드로 서명 요청을 전달하고, 서명 결과만 반출하는 절차를 따른다.
          네트워크 카드를 물리적으로 제거하거나 비활성화하여 원격 공격 경로를 원천 차단한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">핫월렛: 온라인 운영과 한도 관리</h3>
        <p className="leading-7">
          핫월렛(Hot Wallet)은 서버에 개인키를 보관하여 즉시 트랜잭션 서명이 가능한 지갑이다.
          <br />
          이용자의 출금 요청을 실시간으로 처리하려면 온라인 상태의 키가 필요하기 때문에 핫월렛을 운영한다.
        </p>
        <p className="leading-7">
          핫월렛에는 반드시 일일 출금 한도(daily withdrawal limit)를 설정한다.
          <br />
          한도를 초과하는 출금은 자동으로 보류되며, 별도 승인 절차를 거쳐야 처리된다.
          <br />
          이 한도는 핫월렛이 침해되었을 때 최대 피해액을 사전에 제한하는 안전장치 역할을 한다.
          <br />
          한도 금액은 일평균 출금량, 시장 변동성, 보안 상황을 종합하여 주기적으로 조정한다.
        </p>
        <p className="leading-7">
          핫월렛 서버의 보안도 중요하다.
          개인키는 메모리에만 존재하고 디스크에 평문으로 기록하지 않으며,
          서버 재시작 시 Secrets Manager에서 암호화된 키를 주입받아 복호화하는 방식을 사용한다.
          <br />
          핫월렛 서버는 서명 전용 역할만 수행하고, 불필요한 포트와 서비스를 모두 비활성화하여 공격 표면(attack surface)을 최소화한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">법적 요구사항: 콜드월렛 80% 보관 규정</h3>
        <p className="leading-7">
          국내 법령은 이용자 가상자산 경제적 가치의 80% 이상을 콜드월렛에 보관하도록 의무화한다.
          <br />
          "경제적 가치"는 단순한 시가가 아니라 정해진 산정 기준을 따른다.
        </p>
        <p className="leading-7">
          산정 방법은 다음과 같다: 가상자산 종류별 보유 수량에 전월 말일 기준 최근 1년간 일평균 원화환산액을 곱한다.
          <br />
          예를 들어 전월 말 기준 최근 1년 일평균 비트코인 가격이 5,000만 원이고 100 BTC를 보관 중이라면,
          경제적 가치는 50억 원이 된다. 이 중 80%인 40억 원 이상을 콜드월렛에 두어야 한다.
        </p>
        <p className="leading-7">
          매월 초 5영업일 이내에 이 비율을 재산정해야 하며, 80% 미달 시 즉시 콜드월렛으로 자산을 이동하여 비율을 충족해야 한다.
          <br />
          시장 급등으로 핫월렛 잔고의 원화 가치가 상승하면 비율이 깨질 수 있으므로, 자동 모니터링 알림을 구축하는 것이 실무적으로 필수다.
        </p>

        <ColdToHotTransferViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">콜드-핫 전송 절차</h3>
        <p className="leading-7">
          콜드월렛에서 핫월렛으로 자산을 옮기는 것은 가장 민감한 운영 행위 중 하나다.
          <br />
          정해진 절차 없이 임의로 전송하면 내부자 유출과 구별할 수 없으므로, 엄격한 프로세스를 수립한다.
        </p>
        <p className="leading-7">
          전송 요청은 운영팀이 작성하고, 보안 책임자(CISO) 또는 지정된 승인권자가 검토 후 승인한다.
          <br />
          승인이 완료되면 Multi-sig 서명 절차를 진행한다 -- 물리적으로 분리된 장소에 있는 키 소유자들이 각자 서명을 추가하고,
          필요한 서명 수가 충족되면 트랜잭션이 브로드캐스트된다.
          <br />
          전송 후에는 온체인에서 트랜잭션 컨펌을 확인하고, 내부 시스템의 잔고와 대조하여 정합성을 검증한다.
          <br />
          전 과정은 로그로 기록되며, 월간 감사 시 검토 대상에 포함된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">이용자 명부와 자산 분리</h3>
        <p className="leading-7">
          VASP는 이용자별로 주소, 성명, 보유 가상자산의 종류와 수량, 지갑 주소를 기재한 명부를 유지해야 한다.
          <br />
          이 명부는 개인정보에 해당하므로 AES-256 등 강력한 암호화 알고리즘으로 암호화하여 저장한다.
          <br />
          암호화 키는 명부 데이터와 물리적으로 분리된 위치에 보관하여, DB 유출만으로는 복호화가 불가능하게 만든다.
        </p>
        <p className="leading-7">
          이용자 자산과 회사 자산은 반드시 별도 지갑에 분리하여 관리한다.
          <br />
          혼합 보관(commingling)을 하면 회사 부도 시 이용자 자산이 회사 채권자에게 귀속될 위험이 생기고,
          온체인 검증으로 이용자 자산 규모를 확인하는 것도 불가능해진다.
          <br />
          분리된 지갑 구조에서는 온체인으로 해당 주소의 잔고를 조회하면 이용자 자산이 실질적으로 동일한 종류와 수량만큼 보유되고 있는지 상시 확인할 수 있다.
        </p>
        <p className="leading-7">
          Proof of Reserves(준비금 증명)는 이 분리 구조 위에서 동작하는 투명성 메커니즘이다.
          <br />
          이용자 자산 총합과 온체인 잔고를 Merkle Tree로 묶어 검증 가능한 증명을 생성하면,
          개별 이용자가 자신의 자산이 실제로 보관되어 있는지 독립적으로 확인할 수 있다.
          <br />
          정기적(월 1회 이상) 또는 수시로 이 증명을 공개하여 이용자 신뢰를 확보한다.
        </p>

        <ExternalCustodyViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">외부 수탁 시 준수 사항</h3>
        <p className="leading-7">
          자체 보관이 아닌 외부 수탁업체에 가상자산 보관을 위탁하는 경우, 추가적인 통제 요건이 적용된다.
        </p>
        <p className="leading-7">
          첫째, 수탁업체는 사고예방 체계를 갖추어야 한다.
          콜드월렛 보관 비율, Multi-sig 적용 여부, 침해사고 대응 절차 등을 사전에 평가한다.
          <br />
          둘째, 이해상충 방지 조치가 필요하다.
          수탁업체가 위탁받은 자산을 자기 거래에 활용하거나, 담보로 제공하는 행위를 계약으로 금지한다.
          <br />
          셋째, 재위탁(sub-custody)은 원칙적으로 금지한다.
          수탁업체가 다시 제3자에게 보관을 위탁하면 통제 체인이 길어져 책임 소재가 불분명해지기 때문이다.
          <br />
          불가피하게 재위탁이 필요한 경우에도 원래 위탁자의 사전 서면 동의가 있어야 하며,
          재위탁 대상의 보안 수준이 원래 수탁업체와 동등 이상임을 검증해야 한다.
        </p>
        <p className="leading-7">
          외부 수탁 관계는 정기적으로 재평가한다.
          수탁업체의 보안 감사 보고서, 사고 이력, 재무 건전성을 매년 검토하여 기준 미달 시 수탁 계약을 해지하고 자산을 회수한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">온체인 검증과 감사 대응</h3>
        <p className="leading-7">
          지갑 구조가 올바르게 운영되고 있는지 확인하는 최종 수단은 온체인 검증이다.
          <br />
          블록체인 탐색기(Explorer)나 노드 API를 통해 각 지갑 주소의 잔고를 실시간으로 조회하고,
          내부 원장(ledger)의 기록과 대조한다.
        </p>
        <p className="leading-7">
          외부 감사 시에는 특정 시점(블록 높이)의 스냅샷을 기준으로 검증을 수행한다.
          <br />
          감사인이 요청한 시점의 블록 데이터를 제출하면, 해당 시점에 이용자 자산이 실제로 존재했는지 독립적으로 확인할 수 있다.
          <br />
          이 과정에서 콜드월렛 80% 비율 준수 여부, 이용자-회사 자산 분리 여부, 명부 기재 수량과 실제 잔고의 일치 여부를 종합 점검한다.
          <br />
          온체인 데이터는 위변조가 불가능하므로 감사 증거로서의 신뢰도가 매우 높다.
        </p>
      </div>
    </section>
  );
}
