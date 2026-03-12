export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Swarm 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
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
        <h3 className="text-xl font-semibold mt-6 mb-3">Tit-for-Tat 전략</h3>
        <p>
          BitTorrent는 공유에 기여하지 않는 피어(free-rider)를 방지하기 위해
          Tit-for-Tat 전략을 사용합니다. 업로드를 많이 하는 피어에게
          우선적으로 다운로드 대역폭을 할당합니다.
        </p>
      </div>
    </section>
  );
}
