import SMEArchitectureViz from './viz/SMEArchitectureViz';
import SMECompareViz from './viz/SMECompareViz';

export default function SMEArchitecture() {
  return (
    <section id="sme-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SME 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SME(Secure Memory Encryption)</strong>는 AMD EPYC의 메모리 암호화 기술입니다.<br />
          페이지 테이블의 <strong>C-bit</strong>로 페이지 단위 암호화 여부를 제어합니다.<br />
          TME(Transparent Memory Encryption)는 전체 DRAM을 단일 키로
          투명하게 암호화하는 단순화 모드입니다.
        </p>
      </div>

      <SMEArchitectureViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>SME vs TME 비교</h3>
      </div>
      <SMECompareViz />
    </section>
  );
}
