import M from '@/components/ui/math';
import Halo2KeygenViz from '../components/Halo2KeygenViz';
import PLONKishCircuitViz from './viz/PLONKishCircuitViz';

export default function Keygen({ title }: { title?: string }) {
  return (
    <section id="keygen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '키 생성 (keygen_vk / keygen_pk)'}</h2>
      <div className="not-prose mb-8"><Halo2KeygenViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">PLONKish 회로 구조</h3>
      <div className="not-prose mb-8"><PLONKishCircuitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          키 생성 단계에서 회로의 고정 열, 퍼뮤테이션, 선택자를 다항식으로 컴파일합니다.
          <code>VerifyingKey</code>에는 고정 열 커밋이, <code>ProvingKey</code>에는
          도메인 다항식들(l0, l_blind, l_last)도 포함됩니다.
        </p>
        {/* keygen_vk */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">keygen_vk (keygen.rs)</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">1. <code>Circuit::configure()</code></p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>ConstraintSystem</code> 에 열/게이트/lookup 등록 &mdash; 회로 메타데이터 확정
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">2. <code>Circuit::synthesize()</code> (keygen mode)</p>
              <p className="text-xs text-muted-foreground mt-1">
                고정 열(<code>Fixed</code>)에 값 할당 + selector 비트 배치. witness는 빈 값(dummy)으로 대체
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">3. Fixed commitment 계산</p>
              <p className="text-xs text-muted-foreground mt-1">
                각 고정 열을 다항식으로 변환 &rarr; KZG commit <M>{'[f(\\tau)]_1'}</M>. permutation VK도 함께 생성
              </p>
            </div>
          </div>
        </div>

        {/* keygen_pk */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">keygen_pk &mdash; 도메인 다항식 생성</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><M>{'L_0(X)'}</M> &mdash; 첫 번째 행 indicator</p>
              <p className="text-xs text-muted-foreground mt-1">
                <M>{'L_0(\\omega^0) = 1'}</M>, 나머지 0 &mdash; permutation argument의 초기조건 검증에 사용
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><M>{'L_{\\text{last}}(X)'}</M> &mdash; 마지막 행 indicator</p>
              <p className="text-xs text-muted-foreground mt-1">
                grand product의 최종 값이 1인지 검증하는 제약에 사용
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><M>{'L_{\\text{active}}(X)'}</M> &mdash; 활성 행 indicator</p>
              <p className="text-xs text-muted-foreground mt-1">
                blinding rows를 제외한 실제 제약이 적용되는 행 범위 &mdash; gate constraint를 이 범위에만 적용
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Universal Setup (KZG Params)</h3>
        <p>
          Halo2의 KZG setup은 "universal" &mdash; 하나의 setup으로 여러 circuit을 재사용 가능합니다.
          Groth16처럼 회로마다 별도 ceremony가 필요하지 않습니다.
        </p>

        {/* KZG Params 구조 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-3"><code>ParamsKZG&lt;E: Engine&gt;</code></p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>k: u32</code></p>
              <p className="text-xs text-muted-foreground mt-1"><M>{'\\log_2(\\text{circuit size})'}</M> &mdash; 회로 크기 지수</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>n: u64</code></p>
              <p className="text-xs text-muted-foreground mt-1"><M>{'2^k'}</M> &mdash; 전체 행 수</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>g: Vec&lt;G1Affine&gt;</code></p>
              <p className="text-xs text-muted-foreground mt-1"><M>{'[\\tau^0]_1, [\\tau^1]_1, \\ldots, [\\tau^{n-1}]_1'}</M> &mdash; G1 powers of tau</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>s_g2: G2Affine</code></p>
              <p className="text-xs text-muted-foreground mt-1"><M>{'[\\tau]_2'}</M> &mdash; pairing 검증에 사용. <M>{'\\tau'}</M> = toxic waste (ceremony 후 파괴)</p>
            </div>
          </div>
        </div>

        {/* Setup 장단점 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold text-emerald-400 mb-2">장점</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>Per-circuit ceremony 불필요</li>
                <li>Ethereum KZG trusted setup 재사용 가능</li>
                <li>새 circuit deploy가 용이</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-red-400 mb-2">단점</p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>Setup 파일 크기 (수 GB)</li>
                <li>Setup 시점 이후 circuit 크기 상한 고정</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Ethereum KZG Ceremony (2023) &mdash; 140K+ 참여자. ZCash, Polygon도 자체 Powers-of-Tau ceremony 운영
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Verifying Key vs Proving Key</h3>

        {/* VK vs PK 비교 */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">VerifyingKey (작음, 공개) &mdash; ~10KB</p>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono text-xs font-semibold">fixed_commitments: Vec&lt;C&gt;</p>
                <p className="text-xs text-muted-foreground">고정 열 KZG commitment</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono text-xs font-semibold">permutation: PermutationVK</p>
                <p className="text-xs text-muted-foreground">permutation commitment</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono text-xs font-semibold">cs: ConstraintSystem</p>
                <p className="text-xs text-muted-foreground">회로 메타데이터 (gate, column 정보)</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono text-xs font-semibold">transcript_repr: Scalar</p>
                <p className="text-xs text-muted-foreground">검증용 hash &mdash; VK 자체의 fingerprint</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">용도: proof 검증 &mdash; 누구나 보유 가능. on-chain verifier contract에 배포</p>
          </div>

          <div className="rounded-lg border-l-4 border-l-amber-500 bg-card p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">ProvingKey (큼, private) &mdash; ~100MB+ (zkEVM)</p>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono text-xs font-semibold">vk: VerifyingKey</p>
                <p className="text-xs text-muted-foreground">VK를 내장</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono text-xs font-semibold">l0 / l_last / l_active_row</p>
                <p className="text-xs text-muted-foreground">Lagrange 도메인 다항식</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono text-xs font-semibold">fixed_polys / fixed_cosets</p>
                <p className="text-xs text-muted-foreground">고정 열의 coefficient + extended domain 형태</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="font-mono text-xs font-semibold">ev: Evaluator</p>
                <p className="text-xs text-muted-foreground">custom gate evaluator &mdash; 증명 중 제약 평가</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">용도: proof 생성 전용 &mdash; prover 머신에만 배포</p>
          </div>
        </div>

      </div>
    </section>
  );
}
