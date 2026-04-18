import BlockchainAnalysisViz from './viz/BlockchainAnalysisViz';
import OnchainTechniquesViz from './viz/OnchainTechniquesViz';
import AnalysisLimitsViz from './viz/AnalysisLimitsViz';

export default function BlockchainAnalysis() {
  return (
    <section id="blockchain-analysis" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록체인 분석 도구와 기법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          블록체인은 모든 거래가 공개 원장에 기록되지만, 주소와 실제 소유자 간의 연결이 불분명하다.<br />
          블록체인 분석(Blockchain Analytics)은 이 간극을 메우는 기술 — 익명의 주소를 실제 엔티티(거래소, 믹서, 다크웹 마켓 등)와 연결하고,
          자금 흐름을 시각화하여 의심 거래의 전체 경로를 추적한다.
        </p>

        <BlockchainAnalysisViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">온체인 분석의 네 가지 핵심 기법</h3>

        <p>
          <strong>1. 지갑 클러스터링(Wallet Clustering)</strong><br />
          동일 소유자가 관리하는 것으로 추정되는 여러 주소를 하나의 그룹(클러스터)으로 묶는 기법.<br />
          비트코인에서는 "공통 입력 소유권(Common Input Ownership)" 휴리스틱이 기본 — 같은 트랜잭션에 입력으로 사용된 주소들은 같은 소유자로 추정한다.<br />
          이더리움에서는 EOA(Externally Owned Account)에서 특정 컨트랙트로의 반복 호출 패턴, 가스비 지불 주소 공유 등을 분석한다.
        </p>
        <p>
          클러스터링의 정확도가 분석의 신뢰도를 결정한다.<br />
          CoinJoin(여러 사용자가 하나의 트랜잭션에 입력을 결합하는 기법)은 공통 입력 소유권 휴리스틱을 의도적으로 무력화하는 수법.<br />
          분석 도구는 CoinJoin 트랜잭션을 식별하고 별도 처리하는 알고리즘을 적용한다.
        </p>

        <p>
          <strong>2. 거래 그래프 추적(Transaction Graph Tracing)</strong><br />
          특정 주소에서 출발하여 자금이 이동한 전체 경로를 방향 그래프(Directed Graph)로 시각화하는 기법.<br />
          각 노드(주소)와 엣지(거래)를 따라가면 자금의 출처(source)와 목적지(destination)를 파악할 수 있다.
        </p>
        <p>
          "몇 홉(hop)까지 추적할 것인가"가 실무적 판단 포인트.<br />
          1홉은 직접 거래 상대방, 2홉은 한 단계 경유, 3홉 이상은 간접 연결.<br />
          홉이 깊어질수록 관련성은 약해지지만, 믹서를 경유한 세탁은 3~5홉 이상 추적해야 출처를 파악할 수 있다.
        </p>

        <p>
          <strong>3. 주소 라벨링(Address Labeling)</strong><br />
          알려진 엔티티의 주소를 태그하여 데이터베이스로 관리하는 기법.<br />
          거래소 핫월렛/콜드월렛 주소, 믹서 컨트랙트 주소, 다크웹 마켓 주소, OFAC 제재 주소 등을 분류한다.
        </p>
        <p>
          라벨링 DB의 규모와 갱신 속도가 분석 도구의 경쟁력을 결정한다.<br />
          주요 분석 업체들은 수억 개의 주소에 라벨을 부여하고, 새로운 서비스/사건이 발생할 때마다 지속적으로 갱신한다.<br />
          DeFi 프로토콜의 급증으로 라벨링 대상이 기하급수적으로 늘어나는 것이 현재의 도전 과제.
        </p>

        <p>
          <strong>4. 위험 점수 산정(Risk Scoring)</strong><br />
          주소 또는 거래에 대해 0~100 사이의 위험 점수를 자동 산정하는 기법.<br />
          점수 산정 요소: 직접 연결된 엔티티의 위험도, 거래 패턴 이상 여부, 믹서/프라이버시 코인 경유 여부, 제재 목록 연관성 등.
        </p>
        <p>
          거래소는 입금 주소의 위험 점수가 임계값을 초과하면 자동으로 입금을 보류하고 심층 조사를 진행한다.<br />
          점수가 "높음"이면 계정 정지 + STR 검토, "중간"이면 모니터링 강화, "낮음"이면 정상 처리.<br />
          임계값 설정은 거래소의 위험 수용도(Risk Appetite)에 따라 다르다 — 보수적인 거래소일수록 낮은 점수에서도 경보를 발생시킨다.
        </p>

        <OnchainTechniquesViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 블록체인 분석 도구</h3>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">도구</th>
                <th className="text-left px-3 py-2 border-b border-border">주요 기능</th>
                <th className="text-left px-3 py-2 border-b border-border">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Chainalysis Reactor</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 그래프 시각화, 클러스터 분석, 실시간 모니터링</td>
                <td className="px-3 py-1.5 border-b border-border/30">가장 큰 라벨링 DB, 연간 1조 달러 이상 거래 추적, 2026년 AI 에이전트 도입</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Elliptic</td>
                <td className="px-3 py-1.5 border-b border-border/30">크로스체인 분석, 위험 점수, 제재 스크리닝</td>
                <td className="px-3 py-1.5 border-b border-border/30">DeFi/NFT 분석 강점, 홀리스틱 스크리닝(직접+간접 연결 모두 평가)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CipherTrace (현 Mastercard)</td>
                <td className="px-3 py-1.5 border-b border-border/30">VASP 위험 평가, Travel Rule 솔루션</td>
                <td className="px-3 py-1.5 border-b border-border/30">900개 이상 가상자산 지원, 전통 금융과의 통합 강점</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">Crystal (Bitfury 계열)</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 흐름 추적, 위험 점수, 규제 보고 자동화</td>
                <td className="px-3 py-1.5 border-b border-border/30">비트코인 분석에 특화, 법집행기관 채택 많음</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">TRM Labs</td>
                <td className="px-3 py-1.5">멀티체인 인텔리전스, 제재 스크리닝, 사고 대응</td>
                <td className="px-3 py-1.5">실시간 거래 모니터링 API, DeFi 프로토콜 추적 강점</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          2026년 현재 가장 주목할 변화는 AI 에이전트의 도입.<br />
          블록체인 분석 플랫폼에 자연어 질의 기반의 AI 에이전트가 탑재되어,
          "이 주소에서 지난 30일간 믹서를 경유한 거래를 모두 보여줘" 같은 자연어 명령으로 분석이 가능해지고 있다.<br />
          수백만 건의 조사 데이터로 학습된 이 에이전트는 숙련된 분석가 수준의 패턴 인식을 자동화한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">VASP 간 정보 공유 — Travel Rule</h3>
        <p>
          Travel Rule은 VASP 간 가상자산 이전 시 송신인과 수신인 정보를 함께 전달해야 하는 규정.<br />
          FATF 권고사항 16에서 유래하며, 한국에서는 특금법 시행령에 따라 100만 원 이상 이전 시 적용된다.
        </p>
        <p>
          Travel Rule의 작동 방식:
        </p>
        <ul>
          <li><strong>송신 VASP</strong> — 고객의 출금 요청 시 수신 주소가 어떤 VASP에 속하는지 확인(블록체인 분석 또는 VASP 디렉토리 조회)</li>
          <li><strong>정보 전달</strong> — 송신인 이름, 주소, 계정 번호를 수신 VASP에 전자적으로 전송</li>
          <li><strong>수신 VASP</strong> — 수신인 정보와 대조하여 일치 여부 확인 후 입금 승인</li>
          <li><strong>불일치 시</strong> — 거래 거부 또는 추가 확인 요청</li>
        </ul>

        <p>
          Travel Rule 솔루션을 통해 VASP 간 상호 검증이 이루어지면,
          거래소를 경유하는 세탁 시도의 난이도가 크게 높아진다.<br />
          그러나 비호스팅 지갑(개인 지갑, DeFi 프로토콜)으로의 이전에는 Travel Rule이 적용되지 않아
          세탁 경로가 비호스팅 지갑으로 우회하는 현상이 나타나고 있다.
        </p>

        <AnalysisLimitsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">분석의 한계</h3>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">한계 영역</th>
                <th className="text-left px-3 py-2 border-b border-border">원인</th>
                <th className="text-left px-3 py-2 border-b border-border">대응 방향</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">DeFi 프로토콜</td>
                <td className="px-3 py-1.5 border-b border-border/30">스마트 컨트랙트 내부 로직이 복잡, KYC 없는 거래 가능</td>
                <td className="px-3 py-1.5 border-b border-border/30">컨트랙트 레벨 분석, DeFi 프로토콜별 디코딩 로직 개발</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">크로스체인 브릿지</td>
                <td className="px-3 py-1.5 border-b border-border/30">체인 간 이동 시 주소 연결 단절, 단일 체인 분석 불가</td>
                <td className="px-3 py-1.5 border-b border-border/30">멀티체인 통합 분석, 브릿지 컨트랙트 모니터링</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">프라이버시 코인</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 내역 자체가 암호화되어 추적 원천 차단</td>
                <td className="px-3 py-1.5 border-b border-border/30">프라이버시 코인 입출금 차단, 연구 수준의 역추적 시도</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">레이어 2</td>
                <td className="px-3 py-1.5 border-b border-border/30">오프체인 거래가 L1에 일괄 기록되어 개별 추적 곤란</td>
                <td className="px-3 py-1.5 border-b border-border/30">L2별 전용 분석 도구 개발, L2 데이터 인덱싱</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">P2P/OTC 거래</td>
                <td className="px-3 py-1.5">거래소를 경유하지 않는 직접 거래, KYC 우회</td>
                <td className="px-3 py-1.5">P2P 플랫폼 규제 강화, 온체인 패턴으로 OTC 거래 식별</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 분석 도구 선정 기준</strong><br />
          VASP가 분석 도구를 선택할 때 고려해야 할 핵심 요소 — 지원 체인 수, 라벨링 DB 규모, API 응답 속도, 규제 기관 인정 여부.<br />
          특히 국내 거래소는 FIU와 금감원이 인정하는 도구를 사용해야 검사 시 적정성을 입증할 수 있다.<br />
          단일 도구에 의존하기보다 2개 이상의 도구를 병행하여 교차 검증하는 것이 최선의 실무 관행.
        </p>

      </div>
    </section>
  );
}
