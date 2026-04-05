import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 GPU를 비교해야 하는가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          컨슈머(RTX 4090/5090) vs 데이터센터(A100/H100) GPU 비교.<br />
          블록체인 워크로드별 <strong>병목 분석 + 최적 선택</strong> 기준 정리.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 선택의 핵심 질문</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GPU 선택 시 4가지 결정 요소:

// 1. 워크로드 종류:
// - MSM (pairing/SNARK): memory bandwidth bound
// - NTT/FFT: compute bound
// - hash (SHA256): compute + power bound
// - AI/ML: tensor operation bound
// - different GPU optimal for each

// 2. VRAM 요구량:
// - FIL sealing: 24GB minimum
// - ZK circuits: 32-80GB depending on size
// - LLM inference: 80GB+
// - small jobs: 16GB OK

// 3. Form factor (cooling):
// - Consumer: open-air (아파트)
// - Datacenter: blower (server rack)
// - 혼용 불가 (cooling mismatch)

// 4. Budget:
// - consumer: $1.5K-2K
// - datacenter: $10K-40K
// - total cost: GPU + power + cooling

// Typical scenarios:
//
// Individual miner (home):
// - RTX 4090 × 1-2
// - budget ~$4K
// - Filecoin Sealing 가능
// - SP scale 작음
//
// Small SP (rack):
// - A6000 × 4-8
// - budget ~$25-40K
// - 10-50 TiB capacity
// - production grade
//
// Enterprise SP (datacenter):
// - A100/H100 × 50+
// - budget $500K+
// - 1+ PiB capacity
// - 24/7 operations
//
// AI/ML lab:
// - H100 × 8-64
// - NVLink clusters
// - training + inference
// - budget $1M+

// Performance tiers (C2 proving):
// - RTX 4090: 40-60 min
// - A6000: 30-45 min
// - A100: 20-30 min
// - H100: 15-25 min
// - B200: <15 min (2024)`}
        </pre>
        <p className="leading-7">
          GPU 선택: <strong>workload + VRAM + cooling + budget</strong> 4가지 요소.<br />
          individual → small SP → enterprise → AI/ML lab 각자 다른 tier.<br />
          C2 proving: 4090 60min, A100 30min, H100 25min.
        </p>
      </div>
    </section>
  );
}
