import type { CodeRef } from '@/components/code/types';
import evmCircuitRs from './codebase/zkevm-circuits/zkevm-circuits/src/evm_circuit.rs?raw';
import executionRs from './codebase/zkevm-circuits/zkevm-circuits/src/evm_circuit/execution.rs?raw';

export const evmCodeRefs: Record<string, CodeRef> = {
  'evm-config': {
    path: 'zkevm-circuits/src/evm_circuit.rs',
    code: evmCircuitRs,
    lang: 'rust',
    highlight: [40, 59],
    annotations: [
      { lines: [40, 43], color: 'sky', note: 'EvmCircuitConfig — fixed_table, byte_table, execution' },
      { lines: [45, 58], color: 'emerald', note: '서브회로 테이블 참조 — tx/rw/bytecode/copy/keccak/sig/ecc' },
    ],
    desc: 'EvmCircuitConfig는 EVM 회로의 최상위 설정입니다. fixed_table로 오퍼코드 상수를 룩업하고, 서브회로 테이블(RwTable, BytecodeTable 등)로 서브회로 간 일관성을 유지합니다.',
  },

  'execution-trait': {
    path: 'zkevm-circuits/src/evm_circuit/execution.rs',
    code: executionRs,
    lang: 'rust',
    highlight: [239, 255],
    annotations: [
      { lines: [239, 242], color: 'sky', note: 'ExecutionGadget 트레이트 — NAME, EXECUTION_STATE' },
      { lines: [244, 244], color: 'emerald', note: 'configure — 제약 정의 (keygen 시 호출)' },
      { lines: [246, 254], color: 'amber', note: 'assign_exec_step — 실행 트레이스로 셀 할당 (prove 시)' },
    ],
    desc: '모든 EVM 오퍼코드 가젯이 구현하는 트레이트입니다. configure()에서 회로 제약을 등록하고, assign_exec_step()에서 bus-mapping이 제공한 실행 트레이스로 셀에 값을 기입합니다.',
  },

  'execution-config': {
    path: 'zkevm-circuits/src/evm_circuit/execution.rs',
    code: executionRs,
    lang: 'rust',
    highlight: [257, 280],
    annotations: [
      { lines: [258, 262], color: 'sky', note: 'q_usable — 유효 행 선택자 (블라인딩 행 제외)' },
      { lines: [264, 268], color: 'emerald', note: 'q_step — 동적 높이 실행 스텝 시작점' },
    ],
    desc: 'ExecutionConfig는 EVM 실행 엔진의 회로 설정입니다. q_usable/q_step 선택자로 스텝 경계를 제어하고, CellManager로 동적 높이 스텝의 셀 할당을 관리합니다.',
  },
};
