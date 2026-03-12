export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BitTorrent 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BitTorrent는 P2P 파일 공유 프로토콜로, Filecoin의 데이터 배포
          메커니즘을 이해하기 위한 기초 개념을 제공합니다.
          중앙 서버 없이 피어 간 직접 파일을 주고받는 분산 구조입니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">구성 요소</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`BitTorrent 구성 요소:
1. .torrent 파일: 메타데이터 (파일 조각 해시값)
2. Tracker: 피어 목록 관리 서버
3. Seeder: 완전한 파일을 보유한 피어
4. Leecher: 파일을 다운로드 중인 피어`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">.torrent 파일과 파일 조각</h3>
        <p>
          파일은 동일한 크기의 조각(256KB ~ 1MB)으로 분할됩니다.
          .torrent 파일에는 각 조각의 SHA1 해시값이 저장되어 있어,
          다운로드한 조각의 무결성을 검증할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
