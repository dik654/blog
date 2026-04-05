import FaultyThresholdViz from './viz/FaultyThresholdViz';

export default function FaultyThreshold() {
  return (
    <section id="faulty-threshold" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{'f < n/3 한계 증명'}</h2>
      <div className="not-prose mb-6"><FaultyThresholdViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          BFT의 <strong>근본 한계</strong> — 전체 노드 n 중 Byzantine f는 n/3 미만.<br />
          즉 정직 노드 2f+1명 이상 필요 — quorum 교차로 safety 보장.<br />
          이 한계는 partial sync + Byzantine 모델의 tight bound.
        </p>

        {/* ── n = 3f 불가능 증명 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">n = 3f에서 합의 불가능 (귀류법)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 증명: n = 3f일 때 BFT 합의 불가능
// (Pease-Shostak-Lamport 1980, DLS 1988)

// 가정: n = 3f인 프로토콜 P가 존재한다고 가정 (귀류법)

// 시나리오 구성:
// 3개 그룹으로 분할:
// - A: f명
// - B: f명
// - C: f명
// - 총 n = 3f

// Case 1: C가 Byzantine, A+B 정직
// - A+B = 2f명 (quorum)
// - A+B는 합의 도달해야 함 (Safety)
// - 결정값: v1

// Case 2: A가 Byzantine, B+C 정직
// - B+C = 2f명 (quorum)
// - B+C는 합의 도달해야 함 (Safety)
// - 결정값: v2

// Case 3: B가 Byzantine, A+C 정직
// - A+C = 2f명 (quorum)
// - A+C는 합의 도달해야 함 (Safety)
// - 결정값: v3

// 핵심 관찰:
// B (정직) 관점에서:
//   Case 1: A+B 합의 → v1
//   Case 2: B+C 합의 → v2
// B는 A가 정직한지 C가 정직한지 구별 불가!
// (같은 메시지 패턴 관측 가능)
// → v1 = v2 강제됨 (같은 관측 → 같은 결정)

// C (정직) 관점에서:
//   Case 2: B+C 합의 → v2
//   Case 3: A+C 합의 → v3
// → v2 = v3

// A (정직) 관점에서:
//   Case 1: A+B 합의 → v1
//   Case 3: A+C 합의 → v3
// → v1 = v3

// 결과: v1 = v2 = v3 강제
// 하지만 초기 입력이 다르면 결정값 달라야 함
// Validity 위반! → 모순

// 결론: n = 3f에서는 P가 존재 불가
// 따라서 n >= 3f + 1 필요`}
        </pre>
        <p className="leading-7">
          증명 핵심: <strong>정직 노드는 Byzantine 식별 불가</strong>.<br />
          f명이 거짓말할 때 어느 그룹이 거짓인지 구별 못 함 → 서로 다른 입력에 같은 결정 강제.<br />
          이것이 quorum intersection이 필수인 이유.
        </p>

        {/* ── Quorum Intersection ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Quorum Intersection 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Quorum (정족수) 개념:
// - 결정을 내리기 위해 필요한 최소 투표자 수
// - BFT에서 Q = 2f+1 (n = 3f+1일 때)

// Quorum Intersection Property:
// 두 quorum Q1, Q2는 반드시 f+1명 이상 겹쳐야 함
// |Q1 ∩ Q2| >= f+1
// → 겹친 영역에 정직 노드 최소 1명 존재

// 수학 증명:
// |Q1 ∪ Q2| <= n
// |Q1| + |Q2| - |Q1 ∩ Q2| <= n
// |Q1 ∩ Q2| >= |Q1| + |Q2| - n
// = 2(2f+1) - (3f+1)
// = 4f + 2 - 3f - 1
// = f + 1

// 의미:
// Q1에서 값 v1 결정 → 2f+1 표
// Q2에서 값 v2 결정 → 2f+1 표
// 겹친 f+1명 중 정직 1명 이상
// 정직 노드는 모순된 값 표결 불가
// → v1 = v2 강제 (Safety)

// 왜 2f+1인가 (다시):
// Q = f + 1: 표결수 부족 (Byzantine f명이 Q 형성 가능)
// Q = 2f+1: 정직 quorum 형성 가능
//   - 총 정직 2f+1명 → 정직만으로 quorum
// Q = 2f+2: 너무 엄격, liveness 저해

// PBFT의 prepare 단계:
// - leader가 pre-prepare 보냄
// - replica가 2f+1 prepare 모으면 prepared
// - 두 다른 값이 동시에 prepared 불가
//   (quorum intersection 때문)

// Tendermint의 prevote quorum:
// - prevote 2f+1 모으면 polka
// - 두 다른 block이 polka 받을 수 없음
//   (lock mechanism으로 safety 보강)`}
        </pre>
        <p className="leading-7">
          <strong>Q = 2f+1 → 교차 f+1 → 정직 1명 이상 겹침</strong>.<br />
          정직 노드는 두 다른 값 표결 불가 → 두 quorum은 같은 값 결정.<br />
          이것이 모든 BFT safety의 수학적 기반.
        </p>

        {/* ── 다양한 threshold ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">다양한 모델에서 threshold</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 모델별 fault threshold:

// Crash Fault Tolerance (CFT):
// - f < n/2 (majority alive)
// - Raft, Paxos, Zookeeper
// - quorum = majority = floor(n/2) + 1
// - n=5, f=2, Q=3
// - crash만 다룸, Byzantine 불가

// Byzantine + Synchronous + Unauthenticated:
// - f < n/3 (Lamport 1980)
// - n >= 3f+1
// - PSL (Pease-Shostak-Lamport) 증명

// Byzantine + Synchronous + Authenticated:
// - f < n (signatures allow)
// - n >= f+2
// - Dolev-Strong 프로토콜: f+1 round

// Byzantine + Partial Sync + Authenticated:
// - f < n/3 (DLS 1988)
// - n >= 3f+1
// - PBFT, HotStuff, Tendermint
// - quorum intersection 이유

// Byzantine + Asynchronous + Randomized:
// - f < n/3
// - n >= 3f+1
// - Ben-Or, HoneyBadger BFT
// - coin-flip으로 FLP 우회

// Flexible Byzantine (Malkhi et al. 2019):
// - 클라이언트가 threshold 선택
// - conservative: f < n/3
// - optimistic: f < n/2
// - 동시 지원 가능

// Weighted / Stake-based BFT:
// - 노드 수가 아닌 stake 비율
// - f < 1/3 stake
// - n = 1000 validator인데 f = 333 가능
// - Tendermint, HotStuff 변형들

// 실무 선택:
// - 블록체인: partial sync + authenticated → 3f+1
// - 허가형: synchronous + authenticated → f+2
// - 금융 DB: CFT (Byzantine 고려 안 함)`}
        </pre>
        <p className="leading-7">
          모델에 따라 threshold 다름 — <strong>CFT n/2, BFT partial sync n/3, BFT sync+sig n/1</strong>.<br />
          블록체인은 partial sync + authenticated → n ≥ 3f+1 표준.<br />
          stake-weighted는 3f+1이 stake 비율로 전환.
        </p>

        {/* ── 왜 3f+1이 "tight"한가 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 3f+1이 "tight bound"인가</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Tight bound 의미:
// - 상한: 불가능 증명 (3f에서 불가)
// - 하한: 가능 증명 (3f+1 프로토콜 존재)
// → 둘이 일치 = tight

// Lower bound (불가능):
// n = 3f에서 BFT 불가능 (앞 증명)

// Upper bound (가능):
// PBFT가 n = 3f+1에서 동작 증명 (Castro-Liskov 1999)

// 의미:
// "f < n/3"은 BFT의 근본 한계
// 어떤 영리한 프로토콜도 이 바운드 못 뚫음
// (partial sync + authenticated 가정 하에)

// 실제 네트워크 크기 계산:
// - 1 validator crash 감내: n=4, f=1, Q=3
// - 5 crash: n=16, f=5, Q=11
// - 10 crash: n=31, f=10, Q=21
// - 33 crash: n=100, f=33, Q=67
// - 100 crash: n=301, f=100, Q=201

// 블록체인 실제 규모:
// Ethereum 2.0: 1,000,000+ validators
//   → f < 333,333 가능 (이론)
//   → committee sampling으로 축소 (128-512명)

// Cosmos Hub: ~180 validators
//   → f < 60 가능
//   → stake-weighted (상위 일부)

// Sui: ~100 validators
//   → f < 33 가능
//   → committee rotation

// Tight bound의 중요성:
// - 시스템 설계 한계 명확
// - 검증자 수 튜닝 근거
// - 공격 비용 계산 기반
// - 33%+ 지분 획득 = safety 위협`}
        </pre>
        <p className="leading-7">
          3f+1은 <strong>이론적 최적 (tight)</strong> — 더 줄일 방법 없음.<br />
          Partial sync + authenticated + Byzantine 모델의 절대 한계.<br />
          실무 validator 수 = (감내할 장애 수) × 3 + 1.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 33% 공격이 블록체인에서 위험한가</strong> — f &lt; n/3 한계.<br />
          Byzantine validators가 전체 1/3 이상 획득 시 quorum intersection 파괴.<br />
          이것이 PoS 체인에서 "34%+ stake 획득 = 체인 공격 가능"의 수학적 근거.
        </p>
      </div>
    </section>
  );
}
