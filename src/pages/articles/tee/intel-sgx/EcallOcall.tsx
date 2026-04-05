import SGXCallFlow from '../../blockchain/components/SGXCallFlow';
import EDLViz from './viz/EDLViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function EcallOcall({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="ecall-ocall" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECALL / OCALL 경계</h2>
      <div className="not-prose mb-8">
        <SGXCallFlow />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SGX는 신뢰 경계를 <strong>ECALL</strong>(호스트 → 엔클레이브)과{' '}
          <strong>OCALL</strong>(엔클레이브 → 호스트)로 명확히 구분합니다.<br />
          Edger8r(코드 생성기)가 EDL 파일을 파싱해 양쪽의 마샬링 코드를 자동 생성합니다.
        </p>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">EDL (Enclave Definition Language)</h3>
      <div className="not-prose mb-8"><EDLViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>실제 소스 코드 탐색</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('is-ecall-allowed', codeRefs['is-ecall-allowed'])} />
          <span className="text-[10px] text-muted-foreground self-center">is_ecall_allowed()</span>
          <CodeViewButton onClick={() => onCodeRef('trts-ecall', codeRefs['trts-ecall'])} />
          <span className="text-[10px] text-muted-foreground self-center">trts_ecall()</span>
          <CodeViewButton onClick={() => onCodeRef('do-ecall', codeRefs['do-ecall'])} />
          <span className="text-[10px] text-muted-foreground self-center">do_ecall()</span>
          <CodeViewButton onClick={() => onCodeRef('sgx-ocall', codeRefs['sgx-ocall'])} />
          <span className="text-[10px] text-muted-foreground self-center">sgx_ocall()</span>
          <CodeViewButton onClick={() => onCodeRef('do-oret', codeRefs['do-oret'])} />
          <span className="text-[10px] text-muted-foreground self-center">do_oret()</span>
          <CodeViewButton onClick={() => onCodeRef('ocall-context', codeRefs['ocall-context'])} />
          <span className="text-[10px] text-muted-foreground self-center">ocall_context_t</span>
          <CodeViewButton onClick={() => onCodeRef('ecall-table', codeRefs['ecall-table'])} />
          <span className="text-[10px] text-muted-foreground self-center">ecall_table_t</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">ECALL/OCALL 흐름 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ECALL 전체 흐름 (Untrusted → Enclave)
//
// App (untrusted) side:
//   1. Call ecall_foo(eid, ...)
//      ↓ [Edger8r 생성 wrapper]
//   2. Marshal parameters
//      - In params: copy 값 to buffer
//      - Out params: allocate space
//   3. sgx_ecall(eid, func_idx, &ms_struct)
//      ↓ [uRTS]
//   4. Construct trampoline
//   5. EENTER instruction
//      ↓ [CPU]
//   6. Switch to enclave mode
//      - Load enclave CR registers
//      - Enter TCS
//      - Jump to enclave entry point
//
// Enclave (trusted) side:
//   7. sgx_entry() [tRTS]
//   8. Verify ECALL allowed
//      - Check ecall_table
//      - Validate parameters in enclave
//   9. do_ecall(func_idx, ms_buffer)
//   10. Call actual ECALL function
//   11. Return value copy back
//   12. EEXIT instruction
//       ↓ [CPU]
//   13. Return to App
//
// Total latency: ~8,000 cycles (EENTER + EEXIT)

// OCALL 흐름 (Enclave → Untrusted):
//   1. Enclave wants to call printf/fopen/etc.
//   2. sgx_ocall(func_idx, &ms_struct)
//   3. Save enclave state (ocall_context)
//   4. EEXIT to App
//   5. App identifies OCALL
//   6. Call actual OCALL function
//   7. ERESUME to re-enter enclave
//   8. Restore enclave state

// EDL 예시:
//   enclave {
//       trusted {
//           public int ecall_add(
//               [in] int* a,
//               [in, out] int* b
//           );
//       };
//       untrusted {
//           void ocall_print([in, string] const char* str);
//       };
//   };

// Parameter Marshaling 주의:
//   - [in]: untrusted → trusted (copy in)
//   - [out]: trusted → untrusted (copy out)
//   - [in, out]: 양방향
//   - [user_check]: 검증 안 함 (위험)
//   - 포인터 참조는 모두 enclave 내부 복사 필요
//   - 사용자 포인터 직접 역참조 금지`}
        </pre>
      </div>
    </section>
  );
}
