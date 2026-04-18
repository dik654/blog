import CyclicViz from './viz/CyclicViz';

export default function Cyclic() {
  return (
    <section id="cyclic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">주기 인코딩: sin/cos 변환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          시간은 <strong>주기적(cyclic)</strong>이다 — 12월 다음은 1월, 23시 다음은 0시<br />
          이 "이어짐"을 숫자로 표현하지 못하면 모델은 12월과 1월을 가장 먼 값으로 인식
        </p>

        <h3>원-핫/순서 인코딩의 한계</h3>
        <p>
          원-핫: 12차원 벡터로 표현 → 모든 월 간 거리가 동일(직교). "3월과 4월이 가깝다"는 정보 소실<br />
          순서형(0~11): 12월=11, 1월=0 → 유클리드 거리 11. 실제 1개월 차이를 반영 못 함<br />
          두 방식 모두 <strong>주기의 순환 구조</strong>를 표현할 수 없음
        </p>

        <h3>sin/cos 변환의 원리</h3>
        <p>
          주기 T인 시간 변수 x를 2차원 원 위의 좌표로 변환:<br />
          <strong>x_sin = sin(2pi * x / T)</strong>, <strong>x_cos = cos(2pi * x / T)</strong><br />
          T=12(월), T=24(시간), T=7(요일) 등 각 주기에 맞게 적용
        </p>
        <p>
          이 변환의 핵심 — 인접 시점이 원 위에서 <strong>가까운 좌표</strong>를 갖게 됨<br />
          12월(sin=-0.50, cos=0.87)과 1월(sin=0.00, cos=1.00)의 유클리드 거리가 작음
        </p>
      </div>
      <div className="not-prose my-8">
        <CyclicViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>왜 sin과 cos 둘 다 필요한가</h3>
        <p>
          sin만 사용하면 대칭 위치의 시점이 <strong>같은 값</strong>을 가짐 — sin(3월) = sin(9월)<br />
          cos를 추가하면 (sin, cos) 쌍이 유일해져 모든 시점을 구분 가능<br />
          원 위의 좌표가 되려면 반드시 2개의 직교 축이 필요
        </p>

        <h3>주파수 인코딩 (Fourier Features)</h3>
        <p>
          여러 주기를 동시에 포착하려면 다중 주파수 사용:<br />
          sin(2pi*k*x/T), cos(2pi*k*x/T) (k=1,2,3,...)<br />
          k=1: 기본 주기, k=2: 절반 주기(고조파), k=3: 1/3 주기<br />
          Transformer의 Positional Encoding이 바로 이 원리
        </p>

        <h3>실전 적용</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { title: '시간(hour)', desc: 'T=24. 출퇴근 패턴, 야간/주간 구분에 유용' },
            { title: '요일(day_of_week)', desc: 'T=7. 주말/평일 효과, 특정 요일 패턴' },
            { title: '월(month)', desc: 'T=12. 계절성, 분기 효과 포착' },
            { title: '일(day_of_month)', desc: 'T=31. 월초/월말 패턴 (급여일, 결산일)' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-semibold text-foreground text-xs">{item.title}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">트리 모델에서의 주의</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            GBM 같은 트리 모델은 축 정렬 분할만 수행하므로 sin/cos의 <strong>원형 관계를 직접 학습하기 어렵다.</strong>
            트리 모델에서는 sin/cos + 원래 정수 피처(month=0~11)를 모두 제공하는 것이 안전하다.
            신경망은 sin/cos만으로도 원형 관계를 자연스럽게 학습한다.
          </p>
        </div>
      </div>
    </section>
  );
}
