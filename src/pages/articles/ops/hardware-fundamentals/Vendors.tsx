export default function Vendors() {
  return (
    <section id="vendors" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">5. 서버 · 스토리지 벤더 — 선택 매트릭스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 벤더 선택은 워크로드 + 운영 규모 + 지원 모델에 따라 갈린다.
          <br />
          큰 hyperscale 은 ODM 직매, 중규모는 OEM (Dell · HPE), 작은 곳은 표준 OEM 또는 클라우드 임대.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">5-1. AI 서버 벤더 — Supermicro 의 위치</h3>
        <ul className="leading-7">
          <li><strong>Supermicro</strong> — H100 / H200 / B200 GPU 서버의 가장 빠른 출시 + 가성비. NVIDIA 와의 close partnership. AI 부스트로 2024 매출 폭증.</li>
          <li><strong>Dell PowerEdge XE9680</strong> — 8 GPU SXM 서버. 안정적 지원, 큰 기업 표준.</li>
          <li><strong>HPE Cray XD</strong> — HPC 전통 + 새 AI 라인. liquid cooling 우위.</li>
          <li><strong>Lenovo ThinkSystem SR675 V3</strong> — Intel 우선. 한국 / 일본 대기업 도입.</li>
          <li><strong>Inspur NF5688G7</strong> — 중국 hyperscale 의 표준. 가격 ↓ 지만 지원 한계.</li>
          <li><strong>ODM (Wiwynn · Quanta · Foxconn)</strong> — Meta · Google · AWS 의 custom 디자인. 일반 운영자 미접근.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">5-2. 일반 서버 벤더</h3>
        <ul className="leading-7">
          <li><strong>Dell · HPE · Lenovo</strong> — 대기업 표준. 4 시간 / 다음날 부품 배송 SLA.</li>
          <li><strong>Supermicro</strong> — 가성비 + 빠른 신 모델. 지원은 OEM 보다 약함.</li>
          <li><strong>한국 — 삼성SDS · LG CNS</strong> — 자체 디자인 + 통합 운영. 대기업 IT 인프라.</li>
          <li><strong>화이트박스 / DIY</strong> — 검증자 운영자가 부품 직조립. 비용 ↓ 지만 지원 0.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">5-3. HDD 벤더 — Filecoin SP 의 결정</h3>
        <ul className="leading-7">
          <li><strong>Seagate Exos</strong> — HAMR (열보조 자기기록) 선도, 30 TB+ 모델. 가장 capacity 우위.</li>
          <li><strong>Western Digital Ultrastar</strong> — HelioSeal (헬륨 충전) 안정. 보증 5 년.</li>
          <li><strong>Toshiba MG</strong> — 가격 ↓ 지만 capacity 다소 뒤짐.</li>
          <li><strong>벤더 선택 기준</strong> — TBW 보다 AFR (Annual Failure Rate) 가 중요. Backblaze drive stats 참고.</li>
          <li><strong>Filecoin SP 의 흐름</strong> — Seagate Exos + ZFS RAIDZ2 가 사실상 표준.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">5-4. SSD 벤더 — 워크로드별</h3>
        <ul className="leading-7">
          <li><strong>Samsung PM 시리즈</strong> — 밸런스 (TBW + IOPS + PLP). PM9A3 (M.2 · U.2), PM1733 (PCIe 4.0).</li>
          <li><strong>SK Hynix PE 시리즈</strong> — PE8010 같은 high-end. 한국 SP 에 가용성 ↑.</li>
          <li><strong>Solidigm (구 Intel SSD)</strong> — D7-P5510 같은 high-endurance. Filecoin sealing 표준.</li>
          <li><strong>Micron 7450 / 7500</strong> — PCIe 4.0/5.0 NVMe. 가성비.</li>
          <li><strong>Kioxia (구 Toshiba memory)</strong> — CM6/CM7 시리즈. 안정.</li>
          <li><strong>WD UltraStar SS</strong> — 엔터프라이즈 SSD. 가용성 ↑.</li>
          <li><strong>NAND 공급망 — 한국 의 SK Hynix / Samsung 이 글로벌 점유율 ↑</strong>. 미국 제재로 중국 YMTC 점유율 감소.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">5-5. CPU/GPU 공급망 — 누가 누구한테 의존하는가</h3>
        <ul className="leading-7">
          <li><strong>NVIDIA → TSMC</strong> — H100/H200 4N · B200 4NP. TSMC 가 capacity 의 대부분.</li>
          <li><strong>NVIDIA → SK Hynix</strong> — HBM3/3e 공급 의 대부분. Samsung HBM 도 도입 진행.</li>
          <li><strong>AMD → TSMC</strong> — MI300X · EPYC. NVIDIA 와 같은 fab 공유.</li>
          <li><strong>Intel → 자체 fab + TSMC</strong> — Granite Rapids 일부는 TSMC 위탁.</li>
          <li><strong>한국의 위치</strong> — HBM 의 주 공급. 메모리 (DDR · HBM) 는 한국 점유율 ~70%. 정부 정책의 핵심 산업.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">5-6. 운영자 결정 가이드</h3>
        <ul className="leading-7">
          <li><strong>1~5 노드 (소규모 검증자)</strong> — Supermicro 또는 화이트박스 + 컨슈머 GPU. 가성비 우선.</li>
          <li><strong>5~50 노드 (중규모)</strong> — OEM (Dell · HPE) + 엔터프라이즈 NVMe + Pro GPU. 지원 SLA 확보.</li>
          <li><strong>50+ 노드 (큰 운영자)</strong> — Supermicro 대량 + DLC + 자체 운영 인프라. ODM 검토.</li>
          <li><strong>AI 학습 클러스터</strong> — H100/H200 SXM + Supermicro/Dell + DLC. 또는 클라우드 (CoreWeave · Lambda) 임대.</li>
          <li><strong>Filecoin SP</strong> — Seagate HDD + Solidigm SSD + Supermicro 워커 + RTX 4090 GPU.</li>
        </ul>
      </div>
    </section>
  );
}
