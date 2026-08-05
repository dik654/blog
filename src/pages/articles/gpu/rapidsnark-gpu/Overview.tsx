import { CitationBlock } from '@/components/ui/citation';
import RapidsnarkArchViz from './viz/RapidsnarkArchViz';
import RapidsnarkPerfViz from './viz/RapidsnarkPerfViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">rapidsnark 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>rapidsnark</strong>은 iden3(Polygon ID 팀)이 개발한 고성능 Groth16 증명자다.
          circom 컴파일러가 생성한 <code>.r1cs</code>와 <code>.wtns</code> 파일을 입력받아
          zk-SNARK 증명을 생성한다.
        </p>
        <p>
          snarkjs(JavaScript)와 동일한 Groth16 프로토콜을 구현하지만,
          C++ 코어와 x86 어셈블리 필드 연산으로 <strong>40~100배</strong> 빠르다.<br />
          Polygon ID, Worldcoin, Semaphore 등 circom 기반 프로젝트에서 프로덕션 증명자로 사용된다.
        </p>
        <RapidsnarkArchViz />
        <RapidsnarkPerfViz />
        <CitationBlock source="iden3/rapidsnark GitHub" citeKey={1} type="code"
          href="https://github.com/iden3/rapidsnark">
          <p className="text-xs">
            rapidsnark은 ffiasm이 생성한 x86-64 어셈블리로 BN128 필드 연산을 수행한다.<br />
            GMP 대비 4~5배 빠른 Montgomery 곱셈이 전체 성능 향상의 기반이다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
