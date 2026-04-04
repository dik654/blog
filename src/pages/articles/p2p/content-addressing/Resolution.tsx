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
      </div>
    </section>
  );
}
