import DataStructuresViz from './viz/DataStructuresViz';

export default function DataStructures() {
  return (
    <section id="data-structures" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 구조 상세</h2>
      <div className="not-prose mb-8"><DataStructuresViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Groth16의 세 가지 핵심 데이터 구조는 <strong>ProvingKey</strong>, <strong>VerifyingKey</strong>,
          <strong> Proof</strong>입니다. 각 구조체의 필드가 증명/검증 과정에서 어떻게 사용되는지 이해하는 것이
          Groth16 구현의 핵심입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">ProvingKey 구조체</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base">ProvingKey — 11개 필드</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">VK 내장 + 기본 포인트</p>
            <p className="font-mono text-xs"><code>vk</code>: <code>VerifyingKey&lt;E&gt;</code> — 내장된 검증 키</p>
            <p className="font-mono text-xs"><code>alpha_g1</code>: <code>E::G1Affine</code> — [α]₁</p>
            <p className="font-mono text-xs"><code>beta_g1</code>: <code>E::G1Affine</code> — [β]₁ (C 계산용)</p>
            <p className="font-mono text-xs"><code>beta_g2</code>: <code>E::G2Affine</code> — [β]₂ (B 계산용)</p>
            <p className="font-mono text-xs"><code>delta_g1</code>: <code>E::G1Affine</code> — [δ]₁ (블라인딩)</p>
            <p className="font-mono text-xs"><code>delta_g2</code>: <code>E::G2Affine</code> — [δ]₂ (블라인딩)</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">a/b query 벡터 (MSM 입력)</p>
            <p className="font-mono text-xs"><code>a_query</code>: <code>Vec&lt;E::G1Affine&gt;</code> — [aⱼ(τ)]₁</p>
            <p className="font-mono text-xs"><code>b_g1_query</code>: <code>Vec&lt;E::G1Affine&gt;</code> — [bⱼ(τ)]₁</p>
            <p className="font-mono text-xs"><code>b_g2_query</code>: <code>Vec&lt;E::G2Affine&gt;</code> — [bⱼ(τ)]₂</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">h/l query (QAP + private)</p>
            <p className="font-mono text-xs"><code>h_query</code>: <code>Vec&lt;E::G1Affine&gt;</code> — [τⁱt(τ)/δ]₁</p>
            <p className="font-mono text-xs"><code>l_query</code>: <code>Vec&lt;E::G1Affine&gt;</code> — [lcⱼ/δ]₁ (private)</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">VerifyingKey 구조체</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base">VerifyingKey — 5개 필드</h4>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">4개 커브 포인트 (페어링 입력)</p>
            <p className="font-mono text-xs"><code>alpha_g1</code>: <code>E::G1Affine</code> — [α]₁</p>
            <p className="font-mono text-xs"><code>beta_g2</code>: <code>E::G2Affine</code> — [β]₂</p>
            <p className="font-mono text-xs"><code>gamma_g2</code>: <code>E::G2Affine</code> — [γ]₂</p>
            <p className="font-mono text-xs"><code>delta_g2</code>: <code>E::G2Affine</code> — [δ]₂</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">IC 벡터 (공개 입력 검증)</p>
            <p className="font-mono text-xs"><code>ic</code>: <code>Vec&lt;E::G1Affine&gt;</code> — [lcⱼ/γ]₁ (public)</p>
            <p className="text-xs text-muted-foreground mt-1">PreparedVerifyingKey: e(α,β) 사전 계산 포함</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Proof 구조체</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base">Proof — 256 bytes (BN254)</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-1">G1×2 + G2×1 = 상수 크기</p>
            <p className="font-mono text-xs"><code>a</code>: <code>E::G1Affine</code> — A ∈ G1 — 64 bytes</p>
            <p className="font-mono text-xs"><code>b</code>: <code>E::G2Affine</code> — B ∈ G2 — 128 bytes</p>
            <p className="font-mono text-xs"><code>c</code>: <code>E::G1Affine</code> — C ∈ G1 — 64 bytes</p>
          </div>
          <p className="text-xs text-muted-foreground">총 256 bytes — 회로 크기에 무관한 상수 크기</p>
        </div>
      </div>
    </section>
  );
}
