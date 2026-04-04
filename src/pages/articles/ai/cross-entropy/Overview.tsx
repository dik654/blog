import InformationViz from './viz/InformationViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '확률과 정보'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          확률이 높은 사건이 발생 → 당연한 결과, 놀라움 없음<br />
          확률이 낮은 사건이 발생 → 예상 밖, 매우 놀라움<br />
          <strong>정보(Information)</strong> = 이 "놀라움"을 수학으로 표현한 것
        </p>

        <h3>정보량 = -log P(x)</h3>
        <p>
          확률 P(x)가 클수록 정보량은 작음<br />
          확률 P(x)가 작을수록 정보량은 큼<br />
          로그를 쓰는 이유 — 정보 이론(Information Theory)의 관례로 비트(bit) 단위 표현이 가능
        </p>

        <h3>제비뽑기 비유</h3>
        <p>
          100장 중 99장이 빈 종이, 1장이 당첨<br />
          빈 종이를 뽑음 → 정보량 ≈ 0.014 bit (거의 놀랍지 않음)<br />
          당첨을 뽑음 → 정보량 ≈ 6.64 bit (매우 놀라움)<br />
          희귀한 사건일수록 전달되는 정보가 많음
        </p>
      </div>
      <div className="mt-8">
        <InformationViz />
      </div>
    </section>
  );
}
