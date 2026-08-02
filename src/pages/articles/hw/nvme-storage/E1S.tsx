import { motion } from 'framer-motion';

const compare = [
  { attr: '폼팩터', m2: '22×80mm 기판', u2: '2.5인치 금속', e1s: '5.9mm 두께 슬림' },
  { attr: '전력', m2: '~8W', u2: '~25W', e1s: '~25W (더 나은 열 분산)' },
  { attr: '핫스왑', m2: '불가', u2: '가능', e1s: '가능' },
  { attr: '내구성(DWPD)', m2: '0.3~1', u2: '3+', e1s: '3+' },
  { attr: '밀도', m2: '보통', u2: '보통', e1s: '높음 (1U에 32개)' },
  { attr: '주요 용도', m2: '데스크톱, 노트북', u2: '서버, 스토리지 어레이', e1s: '차세대 데이터센터' },
];

export default function E1S() {
  return (
    <section id="e1s" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">E1.S/E3.S: 차세대 데이터센터</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          E1.S는 OCP(Open Compute Project)에서 표준화한 차세대 폼팩터입니다.<br />
          1U 서버에 최대 32개를 장착할 수 있어 밀도와 전력 효율 모두 뛰어납니다.
        </p>
        <div className="overflow-x-auto not-prose">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {['속성', 'M.2', 'U.2', 'E1.S'].map(h => (
                  <th key={h} className="border border-border px-3 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map((c) => (
                <motion.tr key={c.attr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className="border border-border px-3 py-2 font-medium">{c.attr}</td>
                  <td className="border border-border px-3 py-2">{c.m2}</td>
                  <td className="border border-border px-3 py-2">{c.u2}</td>
                  <td className="border border-border px-3 py-2">{c.e1s}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">EDSFF 폼팩터 종류</h3>
        <ul className="leading-7">
          <li><strong>E1.S (Enterprise 1 Short)</strong> — 31.5mm × 111.49mm. 두께 5.9/8/9.5/15/25mm 선택. hot-swap, 전면 접근. EDSFF SFF-TA-1006 표준.</li>
          <li><strong>E1.L (Enterprise 1 Long)</strong> — 동일 폭, 길이 318.75mm. 고용량, ruler 형태.</li>
          <li><strong>E3.S / E3.L (Enterprise 3)</strong> — 폭 76mm, 길이 104~142mm, 두께 7.5~25mm. 후속 표준, 더 큰 용량.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 장점</h3>
        <ul className="leading-7">
          <li><strong>밀도</strong> — 1U 에 최대 32 × E1.S (U.2 는 1U 약 10 개) — 3배 우위.</li>
          <li><strong>열</strong> — 슬림 (5.9mm 옵션), 최적 airflow path, 우수한 냉각, 지속 성능.</li>
          <li><strong>서비스성</strong> — tool-less, indicator LED, hot-swap, 엔터프라이즈 등급.</li>
          <li><strong>전력</strong> — 드라이브별 조절 가능, sleep state, 효율적 냉각.</li>
          <li><strong>future-proof</strong> — PCIe 5.0 준비, CXL 지원 예정, NVMe-oF 설계. Meta, Microsoft, Google 채택.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">채택 타임라인</h3>
        <ul className="leading-7">
          <li>2019 — 스펙 발표</li>
          <li>2021 — 첫 제품 (Samsung PM9A3)</li>
          <li>2023 — 하이퍼스케일러 광범위 도입</li>
          <li>2024 — 엔터프라이즈 mainstream</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">OCP (Open Compute Project)</h3>
        <p className="leading-7">
          Meta 가 주도한 하드웨어 이니셔티브. open standard, EDSFF 지원, 클라우드 데이터센터 설계.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">폼팩터 면적</h3>
        <ul className="leading-7">
          <li>M.2 2280 — ~2.8K mm² (보드 면적)</li>
          <li>U.2 — ~3.6K mm² (enclosure)</li>
          <li>E1.S — ~3.5K mm²</li>
          <li>E1.L — ~10K mm² (고용량)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">가격 추세</h3>
        <ul className="leading-7">
          <li>초기 — 프리미엄 가격</li>
          <li>2024 — U.2 와 가격 수렴</li>
          <li>2025 — 더 저렴해질 전망</li>
          <li>규모 경제 진행</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">용도</h3>
        <ul className="leading-7">
          <li>하이퍼스케일러 데이터센터</li>
          <li>고밀도 스토리지 서버</li>
          <li>NVMe-oF fabric</li>
          <li>HPC scratch</li>
          <li>Filecoin SP (차세대)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2025+ 전망</h3>
        <ul className="leading-7">
          <li>E3.S 가 주 표준</li>
          <li>PCIe 5.0 mainstream</li>
          <li>CXL 통합</li>
          <li>드라이브당 30~60 TB</li>
          <li>$100/TB 목표</li>
        </ul>
        <p className="leading-7">
          E1.S/E3.S: <strong>EDSFF standard, 1U density 32 drives</strong>.<br />
          hyperscaler 표준 (Meta OCP, Microsoft, Google).<br />
          2019 spec → 2024 mainstream → 2025+ E3.S 주류.
        </p>
      </div>
    </section>
  );
}
