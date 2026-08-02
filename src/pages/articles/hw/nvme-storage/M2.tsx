import { motion } from 'framer-motion';

const specs = [
  { attr: '크기', val: '22mm x 80mm (2280)' },
  { attr: '인터페이스', val: 'PCIe 4.0 x4 (최대 5.0 x4)' },
  { attr: '최대 순차 읽기', val: '~7 GB/s (PCIe 4.0)' },
  { attr: '전력', val: '~5-8W' },
  { attr: '내구성', val: '~0.3-1 DWPD (컨슈머)' },
  { attr: '히트싱크', val: '메인보드 부착 또는 별도 구매' },
];

export default function M2() {
  return (
    <section id="m2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">M.2: 컨슈머 표준 (2280, 히트싱크)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          M.2 2280은 가장 보편적인 NVMe 폼팩터입니다.<br />
          작은 기판에 컨트롤러와 NAND가 밀집되어 발열 관리가 중요합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">속성</th>
                <th className="border border-border px-3 py-2 text-left">M.2 2280</th>
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <motion.tr key={s.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{s.attr}</td>
                  <td className="border border-border px-3 py-2">{s.val}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">물리 스펙</h3>
        <ul className="leading-7">
          <li>PCB 보드 (enclosure 없음)</li>
          <li>Key M (PCIe x4)</li>
          <li>표준 길이 2280 (22×80mm), 그 외 2230, 2242, 2260, 22110</li>
          <li>single-sided 또는 double-sided NAND</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">발열 문제</h3>
        <ul className="leading-7">
          <li>표면적 작음</li>
          <li>컨트롤러 80°C+ 열 발생</li>
          <li>NAND 70°C</li>
          <li>지속 쓰기 시 throttle</li>
          <li>burst 성능은 양호</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">냉각 방안</h3>
        <ul className="leading-7">
          <li>메인보드 부착 히트싱크 (가장 일반적)</li>
          <li>aftermarket 히트싱크 ($10~$50)</li>
          <li>active fan (드뭅니다)</li>
          <li>thermal pad 가 결정적</li>
          <li>케이스 airflow 중요</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2024 인기 모델</h3>
        <ul className="leading-7">
          <li><strong>Consumer</strong> — Samsung 990 Pro $100/TB, WD SN850X $95/TB, Crucial T700 $110/TB, Sabrent Rocket 5 $120/TB.</li>
          <li><strong>Enterprise</strong> — Samsung PM9A3 $180/TB, Micron 7450 PRO $170/TB, Solidigm P44 Pro $200/TB. DWPD 1~3.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">적합한 용도</h3>
        <ul className="leading-7">
          <li>적합 — 데스크톱 OS 드라이브, 노트북 스토리지, 워크스테이션 scratch, 게이밍 빠른 로딩.</li>
          <li>부적합 — 24/7 서버 sealing (thermal), 높은 DWPD 요구, hot-swap 필요.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능</h3>
        <ul className="leading-7">
          <li>순차 read — 7000 MB/s</li>
          <li>순차 write — 6800 MB/s</li>
          <li>random read (4K QD32) — 1.4M IOPS</li>
          <li>random write — 1.3M IOPS</li>
          <li>read latency — 20~40 μs</li>
          <li>write latency — 15~30 μs</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">지속 성능</h3>
        <p className="leading-7">
          burst 30 초간 풀스피드 → SLC cache 가 차면 TLC 속도 (~1.5 GB/s) 로 하락합니다. QLC 는 ~500 MB/s 까지 떨어집니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">폼팩터 사이즈</h3>
        <ul className="leading-7">
          <li>2230 — 22×30mm (Steam Deck, 노트북)</li>
          <li>2242 — 22×42mm (노트북)</li>
          <li>2260 — 22×60mm (드뭅니다)</li>
          <li>2280 — 22×80mm (표준)</li>
          <li>22110 — 22×110mm (엔터프라이즈)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">전력 상태</h3>
        <ul className="leading-7">
          <li>L0 — active, full power (~8W)</li>
          <li>L0s — idle (~2W)</li>
          <li>L1 — deeper idle (~0.5W)</li>
          <li>L1.2 — power saving (~5mW)</li>
          <li>APST — automatic 전환</li>
        </ul>
        <p className="leading-7">
          M.2: <strong>PCB form factor, thermal challenges, consumer-focused</strong>.<br />
          $80-200/TB, 7 GB/s burst, 1.5 GB/s sustained.<br />
          desktop/laptop primary, server 24/7 비적합.
        </p>
      </div>
    </section>
  );
}
