import CodePanel from '@/components/ui/code-panel';
import R1CSConstraintViz from './viz/R1CSConstraintViz';
import R1CStoQAPViz from './viz/R1CStoQAPViz';
import { PIPELINE_CODE, FORMAL_DEF_CODE, BUILDER_CODE, WITNESS_CODE } from './R1CSData';

export default function R1CS() {
  return (
    <section id="r1cs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS (Rank-1 Constraint System)</h2>
      <div className="not-prose mb-8"><R1CSConstraintViz /></div>
      <h3 className="text-lg font-semibold mb-3">R1CS → QAP 변환 파이프라인</h3>
      <div className="not-prose mb-8"><R1CStoQAPViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">ZK 증명의 중간 표현</h3>
        <p>ZK 증명(Zero-Knowledge Proof) — 비밀 x를 공개하지 않고 f(x) = y임을 증명하는 것이 목표<br />
        R1CS — 임의의 계산을 증명 시스템이 이해하는 형태로 번역하는 중간 표현(IR)</p>
        <CodePanel title="ZK 증명 파이프라인" code={PIPELINE_CODE} />

        <h3 className="text-xl font-semibold mt-6 mb-3">형식적 정의</h3>
        <p>체(Field) F 위의 R1CS 인스턴스 — 행렬 A, B, C와 witness(비밀 입력) 벡터 s로 구성<br />
        각 제약은 곱셈 게이트 하나를 표현. <strong>덧셈은 무료(선형결합)</strong>, 곱셈만 비용 발생</p>
        <CodePanel
          title="R1CS 형식적 정의"
          code={FORMAL_DEF_CODE}
          annotations={[
            { lines: [1, 1], color: 'sky', note: '단일 제약 형태' },
            { lines: [3, 6], color: 'emerald', note: '행렬 형태와 변수 구조' },
            { lines: [8, 11], color: 'amber', note: '변수 분할 (One / Instance / Witness)' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">ConstraintSystem 빌더</h3>
        <p>회로 빌드 인터페이스 — 변수 할당 → 제약 추가 → 만족 여부 확인</p>
        <CodePanel
          title="ConstraintSystem 사용 예시 (Rust)"
          code={BUILDER_CODE}
          annotations={[
            { lines: [1, 4], color: 'sky', note: '변수 할당 (비공개/공개)' },
            { lines: [6, 10], color: 'emerald', note: '곱셈 게이트 제약 추가' },
            { lines: [12, 13], color: 'violet', note: '만족 여부 검증' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Witness 생성</h3>
        <p>Witness 생성 — 함수를 실제로 실행하는 것과 동일<br />
        증명자(Prover) — f(x) 계산으로 전체 witness 벡터 채움<br />
        검증자(Verifier) — 계산 없이 증명만으로 f(x)=y 확인</p>
        <CodePanel
          title="Witness 벡터 구성 예시"
          code={WITNESS_CODE}
          annotations={[
            { lines: [3, 7], color: 'sky', note: '중간값 계산으로 벡터 채우기' },
            { lines: [9, 10], color: 'emerald', note: '곱셈만 제약, 덧셈은 흡수' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">비선형 연산의 제약 비용</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>덧셈 a + b</strong>: 0개 (무료 — 선형결합으로 흡수)</li>
          <li><strong>곱셈 a * b</strong>: 1개</li>
          <li><strong>거듭제곱 a^n</strong>: ~log₂(n)개 (square-and-multiply)</li>
          <li><strong>비트 분해</strong>: ~254개 (각 비트에 boolean 제약)</li>
          <li><strong>Poseidon hash</strong>: ~250개 (ZK-friendly)</li>
          <li><strong>SHA-256</strong>: ~25,000개 (비트 연산 기반 → 비효율)</li>
        </ul>
      </div>
    </section>
  );
}
