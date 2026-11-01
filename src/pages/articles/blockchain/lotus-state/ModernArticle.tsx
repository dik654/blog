import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ModernStateRootViz, {
  ActorRecordPathViz,
  HamtAmtPathViz,
  SnapshotStackViz,
  StateFailureBoundaryViz,
} from "./viz/ModernStateRootViz";

const STATE_SPEC = "https://spec.filecoin.io/systems/filecoin_vm/state_tree/";
const ACTORS = "https://docs.filecoin.io/basics/the-blockchain/actors";
const LOTUS_STATE = "https://github.com/filecoin-project/lotus/blob/29d72bdf77d13e6e3e20264d7a9167feb2a41ab0/chain/state/statetree.go";
const HAMT = "https://github.com/filecoin-project/go-hamt-ipld/tree/0be9a0f6b272246618d22f19f95c28e2e043e890";

export default function ModernLotusStateArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">주소 f0100의 nonce를 7에서 8로 바꾸는 한 요청</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Lotus의 state root는 전체 장부가 아니라, 같은 상태 그래프를 다시 여는 첫 주소입니다
          </h2>
        </header>
        <ModernStateRootViz />
        <p className="text-lg leading-8 text-foreground/90">
          State root 값 안에 모든 actor 정보가 들어 있는 것은 아닙니다. Lotus는 먼저
          <strong>StateTree</strong>에서 ID 주소에 해당하는 actor record를 찾습니다. 이어서
          record의 <strong>Head CID</strong>를 따라 actor 종류별 상세 상태를 읽습니다.
        </p>
        <p className="text-lg leading-8 text-foreground/90">
          그 아래의 잔액·sector·proposal 목록은 또 다른 HAMT나 AMT root를 가리킬 수 있습니다.
          그래서 root만 같다고 충분하지 않습니다. Tree version, actor Code CID와 bundle schema,
          HAMT·AMT 설정까지 같아야 같은 뜻으로 읽을 수 있습니다.
        </p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>한 문장 답:</strong> 주소를 ID로 바꾸고 actor record와 그 아래 상태를 찾은 뒤,
          되돌리지 않은 변경만 합쳐 새 root를 만듭니다. 각 단계는 같은 version과 schema로 읽어야 합니다.
        </aside>
        <ContentBoundary article="lotus-state" />
      </section>

      <section id="actor-record" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · Actor record</p>
          <h2 className="mt-2 text-2xl font-bold">
            현재 주소표에서 ID 주소를 찾은 뒤 actor record의 다섯 필드를 읽습니다
          </h2>
        </header>
        <ActorRecordPathViz />
        <p>
          사용자가 보는 <strong>robust address</strong>는 공개키나 actor 생성 정보에서 만든 주소입니다.
          그러나 최상위 StateTree는 짧은 ID 주소를 key로 씁니다. Lotus는 현재 Init actor의
          주소표에서 robust 주소를 <code>f0100</code>으로 바꾼 뒤 record를 찾습니다.
        </p>
        <p>
          이 글에서는 account actor의 record를 Code <code>C_account</code>, Head <code>H_A</code>,
          nonce 7, balance 25 FIL로 두겠습니다. StateTree version 5라면 선택적인
          <code>DelegatedAddress</code>도 함께 들어갑니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Code CID", "어떤 actor code generation과 schema로 읽을지 정합니다."],
            ["Head CID", "Actor type별 state DAG의 root를 가리킵니다."],
            ["Nonce", "발신 message 순서를 제한하는 counter입니다."],
            ["Balance", "Actor에 귀속된 token amount입니다."],
            ["Delegated address", "StateTree v5 actor에 연결된 f4 주소가 있으면 담습니다."],
          ].map(([title, description]) => (
            <article key={title} className="min-w-0 rounded-lg border border-border p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
        <p>
          Head를 쓰면 actor의 모든 상태를 record 안에 반복해서 넣지 않아도 됩니다. 내용이 같으면
          같은 CID를 다시 쓸 수 있고, 일부만 바뀌면 그 경로와 상위 root만 새로 생깁니다.
        </p>
        <p>
          그렇다고 Head의 bytes를 항상 최신 struct로 읽어서는 안 됩니다. 먼저 해당 epoch의 actor
          bundle과 Code CID가 요구하는 schema를 확인해야 합니다.
        </p>
        <p>
          <strong>증명 아이디어:</strong> CID가 canonical encoded bytes의 digest라면 같은 actor
          record와 같은 linked blocks를 받은 두 reader는 같은 graph를 따라갑니다. 반대로 child
          block이 없거나 schema가 다르면 완전한 state라고 주장할 수 없으며 fail closed해야 합니다.
        </p>
        <div id="paper-filecoin-state-tree">
          <CitationBlock citeKey={1} source="Filecoin Specification · State Tree" href={STATE_SPEC}>
            <p><strong>문제:</strong> Global actor state를 검증 가능한 map으로 표현해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Address를 actor state에 연결하는 HAMT StateTree의 protocol 역할을 설명합니다.</p>
            <p><strong>중요 가정:</strong> 표시된 specification status와 active network/tree version을 함께 확인합니다.</p>
            <p><strong>근거 범위:</strong> Filecoin VM의 state-tree 개념과 구조입니다.</p>
            <p><strong>일반화 금지:</strong> Current Lotus cache, actor schema, database durability나 고정 성능을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-filecoin-actors">
          <CitationBlock citeKey={2} source="Filecoin Docs · Actors" href={ACTORS}>
            <p><strong>문제:</strong> Actor record와 global state의 관계를 설명해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Code·state pointer·nonce·balance와 actor/message의 역할을 설명합니다.</p>
            <p><strong>중요 가정:</strong> 공개 문서와 현재 network에서 활성화된 actor bundle을 함께 확인합니다.</p>
            <p><strong>근거 범위:</strong> 공식 actor-model 개념 설명입니다.</p>
            <p><strong>일반화 금지:</strong> Actor 수·methods·bundle generation을 영구 고정하거나 actor logic을 인증하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="hamt-amt" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · HAMT and AMT</p>
          <h2 className="mt-2 text-2xl font-bold">
            HAMT와 AMT는 어느 길로 값을 찾을까요?
          </h2>
        </header>
        <HamtAmtPathViz />
        <p>
          <strong>HAMT(Hash Array Mapped Trie)</strong>는 arbitrary key를 먼저 canonical
          bytes와 hash로 바꾸고, hash의 일부 bits를 level별 branch 번호로 사용합니다.
          <strong>AMT(Array Mapped Trie)</strong>는 integer index 자체를 같은 방식으로
          나눕니다. 두 구조 모두 비어 있는 전체 배열을 저장하지 않고 bitfield와 compact
          pointers를 사용하며 child node를 CID로 연결합니다.
        </p>
        <ExplainedFormula
          question="256-bit HAMT hash를 level당 5 bit로 읽으면 path 조각은 최대 몇 개일까?"
          idea={<>각 level이 <code>w</code> bits를 소비하므로 전체 bit 수를 나누고 남는 bits가 있으면 마지막 level 하나를 더 셉니다.</>}
          formula={"d_{\\max}=\\left\\lceil\\frac{b}{w}\\right\\rceil=\\left\\lceil\\frac{256}{5}\\right\\rceil=52"}
          annotatedFormula={String.raw`\underbrace{d_{\max}}_{\text{path 조각 상한}}=\left\lceil\frac{\underbrace{b}_{\text{hash bit 수}}}{\underbrace{w}_{\text{level당 bit}}}\right\rceil=\left\lceil\frac{256}{5}\right\rceil=52`}
          operations={[
          { expression: String.raw`\frac{b}{w}`, annotation: ["level마다 w bits로 branch를 고름","256/5=51.2 level"] },
          { expression: String.raw`\left\lceil\frac{256}{5}\right\rceil=52`, annotation: ["남은 1 bit도 level 하나로 올림","상한일 뿐 lookup은 더 일찍 끝남"] },
        ]}
          terms={[
            { symbol: "d_{\\max}", name: "Path-slice upper bound", description: "Hash bits를 모두 소비할 때 필요한 level 조각 수의 상한입니다." },
            { symbol: "b", name: "Hash bit length", description: "예제 canonical key hash의 256 bits입니다." },
            { symbol: "w", name: "Bit width", description: "각 level이 branch 선택에 쓰는 5 bits입니다." },
            { symbol: "\\lceil\\cdot\\rceil", name: "Ceiling", description: "남은 partial bits도 level 하나로 셉니다." },
          ]}
          assumptions={[
            "256-bit hash와 bit width 5를 사용하는 고정 예시입니다.",
            "Bucket, early leaf, collision handling과 compressed empty branches는 별도입니다.",
          ]}
          interpretation="52는 실제 모든 lookup이 52 nodes를 읽는다는 뜻이 아닙니다. Entries와 bucket policy에 따라 더 일찍 끝나며 실제 parameters는 actor schema와 library generation에서 확인합니다."
        />
        <ExplainedFormula
          question="AMT index 42를 bit width 3의 path digits로 어떻게 나눌까?"
          idea={<>3 bits는 base 8의 한 자리입니다. Index를 낮은 자리부터 mask하고 오른쪽으로 이동합니다.</>}
          formula={"q_i=(42\\gg 3i)\\ \\&\\ (2^3-1),\\qquad(q_0,q_1)=(2,5)"}
          annotatedFormula={String.raw`\underbrace{q_i}_{\text{level i branch}}=(\underbrace{42\gg 3i}_{\text{쓴 하위 bit 제거}})\ \&\ \underbrace{(2^3-1)}_{\text{하위 3bit mask}},\qquad(q_0,q_1)=(2,5)`}
          operations={[
          { expression: String.raw`42\gg 3i`, annotation: ["42는 8진수 52","i=1이면 3 bit 밀어 42≫3=5"] },
          { expression: String.raw`(2^3-1)`, annotation: ["mask 7로 base 8 한 자리만 남김","42&7=2, 5&7=5 → (2,5)"] },
        ]}
          terms={[
            { symbol: "42", name: "Array index", description: "조회할 integer slot입니다. 8진수로 52입니다." },
            { symbol: "i", name: "Level", description: "Root 쪽 낮은 3-bit digit부터 세는 level입니다." },
            { symbol: "\\gg", name: "Right shift", description: "이미 사용한 낮은 bits를 제거합니다." },
            { symbol: "q_i", name: "Path digit", description: "Level i에서 선택할 branch이며 예제는 2 다음 5입니다." },
          ]}
          assumptions={[
            "예제의 AMT traversal이 낮은 bits부터 3 bits씩 소비한다고 둡니다.",
            "Tree height와 root encoding, absent slot 처리는 exact AMT version을 따릅니다.",
          ]}
          interpretation="42의 digits가 2·5라는 계산만으로 value가 존재한다고 말할 수 없습니다. Bitfield에서 branch 존재 여부와 child/value encoding을 검증해야 합니다."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Structural sharing</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              한 leaf가 바뀌면 해당 path의 nodes와 상위 root만 새 CID를 만듭니다. 바뀌지 않은 branches는 이전 CIDs를 그대로 재사용할 수 있습니다.
            </p>
          </article>
          <article className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Failure counterexample</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              같은 entries라도 bit width 5 대신 8, 다른 hash·bucket·codec을 쓰면 layout과
              root가 달라집니다. “HAMT”라는 이름만으로 호환성을 판단하지 않습니다.
            </p>
          </article>
        </div>
        <div id="paper-hamt-amt-source">
          <CitationBlock type="code" citeKey={3} source="go-hamt-ipld v3.4.1 · commit 0be9a0f" href={HAMT}>
            <p><strong>문제:</strong> Sparse key collection을 deterministic CID graph로 저장해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Versioned HAMT path, bitfield·pointer와 canonical persistence 구현을 제공합니다.</p>
            <p><strong>중요 가정:</strong> Hash function, bit width, bucket options, codec와 exact library generation을 고정합니다.</p>
            <p><strong>근거 범위:</strong> Pinned HAMT implementation이며 Lotus v1.38.3은 별도로 AMT v4.4.0·HAMT v3.4.1 dependencies를 고정합니다.</p>
            <p><strong>일반화 금지:</strong> 모든 actor collection이 같은 parameters를 쓰거나 최대 depth만큼 I/O한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="snapshot-flush" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · Snapshot, revert and flush</p>
          <h2 className="mt-2 text-2xl font-bold">
            중첩 변경에서 실패한 부분만 어떻게 되돌릴까요?
          </h2>
        </header>
        <SnapshotStackViz />
        <p>
          Base root R0에서 f0100의 nonce는 7입니다. Snapshot A를 만들고 nonce를 8로 바꾸면
          조회는 A의 record를 먼저 봅니다. 하지만 R0 자체는 아직 달라지지 않았습니다.
        </p>
        <p>
          그 위에 snapshot B를 만들고 actor를 삭제했다고 하겠습니다. B에서 <code>Revert</code>하면
          Lotus는 B를 버리고 같은 깊이에 빈 층 B′를 새로 만듭니다. 따라서 아래 A의 nonce 8은 남습니다.
          <code>ClearSnapshot</code>을 두 번 호출해 B′와 A를 차례로 아래층에 합치면 층이 하나만 남습니다.
          이제 flush가 살아남은 변경을 HAMT에 적용하고 version, Actors root, Info CID를 묶은 R1을 만듭니다.
        </p>
        <ExplainedFormula
          question="Versioned StateTree의 새 root CID는 무엇을 봉인해야 할까?"
          idea={<>Revert되지 않은 actor updates를 canonical HAMT에 적용한 Actors root와 tree version·Info CID를 같은 encoded StateRoot에 넣습니다.</>}
          formula={"R_1=\\operatorname{CID}\\!\\left(\\operatorname{DAGCBOR}(v,A_1,I)\\right),\\quad A_1=\\operatorname{HAMTApply}(A_0,U_{\\mathrm{survive}})"}
          annotatedFormula={String.raw`\underbrace{R_1}_{\text{새 StateRoot CID}}=\operatorname{CID}\!\left(\operatorname{DAGCBOR}(\underbrace{v}_{\text{tree version}},\underbrace{A_1}_{\text{새 Actors root}},\underbrace{I}_{\text{Info CID}})\right),\quad A_1=\operatorname{HAMTApply}(\underbrace{A_0}_{\text{이전 root}},\underbrace{U_{\mathrm{survive}}}_{\text{revert 안 된 update}})`}
          operations={[
          { expression: String.raw`\operatorname{HAMTApply}(A_0,U_{\mathrm{survive}})`, annotation: ["revert되지 않은 set/delete만","canonical HAMT에 적용해 A_1을 얻음"] },
          { expression: String.raw`\operatorname{CID}\!\left(\operatorname{DAGCBOR}(v,A_1,I)\right)`, annotation: ["version·Actors root·Info를 함께 봉인","version·codec이 다르면 R_1도 다름"] },
        ]}
          terms={[
            { symbol: "R_1", name: "New StateRoot CID", description: "Flush가 반환하는 versioned top-level commitment입니다." },
            { symbol: "v", name: "StateTree version", description: "Actors map을 어떤 generation으로 load할지 정합니다." },
            { symbol: "A_0,A_1", name: "Actors roots", description: "변경 전·후 actor-record HAMT roots입니다." },
            { symbol: "I", name: "Info CID", description: "Versioned StateRoot가 함께 봉인하는 info link입니다." },
            { symbol: "U_{\\mathrm{survive}}", name: "Surviving updates", description: "Revert되지 않고 merge된 set/delete operations입니다." },
          ]}
          assumptions={[
            "Actor keys·records·StateRoot가 exact version의 canonical codec으로 직렬화됩니다.",
            "Referenced child blocks가 available하고 snapshot stack이 flush 가능한 상태입니다.",
          ]}
          interpretation="같은 surviving updates라도 version·codec·base root가 다르면 R1은 달라질 수 있습니다. Root 일치는 actor method의 경제적 안전이나 chain finality가 아니라 같은 state graph를 만들었다는 뜻입니다."
        />
        <p>
          <strong>왜 B만 사라질까요?</strong> 조회는 맨 위 변경층부터 아래로 내려가며 가장 최근 값을
          선택합니다. Revert는 맨 위 B만 새 빈 층으로 바꿉니다. 그러므로 B의 삭제는 최종 HAMT 입력에
          들어가지 않고, 아래 A의 nonce 8만 남습니다.
        </p>
        <p>
          <strong>어디까지 끝난 것일까요?</strong> 같은 bytes의 content-addressed block을 다시 쓰는 일은
          보통 같은 CID를 만듭니다. 그러나 R1을 만들었다고 chain이 R1을 채택한 것은 아닙니다. 중간에
          죽었다면 parent state와 candidate root를 다시 확인하고, 이미 반영한 외부 효과를 중복 실행하지
          않도록 별도 영수증이 필요합니다.
        </p>
        <div id="paper-lotus-statetree-source">
          <CitationBlock type="code" citeKey={4} source="Lotus chain/state/statetree.go · v1.38.3 commit 29d72bd" href={LOTUS_STATE}>
            <p><strong>문제:</strong> 여러 StateTree versions를 load하고 actor changes를 nested snapshot에서 안전하게 flush해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Load/New, ID resolution, overlay lookup, Snapshot·Revert·ClearSnapshot과 Flush를 구현합니다.</p>
            <p><strong>중요 가정:</strong> Lotus v1.38.3 dependencies, network/tree version, actor bundle와 IPLD store를 고정합니다.</p>
            <p><strong>근거 범위:</strong> Pinned Go StateTree implementation입니다.</p>
            <p><strong>일반화 금지:</strong> 모든 later releases, actor business logic, blockstore durability·latency나 chain adoption을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 실패 경계</p>
          <h2 className="mt-2 text-2xl font-bold">
            Version·schema·block·snapshot 상태가 맞지 않으면 추측하지 않고 멈춥니다
          </h2>
        </header>
        <StateFailureBoundaryViz />
        <p>
          StateTree를 읽으려면 top-level root 하나만 있어서는 부족합니다. 먼저 지원하는
          <strong> StateTree version</strong>인지 확인하고, actor의 Code CID가 가리키는 bundle
          schema로 Head 아래 bytes를 해석해야 합니다. 둘 중 하나를 모르면 최신 형식으로 추측하지 않습니다.
        </p>
        <p>
          CID가 있어도 blockstore에서 실제 child block을 읽지 못하면 상태 그래프는 불완전합니다.
          Missing block을 빈 map이나 기본 actor로 바꾸면 다른 root를 사실처럼 만들 수 있으므로 오류로
          남겨야 합니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["지원하지 않는 version", "LoadStateTree가 이해하지 못하는 generation이면 오류를 반환합니다."],
            ["맞지 않는 actor schema", "Code CID와 활성 bundle이 고른 decoder로 읽지 못하면 그 상태를 사용하지 않습니다."],
            ["없는 child block", "CID만으로 bytes를 대신하지 않고 blockstore 조회 실패를 그대로 드러냅니다."],
            ["남아 있는 snapshot", "Layer가 하나가 아니면 Flush가 오류를 반환하므로 nested scope를 먼저 닫습니다."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-lg border border-border p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
        <p>
          마지막 경계는 <strong>local root 생성과 chain 채택</strong>의 차이입니다. Flush가 R1을
          반환했다는 사실은 같은 state graph를 다시 열 수 있다는 뜻입니다. R1이 canonical tipset의
          실행 결과인지, 이후 finality를 얻었는지는 상위 chain 처리에서 따로 확인합니다.
        </p>
        <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">이 글만 읽고 확인할 것:</strong> Actor record 다섯 fields,
          robust→ID resolve, HAMT·AMT 차이, 256/5=52, AMT 42의 digits 2·5, nested snapshot
          결과, wrong bit-width 반례, missing block과 local root·chain root의 차이를 설명할 수 있어야 합니다.
        </aside>
      </section>
    </article>
  );
}
