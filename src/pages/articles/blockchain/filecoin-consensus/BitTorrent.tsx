export default function BitTorrent() {
  return (
    <section id="bittorrent" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BitTorrent 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin의 데이터 배포 메커니즘을 이해하기 위해 BitTorrent의 핵심 아키텍처를
          살펴봅니다. BitTorrent는 P2P 파일 공유 프로토콜로, 분산 스토리지의
          기초가 되는 개념들을 제공합니다.
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
        <h3 className="text-xl font-semibold mt-6 mb-3">Swarm 프로토콜</h3>
        <p>
          Seeder로부터 파일 조각을 전송받으면, 수신자도 해당 조각을
          다른 피어에게 공유하게 됩니다. 이 방식으로 네트워크 전체의
          다운로드 속도가 향상되며, 단일 서버 의존도를 줄입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`파일 공유 흐름:
1. .torrent 파일에서 해시 목록 확인
2. Tracker에서 Seeder/Leecher 목록 획득
3. 여러 피어로부터 조각 병렬 다운로드
4. SHA1 해시로 각 조각 무결성 검증
5. 수신한 조각을 다른 피어에게 재공유 (Swarm)`}</code>
        </pre>
      </div>
    </section>
  );
}
