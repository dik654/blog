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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Phase 1: Validation (verification loop)</p>
            <p className="text-xs text-muted-foreground mb-2"><code>EntryPoint.handleOps(ops[], beneficiary)</code></p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>1a) Deploy</strong> &mdash; <code>initCode != ""</code>이면 <code>deployAccount(sender, initCode)</code></li>
              <li><strong>1b) Validate</strong> &mdash; <code>account.validateUserOp(userOp, hash, missingFunds)</code>: signature check + nonce check + prefund</li>
              <li><strong>1c) Paymaster</strong> &mdash; <code>paymasterAndData != ""</code>이면 <code>paymaster.validate(...)</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Phase 2: Execution (execution loop)</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>2a) Execute</strong> &mdash; <code>account.execute(callData)</code> &rarr; 성공/실패 기록 (실패 시 state revert, gas refund 없음)</li>
              <li><strong>2b) PostOp</strong> &mdash; paymaster 사용 시 <code>paymaster.postOp(opSuccess, actualGasCost)</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Phase 3: Reimbursement</p>
            <p className="text-sm text-muted-foreground"><code>EntryPoint</code> &rarr; <code>beneficiary.transfer(total_gas * effective_price)</code></p>
          </div>
          <div className="rounded-lg border border-green-500/30 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">설계 장점</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Fail-safe</strong>: 한 op 실패해도 다른 op에 영향 없음</li>
              <li><strong>Bundler 보상 보장</strong>: Phase 1에서 예치금 선확보</li>
              <li><strong>Paymaster 비용 통제</strong>: postOp에서 정산</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Bundler 경제학</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Bundler 역할</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Mempool에서 UserOp 수집</li>
              <li><code>eth_estimateGas</code> + <code>eth_call</code>로 유효성 simulate</li>
              <li>배치로 묶어 <code>handleOps</code> 제출</li>
              <li>MEV 수익 획득 가능</li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Simulation 중요성</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Invalid UserOp &rarr; Bundler가 혼자 gas 지불 위험</li>
                <li>사전 검증으로 invalid op 제외</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Reputation System (EIP-4337)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>각 entity (sender, paymaster, factory)에 점수</li>
                <li>DoS 시도 &rarr; 점수 하락 &rarr; throttle/ban</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">MEV Opportunities</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Bundle 내 ordering</li>
                <li>Censorship (user 우선순위)</li>
                <li>Embedded arbitrage</li>
                <li>Sandwich attack (공식 비방)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Bundler Revenue</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Transaction fees</li>
                <li>MEV profits</li>
                <li>Paymaster relationships</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">Known Bundlers (2024)</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-sm text-center text-muted-foreground">
              <span>Alchemy Rundler</span>
              <span>Stackup</span>
              <span>Biconomy</span>
              <span>Pimlico</span>
              <span>ZeroDev Ultra Relay</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
