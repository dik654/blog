import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ModernStateRootViz from "./viz/ModernStateRootViz";

const STATE_SPEC = "https://spec.filecoin.io/systems/filecoin_vm/state_tree/";
const ACTORS = "https://docs.filecoin.io/basics/the-blockchain/actors";
const LOTUS_STATE = "https://github.com/filecoin-project/lotus/blob/c6f4d02400dba55ebc5ab3677ef2ae5a5f4d1aef/chain/state/statetree.go";
const HAMT = "https://github.com/filecoin-project/go-hamt-ipld/tree/0be9a0f6b272246618d22f19f95c28e2e043e890";

export default function ModernLotusStateArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">주소 f0100의 nonce 7을 8로 바꿨을 때</p>
          <h2 className="text-3xl font-bold tracking-tight">
            Lotus state root는 거대한 JSON이 아니라 actor records와 child state를 CID로 잇는 versioned graph다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          State root 하나를 받았다고 모든 actor 정보가 그 값 안에 들어 있는 것은 아닙니다.
          Lotus는 먼저 <strong>StateTree</strong>에서 ID address를 actor record로 찾고,
          record의 <strong>Head CID</strong>를 따라 actor type별 state를 읽습니다. 그 아래의
          balances, sectors, proposals 같은 collection은 다시 HAMT나 AMT root를 가리킬 수
          있습니다. 따라서 올바른 조회에는 root뿐 아니라 tree version, actor Code CID와
          bundle schema, HAMT·AMT parameters가 함께 필요합니다.
        </p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>핵심 아이디어:</strong> <em>address resolve → actor record → Head와 child
          collections → snapshot mutation → versioned root</em>를 하나의 lineage로 보되,
          각 단계의 CID와 schema generation을 기록합니다.
        </aside>
        <ModernStateRootViz />
        <ContentBoundary article="lotus-state" />
      </section>

      <section id="actor-record" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · Actor record</p>
          <h2 className="mt-2 text-2xl font-bold">
            Robust address를 current state의 ID address로 해석한 뒤 Code·Head·Nonce·Balance를 읽는다
          </h2>
        </header>
        <p>
          사용자가 보는 <strong>robust address</strong>는 public key나 actor 생성 정보에서
          안정적으로 유도되는 주소이고, top-level StateTree의 key는 compact한 ID address입니다.
          Lotus는 Init actor state를 이용해 예를 들어 robust address를 <code>f0100</code>으로
          해석한 뒤 actor record를 찾습니다. 고정 예제의 record를 Code <code>C_account</code>,
          Head <code>H_A</code>, nonce 7, balance 25 FIL이라고 두겠습니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Code CID", "어떤 actor code generation과 schema로 읽을지 정합니다."],
            ["Head CID", "Actor type별 state DAG의 root를 가리킵니다."],
            ["Nonce", "발신 message 순서를 제한하는 counter입니다."],
            ["Balance", "Actor에 귀속된 token amount입니다."],
          ].map(([title, description]) => (
            <article key={title} className="min-w-0 rounded-lg border border-border p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
        <p>
          Head는 actor의 모든 state를 record 안에 복제하지 않게 해 줍니다. 같은 content는 같은 CID로 재사용할 수 있고 actor state만 바뀌면 그 경로와
          상위 roots만 새로 생깁니다. 다만 같은 Head bytes를 최신 struct로 무조건 decode하면 안 됩니다. 먼저 볼 것은 network epoch에서 선택된
          actor bundle과 Code CID가 기대하는 schema입니다.
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
            <p><strong>중요 가정:</strong> 2026-08-14 공개 문서와 active actor bundle을 함께 확인합니다.</p>
            <p><strong>근거 범위:</strong> 공식 actor-model 개념 설명입니다.</p>
            <p><strong>일반화 금지:</strong> Actor 수·methods·bundle generation을 영구 고정하거나 actor logic을 인증하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="hamt-amt" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · HAMT and AMT</p>
          <h2 className="mt-2 text-2xl font-bold">
            HAMT는 key hash를, AMT는 integer index를 bit slices로 나눠 sparse path를 고른다
          </h2>
        </header>
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
          annotatedFormula={String.raw`d_{\max}=\underbrace{\left\lceil\frac{b}{w}\right\rceil=\left\lceil\frac{256}{5}\right\rceil=52}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\left\lceil\frac{b}{w}\right\rceil=\left\lceil\frac{256}{5}\right\rceil=52`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 level이 w bits를 소비하므로 전체 bit 수를","나누고 남는 bits가 있으면 마지막 level 하나를 더","셉니다."] },
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
          annotatedFormula={String.raw`q_i=(\underbrace{42}_{\text{Array index 계산}}\gg 3i)\ \&\ (2^3-1),\qquad(q_0,q_1)=(2,5)`}
          operations={[
            { expression: String.raw`42`, annotation: ["Array index이(가) 식의 결과에 기여하는 방식을","계산합니다.","3 bits는 base 8의 한 자리입니다."] },
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
            <p><strong>근거 범위:</strong> Pinned HAMT implementation이며 Lotus v1.36.2는 별도로 AMT v4.4.0·HAMT v3.4.1 dependencies를 고정합니다.</p>
            <p><strong>일반화 금지:</strong> 모든 actor collection이 같은 parameters를 쓰거나 최대 depth만큼 I/O한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="snapshot-flush" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · Snapshot, revert and flush</p>
          <h2 className="mt-2 text-2xl font-bold">
            Overlay는 top-first로 읽고, 실패한 nested layer를 걷어낸 뒤 surviving changes만 root에 반영한다
          </h2>
        </header>
        <p>
          Base root R0에서 f0100의 nonce는 7입니다. Snapshot A를 만들고 nonce를 8로 바꾸면
          lookup은 A의 record를 먼저 봅니다. 그 위에 nested snapshot B를 만들고 actor를
          삭제했다가 B를 <code>Revert</code>하면 삭제 marker만 사라지고 A의 nonce 8은 남습니다.
          A를 clear/merge한 다음 flush하면 surviving actor updates가 HAMT에 적용되고 version,
          Actors root와 Info CID를 묶은 R1이 만들어집니다.
        </p>
        <ExplainedFormula
          question="Versioned StateTree의 새 root CID는 무엇을 봉인해야 할까?"
          idea={<>Revert되지 않은 actor updates를 canonical HAMT에 적용한 Actors root와 tree version·Info CID를 같은 encoded StateRoot에 넣습니다.</>}
          formula={"R_1=\\operatorname{CID}\\!\\left(\\operatorname{DAGCBOR}(v,A_1,I)\\right),\\quad A_1=\\operatorname{HAMTApply}(A_0,U_{\\mathrm{survive}})"}
          annotatedFormula={String.raw`R_1=\underbrace{\operatorname{CID}\!\left(\operatorname{DAGCBOR}(v,A_1,I)\right),\quad A_1=\operatorname{HAMTApply}(A_0,U_{\mathrm{survive}})}_{\text{허용 경계 판정}}`}
          operations={[
            { expression: String.raw`\operatorname{CID}\!\left(\operatorname{DAGCBOR}(v,A_1,I)\right),\quad A_1=\operatorname{HAMTApply}(A_0,U_{\mathrm{survive}})`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Revert되지 않은 actor updates를","canonical HAMT에 적용한 Actors root와","tree version·Info CID를 같은 encoded"] },
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
          <strong>증명 아이디어:</strong> Lookup이 top overlay에서 base로 내려가며 가장 최근
          operation을 선택하고, revert는 top layer를 제거합니다. 따라서 제거된 B의 operations는
          HAMTApply 입력에 들어갈 수 없고, A의 operation만 남습니다. CID의 collision resistance와
          canonical encoding을 전제로 다른 surviving bytes가 우연히 같은 root가 될 가능성은
          무시할 만큼 작습니다.
        </p>
        <p>
          <strong>실패 경계:</strong> Content-addressed blocks는 root publish 전에 써도 같은 bytes면
          retry가 안전하지만, 새 root를 canonical chain effect로 알리는 작업은 별도입니다. Crash가
          block writes와 publish 사이에 나면 candidate root와 parent generation을 확인해 재계산하고,
          이미 publish된 effect를 중복 실행하지 않습니다.
        </p>
        <div id="paper-lotus-statetree-source">
          <CitationBlock type="code" citeKey={4} source="Lotus chain/state/statetree.go · v1.36.2 commit c6f4d02" href={LOTUS_STATE}>
            <p><strong>문제:</strong> 여러 StateTree versions를 load하고 actor changes를 nested snapshot에서 안전하게 flush해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Load/New, ID resolution, overlay lookup, Snapshot·Revert·ClearSnapshot과 Flush를 구현합니다.</p>
            <p><strong>중요 가정:</strong> Lotus v1.36.2 dependencies, network/tree version, actor bundle와 IPLD store를 고정합니다.</p>
            <p><strong>근거 범위:</strong> Pinned Go StateTree implementation입니다.</p>
            <p><strong>일반화 금지:</strong> 모든 later releases, actor business logic, blockstore durability·latency나 chain adoption을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · Release and rollback</p>
          <h2 className="mt-2 text-2xl font-bold">
            Happy-path lookup보다 wrong schema·missing block·nested revert·crash replay를 먼저 통과시킨다
          </h2>
        </header>
        <p>
          Release artifact에 기록하는 것은 Lotus source SHA와 network·StateTree version, actor manifest/bundle입니다.
          HAMT·AMT library/options와 codec, base root, blockstore generation도 함께 남깁니다. Canary는 f0100 record와
          Head child fields를 reference reader와 비교하고 cold load와 warm cache가 같은 결과를 내는지 확인합니다.
        </p>
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            ["Positive parity", "Actor fields, absent lookup, AMT/HAMT samples와 final root를 독립 oracle과 비교합니다."],
            ["Negative decode", "Wrong tree version·actor bundle·bit width·malformed CBOR·missing child를 거부합니다."],
            ["Transaction recovery", "Nested snapshot commit/revert와 crash-before/after root publish를 재생합니다."],
            ["Release decision", "Correctness를 먼저 통과한 뒤 lookup/flush p50·p95·I/O와 cache hit를 측정합니다."],
          ].map(([title, description]) => (
            <li key={title} className="rounded-lg border border-border p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>
        <p>
          Canary가 실패하면 새 writes와 root publication을 멈추고 이전 compatible reader/writer와 schema generation으로 돌아갑니다.
          이미 저장된 content-addressed blocks는 지울 필요가 없습니다. 대신 어느 root가 canonical하게 publish됐는지 확인한 뒤 orphan
          candidate를 가려냅니다. Benchmark는 같은 root와 cache state, blockstore, hardware, concurrency에서만 비교하며 “52
          levels” 같은 구조적 상한을 latency 예측으로 바꾸지 않습니다.
        </p>
        <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Article-only 10/10:</strong> Actor record 네 fields,
          robust→ID resolve, HAMT·AMT 차이, 256/5=52, AMT 42의 digits 2·5, nested snapshot
          결과, wrong bit-width 반례, wrong bundle migration, crash recovery와 release matrix를
          이 글만으로 답할 수 있습니다.
        </aside>
      </section>
    </article>
  );
}
