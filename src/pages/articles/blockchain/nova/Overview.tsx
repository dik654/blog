import NovaFoldingViz from '../components/NovaFoldingViz';
import IVCFoldingViz from './viz/IVCFoldingViz';
import CodePanel from '@/components/ui/code-panel';
import M from '@/components/ui/math';
import { CRATE_CODE, RELAXED_CODE, crateAnnotations, relaxedAnnotations } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & IVC 폴딩 구조'}</h2>
      <div className="not-prose mb-8"><NovaFoldingViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">IVC 폴딩 흐름</h3>
      <div className="not-prose mb-8"><IVCFoldingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Nova</strong> (microsoft/Nova-snark) 는 R1CS 인스턴스를 누적 폴딩(Folding) 하여
          <strong> IVC</strong> (Incrementally Verifiable Computation, 점진적 검증 연산) 를 구현한다.
          매 스텝마다 SNARK 증명을 만들지 않고, "지금까지 누적된 인스턴스" 와 "이번 스텝 인스턴스" 를
          하나의 Relaxed R1CS 인스턴스로 접는다. 마지막에 단 한 번만 SNARK 로 압축한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 IVC 가 필요한가</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">Naive 재귀 SNARK 의 비용</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>스텝 N 마다 SNARK 증명 1회 생성 → <M>{'O(|F| \\cdot N)'}</M> Prover 시간</li>
              <li>각 스텝의 검증자 회로가 이전 SNARK 를 회로 내부에서 검증 → 페어링/MSM 회로화</li>
              <li>ZKVM 한 번 실행 = 수백만 cycle → 수백만 SNARK 증명 = 비현실적</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Folding 의 절감</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>스텝마다 폴딩 1회 = MSM 1회 + 도전값 1개 → <strong>SNARK 한 번도 만들지 않음</strong></li>
              <li>누적된 인스턴스 크기는 일정 (스텝 수에 무관)</li>
              <li>최종 1회만 Spartan 으로 압축 → 증명 크기 수 KB</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Folding 의 직관 — 한 줄 요약</h3>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            두 R1CS 인스턴스 <M>{'(U_1, W_1)'}</M> 와 <M>{'(U_2, W_2)'}</M> 가 모두 만족이라면,
            랜덤 도전값 <M>r</M> 로 선형 결합한:
          </p>
          <M display>{'(\\underbrace{U_1 + r \\cdot U_2}_{\\text{instance 폴딩}}, \\; \\underbrace{W_1 + r \\cdot W_2}_{\\text{witness 폴딩}})'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            도 (높은 확률로) 만족하는 단일 인스턴스가 된다. 단, 표준 R1CS 는 곱셈 제약 때문에
            그대로 결합이 불가능 → <strong>Relaxed R1CS</strong> 형태로 확장 후 가능.
          </p>
        </div>

        <p>
          이 글에서 다루는 6개 섹션은 다음과 같다 — Relaxed R1CS 가 왜 필요한지,
          NIFS 가 어떻게 폴딩을 수행하는지, 보조 회로(NovaAugmentedCircuit) 가 매 스텝마다
          무엇을 검증하는지, 마지막 Spartan 압축이 왜 필요한지, 그리고 실제 활용 사례까지.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('nova-r1cs', codeRefs['nova-r1cs'])} />
            <span className="text-[10px] text-muted-foreground self-center">r1cs/mod.rs</span>
            <CodeViewButton onClick={() => onCodeRef('nova-spartan', codeRefs['nova-spartan'])} />
            <span className="text-[10px] text-muted-foreground self-center">spartan/mod.rs</span>
          </div>
        )}
        <CodePanel title="크레이트 구조 (src/)" code={CRATE_CODE} annotations={crateAnnotations} />
        <CodePanel title="Relaxed R1CS와 NIFS 아이디어" code={RELAXED_CODE} annotations={relaxedAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Nova 가 해결하지 못하는 것</h3>
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <ul className="text-sm space-y-2 text-foreground/80">
            <li>
              <strong>다중 인스턴스 동시 폴딩</strong> — Nova 는 매 스텝 1개씩만 접는다.
              (HyperNova, ProtoStar 가 한 번에 여러 인스턴스 폴딩 지원)
            </li>
            <li>
              <strong>비균일 회로</strong> — 매 스텝이 같은 회로(StepCircuit) 여야 한다.
              (SuperNova 가 다종 회로 폴딩 도입)
            </li>
            <li>
              <strong>이중 곡선 오버헤드</strong> — Pasta(Pallas/Vesta) 같은 cycle of curves 필수.
              스텝마다 두 개 회로 합성. (Nova-Bn254 등 단일 곡선 변형도 연구 중)
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
