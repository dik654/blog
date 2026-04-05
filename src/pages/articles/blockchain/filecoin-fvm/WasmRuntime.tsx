import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function WasmRuntime({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="wasm-runtime" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WASM 런타임 & Actor 실행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fvm-machine', codeRefs['fvm-machine'])} />
          <span className="text-[10px] text-muted-foreground self-center">execute_message()</span>
        </div>
        <p>
          메시지가 도착하면 to 주소의 Actor 코드(WASM)를 로드해 인스턴스 생성.<br />
          syscall(ipld_open, ipld_get, ipld_put)로 IPLD 상태 트리에 접근
        </p>
        <p>
          가스 미터링: WASM 명령어마다 가스를 차지해 무한 루프 방지.<br />
          가스 한도 초과 시 실행 중단, 상태 변경은 롤백
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 WASM의 장점</strong> — 언어 독립적. Rust, Go, AssemblyScript 등으로<br />
          Actor를 작성 가능. 샌드박스 실행으로 보안성이 높고 결정론적
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">WASM Runtime &amp; Actor Execution</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// FVM Message Execution Flow:

// 1. Message arrival:
// Message {
//     to: Address
//     from: Address
//     method: MethodNum
//     params: []byte
//     gas_limit: uint64
//     value: TokenAmount
// }

// 2. Validate:
// - signature check
// - nonce check
// - gas check
// - balance check

// 3. Load target actor:
// - lookup to address
// - load actor state (Code CID)
// - resolve code → WASM bytecode

// 4. Instantiate WASM:
// - wasmtime engine
// - provide host functions (syscalls)
// - set gas meter
// - initialize memory

// 5. Execute:
// instance.invoke(method, params)
// - runs WASM bytecode
// - reads/writes via syscalls
// - accumulates gas cost
// - returns result or error

// 6. Finalize:
// - commit state changes if success
// - rollback if error
// - charge gas used
// - refund unused gas

// Syscalls (Host Functions):
// - ipld_open(cid) → handle
// - ipld_get(handle, offset) → bytes
// - ipld_put(data) → cid
// - send(msg) → receipt
// - crypto_verify_signature(sig, key, data)
// - gas_charge(amount)
// - rand(seed) → bytes
// - ... many more

// Gas Metering:
// - WASM instructions: gas per op
// - memory access: gas per byte
// - syscalls: gas per call
// - hash operations: gas per byte
// - continuously charged

// Determinism:
// - no floating-point
// - no wall clock
// - no randomness (provided via syscall)
// - no system I/O
// - reproducible

// Security:
// - sandboxed (WASM VM isolation)
// - no direct memory access outside sandbox
// - gas limits prevent infinite loops
// - deterministic prevents exploits

// Performance:
// - wasmtime: near-native speed
// - JIT compilation
// - caching compiled code
// - parallel execution (planned)

// Actor lifecycle:
// - deployed (code hash registered)
// - instantiated per call
// - state persisted via IPLD
// - upgradeable (network upgrade)`}
        </pre>
        <p className="leading-7">
          WASM Runtime: <strong>wasmtime + syscalls + gas metering</strong>.<br />
          deterministic + sandboxed + language-agnostic.<br />
          Rust primary, also Solidity (FEVM), AssemblyScript, Go.
        </p>
      </div>
    </section>
  );
}
