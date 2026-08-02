import M from '@/components/ui/math';
import SpartanFlowViz from './viz/SpartanFlowViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function SpartanCompression({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="spartan" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Spartan 압축 SNARK — 최종 단계'}</h2>
      <div className="not-prose mb-8"><SpartanFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          n 번의 폴딩 후 누적된 <M>{'(U_n, W_n)'}</M> 은 여전히 "Relaxed R1CS 인스턴스" 일 뿐 SNARK 가 아니다.
          크기는 <M>{'O(|W|)'}</M> — 작지 않다. 마지막 단계에서 <strong>Spartan</strong> 을 사용해
          이 인스턴스의 만족 여부를 한 번에 증명하는 간결한 SNARK 로 압축한다.
          최종 증명 크기 = 수 KB, 검증 시간 = 수 ms.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Spartan 의 핵심 — Sumcheck 기반</h3>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Relaxed R1CS 만족식 <M>{'(A z) \\circ (B z) = u (C z) + E'}</M> 의 양변 차이를
            log-space 에서 zero-test 한다. 다변수 다항식
          </p>
          <M display>{'g(\\vec{x}) = \\underbrace{\\widetilde{A z}(\\vec{x}) \\cdot \\widetilde{B z}(\\vec{x})}_{\\text{좌·우변 곱}} - \\underbrace{u \\cdot \\widetilde{C z}(\\vec{x})}_{\\text{스케일된 출력}} - \\underbrace{\\widetilde{E}(\\vec{x})}_{\\text{에러 항}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            가 모든 부울 큐브 점에서 0 임을 <strong>Sumcheck</strong> 로 증명. 라운드 수 = log m
            (m = 제약 수) → Verifier 비용 <M>{'O(\\log m)'}</M>.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">두 가지 변형 — ppsnark vs snark</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">ppsnark (preprocessing)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>회로 (A, B, C) 를 사전 커밋 → Verifier 는 작은 digest 만 보관</li>
              <li>Verifier 시간 <M>{'O(\\log m)'}</M> — 회로 크기 무관</li>
              <li>증명 크기 ~5 KB, 검증 ~수 ms</li>
              <li>EVM 검증 가능 — 페어링 + small digest</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">snark (no preprocessing)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>회로 매트릭스를 매 검증마다 다시 평가 → Verifier <M>{'O(m)'}</M></li>
              <li>증명 크기 약간 작음 ~3 KB</li>
              <li>회로가 동적이거나 셋업 비용 회피하고 싶을 때</li>
              <li>EVM 비효율 — 회로 평가 가스 폭주</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">압축 단계 (CompressedSNARK::prove)</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>최종 누적기 <M>{'(U_n, W_n)'}</M> 만족성을 Spartan Sumcheck 로 증명</li>
          <li>Polynomial commitment opening — <M>{'\\widetilde{W}, \\widetilde{E}'}</M> 의 임의 점 평가</li>
          <li>Inner Product Argument (IPA) 또는 HyperKZG 로 opening 압축</li>
          <li>최종 증명 = sumcheck transcript + opening + 보조 곡선의 누적기 증명</li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 IVC 마지막에서만 Spartan 을 쓰는가</h3>
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            Spartan 한 번의 prover 시간 ≈ <strong>~수 초</strong> (회로 크기에 따라).
            반면 NIFS 폴딩 한 번 ≈ <strong>~수십 ms</strong>.
            중간 스텝마다 Spartan 을 쓰면 IVC 의 의미가 사라진다.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>전략:</strong> 1만 step 의 ZKVM 실행 = 1만 NIFS (몇 분) + 1번 Spartan (수 초).
            만약 1만 SNARK 였다면 수 시간. <strong>2~3 자릿수 prover 시간 절감.</strong>
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">증명 크기/검증 시간 비교</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">방식</th>
                <th className="text-left py-2 px-3">증명 크기</th>
                <th className="text-left py-2 px-3">검증 시간</th>
                <th className="text-left py-2 px-3">on-chain</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td className="py-2 px-3">RecursiveSNARK 그대로</td>
                <td className="py-2 px-3 font-mono text-xs">~1 MB</td>
                <td className="py-2 px-3">~수십 ms</td>
                <td className="py-2 px-3 text-red-500">불가능</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 px-3">CompressedSNARK (Spartan ppsnark)</td>
                <td className="py-2 px-3 font-mono text-xs">~5 KB</td>
                <td className="py-2 px-3">~수 ms</td>
                <td className="py-2 px-3 text-emerald-500">가능 (높은 가스)</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Groth16 wrap (Nova → Groth16)</td>
                <td className="py-2 px-3 font-mono text-xs">~200 bytes</td>
                <td className="py-2 px-3">~1 ms (3 페어링)</td>
                <td className="py-2 px-3 text-emerald-500">실용적</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          실전 배포에서는 <strong>Nova → Spartan → Groth16</strong> 3단 압축이 흔하다.
          마지막 Groth16 wrap 으로 200 bytes / 페어링 검증으로 줄여 EVM precompile 사용.
          단, Groth16 wrap 자체가 한 번의 SNARK 증명이라 prover 시간 ~수십 초 추가.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('nova-spartan', codeRefs['nova-spartan'])} />
            <span className="text-[10px] text-muted-foreground self-center">spartan/mod.rs</span>
          </div>
        )}

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 폴딩 + 압축의 분리가 IVC 의 핵심</p>
          <p>
            전통 재귀 SNARK 는 "한 번에 모든 걸 증명" 하려다 매 스텝마다 페어링 + FRI 를 회로화.
            Nova 는 "폴딩으로 누적, 마지막에 한 번만 증명" 으로 분리 — 폴딩은 가벼운 산술 + ECC 만 필요.
            이 분리가 ZKVM, Lurk, Mina 같은 <strong>장기 누적 증명</strong> 시나리오를 실용 영역으로 끌어올린 결정적 기여.
          </p>
        </div>
      </div>
    </section>
  );
}
