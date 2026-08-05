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

        <h3 className="text-xl font-semibold mt-8 mb-3">Soft Error 원인</h3>
        <ul className="leading-7">
          <li>우주선 (cosmic ray, alpha particle)</li>
          <li>전기 노이즈</li>
          <li>열 fluctuation</li>
          <li>전압 변동</li>
          <li>고도 올라갈수록 에러율 증가</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">에러 빈도</h3>
        <ul className="leading-7">
          <li>해수면 — GB 당 연간 ~1 에러</li>
          <li>고고도 — GB 당 연간 ~10 에러</li>
          <li>1 TB 머신 — 연간 1,000~10,000 에러</li>
          <li>데이터센터 규모 — 측정 가능한 수준</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">SECDED</h3>
        <p className="leading-7">
          Single Error Correct, Double Error Detect. 64-bit 데이터 + 8-bit parity = 72 bit transfer. Hamming code + parity 조합.
        </p>
        <ul className="leading-7">
          <li>1 bit flip — 자동 정정</li>
          <li>2 bit flip — 감지, 정정 불가</li>
          <li>3 bit+ — 보장 없음</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">Advanced ECC</h3>
        <ul className="leading-7">
          <li><strong>ChipKill (IBM)</strong> — chip 전체 고장 복구</li>
          <li><strong>Intel SDDC</strong> — single device data correction</li>
          <li><strong>AMD SEV-SNP</strong> — 확장 보호</li>
          <li><strong>DDR5 on-die ECC</strong> — DIMM 레벨 보정</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 손상 결과</h3>
        <ul className="leading-7">
          <li><strong>Ethereum validator</strong> — 잘못된 서명 → slashing. bad state → fork 무효화. 32 ETH stake 위험.</li>
          <li><strong>Bitcoin full node</strong> — 잘못된 hash → chain fork. mining 작업 낭비, 신뢰 침해.</li>
          <li><strong>Database</strong> — 잘못된 query 결과, silent corruption, backup 무결성 손실.</li>
          <li><strong>HPC/AI</strong> — 잘못된 gradient, 부정확한 모델, 연구 무효화.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 오버헤드</h3>
        <p className="leading-7">
          64 bit 당 8 bit 추가 = 12.5% bit 오버헤드. 병렬 path 라 속도 패널티 없음, ~1 cycle 약간의 latency 추가. 신뢰성 대비 무시 가능한 비용.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ECC 지원</h3>
        <ul className="leading-7">
          <li><strong>CPU</strong> — Intel Xeon 전부, Intel Core 는 W-series 만, AMD Ryzen UDIMM 전부, EPYC 전부.</li>
          <li><strong>Motherboard</strong> — 서버 칩셋 표준, 워크스테이션 W680/TRX40, 컨슈머는 칩셋별 상이.</li>
          <li><strong>Memory</strong> — "ECC" 라벨 확인. Kingston, Micron, Samsung. non-ECC 대비 10~20% 비쌉니다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">ECC 가 필요한 경우</h3>
        <ul className="leading-7">
          <li>필수 — 서버, 블록체인 노드, 데이터베이스, AI/ML 학습</li>
          <li>권장 — 워크스테이션</li>
          <li>불필요 — 게이밍, 일상 데스크톱</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">비용 분석</h3>
        <ul className="leading-7">
          <li>ECC premium — 16GB 당 $10~$20</li>
          <li>방지된 에러 1건 — priceless</li>
          <li>데이터 손상 복구 — $$$</li>
          <li>downtime — 시간당 $1,000+</li>
        </ul>
        <p className="leading-7">
          ECC: <strong>1 bit 자동 정정, 2 bit 감지 (SECDED)</strong>.<br />
          12.5% bit overhead, no speed penalty.<br />
          server/blockchain/DB 필수, gaming 불필요.
        </p>
      </div>
    </section>
  );
}
