import ScalarViz from './viz/ScalarViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Scalar({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="scalar" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fr 스칼라 필드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Fr은 BN254 곡선의 위수(order) r로 정의된 필드
          <br />
          Fp와 100% 동일한 구조 — 다른 것은 모듈러스(p vs r) 하나뿐
          <br />
          define_prime_field! 매크로에 상수만 넣으면 전체 산술 자동 생성
        </p>
        <p className="leading-7">
          ZK 증명에서 Fr의 역할: R1CS witness, QAP 다항식 계수, 증명 원소
          <br />
          Groth16/PLONK 프로버가 수행하는 모든 다항식 연산이 Fr 위에서 이루어짐
        </p>
      </div>
      <div className="not-prose mb-8">
        <ScalarViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Fp를 수동 구현(학습용)하고, Fr은 매크로로 재사용 — 코드 400줄 → 40줄
          <br />
          다른 곡선(BLS12-381 등)으로 전환 시 상수만 교체하면 됨
          <br />
          매크로 내부에서 INV를 Newton법으로 컴파일 타임 자동 계산 — 수동 계산 불필요
        </p>
      </div>
    </section>
  );
}
