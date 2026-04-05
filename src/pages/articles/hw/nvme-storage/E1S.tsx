import { motion } from 'framer-motion';

const compare = [
  { attr: '폼팩터', m2: '22×80mm 기판', u2: '2.5인치 금속', e1s: '5.9mm 두께 슬림' },
  { attr: '전력', m2: '~8W', u2: '~25W', e1s: '~25W (더 나은 열 분산)' },
  { attr: '핫스왑', m2: '불가', u2: '가능', e1s: '가능' },
  { attr: '내구성(DWPD)', m2: '0.3~1', u2: '3+', e1s: '3+' },
  { attr: '밀도', m2: '보통', u2: '보통', e1s: '높음 (1U에 32개)' },
  { attr: '주요 용도', m2: '데스크톱, 노트북', u2: '서버, 스토리지 어레이', e1s: '차세대 데이터센터' },
];

export default function E1S() {
  return (
    <section id="e1s" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">E1.S/E3.S: 차세대 데이터센터</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          E1.S는 OCP(Open Compute Project)에서 표준화한 차세대 폼팩터입니다.<br />
          1U 서버에 최대 32개를 장착할 수 있어 밀도와 전력 효율 모두 뛰어납니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', 'M.2', 'U.2', 'E1.S'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((c) => (
                <motion.tr key={c.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{c.attr}</td>
                  <td className="border border-border px-3 py-2">{c.m2}</td>
                  <td className="border border-border px-3 py-2">{c.u2}</td>
                  <td className="border border-border px-3 py-2">{c.e1s}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">E1.S/E3.S 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EDSFF (Enterprise & Datacenter SSD Form Factor):

// E1.S (Enterprise 1 Short):
// - 31.5mm wide × 111.49mm long
// - thickness options: 5.9mm, 8mm, 9.5mm, 15mm, 25mm
// - hot-swap
// - front-access
// - EDSFF SFF-TA-1006 standard

// E1.L (Enterprise 1 Long):
// - same width
// - 318.75mm long
// - higher capacity
// - ruler form factor

// E3.S / E3.L (Enterprise 3):
// - 76mm wide
// - 104-142mm long
// - 7.5mm-25mm thickness
// - successor standard
// - more capacity

// 주요 장점:
//
// 1. Density:
// - 1U: up to 32 × E1.S
// - vs U.2: ~10 in 1U
// - 3x density advantage
//
// 2. Thermal:
// - thin profile (5.9mm option)
// - optimal airflow paths
// - better cooling
// - sustained performance
//
// 3. Serviceability:
// - tool-less
// - indicator LEDs
// - hot-swap
// - enterprise-grade
//
// 4. Power:
// - adjustable power
// - per-drive budgeting
// - sleep states
// - efficient cooling

// 5. Future-proof:
// - PCIe 5.0 ready
// - CXL support (future)
// - designed for NVMe-oF
// - adopted by Meta, Microsoft, Google

// Adoption:
// - 2019: spec released
// - 2021: first products (Samsung PM9A3)
// - 2023: widespread in hyperscalers
// - 2024: enterprise mainstream

// OCP (Open Compute Project):
// - Meta's hardware initiative
// - open standards
// - EDSFF supported
// - designed for cloud datacenters

// Form factor comparison:
// M.2 2280: ~2.8K mm² (board area)
// U.2: ~3.6K mm² (enclosure)
// E1.S: ~3.5K mm²
// E1.L: ~10K mm² (high capacity)

// Cost trends:
// - initial: premium pricing
// - 2024: approaching U.2 parity
// - 2025: expected to be cheaper
// - economies of scale

// Use cases:
// ✓ Hyperscaler datacenters
// ✓ Dense storage servers
// ✓ NVMe-oF fabrics
// ✓ HPC scratch
// ✓ Filecoin SP (next-gen)

// Future (2025+):
// - E3.S primary standard
// - PCIe 5.0 mainstream
// - CXL integration
// - 30-60 TB single drive
// - $100/TB target`}
        </pre>
        <p className="leading-7">
          E1.S/E3.S: <strong>EDSFF standard, 1U density 32 drives</strong>.<br />
          hyperscaler 표준 (Meta OCP, Microsoft, Google).<br />
          2019 spec → 2024 mainstream → 2025+ E3.S 주류.
        </p>
      </div>
    </section>
  );
}
