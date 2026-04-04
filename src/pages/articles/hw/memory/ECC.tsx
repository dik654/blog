import { motion } from 'framer-motion';

const items = [
  { type: 'non-ECC', bits: '64비트 데이터', detect: '없음', correct: '없음', use: '데스크톱, 게임' },
  { type: 'ECC (SECDED)', bits: '64 + 8 패리티', detect: '2비트 감지', correct: '1비트 정정', use: '서버 필수' },
  { type: '온다이 ECC (DDR5)', bits: 'DIMM 내부 보정', detect: '내부 셀 에러', correct: '내부 자동 정정', use: 'DDR5 기본' },
];

export default function ECC() {
  return (
    <section id="ecc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECC: 에러 정정 (서버 필수, 왜?)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ECC(Error Correcting Code)는 SECDED 방식으로 1비트 에러를 자동 정정합니다.<br />
          서버에서 메모리 비트 플립은 블록 검증 실패, DB 손상 등 치명적 결과를 초래합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['타입', '데이터 구조', '감지', '정정', '용도'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <motion.tr key={it.type} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{it.type}</td>
                  <td className="border border-border px-3 py-2">{it.bits}</td>
                  <td className="border border-border px-3 py-2">{it.detect}</td>
                  <td className="border border-border px-3 py-2">{it.correct}</td>
                  <td className="border border-border px-3 py-2">{it.use}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
