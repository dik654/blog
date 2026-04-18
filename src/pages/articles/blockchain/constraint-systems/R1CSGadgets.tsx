import M from '@/components/ui/math';
import GadgetCostViz from './viz/GadgetCostViz';

export default function R1CSGadgets() {
  return (
    <section id="r1cs-gadgets" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS 가젯 (Poseidon, Merkle 회로)</h2>
      <div className="not-prose mb-8"><GadgetCostViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">가젯이란?</h3>
        <p>가젯(Gadget)은 반복적으로 사용되는 R1CS 패턴입니다.
        <br />
          복잡한 회로를 기본 가젯의 조합으로 구성합니다.
        <br />
          native 코드와 circuit 코드의 출력이 동일해야 합니다(native = circuit 원칙).</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">S-box 가젯: x &rarr; x⁵ (3개 제약)</h3>
        <p>Poseidon 해시의 핵심 비선형 연산입니다.
        <br />
          square-and-multiply(제곱-곱셈 방식)로 3개 제약만 사용합니다.</p>

        {/* S-box 가젯 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">square-and-multiply 3단계</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center">
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs text-muted-foreground">제약 1</p>
                <M>{'t_1 = x \\cdot x'}</M>
                <p className="text-xs text-muted-foreground mt-1"><M>{'x^2'}</M></p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs text-muted-foreground">제약 2</p>
                <M>{'t_2 = t_1 \\cdot t_1'}</M>
                <p className="text-xs text-muted-foreground mt-1"><M>{'x^4'}</M></p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs text-muted-foreground">제약 3</p>
                <M>{'y = t_2 \\cdot x'}</M>
                <p className="text-xs text-muted-foreground mt-1"><M>{'x^5'}</M></p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Rust 회로 구현</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>x2 = cs.alloc_witness(x_val.square())</code></li>
              <li><code>x4 = cs.alloc_witness(x2_val.square())</code></li>
              <li><code>x5 = cs.alloc_witness(x4_val * x_val)</code></li>
              <li className="pt-1"><code>cs.enforce(x, x, x2)</code> &mdash; <M>{'x \\times x = x^2'}</M></li>
              <li><code>cs.enforce(x2, x2, x4)</code> &mdash; <M>{'x^2 \\times x^2 = x^4'}</M></li>
              <li><code>cs.enforce(x4, x, x5)</code> &mdash; <M>{'x^4 \\times x = x^5'}</M></li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Boolean 가젯: b &isin; &#123;0,1&#125; (1개 제약)</h3>
        <p>변수 b가 반드시 0 또는 1임을 강제합니다.
        <br />
          이 제약 없이는 공격자가 b=2 같은 값으로 mux 결과를 조작할 수 있습니다.</p>

        {/* Boolean 제약 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-violet-500 bg-card p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">제약 정의</p>
            <M display>{'b \\cdot (1 - b) = 0'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              A = <code>[(b, 1)]</code>, &ensp; B = <code>[(One, 1), (b, -1)]</code>, &ensp; C = <code>0</code>
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-l-amber-500 bg-card p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">0과 1만 만족하는 이유</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center">
              <div className="rounded border bg-green-500/10 p-2">
                <p><M>{'b=0'}</M></p>
                <p className="text-muted-foreground"><M>{'0 \\cdot 1 = 0'}</M> &check;</p>
              </div>
              <div className="rounded border bg-green-500/10 p-2">
                <p><M>{'b=1'}</M></p>
                <p className="text-muted-foreground"><M>{'1 \\cdot 0 = 0'}</M> &check;</p>
              </div>
              <div className="rounded border bg-red-500/10 p-2">
                <p><M>{'b=2'}</M></p>
                <p className="text-muted-foreground"><M>{'2 \\cdot (-1) = -2'}</M> &cross;</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <M>{'\\mathbb{F}_r'}</M>에서 0과 1만 만족
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Mux 가젯: 조건부 선택 (2개 제약)</h3>
        <p>bit 값에 따라 두 입력 중 하나를 선택합니다.
        <br />
          result = when_false + bit * (when_true - when_false) 공식을 사용합니다.</p>

        {/* Mux 가젯 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">보조 변수와 2개 제약</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>보조 변수: <M>{'t = \\text{bit} \\cdot (\\text{when\\_true} - \\text{when\\_false})'}</M></li>
              <li>제약 1: <M>{'\\text{bit} \\cdot (\\text{when\\_true} - \\text{when\\_false}) = t'}</M></li>
              <li>제약 2: <M>{'(\\text{when\\_false} + t) \\cdot 1 = \\text{result}'}</M></li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">구체적 예시</p>
            <p className="text-sm text-muted-foreground">
              <code>bit=1</code>, <code>when_true=42</code>, <code>when_false=99</code>
            </p>
            <ul className="text-sm text-muted-foreground space-y-0.5 mt-1">
              <li><M>{'t = 1 \\cdot (42 - 99) = -57'}</M></li>
              <li><M>{'\\text{result} = 99 + (-57) = 42'}</M> &larr; when_true 선택 &check;</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Poseidon 회로 제약 분해</h3>
        <p>Poseidon의 65라운드(Full 8 + Partial 57)를 R1CS로 변환합니다.
        <br />
          AddRC와 MDS(Maximum Distance Separable 행렬)는 선형 연산이지만, 선형결합을 변수로 고정하는 추가 제약이 필요합니다.</p>

        {/* Poseidon 제약 수 분석 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm mb-3">Poseidon 제약 수 분석 (T=3)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Full round</p>
              <p className="text-muted-foreground">AddRC 3 + S-box 9 + MDS 3 = <strong>15 제약</strong></p>
              <p className="text-xs text-muted-foreground mt-1">8 라운드 &times; 15 = 120</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Partial round</p>
              <p className="text-muted-foreground">AddRC 3 + S-box 3 + MDS 3 = <strong>9 제약</strong></p>
              <p className="text-xs text-muted-foreground mt-1">57 라운드 &times; 9 = 513</p>
            </div>
          </div>
          <div className="rounded border bg-muted/50 p-2 mt-3 text-center text-sm">
            합계: <strong>120 + 513 + 1 (출력) = 634 제약</strong>
            <span className="text-muted-foreground ml-2">(순수 S-box만: 243개)</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Proof 검증 회로</h3>
        <p>Merkle proof 검증은 여러 가젯의 조합입니다.
        <br />
          각 레벨마다 Boolean(경로 방향) + Mux(입력 순서 결정) + Poseidon(해시)을 반복합니다.
        <br />
          최종 해시가 공개 root와 일치하는지 확인합니다.</p>

        {/* Merkle Proof 검증 회로 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">깊이별 제약 수</p>
            <p className="text-sm text-muted-foreground mb-2">
              각 레벨: Boolean(1) + Mux&times;2(4) + Poseidon(634) &asymp; <strong>639 제약</strong>
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center">
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-muted-foreground text-xs">깊이 4</p>
                <p className="font-semibold">~3,186</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-muted-foreground text-xs">깊이 20</p>
                <p className="font-semibold">~12,780</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-muted-foreground text-xs">깊이 32 (ETH)</p>
                <p className="font-semibold">~20,448</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">가젯 조합 순서</p>
            <div className="grid grid-cols-4 gap-2 text-sm text-center">
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">1. Boolean</p>
                <p className="text-xs text-muted-foreground">경로 비트 &#123;0,1&#125; 강제</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">2. Mux</p>
                <p className="text-xs text-muted-foreground">비트에 따라 순서 결정</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">3. Poseidon</p>
                <p className="text-xs text-muted-foreground">해시 계산</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">4. 등치</p>
                <p className="text-xs text-muted-foreground">최종 해시 = root</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">가젯 라이브러리와 최적화</h3>

        {/* Range check */}
        <div className="not-prose space-y-4 mb-6">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">1. Range check: <M>{'0 \\leq x < 2^n'}</M></p>
            <p className="text-sm text-muted-foreground mb-2">
              비트 분해: <M>{'x = \\sum_{i=0}^{n-1} b_i \\cdot 2^i'}</M>, 각 <M>{'b_i'}</M>에 boolean 제약
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded border bg-card p-2">
                <p className="text-muted-foreground">비용: <strong>n + 1</strong> 제약 (n booleans + 1 combine)</p>
                <p className="text-xs text-muted-foreground mt-1">예: n=64 &rarr; 65 제약</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="text-muted-foreground">최적화: 4-bit 청크 lookup table (Plonkish)</p>
                <p className="text-xs text-muted-foreground mt-1">&rarr; O(n/4) 제약</p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">2. 비교 (a &lt; b)</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded border bg-card p-2">
                <p className="font-semibold text-muted-foreground">Standard</p>
                <p className="text-muted-foreground"><M>{'b - a - 1'}</M>의 range check &mdash; 255 제약</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="font-semibold text-muted-foreground">Alternative</p>
                <p className="text-muted-foreground">양쪽 bit 분해 후 비트별 비교 &mdash; ~512 제약</p>
              </div>
            </div>
          </div>

          {/* Conditional */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">3. 조건부 할당 (if cond then a else b)</p>
            <p className="text-sm text-muted-foreground">
              <code>Boolean(cond)</code> + <M>{'\\text{result} = \\text{cond} \\cdot a + (1 - \\text{cond}) \\cdot b'}</M>
            </p>
            <p className="text-sm text-muted-foreground mt-1">비용: <strong>2 제약</strong> (boolean + mux)</p>
          </div>

          {/* ECDSA */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">4. ECDSA 서명 검증</p>
            <p className="text-sm text-muted-foreground mb-2">BN254 base field 위의 scalar multiplication (foreign-field arithmetic 고비용)</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center">
              <div className="rounded border bg-red-500/10 p-2">
                <p className="text-muted-foreground">Naive</p>
                <p className="font-semibold">~1.5M 제약</p>
              </div>
              <div className="rounded border bg-amber-500/10 p-2">
                <p className="text-muted-foreground">Optimized</p>
                <p className="font-semibold">~400K 제약</p>
              </div>
              <div className="rounded border bg-green-500/10 p-2">
                <p className="text-muted-foreground">Plonkish</p>
                <p className="font-semibold">~50K 제약</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">최적화: Window NAF scalar mult, GLV endomorphism, precomputed tables</p>
          </div>

          {/* Hash functions */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">5. 해시 함수 비교</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm">
              {[
                { name: 'SHA-256', cost: '~25,000', note: '비트 연산 기반, Ethereum/Bitcoin 호환', color: 'border-red-500/30' },
                { name: 'Keccak-256', cost: '~150,000', note: 'SHA-3 유사, bit-heavy, Ethereum state', color: 'border-red-500/30' },
                { name: 'Poseidon', cost: '~250', note: 'ZK-friendly, MDS + S-box', color: 'border-green-500/30' },
                { name: 'Rescue-Prime', cost: '~300', note: 'alternating S-box, provable security', color: 'border-green-500/30' },
                { name: 'MiMC', cost: '~600', note: '초기 ZK-friendly hash (deprecated)', color: 'border-amber-500/30' },
              ].map(h => (
                <div key={h.name} className={`rounded-lg border p-2 ${h.color}`}>
                  <p className="font-semibold">{h.name}</p>
                  <p className="font-mono text-muted-foreground">{h.cost}</p>
                  <p className="text-xs text-muted-foreground mt-1">{h.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Merkle proof cost */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">6. Merkle proof 비용 분석</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-center">
              {[
                { depth: 20, cost: '5,060', note: '20 x 253' },
                { depth: 32, cost: '8,096', note: 'Ethereum MPT' },
                { depth: 256, cost: '64,768', note: 'Sparse Merkle Tree' },
                { depth: '20 (Plonkish)', cost: '~860', note: 'Poseidon ~40 gates → 10x 감소' },
              ].map(m => (
                <div key={m.depth} className="rounded border bg-card p-2">
                  <p className="text-muted-foreground text-xs">깊이 {m.depth}</p>
                  <p className="font-semibold">{m.cost}</p>
                  <p className="text-xs text-muted-foreground">{m.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Circuit composition */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">7. 회로 조합 패턴</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">Groth16</p>
                <p className="text-xs text-muted-foreground">circuit-specific. 변경 시 새 trusted setup 필요</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">Plonk (universal)</p>
                <p className="text-xs text-muted-foreground">단일 setup, prove time에 회로 기술</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">Recursive (Nova)</p>
                <p className="text-xs text-muted-foreground">IVC &mdash; 무한 계산에 constant-size proof</p>
              </div>
            </div>
          </div>

          {/* Testing */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">8. 가젯 테스팅</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">Satisfiability</p>
                <p className="text-xs text-muted-foreground">valid witness 생성 &rarr; <code>cs.is_satisfied()</code> = true</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">Negative test</p>
                <p className="text-xs text-muted-foreground">witness 변조 &rarr; <code>is_satisfied()</code> = false</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">Constraint count</p>
                <p className="text-xs text-muted-foreground"><code>cs.num_constraints()</code> 기대값 일치</p>
              </div>
              <div className="rounded border bg-card p-2">
                <p className="font-semibold">Fuzz test</p>
                <p className="text-xs text-muted-foreground">랜덤 입력, native vs circuit 출력 비교</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
