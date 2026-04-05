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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl<EVM> BlockExecutor for EthBlockExecutor<EVM> {
    fn execute_and_verify_one(
        &mut self,
        block: &BlockWithSenders,
    ) -> Result<(), BlockExecutionError> {
        // 1. pre-execution 훅 — EIP-4788 (beacon root) 등
        self.apply_pre_execution_changes(block)?;

        // 2. 블록 내 모든 TX 순회 실행
        let mut cumulative_gas_used = 0;
        let mut receipts = Vec::with_capacity(block.body.transactions.len());

        for (tx, sender) in block.body.transactions.iter().zip(&block.senders) {
            // 2a. revm 환경 설정 (fill_tx_env)
            self.evm_config.fill_tx_env(
                &mut self.evm.tx_mut(),
                tx,
                *sender,
            );

            // 2b. revm으로 TX 실행
            let ResultAndState { result, state } = self.evm.transact()?;

            // 2c. 상태 변경을 BundleState에 누적
            self.state.commit(state);

            // 2d. 영수증 생성
            cumulative_gas_used += result.gas_used();
            receipts.push(Receipt {
                tx_type: tx.tx_type(),
                success: result.is_success(),
                cumulative_gas_used,
                logs: result.logs().to_vec(),
            });
        }

        // 3. post-execution 훅 — Shanghai withdrawals, Prague requests 등
        let requests = self.apply_post_execution_changes(block, &receipts)?;

        // 4. 블록 헤더와 실행 결과 대조 검증
        self.verify_block(block, cumulative_gas_used, &receipts, &requests)?;

        Ok(())
    }
}`}
        </pre>
        <p className="leading-7">
          <code>execute_and_verify_one</code>이 <strong>4단계 파이프라인</strong>.<br />
          1) pre-execution 훅 → 2) TX 순회 실행 → 3) post-execution 훅 → 4) 헤더 대조 검증.<br />
          각 TX 실행 후 <code>self.state.commit(state)</code>로 revm의 변경을 BundleState에 누적.
        </p>

        {/* ── verify_block ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">verify_block — 실행 결과 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`fn verify_block(
    &self,
    block: &BlockWithSenders,
    gas_used: u64,
    receipts: &[Receipt],
    requests: &[Request],
) -> Result<()> {
    // 1. gas_used 일치: 헤더의 gas_used == 실행 누적 gas
    if block.header.gas_used != gas_used {
        return Err(BlockExecutionError::GasUsedMismatch {
            expected: block.header.gas_used,
            actual: gas_used,
        });
    }

    // 2. receipts_root 일치: 영수증들의 머클 루트
    let receipts_root = calculate_receipt_root(receipts);
    if block.header.receipts_root != receipts_root {
        return Err(BlockExecutionError::ReceiptRootMismatch {
            expected: block.header.receipts_root,
            actual: receipts_root,
        });
    }

    // 3. logs_bloom 일치: 모든 로그 항목의 블룸 OR
    let logs_bloom = calculate_logs_bloom(receipts);
    if block.header.logs_bloom != logs_bloom {
        return Err(BlockExecutionError::LogsBloomMismatch { ... });
    }

    // 4. requests_root 일치 (EIP-7685, Prague 이후)
    let requests_root = calculate_request_root(requests);
    if block.header.requests_root != Some(requests_root) {
        return Err(BlockExecutionError::RequestsRootMismatch { ... });
    }

    Ok(())
}

// 이 4가지가 모두 통과해야 블록이 "올바르게 실행됨"
// 하나라도 불일치 → 합의 실패 → reorg 발생 또는 노드 정지`}
        </pre>
        <p className="leading-7">
          블록 실행 검증은 <strong>헤더의 머클 루트 4개와 실행 결과 대조</strong>.<br />
          gas_used, receipts_root, logs_bloom, requests_root가 모두 일치해야 합의 성공.<br />
          state_root는 MerkleStage에서 별도 검증 (비용이 크므로 분리).
        </p>

        {/* ── BundleState::commit 내부 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BundleState::commit — revm 결과 흡수</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// revm의 TX 실행 결과: HashMap<Address, AccountState>
// 이를 BundleState에 병합

impl BundleState {
    pub fn commit(&mut self, evm_state: EvmState) {
        for (address, account) in evm_state {
            match self.state.entry(address) {
                Entry::Occupied(mut existing) => {
                    // 이미 bundle에 있음 → 기존 상태 업데이트
                    // pre_state는 유지 (원본), post_state만 갱신
                    let bundle_acc = existing.get_mut();
                    bundle_acc.info = Some(account.info);
                    for (slot_key, slot_val) in account.storage {
                        bundle_acc.storage.insert(slot_key, slot_val);
                    }
                }
                Entry::Vacant(vacant) => {
                    // 처음 등장 → 새 BundleAccount 생성
                    vacant.insert(BundleAccount {
                        original_info: load_from_db(address),  // pre state
                        info: Some(account.info),               // post state
                        storage: account.storage,
                        status: AccountStatus::Changed,
                    });
                }
            }
        }
    }
}

// 누적 효과:
// - 블록 1에서 A.balance = 100 → bundle[A] = 100
// - 블록 2에서 A.balance = 150 → bundle[A] = 150 (덮어씀)
// - 최종 DB write 시 bundle[A] = 150만 기록 (100은 사라짐)
// → 100과 150 사이의 중간 값들은 DB에 불필요`}
        </pre>
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
