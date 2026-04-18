import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Saturn에서 Storacha로의 전환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Saturn은 Filecoin의 탈중앙 CDN이었으나 저장 증명이 없었음.<br />
          Storacha는 Saturn + web3.storage를 통합하고 PDP 온체인 증명을 추가
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Saturn → Storacha 전환</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Saturn (2022-2023)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Filecoin decentralized CDN</li>
              <li>IPFS retrieval</li>
              <li>저장 증명 없음, trust-based</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Storacha (2024+)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Saturn + web3.storage 통합</li>
              <li>PDP 온체인 증명 추가</li>
              <li>trustless hot storage, enterprise-grade</li>
              <li>가격: <code className="text-xs bg-background px-1 rounded">$5.99/TB/mo</code></li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">가격 비교 (hot storage)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>AWS S3: <code className="text-xs bg-background px-1 rounded">$23/TB/mo</code></li>
              <li>Pinata: <code className="text-xs bg-background px-1 rounded">$20/TB/mo</code></li>
              <li>Storacha: <code className="text-xs bg-background px-1 rounded">$5.99/TB/mo</code> (S3 대비 4x 저렴)</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Target</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Web3 developers, NFT platforms</li>
              <li>dApps needing CDN</li>
              <li>video streaming, enterprise clients</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Storacha = <strong>Saturn + web3.storage + PDP</strong>.<br />
          $5.99/TB hot storage (S3 대비 4x cheaper).<br />
          2024 merge, enterprise DSaaS.
        </p>
      </div>
    </section>
  );
}
