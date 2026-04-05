import { motion } from 'framer-motion';

const specs = [
  { gpu: 'RTX 4090', cores: '16,384', vram: '24GB GDDR6X', bw: '1,008 GB/s', tdp: '450W', cool: '오픈에어' },
  { gpu: 'RTX 5090', cores: '21,760', vram: '32GB GDDR7', bw: '1,792 GB/s', tdp: '575W', cool: '오픈에어' },
];

export default function Consumer() {
  return (
    <section id="consumer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨슈머 GPU (4090, 5090)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          컨슈머 GPU는 가격 대비 성능이 뛰어납니다.<br />
          단, 오픈에어 쿨링이라 서버 랙에 넣으면 냉각 문제가 발생합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['GPU', 'CUDA 코어', 'VRAM', '대역폭', 'TDP', '냉각'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <motion.tr key={s.gpu} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{s.gpu}</td>
                  <td className="border border-border px-3 py-2">{s.cores}</td>
                  <td className="border border-border px-3 py-2">{s.vram}</td>
                  <td className="border border-border px-3 py-2">{s.bw}</td>
                  <td className="border border-border px-3 py-2">{s.tdp}</td>
                  <td className="border border-border px-3 py-2">{s.cool}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Consumer GPU 상세 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RTX 4090 (2022-):
// Architecture: Ada Lovelace (TSMC 4N)
// - 16,384 CUDA cores
// - 24GB GDDR6X
// - 1008 GB/s bandwidth
// - 450W TDP
// - PCIe 4.0 x16
// - 4 DisplayPort + 1 HDMI
// - price: $1,599-1,999

// Cooling:
// - 3-fan open-air design
// - 3-slot configuration
// - needs 358mm+ case
// - not server-rack compatible
// - requires good airflow

// Power:
// - 450W TDP
// - 16-pin connector (4x 8-pin adapters)
// - 850W PSU minimum
// - 1000W+ recommended

// Use cases:
// - Gaming (4K max settings)
// - ML training (small models)
// - Filecoin C2 proving
// - ZK proof generation
// - Video editing / rendering

// Performance:
// - C2 time: 40-60 min (bellperson)
// - C2 time: 25-40 min (SupraSeal)
// - AI inference: competitive
// - no NVLink (not for clusters)

// RTX 5090 (2025):
// Architecture: Blackwell (TSMC 4NP)
// - 21,760 CUDA cores (+33%)
// - 32GB GDDR7 (+33%)
// - 1792 GB/s bandwidth (+78%)
// - 575W TDP (+28%)
// - PCIe 5.0 x16

// Improvements:
// - 78% more memory bandwidth
// - 33% more VRAM (can handle 32GiB sectors)
// - Blackwell tensor cores
// - better efficiency
// - price: ~$1,999-2,499

// Server limitations:
// 1. Open-air cooling:
//    - not rack-mount friendly
//    - heat management issues
//    - stacking impossible
//
// 2. NVLink absent:
//    - no GPU-to-GPU direct link
//    - PCIe bottleneck for multi-GPU
//    - LLM inference limited
//
// 3. Data center use:
//    - EULA restrictions (NVIDIA)
//    - consumer drivers
//    - no enterprise support
//    - reliability concerns

// Economic reality:
// - $2K GPU = great value
// - but 8x in server = cooling hell
// - limited scaling
// - need custom chassis

// Custom solutions:
// - external enclosures (PCIe extenders)
// - liquid cooling
// - mining-style racks
// - significant engineering`}
        </pre>
        <p className="leading-7">
          Consumer: <strong>RTX 4090 (24GB, $2K), RTX 5090 (32GB, $2.5K)</strong>.<br />
          open-air cooling → server rack 불가.<br />
          NVLink 없음 → multi-GPU scaling 제한.
        </p>
      </div>
    </section>
  );
}
