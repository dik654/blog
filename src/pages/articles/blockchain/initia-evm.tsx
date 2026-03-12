import Overview from './initia-evm/Overview';
import Architecture from './initia-evm/Architecture';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[Initia GitHub]</strong> github.com/initia-labs/minievm
            — 듀얼 상태 동기화, 저널링/RunAtomic, ERC20 이중 표현
          </li>
          <li>
            <strong>[Initia 문서]</strong> docs.initia.xyz
            — Interwoven Rollup 아키텍처, OPinit 스택, L1/Minitia 구조
          </li>
          <li>
            <strong>[DeepWiki]</strong> deepwiki.com/initia-labs/minievm
            — ICosmos 인터페이스, 프리컴파일 카테고리, 가스 바이패스 메커니즘
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function InitiaEVMArticle() {
  return (
    <>
      <Overview />
      <Architecture />
      <References />
    </>
  );
}
