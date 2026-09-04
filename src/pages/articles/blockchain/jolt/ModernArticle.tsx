import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";

const Flow=()=> <figure data-viz="jolt-proof-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-5"><figcaption className="mb-4 text-sm font-semibold">ADD 3,4 → 7을 증명하는 축소 경로</figcaption><div className="grid gap-3 sm:grid-cols-4">{[['01','Bytecode · I/O'],['02','Instruction lookup'],['03','Sumcheck · openings'],['04','Proof receipt']].map(([n,t])=><div key={n} className="min-w-0 rounded-lg border border-border bg-background p-4"><span className="text-xs font-semibold text-primary">{n}</span><p className="mt-2 break-words text-sm font-semibold">{t}</p></div>)}</div></figure>;

export default function ModernArticle(){return <article className="space-y-14">
  <section id="overview" className="space-y-5"><h2 className="text-3xl font-bold">Jolt: instruction을 다시 그리지 말고 lookup한다</h2><p className="text-lg leading-8">
            Program이 ADD 3,4를 실행해 7을 냈다는 claim을 생각해 봅시다. Jolt의 핵심은 모든 instruction semantics를 매 execution row에
            거대한 제약으로 반복하기보다 lookup table에 묻고 그 lookup·memory·I/O claim을 sumcheck와 commitment openings로 줄이는 데
            있습니다.
          </p><Flow/><p>이 글은 lookup·sumcheck 이론을 재정의하지 않고 Jolt가 bytecode와 trace를 그 claims으로 lowering하는 구현 경계에 집중합니다.</p></section>
  <section id="lookup-sumcheck" className="space-y-5"><h2 className="text-2xl font-bold">Lookup claim을 random-point claim으로 접는다</h2><p>
            Toy table row (ADD,3,4,7)은 valid하지만 (ADD,3,4,8)은 valid table에 없습니다. Table [0,1,1,2]를 Boolean
            points 00,01,10,11의 evaluations로 보면 unique multilinear extension이 정해지고 sumcheck는 이런 hypercube
            claims을 매 round 한 variable씩 random challenge로 고정해 최종 random point evaluation으로 축소합니다.
          </p><ExplainedFormula question="Sumcheck가 왜 전체 hypercube를 읽지 않고 claim을 줄일 수 있는가?" idea={<>Prover가 한 variable만 남은 polynomial을 보내면 verifier가 두 Boolean endpoints의 합을 확인하고 random point을 선택합니다. 이를 variable 수만큼 반복합니다.</>} formula={String.raw`S=\sum_{x\in\{0,1\}^{m}}g(x),\quad g_i(0)+g_i(1)=g_{i-1}(r_{i-1})`}
  annotatedFormula={String.raw`S=\underbrace{\sum_{x\in\{0,1\}^{m}}g(x),\quad g_i(0)+g_i(1)=g_{i-1}(r_{i-1})}_{\text{Round polynomial 계산}}`}
  operations={[
    { expression: String.raw`\sum_{x\in\{0,1\}^{m}}g(x),\quad g_i(0)+g_i(1)=g_{i-1}(r_{i-1})`, annotation: ["Round polynomial이(가) 식의 결과에 기여하는","방식을 계산합니다.","Prover가 한 variable만 남은 polynomial을","보내면 verifier가 두 Boolean endpoints의"] },
  ]} terms={[{symbol:"g",name:"Multilinear claim polynomial",description:"Lookup·trace·memory relation을 Boolean hypercube에서 평가합니다."},{symbol:"g_i",name:"Round polynomial",description:"i번째 variable만 남겨 나머지 Boolean assignments를 합한 polynomial입니다."},{symbol:"r_i",name:"Verifier challenge",description:"Commit-first transcript에서 도출한 random field element입니다."}]} assumptions={["Round polynomial degree bound와 field profile이 고정됩니다.","Commitments를 고정한 뒤 domain-separated challenges를 도출합니다."]} interpretation="m=2이면 두 rounds 뒤 g(r1,r2) 하나를 opening합니다. Prover가 r_i를 먼저 알면 어느 points에서만 맞을지 맞출 수 있으므로 transcript order가 전제입니다." /></section>
  <section id="artifact" className="space-y-5"><h2 className="text-2xl font-bold">Proof와 함께 bytecode·trace claim을 보존한다</h2><p>Receipt에는 pinned source/toolchain, program hash, input/output schema와 public values, memory initialization, trace length, field·commitment·transcript profile을 넣습니다. Output 7의 proof에 API JSON만 8로 바꿔 붙이거나 다른 bytecode hash로 재사용하는 경우 verifier가 거절해야 합니다. Instruction table claim과 memory read/write consistency claim도 별도 mutation fixtures로 검사합니다.</p></section>
  <section id="release" className="space-y-5"><h2 className="text-2xl font-bold">Native interpreter parity 후 비용을 재다</h2><p>
            Edge opcodes, overflow/profile, memory aliasing, initial/final memory, private/public I/O에서
            interpreter result와 proof accept/reject가 같은지 확인합니다. Wrong opcode·output·memory·program
            hash·transcript·opening을 각각 거절한 뒤 같은 ISA, trace length, security profile, hardware에서
            preprocessing/prove/verify ms, proof bytes, RSS를 나눠 보고 parity 회귀 시 이전 pinned artifact로
            rollback합니다.
          </p><div id="paper-jolt"><CitationBlock source="Jolt: SNARKs for Virtual Machines via Lookups" citeKey={1} href="https://eprint.iacr.org/2023/1217.pdf"><p><b>문제:</b> VM instruction semantics의 proof 비용을 줄입니다.</p><p><b>기여:</b> Lasso lookup을 활용한 zkVM arithmetization을 제시합니다.</p><p><b>전제:</b> 논문의 lookup·sumcheck·commitment security model입니다.</p><p><b>근거 범위:</b> Jolt protocol과 cost design입니다.</p><p><b>말하지 않는 것:</b> 현재 repository의 모든 ISA·API와 동일하다고 주장하지 않습니다.</p></CitationBlock></div><div id="paper-jolt-source"><CitationBlock source="a16z/jolt pinned source 915faf4" citeKey={2} href="https://github.com/a16z/jolt/tree/915faf453f36871249615a7fdf2704d77a88f259"><p><b>문제:</b> 실제 Rust pipeline과 artifact seam을 고정합니다.</p><p><b>기여:</b> Official source·tests의 pinned snapshot입니다.</p><p><b>전제:</b> Commit 915faf4와 toolchain·features·parameters를 pin합니다.</p><p><b>근거 범위:</b> 선택 commit의 implementation behavior입니다.</p><p><b>말하지 않는 것:</b> Moving main, production audit, 모든 target의 성능을 보장하지 않습니다.</p></CitationBlock></div></section>
</article>}
