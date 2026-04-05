import { codeRefs } from './codeRefs';
import GasDetailViz from './viz/GasDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function GasEstimation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="gas-estimation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가스 추정 & 선택</h2>
      <div className="not-prose mb-8">
        <GasDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} BaseFee 계산 차이</strong> — 이더리움은 블록 가스 50% 기준 조정
          <br />
          Filecoin은 블록 한도 대비 실제 사용률로 조정 + 메시지 바이트 크기 별도 부과
        </p>

        {/* ── Gas Model ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Filecoin Gas Model 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin Gas Model (EIP-1559 변형):

// 3가지 gas 구성요소:
// 1. GasLimit: max gas available
// 2. GasFeeCap: max total price willing to pay
// 3. GasPremium: priority fee (miner tip)

// Gas calculation:
// total_paid = gas_used × (base_fee + premium)
// where:
// - gas_used = actual consumption (<= gas_limit)
// - base_fee = network base (EIP-1559)
// - premium = min(gas_premium, gas_fee_cap - base_fee)

// Base Fee 조정:
// - each tipset: compare to TARGET_BLOCK_FILL
// - TARGET = 5 × BlockGasLimit (per block base)
// - if fill > target: base_fee 증가
// - if fill < target: base_fee 감소
// - max change: 12.5% per tipset

// Block Gas Limit:
// - 10,000,000,000 gas (10 GGas)
// - per block, not per tipset
// - tipset (5 blocks): 50 GGas possible

// Message size gas:
// - separate from execution gas
// - per-byte cost
// - encourages compact messages

// MpoolSelect algorithm:
// 1. Sort messages by (address, nonce)
// 2. For each address:
//    a. Take highest-premium message
//    b. Check dependencies (prev nonces included?)
//    c. Check gas budget remaining
// 3. Pack into block up to gas limit
// 4. Maximize fee revenue

// Gas estimation (MpoolGetGas):
// 1. Simulate execution
// 2. Measure actual gas
// 3. Return recommended values:
//    - GasUsed (actual)
//    - GasLimit (recommended with buffer)
//    - GasPremium (network average)
//    - GasFeeCap (premium + base_fee + buffer)

// Max fee:
// total_max = gas_limit × gas_fee_cap
// user pre-locks this amount
// refund unused after execution

// Performance optimization:
// - pre-compile common paths
// - cache gas estimates
// - batch gas simulation

// Ethereum vs Filecoin:
// Ethereum:
// - 2x block gas limit
// - target 50% full
// - simpler model
//
// Filecoin:
// - 5x expected_leaders target
// - message size gas separate
// - more complex but fairer`}
        </pre>
        <p className="leading-7">
          Gas: <strong>GasLimit + GasFeeCap + GasPremium (EIP-1559 variant)</strong>.<br />
          base_fee 조정: TARGET_BLOCK_FILL 기준, ±12.5%/tipset.<br />
          message size gas 별도, fair pricing.
        </p>
      </div>
    </section>
  );
}
