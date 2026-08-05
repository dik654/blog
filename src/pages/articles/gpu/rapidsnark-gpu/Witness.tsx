import { CitationBlock } from '@/components/ui/citation';
import WtnsFormatViz from './viz/WtnsFormatViz';
import R1csParseViz from './viz/R1csParseViz';

export default function Witness() {
  return (
    <section id="witness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Witness 로딩 & 메모리 매핑</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          rapidsnark의 첫 단계는 <code>.wtns</code> 파일에서 witness 값을 읽고,
          <code>.zkey</code>에서 proving key(CRS)를 로드하는 것이다.<br />
          대형 회로는 수 GB에 달하므로 <code>mmap</code>을 활용한다.
        </p>
        <WtnsFormatViz />
        <p>
          <code>.r1cs</code> 파일은 제약 행렬 A, B, C를 압축 희소 형식으로 저장한다.
          rapidsnark은 이를 파싱하여 연속 메모리에 배치하고,
          NTT/MSM 단계에서 캐시 친화적으로 접근한다.
        </p>
        <R1csParseViz />
        <CitationBlock source="circom / snarkjs — Binary File Formats" citeKey={2} type="code"
          href="https://github.com/iden3/snarkjs">
          <p className="text-xs">
            .wtns, .r1cs, .zkey는 iden3가 정의한 바이너리 형식이다.
            snarkjs와 rapidsnark이 동일 형식을 사용하므로 상호 호환된다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
