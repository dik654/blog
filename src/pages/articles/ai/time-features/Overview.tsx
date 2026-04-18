import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시계열 피처가 왜 특별한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          일반 테이블에서 행 순서는 무의미하다 — 셔플해도 모델 성능에 영향 없음<br />
          시계열은 다르다. <strong>시간 순서 자체가 정보</strong>이며 셔플하면 예측 능력이 사라짐
        </p>
        <p>
          시계열 피처 엔지니어링의 핵심 — <strong>시간 축을 따라 새로운 입력 변수를 만드는 것</strong><br />
          과거 값(래그), 구간 통계(롤링), 시간의 주기성(sin/cos)이 대표적인 세 갈래
        </p>

        <h3>일반 피처와의 차이</h3>
        <p>
          키, 몸무게, 성별 같은 피처는 관측 시점과 무관하게 존재<br />
          시계열 피처는 <strong>관측 시점(t)이 정의의 일부</strong> — "어제 매출", "최근 7일 평균"처럼 기준점이 변하면 값도 변함<br />
          따라서 <strong>시간 순서를 깨지 않고</strong> 피처를 구성해야 하며, 이를 어기면 미래 누출(Data Leakage)이 발생
        </p>
      </div>
      <div className="not-prose my-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>실전에서의 역할</h3>
        <p>
          수요 예측 — 래그 피처(어제/지난주 판매량)가 가장 강력한 단일 예측 인자인 경우가 많음<br />
          K리그 분석 — 최근 5경기 승점 이동 평균으로 팀 폼을 정량화<br />
          금융 — 20일/60일 이동 평균선 교차가 매매 시그널
        </p>

        <h3>이 글에서 다루는 범위</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { title: '래그 & 차분', desc: '이전 시점 값과 변화량으로 관성·추세 포착' },
            { title: '롤링 통계', desc: '이동 평균·표준편차·EMA로 구간 특성 요약' },
            { title: '주기 인코딩', desc: 'sin/cos 변환으로 시간의 순환 구조 표현' },
            { title: '미래 누출 방지', desc: 'TimeSeriesSplit과 올바른 피처 계산 순서' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-semibold text-foreground text-xs">{item.title}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">핵심 원칙</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            시계열 피처를 만들 때는 항상 <strong>"이 시점에서 과거만 볼 수 있는가?"</strong>를 자문해야 한다.
            미래 정보가 한 방울이라도 섞이면 모델은 실전에서 무용지물이 된다.
          </p>
        </div>
      </div>
    </section>
  );
}
