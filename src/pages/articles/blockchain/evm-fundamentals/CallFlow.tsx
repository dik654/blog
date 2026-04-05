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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// EIP-150: 호출 깊이 1024로 제한
// 왜? stack overflow attack 방지

// 원래 (pre-EIP-150)
// - 공격자가 재귀 호출로 스택 exhaust
// - "The DAO Reentrancy는 다른 문제"
// - 깊이 제한 없음 → DoS 가능

// EIP-150 (2016)
// - Max call depth = 1024
// - Gas 63/64 rule: 호출 시 남은 gas의 1/64는 caller에 유지
// - 1024^gas_factor = exhaust 불가능

// Gas 63/64 rule 효과
// depth 0: 2_000_000 gas
// depth 1: 2_000_000 * 63/64 = 1_968_750
// depth 2: 1_937_988
// ...
// depth 1024: ~0 (거의 exhaust)

// 결과: depth 제한 없어도 자연스럽게 bounded
// 하지만 explicit 제한이 명확성 증가

// Re-entrancy와 관계
// Depth limit ≠ re-entrancy 방지
// Re-entrancy는 상태 변경 순서 문제
// Depth limit은 gas 소진 방어`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Snapshot 기반 Rollback</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 실행 중 revert 처리

function Call(...) {
    snapshot = stateDB.Snapshot();

    try {
        // 실행 시도
        result = runInterpreter(...);

        if result == REVERT {
            // state 복구 (but gas는 소비됨)
            stateDB.RevertToSnapshot(snapshot);
            return (result, remaining_gas);
        }
    } catch (OutOfGas e) {
        // OOG: state 전체 rollback + gas 전부 소진
        stateDB.RevertToSnapshot(snapshot);
        return (ERROR, 0);
    }
}

// Snapshot 작동 방식
// - In-memory journal (변경 기록)
// - Revert = journal 역순 실행
// - Commit 시 journal discard

// 성능 고려
// - Snapshot 생성 O(1)
// - Revert O(변경 수)
// - Nested snapshots 가능 (call depth마다)

// 사용 사례
// - SSTORE 되돌리기
// - Balance 복구
// - Log 취소
// - Refund 재계산`}</pre>

      </div>
    </section>
  );
}
