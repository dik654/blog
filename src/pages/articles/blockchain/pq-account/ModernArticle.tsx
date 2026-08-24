import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";

function Flow() {
  const rows = [
    ["01", "UserOperation", "Sender·nonce·call·gas·signature intent"],
    ["02", "Bundler simulation", "Validation rules·fee·replay preflight"],
    ["03", "EntryPoint validation", "Account/paymaster authorization"],
    ["04", "Execution · receipt", "Call effect·gas settlement·chain receipt"],
  ];
  return <figure data-viz="pq-account-flow" data-viz-canvas className="not-prose overflow-hidden rounded-xl border border-border bg-card"><figcaption className="border-b border-border px-4 py-4"><p className="text-sm font-semibold">0.1 ETH 전송 의도를 AA와 ML-DSA가 통과하는 경로</p><p className="mt-1 text-xs text-muted-foreground">Account abstraction은 검증 위치를 바꾸고 ML-DSA는 그 위치에서 사용할 수 있는 서명 방식 하나입니다.</p></figcaption><div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">{rows.map(([n,t,d]) => <div key={n} className="min-w-0 bg-background p-4"><p className="text-xs font-bold text-primary">{n}</p><p className="mt-2 text-sm font-semibold">{t}</p><p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{d}</p></div>)}</div></figure>;
}

function Evidence({ id, source, href, children }: { id: string; source: string; href: string; children: React.ReactNode }) {
  const citeKey = id === "paper-erc4337" ? 1 : id === "paper-fips204" ? 2 : 3;
  return <div id={id} className="scroll-mt-24"><CitationBlock source={source} citeKey={citeKey} type="paper" href={href}>{children}</CitationBlock></div>;
}

