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

        <h3 className="text-xl font-semibold mt-6 mb-3">Rack &amp; Power Distribution 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Rack Form Factors:

// 19-inch Rack Standard:
// - width: 19 inches
// - height: N × U (1U = 1.75")
// - typical: 42U, 48U, 52U racks
// - standard EIA-310

// Server heights:
// 1U (44mm): ~$3-10K
// - 1-2 GPUs max
// - dense compute
// - no full-size GPUs
// - example: DGX systems are custom
//
// 2U (88mm): ~$10-30K
// - 2-4 GPUs
// - better cooling
// - storage servers
// - example: Supermicro 2124GQ
//
// 4U (176mm): ~$20-50K+
// - 4-10 GPUs possible
// - full-size GPU support
// - highest density for GPU
// - example: Supermicro 4124GO
//
// 5U/7U: specialized
// - max GPU density
// - custom configs

// Power Distribution Units (PDUs):
//
// Basic PDU:
// - just power outlets
// - no monitoring
// - cheap ($200-500)
//
// Metered PDU:
// - outlet-level metering
// - remote monitoring
// - $1K-3K per rack
//
// Switched PDU:
// - remote on/off per outlet
// - power cycling
// - $2K-5K per rack
//
// Smart/Monitored PDU:
// - environmental sensors
// - alerts
// - integration with DCIM
// - $3K-10K per rack

// UPS Systems:
//
// Offline UPS:
// - switches on power loss
// - small transient
// - home/small office
//
// Line-Interactive:
// - voltage regulation
// - better than offline
// - medium business
//
// Online (Double Conversion):
// - always runs from inverter
// - zero transfer time
// - datacenter standard
// - expensive

// UPS sizing:
// - runtime: 5-30 minutes
// - enough for safe shutdown
// - or generator startup
// - 80% load factor

// Generator backup:
// - diesel or natural gas
// - 30s-2min startup
// - days of runtime
// - datacenter tier III/IV

// Tier classifications:
// - Tier I: basic
// - Tier II: redundant components
// - Tier III: concurrently maintainable
// - Tier IV: fault tolerant
// - affects uptime SLA

// Uptime SLA:
// - Tier I: 99.671% (28h downtime)
// - Tier II: 99.749% (22h)
// - Tier III: 99.982% (1.6h)
// - Tier IV: 99.995% (26min)

// Blockchain SP colo:
// - Tier III typical
// - $100-300/month per 1U
// - $1000+ per month per rack
// - power costs separate
// - bandwidth included varies`}
        </pre>
        <p className="leading-7">
          Rack: <strong>1U (dense) → 2U (balanced) → 4U (GPU density)</strong>.<br />
          Power: PDU (metered/switched) + UPS (online) + generator.<br />
          Tier III colo $1K+/rack/month (Filecoin SP 표준).
        </p>
      </div>
    </section>
  );
}
