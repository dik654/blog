import { motion } from 'framer-motion';

const features = [
  { feat: '듀얼 소켓', desc: 'CPU 2개 장착 → PCIe 레인 2배, 메모리 채널 2배', desktop: '불가' },
  { feat: 'IPMI/BMC', desc: '전원 꺼져도 원격 콘솔, 전원 제어, BIOS 설정', desktop: '없음' },
  { feat: '핫스왑 베이', desc: '운영 중 디스크 교체 가능 (RAID 재구성)', desktop: '없음' },
  { feat: 'PCIe 레인 배분', desc: 'PLX 스위치로 GPU 슬롯 8개 이상 지원', desktop: '2~3 슬롯' },
];

export default function Motherboard() {
  return (
    <section id="motherboard" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메인보드: 듀얼 소켓, IPMI, PCIe 레인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서버 메인보드는 IPMI(원격 관리), 듀얼 소켓, 핫스왑 베이를 제공합니다.<br />
          데이터센터에서 수백 대 서버를 운영하려면 원격 관리가 필수입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['기능', '서버 메인보드', '데스크톱'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <motion.tr key={f.feat} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{f.feat}</td>
                  <td className="border border-border px-3 py-2">{f.desc}</td>
                  <td className="border border-border px-3 py-2">{f.desktop}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Server Motherboard 기능 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// IPMI / BMC (Baseboard Management Controller):
//
// 기능:
// - remote power on/off
// - remote BIOS access
// - remote console (KVM over IP)
// - sensor monitoring (temp, fan, voltage)
// - event logs
// - separate network port
// - works even when CPU is off
//
// Use cases:
// - datacenter management
// - lights-out operation
// - crash recovery (no physical access)
// - firmware updates
// - hardware diagnostics
//
// Standards:
// - IPMI (Intel): industry standard
// - iLO (HPE)
// - iDRAC (Dell)
// - Supermicro IPMI
// - Redfish API (modern)

// Dual Socket Systems:
// - 2 CPUs on single motherboard
// - NUMA (Non-Uniform Memory Access)
// - cross-socket interconnect:
//   - UPI (Intel, 20 GT/s)
//   - Infinity Fabric (AMD)
// - doubled resources:
//   - 192+ cores total
//   - 12+ TB memory
//   - 256 PCIe lanes
//   - memory bandwidth 800+ GB/s

// Quad Socket (rare):
// - 4 CPUs
// - SGI UV systems (HP)
// - massive NUMA machines
// - 10 TB+ memory
// - specialized workloads

// PCIe Slot Density:
// Desktop motherboards:
// - ATX: 7 slots (but usually 4-5 PCIe)
// - E-ATX: 8 slots
// - typically: 2-3 GPU slots
//
// Server motherboards:
// - 1U/2U: 2-6 slots
// - 4U: 8-16 slots
// - PLX switches expand
// - riser cards for density

// PLX/PCIe Switches:
// - multiplexes PCIe lanes
// - adds slots
// - slight latency overhead
// - enables 8+ GPUs
// - common in mining rigs

// Hot-swap Components:
// - drives (front-accessible)
// - fans (redundant, replaceable)
// - PSUs (1+1 redundancy)
// - network modules

// Form factors:
// - E-ATX: largest desktop
// - SSI EEB: dual socket
// - Proprietary: server-specific
// - 1U/2U/4U: rack-mount heights

// Cost:
// Desktop motherboard: $150-700
// Server motherboard: $600-3000+
// - reliability premium
// - enterprise support
// - longer warranty`}
        </pre>
        <p className="leading-7">
          Server motherboard: <strong>IPMI + dual socket + PLX switches</strong>.<br />
          lights-out operation, 256 PCIe lanes (dual), 8-16 GPU slots.<br />
          $600-3000+ (desktop $150-700).
        </p>
      </div>
    </section>
  );
}
