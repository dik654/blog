import M from '@/components/ui/math';
import ProvingDetailViz from './viz/ProvingDetailViz';

export default function ProvingDetail() {
  return (
    <section id="proving-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proving 상세</h2>
      <div className="not-prose mb-8"><ProvingDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          증명 생성의 핵심은 <strong>Witness 할당 → A,B,C 원소의 MSM 계산</strong>입니다.<br />
          각 원소의 수학적 구성과 멀티스레드 최적화를 상세히 분석합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Witness 계산</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-2">
          <h4 className="font-semibold text-base mb-2">SynthesisMode::Prove — 값 할당</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">Prove 모드: 실제 값 할당</p>
            <p className="text-xs"><code>cs.alloc()</code> → 실제 값 할당 (witness 계산)</p>
            <p className="text-xs"><code>enforce_constraint()</code> → 스킵 (Setup에서 이미 수집)</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">witness 벡터 구조</p>
            <p className="font-mono text-xs text-muted-foreground">
              w = [1, s₁..sₗ, w₁..wₘ] (One + public + private)
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">A 계산 상세</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-2">
          <h4 className="font-semibold text-base mb-2">A 계산 (G1 점)</h4>
          <M display>{'A = [\\alpha]_1 + \\sum_j w_j \\cdot a\\_query[j] + r \\cdot [\\delta]_1'}</M>
          <div className="grid gap-2 sm:grid-cols-3 mt-2">
            <div className="rounded border p-3 bg-sky-50 dark:bg-sky-950/30 text-center">
              <p className="font-mono text-xs font-semibold">[α]₁</p>
              <p className="text-xs text-muted-foreground">태그</p>
            </div>
            <div className="rounded border p-3 bg-emerald-50 dark:bg-emerald-950/30 text-center">
              <p className="font-mono text-xs font-semibold">Σ wⱼ·a_query[j]</p>
              <p className="text-xs text-muted-foreground">MSM (O(n))</p>
            </div>
            <div className="rounded border p-3 bg-amber-50 dark:bg-amber-950/30 text-center">
              <p className="font-mono text-xs font-semibold">r·[δ]₁</p>
              <p className="text-xs text-muted-foreground">블라인딩</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            MSM: Pippenger 윈도우 방식 + 멀티스레드 → <code>rayon::scope</code>로 각 윈도우 병렬 처리
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">B 계산 상세</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">B (G2 + G1 이중 MSM)</h4>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">G2/G1 두 버전 동시 계산</p>
            <M display>{'B_{g2} = [\\beta]_2 + \\sum_j w_j \\cdot b\\_g2\\_query[j] + s \\cdot [\\delta]_2'}</M>
            <M display>{'B_{g1} = [\\beta]_1 + \\sum_j w_j \\cdot b\\_g1\\_query[j] + s \\cdot [\\delta]_1'}</M>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">rayon::join 병렬화</p>
            <p className="text-xs text-muted-foreground">B_g2: 검증 페어링 e(A,B)에 사용</p>
            <p className="text-xs text-muted-foreground">B_g1: C 계산의 r·B' 항에 사용</p>
            <p className="text-xs text-muted-foreground">→ 두 MSM을 <code>rayon::join</code>으로 동시 실행</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">C 계산 상세</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">C = private LC + h·t + 블라인딩</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">3개 MSM 구성 요소</p>
            <p className="font-mono text-xs"><M>{'\\sum_{j \\in priv} w_j \\cdot l\\_query[j\\,\']'}</M> — private LC</p>
            <p className="font-mono text-xs"><M>{'\\sum_i h_i \\cdot h\\_query[i]'}</M> — QAP 만족 증거</p>
            <p className="font-mono text-xs"><M>{'s \\cdot A + r \\cdot B_{g1} - rs \\cdot [\\delta]_1'}</M> — 블라인딩</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">순서대로 실행 (의존성)</p>
            <ol className="space-y-1 text-xs list-decimal list-inside text-muted-foreground">
              <li>l_query MSM (private 변수 수)</li>
              <li>h_query MSM (회로 차수 d)</li>
              <li>블라인딩 항 조합 (상수 시간)</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
