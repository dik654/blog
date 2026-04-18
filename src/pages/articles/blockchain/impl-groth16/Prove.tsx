import ProveViz from './viz/ProveViz';
import M from '@/components/ui/math';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Prove({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="prove" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 생성 (Prover)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          h(x) = (a(x)·b(x) - c(x)) / t(x) — QAP 만족 확인이 증명의 첫 단계
          <br />
          나머지가 0이 아니면 witness가 잘못된 것 — Option::None 즉시 반환
          <br />
          블라인딩 팩터 r, s를 매번 새로 생성 — 같은 witness여도 다른 증명
        </p>
        <p className="leading-7">
          A = [α]₁ + Σwⱼ[aⱼ(τ)]₁ + r[δ]₁ — 지식계수 + QAP + 블라인딩
          <br />
          B = [β]₂ + Σwⱼ[bⱼ(τ)]₂ + s[δ]₂ — G2 위에서 동일 구조
          <br />
          C = private기여 + h기여 + sA + rB' - rsδ — 세 항의 결합
        </p>
      </div>
      <div className="not-prose mb-8">
        <ProveViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          witness[j]=0인 변수는 MSM에서 건너뜀 — 스칼라 곱 비용이 가장 크므로 0 체크가 효과적
          <br />
          C의 블라인딩 sA+rB'-rsδ: 전개하면 교차항 rsδ가 소거되어 검증 방정식이 정확히 성립
          <br />
          B를 G1(B')과 G2(B) 두 곳에서 계산 — C에 r·B'이 필요해서 G1 버전도 유지
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Prover 수식 유도 및 최적화</h3>

        {/* 입출력 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">입력 / 출력</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">입력</p>
              <p><code>ProvingKey</code> (trusted setup 결과) + witness <M>{'\\mathbf{w}'}</M> (공개 입력 포함)</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">출력</p>
              <p>증명 <M>{'(A, B, C)'}</M> — G1/G2 포인트 3개</p>
            </div>
          </div>
        </div>

        {/* Step 1: h(x) 계산 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Step 1. 다항식 h(x) 계산</h4>
          <div className="text-sm space-y-1">
            <M display>{'A(x) = \\sum_j w_j \\cdot a_j(x), \\quad B(x) = \\sum_j w_j \\cdot b_j(x), \\quad C(x) = \\sum_j w_j \\cdot c_j(x)'}</M>
            <M display>{'p(x) = A(x) \\cdot B(x) - C(x), \\quad h(x) = p(x) \\,/\\, t(x)'}</M>
          </div>
          <div className="grid grid-cols-1 gap-1 text-sm mt-2">
            <p>1) FFT로 witness → 평가 형태 변환</p>
            <p>2) 확장 도메인(blowup 2x)에서 A, B, C 계산</p>
            <p>3) 점별 곱: <M>{'\\text{eval}_A \\cdot \\text{eval}_B - \\text{eval}_C = \\text{eval}_p'}</M></p>
            <p>4) 소멸 다항식 역수로 나눔</p>
            <p>5) Inverse FFT → h(x) 계수</p>
            <p className="text-muted-foreground">비용: 3-4회 FFT + 점별 연산 / <M>{'\\deg(h) < m{-}1'}</M></p>
          </div>
        </div>

        {/* Step 2: 블라인딩 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Step 2. 블라인딩 팩터</h4>
          <p className="text-sm"><M>{'r, s \\xleftarrow{\\$} \\mathbb{F}_p'}</M> — 증명마다 새로 샘플링, 영지식성 + 재랜덤화 제공</p>
        </div>

        {/* Step 3-5: A, B, C 계산 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Step 3-5. 증명 원소 계산</h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">A (G1)</p>
              <M display>{'A = [\\alpha]_1 + \\sum_j w_j \\cdot [a_j(\\tau)]_1 + r \\cdot [\\delta]_1'}</M>
              <p className="text-muted-foreground"><code>w[j] == 0</code>이면 MSM에서 건너뜀</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">B (G1 + G2)</p>
              <M display>{'B_2 = [\\beta]_2 + \\sum_j w_j \\cdot [b_j(\\tau)]_2 + s \\cdot [\\delta]_2'}</M>
              <M display>{'B_1 = [\\beta]_1 + \\sum_j w_j \\cdot [b_j(\\tau)]_1 + s \\cdot [\\delta]_1'}</M>
              <p className="text-muted-foreground"><M>{'B_1'}</M>은 C 계산에만 사용 (G1 버전 유지)</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">C (G1)</p>
              <M display>{'C = \\sum_{j \\in \\text{private}} w_j \\cdot L[j] + \\sum_i h_i \\cdot H[i] + s \\cdot A + r \\cdot B_1 - r \\cdot s \\cdot [\\delta]_1'}</M>
              <p className="text-muted-foreground">sA + rB₁ - rsδ: 전개 시 교차항 소거 → 검증 방정식 성립</p>
            </div>
          </div>
        </div>

        {/* 검증 방정식 유도 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">검증 방정식 유도</h4>
          <div className="text-sm space-y-2">
            <M display>{'e(A, B_2) = e(\\alpha, \\beta) \\cdot e(\\text{IC}_{\\text{sum}}, [\\gamma]_2) \\cdot e(C, [\\delta]_2)'}</M>
            <p>A, B₂ 전개 후 쌍선형성으로 분배:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background rounded p-2">공개 항 → <M>{'\\text{IC}_{\\text{sum}} \\cdot \\gamma'}</M></div>
              <div className="bg-background rounded p-2">비공개 항 → C의 일부</div>
              <div className="bg-background rounded p-2"><M>{'h \\cdot t(\\tau)'}</M> 항 → C의 QAP 부분</div>
              <div className="bg-background rounded p-2">블라인딩 → <M>{'sA + rB_1 - rs\\delta'}</M> 소거</div>
            </div>
          </div>
        </div>

        {/* 비용 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Prover 비용 (<M>{'m'}</M>-제약 회로)</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">h 다항식</p>
              <p><M>{'O(m \\log m)'}</M> via FFT</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">MSM</p>
              <p>A: <M>{'O(n)'}</M> G1 / B₂: <M>{'O(n)'}</M> G2 / C: <M>{'O(n+m)'}</M> G1</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium"><M>{'m = 10^6'}</M> 기준</p>
              <p>FFT ~1-2s, MSM ~2-3s, 총 ~3-5s (CPU) / GPU ~0.3-0.5s</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">메모리</p>
              <p>witness <M>{'O(n)'}</M> + FFT <M>{'O(m)'}</M> + PK <M>{'O(m)'}</M> = 500MB-10GB</p>
            </div>
          </div>
        </div>

        {/* 프레임워크 + 보안 */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">Batch Prover & 보안 요건</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">배치 프로버</p>
              <p><strong>bellperson</strong> (Filecoin) · <strong>ark-groth16</strong> (Arkworks) · <strong>rapidsnark</strong> (C++) · <strong>snarkjs</strong> (JS) · <strong>nano-gpu-snark</strong> (CUDA)</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">보안 필수 사항</p>
              <p>r, s 매번 신규 생성 / toxic waste 삭제 확인 / witness = 유효한 회로 실행 / 암호학적 RNG 사용</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
