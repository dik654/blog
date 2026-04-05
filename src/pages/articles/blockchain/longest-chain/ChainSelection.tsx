import { motion } from 'framer-motion';

const C = { main: '#10b981', fork: '#f59e0b' };

function ChainSelectionViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">체인 선택: 가장 무거운 체인이 승리</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {/* Main chain */}
        {[0, 1, 2, 3, 4].map(i => (
          <motion.g key={`main-${i}`} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <rect x={10 + i * 78} y={10} width={65} height={26} rx={5}
              fill="var(--card)" stroke={C.main} strokeWidth={1} />
            <text x={42 + i * 78} y={27} textAnchor="middle"
              fontSize={10} fill={C.main}>#{i + 1}</text>
            {i < 4 && <line x1={75 + i * 78} y1={23} x2={88 + i * 78} y2={23}
              stroke={C.main} strokeWidth={1} />}
          </motion.g>
        ))}
        {/* Fork at block 2 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          <line x1={130} y1={36} x2={160} y2={55} stroke={C.fork} strokeWidth={1} />
          <rect x={160} y={50} width={65} height={26} rx={5}
            fill="var(--card)" stroke={C.fork} strokeWidth={1} strokeDasharray="3 2" />
          <text x={192} y={67} textAnchor="middle"
            fontSize={10} fill={C.fork}>#3'</text>
        </motion.g>
        <motion.text x={340} y={67} textAnchor="middle" fontSize={10}
          fill={C.fork} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}>
          포크는 고아가 됨
        </motion.text>
        <motion.text x={210} y={92} textAnchor="middle" fontSize={11}
          fill={C.main} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}>
          💡 PoW: 가장 많은 해시파워 / PoS: 가장 많은 검증자 지지
        </motion.text>
      </svg>
    </div>
  );
}

export default function ChainSelection() {
  return (
    <section id="chain-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체인 선택 규칙</h2>
      <ChainSelectionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Fork 발생 시 어느 체인을 "진짜"로 인정할지 결정하는 규칙.<br />
          Bitcoin은 <strong>누적 work</strong> 비교, Ethereum PoS는 <strong>LMD-GHOST</strong>.<br />
          정직 다수가 같은 규칙 따르면 자연 수렴.
        </p>

        {/* ── Bitcoin longest-chain ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bitcoin: Longest Chain = Heaviest Chain</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bitcoin fork choice (누적 work 기반):

// block의 work 계산:
// work(block) = 2^256 / (target + 1)
// higher difficulty = higher work

// chain work:
// chain_work(tip) = Σ work(block) for all blocks in chain

// Fork choice 규칙:
// best_chain = argmax(chain_work(tip))
// for all chain tips in local view

// 실제 코드 (bitcoin-core/src/validation.cpp):
// void CChainState::ActivateBestChain() {
//     CBlockIndex* pindexBestHeader = nullptr;
//     for (auto& pindex : m_block_index) {
//         if (pindex.IsValid(BLOCK_VALID_TRANSACTIONS) &&
//             (pindexBestHeader == nullptr ||
//              pindex.nChainWork > pindexBestHeader->nChainWork)) {
//             pindexBestHeader = &pindex;
//         }
//     }
//     ConnectTip(pindexBestHeader);
// }

// 왜 "chain length" 아닌 "chain work"?
// - 난이도 변동 (2016 block마다)
// - 같은 길이라도 work 다를 수 있음
// - 공격자가 낮은 난이도로 긴 체인 만들 수 없게

// Reorg (재구성):
// - 더 긴 체인 발견 시
// - 현재 tip → 공통 조상까지 rollback
// - 새 체인 tip까지 reapply
// - TX가 mempool로 돌아가기도 함

// 실제 reorg 깊이:
// - 1-block reorg: 일상적 (fork 해결)
// - 2-3 block: 드뭄
// - 6+ block: 재앙 (공격 시)`}
        </pre>
        <p className="leading-7">
          "longest" = <strong>가장 많은 누적 work</strong> (length 아님).<br />
          난이도 변동 때문에 work 합산 필요.<br />
          reorg는 1-block이 일상, 6+ block은 공격 의심.
        </p>

        {/* ── GHOST (Ethereum) ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Ethereum GHOST (Greedy Heaviest Observed Subtree)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GHOST (Sompolinsky-Zohar 2015)
// Ethereum (pre-merge) fork choice

// 문제:
// - 짧은 block time (15s)
// - 자연 fork 매우 많음 (5-10% uncle rate)
// - 단순 longest chain 부적합

// 해결:
// - uncle block (stale)도 work 포함
// - subtree work = main + uncles
// - heaviest subtree 선택

// 알고리즘:
// def GHOST(genesis):
//     cur = genesis
//     while cur has children:
//         child = argmax(subtree_work(c)) for c in cur.children
//         cur = child
//     return cur

// uncle 보상:
// - main block: full reward
// - uncle (1-block 뒤): 7/8 reward
// - uncle (2-block 뒤): 6/8 reward
// - ...
// - uncle (6+): 0 reward
// - uncle 참조하는 block: 1/32 reward

// Ethereum 2.0 (post-merge) LMD-GHOST:
// - Latest Message Driven GHOST
// - validator의 최신 attestation 기반
// - PoS 버전

// LMD 규칙:
// - 각 validator의 최신 vote만 카운트
// - 이전 vote는 무시 (slashing 가능성)
// - block weight = Σ(stake of voters)

// Fork choice with Casper FFG:
// - LMD-GHOST로 head 선택
// - but justified/finalized checkpoint 기반
// - finalized 넘어서는 revert 불가
// - 하이브리드 = longest chain + BFT finality`}
        </pre>
        <p className="leading-7">
          GHOST = <strong>subtree 전체 work 고려</strong> (uncle 포함).<br />
          짧은 blocktime의 fork 많음 문제 해결.<br />
          Ethereum 2.0 LMD-GHOST는 PoS 버전 — validator stake 기반.
        </p>

        {/* ── Weighted voting ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PoS에서의 Weighted Voting</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PoS fork choice의 가중치 (weight):

// PoW: weight = block의 hash difficulty
// PoS: weight = validator의 stake

// Ethereum 2.0 LMD-GHOST:
// def get_head(store):
//     head = justified_checkpoint.root
//     while True:
//         children = get_children(head)
//         if not children: return head
//         head = argmax(
//             (get_weight(c), c)  # (weight, tiebreak hash)
//             for c in children
//         )

// def get_weight(block):
//     weight = 0
//     for vote in latest_votes:
//         if vote.block_root in ancestors(block):
//             weight += vote.validator.effective_balance
//     return weight

// 특징:
// - 1 validator = 1 vote per slot (32 ETH)
// - epoch (32 slots)마다 한 번 attestation
// - 최신 vote만 카운트 (LMD)
// - stake-weighted (32 ETH 기준)

// Cardano Ouroboros:
// - slot leader = VRF로 stake 비례 선택
// - longest chain 규칙
// - Chain density 기반 (k-block 안정성)

// Solana Tower BFT:
// - PoH (Proof of History)로 시간 순서
// - lockout 기반 voting
// - stake-weighted

// 공통 패턴:
// 1. Sybil 저항 메커니즘 (PoW/PoS/VRF)
// 2. weighted fork choice
// 3. 정직 다수 가정 (51%+)
// 4. eventual consistency`}
        </pre>
        <p className="leading-7">
          PoS fork choice = <strong>stake-weighted</strong>.<br />
          1 validator = 1 vote per slot, 최신 vote만 카운트.<br />
          공통 패턴: Sybil 저항 + weighted voting + 정직 다수.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "block length" 대신 "chain work/weight"인가</strong> — 공격 저항.<br />
          단순 길이로 비교하면 공격자가 낮은 난이도로 긴 체인 만들어 하이재킹 가능.<br />
          work 기반이면 정직 multi-party가 경제적 우위 유지.
        </p>
      </div>
    </section>
  );
}
