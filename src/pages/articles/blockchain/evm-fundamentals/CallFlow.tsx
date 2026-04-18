import EVMArchViz from './viz/EVMArchViz';
import CallFlowViz from './viz/CallFlowViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CallFlow({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="call-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EVM 구조 & Call() 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p className="leading-7">
          EVM은 BlockContext(블록 정보)와 TxContext(트랜잭션 정보)를 내장
          <br />
          각 호출마다 ScopeContext(Memory, Stack)와 Contract를 새로 생성
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('evm-struct', codeRefs['evm-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">EVM struct</span>
        </div>
      </div>
      <div className="not-prose mb-8"><EVMArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4 mt-8">
        <h3 className="text-xl font-semibold mb-3">evm.Call() 상세 흐름</h3>
        <p className="leading-7">
          깊이 검증(1024) → 잔액 확인 → 스냅샷 → 값 전송 → 코드 실행 → 에러 시 롤백
        </p>
      </div>
      <div className="not-prose">
        <CallFlowViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Call Depth Limit</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Pre-EIP-150 문제</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>공격자가 재귀 호출로 스택 exhaust</li>
              <li>깊이 제한 없음 → DoS 가능</li>
              <li>The DAO Reentrancy와는 별개 문제</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">EIP-150 (2016)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Max call depth = <code className="text-xs">1024</code></li>
              <li>Gas 63/64 rule: 호출 시 남은 gas의 <code className="text-xs">1/64</code>는 caller에 유지</li>
              <li>결과: depth 제한 없어도 자연스럽게 bounded</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Gas 63/64 Rule 효과</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>depth 0: <code className="text-xs">2,000,000</code> gas</li>
              <li>depth 1: <code className="text-xs">2,000,000 * 63/64 = 1,968,750</code></li>
              <li>depth 2: <code className="text-xs">1,937,988</code></li>
              <li>depth 1024: <code className="text-xs">~0</code> (거의 exhaust)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">Re-entrancy와의 관계</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Depth limit ≠ re-entrancy 방지</li>
              <li>Re-entrancy = 상태 변경 순서 문제</li>
              <li>Depth limit = gas 소진 방어</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Snapshot 기반 Rollback</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4 sm:col-span-3">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">실행 중 Revert 처리 흐름</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><code className="text-xs">snapshot = stateDB.Snapshot()</code> → 실행 시도</p>
              <p><strong>REVERT</strong>: state 복구, gas는 소비됨 → <code className="text-xs">RevertToSnapshot(snapshot)</code> → <code className="text-xs">return (result, remaining_gas)</code></p>
              <p><strong>OutOfGas</strong>: state 전체 rollback + gas 전부 소진 → <code className="text-xs">RevertToSnapshot(snapshot)</code> → <code className="text-xs">return (ERROR, 0)</code></p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Snapshot 작동 방식</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>In-memory journal (변경 기록)</li>
              <li>Revert = journal 역순 실행</li>
              <li>Commit 시 journal discard</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">성능 고려</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Snapshot 생성: <code className="text-xs">O(1)</code></li>
              <li>Revert: <code className="text-xs">O(변경 수)</code></li>
              <li>Nested snapshots 가능 (call depth마다)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">사용 사례</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">SSTORE</code> 되돌리기</li>
              <li>Balance 복구</li>
              <li>Log 취소</li>
              <li>Refund 재계산</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
