import { motion } from 'framer-motion';

const rows = [
  { type: 'UDIMM', buf: '없음', maxCap: '~32GB', slots: '2 DIMM/채널', use: '데스크톱, 소규모 서버' },
  { type: 'RDIMM', buf: '레지스터 버퍼', maxCap: '~256GB', slots: '많은 DIMM 장착', use: '서버 표준 (256GB+)' },
  { type: 'LRDIMM', buf: '데이터 버퍼 + 레지스터', maxCap: '~512GB', slots: '최대 밀도', use: '대용량 서버 (768GB+)' },
];

export default function RDIMM() {
  return (
    <section id="rdimm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RDIMM vs UDIMM vs LRDIMM</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RDIMM은 레지스터 버퍼로 전기 신호를 재구동합니다.<br />
          이를 통해 1채널에 더 많은 DIMM을 장착할 수 있어 대용량 구성이 가능합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['타입', '버퍼', '최대 용량', '슬롯', '용도'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.type} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.type}</td>
                  <td className="border border-border px-3 py-2">{r.buf}</td>
                  <td className="border border-border px-3 py-2">{r.maxCap}</td>
                  <td className="border border-border px-3 py-2">{r.slots}</td>
                  <td className="border border-border px-3 py-2">{r.use}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">UDIMM (Unbuffered)</h3>
        <ul className="leading-7">
          <li>memory controller 와 직접 연결, register buffering 없음.</li>
          <li>최저 latency, GB 당 가격 최저.</li>
          <li>DIMM 당 ~32 GB 한계.</li>
          <li>채널당 2 DIMM 까지, 엄격한 timing 요구.</li>
          <li>용도 — Desktop, Laptop (SODIMM), 소형 워크스테이션. 총 32~128 GB.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">RDIMM (Registered)</h3>
        <ul className="leading-7">
          <li>DIMM 위 register buffer 가 address/command 신호를 재구동.</li>
          <li>memory controller 부담 완화 → 채널당 8+ DIMM 장착 가능.</li>
          <li>약간의 latency 추가 (+1 cycle).</li>
          <li>signal integrity 우수, 고밀도 지원.</li>
          <li>용도 — 서버 표준 (128 GB~2 TB), 고용량 워크스테이션, DB 서버, 가상화 호스트.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">LRDIMM (Load Reduced)</h3>
        <ul className="leading-7">
          <li>address + data 모두 버퍼링 (Memory Buffer chip).</li>
          <li>전기 부하 감소 → DIMM 당 4+ rank, 256 GB DIMM 가능.</li>
          <li>가장 비싸고 latency 높지만 최대 용량.</li>
          <li>용도 — in-memory DB (SAP HANA), 대형 가상화, 1~6 TB 시스템, HPC.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">용량 확장</h3>
        <ul className="leading-7">
          <li><strong>Desktop</strong> — 2 slot × 2 channel = 4 slot. 32 GB × 2 = 64 GB 보통, 64 GB × 2 = 128 GB high-end.</li>
          <li><strong>Workstation</strong> — 8 slot × 4~8 channel. 64 GB × 8 = 512 GB. DDR5 UDIMM/RDIMM.</li>
          <li><strong>Server (single-socket EPYC)</strong> — 12 channel × 2 = 24 slot. 64 GB × 24 = 1.5 TB (RDIMM), 256 GB × 24 = 6 TB (LRDIMM).</li>
          <li><strong>Server (dual-socket)</strong> — 24 channel × 2 = 48 slot. 256 GB × 48 = 12 TB (LRDIMM).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2024 GB 당 가격</h3>
        <ul className="leading-7">
          <li>UDIMM non-ECC — $3/GB</li>
          <li>UDIMM ECC — $4/GB</li>
          <li>RDIMM — $5~$8/GB</li>
          <li>LRDIMM — $10~$15/GB</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">속도 vs 용량 trade-off</h3>
        <p className="leading-7">
          UDIMM &gt; RDIMM &gt; LRDIMM (속도), 반대로 UDIMM &lt; RDIMM &lt; LRDIMM (용량). 용도에 맞춰 선택.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CPU/Motherboard 지원</h3>
        <ul className="leading-7">
          <li>Xeon / EPYC — RDIMM + LRDIMM</li>
          <li>Core i — UDIMM only</li>
          <li>Ryzen — UDIMM + 일부 RDIMM</li>
          <li>Threadripper — RDIMM</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">CXL Memory (차세대)</h3>
        <p className="leading-7">
          Compute Express Link. PCIe 5.0 기반 메모리 확장. DIMM slot 한계를 넘어 노드당 최대 32 TB. 2024+ 엔터프라이즈, memory pooling/sharing 가능.
        </p>
        <p className="leading-7">
          DIMM types: <strong>UDIMM (desktop) → RDIMM (server) → LRDIMM (enterprise)</strong>.<br />
          capacity scaling: 128 GB → 1.5 TB → 6 TB single-socket.<br />
          CXL memory가 2024+ 차세대 (32 TB+ per node).
        </p>
      </div>
    </section>
  );
}
