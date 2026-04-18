import TableFlowViz from './viz/TableFlowViz';

export default function TableSystem() {
  return (
    <section id="table-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">테이블 시스템</h2>
      <div className="not-prose mb-8"><TableFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          테이블 시스템은 zkEVM의 여러 회로 간에 <strong>데이터를 공유하고 검증</strong>하는
          핵심 메커니즘입니다. 한 회로가 테이블에 데이터를 기록(write)하면,
          다른 회로가 <code>lookup_any</code>로 해당 데이터의 존재를 증명합니다.
        </p>

        {/* RwTable */}
        <h3 className="text-lg font-semibold mt-6 mb-3">RwTable — 핵심 테이블</h3>
        <p>
          RwTable은 <strong>12개 컬럼</strong>으로 EVM 실행 중 발생하는 모든 읽기/쓰기 연산을
          순서대로 기록합니다. rw_counter로 전역 순서를 보장하고,
          tag(Stack/Memory/Storage)로 연산 유형을 구분합니다.
        </p>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">RwTable 구조체 — <code>pub struct RwTable</code></p>
          <div className="grid gap-2">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">순서 보장</p>
              <div className="grid gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>q_enable: Column&lt;Fixed&gt;</code> — 행 활성화 플래그</p>
                <p><code>rw_counter: Column&lt;Advice&gt;</code> — 전역 순서 카운터</p>
                <p><code>is_write: Column&lt;Advice&gt;</code> — 읽기(0) / 쓰기(1)</p>
              </div>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">연산 식별</p>
              <div className="grid gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>tag</code> — Stack, Memory, Storage, ...</p>
                <p><code>id</code> — call_id</p>
                <p><code>address</code> — stack_ptr / memory_addr</p>
                <p><code>field_tag</code> — 필드 구분자</p>
                <p><code>storage_key</code> — 스토리지 키</p>
              </div>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">상태 변화 추적</p>
              <div className="grid gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>value</code> — 현재 값</p>
                <p><code>value_prev</code> — 이전 값</p>
                <p><code>aux1</code>, <code>aux2</code> — 보조 필드</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            사용: EVM Circuit(lookup), State Circuit(write)
          </p>
        </div>

        {/* 전체 테이블 타입 */}
        <h3 className="text-lg font-semibold mt-6 mb-3">전체 테이블 타입</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">테이블 타입 요약 — <code>table.rs</code></p>
          <div className="grid gap-2">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">핵심 실행 — RW + Copy</p>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>RwTable</code> — r/w 순서 추적 (12 컬럼)</p>
                <p><code>CopyTable</code> — 복사 이벤트 기록</p>
              </div>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">블록 / TX 메타데이터</p>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>TxTable</code> — tx_id, tag, index, value</p>
                <p><code>BlockTable</code> — tag, index, value</p>
              </div>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">해시 — Keccak / Poseidon / SHA256</p>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>BytecodeTable</code> — code_hash, tag, index, is_code, value</p>
                <p><code>KeccakTable</code> — is_final, input_rlc, input_len, output_rlc</p>
                <p><code>PoseidonTable</code> — hash_id, input0, input1, control, domain_spec</p>
                <p><code>SHA256Table</code> — is_final, input_rlc, input_len, output_rlc</p>
              </div>
            </div>
            <div className="rounded border bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800 p-3">
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">상태 증명 + 암호 검증</p>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>MptTable</code> — address, storage_key, proof_type, old/new root/value</p>
                <p><code>SigTable</code> — msg_hash_rlc, sig_v/r/s_rlc, recovered_addr</p>
                <p><code>EccTable</code> — 타원곡선 연산 검증</p>
                <p><code>ExpTable</code> — EXP 오퍼코드 검증</p>
              </div>
            </div>
          </div>
        </div>

        {/* 테이블 카탈로그 */}
        <h3 className="text-xl font-semibold mt-8 mb-3">테이블 카탈로그</h3>
        <div className="grid sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">RwTable</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">12 columns. EVM 실행 중 모든 R/W 기록.
              tag: Start, Memory, Stack, Storage, CallContext, Account, TxLog, TxReceipt, TxRefund</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">BytecodeTable</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">4 columns: <code>code_hash</code>, <code>index</code>, <code>value</code>, <code>is_code</code>.
              모든 loaded contract의 bytecode. Code verification의 source of truth.</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">BlockTable</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">3 columns: <code>tag</code>, <code>index</code>, <code>value</code>.
              블록 정보(number, timestamp, chainid, coinbase). Public input으로 제공.</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">KeccakTable</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">4 columns: <code>is_enabled</code>, <code>input_rlc</code>, <code>input_len</code>, <code>output_rlc</code>.
              Keccak hash input/output 쌍. 다른 서브회로들이 lookup.</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">TxTable</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">3 columns: <code>tag</code>, <code>index</code>, <code>value</code>.
              Transaction fields(nonce, gas, to, value, data, sig).</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">CopyTable</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">9 columns. memcpy, calldatacopy, codecopy, returndatacopy, logdata.
              Source/destination 관계 추적.</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">ExpTable</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">5 columns: <code>base_limb0..3</code>, <code>exp</code>, <code>exp_pow</code>.
              EXP opcode 전용.</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-bold mb-1">MptTable</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">7 columns. state 변경 before/after.
              MPT proof 검증용.</p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Table-first 설계의 힘</p>
          <p>
            <strong>전통 SNARK 회로</strong>: 연산이 직접 제약식으로 표현 → 복잡<br />
            <strong>Table-based zkEVM</strong>: 연산 → table entry → lookup 검증<br />
            <strong>장점</strong>: 모듈성, 재사용성, lookup argument로 저비용 검증<br />
            <strong>비용</strong>: Witness generation 복잡 (table assignment)
          </p>
        </div>

      </div>
    </section>
  );
}
