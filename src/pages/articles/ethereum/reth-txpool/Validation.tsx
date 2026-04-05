import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import ValidationDetailViz from './viz/ValidationDetailViz';
import { VALIDATION_STEPS, TRAIT_ADVANTAGES } from './ValidationData';
import type { CodeRef } from '@/components/code/types';

export default function Validation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TransactionValidator trait</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          TX가 풀에 추가되기 전, <code>TransactionValidator::validate()</code>가 6단계 검증을 수행한다.<br />
          잘못된 TX가 풀에 들어가면 블록 생성 시 실행 실패가 발생한다.<br />
          이 검증이 게이트키퍼 역할을 한다.
        </p>
        <p className="leading-7">
          검증 순서는 <strong>비용이 낮은 것부터</strong> 수행한다.<br />
          체인 ID 비교(O(1))가 가장 먼저, ecrecover(secp256k1 복구)가 두 번째다.<br />
          잔액과 nonce 검증은 상태 DB 조회가 필요하므로 나중에 한다.<br />
          한 단계라도 실패하면 즉시 거부한다.
        </p>
        <p className="leading-7">
          <strong>trait 기반의 확장성:</strong> Geth의 <code>validateTx()</code>는 모든 검증을 하나의 함수에 하드코딩한다.<br />
          Reth는 trait이므로 L2 체인이 추가 검증(예: L1 fee 확인, 시퀀서 우선권)을 구현체 교체로 추가할 수 있다.
        </p>

        {/* ── 6단계 검증 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">6단계 검증 — 비용 순서대로</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl TransactionValidator for EthTxValidator {
    async fn validate(&self, tx: &Tx) -> ValidationOutcome {
        // 1. Chain ID 검증 (O(1), ~수 ns)
        if let Some(tx_chain_id) = tx.chain_id() {
            if tx_chain_id != self.chain_id {
                return ValidationOutcome::Invalid(InvalidChainId);
            }
        }

        // 2. 크기 제한 (O(1), ~수 ns)
        if tx.size() > MAX_TX_INPUT_BYTES {
            return ValidationOutcome::Invalid(TxTooLarge);
        }

        // 3. 서명 검증 & sender 복구 (~50 μs)
        let sender = tx.recover_signer()
            .ok_or(InvalidSignature)?;

        // 4. Gas limit 검증 (O(1))
        if tx.gas_limit() > MAX_TX_GAS_LIMIT {
            return ValidationOutcome::Invalid(GasLimitTooHigh);
        }
        if tx.gas_limit() < intrinsic_gas(tx) {
            return ValidationOutcome::Invalid(GasLimitTooLow);
        }

        // 5. 잔고 검증 (DB 조회 ~수 μs)
        let account = self.state.account(&sender).await?
            .unwrap_or_default();
        let total_cost = tx.max_cost();  // gas_limit × max_fee + value
        if account.balance < total_cost {
            return ValidationOutcome::Invalid(InsufficientFunds);
        }

        // 6. Nonce 검증 (DB 조회 ~수 μs)
        if tx.nonce() < account.nonce {
            return ValidationOutcome::Invalid(NonceTooLow);
        }
        // nonce > account.nonce는 Queued 풀로 OK

        ValidationOutcome::Valid { sender, account }
    }
}

// 검증 비용 분석:
// - 1~4단계: 합쳐서 ~100 μs
// - 5~6단계: DB 조회 ~10 μs each
// - 총 ~120 μs per TX
// - 10K TX/s throughput 지원`}
        </pre>
        <p className="leading-7">
          검증 순서는 <strong>빠른 체크 먼저</strong> — 스팸 TX를 DB 조회 전에 조기 거부.<br />
          ecrecover가 가장 비싼 연산 (~50μs) → chain_id/size 체크 통과 후에만 수행.<br />
          잔고/nonce는 DB 조회 필요 → 서명 검증 통과 후에만 수행.
        </p>

        {/* ── L2 커스텀 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">L2 확장 — OpTxValidator 예시</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Optimism 체인의 커스텀 검증
pub struct OpTxValidator<V: TransactionValidator> {
    inner: V,  // 기본 Ethereum 검증 포함
    l1_block_info: Arc<L1BlockInfo>,
}

impl<V: TransactionValidator> TransactionValidator for OpTxValidator<V> {
    async fn validate(&self, tx: &Tx) -> ValidationOutcome {
        // 1. 기본 이더리움 검증 먼저 수행
        let outcome = self.inner.validate(tx).await;
        if outcome.is_invalid() { return outcome; }

        // 2. Optimism 추가 검증:

        // 2a. Deposit TX는 TX 풀에 추가 불가
        if tx.is_deposit() {
            return ValidationOutcome::Invalid(DepositsNotAllowedInPool);
        }

        // 2b. L1 fee 고려 (L2 → L1 데이터 posting 비용)
        let l1_fee = self.l1_block_info.calculate_l1_fee(tx);
        let total_cost = tx.max_cost() + l1_fee;
        if account.balance < total_cost {
            return ValidationOutcome::Invalid(InsufficientFundsWithL1Fee);
        }

        // 2c. 시퀀서 ordering 힌트 (private mempool)
        if tx.origin() == TransactionOrigin::Private {
            self.sequencer.enqueue_priority(tx);
        }

        ValidationOutcome::Valid { .. }
    }
}

// 구조적 이점:
// - 기본 Ethereum 로직 재사용 (self.inner.validate)
// - L2 고유 규칙만 override
// - Base, Scroll 등 다른 L2도 동일 패턴 적용 가능`}
        </pre>
        <p className="leading-7">
          OP Stack은 <code>OpTxValidator</code>가 <strong>Ethereum 검증 + L1 fee + deposit 규칙</strong> 추가.<br />
          기본 trait을 <code>inner</code>로 감싸서 위임 → 코드 중복 없이 확장.<br />
          새 L2 체인은 동일 패턴으로 자체 검증 주입 가능.
        </p>

        {/* ── async 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">async 검증 — 동시 처리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TX 수신 시 비동기 검증
pub async fn add_external_transactions(
    &self,
    txs: Vec<Tx>,
) -> Vec<Result<TxHash, PoolError>> {
    // 모든 TX 검증을 동시 실행 (tokio::join_all)
    let futures = txs.into_iter().map(|tx| async {
        let outcome = self.validator.validate(&tx).await;
        match outcome {
            ValidationOutcome::Valid { sender, account } => {
                self.add_to_subpool(tx, sender, account).await
            }
            ValidationOutcome::Invalid(err) => Err(PoolError::Validation(err)),
        }
    });

    futures::future::join_all(futures).await
}

// 동시 검증의 이점:
// - 네트워크에서 100 TX 한 번에 도착 시
// - 순차 검증: 100 × 120μs = 12ms
// - 동시 검증: max(120μs) + join 오버헤드 ≈ 150μs
// - ~80배 가속

// 주의사항:
// - state DB는 MVCC 스냅샷 덕분에 동시 읽기 안전
// - 서브풀 삽입은 HashMap mutex 필요 (직렬화 지점)
// - 실질 가속: ~10~20배 (삽입 직렬화 때문)`}
        </pre>
        <p className="leading-7">
          async 검증으로 <strong>TX 배치를 동시 처리</strong>.<br />
          네트워크 버스트(100 TX 한꺼번에)를 12ms → 150μs로 처리.<br />
          MVCC 스냅샷 덕분에 state 읽기는 lock 없이 동시 가능.
        </p>
      </div>

      <div className="not-prose mb-6"><ValidationDetailViz /></div>

      {/* 검증 단계 카드 */}
      <h3 className="text-lg font-semibold mb-3">6단계 검증 체인</h3>
      <div className="space-y-2 mb-6">
        {VALIDATION_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {s.order}
              </span>
              <div>
                <span className="font-semibold text-sm">{s.check}</span>
                <p className="text-xs font-mono text-red-400/70">{s.failReason}</p>
              </div>
            </div>
            <AnimatePresence>
              {i === activeStep && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* trait 장점 Q&A */}
      <h3 className="text-lg font-semibold mb-3">설계 판단</h3>
      <div className="space-y-2 mb-6">
        {TRAIT_ADVANTAGES.map((q, i) => (
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
        <CodeViewButton onClick={() => onCodeRef('tx-validator', codeRefs['tx-validator'])} />
        <span className="text-[10px] text-muted-foreground self-center">TransactionValidator trait</span>
      </div>
    </section>
  );
}
