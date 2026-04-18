import ProofOfReservesViz from './viz/ProofOfReservesViz';
import MerkleTreePoRViz from './viz/MerkleTreePoRViz';
import ZkSnarkPoRViz from './viz/ZkSnarkPoRViz';

export default function ProofOfReserves() {
  return (
    <section id="proof-of-reserves" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">준비금 증명(PoR)과 온체인 검증</h2>
      <ProofOfReservesViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-4">PoR이란</h3>
        <p className="leading-7">
          Proof of Reserves(준비금 증명, PoR)는 VASP가 이용자의 자산을 실제로 보유하고 있음을 제3자가 검증 가능한 방식으로 증명하는 절차다.
          <br />
          핵심 질문은 단순하다 -- "거래소가 이용자 잔고 합계만큼의 자산을 정말 갖고 있는가?"
          <br />
          전통 금융에서는 은행의 지급준비율을 중앙은행이 감독하지만, 가상자산 시장에는 동등한 감독 체계가 아직 완성되지 않았다.
          PoR은 이 공백을 기술적으로 메우려는 시도다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">왜 필요한가 -- 사태 이후의 교훈</h3>
        <p className="leading-7">
          2022년 대형 거래소 파산 사태는 PoR의 필요성을 전 세계에 각인시켰다.
          <br />
          해당 거래소는 이용자 자산을 자체 투자 및 관계사 대출에 전용(misappropriation)하면서도, 장부상으로는 충분한 잔고를 표시하고 있었다.
          <br />
          이용자는 거래소가 자산을 보유하고 있다고 믿었지만, 실제로는 수십억 달러의 부족분이 존재했다.
          <br />
          이 사태 이후 주요 거래소들이 PoR을 자발적으로 도입하기 시작했고,
          각국 규제기관도 법적 의무화를 추진하게 되었다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">검증 방법: 머클 트리 기반 잔고 증명</h3>
        <p className="leading-7">
          PoR의 기술적 핵심은 머클 트리(Merkle Tree)다.
          <br />
          머클 트리는 이진 해시 트리 구조로, 개별 데이터의 무결성을 전체 루트 해시 하나로 검증할 수 있게 해준다.
        </p>

        <p className="leading-7">
          PoR에서 머클 트리를 사용하는 방식은 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">단계</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 리프 노드 생성</td>
                <td className="px-3 py-1.5 border-b border-border/30">각 이용자의 (ID 해시 + 잔고)를 리프 노드로 배치</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 트리 구성</td>
                <td className="px-3 py-1.5 border-b border-border/30">인접 노드를 쌍으로 묶어 해시하며 상위 노드를 생성, 루트까지 반복</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 루트 해시 공개</td>
                <td className="px-3 py-1.5 border-b border-border/30">머클 루트와 총 잔고 합계를 공개</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">4. 개별 검증</td>
                <td className="px-3 py-1.5 border-b border-border/30">이용자는 자신의 리프 + 형제 노드(머클 경로)로 루트를 재계산하여 포함 여부 확인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">5. 온체인 대조</td>
                <td className="px-3 py-1.5">공개된 지갑 주소의 온체인 잔고가 총 잔고 합계 이상인지 확인</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          이용자는 자신의 잔고가 트리에 포함되어 있는지를 머클 경로(Merkle Path)로 독립 검증할 수 있다.
          <br />
          리프 노드에서 루트까지의 경로를 따라 해시를 재계산하면, 공개된 루트 해시와 일치 여부를 확인할 수 있다.
          <br />
          일치하면 "나의 잔고가 거래소 총 잔고에 포함되어 있다"는 것이 수학적으로 증명된다.
        </p>

        <div className="not-prose my-6">
          <MerkleTreePoRViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">외부 감사와 온체인 주소 공개</h3>
        <p className="leading-7">
          머클 트리 검증만으로는 "거래소가 정말 그 자산을 보유하는지"까지 증명하지 못한다.
          <br />
          이를 보완하기 위해 두 가지 추가 장치가 사용된다.
        </p>

        <p className="leading-7">
          <strong>외부 감사</strong> -- 독립적인 감사법인이 거래소의 지갑 잔고, 장부, 머클 트리를 교차 검증한다.
          감사인은 거래소가 공개한 지갑 주소의 실제 통제권을 확인하기 위해 소액 테스트 전송을 요청하기도 한다.
          <br />
          <strong>온체인 주소 공개</strong> -- 거래소가 보유한 콜드/핫월렛 주소를 공개하면,
          누구든 블록체인 탐색기(explorer)에서 실시간 잔고를 확인할 수 있다.
          완전한 투명성을 제공하지만, 보안 위험(타깃 공격)이 증가하는 트레이드오프가 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">zk-SNARK를 활용한 고급 PoR</h3>
        <p className="leading-7">
          기본 머클 트리 PoR에는 프라이버시 문제가 있다.
          <br />
          형제 노드를 통해 다른 이용자의 잔고를 부분적으로 추론할 수 있기 때문이다.
          <br />
          이를 해결하기 위해 일부 거래소는 zk-SNARK(Zero-Knowledge Succinct Non-Interactive Argument of Knowledge)를 도입했다.
          <br />
          zk-SNARK는 영지식 증명의 한 종류로, "정보를 공개하지 않고도 특정 조건을 만족한다"는 것을 증명할 수 있는 암호학 기법이다.
        </p>

        <p className="leading-7">
          zk-SNARK가 적용된 PoR에서는 다음 세 가지 조건이 동시에 증명된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">조건</th>
                <th className="text-left px-3 py-2 border-b border-border">의미</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">모든 이용자 포함</td>
                <td className="px-3 py-1.5 border-b border-border/30">특정 이용자를 누락시켜 총량을 줄이는 조작 방지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">음수 잔고 없음</td>
                <td className="px-3 py-1.5 border-b border-border/30">가짜 계정에 음수 잔고를 넣어 총량을 조작하는 것 방지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">총량 불변</td>
                <td className="px-3 py-1.5">이용자 정보 업데이트 시 총 준비금이 변하지 않음을 보장</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          이 세 조건을 영지식으로 증명하면, 개별 이용자의 잔고 정보를 노출하지 않으면서도 전체 준비금의 건전성을 검증할 수 있다.
        </p>

        <div className="not-prose my-6">
          <ZkSnarkPoRViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">PoR의 한계</h3>
        <p className="leading-7">
          PoR이 만능은 아니다. 구조적 한계가 존재한다.
        </p>

        <p className="leading-7">
          <strong>부채 미반영</strong> -- PoR은 자산 보유만 증명할 뿐, 거래소가 진 빚(부채)은 보여주지 않는다.
          자산이 100이고 부채가 90이면 순자산은 10에 불과하지만, PoR에서는 "자산 100 보유" 로만 표시된다.
          <br />
          <strong>스냅샷 시점 조작</strong> -- PoR은 특정 시점의 잔고를 증명한다.
          검증 직전에 자산을 일시 차입하고, 검증 후 반환하면 실제 보유량을 속일 수 있다.
          이를 방지하려면 사전 예고 없는 불시 검증이 필요하다.
          <br />
          <strong>완전성 문제</strong> -- 모든 이용자가 자신의 포함 여부를 검증해야 전체 무결성이 보장된다.
          실제로는 검증에 참여하는 이용자 비율이 낮아, 일부 이용자를 누락해도 발각되기 어렵다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">국내 현황: 자산 현황 공시와 콜드월렛 실사</h3>
        <p className="leading-7">
          가상자산이용자보호법은 VASP에 정기적인 자산 현황 보고 의무를 부과한다.
          <br />
          금융감독원은 반기별로 가상자산사업자 실태조사를 실시하며,
          이용자 자산 보관 현황, 콜드월렛 비율, 보험 가입 여부 등을 점검한다.
        </p>

        <p className="leading-7">
          콜드월렛 잔고 실사는 월 1회 이상 수행하는 것이 감독 지침상 권고된다.
          <br />
          실사 내용은 온체인 잔고와 내부 장부의 대조, 개인키 통제권 확인, 다중서명 설정 검증을 포함한다.
          <br />
          검증 결과는 보고서로 작성하여 내부 감사 부서와 경영진에게 보고한다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} PoR과 법적 의무의 차이</strong><br />
          PoR은 이용자와 시장에 대한 자발적 투명성 제공 수단이고,
          법적 보관 의무는 감독 기관에 대한 강제적 의무다.
          <br />
          둘은 보완 관계에 있으며, 모범적인 VASP는 법적 의무를 넘어 PoR까지 제공하여 신뢰를 구축한다.
          <br />
          2025년 상반기 기준, 국내 주요 거래소들은 자산 현황을 정기 공시하고 있으나,
          머클 트리 기반의 기술적 PoR을 제공하는 곳은 아직 제한적이다.
        </p>

      </div>
    </section>
  );
}
