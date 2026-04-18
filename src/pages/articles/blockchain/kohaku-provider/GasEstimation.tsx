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
        <p className="text-sm text-muted-foreground mb-3">London hard fork (2021) — 새로운 수수료 모델</p>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4 border-l-4 border-gray-400">
              <p className="text-sm font-semibold mb-2">Old Model (pre-1559)</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><code>gasPrice</code>: 사용자가 직접 설정</li>
                <li>Bidding war, high variance</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4 border-l-4 border-blue-400">
              <p className="text-sm font-semibold mb-2">New Model (EIP-1559)</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><code>baseFeePerGas</code>: block마다 자동 조정</li>
                <li><code>maxFeePerGas</code>: 사용자 지불 의향</li>
                <li><code>maxPriorityFeePerGas</code>: validator tip</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Effective Gas Price 계산</p>
            <p className="text-sm text-muted-foreground"><code>effective = min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)</code></p>
            <p className="text-xs text-muted-foreground mt-1">baseFee → protocol burn (소각) / tip → validator에게</p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Base Fee 조정 메커니즘</p>
            <p className="text-xs text-muted-foreground mb-2">target = <code>block_gas_limit / 2</code> (예: 15M)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>실제 gas &gt; target → baseFee 증가 (최대 12.5%/block)</li>
              <li>실제 gas &lt; target → baseFee 감소</li>
              <li>Dynamic equilibrium 유지</li>
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Gas Estimation 전략</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1) 최신 블록 헤더에서 <code>base_fee_per_gas</code> 추출</li>
              <li>2) <code>fee_history(20, block, [25, 75])</code>로 최근 20블록 tip 분포 조회</li>
              <li>3) 25th percentile → slow tip, 75th percentile → fast tip</li>
              <li>4) <code>max_fee = base_fee * 2 + fast_tip</code> (2x safety margin)</li>
              <li>5) <code>max_priority = fast_tip</code></li>
            </ol>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Local eth_call Simulation</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>estimate_gas_local(tx: TxRequest)</code> — Helios + ProofDB 로컬 실행</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1) State proof 수집 — caller의 balance/nonce, target contract code, accessed storage slots</li>
              <li>2) <code>EVM::new(state).execute(&amp;tx)</code>로 로컬 EVM 실행</li>
              <li>3) <code>result.gas_used * 120 / 100</code> — +20% safety buffer 적용</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">장점</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>RPC 호출 최소화</li>
                <li>Private (no info leak)</li>
                <li>Offline possible (with cache)</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">도전</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>State access proofs 필요</li>
                <li>여러 storage slot 접근 시 복잡</li>
                <li>Block state 일관성</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Hybrid Approach</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-background px-2 py-1 rounded">Local simulation (default)</span>
              <span className="bg-background px-2 py-1 rounded">Fallback: RPC <code>eth_estimateGas</code> (complex calls)</span>
              <span className="bg-background px-2 py-1 rounded">정확도 검증용</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
