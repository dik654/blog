import ContextViz from './viz/ContextViz';
import TrustZoneViz from './viz/TrustZoneViz';
import RepoStructViz from './viz/RepoStructViz';
import TrustZoneModelViz from './viz/TrustZoneModelViz';
import EntryAsmViz from './viz/EntryAsmViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & TrustZone 두 세계'}</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose mb-8">
        <TrustZoneViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>OP-TEE</strong>는 ARM TrustZone 위에서 동작하는 오픈소스 TEE OS입니다.<br />
          Normal World(리눅스)와 Secure World(OP-TEE OS)가 하드웨어 격리됩니다.<br />
          <strong>SMC(Secure Monitor Call)</strong> 명령어로 세계 전환(world switch)이 발생합니다.
        </p>

        <h3>소프트웨어 스택 (optee_os 레포 구조)</h3>
      </div>
      <div className="not-prose mb-6"><RepoStructViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>TrustZone 격리 모델</h3>
      </div>
      <div className="not-prose mb-6"><TrustZoneModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>entry_a64.S — AArch64 보안 세계 진입 (실제 코드)</h3>
      </div>
      <div className="not-prose mb-6"><EntryAsmViz /></div>
    </section>
  );
}
