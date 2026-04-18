import { codeRefs } from './codeRefs';
import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호 프리미티브 전체 구조</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT는 Ed25519 서명, Merkle 증명, TMHASH 세 가지 암호 프리미티브로 동작한다.<br />
          각 함수의 코드를 step-by-step으로 추적한다.
        </p>

        {/* ── crypto 패키지 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">crypto 패키지 구조</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Ed25519 (서명)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">crypto/ed25519/</code></li>
              <li>validator 서명, peer 인증</li>
              <li>PubKey/PrivKey 구조체</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Merkle (증명)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">crypto/merkle/</code></li>
              <li><code className="text-xs">HashFromByteSlices</code>, Proof 생성/검증</li>
              <li>Block.Header, Block.Data, Evidence</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">TMHASH (해시)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">crypto/tmhash/</code></li>
              <li>SHA256[:20] wrapper</li>
              <li>address 생성, block hash</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">secp256k1</div>
            <p className="text-sm text-muted-foreground">선택적 구현</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">sr25519</div>
            <p className="text-sm text-muted-foreground">선택적 구현</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">bn254</div>
            <p className="text-sm text-muted-foreground">선택적, ZK용</p>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">PubKey interface</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">Address() Address</code></li>
              <li><code className="text-xs">Bytes() []byte</code></li>
              <li><code className="text-xs">VerifySignature(msg, sig []byte) bool</code></li>
              <li><code className="text-xs">Equals(PubKey) bool</code></li>
              <li><code className="text-xs">Type() string</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">PrivKey interface</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">Bytes() []byte</code></li>
              <li><code className="text-xs">Sign(msg []byte) ([]byte, error)</code></li>
              <li><code className="text-xs">PubKey() PubKey</code></li>
              <li><code className="text-xs">Equals(PrivKey) bool</code></li>
              <li><code className="text-xs">Type() string</code></li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          CometBFT crypto는 <strong>3가지 주요 프리미티브</strong> + 추상화된 interface.<br />
          Ed25519(default), Merkle tree, TMHASH로 합의 구성.<br />
          PubKey/PrivKey interface로 다양한 scheme 지원.
        </p>
      </div>
    </section>
  );
}
