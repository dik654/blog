import DelegateCallViz from './viz/DelegateCallViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function DelegateStaticCall({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="delegate-static" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">파생 호출: DelegateCall · StaticCall · Selfdestruct</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Call()의 변형 — 컨텍스트 유지(Delegate), 읽기 전용(Static), 계정 파괴(Selfdestruct)
          <br />
          모두 Call()과 동일한 Snapshot → Run() → Revert 구조를 공유
        </p>
      </div>
      <div className="not-prose">
        <DelegateCallViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">SELFDESTRUCT의 변화</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <code>SELFDESTRUCT</code> (opcode <code>0xFF</code>) — 컨트랙트 삭제 + ETH를 지정된 주소로 전송
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Original (pre-Cancun)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Contract의 모든 ETH를 recipient로 전송</li>
              <li>Contract의 code + storage 삭제</li>
              <li><code className="text-xs">CREATE2</code>로 재배포 가능</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">Gas Refund 변화</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Pre-London</strong>: <code className="text-xs">SELFDESTRUCT</code> → <code className="text-xs">24,000</code> refund</li>
              <li><strong>EIP-3529 (London)</strong>: <code className="text-xs">SELFDESTRUCT</code> refund 제거</li>
              <li><code className="text-xs">SSTORE</code> refund 절반으로 축소</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">EIP-6780 (Cancun, 2024)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>같은 tx에서 create된 contract만 full selfdestruct</li>
              <li>그 외에는 ETH만 전송 (코드 유지)</li>
              <li>Storage 보존</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">영향 & 현대 대안</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>기존 <code className="text-xs">CREATE2 + SELFDESTRUCT</code> proxy 패턴 깨짐</li>
              <li>Proxy + implementation upgrade (<code className="text-xs">SSTORE</code> of impl slot)</li>
              <li>Diamond standard (EIP-2535) / UUPS Proxy</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">STATICCALL 제약사항</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">금지된 Opcodes</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">SSTORE</code> (0x55)</li>
              <li><code className="text-xs">LOG0</code>-<code className="text-xs">LOG4</code> (0xA0-0xA4)</li>
              <li><code className="text-xs">CREATE</code>, <code className="text-xs">CREATE2</code> (0xF0, 0xF5)</li>
              <li><code className="text-xs">SELFDESTRUCT</code> (0xFF)</li>
              <li><code className="text-xs">CALL</code> with value &gt; 0</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">하나라도 실행 시 → <code className="text-xs">REVERT</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Use Cases</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">view</code>/<code className="text-xs">pure</code> function 호출 강제</li>
              <li>External contract read 안전 보장</li>
              <li>Re-entrancy 방어 (state 변경 불가)</li>
              <li>Solidity 컴파일러가 <code className="text-xs">view</code> 함수에 자동 적용</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">장점</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Strong guarantees (state immutability)</li>
              <li>Security audit 단순화</li>
              <li>Composable — 외부 call이 안전</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
