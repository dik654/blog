import type { ReactNode } from "react";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import RethTxpoolLocator, { RethTxpoolMapReturn } from "../reth-txpool/RethTxpoolLocator";
import { rethTxpoolV281Tree } from "../reth-txpool/fileTree";
import { RETH_TXPOOL_PROJECT_META, rethTxpoolCodeRefs } from "../reth-txpool/modernCodeRefs";
import RethTxpoolValidationViz from "./viz/RethTxpoolValidationViz";

const LABEL = ({ children }: { children: ReactNode }) => <span className="mr-2 inline-block border border-primary/40 px-1.5 py-0.5 align-middle text-[9px] font-black text-primary">{children}</span>;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethTxpoolLocator current="reth-txpool-validation" />
        <div><p className="text-xs font-bold text-primary">실무 글 · 개념을 운영 판단으로 연결하기</p><h2 className="mt-2 break-keep text-3xl font-bold">TxPool 변경은 같은 거래가 같은 이유로 거부·대기·선택되는지 먼저 검증합니다</h2></div>
        <RethTxpoolValidationViz />
        <p className="text-lg leading-8"><LABEL>A</LABEL>이 글은 새 TxPool 설정이나 구현을 운영에 바로 적용하라는 승인안이 아닙니다. 격리한 fixture에서 공격 입력, fee 변화, mined block, reorg와 restart를 재생하고 기준 구현과 admission 결과·subpool 이유·builder-visible 순서가 같은지 확인하는 실험 계획입니다.</p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 조건을 먼저 고정합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">영역</th><th className="px-3 py-3">고정할 값</th><th className="px-3 py-3">비교에서 맡는 역할</th></tr></thead><tbody>{[
          ["Binary", "Reth v2.8.1 · source d763342… · build features", "실제 validator·pool·maintenance 구현"],
          ["Chain", "ChainSpec digest · active forks · genesis", "허용 transaction type과 next fees"],
          ["Policy", "PoolConfig · PriceBumpConfig · local/private propagation · byte limits", "보관·교체·퇴출 조건"],
          ["Head schedule", "block hash·changed accounts·base/blob fee·reorg branch", "같은 재분류 입력"],
          ["Corpus", "raw bytes·origin·arrival order·blob sidecars", "동일한 admission 순서"],
          ["Runtime", "CPU·RAM · validation tasks · builder attributes", "정확성 뒤 비용 비교"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><LABEL>O</LABEL>이 실험은 Reth v2.8.1 tag와 commit <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>를 기준으로 합니다. 기존 합성 v1.x code panel이나 moving main의 default를 비교 기준으로 사용하지 않습니다.</p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">상태를 바꾸는 주체를 정합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[46rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 owner</th><th className="px-3 py-3">관측자·소비자</th></tr></thead><tbody>{[
          ["Valid·Invalid·Error", "TransactionValidator", "RPC/P2P result·metrics"],
          ["Sender chain·replacement·subpool", "TxPool write lock 아래 내부 pool", "events·RPC inspection"],
          ["Tracked head·changed accounts·next fees", "Canonical-state maintenance task", "validator·subpool updater"],
          ["Builder-visible sequence", "BestTransactions iterator + builder", "payload metrics·trace"],
          ["Pool limits와 배포 상태", "고정 config·ADR·배포 파이프라인", "운영 dashboard"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><LABEL>A</LABEL>실험 collector는 transaction을 재분류하거나 pool에서 제거하지 않습니다. 별도 retry worker가 Invalid를 다시 넣거나 다른 controller가 같은 limits를 계속 덮어쓰면 원래 정책과 실험 결과를 구분할 수 없습니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("validation-outcome", rethTxpoolCodeRefs["validation-outcome"])} /><span className="text-xs text-muted-foreground">Admission outcome writer · pool/mod.rs L571–637</span><CodeViewButton onClick={() => sidebar.open("reorg-reinjection", rethTxpoolCodeRefs["reorg-reinjection"])} /><span className="text-xs text-muted-foreground">Canonical update writer · maintain.rs L382–435</span></div>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">거래 hash 하나마다 입력부터 builder 노출까지 golden receipt를 만듭니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["입력", "raw hash·origin·arrival index·type·size"],
          ["검증", "outcome·reason·state block/hash"],
          ["Pool", "sender/nonce·subpool·replacement·eviction"],
          ["소비", "builder yield index·mined/reorg event"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>A</LABEL>최종 pool 크기만 비교하지 않습니다. 같은 크기라도 T7이 BaseFee 대신 Pending에 들어갔거나 T8이 선행 거래보다 먼저 builder에 보였다면 동작이 다릅니다. Event 순서와 reason, sender dependency를 transaction hash에 연결해야 첫 차이를 찾을 수 있습니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입구 공격과 canonical 변화가 겹치는 순서까지 재생합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">{[
          ["01 · Admission 분기", "잘못된 signature·chain ID·oversize는 Invalid, provider 장애는 Error가 되며 어느 것도 pool에 남지 않는지 확인합니다."],
          ["02 · Nonce dependency", "Alice T8을 먼저 보내고 T7을 나중에 보내 T8이 Queued에서 정확히 승격되는지 확인합니다."],
          ["03 · Replacement flood", "같은 sender·nonce 후보를 bump 경계 아래·같음·위로 반복해 하나만 남고 메모리 한도를 지키는지 봅니다."],
          ["04 · Fee repricing", "Base/blob fee를 위아래로 바꿔 Pending·BaseFee·Blob 이동과 builder heads를 대조합니다."],
          ["05 · Commit과 reorg", "T7 mined 뒤 nonce 8로 갱신하고, reorg에서 old-only T7을 새 state로 재검증해 T8과의 순서를 다시 만듭니다."],
          ["06 · Restart·drift", "Pool process 재시작과 유지 범위를 넘는 head 점프 뒤 changed accounts를 다시 읽어 stale transaction을 제거하는지 확인합니다."],
          ["07 · Resource pressure", "다수 sender, 한 sender 집중, blob sidecar bytes를 각각 늘려 count·byte limit과 descendant 재분류를 검사합니다."],
          ["08 · Builder failure", "Iterator가 낸 거래를 builder가 invalid로 표시했을 때 같은 sender descendants가 조용히 노출되지 않는지 확인합니다."],
        ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}</ol>
        <p><LABEL>?</LABEL>거래 수, 동시성, 메모리 한도와 허용 가능한 admission 지연은 대상 환경에서 정해야 합니다. Public RPC나 운영 validator에 flood·reorg·process kill을 주입하지 않습니다.</p>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">오분류나 memory bound 위반이 보이면 새 입력부터 제한합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{[
          ["발견", "outcome·order·limit parity fail"],
          ["제한", "public admission·propagation"],
          ["보존", "raw corpus·events·head schedule"],
          ["복구", "이전 binary·config로 rollback"],
          ["재진입", "canonical state에서 pool 재구성"],
        ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>A</LABEL>TxPool은 canonical ledger가 아니므로 손상된 pool 상태를 정본처럼 보존해 복원하지 않습니다. Raw transaction과 local transaction backup 정책을 확인하고, 검증한 canonical head에서 이전 구현으로 다시 validation·classification합니다. 이미 builder에 전달된 payload나 RPC 응답은 별도 영향 범위로 추적합니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정확성과 bounded memory 뒤에 처리량을 비교합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["정합성", "outcome·reason·subpool·builder order"],
          ["안전", "count/bytes·eviction·restart·rollback"],
          ["처리", "validation tx/s·admission p50/p95/p99"],
          ["자원", "CPU·RAM·blob store·builder wait"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>M</LABEL>현재 대상 장비와 실제 traffic shape에서 얻은 측정값은 없습니다. v2.8.1이나 후보 설정이 더 빠르거나 더 안정적이라는 결론도 아직 내리지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 전 상태는 proposed이며 오분류 한 건도 허용하지 않습니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6"><p><strong>Status:</strong> proposed</p><p className="mt-2"><strong>채택 조건:</strong> 같은 거래와 head 일정에서 validation 결과와 pool 상태, 교체 여부, builder 순서, reorg 재주입이 기준 구현과 일치해야 합니다. 메모리 한계와 재시작, rollback, 서비스 SLO도 각각 통과해야 합니다.</p><p className="mt-2"><strong>기각 조건:</strong> Invalid가 삽입되거나 sender nonce 순서가 깨지거나, bound를 넘는 memory 증가 또는 안전한 rollback 부재가 한 번이라도 나타납니다.</p><p className="mt-2"><strong>다시 검토할 조건:</strong> Reth release, ChainSpec fork, transaction type, PriceBumpConfig, pool limits, blob format, builder 또는 traffic shape가 바뀝니다.</p></div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 구현과 아직 없는 운영 측정을 구분합니다</h2>
        <CitationBlock source="Reth v2.8.1 · validator" citeKey={1} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/transaction-pool/src/validate/eth.rs"><p><LABEL>O</LABEL>Stateless·stateful validation과 outcome·propagation 경계를 확인했습니다.</p><p><LABEL>M</LABEL>대상 workload의 validation latency와 reject 분포는 아직 측정하지 않았습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · TxPool state and limits" citeKey={2} href="https://github.com/paradigmxyz/reth/tree/v2.8.1/crates/transaction-pool/src/pool"><p><LABEL>O</LABEL>Sender dependency, 네 subpool, replacement·eviction과 best iterator의 실제 구현 출발점입니다.</p><p><b>범위:</b> 실행 configuration과 외부 builder 정책을 자동으로 증명하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · maintenance" citeKey={3} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/transaction-pool/src/maintain.rs"><p><LABEL>O</LABEL>Canonical commit·reorg·drift·stale eviction과 old-only transaction reinjection 경계를 확인했습니다.</p><p><LABEL>?</LABEL>대상 노드의 local transaction backup과 restart 절차는 run manifest에서 확인해야 합니다.</p></CitationBlock>
      </section>

      <RethTxpoolMapReturn current="reth-txpool-validation" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethTxpoolCodeRefs} fileTrees={{ reth: rethTxpoolV281Tree }} projectMetas={RETH_TXPOOL_PROJECT_META} />
    </article>
  );
}
