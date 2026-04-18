import M from '@/components/ui/math';
import VanishingViz from './viz/VanishingViz';

export default function Vanishing() {
  return (
    <section id="vanishing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Vanishing Polynomial</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          도메인 모든 점에서 0인 다항식 &mdash; 제약 검증을 한 번의 다항식 나눗셈으로 가능하게 한다.
        </p>
      </div>
      <div className="not-prose"><VanishingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Vanishing Polynomial 심층</h3>

        <h4 className="text-lg font-semibold mt-5 mb-2">정의</h4>
        <p>
          도메인 <M>{'H = \\{h_0, h_1, \\ldots, h_{n-1}\\}'}</M>이 주어질 때, vanishing polynomial은:
        </p>
        <M display>{'\\underbrace{Z_H(x)}_{\\text{vanishing polynomial}} = \\underbrace{\\prod_{i=0}^{n-1}}_{\\text{도메인 모든 점에 대해}} \\underbrace{(x - h_i)}_{\\text{각 점을 근으로 만드는 인수}}'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          <M>{'Z_H(x)'}</M>: 도메인 H의 모든 점에서 0이 되는 다항식, <M>{'h_i'}</M>: 도메인의 i번째 원소, <M>{'n = |H|'}</M>: 도메인 크기
        </p>
      </div>

      <h4 className="text-lg font-semibold mt-5 mb-2">핵심 성질</h4>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { name: '도메인에서 영점', desc: 'Z_H(h_i) = 0 (모든 h_i에 대해)', color: 'indigo' },
          { name: '차수 = |H|', desc: 'deg(Z_H) = n. 최고차 계수 1 (monic)', color: 'emerald' },
          { name: '나눗셈 판정', desc: 'p(h_i) = 0 (∀i) ⟺ Z_H(x) | p(x)', color: 'amber' },
          { name: '증명 시스템 기반', desc: '"n개 제약 확인"을 "1개 다항식 등식 확인"으로 변환', color: 'indigo' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">증명 시스템에서의 사용</h4>
        <p>
          제약 다항식 <M>{'C(x)'}</M>가 H의 모든 점에서 0이면
          <M>{'C(x) = Z_H(x) \\cdot Q(x)'}</M>인 다항식 Q가 존재한다.
          <br />
          증명자가 <M>{'Q(x)'}</M>를 보내면, 검증자는 랜덤 점 z에서
          <M>{'C(z) = Z_H(z) \\cdot Q(z)'}</M>를 확인한다 (Schwartz-Zippel 보조정리).
          <br />
          이것이 SNARK/STARK 건전성의 토대다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">Z_H(x) 계산</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400">일반 도메인</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            곱 계산 <code>O(n)</code>, 저장 <code>n+1</code> 계수, 평가 <code>O(n)</code>/점
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="font-semibold text-sm text-emerald-400">단위근 도메인</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            <M>{'Z_H(x) = x^n - 1'}</M>. 저장 <code>O(1)</code>, 평가 <code>O(log n)</code> (고속 거듭제곱)
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">단위근의 마법</h4>
        <p>
          <M>{'H = \\{\\omega^0, \\omega^1, \\ldots, \\omega^{n-1}\\}'}</M>이고 <M>{'\\omega^n = 1'}</M>일 때:
        </p>
        <M display>{'\\underbrace{\\prod_{i=0}^{n-1}(x - \\omega^i)}_{\\text{단위근 도메인의 vanishing polynomial}} = \\underbrace{x^n - 1}_{\\text{간결한 형태}}'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          <M>{'\\omega^i'}</M>: i번째 n차 단위근, 좌변의 n개 인수 곱이 단 2개 항 <M>{'x^n - 1'}</M>로 축약됨 -- 이것이 단위근 도메인의 효율성 원천
        </p>
        <p>
          <M>{'x^n - 1 = 0'}</M>의 근이 정확히 n개이고, 이들이 n차 단위근이므로 인수분해가 성립한다.
          <br />
          점 z에서의 평가는 이진 거듭제곱으로 <M>{'O(\\log n)'}</M>에 가능하다.
          <br />
          <strong>프로덕션 시스템이 단위근을 사용하는 이유</strong>가 바로 이것이다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">Coset 도메인</h4>
        <p>
          <M>{'H\' = g \\cdot H = \\{g \\cdot \\omega^i\\}'}</M>이면
          <M>{'Z_{H\'}(x) = x^n - g^n'}</M>.
          <br />
          ZK 시스템에서 "블라인딩"에 사용되어 직접 평가 공격을 방지한다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">PLONK에서의 역할</h4>
        <p>
          게이트 제약 다항식:
        </p>
        <M display>{'P(x) = \\underbrace{q_L(x) \\cdot a(x)}_{\\text{좌측 입력}} + \\underbrace{q_R(x) \\cdot b(x)}_{\\text{우측 입력}} + \\underbrace{q_M(x) \\cdot a(x) \\cdot b(x)}_{\\text{곱셈 항}} + \\underbrace{q_O(x) \\cdot c(x)}_{\\text{출력}} + \\underbrace{q_C(x)}_{\\text{상수}}'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          <M>{'q_L, q_R, q_M, q_O, q_C'}</M>: 게이트 종류를 선택하는 selector 다항식, <M>{'a(x), b(x), c(x)'}</M>: 각 행의 좌측/우측 입력과 출력 와이어 값을 인코딩한 다항식
        </p>
        <p>
          위트니스가 유효하면 <M>{'P(h_i) = 0'}</M> (각 행).
          따라서 <M>{'P(x) = Z_H(x) \\cdot T(x)'}</M>가 성립한다
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-3">
        {[
          { step: '1. 검증자: 랜덤 z 선택', desc: 'Fiat-Shamir 해시로 z를 결정', color: 'indigo' },
          { step: '2. 개방값에서 P(z) 계산', desc: '각 다항식의 z에서의 값을 조합', color: 'emerald' },
          { step: '3. Z_H(z) = z^n - 1 계산', desc: '단위근 도메인이므로 O(log n)', color: 'amber' },
          { step: '4. P(z) == Z_H(z) · T(z) 확인', desc: '한 번의 등식 검사로 모든 행의 제약 검증 완료', color: 'indigo' },
        ].map(p => (
          <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">Quotient 다항식 T(x)</h4>
        <p>
          <M>{'T(x) = P(x) / Z_H(x)'}</M>.
          증명자가 계수 형태의 <M>{'P(x)'}</M>에 다항식 긴 나눗셈을 적용하거나,
          더 큰 도메인에서 평가한 뒤 점별 나눗셈으로 계산한다.
          <br />
          단위근이면 <M>{'x^n - 1'}</M>로 나누는 것이 간단하다 — 높은 차수의 거듭제곱을 <M>{'x^n - 1'}</M>로 줄이면 된다.
          <br />
          Quotient 차수는 <M>{'\\deg(P) - n'}</M>이며, 보통 <M>{'3n'}</M> 수준으로 바운딩된다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">Barycentric 평가</h4>
        <p>
          <M>{'f'}</M>가 H 위에서의 값 <M>{'y_i'}</M>로 알려져 있을 때, H 밖의 임의 점 x에서:
        </p>
        <M display>{'f(x) = \\underbrace{\\frac{Z_H(x)}{n}}_{\\text{vanishing / 도메인 크기}} \\underbrace{\\sum_i \\frac{\\overbrace{\\omega^i}^{\\text{i번째 단위근}} \\cdot \\overbrace{y_i}^{\\text{i번째 값}}}{\\underbrace{x - \\omega^i}_{\\text{평가점과의 거리}}}}_{\\text{가중 역거리 합}}'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          <M>{'Z_H(x) = x^n - 1'}</M>: vanishing polynomial, <M>{'n'}</M>: 도메인 크기, <M>{'y_i'}</M>: 도메인 위의 알려진 값, <M>{'\\omega^i'}</M>: 도메인 점. 도메인 밖 임의 점 x에서 <M>{'O(n)'}</M>으로 평가
        </p>
        <p>
          <M>{'O(n)'}</M>으로 평가 가능하며, 직접 Lagrange보다 안정적이다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">부분 집합 vanishing 및 도함수</h4>
        <p>
          <M>{'H_1 \\subset H'}</M>이면 <M>{'Z_{H_1}(x) = \\prod_{h \\in H_1}(x - h)'}</M>.
          Plookup, zk-EVM 인자에서 부분 제약에 사용된다.
          <br />
          단위근에서의 도함수: <M>{'Z_H\'(\\omega^i) = n \\cdot \\omega^{-i}'}</M>.
          Barycentric 공식의 분모에 등장한다
        </p>
      </div>
    </section>
  );
}
