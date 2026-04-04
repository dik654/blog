import CodePanel from '@/components/ui/code-panel';
import CircuitCompileViz from './viz/CircuitCompileViz';
import { CIRCUIT_CODE, PREPROCESS_CODE, SRS_GEN_CODE, KEYGEN_CODE } from './CircuitCompilationData';

export default function CircuitCompilation() {
  return (
    <section id="circuit-compilation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">회로 컴파일</h2>
      <div className="not-prose mb-8"><CircuitCompileViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">회로 구성</h3>
        <p>Composer API로 <strong>게이트와 와이어</strong>를 정의한다. 산술, 범위, 논리 게이트를 조합하여 원하는 연산을 표현한다.</p>
        <CodePanel title="회로 구성" code={CIRCUIT_CODE}
          annotations={[
            { lines: [1, 4], color: 'sky', note: '변수 할당 + 게이트 추가' },
            { lines: [5, 6], color: 'emerald', note: '완성된 회로' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">전처리</h3>
        <p>게이트의 선택자 값을 <strong>Lagrange 보간</strong>하여 다항식으로 변환하고, KZG로 커밋한다.</p>
        <CodePanel title="전처리 단계" code={PREPROCESS_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: '선택자 다항식 보간' },
            { lines: [4, 5], color: 'amber', note: '순열 다항식' },
            { lines: [6, 7], color: 'violet', note: 'KZG 커밋 → vk에 포함' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">SRS 생성</h3>
        <CodePanel title="SRS (Structured Reference String)" code={SRS_GEN_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'MPC로 τ 생성' },
            { lines: [3, 4], color: 'rose', note: 'τ는 폐기 (toxic waste)' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">키 생성</h3>
        <p>SRS + 전처리 결과로 <strong>Prover Key</strong>와 <strong>Verifier Key</strong>를 생성한다.</p>
        <CodePanel title="pk / vk 생성" code={KEYGEN_CODE}
          annotations={[
            { lines: [1, 3], color: 'emerald', note: 'pk — 증명에 필요한 모든 것' },
            { lines: [5, 9], color: 'violet', note: 'vk — 검증 최소 정보' },
          ]} />
      </div>
    </section>
  );
}
