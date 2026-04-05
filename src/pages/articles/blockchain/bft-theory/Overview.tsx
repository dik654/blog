import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 장군 문제</h2>
      <div className="not-prose mb-6"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          Leslie Lamport가 1982년 논문 "The Byzantine Generals Problem"에서 제기.<br />
          분산 노드 일부가 임의로 거짓말(악의적 메시지 위조)을 할 때, 정직 노드들이 <strong>공통 결정</strong>에 도달할 수 있는가.<br />
          현대 블록체인·분산 DB·항공 제어·원자력 발전소 안전 시스템의 이론적 토대.
        </p>

        {/* ── 문제 설정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">문제 설정: 장군 비유</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Byzantine Generals Problem (Lamport 1982)

// 상황:
// - n명의 장군이 도시를 포위
// - 각 장군은 '공격' 또는 '후퇴' 결정
// - 전달자를 통해서만 통신 (메시지 전달 모델)
// - 일부 장군은 배신자 (Byzantine = 배신자)
//
// 목표 (합의 요건):
// IC1 (Agreement): 모든 정직 장군이 같은 결정
// IC2 (Validity): 커맨더가 정직하면 모든 정직 장군이 커맨더 명령 따름
//
// 왜 어려운가:
// - 배신자 장군이 정직 장군에게 다른 메시지 전달 가능
//   "장군 A는 공격하랬어" → B에게
//   "장군 A는 후퇴하랬어" → C에게
// - B, C는 누가 거짓말하는지 구별 불가

// Lamport 핵심 정리:
// n명 중 f명 배신자 허용하려면 n >= 3f+1 필요
//   - 단순 메시지 전달 모델
//   - 서명 없이
//
// 서명 있는 경우 (Authenticated Byzantine):
// - 메시지 위조 불가 (배신자가 다른 사람 흉내 못 냄)
// - 임의의 f까지 허용 가능 (n >= f+2)
// - 현대 블록체인은 대부분 서명 있는 모델

// 실제 블록체인 매핑:
// - 장군 = validator/node
// - 공격/후퇴 = block 수락/거부
// - 전달자 = P2P 네트워크
// - 배신자 = 악의적 validator (double-sign, censor)
// - 서명 = Ed25519/BLS signature`}
        </pre>
        <p className="leading-7">
          Byzantine은 <strong>임의의 악의적 행동</strong> — 거짓 메시지, 침묵, 모순된 응답.<br />
          Crash fault (단순 정지)와 구별 — 훨씬 강한 공격 모델.<br />
          n ≥ 3f+1은 비서명 모델의 하한, 블록체인은 서명으로 완화.
        </p>

        {/* ── 4가지 핵심 질문 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT가 답해야 할 4가지 질문</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BFT 합의 프로토콜 설계의 핵심 질문:

// Q1. 얼마나 많은 배신자를 감내? (Fault Threshold)
// - 비서명: f < n/3
// - 서명 + 부분동기: f < n/3 (여전히)
// - 서명 + 동기: f < n/2
// - CFT (Crash only): f < n/2

// Q2. 네트워크 가정? (Timing Model)
// - 동기 (Synchronous): 메시지 지연 상한 Δ 알려짐
// - 비동기 (Asynchronous): 상한 없음 → FLP 불가능성
// - 부분 동기 (Partial Sync): GST(Global Stabilization Time) 후 동기
// - DLS(Dwork-Lynch-Stockmeyer) 1988이 부분동기 제시

// Q3. 안전성 vs 활성 우선?
// - Safety: 다른 결정 금지 (never decide wrong)
// - Liveness: 결국 결정 (eventually decide)
// - FLP: 비동기에서 deterministic 불가능
// - 우회: randomization (비동기) 또는 partial sync (부분동기)

// Q4. 통신 복잡도?
// - O(n²): PBFT, Tendermint (all-to-all broadcast)
// - O(n): HotStuff (leader collects signatures)
// - O(n log n): DAG-based (Narwhal)
// - 실제 배포 한계: validator 수 ≤ 수백

// 프로토콜별 선택:
// PBFT:       partial sync, f < n/3, O(n²), safety 우선
// Tendermint: partial sync, f < n/3, O(n²), safety 우선
// HotStuff:   partial sync, f < n/3, O(n),  safety 우선
// Narwhal:    partial sync, f < n/3, O(n),  availability 분리
// Bullshark:  partial sync, f < n/3, async fallback

// 블록체인 채택:
// - Cosmos (Tendermint): CometBFT
// - Aptos: HotStuff → DiemBFT → Jolteon → Ditto
// - Sui: Narwhal + Bullshark → Mysticeti
// - Solana: Tower BFT (PoH 보조)
// - Ethereum 2: Casper FFG + LMD-GHOST (하이브리드)`}
        </pre>
        <p className="leading-7">
          4가지 설계 축: <strong>fault threshold, timing, safety/liveness, communication</strong>.<br />
          블록체인 BFT는 대부분 partial sync, f &lt; n/3, safety 우선.<br />
          통신 복잡도가 validator 수 한계 결정 (수백 규모).
        </p>

        {/* ── 왜 이제 와서 중요? ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 40년 묵은 문제가 블록체인에서 부활?</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BFT 연구 역사:

// 1982: Lamport - Byzantine Generals
// 1988: DLS - Partial synchrony 모델
// 1999: Castro-Liskov - PBFT (최초의 실용적 BFT)
//       - 3-phase (pre-prepare, prepare, commit)
//       - O(n²) 메시지, view change

// 2000s: BFT 연구 쇠퇴
// - 데이터 센터는 CFT로 충분 (Paxos, Raft)
// - Byzantine fault 실무 사례 드묾

// 2008: Bitcoin - Nakamoto consensus
// - PoW + longest chain
// - BFT 아님 (probabilistic, open membership)

// 2014: Ethereum - PoW 계승
// 2016: Hyperledger Fabric, Tendermint 등장
// - 허가형 블록체인에 BFT 복귀

// 2018: HotStuff
// - Ethereum 2.0 연구자가 BFT 재해석
// - O(n) 통신, responsive, chained voting
// - Diem(Libra)이 채택

// 2022: Narwhal + Bullshark (DAG)
// - 50,000+ TPS 실증
// - mempool/ordering 분리

// 2024: Mysticeti (Sui)
// - 390ms end-to-end latency
// - 160,000+ TPS

// 왜 블록체인이 BFT 부활시켰나:
// 1. 경제적 가치 = 공격 인센티브 → Byzantine 고려 필수
// 2. Open network = 누구나 악의적 노드 될 수 있음
// 3. Safety 우선 = 거래 rollback 재앙
// 4. 성능 한계 = BFT 연구 재가속 (수만 TPS 필요)`}
        </pre>
        <p className="leading-7">
          BFT는 <strong>40년 이론 → 실무 재출현</strong>.<br />
          1999 PBFT 이후 쇠퇴 → 2016 블록체인 붐으로 부활.<br />
          2024 Mysticeti 160K TPS까지 진화 — 이론이 실제로 검증되는 시대.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 블록체인은 Byzantine 모델이 필수인가</strong> — 돈이 걸려 있기 때문.<br />
          Paxos/Raft는 같은 팀이 운영하는 서버 = 악의 없음 가정.<br />
          블록체인은 낯선 사람 간 협력 = 반드시 Byzantine 가정 — 경제적 공격 인센티브가 존재.
        </p>
      </div>
    </section>
  );
}
