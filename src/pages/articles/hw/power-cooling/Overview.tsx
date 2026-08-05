import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 전력/냉각이 중요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          전력 + 냉각은 <strong>데이터센터 설계의 핵심</strong>.<br />
          GPU TDP, 냉각 방식, 랙 설계가 상호 의존.<br />
          잘못된 선택 = 과열, downtime, 비용 폭발.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PUE (Power Usage Effectiveness)</h3>
        <p className="leading-7">
          PUE = total_facility_power / IT_equipment_power. 이론상 최소치 1.0 은 실제로는 불가능. 우수 &lt;1.3, 일반 1.5~1.8, 부실 2.0+.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PUE 구성</h3>
        <ul className="leading-7">
          <li>IT 장비 — 100%</li>
          <li>냉각 — 30~100%+</li>
          <li>전력 분배 — 5~10%</li>
          <li>조명, 기타 — 2~5%</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">냉각 오버헤드</h3>
        <ul className="leading-7">
          <li>air cooling — ~50% 오버헤드 (PUE 1.5)</li>
          <li>water cooling — ~20% (PUE 1.2)</li>
          <li>immersion cooling — ~10% (PUE 1.1)</li>
          <li>free cooling (한랭지) — 5~10%</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">랙 전력 밀도 추세</h3>
        <ul className="leading-7">
          <li>2010 — 5 kW/rack</li>
          <li>2015 — 10 kW/rack</li>
          <li>2020 — 30 kW/rack (GPU era)</li>
          <li>2024 — 50~100 kW/rack (AI)</li>
          <li>2025+ — 150+ kW/rack (H100/B200)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">현대 GPU 랙 예시</h3>
        <p className="leading-7">
          4U chassis 당 8× H100 SXM = 8 × 700W = 5,600W. 10 chassis/rack = 56 kW IT load + 냉각 = 총 70~85 kW. 고급 냉각 필수.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">전원 소스</h3>
        <ul className="leading-7">
          <li>208V single-phase — 최대 40 kW</li>
          <li>415V three-phase — 최대 100 kW</li>
          <li>busbar 시스템 — 250+ kW</li>
          <li>DC power (400V) — 부상 중</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">냉각 기술 진화</h3>
        <ul className="leading-7">
          <li>CRAC/CRAH (전통) — 10~15 kW/rack</li>
          <li>row-based cooling — 20~30 kW/rack</li>
          <li>rear-door heat exchanger — 50 kW/rack</li>
          <li>direct-to-chip water — 100+ kW/rack</li>
          <li>immersion cooling — 200+ kW/rack</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">비용 영향</h3>
        <ul className="leading-7">
          <li>전력 단가 — $0.05~$0.15/kWh</li>
          <li>100 kW rack × 24/7 = 876,000 kWh/year = $44K~$131K/year 전기료</li>
          <li>냉각 30~50% 추가</li>
          <li>5년 전기료 누적 — ~$500K+</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Filecoin SP 예시</h3>
        <p className="leading-7">
          8× A100 서버 ~3 kW. 1 rack 에 8~10 서버 → 24~30 kW. 보통 냉각으로 충분, 연간 $15K~$30K 전기료.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">현재 데이터센터 제약</h3>
        <ul className="leading-7">
          <li>전력망 capacity 한계</li>
          <li>냉각수 가용성</li>
          <li>토지 / 부동산</li>
          <li>환경 규제</li>
          <li>heat rejection</li>
        </ul>
        <p className="leading-7">
          데이터센터 <strong>PUE 1.2-1.8, 50-100 kW/rack (AI era)</strong>.<br />
          cooling 오버헤드: air 50% → water 20% → immersion 10%.<br />
          2024+ 100 kW/rack 표준, direct-to-chip 필수.
        </p>
      </div>
    </section>
  );
}
