import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멀티뷰 문제란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          멀티뷰(Multi-view) — 같은 대상을 <strong>여러 시점</strong>에서 촬영한 이미지를 동시에 활용하는 문제<br />
          구조물 안정성 대회에서 정면·측면 2장, 자율주행에서 전방·후방·측면 6장, 의료영상에서 정면·측면 X-ray 2장 등<br />
          단일 뷰로는 가려진 영역(occlusion)이나 깊이 정보를 놓치지만, 여러 뷰를 결합하면 3D 구조를 추론할 수 있다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 단순 Concat으로는 부족한가</h3>
        <p>
          가장 단순한 접근 — 두 장의 RGB(3채널)를 채널 축으로 이어붙여 <strong>H×W×6 텐서</strong> 생성<br />
          문제 1: 사전학습(pretrained) 모델의 첫 번째 conv 레이어는 3채널 입력 가정 → 재학습 필요<br />
          문제 2: 뷰 간의 <strong>공간적 대응 관계</strong>(어떤 영역이 같은 부분을 보는지)를 모델이 스스로 파악해야 함<br />
          문제 3: 뷰 수가 늘어날수록 입력 채널이 비례 증가하여 메모리·연산량 급증
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 퓨전 전략</h3>
        <p>
          <strong>Early Fusion</strong> — 입력 단계에서 채널을 결합하거나 Siamese 구조로 인코딩. 저수준 피처(엣지, 텍스처) 간 상호작용이 초기 레이어부터 가능<br />
          <strong>Late Fusion</strong> — 각 뷰를 독립 백본으로 인코딩한 뒤 피처 벡터를 결합. ImageNet pretrained 모델을 그대로 활용 가능<br />
          <strong>Attention Fusion</strong> — Cross-attention으로 뷰 간 정보를 동적으로 교환. 어떤 뷰의 어떤 영역이 중요한지 자동 학습
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">전략</th>
                <th className="border border-border px-4 py-2 text-left">결합 시점</th>
                <th className="border border-border px-4 py-2 text-left">장점</th>
                <th className="border border-border px-4 py-2 text-left">단점</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Early Fusion', '입력 단계', '저수준 피처 상호작용', '입력 채널 증가'],
                ['Late Fusion', '피처 단계', 'Pretrained 활용 가능', '뷰 간 상호작용 부족'],
                ['Attention Fusion', '피처 교환', '동적 가중치 학습', 'O(n^2) 복잡도'],
              ].map(([name, when, pro, con]) => (
                <tr key={name}>
                  <td className="border border-border px-4 py-2 font-medium">{name}</td>
                  <td className="border border-border px-4 py-2">{when}</td>
                  <td className="border border-border px-4 py-2">{pro}</td>
                  <td className="border border-border px-4 py-2">{con}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="not-prose my-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: 멀티뷰 문제는 <strong>같은 대상의 여러 시점 이미지</strong>를 활용하여 단일 뷰의 정보 한계를 극복<br />
          요약 2: 단순 채널 Concat은 간단하지만 <strong>뷰 간 관계 학습을 모델에 위임</strong>하고 pretrained 호환성을 잃음<br />
          요약 3: Early/Late/Attention 세 전략은 <strong>결합 시점과 상호작용 깊이</strong>가 다르며 데이터·연산 환경에 따라 선택
        </p>
      </div>
    </section>
  );
}
