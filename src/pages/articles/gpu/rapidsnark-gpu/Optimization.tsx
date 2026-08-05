import { CitationBlock } from '@/components/ui/citation';
import RsOptViz from './viz/RsOptViz';
import Groth16CompareViz from './viz/Groth16CompareViz';

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">최적화: 메모리 풀, 스트림 겹침</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          rapidsnark의 성능은 네 가지 최적화에서 나온다.
          ffiasm 어셈블리 필드 연산, 멀티스레드 NTT, GPU 메모리 풀, CRS 사전 변환이다.
        </p>
        <RsOptViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">프레임워크 비교</h3>
        <p>
          circom 생태계에서 rapidsnark은 CPU 최고 속도를 제공한다.<br />
          GPU 모드를 활성화하면 MSM 병목이 해소되어 bellperson 수준에 도달한다.
        </p>
        <Groth16CompareViz />
        <CitationBlock source="iden3/rapidsnark — Build & Benchmark" citeKey={4} type="code"
          href="https://github.com/iden3/rapidsnark">
          <p className="text-xs">
            rapidsnark 서버 모드(prover_server)는 .zkey를 메모리에 상주시켜
            연속 증명 요청에서 로딩 오버헤드를 제거한다.<br />
            Polygon ID는 이 모드로 모바일 인증 증명을 초 단위로 생성한다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
