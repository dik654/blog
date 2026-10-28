import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import RethPrecompilesLocator, { RethPrecompilesMapReturn } from "./RethPrecompilesLocator";
import { rethPrecompilesV281Tree } from "./fileTree";
import { RETH_PRECOMPILES_PROJECT_META, rethPrecompilesCodeRefs } from "./modernCodeRefs";
import RethPrecompileCallViz from "./viz/RethPrecompileCallViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

const HASH = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethPrecompilesLocator current="reth-precompiles" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">주소 0x02의 CALL은 어떻게 SHA-256 결과와 남은 gas를 만듭니까?</h2>
        </div>
        <RethPrecompileCallViz />
        <p className="text-lg leading-8">
          <Label>A</Label>Reth는 CALL 주소를 현재 fork의 precompile registry에서 찾습니다. 등록된 주소라면 입력 길이로 protocol gas를 먼저 계산하고, gas가 충분할 때만 네이티브 연산을 실행해 EVM 결과로 돌려줍니다.
        </p>
        <p>
          이 글은 <Link to="/cs/blockchain/reth-block-execution#execution">Block Execution의 거래 실행</Link> 안에서 일어나는 CALL 하나만 확대합니다. Release나 crypto backend를 바꿀 때의 채택 판단은 <Link to="/cs/blockchain/reth-precompiles-validation#overview">실무 검증 글</Link>로 분리합니다.
        </p>
      </section>

      <section id="input" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">CALL 입력</h2>
        <p>
          설명용 호출의 이름은 <code>CALL-02</code>입니다. 주소 <code>0x02</code>에 UTF-8 문자열 <code>abc</code>의 3바이트 <code>0x616263</code>을 보내고, precompile frame에 gas 100을 전달합니다. 이 이름과 숫자는 실제 transaction hash나 운영 측정값이 아닙니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["주소", "0x02", "호출할 bytecode_address"],
            ["입력", "0x616263", "abc · 3 bytes"],
            ["전달 gas", "100", "precompile frame 한도"],
            ["예상 output", "32 bytes", "SHA-256 digest"],
          ].map(([title, value, note]) => <div key={title} className="bg-background p-4"><strong className="text-xs">{title}</strong><code className="mt-2 block break-all text-xs text-primary">{value}</code><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{note}</span></div>)}
        </div>
        <p>
          CALL opcode의 기본 비용, memory expansion, value transfer 같은 바깥 비용은 이 사례의 계산 범위가 아닙니다. 여기서는 handler가 precompile에 넘긴 <code>gas_limit=100</code>부터 추적합니다.
        </p>
      </section>

      <section id="registry" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Fork Registry</h2>
        <p>
          Reth의 <code>EthEvmConfig</code>는 block header와 <code>ChainSpec</code>으로 <code>EvmEnv&lt;SpecId&gt;</code>를 만듭니다. revm handler는 그 SpecId를 precompile 변화 지점으로 바꿔 현재 registry를 선택합니다. 이 사례의 Prague registry에서 <code>0x02</code>는 SHA-256 entry입니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[46rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">입력 상태</th><th className="px-3 py-3">읽는 actor</th><th className="px-3 py-3">결정</th><th className="px-3 py-3">출력</th></tr></thead>
            <tbody>{[
              ["Header·ChainSpec", "Reth EthEvmConfig", "활성 EVM fork", "SpecId::PRAGUE"],
              ["SpecId", "EthPrecompiles", "현재 precompile set", "Prague registry"],
              ["bytecode_address 0x02", "Precompiles::get", "주소 entry 조회", "SHA-256 함수"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          Registry에 없는 주소는 precompile 실패가 아닙니다. Provider는 <code>Ok(None)</code>을 돌려주고 interpreter가 일반 account·contract CALL 경로를 계속 처리합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("evm-env", rethPrecompilesCodeRefs["evm-env"])} />
          <span className="text-xs text-muted-foreground">Header에서 EVM 환경 만들기</span>
          <CodeViewButton onClick={() => sidebar.open("registry", rethPrecompilesCodeRefs.registry)} />
          <span className="text-xs text-muted-foreground">Spec registry와 주소 lookup</span>
        </div>
      </section>

      <section id="gas-gate" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Gas Gate</h2>
        <p>SHA-256은 입력을 32바이트 word 단위로 셉니다. 3바이트 입력도 word 하나를 사용하므로 비용은 다음 순서로 계산됩니다.</p>
        <div className="not-prose border-y border-border py-4">
          <ol className="grid gap-3 text-sm leading-6 sm:grid-cols-4">
            {[
              ["1 · 입력", "3 bytes"],
              ["2 · Word 수", "ceil(3 ÷ 32) = 1"],
              ["3 · 비용", "60 + 12 × 1 = 72 gas"],
              ["4 · 판정", "100 ≥ 72 · 실행"],
            ].map(([title, value]) => <li key={title} className="border-l-2 border-primary/45 pl-3"><strong className="block text-xs">{title}</strong><code className="mt-1 block break-keep text-xs text-primary">{value}</code></li>)}
          </ol>
        </div>
        <p>
          Gas 72는 정확히 통과하고 71은 실패합니다. 구현은 이 비교를 crypto provider 호출보다 먼저 수행하므로 부족한 gas로 해시를 계산한 뒤 결과만 버리는 경로가 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("sha256", rethPrecompilesCodeRefs.sha256)} /><span className="text-xs text-muted-foreground">비용 계산 뒤 SHA-256 실행</span></div>
      </section>

      <section id="execution" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">SHA-256 실행</h2>
        <p>
          Gas gate를 통과하면 crypto provider가 3바이트를 해시합니다. 결과는 <code className="break-all">{HASH}</code>입니다. handler는 사용한 gas 72와 output 32바이트를 <code>InterpreterResult</code>로 바꾸고 frame gas 28을 남깁니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="min-w-0 bg-background p-4"><span className="text-[10px] font-bold text-muted-foreground">INPUT</span><code className="mt-2 block break-all text-xs">616263</code><span className="mt-1 block text-[10px] text-muted-foreground">3 bytes · gas 100</span></div>
          <div className="bg-background px-4 py-2 text-center font-mono text-[10px] font-black text-primary">SHA-256</div>
          <div className="min-w-0 bg-background p-4"><span className="text-[10px] font-bold text-muted-foreground">OUTPUT</span><code className="mt-2 block break-all text-[10px] leading-4 text-primary">{HASH}</code><span className="mt-1 block text-[10px] text-muted-foreground">32 bytes · gas remaining 28</span></div>
        </div>
        <p>
          네이티브 library가 빠르다는 사실보다 중요한 것은 protocol 계약입니다. 같은 fork·주소·입력·gas에서 status, 사용 gas와 output bytes가 같아야 state transition도 같습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("provider", rethPrecompilesCodeRefs.provider)} /><span className="text-xs text-muted-foreground">주소 조회·실행·InterpreterResult 변환</span></div>
      </section>

      <section id="failure-boundaries" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[50rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">입력</th><th className="px-3 py-3">결과</th><th className="px-3 py-3">남은 frame gas·output</th><th className="px-3 py-3">다음 경로</th></tr></thead>
            <tbody>{[
              ["Registry에 없는 주소", "Ok(None)", "Precompile 결과 없음", "일반 CALL 처리"],
              ["SHA-256 · gas 71", "PrecompileOOG", "gas 0 · 빈 output", "현재 frame halt"],
              ["ecRecover · gas 3,000 · 잘못된 v", "Return", "gas 0 · 빈 output", "성공 결과로 반환"],
              ["Provider fatal error", "Err", "완전한 성공 결과 없음", "호출자 오류 경계"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          빈 output만 보고 실패 종류를 합칠 수 없습니다. Gas 부족은 halt이고, ecRecover의 일부 malformed input은 gas를 사용한 성공 결과로 빈 bytes를 냅니다. 미등록 주소는 precompile을 실행하지도 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("ecrecover", rethPrecompilesCodeRefs.ecrecover)} /><span className="text-xs text-muted-foreground">ecRecover의 OOG와 빈 output 구분</span></div>
      </section>

      <section id="source" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">구현 근거</h2>
        <CitationBlock source="Reth v2.8.1 · EVM environment" citeKey={1} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/ethereum/evm/src/lib.rs">
          <p><Label>O</Label>Header와 ChainSpec에서 fork-aware <code>EvmEnv</code>를 만드는 Reth 경계입니다.</p><p><b>범위:</b> Precompile 함수와 gas 규칙 자체는 revm dependency가 구현합니다.</p>
        </CitationBlock>
        <CitationBlock source="revm-precompile 43.0.3 · Registry and SHA-256" citeKey={2} type="code" href="https://docs.rs/crate/revm-precompile/43.0.3/source/src/">
          <p><Label>O</Label>Spec별 registry, 주소 lookup, SHA-256 gas 선계산과 backend 호출 순서를 확인한 고정 dependency source입니다.</p><p><b>범위:</b> 대상 장비의 성능이나 특정 backend의 운영 안전성을 증명하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Cargo.lock" citeKey={3} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/Cargo.lock">
          <p><Label>O</Label>선택한 Reth release가 revm-precompile 43.0.3과 revm-handler 43.0.3을 사용한다는 version receipt입니다.</p><p><b>범위:</b> Moving main이나 다른 feature 조합으로 일반화하지 않습니다.</p>
        </CitationBlock>
      </section>

      <section id="self-check" className="space-y-4 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 문제</h2>
        <ol className="space-y-3 pl-5 text-sm leading-7">
          <li><code>0x02</code>가 registry에 없을 때 왜 PrecompileOOG가 아닙니까? <b>(답: Fork Registry)</b></li>
          <li>3바이트 입력에서 SHA-256 비용이 72 gas인 이유는 무엇입니까? <b>(답: Gas Gate)</b></li>
          <li>빈 output이 항상 같은 실패를 뜻하지 않는 이유는 무엇입니까? <b>(답: 실패 경계)</b></li>
        </ol>
      </section>

      <RethPrecompilesMapReturn current="reth-precompiles" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethPrecompilesCodeRefs} fileTrees={{ reth: rethPrecompilesV281Tree }} projectMetas={RETH_PRECOMPILES_PROJECT_META} />
    </article>
  );
}
