export default function RME() {
  return (
    <section id="rme" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Realm Management Extension</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RME(Realm Management Extension)는 CCA의 하드웨어 확장입니다.<br />
          물리 메모리의 각 페이지(Granule)가 어떤 세계에 속하는지를 관리합니다.
        </p>

        <h3>GPT (Granule Protection Table)</h3>
        <p>
          GPT는 물리 페이지별 소유권을 기록하는 테이블입니다.<br />
          Normal, Secure, Root, Realm 중 하나의 소유 세계를 지정합니다.<br />
          MMU가 메모리 접근 시 GPT를 자동으로 검사합니다.
        </p>

        <h3>Granule 전환</h3>
        <ul>
          <li><strong>Delegate</strong> — Normal → Realm으로 페이지 소유권 이전</li>
          <li><strong>Undelegate</strong> — Realm → Normal으로 반환 (내용 와이핑)</li>
        </ul>
        <p>
          전환 시 RMM이 페이지 내용을 0으로 초기화합니다.<br />
          이전 세계의 데이터가 새 세계로 유출되지 않습니다.
        </p>
      </div>
    </section>
  );
}
