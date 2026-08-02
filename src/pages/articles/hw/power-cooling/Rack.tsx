import { motion } from 'framer-motion';

const racks = [
  { size: '1U (44mm)', gpu: '블로워 로프로만', power: '~1000W', use: '경량 서버, 네트워크 장비' },
  { size: '2U (88mm)', gpu: '저프로파일 GPU 가능', power: '~2000W', use: 'GPU 서버 (2장)' },
  { size: '4U (176mm)', gpu: '풀사이즈 GPU 장착', power: '~3000-5000W', use: 'GPU 서버 (4~8장)' },
];

const infra = [
  { item: 'PDU', desc: '전원 분배 장치 — 랙 내 서버에 전력 분배, 전력 모니터링' },
  { item: 'UPS', desc: '무정전 전원 — 정전 시 안전 종료 시간 확보 (5~30분)' },
  { item: '이중 전원', desc: 'Redundant PSU — 1개 고장 시 나머지가 전체 부하 담당' },
];

export default function Rack() {
  return (
    <section id="rack" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">랙마운트: 1U/2U/4U, 전력 분배</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          랙 크기는 장착 가능한 GPU와 냉각 방식을 결정합니다.<br />
          4U 서버가 풀사이즈 GPU 8장 탑재의 사실상 유일한 선택지입니다.
        </p>
        <div className="overflow-x-auto not-prose mb-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['랙 크기', 'GPU', '전력', '용도'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {racks.map((r) => (
                <motion.tr key={r.size} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.size}</td>
                  <td className="border border-border px-3 py-2">{r.gpu}</td>
                  <td className="border border-border px-3 py-2">{r.power}</td>
                  <td className="border border-border px-3 py-2">{r.use}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">전력 인프라</h3>
        <ul className="space-y-1 text-sm">
          {infra.map((it) => (
            <li key={it.item}><strong>{it.item}</strong> — {it.desc}</li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">19-inch Rack 표준</h3>
        <ul className="leading-7">
          <li>폭 19 inch</li>
          <li>높이 N × U (1U = 1.75")</li>
          <li>일반 — 42U, 48U, 52U</li>
          <li>EIA-310 표준</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">서버 높이별 특성</h3>
        <ul className="leading-7">
          <li><strong>1U (44mm)</strong> — $3K~$10K. 최대 1~2 GPU. dense compute. 풀사이즈 GPU 불가. DGX 같은 시스템은 커스텀.</li>
          <li><strong>2U (88mm)</strong> — $10K~$30K. 2~4 GPU. 더 나은 냉각, 스토리지 서버. 예 Supermicro 2124GQ.</li>
          <li><strong>4U (176mm)</strong> — $20K~$50K+. 4~10 GPU. 풀사이즈 GPU 지원, GPU 최고 밀도. 예 Supermicro 4124GO.</li>
          <li><strong>5U/7U</strong> — 특수 용도. 최대 GPU 밀도, 커스텀 구성.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">PDU 종류</h3>
        <ul className="leading-7">
          <li><strong>Basic</strong> — 단순 outlet, 모니터링 없음. $200~$500.</li>
          <li><strong>Metered</strong> — outlet 레벨 측정, 원격 모니터링. rack 당 $1K~$3K.</li>
          <li><strong>Switched</strong> — outlet 별 원격 on/off, 전원 cycling. rack 당 $2K~$5K.</li>
          <li><strong>Smart/Monitored</strong> — 환경 센서, 알림, DCIM 통합. rack 당 $3K~$10K.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">UPS 종류</h3>
        <ul className="leading-7">
          <li><strong>Offline</strong> — 정전 시 전환, 짧은 transient. 가정/소규모 사무실.</li>
          <li><strong>Line-Interactive</strong> — 전압 regulation. offline 보다 우수, 중소기업.</li>
          <li><strong>Online (Double Conversion)</strong> — 항상 inverter 출력, transfer time 0. 데이터센터 표준, 고가.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">UPS 사이징</h3>
        <ul className="leading-7">
          <li>runtime 5~30 분 — 안전 종료 또는 generator 시동까지</li>
          <li>80% load factor</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Generator 백업</h3>
        <ul className="leading-7">
          <li>디젤 또는 천연가스</li>
          <li>30 초~2 분 시동</li>
          <li>며칠간 runtime</li>
          <li>Tier III/IV 데이터센터</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Tier 분류와 SLA</h3>
        <ul className="leading-7">
          <li>Tier I — 99.671% (연간 28h downtime)</li>
          <li>Tier II — 99.749% (22h), redundant component</li>
          <li>Tier III — 99.982% (1.6h), concurrently maintainable</li>
          <li>Tier IV — 99.995% (26min), fault tolerant</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">블록체인 SP colocation</h3>
        <ul className="leading-7">
          <li>Tier III 일반</li>
          <li>$100~$300/month per 1U</li>
          <li>$1,000+/month per rack</li>
          <li>전력비 별도</li>
          <li>대역폭 포함 여부 상이</li>
        </ul>
        <p className="leading-7">
          Rack: <strong>1U (dense) → 2U (balanced) → 4U (GPU density)</strong>.<br />
          Power: PDU (metered/switched) + UPS (online) + generator.<br />
          Tier III colo $1K+/rack/month (Filecoin SP 표준).
        </p>
      </div>
    </section>
  );
}
