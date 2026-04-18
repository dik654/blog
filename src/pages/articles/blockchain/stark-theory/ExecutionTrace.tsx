import M from '@/components/ui/math';
import TraceTableViz from './viz/TraceTableViz';

export default function ExecutionTrace() {
  return (
    <section id="execution-trace" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 추적 (Execution Trace)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          계산을 테이블로 표현 &mdash; 행=스텝, 열=레지스터. 각 열을 다항식으로 보간.
        </p>
      </div>
      <div className="not-prose"><TraceTableViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Execution Trace 상세</h3>

        {/* 개념 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">Trace 구조</p>
          <p className="text-sm mb-3">연산의 모든 중간 상태를 테이블로 기록. Row = timestep, Column = register/variable.</p>
          <div className="overflow-x-auto text-sm">
            <p className="text-xs text-muted-foreground mb-2">예시: Fibonacci 수열 계산</p>
            <table className="w-full border-collapse max-w-xs">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left p-2 text-muted-foreground">step</th>
                  <th className="text-left p-2 text-muted-foreground">a</th>
                  <th className="text-left p-2 text-muted-foreground">b</th>
                </tr>
              </thead>
              <tbody className="text-xs font-mono">
                <tr className="border-b border-border/30"><td className="p-2">0</td><td className="p-2">1</td><td className="p-2">1</td></tr>
                <tr className="border-b border-border/30"><td className="p-2">1</td><td className="p-2">1</td><td className="p-2">2</td></tr>
                <tr className="border-b border-border/30"><td className="p-2">2</td><td className="p-2">2</td><td className="p-2">3</td></tr>
                <tr className="border-b border-border/30"><td className="p-2">3</td><td className="p-2">3</td><td className="p-2">5</td></tr>
                <tr className="border-b border-border/30"><td className="p-2">4</td><td className="p-2">5</td><td className="p-2">8</td></tr>
                <tr className="border-b border-border/30"><td className="p-2">5</td><td className="p-2">8</td><td className="p-2">13</td></tr>
                <tr><td className="p-2 text-muted-foreground">T</td><td className="p-2"><M>F_T</M></td><td className="p-2"><M>F_{'{T+1}'}</M></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 전이 관계 + 경계 조건 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">전이 관계 &amp; 경계 조건</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Transition (전이)</p>
              <p className="text-xs text-muted-foreground mt-1">모든 연속 row 쌍에 대해 성립</p>
              <div className="mt-2 space-y-3">
                <div>
                  <M display>{'\\underbrace{a_{i+1}}_{\\text{다음 행의 a}} = \\underbrace{b_i}_{\\text{현재 행의 b}}'}</M>
                  <p className="text-sm text-muted-foreground mt-2">
                    <M>a_{'{i+1}'}</M>: 다음 스텝의 첫째 레지스터 값. <M>b_i</M>: 현재 스텝의 둘째 레지스터 값. 즉 현재 b가 그대로 다음 a로 이동.
                  </p>
                </div>
                <div>
                  <M display>{'\\underbrace{b_{i+1}}_{\\text{다음 행의 b}} = \\underbrace{a_i}_{\\text{현재 행의 a}} + \\underbrace{b_i}_{\\text{현재 행의 b}}'}</M>
                  <p className="text-sm text-muted-foreground mt-2">
                    <M>b_{'{i+1}'}</M>: 다음 스텝의 둘째 레지스터. <M>a_i</M>: 현재 스텝의 첫째 레지스터. <M>b_i</M>: 현재 스텝의 둘째 레지스터. 피보나치 덧셈 규칙.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Boundary (경계)</p>
              <p className="text-xs text-muted-foreground mt-1">특정 row에서 성립하는 초기/최종 조건</p>
              <div className="mt-2 space-y-3">
                <div>
                  <M display>{'\\underbrace{a_0}_{\\text{첫 행의 a}} = 1,\\quad \\underbrace{b_0}_{\\text{첫 행의 b}} = 1'}</M>
                  <p className="text-sm text-muted-foreground mt-2">
                    <M>a_0</M>: 0번째 스텝의 첫째 레지스터 초기값. <M>b_0</M>: 0번째 스텝의 둘째 레지스터 초기값. 피보나치 수열의 시작점 <M>(1, 1)</M>.
                  </p>
                </div>
                <div>
                  <M display>{'\\underbrace{b_T}_{\\text{마지막 행의 b}} = \\underbrace{\\text{expected\\_output}}_{\\text{검증할 최종 결과}}'}</M>
                  <p className="text-sm text-muted-foreground mt-2">
                    <M>b_T</M>: <M>T</M>번째(마지막) 스텝의 둘째 레지스터. 이 값이 공개 입력으로 주어진 기대 출력과 일치해야 증명이 유효.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 다항식 보간 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">다항식 보간 (Polynomial Interpolation)</p>
          <div className="space-y-2 text-sm">
            <p>각 column을 다항식으로 표현 &mdash; <M>a(x)</M>는 <M>a_0, a_1, \ldots, a_T</M>를 지나는 다항식</p>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Interpolation domain</p>
              <M display>{'\\underbrace{D}_{\\text{보간 도메인}} = \\{ \\underbrace{\\omega^0}_{\\text{1}}, \\underbrace{\\omega^1}_{\\text{원시근}}, \\ldots, \\underbrace{\\omega^T}_{\\text{T번째 거듭제곱}} \\}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>D</M>: 다항식 보간에 사용할 평가 지점들의 집합. <M>\omega</M>: <M>T</M>차 원시 단위근(primitive root of unity), <M>\omega^T = 1</M>을 만족하는 유한체 원소. 각 <M>\omega^i</M>가 trace의 <M>i</M>번째 행에 대응.
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-2">Lagrange interpolation</p>
              <M display>{'\\underbrace{a(\\omega^i)}_{\\text{다항식 a를 ω^i에서 평가}} = \\underbrace{a_i}_{\\text{trace i행의 a값}},\\quad \\underbrace{b(\\omega^i)}_{\\text{다항식 b를 ω^i에서 평가}} = \\underbrace{b_i}_{\\text{trace i행의 b값}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>a(x)</M>, <M>b(x)</M>: 각 열의 값을 지나도록 보간한 다항식. <M>\omega^i</M>: <M>i</M>번째 행에 대응하는 도메인 원소. Lagrange 보간으로 <M>T+1</M>개 점을 모두 통과하는 유일한 <M>T</M>차 다항식을 구성.
              </p>
            </div>
          </div>
        </div>

        {/* Trace 크기 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-3">Trace 크기와 실무 예시</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-1">크기 공식</p>
              <p className="text-xs text-muted-foreground">
                <code>T</code> = trace length (2의 거듭제곱), <code>W</code> = width (columns)
              </p>
              <M display>{'\\underbrace{\\text{Total cells}}_{\\text{전체 셀 수}} = \\underbrace{T}_{\\text{행 수 (스텝)}} \\cdot \\underbrace{W}_{\\text{열 수 (레지스터)}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">
                <M>T</M>: trace 길이, 항상 <M>2^k</M> 형태로 패딩. <M>W</M>: 레지스터(열) 수, VM 아키텍처에 따라 결정. 전체 셀 수가 증명 생성 시간과 메모리 사용량을 좌우.
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs mb-1">프로젝트별 열 수</p>
              <div className="text-xs text-muted-foreground space-y-1 mt-1">
                <p>Cairo VM &mdash; ~32 columns</p>
                <p>Risc0 &mdash; ~256 columns (RISC-V)</p>
                <p>Plonky2 &mdash; ~135 columns</p>
              </div>
            </div>
          </div>
        </div>

        {/* 실제 STARK에서 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-sky-400 mb-3">실제 STARK 구현 고려사항</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">Padding</p>
              <p className="text-xs text-muted-foreground mt-1"><code>T</code>를 <M>2^k</M>로 맞춤</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">Multi-trace</p>
              <p className="text-xs text-muted-foreground mt-1">여러 테이블 (main + auxiliary)</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">Public inputs</p>
              <p className="text-xs text-muted-foreground mt-1">경계 제약(boundary constraint)으로 처리</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">Memory</p>
              <p className="text-xs text-muted-foreground mt-1">정렬된 access trace 별도 관리</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
