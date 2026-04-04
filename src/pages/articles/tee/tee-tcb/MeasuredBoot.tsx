import MeasuredBootViz from './viz/MeasuredBootViz';

export default function MeasuredBoot() {
  return (
    <section id="measured-boot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">측정 부팅 & 신뢰 체인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>측정 부팅(Measured Boot)</strong> — 각 단계가 다음 단계의 코드를 <strong>측정(해시)</strong>한 뒤 실행합니다<br />
          측정값(measurement) = 코드와 설정의 SHA-256 해시
        </p>
        <p>
          체인의 한 단계라도 변조되면 최종 측정값이 달라집니다<br />
          부팅 후 원격 검증자가 측정값을 확인하면 <strong>어떤 소프트웨어가 실행 중인지</strong> 증명할 수 있습니다
        </p>
        <MeasuredBootViz />
        <h3 className="text-xl font-semibold mt-6 mb-3">신뢰 체인의 시작점: Root of Trust</h3>
        <p>
          체인의 첫 단계는 <strong>하드웨어에 내장된 코드</strong>(Boot ROM)입니다<br />
          ROM은 변경 불가능하므로 무조건 신뢰합니다 — 이것이 <strong>Root of Trust</strong>입니다<br />
          Root of Trust가 손상되면 전체 측정 체인이 무의미해집니다
        </p>
      </div>
    </section>
  );
}
