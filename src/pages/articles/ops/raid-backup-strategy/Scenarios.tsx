export default function Scenarios() {
  return (
    <section id="scenarios" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">4. 워크로드별 백업 + RAID 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">4-1. 이더리움 검증자 노드</h3>
        <ul className="leading-7">
          <li><strong>RAID</strong> — 사실상 불필요. EL/CL DB 는 fresh sync 가 빠름 (Reth ~수 시간). standby 노드가 더 가성비.</li>
          <li><strong>핵심 백업 대상</strong> — <code>slashing_protection.json</code> · keystore · withdrawal mnemonic.</li>
          <li><strong>도구</strong> — restic 으로 매일 cloud 암호화 백업. mnemonic 은 강철판 (Cryptosteel).</li>
          <li><strong>RTO / RPO</strong> — 슬래싱 보호 DB 는 RPO 0 필수 (옛 DB 로 복구 시 surround vote 위험). 항상 최신 만 유지.</li>
          <li><strong>비용</strong> — 데이터 작음 (~수 GB), 월 $1 미만.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-2. Filecoin Storage Provider</h3>
        <ul className="leading-7">
          <li><strong>Sealing scratch (NVMe)</strong> — RAID 불필요. 손실해도 sector 한 번 더 sealing. RAID0 검토 가능 (속도).</li>
          <li><strong>Sealed sector data (HDD)</strong> — <strong>RAIDZ2 표준</strong>. 한 sector 손실 = block reward 손실 + SectorTerminate 페널티.</li>
          <li><strong>Sealed cache (warm SSD)</strong> — RAIDZ1 또는 RAID10. PoSt 마감에 critical, 손실 시 fault.</li>
          <li><strong>Lotus chainstore</strong> — RAID 보다 snapshot import 가 빠름. 매일 ZFS snapshot.</li>
          <li><strong>키 백업</strong> — owner key cold storage (HW wallet), worker key 별 암호화 백업.</li>
          <li><strong>비용 모델</strong> — capacity 의 본업이라 백업 비용은 작음 (sealed sector 자체가 보관 대상).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-3. Kubernetes 클러스터</h3>
        <ul className="leading-7">
          <li><strong>etcd snapshot</strong> — 매시간 자동 + S3 외부 저장. <code>etcdctl snapshot save</code> + <code>etcd-backup</code> CronJob.</li>
          <li><strong>PVC backup</strong> — Velero + CSI snapshot. 클러스터 전체 manifest + 모든 PVC 한 번에.</li>
          <li><strong>secrets backup</strong> — sealed-secrets 또는 SOPS 로 git 에 암호화 저장. 클러스터 손실 시 git 복구.</li>
          <li><strong>RTO / RPO</strong> — 컨트롤 플레인 RTO 1 시간 + RPO 1 시간 (etcd snapshot 주기). 워커 노드 redundancy 로 RTO 0.</li>
          <li><strong>전체 클러스터 복구 시나리오</strong> — 새 etcd → manifest 복원 → PVC 복원 → 자동 reconcile. 3 시간 정도.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-4. Database (PostgreSQL · MySQL)</h3>
        <ul className="leading-7">
          <li><strong>storage</strong> — RAID10 (write 빠름) 또는 RAIDZ2 (capacity 효율).</li>
          <li><strong>WAL archiving</strong> — Postgres <code>archive_command</code> 으로 WAL 을 S3. PITR (Point-in-Time Recovery) 가능.</li>
          <li><strong>logical backup</strong> — <code>pg_dump</code> 매일. cross-version migration 에 유용.</li>
          <li><strong>physical backup</strong> — <code>pg_basebackup</code> + WAL chain. 큰 DB 의 빠른 복구.</li>
          <li><strong>streaming replication</strong> — RTO 0 + RPO 거의 0. read replica + failover 자동화.</li>
          <li><strong>RPO / RTO</strong> — production DB 는 보통 RPO 1 분 이하 + RTO 분~시간. WAL streaming 필수.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-5. AI 학습 클러스터</h3>
        <ul className="leading-7">
          <li><strong>학습 데이터셋 (수 TB ~ PB)</strong> — Ceph 또는 NAS RAIDZ2. read-heavy 라 cache (NVMe) 활용.</li>
          <li><strong>checkpoint</strong> — 주기적 (예: 매시간) 모델 weight save. cluster-local + cloud 백업 둘 다.</li>
          <li><strong>final model weight</strong> — Hugging Face / S3 영구 보관. immutable + version tag.</li>
          <li><strong>experiment metadata</strong> — wandb / mlflow + git lfs.</li>
          <li><strong>비용</strong> — 데이터셋 자체가 큼 → cold tier (Glacier Deep) 활용.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-6. 블로그 / 작은 SaaS</h3>
        <ul className="leading-7">
          <li><strong>storage</strong> — VPS 의 단일 SSD (provider 가 RAID 처리). 추가 RAID 불필요.</li>
          <li><strong>DB</strong> — managed Postgres + 자동 PITR (RDS / Cloud SQL). 또는 자가 + restic.</li>
          <li><strong>file uploads</strong> — S3 + 다른 region replication.</li>
          <li><strong>git repo</strong> — GitHub 자체가 backup 역할. 추가 미러 (codeberg) 검토.</li>
          <li><strong>비용</strong> — 월 $10~30. 큰 운영자에 비해 매우 작음.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">4-7. 사고 대응 플레이북</h3>
        <ol className="leading-7">
          <li><strong>0~5 분</strong> — 사고 종류 확인 (디스크 fail · ransomware · 실수 삭제 · 시설 사고). 지금 무엇이 살아 있는지 파악.</li>
          <li><strong>5~15 분</strong> — 가장 빠른 복구 경로 결정. RAID rebuild · standby 페일오버 · 가까운 backup 복원.</li>
          <li><strong>15~60 분</strong> — 복구 실행. checksum 검증. application 재기동.</li>
          <li><strong>1~24 시간</strong> — postmortem. 같은 사고 재발 방지 시스템 변경. backup 재검증.</li>
          <li><strong>주간</strong> — game day / 모의 사고. 플레이북이 작동하는지 정기 검증.</li>
        </ol>
      </div>
    </section>
  );
}
