import ForkIDValidationViz from './viz/ForkIDValidationViz';
import ENRLayoutViz from './viz/ENRLayoutViz';

export default function CRC32ENR() {
  return (
    <section id="crc32-enr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CRC32와 ENR 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          ENR 300바이트 제한 때문에 SHA256(32B) 대신 CRC32(4B) 사용.<br />
          보안 목적 아닌 호환성 체크 — 충돌 저항성보다 컴팩트함이 중요
        </p>
      </div>
      <div className="not-prose mb-8"><ForkIDValidationViz /></div>
      <div className="not-prose"><ENRLayoutViz /></div>
    </section>
  );
}
