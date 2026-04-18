import Math from '@/components/ui/math';
import SumcheckViz from './viz/SumcheckViz';

export default function Sumcheck() {
  return (
    <section id="sumcheck" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sumcheck 프로토콜</h2>
      <SumcheckViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-4">문제 정의</h3>
        <Math display>{'\\underbrace{\\sum_{x \\in \\{0,1\\}^n}}_{\\text{불리언 하이퍼큐브 전체}} \\underbrace{f(x)}_{\\text{다중선형 다항식}} = \\underbrace{T}_{\\text{prover 주장값}}'}</Math>
        <p className="text-sm text-muted-foreground mt-2 mb-3">
          prover가 "합이 <Math>{'T'}</Math>이다"라고 주장함. verifier가 직접 합산하면 <Math>{'2^n'}</Math>번 평가 필요 — 비실용적.
          sumcheck은 이를 <Math>{'n'}</Math>라운드 대화형 프로토콜로 축소함
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-4">프로토콜 흐름</h3>
        <p><strong>핵심 아이디어</strong> — 변수를 하나씩 고정하며 차원을 줄여가는 방식</p>
        <div className="space-y-3 mt-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-1">Round 1</h4>
            <Math display>{'\\underbrace{g_1(X_1)}_{\\substack{\\text{첫 변수만 남기고} \\\\ \\text{나머지 합산}}} = \\sum_{x_2,\\ldots,x_n} f(X_1, x_2, \\ldots, x_n)'}</Math>
            <p className="text-sm mt-1">
              prover가 <Math>{'g_1'}</Math>을 전송. verifier는 <Math>{'g_1(0) + g_1(1) = T'}</Math>를 확인 — <Math>{'X_1'}</Math>에 0과 1을 대입하면 원래 합이 복원되어야 함.
              확인 후 랜덤 챌린지 <Math>{'r_1'}</Math> 전송
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-1">Round <Math>{'i'}</Math></h4>
            <Math display>{'\\underbrace{g_i(X_i)}_{\\text{i번째 변수만 자유}} = \\sum_{x_{i+1},\\ldots,x_n} f(\\underbrace{r_1,\\ldots,r_{i-1}}_{\\text{이전 챌린지로 고정}}, X_i, x_{i+1}, \\ldots, x_n)'}</Math>
            <p className="text-sm mt-1">
              prover가 <Math>{'g_i'}</Math>를 전송. verifier는 <Math>{'g_i(0) + g_i(1) = g_{i-1}(r_{i-1})'}</Math>를 확인 — 이전 라운드 다항식과의 일관성 검증. 확인 후 랜덤 <Math>{'r_i'}</Math> 전송
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-1">최종 (Round <Math>{'n'}</Math>)</h4>
            <p className="text-sm">
              단일 점 <Math>{'(r_1,\\ldots,r_n)'}</Math>에서의 평가로 귀결 — PCS로 검증
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mt-8 mb-4">구체적 예시: <Math>{'n=2'}</Math></h3>
        <Math display>{'f(x_1,x_2) = \\underbrace{2x_1 x_2}_{\\text{교차항}} + \\underbrace{x_1}_{\\text{1차항}} + \\underbrace{1}_{\\text{상수항}}'}</Math>
        <p className="text-sm text-muted-foreground mt-2 mb-3">
          전체 합: <Math>{'f(0,0)+f(0,1)+f(1,0)+f(1,1) = 1+1+2+4 = 8 = T'}</Math>
        </p>
        <div className="space-y-3 mt-4">
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
            <h4 className="font-medium text-sm mb-1">Round 1</h4>
            <Math display>{'g_1(X_1) = \\underbrace{f(X_1,0)}_{\\text{=}X_1+1} + \\underbrace{f(X_1,1)}_{\\text{=}2X_1+X_1+1} = 4X_1+2'}</Math>
            <p className="text-sm mt-1">
              검증: <Math>{'g_1(0)+g_1(1) = 2+6 = 8 = T'}</Math> — 통과. verifier가 랜덤 <Math>{'r_1=3'}</Math> 전송
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <h4 className="font-medium text-sm mb-1">Round 2</h4>
            <Math display>{'g_2(X_2) = f(\\underbrace{3}_{r_1},X_2) = \\underbrace{2 \\cdot 3 \\cdot X_2}_{6X_2} + \\underbrace{3}_{x_1\\text{항}} + 1 = 6X_2+4'}</Math>
            <p className="text-sm mt-1">
              검증: <Math>{'g_2(0)+g_2(1) = 4+10 = 14 = g_1(3)'}</Math> — 이전 라운드와 일관성 통과. verifier가 <Math>{'r_2=2'}</Math> 전송
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h4 className="font-medium text-sm mb-1">최종 검증</h4>
            <Math display>{'f(\\underbrace{3}_{r_1},\\underbrace{2}_{r_2}) = \\underbrace{2 \\cdot 3 \\cdot 2}_{12} + \\underbrace{3}_{x_1} + \\underbrace{1}_{\\text{상수}} = 16'}</Math>
            <p className="text-sm mt-1">
              <Math>{'g_2(2) = 6 \\cdot 2 + 4 = 16'}</Math> — 일치. 이제 단일 점 <Math>{'(3,2)'}</Math>에서의 평가만 PCS로 확인하면 증명 완료
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mt-8 mb-4">복잡도</h3>
        <Math display>{'\\underbrace{n \\text{ 라운드}}_{\\text{변수 수}} \\times \\underbrace{1 \\text{ 저차 다항식}}_{\\text{각 라운드 전송}} = \\underbrace{O(n)}_{\\text{총 통신량}} \\text{ 필드 원소}'}</Math>
        <p className="text-sm text-muted-foreground mt-2">
          Prover 비용: 각 라운드 <Math>{'i'}</Math>에서 부분합 계산 <Math>{'O(2^{n-i})'}</Math>, 전체 합산 <Math>{'O(2^n)'}</Math> — FFT 기반의 <Math>{'O(n \\log n)'}</Math>보다 빠름.
          verifier는 매 라운드 다항식 2점 평가 + 최종 1회 PCS 검증만 수행
        </p>
      </div>
    </section>
  );
}
