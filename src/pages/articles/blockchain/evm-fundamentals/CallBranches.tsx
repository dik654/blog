import CallBranchesViz from './viz/CallBranchesViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CallBranches({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="call-branches" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Call() 내부 분기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Call()은 단순한 함수 호출이 아님 — 스냅샷, 전송, 프리컴파일 분기, 컨트랙트 생성을 모두 처리
          <br />
          각 단계에서 실패하면 즉시 롤백 — 이전 상태로 되돌리고 에러 반환
        </p>
      </div>
      <div className="not-prose">
        <CallBranchesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Precompiled Contracts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Precompile = EVM이 네이티브 코드로 제공하는 특별 주소. bytecode 없이 직접 실행하여 훨씬 빠름
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">0x01: ecrecover</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">ecrecover(hash, v, r, s)</code> → signer address</p>
            <p className="text-xs text-muted-foreground mt-1">secp256k1 signature recovery / Gas: <code className="text-xs">3000</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">0x02: sha256</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">sha256(data)</code> → 32-byte hash</p>
            <p className="text-xs text-muted-foreground mt-1">SHA-256 (not Keccak!) / Gas: <code className="text-xs">60 + 12/word</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">0x03: ripemd160</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">ripemd160(data)</code> → 20-byte hash</p>
            <p className="text-xs text-muted-foreground mt-1">Bitcoin compatibility / Gas: <code className="text-xs">600 + 120/word</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">0x04: identity</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">identity(data)</code> → data (datacopy)</p>
            <p className="text-xs text-muted-foreground mt-1">Memory ops에 유용 / Gas: <code className="text-xs">15 + 3/word</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">0x05: modexp (EIP-198)</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">modexp(base, exp, mod)</code> → result</p>
            <p className="text-xs text-muted-foreground mt-1">Large number modular exponentiation / Variable gas</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">0x06-08: BN254 Curve</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">bn256Add</code>, <code className="text-xs">bn256ScalarMul</code>, <code className="text-xs">bn256Pairing</code></p>
            <p className="text-xs text-muted-foreground mt-1">SNARKs / ZK-rollups 사용</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">0x09: blake2f (EIP-152)</div>
            <p className="text-sm text-muted-foreground"><code className="text-xs">blake2f(rounds, h, m, t, f)</code> → h</p>
            <p className="text-xs text-muted-foreground mt-1">BLAKE2b compression function</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">0x0A: pointEvaluation (EIP-4844)</div>
            <p className="text-sm text-muted-foreground">KZG commitment verification</p>
            <p className="text-xs text-muted-foreground mt-1">Blob transactions 검증</p>
          </div>
        </div>

      </div>
    </section>
  );
}
