import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import ExecutorDetailViz from './viz/ExecutorDetailViz';
import { EXECUTOR_TRAITS } from './ExecutorData';
import type { CodeRef } from '@/components/code/types';

export default function Executor({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('BlockExecutor');

  return (
    <section id="executor" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlockExecutor trait</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          블록 실행은 세 개의 trait으로 추상화된다.<br />
          <code>BlockExecutor</code>가 단일 블록을 실행하고, <code>BatchExecutor</code>가 여러 블록을 누적 실행한다.<br />
          <code>BlockExecutorProvider</code>가 팩토리 역할로 실행기를 생성한다.
        </p>
        <p className="leading-7">
          <strong>핵심 설계: 배치 누적.</strong> Geth는 블록마다 <code>stateDB.Commit()</code>을 호출한다.<br />
          이 호출은 트라이 노드를 디스크에 기록하므로 I/O가 발생한다.<br />
          Reth의 BatchExecutor는 <code>finalize()</code>를 호출할 때까지 상태 변경을 BundleState에 누적한다.<br />
          10,000블록을 처리해도 DB 쓰기는 한 번이다.
        </p>
        <p className="leading-7">
          <code>finalize()</code>는 <code>self</code>를 소비(move)한다.<br />
          Rust 소유권 시스템 덕분에 finalize() 호출 후 실행기를 재사용할 수 없다.<br />
          "한 번만 호출 가능"이라는 제약을 컴파일 타임에 보장하는 설계다.
        </p>

        {/* ── execute_and_verify_one 내부 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">execute_and_verify_one() — 블록 1개 실행 파이프라인</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-indigo-500 mb-3">EthBlockExecutor::execute_and_verify_one() — 4단계 파이프라인</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-foreground/70"><code>apply_pre_execution_changes(block)</code> — EIP-4788 beacon root 등 pre-execution 훅</span>
            </div>
            <div className="rounded border border-border/40 p-3 ml-7">
              <p className="text-xs font-semibold text-foreground/60 mb-1.5">2. TX 순회 실행 (각 TX마다)</p>
              <div className="space-y-1 text-xs text-foreground/60">
                <p>a. <code>evm_config.fill_tx_env(tx, sender)</code> — revm 환경 설정</p>
                <p>b. <code>evm.transact()</code> &rarr; <code>ResultAndState {'{'} result, state {'}'}</code></p>
                <p>c. <code>self.state.commit(state)</code> — BundleState에 누적</p>
                <p>d. Receipt 생성 (tx_type, success, cumulative_gas_used, logs)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-foreground/70"><code>apply_post_execution_changes(block, receipts)</code> — withdrawals, requests 등</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
              <span className="text-foreground/70"><code>verify_block(block, gas_used, receipts, requests)</code> — 헤더 대조 검증</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>execute_and_verify_one</code>이 <strong>4단계 파이프라인</strong>.<br />
          1) pre-execution 훅 → 2) TX 순회 실행 → 3) post-execution 훅 → 4) 헤더 대조 검증.<br />
          각 TX 실행 후 <code>self.state.commit(state)</code>로 revm의 변경을 BundleState에 누적.
        </p>

        {/* ── verify_block ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">verify_block — 실행 결과 검증</h3>
        <div className="not-prose my-4 rounded-lg border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold text-pink-500 mb-3">verify_block() — 헤더의 머클 루트 4개와 실행 결과 대조</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-foreground/70"><code>gas_used</code> 일치: 헤더의 gas_used == 실행 누적 gas</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-foreground/70"><code>receipts_root</code> 일치: <code>calculate_receipt_root(receipts)</code>와 헤더 대조</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-foreground/70"><code>logs_bloom</code> 일치: 모든 로그 항목의 블룸 OR</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
              <span className="text-foreground/70"><code>requests_root</code> 일치 (EIP-7685, Prague 이후)</span>
            </div>
          </div>
          <p className="text-xs text-foreground/50 mt-3">4가지 모두 통과해야 "올바르게 실행됨". 하나라도 불일치 &rarr; 합의 실패 &rarr; reorg 또는 노드 정지</p>
        </div>
        <p className="leading-7">
          블록 실행 검증은 <strong>헤더의 머클 루트 4개와 실행 결과 대조</strong>.<br />
          gas_used, receipts_root, logs_bloom, requests_root가 모두 일치해야 합의 성공.<br />
          state_root는 MerkleStage에서 별도 검증 (비용이 크므로 분리).
        </p>

        {/* ── BundleState::commit 내부 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BundleState::commit — revm 결과 흡수</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">BundleState::commit(evm_state) — revm 결과 흡수</p>
            <div className="space-y-2 text-sm text-foreground/70">
              <div className="rounded border border-border/40 p-2.5">
                <p className="text-xs font-semibold text-foreground/60 mb-1">Occupied (이미 bundle에 존재)</p>
                <p className="text-xs text-foreground/50">pre_state 유지 (원본), post_state만 갱신 &rarr; 스토리지 슬롯도 덮어쓰기</p>
              </div>
              <div className="rounded border border-border/40 p-2.5">
                <p className="text-xs font-semibold text-foreground/60 mb-1">Vacant (처음 등장)</p>
                <p className="text-xs text-foreground/50">DB에서 <code>original_info</code>(pre state) 로드 + 새 <code>BundleAccount</code> 생성</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-400/40 bg-amber-50/50 dark:bg-amber-950/20 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5">누적 효과</p>
            <div className="text-xs text-foreground/60 space-y-0.5">
              <p>블록 1: A.balance = 100 &rarr; bundle[A] = 100</p>
              <p>블록 2: A.balance = 150 &rarr; bundle[A] = 150 (덮어씀)</p>
              <p>최종 DB write 시 150만 기록 -- 중간값은 DB에 불필요</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>commit</code>이 <strong>누적 병합</strong>을 수행 — 같은 계정의 여러 블록 변경을 최종값으로 수렴.<br />
          초기 동기화 시 100만 블록 실행 시 중간 상태는 DB에 쓰지 않음 → 쓰기량 극적 감소.<br />
          <code>original_info</code>는 reorg 시 롤백용 pre-state 보존.
        </p>
      </div>

      <div className="not-prose mb-6"><ExecutorDetailViz /></div>

      {/* Trait accordion */}
      <h3 className="text-lg font-semibold mb-3">실행 trait 계층</h3>
      <div className="not-prose space-y-2 mb-6">
        {EXECUTOR_TRAITS.map(t => {
          const isOpen = expanded === t.trait_name;
          return (
            <div key={t.trait_name} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : t.trait_name)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-mono font-semibold text-sm">{t.trait_name}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{t.purpose}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-xs font-mono text-indigo-500 mb-1">{t.key_method}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{t.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('block-executor', codeRefs['block-executor'])} />
        <span className="text-[10px] text-muted-foreground self-center">BlockExecutor & BatchExecutor</span>
      </div>
    </section>
  );
}
