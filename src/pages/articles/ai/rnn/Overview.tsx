import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 시퀀스 모델이 필요한가</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        FC는 입력 크기 고정, CNN은 순서 미보존 — 자연어의 가변 길이·순서 의존성 처리 불가.<br />
        RNN은 은닉 상태의 순환으로 이 문제를 해결한다.
      </p>
      <OverviewViz />
    </section>
  );
}
