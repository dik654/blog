import ARIMAComponentsViz from './viz/ARIMAComponentsViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';

export default function Components() {
  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">I → AR → MA → 복원: 실제 계산 순서</h2>
      <QuestionLead
        question="ARIMA(2,1,1)의 숫자 하나는 어떤 순서로 다음 수준이 되는가?"
        answer="수준을 한 번 차분하고, 직전 두 변화량의 AR 기여와 직전 innovation의 MA 보정을 더한 뒤, 예측 변화량을 마지막 관측 수준에 다시 누적한다. 아래 계수를 직접 움직이면 각 항의 책임이 숫자로 드러난다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          숫자 네 개가 <M>103,107,112,118</M>로 증가했다고 하자. <M>d=1</M>이면 ARIMA가 직접 학습하는 값은 수준 자체가 아니라 <M>4,5,6</M>이라는 변화량이다. AR은 이 변화량의 관성을 읽고, MA는 이전 예측이 빗나간 방향을 보정한다. 마지막에는 예측한 변화량을 118에 다시 더해야 원래 단위의 예측값을 얻는다.
        </p>
      </div>
      <div className="not-prose mb-8">
        <ARIMAComponentsViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>ARIMA(p,d,q)의 한 식</h3>
        <M display>{"\\begin{aligned} \\underbrace{Y'_t}_{\\text{d번 차분한 현재 값}} &= \\underbrace{c}_{\\text{기준 변화량}} + \\underbrace{\\phi_1Y'_{t-1}+\\cdots+\\phi_pY'_{t-p}}_{\\text{AR: 과거 변화량의 관성}} \\\\ &\\quad + \\underbrace{\\theta_1\\varepsilon_{t-1}+\\cdots+\\theta_q\\varepsilon_{t-q}}_{\\text{MA: 과거 예측 실패의 보정}} + \\underbrace{\\varepsilon_t}_{\\text{현재 새 충격}} \\end{aligned}"}</M>
        <FormulaNote
          meaning="계산은 세 질문으로 읽으면 된다. 먼저 d번 차분해 같은 규칙으로 설명할 수 있는 값을 만들었는가? 그 값은 이전 p개 값의 관성으로 얼마나 설명되는가? 아직 남은 오차는 이전 q개 innovation으로 얼마나 보정되는가? 마지막 ε_t는 과거 정보로 예측할 수 없는 새 충격이므로 미래 예측 시에는 평균 0으로 둔다."
          symbols={[
            ["Y'_t", '원시 시계열을 d번 차분한 뒤 시점 t에서 모델링하는 값'],
            ['p', '현재 차분값을 설명할 때 사용하는 과거 차분값의 개수'],
            ['d', '원시 수준에서 정상적인 변화량으로 이동하기 위해 적용한 최소 차분 횟수'],
            ['q', '현재 예측을 보정할 때 사용하는 과거 innovation의 개수'],
            ["\\phi_iY'_{t-i}", 'i시점 전 차분값의 관성을 현재 예측으로 전달하는 AR 항'],
            ['\\theta_j\\varepsilon_{t-j}', 'j시점 전 예측 실패의 방향과 크기를 반영하는 MA 항'],
            ['\\varepsilon_t', '현재 시점에 새로 발생해 과거만으로는 예측할 수 없는 충격'],
            ['c', 'd=0이면 정상 시계열의 평균과 연결되고, d=1이면 원계열의 drift와 연결되는 상수항'],
          ]}
        />

        <h3>I(d): 정보 제거가 아니라 표현 변경</h3>
        <p>
          1차 차분 <M>{"Y'_t=Y_t-Y_{t-1}"}</M>은 “현재 수준이 얼마인가?”를 “직전보다 얼마나 변했는가?”로 바꾼다. 추세가 확률적 누적으로 생겼다면 이 표현이 더 안정적일 수 있다. 그러나 결정적 추세나 구조 변화까지 무조건 차분으로 해결되는 것은 아니다. 차분 후에는 첫 관측값 하나를 잃고, <M>d=2</M>면 두 개를 잃으며 예측 불확실성도 누적된다.
        </p>

        <h3>AR(p): lag 사이의 반복 가능한 관성</h3>
        <p>
          <M>p=2</M>라면 직전 두 변화량에 <M>\phi_1,\phi_2</M>를 곱해 현재 변화를 설명한다. 계수의 부호와 크기는 같은 방향의 지속 또는 반전을 나타낸다. 다만 계수 하나를 원인 효과로 해석해서는 안 된다. 다른 lag를 함께 조건으로 둔 선형 예측 계수이기 때문이다.
        </p>

        <h3>MA(q): 관측 평균이 아니라 innovation의 기억</h3>
        <p>
          <M>q=1</M>이면 직전 오차 <M>{"\\varepsilon_{t-1}"}</M>가 현재 예측을 얼마나 보정하는지 학습한다. 갑작스러운 충격이 한두 시점에 걸쳐 남는 데이터에서 유용하다. 이 오차는 실제 값에서 그 시점의 one-step-ahead 예측을 뺀 innovation이며, 임의로 이동평균한 관측값이 아니다.
        </p>

        <h3>안정성과 가역성: 같은 과정을 여러 계수로 쓰지 않게 한다</h3>
        <p>
          AR 계수는 예측이 폭발하지 않는 정상성 조건을, MA 계수는 같은 자기상관을 여러 방식으로 표현하지 않는 가역성(invertibility) 조건을 만족해야 한다. 실무 라이브러리는 보통 AR·MA 다항식의 근이 단위원 밖에 있도록 제약한다. 과차분하면 MA(1) 계수가 경계값 <M>{"\\theta_1\\approx-1"}</M>에 붙는 신호가 나타날 수 있다. 이때 차수를 더 늘리기보다 차분을 하나 줄일 가능성을 먼저 본다. MA 계수의 부호 규약은 라이브러리마다 다를 수 있으므로 수식과 출력의 규약도 함께 기록한다.
        </p>

        <h3>역차분: 평가 단위를 잊지 않는다</h3>
        <p>
          <M>d=1</M> 모델이 다음 변화량을 <M>{"\\widehat{Y'_{t+1}}"}</M>로 예측하면 원래 수준은 아래처럼 복원한다. 여러 step을 예측할수록 변화량을 차례로 누적하므로 장기 구간의 불확실성도 함께 커진다.
        </p>
        <M display>{"\\underbrace{\\widehat{Y}_{t+1}}_{\\text{원래 단위의 다음 예측}}=\\underbrace{Y_t}_{\\text{마지막 관측 수준}}+\\underbrace{\\widehat{Y'_{t+1}}}_{\\text{모델이 예측한 다음 변화량}}"}</M>
        <FormulaNote
          meaning="차분 공간에서 모델을 적합해도 사용자에게 필요한 것은 매출·온도·수요 같은 원래 단위다. 마지막 관측 수준에 예측 변화량을 더해 복원하고, MAE나 예측 구간도 복원된 값에서 계산해야 한다."
          symbols={[
            ['\\widehat{Y}_{t+1}', '원래 데이터 단위로 복원한 다음 시점 예측'],
            ['Y_t', '예측 origin에서 마지막으로 관측할 수 있는 실제 수준'],
            ["\\widehat{Y'_{t+1}}", 'ARMA 부분이 차분 공간에서 예측한 다음 변화량'],
          ]}
        />

        <SourceNotes sources={[
          { label: 'FPP3 · Non-seasonal ARIMA models', href: 'https://otexts.com/fpp3/non-seasonal-arima.html', note: '차분된 시계열, AR lag, MA innovation과 현재 새 충격을 결합한 ARIMA 기본 식의 직접 근거.' },
          { label: 'FPP3 · ARIMA modelling in fable', href: 'https://otexts.com/fpp3/arima-r.html', note: '상수항의 해석과 AR·MA 다항식 근에 따른 정상성·가역성 조건의 근거.' },
        ]} />
      </div>
    </section>
  );
}
