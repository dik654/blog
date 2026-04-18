import M from '@/components/ui/math';
import SetupDetailViz from './viz/SetupDetailViz';

export default function SetupDetail() {
  return (
    <section id="setup-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Setup 상세</h2>
      <div className="not-prose mb-8"><SetupDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Setup 과정은 <strong>Toxic Waste 생성 → 회로 합성 → QAP 변환 → 키 계산 → MPC</strong>의
          5단계로 구성됩니다. 각 단계의 구현 세부사항을 살펴봅니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">회로 합성과 QAP 변환</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">SynthesisMode::Setup → R1CS → QAP</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">Setup 모드: 값 없이 구조만 수집</p>
            <p className="text-xs"><code>cs.alloc()</code> → 변수 개수만 카운트 (값 미할당)</p>
            <p className="text-xs"><code>enforce_constraint()</code> → R1CS 매트릭스 A, B, C 수집</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">Lagrange 보간으로 다항식 생성</p>
            <p className="text-xs">
              <M>{'a_j(x), b_j(x), c_j(x)'}</M> ← Lagrange 보간
            </p>
            <p className="text-xs text-muted-foreground">각 변수 j에 대한 다항식 3개 생성</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">키 구성 요소 계산</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">Query 벡터 + 배치 MSM</h4>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">5종 query 벡터 (SRS 포인트)</p>
            <p className="font-mono text-xs"><code>a_query[j]</code> = [aⱼ(τ)]₁ — A 계산용</p>
            <p className="font-mono text-xs"><code>b_g1_query[j]</code> = [bⱼ(τ)]₁ — C 계산용</p>
            <p className="font-mono text-xs"><code>b_g2_query[j]</code> = [bⱼ(τ)]₂ — B 계산용</p>
            <p className="font-mono text-xs"><code>h_query[i]</code> = [τⁱ · t(τ) / δ]₁ — h(x) 증명용</p>
            <p className="font-mono text-xs"><code>l_query[j']</code> = [lcⱼ / δ]₁ — private LC용</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">Pippenger 윈도우 최적화</p>
            <p className="text-xs">
              배치 MSM: <code>window_size</code> = <M>{'\\ln(n) + 2'}</M>
            </p>
            <p className="text-xs text-muted-foreground">Pippenger 알고리즘으로 수천 개 스칼라곱 병렬 처리</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">MPC 세레모니</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">Powers of Tau — 2단계 MPC</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium">Phase 1: 범용 (여러 회로 공유)</p>
            <p className="text-xs text-muted-foreground">
              각 참여자 i가 <M>{'s_i'}</M> 생성 → <M>{'\\tau = \\prod s_i'}</M>
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium">Phase 2: 회로별 파라미터 (α,β,γ,δ)</p>
            <p className="text-xs text-muted-foreground">각 참여자가 자기 비밀 기여 후 삭제</p>
          </div>
          <p className="text-xs font-medium mt-1">1-of-N 신뢰: N명 중 1명만 정직해도 안전</p>
        </div>
      </div>
    </section>
  );
}
