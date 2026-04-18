import PipelineOverviewViz from './viz/PipelineOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이미지 분류 대회 접근법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이미지 분류 — 입력 이미지를 N개 클래스 중 하나(또는 여러 개)로 매핑하는 문제<br />
          구조물 안전 점검, 딥페이크 탐지, 의료 영상 판독 등 실무 전반에 직결<br />
          대회(Kaggle, Dacon)에서 검증된 end-to-end 파이프라인을 정리
        </p>
        <p>
          핵심 흐름: <strong>데이터 확인 → 백본 선택 → 증강 → 학습 → TTA → 앙상블</strong><br />
          각 단계에서 0.5~2%씩 성능을 쌓아 올리는 구조 — 하나라도 빠지면 상위권 불가
        </p>
      </div>
      <div className="not-prose my-8">
        <PipelineOverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">EDA: 데이터를 먼저 이해한다</h3>
        <p>
          클래스 분포 확인 — 불균형 비율 10:1 이상이면 Weighted Loss 또는 Oversampling 필수<br />
          이미지 해상도 통계 — 최소/최대/중앙값. 해상도 편차가 크면 리사이즈 전략 중요<br />
          라벨 노이즈 — 잘못된 라벨이 5% 이상이면 Label Smoothing(0.1) 또는 수동 클리닝
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">실전 팁: 대회 첫 날 체크리스트</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          1) 클래스 분포 히스토그램 그리기 &nbsp;
          2) 랜덤 샘플 50장 눈으로 확인 &nbsp;
          3) 베이스라인(ResNet-50 + 기본 증강) 제출 &nbsp;
          4) 리더보드 점수 기준선 확보 — 이후 모든 실험의 비교 기준
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          베이스라인 없이 복잡한 기법부터 시작하면 어떤 기법이 효과적인지 판단 불가<br />
          간단한 모델(ResNet-50)로 빠르게 기준선을 세우고, 한 번에 하나씩 변수를 바꿔가며 실험<br />
          이 글에서 다루는 파이프라인 — 백본 선택, 학습 전략, 후처리 — 이 순서대로 적용
        </p>
      </div>
    </section>
  );
}
