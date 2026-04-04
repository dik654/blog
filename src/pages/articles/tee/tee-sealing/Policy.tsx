export default function Policy() {
  return (
    <section id="policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MRENCLAVE vs MRSIGNER 정책</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-4 mb-3">MRENCLAVE 봉인</h3>
        <p>
          MRENCLAVE는 enclave 바이너리의 <strong>SHA-256 해시</strong>입니다.<br />
          동일한 코드에서만 개봉할 수 있습니다.
        </p>
        <ul>
          <li><strong>장점</strong> — 가장 강한 격리. 코드 1바이트만 달라도 다른 키가 파생됩니다.</li>
          <li><strong>단점</strong> — 코드 업데이트 시 이전 봉인 데이터에 접근할 수 없습니다. 마이그레이션 절차가 필요합니다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">MRSIGNER 봉인</h3>
        <p>
          MRSIGNER는 enclave 서명자의 <strong>공개키 해시</strong>입니다.<br />
          동일 서명자가 배포한 enclave면 개봉할 수 있습니다.<br />
          단, ISV_SVN(보안 버전)이 봉인 시점 이상이어야 합니다.
        </p>
        <ul>
          <li><strong>장점</strong> — 업데이트 호환. v1에서 봉인한 데이터를 v2에서 개봉 가능합니다.</li>
          <li><strong>단점</strong> — 서명 키 유출 시 공격자가 악성 enclave를 배포하여 개봉할 위험이 있습니다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">선택 기준</h3>
        <p>
          비밀의 수명이 길고 업데이트가 잦다면 <strong>MRSIGNER</strong>를 선택합니다.
          <br />
          보안이 최우선이고 코드가 고정적이라면 <strong>MRENCLAVE</strong>를 선택합니다.
        </p>
      </div>
    </section>
  );
}
