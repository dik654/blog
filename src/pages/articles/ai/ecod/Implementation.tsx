import PyODDetailViz from './viz/PyODDetailViz';
import EvalDetailViz from './viz/EvalDetailViz';

export default function Implementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PyOD 구현 & 대규모 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>PyOD</strong> 라이브러리 — ECOD를 포함한 40+ 이상 탐지 알고리즘을 통합 API로 제공<br />
          ECOD는 <code>fit()</code> 호출 시 내부적으로 ECDF를 계산<br />
          별도의 반복 학습 없음
        </p>
      </div>

      <div className="not-prose mt-4 mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-2">PyOD ECOD 사용 흐름</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {[
            { step: '1. 모델 생성', code: 'ECOD(contamination=0.05)', desc: 'contamination만 설정 — 상위 5%를 이상치로 간주. 하이퍼파라미터 불필요' },
            { step: '2. 학습', code: 'clf.fit(X_train)', desc: '내부적으로 ECDF 계산. 반복 최적화 없음 — O(n·d) 시간' },
            { step: '3. 결과 확인', code: 'clf.labels_ / clf.decision_scores_', desc: 'labels_: 0(정상)/1(이상). decision_scores_: 연속 이상치 점수' },
            { step: '4. 새 데이터', code: 'clf.predict(X_test)', desc: '학습 시 ECDF 기준으로 새 데이터의 이상 여부 판정' },
          ].map((p) => (
            <div key={p.step} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.step}</span>
              <div className="font-mono text-[11px] text-muted-foreground/70 mt-1">{p.code}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mb-3">대규모 데이터 처리 전략</h3>
        <div className="not-prose grid grid-cols-2 gap-2 text-sm mb-4">
          {[
            { label: 'O(n·d) 시간', desc: '차원별 정렬 O(n log n)이 주요 비용. LOF의 O(n²)보다 훨씬 효율적' },
            { label: 'O(n·d) 메모리', desc: 'ECDF는 원본 데이터만 저장. 거리 행렬(n×n) 불필요' },
            { label: '병렬화', desc: '차원 간 독립 → 각 피처의 ECDF를 병렬 계산. n_jobs 파라미터 지원' },
            { label: '스트리밍', desc: '새 데이터 도착 시 ECDF 점진적 업데이트 → 온라인 탐지 가능' },
          ].map((p) => (
            <div key={p.label} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.label}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">PyOD 생태계와 ECOD</h3>
        <div className="not-prose"><PyODDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">평가 지표와 실무 주의사항</h3>
        <div className="not-prose"><EvalDetailViz /></div>
        <p className="leading-7">
          요약 1: <strong>PyOD</strong>가 Python 이상 탐지 표준 라이브러리 — 40+ 알고리즘.<br />
          요약 2: ECOD는 <strong>대규모·해석성·no-tuning</strong> 시나리오에 최적.<br />
          요약 3: 실무에서는 <strong>앙상블 + 드리프트 모니터링</strong>이 중요.
        </p>
      </div>
    </section>
  );
}
