import SMEArchitectureViz from './viz/SMEArchitectureViz';
import SMECompareViz from './viz/SMECompareViz';
import SMEEnableFlowViz from './viz/SMEEnableFlowViz';
import SMELimitsViz from './viz/SMELimitsViz';

export default function SMEArchitecture() {
  return (
    <section id="sme-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SME 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SME(Secure Memory Encryption)</strong>: AMD EPYC의 per-page 메모리 암호화<br />
          <strong>C-bit</strong>으로 페이지 단위 암호화 여부 제어 (SEV의 기반)<br />
          <strong>TME(Transparent Memory Encryption)</strong>: 전체 DRAM을 단일 키로 투명 암호화<br />
          SME는 SEV의 <strong>하위 기술</strong> — SEV는 VM별 키로 SME 확장
        </p>
      </div>

      <SMEArchitectureViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">SME 활성화 & 사용</h3>
      </div>
      <div className="not-prose mb-4"><SMEEnableFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">SME vs TME 비교</h3>
      </div>
      <SMECompareViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특성</th>
                <th className="border border-border px-3 py-2 text-left">SME (AMD)</th>
                <th className="border border-border px-3 py-2 text-left">TME (Intel)</th>
                <th className="border border-border px-3 py-2 text-left">MKTME (Intel)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">키 개수</td>
                <td className="border border-border px-3 py-2">시스템 1개</td>
                <td className="border border-border px-3 py-2">시스템 1개</td>
                <td className="border border-border px-3 py-2">최대 2^MK_BITS</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">페이지 단위 제어</td>
                <td className="border border-border px-3 py-2">Yes (C-bit)</td>
                <td className="border border-border px-3 py-2">No (전체)</td>
                <td className="border border-border px-3 py-2">Yes (KeyID)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">VM별 키</td>
                <td className="border border-border px-3 py-2">SEV에서 확장</td>
                <td className="border border-border px-3 py-2">No</td>
                <td className="border border-border px-3 py-2">TDX에서 확장</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">알고리즘</td>
                <td className="border border-border px-3 py-2">AES-128 (XEX for SNP)</td>
                <td className="border border-border px-3 py-2">AES-128-XTS</td>
                <td className="border border-border px-3 py-2">AES-128-XTS</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">키 저장</td>
                <td className="border border-border px-3 py-2">CPU 내부</td>
                <td className="border border-border px-3 py-2">CPU 내부</td>
                <td className="border border-border px-3 py-2">Mem Controller</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">성능 오버헤드</td>
                <td className="border border-border px-3 py-2">~2-5%</td>
                <td className="border border-border px-3 py-2">~3%</td>
                <td className="border border-border px-3 py-2">~3-5%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SME의 한계 → SEV로 이어진 동기</h3>
      </div>
      <div className="not-prose mb-4"><SMELimitsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: C-bit의 설계 선택</p>
          <p>
            <strong>왜 page table에 넣었나</strong>:<br />
            - 기존 PTE의 reserved 비트 재활용 → 하위 호환성<br />
            - OS가 페이지별 policy 직접 제어 가능<br />
            - 메모리 컨트롤러가 PTE 없이도 판단 (TLB에 C-bit cache)
          </p>
          <p className="mt-2">
            <strong>대안 비교</strong>:<br />
            - Intel KeyID(MKTME): PA 상위 비트 — OS가 KeyID 할당<br />
            - ARM GPT: 별도 테이블 — 2차 조회 필요<br />
            - AMD C-bit: PTE 1비트 — 가장 단순
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            ✗ 48-bit PA 공간이 실제 47-bit (C-bit가 비트 47 사용)<br />
            ✗ OS가 C-bit 잘못 설정 시 random 데이터 접근<br />
            ✗ DMA는 별도 IOMMU 설정 필요
          </p>
        </div>

      </div>
    </section>
  );
}
