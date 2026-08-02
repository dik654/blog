export default function CostModel() {
  return (
    <section id="cost-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3. 비용 · 속도 · 크기 — 실제 운영 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          백업 비용은 <strong>capacity (TB) × retention (days) × tier ($ / TB / month)</strong> 의 단순 곱셈 — 그러나 tier 선택이 10x 차이를 만든다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-1. tier 별 $ / TB / month</h3>
        <div className="overflow-x-auto not-prose my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Tier</th>
                <th className="border border-border px-3 py-2 text-left">대표</th>
                <th className="border border-border px-3 py-2 text-left">$ / TB / mo</th>
                <th className="border border-border px-3 py-2 text-left">access</th>
                <th className="border border-border px-3 py-2 text-left">egress</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2 font-medium">자가 NAS HDD</td><td className="border border-border px-3 py-2">TrueNAS · Synology</td><td className="border border-border px-3 py-2">$0.6 (감가)</td><td className="border border-border px-3 py-2">즉시</td><td className="border border-border px-3 py-2">0</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">자가 SSD</td><td className="border border-border px-3 py-2">consumer SSD</td><td className="border border-border px-3 py-2">$2 (감가)</td><td className="border border-border px-3 py-2">즉시</td><td className="border border-border px-3 py-2">0</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">B2 / Wasabi (hot)</td><td className="border border-border px-3 py-2">Backblaze · Wasabi</td><td className="border border-border px-3 py-2">$5~6</td><td className="border border-border px-3 py-2">즉시</td><td className="border border-border px-3 py-2">$0.01~0.04 / GB</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">S3 Standard</td><td className="border border-border px-3 py-2">AWS · GCP · Azure</td><td className="border border-border px-3 py-2">$23</td><td className="border border-border px-3 py-2">즉시</td><td className="border border-border px-3 py-2">$0.09 / GB</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">S3 IA / Nearline</td><td className="border border-border px-3 py-2">AWS · GCP</td><td className="border border-border px-3 py-2">$10</td><td className="border border-border px-3 py-2">즉시</td><td className="border border-border px-3 py-2">$0.01 / GB retrieval</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">S3 Glacier IR</td><td className="border border-border px-3 py-2">AWS</td><td className="border border-border px-3 py-2">$4</td><td className="border border-border px-3 py-2">milliseconds</td><td className="border border-border px-3 py-2">$0.03 / GB retrieval</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">S3 Glacier Deep</td><td className="border border-border px-3 py-2">AWS</td><td className="border border-border px-3 py-2">$1</td><td className="border border-border px-3 py-2">12 시간</td><td className="border border-border px-3 py-2">$0.02 / GB</td></tr>
              <tr><td className="border border-border px-3 py-2 font-medium">LTO tape (자가)</td><td className="border border-border px-3 py-2">LTO-9 18 TB</td><td className="border border-border px-3 py-2">$2 (감가)</td><td className="border border-border px-3 py-2">분~시간</td><td className="border border-border px-3 py-2">0</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-2. 사례 — 100 TB 데이터 1 년 백업</h3>
        <ul className="leading-7">
          <li><strong>모든 hot S3</strong> — 100 × $23 × 12 = $27,600/년. 즉시 access 가능. egress 시 추가.</li>
          <li><strong>S3 IA</strong> — 100 × $10 × 12 = $12,000/년. 거의 즉시.</li>
          <li><strong>Glacier Deep</strong> — 100 × $1 × 12 = $1,200/년. 복원 12 시간. 95% 비용 절감.</li>
          <li><strong>자가 NAS</strong> — HDD $300 × 8 (RAIDZ2 6+2) = $2,400 일회성. 전기 ~$200/년. 5 년 amortize 시 $680/년.</li>
          <li><strong>LTO tape</strong> — LTO-9 카트리지 $80 × 6 = $480 일회성. 드라이브 $4,000. 100 TB 한 번 들이면 5 년 운영.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-3. retention 정책 (GFS — Grandfather-Father-Son)</h3>
        <ul className="leading-7">
          <li><strong>Hourly</strong> — 24 회 (1 일 retention)</li>
          <li><strong>Daily</strong> — 7 회 (1 주 retention)</li>
          <li><strong>Weekly</strong> — 4 회 (1 달 retention)</li>
          <li><strong>Monthly</strong> — 12 회 (1 년 retention)</li>
          <li><strong>Yearly</strong> — N 년 (영구 보관)</li>
          <li><strong>실제 backup 수</strong> — ~50 시점 사본. restic / borg 의 중복 제거로 실제 디스크 사용은 변경분만.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-4. 속도 (RTO/RPO) 별 비용 곡선</h3>
        <ul className="leading-7">
          <li><strong>RTO 0 + RPO 0</strong> — synchronous replication (DRBD · Postgres streaming) · 비용 ~3x production. critical DB only.</li>
          <li><strong>RTO 분 + RPO 분</strong> — 매시간 incremental + warm standby. local NAS + 핫 클라우드.</li>
          <li><strong>RTO 시간 + RPO 시간</strong> — 매일 backup + cold cloud. 일반 운영.</li>
          <li><strong>RTO 일 + RPO 일</strong> — 주간 backup + Glacier Deep. archive.</li>
          <li><strong>비용 곡선</strong> — RTO/RPO 가 1 시간 → 1 분이면 비용 ~3x. 1 분 → 0 이면 또 ~3x. 10x 빠른 복구가 9x 비싼 비용.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">3-5. 압축 / 중복 제거 효과</h3>
        <ul className="leading-7">
          <li><strong>압축 비율</strong> — 텍스트 / 코드 ~5x · DB ~2x · 이미 압축된 데이터 (jpeg · video) 1x.</li>
          <li><strong>중복 제거</strong> — 시점 사본 사이 변경분만 저장 → 보통 95%+ 절약.</li>
          <li><strong>실제 100 TB 의 1 년 backup</strong> — 변경분 5% / 일 가정 → 100 TB + 5 TB × 50 시점 ≈ 350 TB raw, 압축 후 ~150 TB.</li>
          <li><strong>주의</strong> — 암호화된 데이터는 압축 X. 암호화 전 압축 + 후 암호화 (restic / borg 표준 동작).</li>
        </ul>
      </div>
    </section>
  );
}
