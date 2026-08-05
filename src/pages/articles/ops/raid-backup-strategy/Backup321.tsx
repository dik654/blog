import BackupTiersViz from './viz/BackupTiersViz';

export default function Backup321() {
  return (
    <section id="backup-321" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2. 3-2-1 백업 규칙 + 도구</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          업계 표준 — <strong>3 copies · 2 종류 media · 1 offsite</strong>.
          <br />
          이 규칙이 모든 데이터 사고 시나리오 (디스크 fail · 시설 사고 · ransomware · 실수 삭제) 를 커버.
        </p>
      </div>
      <BackupTiersViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">2-1. Snapshot vs Full vs Incremental</h3>
        <ul className="leading-7">
          <li><strong>Snapshot</strong> — copy-on-write 시점 이미지. ZFS · LVM · BTRFS · 클라우드 EBS. 매우 빠른 생성, 같은 풀에 종속.</li>
          <li><strong>Full backup</strong> — 모든 데이터 복사. 첫 backup 또는 주간 정책. 시간 ↑ 공간 ↑.</li>
          <li><strong>Incremental</strong> — 마지막 backup 이후 변경분만. 시간 ↓ 공간 ↓, 복원 시 chain 따라가야 (full + 모든 incremental).</li>
          <li><strong>Differential</strong> — 마지막 full 이후 변경분. full + differential 두 번만 적용 (incremental chain 안 따라감).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-2. 백업 도구별 비교</h3>
        <ul className="leading-7">
          <li><strong>restic</strong> — 암호화 + 중복 제거 + 압축. S3 / B2 / SFTP 직접 지원. Rust 같은 cross-platform Go. 표준 추천.</li>
          <li><strong>borg</strong> — 비슷한 기능. local backup 에 강함, network repo 도 지원. Python 기반.</li>
          <li><strong>ZFS send/recv</strong> — 같은 ZFS 풀끼리 incremental. 가장 빠름, 다른 파일시스템엔 못 옮김.</li>
          <li><strong>rsync + hardlink</strong> — 옛 표준. 단순하지만 중복 제거 X. 작은 규모.</li>
          <li><strong>Velero</strong> — Kubernetes 백업. PVC 스냅샷 + manifest backup. 클러스터 단위 DR.</li>
          <li><strong>Duplicati / Kopia</strong> — GUI 도구. 개인 NAS 에 적합.</li>
          <li><strong>Bareos / Bacula</strong> — 엔터프라이즈. 대규모 organization, tape 통합.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-3. Immutable Backup — Ransomware 방어</h3>
        <ul className="leading-7">
          <li><strong>Object Lock</strong> — S3 · B2 · MinIO 의 WORM (Write Once Read Many). 일정 기간 삭제 / 변경 불가.</li>
          <li><strong>append-only repo</strong> — restic / borg 의 append-only 모드. 백업 클라이언트가 침해돼도 옛 backup 못 지움.</li>
          <li><strong>Air-gap backup</strong> — tape 또는 분리된 디스크. 정기적으로 분리.</li>
          <li><strong>왜 중요</strong> — ransomware 가 production + backup 둘 다 암호화하는 사고가 표준. backup 자체 보호 필수.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-4. 검증 (test restore)</h3>
        <ul className="leading-7">
          <li><strong>가장 흔한 실수</strong> — 백업은 잘 돌아가는데 복원이 안 되는 케이스. 검증 안 하면 발견은 사고 시.</li>
          <li><strong>주간 자동 test restore</strong> — 별도 테스트 환경에서 backup 복원 → 무결성 체크.</li>
          <li><strong>분기 1 회 game day</strong> — 실제 production 시나리오 (DB 복원 · K8s cluster 복원) 모의.</li>
          <li><strong>checksum 검증</strong> — restic / borg 의 <code>check</code> 명령 자동 cron.</li>
        </ul>
      </div>
    </section>
  );
}
