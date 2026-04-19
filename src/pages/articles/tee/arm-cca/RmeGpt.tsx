import GptViz from './viz/GptViz';
import RmeBootCheckViz from './viz/RmeBootCheckViz';
import GptTableLayoutViz from './viz/GptTableLayoutViz';
import PasDelegateViz from './viz/PasDelegateViz';
import GpfFaultViz from './viz/GpfFaultViz';
import MecOptionViz from './viz/MecOptionViz';

export default function RmeGpt() {
  return (
    <section id="rme-gpt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RME &amp; Granule Protection Table</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">RME — Realm Management Extension</h3>
        <p>
          <strong>RME</strong>: ARMv9-A 선택적 확장(ID_AA64PFR0_EL1.RME 필드)<br />
          <strong>4개 PAS(Physical Address Space)</strong>와 <strong>GPT</strong> 하드웨어 지원 추가<br />
          <strong>Monitor(EL3)</strong>가 GPT 갱신 → World 경계 정의
        </p>

        <div className="not-prose mb-4"><RmeBootCheckViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">GPT 구조 & 동작</h3>

        <GptViz />

        <p>
          <strong>GPT</strong>: 물리 메모리 granule(보통 4KB)마다 <strong>소유 PAS</strong> 기록하는 테이블<br />
          CPU/DMA가 메모리 접근 시 하드웨어가 자동 조회 → 불일치 시 <strong>GPF(Granule Protection Fault)</strong> 발생<br />
          MMU와 독립된 <strong>2차 보호 계층</strong> — Stage 2 이후에도 확인
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GPT 테이블 형식</h3>
        <div className="not-prose mb-4"><GptTableLayoutViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">PAS 전환 — SMC Delegate/Undelegate</h3>
        <div className="not-prose mb-4"><PasDelegateViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Granule 타입 (RMM이 관리)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">타입</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
                <th className="border border-border px-3 py-2 text-left">크기</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>Undelegated</code></td>
                <td className="border border-border px-3 py-2">NS PAS — Host 메모리</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Delegated</code></td>
                <td className="border border-border px-3 py-2">Realm PAS로 전환됨, 미할당</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RD (Realm Descriptor)</code></td>
                <td className="border border-border px-3 py-2">Realm 메타데이터</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Rec</code></td>
                <td className="border border-border px-3 py-2">Realm Execution Context (vCPU)</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>RTT</code></td>
                <td className="border border-border px-3 py-2">Realm Translation Table</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Data</code></td>
                <td className="border border-border px-3 py-2">Realm 실제 메모리 페이지</td>
                <td className="border border-border px-3 py-2">4KB</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">GPF(Granule Protection Fault) 처리</h3>
        <div className="not-prose mb-4"><GpfFaultViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">MEC — Memory Encryption Contexts (옵션)</h3>
        <div className="not-prose mb-4"><MecOptionViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: GPT vs EPT/S-EPT</p>
          <p>
            <strong>Intel EPT/S-EPT</strong>: 가상화 전용 — IPA→PA 매핑 + 권한<br />
            <strong>ARM GPT</strong>: 가상화와 독립 — PA별 소유 World만 기록
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ 단순함 — 4개 PAS만 관리<br />
            ✓ DMA에도 자동 적용 — SMMU와 통합<br />
            ✓ 외부 RAS 이벤트 처리 편함
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            ✗ per-Realm 메모리 격리는 RMM이 Stage 2로 따로 구현<br />
            ✗ GPT 갱신은 TLB shootdown 비용<br />
            ✗ 4KB granule 단위 → 대용량 메모리 시 GPT 크기 증가
          </p>
        </div>

      </div>
    </section>
  );
}
