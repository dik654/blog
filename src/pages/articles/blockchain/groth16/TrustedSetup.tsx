import M from '@/components/ui/math';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import TrustedSetupViz from './viz/TrustedSetupViz';
import Groth16PipelineViz from './viz/Groth16PipelineViz';
import { codeRefs } from './codeRefs';

export default function TrustedSetup({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="trusted-setup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Trusted Setup</h2>
      <div className="not-prose mb-8"><TrustedSetupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Groth16 전체 파이프라인</h3>
      </div>
      <div className="not-prose mb-8"><Groth16PipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('groth16-keygen', codeRefs['groth16-keygen'])} />
          <span className="text-[10px] text-muted-foreground self-center">generate_parameters()</span>
          <CodeViewButton onClick={() => onCodeRef('groth16-vk', codeRefs['groth16-vk'])} />
          <span className="text-[10px] text-muted-foreground self-center">VerifyingKey 구조체</span>
        </div>
        <p>
          Groth16의 첫 번째 단계는 <strong>Trusted Setup(신뢰 설정)</strong>입니다.
          <br />
          QAP와 랜덤 파라미터를 결합하여 ProvingKey(PK)와 VerifyingKey(VK)를 생성합니다.
          <br />
          이 과정에서 생성되는 비밀 값들을 <strong>toxic waste(독성 폐기물)</strong>라 부르며, 반드시 삭제해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">5개의 Toxic Waste 파라미터</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-2">
          <h4 className="font-semibold text-base mb-2">Toxic Waste 파라미터</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded border p-3 bg-sky-50 dark:bg-sky-950/30">
              <code className="font-mono text-xs font-semibold">τ (tau)</code>
              <p className="text-xs text-muted-foreground mt-1">비밀 평가점 — QAP 다항식을 τ에서 평가하여 커브 포인트로 인코딩</p>
            </div>
            <div className="rounded border p-3 bg-emerald-50 dark:bg-emerald-950/30">
              <code className="font-mono text-xs font-semibold">α (alpha)</code>
              <p className="text-xs text-muted-foreground mt-1">지식 계수 — A, B가 올바른 구조로 만들어졌는지 강제</p>
            </div>
            <div className="rounded border p-3 bg-emerald-50 dark:bg-emerald-950/30">
              <code className="font-mono text-xs font-semibold">β (beta)</code>
              <p className="text-xs text-muted-foreground mt-1">교차항 계수 — A, B, C가 같은 witness에서 나왔는지 결합</p>
            </div>
            <div className="rounded border p-3 bg-amber-50 dark:bg-amber-950/30">
              <code className="font-mono text-xs font-semibold">γ (gamma)</code>
              <p className="text-xs text-muted-foreground mt-1">public 구분자 — 공개 변수의 commitment를 γ로 나눔</p>
            </div>
            <div className="rounded border p-3 bg-amber-50 dark:bg-amber-950/30">
              <code className="font-mono text-xs font-semibold">δ (delta)</code>
              <p className="text-xs text-muted-foreground mt-1">private 구분자 — 비공개 변수 + h(τ)t(τ)를 δ로 나눔</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Setup 과정</h3>
        <div className="rounded-lg border p-4 not-prose text-sm space-y-3">
          <h4 className="font-semibold text-base mb-2">Trusted Setup 7단계</h4>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium">① toxic waste 랜덤 생성</p>
            <p className="font-mono text-xs text-muted-foreground">
              <M>{'\\tau, \\alpha, \\beta, \\gamma, \\delta \\leftarrow \\mathbb{F}_r^*'}</M> (0이 아닌 랜덤)
            </p>
          </div>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium">② 기본 커브 포인트 계산</p>
            <p className="font-mono text-xs text-muted-foreground">[α]₁, [β]₁, [β]₂, [δ]₁, [δ]₂, [γ]₂</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium">③ QAP 다항식을 τ에서 평가</p>
            <p className="font-mono text-xs text-muted-foreground">
              각 변수 j: <M>{'a_j(\\tau), b_j(\\tau), c_j(\\tau) \\in \\mathbb{F}_r'}</M>
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium">④ Query 벡터 생성</p>
            <p className="font-mono text-xs text-muted-foreground">
              a_query[j] = [aⱼ(τ)]₁, b_g2_query[j] = [bⱼ(τ)]₂
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium">⑤ LC 계산 및 public/private 분리</p>
            <M display>{'lc_j = \\beta \\cdot a_j(\\tau) + \\alpha \\cdot b_j(\\tau) + c_j(\\tau)'}</M>
            <p className="font-mono text-xs text-muted-foreground">공개: ic[j] = [lcⱼ / γ]₁</p>
            <p className="font-mono text-xs text-muted-foreground">비공개: l_query[j'] = [lcⱼ / δ]₁</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium">⑥ h_query 생성</p>
            <p className="font-mono text-xs text-muted-foreground">h_query[i] = [τⁱ · t(τ) / δ]₁</p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900/30 rounded p-3 space-y-1">
            <p className="text-xs font-medium">⑦ VK에 e(α, β) 사전 계산 저장</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Public/Private 분리</h3>
        <p>
          witness 벡터에서 인덱스 0은 상수 1(One)입니다.
          <br />
          인덱스 1..l은 공개 Instance 변수, 나머지는 비공개 Witness 변수입니다.
          <br />
          IC는 검증자가 아는 공개 부분, L은 증명자만 아는 비공개 부분입니다.
          <br />
          각각 gamma와 delta로 나누어 별도의 검증 채널을 형성합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">MPC Ceremony</h3>
        <p>
          프로덕션에서는 toxic waste 노출을 방지하기 위해 <strong>MPC(Multi-Party Computation, 다자 계산) 세레모니</strong>를 수행합니다.
          <br />
          N명의 참여자가 각각 비밀 값을 생성하고, 최종 파라미터는 이들의 곱으로 결정됩니다.
          <br />
          N명 중 단 1명이라도 자기 값을 삭제하면 안전한 <strong>1-of-N 신뢰 모델</strong>입니다.
        </p>
      </div>
    </section>
  );
}
