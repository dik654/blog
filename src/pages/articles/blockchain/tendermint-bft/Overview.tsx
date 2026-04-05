import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tendermint BFT 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Jae Kwon (2014) — <strong>PBFT를 블록체인에 최적화</strong>.<br />
          Propose → Prevote → Precommit → Commit 라운드 기반.<br />
          CometBFT로 발전, Cosmos 생태계 100+ 체인의 합의 엔진.
        </p>

        {/* ── Tendermint 등장 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Tendermint의 등장 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2014년 블록체인 BFT 부족:
//
// Bitcoin (2009): PoW, 10분 finality
// Ethereum (2015): PoW, 15초 block time
// 문제: 에너지 낭비, probabilistic finality
//
// BFT 요구:
// - instant finality 필요
// - permissioned 환경 가능
// - PoS 지원
//
// 기존 BFT 한계:
// - PBFT: client-centric, blockchain 부적합
// - Paxos: Byzantine 지원 안 함
// - 적절한 "blockchain BFT" 부재

// Tendermint 혁신 (Kwon 2014):
// 1. PBFT의 blockchain 버전
// 2. stake-weighted voting
// 3. continuous consensus (block 연속 생성)
// 4. ABCI로 application 분리
// 5. 단순화 (3-phase → round structure)

// 채택 역사:
// - 2014: Tendermint 프로토타입
// - 2016: Cosmos whitepaper
// - 2019: Cosmos Hub launch
// - 2021: Tendermint v0.34
// - 2023: CometBFT 리브랜딩 (Informal Systems)
// - 현재: 100+ 체인 사용

// Cosmos 생태계 예:
// - Cosmos Hub (ATOM)
// - Osmosis (OSMO)
// - dYdX v4 (derivatives)
// - Celestia (modular DA)
// - Injective (finance)
// - Juno (smart contracts)
// - Penumbra (privacy)

// Tendermint = Cosmos의 심장`}
        </pre>
        <p className="leading-7">
          Tendermint = <strong>blockchain 친화적 BFT</strong>.<br />
          PBFT의 client-centric 모델 → continuous consensus로 변환.<br />
          Cosmos SDK와 결합하여 100+ chain 구동.
        </p>

        {/* ── 핵심 컨셉 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Tendermint 핵심 컨셉</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Tendermint 핵심 컨셉:
//
// 1. Height (blockchain height)
//    - 각 height는 하나의 block 결정
//    - height H가 finalize → H+1 시작
//    - 독립적 consensus instance per height
//
// 2. Round (retry count)
//    - height 내에서 round 0, 1, 2, ...
//    - round 0 실패 시 round 1로 자동 진행
//    - timeout 기반 round advance
//
// 3. Proposer (round-robin)
//    - proposer(H, R) = validators[(H+R) % n]
//    - stake-weighted round robin (정확히는)
//    - deterministic, no election
//
// 4. Voting steps
//    - Propose: proposer가 block 제안
//    - Prevote: 2/3+ 동의 시 "polka"
//    - Precommit: 2/3+ precommit 시 commit
//    - 각 step마다 timeout 존재
//
// 5. Locking
//    - polka 보면 lock
//    - 다음 round에서도 lock된 block만 precommit
//    - 더 높은 round의 다른 polka 봐야 unlock
//
// 6. 2f+1 voting power
//    - stake-weighted
//    - n validator이지만 voting은 stake로
//    - 2f+1 = 2/3+ stake

// Validator 구성:
// - stake 기준 정렬
// - 상위 N개 active (e.g., 100)
// - 나머지는 대기 (bond/unbond 가능)

// voting_power = stake (ATOM)
// proposer 선택: round-robin weighted
// Borda-style scheduling (accum increment)`}
        </pre>
        <p className="leading-7">
          <strong>Height × Round × 4 steps</strong> 구조.<br />
          proposer는 deterministic round-robin — 선거 없음.<br />
          voting은 stake-weighted, 2/3+ 필요.
        </p>

        {/* ── PBFT vs Tendermint ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT vs Tendermint 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 주요 차이점:
//
// 1. Consensus instance:
//    PBFT: single consensus, sequence number 증가
//    Tendermint: per-height consensus, height 증가
//
// 2. View Change:
//    PBFT: explicit view change message
//    Tendermint: implicit (round++ on timeout)
//
// 3. Client interaction:
//    PBFT: client sends request, collects replies
//    Tendermint: no client, P2P gossip
//
// 4. Termination:
//    PBFT: 전체 service
//    Tendermint: per-height termination
//
// 5. Voting power:
//    PBFT: 1 node = 1 vote
//    Tendermint: stake-weighted
//
// 6. Proposer:
//    PBFT: (v mod n), view가 증가
//    Tendermint: ((H+R) mod n), deterministic
//
// 7. Block production:
//    PBFT: request 단위
//    Tendermint: block 단위 (여러 tx)
//
// 8. Complexity:
//    PBFT: 3-phase (pre-prepare, prepare, commit)
//    Tendermint: 4-step (propose, prevote, precommit, commit)
//    실제론 동등

// PBFT의 prepare ≈ Tendermint의 prevote
// PBFT의 commit ≈ Tendermint의 precommit
// PBFT의 execute ≈ Tendermint의 commit

// Tendermint가 왜 prevote/precommit이라 부르나:
// - "voting" 개념 강조
// - blockchain 친화적 용어
// - vote extensions 지원
//   (ABCI++: vote에 extra data)`}
        </pre>
        <p className="leading-7">
          본질은 PBFT와 동일 — <strong>이름과 구조만 재정비</strong>.<br />
          prepare → prevote, commit → precommit, execute → commit.<br />
          stake-weighted + height-based가 blockchain 친화적.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Tendermint가 Cosmos 생태계를 만들 수 있었나</strong> — ABCI의 힘.<br />
          Application Blockchain Interface로 합의 엔진과 앱 로직 분리.<br />
          앱 개발자는 BFT 구현 안 해도 됨 — state machine만 정의하면 Tendermint가 합의 제공.<br />
          이것이 "application-specific blockchain"의 시대를 엶.
        </p>
      </div>
    </section>
  );
}
