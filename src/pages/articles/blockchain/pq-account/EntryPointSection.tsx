import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import EntryPointViz from './viz/EntryPointViz';
import { codeRefs } from './codeRefs';

export default function EntryPointSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="entrypoint" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EntryPoint.handleOps() 내부 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>handleOps()</code>는 번들러가 수집한 UserOp 배열을 3단계로 처리합니다.
          검증과 실행을 분리하여, 하나의 실패가 전체 번들에 영향을 주지 않도록 설계되었습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('handle-ops', codeRefs['handle-ops'])} />
          <span className="text-[10px] text-muted-foreground self-center">handleOps() 전체</span>
          <CodeViewButton onClick={() => onCodeRef('validate-prepayment', codeRefs['validate-prepayment'])} />
          <span className="text-[10px] text-muted-foreground self-center">_validatePrepayment()</span>
        </div>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — 검증-실행 분리의 이유: Phase 1에서 모든 UserOp의 가스비를 선확보하므로,
          Phase 2 실행 중 가스 부족으로 번들러가 손해보는 것을 방지합니다.
        </p>
      </div>
      <div className="mt-8"><EntryPointViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">handleOps 3단계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// EntryPoint.handleOps(ops[], beneficiary)

// Phase 1: Validation (verification loop)
for each userOp in ops:
    // 1a) Deploy account if needed
    if userOp.initCode != "":
        deployAccount(userOp.sender, userOp.initCode)

    // 1b) Account.validateUserOp()
    //     - signature check
    //     - nonce check
    //     - prefund (missing balance 반환)
    validationData = account.validateUserOp(userOp, hash, missingFunds)

    // 1c) Paymaster.validatePaymasterUserOp() (if used)
    if userOp.paymasterAndData != "":
        paymaster.validate(...)

// Phase 2: Execution (execution loop)
for each userOp in ops:
    // 2a) Execute callData
    try account.execute(callData) {
        opSuccess = true
    } catch {
        opSuccess = false
        // state revert but gas refund X
    }

    // 2b) Paymaster postOp (if used)
    if paymaster:
        paymaster.postOp(opSuccess, actualGasCost)

// Phase 3: Reimbursement
// EntryPoint → beneficiary.transfer(total_gas * effective_price)

// 장점
// ✓ Fail-safe: 한 op 실패 다른 op 영향 X
// ✓ Bundler 보상 보장
// ✓ Paymaster 비용 통제`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Bundler 경제학</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Bundler 역할
// - Mempool에서 UserOp 수집
// - 유효성 simulate
// - 배치로 묶어 handleOps 제출
// - MEV 수익 획득 가능

// Simulation 중요성
// - Bundler는 invalid UserOp으로 혼자 gas 지불 위험
// - eth_estimateGas + eth_call로 미리 검증
// - Invalid op 제외

// Reputation system (EIP-4337)
// - 각 entity (sender, paymaster, factory)에 점수
// - DoS 공격 시도 → 점수 하락
// - 일정 점수 이하면 throttle/ban

// MEV opportunities
// - Ordering within bundle
// - Censorship (user 우선순위)
// - Arbitrage embedded
// - Sandwich attack (공식 비방)

// Known bundlers (2024)
// - Alchemy Rundler
// - Stackup
// - Biconomy
// - Pimlico
// - ZeroDev Ultra Relay

// Bundler revenue
// - transaction fees
// - MEV profits
// - Paymaster relationships`}</pre>

      </div>
    </section>
  );
}
