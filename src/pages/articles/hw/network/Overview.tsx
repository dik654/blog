import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 서버 네트워크가 다른가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 네트워크: <strong>10G/25G/100G Ethernet, RDMA, InfiniBand</strong>.<br />
          블록체인 노드 vs GPU 클러스터 요구사항 근본적 차이.<br />
          latency + throughput + CPU offload 3축.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">워크로드별 특성</h3>
        <ul className="leading-7">
          <li><strong>Blockchain Node</strong> — 블록 전파 ~100 KB, TX gossip ~1 KB, peer sync 주기적 burst. 10G Ethernet 충분, 낮은 latency 가 도움.</li>
          <li><strong>Database Server</strong> — client query varied, replication steady, backup 주기적 대용량. 25G Ethernet 일반적.</li>
          <li><strong>Distributed Storage (Filecoin)</strong> — 데이터 업로드 GB~TB burst, retrieval streaming, deal negotiation 소규모. 25~100G Ethernet 이상적.</li>
          <li><strong>GPU Cluster (AI)</strong> — all-reduce 학습 대규모, parameter sync 연속, 대형 모델 배포. InfiniBand 400G 필수, chassis 내부 NVLink.</li>
          <li><strong>HPC Cluster</strong> — tight coupling, latency 결정적, MPI collectives. InfiniBand 표준.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">레이턴시 요구치</h3>
        <ul className="leading-7">
          <li>bulk transfer — 1~10 ms 수용</li>
          <li>database — &lt;1 ms 목표</li>
          <li>distributed DB — &lt;100 μs</li>
          <li>HPC/AI — &lt;10 μs</li>
          <li>trading — &lt;1 μs (특수 영역)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">네트워크 토폴로지</h3>
        <ul className="leading-7">
          <li><strong>Spine-Leaf (표준)</strong> — Leaf = TOR (Top of Rack), Spine = inter-rack. East-West 트래픽 최적화. 이상적 non-blocking, 보통 3:1 oversubscription.</li>
          <li><strong>Fat Tree</strong> — 계층형, 다중 path, HPC/AI 표준. equal-cost multipath.</li>
          <li><strong>Dragonfly</strong> — HPC 최적화, 짧은 diameter, 특수 용도.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 지표</h3>
        <ul className="leading-7">
          <li>bandwidth — 초당 bit</li>
          <li>throughput — 실효 payload</li>
          <li>latency — RTT 또는 one-way</li>
          <li>jitter — 변동성</li>
          <li>packet loss — 에러율</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">NIC 제품군</h3>
        <ul className="leading-7">
          <li>Mellanox ConnectX-6/7 (NVIDIA 인수)</li>
          <li>Intel E810, X710</li>
          <li>Broadcom NetXtreme</li>
          <li>Chelsio T6</li>
          <li>SmartNIC / DPU — BlueField, IPU</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">DPU (Data Processing Unit)</h3>
        <p className="leading-7">
          프로그래머블 NIC. VPN, 암호화, 스토리지 처리를 NIC 위에서 offload. 보드 위 ARM 코어로 데이터센터 가속.
        </p>
        <p className="leading-7">
          Network: <strong>workload-dependent (10G → 400G)</strong>.<br />
          blockchain: 10G OK, AI cluster: InfiniBand 400G 필수.<br />
          spine-leaf topology, Mellanox ConnectX primary.
        </p>
      </div>
    </section>
  );
}
