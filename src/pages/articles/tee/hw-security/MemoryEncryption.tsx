import MemEncViz from './viz/MemEncViz';
import MemEncStepViz from './viz/MemEncStepViz';

export default function MemoryEncryption() {
  return (
    <section id="memory-encryption" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 암호화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>메모리 암호화(Memory Encryption)</strong> — DRAM에 저장된 데이터를 하드웨어 수준에서 암호화<br />
          물리적 메모리 접근(콜드부트 공격, 버스 스니핑)에 대한 방어<br />
          CPU 내부에서 복호화하므로 성능 오버헤드가 최소<br />
          → <a href="/tee/tee-memory" className="text-indigo-400 hover:underline">메모리 격리 & 암호화 심층 분석 (EPC · SME · MKTME)</a>
        </p>

        <h3>AES-XTS 모드</h3>
        <p>
          XTS(XEX Tweakable Block cipher with Stealing) — 각 블록의 물리적 위치를 트윅(tweak)으로 반영<br />
          동일한 평문이라도 다른 주소에 저장되면 다른 암호문 생성
        </p>
      </div>
      <div className="not-prose mt-6">
        <MemEncStepViz />
      </div>
      <div className="not-prose mt-8">
        <MemEncViz />
      </div>
    </section>
  );
}
