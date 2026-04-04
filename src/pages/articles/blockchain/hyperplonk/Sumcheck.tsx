import Math from '@/components/ui/math';

export default function Sumcheck() {
  return (
    <section id="sumcheck" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sumcheck 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-4">문제 정의</h3>
        <p>
          prover가 주장함: <Math>{'\\sum_{x \\in \\{0,1\\}^n} f(x) = T'}</Math>
          <br />
          verifier가 직접 합산하면 <Math>{'2^n'}</Math>번 평가 필요 — 비실용적
          <br />
          sumcheck은 이를 <Math>{'n'}</Math>라운드 대화형 프로토콜로 축소함
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-4">프로토콜 흐름</h3>
        <p><strong>핵심 아이디어</strong> — 변수를 하나씩 고정하며 차원을 줄여가는 방식</p>
        <div className="space-y-3 mt-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-1">Round 1</h4>
            <p className="text-sm">
              prover가 <Math>{'g_1(X_1) = \\sum_{x_2,\\ldots} f(X_1, x_2, \\ldots)'}</Math> 전송
              <br />
          verifier: <Math>{'g_1(0) + g_1(1) = T'}</Math> 확인 후 랜덤 <Math>{'r_1'}</Math> 전송
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-1">Round <Math>{'i'}</Math></h4>
            <p className="text-sm">
              prover가 <Math>{'g_i(X_i)'}</Math> 전송 (이전 변수는 <Math>{'r_1,\\ldots,r_{i-1}'}</Math>로 고정)
              <br />
          verifier: <Math>{'g_i(0) + g_i(1) = g_{i-1}(r_{i-1})'}</Math> 확인 후 랜덤 <Math>{'r_i'}</Math> 전송
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
        <p>
          <Math>{'f(x_1,x_2) = 2x_1x_2 + x_1 + 1'}</Math>
          <br />
          전체 합: <Math>{'f(0,0)+f(0,1)+f(1,0)+f(1,1) = 1+1+2+4 = 8'}</Math>
        </p>
        <div className="space-y-3 mt-4">
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
            <h4 className="font-medium text-sm mb-1">Round 1</h4>
            <p className="text-sm">
              <Math>{'g_1(X_1) = f(X_1,0)+f(X_1,1) = 4X_1+2'}</Math>
              <br />
          <Math>{'g_1(0)+g_1(1) = 2+6 = 8 = T'}</Math> — 통과, verifier가 <Math>{'r_1=3'}</Math> 전송
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <h4 className="font-medium text-sm mb-1">Round 2</h4>
            <p className="text-sm">
              <Math>{'g_2(X_2) = f(3,X_2) = 6X_2+4'}</Math>
              <br />
          <Math>{'g_2(0)+g_2(1) = 4+10 = 14 = g_1(3)'}</Math> — 통과, verifier가 <Math>{'r_2=2'}</Math> 전송
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h4 className="font-medium text-sm mb-1">최종 검증</h4>
            <p className="text-sm">
              <Math>{'f(3,2) = 12+3+1 = 16'}</Math>, <Math>{'g_2(2) = 16'}</Math> — 일치, PCS로 확인하면 증명 완료
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mt-8 mb-4">복잡도</h3>
        <p>
          통신: <Math>{'n'}</Math>라운드 x 저차 다항식 1개 = 총 <Math>{'O(n)'}</Math> 필드 원소
          <br />
          Prover: 각 라운드 부분합 <Math>{'O(2^{n-i})'}</Math>, 전체 <Math>{'O(n)'}</Math> (제약 수 기준) — FFT <Math>{'O(n\\log n)'}</Math>보다 빠름
        </p>
      </div>
    </section>
  );
}
