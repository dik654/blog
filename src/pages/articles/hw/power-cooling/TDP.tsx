import { motion } from 'framer-motion';

const gpus = [
  { gpu: 'RTX 4090', tdp: '450W', cool: '오픈에어', note: '데스크톱/워크스테이션' },
  { gpu: 'RTX 5090', tdp: '575W', cool: '오픈에어', note: '데스크톱/워크스테이션' },
  { gpu: 'A100 SXM', tdp: '400W', cool: '블로워', note: '서버 랙 최적화' },
  { gpu: 'H100 SXM', tdp: '700W', cool: '블로워', note: '서버 랙 최적화' },
];

export default function TDP() {
  return (
    <section id="tdp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TDP & 전력 소비: GPU별 실측</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TDP(Thermal Design Power)는 GPU가 최대 부하에서 방출하는 열량입니다.<br />
          냉각 시스템은 이 열을 처리할 수 있어야 합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['GPU', 'TDP', '냉각 타입', '적합 환경'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gpus.map((g) => (
                <motion.tr key={g.gpu} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{g.gpu}</td>
                  <td className="border border-border px-3 py-2">{g.tdp}</td>
                  <td className="border border-border px-3 py-2">{g.cool}</td>
                  <td className="border border-border px-3 py-2">{g.note}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">TDP vs Real Power 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TDP (Thermal Design Power):

// Definition:
// - 지속 heat 방출량
// - cooling 설계 기준
// - NOT peak power
// - sustained operation

// TDP vs Actual Power:
// - TDP: conservative design point
// - Peak power: short bursts
// - Sustained: 80-100% TDP
// - Idle: 10-20 W

// GPU Power Profiles:
//
// NVIDIA RTX 4090 (450W TDP):
// - idle: 20W
// - gaming: 300-400W
// - compute (sustained): 450W
// - peak transient: 600W+
// - requires 1000W PSU
//
// NVIDIA H100 SXM (700W TDP):
// - idle: 70W
// - inference: 400-500W
// - training (sustained): 700W
// - peak transient: 900W+
// - requires liquid cooling
//
// NVIDIA A100 SXM (400W TDP):
// - idle: 50W
// - sustained: 380-400W
// - peak: 500W
// - air cooling possible in 4U
//
// NVIDIA B200 (1000W TDP):
// - idle: 100W
// - sustained: 900-1000W
// - peak transient: 1200W+
// - liquid cooling mandatory
// - direct-to-chip preferred

// Power delivery calculation:
// Total load = CPU + GPU + memory + drives + network
//
// Example: AI training server
// - 2× EPYC (500W): 1000W
// - 8× H100 (700W): 5600W
// - DDR5 (30W × 24): 720W
// - NVMe (15W × 8): 120W
// - network + fans: 200W
// - motherboard: 100W
// - total IT: 7740W
// - PSU efficiency (85%): 9100W input

// PSU sizing:
// - nameplate IT load
// - 20% headroom
// - efficiency factor
// - redundancy (2N or N+1)
// - example: 12 kW for above server

// Efficiency:
// - 80 PLUS Gold: 87-90%
// - Platinum: 90-92%
// - Titanium: 94%+
// - higher efficiency = less waste heat

// Power economics:
// - datacenter: $0.10/kWh typical
// - 1 kW continuous: $876/year
// - H100 server (10 kW): $8,760/year
// - 5-year TCO significant

// Filecoin SP scenario:
// - A100 server: ~3 kW
// - 10 servers/rack: 30 kW
// - 24/7 operation
// - annual: $26K electricity
// - cooling adds: $8-12K
// - ROI affected by energy cost

// Heat dissipation:
// - 1 kW heat = 3412 BTU/hr
// - CRAC cooling: need 1-1.5 kW
// - water cooling: 0.2-0.3 kW
// - PUE impact massive`}
        </pre>
        <p className="leading-7">
          TDP: <strong>sustained cooling 기준, peak는 120-150%</strong>.<br />
          AI server: 7.7 kW IT load, 12 kW PSU (2N redundant).<br />
          $876/year per kW continuous — operating cost significant.
        </p>
      </div>
    </section>
  );
}
