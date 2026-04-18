import M from '@/components/ui/math';
import R1CSConstraintViz from './viz/R1CSConstraintViz';
import R1CStoQAPViz from './viz/R1CStoQAPViz';

export default function R1CS() {
  return (
    <section id="r1cs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS (Rank-1 Constraint System)</h2>
      <div className="not-prose mb-8"><R1CSConstraintViz /></div>
      <h3 className="text-lg font-semibold mb-3">R1CS &rarr; QAP 변환 파이프라인</h3>
      <div className="not-prose mb-8"><R1CStoQAPViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">ZK 증명의 중간 표현</h3>
        <p>ZK 증명(Zero-Knowledge Proof) — 비밀 x를 공개하지 않고 f(x) = y임을 증명하는 것이 목표<br />
        R1CS — 임의의 계산을 증명 시스템이 이해하는 형태로 번역하는 중간 표현(IR)</p>

        {/* ZK 증명 파이프라인 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">ZK 증명 파이프라인</p>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">프로그램/함수</p>
              <p className="text-xs text-muted-foreground mt-1">고수준 코드</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">R1CS</p>
              <p className="text-xs text-muted-foreground mt-1">중간 표현(IR)</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">QAP</p>
              <p className="text-xs text-muted-foreground mt-1">다항식 변환</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Groth16</p>
              <p className="text-xs text-muted-foreground mt-1">암호학(페어링)</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">형식적 정의</h3>
        <p>체(Field) F 위의 R1CS 인스턴스 — 행렬 A, B, C와 witness(비밀 입력) 벡터 s로 구성<br />
        각 제약은 곱셈 게이트 하나를 표현. <strong>덧셈은 무료(선형결합)</strong>, 곱셈만 비용 발생</p>

        {/* R1CS 형식적 정의 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">단일 제약 형태</p>
            <M display>{'\\langle \\mathbf{a}, \\mathbf{s} \\rangle \\cdot \\langle \\mathbf{b}, \\mathbf{s} \\rangle = \\langle \\mathbf{c}, \\mathbf{s} \\rangle'}</M>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">행렬 형태</p>
            <M display>{'(A \\cdot \\mathbf{s}) \\circ (B \\cdot \\mathbf{s}) = C \\cdot \\mathbf{s}'}</M>
            <ul className="text-sm text-muted-foreground space-y-1 mt-2">
              <li><M>{'A, B, C \\in \\mathbb{F}^{m \\times n}'}</M> &mdash; <code>m</code> = 제약 수, <code>n</code> = 변수 수</li>
              <li><M>{'\\mathbf{s} = (1,\\, x_1, \\ldots, x_l,\\, w_1, \\ldots, w_m)'}</M> &mdash; witness 벡터</li>
              <li><M>{'\\circ'}</M> = Hadamard product (원소별 곱)</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-amber-500 bg-card p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">변수 분할</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center mt-2">
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono font-semibold">인덱스 0</p>
                <p className="text-muted-foreground text-xs mt-1">상수 <code>1</code> (One)</p>
                <p className="text-muted-foreground text-xs">상수를 선형결합으로 표현</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono font-semibold">인덱스 1..l</p>
                <p className="text-muted-foreground text-xs mt-1">공개 입력 (Instance)</p>
                <p className="text-muted-foreground text-xs">검증자도 아는 값</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono font-semibold">인덱스 l+1..</p>
                <p className="text-muted-foreground text-xs mt-1">비공개 입력 (Witness)</p>
                <p className="text-muted-foreground text-xs">증명자만 아는 값</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">ConstraintSystem 빌더</h3>
        <p>회로 빌드 인터페이스 — 변수 할당 &rarr; 제약 추가 &rarr; 만족 여부 확인</p>

        {/* ConstraintSystem 사용 예시 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">1. 변수 할당</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>x = cs.alloc_witness(Fr::from_u64(3))</code> &mdash; 비공개</li>
              <li><code>y = cs.alloc_witness(Fr::from_u64(4))</code> &mdash; 비공개</li>
              <li><code>z = cs.alloc_instance(Fr::from_u64(12))</code> &mdash; 공개</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">2. 곱셈 게이트 제약 추가</p>
            <p className="text-sm text-muted-foreground">
              <code>cs.enforce(A=x, B=y, C=z)</code> &mdash; <M>{'x \\cdot y = z'}</M>
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-l-violet-500 bg-card p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">3. 만족 여부 검증</p>
            <p className="text-sm text-muted-foreground">
              <code>cs.is_satisfied()</code> &rarr; <M>{'3 \\times 4 = 12'}</M> &check;
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Witness 생성</h3>
        <p>Witness 생성 — 함수를 실제로 실행하는 것과 동일<br />
        증명자(Prover) — f(x) 계산으로 전체 witness 벡터 채움<br />
        검증자(Verifier) — 계산 없이 증명만으로 f(x)=y 확인</p>

        {/* Witness 벡터 구성 예시 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">
              Witness 벡터 구성: <M>{'f(x) = x^3 + x + 5'}</M>, 입력 <M>{'x = 3'}</M>
            </p>
            <div className="rounded-lg border-l-4 border-l-sky-500 bg-muted/50 p-3 mb-3">
              <p className="text-sm font-semibold text-sky-400 mb-2">중간값 계산으로 벡터 채우기</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                <div className="rounded border bg-card p-2 text-center">
                  <p className="text-muted-foreground text-xs">s[0]</p>
                  <p className="font-mono font-semibold">1</p>
                  <p className="text-xs text-muted-foreground">상수 One</p>
                </div>
                <div className="rounded border bg-card p-2 text-center">
                  <p className="text-muted-foreground text-xs">s[2]</p>
                  <p className="font-mono font-semibold">3</p>
                  <p className="text-xs text-muted-foreground">x (비공개)</p>
                </div>
                <div className="rounded border bg-card p-2 text-center">
                  <p className="text-muted-foreground text-xs">s[3]</p>
                  <p className="font-mono font-semibold">9</p>
                  <p className="text-xs text-muted-foreground"><M>{'x^2'}</M></p>
                </div>
                <div className="rounded border bg-card p-2 text-center">
                  <p className="text-muted-foreground text-xs">s[4]</p>
                  <p className="font-mono font-semibold">27</p>
                  <p className="text-xs text-muted-foreground"><M>{'x^3'}</M></p>
                </div>
                <div className="rounded border bg-card p-2 text-center">
                  <p className="text-muted-foreground text-xs">s[1]</p>
                  <p className="font-mono font-semibold">35</p>
                  <p className="text-xs text-muted-foreground">y (공개 출력)</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border-l-4 border-l-emerald-500 bg-muted/50 p-3">
              <p className="text-sm font-semibold text-emerald-400 mb-1">곱셈만 제약, 덧셈은 흡수</p>
              <p className="text-sm text-muted-foreground">
                <M>{'x \\cdot x = t_1'}</M>, &ensp;
                <M>{'t_1 \\cdot x = t_2'}</M>, &ensp;
                <M>{'(t_2 + x + 5) \\cdot 1 = y'}</M>
                <br />
                &rarr; 곱셈 3번 = 제약 3개, 덧셈은 선형결합으로 흡수
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">비선형 연산의 제약 비용</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>덧셈 a + b</strong>: 0개 (무료 — 선형결합으로 흡수)</li>
          <li><strong>곱셈 a * b</strong>: 1개</li>
          <li><strong>거듭제곱 a^n</strong>: ~log₂(n)개 (square-and-multiply)</li>
          <li><strong>비트 분해</strong>: ~254개 (각 비트에 boolean 제약)</li>
          <li><strong>Poseidon hash</strong>: ~250개 (ZK-friendly)</li>
          <li><strong>SHA-256</strong>: ~25,000개 (비트 연산 기반 &rarr; 비효율)</li>
        </ul>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS 구체 예시</h3>

        {/* 구체 예시 */}
        <div className="not-prose space-y-4 mb-6">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">
              문제: <M>{'x^3 + x + 5 = 35'}</M> (해: <M>{'x = 3'}</M>)
            </p>
            <p className="text-sm text-muted-foreground mb-3">회로 분해 &mdash; 곱셈 게이트만 제약으로 변환</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
              <div className="rounded border bg-card p-2 text-center">
                <p className="text-xs text-muted-foreground">sym_1</p>
                <p><M>{'x \\cdot x'}</M></p>
                <p className="text-xs text-muted-foreground"><M>{'x^2'}</M></p>
              </div>
              <div className="rounded border bg-card p-2 text-center">
                <p className="text-xs text-muted-foreground">sym_2</p>
                <p><M>{'\\text{sym\\_1} \\cdot x'}</M></p>
                <p className="text-xs text-muted-foreground"><M>{'x^3'}</M></p>
              </div>
              <div className="rounded border bg-card p-2 text-center">
                <p className="text-xs text-muted-foreground">sym_3</p>
                <p><M>{'\\text{sym\\_2} + x'}</M></p>
                <p className="text-xs text-muted-foreground"><M>{'x^3 + x'}</M></p>
              </div>
              <div className="rounded border bg-card p-2 text-center">
                <p className="text-xs text-muted-foreground">out</p>
                <p><M>{'\\text{sym\\_3} + 5'}</M></p>
                <p className="text-xs text-muted-foreground"><M>{'x^3 + x + 5'}</M></p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              변수: <code>[1, out, x, sym_1, sym_2, sym_3]</code> = <code>[1, 35, 3, 9, 27, 30]</code>
            </p>
          </div>

          {/* 4개 제약 */}
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">4개 곱셈 게이트 &rarr; 4개 제약</p>
            <div className="space-y-3">
              {[
                { n: 1, desc: 'x \\cdot x = \\text{sym\\_1}', a: '[0,0,1,0,0,0]', b: '[0,0,1,0,0,0]', c: '[0,0,0,1,0,0]', note: 'x 선택' },
                { n: 2, desc: '\\text{sym\\_1} \\cdot x = \\text{sym\\_2}', a: '[0,0,0,1,0,0]', b: '[0,0,1,0,0,0]', c: '[0,0,0,0,1,0]', note: '' },
                { n: 3, desc: '(\\text{sym\\_2} + x) \\cdot 1 = \\text{sym\\_3}', a: '[0,0,1,0,1,0]', b: '[1,0,0,0,0,0]', c: '[0,0,0,0,0,1]', note: 'sym_2 + x 선형결합' },
                { n: 4, desc: '(\\text{sym\\_3} + 5) \\cdot 1 = \\text{out}', a: '[5,0,0,0,0,1]', b: '[1,0,0,0,0,0]', c: '[0,1,0,0,0,0]', note: '+5를 A에 흡수' },
              ].map(c => (
                <div key={c.n} className="rounded border bg-card p-3">
                  <p className="text-sm font-semibold mb-1">
                    제약 {c.n}: <M>{c.desc}</M>
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono text-muted-foreground">
                    <p>A = <code>{c.a}</code></p>
                    <p>B = <code>{c.b}</code></p>
                    <p>C = <code>{c.c}</code></p>
                  </div>
                  {c.note && <p className="text-xs text-muted-foreground mt-1">{c.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">제약 시스템 비교</h3>
        <div className="not-prose space-y-3 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-blue-500/30 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Plonkish (custom gates)</p>
              <M display>{'q_L a + q_R b + q_M ab + q_O c + q_C = 0'}</M>
              <ul className="text-sm text-muted-foreground space-y-0.5 mt-2">
                <li>R1CS보다 유연한 커스텀 게이트</li>
                <li>Lookup table로 range check 저렴</li>
                <li>사용: Plonky2, Halo2, zkEVM</li>
              </ul>
            </div>
            <div className="rounded-lg border border-emerald-500/30 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">AIR (Algebraic Intermediate Repr.)</p>
              <ul className="text-sm text-muted-foreground space-y-0.5">
                <li>레지스터별 transition polynomial</li>
                <li>특정 row에 boundary constraint</li>
                <li>사용: STARKs, Winterfell, Risc0</li>
              </ul>
            </div>
            <div className="rounded-lg border border-violet-500/30 p-4">
              <p className="font-semibold text-sm text-violet-400 mb-2">CCS (Customizable CS)</p>
              <ul className="text-sm text-muted-foreground space-y-0.5">
                <li>R1CS, Plonkish, AIR의 일반화</li>
                <li>고차(higher-degree) 제약 지원</li>
                <li>사용: HyperNova, Spartan2</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">R1CS + lookups (Lasso)</p>
              <ul className="text-sm text-muted-foreground space-y-0.5">
                <li>Lookup argument 추가</li>
                <li>Range check, bit ops 저렴</li>
                <li>사용: Jolt, Lasso+Nova</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS 적용 시스템</h3>
        <div className="not-prose space-y-3 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: 'Groth16', desc: '가장 작은 증명 (3 group elements), circuit-specific trusted setup', ok: true },
              { name: 'Bulletproofs', desc: 'trusted setup 불필요, O(log n) 증명 (Monero)', ok: true },
              { name: 'Spartan', desc: 'Sumcheck 기반, FFT 불필요', ok: true },
              { name: 'Modern zkVMs', desc: 'Plonkish + custom gates + lookup 선호', ok: false },
            ].map(s => (
              <div key={s.name} className={`rounded-lg border p-3 ${s.ok ? 'border-green-500/30' : 'border-red-500/30'}`}>
                <p className="text-sm font-semibold">{s.ok ? '\u2713' : '\u2717'} {s.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS 프레임워크</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {[
            { name: 'bellman (Rust)', desc: 'R1CS + Groth16. Zcash 오리지널', org: 'Zcash' },
            { name: 'arkworks (Rust)', desc: '범용 R1CS traits. 다중 증명 시스템', org: 'arkworks' },
            { name: 'circom (DSL)', desc: 'R1CS-first DSL. 제약과 1:1 대응', org: 'iden3, Tornado Cash' },
            { name: 'circomlib', desc: '표준 가젯 라이브러리. Poseidon, Pedersen, ECDSA', org: 'iden3' },
            { name: 'gnark (Go)', desc: 'R1CS frontend. Groth16 + Plonk backend', org: 'Consensys' },
          ].map(f => (
            <div key={f.name} className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold">{f.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              <p className="text-xs text-muted-foreground">{f.org}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS 만족 가능성 (NP-complete)</h3>
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            공개된 행렬 <M>{'A, B, C'}</M>에 대해 witness <M>{'\\mathbf{s}'}</M>를 찾는 문제
          </p>
          <M display>{'(A \\cdot \\mathbf{s}) \\circ (B \\cdot \\mathbf{s}) = C \\cdot \\mathbf{s}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'\\circ'}</M> = Hadamard product. Circuit-SAT를 포함 &rarr; NP-complete
          </p>
        </div>
      </div>
    </section>
  );
}
