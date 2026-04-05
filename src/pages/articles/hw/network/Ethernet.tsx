import { motion } from 'framer-motion';

const rows = [
  { speed: '10 GbE', connector: 'SFP+ / Cat6a', use: '서버 기본', cost: '낮음' },
  { speed: '25 GbE', connector: 'SFP28', use: '데이터센터 표준', cost: '중간' },
  { speed: '40 GbE', connector: 'QSFP+', use: '레거시 백본', cost: '중간' },
  { speed: '100 GbE', connector: 'QSFP28', use: '스파인-리프 백본', cost: '높음' },
  { speed: '400 GbE', connector: 'QSFP-DD', use: '차세대 인터커넥트', cost: '매우 높음' },
];

export default function Ethernet() {
  return (
    <section id="ethernet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">10G/25G/100G 이더넷</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          데이터센터 이더넷은 스파인-리프 토폴로지로 구성됩니다.<br />
          25G가 서버 접속 계층, 100G가 백본 스위치 간 연결의 표준입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속도', '커넥터', '용도', '비용'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.speed} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.speed}</td>
                  <td className="border border-border px-3 py-2">{r.connector}</td>
                  <td className="border border-border px-3 py-2">{r.use}</td>
                  <td className="border border-border px-3 py-2">{r.cost}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Ethernet 세대 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ethernet 세대 progression:

// 1. 1 GbE (2000s standard):
// - RJ45 copper, Cat5e
// - consumer default
// - legacy server
// - being phased out

// 2. 10 GbE (server baseline):
// - SFP+ (fiber) or 10GBASE-T (copper)
// - ~$100-200 per port (2024)
// - server NIC standard
// - supports 30-50m copper, 10km+ fiber
// - mature ecosystem

// 3. 25 GbE (datacenter workhorse):
// - SFP28 connector
// - ~$200-400 per port
// - replacing 10 GbE at scale
// - single-lane 25 Gbps signaling
// - leaves room for 100G upgrade

// 4. 40 GbE (legacy datacenter):
// - QSFP+ connector
// - 4× 10 Gbps lanes
// - being replaced by 25/50/100 GbE
// - expensive per bit

// 5. 50 GbE:
// - 2× 25 Gbps lanes
// - emerging
// - for higher-bandwidth servers

// 6. 100 GbE (modern backbone):
// - QSFP28 connector
// - 4× 25 Gbps or 2× 50 Gbps
// - spine switches
// - storage arrays

// 7. 200 GbE / 400 GbE:
// - QSFP-DD, OSFP connectors
// - next-gen backbone
// - AI cluster interconnect
// - $2K-5K per port
// - 2024-2025 rollout

// 8. 800 GbE (emerging):
// - standard ratified 2024
// - ultra-high-bandwidth
// - AI training fabric
// - early adoption

// Connector types:
//
// SFP (Small Form-factor Pluggable):
// - 1G / 10G / 25G
// - hot-swappable
// - transceiver-based
// - fiber or copper
//
// QSFP (Quad SFP):
// - 40G / 100G
// - 4 parallel lanes
// - larger module
//
// QSFP-DD (Double Density):
// - 200G / 400G
// - 8 parallel lanes
// - highest per-port
//
// OSFP (Octal SFP):
// - 400G / 800G
// - for scale deployments
// - new form factor

// Optics types:
// - Direct Attach Copper (DAC): <5m, cheap
// - Active Optical Cable (AOC): <100m, moderate
// - SR (Short Range): 100m multimode fiber
// - LR (Long Range): 10km single-mode
// - ER (Extended Range): 40km+

// Switch classes:
// - 1U TOR: 32-48 × 25G + 4-8 × 100G uplinks
// - 2U TOR: 48-96 × 25G + 8 × 100G
// - 1U Spine: 32-64 × 100G
// - Modular: 100s of ports

// Cost comparison (2024):
// - 10G SFP+ DAC cable: $20-50
// - 25G SFP28 DAC: $50-150
// - 100G QSFP28 DAC: $150-300
// - 400G QSFP-DD: $500-1500`}
        </pre>
        <p className="leading-7">
          Ethernet: <strong>10G (server) → 25G (DC standard) → 100G (backbone) → 400G+ (AI)</strong>.<br />
          connectors: SFP+ (10G), SFP28 (25G), QSFP28 (100G), QSFP-DD (400G).<br />
          optics: DAC (copper) → AOC/SR/LR (fiber).
        </p>
      </div>
    </section>
  );
}
