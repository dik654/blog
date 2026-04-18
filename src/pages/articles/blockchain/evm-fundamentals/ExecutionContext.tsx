import ExecContextViz from './viz/ExecContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ExecutionContext({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execution-context" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 컨텍스트: CALL vs DELEGATECALL</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM은 컨트랙트 간 호출 시 새로운 실행 프레임 생성
          <br />
          CALL — 대상 컨트랙트의 storage 사용, msg.sender = 호출자
          <br />
          DELEGATECALL — 호출자의 storage 사용, msg.sender 유지 → 프록시 패턴의 핵심
        </p>
      </div>
      <div className="not-prose">
        <ExecContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Call Type 상세 비교</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2"><code className="text-xs">CALL</code> (0xF1)</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>새 execution context</li>
              <li>storage = <strong>target</strong> contract의 storage</li>
              <li><code className="text-xs bg-background/50 px-1 py-0.5 rounded">msg.sender</code> = 호출자 (caller)</li>
              <li><code className="text-xs bg-background/50 px-1 py-0.5 rounded">msg.value</code> = 전달한 ETH</li>
              <li>새 gas frame</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 border-t border-blue-200 dark:border-blue-800 pt-2">A &rarr; CALL &rarr; B: <code className="text-xs">msg.sender = A</code>, <code className="text-xs">storage = B</code></p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2"><code className="text-xs">DELEGATECALL</code> (0xF4, Homestead)</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>호출자의</strong> storage 사용</li>
              <li><code className="text-xs bg-background/50 px-1 py-0.5 rounded">msg.sender</code> = 원래 sender 유지</li>
              <li><code className="text-xs bg-background/50 px-1 py-0.5 rounded">msg.value</code> 유지</li>
              <li>"library" 패턴의 기반</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 border-t border-purple-200 dark:border-purple-800 pt-2">User &rarr; A &rarr; DELEGATECALL &rarr; B: <code className="text-xs">msg.sender = User</code>, <code className="text-xs">storage = A</code></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2"><code className="text-xs">STATICCALL</code> (0xFA, Byzantium)</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>CALL과 같지만 state 변경 금지</li>
              <li><code className="text-xs bg-background/50 px-1 py-0.5 rounded">SSTORE</code>, <code className="text-xs bg-background/50 px-1 py-0.5 rounded">LOG</code>, <code className="text-xs bg-background/50 px-1 py-0.5 rounded">CREATE</code>, <code className="text-xs bg-background/50 px-1 py-0.5 rounded">SELFDESTRUCT</code> 모두 불가</li>
              <li><code className="text-xs bg-background/50 px-1 py-0.5 rounded">view</code>/<code className="text-xs bg-background/50 px-1 py-0.5 rounded">pure</code> function 강제</li>
              <li>Re-entrancy 방지</li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2"><code className="text-xs">CALLCODE</code> (0xF2) <span className="text-red-500 text-xs font-bold">DEPRECATED</span></p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>DELEGATECALL의 예전 버전</li>
              <li><code className="text-xs bg-background/50 px-1 py-0.5 rounded">msg.sender</code>를 current contract로 설정</li>
              <li>사용 금지 &mdash; DELEGATECALL 사용</li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 not-prose mb-6">
          <p className="font-semibold text-sm mb-1">Proxy Pattern 핵심</p>
          <p className="text-sm text-muted-foreground">Proxy가 모든 call을 Implementation으로 <code className="text-xs bg-background/50 px-1 py-0.5 rounded">DELEGATECALL</code> &mdash; Proxy storage 유지 + Implementation 코드 로직 사용 &rarr; Implementation 교체로 업그레이드 가능</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Proxy Pattern 예시 (EIP-1967)</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">Proxy Contract 구조</h4>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">IMPL_SLOT</code></p>
            <p className="text-sm text-muted-foreground">Implementation address를 저장하는 고정 slot &mdash; <code className="text-xs bg-background/50 px-1 py-0.5 rounded">0x360894...382bbc</code> (EIP-1967 표준)</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">fallback()</code></p>
            <p className="text-sm text-muted-foreground">모든 call을 가로채서 <code className="text-xs bg-background/50 px-1 py-0.5 rounded">delegatecall(gas(), impl, ...)</code>로 전달 &mdash; 결과에 따라 return 또는 revert</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1"><code className="text-xs">upgrade(newImpl)</code></p>
            <p className="text-sm text-muted-foreground">admin만 호출 가능 &mdash; <code className="text-xs bg-background/50 px-1 py-0.5 rounded">sstore(IMPL_SLOT, newImpl)</code>으로 구현체 교체</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">Implementation 버전 교체</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">LogicV1</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">counter</code> (uint256) &mdash; <code className="text-xs bg-background/50 px-1 py-0.5 rounded">increment()</code>: counter += 1</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">LogicV2 (upgrade)</p>
            <p className="text-sm text-muted-foreground"><code className="text-xs bg-background/50 px-1 py-0.5 rounded">counter</code> (uint256, 같은 slot 유지 필수) &mdash; <code className="text-xs bg-background/50 px-1 py-0.5 rounded">increment()</code>: counter += 2</p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4 mb-2">업그레이드 흐름</h4>
        <div className="grid grid-cols-1 gap-2 not-prose mb-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-3">
            <p className="text-sm"><span className="font-semibold">1.</span> LogicV1 배포</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-3">
            <p className="text-sm"><span className="font-semibold">2.</span> Proxy에 LogicV1 주소 설정</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-3">
            <p className="text-sm"><span className="font-semibold">3.</span> Users가 Proxy 주소로 tx 전송</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-3">
            <p className="text-sm"><span className="font-semibold">4.</span> Proxy admin이 <code className="text-xs bg-background/50 px-1 py-0.5 rounded">IMPL_SLOT</code>을 LogicV2 주소로 변경</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 rounded-r-lg p-3">
            <p className="text-sm"><span className="font-semibold">5.</span> 이후 tx는 LogicV2 코드 실행, 동일한 Proxy storage 유지</p>
          </div>
        </div>

      </div>
    </section>
  );
}
