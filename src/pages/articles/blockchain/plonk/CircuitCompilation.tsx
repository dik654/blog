import M from '@/components/ui/math';
import CircuitCompileViz from './viz/CircuitCompileViz';

export default function CircuitCompilation() {
  return (
    <section id="circuit-compilation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">회로 컴파일</h2>
      <div className="not-prose mb-8"><CircuitCompileViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">회로 구성</h3>
        <p>Composer API로 <strong>게이트와 와이어</strong>를 정의한다. 산술, 범위, 논리 게이트를 조합하여 원하는 연산을 표현한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">회로 구성 (Circuit Construction)</p>
            <div className="text-sm font-mono text-muted-foreground space-y-0.5">
              <p>composer = StandardComposer::new()</p>
              <p>x = composer.alloc(secret_value)</p>
              <p>y = composer.alloc(other_value)</p>
              <p>composer.arithmetic_gate(x, y, ...)</p>
              <p>composer.range_gate(x, 8)</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">→ 게이트 목록 + 와이어 배치 완성</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">전처리</h3>
        <p>게이트의 선택자 값을 <strong>Lagrange 보간</strong>하여 다항식으로 변환하고, KZG로 커밋한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">전처리 단계 (Preprocessing)</p>
            <ol className="text-sm space-y-2 text-muted-foreground list-decimal pl-5">
              <li className="rounded border border-sky-500/30 p-2">
                <span className="text-sky-400 font-medium">선택자 다항식 보간:</span> <M>{'q_M(X), q_L(X), \\ldots'}</M> → 게이트별 selector를 Lagrange 보간
              </li>
              <li className="rounded border border-amber-500/30 p-2">
                <span className="text-amber-400 font-medium">순열 다항식:</span> <M>{'\\sigma_a(X), \\sigma_b(X), \\sigma_c(X)'}</M> → copy constraint 위치 매핑
              </li>
              <li className="rounded border border-violet-500/30 p-2">
                <span className="text-violet-400 font-medium">KZG commit:</span> <M>{'[q_M]_1, [q_L]_1, \\ldots, [\\sigma_a]_1, \\ldots'}</M> → 검증 키에 포함
              </li>
            </ol>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">SRS 생성</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">SRS (Structured Reference String)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-sky-500/30 p-3">
                <p className="text-sm text-sky-400 font-medium mb-1">MPC로 &tau; 생성</p>
                <M display>{'\\text{SRS} = \\{ [\\tau^0]_1, [\\tau^1]_1, \\ldots, [\\tau^d]_1, [\\tau]_2 \\}'}</M>
                <p className="text-sm text-muted-foreground"><M>{'d \\ge \\text{max\\_gates} + 6'}</M> (블라인딩 여유)</p>
              </div>
              <div className="rounded border border-rose-500/30 p-3">
                <p className="text-sm text-rose-400 font-medium mb-1">&tau;는 폐기 (toxic waste)</p>
                <p className="text-sm text-muted-foreground">MPC 세레모니 후 비밀 값 파기. 유출 시 가짜 증명 생성 가능</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">키 생성</h3>
        <p>SRS + 전처리 결과로 <strong>Prover Key</strong>와 <strong>Verifier Key</strong>를 생성한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">pk / vk 생성</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-emerald-500/30 p-3">
                <p className="font-semibold text-sm text-emerald-400 mb-1">Prover Key (pk)</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li>SRS + 선택자 다항식 + 순열 다항식</li>
                  <li>도메인 정보 (<M>{'\\omega, n'}</M>)</li>
                </ul>
              </div>
              <div className="rounded border border-violet-500/30 p-3">
                <p className="font-semibold text-sm text-violet-400 mb-1">Verifier Key (vk)</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li>선택자 commitments <M>{'[q_M]_1, [q_L]_1, \\ldots'}</M></li>
                  <li>순열 commitments <M>{'[\\sigma_a]_1, [\\sigma_b]_1, [\\sigma_c]_1'}</M></li>
                  <li><M>{'[\\tau]_2'}</M> (SRS에서)</li>
                  <li>도메인 크기 <M>{'n'}</M>, 생성자 <M>{'\\omega'}</M></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
