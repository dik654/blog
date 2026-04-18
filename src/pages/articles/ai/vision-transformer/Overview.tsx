import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CNN의 한계와 ViT의 등장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CNN(Convolutional Neural Network)은 10년간 컴퓨터 비전을 지배했다.
          핵심 무기는 <strong>로컬 수용 영역(Local Receptive Field)</strong> — 3x3 또는 5x5 커널이 이미지의 작은 영역만 본다.
          먼 픽셀 간 관계를 포착하려면 여러 층을 쌓아야 하고, 이 깊이가 곧 연산 비용이다.
        </p>
        <p>
          2020년, Dosovitskiy et al.이 <strong>"An Image is Worth 16x16 Words"</strong>를 발표한다.
          아이디어: 이미지를 16x16 패치로 자르고 각 패치를 토큰으로 취급, NLP의 Transformer를 <strong>거의 수정 없이</strong> 적용.
          결과: ImageNet에서 CNN(EfficientNet) 대비 동등 이상 성능, JFT-300M 사전학습 시 88.55% Top-1 달성.
        </p>
        <p>
          <strong>글로벌 셀프 어텐션</strong>이 로컬 컨볼루션을 대체하는 패러다임 전환.
          모든 패치가 첫 레이어부터 다른 모든 패치를 직접 참조 — CNN의 단계적 확장(pooling → deeper layers) 없이 즉시 전체 이미지의 관계를 포착한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CNN vs ViT: 핵심 차이</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">특성</th>
                <th className="border border-border px-4 py-2 text-left">CNN</th>
                <th className="border border-border px-4 py-2 text-left">ViT</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['수용 영역', '로컬 (3x3, 5x5)', '글로벌 (전체 패치)'],
                ['귀납 편향', '지역성 + 이동 등변성', '없음 (데이터에서 학습)'],
                ['데이터 효율', '적은 데이터에 유리', '대규모 데이터에 유리'],
                ['연산 패턴', 'O(k²·C²·HW)', 'O(n²·d) — 패치 수 기반'],
                ['공간 구조', '해상도 점진 감소', '고정 토큰 시퀀스'],
              ].map(([feat, cnn, vit]) => (
                <tr key={feat}>
                  <td className="border border-border px-4 py-2 font-medium">{feat}</td>
                  <td className="border border-border px-4 py-2">{cnn}</td>
                  <td className="border border-border px-4 py-2">{vit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4">
          CNN의 귀납 편향(locality, translation equivariance)은 사전 지식 역할 — 적은 데이터에서 빠르게 수렴한다.
          ViT는 이런 편향 없이 데이터에서 직접 패턴을 학습 — 대규모 데이터에서 CNN을 압도하지만, 소규모에서는 과적합 위험이 있다.
          이 트레이드오프가 ViT 변형들(DeiT, Swin, BEiT)의 설계 동기가 된다.
        </p>
      </div>

      <div className="not-prose my-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: CNN은 로컬 수용 영역 → 먼 관계 포착에 깊이 필요.<br />
          요약 2: ViT는 이미지를 패치 토큰으로 분할, NLP Transformer를 그대로 적용 → 첫 레이어부터 글로벌 어텐션.<br />
          요약 3: 귀납 편향의 유무가 데이터량에 따른 성능 차이를 결정 — 소규모 CNN, 대규모 ViT.
        </p>
      </div>
    </section>
  );
}
