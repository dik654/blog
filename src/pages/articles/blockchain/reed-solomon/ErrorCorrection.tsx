import Math from '@/components/ui/math';

export default function ErrorCorrection() {
  return (
    <section id="error-correction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에러 감지 & 복구</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">에러 감지: 왜 가능한가?</h3>
        <p>
          차수 <Math>{'k-1'}</Math> 다항식은 <Math>{'k'}</Math>개 점으로 완전히 결정된다.
          <br />
          수신된 <Math>{'n'}</Math>개 값이 어떤 차수 <Math>{'k-1'}</Math> 다항식 위에도 놓이지 않으면
          → 오류가 발생한 것이다
        </p>
        <p>
          기하학적으로: 2차 다항식(포물선) 위의 6개 점 중 하나가 포물선을 벗어나면 즉시 감지된다.
          <br />
          <Math>{'n - k'}</Math>개의 중복 심볼이 있으면 최대 <Math>{'n - k'}</Math>개의 에러를 <strong>감지</strong>할 수 있다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">에러 정정: 한계</h3>
        <p>
          에러를 <strong>정정</strong>하려면 "어디가 틀렸는지"도 알아내야 한다.
          <br />
          위치와 값을 동시에 찾아야 하므로, 에러 하나당 중복 심볼 2개가 필요하다:
        </p>
        <Math display>{'t \\leq \\left\\lfloor \\frac{n - k}{2} \\right\\rfloor'}</Math>
        <p>
          <Math>{'t'}</Math>는 정정 가능한 최대 에러 수다.
          <br />
          앞의 예시에서 <Math>{'n=6, k=3'}</Math>이면 <Math>{'t = \\lfloor 3/2 \\rfloor = 1'}</Math>.
          <br />
          1개 위치의 에러를 찾아서 고칠 수 있다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          구체적 예시: 에러 1개 복구 (<Math>{'\\mathbb{F}_7'}</Math>)
        </h3>
        <p>
          올바른 코드워드: <Math>{'[1,\\; 6,\\; 3,\\; 6,\\; 1,\\; 2]'}</Math>.
          <br />
          전송 중 위치 2에서 에러 발생 → 수신: <Math>{'[1,\\; 6,\\; \\mathbf{5},\\; 6,\\; 1,\\; 2]'}</Math>
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-4">
        {[
          { step: '1. 에러 감지', desc: '6개 값으로 차수 2 다항식을 피팅하면 불일치 발생 → 에러 존재 확인', color: 'indigo' },
          { step: '2. 에러 위치 탐색', desc: '임의의 5개 점 조합으로 차수 2 다항식을 보간. 나머지 1개 점과 일치하는 조합을 찾는다', color: 'emerald' },
          { step: '3. 복구', desc: '위치 2를 제외한 5개 점 {(0,1),(1,6),(3,6),(4,1),(5,2)}로 보간 → f(x) = 1+2x+3x² 복원. f(2) = 3으로 정정', color: 'amber' },
        ].map(p => (
          <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">실전 알고리즘</h3>
        <p>
          위의 "모든 조합을 시도하는" 방식은 <Math>{'O(\\binom{n}{k})'}</Math>로 느리다.
          <br />
          실제로는 Berlekamp-Welch 알고리즘이나 유클리드 알고리즘으로 <Math>{'O(n^2)'}</Math>에 해결한다.
          <br />
          핵심은 에러 위치 다항식(Error Locator Polynomial)을 찾는 것이다:
        </p>
        <Math display>{'E(x) = \\prod_{i \\in \\text{errors}} (x - \\alpha_i)'}</Math>
        <p>
          <Math>{'E(x)'}</Math>의 근이 에러 위치를 알려준다.
          <br />
          에러 위치를 알면{' '}
          <a href="/crypto/lagrange" className="text-indigo-400 hover:underline">Lagrange 보간</a>으로
          올바른 다항식을 복원한다
        </p>
      </div>
    </section>
  );
}
