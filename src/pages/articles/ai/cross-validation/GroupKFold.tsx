import GroupKFoldViz from './viz/GroupKFoldViz';

export default function GroupKFold() {
  return (
    <section id="group" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GroupKFold: 그룹 누출 방지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>그룹 누출(Group Leakage)</strong> — 같은 그룹(환자/유저/시나리오)의 데이터가 train과 val에 동시 존재하는 현상<br />
          모델이 그룹의 고유 패턴을 외워버림 → CV 점수 과대 추정 → 실전에서 성능 급락
        </p>

        <h3>언제 GroupKFold가 필요한가</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
          {[
            {
              domain: '의료',
              group: '환자 ID',
              desc: '같은 환자의 여러 검사 결과 → 환자별 특성이 누출',
            },
            {
              domain: '추천 시스템',
              group: '유저 ID',
              desc: '같은 유저의 클릭/구매 이력 → 유저 선호도가 누출',
            },
            {
              domain: '물류/창고',
              group: '시나리오 ID',
              desc: '같은 시나리오(레이아웃+주문) → 레이아웃 패턴이 누출',
            },
          ].map((p) => (
            <div key={p.domain} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.domain}: {p.group}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-4">GroupKFold 동작 원리</h3>
        <p>
          <strong>GroupKFold</strong>: 그룹을 fold 단위로 배정 → 같은 그룹의 모든 샘플이 같은 fold에<br />
          그룹 수 ≥ K 필요 (그룹 3개인데 K=5 불가)<br />
          sklearn: <code>GroupKFold(n_splits=5)</code> + <code>groups=</code> 파라미터로 그룹 지정
        </p>

        <h3 className="mt-4">창고 대회 예시: 시나리오 ID 기반 GroupKFold</h3>
        <p>
          각 시나리오(창고 레이아웃 + 주문 세트)가 하나의 그룹<br />
          시나리오 S1의 타임슬롯 1~25 데이터가 train/val에 섞이면 → 같은 레이아웃의 패턴을 학습<br />
          <code>GroupKFold(groups=scenario_id)</code> → 새로운 시나리오에 대한 일반화 능력 평가
        </p>

        <h3 className="mt-4">StratifiedGroupKFold: 그룹 + 클래스 비율 동시 보장</h3>
        <p>
          그룹 단위 분할 + 각 fold의 타겟 비율 유지를 동시에 달성<br />
          예: 대출 심사 — 은행(그룹) + 연체율(타겟) 비율 동시 고려<br />
          sklearn: <code>StratifiedGroupKFold(n_splits=5)</code><br />
          그룹 수가 적으면 완벽한 비율 유지가 어려울 수 있음 — 최선의 근사
        </p>

        <h3 className="mt-4">누출 여부 진단 체크리스트</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            {
              check: 'CV 점수가 비정상적으로 높은가?',
              detail: 'AUC 0.99 이상이면 누출 의심. GroupKFold 적용 후 0.85로 떨어지면 → 이전 CV가 누출',
            },
            {
              check: 'train/val 그룹 교집합이 비어 있는가?',
              detail: 'set(train_groups) & set(val_groups)가 공집합이어야 함. 교집합 존재 = 누출',
            },
            {
              check: 'GroupKFold 전후 점수 차이가 큰가?',
              detail: '|일반 CV - GroupKFold CV| > 0.05이면 기존 CV가 누출이었을 가능성 높음',
            },
            {
              check: 'Adversarial Validation으로 확인',
              detail: 'train과 val을 구분하는 분류기를 만들어 AUC 0.5 근처면 → 분포 동일(정상)',
            },
          ].map((p, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.check}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.detail}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="not-prose mt-6">
        <GroupKFoldViz />
      </div>
    </section>
  );
}
