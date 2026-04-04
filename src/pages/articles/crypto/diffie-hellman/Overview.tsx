export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">키 교환 문제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Alice와 Bob이 도청자가 있는 공개 채널에서 비밀 키를 공유하고 싶다.
          <br />
          키를 직접 전송하면 도청자도 키를 얻게 된다.
          <br />
          Diffie-Hellman(1976)은 이 문제를 최초로 해결한 공개키 프로토콜이다.
        </p>
        <p>
          핵심 아이디어: 양쪽이 각자의 비밀을 섞어 보내면,
          상대방은 자기 비밀로 공유 키를 완성할 수 있지만,
          도청자는 두 "섞인 값"만으로는 공유 키를 복원할 수 없다.
          <br />
          이 안전성은{' '}
          <a href="/crypto/discrete-log" className="text-indigo-400 hover:underline">이산로그 문제(DLP)</a>에 기반한다.
        </p>
      </div>
    </section>
  );
}
