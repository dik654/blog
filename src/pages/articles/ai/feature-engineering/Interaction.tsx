import InteractionViz from './viz/InteractionViz';

export default function Interaction() {
  return (
    <section id="interaction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인터랙션 & 파생 변수</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>인터랙션 피처(Interaction Feature)</strong> — 두 개 이상의 피처를 조합해서 만드는 파생 변수.
          개별 피처로는 포착하기 어려운 <strong>결합 효과(synergy)</strong>를 명시적으로 표현한다.
          면적 = 가로 x 세로, 부채비율 = 부채 / 자산, 가격변동 = 현재가 - 전일가.
        </p>

        <h3>곱셈 교차 (A x B)</h3>
        <p>
          두 피처의 곱. 가로 5m, 세로 8m를 따로 넣으면 모델이 "면적" 개념을 스스로 학습해야 하지만,
          면적=40m2를 피처로 주면 학습 부담이 줄어든다.
          범주형 교차(서울+남성 → "서울_남성")도 같은 원리 — 조합별 고유 패턴 포착.
        </p>

        <h3>비율 (A / B)</h3>
        <p>
          상대적 크기를 표현. 부채 3억의 절대값보다 자산 대비 30%라는 비율이 더 강한 예측 신호.
          주의: B=0일 때 ZeroDivisionError. 분모에 작은 상수(1e-5)를 더하거나, 0인 행을 별도 처리.
        </p>

        <h3>차이 (A - B)</h3>
        <p>
          변화량이나 편차를 직접 표현. 가격변동 = 현재가 - 이전가.
          시계열 데이터에서 트렌드 방향을 명시적으로 전달하는 효과.
          lag 피처(이전 시점 값)와 결합하면 변화 속도(가속도)도 만들 수 있다.
        </p>
      </div>

      <div className="not-prose my-8">
        <InteractionViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>도메인 기반 인터랙션</h3>
        <p>
          BMI = 체중 / 신장2, CTR = 클릭수 / 노출수, 객단가 = 매출 / 거래수.
          의미 있는 조합은 도메인 지식에서 나온다.
          도메인 전문가와의 협업이 피처 엔지니어링에서 가장 ROI가 높은 활동.
        </p>

        <h3>인터랙션이 해가 되는 경우</h3>
        <p>
          피처 수 100개에서 모든 2차 교차를 만들면 100*99/2 = 4,950개 파생 피처가 생긴다.
          대부분은 노이즈. 과적합 위험이 급증하고 학습 시간이 폭발.
          "가설이 있는 조합만 만든다"가 원칙 — 무작위 교차는 피처 선택 단계에서 걸러야 한다.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 인터랙션 피처 설계 순서</p>
        <p className="text-sm">
          1) EDA에서 타겟과 상관 높은 피처 Top 10 선별.
          2) Top 10 간의 비율·곱·차이를 생성 (최대 45개).
          3) 도메인 지식 기반 의미 있는 조합 추가 (BMI, CTR 등).
          4) Permutation Importance로 불필요한 인터랙션 제거.
        </p>
      </div>
    </section>
  );
}
