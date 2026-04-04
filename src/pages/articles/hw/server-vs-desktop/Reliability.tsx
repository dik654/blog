import { motion } from 'framer-motion';

const items = [
  { feat: 'ECC 메모리', why: '1비트 에러 자동 정정, 2비트 에러 감지', risk: '비트 플립 → 데이터 손상, 블록 검증 실패' },
  { feat: '이중 전원 (Redundant PSU)', why: 'PSU 1개 고장 시 나머지가 100% 부하 담당', risk: '단일 PSU 고장 = 전체 시스템 다운' },
  { feat: '핫스왑 디스크', why: 'RAID 구성에서 디스크 교체 시 무중단', risk: '서비스 중단 후 교체 → 다운타임' },
  { feat: '열 센서 + 팬 제어', why: 'BMC가 온도 모니터링, 팬 속도 자동 조절', risk: '과열 시 쓰로틀링 → 증명 시간 초과' },
];

export default function Reliability() {
  return (
    <section id="reliability" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안정성: ECC, 핫스왑, 이중 전원</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서버 부품의 핵심 가치는 안정성입니다.<br />
          ECC 메모리, 이중 전원, 핫스왑 디스크는 24/7 운영의 기본 요건입니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['기능', '서버 이점', '없을 때 위험'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <motion.tr key={it.feat} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{it.feat}</td>
                  <td className="border border-border px-3 py-2">{it.why}</td>
                  <td className="border border-border px-3 py-2 text-red-600 dark:text-red-400">{it.risk}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
