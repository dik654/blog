import Math from '@/components/ui/math';

export default function LowDegreeTest() {
  return (
    <section id="low-degree-test" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Low-degree Testing</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Low-degree testing 문제를 정식으로 정의하면 이렇다.
          <br />
          오라클 접근(oracle access)이 주어진 함수 <Math>{'f: \\mathbb{F} \\to \\mathbb{F}'}</Math>가
          차수 <Math>{'d'}</Math> 미만인 다항식에 <strong>가까운지(close)</strong> 판별하라
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">가깝다(close)의 의미</h3>
        <p>
          함수 <Math>{'f'}</Math>와 차수 <Math>{'< d'}</Math>인 다항식 <Math>{'p'}</Math>의 거리는
          두 함수가 불일치하는 점의 비율이다.
          <br />
          <Math>{'\\delta(f, p) = \\Pr_{x \\leftarrow \\mathbb{F}}[f(x) \\neq p(x)]'}</Math>
          <br />
          도메인 <Math>{'D'}</Math> 위에서 평가된 <Math>{'f'}</Math>가
          어떤 차수 <Math>{'< d'}</Math> 다항식과 <Math>{'\\delta'}</Math>-가까우면 통과시킨다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">나이브 접근: 왜 느린가?</h3>
        <p>
          차수 <Math>{'< d'}</Math>인 다항식은 <Math>{'d'}</Math>개 계수로 결정된다.
          <br />
          <Math>{'d + 1'}</Math>개 점을 쿼리하고 Lagrange 보간하면 유일한 다항식이 결정된다.
          <br />
          나머지 점과 비교하면 되지만, 이 방법은 <Math>{'O(d)'}</Math> 쿼리가 필요하다.
          <br />
          <Math>{'d = 2^{20}'}</Math>이면 백만 개 이상 — 검증이 증명 읽기와 다를 바 없다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Schwartz-Zippel 보조정리</h3>
        <p>
          FRI의 건전성(soundness)은 이 보조정리에 기반한다:
        </p>
        <Math display>{'\\text{서로 다른 차수-}d\\text{ 다항식 }p, q \\text{는 최대 }d\\text{개 점에서만 일치한다}'}</Math>
        <p>
          도메인 크기 <Math>{'|D| = n'}</Math>이고 <Math>{'d \\ll n'}</Math>이면,
          랜덤 점 하나를 뽑았을 때 <Math>{'p'}</Math>와 <Math>{'q'}</Math>가 일치할 확률은 최대 <Math>{'d/n'}</Math>이다.
          <br />
          예: <Math>{'d = 1000'}</Math>, <Math>{'n = 10^6'}</Math>이면 한 점 쿼리로 <Math>{'99.9\\%'}</Math> 확률로 차이를 감지한다
        </p>

        <div className="not-prose grid grid-cols-1 gap-3 my-4">
          {[
            {
              step: '나이브: d+1개 쿼리',
              desc: '보간 후 전수 비교 → 정확하지만 검증 비용 O(d)',
              color: 'amber',
            },
            {
              step: 'FRI: O(log d)개 쿼리',
              desc: '재귀적 접기 + Schwartz-Zippel → 압도적 확률로 부정직한 증명자 탐지',
              color: 'emerald',
            },
          ].map(p => (
            <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>

        <p>
          FRI는 이 확률론적 검사를 <strong>재귀적 접기(folding)</strong>와 결합하여
          쿼리 수를 <Math>{'O(d)'}</Math>에서 <Math>{'O(\\log d)'}</Math>로 줄인다.
          <br />
          각 접기 라운드가 차수를 절반으로 줄이므로, <Math>{'\\log_2 d'}</Math>번이면 상수에 도달한다
        </p>
      </div>
    </section>
  );
}
