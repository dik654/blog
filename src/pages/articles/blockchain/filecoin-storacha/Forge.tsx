import type { CodeRef } from '@/components/code/types';

export default function Forge({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="forge" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Forge: IPFS 호환 warm storage</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Storacha의 핫스토리지 서비스 레이어. $5.99/TB 가격.<br />
          봉인하지 않아서 즉시 리트리벌 가능. 기존 IPFS 피닝 서비스의 탈중앙 대안
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Forge Hot Storage 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Forge Service Layer:

// Features:
// - immediate retrieval
// - no sealing delay
// - HTTP gateway
// - S3-compatible API
// - UCAN auth

// Pricing:
// $5.99/TB/month
// - Pinata ($20): 3x cheaper
// - AWS S3 ($23): 4x cheaper
// - Filecoin cold ($0.50): 10x more expensive
// - different use case (hot vs cold)

// Target users:
// - NFT platforms
// - Web3 dApps
// - content creators
// - Web3 games
// - video streaming

// API endpoints:
// POST /upload   → add file + UCAN auth
// GET /{cid}     → retrieve
// DELETE /{cid}  → unpin
// GET /stats     → metrics

// Reliability:
// - PDP proofs continuous
// - multiple replicas
// - geographic distribution
// - SLA 99.9% uptime

// Integration:
// - IPFS Gateway
// - Helia (browser IPFS)
// - wallet apps
// - Web3 dev tools

// Future:
// - FIL+ verified integration
// - enterprise features
// - compliance (GDPR)
// - 2025 EiB scale target`}
        </pre>
        <p className="leading-7">
          Forge: <strong>$5.99/TB hot storage, IPFS compatible</strong>.<br />
          S3 대비 4x cheaper, hot access + PDP verified.<br />
          Web3 native, enterprise-ready.
        </p>
      </div>
    </section>
  );
}
