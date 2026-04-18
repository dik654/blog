import type { CodeRef } from '@/components/code/types';
import MultichainViz from './viz/MultichainViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Multichain({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="multichain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멀티체인 지원</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>MultiChainProvider</code>는 <code>HashMap&lt;ChainId, KohakuProvider&gt;</code> 구조다.
          <br />
          각 체인마다 독립된 Helios + ORAM + Dandelion 인스턴스를 생성한다.
        </p>
        <p className="leading-7">
          Ethereum, Optimism, Base 등 각 체인의 쿼리 패턴이 격리된다.
          <br />
          한 체인의 활동으로 다른 체인의 사용자를 프로파일링할 수 없다.
        </p>
        <p className="leading-7">
          <code>add_chain(chain_id, rpc, checkpoint)</code>로 새 체인을 추가한다.
          <br />
          체인별 checkpoint는 부트스트랩 시 사용된다. 각 체인의 Sync Committee가 독립 검증된다.
        </p>
      </div>
      <div className="not-prose"><MultichainViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">MultiChain Architecture</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>MultiChainProvider</code> 구조</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>chains</code>: <code>HashMap&lt;ChainId, Box&lt;KohakuProvider&gt;&gt;</code> — 체인별 프로바이더</li>
              <li><code>default_chain</code>: <code>ChainId</code> — 기본값 1 (Ethereum mainnet)</li>
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">핵심 메서드</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>add_chain(chain_id, rpc_url, checkpoint)</code> — <code>KohakuProvider::new(rpc_url, checkpoint, chain_config_for(chain_id))</code>로 생성 후 <code>chains.insert</code></li>
              <li><code>provider_for(chain_id)</code> → <code>Option&lt;&amp;KohakuProvider&gt;</code> — 체인별 프로바이더 조회</li>
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>chain_config_for(chain_id)</code> — 체인별 설정</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-xs text-center mt-2">
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">1</p>
                <p className="text-muted-foreground">Mainnet</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">10</p>
                <p className="text-muted-foreground">Optimism</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">8453</p>
                <p className="text-muted-foreground">Base</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">42161</p>
                <p className="text-muted-foreground">Arbitrum</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">137</p>
                <p className="text-muted-foreground">Polygon</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">_</p>
                <p className="text-muted-foreground">Generic</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Chain Isolation의 중요성</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">문제: 체인 간 정보 누출</p>
            <p className="text-sm text-muted-foreground">
              사용자가 L1에서 Alice.eth 조회 → 같은 RPC가 Optimism에서 Alice 주소 관찰 → L1 + L2 활동 연결 (deanonymization)
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">Kohaku 해결책</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded px-3 py-2 text-sm">
                <p className="font-medium text-xs mb-1">1) Per-chain Isolated Providers</p>
                <p className="text-xs text-muted-foreground">Ethereum: 인스턴스 A / Optimism: 인스턴스 B — cross-instance 정보 공유 없음</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-sm">
                <p className="font-medium text-xs mb-1">2) Different RPC Endpoints</p>
                <p className="text-xs text-muted-foreground">L1: Infura / L2: Optimism RPC / L3: Base RPC — 각각 독립된 observer</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-sm">
                <p className="font-medium text-xs mb-1">3) Query Timing Jitter</p>
                <p className="text-xs text-muted-foreground">체인 간 동시 발생 방지, random delays, timing correlation 방어</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Cross-chain 위협</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>같은 wallet이 여러 체인 사용</li>
                <li>{'Bridge transactions (L1 <> L2)'}</li>
                <li>Cross-chain messages</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">완화 불가능한 것</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>On-chain activity (public)</li>
                <li>Bridge deposits/withdrawals</li>
                <li>동일 주소 재사용</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
