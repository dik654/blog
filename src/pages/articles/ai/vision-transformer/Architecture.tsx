import ArchitectureViz from './viz/ArchitectureViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ViT / DeiT / Swin 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ViT는 시작점이다. 그 이후 등장한 변형들은 각각 ViT의 약점을 해결하며 발전했다.
          DeiT는 데이터 효율, Swin은 연산 효율, BEiT/MAE는 자기지도 학습 — 각각 다른 병목을 공략한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ViT: 기본 구조</h3>
        <p>
          구조: Patch Embedding → [CLS] + Position → L개 Transformer Encoder → MLP Head.
          각 Encoder 블록: <strong>LayerNorm → Multi-Head Self-Attention → 잔차 연결 → LayerNorm → MLP(GELU) → 잔차 연결</strong>.
          BERT와 거의 동일하되 입력만 다르다 — 텍스트 토큰 대신 패치 토큰.
        </p>
        <p>
          모델 크기: ViT-Base(L=12, D=768, Heads=12, 86M), ViT-Large(L=24, D=1024, Heads=16, 307M), ViT-Huge(L=32, D=1280, Heads=16, 632M).
          문제: JFT-300M(3억 장)으로 사전학습해야 ImageNet에서 CNN을 넘김 — ImageNet(120만 장)만으로는 CNN보다 떨어진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">DeiT: 데이터 효율적 학습</h3>
        <p>
          Touvron et al. (2021), Facebook AI.
          핵심 질문: "JFT-300M 없이 ViT를 학습할 수 있는가?"
          답: <strong>지식 증류(Knowledge Distillation)</strong> + 강력한 데이터 증강.
        </p>
        <p>
          <strong>Distillation Token</strong> — [CLS] 외에 하나의 토큰을 더 추가.
          교사 모델(RegNet, CNN 기반)의 출력을 이 토큰이 학습.
          결과: [CLS]는 ground truth에서, [DIS]는 교사에서 학습 → 두 가지 감독 신호.
          CNN의 귀납 편향을 증류를 통해 간접적으로 ViT에 전달하는 전략.
        </p>
        <p>
          데이터 증강: RandAugment, Mixup(α=0.8), CutMix(α=1.0), Random Erasing.
          Stochastic Depth(drop_path_rate=0.1) + Label Smoothing(0.1) 병행.
          ImageNet 120만 장만으로 83.1% Top-1 달성 — ViT의 데이터 장벽을 허물었다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Swin Transformer: 윈도우 기반 계층 구조</h3>
        <p>
          Liu et al. (2021), Microsoft Research.
          ViT의 O(n²) 어텐션은 고해상도에서 비실용적 — 1024x1024 이미지라면 4096개 토큰, 어텐션 행렬만 64MB.
          Swin의 해결책: <strong>윈도우 어텐션(Window Attention)</strong>.
        </p>
        <p>
          <strong>Window Attention</strong>: 이미지를 7x7 패치 윈도우로 분할, 각 윈도우 내에서만 어텐션 → 복잡도 O(49²) per window = <strong>O(n) 전체</strong>.
          문제: 윈도우 간 정보 교환 없음.
          해결: <strong>Shifted Window(SW-MSA)</strong> — 매 레이어마다 윈도우를 (3, 3) 픽셀 이동.
          홀수 레이어는 일반 윈도우, 짝수 레이어는 시프트 윈도우 → 인접 윈도우 간 정보가 자연스럽게 흐른다.
        </p>
        <p>
          <strong>4단계 계층 구조</strong>: Stage 1(H/4) → Stage 2(H/8) → Stage 3(H/16) → Stage 4(H/32).
          각 단계에서 Patch Merging으로 해상도를 절반으로 줄이고 채널을 2배로 늘린다 — CNN의 풀링과 유사.
          이 구조 덕분에 FPN(Feature Pyramid Network)과 직접 결합 가능 → 객체 탐지, 세그멘테이션에 직접 적용.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">BEiT / MAE: 자기지도 사전학습</h3>
        <p>
          <strong>BEiT</strong>(Bao et al., 2022): BERT의 MLM(Masked Language Modeling)을 비전에 적용.
          이미지 패치를 dVAE(discrete VAE)로 시각 토큰으로 변환 → 40%를 마스킹 → ViT가 원래 시각 토큰 예측.
          라벨 없이 대규모 이미지에서 의미 있는 표현을 학습한 후 fine-tuning.
        </p>
        <p>
          <strong>MAE</strong>(He et al., 2022, Meta AI): BEiT보다 단순하고 효율적.
          패치의 <strong>75%를 마스킹</strong> → 인코더는 보이는 25%만 처리 → 가벼운 디코더가 마스킹된 패치의 픽셀을 복원.
          높은 마스킹 비율이 핵심 — 낮은 비율에서는 인접 패치 보간만으로 복원 가능하지만, 75%에서는 의미적 이해가 필수.
          인코더가 전체 토큰의 25%만 처리하므로 사전학습 효율이 4배 향상.
        </p>
      </div>

      <div className="not-prose my-8"><ArchitectureViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">모델</th>
                <th className="border border-border px-4 py-2 text-left">핵심 혁신</th>
                <th className="border border-border px-4 py-2 text-left">해결한 문제</th>
                <th className="border border-border px-4 py-2 text-left">ImageNet Top-1</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['ViT-L/16', 'NLP Transformer 직접 적용', '글로벌 어텐션', '87.8% (JFT)'],
                ['DeiT-B', '증류 토큰 + 데이터 증강', '데이터 효율', '83.1%'],
                ['Swin-B', '윈도우 어텐션 + 계층 구조', '연산 효율', '83.5%'],
                ['BEiT', '시각 토큰 마스킹 예측', '자기지도 학습', '83.2%'],
                ['MAE', '75% 마스킹 + 픽셀 복원', '사전학습 효율', '83.6%'],
              ].map(([model, innovation, problem, acc]) => (
                <tr key={model}>
                  <td className="border border-border px-4 py-2 font-medium">{model}</td>
                  <td className="border border-border px-4 py-2">{innovation}</td>
                  <td className="border border-border px-4 py-2">{problem}</td>
                  <td className="border border-border px-4 py-2">{acc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