export default function ModernArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <p className="text-sm font-semibold text-primary">Post-quantum account · validation에서 migration까지</p>
      <h2 className="text-3xl font-bold tracking-tight">양자내성 계정은 새 서명 이름을 붙이는 일이 아니라 기존 계정의 권한·gas·replay·복구 경계를 함께 옮기는 일이다</h2>
      <p className="text-lg leading-8">민지의 smart account가 0.1 ETH를 보내려 합니다. Wallet은 목적지·금액·chain·EntryPoint·nonce가 묶인 UserOperation을 만들고, bundler는 이를 simulation한 뒤 EntryPoint가 account validation과 execution을 분리해 처리합니다. Account가 ML-DSA를 검증하도록 설계할 수는 있지만, ERC-4337 자체가 ML-DSA나 EVM native precompile을 제공하는 것은 아닙니다.</p>
      <aside className="rounded-lg border border-border p-4 text-sm leading-6">Post-quantum(PQ)은 큰 양자컴퓨터 공격을 고려한 암호 전환 범주입니다. NIST FIPS 204의 정식 이름은 ML-DSA이며 CRYSTALS-Dilithium 계열에서 표준화됐습니다. 이 글은 표준 내부 수학 전체를 다시 소유하지 않고, ML-DSA artifact를 ERC-4337 account validation에 연결할 때 필요한 구현·gas·migration 경계를 소유합니다.</aside>
      <Flow />
      <ContentBoundary article="pq-account" />
    </section>

    <section id="account-abstraction-validation" className="space-y-5">
      <p className="text-sm font-semibold text-primary">01 · UserOperation과 EntryPoint</p>
      <h2 className="text-2xl font-bold">검증 성공과 외부 실행을 두 loop로 나눠 읽는다</h2>
      <p className="leading-7">UserOperation은 일반 transaction이 아니라 sender, nonce, factory, callData, gas limits·fees, paymaster와 signature를 담은 상위 계층 객체입니다. Hash는 signature를 제외한 operation, EntryPoint address와 chainId에 결속돼야 합니다. 같은 nonce라도 다른 chain·EntryPoint에서 replay되지 않게 만드는 이유입니다.</p>
      <p className="leading-7">Bundler는 mempool 수락 전에 validation을 simulation하고 fee·storage·opcode 규칙을 검사합니다. EntryPoint의 verification loop는 account 생성, gas precharge, account/paymaster validation을 수행하고, execution loop는 승인된 call을 실행한 뒤 실제 gas와 deposit을 정산합니다. Simulation 통과는 future block inclusion이나 call success 보장이 아닙니다.</p>
      <p className="leading-7">Account는 trusted EntryPoint caller와 userOpHash, nonce, signature, time range와 recovery policy를 검증합니다. Paymaster가 있어도 서명 authority와 execution 권한을 대신하지 않습니다. Validation 실패 operation은 실행하지 않아야 하며, execution revert와 validation reject를 같은 오류로 숨기지 않습니다.</p>
      <ExplainedFormula question="같은 UserOperation이 다른 chain이나 EntryPoint에서 replay되지 않게 무엇을 서명하는가?" idea={<>Operation 내용만이 아니라 실행 domain을 함께 hash합니다. 실제 encoding·hash 함수는 적용 ERC-4337 revision과 account implementation을 고정합니다.</>} formula={String.raw`h=H(\operatorname{pack}(u),\;E,\;c)`}
      annotatedFormula={String.raw`h=\underbrace{H(\operatorname{pack}(u),\;E,\;c)}_{\text{Packed UserOperation 계산}}`}
      operations={[
        { expression: String.raw`H(\operatorname{pack}(u),\;E,\;c)`, annotation: ["Packed UserOperation이(가) 식의 결과에","기여하는 방식을 계산합니다.","Operation 내용만이 아니라 실행 domain을 함께","hash합니다."] },
      ]} terms={[{symbol:"u",name:"Packed UserOperation",description:"Signature를 제외한 sender·nonce·call·gas·paymaster fields입니다."},{symbol:"E",name:"EntryPoint address",description:"검증과 실행을 담당할 허용 contract 주소입니다."},{symbol:"c",name:"Chain ID",description:"Operation이 유효한 chain domain입니다."},{symbol:"h",name:"Authorization digest",description:"Account validation이 signature와 비교할 domain-separated digest입니다."}]} assumptions={["적용 ERC-4337 revision과 pack/hash encoding을 고정합니다.","Nonce state와 account policy generation을 별도로 검증합니다.","Hash binding만으로 bundler simulation·gas·execution success가 보장되지는 않습니다."]} interpretation="CallData와 nonce가 같아도 chainId나 EntryPoint가 달라지면 h가 달라집니다. Account는 화면의 문자열이 아니라 이 canonical digest에 대한 권한을 확인합니다." />
    </section>

    <section id="ml-dsa-signature-boundary" className="space-y-5">
      <p className="text-sm font-semibold text-primary">02 · ML-DSA verifier capability</p>
      <h2 className="text-2xl font-bold">표준 signature artifact와 EVM에서의 검증 비용을 분리한다</h2>
      <p className="leading-7">FIPS 204는 ML-DSA-44·65·87 parameter set의 key generation, signing, verification과 encoding을 정의합니다. Account artifact에는 parameter set, public-key hash, verifier code hash, signature encoding, context/prehash mode와 policy generation을 넣습니다. ‘Dilithium’이라는 옛 이름만 저장하면 표준 revision과 encoding을 재현할 수 없습니다.</p>
      <p className="leading-7">EVM에서 ML-DSA를 검증하려면 account bytecode, library, aggregator, rollup-specific precompile 같은 실제 capability가 필요합니다. ERC-4337이 자유로운 signature field를 허용한다는 사실은 값싼 native verifier가 존재한다는 뜻이 아닙니다. Bytecode size, calldata bytes, validation gas, bundler allowlist·simulation support를 target chain에서 측정합니다.</p>
      <p className="leading-7">Reject fixture에는 wrong chain/EntryPoint, nonce replay, altered callData, wrong parameter set, non-canonical encoding, truncated key/signature, expired policy와 verifier generation mismatch를 둡니다. FIPS known-answer test와 account-level UserOperation test를 분리해 어느 층이 실패했는지 남깁니다.</p>
      <ExplainedFormula question="하이브리드 migration에서 두 서명을 언제 모두 요구하는가?" idea={<>초기 canary에서는 기존 ECDSA와 ML-DSA를 모두 검증해 한 verifier의 결함이 즉시 권한 상실로 이어지지 않게 할 수 있습니다. 이후 policy는 명시적 generation과 recovery 조건으로 바꿉니다.</>} formula={String.raw`V_{\mathrm{hybrid}}=V_{\mathrm{ECDSA}}(h)\land V_{\mathrm{ML\text{-}DSA}}(h)`}
      annotatedFormula={String.raw`V_{\mathrm{hybrid}}=\underbrace{V_{\mathrm{ECDSA}}(h)\land V_{\mathrm{ML\text{-}DSA}}(h)}_{\text{판정 조건 결합}}`}
      operations={[
        { expression: String.raw`V_{\mathrm{ECDSA}}(h)\land V_{\mathrm{ML\text{-}DSA}}(h)`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","초기 canary에서는 기존 ECDSA와 ML-DSA를 모두","검증해 한 verifier의 결함이 즉시 권한 상실로 이어지지","않게 할 수 있습니다."] },
      ]} terms={[{symbol:"h",name:"Same authorization digest",description:"Chain·EntryPoint·nonce·callData에 결속된 같은 digest입니다."},{symbol:"V_ECDSA",name:"Classical verifier",description:"기존 account key와 policy가 검증한 결과입니다."},{symbol:"V_ML-DSA",name:"Post-quantum verifier",description:"고정 FIPS 204 parameter·key·encoding을 사용한 결과입니다."},{symbol:"V_hybrid",name:"Migration decision",description:"해당 migration generation에서 실행을 허용할 Boolean입니다."}]} assumptions={["두 verifier가 같은 h와 서로 다른 key custody를 사용합니다.","AND 정책은 availability와 gas 비용을 높이므로 recovery owner·expiry를 둡니다.","Hybrid는 영구 권고나 양자 공격 발생 확률의 수학적 증명이 아닙니다."]} interpretation="ECDSA=1, ML-DSA=0이면 canary generation의 V_hybrid=0이므로 실행하지 않습니다. 장애를 이유로 조용히 classical-only로 downgrade하지 않고 승인된 rollback generation을 사용합니다." />
    </section>

    <section id="migration-release" className="space-y-5">
      <p className="text-sm font-semibold text-primary">03 · Migration release gate</p>
      <h2 className="text-2xl font-bold">Key 등록, dual validation, recovery와 rollback을 한 artifact로 묶는다</h2>
      <p className="leading-7">Migration은 새 key 생성·backup/recovery test, account verifier upgrade, bundler/EntryPoint compatibility, funding·deposit, nonce continuity, wallet UI와 monitoring까지 함께 바뀝니다. Base와 candidate를 같은 UserOperation fixture에서 simulation·on-chain canary·receipt로 비교합니다.</p>
      <p className="leading-7">Release manifest에는 chain/EntryPoint/account/verifier bytecode hash, FIPS revision·parameter set, classical/PQ public-key hashes, signature bytes, validation/call gas, bundler version, policy/recovery generation과 rollback call을 넣습니다. Unauthorized execution 0과 successful receipt만 세고, simulation-only 성공을 production 성공으로 합치지 않습니다.</p>
      <p className="leading-7">Verifier bug, signature size limit, bundler rejection, paymaster failure, key loss, replay와 upgrade race를 주입합니다. Rollback은 이전 verifier가 여전히 권한을 가진 명시적 경로여야 하며 attacker가 downgrade를 선택할 수 없어야 합니다.</p>
      <div className="grid gap-3 md:grid-cols-2">{[["WRONG DOMAIN","다른 chain/EntryPoint signature를 validation에서 거절"],["NONCE REPLAY","이미 소비한 key·sequence를 effect 전에 거절"],["VERIFIER DRIFT","Code hash/parameter mismatch를 fail closed"],["RECOVERY","분실 fixture에서 승인된 새 generation만 복구"]].map(([t,d]) => <div key={t} className="rounded-lg border border-border p-4"><p className="text-xs font-bold text-primary">{t}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{d}</p></div>)}</div>
      <Evidence id="paper-erc4337" source="ERC-4337 · Account Abstraction Using Alt Mempool" href="https://eips.ethereum.org/EIPS/eip-4337"><p><strong>문제:</strong> Consensus 변경 없이 smart account가 자체 validation·fee·execution policy를 쓰게 합니다.</p><p><strong>기여:</strong> UserOperation, bundler, EntryPoint, account/paymaster validation과 두-loop execution을 정의합니다.</p><p><strong>전제:</strong> 적용 EIP revision·EntryPoint deployment·bundler rules·chain을 고정합니다.</p><p><strong>근거 범위:</strong> ERC-4337 protocol interface와 security boundary입니다.</p><p><strong>하지 않는 주장:</strong> ML-DSA verifier·native precompile·cheap gas·block inclusion을 제공한다고 말하지 않습니다.</p></Evidence>
      <Evidence id="paper-fips204" source="NIST FIPS 204 · ML-DSA" href="https://csrc.nist.gov/pubs/fips/204/final"><p><strong>문제:</strong> 양자 공격을 고려한 디지털 서명 표준의 algorithm·parameter·encoding을 고정합니다.</p><p><strong>기여:</strong> ML-DSA-44/65/87 key generation·sign·verify 표준과 공식 publication/errata 진입점을 제공합니다.</p><p><strong>전제:</strong> 적용 parameter set, FIPS 204 revision과 errata, approved implementation profile을 고정합니다.</p><p><strong>근거 범위:</strong> ML-DSA cryptographic standard입니다.</p><p><strong>하지 않는 주장:</strong> EVM integration, gas, account recovery, implementation side-channel safety를 보장하지 않습니다.</p></Evidence>
      <Evidence id="paper-erc7562" source="ERC-7562 · Account Abstraction Validation Scope Rules" href="https://eips.ethereum.org/EIPS/eip-7562"><p><strong>문제:</strong> Bundler가 arbitrary validation code의 DoS·state dependency를 제한해야 합니다.</p><p><strong>기여:</strong> ERC-4337 계열 validation phase의 off-chain scope rules와 rationale을 설명합니다.</p><p><strong>전제:</strong> Bundler·mempool·EntryPoint implementation revision을 확인합니다.</p><p><strong>근거 범위:</strong> Validation admission과 simulation 규칙입니다.</p><p><strong>하지 않는 주장:</strong> 모든 bundler가 새 PQ verifier를 수락하거나 execution correctness를 보장한다는 뜻은 아닙니다.</p></Evidence>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p className="leading-7">기초 6문제는 UserOperation·EntryPoint·ML-DSA artifact와 작은 Boolean 계산을, 심화 4문제는 replay·gas/capability·migration·rollback을 묻습니다. 모든 답의 전제와 반례는 위 세 절에서 직접 찾을 수 있습니다.</p>
    </section>
  </article>;
}
