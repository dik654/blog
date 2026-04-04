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
      </div>
    </section>
  );
}
