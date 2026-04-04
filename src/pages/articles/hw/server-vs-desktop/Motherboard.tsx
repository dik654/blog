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
      </div>
    </section>
  );
}
