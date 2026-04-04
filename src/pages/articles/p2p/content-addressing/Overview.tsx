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
    </section>
  );
}
