import LookupViz from './viz/LookupViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Lookup({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="lookup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Plookup (Lookup Arguments)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          range check를 boolean 게이트로 하면 비트 수만큼 제약 — 비효율적
          <br />
          Plookup: "이 값이 테이블에 있는가?"를 grand product 한 번으로 증명
          <br />
          XOR, AND, 비트 분해 등 비산술 연산에 핵심적
        </p>
        <p className="leading-7">
          LookupTable: range_table(n) = {'{0, 1, ..., 2^n - 1}'}, xor_table(n) = 인코딩된 (a, b, a^b)
          <br />
          sorted merge: f(조회값) ∪ T(테이블)를 T 순서로 정렬 → h1, h2로 분리
          <br />
          h1[last] = h2[0] 중첩 — 연속 쌍이 전체 sorted list를 빠짐없이 커버하는 핵심
        </p>
      </div>
      <div className="not-prose mb-8">
        <LookupViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Fr에 Ord/Hash가 없어 to_repr limb 비교로 정렬 — 비표준 대소 관계지만 일관성만 보장되면 충분
          <br />
          다중 컬럼 테이블은 alpha 인코딩: v = a + alpha*b + alpha^2*c — alpha = 2^bits로 겹침 방지
          <br />
          compute_plookup에서 도메인 크기를 max(|T|, |f|+1)로 자동 결정 — 사용자가 패딩 고민 불필요
        </p>
      </div>
    </section>
  );
}
