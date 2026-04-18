import M from '@/components/ui/math';
import EccModuleViz from './viz/EccModuleViz';

export default function Halo2Ecc({ title }: { title?: string }) {
  return (
    <section id="halo2-ecc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'halo2-ecc: 회로 내 타원곡선 연산'}</h2>
      <div className="not-prose mb-8"><EccModuleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>halo2-ecc</strong>는 영지식증명 회로 내에서 타원곡선 암호(ECC) 연산을
          효율적으로 구현하는 라이브러리입니다. <code>bigint</code>(큰 정수 limb 표현),
          <code>fields</code>(소수체 FpChip), <code>ecc</code>(점 연산 EccChip),
          그리고 <code>secp256k1</code>/<code>bn254</code> 특화 모듈로 계층화되어 있습니다.
        </p>
        <p>
          핵심 타입인 <code>EcPoint</code>는 제네릭으로 다양한 필드와 곡선을 지원하며,
          <code>StrictEcPoint</code>는 x 좌표가 축약(reduced)된 점으로 비교 연산이 효율적입니다.
          <code>ComparableEcPoint</code> 열거형으로 최적화된 비교를 선택적으로 수행합니다.
        </p>

        {/* 모듈 계층 구조 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">halo2-ecc 모듈 계층 구조</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-sky-300"><code>bigint</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                큰 정수를 limb(88-bit) 단위로 분할 표현.
                <code>OverflowInteger</code>, <code>CRTInteger</code> &mdash; carry propagation + CRT 최적화
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-emerald-300"><code>fields</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>FpChip</code> &mdash; 소수체 연산 (add, mul, div). non-native field를 native 회로에서 simulate
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-amber-300"><code>ecc</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>EccChip</code> &mdash; 점 덧셈, 스칼라 곱, multi-scalar mult. window method로 최적화
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-purple-300"><code>secp256k1</code> / <code>bn254</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                곡선 특화 파라미터 + ECDSA 검증, Pairing 구현. endomorphism 최적화 포함
              </p>
            </div>
          </div>
        </div>

        {/* EcPoint 타입 시스템 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">EcPoint & 점 연산 타입 시스템</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>EcPoint&lt;F, FpChip&gt;</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                제네릭 타원곡선 점 &mdash; <code>x: FpChip::FieldPoint</code>, <code>y: FpChip::FieldPoint</code>.
                아직 reduce되지 않은 overflow 허용 상태
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>StrictEcPoint</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                x 좌표가 축약(reduced)된 점 &mdash; limb 값이 정규화되어 있어 비교 연산이 효율적.
                ECDSA의 최종 <code>R.x == r</code> 비교에 사용
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>ComparableEcPoint</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                열거형 &mdash; <code>Strict(StrictEcPoint)</code> / <code>NonStrict(EcPoint)</code>.
                필요한 경우에만 reduce하여 불필요한 제약 생성을 회피
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Non-native Field Arithmetic</h3>
        <p>
          Halo2의 native field는 BN254 scalar (254-bit prime)이지만,
          ECC 연산 대상은 secp256k1 (256-bit prime) &mdash; 서로 다른 field에서 연산해야 하는 "non-native" 문제입니다.
        </p>

        {/* Non-native 개요 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-2">Limb 분해 전략</p>
          <p className="text-xs text-muted-foreground">
            256-bit secp256k1 원소를 BN254 원소 3개(각 88-bit limb)로 표현.
            각 연산을 limb 단위로 수행하고 carry/modular reduction을 별도 제약으로 처리
          </p>
        </div>

        {/* 연산별 비용 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-3">연산별 비용 (constraints)</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Addition</p>
              <p className="text-xs text-muted-foreground mt-1">limb별 add + carry propagation</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Multiplication</p>
              <p className="text-xs text-muted-foreground mt-1">3x3 limb mult + modular reduction</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Inversion</p>
              <p className="text-xs text-muted-foreground mt-1">Extended Euclidean &mdash; 가장 비싼 연산</p>
            </div>
          </div>
        </div>

        {/* Native vs Non-native 비교 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-sky-400 mb-3">비용 비교: secp256k1 point add</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3 text-center">
              <p className="font-semibold text-emerald-300">Native BN254</p>
              <p className="text-2xl font-bold mt-1">~10</p>
              <p className="text-xs text-muted-foreground">constraints</p>
            </div>
            <div className="rounded border bg-card p-3 text-center">
              <p className="font-semibold text-red-300">Non-native secp256k1</p>
              <p className="text-2xl font-bold mt-1">~2,000</p>
              <p className="text-xs text-muted-foreground">constraints (200x)</p>
            </div>
          </div>
        </div>

        {/* 최적화 기법 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">최적화 기법</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Barrett reduction</p>
              <p className="text-xs text-muted-foreground mt-1">나눗셈 대신 사전계산된 상수로 모듈러 축소</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Montgomery multiplication</p>
              <p className="text-xs text-muted-foreground mt-1">곱셈과 reduction을 합쳐 단일 패스로 처리</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Lazy reduction</p>
              <p className="text-xs text-muted-foreground mt-1">중간 결과는 overflow 허용, 최종 결과만 reduce</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Window method</p>
              <p className="text-xs text-muted-foreground mt-1">scalar mult 시 비트를 w개씩 묶어 사전계산 테이블로 점프</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            사용 사례: Ethereum 서명 검증 (secp256k1), Bitcoin integration, cross-chain 검증
          </p>
        </div>

      </div>
    </section>
  );
}
