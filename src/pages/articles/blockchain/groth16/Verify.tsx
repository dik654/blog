import M from '@/components/ui/math';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import VerifyViz from './viz/VerifyViz';
import { codeRefs } from './codeRefs';

export default function Verify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Verify</h2>
      <div className="not-prose mb-8"><VerifyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('groth16-verify', codeRefs['groth16-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">verify_proof()</span>
          <CodeViewButton onClick={() => onCodeRef('groth16-prepared-vk', codeRefs['groth16-prepared-vk'])} />
          <span className="text-[10px] text-muted-foreground self-center">PreparedVerifyingKey</span>
        </div>
        <p>
          검증자는 VK, 공개 입력, 증명 (A, B, C)만으로 <strong>페어링 3회</strong>에 검증을 완료합니다.
          <br />
          회로 크기에 무관한 O(1) 검증입니다.
          <br />
          온체인(Ethereum L1) 검증에 적합합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">검증 알고리즘</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <p className="text-xs text-muted-foreground">
            입력: VK, <code>public_inputs</code> = [s₁, ..., sₗ], Proof = (A, B, C)
          </p>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">① IC_sum 계산</p>
            <M display>{'IC_{sum} = ic[0] + \\sum_{j=1}^{l} s_j \\cdot ic[j]'}</M>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">② 검증 방정식</p>
            <M display>{'e(A, B) \\stackrel{?}{=} e(\\alpha, \\beta) \\cdot e(IC_{sum}, [\\gamma]_2) \\cdot e(C, [\\delta]_2)'}</M>
            <div className="grid grid-cols-4 gap-1 mt-2 text-center">
              <div className="rounded bg-white dark:bg-neutral-800 p-1 text-xs">LHS</div>
              <div className="rounded bg-white dark:bg-neutral-800 p-1 text-xs">상수</div>
              <div className="rounded bg-white dark:bg-neutral-800 p-1 text-xs">공개 입력 검증</div>
              <div className="rounded bg-white dark:bg-neutral-800 p-1 text-xs">나머지 전부</div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">검증 방정식 유도</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">A·B 전개로 검증 방정식 유도</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">A·B 곱 전개</p>
            <M display>{'A \\cdot B = (\\alpha + a(\\tau) + r\\delta)(\\beta + b(\\tau) + s\\delta)'}</M>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">각 항이 매핑되는 페어링</p>
            <p className="font-mono text-xs"><M>{'\\alpha\\beta'}</M> → <M>{'e(\\alpha, \\beta)'}</M></p>
            <p className="font-mono text-xs"><M>{'\\alpha \\cdot b(\\tau) + \\beta \\cdot a(\\tau) + c(\\tau)'}</M> → IC_sum·γ + C의 일부·δ</p>
            <p className="font-mono text-xs"><M>{'h(\\tau) \\cdot t(\\tau)'}</M> → C의 일부·δ</p>
            <p className="font-mono text-xs"><M>{'s\\alpha + s \\cdot a(\\tau) + r\\beta + r \\cdot b(\\tau) + rs\\delta'}</M> → C의 블라인딩·δ</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium mb-1">γ, δ 소거 원리</p>
            <p className="text-xs text-muted-foreground">γ로 나눈 값은 [γ]₂와 페어링하면 γ 소거</p>
            <p className="text-xs text-muted-foreground">δ로 나눈 값은 [δ]₂와 페어링하면 δ 소거</p>
            <p className="text-xs font-medium mt-1">
              ∴ <M>{'e(A,B) = e(\\alpha,\\beta) \\cdot e(IC_{sum}, [\\gamma]_2) \\cdot e(C, [\\delta]_2)'}</M>
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">보안 분석</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">건전성 (Soundness)</h4>
            <ul className="space-y-1 text-sm">
              <li>- 잘못된 witness: QAP 불만족으로 h(x) 계산 실패</li>
              <li>- QAP 우회 시도: alpha, beta가 구조적 일관성 강제</li>
              <li>- 증명 변조: 페어링 등식 불일치로 검증 실패</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Toxic Waste 위험</h4>
            <ul className="space-y-1 text-sm">
              <li>- tau 노출: 가짜 h(tau) 구성 가능</li>
              <li>- alpha, beta 노출: 구조적 태그 위조 가능</li>
              <li>- delta 노출: 임의의 C 생성 가능</li>
              <li>- 대응: MPC 세레모니 (1-of-N 신뢰)</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Groth16 특성 요약</h3>
        <div className="rounded-lg border p-4 not-prose text-sm">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">증명 크기</span>
              <span className="text-muted-foreground">G1x2 + G2x1 = 256 bytes</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">검증 시간</span>
              <span className="text-muted-foreground">O(1) — 페어링 3회</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">증명 생성</span>
              <span className="text-muted-foreground">O(n) — MSM 크기</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Trusted Setup</span>
              <span className="text-muted-foreground">필요 (회로별 1회)</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">영지식성</span>
              <span className="text-muted-foreground">완전 (perfect ZK)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">건전성</span>
              <span className="text-muted-foreground">계산적 (computational)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
