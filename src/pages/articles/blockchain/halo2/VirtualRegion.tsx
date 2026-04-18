import VirtualRegionViz from './viz/VirtualRegionViz';

export default function VirtualRegion({ title }: { title?: string }) {
  return (
    <section id="virtual-region" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '가상 영역 관리 (Virtual Region)'}</h2>
      <div className="not-prose mb-8"><VirtualRegionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          halo2-lib의 핵심 설계 철학은 <strong>가상 영역(Virtual Region)</strong> 관리입니다.
          <br />
          개발자는 물리적 컬럼/행 배치를 신경 쓰지 않고 논리적 연산 흐름에만 집중하며,
          <code>SinglePhaseCoreManager</code>가 여러 <code>Context</code>를 물리적 컬럼으로
          자동 chunking합니다.
        </p>
        <p>
          <code>CopyConstraintManager</code>는 advice 셀 간, 그리고 상수-advice 셀 간의
          equality constraint를 전역적으로 관리합니다.
          <br />
          <code>LookupAnyManager</code>는
          lookup argument를 별도 advice 컬럼으로 복사하여 처리합니다.
        </p>

        {/* SinglePhaseCoreManager */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">SinglePhaseCoreManager &mdash; 가상 &rarr; 물리 Chunking</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>threads: Vec&lt;Context&lt;F&gt;&gt;</code></p>
              <p className="text-xs text-muted-foreground mt-1">병렬 실행 가능한 가상 context 벡터. 각 thread는 독립된 advice 시퀀스를 보유</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>fn assign_raw(&self, columns: &[Column&lt;Advice&gt;], region: &mut Region)</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                모든 context의 셀을 물리 컬럼에 순차 배치. chunk_size = usable_rows로 컬럼을 순환
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>fn parallelize_in&lt;T&gt;(&mut self, input: Vec&lt;T&gt;, f: impl Fn)</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                입력을 분할하여 여러 context에서 병렬 처리 &mdash; 최종적으로 동일 물리 레이아웃으로 합산
              </p>
            </div>
          </div>
        </div>

        {/* CopyConstraintManager */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">CopyConstraintManager &mdash; 전역 등가 제약</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>advice_equalities: Vec&lt;(ContextCell, ContextCell)&gt;</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                서로 다른 context의 셀이 같은 값이어야 함을 기록. synthesize 시 <code>region.constrain_equal()</code>로 변환
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>constant_equalities: Vec&lt;(F, ContextCell)&gt;</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                상수 값과 advice 셀의 등가 &mdash; fixed 컬럼에 상수를 배치하고 copy constraint로 연결
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Virtual vs Physical Region</h3>

        {/* 2-layer 비교 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Physical Layer (회로 최종 형태)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Rectangular grid (columns x rows) &mdash; 고정 크기</li>
              <li>Column 간 advice rotation (<code>Rotation(k)</code>)</li>
              <li>Selector polynomials &mdash; gate 활성화 제어</li>
              <li>Proof가 실제 작동하는 영역</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Virtual Layer (개발자 API)</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Linear "context" &mdash; 순차적 셀 추가</li>
              <li>Abstract cell references &mdash; 물리 위치 무관</li>
              <li>Constraint는 작성 순서대로</li>
              <li>Layout은 manager가 자동 결정</li>
            </ul>
          </div>
        </div>

        {/* 사용 예시 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">Virtual Region 사용 흐름</p>
          <div className="grid grid-cols-4 gap-2 text-sm text-center">
            <div className="rounded border bg-card p-3">
              <p className="font-mono font-semibold text-xs">1</p>
              <p className="text-xs text-muted-foreground mt-1"><code>Context::new()</code> 생성, <code>load_witness()</code>로 값 적재</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-mono font-semibold text-xs">2</p>
              <p className="text-xs text-muted-foreground mt-1"><code>gate.add()</code>, <code>gate.mul()</code> &mdash; context에 셀 순차 저장</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-mono font-semibold text-xs">3</p>
              <p className="text-xs text-muted-foreground mt-1">Manager가 chunk 단위로 physical column에 배치</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-mono font-semibold text-xs">4</p>
              <p className="text-xs text-muted-foreground mt-1"><code>synthesize</code> 시 CopyConstraint 적용 &rarr; 물리 layout 확정</p>
            </div>
          </div>
        </div>

        {/* 장단점 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold text-emerald-400 mb-2">장점</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>개발자 생산성 증가 &mdash; 물리 배치 신경 쓸 필요 없음</li>
                <li>Column 수 자동 최적화</li>
                <li>Constraint 재사용 최대화</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-red-400 mb-2">단점</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>Physical layout 직접 제어 어려움</li>
                <li>Performance tuning 제한</li>
                <li>Debug 복잡도 증가</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
