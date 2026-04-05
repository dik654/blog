import CodePanel from '@/components/ui/code-panel';
import GatewayFlowViz from './viz/GatewayFlowViz';
import { GATEWAY_CODE, GATEWAY_ANNOTATIONS, GATEWAY_TYPES } from './GatewayData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Gateway({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="gateway" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Gateway</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          IPFS HTTP 게이트웨이는 웹 브라우저와 HTTP 클라이언트가
          IPFS 콘텐츠에 접근할 수 있게 하는 <strong>HTTP-to-IPFS 브리지</strong>입니다.<br />
          IPFS 경로를 HTTP URL로 변환하고, 콘텐츠를 표준 HTTP 응답으로 제공합니다.
        </p>
        <h3>게이트웨이 유형</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">유형</th>
                <th className="text-left p-2">URL 형식</th>
                <th className="text-left p-2">특징</th>
              </tr>
            </thead>
            <tbody>
              {GATEWAY_TYPES.map((g) => (
                <tr key={g.name} className="border-b border-muted">
                  <td className="p-2 font-mono text-xs">{g.name}</td>
                  <td className="p-2 font-mono text-xs">{g.url}</td>
                  <td className="p-2">{g.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>NoFetch 모드</h3>
        <p>
          <code>Gateway.NoFetch = true</code> 설정 시 네트워크 블록을 가져오지 않고
          로컬 블록만 서빙합니다.<br />
          대역폭 제한 환경이나 프라이빗 게이트웨이에 유용합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('kubo-gateway-option', codeRefs['kubo-gateway-option'])} />
            <span className="text-[10px] text-muted-foreground self-center">GatewayOption</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-gateway-backend', codeRefs['kubo-gateway-backend'])} />
            <span className="text-[10px] text-muted-foreground self-center">Gateway Backend</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-serve-option', codeRefs['kubo-serve-option'])} />
            <span className="text-[10px] text-muted-foreground self-center">ServeOption 체인</span>
          </div>
        )}
        <CodePanel title="게이트웨이 핸들러 등록" code={GATEWAY_CODE} annotations={GATEWAY_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">IPFS Gateway 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// IPFS HTTP Gateway Types
//
// 1. Path Gateway (legacy):
//    https://ipfs.io/ipfs/<CID>
//    https://ipfs.io/ipns/<name>
//    → Same-origin policy issues
//    → XSS risks (내용 실행 가능)
//
// 2. Subdomain Gateway (recommended):
//    https://<CID>.ipfs.dweb.link
//    https://<name>.ipns.dweb.link
//    → Origin isolation per CID
//    → Better security
//
// 3. DNSLink Gateway:
//    https://example.com (if DNSLink configured)
//    DNS TXT record: dnslink=/ipfs/<CID>
//    → Custom domain support
//    → Browser friendly

// Gateway URL Patterns:
//
//   /ipfs/{cid}              - immutable content
//   /ipfs/{cid}/{path}       - path within DAG
//   /ipns/{name}             - mutable pointer
//   /ipns/{name}/{path}
//   /api/v0/*                - RPC API (HTTP)

// Response Handling:
//
//   UnixFS file → HTTP body (stream)
//   UnixFS directory → HTML listing (or index.html)
//   Raw block → binary
//   Dag-json/cbor → JSON/CBOR
//
// Headers:
//   ETag: Content's immutable hash
//   Cache-Control: public, max-age=29030400
//   X-Ipfs-Path, X-Ipfs-Roots
//   Content-Type: auto-detected
//   Content-Length
//   Accept-Ranges: bytes

// Streaming (Range Requests):
//   Video, audio, large files
//   HTTP Range: bytes=1000000-2000000
//   Gateway fetches only needed blocks
//   → Efficient partial download

// Trustless Gateway (draft):
//   Verifiable responses
//   Client verifies hash
//   No trust in gateway needed
//
//   Formats:
//     application/vnd.ipld.raw (raw block)
//     application/vnd.ipld.car (CAR file)
//
//   Client reconstructs + verifies DAG

// Public Gateways:
//   ipfs.io, cf-ipfs.com
//   dweb.link
//   cloudflare-ipfs.com
//   pinata.cloud, fleek.co
//   4everland.io, nft.storage

// Self-hosted Gateway:
//   Kubo daemon (127.0.0.1:8080)
//   Path: 127.0.0.1:8080/ipfs/<cid>
//   Custom gateway: custom-domain setup

// Configuration:
//   Gateway.PublicGateways: domain mapping
//   Gateway.NoFetch: serve only local blocks
//   Gateway.DeserializedResponses: 자동 렌더링`}
        </pre>
      </div>
      <div className="mt-8"><GatewayFlowViz /></div>
    </section>
  );
}
