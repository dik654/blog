import CoolingViz from './viz/CoolingViz';

export default function Cooling() {
  return (
    <section id="cooling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">4. 데이터센터 냉각 — 공조 vs 수냉 vs 침지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GPU 한 장이 700W (H100), 노드가 5~10 kW, rack 이 100 kW+ 에 도달한 지금 전통 공조의 한계.
          <br />
          냉각 결정이 PUE (Power Usage Effectiveness) 와 직결되고, PUE 가 곧 운영 비용 + ESG 점수.
        </p>
      </div>
      <CoolingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">4-1. 공조 (Air Cooling)</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — 컴퓨터실 공조 (CRAC/CRAH) 가 차가운 공기 → hot aisle / cold aisle → 외부 chiller.</li>
          <li><strong>장점</strong> — 표준 인프라, 낮은 비용, 모든 서버 호환.</li>
          <li><strong>한계</strong> — TDP 500W/U 정도. H100 SXM 8 장 노드 (5.6 kW) 는 air 로 가능하지만 효율 ↓.</li>
          <li><strong>PUE</strong> — 1.5~2.0 (1.5 면 IT 100kW 에 cooling 50kW). 한국의 평균 ~1.6.</li>
          <li><strong>적합</strong> — 일반 서버, 검증자, K8s 워커, RPC 노드. 즉 GPU 1~2 장 노드 정도.</li>
          <li><strong>한계 사례</strong> — H100 8 장 air-cooled 서버는 thermal throttle 가능. SXM 모듈은 DLC 가 표준이 됨.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-2. DLC (Direct Liquid Cooling)</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — CPU/GPU 위 cold plate 를 통해 물 (또는 dielectric fluid) 순환. CDU (Coolant Distribution Unit) 가 열 교환.</li>
          <li><strong>장점</strong> — air 대비 효율 ↑. PUE 1.1~1.3 가능. rack 80 kW+ 가능.</li>
          <li><strong>한계</strong> — 배관 인프라 + CDU 비용. 누수 위험 (소량이라도 단락 우려). 정비 복잡.</li>
          <li><strong>표준화 흐름</strong> — OCP (Open Compute Project) 의 DLC spec. NVIDIA GB200 NVL72 은 DLC 전용 (air 불가).</li>
          <li><strong>적합</strong> — H100 / B200 학습 클러스터, HPC, 한국 데이터센터의 신규 hyperscale.</li>
          <li><strong>warm-water 변종</strong> — 25~45°C 의 warm coolant 로 chiller 우회 가능. PUE 1.05 까지. 북유럽 hyperscale 의 표준.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-3. Immersion Cooling (침지)</h3>
        <ul className="leading-7">
          <li><strong>구조</strong> — 서버를 통째로 dielectric 유체 (mineral oil 또는 fluorocarbon) 에 담금. 열이 유체로 직접 전달.</li>
          <li><strong>두 종류</strong> — single-phase (액체만, 펌프로 순환) · two-phase (끓어 vapor → 응축, 더 높은 효율).</li>
          <li><strong>장점</strong> — 가장 높은 밀도 (rack 150+ kW), 가장 낮은 PUE (1.05), 소음 거의 없음, 먼지 영향 0.</li>
          <li><strong>한계</strong> — 유체 비용 (특히 fluorocarbon), 정비 어려움 (꺼내서 씻기), 일부 부품 (광학 · HDD) 침지 부적합.</li>
          <li><strong>적합</strong> — 극한 밀도 HPC, ASIC mining, 일부 hyperscale 실험. 일반 운영자에겐 과한 영역.</li>
          <li><strong>벤더</strong> — Submer, GRC (Green Revolution Cooling), Asperitas. 한국에선 도입 초기.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-4. PUE — 운영 비용의 핵심 지표</h3>
        <ul className="leading-7">
          <li><strong>정의</strong> — Total Facility Power / IT Equipment Power. 1.0 이 이상.</li>
          <li><strong>업계 평균</strong> — 1.55~1.6 (전 세계). hyperscale (Google · Microsoft · AWS) 1.1~1.2.</li>
          <li><strong>한국</strong> — 1.5~1.7. 더운 여름이 chiller 부담. 강원 (춘천 · 원주) 같은 추운 지역이 유리.</li>
          <li><strong>비용 영향</strong> — IT 100 kW 에 PUE 1.5 면 cooling 50 kW. 전기 단가 100 원/kWh 면 시간 5,000 원 = 월 3.6M 원 추가.</li>
          <li><strong>ESG</strong> — 큰 회사는 carbon footprint 감사 시 PUE 보고. 1.5 미만이 목표.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-5. 한국 데이터센터의 결정</h3>
        <ul className="leading-7">
          <li><strong>위치</strong> — 수도권 (전력 안정 + latency) vs 강원/충청 (저렴 + 시원). hyperscale 은 강원 이전 (KT · 삼성SDS · 네이버 신규).</li>
          <li><strong>전력 단가</strong> — 산업용 평균 ~100 원/kWh. 미국 (~50 원), 북유럽 (~30 원) 대비 비싸. PUE 가 더 중요.</li>
          <li><strong>법규</strong> — 2024 시행 「데이터센터법」 — 100kW 이상 PUE 보고 의무. 2030 년 PUE 1.4 미만 권고.</li>
          <li><strong>외기냉방 (free cooling)</strong> — 외부 기온 낮은 시간에 chiller 우회. 한국은 겨울만 가능 (~3 개월).</li>
          <li><strong>액침 도입</strong> — KT · LG U+ 가 시범 도입. 신규 AI 클러스터에 검토.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-6. 결정 가이드 — TDP/rack 으로 선택</h3>
        <ul className="leading-7">
          <li><strong>~30 kW/rack</strong> — air 충분.</li>
          <li><strong>30~80 kW/rack</strong> — DLC 권장 (또는 hybrid: CPU air + GPU DLC).</li>
          <li><strong>80~150 kW/rack</strong> — DLC 의무. immersion 검토.</li>
          <li><strong>150+ kW/rack</strong> — immersion 또는 specialized cooling. NVIDIA GB200 NVL72 (~120 kW) 같이.</li>
        </ul>
      </div>
    </section>
  );
}
