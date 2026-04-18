import M from '@/components/ui/math';
import RecursiveCircuitViz from './viz/RecursiveCircuitViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function RecursiveCircuit({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="recursive-circuit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'NovaAugmentedCircuit — 재귀 검증 회로'}</h2>
      <div className="not-prose mb-8"><RecursiveCircuitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          NIFS 가 폴딩을 수행하지만, 이 폴딩이 "올바르게" 되었다는 사실 자체도 증명이 필요하다.
          Nova 는 매 스텝마다 <strong>NovaAugmentedCircuit</strong> 이라는 보조 회로를 합성한다.
          이 회로는 (a) 사용자가 정의한 StepCircuit 의 한 스텝을 실행하고,
          (b) <em>이전 폴딩이 정직했음</em> 을 회로 내부에서 재검증한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">회로 입력 — 5개의 공개 IO</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm mb-2">상태 (state)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><M>{'i'}</M>: 스텝 카운터 (시작 = 0)</li>
              <li><M>{'z_0'}</M>: IVC 초기 입력 벡터</li>
              <li><M>{'z_i'}</M>: 현재 스텝의 입력 (이전 출력)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm mb-2">누적기 (accumulator)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><M>{'U_i'}</M>: 누적된 Relaxed R1CS 인스턴스</li>
              <li><M>{'\\overline{T}'}</M>: NIFS 가 보낸 교차항 커밋</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">회로가 수행하는 검증 4가지</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>일관성 hash 검증</strong> — 외부에서 받은 <M>{'(i, z_0, z_i, U_i)'}</M> 가
            이전 스텝이 출력한 hash 와 같은지: <M>{'\\mathrm{hash}(i, z_0, z_i, U_i) \\stackrel{?}{=} h_{\\text{in}}'}</M>.
            서로 다른 IVC 트레이스가 섞이는 것 방지.
          </li>
          <li>
            <strong>NIFS::verify 회로화</strong> — Random Oracle 로 <M>r</M> 을 squeeze 한 뒤,
            <M>{'U_{i+1} = U_i + r \\cdot u_2 \\text{ (default)}'}</M> 형태로 폴딩 결과 계산.
            여기서 <M>{'u_2'}</M> 는 "현재 스텝의 표준 R1CS 인스턴스" — 즉 자기 자신.
          </li>
          <li>
            <strong>StepCircuit::synthesize 호출</strong> — 사용자 정의 함수 <M>F</M> 적용:
            <M>{'\\; z_{i+1} = F(z_i)'}</M>.
            이 부분이 IVC 의 "유용한 계산" 이다 (Lurk REPL, ZKVM cycle, ML inference 등).
          </li>
          <li>
            <strong>출력 hash 생성</strong> — 다음 스텝에 전달할 hash:
            <M>{'h_{\\text{out}} = \\mathrm{hash}(i+1, z_0, z_{i+1}, U_{i+1})'}</M>.
            이것이 회로의 단일 public output.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 cycle of curves 가 필수인가</h3>
        <div className="not-prose rounded-lg border-l-4 border-l-purple-500 bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            NIFS::verify 는 그룹 연산 <M>{'\\overline{W}_{\\text{new}} = \\overline{W}_1 + r \\cdot \\overline{W}_2'}</M>
            을 회로 내부에서 수행해야 한다. 그룹 원소는 곡선 E1 위의 점이지만, 회로의 산술 필드는 E1 의
            <strong> 스칼라 필드</strong> <M>{'\\mathbb{F}_q'}</M>.
            E1 점의 좌표는 베이스 필드 <M>{'\\mathbb{F}_p'}</M> 라 같은 회로에서 다루기 비싸다.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>해결:</strong> E2 곡선의 베이스 필드 = E1 의 스칼라 필드인 cycle 을 도입.
            E1 의 점 연산은 E2 곡선 회로에서 native 로 수행 (보조 회로) → 두 곡선이 서로의
            ECC 연산을 native 로 실행해주는 ping-pong 구조.
          </p>
          <ul className="text-sm space-y-1 text-foreground/80 mt-2">
            <li><strong>Pasta cycle</strong>: Pallas (E1) ↔ Vesta (E2) — Halo2 와 같음</li>
            <li><strong>Grumpkin cycle</strong>: BN254 ↔ Grumpkin — EVM verifier 호환</li>
            <li><strong>Secp/Secq cycle</strong>: secp256k1 ↔ secq256k1 — Bitcoin/이더 EOA 키 호환</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">회로 크기와 stepCircuit 의 비용</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm mb-2">고정 부분 (boilerplate)</p>
            <p className="text-sm text-muted-foreground">
              hash 검증 + NIFS::verify + ECC scalar mul ≈ <strong>~20K 제약</strong> (Pallas 기준)
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm mb-2">사용자 부분 (StepCircuit)</p>
            <p className="text-sm text-muted-foreground">
              사용자 정의 회로 — Lurk REPL ≈ 100K, ZKVM 1 cycle ≈ 1K~10K
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm mb-2">총합</p>
            <p className="text-sm text-muted-foreground">
              실전 사용 ≈ <strong>30K~100K 제약/step</strong>. 매 스텝 prover 시간 ~수십 ms.
            </p>
          </div>
        </div>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('nova-prove-step', codeRefs['nova-prove-step'])} />
            <span className="text-[10px] text-muted-foreground self-center">nova/mod.rs — prove_step 의 회로 합성 단계</span>
          </div>
        )}

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: NovaAugmentedCircuit 이 IVC 의 "고리"</p>
          <p>
            매 스텝의 회로 출력 <strong>h_out</strong> 이 다음 스텝의 입력 <strong>h_in</strong> 이 된다.
            이 hash 체인이 깨지지 않는 한, <strong>i 번째 스텝까지 모든 폴딩 검증이 trace 에 인코딩</strong> 되어 있다.
            마지막에 Spartan 으로 <M>{'U_n'}</M> 만 검증해도 1~n 모든 스텝의 정직성이 함께 증명된다.
          </p>
        </div>
      </div>
    </section>
  );
}
