import LookupViz from './viz/LookupViz';
import M from '@/components/ui/math';

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

        {/* RLC 압축 기법 */}
        <h3 className="text-lg font-semibold mt-6 mb-3">RLC 압축 기법</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">RLC (Random Linear Combination) — 다중 컬럼 압축</p>
          <div className="mb-3">
            <M display>{'\\underbrace{\\text{RLC}(v_0, v_1, \\ldots, v_n)}_{\\text{다중 값을 단일 필드 원소로 압축}} = \\underbrace{v_0}_{\\text{첫 번째 값}} + \\underbrace{v_1 \\cdot r}_{\\text{두 번째 × 챌린지}} + \\underbrace{v_2 \\cdot r^2}_{\\text{세 번째 × 챌린지²}} + \\cdots + \\underbrace{v_n \\cdot r^n}_{\\text{마지막 × 챌린지ⁿ}}'}</M>
          </div>
          <p className="text-sm text-muted-foreground mt-2 mb-3">
            v₀~vₙ = 압축할 다중 컬럼 값 (예: tx_id, tag, address 등 여러 필드)<br />
            r = verifier가 제공하는 무작위 challenge — Schwartz-Zippel에 의해 서로 다른 값 조합은 높은 확률로 다른 RLC 결과<br />
            결과: n개 컬럼을 1개 필드 원소로 압축하여 lookup 비교 가능
          </p>
          <div className="grid gap-2">
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">구현 — <code>rlc::expr()</code></p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>multiplier</code>를 1에서 시작, 반복마다 <code>randomness</code>를 곱함.
                각 <code>expr</code>에 현재 <code>multiplier</code>를 곱해 <code>rlc</code>에 누적.
              </p>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">Challenges 구조체 — Phase별 무작위 값</p>
              <div className="grid gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                <p><code>evm_word: T</code> — EVM word RLC용</p>
                <p><code>keccak_input: T</code> — Keccak 입력 RLC용</p>
                <p><code>lookup_input: T</code> — Lookup 다중 컬럼 압축용</p>
              </div>
            </div>
          </div>
        </div>

        {/* Keccak Table Lookup */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Keccak Table Lookup</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">lookup_any 실제 사용 — Keccak 해시 검증</p>
          <div className="grid gap-2">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">입력 측 (EVM Circuit)</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>input_rlc</code>와 <code>output_rlc</code>를 <code>challenges.keccak_input()</code>으로 RLC 계산.
                4개 컬럼(<code>is_enabled</code>, <code>input_rlc</code>, <code>input_len</code>, <code>output_rlc</code>)을 <code>challenges.lookup_input()</code>으로 하나의 필드 원소로 압축.
              </p>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">테이블 측 (Keccak Circuit)</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>keccak_table.table_exprs(meta)</code>를 동일한 challenge로 RLC 계산.
                최종적으로 <code>vec![(input_expr, table_expr)]</code>로 lookup 등록.
              </p>
            </div>
            <div className="rounded border bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800 p-3">
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">의미</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <M>{'\\forall \\, \\text{input} \\in \\text{Input}: \\exists \\, \\text{row} \\in \\text{Table}: \\text{input} = \\text{row}'}</M>
                — 모든 입력 값이 테이블에 존재함을 Plonk permutation으로 효율적 증명.
              </p>
            </div>
          </div>
        </div>

        {/* RW Table Lookup */}
        <h3 className="text-lg font-semibold mt-6 mb-3">RW Table Lookup</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">stack_pop → RwTable Lookup</p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">
            <code>stack_pop(value)</code> → <code>stack_lookup(false.expr(), ...)</code> 호출.
            RW 테이블의 12개 컬럼을 RLC로 압축하여 lookup 등록.
          </p>
          <div className="grid gap-2">
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">12개 컬럼 → RLC 압축</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>rw_counter</code>, <code>is_write</code>, <code>tag</code>, <code>id</code>, <code>address</code>,
                <code>field_tag</code>, <code>storage_key</code>, <code>value</code>, <code>value_prev</code>,
                <code>aux1</code>, <code>aux2</code>를 <code>challenges.lookup_input()</code>으로 하나의 필드 원소로 압축.
              </p>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">테이블 측 + Lookup 등록</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>rw_table.table_exprs(meta)</code>를 동일 challenge로 RLC 계산 후
                <code>add_lookup("stack lookup", ...)</code>으로 등록.
              </p>
            </div>
          </div>
        </div>

        {/* Lookup의 수학적 원리 */}
        <h3 className="text-xl font-semibold mt-8 mb-3">Lookup의 수학적 원리</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">Plookup Protocol (Gabizon, Williamson 2020)</p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
            "Multiset equality"로 lookup을 증명. <M>{'(a_1, a_2, \\ldots, a_n)'}</M>이 테이블 <M>{'T'}</M>의 subset임을 증명.
          </p>
          <div className="grid gap-2 mb-3">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">핵심 아이디어</p>
              <ol className="list-decimal list-inside text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
                <li>동적 수열 <M>{'f'}</M> 구성 (lookup values)</li>
                <li>정적 수열 <M>{'t'}</M> (lookup table)</li>
                <li>새 수열 <M>{'s = \\text{sort}(f \\cup t)'}</M> 생성</li>
                <li>"다음 원소가 현재와 같거나 <M>{'t'}</M>의 원소" 제약 적용</li>
              </ol>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Naive: <M>{'O(n \\times m)'}</M> constraints → Plookup: <M>{'O(n + m)'}</M> constraints
              </p>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Halo2의 개선</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Permutation argument 활용 / Multi-column lookup 지원 / GPU 친화적
              </p>
            </div>
          </div>
          <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">zkEVM에서의 Lookup 활용</p>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <p>Range check (<M>{'0 \\leq x < 256'}</M>)</p>
              <p>Bytecode lookup (PC → opcode)</p>
              <p>Keccak hash verification</p>
              <p>RwTable access (R/W history)</p>
              <p>MPT node hashing</p>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              복잡한 constraint를 table로 대체 → 회로 rows 크게 감소 / Verifier cost는 lookup 개수와 무관.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
