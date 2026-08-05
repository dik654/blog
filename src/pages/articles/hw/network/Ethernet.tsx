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

        <h3 className="text-xl font-semibold mt-8 mb-3">세대별 진화</h3>
        <ul className="leading-7">
          <li><strong>1 GbE (2000s)</strong> — RJ45 copper Cat5e. 컨슈머 기본, 레거시 서버, 점차 퇴장.</li>
          <li><strong>10 GbE</strong> — SFP+ (fiber) 또는 10GBASE-T (copper). 포트당 $100~$200. 서버 NIC 표준. copper 30~50m, fiber 10km+.</li>
          <li><strong>25 GbE</strong> — SFP28. 포트당 $200~$400. 10 GbE 를 대체 중. single-lane 25 Gbps signaling, 100G 업그레이드 여지.</li>
          <li><strong>40 GbE</strong> — QSFP+. 4× 10 Gbps lane. 25/50/100 GbE 로 대체 중, bit 당 비싸다.</li>
          <li><strong>50 GbE</strong> — 2× 25 Gbps lane. 고대역폭 서버용.</li>
          <li><strong>100 GbE</strong> — QSFP28. 4× 25 Gbps 또는 2× 50 Gbps. spine switch, 스토리지 어레이.</li>
          <li><strong>200/400 GbE</strong> — QSFP-DD, OSFP. 차세대 백본, AI cluster interconnect. 포트당 $2K~$5K. 2024~2025 rollout.</li>
          <li><strong>800 GbE</strong> — 2024 표준 비준. 초고대역폭, AI 학습 fabric, early adoption.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">커넥터 타입</h3>
        <ul className="leading-7">
          <li><strong>SFP (Small Form-factor Pluggable)</strong> — 1G/10G/25G. hot-swap, transceiver 기반, fiber 또는 copper.</li>
          <li><strong>QSFP (Quad SFP)</strong> — 40G/100G. 4 parallel lane. 더 큰 모듈.</li>
          <li><strong>QSFP-DD (Double Density)</strong> — 200G/400G. 8 parallel lane. 포트당 최대 대역폭.</li>
          <li><strong>OSFP (Octal SFP)</strong> — 400G/800G. 대규모 배포용 신 폼팩터.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">광 모듈</h3>
        <ul className="leading-7">
          <li>DAC (Direct Attach Copper) — &lt;5m, 저가</li>
          <li>AOC (Active Optical Cable) — &lt;100m, 중간</li>
          <li>SR (Short Range) — 100m multimode fiber</li>
          <li>LR (Long Range) — 10km single-mode</li>
          <li>ER (Extended Range) — 40km+</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">스위치 클래스</h3>
        <ul className="leading-7">
          <li>1U TOR — 32~48 × 25G + 4~8 × 100G uplink</li>
          <li>2U TOR — 48~96 × 25G + 8 × 100G</li>
          <li>1U Spine — 32~64 × 100G</li>
          <li>Modular — 수백 포트</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2024 케이블 가격</h3>
        <ul className="leading-7">
          <li>10G SFP+ DAC — $20~$50</li>
          <li>25G SFP28 DAC — $50~$150</li>
          <li>100G QSFP28 DAC — $150~$300</li>
          <li>400G QSFP-DD — $500~$1,500</li>
        </ul>
        <p className="leading-7">
          Ethernet: <strong>10G (server) → 25G (DC standard) → 100G (backbone) → 400G+ (AI)</strong>.<br />
          connectors: SFP+ (10G), SFP28 (25G), QSFP28 (100G), QSFP-DD (400G).<br />
          optics: DAC (copper) → AOC/SR/LR (fiber).
        </p>
      </div>
    </section>
  );
}
