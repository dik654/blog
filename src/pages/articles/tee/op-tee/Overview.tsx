import ContextViz from './viz/ContextViz';
import TrustZoneViz from './viz/TrustZoneViz';
import RepoStructViz from './viz/RepoStructViz';
import TrustZoneModelViz from './viz/TrustZoneModelViz';
import EntryAsmViz from './viz/EntryAsmViz';
import TrustZoneNsBitViz from './viz/TrustZoneNsBitViz';
import RepoDirTreeViz from './viz/RepoDirTreeViz';
import HwRequirementsViz from './viz/HwRequirementsViz';
import UseCasesViz from './viz/UseCasesViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & TrustZone 두 세계'}</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose mb-8">
        <TrustZoneViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">OP-TEE 개요</h3>
        <p>
          <strong>OP-TEE</strong>(Open Portable TEE): ARM TrustZone 위 오픈소스 TEE OS<br />
          <strong>Linaro 주도</strong>: 2014년 ST-Ericsson에서 오픈소스화, Linaro가 유지보수<br />
          <strong>GlobalPlatform TEE 스펙 구현</strong>: Trusted Application API 표준 준수<br />
          <strong>2-world 모델</strong>: Normal World(Linux) ↔ Secure World(OP-TEE OS)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TrustZone의 근본 원리</h3>
      </div>
      <div className="not-prose mb-6"><TrustZoneNsBitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">소프트웨어 스택 (optee_os 레포 구조)</h3>
      </div>
      <div className="not-prose mb-6"><RepoStructViz /></div>
      <div className="not-prose mb-6"><RepoDirTreeViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TrustZone 격리 모델</h3>
      </div>
      <div className="not-prose mb-6"><TrustZoneModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">하드웨어 요구사항</h3>
      </div>
      <div className="not-prose mb-6"><HwRequirementsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">entry_a64.S — AArch64 보안 세계 진입 (실제 코드)</h3>
      </div>
      <div className="not-prose mb-6"><EntryAsmViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 사용 사례</h3>
      </div>
      <div className="not-prose mb-6"><UseCasesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: OP-TEE vs SGX 철학 차이</p>
          <p>
            <strong>OP-TEE (TrustZone)</strong>:<br />
            - 모놀리식 보안 OS (TEE OS kernel)<br />
            - Secure world 전체 신뢰<br />
            - 작은 TCB (200K LoC + TA 코드)<br />
            - 모바일·임베디드 강점
          </p>
          <p className="mt-2">
            <strong>Intel SGX</strong>:<br />
            - Per-enclave 격리 (앱 내부 작은 영역)<br />
            - No OS inside enclave<br />
            - 매우 작은 TCB (SGX SDK runtime만)<br />
            - 서버·데이터센터 강점
          </p>
          <p className="mt-2">
            <strong>선택 기준</strong>:<br />
            - 모바일/IoT + TEE OS 필요: OP-TEE<br />
            - 서버 + 작은 enclave: SGX<br />
            - VM 단위 격리: TDX/SEV/CCA<br />
            - 각각 다른 use case에 최적화
          </p>
        </div>

      </div>
    </section>
  );
}
