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
      </div>
    </section>
  );
}
