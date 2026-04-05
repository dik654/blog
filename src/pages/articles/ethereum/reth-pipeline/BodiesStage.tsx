import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BodiesDetailViz from './viz/BodiesDetailViz';
import { BODY_VERIFY_ITEMS } from './BodiesStageData';

export default function BodiesStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('tx_root 대조');

  return (
    <section id="bodies-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BodiesStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          HeadersStage가 저장한 헤더에는 <code>transactions_root</code>(TX 머클 루트)가 포함되어 있다.<br />
          BodiesStage는 피어에게 바디를 요청한 뒤, 이 tx_root를 기준으로 무결성을 검증한다.<br />
          악의적 피어가 위조된 TX를 보내더라도 머클 루트가 달라지므로 즉시 탐지된다.
        </p>

        {/* ── 바디 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockBody 구조 — 헤더와의 역할 분담</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct BlockBody {
    /// 트랜잭션 목록 — 블록 바디의 90% 이상을 차지
    /// Legacy/EIP-2930/EIP-1559/EIP-4844 4가지 타입 혼재
    pub transactions: Vec<TransactionSigned>,
    /// 삼촌 블록 헤더 (PoW 시절 유물, PoS 이후 항상 빈 Vec)
    pub ommers: Vec<Header>,
    /// Shanghai 이후 CL → EL 인출 목록
    pub withdrawals: Option<Vec<Withdrawal>>,
}

// 바디 크기: 블록마다 변동
// 평균 ≈ 80~150KB (1000TX 기준)
// 최대 ≈ 수 MB (blob TX 포함 시)

// 바디를 별도 다운로드하는 3가지 이유:
// 1. 대역폭 — 헤더만 있으면 체인 구조 파악 가능
// 2. 선택적 보관 — archive 노드만 모든 바디 유지, light 노드는 최근만
// 3. 병렬성 — 여러 블록의 바디를 동시에 여러 피어에게 요청`}
        </pre>
        <p className="leading-7">
          <code>ommers</code>는 PoS 이후 더 이상 사용되지 않지만, 헤더의 <code>ommers_hash</code>와의 호환성 때문에 필드는 유지된다.<br />
          머지(The Merge) 이후 <code>ommers_hash</code>는 빈 목록의 RLP 해시(상수 <code>EMPTY_OMMER_ROOT</code>)로 고정된다.<br />
          <code>withdrawals</code>는 Shanghai(2023-04) 포크에서 추가 — CL(beacon chain)의 validator 인출을 EL로 전달하는 메커니즘.
        </p>

        {/* ── 머클 루트 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tx_root 검증 — 왜 머클 트리인가</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BodiesStage execute() 내부
let tx_root = body.calculate_tx_root();
if tx_root != header.transactions_root {
    return Err(ConsensusError::BodyTransactionRootDiff);
}

// calculate_tx_root() 내부 — MPT(Merkle Patricia Trie) 구성
// Key: RLP(tx_index)      (0x80, 0x01, 0x02, ...)
// Val: encoded_tx (typed tx는 EIP-2718 prefix 포함)
fn calculate_tx_root(&self) -> B256 {
    let mut trie = HashBuilder::default();
    for (i, tx) in self.transactions.iter().enumerate() {
        let key = rlp::encode(i);
        let value = tx.envelope_encoded();
        trie.add_leaf(key, value);
    }
    trie.root()  // keccak256 기반 머클 루트
}`}
        </pre>
        <p className="leading-7">
          TX 목록을 단순 해시가 아닌 <strong>머클 패트리샤 트리</strong>로 구성한 이유:<br />
          1. <strong>부분 증명</strong> — "이 TX가 N번 블록에 포함되었다"를 머클 증명으로 보일 수 있음 (light client용)<br />
          2. <strong>eth_getTransactionByBlockHashAndIndex</strong> RPC가 인덱스 기반 조회를 요구<br />
          3. <strong>합의 프로토콜 호환성</strong> — 이더리움 황서(Yellow Paper)가 MPT 루트를 명시
        </p>

        {/* ── withdrawals_root ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">withdrawals_root & ommers_hash 병렬 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 바디는 3개의 머클 루트로 검증
// 1. transactions_root — TX 목록 머클 루트
let tx_root = body.calculate_tx_root();
if tx_root != header.transactions_root { return Err(...); }

// 2. ommers_hash — 삼촌 헤더 목록의 keccak256 해시 (MPT 아님)
let ommers_hash = keccak256(rlp::encode(&body.ommers));
if ommers_hash != header.ommers_hash { return Err(...); }

// 3. withdrawals_root — Shanghai 이후, withdrawals 목록 머클 루트
if let Some(withdrawals) = &body.withdrawals {
    let wd_root = calculate_withdrawals_root(withdrawals);
    if Some(wd_root) != header.withdrawals_root { return Err(...); }
}

// 3중 검증 통과 시 블록 바디는 "정답"으로 확정`}
        </pre>
        <p className="leading-7">
          3개의 독립 머클 루트로 바디를 쪼개어 검증하는 이유: <strong>부분 검증 가능성</strong>이다.<br />
          light client가 "이 블록에 특정 인출만 있었는지"를 확인하려면 withdrawals_root 경로만 받으면 된다.<br />
          전체 바디를 다운로드하지 않고 특정 부분만 증명 가능한 것이 Ethereum 머클 디자인의 핵심.
        </p>

        {/* ── 배치 삽입 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DB 삽입 — 4개 테이블 분산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`provider.insert_block_bodies(batch)?;
// ├─ BlockBodyIndices: BlockNumber → StoredBlockBodyIndices
// │                    (first_tx_num, tx_count) — TX 범위 인덱스
// ├─ Transactions: TxNumber → TransactionSigned
// │                순차 번호로 저장 (블록 경계 신경 쓰지 않음)
// ├─ TransactionHashNumbers: B256 → TxNumber
// │                          (RPC eth_getTransactionByHash용 역조회)
// └─ BlockWithdrawals: BlockNumber → Vec<Withdrawal>
//                      Shanghai 이후만 채워짐

// 핵심 설계: Transactions 테이블이 블록 번호 아닌 "글로벌 TX 번호"로 인덱싱
// 장점 1: 순차 스캔이 자연스러움 (TX 번호가 연속)
// 장점 2: BlockBodyIndices로 (first_tx, count)만 보면 블록→TX 역인덱싱`}
        </pre>
        <p className="leading-7">
          <code>Transactions</code> 테이블이 블록 번호가 아닌 <strong>글로벌 TX 번호</strong>로 인덱싱되는 것이 핵심 설계.<br />
          이더리움 역사 전체에 약 25억 개의 TX가 있으므로 TxNumber는 u64로 표현 가능.<br />
          SendersStage가 TX 범위를 순차 스캔할 때 블록 경계를 신경 쓰지 않아도 되는 이유가 여기에 있다.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 머클 루트 대조는 "무료 신뢰 획득"</p>
          <p className="mt-2">
            HeadersStage에서 이미 검증한 헤더의 tx_root는 이미 신뢰할 수 있는 값이다.<br />
            (부모-자식 해시 체인으로 연결되어 있고, 창세기부터의 해시 체인이 성립)<br />
            따라서 BodiesStage는 피어가 보낸 바디를 그대로 믿을 필요 없이, <strong>독립적으로 tx_root를 재계산</strong>해서 대조하면 끝이다.
          </p>
          <p className="mt-2">
            이 설계의 미덕:<br />
            1. <strong>악의적 피어 무력화</strong> — 위조 TX를 삽입하면 tx_root 불일치로 탐지<br />
            2. <strong>신뢰의 전이</strong> — 헤더 체인만 신뢰하면 바디도 자동으로 신뢰<br />
            3. <strong>증분 검증</strong> — 블록 단위로 개별 검증 가능, 전체 체인 재스캔 불필요
          </p>
        </div>
      </div>

      <div className="not-prose mb-6"><BodiesDetailViz /></div>

      {/* Verification items */}
      <h3 className="text-lg font-semibold mb-3">무결성 검증 항목</h3>
      <div className="not-prose space-y-2 mb-6">
        {BODY_VERIFY_ITEMS.map(v => {
          const isOpen = expanded === v.label;
          return (
            <div key={v.label} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : v.label)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <p className="font-semibold text-sm">{v.label}</p>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">{v.desc}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('bodies-stage', codeRefs['bodies-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">BodiesStage::execute()</span>
      </div>
    </section>
  );
}
