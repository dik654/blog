import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BuildJobDetailViz from './viz/BuildJobDetailViz';
import { BUILD_PHASES, BUILD_INSIGHTS } from './BuildJobData';
import type { CodeRef } from '@/components/code/types';

export default function BuildJob({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activePhase, setActivePhase] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="build-job" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BuildJob & TX 선택</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>build_payload()</code>는 실제로 블록을 조립하는 함수다.<br />
          TX 풀에서 <code>best_transactions_with_attributes(base_fee)</code>를 호출하여 effective_tip 기준 내림차순 이터레이터를 가져온다.<br />
          가스 한도 내에서 TX를 하나씩 실행하고 누적한다.
        </p>
        <p className="leading-7">
          TX 실행에 실패하면 <code>mark_invalid()</code>로 이터레이터에 알린다.<br />
          해당 TX와 같은 sender의 이후 nonce TX도 무효가 되므로 건너뛴다.<br />
          가스 한도를 초과하는 TX는 건너뛰되 즉시 종료하지 않는다.<br />
          남은 공간에 들어갈 수 있는 작은 TX가 있을 수 있기 때문이다.
        </p>
        <p className="leading-7">
          <strong>continuous building:</strong> PayloadBuilder는 비동기 태스크로 실행된다.<br />
          CL이 GetPayload를 호출할 때까지 TX 풀의 새 TX를 추가하여 <code>block_value</code>(수수료 합계)를 점진적으로 극대화한다.<br />
          CL은 이 값과 MEV 빌더의 블록 가치를 비교하여 더 수익 높은 블록을 선택한다.
        </p>

        {/* ── build_payload 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">build_payload() — TX 선택 & 실행 루프</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`async fn build_payload(
    client: &impl StateProvider,
    pool: &impl TransactionPool,
    attrs: &PayloadAttributes,
    parent: &Header,
) -> Result<BuiltPayload> {
    // 1. 블록 환경 설정
    let block_env = build_block_env(parent, attrs);
    let base_fee = block_env.basefee.to::<u64>();
    let gas_limit = parent.gas_limit;

    // 2. pre-execution 훅 (EIP-4788)
    let mut state = client.latest_state()?;
    apply_beacon_root_contract_call(
        attrs.parent_beacon_block_root,
        &mut state,
    )?;

    // 3. TX pool iterator (priority 순)
    let mut best_txs = pool.best_transactions_with_attributes(
        BestTransactionsAttributes::new(base_fee, None),
    );

    // 4. TX 순회 실행
    let mut cumulative_gas = 0u64;
    let mut txs = Vec::new();
    let mut block_value = U256::ZERO;

    while let Some(tx) = best_txs.next() {
        // gas_limit 확인
        if cumulative_gas + tx.gas_limit() > gas_limit {
            best_txs.mark_invalid(&tx);  // 너무 큼, 다른 TX 시도
            continue;
        }

        // revm으로 실행
        let evm_env = tx_env(tx.as_signed(), tx.sender());
        let result = execute_tx(&mut state, &block_env, &evm_env)?;

        match result {
            Ok(exec_result) => {
                cumulative_gas += exec_result.gas_used();
                block_value += exec_result.fee_paid();
                txs.push(tx);
            }
            Err(_) => {
                // 실행 실패 → sender의 후속 TX 전부 skip
                best_txs.mark_invalid(&tx);
            }
        }

        // 가스 90% 채우면 조기 종료 (최적화)
        if cumulative_gas > gas_limit * 9 / 10 { break; }
    }

    // 5. Withdrawals 처리 (Shanghai)
    apply_withdrawals(&mut state, &attrs.withdrawals)?;

    // 6. 블록 봉인 & 헤더 완성
    let header = build_header(parent, attrs, &txs, cumulative_gas, &state)?;
    let block = SealedBlock::new(header, txs, attrs.withdrawals.clone());

    Ok(BuiltPayload { block, block_value })
}`}
        </pre>
        <p className="leading-7">
          TX 선택 루프의 핵심: <strong>priority 순회 + mark_invalid</strong>.<br />
          실행 실패 시 같은 sender의 후속 nonce TX도 건너뜀 (nonce gap 방지).<br />
          gas 90% 채우면 조기 종료 — 남은 10%는 작은 TX에 여유.
        </p>

        {/* ── block_value 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">block_value — validator 수익 계산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// block_value = 모든 TX의 priority_fee 합계
// (base_fee는 소각되므로 제외)

fn calculate_block_value(
    txs: &[(TransactionSigned, ExecutionResult)],
    base_fee: u64,
) -> U256 {
    let mut total = U256::ZERO;

    for (tx, result) in txs {
        // effective_tip = min(max_priority_fee, max_fee - base_fee)
        let effective_tip = tx.effective_tip_per_gas(base_fee)
            .unwrap_or(0);
        let tip_paid = U256::from(effective_tip)
            * U256::from(result.gas_used());
        total += tip_paid;
    }

    total
}

// MEV-Boost 경쟁:
// self-build block_value: 예) 0.05 ETH (일반 TX 팁)
// MEV-Boost bid: 예) 0.15 ETH (arbitrage 번들 포함)
// → validator는 MEV-Boost 블록 선택

// block_value 극대화 전략:
// 1. 더 많은 TX 포함 (gas_limit 최대 활용)
// 2. 높은 priority_fee TX 우선 (CoinbaseTipOrdering)
// 3. MEV 번들 통합 (rbuilder)
// 4. continuous building (매 500ms 개선)

// Validator 연간 수익 추정 (메인넷):
// - 신규 발행: ~1 ETH/year per 32 ETH stake
// - TX priority_fee: ~0.5 ETH/year
// - MEV-Boost: ~1 ETH/year (활발한 시기)
// - 합계: ~2.5 ETH/year (~7.8% APR)`}
        </pre>
        <p className="leading-7">
          <code>block_value</code>가 <strong>validator 수익성의 직접 지표</strong>.<br />
          높은 priority_fee TX 많이 포함 → 더 높은 block_value.<br />
          MEV-Boost가 가장 큰 변수 — 번들 통합으로 수배 수익 증가 가능.
        </p>

        {/* ── Withdrawals 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Withdrawals — post-execution 단계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Shanghai 이후 withdrawals 처리
fn apply_withdrawals(
    state: &mut State,
    withdrawals: &Option<Vec<Withdrawal>>,
) -> Result<()> {
    if let Some(withdrawals) = withdrawals {
        for w in withdrawals {
            // 1. 수취 주소 계정 로드
            let mut account = state.account(&w.address)?
                .unwrap_or_default();

            // 2. 잔고 증가 (Gwei → Wei 변환)
            let amount_wei = U256::from(w.amount)
                * U256::from(10u64.pow(9));
            account.balance = account.balance.saturating_add(amount_wei);

            // 3. 상태 업데이트
            state.set_account(w.address, account);
        }
    }
    Ok(())
}

// Withdrawal 특성:
// - CL의 staking validator 인출
// - EOA도 컨트랙트도 가능한 주소
// - 인출량 = validator 잔고 감소량 (CL 쪽)
// - 블록 내 최대 16개 withdrawals
// - TX 아닌 state transition (gas 소모 없음)

// withdrawals_root 계산:
// - 16개 withdrawal의 머클 루트
// - 블록 헤더의 withdrawals_root 필드에 기록

// 경제적 효과:
// - 연간 ETH 공급 증가 속도 제어
// - validator의 유동성 확보 (full/partial withdrawal)
// - staking ratio 안정화`}
        </pre>
        <p className="leading-7">
          Withdrawals는 <strong>TX 아닌 특수 state transition</strong>.<br />
          gas 소모 없이 state만 변경 — CL의 validator 잔고를 EL로 이전.<br />
          블록당 16개 withdrawals로 validator 공평 순환 처리.
        </p>
      </div>

      <div className="not-prose mb-6"><BuildJobDetailViz /></div>

      {/* 빌드 단계 카드 */}
      <h3 className="text-lg font-semibold mb-3">빌드 단계</h3>
      <div className="space-y-2 mb-6">
        {BUILD_PHASES.map((p, i) => (
          <motion.div key={i} onClick={() => setActivePhase(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activePhase ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activePhase ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activePhase ? p.color : 'var(--muted)', color: i === activePhase ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-sm">{p.phase}</span>
                <p className="text-xs font-mono text-foreground/50">{p.action}</p>
              </div>
            </div>
            <AnimatePresence>
              {i === activePhase && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{p.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 구현 인사이트 Q&A */}
      <h3 className="text-lg font-semibold mb-3">구현 인사이트</h3>
      <div className="space-y-2 mb-6">
        {BUILD_INSIGHTS.map((q, i) => (
          <motion.div key={i} onClick={() => setFaq(faq === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${faq === i ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
            <p className="text-sm font-semibold">{q.question}</p>
            <AnimatePresence>
              {faq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('build-payload', codeRefs['build-payload'])} />
        <span className="text-[10px] text-muted-foreground self-center">build_payload()</span>
      </div>
    </section>
  );
}
