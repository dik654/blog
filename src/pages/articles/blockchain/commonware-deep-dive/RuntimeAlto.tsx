import RuntimeAltoViz from './viz/RuntimeAltoViz';

export default function RuntimeAlto() {
  return (
    <section id="runtime-alto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">결정론적 시뮬레이션 & 채택 현황</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <strong>결정론적 시뮬레이션</strong> — Commonware 품질 보증의 핵심
          <br />
          동일 시드 → 동일 실행 순서 (네트워크 파티션, 비잔틴 장애, 링크 손실 포함)
          <br />
          디버거에서 단계별 실행 · 완전 재현 · 모든 커밋에서 자동 실행 · 90%+ 커버리지
        </p>
        <p className="leading-7">
          <strong>채택 현황</strong>:
          Tempo — simplex + broadcast + storage 사용, 테스트넷 운영 중
          <br />
          Bridge 예제 — threshold_simplex + p2p + bls12381 조합 데모
          <br />
          <strong>향후 로드맵</strong>:
          QMDB 통합 · 추가 프리미티브 · MCP 서버(LLM 개발자 경험)
        </p>
      </div>
      <div className="not-prose mb-8"><RuntimeAltoViz /></div>
    </section>
  );
}
