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

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-3">Message 구조체</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="rounded bg-muted p-2"><code>to</code> — <span className="text-muted-foreground">Address (대상)</span></div>
            <div className="rounded bg-muted p-2"><code>from</code> — <span className="text-muted-foreground">Address (발신)</span></div>
            <div className="rounded bg-muted p-2"><code>method</code> — <span className="text-muted-foreground">MethodNum</span></div>
            <div className="rounded bg-muted p-2"><code>params</code> — <span className="text-muted-foreground">[]byte</span></div>
            <div className="rounded bg-muted p-2"><code>gas_limit</code> — <span className="text-muted-foreground">uint64</span></div>
            <div className="rounded bg-muted p-2"><code>value</code> — <span className="text-muted-foreground">TokenAmount</span></div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">1. Validate</div>
            <p className="text-[11px] text-muted-foreground">서명, nonce, 가스, 잔액 검증</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">2. Load Actor</div>
            <p className="text-[11px] text-muted-foreground"><code>to</code> 주소 조회 → Code CID → WASM 바이트코드 로드</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">3. Instantiate</div>
            <p className="text-[11px] text-muted-foreground">wasmtime 엔진, syscall 바인딩, 가스 미터, 메모리 초기화</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">4. Execute</div>
            <p className="text-[11px] text-muted-foreground"><code>invoke(method, params)</code> — WASM 실행, syscall R/W, 가스 누적</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">5. Finalize</div>
            <p className="text-[11px] text-muted-foreground">성공 시 상태 커밋, 실패 시 롤백. 사용 가스 차감, 미사용 환불</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs font-semibold mb-1">6. Lifecycle</div>
            <p className="text-[11px] text-muted-foreground">배포(코드 해시 등록) → 호출마다 인스턴스화 → IPLD로 상태 유지</p>
          </div>
        </div>

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Syscalls (Host Functions)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="rounded bg-muted p-2"><code>ipld_open(cid)</code> → handle</div>
            <div className="rounded bg-muted p-2"><code>ipld_get(handle, offset)</code> → bytes</div>
            <div className="rounded bg-muted p-2"><code>ipld_put(data)</code> → cid</div>
            <div className="rounded bg-muted p-2"><code>send(msg)</code> → receipt</div>
            <div className="rounded bg-muted p-2"><code>crypto_verify_signature(sig, key, data)</code></div>
            <div className="rounded bg-muted p-2"><code>gas_charge(amount)</code></div>
            <div className="rounded bg-muted p-2"><code>rand(seed)</code> → bytes</div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Gas Metering</h4>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li>WASM 명령어: op당 가스</li>
              <li>메모리 접근: byte당 가스</li>
              <li>syscall: 호출당 가스</li>
              <li>해시 연산: byte당 가스</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">결정론 보장</h4>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li>부동소수점 금지</li>
              <li>시스템 시계 접근 불가</li>
              <li>랜덤: syscall로만 제공</li>
              <li>시스템 I/O 없음</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">보안</h4>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li>WASM VM 격리 (샌드박스)</li>
              <li>외부 메모리 접근 불가</li>
              <li>가스 한도로 무한 루프 방지</li>
              <li>결정론으로 익스플로잇 차단</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">성능</h4>
            <ul className="text-xs space-y-0.5 list-disc list-inside">
              <li>wasmtime: near-native 속도</li>
              <li>JIT 컴파일</li>
              <li>컴파일된 코드 캐싱</li>
              <li>병렬 실행 (계획)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          WASM Runtime: <strong>wasmtime + syscalls + gas metering</strong>.<br />
          deterministic + sandboxed + language-agnostic.<br />
          Rust primary, also Solidity (FEVM), AssemblyScript, Go.
        </p>
      </div>
    </section>
  );
}
