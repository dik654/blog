export default function Realm() {
  return (
    <section id="realm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Realm 생성 & 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Realm은 CCA에서 기밀 VM을 실행하는 격리 단위입니다.<br />
          RMM(Realm Management Monitor)이 Realm의 생성, 실행, 종료를 관리합니다.
        </p>

        <h3>Realm 생명주기</h3>
        <ol>
          <li><strong>생성</strong> — 하이퍼바이저가 RMM에 Realm 생성 요청</li>
          <li><strong>초기화</strong> — RMM이 메모리 할당 + 초기 측정값 계산</li>
          <li><strong>실행</strong> — Realm vCPU가 격리된 환경에서 코드 실행</li>
          <li><strong>종료</strong> — RMM이 메모리 와이핑 + 메타데이터 정리</li>
        </ol>

        <h3>RMM의 역할</h3>
        <p>
          RMM은 EL2-Realm에서 실행됩니다.<br />
          하이퍼바이저(EL2-Normal)와 같은 권한 레벨이지만 다른 세계입니다.<br />
          Realm과 Normal World 간 데이터 교환은 RMM이 중재합니다.
        </p>
      </div>
    </section>
  );
}
