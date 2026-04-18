import M from '@/components/ui/math';
import LagrangeConceptViz from './viz/LagrangeConceptViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lagrange 보간이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          n개 점이 주어지면 그 점들을 모두 지나는 유일한 n-1차 다항식 복원.
          <br />
          INTT의 핵심 원리.
        </p>
      </div>
      <div className="not-prose"><LagrangeConceptViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Lagrange 보간 개요</h3>

        <h4 className="text-lg font-semibold mt-5 mb-2">기본 정리</h4>
        <p>
          서로 다른 n개의 점 <M>{'(x_0, y_0), \\ldots, (x_{n-1}, y_{n-1})'}</M>이 주어지면,
          <M>{'f(x_i) = y_i'}</M>를 만족하는 차수 <M>{'< n'}</M>인 다항식 <M>{'f(x)'}</M>가 <strong>유일하게</strong> 존재한다.
          <br />
          Lagrange(1795)가 공식화했으나, Edward Waring(1779)이 먼저 발견했다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">유일성 증명</h4>
        <p>
          <M>{'f'}</M>와 <M>{'g'}</M> 모두 n개 점을 보간한다고 가정하면, <M>{'(f - g)(x_i) = 0'}</M>이 모든 i에 대해 성립한다.
          <br />
          <M>{'f - g'}</M>는 차수 <M>{'< n'}</M>인데 n개의 근을 가지므로 영다항식이어야 한다 → <M>{'f = g'}</M>
        </p>
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-3">응용 분야</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { name: '수치 해석', desc: '함수 근사, 가우스 구적법(Gauss quadrature)에 의한 수치 적분', color: 'indigo' },
          { name: '암호학', desc: 'Shamir 비밀 분산, 다항식 커밋먼트, 임계 서명(threshold signatures)', color: 'emerald' },
          { name: 'ZK 증명', desc: '위트니스를 다항식으로 변환, Lagrange basis 제약 시스템, INTT', color: 'amber' },
          { name: '오류 정정', desc: 'Reed-Solomon 부호, 보간을 통한 디코딩', color: 'indigo' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h4 className="text-lg font-semibold mt-5 mb-2">평가 vs 보간: 두 가지 쌍대 문제</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400">평가 (Evaluation)</p>
            <p className="text-sm mt-1.5 text-foreground/75">
              다항식 → n개 점의 값 계산.
              직접 계산 <code>O(n²)</code>, FFT/NTT로 <code>O(n log n)</code>
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400">보간 (Interpolation)</p>
            <p className="text-sm mt-1.5 text-foreground/75">
              n개 값 → 다항식 복원.
              나이브 Lagrange <code>O(n²)</code>, IFFT/INTT로 <code>O(n log n)</code> (단위근 한정)
            </p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-5 mb-2">다항식 표현 형태</h4>
        <div className="not-prose grid grid-cols-1 gap-3 my-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400">계수 형태 (Coefficient form)</p>
            <p className="text-sm mt-1.5 text-foreground/75">
              <M>{'f(x) = a_0 + a_1 x + \\cdots + a_{n-1} x^{n-1}'}</M>. 대수적 연산에 적합
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400">평가 형태 (Evaluation form)</p>
            <p className="text-sm mt-1.5 text-foreground/75">
              <M>{'f = [f(x_0), f(x_1), \\ldots, f(x_{n-1})]'}</M>. 점별 연산(곱셈, 덧셈)에 적합
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400">Lagrange basis 형태</p>
            <p className="text-sm mt-1.5 text-foreground/75">
              <M>{'f = \\sum_i y_i \\cdot L_i(x)'}</M>. <M>{'L_i'}</M>는 <M>{'x_i'}</M>에서 1, 나머지에서 0. 보간과 증명에 적합
            </p>
          </div>
        </div>
        <p>
          계수 ↔ 평가 변환은 FFT/INTT, 평가 ↔ Lagrange는 자명하게 <M>{'c_i = y_i'}</M>
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">ZK에서 Lagrange가 근본인 이유</h4>
        <p>
          크기 n 위트니스 → 평가값 → 다항식으로 보간 → 다항식 항등식으로 관계 검증 → 랜덤 점에서 질의하여 건전성 확보.
          <br />
          PLONK은 <M>{'H = \\{\\omega^i\\}'}</M> 위에서 위트니스 벡터를 보간하고,
          STARK은 실행 트레이스를 시간 스텝별로 인덱싱하여 LDE용 다항식으로 보간한다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">복잡도 비교</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          {[
            { name: '직접 공식', desc: 'O(n²) 곱셈. 각 L_i(x)·y_i 계산에 O(n) 나눗셈', color: 'indigo' },
            { name: 'Newton 형태', desc: 'O(n²)이지만 점진적. 새 점 추가 시 O(n)', color: 'emerald' },
            { name: '단위근 기반 (INTT)', desc: 'O(n log n). 구조화된 평가점 필요', color: 'amber' },
            { name: 'Barycentric', desc: '가중치 w_i 전처리 O(n²), 이후 각 평가 O(n). 수치적으로 안정', color: 'indigo' },
          ].map(p => (
            <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
