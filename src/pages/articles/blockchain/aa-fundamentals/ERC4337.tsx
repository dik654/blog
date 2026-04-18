import ERC4337Viz from './viz/ERC4337Viz';

export default function ERC4337() {
  return (
    <section id="erc4337" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ERC-4337: UserOp, Bundler, EntryPoint</h2>
      <div className="not-prose mb-8"><ERC4337Viz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ERC-4337(Vitalik et al., 2021)은 프로토콜 변경 없이
          스마트 컨트랙트 지갑을 통한 AA를 구현합니다.<br />
          UserOperation이라는 의사 트랜잭션(pseudo-transaction)을
          Bundler가 수집하여 EntryPoint 컨트랙트에 제출합니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 p-4 bg-card">
            <h4 className="font-semibold text-sm mb-2">UserOperation</h4>
            <p className="text-sm text-muted-foreground"><code>sender</code> Smart Account 주소, <code>nonce</code> 리플레이 방지(2차원: key + sequence), <code>callData</code> 실행 함수 호출 데이터, <code>signature</code> 커스텀 서명(ECDSA, BLS, Passkey 등).</p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 p-4 bg-card">
            <h4 className="font-semibold text-sm mb-2">Bundler</h4>
            <p className="text-sm text-muted-foreground">UserOp를 수집하여 하나의 트랜잭션으로 번들링. <code>handleOps(UserOperation[])</code>를 EntryPoint에 제출. Bundler 자체는 EOA.</p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 p-4 bg-card">
            <h4 className="font-semibold text-sm mb-2">EntryPoint (싱글턴)</h4>
            <p className="text-sm text-muted-foreground"><code>validateUserOp()</code> → <code>validatePaymasterUserOp()</code> → <code>execute(callData)</code>. 검증과 실행을 분리하여 DoS 방지.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <h4 className="font-semibold text-sm mb-2">Paymaster</h4>
            <p className="text-sm text-muted-foreground">가스비를 대신 지불하는 컨트랙트. ERC-20 토큰, 구독 모델, 무료 체험 등 구현 가능.</p>
          </div>
        </div>
        <p className="leading-7">
          EntryPoint는 검증(validation)과 실행(execution)을 분리합니다.<br />
          검증 단계에서 실패하면 가스가 소비되지 않아 DoS를 방지합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ERC-4337 상세 플로우</h3>

        <h4 className="font-semibold mt-4 mb-3">1. UserOperation 구조 (off-chain)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {[
            ['sender', 'Smart Account 주소'],
            ['nonce', '리플레이 방지'],
            ['initCode', '첫 tx 시 팩토리 호출'],
            ['callData', '실행할 작업'],
            ['callGasLimit', '실행 가스'],
            ['verificationGasLimit', '검증 가스'],
            ['preVerificationGas', '번들러 보상'],
            ['maxFeePerGas', 'EIP-1559 스타일'],
            ['paymasterAndData', 'Paymaster 주소+데이터'],
            ['signature', '커스텀 서명'],
          ].map(([field, desc]) => (
            <div key={field} className="rounded-lg border p-2 bg-card text-sm">
              <code className="text-xs">{field}</code>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border p-3 bg-card text-sm mb-6">
          <p>해시: <code>keccak256(abi.encode(op)) + chainId + entryPoint</code> → 사용자 서명</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">2. Alt Mempool</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p>Bundler는 전용 P2P mempool에서 UserOp를 수집 (이더리움 기본 mempool 아님). libp2p 또는 커스텀 JSON-RPC로 전파.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">3. Bundler 시뮬레이션 (off-chain)</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2"><code>EntryPoint.simulateValidation(op)</code> — 계정 + Paymaster 검증, 가스 추정, 실패 시 revert.</p>
          <p className="text-muted-foreground">거부 조건: 시뮬레이션 실패, 검증 가스 초과, 스토리지 접근 규칙(ERC-7562) 위반.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">4. 배치 제출: <code>handleOps</code></h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">Phase 1: 검증</p>
            <p className="text-sm text-muted-foreground"><code>validateUserOp()</code> + <code>validatePaymasterUserOp()</code> 순회</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">Phase 2: 실행</p>
            <p className="text-sm text-muted-foreground"><code>account.execute(callData)</code> + <code>paymaster.postOp()</code></p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">Phase 3: 보상</p>
            <p className="text-sm text-muted-foreground">가스 보상을 beneficiary에게 전송</p>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">5. 스토리지 접근 규칙 (ERC-7562)</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2 font-semibold">검증 중 금지 사항:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>다른 계정 스토리지 접근</li>
            <li>화이트리스트 외 외부 컨트랙트 호출</li>
            <li><code>GAS</code>, <code>BLOCKHASH</code>, <code>TIMESTAMP</code> 옵코드 사용</li>
            <li>컨트랙트 생성</li>
          </ul>
          <p className="mt-2 text-muted-foreground">이유: 대량 revert를 통한 DoS 방지. Bundler가 메인넷 제출 전에 무효 op를 감지할 수 있어야 함.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">6. Aggregator (선택)</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2">BLS 서명 집계 — N개 서명을 1개로 병합하여 검증자 집합의 가스 대폭 절약.</p>
          <p className="text-muted-foreground"><code>IAggregator</code>: <code>validateSignatures()</code>, <code>aggregateSignatures()</code>, <code>validateUserOpSignature()</code></p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">7. Paymaster 유형</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">VerifyingPaymaster</p>
            <p className="text-sm text-muted-foreground">오프체인 서명 검증. Paymaster 운영자가 서명. Alchemy, Biconomy 등.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">TokenPaymaster</p>
            <p className="text-sm text-muted-foreground">ERC-20(USDC, DAI)로 가스 결제. 오라클로 환율 산정.</p>
          </div>
          <div className="rounded-xl border p-4 bg-card">
            <p className="font-semibold text-sm mb-1">SponsorPaymaster</p>
            <p className="text-sm text-muted-foreground">dApp이 사용자 가스 대납 (온보딩). 화이트리스트/조건 기반.</p>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">8. EntryPoint 싱글턴</h4>
        <div className="rounded-xl border p-4 bg-card text-sm mb-6">
          <p className="mb-2">모든 체인에 동일 주소로 배포:</p>
          <p className="text-xs text-muted-foreground mb-1">v0.6: <code>0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789</code></p>
          <p className="text-xs text-muted-foreground mb-2">v0.7: <code>0x0000000071727De22E5E9d8BAf0edAc6f37da032</code></p>
          <p className="text-muted-foreground">싱글턴 이유: 가스 효율(공유 검증), 일관된 UX, 중앙화된 DoS 방어.</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">9. 가스 비용 (메인넷)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border p-4 bg-card text-center">
            <p className="text-2xl font-bold">~200K</p>
            <p className="text-sm text-muted-foreground">첫 UserOp (지갑 배포)</p>
          </div>
          <div className="rounded-xl border p-4 bg-card text-center">
            <p className="text-2xl font-bold">~80K</p>
            <p className="text-sm text-muted-foreground">이후 UserOp</p>
          </div>
          <div className="rounded-xl border p-4 bg-card text-center">
            <p className="text-2xl font-bold">21K</p>
            <p className="text-sm text-muted-foreground">EOA 단순 전송</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">AA 오버헤드 4~10배. L2에서는 이 비용이 무시할 수준.</p>

        <h4 className="font-semibold mt-6 mb-3">10. 프로덕션 지갑</h4>
        <div className="flex flex-wrap gap-2">
          {['Safe{Wallet} Core', 'Coinbase Smart Wallet', 'Biconomy Smart Account', 'ZeroDev Kernel', 'Alchemy Light Account', 'Etherspot Skandha'].map(w => (
            <span key={w} className="rounded-full border px-3 py-1 text-sm bg-card">{w}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
