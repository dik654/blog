import AddressingCompareViz from './viz/AddressingCompareViz';

export default function Overview() {
  const comparisons = [
    { aspect: '식별 기준', location: 'URL (서버 주소 + 경로)', content: '해시 (내용 자체의 지문)' },
    { aspect: '데이터 무결성', location: '보장 없음 (내용 변경 가능)', content: '자동 검증 (해시 불일치 = 변조)' },
    { aspect: '중복 제거', location: '불가 (같은 파일 다른 URL)', content: '자동 (같은 내용 = 같은 해시)' },
    { aspect: '영속성', location: '서버 다운 = 접근 불가', content: '누구든 보유하면 접근 가능' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: 위치 vs 내용 주소</h2>
      <div className="not-prose mb-8"><AddressingCompareViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          전통적 웹은 <strong>위치 주소 지정</strong>을 사용합니다.<br />
          URL이 데이터가 <em>어디에</em> 있는지 가리킵니다.<br />
          <strong>내용 주소 지정</strong>은 데이터의 <em>내용</em>으로 식별합니다.<br />
          내용의 해시가 곧 주소이므로, 변조 여부를 자동으로 검증할 수 있습니다.
        </p>
      </div>
      <div className="overflow-x-auto not-prose my-6">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border">
              {['', '위치 주소 (URL)', '내용 주소 (CID)'].map(h => (
                <th key={h} className="text-left py-2 px-3 font-mono text-foreground/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisons.map(c => (
              <tr key={c.aspect} className="border-b border-border/30">
                <td className="py-2 px-3 font-mono font-bold text-foreground/70">{c.aspect}</td>
                <td className="py-2 px-3 text-foreground/60">{c.location}</td>
                <td className="py-2 px-3 text-foreground/80">{c.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          IPFS, iroh, BitTorrent 모두 내용 주소 지정을 사용합니다.<br />
          IPFS는 CID(Content Identifier), BitTorrent는 infohash로 데이터를 식별합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Content-Addressable Storage (CAS)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Content-Addressable vs Location-Based
//
// Location-based (HTTP/URL):
//   URL: https://example.com/file.pdf
//   - 서버 위치 + 경로
//   - 서버 관리자가 내용 변경 가능
//   - 서버 다운 시 접근 불가
//   - 동일 파일이 여러 URL 가능
//
// Content-addressable (IPFS):
//   CID: QmWmyoMoctfbAaiEs2G46gpeUmhqFR3vCRu...
//   - 내용의 해시
//   - 변경 = 다른 CID (불변)
//   - 누구나 호스팅 가능
//   - 동일 내용 = 동일 CID (자동 dedup)

// CAS의 핵심 특성:
//
// 1. Immutability
//    한번 쓰면 변경 불가
//    Audit log, version control에 적합
//
// 2. Deduplication
//    같은 내용 = 같은 주소 = 1회만 저장
//    스토리지 효율
//
// 3. Integrity
//    Verify: hash(content) == address
//    변조 감지 자동
//
// 4. Distribution
//    누구나 동일 CID로 서빙 가능
//    CDN-like, no trust needed
//
// 5. Privacy
//    주소 = 해시 = high entropy
//    Guessing 불가

// 역사:
//   1991: Content-addressable memory (hardware)
//   1996: Magnet URIs
//   2001: BitTorrent (infohash)
//   2006: Amazon S3 (optional)
//   2015: IPFS (v1.0)
//   2021: iroh, Lotus, others

// 응용:
//   - Decentralized web (IPFS, iroh)
//   - Container registries (OCI)
//   - Git (blob storage)
//   - Backup systems
//   - Package managers (npm shrinkwrap)
//   - NFT metadata
//   - Science data archives

// Trade-offs:
//   ✓ 불변, 검증 가능, 중복 제거
//   ✗ "최신 버전" 업데이트 어려움 (IPNS, DNSLink 필요)
//   ✗ 초기 조회 느림 (해시 알아야)
//   ✗ Garbage collection 복잡`}
        </pre>
      </div>
    </section>
  );
}
