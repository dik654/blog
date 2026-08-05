export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 — 인프라 운영자의 하드웨어 결정 지도</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          AI 인프라 · 블록체인 노드 · 검증자 · Storage Provider 운영자가 하드웨어 한 번 잘못 고르면
          <strong> 운영 중 사고로 직결된다</strong>.
          <br />
          CPU 단일 코어 성능을 안 봤다가 sealing 시간 2 배 늘거나, HBM 부족한 GPU 로 LLM 학습 시 swap 폭주, 컨슈머 SSD 가 1 개월에 wear-out, 공조 부실로 GPU thermal throttle — 모두 처음 결정에서 막을 수 있는 사고다.
        </p>
        <p className="leading-7">
          이 글은 운영자 시각에서 결정을 가르는 핵심 영역만 다룬다.
          <br />
          CPU (Intel vs AMD) · GPU 계층 (소비자 vs DC) · 메모리 (DDR · HBM · HBF) · NPU 의 위치 · 스토리지 벤더 차이 · 공조 vs 수냉의 trade-off.
        </p>
        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>CPU 결정</strong> — Intel Xeon · Sapphire/Emerald/Granite Rapids vs AMD EPYC (Genoa · Bergamo · Turin) · 코어 / 캐시 / 메모리 채널</li>
          <li><strong>GPU 계층</strong> — H100 · H200 · B200 · MI300X vs RTX (4090 · 5090) vs Pro (RTX 6000 Ada) · 워크로드별 선택</li>
          <li><strong>메모리</strong> — DDR5 · HBM3 · HBM3e · HBF 의 위치와 GPU 별 채택 · bandwidth 의미</li>
          <li><strong>NPU 와 가속기</strong> — TPU · Trainium · Gaudi · Groq LPU · Cerebras WSE — GPU 와의 차이</li>
          <li><strong>스토리지 벤더</strong> — Samsung · SK Hynix · Micron · Solidigm · WD · Seagate · 엔터프라이즈 NVMe vs HDD</li>
          <li><strong>공조 · 수냉</strong> — air · DLC (Direct Liquid Cooling) · immersion · 각 trade-off + 데이터센터 PUE</li>
          <li><strong>서버 벤더</strong> — Supermicro · Dell · HPE · Inspur · 그리고 ODM (Wiwynn · Quanta) — 큰 운영자 선택 패턴</li>
        </ol>
      </div>
    </section>
  );
}
