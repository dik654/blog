import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import type { ProjectMeta } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation-block";
import RethEip4844Locator, {
  RethEip4844MapReturn,
} from "../reth-eip4844/RethEip4844Locator";
import BlobReorgTraceViz from "./BlobReorgTraceViz";
import { codeRefs } from "./codeRefs";
import { rethBlobReorgReleaseTree } from "./fileTree";

const PROJECT_META: Record<string, ProjectMeta> = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
};

function CodeLink({
  codeKey,
  label,
  open,
}: {
  codeKey: keyof typeof codeRefs;
  label: string;
  open: (key: string, ref: (typeof codeRefs)[string]) => void;
}) {
  return (
    <div className="not-prose flex flex-wrap items-center gap-2">
      <CodeViewButton onClick={() => open(codeKey, codeRefs[codeKey])} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function ModernBlobReorgRelease() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-20 space-y-5">
        <RethEip4844Locator current="reth-blob-reorg-release" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            이전 블록에서 빠진 Blob transaction은 sidecar와 어떻게 다시 만납니까?
          </h2>
        </div>
        <p className="text-lg leading-8">
          앞 글에서 Blob transaction과 sidecar를 transaction hash로 보관하는 경로를
          확인했습니다. 이 글에서는 예시 transaction을 T₀, sidecar를 S₀, transaction
          hash를 H₀라고 부릅니다. 세 이름과 block 100·100′·101은 설명용 fixture입니다.
        </p>
        <p className="text-lg leading-8">
          T₀가 old canonical block 100에 포함됐지만 reorg 뒤 선택된 new block 100′에는
          들어 있지 않다고 하겠습니다. Reth는 old block의 body에서 T₀를 되찾고 local
          BlobStore의 S₀를 붙여야 T₀를 Pool 후보로 되돌릴 수 있습니다.
        </p>
        <BlobReorgTraceViz />
        <p>
          기존 글은 별도 <code>sidecar receipt</code>와 <code>generation</code>을 확인하고,
          local miss 뒤 network fetch로 넘어가는 것처럼 설명했습니다. Reth v2.8.1의 이
          경로에는 그런 상태가 없습니다. 실제 분기는 <code>get_blob(H₀)</code>가 S₀를
          반환하는지이며, miss나 store error는 이 local reinsert 후보를 만들지 못합니다.
        </p>
        <ContentBoundary article="reth-blob-reorg-release" />
      </section>

      <section id="old-new" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">이전 체인과 새 체인의 차집합</h2>
        <p>
          <code>CanonStateNotification::Reorg</code>는 old chain과 new chain을 함께
          전달합니다. Reth는 먼저 new chain에 포함된 transaction hash를 집합으로 만든 뒤,
          old chain의 transaction 가운데 그 집합에 없는 것만 고릅니다. T₀의 H₀가 new
          집합에 없으므로 T₀는 <code>pruned_old_transactions</code> 후보가 됩니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px text-sm sm:grid-cols-3">
          {[
            ["Old block 100", "{H₀} · T₀가 이전 canonical block에 포함"],
            ["New block 100′", "{} · H₀가 새 canonical branch에는 없음"],
            ["Old − New", "{H₀} · Pool에 되돌릴 후보"],
          ].map(([title, detail]) => (
            <div key={title} className="bg-background p-4">
              <strong className="block text-primary">{title}</strong>
              <span className="mt-2 block break-keep text-muted-foreground">{detail}</span>
            </div>
          ))}
        </div>
        <p>
          이 비교는 “old block에서 유효했으므로 항상 다시 넣는다”는 뜻이 아닙니다. New tip의
          nonce·balance·base fee와 Pool 정책이 이미 달라졌을 수 있습니다. 차집합은 재검사할
          후보를 고를 뿐 최종 admission을 보장하지 않습니다.
        </p>
      </section>

      <section id="reinsert" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">Body와 sidecar 재결합</h2>
        <p>
          일반 transaction은 old block의 body만으로 Pool transaction을 다시 만들 수
          있습니다. Blob transaction은 다릅니다. Block에는 Blob bytes가 없으므로 Reth는
          <code>pool.get_blob(H₀)</code>로 local S₀를 읽고
          <code>try_from_eip4844(T₀, S₀)</code>를 호출합니다. 주석에 적힌 직접적인 이유는
          network 전파에 쓰는 encoded length를 정확히 계산하기 위해서입니다.
        </p>
        <TermBreakdown
          title="재결합할 때 소유자가 다른 세 상태"
          items={[
            {
              term: "Old-chain body",
              description: "Old block이 제공하는 signed transaction T₀와 sender입니다.",
              boundary: "Body에는 실제 Blob bytes와 KZG proof가 들어 있지 않습니다.",
            },
            {
              term: "Local BlobStore",
              description: "H₀를 key로 이전에 검증해 넣은 sidecar S₀를 돌려줍니다.",
              boundary: "Local miss를 versioned hash만으로 복원할 수는 없습니다.",
            },
            {
              term: "Transaction Pool",
              description: "T₀와 S₀를 결합한 후보를 new tip 기준으로 다시 admission합니다.",
              boundary: "Reorg 전 local·external origin은 잃으므로 external transaction으로 넣습니다.",
            },
          ]}
        />
        <CodeLink
          codeKey="reorg-maintain"
          label="Reth v2.8.1 · old−new 차집합, get_blob, state update와 재주입 순서"
          open={sidebar.open}
        />
      </section>

      <section id="missing-sidecar" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">S₀가 없으면 어떻게 됩니까?</h2>
        <p>
          Reorg maintenance의 <code>get_blob(H₀).ok().flatten()</code>은 store error와
          <code>None</code>을 모두 sidecar 없음으로 바꿉니다. 이어지는
          <code>filter_map</code>에서 T₀는 재주입 목록에 들어가지 않습니다. 이 함수는 peer에
          S₀를 요청하거나 빈 sidecar를 만들어 대신 넣지 않습니다.
        </p>
        <p>
          별도의 validation 경로에서 transaction이 <code>Missing</code> sidecar variant로
          들어오면 <code>blob_store.contains(H₀)</code>를 확인합니다. 존재하면 이전 검증과
          저장을 신뢰해 계속 진행하고, 없으면 <code>MissingEip4844BlobSidecar</code>로
          거부합니다. 이것은 별도 receipt를 검증하는 구조가 아니라 local store 존재 여부에
          기대는 구현입니다.
        </p>
        <CodeLink
          codeKey="validate-missing"
          label="Reth v2.8.1 · Missing sidecar의 local store hit와 typed rejection"
          open={sidebar.open}
        />
      </section>

      <section id="update-order" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">새 state를 먼저 반영합니다</h2>
        <p>
          재구성한 T₀를 곧바로 넣지 않습니다. Reth는 먼저 new tip, 새 base fee와 Blob fee,
          changed accounts, new chain에서 mined된 transaction을
          <code>on_canonical_state_change</code>로 Pool에 반영합니다. 그다음 T₀를
          <code>add_external_transactions</code>로 넣습니다. 이 순서 덕분에 T₀는 old state가
          아니라 new canonical state를 기준으로 다시 검사됩니다.
        </p>
        <div className="not-prose border-y border-border py-5">
          <ol className="grid gap-3 text-sm sm:grid-cols-3">
            {[
              ["01", "New state", "새 tip·fee·account와 mined hash 반영"],
              ["02", "Reinsert", "T₀+S₀를 external origin으로 admission"],
              ["03", "Tracker", "높이 100의 기록을 100′ 내용으로 교체"],
            ].map(([number, title, detail]) => (
              <li key={number} className="border border-border p-4">
                <span className="font-mono text-[9px] font-black text-primary">{number}</span>
                <strong className="mt-1 block">{title}</strong>
                <span className="mt-2 block break-keep text-xs leading-5 text-muted-foreground">
                  {detail}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <p>
          Tracker도 같은 높이 100의 old 기록 <code>[H₀]</code>를 new block 100′의 빈
          목록으로 교체합니다. 그렇지 않으면 block 100′이 finalized될 때 아직 Pool에서 다시
          대기 중인 T₀의 S₀를 잘못 지울 수 있습니다.
        </p>
      </section>

      <section id="finality" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">다시 포함된 뒤 정리</h2>
        <p>
          Fixture를 한 단계 더 진행해 T₀가 block 101에 다시 포함됐다고 하겠습니다. Tracker는
          <code>101 → [H₀]</code>를 기록합니다. Finalized height가 101에 도달하면
          <code>on_finalized_block(101)</code>이 H₀를 <code>Finalized</code> update로
          내보내고, maintenance loop가 <code>delete_blobs</code>와 background
          <code>cleanup_blobs</code>를 실행합니다.
        </p>
        <p>
          T₀가 다시 포함되지 않고 Pool에 오래 남는 경우에는 finality tracker가 아니라 stale
          transaction eviction이 sidecar 삭제를 맡습니다. 두 경로 모두 local transaction
          pool 수명주기이며, consensus layer의 Blob availability나 영구 archive 보존 기간을
          결정하지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeLink
            codeKey="tracker"
            label="Reth v2.8.1 · 같은 높이 교체와 finalized hash 배출"
            open={sidebar.open}
          />
          <CodeLink
            codeKey="finality-maintain"
            label="Reth v2.8.1 · delete_blobs와 background cleanup 연결"
            open={sidebar.open}
          />
        </div>
      </section>

      <section id="failure-boundaries" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">실제 실패 동작</h2>
        <TermBreakdown
          title="코드가 감추지 않는 네 경계"
          items={[
            {
              term: "BlobStore miss 또는 error",
              description: "Reorg maintenance에서는 둘 다 재결합 실패가 되어 T₀가 후보 목록에서 빠집니다.",
              boundary: "이 함수 내부의 network fetch나 자동 복구로 이어지지 않습니다.",
            },
            {
              term: "재구성 실패",
              description: "try_from_eip4844가 실패하면 filter_map이 T₀를 제외합니다.",
              boundary: "Old block에 있었다는 사실만으로 잘못된 후보를 강제로 넣지 않습니다.",
            },
            {
              term: "Admission 재실패",
              description: "add_external_transactions는 new state 기준의 정상 Pool 검사를 다시 거칩니다.",
              boundary: "Reinserted metric은 만든 후보 수이며 최종 accepted 수와 같은 뜻이 아닙니다.",
            },
            {
              term: "Tracker 교체 누락",
              description: "Reorg new chain 기록으로 같은 높이를 덮어써야 finality 삭제 대상이 맞아집니다.",
              boundary: "Block number만 보고 old와 new canonical 내용을 동시에 유지하지 않습니다.",
            },
          ]}
        />
      </section>

      <section id="source" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">근거 범위</h2>
        <CitationBlock
          type="code"
          citeKey={1}
          source="Reth v2.8.1 · d763342fa185 · transaction-pool maintenance"
          href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/transaction-pool/src/maintain.rs"
        >
          <p>
            <b>확인한 범위:</b> Reorg의 old−new 차집합부터 finality cleanup까지
            확인했습니다. BlobStore 조회, transaction 재구성, canonical state update와
            tracker 교체도 범위에 포함합니다.
          </p>
          <p>
            <b>고정 조건:</b> 2026-10-23에 게시된 Reth v2.8.1 tag를 사용했습니다. Source
            commit은 <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>입니다.
          </p>
          <p>
            <b>교정한 주장:</b> 실제 source에는 sidecar receipt와 generation이 없습니다.
            Local miss 뒤 network fetch가 이어진다는 설명도 제거했습니다.
          </p>
          <p>
            <b>확대하지 않은 범위:</b> 이 글은 local execution-client Pool의 수명주기를
            다룹니다. 이를 consensus availability, P2P 재수집 SLA나 영구 archive 보장으로
            확대하지 않습니다.
          </p>
          <p>
            <b>측정하지 않은 값:</b> 실제 reorg 빈도와 get_blob latency는 아직 측정하지
            않았습니다. Reinsert 성공률과 cleanup 시간도 대상 환경에서 측정하지 않았습니다.
          </p>
        </CitationBlock>
        <RethEip4844MapReturn current="reth-blob-reorg-release" />
      </section>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ reth: rethBlobReorgReleaseTree }}
        projectMetas={PROJECT_META}
      />
    </article>
  );
}
