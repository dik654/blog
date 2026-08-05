import { motion } from 'framer-motion';

const metrics = [
  { metric: 'DWPD', desc: 'Drive Writes Per Day — 하루에 전체 용량을 몇 번 쓸 수 있는지', example: '3 DWPD × 3.84TB = 하루 11.5TB 쓰기' },
  { metric: 'PLP', desc: 'Power Loss Protection — 전력 손실 시 캐시 데이터를 NAND에 기록', example: '커패시터 백업으로 ~10ms 데이터 보호' },
  { metric: 'OP', desc: 'Over Provisioning — 여분 NAND로 수명·성능 유지', example: '엔터프라이즈: 28% OP (컨슈머: 7%)' },
];

export default function Enterprise() {
  return (
    <section id="enterprise" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">엔터프라이즈 SSD: 내구성(DWPD), 전력 손실 보호</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          엔터프라이즈 SSD는 컨슈머 대비 3~10배 높은 쓰기 내구성을 제공합니다.<br />
          DWPD, PLP, OP는 서버 SSD 선택의 핵심 지표입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['지표', '설명', '예시'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <motion.tr key={m.metric} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{m.metric}</td>
                  <td className="border border-border px-3 py-2">{m.desc}</td>
                  <td className="border border-border px-3 py-2">{m.example}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">DWPD 계산</h3>
        <p className="leading-7">
          total_writes_per_day = DWPD × capacity × warranty_years × 365
        </p>
        <p className="leading-7">
          예시 — 3 DWPD × 1.92 TB × 5 년 = 10,512 TB = 10.5 PB lifetime writes.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">DWPD 등급별 워크로드</h3>
        <ul className="leading-7">
          <li><strong>0.3 DWPD (consumer)</strong> — 1 TB × 0.3 × 3 년 = 330 TB.</li>
          <li><strong>1 DWPD (read-intensive)</strong> — 일반 엔터프라이즈, DB, VM.</li>
          <li><strong>3 DWPD (mixed-use)</strong> — 파일 서버, 캐싱.</li>
          <li><strong>10 DWPD (write-intensive)</strong> — 트랜잭션 DB, heavy logging, Filecoin PC1 sealing.</li>
          <li><strong>25+ DWPD (ultra-endurance)</strong> — Optane P5800X, 특수 워크로드.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">NAND flash 내구성</h3>
        <ul className="leading-7">
          <li>SLC — 100K P/E cycle</li>
          <li>MLC — 10K P/E cycle</li>
          <li>TLC — 1~3K P/E cycle</li>
          <li>QLC — 500~1K P/E cycle</li>
          <li>over-provisioning 으로 수명 연장</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">PLP 가 필요한 이유</h3>
        <p className="leading-7">
          SSD 의 DRAM cache 에 write 가 ack 된 직후 정전이 일어나면 cache 데이터 손실 → transaction 손상. PLP 가 이 윈도를 봉쇄.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PLP 구현</h3>
        <ul className="leading-7">
          <li>PCB 위 대형 탄탈럼 커패시터</li>
          <li>5~15ms 전력 예비</li>
          <li>cache 를 NAND 로 flush 시간 확보</li>
          <li>데이터 durability 보장</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">제조사별 PLP 명칭</h3>
        <ul className="leading-7">
          <li>Intel/Solidigm — Power Loss Imminent (PLI)</li>
          <li>Samsung — Backup Power Module</li>
          <li>Kioxia — Power Loss Data Protection</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Consumer vs Enterprise PLP</h3>
        <ul className="leading-7">
          <li><strong>Consumer</strong> — 보통 PLP 없음. 파일시스템 저널 의존, 정전 시 손상 위험.</li>
          <li><strong>Enterprise</strong> — full PLP 표준, 검증된 신뢰성. DB / 파일시스템에 결정적.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Over-Provisioning (OP)</h3>
        <ul className="leading-7">
          <li><strong>Consumer 7% OP</strong> — 1.024 TB raw → 1 TB usable. 기본 wear leveling.</li>
          <li><strong>Enterprise 28% OP</strong> — 1.92 TB raw → 1.5 TB usable. 향상된 성능, 지속 쓰기 개선, 더 긴 수명.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">OP 의 효과</h3>
        <ul className="leading-7">
          <li>wear leveling 용 spare block</li>
          <li>steady-state 성능</li>
          <li>garbage collection 효율</li>
          <li>수명 연장</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">엔터프라이즈 추가 기능</h3>
        <ul className="leading-7">
          <li>End-to-End Data Protection (T10-PI)</li>
          <li>Self-Encrypting Drive (SED)</li>
          <li>FIPS 140-2 인증</li>
          <li>multi-path I/O (dual-port SAS)</li>
          <li>namespace (multi-tenant)</li>
          <li>SMART 모니터링</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 SSD 선택 — Filecoin PC1 cache</h3>
        <ul className="leading-7">
          <li>sector 당 352 GiB 쓰기</li>
          <li>일 10~20 sector → 일 3.5~7 TB</li>
          <li>드라이브 — 3.84 TB, 3 DWPD</li>
          <li>수명 — 5년+</li>
          <li>선택 — Samsung PM1733 또는 동급</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 SSD 선택 — Reth DB</h3>
        <ul className="leading-7">
          <li>random I/O, write 부담 적음</li>
          <li>1 DWPD 충분</li>
          <li>IOPS 가 중요</li>
          <li>$200~$300/TB 수준 적합</li>
        </ul>
        <p className="leading-7">
          Enterprise SSD: <strong>DWPD 3-10x consumer, PLP capacitors, 28% OP</strong>.<br />
          lifetime writes: 10+ PB, 5년 warranty.<br />
          T10-PI, SED, FIPS 등 enterprise features.
        </p>
      </div>
    </section>
  );
}
