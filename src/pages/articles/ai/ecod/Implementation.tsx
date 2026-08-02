import { CapabilityCheck } from '@/components/learning/ArticleLearning';

export default function Implementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PyOD 구현 & 대규모 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>PyOD</strong>는 여러 이상 탐지기를 같은 API로 비교할 수 있게 한다.
          ECOD의 <code>fit()</code>은 반복 최적화 대신 열별 ECDF와 이상 점수를 계산한다.
          그러나 <code>contamination</code>, 새 배치 점수 계산, 논문과 코드의 집계 순서는 서로 다른 계약이다.
        </p>
      </div>

      <div className="not-prose mt-4 mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-2">PyOD ECOD 사용 흐름</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {[
            { step: '1. 판정 예산', code: 'ECOD(contamination=0.05)', desc: '0.05는 ECDF를 학습시키는 값이 아니라 상위 5%를 라벨 1로 자르는 threshold 규칙' },
            { step: '2. 기준 점수', code: 'clf.fit(X_train)', desc: '열별 정렬과 ECDF 계산. gradient·epoch는 없지만 정렬 비용은 존재' },
            { step: '3. 결과 확인', code: 'clf.labels_ / clf.decision_scores_', desc: 'labels_: 0(정상)/1(이상). decision_scores_: 연속 이상치 점수' },
            { step: '4. 새 배치 계약', code: 'clf.decision_function(X_test)', desc: '현재 reference code는 train과 test batch를 합쳐 ECDF를 다시 계산하므로 batch 구성에 따라 점수가 달라질 수 있음' },
          ].map((p) => (
            <div key={p.step} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.step}</span>
              <div className="mt-1 break-words font-mono text-xs text-muted-foreground">{p.code}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mb-3">대규모 데이터 처리 전략</h3>
        <div className="not-prose grid grid-cols-2 gap-2 text-sm mb-4">
          {[
            { label: '논문과 실제 정렬 비용', desc: '논문은 O(n·d)를 제시하지만 PyOD column_ecdf는 열별 argsort를 사용하므로 비교 기반 구현은 보통 O(d·n log n)' },
            { label: 'O(n·d) 규모의 배열', desc: '원본과 피처별 좌·우 점수 배열을 유지하지만 n×n 거리 행렬은 만들지 않는다' },
            { label: '병렬화', desc: '차원 간 독립 → 각 피처의 ECDF를 병렬 계산. n_jobs 파라미터 지원' },
            { label: '온라인 모델은 아님', desc: '현재 PyOD ECOD에는 partial_fit이 없다. 고정 기준 ECDF가 필요하면 별도 저장·검색 구현을 설계해야 한다' },
          ].map((p) => (
            <div key={p.label} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.label}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-7 mb-3">고정 ECDF를 배포하려면 reference를 version으로 만든다</h3>
        <p>
          새 배치의 다른 행이 한 점의 score를 바꾸면 운영 경보를 재현하기 어렵다. 고정 기준을 원한다면
          <code>fit</code> 때 열별 정렬값·중복 count·표본 수·변환 설정을 하나의 reference artifact로 저장하고,
          추론에서는 그 artifact에 이진 탐색해 rank를 계산한다. Threshold는 score 계산과 분리해 별도 version으로 관리한다.
        </p>
        <ol className="not-prose my-5 grid gap-0 border-y border-border text-sm sm:grid-cols-4">
          {[
            ['01 · Fit', '열별 정렬값, 중복 count, n과 변환 설정을 고정한다.'],
            ['02 · Score', '새 x를 frozen reference에 검색해 좌·우 tail rank를 계산한다.'],
            ['03 · Decide', '연속 score를 별도 threshold version으로 label에 바꾼다.'],
            ['04 · Replace', 'Drift가 기준을 넘을 때 새 artifact를 만들고 원자적으로 교체한다.'],
          ].map(([label, description]) => (
            <li key={label} className="list-none border-b border-border py-4 sm:border-b-0 sm:border-r sm:px-4 sm:last:border-r-0">
              <strong className="font-mono text-xs">{label}</strong>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>
        <p>
          가장 작은 회귀 검사는 같은 점 <code>x</code>를 단독 배치, 정상점이 많은 배치, 극단점이 섞인 배치에 각각 넣는 것이다.
          고정 ECDF 계약이라면 세 score가 같아야 한다. 다르면 구현이 query batch를 reference에 섞었거나 전처리 version이 달라진 것이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">평가 지표와 실무 주의사항</h3>
        <p>
          라벨이 있다면 ROC-AUC 하나로 끝내지 않는다. 이상치가 드물수록 PR-AUC와 실제 검토 예산 K에 맞춘
          Precision@K를 같이 본다. 라벨이 없다면 score 상위 샘플을 사람이 검토하고, 어떤 피처의 꼬리 점수가
          판정을 밀어 올렸는지 기록한다. threshold를 바꿨을 때 검토량과 적중률이 함께 어떻게 변하는지가 운영 지표다.
        </p>
        <p className="leading-7">
          요약 1: <strong>raw score</strong>와 contamination 기반 <strong>binary label</strong>을 분리한다.<br />
          요약 2: 논문 집계와 PyOD 집계, 고정 ECDF와 batch 재계산 중 어떤 동작을 배포할지 고정한다.<br />
          요약 3: 운영에서는 score 분포·입력 drift·검토 예산을 함께 모니터링한다.
        </p>
        <CapabilityCheck
          items={[
            '한 점의 왼쪽·오른쪽 ECDF 꼬리확률과 -log 점수를 손으로 계산할 수 있다.',
            'Raw ranking score와 contamination 기반 이진 label을 구분할 수 있다.',
            '피처 독립 ECOD가 놓치는 상호작용 이상 반례를 만들 수 있다.',
            'Temporal incident 탐지와 tabular tail baseline을 서로 다른 평가 계약에 둘 수 있다.',
            '같은 점을 서로 다른 companion batch에 넣어 고정 ECDF의 batch-composition invariance를 검증할 수 있다.',
          ]}
        />
      </div>
    </section>
  );
}
