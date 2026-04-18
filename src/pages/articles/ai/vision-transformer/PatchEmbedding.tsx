import PatchEmbeddingViz from './viz/PatchEmbeddingViz';

export default function PatchEmbedding() {
  return (
    <section id="patch-embedding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">패치 임베딩 & 위치 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ViT의 첫 단계: 2D 이미지를 1D 토큰 시퀀스로 변환.
          이 과정이 <strong>패치 임베딩(Patch Embedding)</strong> — NLP에서 단어를 토큰으로 변환하는 것과 동일한 역할.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">1. 패치 분할 (Patch Partitioning)</h3>
        <p>
          224x224 이미지를 P x P (기본 16x16) 패치로 분할.
          패치 개수 N = (224/16)² = <strong>196개</strong>.
          각 패치는 16x16x3 = <strong>768개</strong>의 픽셀값을 가진 벡터.
          패치가 곧 Transformer의 "단어" — NLP에서 문장을 단어로 토큰화하듯, 이미지를 패치로 토큰화한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2. 선형 프로젝션 (Linear Projection)</h3>
        <p>
          각 패치 벡터(768차원)를 학습 가능한 행렬 <strong>E ∈ R^(P²·C × D)</strong>로 모델 차원 D에 매핑.
          <strong>z = x·E + b</strong> — 단순한 선형 변환이지만, 구현은 <strong>Conv2d(3, D, kernel_size=16, stride=16)</strong>로 한다.
          stride=patch_size이므로 한 번의 합성곱 연산으로 패치 분할과 프로젝션을 동시에 수행 — 별도 분할 로직 불필요.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3. CLS 토큰</h3>
        <p>
          BERT에서 가져온 아이디어.
          시퀀스 맨 앞에 학습 가능한 <strong>[CLS] 토큰</strong>을 추가 — 총 197개 토큰.
          Transformer를 통과한 후 [CLS]의 최종 hidden state가 이미지 전체의 표현(representation).
          이 벡터를 MLP 분류 헤드에 입력하여 클래스를 예측한다.
          [CLS]는 특정 패치에 종속되지 않으므로 모든 패치 정보를 통합한 글로벌 표현을 학습한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4. 위치 인코딩 (Position Embedding)</h3>
        <p>
          Transformer는 순서 정보가 없다 — 패치의 2D 공간 위치를 알려주어야 한다.
          ViT는 <strong>학습 가능한 1D 위치 임베딩(Learnable Position Embedding)</strong>을 사용.
          각 위치에 D차원 벡터를 할당하고 토큰 임베딩에 더한다:
          <strong>z₀ = [CLS; p₁E; p₂E; ...p_NE] + E_pos</strong>.
        </p>
        <p>
          Sinusoidal 인코딩 대비 학습 임베딩이 ViT에서 더 효과적 — 2D 공간 구조를 데이터에서 직접 학습.
          실제로 학습된 위치 임베딩을 시각화하면 인접 패치끼리 유사한 벡터를 가지며, 행/열 구조가 자연스럽게 형성된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">5. 패치 크기의 영향</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">패치 크기</th>
                <th className="border border-border px-4 py-2 text-left">토큰 수</th>
                <th className="border border-border px-4 py-2 text-left">어텐션 연산</th>
                <th className="border border-border px-4 py-2 text-left">특징</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['32x32', '49', '2,401', '빠르지만 거칠다'],
                ['16x16', '196', '38,416', '기본 — 속도와 정밀 균형'],
                ['14x14', '256', '65,536', '세밀하지만 느리다'],
                ['8x8', '784', '614,656', '연구용 — 실전 부담 큼'],
              ].map(([size, tokens, attn, feat]) => (
                <tr key={size}>
                  <td className="border border-border px-4 py-2 font-medium">{size}</td>
                  <td className="border border-border px-4 py-2">{tokens}</td>
                  <td className="border border-border px-4 py-2">{attn}</td>
                  <td className="border border-border px-4 py-2">{feat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2">
          어텐션 복잡도 O(n²) — 토큰 수를 2배로 늘리면 연산량은 4배.
          패치 크기 선택은 정밀도와 효율 사이의 핵심 트레이드오프.
        </p>
      </div>

      <div className="not-prose my-8"><PatchEmbeddingViz /></div>
    </section>
  );
}
