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

        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 선택 의사결정</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Memory 선택 의사결정 tree:

Q1: 용도?
├─ Gaming/Desktop → DDR5 UDIMM (32-128 GB)
├─ Workstation → DDR5 ECC UDIMM (64-256 GB)
├─ Server (일반) → DDR5 RDIMM (256-1024 GB)
├─ Server (대용량) → DDR5 LRDIMM (1-6 TB)
└─ HPC → DDR5 RDIMM or HBM

Q2: ECC 필요?
├─ Desktop games: No
├─ Workstations: Yes (safety)
├─ Servers: Mandatory
├─ Blockchain: Mandatory
└─ Databases: Critical

Q3: 용량?
├─ 16-32 GB: SODIMM/UDIMM (laptop/desktop)
├─ 64-256 GB: UDIMM/RDIMM (workstation)
├─ 256 GB - 1 TB: RDIMM (server)
├─ 1 TB - 6 TB: LRDIMM (enterprise)
└─ 6 TB+: specialized (CXL memory)

Q4: 대역폭 요구?
├─ 50-90 GB/s: 2-channel DDR5 (desktop)
├─ 200-400 GB/s: 8-channel server
├─ 400-800 GB/s: dual-socket
└─ 1+ TB/s: HBM (GPU)

// 실제 사용 scenario:

// Filecoin SP (sealing):
// - PC1 layer cache (~32 GB)
// - intermediate data buffers
// - requires: 256-512 GB DDR5 ECC RDIMM
// - budget: $3000-6000

// Ethereum validator:
// - state + mempool
// - requires: 64-128 GB DDR5 ECC
// - UDIMM OK
// - budget: $500-1500

// Full archive node:
// - Reth + historical state
// - requires: 128-256 GB DDR5 ECC
// - RDIMM preferred
// - budget: $1500-3000

// AI/ML training:
// - GPU VRAM primary
// - system RAM: 512 GB+
// - RDIMM/LRDIMM
// - budget: $5000-20000

// Database server:
// - in-memory working set
// - cache + indexes
// - 1-6 TB DDR5 LRDIMM ECC
// - budget: $20K-100K+`}
        </pre>
        <p className="leading-7">
          Memory 선택: <strong>DDR 세대 + ECC + DIMM type + 용량</strong>.<br />
          Filecoin SP: 256-512 GB DDR5 ECC RDIMM.<br />
          AI/ML 트레이닝: 512 GB+ DDR5 LRDIMM.
        </p>
      </div>
    </section>
  );
}
