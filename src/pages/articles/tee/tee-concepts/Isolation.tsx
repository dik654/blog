import IsolationMechViz from './viz/IsolationMechViz';
import MEEMerkleViz from './viz/MEEMerkleViz';
import AttackerViewViz from './viz/AttackerViewViz';

export default function Isolation() {
  return (
    <section id="isolation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 격리 &amp; 암호화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 격리의 핵심 메커니즘</h3>
        <p>
          <strong>메모리 컨트롤러</strong>가 CPU ↔ DRAM 사이에서 실시간 암호화/복호화<br />
          <strong>CPU 캐시</strong>: 평문 상태 (빠른 연산 위해)<br />
          <strong>DRAM</strong>: 암호문 저장 (cold boot, probe 방어)<br />
          <strong>접근 제어</strong>: 하드웨어가 어느 코드가 어느 메모리 접근하는지 강제
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TEE별 격리 메커니즘</h3>
      </div>
      <div className="not-prose my-6"><IsolationMechViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 암호화 알고리즘</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기술</th>
                <th className="border border-border px-3 py-2 text-left">알고리즘</th>
                <th className="border border-border px-3 py-2 text-left">Mode</th>
                <th className="border border-border px-3 py-2 text-left">무결성</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">SGX (SGX1)</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">CTR</td>
                <td className="border border-border px-3 py-2">Yes (MEE)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">SEV (legacy)</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">ECB-like</td>
                <td className="border border-border px-3 py-2">No</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">SEV-SNP</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">XEX</td>
                <td className="border border-border px-3 py-2">Yes (RMP)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDX 1.0</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">XTS</td>
                <td className="border border-border px-3 py-2">No</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TDX 1.5</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">XTS + MAC</td>
                <td className="border border-border px-3 py-2">Yes (28-bit MAC)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TrustZone (OP-TEE)</td>
                <td className="border border-border px-3 py-2">Platform 의존</td>
                <td className="border border-border px-3 py-2">Varies</td>
                <td className="border border-border px-3 py-2">Optional</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SGX MEE — Memory Encryption Engine</h3>
      </div>
      <div className="not-prose my-6"><MEEMerkleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">격리 검증 — 공격자 관점</h3>
      </div>
      <div className="not-prose my-6"><AttackerViewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 메모리 격리의 한계</p>
          <p>
            <strong>방어 가능</strong>:<br />
            ✓ 직접 메모리 읽기 (host, DMA, probe)<br />
            ✓ 메모리 재매핑 / page table 조작<br />
            ✓ Cold boot attack<br />
            ✓ 물리 swap 시도
          </p>
          <p className="mt-2">
            <strong>방어 불가</strong>:<br />
            ✗ Cache side channel (접근 패턴으로 추론)<br />
            ✗ Transient execution (Spectre 등)<br />
            ✗ Power/EM analysis<br />
            ✗ CPU 자체의 물리적 공격 (decapping)
          </p>
          <p className="mt-2">
            <strong>실전 결론</strong>:<br />
            - 메모리 암호화는 <strong>필요 조건</strong>, 충분 조건 아님<br />
            - 앱 레벨 constant-time coding 필수<br />
            - Attestation으로 TCB 상태 검증<br />
            - Defense in depth 원칙 적용
          </p>
        </div>

      </div>
    </section>
  );
}
