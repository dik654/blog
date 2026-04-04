import type { CodeRef } from '@/components/code/types';
import addSubRs from './codebase/zkevm-circuits/zkevm-circuits/src/evm_circuit/execution/add_sub.rs?raw';
import copyCircuitRs from './codebase/zkevm-circuits/zkevm-circuits/src/copy_circuit.rs?raw';

export const gadgetCodeRefs: Record<string, CodeRef> = {
  'add-sub-gadget': {
    path: 'zkevm-circuits/src/evm_circuit/execution/add_sub.rs',
    code: addSubRs,
    lang: 'rust',
    highlight: [22, 71],
    annotations: [
      { lines: [22, 27], color: 'sky', note: 'AddSubGadget 필드 — SameContext, AddWords, PairSelect' },
      { lines: [34, 40], color: 'emerald', note: '워드 쿼리 + AddWordsGadget으로 a+b=c 제약' },
      { lines: [43, 48], color: 'amber', note: 'PairSelectGadget — SUB이면 a↔c 교환' },
      { lines: [52, 54], color: 'violet', note: '스택 팝/푸시 — RwTable 룩업 제약' },
      { lines: [57, 64], color: 'rose', note: '상태 전환 — rw_counter+3, pc+1, stack_ptr+1, gas-3' },
    ],
    desc: 'ADD/SUB 오퍼코드 가젯입니다. AddWordsGadget으로 256비트 덧셈 제약을 등록하고, PairSelectGadget으로 ADD/SUB를 구분합니다. 스택 연산은 RwTable 룩업으로 검증됩니다.',
  },

  'add-sub-assign': {
    path: 'zkevm-circuits/src/evm_circuit/execution/add_sub.rs',
    code: addSubRs,
    lang: 'rust',
    highlight: [73, 103],
    annotations: [
      { lines: [85, 91], color: 'sky', note: 'RW 인덱스 재배치 — SUB이면 [2,1,0] 순서' },
      { lines: [92, 99], color: 'emerald', note: 'add_words/is_sub/same_context 셀 할당' },
    ],
    desc: 'assign_exec_step에서 실제 실행 트레이스 값을 셀에 기입합니다. SUB이면 rw_indices 순서를 뒤집어 a와 c를 교환합니다.',
  },

  'copy-circuit': {
    path: 'zkevm-circuits/src/copy_circuit.rs',
    code: copyCircuitRs,
    lang: 'rust',
    highlight: [1, 50],
    annotations: [
      { lines: [1, 10], color: 'sky', note: '모듈 임포트 — Halo2, eth-types, CopyTable' },
    ],
    desc: 'CopyCircuit는 메모리/calldata 복사 연산의 무결성을 검증합니다. EVM의 CALLDATACOPY, CODECOPY, RETURNDATACOPY 등의 복사 이벤트를 추적합니다.',
  },
};
