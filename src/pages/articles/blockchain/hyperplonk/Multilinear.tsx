import Math from '@/components/ui/math';
import MultilinearViz from './viz/MultilinearViz';

export default function Multilinear() {
  return (
    <section id="multilinear" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다중선형 확장 (MLE)</h2>
      <MultilinearViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-4">단변수 vs 다중선형</h3>
        <p>
          <strong>단변수 다항식</strong>(univariate) — 변수 1개, 차수 <Math>{'d'}</Math>
        </p>
        <Math display>{'f(x) = \\underbrace{a_0}_{\\text{상수항}} + \\underbrace{a_1 x}_{\\text{1차항}} + \\underbrace{a_2 x^2}_{\\text{2차항}} + \\cdots + \\underbrace{a_d x^d}_{\\text{최고차항}}'}</Math>
        <p className="text-sm text-muted-foreground mt-2 mb-3">
          계수가 <Math>{'d+1'}</Math>개이므로, <Math>{'n'}</Math>개 제약을 인코딩하려면 차수 <Math>{'n'}</Math>짜리 다항식이 필요함.
          이 고차 다항식의 평가에 <a href="/crypto/fft" className="text-indigo-400 hover:underline">FFT/NTT</a>가 필수 — <Math>{'O(n \\log n)'}</Math>
        </p>

        <p>
          <strong>다중선형 다항식</strong>(multilinear) — 변수 <Math>{'n'}</Math>개, 각 변수의 차수가 최대 1
        </p>
        <Math display>{'f(x_1, x_2) = \\underbrace{3x_1 x_2}_{\\substack{\\text{교차항} \\\\ \\text{(각 변수 1차)}}} + \\underbrace{2x_1}_{x_1\\text{항}} + \\underbrace{x_2}_{x_2\\text{항}} + \\underbrace{1}_{\\text{상수}}'}</Math>
        <p className="text-sm text-muted-foreground mt-2 mb-3">
          <Math>{'x_1'}</Math>에 대해 1차, <Math>{'x_2'}</Math>에 대해서도 1차 — <Math>{'x_1^2'}</Math>이나 <Math>{'x_2^2'}</Math> 같은 고차항이 없음.
          고차 단변수 다항식이 아니므로 FFT가 불필요함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          왜 유용한가: 진리표 인코딩
        </h3>
        <p>
          <Math>{'n'}</Math>개 변수의 다중선형 다항식은 <Math>{'\\{0,1\\}^n'}</Math> 위에서 <Math>{'2^n'}</Math>개 값을 가짐
          <br />
          예: <Math>{'n=2'}</Math>이면 <Math>{'(0,0), (0,1), (1,0), (1,1)'}</Math> — 4개 평가점
          <br />
          이 4개 값이 회로의 wire 값, gate 출력 등 모든 제약을 인코딩함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">MLE 구성</h3>
        <p>
          함수 <Math>{'f: \\{0,1\\}^n \\to \\mathbb{F}'}</Math>가 주어지면, <Math>{'\\{0,1\\}^n'}</Math> 위에서 <Math>{'f'}</Math>와 일치하는 <strong>유일한</strong> 다중선형 다항식이 존재함
        </p>
        <Math display>{'\\tilde{f}(x_1, \\ldots, x_n) = \\sum_{b \\in \\{0,1\\}^n} \\underbrace{f(b)}_{\\substack{\\text{진리표 값} \\\\ \\text{(가중치)}}} \\cdot \\underbrace{\\prod_{i=1}^{n} \\big( b_i x_i + (1-b_i)(1-x_i) \\big)}_{\\substack{\\text{라그랑주 기저 (eq 지시자)} \\\\ x=b\\text{일 때 1, 아니면 0}}}'}</Math>
        <p className="text-sm text-muted-foreground mt-2 mb-3">
          각 꼭짓점 <Math>{'b \\in \\{0,1\\}^n'}</Math>에 대해 라그랑주 기저를 구성함.
          <Math>{'b_i=1'}</Math>이면 <Math>{'x_i'}</Math>가 선택되고, <Math>{'b_i=0'}</Math>이면 <Math>{'(1-x_i)'}</Math>가 선택되어
          — 정확히 <Math>{'x=b'}</Math>인 점에서만 1이 되는 지시자 함수를 만듦
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">구체적 예시</h3>
        <p>
          <Math>{'f(0,0)=1,\\; f(0,1)=2,\\; f(1,0)=3,\\; f(1,1)=7'}</Math>로 정의된 함수의 MLE:
        </p>
        <Math display>{'\\tilde{f}(x_1, x_2) = \\underbrace{1}_{f(0,0)} \\cdot \\underbrace{(1-x_1)(1-x_2)}_{\\text{eq}(00,x)} + \\underbrace{2}_{f(0,1)} \\cdot \\underbrace{(1-x_1)x_2}_{\\text{eq}(01,x)} + \\underbrace{3}_{f(1,0)} \\cdot \\underbrace{x_1(1-x_2)}_{\\text{eq}(10,x)} + \\underbrace{7}_{f(1,1)} \\cdot \\underbrace{x_1 x_2}_{\\text{eq}(11,x)}'}</Math>
        <p className="text-sm text-muted-foreground mt-2 mb-3">
          전개하면 <Math>{'\\tilde{f}(x_1, x_2) = 3x_1 x_2 + 2x_1 + x_2 + 1'}</Math>.
          검증: <Math>{'\\tilde{f}(1,1) = 3+2+1+1 = 7 = f(1,1)'}</Math> — 원래 함수값과 일치
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">다중선형 확장의 실전 구현</h3>

        <h4 className="text-lg font-semibold mt-6 mb-3">유일성 정리</h4>
        <div className="rounded-lg border p-4 not-prose">
          <p className="text-sm text-muted-foreground mb-2">
            임의의 함수 <Math>{'f: \\{0,1\\}^n \\to \\mathbb{F}'}</Math>에 대해,
            <Math>{'\\tilde{f}(b) = f(b)'}</Math> (<Math>{'\\forall b \\in \\{0,1\\}^n'}</Math>)를 만족하는 <strong>유일한</strong> 다중선형 다항식 <Math>{'\\tilde{f} \\in \\mathbb{F}[x_1, \\ldots, x_n]'}</Math>이 존재
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>차원 세기</strong>: <Math>{'n'}</Math>변수 다중선형 단항식 수 = <Math>{'2^n'}</Math> (<Math>{'\\{x_1,\\ldots,x_n\\}'}</Math>의 부분집합),
            진리표 값 수 = <Math>{'2^n'}</Math> → 전단사 대응 <Math>{'f \\leftrightarrow \\tilde{f}'}</Math>
          </p>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-3">라그랑주 보간 공식</h4>
        <div className="rounded-lg border p-4 not-prose">
          <Math display>{'\\tilde{f}(x) = \\sum_{b \\in \\{0,1\\}^n} \\underbrace{f(b)}_{\\text{진리표 값}} \\cdot \\underbrace{\\text{eq}(b, x)}_{\\substack{\\text{등호 지시자} \\\\ b=x\\text{이면 1}}}'}</Math>
          <p className="text-sm text-muted-foreground mt-2 mb-2">
            <strong>등호 지시자(equality indicator)</strong>의 정의:
          </p>
          <Math display>{'\\text{eq}(b, x) = \\prod_{i=1}^{n} \\big( \\underbrace{b_i x_i}_{\\substack{b_i=1\\text{이면} \\\\ x_i\\text{ 선택}}} + \\underbrace{(1-b_i)(1-x_i)}_{\\substack{b_i=0\\text{이면} \\\\ (1-x_i)\\text{ 선택}}} \\big)'}</Math>
          <p className="text-sm text-muted-foreground mt-2">
            성질: <Math>{'b, c \\in \\{0,1\\}^n'}</Math>일 때 <Math>{'\\text{eq}(b,c) = 1'}</Math> if <Math>{'b = c'}</Math>, 아니면 <Math>{'0'}</Math> — 크로네커 델타와 동일한 역할
          </p>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-3">예시 (<Math>{'n=2'}</Math>)</h4>
        <div className="rounded-lg border p-4 not-prose">
          <p className="text-sm text-muted-foreground mb-2">
            <Math>{'f: 00 \\to 1,\\; 01 \\to 2,\\; 10 \\to 3,\\; 11 \\to 7'}</Math>
          </p>
          <div className="grid gap-2 sm:grid-cols-2 mb-3">
            <div className="text-sm text-muted-foreground">
              <Math>{'\\text{eq}(00, x_1, x_2) = (1-x_1)(1-x_2)'}</Math>
            </div>
            <div className="text-sm text-muted-foreground">
              <Math>{'\\text{eq}(01, x_1, x_2) = (1-x_1)x_2'}</Math>
            </div>
            <div className="text-sm text-muted-foreground">
              <Math>{'\\text{eq}(10, x_1, x_2) = x_1(1-x_2)'}</Math>
            </div>
            <div className="text-sm text-muted-foreground">
              <Math>{'\\text{eq}(11, x_1, x_2) = x_1 x_2'}</Math>
            </div>
          </div>
          <Math display>{'\\tilde{f} = \\underbrace{1}_{f(00)} \\cdot (1\\!-\\!x_1)(1\\!-\\!x_2) + \\underbrace{2}_{f(01)} \\cdot (1\\!-\\!x_1)x_2 + \\underbrace{3}_{f(10)} \\cdot x_1(1\\!-\\!x_2) + \\underbrace{7}_{f(11)} \\cdot x_1 x_2'}</Math>
          <p className="text-sm text-muted-foreground mt-2">
            전개: <Math>{'\\underbrace{1}_{\\text{상수}} + \\underbrace{2x_1}_{x_1\\text{항}} + \\underbrace{x_2}_{x_2\\text{항}} + \\underbrace{3x_1 x_2}_{\\text{교차항}}'}</Math>
          </p>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-3">MLE 평가 알고리즘</h4>
        <div className="grid gap-3 not-prose">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">방법 1: 직접 공식</h4>
            <p className="text-sm text-muted-foreground">
              <Math>{'\\{0,1\\}^n'}</Math> 전체를 순회하며 합산
              — 비용 <Math>{'O(2^n \\cdot n)'}</Math>, 큰 <Math>{'n'}</Math>에 비실용적
            </p>
          </div>
          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
            <h4 className="font-medium text-sm mb-2">방법 2: 동적 프로그래밍 (주력)</h4>
            <p className="text-sm text-muted-foreground">
              값 <Math>{'f(b)'}</Math> 전체에서 시작, 라운드 <Math>{'i'}</Math>마다 변수 <Math>{'x_i'}</Math>를 폴딩:
              <br />
              <code>new[b&apos;] = old[(b&apos;,0)] + (old[(b&apos;,1)] - old[(b&apos;,0)]) * r_i</code>
              <br />
              최종 값 1개로 수렴 — 비용 <Math>{'O(2^n)'}</Math>
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">방법 3: 스트리밍 (GKR 방식)</h4>
            <p className="text-sm text-muted-foreground">
              불리언 하이퍼큐브 점을 스트리밍하며 sumcheck으로 점진 처리
              — 메모리 <Math>{'O(2^n)'}</Math> 여전히 필요
            </p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-3">폴딩 해석</h4>
        <div className="rounded-lg border p-4 not-prose">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>부분 평가</strong>: <Math>{'g(x_2, \\ldots, x_n) = \\tilde{f}(r_1, x_2, \\ldots, x_n)'}</Math> — 첫 변수를 랜덤 챌린지 <Math>{'r_1'}</Math>으로 고정
          </p>
          <Math display>{'g = \\underbrace{(1-r_1)}_{\\text{0-가지 가중치}} \\cdot \\tilde{f}(0, x_2, \\ldots) + \\underbrace{r_1}_{\\text{1-가지 가중치}} \\cdot \\tilde{f}(1, x_2, \\ldots)'}</Math>
          <p className="text-sm text-muted-foreground mt-2">
            이것이 <strong>폴딩(folding)</strong> — <Math>{'n'}</Math>변수를 <Math>{'(n-1)'}</Math>변수로 축소.
            0-가지와 1-가지를 <Math>{'r_1'}</Math> 비율로 선형 결합하여 배열을 절반으로 줄임. sumcheck 프로토콜의 핵심 연산
          </p>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-3">데이터 구조</h4>
        <div className="rounded-lg border p-4 not-prose">
          <p className="text-sm text-muted-foreground mb-2">
            <code>MLE&lt;F&gt;</code> 구조체: <code>num_vars: usize</code> + <code>evaluations: Vec&lt;F&gt;</code> (<Math>{'2^{\\text{num\\_vars}}'}</Math>개 값)
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            진리표 인덱싱: <code>evaluations[bit_vector_to_index(b)] = f(b)</code>
          </p>
          <p className="text-sm text-muted-foreground">
            랜덤 점 <Math>{'r = (r_1, \\ldots, r_n)'}</Math>에서의 평가: 각 변수를 순차 폴딩하여 배열을 절반씩 축소
            — <code>values[j] = lo + r[i] * (hi - lo)</code> 반복 후 <code>values[0]</code>이 최종 결과
          </p>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-3">왜 다중선형으로 충분한가</h4>
        <div className="rounded-lg border p-4 not-prose">
          <p className="text-sm text-muted-foreground mb-2">
            회로의 <Math>{'n'}</Math>개 wire를 <Math>{'\\log n'}</Math>비트 문자열로 인덱싱
            → wire 값들이 MLE 진리표 → 다중선형 다항식으로 대응
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            제약 검사가 다항식 항등식으로 변환됨: 덧셈 게이트 <Math>{'i'}</Math>에서 <Math>{'l_i + r_i - o_i = 0'}</Math>
            → wire 지시자(indicator)의 다중선형 표현
          </p>
          <p className="text-sm text-muted-foreground">
            검증: 랜덤 점에서 다항식 항등식 확인 — sumcheck이 <Math>{'O(\\log n)'}</Math> 라운드로 가능하게 함
          </p>
        </div>

        <h4 className="text-lg font-semibold mt-6 mb-3">MLE 산술 연산</h4>
        <div className="grid gap-3 not-prose">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">덧셈</h4>
            <Math display>{'\\underbrace{(\\tilde{f} + \\tilde{g})(x)}_{\\text{결과도 다중선형}} = \\underbrace{\\tilde{f}(x)}_{\\text{첫째 MLE}} + \\underbrace{\\tilde{g}(x)}_{\\text{둘째 MLE}}'}</Math>
            <p className="text-sm text-muted-foreground mt-2">
              점별 합산 <code>values[i] = f_vals[i] + g_vals[i]</code>, 시간 <Math>{'O(2^n)'}</Math>. 다중선형 + 다중선형 = 다중선형 유지
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h4 className="font-medium text-sm mb-2">곱셈 (주의)</h4>
            <p className="text-sm text-muted-foreground">
              <Math>{'\\tilde{f} \\cdot \\tilde{g}'}</Math>는 더 이상 다중선형이 아님 — 각 변수에서 2차, 단항식 <Math>{'3^n'}</Math>개
              <br />
              명시적으로 계산하지 않고 sumcheck 내부에서 사용
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">등호 다항식</h4>
            <Math display>{'\\text{EQ}(x, y) = \\prod_{i=1}^{n} \\big( \\underbrace{x_i y_i}_{\\substack{\\text{둘 다 1일 때} \\\\ \\text{기여}}} + \\underbrace{(1-x_i)(1-y_i)}_{\\substack{\\text{둘 다 0일 때} \\\\ \\text{기여}}} \\big)'}</Math>
            <p className="text-sm text-muted-foreground mt-2">
              <Math>{'x'}</Math>와 <Math>{'y'}</Math> 각각에 대해 다중선형이지만, 결합 변수 <Math>{'(x,y)'}</Math>에서는 <Math>{'x_i y_i'}</Math> 항 때문에 2차. 명시적 곱을 계산하지 않고 sumcheck 내부에서 처리
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
