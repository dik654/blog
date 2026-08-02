import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 메모리 선택이 중요한가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          메모리 선택의 <strong>3가지 핵심 축</strong>: DDR 세대, ECC 여부, DIMM 타입.<br />
          서버 메모리: 대용량 + 오류 정정 + 안정성.<br />
          블록체인 노드 최대 256GB-6TB 요구.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">용도별 선택</h3>
        <ul className="leading-7">
          <li>Gaming / Desktop — DDR5 UDIMM 32~128 GB</li>
          <li>Workstation — DDR5 ECC UDIMM 64~256 GB</li>
          <li>Server (일반) — DDR5 RDIMM 256 GB~1 TB</li>
          <li>Server (대용량) — DDR5 LRDIMM 1~6 TB</li>
          <li>HPC — DDR5 RDIMM 또는 HBM</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">ECC 필요 여부</h3>
        <ul className="leading-7">
          <li>Desktop / Gaming — 불필요</li>
          <li>Workstation — 권장 (안전성)</li>
          <li>Server — 필수</li>
          <li>Blockchain node — 필수 (slashing 위험)</li>
          <li>Database — 치명적 손상 방지 필수</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">용량 구간별 DIMM 타입</h3>
        <ul className="leading-7">
          <li>16~32 GB — SODIMM / UDIMM (노트북, 데스크톱)</li>
          <li>64~256 GB — UDIMM / RDIMM (워크스테이션)</li>
          <li>256 GB~1 TB — RDIMM (서버)</li>
          <li>1~6 TB — LRDIMM (엔터프라이즈)</li>
          <li>6 TB+ — CXL memory 전용</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">대역폭 구간</h3>
        <ul className="leading-7">
          <li>50~90 GB/s — 2-channel DDR5 (데스크톱)</li>
          <li>200~400 GB/s — 8-channel 서버</li>
          <li>400~800 GB/s — dual-socket</li>
          <li>1+ TB/s — HBM (GPU 전용)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 시나리오</h3>
        <ul className="leading-7">
          <li><strong>Filecoin SP (sealing)</strong> — PC1 layer cache ~32 GB + intermediate buffer. 256~512 GB DDR5 ECC RDIMM. $3K~$6K.</li>
          <li><strong>Ethereum validator</strong> — state + mempool. 64~128 GB DDR5 ECC, UDIMM 가능. $500~$1.5K.</li>
          <li><strong>Full archive node</strong> — Reth + historical state. 128~256 GB DDR5 ECC RDIMM 권장. $1.5K~$3K.</li>
          <li><strong>AI/ML training</strong> — GPU VRAM이 1차, system RAM 512 GB+ (RDIMM/LRDIMM). $5K~$20K.</li>
          <li><strong>Database server</strong> — in-memory working set + cache + index. 1~6 TB DDR5 LRDIMM ECC. $20K~$100K+.</li>
        </ul>
        <p className="leading-7">
          Memory 선택: <strong>DDR 세대 + ECC + DIMM type + 용량</strong>.<br />
          Filecoin SP: 256-512 GB DDR5 ECC RDIMM.<br />
          AI/ML 트레이닝: 512 GB+ DDR5 LRDIMM.
        </p>
      </div>
    </section>
  );
}
