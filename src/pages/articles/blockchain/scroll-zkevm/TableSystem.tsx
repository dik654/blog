import TableFlowViz from './viz/TableFlowViz';
import CodePanel from '@/components/ui/code-panel';
import {
  RW_TABLE_CODE, rwAnnotations,
  TABLE_OVERVIEW_CODE, overviewAnnotations,
} from './TableSystemData';

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
        <h3 className="text-lg font-semibold mt-6 mb-3">RwTable — 핵심 테이블</h3>
        <p>
          RwTable은 <strong>12개 컬럼</strong>으로 EVM 실행 중 발생하는 모든 읽기/쓰기 연산을
          순서대로 기록합니다. rw_counter로 전역 순서를 보장하고,
          tag(Stack/Memory/Storage)로 연산 유형을 구분합니다.
        </p>
        <CodePanel title="RwTable 구조체" code={RW_TABLE_CODE}
          annotations={rwAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">전체 테이블 타입</h3>
        <CodePanel title="테이블 타입 요약" code={TABLE_OVERVIEW_CODE}
          annotations={overviewAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">테이블 카탈로그</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// zkEVM 핵심 테이블

// RwTable (Read-Write Table)
// - 12 columns: (rw_counter, is_write, tag, id, address, field_tag, storage_key, value, value_prev, init_val, committed, revert)
// - EVM 실행 중 모든 R/W 기록
// - tag: Start, Memory, Stack, Storage, CallContext, Account, TxLog, TxReceipt, TxRefund

// BytecodeTable
// - 4 columns: (code_hash, index, value, is_code)
// - 모든 loaded contract의 bytecode
// - Code verification의 source of truth

// BlockTable
// - 3 columns: (tag, index, value)
// - 현재 블록 정보 (number, timestamp, chainid, coinbase)
// - Public input으로 제공

// KeccakTable
// - 4 columns: (is_enabled, input_rlc, input_len, output_rlc)
// - Keccak hash input/output 쌍
// - 다른 서브회로들이 lookup

// TxTable
// - 3 columns: (tag, index, value)
// - Transaction fields (nonce, gas, to, value, data, sig)

// CopyTable
// - 9 columns: memcpy, calldatacopy, codecopy, returndatacopy, logdata
// - Source/destination 관계

// ExpTable
// - 5 columns: (base_limb0..3, exp, exp_pow)
// - EXP opcode 전용

// MptTable
// - 7 columns: state 변경 before/after`}</pre>

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
