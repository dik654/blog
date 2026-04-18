import OpcodeFlowViz from './viz/OpcodeFlowViz';

export default function OpcodeCircuits() {
  return (
    <section id="opcode-circuits" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Opcode 처리 회로</h2>
      <div className="not-prose mb-8"><OpcodeFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bus-mapping의 <code>fn_gen_associated_ops</code>가 각 <code>OpcodeId</code>를
          적절한 처리 함수로 디스패칭합니다. 오퍼코드는 4가지 패턴으로 분류됩니다:
          <strong> 스택 전용</strong>(ADD, POP), <strong>메모리</strong>(MLOAD, MSTORE),
          <strong> 스토리지</strong>(SLOAD, SSTORE), <strong>CALL 계열</strong>(CALL, CREATE).
        </p>

        {/* Opcode 디스패칭 */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Opcode 디스패칭</h3>
        <div className="grid gap-3 not-prose mb-6">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 p-4">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">PUSH 계열 — 별도 처리</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>is_push_with_data()</code> 검사 후 <code>PushN::gen_associated_ops</code>로 분기.
              PUSH1~PUSH32는 바이트코드에서 즉시값을 읽어 스택에 푸시하는 공통 패턴.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">스택 연산 — StackPopOnlyOpcode</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>OpcodeId::ADD</code> → <code>ArithmeticOpcode::&lt;{'{'} OpcodeId::ADD {'}'}, 2&gt;::gen_associated_ops</code>.
              제네릭 파라미터로 오퍼코드 종류와 팝 개수를 지정.
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">스토리지 연산 — StateDB 접근</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>OpcodeId::SLOAD</code> → <code>Sload::gen_associated_ops</code>,
              <code>OpcodeId::SSTORE</code> → <code>Sstore::gen_associated_ops</code>.
              StateDB에서 스토리지 값 읽기/쓰기 후 RwTable에 기록.
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-4">
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">CALL/CREATE — 컨텍스트 전환</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>CallOpcode::&lt;7&gt;::gen_associated_ops</code> — 7은 CALL의 스택 인자 개수.
              새 call frame 생성, gas forwarding(63/64 rule), return data 처리 포함.
            </p>
          </div>
        </div>

        {/* 스택 전용 연산 */}
        <h3 className="text-lg font-semibold mt-6 mb-3">스택 전용 연산</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">StackPopOnlyOpcode 패턴</p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
            <code>StackPopOnlyOpcode&lt;N_POP, IS_ERR&gt;</code> — 가장 단순한 패턴.
            ADD, MUL, SUB, POP, JUMP 등이 이 패턴 사용.
          </p>
          <div className="grid gap-2">
            <div className="flex items-start gap-2 text-sm">
              <span className="shrink-0 text-sky-600 dark:text-sky-400 font-mono font-semibold">N_POP</span>
              <span className="text-neutral-600 dark:text-neutral-400">— 스택에서 팝할 값 개수 (제네릭 const)</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="shrink-0 text-sky-600 dark:text-sky-400 font-mono font-semibold">IS_ERR</span>
              <span className="text-neutral-600 dark:text-neutral-400">— 에러 처리 여부 (에러 시 revert 로직 실행)</span>
            </div>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">
            흐름: <code>new_step()</code> → <code>stack_pops(&mut exec_step, N_POP)</code> → 에러 체크 → <code>ExecStep</code> 반환.
          </p>
        </div>

        {/* 스토리지 연산 */}
        <h3 className="text-lg font-semibold mt-6 mb-3">스토리지 연산</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">SLOAD 구현 상세</p>
          <ol className="list-decimal list-inside text-sm space-y-2 text-neutral-700 dark:text-neutral-300">
            <li>
              <code>call_context_read()</code>로 <code>TxId</code>, <code>RwCounterEndOfReversion</code> 읽기
            </li>
            <li>
              <code>stack_pop()</code>으로 storage key 획득
            </li>
            <li>
              <code>sdb.get_storage(&contract_addr, &key)</code>로 StateDB에서 값 조회
            </li>
            <li>
              <code>StorageOp::new()</code>로 READ 연산 생성 → <code>push_op()</code>으로 RwTable에 기록
            </li>
            <li>
              <code>stack_push()</code>로 조회 결과를 스택에 푸시 + Access list(EIP-2929) 업데이트
            </li>
          </ol>
        </div>

        {/* 4가지 Opcode 패턴 상세 */}
        <h3 className="text-xl font-semibold mt-8 mb-3">4가지 Opcode 패턴 상세</h3>
        <div className="grid sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">Pattern 1: Stack-only</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">ADD, MUL, SUB, DIV, AND, OR, XOR ...</p>
            <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>입력: stack에서 pop / 출력: stack에 push</li>
              <li>메모리 · 스토리지 접근 없음</li>
              <li>회로 비용: ~100 rows per op</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">Pattern 2: Memory ops</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">MLOAD, MSTORE, MSTORE8</p>
            <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>Memory expansion 처리 (gas 계산)</li>
              <li>RwTable에 memory read/write 기록</li>
              <li>Copy circuit과 연동 / ~200 rows</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">Pattern 3: Storage ops</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">SLOAD, SSTORE</p>
            <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>MPT circuit으로 state root 변경</li>
              <li>Warm/cold access 구분 (EIP-2929)</li>
              <li>가장 비싼 opcode / ~500 rows</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">Pattern 4: Call/Create</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">CALL, DELEGATECALL, CREATE, CREATE2</p>
            <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>새 call frame 생성</li>
              <li>Gas forwarding (63/64 rule) + return data</li>
              <li>가장 복잡한 회로 / ~2000+ rows</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4 not-prose">
          <p className="text-sm font-semibold mb-2">성능 최적화 전략</p>
          <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>자주 쓰이는 opcode(PUSH, ADD, MLOAD) 회로 최적화 우선</li>
            <li>Rare opcode(SELFDESTRUCT) 간소화</li>
            <li>Lookup으로 common check(range, bytecode) 재사용</li>
          </ul>
        </div>

      </div>
    </section>
  );
}
