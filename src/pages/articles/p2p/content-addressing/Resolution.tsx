import ResolutionViz from './viz/ResolutionViz';
import CodePanel from '@/components/ui/code-panel';

const resCode = `// 이름 해석 (Name Resolution)
// CID는 불변이므로 "최신 버전"을 가리킬 수 없음
// → 가변 포인터(Mutable Pointer) 필요

// IPNS (InterPlanetary Name System):
//   /ipns/<PeerID> → CID 매핑
//   공개키로 서명된 레코드를 DHT에 발행
//   레코드: { Value: "/ipfs/bafyNew", Seq: 42, Validity: ... }
//   구독자가 DHT에서 최신 CID를 조회

// DNSLink:
//   _dnslink.example.com TXT "dnslink=/ipfs/bafyABC"
//   DNS 레코드로 CID 매핑 → 브라우저 호환
//   TLS 인증서와 결합 가능

// iroh의 경우:
//   NodeID(공개키) 기반 발견 → Pkarr DHT에 주소 발행
//   CID 대신 BLAKE3 해시 사용, 별도 IPNS 없음`;

const resAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [4, 8], color: 'sky', note: 'IPNS — DHT 기반 가변 포인터' },
  { lines: [10, 13], color: 'emerald', note: 'DNSLink — DNS TXT 레코드로 CID 매핑' },
  { lines: [15, 17], color: 'amber', note: 'iroh — NodeID + Pkarr DHT' },
];

export default function Resolution() {
  return (
    <section id="resolution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이름 해석: IPNS & DNSLink</h2>
      <div className="not-prose mb-8"><ResolutionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CID는 내용 기반이므로 불변입니다.<br />
          웹사이트처럼 "최신 버전"을 가리키려면 가변 포인터가 필요합니다.<br />
          IPNS는 DHT 기반 이름 시스템, DNSLink는 DNS 레코드를 사용합니다.
        </p>
        <CodePanel title="이름 해석 방식" code={resCode}
          annotations={resAnnotations} />
        <p className="leading-7">
          IPFS Kubo는 IPNS 레코드를 DHT에 발행하고,
          ipfs.io 게이트웨이는 DNSLink로 도메인을 IPFS 콘텐츠에 매핑합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">이름 해석 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Name Resolution Systems
//
// 1. IPNS (InterPlanetary Name System)
//
// 구조:
//   /ipns/<PeerID> → /ipfs/<CID>
//
// 레코드:
//   {
//     Value: "/ipfs/bafyXXX",  // 현재 CID
//     Sequence: 42,             // 버전
//     Validity: "2025-01-01T00:00:00Z",
//     ValidityType: EOL,
//     Signature: <bytes>,       // private key로 서명
//     PublicKey: <bytes>,
//     IpnsSignature_V2: <bytes>
//   }
//
// 게시 과정:
//   1. ipfs name publish <CID>
//   2. 로컬에서 레코드 생성 + 서명
//   3. DHT에 저장 (PeerID → Record)
//   4. 구독자가 DHT 조회
//
// 문제:
//   - DHT 느림 (수 초)
//   - 레코드 갱신 느림
//   - 오프라인 시 접근 불가
//
// 최적화:
//   - Pubsub for instant updates
//   - TTL 조정
//   - IPNS over DHT + Pubsub

// 2. DNSLink
//
// 구조:
//   _dnslink.example.com  TXT "dnslink=/ipfs/bafyXXX"
//   _dnslink.example.com  TXT "dnslink=/ipns/k51qzi..."
//
// 장점:
//   - 기존 DNS infrastructure
//   - 빠른 resolution (cache)
//   - TLS cert 연동
//   - 브라우저 친화적
//
// 단점:
//   - 중앙화 (DNS 서버 신뢰)
//   - 도메인 소유권 필요

// 3. ENS (Ethereum Name Service)
//
// 구조:
//   vitalik.eth → IPFS hash
//   ENS Contract stores hash
//
// 장점:
//   - 탈중앙화 (blockchain)
//   - 권한 검증 명확
//   - 다른 레코드 (ETH 주소, etc.)
//
// 4. iroh Approach:
//
// NodeID (Ed25519 pubkey) 기반
// - 서명된 레코드 → Pkarr (DNS over DHT)
// - Relay URL 전파
// - Direct dial with NodeID

// 5. 웹 게이트웨이 (Gateway)
//
//   https://ipfs.io/ipfs/<CID>
//   https://dweb.link/ipfs/<CID>
//   https://<CID>.ipfs.dweb.link  (subdomain)
//
//   - HTTP로 IPFS 접근
//   - 중앙화 trade-off
//   - 브라우저 호환성
//   - Cloudflare, Fleek, Pinata

// 미래 방향:
//   - IPIP-366: IPNS on Pubsub (faster)
//   - Trustless gateways
//   - Browser native IPFS (Brave)`}
        </pre>
      </div>
    </section>
  );
}
