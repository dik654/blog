import CreateFlowViz from './viz/CreateFlowViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CreateFlow({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="create-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨트랙트 생성: CREATE & CREATE2</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          msg.To == nil이면 Call() 대신 Create()가 호출됨
          <br />
          init code를 실행하여 런타임 바이트코드를 배포하는 과정
        </p>
      </div>
      <div className="not-prose">
        <CreateFlowViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">CREATE vs CREATE2</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">CREATE (opcode 0xF0, original)</div>
            <p className="text-sm text-muted-foreground mb-2">
              Address = <code className="text-xs">keccak256(rlp([sender, nonce]))[12:]</code>
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">sender</code>: 생성자 주소</li>
              <li><code className="text-xs">nonce</code>: sender의 현재 nonce</li>
              <li>주소 예측 가능하지만 nonce에 의존</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">CREATE2 (opcode 0xF5, Constantinople 2019)</div>
            <p className="text-sm text-muted-foreground mb-2">
              Address = <code className="text-xs">keccak256(0xFF || sender || salt || keccak256(init_code))[12:]</code>
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">salt</code>: 32-byte 선택값</li>
              <li><code className="text-xs">init_code</code>: 배포할 코드</li>
              <li>미리 주소 계산 가능 (counterfactual deployment)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">CREATE2 Use Cases</div>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <p><strong>State channels</strong> — 배포 전 주소 알 수 있음</p>
              <p><strong>Factory patterns</strong> — deterministic addresses</p>
              <p><strong>Meta-transactions</strong> — pre-fund 가능</p>
              <p><strong>Upgrade</strong> — 같은 주소 재사용 (<code className="text-xs">CREATE2 + SELFDESTRUCT</code>)</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Init Code 실행 흐름</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">1. Tx 도착</div>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">{'{ to: nil, data: init_code + constructor_args }'}</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">2. EVM이 init_code 해석</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>일반 opcode 실행</li>
              <li>Constructor logic 수행</li>
              <li><code className="text-xs">RETURN</code>으로 runtime code 반환</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">3. Runtime code 저장</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">RETURN</code> bytes = deployed code</li>
              <li><code className="text-xs">address.code = runtime_code</code></li>
              <li><code className="text-xs">address.codeHash = keccak256(runtime_code)</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Init Code 바이트코드 구조</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Constructor 로직 → <code className="text-xs">CODECOPY</code> (runtime code를 메모리에 복사) → <code className="text-xs">RETURN</code></p>
              <p className="text-xs mt-2">Init code는 실행 후 discard / Runtime code만 chain에 영구 저장</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Gas 비용</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>CREATE base: <code className="text-xs">32,000</code></li>
              <li>Code deposit: <code className="text-xs">200</code> gas/byte</li>
              <li>Init code execution: 일반 gas</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
