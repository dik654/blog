import GadgetTreeViz from './viz/GadgetTreeViz';
import M from '@/components/ui/math';

export default function GadgetSystem() {
  return (
    <section id="gadget-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Gadget 시스템</h2>
      <div className="not-prose mb-8"><GadgetTreeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Gadget은 zkEVM에서 <strong>재사용 가능한 회로 컴포넌트</strong>입니다.
          <code>gadgets/</code> 크레이트가 IsZero, LessThan, MulAdd 등 기본 검증 블록을 제공하고,
          각 ExecutionGadget이 이를 조합하여 복잡한 오퍼코드 제약을 구축합니다.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">Gadget 시스템 계층</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-4">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-2">기본 검증</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">IsZeroGadget</code> — <M>{'x = 0'}</M> 검증</li>
              <li><code className="text-xs">IsEqualGadget</code> — <M>{'\\text{lhs} = \\text{rhs}'}</M> (IsZero(lhs-rhs))</li>
              <li><code className="text-xs">LtGadget</code> — <M>{'\\text{lhs} < \\text{rhs}'}</M> (바이트 분해)</li>
              <li><code className="text-xs">ComparatorGadget</code> — LT + EQ 동시 제공</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">산술 연산</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">MulAddGadget</code> — <M>{'a \\cdot b + c = d \\pmod{2^{256}}'}</M></li>
              <li><code className="text-xs">AddWordsGadget</code> — 256비트 덧셈</li>
              <li><code className="text-xs">BinaryNumberGadget</code> — N비트 이진 표현</li>
            </ul>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">배치 처리</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">BatchedIsZeroGadget</code> — N개 값 동시 0 검증</li>
              <li><code className="text-xs">SameContextGadget</code> — 오퍼코드 공통 상태 전환</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">IsZeroGadget</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-2">IsZero -- 0 판별</p>
          <div className="mb-3">
            <M display>{'\\underbrace{\\text{value}}_{\\text{판별할 값}} \\times \\Big(1 - \\underbrace{\\text{value} \\times \\text{value\\_inv}}_{\\text{0이 아니면 1}}\\Big) = 0'}</M>
          </div>
          <p className="text-sm text-muted-foreground mt-2 mb-3">
            value = 0이면 좌항 전체가 0 (자명). value ≠ 0이면 value_inv = 1/value이므로 괄호 내부가 0 → 좌항도 0.<br />
            두 경우 모두 제약을 만족 — 단 1개 제약으로 0 여부 판별
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3">
              <p className="font-semibold text-sky-700 dark:text-sky-300 mb-1">제약 조건</p>
              <ul className="space-y-1 text-foreground/80">
                <li><M>{'\\text{value} = 0'}</M> 이면 <code className="text-xs">is_zero == 1</code></li>
                <li><M>{'\\text{value} \\neq 0'}</M> 이면 <code className="text-xs">value_inv = 1/value</code></li>
              </ul>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">configure</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">IsZeroChip::configure(meta, q_enable, value_column, value_inv_column)</code></li>
                <li>선택자 + 값 쿼리 설정</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">할당: <code className="text-xs">chip.assign(region, offset, Value::known(value))</code></p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Comparator & LtGadget</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-3">비교 Gadget 체계</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3">
              <p className="font-semibold text-sky-700 dark:text-sky-300 mb-1">ComparatorGadget</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">ComparatorConfig&lt;F, N_BYTES&gt;</code></li>
                <li><code className="text-xs">lt_chip: LtChip&lt;F, N_BYTES&gt;</code></li>
                <li><code className="text-xs">eq_chip: IsEqualChip&lt;F&gt;</code></li>
                <li>GT = <code className="text-xs">!lt && !eq</code>로 간접 계산</li>
              </ul>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">LtConfig</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">lt: Column&lt;Advice&gt;</code> — 결과 (0 또는 1)</li>
                <li><code className="text-xs">diff: [Column&lt;Advice&gt;; N_BYTES]</code> — 차이의 바이트 표현</li>
                <li><code className="text-xs">u8_table: TableColumn</code> — 범위 검증용</li>
                <li><code className="text-xs">range: F</code> — <M>{'2^{N \\times 8}'}</M></li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            LtGadget 핵심: <M>{'\\text{diff} = \\text{lhs} - \\text{rhs} + (\\text{lt} \\;?\\; \\text{range} : 0)'}</M>, 각 diff_byte를 u8 범위 룩업으로 검증
          </p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">MulAddGadget</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-2">256비트 곱셈+덧셈</p>
          <div className="mb-3">
            <M display>{'\\underbrace{a}_{\\text{피승수 (256bit)}} \\cdot \\underbrace{b}_{\\text{승수 (256bit)}} + \\underbrace{c}_{\\text{덧셈 항 (256bit)}} \\equiv \\underbrace{d}_{\\text{결과 (256bit)}} \\pmod{2^{256}}'}</M>
          </div>
          <p className="text-sm text-muted-foreground mt-2 mb-3">
            a, b, c, d = 각각 256비트 정수 (4개의 64비트 limb로 분해: a[0]~a[3])<br />
            mod 2²⁵⁶ = EVM 워드 크기 내에서 오버플로우 처리. carry를 16비트 단위로 범위 검증
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">회로 레이아웃 (8행 x 4열)</p>
              <div className="overflow-x-auto">
                <table className="text-xs border-collapse">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="border border-border px-2 py-1">q_step</th>
                      <th className="border border-border px-2 py-1">col0</th>
                      <th className="border border-border px-2 py-1">col1</th>
                      <th className="border border-border px-2 py-1">col2</th>
                      <th className="border border-border px-2 py-1">col3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-border px-2 py-1">1</td><td className="border border-border px-2 py-1">a_limb0</td><td className="border border-border px-2 py-1">a_limb1</td><td className="border border-border px-2 py-1">a_limb2</td><td className="border border-border px-2 py-1">a_limb3</td></tr>
                    <tr><td className="border border-border px-2 py-1">0</td><td className="border border-border px-2 py-1">b_limb0</td><td className="border border-border px-2 py-1">b_limb1</td><td className="border border-border px-2 py-1">b_limb2</td><td className="border border-border px-2 py-1">b_limb3</td></tr>
                    <tr><td className="border border-border px-2 py-1">0</td><td className="border border-border px-2 py-1">c_lo</td><td className="border border-border px-2 py-1">c_hi</td><td className="border border-border px-2 py-1">d_lo</td><td className="border border-border px-2 py-1">d_hi</td></tr>
                    <tr><td className="border border-border px-2 py-1">0</td><td className="border border-border px-2 py-1">carry0</td><td className="border border-border px-2 py-1">carry1</td><td className="border border-border px-2 py-1">carry2</td><td className="border border-border px-2 py-1">carry3</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">곱셈 전개 + carry 전파</p>
              <div className="space-y-2">
                <M display>{'\\underbrace{t_0}_{\\text{하위 부분곱}} = \\underbrace{a[0]}_{\\text{a의 limb0}} \\cdot \\underbrace{b[0]}_{\\text{b의 limb0}}'}</M>
                <M display>{'\\underbrace{t_1}_{\\text{교차 부분곱}} = a[0] \\cdot b[1] + a[1] \\cdot b[0]'}</M>
                <M display>{'\\underbrace{t_0 + t_1 \\cdot 2^{64}}_{\\text{부분곱 합산}} + \\underbrace{c_{\\text{lo}}}_{\\text{c 하위 128bit}} = \\underbrace{d_{\\text{lo}}}_{\\text{d 하위 128bit}} + \\underbrace{\\text{carry} \\cdot 2^{128}}_{\\text{올림}}'}</M>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                64비트 limb 간 교차 곱셈 → 128비트 부분합 → carry 전파로 256비트 결과 검증
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Gadget Library의 철학</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-4">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-2">Core (Primitives)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">IsZeroGadget</code> — <M>{'x = 0'}</M> 판별</li>
              <li><code className="text-xs">LtGadget</code> — <M>{'a < b'}</M> 비교</li>
              <li><code className="text-xs">CmpGadget</code> — <M>{'a = b'}</M> 판별</li>
              <li><code className="text-xs">MulAddWords</code> — 256-bit 산술</li>
              <li><code className="text-xs">RandomLinearCombination</code> — byte array 압축</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Composed (조합)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">LtWordGadget</code> — 256-bit 비교</li>
              <li><code className="text-xs">MinMaxGadget</code> — min/max 선택</li>
              <li><code className="text-xs">ConstantDivisionGadget</code> — 상수 나누기</li>
              <li><code className="text-xs">PairSelectGadget</code> — 조건 분기</li>
            </ul>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">High-level</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">TransferGadget</code> — EVM transfer 로직</li>
              <li><code className="text-xs">CallGadget</code> — call frame 설정</li>
              <li><code className="text-xs">GasCostGadget</code> — 가스 계산</li>
              <li><code className="text-xs">MemoryAddressGadget</code> — 메모리 주소 검증</li>
            </ul>
          </div>
        </div>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">설계 원칙</p>
              <ul className="space-y-1 text-foreground/80">
                <li>1) Single responsibility -- 하나의 명확한 책임</li>
                <li>2) Constraint minimization -- 최소 제약</li>
                <li>3) Reusability -- 여러 opcode에서 사용</li>
                <li>4) Testability -- 단위 테스트</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">효과</p>
              <ul className="space-y-1 text-foreground/80">
                <li>140+ opcode를 ~30 gadgets로 구현</li>
                <li>코드 중복 대폭 감소</li>
                <li>버그는 gadget 레벨에서 수정</li>
                <li>새 opcode 추가 용이</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
