import MigrationViz from './viz/MigrationViz';

export default function HybridMigration() {
  return (
    <section id="hybrid-migration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">하이브리드 전환: ECDSA → PQ</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          양자 위협은 아직 현실화되지 않았지만, 준비는 지금 시작해야 합니다.
          ERC-4337 스마트 계정은 서명 검증 로직을 업그레이드할 수 있으므로,
          <strong>점진적 전환</strong>이 가능합니다.
        </p>
        <h3>4단계 마이그레이션</h3>
        <ol>
          <li><strong>Phase 1</strong> — AA 스마트 계정 배포, 기존 ECDSA로 운영</li>
          <li><strong>Phase 2</strong> — Dilithium 공개키 추가 등록</li>
          <li><strong>Phase 3</strong> — 하이브리드 모드: ECDSA + Dilithium 동시 검증</li>
          <li><strong>Phase 4</strong> — ECDSA 제거, PQ 전용 운영</li>
        </ol>
        <p>
          Phase 3의 하이브리드 모드는 "두 서명 모두 유효해야 통과"입니다.
          Dilithium이 깨지면 ECDSA가, ECDSA가 깨지면 Dilithium이 보호합니다.
          양쪽 모두 동시에 깨지지 않는 한 안전합니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — EOA는 프로토콜 레벨 하드포크 없이는 서명 방식을 변경할 수 없습니다.
          AA 스마트 계정만이 사용자 수준에서 양자 내성으로 전환할 수 있는 유일한 경로입니다.
        </p>
      </div>
      <div className="mt-8"><MigrationViz /></div>
    </section>
  );
}
