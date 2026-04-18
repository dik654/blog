import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이벤트 시퀀스란</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          전통적인 테이블 데이터는 <strong>한 행이 한 샘플</strong>이다.
          주택 가격 예측이라면 면적·방 수·위치가 한 행에 담기고, 그 행만 보면 예측할 수 있다.
        </p>
        <p>
          하지만 현실의 많은 문제에서 <strong>단일 행으로는 부족</strong>하다.
          축구 패스 체인, 창고 로봇 주문 시퀀스, 유저 클릭 로그 — 이 데이터들은 "연속된 이벤트의 흐름"이 핵심 정보이다.
          다음 패스의 목적지를 예측하려면 직전 3~4개 패스의 방향과 속도를 알아야 하고,
          창고 로봇의 경로 충돌을 예방하려면 최근 주문 시퀀스의 구역 패턴을 파악해야 한다.
        </p>
        <p>
          이벤트 시퀀스(event sequence)란 — 하나의 엔티티(선수, 로봇, 유저)에 대해
          <strong>시간순으로 정렬된 이벤트 기록</strong>을 뜻한다.
          각 이벤트는 타임스탬프, 이벤트 유형, 연속형 속성(좌표, 금액)을 가진다.
          이 시퀀스 전체가 하나의 "샘플"이 되어 모델에 입력된다.
        </p>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 시퀀스 모델링이 필요한가</h3>
        <p>
          시퀀스를 무시하고 각 이벤트를 독립 행으로 처리하면 — "패스→패스→드리블→슛" 같은 흐름 패턴이 사라진다.
          단일 이벤트의 x, y 좌표만으로는 다음 위치를 예측할 수 없지만,
          직전 시퀀스의 방향 변화와 속도 패턴이 있으면 예측력이 크게 올라간다.
        </p>
        <p>
          K리그 패스 좌표 예측에서 — 시퀀스 피처를 추가했을 때 MAE가 약 15~20% 감소하는 결과가 일반적이다.
          창고 주문에서도 시퀀스 패턴 피처가 경로 충돌 예측의 상위 중요도 피처로 올라온다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 접근법 개요</h3>
        <p>
          시퀀스를 모델에 넣는 방법은 크게 세 가지로 나뉜다:
        </p>
        <ul>
          <li>
            <strong>인코딩</strong> — 시퀀스를 고정 길이 텐서로 변환.
            패딩으로 길이를 맞추고, 이벤트 타입 임베딩·위치 인코딩·시간 인코딩을 합산.
            RNN이나 1D-CNN의 입력이 된다.
          </li>
          <li>
            <strong>집계 피처</strong> — 시퀀스를 통계(평균, 카운트)와 패턴(n-gram, 전환 확률)으로 압축.
            결과가 평탄한(flat) 행 벡터이므로 GBM에 바로 넣을 수 있다.
          </li>
          <li>
            <strong>Transformer</strong> — 시퀀스를 직접 Self-Attention으로 처리.
            각 이벤트를 토큰으로 취급하여 맥락을 보존한 시퀀스 표현을 학습한다.
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 전략: 집계 + Transformer 병행</p>
        <p className="text-sm">
          대회에서는 GBM 집계 피처와 Transformer 시퀀스 벡터를 결합하는 경우가 많다.
          집계 피처만으로도 강력하지만, Transformer가 포착하는 세밀한 순서 패턴이 앙상블에서 상호 보완된다.
        </p>
      </div>
    </section>
  );
}
