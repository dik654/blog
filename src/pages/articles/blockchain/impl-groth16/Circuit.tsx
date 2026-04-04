import CircuitViz from './viz/CircuitViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Circuit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="circuit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">회로 작성 (Circuit)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Circuit trait — synthesize(&self, cs) 하나만 구현하면 setup/prove/verify 모두에서 재사용
          <br />
          alloc_instance로 공개 변수, alloc_witness로 비공개 변수 할당
          <br />
          enforce(a, b, c)로 곱셈 제약 추가 — 덧셈은 LC 빌더 패턴으로 무료
        </p>
        <p className="leading-7">
          예시: f(x) = x^3 + x + 5 = y — 곱셈 2개 + 덧셈 1개
          <br />
          보조 변수 t1(x^2), t2(x^3)를 도입하여 곱셈마다 제약 하나
          <br />
          마지막 제약에서 .add()로 x와 상수 5를 연결 — 추가 제약 없이 선형결합으로 표현
        </p>
      </div>
      <div className="not-prose mb-8">
        <CircuitViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          LC 빌더 패턴 — .add(coeff, var) 체이닝으로 선형결합을 유연하게 구성
          <br />
          조건문(if-else)도 R1CS로 표현 가능: b·(1-b)=0(부울) + b·(x-y)=t + (y+t)·1=result
          <br />
          is_satisfied()로 회로 디버깅 → which_unsatisfied()로 실패 제약 위치 확인
        </p>
      </div>
    </section>
  );
}
