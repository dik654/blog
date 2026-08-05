import StorageTiersViz from './viz/StorageTiersViz';

export default function SsdAndStorage() {
  return (
    <section id="ssd-storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2. SSD 마모와 스토리지 계층 — write 양과 풀 설계</h2>
      <StorageTiersViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Filecoin sealing 의 자원 패턴 중 운영자가 가장 자주 놓치는 게 <strong>SSD 의 write endurance</strong>다.
          <br />
          한 sector 봉인이 ~512 GiB SSD write 를 만들고, 큰 SP 는 일 100+ sector 를 봉인한다. 즉 일 50 TiB+ write 가 한 SSD 풀에 가해진다.
          <br />
          컨슈머 SSD (TBW 1~3 PB) 는 1~2 개월에 보증이 끝난다. 엔터프라이즈 NVMe (TBW 10~20 PB) 가 사실상 의무다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-1. Sealing scratch SSD 의 write 양 산정</h3>
        <ul className="leading-7">
          <li><strong>한 sector PC1 write</strong> — ~512 GiB (11 layer × 32 GiB ≈ 352 GiB + cache 와 임시 ≈ 총 500 GiB).</li>
          <li><strong>일 throughput (예시)</strong> — sealing 워커 5 대 × 일 sector 4 = 20 sector → 일 ~10 TiB write.</li>
          <li><strong>큰 SP (1 PB capacity 목표)</strong> — 일 100 sector 봉인 = 일 50 TiB write. 월 1.5 PB write.</li>
          <li><strong>컨슈머 SSD 수명 계산</strong> — Samsung 990 Pro 4TB = TBW 2.4 PB. 일 50 TiB write 면 약 47 일에 보증 종료.</li>
          <li><strong>엔터프라이즈 NVMe</strong> — Intel D7-P5510 7.68 TB = TBW 14 PB. 같은 부하에 약 280 일. 게다가 PLP (전원 손실 보호) 로 정전 시 데이터 corrupt 안 됨.</li>
          <li><strong>기준</strong> — 운영 비용을 SSD 교체 주기 + 정전 시 데이터 손실 risk 로 환산하면 엔터프라이즈가 압도적 ROI.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-2. 스토리지 계층 — Hot · Warm · Cold</h3>
        <p className="leading-7">
          한 sector 의 데이터 lifecycle 은 SSD scratch → HDD sealed → cold archive 의 3 계층으로 흐른다.
        </p>
        <ul className="leading-7">
          <li><strong>Hot — Sealing scratch (NVMe)</strong> — PC1 의 11 layer + 임시 cache. sealing 끝나면 즉시 폐기, 다음 sector 가 재사용. 용량은 동시 sealing slot × ~600 GB.</li>
          <li><strong>Warm — Sealed sector cache (SAS/SATA SSD 또는 NVMe)</strong> — sealed sector 의 Merkle tree cache (~10 GB/sector). PoSt 시 빠른 random read 필요. SP 가 자주 잘못 설계하는 영역.</li>
          <li><strong>Cold — Sealed sector data (HDD JBOD 또는 분산 FS)</strong> — 32 GiB sector 본체. 영구 보관. 가장 큰 비용 영역. 18 TB / 22 TB / 24 TB HDD 가 표준.</li>
          <li><strong>분산 FS 선택</strong> — Ceph, Lustre, BeeGFS, GlusterFS. SP 규모와 운영 인력에 따라. 단순 JBOD + 운영 스크립트로 시작하는 SP 도 많음.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-3. ZFS / RAID 패턴</h3>
        <ul className="leading-7">
          <li><strong>Sealing scratch</strong> — RAID0 (stripe) 또는 LVM 단순 stripe. 용량 + IOPS 가 핵심, 데이터 잃어도 다시 sealing 가능 (sector 만 잃음). 실수 안 하면 RAID 안 써도 됨 — 단일 NVMe 도 OK.</li>
          <li><strong>Sealed sector data</strong> — ZFS RAIDZ2 (parity 2) 가 표준. 일반 18 TB HDD 의 unrecoverable error rate 고려하면 RAID5 (parity 1) 는 rebuild 중 추가 fail 위험. RAIDZ3 도 검토.</li>
          <li><strong>ZFS 옵션</strong> — <code>compression=off</code> (sealed sector 는 random 같음, 압축 효과 0), <code>recordsize=1M</code> (큰 파일 sequential), <code>atime=off</code>, <code>xattr=sa</code>.</li>
          <li><strong>Bit rot 방어</strong> — ZFS 의 self-healing checksum 이 매월 scrub 으로 silent corruption 잡음. HDD 풀의 운영 표준.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-4. Sealed sector 손실 시 복구</h3>
        <ul className="leading-7">
          <li><strong>섹터 한 개 손실</strong> — RAIDZ 가 복구. Lotus 는 영향 없음 (데이터 silent corruption 아니면).</li>
          <li><strong>섹터 데이터는 살아 있는데 cache 손실</strong> — <code>lotus-miner sectors recover</code> 로 cache 재생성. PoSt 가능.</li>
          <li><strong>섹터 자체 영구 손실</strong> — <code>SectorTerminate</code> 로 chain 에 알림. 페널티 (sector type 의 ~30 일 보상) 발생. 그 sector 의 deal 도 종료.</li>
          <li><strong>WindowPoSt 마감 임박 + 섹터 복구 안 됨</strong> — fault 선언 (<code>DeclareFault</code>) 로 일시 페널티, 추후 복구 시 fault recovery. 적시 선언이 핵심.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-5. Lotus 의 데이터 흐름 명령어</h3>
        <ul className="leading-7">
          <li><code>lotus-miner sectors list</code> — 모든 sector 와 상태 (Proving · Sealing · Faulty).</li>
          <li><code>lotus-miner storage list</code> — 등록된 storage (sealing scratch, sealed) 와 사용량.</li>
          <li><code>lotus-miner storage attach --init --seal</code> — 새 SSD 풀을 sealing 워크로드에 등록.</li>
          <li><code>lotus-miner storage attach --init --store</code> — HDD 풀을 sealed sector 영구 저장소로 등록.</li>
          <li><code>lotus-miner sealing jobs</code> — 현재 sealing 큐와 워커별 부하.</li>
          <li><code>lotus-miner proving deadlines</code> — 다음 WindowPoSt 마감 시각 + 영향 sector 수.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-6. 데이터 보관 비용 vs 수익 모델</h3>
        <p className="leading-7">
          SP 의 본질은 디스크 비용 + 전력 + 운영 인건비를 FIL 보상 (block reward + deal fee) 으로 회수하는 것. 운영 결정의 모든 trade-off 가 ROI 계산으로 귀결.
        </p>
        <ul className="leading-7">
          <li><strong>Block reward</strong> — 전체 storage power 점유율에 비례. PB 단위 capacity 가 의미.</li>
          <li><strong>Deal fee</strong> — 고객 딜 (큰 데이터셋) 보관료. CC sector 만 운영하면 deal 수익 0.</li>
          <li><strong>Verifiable Deal</strong> — Filecoin Plus 인증된 데이터셋 딜은 storage power 가 10x 증폭. 실 deal 영업이 핵심.</li>
          <li><strong>비용 결정 요인</strong> — 디스크 (HDD $/TB) + 전력 (sealing 시 GPU 가 큰 요소) + 인건비 + 네트워크. 한국 SP 는 전력비가 상대적으로 비싸 GPU 운영비 부담.</li>
          <li><strong>한국 SP 운영자 케이스</strong> — Filecoin foundation 의 KR 영업 + deal pipeline + 전력 단가 협상이 ROI 를 가르는 3 축.</li>
        </ul>
      </div>
    </section>
  );
}
