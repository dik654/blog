import { motion } from 'framer-motion';

const gpus = [
  { gpu: 'RTX 4090', tdp: '450W', cool: '오픈에어', note: '데스크톱/워크스테이션' },
  { gpu: 'RTX 5090', tdp: '575W', cool: '오픈에어', note: '데스크톱/워크스테이션' },
  { gpu: 'A100 SXM', tdp: '400W', cool: '블로워', note: '서버 랙 최적화' },
  { gpu: 'H100 SXM', tdp: '700W', cool: '블로워', note: '서버 랙 최적화' },
];

export default function TDP() {
  return (
    <section id="tdp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TDP & 전력 소비: GPU별 실측</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TDP(Thermal Design Power)는 GPU가 최대 부하에서 방출하는 열량입니다.<br />
          냉각 시스템은 이 열을 처리할 수 있어야 합니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['GPU', 'TDP', '냉각 타입', '적합 환경'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gpus.map((g) => (
                <motion.tr key={g.gpu} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{g.gpu}</td>
                  <td className="border border-border px-3 py-2">{g.tdp}</td>
                  <td className="border border-border px-3 py-2">{g.cool}</td>
                  <td className="border border-border px-3 py-2">{g.note}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">TDP 정의</h3>
        <p className="leading-7">
          지속적 열 방출량. 냉각 설계 기준. peak power 가 아닌 <strong>sustained operation</strong> 기준.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TDP vs 실측 전력</h3>
        <ul className="leading-7">
          <li>TDP — 보수적 설계 지점</li>
          <li>peak — 짧은 burst</li>
          <li>sustained — TDP 의 80~100%</li>
          <li>idle — 10~20W</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">GPU 전력 프로파일</h3>
        <ul className="leading-7">
          <li><strong>RTX 4090 (450W TDP)</strong> — idle 20W, 게이밍 300~400W, 지속 compute 450W, peak transient 600W+. PSU 1000W 필요.</li>
          <li><strong>H100 SXM (700W TDP)</strong> — idle 70W, 추론 400~500W, 학습 sustained 700W, peak 900W+. liquid cooling 필요.</li>
          <li><strong>A100 SXM (400W TDP)</strong> — idle 50W, sustained 380~400W, peak 500W. 4U 에서 air cooling 가능.</li>
          <li><strong>B200 (1000W TDP)</strong> — idle 100W, sustained 900~1000W, peak 1200W+. liquid cooling 필수, direct-to-chip 권장.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">전력 부하 계산</h3>
        <p className="leading-7">
          Total = CPU + GPU + memory + drive + network + 보드.
        </p>
        <p className="leading-7">예시 — AI 학습 서버:</p>
        <ul className="leading-7">
          <li>2× EPYC (500W) = 1,000W</li>
          <li>8× H100 (700W) = 5,600W</li>
          <li>DDR5 (30W × 24) = 720W</li>
          <li>NVMe (15W × 8) = 120W</li>
          <li>network + fan = 200W</li>
          <li>motherboard = 100W</li>
          <li>총 IT = 7,740W</li>
          <li>PSU 효율 85% → 9,100W input</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">PSU 사이징</h3>
        <ul className="leading-7">
          <li>nameplate IT 부하</li>
          <li>20% 헤드룸</li>
          <li>효율 계수</li>
          <li>redundancy (2N 또는 N+1)</li>
          <li>위 서버 예시 — 12 kW</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">PSU 효율</h3>
        <ul className="leading-7">
          <li>80 PLUS Gold — 87~90%</li>
          <li>Platinum — 90~92%</li>
          <li>Titanium — 94%+</li>
          <li>높은 효율 = 폐열 감소</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">전력 경제학</h3>
        <ul className="leading-7">
          <li>데이터센터 — $0.10/kWh 일반</li>
          <li>1 kW continuous — $876/year</li>
          <li>H100 서버 (10 kW) — $8,760/year</li>
          <li>5년 TCO 상당</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Filecoin SP 시나리오</h3>
        <ul className="leading-7">
          <li>A100 서버 — ~3 kW</li>
          <li>10 서버/rack — 30 kW</li>
          <li>24/7 운영</li>
          <li>연간 전기료 — $26K</li>
          <li>냉각 추가 — $8K~$12K</li>
          <li>에너지 비용이 ROI 좌우</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">열 방출 환산</h3>
        <ul className="leading-7">
          <li>1 kW 열 = 3,412 BTU/hr</li>
          <li>CRAC 냉각 — 1~1.5 kW 추가 필요</li>
          <li>water cooling — 0.2~0.3 kW</li>
          <li>PUE 영향 막대</li>
        </ul>
        <p className="leading-7">
          TDP: <strong>sustained cooling 기준, peak는 120-150%</strong>.<br />
          AI server: 7.7 kW IT load, 12 kW PSU (2N redundant).<br />
          $876/year per kW continuous — operating cost significant.
        </p>
      </div>
    </section>
  );
}
