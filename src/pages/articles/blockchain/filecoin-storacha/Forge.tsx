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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Features</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>즉시 리트리벌, sealing 지연 없음</li>
              <li>HTTP gateway + S3-compatible API</li>
              <li>UCAN 인증</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">가격 비교</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Forge: <code className="text-xs bg-background px-1 rounded">$5.99/TB/mo</code></li>
              <li>Pinata: $20 (3x 비쌈)</li>
              <li>AWS S3: $23 (4x 비쌈)</li>
              <li>Filecoin cold: $0.50 (용도 상이 — hot vs cold)</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">API Endpoints</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs bg-background px-1 rounded">POST /upload</code> — 파일 추가 + UCAN 인증</li>
              <li><code className="text-xs bg-background px-1 rounded">GET /&#123;cid&#125;</code> — 파일 조회</li>
              <li><code className="text-xs bg-background px-1 rounded">DELETE /&#123;cid&#125;</code> — 언핀</li>
              <li><code className="text-xs bg-background px-1 rounded">GET /stats</code> — 메트릭 조회</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Reliability</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>PDP proofs 지속 생성</li>
              <li>다중 replica + 지리적 분산</li>
              <li>SLA 99.9% uptime</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Target Users</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>NFT platforms, Web3 dApps</li>
              <li>content creators, Web3 games</li>
              <li>video streaming</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Integration &amp; Future</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>IPFS Gateway, Helia (browser IPFS)</li>
              <li>wallet apps, Web3 dev tools</li>
              <li>FIL+ verified, GDPR compliance</li>
              <li>2025 EiB scale target</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Forge: <strong>$5.99/TB hot storage, IPFS compatible</strong>.<br />
          S3 대비 4x cheaper, hot access + PDP verified.<br />
          Web3 native, enterprise-ready.
        </p>
      </div>
    </section>
  );
}
