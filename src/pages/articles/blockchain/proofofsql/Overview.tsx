import ArchViz from './viz/ArchViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Proof of SQL</strong>은 영지식 증명과 SQL 처리를 통합한 시스템입니다.<br />
          SQL 쿼리의 실행 결과가 올바른지를 <strong>원본 데이터를 노출하지 않고</strong> 증명할 수 있습니다.<br />
          Sumcheck 프로토콜과 HyperKZG/DORY commitment 스킴을 핵심으로 사용하며,
          Ethereum 온체인에서 Solidity로 검증할 수 있습니다.
        </p>
        <h3>핵심 혁신</h3>
        <ul>
          <li><strong>SQL-to-Polynomial</strong> -- SQL 연산을 다항식으로 자동 변환</li>
          <li><strong>로그 크기 증명</strong> -- 데이터 크기에 O(log m) 비례하는 증명</li>
          <li><strong>다층 보안</strong> -- 수학적 가정부터 프로토콜까지 전방위 보안</li>
          <li><strong>GPU 가속</strong> -- Blitzar 라이브러리로 commitment 병렬 처리</li>
        </ul>
        <h3>데이터 플로우</h3>
        <p>
          사용자 SQL &rarr; 파서(AST) &rarr; 증명 계획 &rarr; 데이터 접근 &rarr;
          Commitment 생성 &rarr; Sumcheck 증명 &rarr; Inner Product 증명 &rarr; 검증 완료.
          전체 파이프라인이 Rust로 구현되어 있고, 검증만 Solidity로 온체인 실행됩니다.
        </p>
      </div>
      <div className="mt-8"><ArchViz /></div>
    </section>
  );
}
