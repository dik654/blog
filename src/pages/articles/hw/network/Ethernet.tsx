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
      </div>
    </section>
  );
}
