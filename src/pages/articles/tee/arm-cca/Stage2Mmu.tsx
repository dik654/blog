import Stage2Viz from './viz/Stage2Viz';
import RttEntryViz from './viz/RttEntryViz';
import RttCreateViz from './viz/RttCreateViz';
import DataCreateCompareViz from './viz/DataCreateCompareViz';
import ProtectedIpaSplitViz from './viz/ProtectedIpaSplitViz';
import RealmTlbViz from './viz/RealmTlbViz';

export default function Stage2Mmu() {
  return (
    <section id="stage2-mmu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Realm Stage 2 — RTT 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">메모리 변환 3단계</h3>

        <Stage2Viz />

        <p>
          Realm 메모리 접근은 <strong>Stage 1 + Stage 2 + GPC</strong> 3단 검사 통과<br />
          <strong>Stage 2 = RTT(Realm Translation Table)</strong> — RMM이 관리<br />
          Host VMM은 Realm의 Stage 2 직접 수정 불가 → RMI 경유
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RTT 구조</h3>
        <div className="not-prose mb-4"><RttEntryViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">RTT_CREATE — 테이블 계층 확장</h3>
        <div className="not-prose mb-4"><RttCreateViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">DATA_CREATE vs DATA_CREATE_UNKNOWN</h3>
        <div className="not-prose mb-4"><DataCreateCompareViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Protected vs Unprotected IPA</h3>
        <div className="not-prose mb-4"><ProtectedIpaSplitViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">TLB 관리 — Realm 격리</h3>
        <div className="not-prose mb-4"><RealmTlbViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 Stage 2를 RMM이 관리하는가</p>
          <p>
            일반 ARM 가상화: <strong>Host Hypervisor(EL2)가 Stage 2 관리</strong><br />
            CCA Realm: <strong>RMM(EL2 Realm)이 Stage 2 관리</strong>
          </p>
          <p className="mt-2">
            <strong>이유</strong>:<br />
            - Host Hypervisor는 untrusted<br />
            - Host가 S2 조작하면 Realm 메모리 우회 가능<br />
            - 대안: RMM이 소유 + RMI로 호출 중재
          </p>
          <p className="mt-2">
            <strong>비용</strong>:<br />
            - 모든 S2 수정이 SMC/HVC 오버헤드<br />
            - 페이지 매핑 지연 — 대량 할당 시 bottleneck<br />
            - 완화: RTT batch API, 큰 granule 지원
          </p>
          <p className="mt-2">
            <strong>TDX 비교</strong>:<br />
            - TDX도 S-EPT를 TD Module이 관리<br />
            - 구조는 거의 동일 — naming만 RTT vs S-EPT
          </p>
        </div>

      </div>
    </section>
  );
}
