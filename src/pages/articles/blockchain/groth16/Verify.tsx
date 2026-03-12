export default function Verify() {
  return (
    <section id="verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Verify</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          검증자는 VK, 공개 입력, 증명 (A, B, C)만으로 <strong>페어링 3회</strong>에 검증을 완료합니다.
          회로 크기에 무관한 O(1) 검증이므로 온체인(Ethereum L1) 검증에 적합합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">검증 알고리즘</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`입력: VK, public_inputs = [s₁, ..., sₗ], Proof = (A, B, C)

① IC_sum 계산:
   IC_sum = ic[0] + Σⱼ₌₁ˡ sⱼ · ic[j]

② 검증 방정식:
   e(A, B) ?= e(α,β) · e(IC_sum, [γ]₂) · e(C, [δ]₂)
   ═══════    ══════   ════════════════   ═══════════
     LHS      상수      공개 입력 검증     나머지 전부`}</code></pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">검증 방정식 유도</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`A·B = (α + a(τ) + rδ)(β + b(τ) + sδ) 를 전개하면:

  αβ                              → e(α, β)
  + α·b(τ) + β·a(τ) + c(τ)       → IC_sum·γ + C의 일부·δ
  + h(τ)·t(τ)                    → C의 일부·δ
  + sα + s·a(τ) + rβ + r·b(τ) + rsδ → C의 블라인딩·δ

γ로 나눈 값은 [γ]₂와 페어링하면 γ 소거
δ로 나눈 값은 [δ]₂와 페어링하면 δ 소거

∴ e(A, B) = e(α,β) · e(IC_sum, [γ]₂) · e(C, [δ]₂)`}</code></pre>

        <h3 className="text-xl font-semibold mt-8 mb-4">보안 분석</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">건전성 (Soundness)</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>- 잘못된 witness: QAP 불만족으로 h(x) 계산 실패</li>
              <li>- QAP 우회 시도: alpha, beta가 구조적 일관성 강제</li>
              <li>- 증명 변조: 페어링 등식 불일치로 검증 실패</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Toxic Waste 위험</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>- tau 노출: 가짜 h(tau) 구성 가능</li>
              <li>- alpha, beta 노출: 구조적 태그 위조 가능</li>
              <li>- delta 노출: 임의의 C 생성 가능</li>
              <li>- 대응: MPC 세레모니 (1-of-N 신뢰)</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Groth16 특성 요약</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`증명 크기     : G1×2 + G2×1 = 256 bytes
검증 시간     : O(1) — 페어링 3회
증명 생성     : O(n) — MSM 크기
Trusted Setup : 필요 (회로별 1회)
영지식성       : 완전 (perfect ZK)
건전성        : 계산적 (computational)`}</code></pre>
      </div>
    </section>
  );
}
