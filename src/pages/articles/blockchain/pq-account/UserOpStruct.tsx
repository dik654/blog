import UserOpViz from './viz/UserOpViz';

export default function UserOpStruct() {
  return (
    <section id="userop-struct" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">UserOperation 구조체</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ERC-4337의 <code>UserOperation</code>은 사용자의 의도를 담은 데이터 구조입니다.
          기존 트랜잭션과 달리, EOA의 서명 대신 스마트 계정이 자체적으로 서명을 검증합니다.
        </p>
        <h3>핵심 필드</h3>
        <ul>
          <li><code>sender</code> — 스마트 계정 주소 (EOA가 아님)</li>
          <li><code>nonce</code> — EntryPoint가 관리하는 재사용 방지 카운터</li>
          <li><code>callData</code> — 실행할 함수 호출 (ABI 인코딩)</li>
          <li><code>signature</code> — 하이브리드: ECDSA(65B) + Dilithium(2420B)</li>
        </ul>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — Dilithium 서명은 ECDSA보다 37배 크지만(2420B vs 65B),
          calldata 비용은 EIP-4844 이후 크게 줄었습니다. L2에서는 부담이 더 작습니다.
        </p>
      </div>
      <div className="mt-8"><UserOpViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">UserOperation 전체 구조</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>UserOperation</code> 필드 (PackedUserOperation)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div><code>sender</code>: <code>address</code> &mdash; smart account 주소</div>
              <div><code>nonce</code>: <code>uint256</code> &mdash; EntryPoint 관리</div>
              <div><code>initCode</code>: <code>bytes</code> &mdash; 최초 배포 시 factory + calldata</div>
              <div><code>callData</code>: <code>bytes</code> &mdash; 실행할 함수 호출</div>
              <div><code>callGasLimit</code>: <code>uint256</code> &mdash; callData 실행 가스 한도</div>
              <div><code>verificationGasLimit</code>: <code>uint256</code> &mdash; validateUserOp 가스 한도</div>
              <div><code>preVerificationGas</code>: <code>uint256</code> &mdash; calldata 비용</div>
              <div><code>maxFeePerGas</code>: <code>uint256</code> &mdash; EIP-1559 max fee</div>
              <div><code>maxPriorityFeePerGas</code>: <code>uint256</code> &mdash; EIP-1559 priority</div>
              <div><code>paymasterAndData</code>: <code>bytes</code> &mdash; gas 대납자 + 데이터</div>
              <div><code>signature</code>: <code>bytes</code> &mdash; custom (Dilithium for PQ)</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">UserOp Hash 계산 (signature 대상)</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><code>userOpHash</code> = <code>keccak256(abi.encode(sender, nonce, keccak256(initCode), keccak256(callData), ...))</code></li>
              <li>최종 signable hash = <code>keccak256(abi.encode(userOpHash, entrypoint, chainId))</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Signature 검증 흐름</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>Bundler가 UserOp 수집</li>
              <li><code>EntryPoint.handleOps()</code> 호출</li>
              <li>EntryPoint &rarr; <code>account.validateUserOp(userOp, hash)</code></li>
              <li>account: <code>verify(signature, hash, publicKey)</code></li>
              <li>통과 시 <code>callData</code> 실행</li>
            </ol>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Calldata Gas Cost</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">EVM Calldata 가격</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">zero byte</p><p className="font-mono">4 gas</p></div>
              <div><p className="text-muted-foreground">non-zero byte (EIP-2028)</p><p className="font-mono">16 gas</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-center mt-3">
              <div><p className="text-muted-foreground">ECDSA sig (65B)</p><p className="font-mono">~1,000 gas</p></div>
              <div><p className="text-muted-foreground">Dilithium sig (2,420B)</p><p className="font-mono">~35,000 gas (34x)</p></div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">완화 방법</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>EIP-4844 blobs</strong> &mdash; blob 데이터 ~1 gas/byte, L2 rollup 사용 시 혜택</li>
              <li><strong>L2 execution</strong> &mdash; L1 blob posting이 주요 비용, L2 execution은 거의 무료</li>
              <li><strong>Signature aggregation</strong> &mdash; 여러 UserOp signature를 합침 (BLS 같은 aggregable scheme)</li>
            </ol>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">L1 Native Cost</p>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><strong>ECDSA</strong> (~500B): ~8K calldata + 3K ecrecover = <strong>~11K gas</strong></p>
                <p><strong>Dilithium</strong> (~2.9KB): ~45K calldata + 2.5M verify = <strong>~2.55M gas</strong></p>
                <p className="text-red-400 font-semibold">232x more expensive!</p>
              </div>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">L2 (Optimism/Base)</p>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>L1 data: EIP-4844 blobs</p>
                <p>L2 execution: constant</p>
                <p>Dilithium: <strong>~80K gas</strong> (vs 30K ECDSA) = <strong>2.7x</strong></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
