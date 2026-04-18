import M from '@/components/ui/math';
import FoldingFamilyViz from './viz/FoldingFamilyViz';

export default function UseCases({ title }: { title?: string }) {
  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '활용 & 비교 (Halo2 누적, ProtoStar)'}</h2>
      <div className="not-prose mb-8"><FoldingFamilyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Nova 는 "장기 누적 증명" 이 필요한 모든 시스템의 백본이 되었다.
          여기서는 실전 활용 사례 4가지와, Nova 이후 등장한 폴딩 패밀리 (HyperNova / SuperNova / ProtoStar / ProtoGalaxy) 와의
          관계를 정리한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">활용 사례</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">1. Lurk REPL (Filecoin/Lurk Lab)</p>
            <p className="text-sm text-foreground/80">
              Lisp 기반 ZK-friendly REPL. 매 평가 스텝을 NovaAugmentedCircuit 의 StepCircuit 으로
              합성. 인터프리터 100K cycle 도 prover ~수 분.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">2. Mina Protocol</p>
            <p className="text-sm text-foreground/80">
              22 KB constant-size 블록체인의 핵심. 모든 블록 검증을 IVC 로 누적.
              현재는 Pickles (Halo2 누적) 사용이지만 Nova 변형으로 마이그레이션 연구.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">3. RISC-V zkVM (Nexus, Jolt)</p>
            <p className="text-sm text-foreground/80">
              매 RISC-V instruction 을 StepCircuit 한 번. Nova 누적 → 100M cycle 프로그램 증명 가능.
              SP1, RISC0 는 STARK 기반이지만 Nexus, Jolt 는 Nova 활용.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="font-semibold text-sm text-purple-400 mb-2">4. ZK ML inference</p>
            <p className="text-sm text-foreground/80">
              Layer 별로 NIFS 누적 → MLP/CNN forward pass 증명. EZKL, Modulus Labs 가
              Nova 변형으로 GPT-2 inference 증명 데모.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Nova 패밀리 비교</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">방식</th>
                <th className="text-left py-2 px-3">폴딩 형태</th>
                <th className="text-left py-2 px-3">스텝당 비용</th>
                <th className="text-left py-2 px-3">차별점</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td className="py-2 px-3"><strong>Nova</strong> (2022)</td>
                <td className="py-2 px-3">2-1 폴딩 (R1CS)</td>
                <td className="py-2 px-3">2 MSM + 1 도전값</td>
                <td className="py-2 px-3">최초 IVC, 동일 회로</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 px-3"><strong>SuperNova</strong> (2022)</td>
                <td className="py-2 px-3">N-1 폴딩 (다종 회로)</td>
                <td className="py-2 px-3">동일</td>
                <td className="py-2 px-3">서로 다른 회로 폴딩 (zkVM opcode 다양화)</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 px-3"><strong>HyperNova</strong> (2023)</td>
                <td className="py-2 px-3">CCS 폴딩 (lookup 포함)</td>
                <td className="py-2 px-3">+ Sumcheck round</td>
                <td className="py-2 px-3">Customizable Constraint System, lookup 효율</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 px-3"><strong>ProtoStar</strong> (2023)</td>
                <td className="py-2 px-3">N-1 폴딩 (CCS)</td>
                <td className="py-2 px-3">N MSM</td>
                <td className="py-2 px-3">고차 게이트 + 다중 인스턴스</td>
              </tr>
              <tr>
                <td className="py-2 px-3"><strong>ProtoGalaxy</strong> (2023)</td>
                <td className="py-2 px-3">N-1 폴딩 (PLONKish)</td>
                <td className="py-2 px-3">log N MSM</td>
                <td className="py-2 px-3">대규모 N 폴딩 효율 (zkVM 한 번에)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">vs Halo2 누적 (Pickles, Plonky2)</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Halo2 / Pickles 누적</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>매 스텝마다 <strong>SNARK 증명</strong> 생성 + 누적 검증 회로화</li>
              <li>스텝당 ~수 초 prover, 메모리 GB</li>
              <li>증명 자체가 매 스텝 만들어짐</li>
              <li>완성된 SNARK pipeline 활용 (Halo2 검증자)</li>
            </ul>
          </div>
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Nova IVC</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>매 스텝 폴딩만 (SNARK 미생성)</li>
              <li>스텝당 ~수십 ms prover, 메모리 100 MB</li>
              <li>최종 1회만 SNARK 압축</li>
              <li>장기 누적에서 1~2 자릿수 빠름</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">선택 기준</h3>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <ul className="text-sm space-y-2 text-foreground/80">
            <li>
              <strong>긴 시퀀스 (1만 step+)</strong>: Nova 계열 압도 (Lurk, ZKVM, ML inference)
            </li>
            <li>
              <strong>짧은 트레이스 (~수십 step)</strong>: Halo2 누적이 더 단순 (Pickles, Plonky2 recursion)
            </li>
            <li>
              <strong>이종 회로 다수</strong>: SuperNova / ProtoStar
            </li>
            <li>
              <strong>Lookup 의존 회로</strong>: HyperNova (CCS 폴딩)
            </li>
            <li>
              <strong>EVM 검증 우선</strong>: Nova → Spartan → Groth16 wrap 3단 압축
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 폴딩이 SNARK 를 대체한 게 아니라 보완한다</p>
          <p>
            Nova 등장 이전에는 "재귀 = SNARK 안에서 SNARK 검증" 이 유일한 답이었다.
            폴딩은 검증을 미루고 누적만 한다 — 마지막에 SNARK 한 번이 여전히 필요하다.
            이 "지연된 검증" 패턴이 IVC 의 진짜 혁신이며, 모든 후속 폴딩 스킴이 이 아이디어를 변주한다.
          </p>
        </div>
      </div>
    </section>
  );
}
