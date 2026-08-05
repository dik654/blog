export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 — 백업 + RAID 의 운영 결정 (비용 · 속도 · 크기)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          백업과 RAID 결정은 <strong>비용 · 속도 · 크기</strong> 의 3 축 trade-off 다.
          <br />
          한 번 정착하면 운영 비용이 매월 누적되므로 처음 설계가 ROI 의 70%.
        </p>
        <p className="leading-7">
          핵심 명제 4 가지로 정리:
        </p>
        <ol className="leading-7">
          <li><strong>RAID ≠ backup</strong> — RAID 는 디스크 fault tolerance, backup 은 시점 사본. 실수 삭제 / ransomware 는 RAID 로 못 막음.</li>
          <li><strong>RAID5 의 시대 종료</strong> — 18 TB+ HDD 의 URE (Unrecoverable Error Rate, 10^14 bit) 고려하면 rebuild 중 추가 fail 위험. RAID6 / Z2 가 표준.</li>
          <li><strong>3-2-1 규칙</strong> — 3 copies (production + local + offsite), 2 종류 media, 1 offsite. 외운다.</li>
          <li><strong>RTO / RPO</strong> — Recovery Time Objective (얼마나 빨리 복구) · Recovery Point Objective (얼마나 옛 데이터 OK). 이 둘이 비용을 결정.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>RAID 레벨 비교</strong> — 0 / 1 / 5 / 6 / Z2 / Z3 / 10 / erasure coding 의 capacity · 내구성 · 용도</li>
          <li><strong>3-2-1 백업 규칙 + 도구</strong> — restic · borg · ZFS send/recv · Velero · S3 Glacier</li>
          <li><strong>비용 모델</strong> — production HDD · NAS · 클라우드 의 $ / TB / month</li>
          <li><strong>속도 (RTO/RPO)</strong> — 매시간 / 매일 / 매주 의 비용 곡선과 사고 영향</li>
          <li><strong>실전 운영 시나리오</strong> — 검증자 · Filecoin SP · K8s 클러스터 · DB 의 백업 설계</li>
        </ol>
      </div>
    </section>
  );
}
