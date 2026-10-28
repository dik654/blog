import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import RethPrecompilesLocator, { RethPrecompilesMapReturn } from "../reth-precompiles/RethPrecompilesLocator";
import { rethPrecompilesV281Tree } from "../reth-precompiles/fileTree";
import { RETH_PRECOMPILES_PROJECT_META, rethPrecompilesCodeRefs } from "../reth-precompiles/modernCodeRefs";
import RethPrecompilesValidationViz from "./viz/RethPrecompilesValidationViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethPrecompilesLocator current="reth-precompiles-validation" />
        <div><p className="text-xs font-bold text-primary">이 글이 답할 질문</p><h2 className="mt-2 break-keep text-3xl font-bold">Reth·revm·crypto backend 변경이 같은 precompile 결과를 내는지 어떻게 검증합니까?</h2></div>
        <RethPrecompilesValidationViz />
        <p className="text-lg leading-8"><Label>A</Label>Base와 candidate를 독립 process에서 실행하고, 고정한 fork별 registry와 gas 경계, 정상·malformed vector, 장애와 rollback 결과를 한 run receipt로 비교합니다. Correctness와 복구가 맞은 뒤에만 성능을 비교합니다.</p>
        <p>출발점은 <Link to="/cs/blockchain/reth-precompiles#registry">Fork Registry</Link>, <Link to="/cs/blockchain/reth-precompiles#gas-gate">Gas Gate</Link>, <Link to="/cs/blockchain/reth-precompiles#execution">output 변환</Link>, <Link to="/cs/blockchain/reth-precompiles#failure-boundaries">실패 경계</Link>입니다. 이 글은 그 메커니즘을 반복하지 않고 변경 채택에 필요한 증거를 정합니다.</p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 입력</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[52rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">고정 영역</th><th className="px-3 py-3">기록할 값</th><th className="px-3 py-3">빠지면 생기는 혼동</th></tr></thead><tbody>{[
          ["Reth", "v2.8.1 · commit·binary digest", "Adapter와 lifecycle 차이"],
          ["Dependencies", "revm·handler·precompile versions·features", "Registry·gas·backend 차이"],
          ["Chain", "ChainSpec digest·fork·block header", "활성 주소와 규칙 차이"],
          ["Corpus", "address·input bytes·gas limit·expected receipt", "정상·경계 입력 차이"],
          ["Backend", "provider identity·library·CPU flags", "같은 API 뒤 구현 차이"],
          ["Runtime", "OS·CPU·process·restart schedule", "성능·복구 차이"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><Label>O</Label>기준 구현은 Reth v2.8.1 commit <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>과 그 release가 고정한 revm-precompile·revm-handler 43.0.3입니다. Main branch를 기준선으로 사용하지 않습니다.</p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">상태 소유권</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[50rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 writer</th><th className="px-3 py-3">검증기가 기록할 증거</th></tr></thead><tbody>{[
          ["활성 fork", "Reth EthEvmConfig·ChainSpec", "SpecId·header·ChainSpec digest"],
          ["주소 registry", "revm-precompile snapshot", "spec별 address·implementation identity"],
          ["Gas·status·bytes", "선택한 precompile function", "input hash·limit·cost·result"],
          ["Interpreter 결과", "revm-handler", "instruction result·remaining gas·output"],
          ["채택 상태", "ADR·배포 파이프라인", "candidate 격리·rollback·재진입 승인"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><Label>A</Label>Collector가 status, gas나 output을 보정하면 비교 대상과 관찰자가 같은 상태를 쓰게 됩니다. Base와 candidate는 읽기 전용 corpus만 공유하고 process와 결과 저장소는 분리합니다.</p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정상 기준선</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{[
          ["Lookup", "spec·address·entry"], ["Gas", "limit·used·remaining"], ["Status", "return·revert·halt"], ["Output", "length·bytes digest"], ["Runtime", "panic·error·duration"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}</div>
        <p><Label>A</Label>최종 block hash 하나만으로는 주소 lookup과 gas 계산 중 어디서 갈라졌는지 찾기 어렵습니다. 호출마다 <code>run_id</code>, fork, address, input hash, gas limit, implementation identity와 result receipt를 함께 남깁니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("provider", rethPrecompilesCodeRefs.provider)} /><span className="text-xs text-muted-foreground">기록할 handler 결과 경계</span></div>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 순서</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">{[
          ["01 · Registry", "각 fork의 직전·활성 block에서 address set과 implementation identity를 비교합니다."],
          ["02 · Gas", "각 vector를 exact cost−1, exact cost, exact cost+1에서 실행해 status와 사용 gas를 대조합니다."],
          ["03 · 정상 vector", "SHA-256·RIPEMD·identity·curve 연산의 known input과 output을 byte-for-byte 비교합니다."],
          ["04 · Malformed", "짧은 입력·잘못된 field·경계 길이에서 empty·revert·halt를 구분합니다."],
          ["05 · Backend", "가능한 provider를 같은 corpus에 실행해 status·gas·output과 fatal error를 비교합니다."],
          ["06 · Fault", "Process kill·provider error·panic 격리·restart에서 partial success 노출 여부를 봅니다."],
          ["07 · Performance", "정확성과 복구가 맞은 run에서만 latency·calls/s·CPU·memory를 측정합니다."],
          ["08 · Rollback", "Baseline binary·dependencies·features·ChainSpec·config로 돌아가 전체 corpus를 다시 실행합니다."],
        ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}</ol>
        <p><Label>?</Label>대상 환경의 corpus 크기, 허용 latency, canary 범위와 복구 목표는 아직 정하지 않았습니다. 운영 validator와 고객 트래픽에서 장애를 주입하지 않습니다.</p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">장애 판정</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["Registry drift", "주소 누락·조기 활성", "즉시 기각"],
          ["Gas drift", "경계에서 status·used 불일치", "즉시 기각"],
          ["Output drift", "1 byte라도 다름", "즉시 기각"],
          ["Fatal path", "panic·partial result·재시작 불일치", "격리·rollback"],
        ].map(([title, signal, effect]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5">{signal}</p><p className="mt-2 text-[10px] leading-4 text-muted-foreground">판정 · {effect}</p></div>)}</div>
        <p><Label>A</Label>모든 빈 output을 하나로 비교하지 않습니다. Receipt에는 lookup 여부, status, gas used와 output length를 따로 기록해 OOG, protocol-defined empty success와 provider error를 구분합니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("ecrecover", rethPrecompilesCodeRefs.ecrecover)} /><span className="text-xs text-muted-foreground">Malformed empty success와 OOG 경계</span></div>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">복구와 재진입</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{[
          ["발견", "첫 receipt divergence"], ["격리", "candidate traffic 0"], ["보존", "binary·corpus·receipt"], ["복구", "deps·features·spec rollback"], ["재진입", "전체 corpus parity"],
        ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}</div>
        <p><Label>A</Label>Rollback은 Reth binary만 내리는 작업이 아닙니다. revm dependency와 feature set, crypto library, ChainSpec과 runtime config를 baseline manifest로 되돌립니다. Restart 뒤 전체 registry·gas·vector receipt가 다시 일치해야 복구가 끝납니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">측정 순서</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">{[
          ["Correctness", "registry·status·gas·bytes"], ["Recovery", "restart·rollback·replay"], ["Performance", "p50·p95·p99·calls/s"], ["Cost", "CPU·memory·allocations"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><Label>M</Label>현재 대상 장비에서 측정한 latency, throughput, CPU, memory, restart와 rollback 시간은 없습니다. Candidate가 더 빠르거나 안전하다는 결론도 내리지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">결정</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6"><p><strong>Status:</strong> proposed</p><p className="mt-2"><strong>채택 조건:</strong> Fork별 registry, gas 경계, 정상·malformed vector, backend·fault·restart·rollback receipt가 기준선과 같고, 그 뒤 미리 정한 성능 예산을 충족합니다.</p><p className="mt-2"><strong>기각 조건:</strong> 주소 조기 활성·누락, gas·status·output 불일치, panic 전파, partial success 또는 rollback replay 실패가 한 번이라도 나타납니다.</p><p className="mt-2"><strong>다시 검토할 조건:</strong> Reth·revm release, feature, ChainSpec·fork, crypto backend, CPU architecture, workload나 운영 SLO가 바뀝니다.</p></div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 미측정값</h2>
        <CitationBlock source="revm-precompile 43.0.3" citeKey={1} type="code" href="https://docs.rs/crate/revm-precompile/43.0.3/source/src/"><p><Label>O</Label>Spec registry, gas gate와 precompile output 계약을 고정하는 source snapshot입니다.</p><p><b>범위:</b> 대상 환경의 fault recovery와 성능을 증명하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Dependency receipt" citeKey={2} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/Cargo.lock"><p><Label>O</Label>Base의 Reth commit과 revm 43.0.3 dependency set을 고정합니다.</p><p><b>범위:</b> Candidate의 build·feature·backend identity는 별도 run manifest에 기록해야 합니다.</p></CitationBlock>
        <CitationBlock source="대상 환경 paired run" citeKey={3}><p><Label>M</Label>Base·candidate의 실제 parity, 성능과 rollback 데이터는 아직 없습니다.</p><p><Label>?</Label>Hardware·corpus·SLO·결과 저장 위치를 확정한 뒤 격리된 test node에서 측정해야 합니다.</p></CitationBlock>
      </section>

      <RethPrecompilesMapReturn current="reth-precompiles-validation" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethPrecompilesCodeRefs} fileTrees={{ reth: rethPrecompilesV281Tree }} projectMetas={RETH_PRECOMPILES_PROJECT_META} />
    </article>
  );
}
