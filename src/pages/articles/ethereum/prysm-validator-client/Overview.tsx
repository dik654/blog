import ContextViz from './viz/ContextViz';
import ValidatorClientViz from './viz/ValidatorClientViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">검증자 클라이언트 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 검증자 클라이언트의 슬롯 틱 루프, 역할 분배, 슬래싱 보호 메커니즘을 코드 수준으로 추적한다.
        </p>

        {/* ── Validator Client 분리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator Client — beacon-chain과 분리 프로세스</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">beacon-chain (노드)</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>P2P 네트워킹, state 관리, fork choice</p>
                <p>validator 키 보유 안 함 — 보안에 덜 민감</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">validator (검증자 클라이언트)</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>validator 개인키 보유 — 보안 critical</p>
                <p>attestation/block 서명 + slashing protection DB</p>
                <p>beacon-chain에 gRPC 연결</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">분리의 이점</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-foreground/80">
              <div><span className="font-semibold text-foreground/70">키 노출 최소화</span> — beacon-chain에 키 없음 → P2P/RPC 공격 무력</div>
              <div><span className="font-semibold text-foreground/70">독립 스케일링</span> — 1개 beacon-chain ↔ N개 validator fleet</div>
              <div><span className="font-semibold text-foreground/70">키 관리 유연성</span> — validator만 재시작, beacon-chain 유지보수 중에도 서명 가능</div>
              <div><span className="font-semibold text-foreground/70">Remote signer</span> — Web3Signer / 하드웨어 wallet 통합</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">네트워크 아키텍처</p>
            <p className="text-sm text-foreground/80 font-mono">EL (Reth) &larr; Engine API &rarr; beacon-chain &larr; gRPC &rarr; validator</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground/60 mt-2">
              <span><code>beacon-chain --execution-endpoint=http://localhost:8551</code></span>
              <span><code>validator --beacon-rpc-provider=localhost:4000</code></span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Prysm은 <strong>2-binary 분리 구조</strong>.<br />
          beacon-chain(노드) + validator(키 관리) → 보안 격리.<br />
          독립 scaling, remote signer, 유지보수 유연성 확보.
        </p>
      </div>
      <div className="not-prose mt-6"><ValidatorClientViz /></div>
    </section>
  );
}
