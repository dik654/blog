import OverviewViz from './viz/OverviewViz';
import RNNOverviewDetailViz from './viz/RNNOverviewDetailViz';
import M from '@/components/ui/math';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 시퀀스 모델이 필요한가</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        FC는 입력 크기 고정, CNN은 순서 미보존 — 자연어의 가변 길이·순서 의존성 처리 불가.<br />
        RNN은 은닉 상태의 순환으로 이 문제를 해결한다.
      </p>
      <OverviewViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">시퀀스 모델의 필요성</h3>
        <RNNOverviewDetailViz />
        <p className="leading-7">
          RNN의 핵심: <M>{'h_t = f(h_{t-1}, x_t)'}</M> — 이전 은닉 상태와 현재 입력을 결합하여 새로운 상태를 생성.<br />
          FC/CNN과 달리 입력 길이가 가변이어도 동일한 가중치(<M>{'W_{hh}, W_{xh}'}</M>)를 재사용하므로 파라미터 수가 시퀀스 길이에 무관.<br />
          Elman 네트워크는 <M>{'h_t'}</M>를 다음 단계로 전달, Jordan은 출력 <M>{'y_t'}</M>를 피드백 — 실무에서는 Elman이 표준.<br />
          입출력 패턴: many-to-one(감성 분석), one-to-many(캡셔닝), many-to-many(번역·태깅) 등 시퀀스 과제 전반 커버.
        </p>
      </div>
    </section>
  );
}
