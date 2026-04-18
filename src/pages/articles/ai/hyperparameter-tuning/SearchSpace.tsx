import SearchSpaceViz from './viz/SearchSpaceViz';

export default function SearchSpace() {
  return (
    <section id="search-space" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">탐색 공간 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          탐색 공간 설계가 튜닝 성능의 <strong>70% 이상을 좌우</strong><br />
          잘못된 범위: 최적값이 범위 밖 → 아무리 탐색해도 성능 향상 없음<br />
          너무 넓은 범위: 탐색 효율 저하 → 같은 n_trials로 더 적은 유효 탐색
        </p>

        <h3>모델별 탐색 공간</h3>
      </div>
      <div className="not-prose mb-6">
        <SearchSpaceViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>LightGBM 핵심 파라미터 가이드</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 mb-4 text-sm">
          {[
            { name: 'num_leaves', range: '2~256', guide: '깊이 제한(max_depth) 대신 리프 수로 복잡도 제어. 2^max_depth보다 작게 설정하면 과적합 방지', color: 'text-indigo-500' },
            { name: 'learning_rate', range: '0.005~0.3 (log)', guide: '작을수록 정밀하지만 n_estimators를 늘려야 함. 보통 0.01~0.1이 최적 영역', color: 'text-emerald-500' },
            { name: 'min_child_samples', range: '5~100', guide: '리프 노드의 최소 샘플 수. 클수록 보수적(과적합 방지). 데이터 크기에 비례하여 설정', color: 'text-amber-500' },
            { name: 'subsample', range: '0.5~1.0', guide: '배깅 비율. 1.0 미만이면 매 반복마다 데이터 일부만 사용 — 다양성 확보', color: 'text-blue-500' },
            { name: 'colsample_bytree', range: '0.5~1.0', guide: '피처 서브샘플링. 피처 수가 많을 때 0.6~0.8이 효과적', color: 'text-violet-500' },
            { name: 'reg_alpha / reg_lambda', range: '1e-8~10 (log)', guide: 'L1/L2 정규화. 고차원 피처에서 과적합 억제. log scale 필수', color: 'text-pink-500' },
          ].map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className={`font-mono font-bold text-xs ${p.color}`}>{p.name}</span>
              <span className="text-muted-foreground ml-1.5 text-xs">{p.range}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.guide}</div>
            </div>
          ))}
        </div>

        <h3>신경망 핵심 파라미터 가이드</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 mb-4 text-sm">
          {[
            { name: 'learning_rate', range: '1e-5~1e-2 (log)', guide: '가장 중요한 파라미터. 너무 크면 발산, 너무 작으면 수렴 느림. Scheduler와 함께 튜닝', color: 'text-emerald-500' },
            { name: 'batch_size', range: '16/32/64/128', guide: '작을수록 정규화 효과(noise). GPU 메모리와 학습 시간 트레이드오프. 2의 거듭제곱 사용', color: 'text-indigo-500' },
            { name: 'dropout', range: '0.0~0.5', guide: '뉴런을 무작위로 비활성화하여 과적합 방지. 층이 깊을수록 dropout 비율 증가 경향', color: 'text-amber-500' },
            { name: 'hidden_size', range: '64~512', guide: '은닉층 뉴런 수. 데이터 복잡도에 비례. 첫 층 > 마지막 층 (점진적 축소)', color: 'text-blue-500' },
            { name: 'n_layers', range: '1~4', guide: '층 수. 깊을수록 표현력 증가하지만 학습 불안정. 보통 2~3이면 충분', color: 'text-violet-500' },
            { name: 'weight_decay', range: '1e-6~1e-2 (log)', guide: 'L2 정규화. AdamW에서 특히 중요. 0이면 과적합, 너무 크면 과소적합', color: 'text-pink-500' },
          ].map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className={`font-mono font-bold text-xs ${p.color}`}>{p.name}</span>
              <span className="text-muted-foreground ml-1.5 text-xs">{p.range}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.guide}</div>
            </div>
          ))}
        </div>

        <h3>범위 설정 실전 팁</h3>
        <p>
          <strong>1단계: 넓은 범위로 탐색</strong> — 50 trials로 대략적인 최적 영역을 파악<br />
          <strong>2단계: 좁은 범위로 정밀 탐색</strong> — 1단계 best 근처로 범위를 축소하고 50 trials 추가<br />
          <strong>중요도 분석 활용</strong> — fANOVA로 importance가 낮은 파라미터는 고정 → 차원 축소<br />
          <strong>상관관계 주의</strong> — learning_rate ↔ n_estimators는 반비례 관계. 하나를 고정하고 나머지를 튜닝
        </p>
      </div>
    </section>
  );
}
