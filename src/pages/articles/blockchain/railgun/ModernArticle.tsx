import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import RailgunLocator, { RailgunMapReturn } from "./RailgunLocator";
import RailgunStateTraceViz, { RailgunVisibilityViz } from "./viz/RailgunStateTraceViz";

const CONTRACT_COMMIT = "30da51509975013720529ec146c3cecc0f87088b";
const CIRCUIT_COMMIT = "0aa2d13763a9fcfbb7b7ea9c02e004e71f1394bb";

function RoleStrip() {
  const roles = [
    ["Wallet", "note·key·경로를 고르고 proof와 암호문을 만듭니다."],
    ["JoinSplit 회로", "membership·소유·nullifier·합계·출력을 함께 확인합니다."],
    ["Broadcaster", "완성된 calldata를 제출하고 gas를 냅니다."],
    ["Smart contract", "proof와 공개 필드를 검사하고 nullifier·tree 상태를 바꿉니다."],
  ] as const;
  return (
    <ol className="not-prose grid gap-px bg-border p-px text-sm sm:grid-cols-4">
      {roles.map(([title, body], index) => (
        <li key={title} className="min-w-0 bg-background p-3">
          <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
          <strong className="mt-1 block break-keep text-xs">{title}</strong>
          <span className="mt-2 block break-keep text-[10px] leading-5 text-muted-foreground">{body}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6 scroll-mt-20">
        <RailgunLocator current="railgun" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold tracking-tight">금액과 받는 사람을 공개하지 않고 note를 한 번만 썼다는 사실을 어떻게 확인합니까?</h2>
        </div>
        <RailgunStateTraceViz />
        <p className="text-lg leading-8 text-foreground/90">
          이미 비공개 pool에 값 10인 note 하나가 있다고 가정하겠습니다. Wallet은 이 note를 값 6인 받는 사람 note와 값 4인 거스름 note로 바꿉니다. 계약에는 10·6·4가 그대로 올라가지 않지만, 회로는 같은 token에서 입력 합과 출력 합이 같고 입력 note의 주인이 맞다는 사실을 검사합니다.
        </p>
        <p>
          계약은 공개 nullifier를 한 번만 받아 같은 note의 두 번째 사용을 막고, 새 commitment 두 개를 tree에 넣습니다. 계약·회로·키·wallet engine 변경을 시험하고 되돌리는 절차는 <Link to="/cs/blockchain/railgun-validation#overview">실무 검증 글</Link>로 분리합니다.
        </p>
      </section>

      <section id="black-box" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">큰 흐름</p>
        <h2 className="break-keep text-2xl font-bold">증명 생성과 거래 제출, 상태 변경은 서로 다른 역할입니다</h2>
        <RoleStrip />
        <p>
          Broadcaster가 거래를 보낸다고 note의 소유권을 판정하는 것은 아닙니다. Wallet이 proof를 만들었다고 spent 상태가 바뀌는 것도 아닙니다. 회로가 관계를 검증하고 계약이 그 proof와 현재 on-chain 상태를 함께 확인한 뒤 원자적으로 nullifier와 tree를 바꿔야 송금이 끝납니다.
        </p>
      </section>

      <section id="state" className="space-y-6 scroll-mt-20">
        <p className="text-xs font-bold text-primary">상태의 모양</p>
        <h2 className="break-keep text-2xl font-bold">Tree와 nullifier는 서로 다른 상태를 기록합니다</h2>
        <p>
          선택한 계약 소스에서 note preimage는 <code>npk</code>, token 자료와 120-bit value로 구성됩니다. 계약의 <code>hashCommitment</code>는 이 세 값을 Poseidon으로 묶어 tree leaf를 만듭니다. 하지만 개인 송금에서 계약은 기존 leaf의 preimage를 다시 받지 않습니다. Wallet이 private witness로 재구성하고 회로가 historical root에 속하는지 확인합니다.
        </p>
        <ExplainedFormula
          question="값 10인 입력 note와 그 note의 한 번뿐인 사용 표시는 어떻게 계산합니까?"
          idea={<>선택한 회로에서 master public key와 note public key를 차례로 계산하고 token·value를 commitment에 묶습니다. Nullifier는 nullifying key와 leaf index에 결속됩니다.</>}
          formula={String.raw`mpk=H(pk_x,pk_y,nk),\quad npk=H(mpk,\rho),\quad C=H(npk,token,v),\quad N=H(nk,i)`}
          annotatedFormula={String.raw`\underbrace{mpk=H(pk_x,pk_y,nk)}_{\text{지출 권한 묶음}},\quad \underbrace{npk=H(mpk,\rho)}_{\text{note마다 새 키}},\quad \underbrace{C=H(npk,token,v)}_{\text{tree leaf}},\quad \underbrace{N=H(nk,i)}_{\text{한 번뿐인 사용 표시}}`}
          operations={[
            { expression: String.raw`mpk=H(pk_x,pk_y,nk),\quad npk=H(mpk,\rho)`, annotation: ["public key 두 좌표와 nullifying key", "note마다 다른 random ρ", "같은 wallet의 note도 다른 npk"] },
            { expression: String.raw`C=H(npk,token,v)`, annotation: ["npk·token·value 10을", "Poseidon(3)으로 묶어", "Merkle tree leaf를 만듭니다"] },
            { expression: String.raw`N=H(nk,i)`, annotation: ["nullifying key와 leaf 23에서", "항상 같은 N₂₃이 나오므로", "contract mapping이 재사용을 막습니다"] },
          ]}
          terms={[
            { symbol: "pk_x,pk_y", name: "Spending public key", description: "EdDSA 서명을 확인할 공개키의 두 좌표입니다." },
            { symbol: "nk", name: "Nullifying key", description: "Leaf index와 함께 note별 nullifier를 만드는 비공개 값입니다." },
            { symbol: "\\rho", name: "Note random", description: "같은 wallet·token·value라도 note public key를 다르게 만드는 값입니다." },
            { symbol: "i", name: "Leaf index", description: "설명 사례에서는 23이며 Merkle path와 nullifier 계산에 함께 쓰입니다." },
          ]}
          assumptions={[
            `Railgun-Privacy/circuits-v2 commit ${CIRCUIT_COMMIT.slice(0, 7)}의 JoinSplit·NullifierCheck 식을 사용합니다.`,
            `Contract commit ${CONTRACT_COMMIT.slice(0, 7)}의 CommitmentPreimage와 hashCommitment 구조를 사용합니다.`,
            "Poseidon field·상수·직렬화·domain은 선택한 circuit artifact와 contract deployment에 정확히 맞아야 합니다.",
          ]}
          interpretation="Nullifier는 leaf의 위치를 그대로 공개하지 않으면서 같은 nk·index 조합에서 같은 값을 냅니다. 계약은 N₂₃의 첫 사용만 허용합니다. Merkle path만으로 소유권이 생기는 것은 아니며, key 관계와 서명을 회로가 함께 확인해야 합니다."
        />
      </section>

      <section id="circuit" className="space-y-6 scroll-mt-20">
        <p className="text-xs font-bold text-primary">회로의 책임</p>
        <h2 className="break-keep text-2xl font-bold">JoinSplit은 다섯 검사를 하나의 proof에 묶습니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["서명", "공개 신호 전체에 대한 EdDSA"],
            ["Nullifier", "N=H(nk, leaf index)"],
            ["Membership", "C₁₀과 path → R100"],
            ["출력", "C₆·C₄가 새 note와 일치"],
            ["합계", "10 = 6 + 4"],
          ].map(([title, body], index) => <div key={title} className="min-w-0 bg-background p-3"><span className="font-mono text-[8px] font-black text-primary">{index + 1}</span><strong className="mt-1 block break-keep text-xs">{title}</strong><span className="mt-2 block break-keep text-[9px] leading-4 text-muted-foreground">{body}</span></div>)}
        </div>
        <ExplainedFormula
          question="계약이 금액을 보지 않는데 10에서 11을 만드는 일을 어떻게 막습니까?"
          idea={<>Input과 output value는 private signal이지만 같은 회로 안에서 합계를 같게 강제합니다. Public output commitment가 private value와 일치하는지도 함께 확인합니다.</>}
          formula={String.raw`\sum_{j=1}^{n_{in}}v^{in}_j=\sum_{k=1}^{n_{out}}v^{out}_k,\qquad 10=6+4`}
          annotatedFormula={String.raw`\underbrace{\sum v^{in}}_{10}=\underbrace{\sum v^{out}}_{6+4},\qquad \underbrace{10\ne6+5}_{\text{constraint 불만족}}`}
          operations={[
            { expression: String.raw`sumIn=v^{in}_1=10`, annotation: ["입력 note를 path와 key로 확인한 뒤", "그 private value를 합산합니다"] },
            { expression: String.raw`sumOut=v^{out}_1+v^{out}_2=6+4=10`, annotation: ["각 output value가 120-bit인지 확인하고", "npk·token·value로 C₆·C₄를 다시 계산합니다"] },
            { expression: String.raw`sumIn=sumOut`, annotation: ["회로 constraint이므로", "6+5 witness로는 정상 proof를 만들 수 없습니다"] },
          ]}
          terms={[
            { symbol: "v^{in}", name: "입력 note 값", description: "Merkle membership을 확인한 비공개 입력 note의 값입니다." },
            { symbol: "v^{out}", name: "출력 note 값", description: "공개 output commitment에 결속된 비공개 값입니다." },
          ]}
          assumptions={["모든 input과 output은 회로의 같은 private token signal을 사용합니다.", "수수료를 낸다면 그 몫도 output note 구조 안에서 합계에 포함돼야 합니다.", "계약이 value를 직접 합산한다는 뜻이 아닙니다."]}
          interpretation="계약이 보는 것은 root·boundParams hash·nullifiers·commitments와 proof입니다. 금액 보존은 proof가 증명하는 relation이고, 계약은 선택한 verifying key로 그 proof를 검증합니다."
        />
      </section>

      <section id="artifact" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">거래 자료의 결속</p>
        <h2 className="break-keep text-2xl font-bold">암호문과 chain ID도 proof 밖의 장식이 아니라 boundParams hash에 들어갑니다</h2>
        <p>
          Contract commit <code>{CONTRACT_COMMIT.slice(0, 7)}</code>의 <code>Transaction</code>은 proof, Merkle root, nullifiers, commitments, bound parameters와 선택적 unshield preimage를 가집니다. <code>BoundParams</code>에는 tree number, 최소 gas price, unshield 종류, chain ID, adapt contract·params와 output ciphertext 배열이 들어갑니다.
        </p>
        <pre className="not-prose overflow-x-auto border-y border-border bg-muted/25 p-4 text-[11px] leading-6"><code>{`// 1. 계약과 회로가 함께 볼 공개 신호를 준비합니다.
inputs[0] = uint256(transaction.merkleRoot);

// 2. chain ID·암호문·adapt 설정 전체를 한 값에 묶습니다.
inputs[1] = hashBoundParams(transaction.boundParams);

// 3. 이미 쓴 note를 가리키는 공개 nullifier를 이어 붙입니다.
inputs[2 + i] = uint256(transaction.nullifiers[i]);

// 4. 새 비공개 note의 commitment를 공개 신호에 넣습니다.
inputs[2 + nullifiersLength + i] = uint256(transaction.commitments[i]);

// 5. 위 공개 신호와 private witness의 관계를 Groth16으로 확인합니다.
valid = verifyProof(verifyingKey, transaction.proof, inputs);`}</code></pre>
        <p>
          받는 사람이 암호문을 열어 새 note를 찾으려면 ciphertext가 필요합니다. Ciphertext를 proof와 무관한 별도 payload로 취급하면 유효한 proof에 다른 수신자 자료를 바꿔 붙이는 경계가 생깁니다. 이 소스에서는 <code>hashBoundParams</code>가 그 연결을 맡습니다.
        </p>
      </section>

      <section id="contract" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">계약의 책임</p>
        <h2 className="break-keep text-2xl font-bold">검증이 모두 끝난 transaction만 nullifier와 새 commitment를 함께 반영합니다</h2>
        <p>
          <code>validateTransaction</code>은 gas price 조건, adapt sender와 현재 EVM chain ID를 먼저 확인합니다. 이어서 historical root, unshield와 ciphertext 배열 길이, proof를 검사합니다.
        </p>
        <p>
          그 다음 <code>accumulateAndNullifyTransaction</code>이 각 nullifier가 아직 없음을 확인하고 사용됨으로 기록합니다. 새 commitment와 ciphertext를 모은 뒤 <code>insertLeaves</code>가 tree를 갱신합니다.
        </p>
        <pre className="not-prose overflow-x-auto border-y border-border bg-muted/25 p-4 text-[11px] leading-6"><code>{`// 1. 같은 tree에서 이미 쓴 nullifier인지 먼저 확인합니다.
require(!nullifiers[treeNumber][N], "Note already spent");

// 2. 이번 EVM transaction 안에서 N을 사용됨으로 기록합니다.
nullifiers[treeNumber][N] = true;

// 3. 출력 commitment와 암호문을 모읍니다.
commitments[offset] = transaction.commitments[i];
ciphertext[offset] = transaction.boundParams.commitmentCiphertext[i];

// 4. 모든 transaction 검사가 끝난 뒤 새 leaf를 tree에 넣습니다.
insertLeaves(commitments);`}</code></pre>
        <p>
          중간의 <code>require</code>가 실패하면 EVM transaction 전체가 revert되므로 nullifier만 남거나 commitment만 들어가는 부분 성공은 없어야 합니다. 다만 Wallet이 event를 중간까지만 읽어 로컬 잔액을 잘못 보여 주는 문제는 별도입니다. On-chain source of truth와 wallet mirror를 구분해야 합니다.
        </p>
      </section>

      <section id="visibility" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">숨겨지는 것과 남는 것</p>
        <h2 className="break-keep text-2xl font-bold">Proof의 zero knowledge와 전체 사용자의 익명성은 같은 주장 아닙니다</h2>
        <RailgunVisibilityViz />
        <p>
          Private transfer는 token·amount·sender·recipient를 note와 ciphertext 안에 감추는 것이 목표입니다. 그러나 chain observer는 transaction 시각, gas와 calldata 크기를 볼 수 있습니다. Root·nullifiers·commitments와 제출한 Broadcaster 주소도 남습니다.
        </p>
        <p>
          Shield와 unshield는 public ledger와 private pool을 잇습니다. 이 구간에서는 token·amount와 공개 주소가 드러날 수 있습니다.
        </p>
        <p>
          따라서 “proof가 유효하다”는 결론을 “IP와 시각 상관관계가 없다”, “anonymity set이 충분하다”, “Broadcaster가 사용자를 모른다”로 확대하면 안 됩니다. 이 셋은 별도 threat model과 관측 자료가 필요합니다.
        </p>
      </section>

      <section id="failure-boundaries" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">실패 경계</p>
        <h2 className="break-keep text-2xl font-bold">어느 검사가 어떤 잘못을 막는지 분리해서 기억합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[52rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">잘못된 입력</th><th className="px-3 py-3">거절할 위치</th><th className="px-3 py-3">막는 문제</th></tr></thead>
            <tbody>{[
              ["C₁₀이 R100의 leaf가 아님", "Merkle proof constraint", "존재하지 않는 note 지출"],
              ["note 소유 key와 서명이 다름", "EdDSA·mpk relation", "다른 사람 note 지출"],
              ["10 → 6 + 5", "JoinSplit balance constraint", "새 token 1 생성"],
              ["N₂₃ 재사용", "contract nullifier mapping", "같은 note 이중 지출"],
              ["chain·ciphertext 바꿔 붙이기", "boundParams hash + proof", "다른 domain·수신 자료로 치환"],
              ["wallet sync 중 event 누락", "wallet event replay·balance rebuild", "phantom balance·새 note 누락"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>

      <section id="sources" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">버전을 고정한 근거</p>
        <h2 className="break-keep text-2xl font-bold">설명용 식과 계약 검사는 서로 다른 공식 저장소에 귀속합니다</h2>
        <div id="paper-railgun-contract">
          <CitationBlock source={`Railgun-Privacy/contract · ${CONTRACT_COMMIT.slice(0, 7)}`} citeKey={1} type="code" href={`https://github.com/Railgun-Privacy/contract/tree/${CONTRACT_COMMIT}`}>
            <p><strong>확인한 것:</strong> Transaction·BoundParams 구조, note commitment, historical root, proof 검증, nullifier first-use와 commitment tree 갱신입니다.</p>
            <p><strong>범위:</strong> 선택 commit의 Solidity source입니다. 특정 chain의 실제 proxy implementation·verifying key·deployment 상태는 별도 확인이 필요합니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-railgun-circuit">
          <CitationBlock source={`Railgun-Privacy/circuits-v2 · ${CIRCUIT_COMMIT.slice(0, 7)}`} citeKey={2} type="code" href={`https://github.com/Railgun-Privacy/circuits-v2/tree/${CIRCUIT_COMMIT}`}>
            <p><strong>확인한 것:</strong> JoinSplit의 공개·비공개 signal, nullifier 식, Merkle membership, output commitment, EdDSA 서명과 입력·출력 합계 constraint입니다.</p>
            <p><strong>범위:</strong> 선택 source의 회로 의미입니다. 실제 배포 zkey·vkey가 이 source에서 만들어졌다는 사실은 artifact digest로 따로 입증해야 합니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-railgun-docs">
          <CitationBlock source="RAILGUN Developer Guide · State Structure and Transactions" citeKey={3} href="https://docs.railgun.org/developer-guide/engine-1/state-structure">
            <p><strong>확인한 것:</strong> Commitment accumulator, nullifier mapping, historical roots, Wallet proof 생성과 Broadcaster 제출의 역할입니다.</p>
            <p><strong>범위:</strong> 2026-10-29에 확인한 current 공식 설명입니다. Exact contract·circuit behavior는 위 고정 source가 맡습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">읽고 바로 확인할 질문</p>
        <h2 className="break-keep text-2xl font-bold">네 질문에 답하면 변경 검증으로 넘어갈 수 있습니다</h2>
        <ol className="space-y-3 pl-5 text-sm leading-7">
          <li>Merkle path만으로 note 소유권이 증명되지 않는 이유는 무엇입니까? <span className="text-muted-foreground">(답: 회로의 책임)</span></li>
          <li>계약이 금액을 보지 않는데 10→11을 막는 위치는 어디입니까? <span className="text-muted-foreground">(답: JoinSplit의 합계 constraint)</span></li>
          <li>Broadcaster가 끊겨도 on-chain nullifier state의 owner가 아닌 이유는 무엇입니까? <span className="text-muted-foreground">(답: 큰 흐름·계약의 책임)</span></li>
          <li>Proof가 유효해도 남는 프라이버시 위험 두 가지는 무엇입니까? <span className="text-muted-foreground">(답: 숨겨지는 것과 남는 것)</span></li>
        </ol>
      </section>

      <RailgunMapReturn current="railgun" />
    </article>
  );
}
