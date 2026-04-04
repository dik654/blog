import CodePanel from '@/components/ui/code-panel';
import E2EPipelineViz from './viz/E2EPipelineViz';
import { E2E_CODE, PROVE_FLOW_CODE, VERIFY_FLOW_CODE, BENCHMARK_CODE } from './ProofGenVerifyData';

export default function ProofGenVerify() {
  return (
    <section id="proof-gen-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 생성 및 검증</h2>
      <div className="not-prose mb-8"><E2EPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">E2E 파이프라인</h3>
        <p>회로 작성부터 검증까지 <strong>5단계</strong>로 구성된다. 컴파일과 키생성은 1회, 증명·검증은 매번 수행한다.</p>
        <CodePanel title="전체 파이프라인" code={E2E_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: '1회성: 회로 + 컴파일 + 키' },
            { lines: [4, 5], color: 'emerald', note: '반복: 증명 + 검증' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">증명 생성</h3>
        <p>5-Round 프로토콜의 복잡도는 <strong>O(n log n)</strong>이다. FFT/IFFT가 지배적이다.</p>
        <CodePanel title="증명 생성 흐름" code={PROVE_FLOW_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'witness → commit → open' },
            { lines: [5, 6], color: 'amber', note: '시간/공간 복잡도' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">검증</h3>
        <p>검증자는 <strong>상수 시간 O(1)</strong>으로 증명을 검증한다. 페어링 2회와 소수의 스칼라 곱만 필요하다.</p>
        <CodePanel title="검증 흐름" code={VERIFY_FLOW_CODE}
          annotations={[
            { lines: [1, 2], color: 'violet', note: 'Fiat-Shamir → KZG check' },
            { lines: [4, 5], color: 'emerald', note: 'O(1) 시간/공간' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">성능 벤치마크</h3>
        <CodePanel title="PLONK 성능" code={BENCHMARK_CODE}
          annotations={[
            { lines: [1, 5], color: 'sky', note: '증명 시간은 O(n log n)' },
            { lines: [5, 5], color: 'emerald', note: '검증/크기는 회로 무관!' },
          ]} />
      </div>
    </section>
  );
}
