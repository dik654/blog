import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import HeliosLocator, { HeliosMapReturn } from "./HeliosLocator";
import HeliosTrustTraceViz from "./viz/HeliosTrustTraceViz";

const HELIOS_SHA = "43a8c9f3cdda41a6f383c4db41d9a83f102638b1";
const CONSENSUS_SPECS_SHA = "5fa6edcca8ab4cf548653e6680b17b9d3e04d225";

function TrustBoundaryTable() {
  const rows = [
    ["Checkpoint C", "사용자·설정", "어느 consensus history에서 검증을 시작할지 정합니다.", "출처가 정직하고 충분히 최근인지"],
    ["LightClientStore", "Consensus client", "검증을 통과한 optimistic·finalized header와 committee를 유지합니다.", "Branch·BLS·period·network 판정"],
    ["Block H · state root R", "검증된 header", "Execution proof가 결속돼야 할 정확한 block과 root를 제공합니다.", "Consensus header와 execution payload의 결속"],
    ["Account proof P", "Execution RPC가 제공, Helios가 판정", "주소 A의 account fields가 R에 포함됨을 증명합니다.", "Merkle-Patricia proof와 R의 일치"],
    ["Response q-7", "Local JSON-RPC", "검증된 balance를 호출자에게 반환합니다.", "같은 H·R·P에서 나온 결과인지"],
  ] as const;

  return (
    <div className="not-prose overflow-x-auto border-y border-border">
      <table className="w-full min-w-[56rem] border-collapse text-left text-xs leading-5">
        <thead>
          <tr className="text-muted-foreground">
            <th className="px-3 py-3">상태·증거</th>
            <th className="px-3 py-3">권한 있는 작성자</th>
            <th className="px-3 py-3">맡은 일</th>
            <th className="px-3 py-3">남는 신뢰·검사</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-border align-top">
              {row.map((cell, index) => <td key={cell} className={`px-3 py-3 ${index === 0 ? "font-bold" : ""}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default function Overview({ title: _title }: { title: string }) {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6 scroll-mt-20">
        <HeliosLocator current="helios" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold tracking-tight">중앙 RPC가 돌려준 잔액을 어느 block의 검증된 값으로 바꾸려면 무엇을 확인해야 합니까?</h2>
        </div>
        <HeliosTrustTraceViz />
        <p className="text-lg leading-8 text-foreground/90">
          Helios는 잔액 요청이 올 때마다 checkpoint부터 다시 시작하지 않습니다. 먼저 trusted checkpoint에서 consensus update를 검증해 optimistic·finalized block을 유지합니다. 그 뒤 요청 <code>q-7</code>이 들어오면 현재 검증된 block hash <code>H</code>에 account proof를 요청하고, proof가 그 block의 execution state root <code>R</code>과 맞는지 확인합니다.
        </p>
        <p>
          두 검사가 모두 통과해야 balance 7 ETH를 반환합니다. Consensus 서명만 맞으면 account 값의 진위가 남고, account proof만 맞으면 그 state root가 선택한 Ethereum history에 속하는지가 남습니다. 그래서 두 경로를 같은 block identity에서 결합해야 합니다.
        </p>
      </section>

      <section id="trust-preparation" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">Trust path</p>
        <h2 className="break-keep text-2xl font-bold">Consensus 검증은 요청 앞에서 block H와 state root R을 준비합니다</h2>
        <p>
          Helios commit <code>{HELIOS_SHA.slice(0, 7)}</code>의 Ethereum client는 시작할 때 설정이나 로컬 DB에서 checkpoint를 고릅니다. Consensus RPC에서 bootstrap과 update를 받은 뒤 network·Merkle branch·sync committee signature·period 규칙을 검사합니다. 통과한 update만 <code>LightClientStore</code>에 적용됩니다.
        </p>
        <p>
          이 Store가 유지하는 optimistic·finalized header에서 execution payload를 꺼낼 때도 block root를 다시 대조합니다. 따라서 Execution RPC가 최신이라고 주장하는 임의 block이 아니라, consensus 경로가 이미 검증한 block만 요청 경로의 기준이 됩니다.
        </p>
        <TrustBoundaryTable />
        <p>
          Checkpoint C는 이 표의 첫 입력이지 protocol이 스스로 만들어 내는 결론이 아닙니다. 어느 출처에서 checkpoint를 받고 얼마나 오래된 값을 허용할지는 <Link to="/cs/blockchain/helios-bootstrap#overview">부트스트랩 글</Link>과 <Link to="/cs/blockchain/helios-config#overview">설정·운영 글</Link>에서 나눠 다룹니다.
        </p>
      </section>

      <section id="request-path" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">Request path</p>
        <h2 className="break-keep text-2xl font-bold">잔액 요청은 block을 먼저 고정한 뒤 같은 hash에 proof를 요청합니다</h2>
        <p>
          Local JSON-RPC가 <code>eth_getBalance(A, latest)</code>를 받으면 Node는 latest block이 지나치게 오래되지 않았는지 확인합니다. 이어 Execution provider가 block을 얻고 그 header hash를 <code>eth_getProof</code>의 block ID로 사용합니다. Provider가 돌려준 숫자와 proof를 서로 다른 latest 시점에서 가져오지 않게 하는 경계입니다.
        </p>
        <pre className="not-prose overflow-x-auto border-y border-border bg-muted/25 p-4 text-[11px] leading-6"><code>{`// 1. latest 요청이면 현재 head가 너무 오래되지 않았는지 확인합니다.
self.check_blocktag_age(&block_id).await?;

// 2. 주소 A와 block ID를 Execution provider에 넘깁니다.
let account = self.execution
    .get_account(address, &[], false, block_id)
    .await?;

// 3. Provider가 먼저 정확한 block header를 가져옵니다.
let block = self.get_block(block_id, false).await?
    .ok_or(eyre!("block not found"))?;

// 4. 숫자 대신 같은 block hash의 EIP-1186 proof를 요청합니다.
let proof = self.provider
    .get_proof(address, slots.to_vec())
    .block_id(block.header().hash().into())
    .await?;

// 5. Account와 storage proof를 그 header의 root에 대조합니다.
verify_account_proof(&proof, block.header().state_root())?;
verify_storage_proof(&proof)?;

// 6. 모든 검사가 끝난 account에서 balance를 반환합니다.
Ok(account.account.balance)`}</code></pre>
        <p>
          위 코드는 <code>core/src/client/node.rs</code>와 <code>core/src/execution/providers/rpc.rs</code>의 두 경계를 한 요청 순서로 붙인 발췌입니다. 자세한 Merkle-Patricia 검증은 <Link to="/cs/blockchain/helios-state#overview">State proof 글</Link>, proof-backed EVM 실행은 <Link to="/cs/blockchain/helios-execution#overview">Execution RPC 글</Link>에서 이어집니다.
        </p>
      </section>

      <section id="evidence-boundary" className="space-y-6 scroll-mt-20">
        <p className="text-xs font-bold text-primary">검증 조건</p>
        <h2 className="break-keep text-2xl font-bold">Consensus와 state proof 중 하나라도 실패하면 balance를 공개하지 않습니다</h2>
        <ExplainedFormula
          question="응답 q-7의 balance 7 ETH를 검증된 값으로 반환하려면 무엇이 모두 참이어야 합니까?"
          idea="Checkpoint에서 block H까지의 consensus 연결과 H의 execution state root R에 대한 account proof를 논리곱으로 묶습니다."
          formula={String.raw`Accept(q_7,7)=LC(C,H)\land MPT(R_H,A,7)`}
          annotatedFormula={String.raw`\operatorname{Accept}(q_7,7)=\underbrace{LC(C,H)}_{\text{checkpoint C에서 block H까지 검증}}\land\underbrace{MPT(R_H,A,7)}_{\text{H의 state root에 A의 balance 7이 포함}}`}
          operations={[
            { expression: String.raw`LC(C,H)=true`, annotation: ["Network·branch·committee·BLS·period를 확인해", "checkpoint C에서 block H까지 연결합니다"] },
            { expression: String.raw`R_H=execution\_state\_root(H)`, annotation: ["검증된 H의 execution payload에서", "account proof 기준 root R을 얻습니다"] },
            { expression: String.raw`MPT(R_H,A,7)=true`, annotation: ["주소 A의 account fields를 R에 대조하고", "balance 7을 같은 proof에서 읽습니다"] },
            { expression: String.raw`true\land true=true`, annotation: ["두 판정이 같은 H에 결속될 때만", "q-7에 7 ETH를 반환합니다"] },
          ]}
          terms={[
            { symbol: "C", name: "Trusted checkpoint", description: "Light-client consensus 검증을 시작할 최근 beacon block root입니다." },
            { symbol: "H", name: "검증된 block", description: "LightClientStore의 optimistic 또는 finalized header가 결속한 execution block입니다." },
            { symbol: "R_H", name: "Execution state root", description: "Block H의 account와 storage trie를 약속하는 root입니다." },
            { symbol: "A,7", name: "조회 key와 값", description: "설명 사례의 주소 A와 balance 7 ETH입니다." },
          ]}
          assumptions={[
            "C의 출처와 freshness는 light-client protocol 밖에서 승인해야 합니다.",
            "Network·genesis validators root·fork schedule·SSZ schema를 같은 설정으로 고정합니다.",
            `Helios source는 commit ${HELIOS_SHA.slice(0, 7)}, consensus 규격은 v1.6.1 commit ${CONSENSUS_SPECS_SHA.slice(0, 7)}에 고정합니다.`,
          ]}
          interpretation="예를 들어 sync committee 검증이 통과해도 proof가 다른 state root를 가리키면 두 번째 항이 false이므로 balance를 반환하면 안 됩니다. 반대로 proof가 맞아도 H가 trusted checkpoint와 이어지지 않으면 첫 번째 항이 false입니다."
        />
      </section>

      <section id="boundary" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">결과 경계</p>
        <h2 className="break-keep text-2xl font-bold">응답 실패와 검증 실패, 지원하지 않는 method를 같은 오류로 합치지 않습니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">결과</th><th className="px-3 py-3">잔액 사례</th><th className="px-3 py-3">의미</th><th className="px-3 py-3">다음 상태</th></tr></thead>
            <tbody>{[
              ["Valid", "H와 R이 맞고 proof가 balance 7을 증명", "Integrity 판정 완료", "7 ETH와 H·R·PASS 반환"],
              ["Invalid", "Proof branch나 root가 맞지 않음", "응답은 왔지만 검증 실패", "값을 공개하지 않고 기존 trusted state 유지"],
              ["Unavailable", "Consensus·Execution endpoint timeout", "진위를 판정할 응답이 없음", "부분 결과를 버리고 같은 query identity로 재시도"],
              ["Unsupported", "해당 method에 검증 가능한 증거 경로가 없음", "지원 범위 밖", "Provider-trusted 결과와 verified 결과를 구분"],
            ].map((row) => <tr key={row[0]} className="border-t border-border align-top">{row.map((cell, index) => <td key={cell} className={`px-3 py-3 ${index === 0 ? "font-bold" : ""}`}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          Helios가 모든 full node 검증을 대신한다는 결론도 피해야 합니다. Full execution node는 block body를 실행해 state transition과 state root를 다시 계산합니다. Helios는 recent checkpoint와 light-client protocol을 바탕으로 선택한 block과 proof-bearing 조회를 검증합니다. 검증 범위와 남는 신뢰 가정이 다릅니다.
        </p>
      </section>

      <section id="sources" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">버전을 고정한 근거</p>
        <h2 className="break-keep text-2xl font-bold">구현과 protocol, execution proof의 책임을 나눠 확인했습니다</h2>
        <div id="paper-helios-source">
          <CitationBlock source={`a16z/helios · ${HELIOS_SHA.slice(0, 7)}`} href={`https://github.com/a16z/helios/tree/${HELIOS_SHA}`} citeKey={1} type="code">
            <p><strong>확인한 것:</strong> 2026-06-22 commit의 consensus Store, verified block 전달, balance 요청과 account proof 검증 경계입니다.</p>
            <p><strong>범위:</strong> 선택한 source snapshot의 동작입니다. Audit 완료, 모든 provider·method 지원, 고정 성능은 주장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-consensus-light-client-spec">
          <CitationBlock source="Ethereum consensus-specs v1.6.1 · Light client" href={`https://github.com/ethereum/consensus-specs/tree/${CONSENSUS_SPECS_SHA}/specs/altair/light-client`} citeKey={2}>
            <p><strong>확인한 것:</strong> Bootstrap·update·LightClientStore·sync committee rotation의 protocol 규칙입니다.</p>
            <p><strong>범위:</strong> Consensus light-client semantics입니다. Execution proof나 Helios의 HTTP·disk 정책은 정하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-eip1186-proof">
          <CitationBlock source="EIP-1186 · eth_getProof" href="https://eips.ethereum.org/EIPS/eip-1186" citeKey={3}>
            <p><strong>확인한 것:</strong> Account와 storage 값을 state root에 대조할 proof response 형식입니다.</p>
            <p><strong>범위:</strong> Proof-bearing Execution RPC envelope입니다. 해당 block의 consensus 정당성과 endpoint availability는 별도입니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <p className="text-xs font-bold text-primary">읽고 바로 확인할 질문</p>
        <h2 className="break-keep text-2xl font-bold">세 질문에 답하면 세부 경로로 들어갈 수 있습니다</h2>
        <ol className="space-y-3 pl-5 text-sm leading-7">
          <li>Consensus 검증과 잔액 proof 검증이 서로 대신할 수 없는 이유는 무엇입니까? <span className="text-muted-foreground">(답: 검증 조건)</span></li>
          <li>왜 <code>eth_getProof</code>를 block number가 아니라 검증된 block hash H에 결속해야 합니까? <span className="text-muted-foreground">(답: Request path)</span></li>
          <li>Invalid·Unavailable·Unsupported를 구분하지 않으면 어떤 과도한 보안 주장이 생깁니까? <span className="text-muted-foreground">(답: 결과 경계)</span></li>
        </ol>
      </section>

      <HeliosMapReturn current="helios" />
    </article>
  );
}
