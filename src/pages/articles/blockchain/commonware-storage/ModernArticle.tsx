import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import CommonwareStorageLocator, { CommonwareStorageMapReturn } from "./CommonwareStorageLocator";
import { codeRefs } from "./codeRefs";
import { commonwareStorageTree } from "./fileTrees";
import {
  BranchDurabilityViz,
  MmrElevenViz,
  ProofBoundaryViz,
  StorageLifecycleViz,
} from "./viz/ModernCommonwareStorageViz";

export default function ModernCommonwareStorageArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <CommonwareStorageLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">두 key update는 언제 복구하고 검증할 수 있는 저장 상태가 되는가</h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            외부 Application이 Alice의 값을 10으로, Bob의 값을 15로 바꾸는 두 update를 만들었다고 가정하겠습니다. Commonware QMDB는 송금을 계산하지 않습니다. 여기서는 이미 만들어진 두 update를 담은 <code>batch-7</code> 하나가 candidate root, visible state, durable state, Current proof를 차례로 만드는 경로만 추적합니다.
          </p>
        </div>
        <StorageLifecycleViz />
        <p className="text-lg leading-8">
          <strong>Merkleize는 적용했을 때의 candidate root를 계산하고, apply는 현재 DB view와 journal을 바꾸며, commit 또는 sync가 그 state를 durable하게 만듭니다.</strong> 이후 Current proof는 operation이 log에 들어 있다는 사실뿐 아니라 activity bit가 1이라는 사실까지 canonical root 아래에서 확인합니다.
        </p>
        <p>
          이 글은 Commonware v2026.9.0의 MMR·QMDB 개념 경계만 다룹니다. Application의 상태 전이 규칙, 실제 disk 성능, 백업·운영 배포, 어떤 DB를 채택할지는 이 글의 범위가 아닙니다.
        </p>
        <ContentBoundary article="commonware-primitives-simplex-storage" />
      </section>

      <section id="batch-path" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Batch는 DB 복사본이 아니라 이기는 branch에 붙어 있는 작업 공간입니다</h2>
        <p>
          <code>new_batch()</code>가 만든 batch는 현재 DB state를 부모로 가집니다. <code>write()</code>는 update나 delete를 batch에만 기록하고, <code>merkleize()</code>가 현재 state에 mutation을 resolve해 candidate root를 계산합니다. 이때까지 DB의 visible root와 disk state는 그대로입니다.
        </p>
        <p>
          <code>validate_batch()</code>는 batch의 base와 ancestor chain이 현재 DB prefix에 이어지는지 검사합니다. 통과한 batch를 <code>apply_batch()</code>에 넘기면 operation log와 Current view가 바뀌지만, 이 메서드의 문서도 commit·start_sync·sync 가운데 하나를 거쳐야 applied state가 durable하다고 밝힙니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Batch 수명주기 코드" onClick={() => sidebar.open("qmdb-lifecycle", codeRefs["qmdb-lifecycle"])} />
          <CodeViewButton label="Apply·durability 코드" onClick={() => sidebar.open("qmdb-durability", codeRefs["qmdb-durability"])} />
        </div>
      </section>

      <section id="proof-layout" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">MMR은 append해도 기존 node position을 바꾸지 않습니다</h2>
        <p>
          Merkle Mountain Range(MMR)는 높이가 큰 순서로 완전 이진트리를 나열합니다. Leaf의 삽입 순서가 <code>location</code>이고, leaves와 internal nodes를 post-order로 늘어놓은 전체 index가 <code>position</code>입니다. Append-only 구조이므로 이미 생긴 position은 이후 append에도 그대로 남습니다.
        </p>
        <MmrElevenViz />
        <ExplainedFormula
          question="11개 leaf를 append한 MMR에는 peak와 node가 몇 개 생깁니까?"
          idea={<>11을 이진수로 쓰면 1011입니다. 1인 bit마다 크기가 8·2·1인 완전 이진트리 하나가 대응하므로 peak는 세 개입니다. Leaf가 L개인 완전 이진트리는 node가 2L−1개이므로 세 tree를 합하면 19개입니다.</>}
          formula={String.raw`\begin{aligned}peaks(N)&=popcount(N)\\nodes(N)&=2N-popcount(N)\\N=11&:\ 3\ peaks,\ 19\ nodes\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}peaks(N)&=\underbrace{popcount(N)}_{\text{1인 bit마다 mountain 하나}}\\nodes(N)&=\underbrace{2N-popcount(N)}_{\text{각 tree의 2L-1을 합함}}\\N=11&:\ 3\ peaks,\ 19\ nodes\end{aligned}`}
          operations={[
            { expression: String.raw`11_{10}=1011_2`, annotation: ["8·2·1 자리에 1이 있습니다.", "그래서 서로 다른 높이의 mountain 세 개가 생깁니다."] },
            { expression: String.raw`popcount(1011_2)=3`, annotation: ["1인 bit 수가 peak 수입니다.", "그림의 position 14·17·18이 세 peak입니다."] },
            { expression: String.raw`2\times11-3=19`, annotation: ["Leaf 11개를 두 배한 뒤", "서로 분리된 tree 수 3을 뺍니다."] },
          ]}
          terms={[
            { symbol: "N", name: "leaf count", description: "Append된 element 수입니다." },
            { symbol: "popcount(N)", name: "set-bit count", description: "N의 이진 표현에서 1인 bit 수입니다." },
            { symbol: "peak", name: "mountain root", description: "각 완전 이진트리의 root입니다." },
            { symbol: "position", name: "node index", description: "모든 node를 post-order로 나열한 index입니다." },
          ]}
          assumptions={[
            "Commonware MMR의 append-only post-order layout을 사용합니다.",
            "Root를 계산할 때 verifier와 같은 bagging 정책과 leaf count를 사용합니다.",
            "Node hash에는 Commonware가 정한 positioned hashing 규칙이 적용됩니다.",
            "MMR inclusion proof는 key의 현재성이나 disk durability를 증명하지 않습니다.",
          ]}
          interpretation="11개 leaf는 8·2·1 크기의 mountain 세 개를 만들고 전체 node는 19개입니다. Proof는 해당 leaf에서 peak까지의 path와 다른 peaks를 같은 bagging 규칙으로 결합해 expected root와 비교합니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="MMR location·position 코드" onClick={() => sidebar.open("mmr-family", codeRefs["mmr-family"])} />
        </div>
      </section>

      <section id="database-paths" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Any와 Current는 같은 operation에 다른 질문을 합니다</h2>
        <p>
          QMDB의 state는 append-only operation log에서 파생됩니다. Any proof는 어떤 key가 과거에 특정 value를 가졌다는 사실을 증명합니다. 이후 같은 key를 update하거나 delete했는지는 이 증거만으로 알 수 없습니다.
        </p>
        <ProofBoundaryViz />
        <p>
          Current는 operation마다 active 여부를 bitmap으로 관리합니다. Verifier는 operation의 range proof와 그 위치가 들어 있는 bitmap chunk를 받아 grafting boundary에서 둘을 한 path로 결합합니다.
        </p>
        <p>
          Activity bit가 0이면 operation이 log에 남아 있어도 현재 값 proof는 실패합니다. Bit가 1이어도 reconstructed root가 expected canonical root와 다르면 실패합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Current proof 검증 코드" onClick={() => sidebar.open("current-proof", codeRefs["current-proof"])} />
        </div>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Stale batch와 미완료 durability를 같은 실패로 보지 않습니다</h2>
        <BranchDurabilityViz />
        <p>
          같은 base에서 batch A와 B를 만들고 A를 먼저 적용하면 DB prefix는 A 쪽으로 이동합니다. B는 A의 descendant가 아니므로 <code>StaleBatch</code>입니다. Current 문서는 이런 batch를 다시 읽거나 child를 만들거나 apply하지 말라고 명시합니다. <code>validate_batch()</code>는 이 검사를 DB handle을 소비하기 전에 수행합니다.
        </p>
        <p>
          Ancestry가 맞아 apply에 성공했더라도 durability 단계는 남습니다. <code>commit()</code>은 applied state를 durable하게 하지만 crash 뒤 recovery가 필요할 수 있습니다. <code>sync()</code>는 모든 DB state와 bitmap metadata를 disk에 기록해 다음 시작 때 recovery가 필요 없는 경계를 만듭니다.
        </p>
        <p>
          둘 가운데 어느 수준을 외부 성공 응답과 연결할지는 Application contract의 별도 결정입니다.
        </p>
        <p>
          Prune도 단순 삭제가 아닙니다. Current는 inactivity floor 아래 bitmap chunk를 지우기 전에 grafted tree의 필요한 peak digest를 metadata에 pinned node로 남깁니다. Pruned operation의 proof 요청은 <code>OperationPruned</code>처럼 명시적인 오류로 끝날 수 있으며, root 하나만 남았다고 과거 proof를 다시 만들 수 있는 것은 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Sibling stale 코드" onClick={() => sidebar.open("qmdb-stale", codeRefs["qmdb-stale"])} />
          <CodeViewButton label="Commit·sync 코드" onClick={() => sidebar.open("qmdb-durability", codeRefs["qmdb-durability"])} />
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 버전 경계</h2>
        <div className="not-prose grid gap-px bg-border p-px lg:grid-cols-3">
          <div id="paper-commonware-qmdb">
            <CitationBlock source="Commonware QMDB module docs · v2026.9.0" citeKey={1} type="code" href="https://docs.rs/commonware-storage/2026.9.0/commonware_storage/qmdb/index.html">
              <p><strong>확인한 것:</strong> Batch 생성·mutation·merkleize·apply 수명주기와 commit·start_sync·sync의 durability 의미입니다.</p>
              <p><strong>말하지 않는 것:</strong> Candidate root가 durable state이거나 외부 client success라는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-commonware-current">
            <CitationBlock source="Commonware Current QMDB docs · v2026.9.0" citeKey={2} type="code" href="https://docs.rs/commonware-storage/2026.9.0/commonware_storage/qmdb/current/index.html">
              <p><strong>확인한 것:</strong> Any·Current 경계, activity bitmap grafting, canonical root, branch-scoped batch와 prune recovery입니다.</p>
              <p><strong>말하지 않는 것:</strong> 모든 proof가 같은 크기이거나 모든 storage backend에서 같은 성능이 나온다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-commonware-storage-source">
            <CitationBlock source="Commonware storage source · v2026.9.0 · d476a236" citeKey={3} type="code" href="https://github.com/commonwarexyz/monorepo/tree/d476a2361ce6840d2b9d0aa6fb30a924429046d4/storage/src">
              <p><strong>확인한 것:</strong> MMR location 변환, OperationProof의 activity 검사, stale batch 거절, Current apply·commit·sync 구현입니다.</p>
              <p><strong>범위:</strong> 2026-10-30에 고정한 exact tag와 commit의 공개 구현입니다.</p>
            </CitationBlock>
          </div>
        </div>
        <p>
          기존 글에 있던 공통 <code>Persistable</code> trait 설명은 이 버전에서 제거되어 사용하지 않았습니다. Alice·Bob 값과 <code>batch-7</code>, <code>R6</code>, <code>R7</code>은 한 경로를 눈으로 추적하기 위한 글 안의 가정이며 실제 protocol field나 측정값이 아닙니다.
        </p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">흐름을 다시 말해 보기</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li><code>merkleize()</code> 뒤 candidate root가 있는데도 저장 완료라고 부를 수 없는 이유는 무엇입니까? <strong>(답: DB에 apply되지 않았고 durable commit·sync도 아직 없기 때문입니다.)</strong></li>
          <li>Any proof가 통과한 Alice=10을 현재 값이라고 단정할 수 없는 이유는 무엇입니까? <strong>(답: 이후 Alice update가 생겨 op 0의 activity bit가 0이 되었을 수 있기 때문입니다.)</strong></li>
          <li>Batch A를 적용한 뒤 sibling B가 실패하는 기준은 무엇입니까? <strong>(답: B의 base와 ancestor chain이 현재 DB prefix인 A 쪽 state에 이어지지 않아 StaleBatch가 되기 때문입니다.)</strong></li>
          <li><code>commit()</code>과 <code>sync()</code>의 공통점과 차이는 무엇입니까? <strong>(답: 둘 다 applied state를 durable하게 만들지만 sync는 다음 시작 때 recovery가 필요 없는 상태까지 보장합니다.)</strong></li>
        </ol>
        <p className="text-sm text-muted-foreground">
          다음 글에서는 <Link to="/cs/blockchain/commonware-crypto-p2p#overview" className="font-bold text-primary hover:underline">Commonware authenticated P2P</Link>로 이동해 저장된 bytes가 알려진 상대와 인증된 channel을 거쳐 전달되는 경로를 확인합니다.
        </p>
      </section>

      <CommonwareStorageMapReturn />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ commonware: commonwareStorageTree }}
        projectMetas={{
          commonware: {
            id: "commonware",
            label: "Commonware v2026.9.0 · Rust",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
