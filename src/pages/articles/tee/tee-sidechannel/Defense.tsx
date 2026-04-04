export default function Defense() {
  return (
    <section id="defense" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">방어 기법 (Oblivious RAM, Constant Time)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Constant-time 프로그래밍</h3>
        <p>
          비밀 값에 따른 분기(if/else)를 제거합니다.<br />
          모든 경로에서 동일한 명령어를 실행하여 타이밍 차이를 없앱니다.
        </p>

        <h3>ORAM (Oblivious RAM)</h3>
        <p>
          메모리 접근 패턴을 랜덤화합니다.<br />
          실제 접근과 더미 접근을 섞어 관찰자가 구분할 수 없게 만듭니다.<br />
          오버헤드가 크지만(O(log N)) 가장 강력한 방어입니다.
        </p>

        <h3>캐시 파티셔닝</h3>
        <p>
          TEE 전용 캐시 영역을 하드웨어적으로 할당합니다.<br />
          Intel CAT(Cache Allocation Technology)로 캐시 way를 분리합니다.<br />
          공격자와 TEE가 캐시를 공유하지 않으면 Prime+Probe가 불가능합니다.
        </p>
      </div>
    </section>
  );
}
