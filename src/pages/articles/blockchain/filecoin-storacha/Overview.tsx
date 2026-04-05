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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Saturn (2022-2023):
// - Filecoin decentralized CDN
// - IPFS retrieval
// - no storage proof
// - trust-based

// Storacha (2024+):
// - Saturn + web3.storage 통합
// - PDP 온체인 증명 추가
// - trustless hot storage
// - enterprise-grade
// - $5.99/TB pricing

// 비교 (hot storage):
// - AWS S3: $23/TB/mo
// - Pinata: $20/TB/mo
// - Storacha: $5.99/TB/mo
// - 4x cheaper than S3

// Target:
// - Web3 developers
// - NFT platforms
// - dApps needing CDN
// - video streaming
// - enterprise clients`}
        </pre>
        <p className="leading-7">
          Storacha = <strong>Saturn + web3.storage + PDP</strong>.<br />
          $5.99/TB hot storage (S3 대비 4x cheaper).<br />
          2024 merge, enterprise DSaaS.
        </p>
      </div>
    </section>
  );
}
