import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CosmosCoreLocator, { CosmosCoreMapReturn } from "../CosmosCoreLocator";
import { CryptoEvidenceBoundaryViz, CryptoEvidenceTraceViz } from "./viz/ModernCryptoViz";
import { codeRefs } from "./codeRefs";
import { cometbftCryptoTree } from "./fileTrees";

const sourceCommit = "0880b4d378f347ab16e54ec677ff50d803f37d62";

export default function ModernCometBFTCryptoArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article>
        <section id="overview" className="mb-16 scroll-mt-20">
          <CosmosCoreLocator
            currentSlug="cometbft-crypto"
            region="block commitment와 validator approval의 byte-level 검증"
            question="확정된 B41에 T1이 들어 있다는 사실을 서명 하나나 Merkle proof 하나만으로 확인할 수 있을까요?"
          />
          <h2 className="mb-6 text-2xl font-bold">B41의 서명과 T1 포함 증명을 하나의 검증 경로로 연결합니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-8">
              Chain <code>demo-1</code>의 높이 41 block <code>B41</code>에는 ASCII bytes <code>alice&gt;bob:10</code>인
              transaction <code>T1</code>과 <code>T2=carol&gt;dave:5</code>, <code>T3=erin&gt;frank:7</code>이 이 순서로 들어 있습니다.
              앞 글에서 validator A 40과 B 35의 precommit이 <code>HB41</code>에 75/100 Commit을 만들었다고 확인했습니다.
            </p>
            <p className="text-lg leading-8">
              이 글은 그 결과를 다시 합의하지 않습니다. <code>T1 bytes → DataHash D41 → Header hash HB41</code> 경로와
              <code>canonical vote bytes → validator signature</code> 경로를 각각 검증한 뒤, 두 receipt를 어느 지점에서 합칠 수 있는지
              추적합니다.
            </p>
            <p>
              Vote·Commit·validator power의 구조가 필요하면
              <Link to="/cs/blockchain/cometbft-types#vote-commit"> CometBFT 타입의 Vote·Commit 추적</Link>부터 이어 읽으면 됩니다.
              일반 Ed25519·SHA-256의 수학적 안전성은 암호 primitive 정본이 소유하고, 여기서는 CometBFT v0.40.0의 실제 encoding과
              호출 경계만 다룹니다.
            </p>
          </div>
          <ContentBoundary article="cometbft-crypto" />
          <CryptoEvidenceTraceViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>두 검증 경로는 마지막까지 서로 다른 질문에 답합니다</h3>
            <ul>
              <li><strong>Vote signature</strong>는 validator A가 정확한 chain·height·round·BlockID의 canonical bytes를 승인했는지 확인합니다.</li>
              <li><strong>Commit verification</strong>은 신뢰한 validator set에서 같은 BlockID에 2/3 초과 power가 모였는지 확인합니다.</li>
              <li><strong>Transaction proof</strong>는 제공된 T1 bytes가 Header의 ordered <code>DataHash</code>에 포함됐는지 확인합니다.</li>
              <li><strong>Application execution</strong>은 Alice의 서명·잔액·nonce와 실제 상태 변경 성공 여부를 별도로 판단합니다.</li>
            </ul>
            <p>
              따라서 “A의 signature가 유효하다”와 “T1이 확정된 B41에 포함됐다”는 같은 문장이 아닙니다. A 한 명의 signature만으로는
              Commit을 만들 수 없고, 출처를 모르는 Merkle root에 맞는 proof만으로는 그 root가 신뢰할 block에 속한다고 할 수 없습니다.
            </p>
          </div>
        </section>

        <section id="merkle" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Transaction bytes를 두 번 해시해 ordered DataHash에 연결합니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              CometBFT의 <code>Tx.Hash</code>는 raw transaction bytes의 32-byte SHA-256입니다. <code>Txs.Hash</code>는 이 TxHash 목록을
              그대로 반환하지 않고, 각 TxHash 앞에 <code>0x00</code>을 붙여 다시 leaf hash를 만듭니다. Inner node는
              <code>0x01 || left || right</code>를 해시합니다.
            </p>
            <p>
              세 transaction의 tree는 균형을 맞추기 위해 임의로 정렬하지 않습니다. 입력 순서를 유지한 채 가장 큰 2의 거듭제곱인 2에서
              <code>[T1,T2]</code>와 <code>[T3]</code>로 나눕니다. 따라서 T1 proof의 aunt 순서는 L2, L3이고, index 0·total 3이
              각 hash가 왼쪽인지 오른쪽인지 결정합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Tx root·proof 원문" onClick={() => sidebar.open("tx-merkle-proof", codeRefs["tx-merkle-proof"])} />
            <CodeViewButton label="Leaf·inner domain 원문" onClick={() => sidebar.open("merkle-domains", codeRefs["merkle-domains"])} />
            <CodeViewButton label="Proof.Verify 원문" onClick={() => sidebar.open("proof-verify", codeRefs["proof-verify"])} />
          </div>

          <ExplainedFormula
            question="T1·T2·T3 세 transaction의 DataHash D41은 어떤 순서로 계산합니까?"
            idea={<>Raw bytes를 먼저 TxHash로 바꾸고, TxHash를 0x00 영역의 leaf로 바꿉니다. L1·L2를 먼저 묶은 뒤 L3와 결합하면 세 항목의 순서와 tree shape가 모두 D41에 반영됩니다.</>}
            formula={String.raw`H_i=SHA256(T_i),\quad L_i=SHA256(0x00\|H_i),\quad P_{12}=SHA256(0x01\|L_1\|L_2),\quad D_{41}=SHA256(0x01\|P_{12}\|L_3)`}
            annotatedFormula={String.raw`\underbrace{H_i=SHA256(T_i)}_{\text{32-byte TxHash}},\quad \underbrace{L_i=SHA256(0x00\|H_i)}_{\text{leaf domain}},\quad \underbrace{P_{12}=SHA256(0x01\|L_1\|L_2)}_{\text{왼쪽 subtree}},\quad \underbrace{D_{41}=SHA256(0x01\|P_{12}\|L_3)}_{\text{ordered DataHash}}`}
            operations={[
              { expression: String.raw`H_1=5c41bd\ldots4a06`, annotation: ["ASCII alice>bob:10의", "SHA-256 32-byte digest"] },
              { expression: String.raw`L_1=642302\ldots60e2`, annotation: ["0x00 || H1을 다시 해시", "raw T1이 바로 leaf가 아님"] },
              { expression: String.raw`P_{12}=f26d10\ldots55cf`, annotation: ["0x01 || L1 || L2", "T1과 T2 순서 고정"] },
              { expression: String.raw`D_{41}=8b7610\ldots f65f`, annotation: ["0x01 || P12 || L3", "Header.DataHash에 저장"] },
            ]}
            terms={[
              { symbol: "T_i", name: "transaction bytes", description: "CometBFT에는 의미 없는 byte array이며 application이 해석합니다." },
              { symbol: "H_i", name: "TxHash", description: "Raw transaction bytes의 32-byte SHA-256입니다." },
              { symbol: "L_i", name: "Merkle leaf hash", description: "0x00 prefix와 TxHash를 함께 해시한 값입니다." },
              { symbol: "D_{41}", name: "DataHash", description: "B41의 ordered transaction 목록을 commitment한 32-byte root입니다." },
            ]}
            assumptions={[
              "T1·T2·T3의 bytes와 순서는 위 fixture처럼 고정합니다.",
              "SHA-256 collision resistance를 전제합니다.",
              "Proof verifier는 expected Header.DataHash와 index·total·aunt 순서를 함께 확인합니다.",
              "Merkle inclusion은 transaction의 업무 규칙이나 실행 결과를 검증하지 않습니다.",
            ]}
            interpretation="T1 proof는 H1·L1을 다시 계산하고 aunts L2·L3로 D41을 복원합니다. D41과 일치하면 T1의 포함은 확인하지만, D41이 어느 block에 속하는지는 Header와 Commit을 통해 별도로 연결해야 합니다."
          />

          <div id="paper-cometbft-merkle-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · types/tx.go · crypto/merkle" citeKey={1} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/types/tx.go`}>
              <p><strong>문제:</strong> Ordered transaction 목록을 compact root로 묶고 한 transaction의 포함을 전체 block 없이 검증합니다.</p>
              <p><strong>기여:</strong> TxHash 목록, 0x00/0x01 domain, index·total·aunts와 expected DataHash 검증을 연결합니다.</p>
              <p><strong>전제:</strong> Exact transaction bytes, 순서와 신뢰할 Header.DataHash가 필요합니다.</p>
              <p><strong>근거 범위:</strong> T1 bytes에서 B41 DataHash까지의 inclusion verification입니다.</p>
              <p><strong>말하지 않는 것:</strong> Block finality, transaction authorization, data availability와 application 실행 성공을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="ed25519" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Validator는 transaction이 아니라 canonical vote bytes에 서명합니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              A가 서명하는 message에는 <code>PRECOMMIT</code>, height 41, round 0, <code>BlockID(HB41, PartSetHeader)</code>, timestamp와
              chain ID <code>demo-1</code>이 들어갑니다. <code>ValidatorAddress</code>와 <code>ValidatorIndex</code>는 canonical vote에서
              빠집니다. 이 둘은 signer마다 달라지는 lookup 정보이지 합의 좌표 자체가 아니기 때문입니다.
            </p>
            <p>
              수신자는 validator set에서 A의 32-byte public key를 가져옵니다. 먼저 <code>SHA256(pubA)[:20]</code>이 vote의
              20-byte address와 같은지 확인하고, 같은 public key로 다시 만든 canonical bytes와 64-byte signature를 검증합니다.
              Address 일치는 public key를 찾는 receipt이고 signature 성공은 A가 그 exact message를 승인했다는 receipt입니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Canonical vote 원문" onClick={() => sidebar.open("vote-sign-bytes", codeRefs["vote-sign-bytes"])} />
            <CodeViewButton label="Vote.Verify 원문" onClick={() => sidebar.open("vote-verify", codeRefs["vote-verify"])} />
            <CodeViewButton label="Ed25519 길이·address 원문" onClick={() => sidebar.open("ed25519-contract", codeRefs["ed25519-contract"])} />
            <CodeViewButton label="20B·32B hash 원문" onClick={() => sidebar.open("tmhash-lengths", codeRefs["tmhash-lengths"])} />
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>20-byte address와 32-byte commitment를 같은 증거로 사용하지 않습니다</h3>
            <p>
              <code>tmhash.Sum</code>은 32-byte SHA-256을 반환하지만 <code>SumTruncated</code>는 앞 20 bytes만 남깁니다. Validator
              address는 compact identity이므로 vote와 public key를 연결하는 데 사용합니다. Transaction root, Header hash와 Merkle aunt는
              모두 32-byte commitment를 기대합니다. 길이가 다르다는 사실은 용도가 다르다는 경고이기도 합니다.
            </p>
            <h3>서명 성공도 한 validator의 승인 범위만 확인합니다</h3>
            <p>
              A의 signature가 유효해도 A 한 명의 power 40은 100의 2/3를 넘지 않습니다. 다른 validator signature를 같은 height·round·BlockID로
              묶고 historical validator set의 power를 계산해야 Commit이 됩니다. 이 합의 계산은 crypto primitive가 아니라 VoteSet·Commit verifier가
              소유합니다.
            </p>
          </div>
          <div id="paper-cometbft-ed25519-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · types/vote.go · crypto/ed25519" citeKey={2} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/types/vote.go`}>
              <p><strong>문제:</strong> Validator identity와 합의 좌표를 정확한 bytes에 묶어 위조·다른 chain·round 재사용을 거부합니다.</p>
              <p><strong>기여:</strong> Canonical vote encoding, address lookup과 Ed25519 signature verification을 순서대로 구현합니다.</p>
              <p><strong>전제:</strong> 검증할 높이의 신뢰한 validator set, 허용된 key type과 같은 chain ID가 필요합니다.</p>
              <p><strong>근거 범위:</strong> 한 validator vote의 signer와 exact message 검증입니다.</p>
              <p><strong>말하지 않는 것:</strong> 2/3 Commit, block inclusion, user account signature와 application transaction validity를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="hash" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Commit과 proof를 같은 Header에서 만날 때 포함 결론이 완성됩니다</h2>
          <CryptoEvidenceBoundaryViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              <code>Header.Hash</code>는 <code>DataHash</code>를 포함한 Header fields를 ordered Merkle root로 묶어 <code>HB41</code>을
              만듭니다. Commit verifier가 HB41의 validator signatures와 power를 확인하면 HB41은 신뢰할 block identity가 됩니다. T1 proof가
              그 Header의 D41을 복원하면 비로소 “확정된 B41에 T1 bytes가 포함됐다”는 두 경로가 만납니다.
            </p>
            <p>
              여기서도 Alice의 account key는 등장하지 않습니다. T1이 B41에 포함됐다는 사실과 T1이 application에서 성공했다는 사실은 다릅니다.
              실행 결과는 <code>FinalizeBlock</code> response와 다음 State·AppHash 경계에서 확인해야 합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="DataHash·Header hash 원문" onClick={() => sidebar.open("header-datahash", codeRefs["header-datahash"])} />
            <CodeViewButton label="TxProof.Validate 원문" onClick={() => sidebar.open("tx-merkle-proof", codeRefs["tx-merkle-proof"])} />
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>검증 실패도 멈춘 경계에 따라 의미가 다릅니다</h3>
            <ul>
              <li>Vote address가 public key와 다르면 signer lookup 경계에서 <code>ErrVoteInvalidValidatorAddress</code>입니다.</li>
              <li>Address는 같지만 signature가 다르면 exact canonical vote 승인에 실패합니다.</li>
              <li>T1 bytes가 바뀌면 재계산한 LeafHash가 proof의 LeafHash와 달라집니다.</li>
              <li>Index·Total·Aunts가 맞지 않으면 같은 hashes가 있어도 expected D41을 복원하지 못합니다.</li>
              <li>Proof root가 다른 block의 root라면 <code>TxProof.Validate(header.DataHash)</code>의 첫 비교에서 중단합니다.</li>
              <li>모든 crypto 검증이 성공해도 application이 T1을 invalid로 처리할 수 있습니다.</li>
            </ul>
            <h3>이 글만으로 확인할 질문</h3>
            <ol>
              <li>왜 T1 raw bytes가 Merkle leaf에 바로 들어가지 않고 TxHash를 한 번 거칩니까?</li>
              <li>세 transaction에서 T1 proof의 aunts가 L2·L3 순서인 이유를 설명할 수 있습니까?</li>
              <li>ValidatorAddress가 맞는데도 signature verification이 별도로 필요한 이유는 무엇입니까?</li>
              <li>A의 signature 하나와 A+B Commit이 답하는 질문의 차이는 무엇입니까?</li>
              <li>Commit과 T1 proof가 모두 성공했는데도 잔액 변경 성공을 단정할 수 없는 이유는 무엇입니까?</li>
            </ol>
          </div>
          <div id="paper-cometbft-tmhash-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · types/block.go · crypto/tmhash" citeKey={3} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/crypto/tmhash/hash.go`}>
              <p><strong>문제:</strong> 32-byte commitment와 20-byte lookup address를 구분하면서 transaction root를 BlockID hash에 연결합니다.</p>
              <p><strong>기여:</strong> Full SHA-256과 truncated address API를 나누고 DataHash를 ordered Header field root의 일부로 만듭니다.</p>
              <p><strong>전제:</strong> Caller가 field별 expected length와 v0.40.0 Header encoding을 알고 사용해야 합니다.</p>
              <p><strong>근거 범위:</strong> T1 DataHash가 validator가 서명한 HB41 안에 들어가고 address가 public key lookup에 쓰이는 경계입니다.</p>
              <p><strong>말하지 않는 것:</strong> 20-byte address를 32-byte commitment와 같은 보안 증거로 만들거나 application execution을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <CosmosCoreMapReturn
          currentSlug="cometbft-crypto"
          closure="CometBFT는 transaction bytes를 ordered DataHash와 Header hash로 연결하고, validator는 chain·height·round·BlockID의 canonical vote bytes에 서명합니다. Commit이 Header를 신뢰하게 만들고 TxProof가 T1을 그 Header의 DataHash에 연결해야 포함 결론이 완성되며, application validity는 별도 경계에 남습니다."
        />
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftCryptoTree }}
        projectMetas={{ cometbft: { id: "cometbft", label: "CometBFT v0.40.0 · Go", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" } }}
      />
    </>
  );
}
