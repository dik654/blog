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
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">BlockBody 구조체 <span className="font-normal text-foreground/50">(평균 80~150KB, blob TX 포함 시 수 MB)</span></p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">transactions</code>
                <span className="text-foreground/70"><code>Vec&lt;TransactionSigned&gt;</code> — Legacy/EIP-2930/EIP-1559/EIP-4844 4가지 타입 혼재, 바디의 90% 이상</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">ommers</code>
                <span className="text-foreground/70"><code>Vec&lt;Header&gt;</code> — 삼촌 블록 헤더 (PoS 이후 항상 빈 Vec)</span>
              </div>
              <div className="flex items-start gap-2">
                <code className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded">withdrawals</code>
                <span className="text-foreground/70"><code>Option&lt;Vec&lt;Withdrawal&gt;&gt;</code> — Shanghai 이후 CL &rarr; EL 인출 목록</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/20 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5">바디를 별도 다운로드하는 3가지 이유</p>
            <div className="space-y-1 text-xs text-foreground/60">
              <p>1. <strong>대역폭</strong> — 헤더만으로 체인 구조 파악 가능</p>
              <p>2. <strong>선택적 보관</strong> — archive 노드만 모든 바디 유지, light 노드는 최근만</p>
              <p>3. <strong>병렬성</strong> — 여러 블록의 바디를 동시에 여러 피어에게 요청</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>ommers</code>는 PoS 이후 더 이상 사용되지 않지만, 헤더의 <code>ommers_hash</code>와의 호환성 때문에 필드는 유지된다.<br />
          머지(The Merge) 이후 <code>ommers_hash</code>는 빈 목록의 RLP 해시(상수 <code>EMPTY_OMMER_ROOT</code>)로 고정된다.<br />
          <code>withdrawals</code>는 Shanghai(2023-04) 포크에서 추가 — CL(beacon chain)의 validator 인출을 EL로 전달하는 메커니즘.
        </p>

        {/* ── 머클 루트 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">tx_root 검증 — 왜 머클 트리인가</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-pink-500 mb-2">tx_root 검증 흐름</p>
          <div className="space-y-2 text-sm text-foreground/70">
            <p>1. <code>body.calculate_tx_root()</code> 호출 &rarr; <code>header.transactions_root</code>와 대조</p>
            <p>2. 불일치 시 <code>ConsensusError::BodyTransactionRootDiff</code> 반환</p>
          </div>
          <div className="mt-3 pt-2 border-t border-border/30">
            <p className="text-xs font-semibold text-foreground/60 mb-1.5">calculate_tx_root() 내부 -- MPT 구성</p>
            <div className="space-y-1 text-xs text-foreground/60">
              <p>Key: <code>RLP(tx_index)</code> (0x80, 0x01, 0x02, ...)</p>
              <p>Val: <code>tx.envelope_encoded()</code> (typed tx는 EIP-2718 prefix 포함)</p>
              <p>각 리프를 <code>HashBuilder</code>에 추가 &rarr; <code>trie.root()</code>로 keccak256 머클 루트 반환</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          TX 목록을 단순 해시가 아닌 <strong>머클 패트리샤 트리</strong>로 구성한 이유:<br />
          1. <strong>부분 증명</strong> — "이 TX가 N번 블록에 포함되었다"를 머클 증명으로 보일 수 있음 (light client용)<br />
          2. <strong>eth_getTransactionByBlockHashAndIndex</strong> RPC가 인덱스 기반 조회를 요구<br />
          3. <strong>합의 프로토콜 호환성</strong> — 이더리움 황서(Yellow Paper)가 MPT 루트를 명시
        </p>

        {/* ── withdrawals_root ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">withdrawals_root & ommers_hash 병렬 검증</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-pink-500 mb-3">바디 3중 머클 루트 검증</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-foreground/70"><code>transactions_root</code> — TX 목록의 MPT 머클 루트</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-foreground/70"><code>ommers_hash</code> — 삼촌 헤더 목록의 <code>keccak256(rlp::encode)</code> (MPT 아님)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-foreground/70"><code>withdrawals_root</code> — Shanghai 이후, withdrawals 목록 머클 루트</span>
            </div>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-semibold">3중 검증 통과 시 블록 바디는 "정답"으로 확정</p>
        </div>
        <p className="leading-7">
          3개의 독립 머클 루트로 바디를 쪼개어 검증하는 이유: <strong>부분 검증 가능성</strong>이다.<br />
          light client가 "이 블록에 특정 인출만 있었는지"를 확인하려면 withdrawals_root 경로만 받으면 된다.<br />
          전체 바디를 다운로드하지 않고 특정 부분만 증명 가능한 것이 Ethereum 머클 디자인의 핵심.
        </p>

        {/* ── 배치 삽입 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DB 삽입 — 4개 테이블 분산</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">DB 삽입 — <code>provider.insert_block_bodies(batch)</code></p>
          <div className="space-y-1.5 text-sm text-foreground/70 ml-2">
            <p><code>BlockBodyIndices</code>: <code>BlockNumber &rarr; StoredBlockBodyIndices</code> (first_tx_num, tx_count)</p>
            <p><code>Transactions</code>: <code>TxNumber &rarr; TransactionSigned</code> -- 글로벌 순차 번호</p>
            <p><code>TransactionHashNumbers</code>: <code>B256 &rarr; TxNumber</code> -- RPC eth_getTransactionByHash 역조회</p>
            <p><code>BlockWithdrawals</code>: <code>BlockNumber &rarr; Vec&lt;Withdrawal&gt;</code> -- Shanghai 이후만</p>
          </div>
          <div className="mt-3 pt-2 border-t border-border/30 text-xs text-foreground/50">
            <p>핵심: Transactions 테이블이 블록 번호가 아닌 "글로벌 TX 번호"로 인덱싱 &rarr; 순차 스캔 자연스럽고 BlockBodyIndices로 블록&rarr;TX 역인덱싱</p>
          </div>
        </div>
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
