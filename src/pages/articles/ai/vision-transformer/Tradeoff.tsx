import TradeoffViz from './viz/TradeoffViz';

export default function Tradeoff() {
  return (
    <section id="tradeoff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CNN vs ViT: 데이터량별 트레이드오프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ViT가 항상 CNN보다 좋은 것은 아니다.
          <strong>데이터량</strong>이 성능 교차점을 결정하며, 해상도, 학습 시간, 메모리도 실전 선택의 핵심 기준이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">데이터량에 따른 성능 교차</h3>
        <p>
          <strong>소규모 데이터 (&lt;10K)</strong>: CNN의 귀납 편향이 결정적 우위.
          지역성(locality)과 이동 등변성(translation equivariance)이 사전 지식 역할 — 적은 샘플로도 합리적인 특징을 추출.
          ViT는 이런 사전 지식 없이 모든 패턴을 데이터에서 학습해야 하므로 과적합 발생.
        </p>
        <p>
          <strong>중간 규모 (~100K)</strong>: 교차점.
          DeiT의 증류 + 증강 전략으로 이 구간에서도 ViT가 경쟁력 확보.
          하지만 순수 ViT는 여전히 CNN에 근접하는 수준.
        </p>
        <p>
          <strong>대규모 데이터 (&gt;100K)</strong>: ViT의 유연한 표현 학습이 CNN을 압도.
          귀납 편향 없이 데이터에서 직접 최적 패턴을 학습 — CNN이 사전 가정한 지역성을 넘어선 글로벌 패턴 포착.
          JFT-300M에서 ViT-Huge는 88.55%로 CNN 기반 모델(EfficientNet-L2, 88.35%)을 넘겼다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">귀납 편향의 양면성</h3>
        <p>
          CNN의 귀납 편향: <strong>장점</strong> — 적은 데이터에서 빠른 수렴, 학습 안정성.
          <strong>단점</strong> — 데이터가 충분할 때 표현력의 상한이 낮다.
          지역성 가정이 글로벌 패턴(예: 이미지 전체에 걸친 물체 관계)을 학습하는 데 오히려 방해.
        </p>
        <p>
          ViT의 무편향: <strong>장점</strong> — 표현력 상한이 높다, 데이터가 곧 성능.
          <strong>단점</strong> — 수렴이 느리고, 적은 데이터에서 불안정.
          편향이 없으므로 학습 초기에 "어디를 봐야 하는지" 자체를 배워야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">해상도와 연산량</h3>
        <p>
          CNN: 해상도 2배(224→448) 시 연산량 ~4배. 특징맵 크기가 H x W에 비례하므로 O(H·W).
          ViT: 패치 크기 고정 시 토큰 수가 4배 → 어텐션 연산 <strong>16배</strong>(O(n²)). 실용적이지 않다.
          해결: 패치 크기를 키우거나(32x32), Swin처럼 윈도우 어텐션으로 O(n)을 달성.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">학습 자원 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">항목</th>
                <th className="border border-border px-4 py-2 text-left">ViT-Base</th>
                <th className="border border-border px-4 py-2 text-left">ResNet-50</th>
                <th className="border border-border px-4 py-2 text-left">Swin-Base</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['파라미터', '86M', '25M', '88M'],
                ['FLOPs (224)', '17.6G', '4.1G', '15.4G'],
                ['학습 시간 (8xA100)', '~2.5일', '~1일', '~2일'],
                ['메모리', '~24GB', '~8GB', '~16GB'],
                ['해상도 증가 비용', 'O(n²) 폭발', '~4x 선형적', '~4x 선형적'],
              ].map(([item, vit, resnet, swin]) => (
                <tr key={item}>
                  <td className="border border-border px-4 py-2 font-medium">{item}</td>
                  <td className="border border-border px-4 py-2">{vit}</td>
                  <td className="border border-border px-4 py-2">{resnet}</td>
                  <td className="border border-border px-4 py-2">{swin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2">
          실전 판단 기준: 데이터 10만 장 이상 + GPU 자원 충분 → ViT/Swin.
          데이터 적거나 추론 속도 우선 → CNN(EfficientNet, ConvNeXt).
          DeiT 전략(증류 + 증강)을 쓰면 중간 규모에서도 ViT 활용 가능.
        </p>
      </div>

      <div className="not-prose my-8"><TradeoffViz /></div>
    </section>
  );
}
