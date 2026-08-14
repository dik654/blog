import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import HeliosTrustPathViz from "../helios-trust-path-viz";

export default function Overview({ title }: { title: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}: 서버의 답을 믿지 않고 검증 가능한 local RPC로 바꾸기</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Wallet이 RPC 서버에 계정 A의 잔액을 물으면 보통은 서버가 돌려준 숫자를 그대로 사용합니다. Helios의 핵심은 서버를 없애는
          것이 아니라, <strong>서버가 준 header·account proof·storage proof를 로컬에서 검증한 뒤 같은 block의 답만 공개</strong>하는
          데 있습니다. 그래서 네트워크와 저장 비용은 줄지만 full node와 완전히 같은 검증 범위가 되는 것은 아닙니다.
        </p>
        <p>
          이 글은 “block 1,000의 A 잔액은 7 ETH”라는 한 응답을 따라갑니다. 먼저 최근 weak-subjectivity checkpoint에서 beacon
          header를 검증하고, 그 header가 약속한 execution state root에 account proof를 묶습니다. 이때 checkpoint를 어디서 얻었는지는
          여전히 외부 신뢰이며, RPC availability·정확한 network/fork 설정도 별도 운영 조건입니다.
        </p>
      </div>

      <ContentBoundary article="helios" />
      <HeliosTrustPathViz mode="architecture" />

      <ExplainedFormula
        question="RPC가 돌려준 값 v를 Helios가 같은 block의 검증된 답으로 공개하려면 무엇이 모두 참이어야 할까요?"
        idea="Consensus 검증과 execution-state 증명을 논리곱으로 묶습니다. 둘 중 하나라도 실패하면 부분 결과를 사용하지 않습니다."
        formula={String.raw`\operatorname{Accept}(v)=LC(C,H)\;\land\;Proof(R_{exec}(H),k,v)`}
        terms={[
          { symbol: "C", name: "Trusted checkpoint", description: "Network·epoch·출처를 확인한 최근 beacon block root" },
          { symbol: "H", name: "검증 대상 header", description: "Sync-committee update가 가리키는 beacon/execution block identity" },
          { symbol: "LC(C,H)", name: "Light-client 판정", description: "Checkpoint에서 시작해 committee branch·signature·period 규칙을 통과했다는 Boolean" },
          { symbol: "R_{exec}(H)", name: "Execution state root", description: "검증된 header가 약속한 execution state의 cryptographic commitment" },
          { symbol: "k,v", name: "조회 key와 값", description: "예: account address A와 balance 7 ETH" },
          { symbol: "Proof(R_{exec},k,v)", name: "상태 증명 판정", description: "Key/value proof가 해당 state root에 포함됨을 확인한 Boolean" },
        ]}
        assumptions={[
          "Checkpoint 자체는 protocol이 증명해 주지 않으므로 신뢰할 수 있고 충분히 최근인 출처에서 받아야 합니다.",
          "Network identity·genesis validators root·fork schedule·serialization schema를 응답과 같은 설정으로 고정합니다.",
          "이 식은 지원하는 proof-bearing RPC 경로의 integrity를 나타내며 availability나 모든 EVM 실행의 재현을 뜻하지 않습니다.",
        ]}
        interpretation="예를 들어 sync-committee 검증은 통과했지만 account proof가 다른 state root를 가리키면 결과는 false입니다. 반대로 proof만 맞아도 checkpoint에서 그 header까지의 consensus 연결이 없으면 공개하지 않습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>풀 노드와 다른 것은 비용보다 검증 범위입니다</h3>
        <p>
          Execution client는 block body를 실행해 state transition과 state root를 재계산합니다. Helios는 sync committee가 서명한
          consensus header와 그 아래의 Merkle proof를 사용하므로 block 전체를 다시 실행하지 않습니다. 따라서 “같은 신뢰”라고 뭉뚱그리기보다
          <strong> recent checkpoint와 light-client protocol을 믿고, 선택한 state query가 committed root에 속하는지 검증한다</strong>고
          표현하는 편이 정확합니다. BLS와 sync committee 자체의 정본은 <Link to="/blockchain/prysm-bls">BLS 검증</Link>과{" "}
          <Link to="/blockchain/prysm-sync-committee">sync committee</Link> 글에서 더 깊게 다룹니다.
        </p>
        <h3>고정 사례의 실제 경로</h3>
        <ol>
          <li>Network 설정과 trusted checkpoint receipt를 고정합니다.</li>
          <li>Consensus endpoint에서 bootstrap과 update를 받아 SSZ schema·Merkle branch·BLS signature를 검증합니다.</li>
          <li>검증된 beacon header에서 execution payload의 block hash·state root를 얻습니다.</li>
          <li>Execution RPC의 account/storage proof를 그 state root와 대조합니다.</li>
          <li>Block hash·slot·proof outcome을 함께 local JSON-RPC 응답으로 반환합니다.</li>
        </ol>
        <p>
          현재 Helios source가 어떤 RPC method와 endpoint를 연결하는지는 아래 pinned snapshot의 사실입니다. 반면 여러 provider의 결과를
          교차 확인하고, stale checkpoint·reorg·proof corruption을 같은 fixture에서 재생한 뒤 배포하는 절차는 이 글이 제안하는
          hardening contract입니다. Source에 함수가 있다는 사실만으로 그 운영 계약까지 구현됐다고 주장하지 않습니다.
        </p>
        <h3>무엇을 보장하지 않는가</h3>
        <p>
          Valid proof는 해당 root 아래의 값 integrity를 말할 뿐 RPC가 항상 응답한다는 뜻이 아닙니다. 또한 unsupported method나 proof를
          제공하지 않는 데이터, mempool의 미래 상태, 오래된 checkpoint의 안전성은 별도 문제입니다. Block number만 기록하면 reorg 뒤 다른
          hash를 가리킬 수 있으므로 응답 receipt에는 network·slot·block hash·state root·source endpoint·Helios SHA를 함께 남겨야 합니다.
        </p>
      </div>

      <div id="paper-helios-source" className="scroll-mt-24">
        <CitationBlock source="a16z/helios source snapshot 43a8c9f" href="https://github.com/a16z/helios/tree/43a8c9f3cdda41a6f383c4db41d9a83f102638b1" citeKey={1} type="code">
          문제: 중앙 RPC의 응답을 constrained client가 그대로 믿어야 하는 문제. 기여: consensus light client와 execution proof를 local
          RPC surface에 결합한 구현. 전제: 이 SHA·network config·provider capability를 고정합니다. 근거 범위: 해당 snapshot의 crate·API·검증
          경로입니다. 주장하지 않는 것: 모든 RPC method의 full-node 동등성, audit 완료, moving master의 동작이나 고정 성능을 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-consensus-light-client-spec" className="scroll-mt-24">
        <CitationBlock source="Ethereum consensus-specs v1.6.1 — Altair light client" href="https://github.com/ethereum/consensus-specs/tree/v1.6.1/specs/altair/light-client" citeKey={2}>
          문제: 전체 BeaconState를 실행하지 않는 client가 recent header를 추적하는 문제. 기여: bootstrap·update·store validation과
          committee rotation의 executable rules. 전제: v1.6.1, 활성 fork와 network preset, trusted checkpoint를 고정합니다. 근거 범위:
          consensus light-client protocol입니다. 주장하지 않는 것: execution proof·RPC availability·Helios runtime policy를 규정하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-eip1186-proof" className="scroll-mt-24">
        <CitationBlock source="EIP-1186 — eth_getProof" href="https://eips.ethereum.org/EIPS/eip-1186" citeKey={3}>
          문제: RPC consumer가 account와 storage 값을 state root에 대해 검증할 proof를 받는 문제. 기여: accountProof·storageProof 응답
          구조를 정의합니다. 전제: 선택한 block의 state root와 canonical trie encoding이 일치합니다. 근거 범위: proof-bearing execution RPC
          response입니다. 주장하지 않는 것: 해당 block의 consensus 정당성이나 provider availability를 대신 보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
