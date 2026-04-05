import type { CodeRef } from '@/components/code/types';
import GasEstimationViz from './viz/GasEstimationViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function GasEstimation({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="gas-estimation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가스 추정 (경량 클라이언트 기반)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>base_fee</code>는 블록 헤더에 포함된 값이다.
          <br />
          Helios가 헤더를 Merkle 증명으로 검증하므로 위조 불가.
        </p>
        <p className="leading-7">
          <code>feeHistory</code>로 최근 블록의 우선순위 수수료 분포를 조회한다.
          <br />
          25/75 퍼센타일로 네트워크 혼잡도를 반영한 적정값을 산출한다.
        </p>
        <p className="leading-7">
          <code>eth_call</code>을 ProofDB 기반으로 로컬 실행해서 gas_used를 측정한다.
          <br />
          20% 버퍼를 더해 gas_limit을 설정한다. 풀 노드 없이도 정확한 추정이 가능하다.
        </p>
      </div>
      <div className="not-prose"><GasEstimationViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-1559 Gas Pricing</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// EIP-1559 (London hard fork, 2021)
// 새로운 수수료 모델

// Old model (pre-1559)
// gasPrice: 사용자가 직접 설정
// → Bidding war, high variance

// New model (EIP-1559)
// baseFeePerGas: block마다 자동 조정
// maxFeePerGas: 사용자가 지불 의향
// maxPriorityFeePerGas: miner에게 tip

// Effective gas price
// effective = min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)

// baseFee는 protocol이 burn (소각)
// tip은 validator/miner에게

// Base fee 조정 메커니즘
// target_gas_used = block_gas_limit / 2 (예: 15M)
// - block 실제 gas > target → baseFee 증가 (up to 12.5%/block)
// - block 실제 gas < target → baseFee 감소
// - Dynamic equilibrium

// Gas estimation 전략
function estimate_gas_price(): (u64, u64) {
    // Get latest block
    let block = provider.get_block_number();
    let header = provider.get_block_by_number(block);
    let base_fee = header.base_fee_per_gas;

    // Fee history (last 20 blocks)
    let history = provider.fee_history(20, block, [25, 75]);

    // 25th percentile tip (slow)
    let slow_tip = history.reward[.][0].median();

    // 75th percentile tip (fast)
    let fast_tip = history.reward[.][1].median();

    // Suggested
    (
        max_fee: base_fee * 2 + fast_tip,  // 2x for safety margin
        max_priority: fast_tip
    )
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Local eth_call Simulation</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Helios + ProofDB로 local 실행

async fn estimate_gas_local(tx: TxRequest) -> Result<u64> {
    // 1) Fetch state proofs needed
    // - Caller's balance/nonce
    // - Target contract code
    // - Accessed storage slots

    let state = build_execution_state(&tx).await?;

    // 2) Run EVM locally
    let mut evm = EVM::new(state);
    let result = evm.execute(&tx)?;

    // 3) Return gas used with safety buffer
    Ok(result.gas_used * 120 / 100)  // +20%
}

// 장점
// ✓ RPC 호출 최소화
// ✓ Private (no info leak)
// ✓ Offline possible (with cache)

// 도전
// - State access proofs 필요
// - 여러 storage slot 접근 시 복잡
// - Block state 일관성

// Hybrid approach
// - Local simulation (default)
// - Fallback to RPC eth_estimateGas (complex calls)
// - 정확도 검증용`}</pre>

      </div>
    </section>
  );
}
