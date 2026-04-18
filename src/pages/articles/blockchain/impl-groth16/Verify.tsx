import VerifyViz from './viz/VerifyViz';
import M from '@/components/ui/math';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Verify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">검증 (Verifier)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          e(A,B) = e(α,β) · e(IC_sum, [γ]₂) · e(C, [δ]₂)
          <br />
          IC_sum = ic[0] + Σ public[j]·ic[j+1] — 공개 입력으로 MSM 결합
          <br />
          페어링 3개만으로 완료 — 회로 크기와 무관하게 항상 O(1)
        </p>
        <p className="leading-7">
          증명 크기: A(G1, 64B) + B(G2, 128B) + C(G1, 64B) = 256바이트
          <br />
          e(α,β)는 검증키에 사전 계산 — 매 검증마다 Fp12 곱셈 1회로 대체
          <br />
          Ethereum zk-rollup 검증의 사실상 표준 — precompile로 온체인 검증 가능
        </p>
      </div>
      <div className="not-prose mb-8">
        <VerifyViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          input.is_zero() 체크 — 0인 공개 입력은 IC_sum에 기여 안 함, 스칼라 곱 절약
          <br />
          LHS == RHS는 Fp12 (12개 Fp 원소) 비교 — 빠르지만 페어링 자체가 비용의 대부분
          <br />
          증명 변조 감지: A, B, C 중 하나라도 변경하면 페어링 등식이 깨져 즉시 reject
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Verifier 상세 및 온체인 검증</h3>

        {/* 입출력 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">입력 / 출력</h4>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">VerifyingKey</p>
              <p className="text-muted-foreground">회로 당 고정</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">공개 입력</p>
              <p><M>{'[x_0, x_1, \\ldots, x_l]'}</M></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">증명</p>
              <p><M>{'(A, B, C)'}</M> → accept / reject</p>
            </div>
          </div>
        </div>

        {/* 검증 방정식 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">검증 방정식</h4>
          <M display>{'e(A, B) = e(\\alpha, \\beta) \\cdot e(\\text{IC}_{\\text{sum}}, \\gamma) \\cdot e(C, \\delta)'}</M>
          <p className="text-sm mt-2"><M>{'\\text{IC}_{\\text{sum}} = \\text{IC}[0] + \\sum_{i=1}^{l} x_i \\cdot \\text{IC}[i]'}</M></p>
          <p className="text-sm text-muted-foreground mt-1">동치: <M>{'e(A,B) \\cdot e(-\\text{IC}_{\\text{sum}}, \\gamma) \\cdot e(-C, \\delta) \\cdot e(-\\alpha, \\beta) = 1'}</M></p>
        </div>

        {/* 사전 계산 최적화 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">최적화: <M>{'e(\\alpha, \\beta)'}</M> 사전 계산</h4>
          <p className="text-sm"><M>{'\\alpha, \\beta'}</M>는 VK에 고정 → setup 시 <M>{'\\mathbb{F}_{p^{12}}'}</M> 원소로 한 번만 계산해 저장</p>
          <p className="text-sm text-muted-foreground">페어링 4개 → 3개로 감소</p>
        </div>

        {/* 전체 알고리즘 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">전체 검증 알고리즘</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">1. 증명 파싱 & 유효성</p>
              <p>A, C ∈ G1 on-curve / B ∈ G2 on-curve / 부분군 소속 확인 (cofactor clearing)</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">2. IC_sum 계산</p>
              <p><code>IC_sum = vk.IC[0]</code> → <code>x_i != 0</code>이면 <code>IC_sum += x_i * vk.IC[i]</code></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">3. 페어링 등식 확인</p>
              <p>LHS = <M>{'e(A, B)'}</M>, RHS = <code>vk.alpha_beta</code> * <M>{'e(\\text{IC}_{\\text{sum}}, \\gamma) \\cdot e(C, \\delta)'}</M></p>
              <p className="text-muted-foreground">LHS == RHS → accept</p>
            </div>
          </div>
        </div>

        {/* Multi-pairing 배칭 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Multi-pairing 배칭</h4>
          <M display>{'e_{\\text{prod}}([A, -\\text{IC}_{\\text{sum}}, -C], \\; [B, \\gamma, \\delta]) = \\text{vk.alpha\\_beta}'}</M>
          <p className="text-sm text-muted-foreground">단일 Miller loop + 단일 final exponentiation → final exp 2개 절약 (~2x 속도 향상)</p>
        </div>

        {/* 성능 & 크기 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">성능 & 증명 크기</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">검증 시간</p>
              <p>Naive (3 페어링): ~6ms</p>
              <p>Multi-pairing: ~2ms</p>
              <p>사전 계산 + multi: ~1-1.5ms</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Ethereum 온체인</p>
              <p>EIP-196/197 precompile</p>
              <p>~150K gas / ~$10 (30 gwei)</p>
            </div>
            <div className="bg-background rounded p-3 col-span-2">
              <p className="font-medium">증명 크기</p>
              <div className="grid grid-cols-4 gap-2 mt-1">
                <div className="text-center">
                  <p>A (G1)</p>
                  <p className="text-muted-foreground">64B / 32B</p>
                </div>
                <div className="text-center">
                  <p>B (G2)</p>
                  <p className="text-muted-foreground">128B / 64B</p>
                </div>
                <div className="text-center">
                  <p>C (G1)</p>
                  <p className="text-muted-foreground">64B / 32B</p>
                </div>
                <div className="text-center">
                  <p className="font-medium">합계</p>
                  <p className="text-muted-foreground">256B / 128B</p>
                </div>
              </div>
              <p className="text-muted-foreground mt-1">비압축 전송이 일반적 — 검증 속도 우선</p>
            </div>
          </div>
        </div>

        {/* 보안 고려사항 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">보안 고려사항</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">부분군 공격</p>
              <p className="text-muted-foreground">B가 r-torsion 부분군 밖 → cofactor 곱으로 방어</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">가단성 (Malleability)</p>
              <p className="text-muted-foreground">같은 공개 입력에 다른 (A,B,C) 가능 — 앱 레벨에서 nonce로 방어</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Toxic waste 유출</p>
              <p className="text-muted-foreground">setup 랜덤값 노출 시 모든 증명 위조 가능</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">공개 입력 위조</p>
              <p className="text-muted-foreground">IC_sum에 올바르게 인코딩, γ 분리로 검증</p>
            </div>
          </div>
        </div>

        {/* 온체인 검증 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">온체인 검증 (Solidity)</h4>
          <div className="text-sm space-y-2">
            <div className="bg-background rounded p-3">
              <p className="font-medium mb-1">Proof 구조체</p>
              <p><code>G1Point A</code> · <code>G2Point B</code> · <code>G1Point C</code></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium mb-1">VerifyingKey 구조체</p>
              <p><code>G1Point alpha_g1</code> · <code>G2Point beta_g2, gamma_g2, delta_g2</code> · <code>G1Point[] IC</code></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium mb-1">verifyProof 흐름</p>
              <p>IC_sum = <code>IC[0]</code> → 루프: <code>Pairing.add(IC_sum, Pairing.mul(IC[i+1], input[i]))</code></p>
              <p><code>Pairing.check([A, neg(IC_sum), neg(C), neg(alpha)], [B, gamma, delta, beta])</code></p>
            </div>
          </div>
        </div>

        {/* 프로덕션 사용처 */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">프로덕션 사용처</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <div className="bg-background rounded p-2 text-center"><strong>Zcash Sapling</strong><br />note spend/output</div>
            <div className="bg-background rounded p-2 text-center"><strong>Tornado Cash</strong><br />withdrawal proof</div>
            <div className="bg-background rounded p-2 text-center"><strong>ZK Rollups</strong><br />state transition</div>
            <div className="bg-background rounded p-2 text-center"><strong>Iden3</strong><br />identity attestation</div>
            <div className="bg-background rounded p-2 text-center"><strong>Filecoin</strong><br />proof of replication</div>
          </div>
        </div>
      </div>
    </section>
  );
}
