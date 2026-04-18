import WitnessPipelineViz from './viz/WitnessPipelineViz';

export default function WitnessSystem() {
  return (
    <section id="witness-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Witness 시스템</h2>
      <div className="not-prose mb-8"><WitnessPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Witness(증인 데이터)는 회로에 입력되는 <strong>비공개 실제 값</strong>입니다.<br />
          EVM 실행의 모든 상태와 연산을 검증 가능한 형태로 변환합니다.<br />
          Geth 트레이스 수집 → Bus-Mapping 변환 → Block 생성 → 회로 할당의 4단계를 거칩니다.
        </p>

        {/* Witness 생성 파이프라인 */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Witness 생성 파이프라인</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">4단계 파이프라인</p>
          <div className="grid gap-2">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">1단계: Geth 트레이스 수집</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>GethExecTrace</code> — <code>gas</code>, <code>failed</code>, <code>return_value</code>,
                <code>struct_logs: Vec&lt;GethExecStep&gt;</code>.
                EVM 실행의 각 스텝별 상태를 기록.
              </p>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">2단계: CircuitInputBuilder로 변환</p>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>sdb: StateDB</code> — 상태 데이터베이스</p>
                <p><code>code_db: CodeDB</code> — 코드 데이터베이스</p>
                <p><code>block: Blocks</code> — 블록 데이터</p>
              </div>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">3단계: Block 구조체 생성</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>block_convert()</code> 호출 — RW 연산 맵 → 트랜잭션 변환 → 실행 단계 → MPT 업데이트 → Bytecode 수집
              </p>
            </div>
            <div className="rounded border bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800 p-3">
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">4단계: 회로별 Witness 할당</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                EVM Circuit → State Circuit → Bytecode Circuit → 기타 서브회로에 각각 할당
              </p>
            </div>
          </div>
        </div>

        {/* Block Witness */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Block Witness</h3>
        <p>
          <code>Block</code> 구조체는 모든 회로가 공유하는 <strong>중앙 데이터 저장소</strong>입니다.<br />
          트랜잭션, RW 연산, 바이트코드, MPT 업데이트 등 증명에 필요한 모든 정보를 포함합니다.
        </p>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">Block 구조체 — <code>pub struct Block</code></p>
          <div className="grid gap-2">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">TX / 서명 / 실행 단계</p>
              <div className="grid gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>txs: Vec&lt;Transaction&gt;</code> — 트랜잭션 데이터</p>
                <p><code>sigs: Vec&lt;Signature&gt;</code> — 서명 데이터</p>
                <p><code>padding_step: ExecStep</code> — 패딩 실행 단계</p>
                <p><code>end_block_step: ExecStep</code> — 블록 종료 단계</p>
              </div>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">RW / 바이트코드 / 컨텍스트</p>
              <div className="grid gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>rws: RwMap</code> — RW 연산 맵</p>
                <p><code>bytecodes: BTreeMap&lt;Word, Bytecode&gt;</code> — 바이트코드</p>
                <p><code>context: BlockContexts</code> — 블록 컨텍스트</p>
              </div>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">이벤트 / MPT / 회로 파라미터</p>
              <div className="grid gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>copy_events: Vec&lt;CopyEvent&gt;</code> — 복사 이벤트</p>
                <p><code>exp_events: Vec&lt;ExpEvent&gt;</code> — EXP 이벤트</p>
                <p><code>sha3_inputs: Vec&lt;Vec&lt;u8&gt;&gt;</code> — Keccak 입력</p>
                <p><code>mpt_updates: MptUpdates</code> — MPT 업데이트</p>
                <p><code>circuits_params: CircuitsParams</code> — 회로 파라미터</p>
              </div>
            </div>
          </div>
        </div>

        {/* ExecStep Witness */}
        <h3 className="text-lg font-semibold mt-6 mb-3">ExecStep Witness</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">ExecStep — EVM 실행의 각 단계 Witness</p>
          <div className="grid gap-2">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">호출 / RW 인덱스</p>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>call_index: usize</code> — 호출 인덱스</p>
                <p><code>rw_indices: Vec&lt;(RwTableTag, usize)&gt;</code> — RW 연산 인덱스</p>
              </div>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">실행 상태</p>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>execution_state: ExecutionState</code> — 실행 상태</p>
                <p><code>rw_counter: usize</code> — RW 카운터</p>
                <p><code>program_counter: u64</code> — 프로그램 카운터</p>
                <p><code>stack_pointer: usize</code> — 스택 포인터</p>
              </div>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">가스 / 메모리 / 오퍼코드</p>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>gas_left: u64</code> — 남은 가스</p>
                <p><code>gas_cost: u64</code> — 가스 비용</p>
                <p><code>memory_size: u64</code> — 메모리 크기</p>
                <p><code>opcode: Option&lt;OpcodeId&gt;</code> — Opcode</p>
              </div>
            </div>
          </div>
        </div>

        {/* Witness vs Public Input */}
        <h3 className="text-xl font-semibold mt-8 mb-3">Witness vs Public Input</h3>
        <div className="grid sm:grid-cols-3 gap-3 not-prose mb-6">
          <div className="rounded-lg border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-4">
            <p className="text-sm font-bold text-sky-700 dark:text-sky-300 mb-2">Public Input</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">모두가 볼 수 있음</p>
            <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>블록 번호, timestamp</li>
              <li>Previous / new state root</li>
              <li>Transaction root, receipt root</li>
              <li>Verifier가 검증 시 확인</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-4">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-2">Witness</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Prover만 알고 있음</p>
            <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>모든 opcode 실행 세부</li>
              <li>Stack/memory/storage 중간 값</li>
              <li>계산 과정 (carry, remainder 등)</li>
              <li>Verifier에 노출 안 됨</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-4">
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-2">Constraint</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">회로 자체 (고정, 공개)</p>
            <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>제약식 — 누구나 검증 가능</li>
              <li>Prover는 constraint 만족하는 witness 찾기</li>
              <li>Private computation, public verification</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4 not-prose">
          <p className="text-sm font-semibold mb-2">zkEVM Witness 스케일</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                1 블록(100 tx): ~10-50 MB witness 크기.
                전체를 메모리에 로드해야 하므로 Prover 메모리 요구 수십 GB.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">최적화 전략</p>
              <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
                <li>Lazy witness generation</li>
                <li>Streaming assignment</li>
                <li>GPU-accelerated multi-scalar multiplication</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
