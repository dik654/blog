import M from '@/components/ui/math';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ProveViz from './viz/ProveViz';
import { codeRefs } from './codeRefs';

export default function Prove({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="prove" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prove</h2>
      <div className="not-prose mb-8"><ProveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('groth16-create-proof', codeRefs['groth16-create-proof'])} />
          <span className="text-[10px] text-muted-foreground self-center">create_proof() A,B</span>
          <CodeViewButton onClick={() => onCodeRef('groth16-c-calc', codeRefs['groth16-c-calc'])} />
          <span className="text-[10px] text-muted-foreground self-center">C 계산 + 블라인딩</span>
        </div>
        <p>
          증명자는 PK와 witness를 사용하여 증명 <strong>Proof = (A, B, C)</strong>를 생성합니다.
          <br />
          BN254 기준으로 G1 2개 + G2 1개 = <strong>256 bytes</strong>의 간결한 증명입니다.
          <br />
          핵심 연산은 MSM(Multi-Scalar Multiplication)이며, 복잡도는 O(n)입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">A 계산 (G1)</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-2">
          <M display>{'A = [\\alpha]_1 + \\sum_j w_j \\cdot [a_j(\\tau)]_1 + r \\cdot [\\delta]_1'}</M>
          <div className="grid gap-2 sm:grid-cols-3 mt-2">
            <div className="rounded border p-3 bg-sky-50 dark:bg-sky-950/30">
              <p className="font-mono text-xs font-semibold">[α]₁</p>
              <p className="text-xs text-muted-foreground">구조적 태그 (α 포함을 보장)</p>
            </div>
            <div className="rounded border p-3 bg-emerald-50 dark:bg-emerald-950/30">
              <p className="font-mono text-xs font-semibold">Σ wⱼ·[aⱼ(τ)]₁</p>
              <p className="text-xs text-muted-foreground">witness에 의한 a(τ) 값</p>
            </div>
            <div className="rounded border p-3 bg-emerald-50 dark:bg-emerald-950/30">
              <p className="font-mono text-xs font-semibold">r·[δ]₁</p>
              <p className="text-xs text-muted-foreground">블라인딩 (영지식성)</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            결과: <M>{'A = [\\alpha + a(\\tau) + r\\delta]_1'}</M>
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">B 계산 (G2 + G1)</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">B (G2) + B' (G1) 이중 계산</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <M display>{'B \\in G_2:\\; [\\beta]_2 + \\sum_j w_j \\cdot [b_j(\\tau)]_2 + s \\cdot [\\delta]_2'}</M>
            <M display>{"B' \\in G_1:\\; [\\beta]_1 + \\sum_j w_j \\cdot [b_j(\\tau)]_1 + s \\cdot [\\delta]_1"}</M>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">G1 ↔ G2 변환이 불가능한 이유</p>
            <p className="text-xs text-muted-foreground">B는 검증에서 e(A, B)에 사용 (G2 필요)</p>
            <p className="text-xs text-muted-foreground">B'는 C 계산에서 r·B'로 사용 (G1 필요)</p>
            <p className="text-xs text-muted-foreground">→ 두 그룹 간 변환이 불가능하므로 두 버전을 따로 계산</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">C 계산 (G1)</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">C 계산 (비공개 + QAP + 블라인딩)</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">3가지 구성 요소</p>
            <p className="font-mono text-xs"><M>{'\\sum_{j \\in \\text{private}} w_j \\cdot l\\_query[j\\,\']'}</M> — 비공개 변수 기여</p>
            <p className="font-mono text-xs"><M>{'\\sum_i h_i \\cdot h\\_query[i]'}</M> — QAP 만족의 증거</p>
            <p className="font-mono text-xs"><M>{'s \\cdot A + r \\cdot B\' - r \\cdot s \\cdot [\\delta]_1'}</M> — 블라인딩</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">블라인딩 항 전개</p>
            <div className="font-mono text-xs text-muted-foreground space-y-0.5">
              <p>s·A = sα + s·a(τ) + rsδ</p>
              <p>r·B' = rβ + r·b(τ) + rsδ</p>
              <p>-rs·δ</p>
              <p className="font-medium text-foreground">합계 = sα + s·a(τ) + rβ + r·b(τ) + rsδ</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">영지식성: r, s 블라인딩</h3>
        <p>
          매 증명마다 새로운 랜덤 r, s를 사용합니다.
          <br />
          같은 witness라도 매번 다른 (A, B, C)가 생성됩니다.
          <br />
          개별 증명에서 witness 정보를 추출하는 것이 불가능합니다.
          <br />
          이것이 <strong>완전 영지식(perfect zero-knowledge)</strong>을 보장합니다.
        </p>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-2">
          <h4 className="font-semibold text-base mb-2">영지식성 보장 원리</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded border p-3 bg-red-50 dark:bg-red-950/30">
              <p className="text-xs font-medium">r = s = 0 이면</p>
              <p className="text-xs text-muted-foreground mt-1">같은 witness → 항상 같은 증명 → 정보 유출 위험</p>
            </div>
            <div className="rounded border p-3 bg-emerald-50 dark:bg-emerald-950/30">
              <p className="text-xs font-medium">r, s ≠ 0 이면</p>
              <p className="text-xs text-muted-foreground mt-1">같은 witness라도 매번 다른 증명 → 시뮬레이션 가능</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            → "시뮬레이터"가 witness 없이도 동일 분포의 증명 생성 가능
          </p>
        </div>
      </div>
    </section>
  );
}
