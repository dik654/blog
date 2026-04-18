import NIFSFoldingViz from '../components/NIFSFoldingViz';
import NIFSArchViz from './viz/NIFSArchViz';
import CodePanel from '@/components/ui/code-panel';
import M from '@/components/ui/math';
import { NIFS_PROVE_CODE, PROVE_STEP_CODE } from './NIFSData';
import { nifsAnnotations, proveStepAnnotations } from './NIFSAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function NIFS({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="nifs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'NIFS & prove_step (실제 구현)'}</h2>
      <div className="not-prose mb-8"><NIFSFoldingViz /></div>
      <div className="not-prose mb-8"><NIFSArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>NIFS</strong> (Non-Interactive Folding Scheme) 는 Nova 의 폴딩 코어다.
          Relaxed R1CS 인스턴스 <M>{'(U_1, W_1)'}</M> 와 표준 R1CS 인스턴스 <M>{'(U_2, W_2)'}</M> 를
          입력 받아 단일 Relaxed R1CS 인스턴스 <M>{'(U, W)'}</M> 를 출력한다.
          교차항 <M>T</M> 의 커밋 <M>{'\\overline{T}'}</M> 가 유일한 추가 데이터 — 즉 폴딩 증명 크기 = 1 group element.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">교차항 T 의 정체</h3>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            두 인스턴스를 단순히 더하면 R1CS 등식 <M>{'(A z) \\circ (B z) = u \\cdot C z + E'}</M> 의
            좌변에 교차 곱셈항이 생긴다:
          </p>
          <M display>{'A(W_1 + r W_2) \\circ B(W_1 + r W_2) = AW_1 \\circ BW_1 + r \\cdot \\underbrace{T}_{\\text{교차항}} + r^2 \\cdot AW_2 \\circ BW_2'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            여기서 <M>{'T = AW_1 \\circ BW_2 + AW_2 \\circ BW_1 - u_1 \\cdot CW_2 - u_2 \\cdot CW_1'}</M>.
            Prover 가 <M>T</M> 를 계산하여 Pedersen 커밋 <M>{'\\overline{T}'}</M> 를 전송하면,
            Verifier 는 새 에러 <M>{'E = E_1 + r T + r^2 E_2'}</M> 가 일치함을 확인할 수 있다.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">prove 시그니처와 입력 분리</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">U1 / W1 — 누적된 Relaxed</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><M>{'u_1 \\in \\mathbb{F}'}</M>: 스케일 (이전 폴딩 누적)</li>
              <li><M>{'\\overline{W}_1, \\overline{E}_1'}</M>: 두 커밋</li>
              <li><M>{'X_1'}</M>: public IO (z_0, z_i, hash 등)</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">U2 / W2 — 이번 스텝 표준</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><M>{'u_2 = 1, \\; E_2 = \\mathbf{0}'}</M> (표준 R1CS)</li>
              <li><M>{'\\overline{W}_2'}</M>: 이번 스텝 증인 커밋</li>
              <li>StepCircuit::synthesize 결과</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Fiat-Shamir 도전값 r 의 흡수 순서</h3>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Random Oracle 에 흡수하는 순서가 보안에 결정적이다. Nova 의 ROTrait 구현은:
          </p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>pp.digest (PublicParams 해시) — 회로/곡선 컨텍스트 고정</li>
            <li><M>{'U_1, U_2'}</M> 직렬화 (절대 순서 규정)</li>
            <li><M>{'\\overline{T}'}</M> 흡수 — 교차항 커밋</li>
            <li>squeeze → <M>r</M> ∈ Fq (스칼라 필드)</li>
          </ol>
          <p className="text-sm text-muted-foreground mt-2">
            T 를 흡수 <em>전에</em> 도전값을 짤 수 있다면 prover 가 T 를 조작할 여지가 생긴다.
            BCS 규칙에 따라 "공개 → 흡수 → 도전" 순서를 엄격히 지켜야 soundness 가 보존된다.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">prove_step — 이중 곡선 IVC</h3>
        <p>
          <code>RecursiveSNARK::prove_step</code> 은 한 IVC 스텝을 수행한다.
          Nova 는 <strong>cycle of curves</strong> (Pallas/Vesta 또는 BN254/Grumpkin) 를 사용한다.
          E1 의 스칼라 필드 = E2 의 베이스 필드, 그 반대도 성립 → 한 곡선의 ECC 가 다른 곡선 회로 안에서 효율적.
        </p>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">prove_step 4단계 (실제 코드 순서)</p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li><strong>보조 회로 폴딩 (E2 곡선)</strong> — 이전 스텝의 보조 누적기 업데이트</li>
            <li><strong>주 회로 합성</strong> — NovaAugmentedCircuit 으로 "이전 폴딩 검증 + StepCircuit" 합성</li>
            <li><strong>주 회로 폴딩 (E1 곡선)</strong> — NIFS::prove 로 누적</li>
            <li><strong>보조 회로 합성</strong> — 다음 스텝을 위한 보조 회로 준비, 상태 전달</li>
          </ol>
        </div>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('nova-nifs-prove', codeRefs['nova-nifs-prove'])} />
            <span className="text-[10px] text-muted-foreground self-center">nifs.rs</span>
            <CodeViewButton onClick={() => onCodeRef('nova-prove-step', codeRefs['nova-prove-step'])} />
            <span className="text-[10px] text-muted-foreground self-center">nova/mod.rs</span>
          </div>
        )}
        <CodePanel title="NIFS::prove (nova/nifs.rs)" code={NIFS_PROVE_CODE} annotations={nifsAnnotations} />
        <CodePanel title="prove_step — 이중 곡선 IVC (nova/mod.rs)" code={PROVE_STEP_CODE} annotations={proveStepAnnotations} />

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 NIFS 가 SNARK 보다 압도적으로 가벼운가</p>
          <p>
            <strong>SNARK 증명</strong> = 다항식 commit 다수 + opening 증명 + Pairing/FRI ⇒ 수십 ms / step<br />
            <strong>NIFS prove</strong> = 교차항 T 계산 (<M>{'O(n)'}</M> 필드 곱) + Pedersen commit 1회 ⇒ 수 ms / step<br />
            대신 NIFS 결과는 "여전히 R1CS 인스턴스" 일 뿐, "검증된 증명" 이 아니다.<br />
            마지막에 한 번 Spartan 으로 압축해야 진짜 SNARK 증명이 된다.
          </p>
        </div>
      </div>
    </section>
  );
}
