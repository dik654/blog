import TemplateSignalViz from './viz/TemplateSignalViz';
import M from '@/components/ui/math';

export default function TemplateSignal({ title }: { title?: string }) {
  return (
    <section id="template-signal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '템플릿 & 시그널'}</h2>
      <div className="not-prose mb-8">
        <TemplateSignalViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Circom의 핵심 추상화는 <strong>템플릿(Template)</strong>과 <strong>시그널(Signal)</strong>입니다.<br />
          템플릿은 재사용 가능한 회로 블록이고, 시그널은 유한체 위의 값을 나타냅니다.
          <code>{'<=='}</code> 연산자는 제약 생성과 값 대입을 동시에 수행합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">템플릿 & 컴포넌트 기본 구조</h3>
        <div className="not-prose rounded-lg border p-4 text-sm space-y-3 mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
            <p className="text-xs font-medium mb-2">Multiplier2 템플릿 정의</p>
            <div className="font-mono text-xs space-y-1">
              <p><code>template</code> <strong>Multiplier2</strong>() {'{'}</p>
              <p className="pl-4"><code>signal input</code> a; <span className="text-muted-foreground">// 입력 신호</span></p>
              <p className="pl-4"><code>signal input</code> b; <span className="text-muted-foreground">// 입력 신호</span></p>
              <p className="pl-4"><code>signal output</code> c; <span className="text-muted-foreground">// 출력 신호</span></p>
              <p className="pl-4">c <code>{'<=='}</code> a * b; <span className="text-muted-foreground">// 제약 + 대입 동시</span></p>
              <p>{'}'}</p>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">컴포넌트 인스턴스화</p>
            <p className="font-mono text-xs"><code>component</code> main = Multiplier2();</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">신호 타입 & 가시성</h3>
        <div className="not-prose grid gap-2 sm:grid-cols-3 mb-6">
          <div className="rounded-lg border bg-sky-50 dark:bg-sky-950/30 p-3 text-sm">
            <p className="font-semibold text-xs mb-2">input</p>
            <p className="font-mono text-xs"><code>signal input</code> x;</p>
            <p className="text-muted-foreground text-xs mt-1">외부에서 주입 (public/private). 증인의 일부</p>
          </div>
          <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm">
            <p className="font-semibold text-xs mb-2">output</p>
            <p className="font-mono text-xs"><code>signal output</code> y;</p>
            <p className="text-muted-foreground text-xs mt-1">외부로 노출. 부모 컴포넌트가 참조 가능</p>
          </div>
          <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/30 p-3 text-sm">
            <p className="font-semibold text-xs mb-2">intermediate</p>
            <p className="font-mono text-xs"><code>signal</code> z;</p>
            <p className="text-muted-foreground text-xs mt-1">중간 계산용. 외부 비가시</p>
          </div>
        </div>

        <div className="not-prose rounded-lg border p-3 text-sm mb-6">
          <p className="text-xs font-medium mb-2">배열 신호 & public 태그</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="font-mono text-xs space-y-1">
              <p><code>signal input</code> in[4];</p>
              <p><code>signal output</code> out[2];</p>
            </div>
            <div>
              <p className="font-mono text-xs"><code>component</code> main {'{'}public [a]{'}'} = Circuit();</p>
              <p className="text-xs text-muted-foreground mt-1">public 태그로 공개 입력 지정</p>
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Template vs Function</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-6">
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-sky-600 dark:text-sky-400 mb-2">Template</p>
            <ul className="space-y-1">
              <li>R1CS 제약을 생성</li>
              <li>시그널 사용 가능</li>
              <li><code>component</code>로 인스턴스화</li>
              <li>재사용 가능한 회로 패턴</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mb-2">Function</p>
            <ul className="space-y-1">
              <li>컴파일 타임 순수 계산</li>
              <li>시그널 사용 불가 (var만)</li>
              <li>직접 호출</li>
              <li>매개변수, 루프 바운드에 사용</li>
            </ul>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">Bits2Num 템플릿 예제</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 font-mono text-xs space-y-1">
            <p><code>template</code> <strong>Bits2Num</strong>(n) {'{'}</p>
            <p className="pl-4"><code>signal input</code> in[n];</p>
            <p className="pl-4"><code>signal output</code> out;</p>
            <p className="pl-4">var lc = 0; <span className="text-muted-foreground">// 선형 결합 누적</span></p>
            <p className="pl-4">var e2 = 1; <span className="text-muted-foreground">// 2의 거듭제곱</span></p>
            <p className="pl-4">for (var i = 0; i {'<'} n; i++) {'{'}</p>
            <p className="pl-8">lc += in[i] * e2;</p>
            <p className="pl-8">e2 = e2 + e2;</p>
            <p className="pl-4">{'}'}</p>
            <p className="pl-4">out <code>{'<=='}</code> lc;</p>
            <p>{'}'}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <code>component</code> main = Bits2Num(8); → 8비트 → 정수 변환
          </p>
          <M display>{'\\text{out} = \\sum_{i=0}^{n-1} \\text{in}[i] \\cdot 2^i'}</M>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">대입 연산자 3종</h3>
        <div className="not-prose space-y-3 mb-6">
          <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm">
            <p className="font-semibold text-xs mb-1">
              <code>{'<=='}</code> — 제약 + 대입 동시
            </p>
            <p className="font-mono text-xs">c <code>{'<=='}</code> a * b</p>
            <p className="text-xs text-muted-foreground mt-1">c = a*b 대입 AND 제약 추가: c - a*b = 0. 선형/이차 표현식에 항상 사용</p>
          </div>
          <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/30 p-4 text-sm">
            <p className="font-semibold text-xs mb-1">
              <code>{'<--'}</code> — 대입만 (비결정적)
            </p>
            <p className="font-mono text-xs">c <code>{'<--'}</code> a * b</p>
            <p className="text-xs text-muted-foreground mt-1">c = a*b 대입, 제약 없음. 나중에 별도 제약 추가 필수. 위험: 제약 없으면 증명자가 거짓값 가능</p>
          </div>
          <div className="rounded-lg border bg-sky-50 dark:bg-sky-950/30 p-4 text-sm">
            <p className="font-semibold text-xs mb-1">
              <code>{'==='}</code> — 제약만 (Circom 2 신규)
            </p>
            <p className="font-mono text-xs">c <code>{'==='}</code> a * b</p>
            <p className="text-xs text-muted-foreground mt-1">대입 없음, 제약만 추가. c는 이미 대입된 상태여야 함. 추가 제약 용도</p>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">흔한 안티패턴</h4>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-6">
          <div className="rounded-lg border border-red-300 dark:border-red-800 p-4 text-sm">
            <p className="font-semibold text-xs text-red-600 dark:text-red-400 mb-2">잘못된 사용</p>
            <p className="font-mono text-xs">out <code>{'<--'}</code> in / 2;</p>
            <p className="text-xs text-muted-foreground mt-1">제약 없음 — 증명자가 임의 값 가능!</p>
          </div>
          <div className="rounded-lg border border-emerald-300 dark:border-emerald-800 p-4 text-sm">
            <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mb-2">올바른 사용</p>
            <div className="font-mono text-xs space-y-1">
              <p>out <code>{'<--'}</code> in / 2;</p>
              <p>in <code>{'==='}</code> out * 2; <span className="text-muted-foreground">// 제약 강제</span></p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">컴포넌트 인스턴스화</h3>
        <div className="not-prose rounded-lg border p-4 text-sm space-y-3 mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 font-mono text-xs space-y-1">
            <p><code>component</code> mult = Multiplier2();</p>
            <p>mult.a <code>{'<=='}</code> 3;</p>
            <p>mult.b <code>{'<=='}</code> 7;</p>
            <p>x <code>{'<=='}</code> mult.c; <span className="text-muted-foreground">// x = 21</span></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">배열 컴포넌트</p>
            <div className="font-mono text-xs space-y-1">
              <p><code>component</code> gates[32];</p>
              <p>for (var i = 0; i {'<'} 32; i++) {'{'}</p>
              <p className="pl-4">gates[i] = XORGate();</p>
              <p>{'}'}</p>
            </div>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">Public 시그널 선언</h4>
        <div className="not-prose rounded-lg border p-3 text-sm mb-6">
          <p className="font-mono text-xs mb-2">
            <code>component</code> main {'{'}public [in, selector]{'}'} = MyCircuit();
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <code>in</code>과 <code>selector</code>가 공개 입력으로 설정</li>
            <li>• 나머지 모든 입력은 비공개(증인)</li>
            <li>• 출력 시그널은 자동으로 공개</li>
          </ul>
        </div>

        <h4 className="font-semibold mt-6 mb-3">제네릭 템플릿</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 font-mono text-xs space-y-1">
            <p><code>template</code> <strong>Mux</strong>(n) {'{'}</p>
            <p className="pl-4"><code>signal input</code> sel[log2(n)];</p>
            <p className="pl-4"><code>signal input</code> in[n];</p>
            <p className="pl-4"><code>signal output</code> out;</p>
            <p className="pl-4">...</p>
            <p>{'}'}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <code>component</code> mux = Mux(8); → log2(8) = 3 셀렉터 비트
          </p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">자주 쓰이는 템플릿 패턴</h4>
        <div className="not-prose grid gap-2 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {[
            { cat: '비교', items: 'IsZero, IsEqual, LessThan, GreaterThan' },
            { cat: '비트 분해', items: 'Num2Bits, Bits2Num' },
            { cat: '선택', items: 'Switcher, Mux, MultiMux' },
            { cat: '해싱', items: 'Poseidon(n), MiMCHasher, Sha256(n_bits)' },
            { cat: '머클 트리', items: 'MerkleTreeInclusionProof(depth), SparseMerkleTree' },
          ].map(p => (
            <div key={p.cat} className="rounded-lg border p-3 text-sm">
              <p className="font-semibold text-xs mb-1">{p.cat}</p>
              <p className="text-muted-foreground text-xs">{p.items}</p>
            </div>
          ))}
        </div>

        <h4 className="font-semibold mt-6 mb-3">제약 vs 계산 분리</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-xs mb-1">계산 (Witness Generation)</p>
              <p className="text-xs text-muted-foreground">WASM 실행 → 모든 시그널 값 계산</p>
            </div>
            <div>
              <p className="font-semibold text-xs mb-1">제약 (R1CS Proof)</p>
              <p className="text-xs text-muted-foreground">R1CS 제약으로 증명 생성</p>
            </div>
          </div>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 mt-3 font-mono text-xs space-y-1">
            <p>out <code>{'<--'}</code> in * in; <span className="text-muted-foreground">// 계산</span></p>
            <p>out <code>{'==='}</code> in * in; <span className="text-muted-foreground">// 제약</span></p>
            <p className="text-muted-foreground">// 또는: out <code>{'<=='}</code> in * in; (두 줄을 하나로)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
