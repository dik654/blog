import MigrationLiveViz from './viz/MigrationLiveViz';
import MigrationProtocolViz from './viz/MigrationProtocolViz';

export default function MigrationLive() {
  return (
    <section id="migration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SEV 라이브 마이그레이션</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SEV 라이브 마이그레이션은 게스트 메모리를 <strong>평문으로 노출하지 않은
          상태</strong>에서 호스트 간 VM을 이동시킵니다.<br />
          양측 PSP가 <strong>TEK(Transport Encryption Key)</strong>를 협상합니다.<br />
          메모리 페이지를 TEK로 재암호화한 후 전송합니다.
        </p>
      </div>

      <MigrationLiveViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>마이그레이션 프로토콜</h3>
      </div>
      <MigrationProtocolViz />
    </section>
  );
}
