import HypothesisViz from './viz/HypothesisViz';

export default function Hypothesis() {
  return (
    <section id="hypothesis" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가설 수립 & 시각화</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          EDA의 최종 산출물은 차트가 아니라 <strong>검증된 가설 목록과 파생 피처 아이디어</strong><br />
          상관 분석에서 "주문량과 지연이 상관 0.72"를 발견했다면 — 여기서 멈추지 않고 "왜?"를 묻는다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">가설 수립 프레임워크</h3>
        <p>
          좋은 가설의 구조: <strong>"[조건]일 때 [현상]이 발생한다, 왜냐하면 [메커니즘] 때문"</strong><br />
          예시: "로봇 5대 미만일 때 지연이 35분으로 급증한다, 처리 용량을 초과하기 때문"
        </p>
        <p>
          가설은 반드시 시각화로 검증 — boxplot, scatter, 시계열 그래프로 패턴이 실재하는지 확인<br />
          검증된 가설만 피처 아이디어로 연결해야 노이즈 피처를 만들지 않는다
        </p>
      </div>

      <div className="not-prose my-8">
        <HypothesisViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">피처 아이디어 유형</h3>
        <p>
          검증된 가설에서 파생할 수 있는 피처 유형:
        </p>
        <ul>
          <li><strong>구간화(Binning)</strong> — 연속 변수를 의미 있는 구간으로 나눔. "로봇 {'<'} 5대" 이진 피처</li>
          <li><strong>인터랙션</strong> — 두 피처의 곱·비율. "혼잡도 × 대기열", "주문량 / 로봇수"</li>
          <li><strong>래그(Lag)</strong> — 시계열에서 이전 시점 값. "15분 전 주문량", "30분 전 혼잡도"</li>
          <li><strong>롤링 통계</strong> — 이동 평균, 이동 표준편차. "최근 1시간 평균 혼잡도"</li>
          <li><strong>차분(Diff)</strong> — 변화량. "현재 주문량 - 15분 전 주문량"으로 추세 포착</li>
          <li><strong>결측 지시자</strong> — is_missing 이진 피처. MNAR일 때 특히 유용</li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: EDA 노트북 관리</p>
        <p className="text-sm">
          EDA는 한 번이 아니라 반복 — 모델 결과를 보고 다시 EDA로 돌아오는 경우가 잦다<br />
          Jupyter 노트북에 가설 번호를 매기고(H1, H2, ...) 검증 결과를 기록하면,
          팀원과 공유하거나 대회 후 리뷰할 때 경로를 추적할 수 있다
        </p>
      </div>
    </section>
  );
}
