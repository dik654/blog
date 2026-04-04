export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: discv4의 한계 → discv5</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          discv4의 한계: 평문 통신(도청 가능), reflection 공격, 서비스 광고 기능 없음.
          <br />
          discv5는 이 모든 문제를 해결한다.
        </p>
        <p>
          핵심 변경점:
          <br />
          <strong>WHOAREYOU 핸드셰이크</strong> — 세션 키 교환 후 AES-GCM 암호화.
          <br />
          <strong>FINDNODE(distances)</strong> — 특정 거리의 노드만 요청 (기존: 공개키 기반).
          <br />
          <strong>TALKREQ/TALKRESP</strong> — 확장 프로토콜 (portal network 등).
        </p>
        <p>
          go-ethereum <code>v5_udp.go</code> + <code>v5wire/</code> 패키지에서 구현.
          <br />
          현재 Ethereum 메인넷은 discv4/discv5를 병용 중.
        </p>
      </div>
    </section>
  );
}
