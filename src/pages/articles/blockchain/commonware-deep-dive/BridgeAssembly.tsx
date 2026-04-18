import BridgeAssemblyViz from './viz/BridgeAssemblyViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function BridgeAssembly({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="bridge-assembly" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bridge 예제: 프리미티브 조립 실전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <code>examples/bridge</code> — Commonware 프리미티브를 모두 조합한 실전 예제
          <br />
          두 네트워크 간 합의 인증서를 교환하는 브릿지 밸리데이터
        </p>
        <p className="leading-7">
          사용 프리미티브: <strong>simplex</strong>(합의) + <strong>authenticated</strong>(P2P)
          + <strong>bls12381</strong>(임계 서명) + <strong>ed25519</strong>(피어 인증)
          <br />
          Anti-Framework 패턴 핵심 — 필요한 것만 선택, 나머지는 직접 구현
        </p>
        <p className="leading-7">
          아래 StepViz가 <code>validator.rs</code>의 조립 과정을 단계별로 추적
        </p>
      </div>
      <div className="not-prose mb-8">
        <BridgeAssemblyViz onOpenCode={open} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Bridge Architecture</h3>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            Cross-chain bridge — Source chain(원본 state) → Bridge validators(합의 + 증명) → Destination chain(미러 state)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2"><code className="text-xs">BridgeValidator</code> 구조체</h4>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code className="text-xs">ctx: Context</code> — Runtime context</li>
                <li><code className="text-xs">identity: Ed25519Keypair</code> — 피어 인증</li>
                <li><code className="text-xs">bls_share: BlsShare</code> — 임계 서명 share</li>
                <li><code className="text-xs">consensus: SimplexConsensus</code> — BFT 합의</li>
                <li><code className="text-xs">p2p: AuthenticatedP2P</code> — 암호화 통신</li>
                <li><code className="text-xs">source_client</code> / <code className="text-xs">dest_client</code> — 체인 클라이언트</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2"><code className="text-xs">run()</code> 실행 흐름</h4>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>다른 validators에 P2P 연결</li>
                <li>Source chain 블록 감시</li>
                <li><code className="text-xs">StateProposal</code> 생성 — chain_id, block_hash, height</li>
                <li>Simplex consensus로 합의</li>
                <li>BLS threshold signature 생성 + 수집</li>
                <li>Destination chain에 proof 제출</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Security Assumptions</h4>
          <ul className="text-sm space-y-0.5 text-muted-foreground">
            <li>2/3+ bridge validators honest</li>
            <li>Source/dest chains safe</li>
            <li>No offline attacks on shared key</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 Commonware로 Bridge 구축</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">1. Battle-tested Primitives</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code className="text-xs">Simplex</code> — deterministic sim 검증</li>
              <li><code className="text-xs">BLS</code> — audited cryptography</li>
              <li><code className="text-xs">P2P</code> — authenticated channels</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">2. Modularity</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>원하는 부분만 사용</li>
              <li>다른 consensus로 쉽게 교체</li>
              <li>Ed25519 대신 ECDSA 가능</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">3. Deterministic Testing</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Cross-chain failure scenarios</li>
              <li>Byzantine validator testing</li>
              <li>Replay attack simulation</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">4. Upgrade Path</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Primitive update는 library level</li>
              <li>Fork 불필요</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-3 text-muted-foreground">vs 대안 프레임워크</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <h5 className="font-semibold text-sm mb-1">Cosmos SDK</h5>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Full stack — 대부분 불필요</li>
                <li>IBC 내장 but specific</li>
                <li>Fork 어려움</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-1">Axelar / LayerZero</h5>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Closed-source partial</li>
                <li>Proprietary protocols</li>
                <li>Limited customization</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-1 text-blue-600 dark:text-blue-400">Commonware</h5>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Open-source all components</li>
                <li>Minimal footprint</li>
                <li>Direct Rust integration</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
