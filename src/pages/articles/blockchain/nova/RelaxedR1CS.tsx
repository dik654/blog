import M from '@/components/ui/math';
import RelaxedR1CSViz from './viz/RelaxedR1CSViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function RelaxedR1CS({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="relaxed-r1cs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Relaxed R1CS — 폴딩 가능한 형태'}</h2>
      <div className="not-prose mb-8"><RelaxedR1CSViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>표준 R1CS</strong> 는 <M>{'(A z) \\circ (B z) = C z'}</M> 형태의 정확한 등식이다.
          여기서 <M>{'\\circ'}</M> 는 Hadamard 곱 (요소별 곱). 이 형태를 그대로 폴딩하면
          교차 곱셈항이 발생하여 등식이 깨진다.
          Nova 는 <strong>스케일 인수 u 와 에러 벡터 E</strong> 를 추가한 Relaxed 형태로 확장하여
          폴딩이 닫혀 있게(closed under folding) 만든다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">표준 R1CS vs Relaxed R1CS</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Standard R1CS</p>
            <M display>{'\\underbrace{(A z) \\circ (B z)}_{\\text{좌·우변 곱 (Hadamard)}} = \\underbrace{C z}_{\\text{출력}}'}</M>
            <ul className="text-sm space-y-1 text-foreground/80 mt-2">
              <li><M>z</M> = (1, x, w) — public + witness</li>
              <li><M>A, B, C</M> ∈ <M>{'\\mathbb{F}^{m \\times n}'}</M> 희소 행렬</li>
              <li><strong>닫혀 있지 않음</strong> — 두 인스턴스 합이 R1CS 가 아님</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Relaxed R1CS</p>
            <M display>{'(A z) \\circ (B z) = \\underbrace{u}_{\\text{스케일 스칼라}} \\cdot (C z) + \\underbrace{E}_{\\text{에러 벡터 (폴딩 누적용)}}'}</M>
            <ul className="text-sm space-y-1 text-foreground/80 mt-2">
              <li><M>{'u \\in \\mathbb{F}'}</M> — 스케일 (표준은 u=1)</li>
              <li><M>{'E \\in \\mathbb{F}^m'}</M> — 에러 벡터 (표준은 0)</li>
              <li><strong>폴딩에 닫혀 있음</strong> — 합도 Relaxed R1CS</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 u 와 E 가 필요한가 — 폴딩 공식 유도</h3>
        <p>
          두 표준 R1CS 인스턴스 <M>{'z_1, z_2'}</M> 가 모두 만족이라 가정. 도전값 <M>r</M> 로
          선형 결합 <M>{'z = z_1 + r z_2'}</M> 를 시도하면:
        </p>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <M display>{'(A z) \\circ (B z) = (A z_1) \\circ (B z_1) + r \\cdot \\underbrace{T}_{\\text{교차항}} + r^2 \\cdot (A z_2) \\circ (B z_2)'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            여기서 <M>{'T = (A z_1) \\circ (B z_2) + (A z_2) \\circ (B z_1)'}</M>.
            우변은 <M>{'C z_1 + r^2 \\cdot C z_2'}</M> 이지만 좌변에는 추가로
            <M>{'\\; r T'}</M> 가 끼어든다. 등식이 깨진다.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>해결:</strong> 우변에 <M>{'r T'}</M> 를 흡수할 자리 = 에러 <M>E</M>.
            그리고 두 차수 항의 차이를 메우기 위한 스케일 = <M>{'u = 1 + r'}</M>.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">RelaxedR1CSInstance 의 구성 요소</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm mb-2">Instance (공개)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><M>{'\\overline{W}'}</M>: <code>comm_W</code> — Witness 벡터의 Pedersen 커밋</li>
              <li><M>{'\\overline{E}'}</M>: <code>comm_E</code> — 에러 벡터의 커밋</li>
              <li><M>u</M>: <code>u: F</code> — 스케일 스칼라</li>
              <li><M>X</M>: <code>X: Vec&lt;F&gt;</code> — 공개 IO (z_0, z_i, hash)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm mb-2">Witness (비공개)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><M>W</M>: <code>W: Vec&lt;F&gt;</code> — 증인 벡터</li>
              <li><M>E</M>: <code>E: Vec&lt;F&gt;</code> — 에러 벡터</li>
              <li><M>{'r_W, r_E'}</M>: 블라인딩 스칼라 (zero-knowledge 보장)</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Pedersen 커밋의 동형성</h3>
        <div className="not-prose rounded-lg border-l-4 border-l-purple-500 bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Nova 가 폴딩으로 충분한 이유 = Pedersen 커밋이 덧셈에 대해 동형 (homomorphic):
          </p>
          <M display>{'\\underbrace{\\mathrm{Commit}(W_1) + r \\cdot \\mathrm{Commit}(W_2)}_{\\text{커밋 위에서 직접 결합}} = \\underbrace{\\mathrm{Commit}(W_1 + r W_2)}_{\\text{결합된 W 의 커밋과 동일}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            덕분에 Verifier 는 <M>W</M> 자체를 보지 않고도 새 커밋을 직접 계산할 수 있다.
            KZG 도 동형이지만 trusted setup 이 필요해 Nova 는 IPA 기반 Pedersen 사용.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">초기 상태와 Default 인스턴스</h3>
        <p>
          IVC 첫 스텝에서는 누적된 인스턴스가 없다. Nova 는 <code>RelaxedR1CSInstance::default</code> 로
          <strong>모두 0</strong> 인 trivial 인스턴스를 사용한다 — <M>{'\\overline{W} = \\overline{E} = \\mathbf{0}, u = 0, X = \\mathbf{0}'}</M>.
          이 인스턴스는 자명하게 만족이며, 첫 폴딩 후 <M>{'(U_1, W_1)'}</M> = (default + r × 첫 스텝) 으로 시작한다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('nova-r1cs', codeRefs['nova-r1cs'])} />
            <span className="text-[10px] text-muted-foreground self-center">r1cs/mod.rs — RelaxedR1CSInstance/Witness 정의</span>
          </div>
        )}

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: u 와 E 가 만들어내는 닫힘성</p>
          <p>
            R1CS 의 곱셈 제약 <M>{'AzBz = Cz'}</M> 는 도전값 r 의 차수 폭발 (1, r, r²) 때문에
            그대로 결합할 수 없다. <strong>u</strong> 가 <M>{'r^0 \\to r^2'}</M> 를 흡수하고
            <strong>E</strong> 가 교차항 <M>{'r T'}</M> 를 흡수하여 폴딩 후에도 같은 형태가 유지된다.
            이것이 Nova 의 모든 효율의 출발점.
          </p>
        </div>
      </div>
    </section>
  );
}
