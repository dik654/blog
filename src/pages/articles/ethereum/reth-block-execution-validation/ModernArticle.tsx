import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import RethBlockExecutionLocator, { RethBlockExecutionMapReturn } from "../reth-block-execution/RethBlockExecutionLocator";
import { rethBlockExecutionV281Tree } from "../reth-block-execution/fileTree";
import { RETH_BLOCK_EXECUTION_PROJECT_META, rethBlockExecutionCodeRefs } from "../reth-block-execution/modernCodeRefs";
import RethBlockExecutionValidationViz from "./viz/RethBlockExecutionValidationViz";

const Label = ({ children }: { children: ReactNode }) => <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethBlockExecutionLocator current="reth-block-execution-validation" />
        <div><p className="text-xs font-bold text-primary">이 글이 답할 질문</p><h2 className="mt-2 break-keep text-3xl font-bold">Reth release나 실행 경로를 바꿀 때 결과 회귀와 복구 실패를 어떻게 찾습니까?</h2></div>
        <RethBlockExecutionValidationViz />
        <p className="text-lg leading-8"><Label>A</Label>이 글은 운영 validator에서 장애를 내는 절차가 아닙니다. 격리한 test node에서 base와 candidate에 같은 부모 상태·header·block bytes를 넣고, 정상 기준선을 만든 뒤 한 경계씩만 바꾸는 실험 계획입니다.</p>
        <p>여기서 출발점은 <Link to="/cs/blockchain/reth-block-execution#execution">본문 순서의 실행</Link>, <Link to="/cs/blockchain/reth-block-execution#bundle">결과 묶음</Link>, <Link to="/cs/blockchain/reth-block-execution#validation-boundary">사후 검증</Link>입니다. 이 글은 그 메커니즘을 다시 설명하지 않고 환경에 맞는 채택·rollback 증거를 정합니다.</p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 입력</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[52rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">고정 영역</th><th className="px-3 py-3">기록할 값</th><th className="px-3 py-3">빠지면 생기는 혼동</th></tr></thead><tbody>{[
          ["Binary", "Reth tag·commit·features·digest", "실행기와 validation 구현 차이"],
          ["Dependencies", "Alloy EVM·revm·database crate versions", "Fork operation과 state semantics 차이"],
          ["Chain", "genesis·ChainSpec digest·fork schedule", "활성 EVM 환경 차이"],
          ["Parent", "header·state snapshot·canonical hash", "시작 상태 차이"],
          ["Block", "raw bytes·recovered senders·expected commitments", "본문 순서와 서명 복구 차이"],
          ["Runtime", "CPU·filesystem·cache state·restart schedule", "성능과 crash recovery 차이"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><Label>O</Label>기준 구현은 Reth v2.8.1 commit <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>입니다. Moving main이나 예전 v2.2.0 API를 기준선으로 사용하지 않습니다.</p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">상태 소유권</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[50rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 writer</th><th className="px-3 py-3">검증기가 기록할 증거</th></tr></thead><tbody>{[
          ["부모 state view", "고정한 provider snapshot", "parent hash·root·snapshot digest"],
          ["EVM 환경", "EthEvmConfig·ChainSpec", "spec ID·block env·context"],
          ["임시 state·receipt", "Block executor·revm", "result·BundleState·typed error"],
          ["Post-execution 판정", "Consensus·payload validator", "got/expected·reject reason"],
          ["Canonical state", "검증을 통과한 chain update 경로", "accepted block·state root·restart state"],
          ["배포 상태", "ADR와 배포 파이프라인", "candidate 격리·rollback digest·재진입 승인"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><Label>A</Label>Collector가 state나 판정을 고치면 비교 대상과 관찰자가 같은 상태를 쓰게 됩니다. Base와 candidate는 독립 process·독립 data directory를 사용하고 fixture만 읽습니다.</p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정상 기준선</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["Input", "parent·header·body order·fork"],
          ["Execution", "receipt status·gas·logs·requests"],
          ["State", "BundleState·post-state root"],
          ["Acceptance", "validation result·canonical update·restart"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><Label>A</Label>Final block hash 하나만 저장하면 첫 차이를 찾기 어렵습니다. 거래별 receipt와 cumulative gas, BundleAccount의 original/present 값, fork별 requests와 각 검증 항목을 같은 run ID에 묶습니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("execution-output", rethBlockExecutionCodeRefs["execution-output"])} /><span className="text-xs text-muted-foreground">저장할 실행 결과 필드</span><CodeViewButton onClick={() => sidebar.open("post-execution-validation", rethBlockExecutionCodeRefs["post-execution-validation"])} /><span className="text-xs text-muted-foreground">대조할 commitment</span></div>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 순서</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">{[
          ["01 · 정상", "두 단순 송금과 정상 contract call에서 result·bundle·validation·root를 base와 candidate가 같게 만드는지 확인합니다."],
          ["02 · REVERT", "유효한 REVERT가 failed receipt·gas·nonce를 남기되 내부 state를 되돌리는지 대조합니다."],
          ["03 · Invalid", "잘못된 nonce·intrinsic gas·envelope에서 output을 승인하지 않고 같은 typed boundary에서 거절하는지 봅니다."],
          ["04 · State edges", "CREATE·SELFDESTRUCT·storage wipe·empty account에서 original/present·revert와 root를 비교합니다."],
          ["05 · Fork", "활성 직전·직후 header를 실행해 EVM env, system operation, receipt와 commitment의 첫 차이를 찾습니다."],
          ["06 · Mismatch", "Gas·receipts·requests·BAL·state root 약속을 한 항목씩 바꾸고 post-validation rejection을 확인합니다."],
          ["07 · Crash·reorg", "Execution 전후와 publish 전 경계에서 process를 중지하고 restart·ancestor unwind·re-execution 결과를 봅니다."],
          ["08 · Rollback", "Candidate를 중지하고 baseline binary·ChainSpec·config로 돌아가 전체 fixture와 restart parity를 재확인합니다."],
        ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}</ol>
        <p><Label>?</Label>대상 환경의 block corpus 크기, 허용 execution p95·p99, canary 범위와 복구 목표는 아직 정하지 않았습니다. 운영 chain이나 고객 트래픽에서 장애를 주입하지 않습니다.</p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">장애 판정</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["REVERT", "유효한 failed receipt", "블록 유효 가능"],
          ["Invalid tx", "실행 경계에서 error", "Output 승인 금지"],
          ["Root mismatch", "Post-validation reject", "Canonical publish 금지"],
          ["Provider error", "Execution 중단", "Partial bundle 노출 금지"],
        ].map(([title, signal, effect]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5">{signal}</p><p className="mt-2 text-[10px] leading-4 text-muted-foreground">결과 · {effect}</p></div>)}</div>
        <p><Label>A</Label>모든 오류를 “실행 실패”로 합치지 않습니다. REVERT와 invalid transaction, provider error, commitment mismatch는 상태·receipt·복구 경계가 다르므로 별도 outcome으로 저장합니다.</p>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">복구와 재진입</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{[
          ["발견", "첫 field divergence"], ["격리", "candidate traffic 0"], ["우회", "base 실행 유지"], ["복구", "binary·spec·config rollback"], ["재진입", "전체 fixture 재통과"],
        ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}</div>
        <p><Label>A</Label>Rollback은 binary만 내리는 작업이 아닙니다. ChainSpec과 dependency set, executor 설정, data snapshot과 route를 baseline manifest로 되돌립니다. Restart 뒤 parent view·canonical head·전체 fixture가 다시 일치해야 복구가 끝납니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">측정 순서</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["Correctness", "receipt·gas·logs·requests·root"],
          ["Recovery", "restart parity·rollback·re-entry"],
          ["Performance", "execute p50·p95·p99·blocks/s"],
          ["Cost", "CPU·memory·DB reads·I/O"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><Label>M</Label>현재 대상 장비에서 측정한 실행 latency, 처리량, DB read, memory, restart와 rollback 시간은 없습니다. Candidate가 더 빠르거나 안전하다는 결론도 내리지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">결정</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6"><p><strong>Status:</strong> proposed</p><p className="mt-2"><strong>채택 조건:</strong> 정상·실패·fork·crash·reorg fixture에서 result, bundle, commitments, canonical state와 restart 결과가 기준선과 같고 rollback replay가 통과한 뒤 미리 정한 성능 예산을 충족합니다.</p><p className="mt-2"><strong>기각 조건:</strong> Invalid transaction 승인, receipt·gas·log 순서 차이, root mismatch 누락, partial state 노출 또는 rollback 실패가 한 번이라도 나타납니다.</p><p className="mt-2"><strong>다시 검토할 조건:</strong> Reth release, Alloy EVM·revm, ChainSpec, fork, provider, storage layout, workload나 운영 SLO가 바뀝니다.</p></div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 미측정값</h2>
        <CitationBlock source="Reth v2.8.1 · Block execution" citeKey={1} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/evm/evm/src/execute.rs"><p><Label>O</Label>Pre·transaction·post와 BundleState 반환의 기준 source입니다.</p><p><b>범위:</b> 대상 환경의 crash·rollback 성공을 증명하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Ethereum validation" citeKey={2} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/ethereum/consensus/src/validation.rs"><p><Label>O</Label>Gas·receipts·logs·fork commitment rejection의 기준 source입니다.</p><p><b>범위:</b> Engine tree의 canonical publish와 현장 운영 절차 전체를 대신하지 않습니다.</p></CitationBlock>
        <CitationBlock source="대상 환경 paired run" citeKey={3}><p><Label>M</Label>Base와 candidate의 실제 paired result, 성능과 복구 데이터는 아직 없습니다.</p><p><Label>?</Label>실험 hardware·corpus·SLO와 결과 저장 위치를 확정한 뒤 측정해야 합니다.</p></CitationBlock>
      </section>

      <RethBlockExecutionMapReturn current="reth-block-execution-validation" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethBlockExecutionCodeRefs} fileTrees={{ reth: rethBlockExecutionV281Tree }} projectMetas={RETH_BLOCK_EXECUTION_PROJECT_META} />
    </article>
  );
}
