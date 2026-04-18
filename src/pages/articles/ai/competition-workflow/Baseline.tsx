import BaselineViz from './viz/BaselineViz';

export default function Baseline() {
  return (
    <section id="baseline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">베이스라인 구축</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>베이스라인</strong>(Baseline) — 가장 단순한 모델로 가장 빠르게 첫 제출을 만드는 것<br />
          목표: 2~4시간 안에 CV 파이프라인 완성 + LB 제출 + CV-LB 상관관계 확인
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">모델 선택: 단순함이 원칙</h3>
        <p>
          테이블 데이터 → <strong>LightGBM 기본 파라미터</strong>: n_estimators=1000, learning_rate=0.1, early_stopping_rounds=100<br />
          이미지 데이터 → <strong>pretrained EfficientNet-B0</strong>: ImageNet 가중치, head만 학습<br />
          텍스트 데이터 → <strong>TF-IDF + LightGBM</strong> 또는 pretrained BERT (base)<br />
          정교한 하이퍼파라미터 튜닝은 이 단계의 목표가 아니다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">CV 파이프라인: 이것이 핵심</h3>
        <p>
          <strong>교차 검증</strong>(Cross-Validation) — 학습 데이터를 K개 폴드로 나누어 각 폴드에서 검증하는 방법<br />
          분류 → StratifiedKFold(타겟 비율 유지), 회귀 → KFold, 시계열 → TimeSeriesSplit<br />
          CV 파이프라인 없이 실험하면 — LB 제출이 유일한 평가 수단 → 하루 제출 횟수에 의존하는 도박
        </p>
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed m-0">
            <strong>CV-LB 상관관계</strong>: CV 점수가 오를 때 LB 점수도 오르는지 확인.
            상관이 낮다면 — CV 구성 오류(그룹 누출, 시간축 불일치) 또는 public LB 비율이 너무 작은 것.
            이 상관이 확보되어야 이후 모든 실험 판단이 의미를 가진다.
          </p>
        </div>
      </div>
      <div className="not-prose my-8">
        <BaselineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          베이스라인 완료 기준: CV 파이프라인 동작 + 첫 LB 제출 완료 + CV-LB 상관 확인<br />
          이 기준을 충족하면 — 본격 실험 반복 시작. 베이스라인은 이후 모든 실험의 <strong>기준점(baseline score)</strong>
        </p>
      </div>
    </section>
  );
}
