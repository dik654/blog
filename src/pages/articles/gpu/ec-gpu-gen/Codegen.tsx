import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import MontConstViz from './viz/MontConstViz';

const templateCode = `// ec-gpu-gen이 생성하는 OpenCL 커널 (BN254 예시, 실제 생성 출력 요약)
//
// ── 주입된 상수 (build.rs가 계산) ──
#define FIELD_LIMBS 4
#define FIELD_P  { 0x3c208c16d87cfd47, 0x97816a916871ca8d,
                   0xb85045b68181585d, 0x30644e72e131a029 }
#define FIELD_R  { 0xd35d438dc58f0d9d, 0x0a78eb28f5c70b3d,
                   0x666ea36f7879462c, 0x0e0a77c19a07df2f }
#define FIELD_R2 { 0xf32cfc5b538afa89, 0xb5e71911d44501fb,
                   0x47ab1eff0a417ff6, 0x06d89f71cab8351f }
#define FIELD_INV 0x87d20782e4866389  // -p^{-1} mod 2^64
//
// ── 생성된 필드 연산 함수 ──
FIELD FIELD_add(FIELD a, FIELD b) {
    // limb별 덧셈 + 캐리 전파 + 조건부 감산 (a+b >= p이면 -p)
}
FIELD FIELD_sub(FIELD a, FIELD b) { /* ... */ }
FIELD FIELD_mul(FIELD a, FIELD b) {
    // Montgomery CIOS: 4-limb 기준 16번 mul + 환원
}
// ── 생성된 곡선 연산 함수 ──
POINT POINT_add(POINT a, POINT b) { /* Jacobian 혼합 덧셈 */ }
POINT POINT_double(POINT a)       { /* Jacobian 더블링 */ }
POINT POINT_mul(POINT p, FIELD s) { /* double-and-add */ }`;

export default function Codegen() {
  return (
    <section id="codegen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">코드 생성: 템플릿 &rarr; 커브 전용 커널</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ec-gpu-gen의 핵심은 <strong>템플릿 + 파라미터 주입</strong> 패턴이다.<br />
          필드 연산(add, sub, mul, inv)과 곡선 연산(point_add, point_double, point_mul)의
          알고리즘 로직은 공통이고, <strong>소수 p의 limb 값과 Montgomery 상수만</strong> 커브마다 다르다.
        </p>
        <CodePanel title="생성된 OpenCL 커널 예시 (BN254)" code={templateCode} annotations={[
          { lines: [3, 14], color: 'sky', note: '주입된 상수: p, R, R2, inv (BN254 고유값)' },
          { lines: [16, 22], color: 'emerald', note: '필드 연산: add, sub, mul' },
          { lines: [24, 26], color: 'amber', note: '곡선 연산: point_add, double, mul' },
        ]} />

        <CitationBlock source="ec-gpu -- GpuField trait" citeKey={2} type="code"
          href="https://github.com/filecoin-project/ec-gpu">
          <p className="text-xs">
            GpuField 트레이트는 one(), modulus(), r(), r2(), inv() 메서드를 정의한다.<br />
            이 트레이트를 구현한 모든 필드 타입에 대해 ec-gpu-gen이 자동으로 GPU 커널을 생성한다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">Montgomery 상수 계산</h3>
        <p>
          세 가지 Montgomery 상수 <code>R</code>, <code>R2</code>, <code>inv</code>는 빌드 타임에 정확히 한 번 계산된다.<br />
          이 상수들이 GPU 커널의 모든 필드 곱셈에서 사용되므로, 정확성이 전체 증명의 정합성을 결정한다.
        </p>
        <MontConstViz />
      </div>
    </section>
  );
}
