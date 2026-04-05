import LookupViz from './viz/LookupViz';
import CodePanel from '@/components/ui/code-panel';
import {
  LOOKUP_ANY_CODE, lookupAnnotations,
  RLC_CODE, rlcAnnotations,
  STACK_LOOKUP_CODE, stackLookupAnnotations,
} from './LookupMechanismsData';

export default function LookupMechanisms() {
  return (
    <section id="lookup-mechanisms" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lookup 메커니즘</h2>
      <div className="not-prose mb-8"><LookupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Lookup 메커니즘은 zkEVM의 회로 간 <strong>데이터 공유와 검증</strong>을 가능하게 합니다.<br />
          Halo2의 <code>lookup_any</code>로 한 회로가 다른 회로의 테이블 데이터가 존재함을 증명합니다.<br />
          다중 컬럼은 <strong>RLC(Random Linear Combination)</strong>로 하나의 필드 원소로 압축합니다.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-3">RLC 압축 기법</h3>
        <CodePanel title="RLC 구현 & Challenges" code={RLC_CODE}
          annotations={rlcAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">Keccak Table Lookup</h3>
        <CodePanel title="lookup_any 실제 사용" code={LOOKUP_ANY_CODE}
          annotations={lookupAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">RW Table Lookup</h3>
        <CodePanel title="stack_pop → RwTable Lookup" code={STACK_LOOKUP_CODE}
          annotations={stackLookupAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Lookup의 수학적 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Plookup protocol (Gabizon, Williamson 2020)
// "multiset equality"로 lookup 증명

// 목표: (a_1, a_2, ..., a_n)가 table T의 subset임을 증명
// Naive: O(n×m) constraints (n=lookups, m=table size)
// Plookup: O(n+m) constraints

// 핵심 아이디어
// 1) 동적 수열 f 구성 (lookup values)
// 2) 정적 수열 t (lookup table)
// 3) 새 수열 s = sort(f ∪ t)
// 4) "다음 원소가 현재와 같거나 t의 원소" 제약

// Halo2의 개선
// - Permutation argument 활용
// - Multi-column lookup 지원
// - GPU 친화적

// Lookup usage in zkEVM
// 1) Range check (0 <= x < 256)
// 2) Bytecode lookup (PC → opcode)
// 3) Keccak hash verification
// 4) RwTable access (read/write history)
// 5) MPT node hashing

// 효과
// - 복잡한 constraint을 table로 대체
// - 회로 rows 크게 감소
// - Verifier cost 동일 (lookup 개수와 무관)`}</pre>

      </div>
    </section>
  );
}
