import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "../lsm-tree/StorageEngineLocator";
import RethProviderReadViz from "./viz/RethProviderReadViz";

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="reth-provider" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">블록 하나를 지정한 상태 조회는 memory와 disk를 어떻게 한 시점으로 묶을까요?</h2>
        </div>
        <RethProviderReadViz />
        <p className="text-lg leading-8">설명용 요청은 블록 1,000의 해시 <code>H1000</code>에서 계정 A의 잔액과 storage slot K를 읽습니다. 영속 저장은 995까지 끝났고 996~1,000은 memory에 남아 있다고 하겠습니다. 숫자와 값은 흐름을 설명하는 가정이며 실제 체인 높이가 아닙니다.</p>
        <p><code>StateProvider</code>는 저장소를 감추는 단순 wrapper가 아닙니다. 먼저 어느 블록 실행 뒤의 상태인지 정하고, 그 블록에 맞는 execution overlay와 읽기 전용 DB snapshot을 조합해 account·storage·bytecode·proof가 같은 기준점을 보게 합니다.</p>
      </section>

      <section id="selector" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">StateProviderFactory가 latest·historical·pending을 먼저 나눕니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["latest", "현재 canonical head", "Memory head가 있으면 그 state에 고정하고, 없으면 DB latest를 엽니다."],
            ["historical", "이미 영속화된 과거 블록", "Number는 canonical hash를 찾고 hash는 DB snapshot과 overlay anchor가 됩니다."],
            ["pending", "canonical chain을 한 블록 연장한 상태", "Pending state가 없으면 pending()은 latest로 되돌아갑니다."],
          ].map(([title, role, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm text-primary">{title}</strong><p className="mt-2 text-xs font-bold">{role}</p><p className="mt-2 break-keep text-[11px] leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p>이 상태들은 모두 선택한 블록의 실행이 끝난 뒤 상태를 뜻합니다. 따라서 블록 1,000 자체를 다시 실행하려면 999 실행 뒤의 상태를 선택해야 합니다. ‘블록 번호 1,000’과 ‘블록 1,000을 실행할 부모 상태’를 같은 것으로 보면 한 블록만큼 어긋납니다.</p>
      </section>

      <section id="snapshot" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Memory head를 먼저 잡고 DB snapshot을 나중에 엽니다</h2>
        <div className="not-prose grid gap-3 border-y border-border py-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="border border-primary p-4"><span className="text-[9px] font-bold text-muted-foreground">01 · MEMORY</span><strong className="mt-2 block text-sm">head_state를 capture</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">아직 DB로 flush되지 않은 canonical 범위를 고정합니다.</p></div>
          <span className="hidden font-black text-primary sm:block">→</span>
          <div className="border border-primary p-4"><span className="text-[9px] font-bold text-muted-foreground">02 · DATABASE</span><strong className="mt-2 block text-sm">database_provider_ro()</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">같은 순간 이후의 read transaction을 엽니다.</p></div>
        </div>
        <p>순서를 바꾸면 오래된 DB snapshot을 연 직후 memory block이 DB로 flush되고 memory에서 지워질 수 있습니다. 그러면 두 snapshot 사이에 어느 쪽에도 없는 구간이 생깁니다. Reth v2.8.1의 <code>ConsistentProvider::new</code>가 memory를 먼저 읽는 이유입니다.</p>
        <p>단, safe·finalized·pending 표시는 provider를 들고 있는 동안에도 바뀔 수 있다고 소스가 경고합니다. ‘consistent’라는 이름을 모든 mutable marker의 영구 고정으로 확대하면 안 됩니다.</p>
      </section>

      <section id="overlay" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">계정과 slot은 execution overlay를 먼저 확인합니다</h2>
        <div className="not-prose border-y border-border py-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border border-primary p-3"><span className="text-[9px] text-muted-foreground">ACCOUNT A</span><strong className="mt-2 block text-sm">overlay balance = 7</strong><p className="mt-1 text-[10px] leading-4 text-muted-foreground">DB의 이전 값 10보다 우선</p></div>
            <div className="border border-border p-3"><span className="text-[9px] text-muted-foreground">SLOT K</span><strong className="mt-2 block text-sm">overlay에 기록 없음</strong><p className="mt-1 text-[10px] leading-4 text-muted-foreground">History 또는 DB로 내려감</p></div>
            <div className="border border-border p-3"><span className="text-[9px] text-muted-foreground">RESULT</span><strong className="mt-2 block text-sm">A = 7 · K = 5</strong><p className="mt-1 text-[10px] leading-4 text-muted-foreground">같은 H1000 anchor에서 조합</p></div>
          </div>
        </div>
        <p><code>basic_account</code>는 execution overlay의 account map을 먼저 보고, <code>storage</code>는 overlay의 slot 값을 먼저 봅니다. Account가 overlay에서 삭제 상태라면 <code>None</code>이 최종 답이며 DB의 옛 account로 내려가지 않습니다. Slot 값은 EVM 의미상 0일 수 있으므로 account absence와 동일한 규칙으로 읽지 않습니다.</p>
      </section>

      <section id="history" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Overlay에 없으면 history evidence와 현재 DB 상태 중 가능한 경로를 고릅니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["NotYetWritten", "선택한 시점에 아직 존재하지 않은 값으로 답합니다."],
            ["InChangeset", "처음 바뀐 블록의 변경 전 값을 changeset에서 가져옵니다."],
            ["InPlainState", "현재 plain 또는 hashed state table에서 읽습니다."],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p>필요한 account 또는 storage history가 pruning 경계보다 오래됐다면 <code>StateAtBlockPruned</code>로 중단합니다. Changeset이 있어야 할 위치에서 행을 찾지 못해도 별도 오류입니다. 정상적인 값 부재와 보관하지 않아 읽을 수 없는 상태를 같은 <code>None</code>으로 만들지 않는 경계입니다.</p>
      </section>

      <section id="code" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실제 구현은 source 선택과 key별 우선순위를 따로 둡니다</h2>
        <pre className="not-prose overflow-x-auto border-y border-border bg-muted/20 p-4 text-[11px] leading-5"><code>{`fn state_by_block_hash(hash) {
    // 아직 memory에 남아 있는 canonical state를 먼저 찾습니다.
    if let Some(state) = canonical_in_memory_state.state_by_hash(hash) {
        return state_provider_for_state(state);
    }

    // 없으면 영속화된 history, 그다음 pending에서 찾습니다.
    history_by_block_hash(hash)
        .or_else(|| pending_state_by_hash(hash))
}

fn basic_account(address) {
    // 선택한 block anchor의 실행 결과가 DB보다 우선합니다.
    if let Some(account) = execution_overlay.accounts().get(address) {
        return account;
    }

    // Overlay에 없을 때만 history 또는 DB snapshot으로 내려갑니다.
    historical_fallback_or_database(address)
}`}</code></pre>
        <p>위 코드는 분기 구조를 보이기 위한 축약입니다. 반환 형식과 오류 전파를 포함한 정확한 구현은 아래 v2.8.1 소스에 귀속합니다.</p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">설명은 Reth v2.8.1의 StateProvider와 storage overlay에 고정했습니다</h2>
        <CitationBlock source="Reth v2.8.1 · StateProvider API" citeKey={1} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/storage/storage-api/src/state.rs"><p><b>확인한 범위:</b> StateProvider capability, latest·historical·pending 구분과 상태가 선택 블록 실행 뒤를 뜻하는 규칙입니다.</p><p><b>확대하지 않은 범위:</b> Trait 자체가 archive availability나 모든 조회의 snapshot 일관성을 보장한다는 뜻은 아닙니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · BlockchainProvider" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/storage/provider/src/providers/blockchain_provider.rs"><p><b>확인한 범위:</b> Memory·history·pending source 선택과 block hash에 고정한 overlay provider 생성입니다.</p><p><b>확대하지 않은 범위:</b> 대상 서비스의 RPC 지연이나 pruning 정책은 아직 측정하지 않았습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · OverlayStateProvider" citeKey={3} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/storage/storage-overlay/src/provider.rs"><p><b>확인한 범위:</b> Execution overlay, historical fallback, account·storage lookup 우선순위와 prune 오류입니다.</p><p><b>확대하지 않은 범위:</b> Cache hit이나 lazy resolution이 특정 장비의 성능 우위를 증명하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · ConsistentProvider" citeKey={4} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/storage/provider/src/providers/consistent.rs"><p><b>확인한 범위:</b> Memory head를 먼저 capture하고 DB snapshot을 여는 순서와 range merge 경계입니다.</p><p><b>주의:</b> Safe·finalized·pending marker는 provider lifetime 동안 바뀔 수 있다는 구현 주석을 함께 반영했습니다.</p></CitationBlock>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="reth-provider-review">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="reth-provider-review" className="mt-2 text-xl font-bold">H1000의 account와 slot 조회를 세 문장으로 추적해 보세요</h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3">
          <li className="bg-background p-4"><strong className="block text-xs text-primary">01 · 선택</strong><span className="mt-2 block">왜 block hash와 latest·historical·pending 종류를 먼저 정할까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">02 · 조합</strong><span className="mt-2 block">왜 memory/overlay를 먼저 보고 같은 DB snapshot으로 내려갈까요?</span></li>
          <li className="bg-background p-4"><strong className="block text-xs text-primary">03 · 실패</strong><span className="mt-2 block">왜 값 부재와 pruned·missing changeset을 구분해야 할까요?</span></li>
        </ol>
      </section>

      <StorageEngineMapReturn current="reth-provider" />
    </article>
  );
}
