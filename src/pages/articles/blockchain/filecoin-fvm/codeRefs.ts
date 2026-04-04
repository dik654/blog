import type { CodeRef } from '@/components/code/types';
import fvmRs from './codebase/ref-fvm/fvm.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'fvm-machine': {
    path: 'fvm/src/fvm.rs',
    code: fvmRs, lang: 'rust', highlight: [4, 44],
    desc: 'fvm.rs — FVM Machine: WASM Actor 실행, syscall 바인딩, IPLD 상태 관리',
    annotations: [
      { lines: [5, 9], color: 'sky',
        note: 'Machine 구조체 — wasmtime 엔진 + StateTree + builtin_actors 매니페스트' },
      { lines: [16, 21], color: 'emerald',
        note: 'execute_message — 가스 차지 + Actor 코드 로드' },
      { lines: [26, 30], color: 'amber',
        note: 'WASM 인스턴스 — syscall(ipld_open/get/put)을 host function으로 바인딩' },
      { lines: [33, 36], color: 'violet',
        note: 'invoke() — method_num에 해당하는 Actor 메서드 실행' },
    ],
  },
};
