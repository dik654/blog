import EarlyFusionViz from './viz/EarlyFusionViz';

export default function EarlyFusion() {
  return (
    <section id="early-fusion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Early Fusion: 채널 결합</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Early Fusion — 입력 단계에서 뷰를 결합하여 <strong>하나의 텐서</strong>로 만든 뒤 단일 백본으로 처리<br />
          가장 직관적인 방법: 두 장의 RGB 이미지(3채널)를 채널 축(dim=1)으로 concat하여 6채널 텐서 생성<br />
          백본의 <code>conv1</code> 레이어만 <code>in_channels=6</code>으로 수정하면 나머지 구조는 동일하게 사용 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Channel Concatenation</h3>
        <p>
          구현이 가장 간단 — <code>torch.cat([view1, view2], dim=1)</code> 한 줄<br />
          문제: ImageNet pretrained 가중치는 3채널 입력 기준 — conv1을 초기화하거나 3채널 가중치를 복제하여 6채널로 확장하는 트릭 사용<br />
          뷰 수가 N이면 입력이 3N 채널 → N=8이면 24채널, conv1의 파라미터가 8배 증가
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Siamese Network 변형</h3>
        <p>
          Siamese(샴) 네트워크 — <strong>동일한 가중치를 공유</strong>하는 두 개의 백본으로 각 뷰를 인코딩<br />
          "같은 렌즈로 다른 각도를 보는 것"과 유사 — 구조적 유사성(structural similarity)을 자연스럽게 학습<br />
          각 뷰의 피처 벡터 f1, f2를 추출한 뒤 concat → 공유 분류 헤드로 전달<br />
          장점: pretrained 백본의 가중치를 그대로 사용 가능 (입력이 3채널 유지)<br />
          장점: 뷰 수가 늘어도 백본은 하나 — 파라미터 효율적
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">구현 핵심</h3>
        <p>
          Channel Concat 방식의 conv1 초기화 전략:<br />
          전략 1: pretrained conv1 가중치(3ch)를 2번 복제하여 6ch 가중치 생성 → 초기 수렴 빠름<br />
          전략 2: 새 conv1을 랜덤 초기화 → 나머지 레이어만 pretrained. lr 분리(conv1은 높은 lr)<br />
          Siamese 방식의 피처 결합:<br />
          <code>f = torch.cat([backbone(view1), backbone(view2)], dim=1)</code><br />
          concat 대신 element-wise addition <code>f = f1 + f2</code>나 max pooling도 가능하지만, concat이 정보 보존량이 가장 높다
        </p>
      </div>

      <div className="not-prose my-8"><EarlyFusionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: Channel Concat은 <strong>구현이 가장 간단</strong>하지만 conv1 재학습과 채널 비례 증가가 단점<br />
          요약 2: Siamese Network는 <strong>가중치 공유</strong>로 파라미터 효율적이며 pretrained 호환 유지<br />
          요약 3: Early Fusion의 핵심 강점은 <strong>저수준 피처 간 상호작용</strong> — 엣지·텍스처 정보가 초기 레이어부터 결합
        </p>
      </div>
    </section>
  );
}
