import IterationViz from './viz/IterationViz';

export default function Iteration() {
  return (
    <section id="iteration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실험 반복: 가설 → 검증 → 기록</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          대회 시간의 <strong>70%를 차지하는 핵심 단계</strong> — 여기서 순위가 결정된다<br />
          원칙: 한 번에 하나만 변경, 모든 실험을 기록, CV 기준으로 판단
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">실험 사이클: 가설 → 실험 → 기록</h3>
        <p>
          모든 실험은 <strong>가설</strong>에서 시작: "log 변환이 RMSE를 줄일 것", "래그 피처가 시간 패턴을 포착할 것"<br />
          한 번에 여러 변경을 하면 → 어떤 변경이 효과인지 알 수 없다 (혼합 효과)<br />
          실패한 실험도 기록 — "이건 효과 없었다"는 중복 시도를 방지하는 소중한 데이터
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">실험 우선순위</h3>
        <p>
          <strong>1순위: 피처 엔지니어링</strong> — 순위의 70%를 결정. 통계 피처, 인터랙션, 도메인 지식 기반 피처<br />
          <strong>2순위: 모델 튜닝</strong> — 수확 체감이 빠름. Optuna Bayesian 탐색이 Grid Search보다 효율적<br />
          <strong>3순위: 후처리</strong> — 임계값 최적화, 클리핑, 라운딩. 모델 재학습 없이 "공짜 점수"
        </p>
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed m-0">
            <strong>피처 &gt; 모델 &gt; 후처리</strong> 순서를 지키는 이유: 좋은 피처가 있으면 기본 파라미터 LightGBM으로도
            상위 10%에 들 수 있다. 반면 피처가 부실하면 아무리 모델을 튜닝해도 한계가 명확하다.
          </p>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">실험 로그 관리</h3>
        <p>
          <strong>W&B</strong>(Weights & Biases): 하이퍼파라미터, 메트릭, 차트 자동 추적 — 팀 협업에 최적<br />
          노트북 셀: 간편하지만 검색/비교 어려움 — 개인 참가 시 최소한으로 사용<br />
          필수 기록 항목: 날짜, 변경 내용, CV 점수, LB 점수, 소요 시간
        </p>
      </div>
      <div className="not-prose my-8">
        <IterationViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          실험 단계 종료 기준: CV 점수 개선폭이 0.001 이하로 수렴 / 마감 1주 전 도달<br />
          이 시점에서 앙상블 전략으로 전환 — 새로운 피처/모델보다 조합 최적화가 효율적
        </p>
      </div>
    </section>
  );
}
