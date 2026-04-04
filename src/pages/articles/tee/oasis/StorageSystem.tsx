import StorageSystemViz from './viz/StorageSystemViz';
import MKVSTreeViz from './viz/MKVSTreeViz';

export default function StorageSystem() {
  return (
    <section id="storage-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스토리지 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Oasis의 스토리지는 <strong>MKVS(Merklized Key-Value Store)</strong>를
          중심으로 구성됩니다.<br />
          Merkle Tree 기반으로 모든 상태의 암호학적 증명을 제공합니다.<br />
          LRU 캐시와 BadgerDB 백엔드로 성능을 최적화합니다.
        </p>
      </div>

      <StorageSystemViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>MKVS 트리 구조</h3>
      </div>
      <MKVSTreeViz />
    </section>
  );
}
