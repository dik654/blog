import StackingViz from './viz/StackingViz';

export default function Stacking() {
  return (
    <section id="stacking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Stacking: 메타 모델 학습</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Stacking</strong>(Stacked Generalization) — 여러 모델의 예측값 자체를 "피처"로 만들어
          그 위에 또 다른 메타 모델을 학습시키는 방법<br />
          가중 평균보다 유연 — 비선형 조합까지 학습 가능
        </p>
        <p>
          아래 Viz에서 <strong>전체 구조 → OOF 예측 생성 → 메타 모델 학습 → 다단 확장</strong> 순서로 확인한다.
        </p>
      </div>

      <div className="not-prose my-8">
        <StackingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 개념 요약</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            {
              title: 'Level-0 / Level-1',
              desc: 'Level-0은 기본 모델(GBM, NN, LR 등) · Level-1은 Level-0의 예측을 입력으로 받는 메타 모델',
            },
            {
              title: 'OOF 예측',
              desc: '각 fold의 validation 예측을 모아 만든 "누출 없는" 메타 피처. train 예측을 그대로 쓰면 data leakage 발생',
            },
            {
              title: '메타 모델 선택',
              desc: '입력이 3~10개 피처뿐이므로 Ridge / Logistic Regression / ElasticNet 같은 단순 모델을 선호',
            },
            {
              title: '다단 Stacking',
              desc: 'Level-2까지 쌓으면 표현력이 더 커지지만, 실전에서는 2단이면 충분 · 3단 이상은 비용 대비 개선폭이 미미',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{item.title}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">Stacking 핵심 규칙</p>
        <p className="text-sm">
          <strong>OOF 필수</strong> — train 예측을 그대로 쓰면 완전한 누출 발생<br />
          <strong>메타 모델은 단순하게</strong> — Ridge/LogReg가 GBM보다 안정적<br />
          <strong>2단까지만</strong> — 3단 이상은 비용 대비 효과 미미<br />
          <strong>원본 피처 추가 금지</strong> — 메타 모델 입력은 OOF 예측만 (순수 앙상블)
        </p>
      </div>
    </section>
  );
}
