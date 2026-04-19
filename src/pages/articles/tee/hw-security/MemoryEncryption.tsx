import MemEncViz from './viz/MemEncViz';
import MemEncStepViz from './viz/MemEncStepViz';
import AesXtsModeViz from './viz/AesXtsModeViz';
import MemEncPipelineViz from './viz/MemEncPipelineViz';
import MemEncDefenseViz from './viz/MemEncDefenseViz';

export default function MemoryEncryption() {
  return (
    <section id="memory-encryption" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 암호화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 암호화 원리</h3>
        <p>
          <strong>메모리 암호화</strong>: DRAM에 저장된 데이터를 HW 레벨 암호화<br />
          <strong>목적</strong>: 물리적 접근(콜드부트, 버스 스니핑, DRAM probe) 방어<br />
          <strong>위치</strong>: 메모리 컨트롤러 내장 AES 엔진<br />
          <strong>오버헤드</strong>: ~2-5% (최신 HW에서 거의 무시 가능)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">AES-XTS 모드 — 주소 기반 암호화</h3>
      </div>
      <div className="not-prose my-6"><AesXtsModeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">벤더별 메모리 암호화 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기술</th>
                <th className="border border-border px-3 py-2 text-left">키 관리</th>
                <th className="border border-border px-3 py-2 text-left">알고리즘</th>
                <th className="border border-border px-3 py-2 text-left">격리 단위</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Intel TME</td>
                <td className="border border-border px-3 py-2">시스템 1개</td>
                <td className="border border-border px-3 py-2">AES-128-XTS</td>
                <td className="border border-border px-3 py-2">전체 DRAM</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Intel MKTME</td>
                <td className="border border-border px-3 py-2">KeyID 기반 (최대 1024)</td>
                <td className="border border-border px-3 py-2">AES-128-XTS</td>
                <td className="border border-border px-3 py-2">Per-page</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">AMD SME</td>
                <td className="border border-border px-3 py-2">시스템 1개</td>
                <td className="border border-border px-3 py-2">AES-128</td>
                <td className="border border-border px-3 py-2">C-bit per page</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">AMD SEV/SNP</td>
                <td className="border border-border px-3 py-2">ASID 기반 (per-VM)</td>
                <td className="border border-border px-3 py-2">AES-128-XEX (SNP)</td>
                <td className="border border-border px-3 py-2">Per-VM</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Intel SGX MEE</td>
                <td className="border border-border px-3 py-2">EPC 전용</td>
                <td className="border border-border px-3 py-2">AES-CTR + Merkle tree</td>
                <td className="border border-border px-3 py-2">EPC 영역</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ARM MEC</td>
                <td className="border border-border px-3 py-2">MECID 기반</td>
                <td className="border border-border px-3 py-2">AES-XTS</td>
                <td className="border border-border px-3 py-2">Per-Realm</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 암호화 파이프라인</h3>
      </div>
      <div className="not-prose my-6"><MemEncPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mt-6">
        <MemEncStepViz />
      </div>
      <div className="not-prose mt-8">
        <MemEncViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">방어 vs 방어 불가</h3>
      </div>
      <div className="not-prose my-6"><MemEncDefenseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 무결성 포함 여부의 중요성</p>
          <p>
            <strong>무결성 없음 (SEV legacy, TDX 1.0)</strong>:<br />
            - 공격자가 ciphertext 변조 가능<br />
            - 복호화 시 random bytes 반환<br />
            - Deterministic 예측 가능한 변조 → 취약
          </p>
          <p className="mt-2">
            <strong>무결성 있음 (SGX MEE, SEV-SNP RMP, TDX 1.5)</strong>:<br />
            - MAC/hash tree로 변조 탐지<br />
            - Fault 발생 → 공격 중단<br />
            - Replay 방어도 포함 가능
          </p>
          <p className="mt-2">
            <strong>비용 비교</strong>:<br />
            - 무결성 없는 암호화: ~2% 오버헤드<br />
            - 무결성 추가: ~5-30% (구현 방식에 따라)<br />
            - SGX MEE Merkle tree: 가장 강력 but 가장 느림<br />
            - SEV-SNP RMP: 적절한 균형<br />
            - TDX 1.5 28-bit MAC: 최소 오버헤드
          </p>
        </div>

      </div>
    </section>
  );
}
