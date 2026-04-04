import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import VerifyViz from './viz/VerifyViz';
import { VERIFY_ALGO_CODE, VERIFY_DERIVE_CODE, SUMMARY_CODE } from './VerifyData';
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
        <p>
          입력: VK, public_inputs = [s₁, ..., sₗ], Proof = (A, B, C)<br />
          ① IC_sum 계산:<br />
          IC_sum = ic[0] + Σⱼ₌₁ˡ sⱼ · ic[j]<br />
          ② 검증 방정식:<br />
          e(A, B) ?= e(α,β) · e(IC_sum, [γ]₂) · e(C, [δ]₂)<br />
          LHS 상수 공개 입력 검증 나머지 전부
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">검증 방정식 유도</h3>
        <CodePanel
          title="A·B 전개로 검증 방정식 유도"
          code={VERIFY_DERIVE_CODE}
          annotations={[
            { lines: [1, 1], color: 'sky', note: 'A·B 곱 전개' },
            { lines: [3, 6], color: 'emerald', note: '각 항이 매핑되는 페어링' },
            { lines: [8, 11], color: 'amber', note: 'γ, δ 소거 원리' },
          ]}
        />

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
        <CodePanel title="Groth16 특성" code={SUMMARY_CODE} />
      </div>
    </section>
  );
}
