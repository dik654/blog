import SEVBasicsViz from './viz/SEVBasicsViz';
import EncryptionFlowViz from './viz/EncryptionFlowViz';

export default function SEVBasics() {
  return (
    <section id="sev-basics" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SEV 기본 메커니즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SEV 핵심 — <strong>AES-128 메모리 암호화</strong><br />
          SME/TME 엔진이 CPU-DRAM 간 모든 데이터를 실시간 암호화/복호화<br />
          각 VM은 <strong>고유한 암호화 키</strong> 보유<br />
          페이지 테이블 C-bit가 페이지별 암호화 여부 제어
        </p>
      </div>

      <SEVBasicsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>하드웨어 레벨 암호화 흐름</h3>
        <p>
          소프트웨어 수정 없이 투명 동작 — 메모리 컨트롤러 통합으로 ~2% 성능 오버헤드
        </p>
      </div>
      <EncryptionFlowViz />
    </section>
  );
}
