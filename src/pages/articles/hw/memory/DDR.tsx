import { motion } from 'framer-motion';

const rows = [
  { attr: '전송 속도', ddr4: '3200 MT/s', ddr5: '5600 MT/s' },
  { attr: '전압', ddr4: '1.2V', ddr5: '1.1V' },
  { attr: '채널 구조', ddr4: '64비트 단일 채널', ddr5: '2 x 32비트 서브채널' },
  { attr: '뱅크 그룹', ddr4: '4개', ddr5: '8개' },
  { attr: '온다이 ECC', ddr4: '없음', ddr5: '있음 (DIMM 내부 보정)' },
  { attr: '최대 DIMM 용량', ddr4: '128GB', ddr5: '256GB (단일 DIMM)' },
];

export default function DDR() {
  return (
    <section id="ddr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DDR4 vs DDR5: 대역폭, 레이턴시, 채널</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DDR5는 서브채널 분할로 실효 대역폭이 DDR4의 약 2배입니다.<br />
          온다이 ECC가 기본 탑재되어 DIMM 내부에서 1차 에러 보정을 수행합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', 'DDR4', 'DDR5'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr key={r.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{r.attr}</td>
                  <td className="border border-border px-3 py-2">{r.ddr4}</td>
                  <td className="border border-border px-3 py-2">{r.ddr5}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sub-channel Architecture</h3>
        <p className="leading-7">
          DDR4 는 DIMM 당 64-bit 단일 채널. DDR5 는 DIMM 당 32-bit 서브채널 2 개로 분할 — 독립 addressing, command/address bus 2배, 병렬성 향상으로 실효 대역폭 약 2배.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">On-die ECC</h3>
        <p className="leading-7">
          DDR5 DIMM 내부에 통합된 ECC. DRAM cell 에러를 CPU 에 투명하게 보정. SECDED 대체는 아니지만 soft error rate 를 낮춘다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">전력 관리</h3>
        <ul className="leading-7">
          <li>DDR4 — PMIC 가 메인보드에 외부 배치.</li>
          <li>DDR5 — PMIC 가 DIMM 위로 이동. per-DIMM tuning, 1.1V (vs 1.2V), 더 높은 클럭 가능.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">속도</h3>
        <ul className="leading-7">
          <li>DDR4 — 2133~3200 MT/s 표준, OC 시 5000 MT/s</li>
          <li>DDR5 — 4800~5600 MT/s 런칭, OC 8000+ MT/s</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Bank Groups</h3>
        <p className="leading-7">
          DDR4 는 4 bank group (총 16 bank), DDR5 는 8 bank group (총 32 bank). 병렬 접근 향상 → random I/O 효율 + row conflict 감소.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">밀도</h3>
        <p className="leading-7">
          DDR4 는 chip 당 16 Gb 가 최대, DDR5 는 64 Gb 까지 — 4배. 더 큰 DIMM 구성 가능.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">대역폭 비교</h3>
        <ul className="leading-7">
          <li><strong>DDR4-3200</strong> — DIMM 25.6 GB/s · dual 51.2 GB/s · 8-channel 서버 205 GB/s</li>
          <li><strong>DDR5-4800</strong> — DIMM 38.4 GB/s · dual 76.8 GB/s · 8-channel 서버 307 GB/s</li>
          <li><strong>DDR5-5600</strong> — DIMM 44.8 GB/s · dual 89.6 GB/s · 8-channel 서버 358 GB/s</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">레이턴시</h3>
        <p className="leading-7">
          DDR4 CL16 = 10 ns, DDR5 CL40 = 14 ns. nominal CL 은 DDR5 가 높지만 데이터 레이트가 빨라 실제 레이턴시는 비슷.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">워크로드 영향</h3>
        <ul className="leading-7">
          <li><strong>Memory-bound</strong> — DDR5 압도적 (MSM, 대형 그래프, DB scan).</li>
          <li><strong>Latency-sensitive</strong> — 한계 이득. CPU cache 영향이 더 크다. DDR4 도 경쟁력.</li>
          <li><strong>가격</strong> — DDR4 $3~5/GB, DDR5 $4~8/GB (2024) — 수렴 중.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">호환성</h3>
        <ul className="leading-7">
          <li>슬롯 다름 — 호환 불가.</li>
          <li>Intel 12th gen+ (2021), AMD Ryzen 7000+ (2022).</li>
          <li>서버 — Sapphire Rapids, Genoa 이상.</li>
        </ul>
        <p className="leading-7">
          DDR5: <strong>sub-channels + on-die ECC + higher speeds</strong>.<br />
          8-channel server: DDR4 205 GB/s → DDR5 358 GB/s.<br />
          Intel 12th+, AMD Ryzen 7000+, server 2023+.
        </p>
      </div>
    </section>
  );
}
