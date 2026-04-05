import { motion } from 'framer-motion';

const methods = [
  { method: '블로워', dir: '전→후 직선 배기', pros: '서버 랙 에어플로 호환', cons: '소음 큼, 냉각 효율 보통' },
  { method: '오픈에어', dir: '히트싱크 + 팬 사방 확산', pros: '냉각 효율 높음, 저소음', cons: '서버 랙 부적합 (주변 과열)' },
  { method: 'AIO 수냉', dir: '라디에이터로 열 이동', pros: '고밀도 구성 가능', cons: '펌프 고장 위험, 유지보수' },
  { method: '커스텀 수냉', dir: '서버용 CoolIT/Asetek', pros: '최고 냉각 성능', cons: '높은 비용, 전문 설치 필요' },
];

export default function Cooling() {
  return (
    <section id="cooling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">냉각: 블로워 vs 오픈에어 vs 수냉</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          냉각 방식 선택은 서버 환경에서 가장 중요한 설계 결정입니다.<br />
          블로워는 랙 에어플로에 맞고, 오픈에어는 데스크톱 전용입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['냉각 방식', '열 방향', '장점', '단점'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <motion.tr key={m.method} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{m.method}</td>
                  <td className="border border-border px-3 py-2">{m.dir}</td>
                  <td className="border border-border px-3 py-2">{m.pros}</td>
                  <td className="border border-border px-3 py-2">{m.cons}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">냉각 방식 상세 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 냉각 방식 상세:

// 1. Air Cooling (Traditional):
//
// 1a. Blower (Server Rack):
// - axial fan, single direction
// - front intake, rear exhaust
// - through chassis
// - fits standard rack airflow
// - high RPM (10K+), loud
// - used in: A100, H100 SXM, server GPUs

// 1b. Open-air (Consumer):
// - multiple fans, radial
// - heats surrounding air
// - needs open space
// - quieter, more effective for single GPU
// - used in: RTX 4090, 5090

// 1c. Tower Cooler (CPU):
// - heatpipes + fins + fan
// - effective for CPUs
// - large form factor
// - 150-250W dissipation

// 2. Water Cooling:

// 2a. AIO (All-in-One):
// - pump + radiator integrated
// - easier installation
// - moderate performance
// - 360mm radiator: ~400W GPU
// - risk: pump failure

// 2b. Custom Loop:
// - waterblocks, reservoir, pumps
// - multiple components cooled
// - highest air-replacement performance
// - complex installation
// - maintenance required

// 2c. Direct-to-Chip (DTC):
// - water cold plates on CPU/GPU
// - 40-60°C coolant
// - enterprise-grade
// - CoolIT, Asetek, Nvidia MGX
// - H100 standard cooling

// 2d. Rear Door Heat Exchanger:
// - water-cooled door on rack
// - passive cooling
// - 50-100 kW per rack
// - minimal rack modification

// 3. Immersion Cooling:

// 3a. Single-phase:
// - dielectric fluid (mineral oil)
// - submerge entire server
// - natural convection
// - quiet, efficient

// 3b. Two-phase:
// - fluorocarbon boils at CPU
// - phase change cooling
// - highest efficiency
// - complex, expensive

// Performance comparison:
// - Air: 30 kW/rack max
// - Water DTC: 100 kW/rack
// - Immersion: 200+ kW/rack
// - Future: 500+ kW/rack

// Filecoin SP typical:
// - air-cooled 4U servers
// - hot/cold aisle containment
// - CRAC units
// - 10-20 kW/rack
// - standard datacenter OK

// AI/HPC (H100, B200):
// - direct-to-chip water required
// - 50-100 kW/rack
// - specialized facilities
// - higher cost

// Cooling cost economics:
// - Air: $2-3K/year per kW
// - Water: $1-1.5K/year per kW
// - Immersion: $0.5-1K/year per kW
// - savings amortize over 5 years

// Heat reuse:
// - water cooling → district heating
// - server farms + greenhouses
// - Nordic datacenters
// - sustainability benefit`}
        </pre>
        <p className="leading-7">
          냉각: <strong>air (30 kW/rack) → water (100 kW/rack) → immersion (200+ kW/rack)</strong>.<br />
          Filecoin SP: air + hot/cold aisle 충분.<br />
          AI training: direct-to-chip water 필수 (H100/B200).
        </p>
      </div>
    </section>
  );
}
