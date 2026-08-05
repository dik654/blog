import WorkflowViz from './viz/SpWorkflowViz';

export default function SpWorkflow() {
  return (
    <section id="sp-workflow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">표준 워크플로우 — Storage Provider 부트스트랩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          새 Filecoin SP 를 처음부터 운영 진입까지의 표준 절차.
          <br />
          물리 인프라 (디스크 · GPU · 네트워크) 와 소프트웨어 (Lotus daemon · miner · sealing 워커) 셋업이 동시 진행되는 영역.
        </p>
      </div>
      <WorkflowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">단계 1 — 인프라 사이징 (capacity 목표 → 하드웨어)</h3>
        <ul className="leading-7">
          <li><strong>Capacity 목표 결정</strong> — 100 TB · 1 PB · 10 PB 단위. 작은 SP 부터 시작 권장.</li>
          <li><strong>HDD 풀</strong> — 18~22 TB enterprise SAS / SATA. ZFS RAIDZ2 권장.</li>
          <li><strong>Sealing 워커</strong> — CPU 64+ 코어 · NVMe 3.84 TB+ · RAM 256 GB.</li>
          <li><strong>GPU 풀</strong> — A100 80GB 또는 H100 (C2 메모리 핵심). RTX 4090 도 가능 (시간 ~3x).</li>
          <li><strong>네트워크</strong> — 워커 ↔ GPU 노드 10 GbE+, 인터넷 1 Gbps+ 대칭.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 2 — Lotus daemon 시작 (체인 sync)</h3>
        <ul className="leading-7">
          <li><code>lotus daemon</code> — chain sync (~수 시간 ~ 1 일). snapshot import 로 단축 가능.</li>
          <li><code>--config</code> 에 chainstore 위치 (대용량 SSD 권장), API endpoint, p2p 설정.</li>
          <li>지속 모니터링 — <code>lotus sync status</code>, head 가 글로벌 head 와 일치할 때까지.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 3 — Miner address 등록 (chain 에 SP 등록)</h3>
        <ul className="leading-7">
          <li>FIL 충전 — owner 주소에 minimum collateral. miner 등록 + 첫 sector pre-commit 비용.</li>
          <li><code>lotus-miner init</code> — owner / worker 주소, sector size (32 GiB · 64 GiB) 결정.</li>
          <li>sector size — 작은 32 GiB 가 빠른 sealing, 큰 64 GiB 가 더 효율적 ROI. 한 번 결정하면 변경 불가.</li>
          <li>chain 에 등록 트랜잭션 broadcast → confirmation 대기.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 4 — Storage 등록 (sealing scratch + permanent)</h3>
        <ul className="leading-7">
          <li><code>lotus-miner storage attach --init --seal /mnt/nvme</code> — sealing scratch 영역 등록.</li>
          <li><code>lotus-miner storage attach --init --store /mnt/hdd</code> — 영구 보관소 등록.</li>
          <li><code>~/.lotusminer/storage.json</code> 에 weight · max-storage 같은 정책.</li>
          <li>여러 storage 풀 가능 — 다른 가속기 / 다른 backup 체계.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 5 — Sealing 워커 분리 배치</h3>
        <ul className="leading-7">
          <li><code>lotus-worker run</code> — sealing 작업 위임. 한 노드에서 PC1/PC2/C2 모두 가능하지만 큰 SP 는 분리.</li>
          <li>워커 종류 명시 — <code>--addpiece --precommit1 --precommit2 --commit</code>.</li>
          <li>비율 — PC1 워커 4 대 : GPU 워커 1 대 (PC1 5 시간, PC2+C2 ~1.5 시간 기준).</li>
          <li>네트워크 — 워커 간 sealed sector 전송 가능해야. 10 GbE 직결 권장.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 6 — CC sector 첫 봉인 (storage power 확보)</h3>
        <ul className="leading-7">
          <li><code>lotus-miner sectors pledge</code> — CC (Committed Capacity) sector 봉인 시작.</li>
          <li>5~8 시간 후 sealing 완료 → chain 에 commit → storage power 등록.</li>
          <li>Block reward 이 storage power 비례 — 첫 봉인이 chain 등록되면 election 참여 시작.</li>
          <li>Sealing 모니터링 — <code>lotus-miner sealing jobs</code>.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 7 — PoSt GPU 풀 셋업 (WindowPoSt 마감 보장)</h3>
        <ul className="leading-7">
          <li>PoSt 전용 GPU 풀 — sealing GPU 와 분리 권장 (큰 SP). 작은 SP 면 공유.</li>
          <li>WindowPoSt 마감 — 24 시간 / 48 partition. 한 partition ~30 분 안에 처리.</li>
          <li><code>lotus-miner proving deadlines</code> — 다음 마감 시각 추적.</li>
          <li>GPU SLA 99.9%+ — fault penalty 가 큼. cache 디스크 RAID 보호.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 8 — 모니터링 + 알람</h3>
        <ul className="leading-7">
          <li>Prometheus + Grafana — Lotus + lotus-miner 의 <code>/metrics</code>.</li>
          <li>핵심 지표 — sealing throughput, WindowPoSt 성공률, GPU 사용률, SSD wear, HDD 가용성.</li>
          <li>알람 — sealing fault, partition 마감 임박, GPU 큐 적체, SSD wear 80%, chain head 격차.</li>
          <li>외부 — filfox.info / spacegap.io 같은 explorer 에서 본인 miner status 추적.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 9 — 백업 + 키 관리</h3>
        <ul className="leading-7">
          <li>Owner 키 — 하드웨어 월렛 + 콜드 보관. 잃으면 miner 영구 잠김.</li>
          <li>Worker 키 — 일상 운영용, miner 노드의 lotus-miner repo. 별도 백업.</li>
          <li>BLS / Secp256k1 키 — JSON-RPC <code>lotus wallet export</code> + 암호화 백업.</li>
          <li>Sealed sector cache — RAID 보호. 손실 시 PoSt fault.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 10 — Deal 영업 (수익 다양화)</h3>
        <ul className="leading-7">
          <li>CC 만 운영하면 deal 수익 0 — block reward 만.</li>
          <li>Deal 등록 — Lotus market 또는 보내는 client 와 직접 협상.</li>
          <li>Filecoin Plus 인증 dataset — storage power 10x 증폭, 영업 가치 ↑.</li>
          <li>Snap deal — CC sector 를 deal sector 로 빠르게 변환 (재 sealing 안 함). 큰 SP 의 표준.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 11 — 정기 운영 + Network upgrade 대응</h3>
        <ul className="leading-7">
          <li>분기별 — Lotus 신 버전 업그레이드 (network version). 누락 시 모든 PoSt fault.</li>
          <li>월별 — SSD wear 점검, HDD scrub, GPU 풀 healthy.</li>
          <li>주간 — sealing throughput, WindowPoSt 성공률 리포트.</li>
          <li>일간 — fault 알람, deal pipeline.</li>
        </ul>
      </div>
    </section>
  );
}
