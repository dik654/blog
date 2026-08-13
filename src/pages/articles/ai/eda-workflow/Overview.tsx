export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        EDA는 그래프를 많이 그리는 단계가 아니라 데이터 가정을 검증하는 단계다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          데이터를 처음 받으면 행 수와 평균부터 보기보다 한 행이 무엇을
          뜻하는지, target이 언제 생성됐는지, 같은 대상이 여러 행에
          반복되는지부터 확인해야 합니다. 이 정의가 틀리면 이후 분포와
          상관관계도 잘못 해석됩니다.
        </p>
        <p>
          EDA는 schema와 품질, target·split, 단변량 분포, 피처 관계, 결측 패턴을
          차례로 확인하고 모델링 가설로 연결합니다. 시각화는 결론이 아니라
          이상값과 구조를 찾기 위한 도구입니다.
        </p>
      </div>
      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Unit", "한 행·한 ID·한 시점의 의미"],
          ["Quality", "중복·결측·범위·label 오류"],
          ["Boundary", "group·time·source 기반 split"],
          ["Hypothesis", "검증할 관계와 다음 실험"],
        ].map(([title, text]) => (
          <div key={title} className="rounded-xl border bg-card p-4">
            <strong>{title}</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {text}
            </p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          뒤에서는 분포, 상관관계, 결측 패턴, 가설과 시각화로 이어집니다. 각
          발견에는 데이터 slice와 재현 가능한 집계 코드를 남겨 모델 성능 변화와
          다시 연결할 수 있어야 합니다.
        </p>
      </div>
    </section>
  );
}
