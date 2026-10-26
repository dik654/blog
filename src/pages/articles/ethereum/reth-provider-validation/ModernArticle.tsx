import type { ReactNode } from "react";
import { CitationBlock } from "@/components/ui/citation-block";
import StorageEngineLocator, { StorageEngineMapReturn } from "../lsm-tree/StorageEngineLocator";
import RethProviderValidationViz from "./viz/RethProviderValidationViz";

const LABEL = ({ children }: { children: ReactNode }) => <span className="mr-2 inline-block border border-primary/40 px-1.5 py-0.5 align-middle text-[9px] font-black text-primary">{children}</span>;

export default function ModernArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <StorageEngineLocator current="reth-provider-validation" />
        <div><p className="text-xs font-bold text-primary">실무 글 · 개념을 운영 판단으로 연결하기</p><h2 className="mt-2 break-keep text-3xl font-bold">Provider 변경은 같은 블록이 같은 값과 실패를 내는지 먼저 검증합니다</h2></div>
        <RethProviderValidationViz />
        <p className="text-lg leading-8"><LABEL>A</LABEL>이 글은 Provider cache나 overlay 변경을 운영에 바로 적용하라는 승인안이 아닙니다. 격리한 chain fixture에서 persistence flush, reorg와 pruning 경계를 재생하고, 선택한 block hash별 account·storage·state root와 오류 종류가 기준 구현과 같은지 확인하는 실험 계획입니다.</p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Release·저장 설정·memory 범위를 한 run manifest에 고정합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">영역</th><th className="px-3 py-3">고정할 값</th><th className="px-3 py-3">필요한 이유</th></tr></thead><tbody>{[
          ["Binary", "Reth v2.8.1 · source SHA · build · features", "실제 Provider·overlay 구현 고정"],
          ["Storage", "V1/V2 · prune checkpoints · hashed/plain state", "Fallback route와 오류 경계 고정"],
          ["Persistence", "threshold · state masking · retained blocks", "Memory/DB frontier와 partial persistence 고정"],
          ["Fixture", "block hashes · state roots · account/slot trace", "Old/new에 같은 query 재생"],
          ["Runtime", "filesystem · CPU/RAM · cache · concurrency", "정확성 뒤 비용 비교"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><LABEL>O</LABEL>Reth v2.6.0부터 partial persistence와 execution overlay 구조가 크게 바뀌었고, v2.8.1은 v2.8.0 대비 database 변경이 없습니다. 이전 v2.2.0 Provider 실험을 현재 release 결과로 간주하지 않습니다.</p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">각 상태에는 쓰는 주체를 하나만 둡니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 owner</th><th className="px-3 py-3">검증자</th></tr></thead><tbody>{[
          ["Canonical in-memory chain", "forkchoice·CanonicalInMemoryState", "hash/root query matrix"],
          ["Execution/trie overlay", "OverlayManager·OverlayBuilder", "old/new Provider parity"],
          ["Persistent frontier", "Reth persistence·stage checkpoints", "DB/static/Rocks invariant"],
          ["Prune coverage", "pruner checkpoints", "history availability probe"],
          ["Provider 선택", "BlockchainProvider", "request trace collector"],
          ["채택 상태", "ADR·배포 파이프라인", "서비스 소유 팀"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">한 fixture에서 네 종류의 조회 기준선을 만듭니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["Latest", "현재 memory head"], ["Retained hash", "아직 memory에 있는 canonical block"], ["Historical hash", "영속화된 과거 block"], ["Pending", "head를 한 블록 연장한 state"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>A</LABEL>각 block hash에서 account와 storage, bytecode, block hash range를 읽습니다. 이어서 state root나 proof를 대조하고 정상 absence와 pruned·missing evidence 오류를 따로 기록합니다. Number selector는 먼저 canonical hash로 해석한 뒤 같은 hash query와 비교합니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Flush·reorg·prune 경계를 바꾸며 같은 query를 반복합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">{[
          ["01 · Flush overlap", "Memory 996~1,000 중 일부를 DB로 옮기는 동안 같은 range와 hash query를 반복합니다."],
          ["02 · Partial persistence", "Finish frontier와 state-trie frontier가 다른 상태에서 overlay lookup을 대조합니다."],
          ["03 · Reorg", "H1000을 비정본으로 만들고 number query와 hash query의 동작을 분리합니다."],
          ["04 · Prune boundary", "Account·storage history checkpoint 바로 전후에서 value와 StateAtBlockPruned를 확인합니다."],
          ["05 · Missing evidence", "Changeset·index 불일치를 격리된 사본에서 만들어 조용한 None/zero 변환이 없는지 봅니다."],
          ["06 · Restart", "각 상태에서 process를 다시 열고 cache 없이도 같은 logical 결과로 수렴하는지 검사합니다."],
        ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}</ol>
        <p><LABEL>?</LABEL>반복 횟수, 허용 가능한 query 지연과 test fixture 크기는 대상 환경에서 정해야 합니다. 격리된 자료 사본에서만 fault를 만들며 운영 node에는 적용하지 않습니다.</p>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Mixed result가 보이면 serving을 멈추고 저장 frontier부터 확인합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{[
          ["발견", "hash·root·value 불일치"], ["격리", "candidate RPC·node 제외"], ["보존", "memory/DB frontiers·logs"], ["복구", "이전 binary·snapshot 또는 rebuild"], ["재진입", "전체 parity 뒤 canary"],
        ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>A</LABEL>Provider-only 변경이고 storage format이 같다면 이전 binary로 되돌릴 수 있습니다. 그러나 storage migration, prune 설정이나 persistence mode가 함께 바뀌었다면 binary rollback만으로 충분하지 않습니다. 같은 시점의 MDBX·static files·RocksDB와 설정을 복원하거나 검증된 chain source에서 재구축합니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정확성과 복구를 통과한 run에서만 비용을 비교합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["정합성", "value·root·proof·typed error parity"], ["경계", "memory/DB gap·overlay fallback"], ["복구", "restart·rebuild·rollback RTO"], ["서비스", "query p50/p95/p99·CPU·I/O·cache"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>M</LABEL>현재 대상 장비에서 얻은 측정값은 없습니다. 새 overlay나 cache가 더 빠르다는 결론도 아직 내리지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 전 상태는 proposed이며 mixed state 한 번으로 기각합니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6"><p><strong>Status:</strong> proposed</p><p className="mt-2"><strong>채택 조건:</strong> 모든 hash, selector, fault에서 value와 root, typed outcome이 같습니다. 이어서 restart와 rollback, 서비스 SLO를 모두 통과해야 합니다.</p><p className="mt-2"><strong>기각 조건:</strong> Memory/DB gap, 다른 block의 account·storage 혼합, pruned를 정상 absence로 변환, safe rollback 부재가 하나라도 나타납니다.</p><p className="mt-2"><strong>다시 검토할 조건:</strong> Reth release, Storage V1/V2, prune·persistence 설정, filesystem 또는 workload가 바뀝니다.</p></div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 구현과 아직 없는 측정값을 분리합니다</h2>
        <CitationBlock source="Reth v2.8.1 release" citeKey={1} href="https://github.com/paradigmxyz/reth/releases/tag/v2.8.1"><p><LABEL>O</LABEL>시험 대상으로 고정한 release와 v2.8.0 대비 database 변경이 없다는 범위입니다.</p><p><LABEL>M</LABEL>대상 환경의 query·복구·성능 결과는 아닙니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Provider·overlay source" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/storage/storage-overlay/src/provider.rs"><p><LABEL>O</LABEL>Lazy overlay resolution, DB frontiers, historical fallback, account·storage precedence와 prune 오류를 확인했습니다.</p><p><b>범위:</b> 선택 release의 구현이며 모든 interleaving을 시험했다는 뜻은 아닙니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.6.0 release" citeKey={3} href="https://github.com/paradigmxyz/reth/releases/tag/v2.6.0"><p><LABEL>O</LABEL>Partial persistence 기본값과 execution/trie overlay 재구성으로 실험 조건이 달라진 사실을 확인했습니다.</p><p><LABEL>?</LABEL>대상 node의 실제 설정과 retained memory 범위는 manifest에서 확인해야 합니다.</p></CitationBlock>
      </section>

      <StorageEngineMapReturn current="reth-provider-validation" />
    </article>
  );
}
