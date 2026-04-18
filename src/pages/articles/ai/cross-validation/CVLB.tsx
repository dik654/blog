import CVLBViz from './viz/CVLBViz';

export default function CVLB() {
  return (
    <section id="cv-lb" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CV-LB 상관관계: 신뢰할 수 있는 CV</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          교차 검증 점수(CV)와 리더보드 점수(LB)가 함께 움직여야 — 그래야 CV를 믿고 실험할 수 있다<br />
          실험 A가 CV에서 좋아졌다면 LB에서도 좋아져야 한다, 만약 반대 방향으로 움직인다면 CV 설계가 잘못된 것
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">CV-LB 불일치의 3가지 원인</h3>
        <ul>
          <li><strong>데이터 누출(leakage)</strong> — CV 내부에서 미래 정보나 타겟 정보가 새는 경우</li>
          <li><strong>분포 차이(distribution shift)</strong> — train과 test 데이터 분포가 달라 CV가 일반화 성능을 못 담는 경우</li>
          <li><strong>샘플링 편향</strong> — GroupKFold가 필요한데 일반 KFold를 쓴 경우</li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <CVLBViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Trust Your CV</h3>
        <p>
          Kaggle 격언: "Trust your CV, not the public LB" — 공개 리더보드는 전체 test의 일부이고,
          최종 순위는 private LB로 결정<br />
          public LB에 과적합되어 제출을 고르면 shake-up(순위 급락) 위험이 크다
        </p>
        <p>
          신뢰할 수 있는 CV를 만들었다면 — 실험 결과를 CV 기준으로만 평가, public LB는 참고용
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: CV-LB gap 모니터링</p>
        <p className="text-sm">
          매 실험마다 CV 점수와 LB 점수를 함께 기록 — 둘의 차이(gap)가 일정해야 정상<br />
          gap이 갑자기 커지면 누출이나 과적합 의심, 실험 설계로 되돌아가서 원인을 찾아야 한다
        </p>
      </div>
    </section>
  );
}
