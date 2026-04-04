export default function Cache() {
  return (
    <section id="cache" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cache Timing 공격 (Prime+Probe)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          캐시 메모리의 접근 시간 차이를 이용한 공격입니다.<br />
          캐시 적중(hit)과 미스(miss)의 수십 나노초 차이로 비밀을 유추합니다.
        </p>

        <h3>Prime+Probe 3단계</h3>
        <ol>
          <li><strong>Prime</strong> — 공격자가 특정 캐시 셋을 자신의 데이터로 채웁니다.</li>
          <li><strong>Wait</strong> — TEE가 실행되면서 일부 캐시 라인을 교체합니다.</li>
          <li><strong>Probe</strong> — 공격자가 채웠던 데이터에 다시 접근하여 시간을 측정합니다.</li>
        </ol>

        <h3>정보 유출 원리</h3>
        <p>
          접근이 느린 캐시 라인 = TEE가 사용하여 공격자 데이터를 밀어낸 라인입니다.<br />
          반복 측정으로 TEE의 메모리 접근 패턴을 복원할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
