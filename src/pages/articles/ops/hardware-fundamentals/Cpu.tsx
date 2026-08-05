import CpuComparisonViz from './viz/CpuComparisonViz';

export default function Cpu() {
  return (
    <section id="cpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. CPU — Intel Xeon vs AMD EPYC</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 CPU 결정은 워크로드 종류에 따라 갈린다.
          <br />
          단일 코어 성능이 중요한 워크로드 (이더리움 EVM 실행, Filecoin PC1) → <strong>Intel P-core</strong> 또는 <strong>AMD Zen 5 P-core</strong>.
          <br />
          많은 thread 가 동시 실행되는 워크로드 (웹 서버, RPC, K8s 노드) → <strong>AMD Zen 5c (Turin Dense)</strong> 또는 <strong>Intel Sierra Forest E-core</strong>.
        </p>
      </div>
      <CpuComparisonViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">1-1. 핵심 아키텍처 차이 — Intel vs AMD</h3>

        <h4 className="text-lg font-semibold mt-6 mb-2">Intel monolithic vs AMD chiplet</h4>
        <p className="leading-7">
          Intel 의 옛 패턴 — 한 die 에 모든 core + I/O + 메모리 컨트롤러. 단순 + 코어 간 통신 latency 가 일정 (uniform).
          <br />
          단점 — 큰 die 는 yield (제조 성공률) 가 낮음. 코어 수 늘릴수록 die 면적 증가, 한 트랜지스터 결함이 전체 die 폐기. 60 코어 단일 die 의 yield 는 24 코어 die 의 1/10 수준.
        </p>
        <p className="leading-7">
          AMD 의 chiplet 접근 — die 를 둘로 나눈다. CCD (Core Complex Die, 8 core 단위) 는 TSMC 5nm 의 작은 die 로 yield 높게 만들고, IOD (I/O Die) 는 12nm 같은 옛 공정의 별도 die 에 메모리 컨트롤러 + PCIe + Infinity Fabric 박는다. 한 패키지에 CCD 12 개 + IOD 1 개 = 96 core (Genoa).
          <br />
          이점 — 작은 die 라 yield ↑. 옛 공정 IOD 로 비용 ↓. 코어 수 확장 쉬움 (CCD 더 박기만).
          <br />
          단점 — chiplet 간 통신이 die 내부보다 느림 (Infinity Fabric latency). NUMA-like 효과 (intra-CCD vs cross-CCD).
        </p>
        <p className="leading-7">
          현재 Intel 도 chiplet 도입 — Sapphire Rapids 의 4-tile MCM, Granite Rapids 의 더 진화된 chiplet. 결국 같은 방향으로 수렴.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">P-core vs E-core (heterogeneous)</h4>
        <p className="leading-7">
          Intel 12 세대 (Alder Lake) 부터 컨슈머에 도입, 서버는 Sierra Forest 가 첫 E-core 전용.
          <br />
          P-core (Performance core) — 큰 ROB (Reorder Buffer) · OoO 깊이 · 큰 L1/L2 cache · AVX-512 지원. 단일 thread 성능 ↑. 게이밍 / EVM 실행처럼 단일 thread 비중 큰 워크로드.
          <br />
          E-core (Efficiency core) — 작고 단순. AVX-512 X. SMT (HyperThreading) X. 같은 die 면적에 P-core 의 ~2 배 들어감. 많은 thread 가 동시 실행되는 워크로드 (RPC · 웹 서버) 에 유리.
        </p>
        <p className="leading-7">
          Sierra Forest 는 288 E-core 로 K8s 워커 / RPC 노드의 코어 밀도 우위. AMD 의 대응이 Turin Dense (Zen 5c) 192 core — 같은 사상의 다른 구현.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">3D V-Cache (AMD 의 cache stacking)</h4>
        <p className="leading-7">
          AMD 의 Zen 4/5c 부터 도입. CCD 위에 추가 L3 cache die 를 3 차원으로 stacking. TSV (Through-Silicon Via) 로 연결. L3 가 256 MB → 768 MB 로 3 배.
        </p>
        <p className="leading-7">
          왜 의미 있는가 — DRAM access 가 100 ns, L3 access 가 10 ns. cache 안에 데이터가 들어가면 10 배 빠름. cache friendly 워크로드 (DB query · in-memory 분석 · CFD · genomics) 는 같은 클럭에서 1.5~3 배 throughput.
          <br />
          예시 — Postgres / Redis 같은 DB 는 working set (자주 access 하는 데이터) 이 보통 수백 MB. 256 MB L3 에 안 들어가던 working set 이 768 MB 에 들어가면 cache miss rate 가 절반 → throughput 2 배.
        </p>
        <p className="leading-7">
          제품 — EPYC Genoa-X (4 세대), Turin-X (5 세대). 게이밍 변종은 Ryzen 7800X3D · 9800X3D — game 도 cache friendly 워크로드.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">메모리 채널 — bandwidth 의 결정 요인</h4>
        <p className="leading-7">
          한 채널의 DDR5-4800 = 38.4 GB/s. 채널 수가 곱셈으로 bandwidth 결정.
        </p>
        <ul className="leading-7">
          <li>Intel Sapphire Rapids (4 세대) — 8 채널 × DDR5-4800 = 307 GB/s.</li>
          <li>Intel Granite Rapids (6 세대) — 12 채널 × DDR5-6400 = 614 GB/s. MRDIMM 까지 쓰면 800+ GB/s.</li>
          <li>AMD Genoa (Zen 4) — 12 채널 × DDR5-4800 = 461 GB/s. AMD 의 메모리 bandwidth 우위 한 세대 빨랐음.</li>
          <li>AMD Turin (Zen 5) — 12 채널 × DDR5-6400 = 614 GB/s.</li>
          <li>컨슈머 (Ryzen 9950X · i9 14900K) — 2 채널 × DDR5-5600 = 90 GB/s. 서버의 1/7.</li>
        </ul>
        <p className="leading-7">
          영향 — Filecoin PC1 같은 메모리 bandwidth bound 워크로드는 채널 수가 throughput 직결. 12 채널 EPYC 1 노드가 2 채널 컨슈머 7 노드와 같은 bandwidth.
        </p>

        <h4 className="text-lg font-semibold mt-6 mb-2">MRDIMM (Multiplexed Rank DIMM)</h4>
        <p className="leading-7">
          기존 RDIMM 은 한 시점에 한 rank 만 활성 (rank = DRAM 칩 그룹). MRDIMM 은 두 rank 를 동시 활성화 + 데이터 multiplex 로 bandwidth 1.4 배.
          <br />
          제조사 — Micron · SK Hynix · Samsung 모두 양산. 가격 ~1.2 배 (RDIMM 대비).
          <br />
          지원 — Intel Granite Rapids 부터, AMD Turin 일부. 메모리 bandwidth bound 워크로드 (HPC · in-memory DB · LLM 추론 host RAM) 에 즉시 도입할 가치.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-2. 워크로드별 선택 가이드</h3>
        <ul className="leading-7">
          <li><strong>이더리움 EL (Geth · Reth)</strong> — EVM 실행은 단일 thread 비중 높음 + state DB IO. AMD Ryzen 7900X (소비자) 또는 EPYC Turin 작은 SKU. 단일 코어 boost clock 핵심.</li>
          <li><strong>Filecoin PC1</strong> — 단일 코어 + SSD IOPS. EPYC 9474F (4.1 GHz) 같은 high-clock 모델, 또는 Intel Granite Rapids.</li>
          <li><strong>Filecoin PC2 / C2</strong> — CPU 보다 GPU 가 핵심. CPU 는 보통 사양으로.</li>
          <li><strong>K8s 컨트롤 플레인 + 워커</strong> — 코어 수 + 메모리 bandwidth 가 RPS 와 직결. AMD EPYC Bergamo (128 core) 또는 Turin Dense (192 core) 가 비용 효율.</li>
          <li><strong>RPC 노드 (대량 동시 처리)</strong> — Bergamo 또는 Sierra Forest 의 high core count.</li>
          <li><strong>AI 추론 호스트 (GPU 보조)</strong> — CPU 는 데이터 전처리 + GPU 큐 관리. 코어 수보다 메모리 bandwidth (HBM 옆 PCIe 5.0 ↑).</li>
          <li><strong>HPC / 과학 계산</strong> — AVX-512 + 3D V-Cache 가 큰 이점 (AMD Genoa-X · Turin-X).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-3. 메모리 결정 — 코어 수와 균형</h3>
        <ul className="leading-7">
          <li><strong>memory per core</strong> — 일반 서버 4~8 GB / core. AI 호스트는 16+ GB / core (GPU 메모리 보조).</li>
          <li><strong>RDIMM vs MRDIMM</strong> — MRDIMM 이 bandwidth 1.4x. 가격 ~1.2x. 대역폭 bound 워크로드는 즉시 채택.</li>
          <li><strong>DDR5 ECC 필수</strong> — 서버급. 컨슈머용 non-ECC 는 long-running validator/storage 에 부적합.</li>
          <li><strong>NUMA</strong> — 멀티 소켓 서버는 NUMA 인지 워크로드 배치 (numactl). DB / 메모리 heavy 앱은 한 socket 에 묶기.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-4. 운영 함정</h3>
        <ul className="leading-7">
          <li><strong>boost clock 의 한계</strong> — single-core boost 만 보고 골랐는데 all-core boost 는 훨씬 낮음. 실 워크로드에 가까운 벤치 보기.</li>
          <li><strong>P-state / governor</strong> — Linux 의 <code>cpupower frequency-set -g performance</code> 안 켜면 idle 시 클럭 떨어져 latency 변동. 검증자 / RPC 는 항상 performance.</li>
          <li><strong>SMT (Hyper-Threading)</strong> — 워크로드별. 검증자 / Filecoin PC1 은 OFF 가 빠른 경우 있음 (캐시 경쟁). 측정 후 결정.</li>
          <li><strong>NUMA-unaware 코드</strong> — JVM / Node.js 는 NUMA 안 봄. 단일 소켓 서버가 단순.</li>
        </ul>
      </div>
    </section>
  );
}
