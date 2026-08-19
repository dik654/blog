import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CryptoBoundaryViz, HashCommitmentViz } from "./viz/ModernCryptoViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { cometbftCryptoTree } from "./fileTrees";

export default function ModernCometBFTCryptoArticle() {
  const sidebar = useCodeSidebar();
  return <>
  <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">CometBFT v0.40.0 구현 읽기</p><h2 className="text-3xl font-bold tracking-tight">Crypto layer는 transaction을 실행하지 않고 consensus evidence의 bytes와 key를 검증한다</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><code>Alice→Bob 10</code> transaction이 block에 들어갔다고 해도 CometBFT의 Ed25519 코드가 Alice의 잔액과 account 서명을 검증하지는 않습니다. Application이 user transaction을 해석하고, CometBFT는 validator가 canonical vote bytes에 서명했는지와 block field의 hash commitment가 이어지는지를 검증합니다.</p>
      <p>Hash는 바뀌 bytes를 발견하고 signature는 key owner의 승인을 확인하며 Merkle proof는 전체를 다 다운로드하지 않고도 ordered set 속 leaf를 검증하게 합니다. 일반 Ed25519·Merkle의 보안 정의는 <a className="text-primary hover:underline" href="/crypto/crypto-primitives#ed25519">암호 primitive 정본</a>이 소유하고, 이 글은 v0.40.0의 encoding·length·address 경계만 소유합니다.</p>
      <CryptoBoundaryViz />
    </section>

    <section id="ed25519" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Ed25519 contract</p><h2 className="mt-2 text-2xl font-bold">Signature는 의미가 아니라 정확한 message bytes에 귀속된다</h2></header>
      <p>v0.40.0 implementation의 Ed25519 private key는 64 bytes, public key는 32 bytes, signature는 64 bytes이며 verifier는 public-key·signature length를 먼저 검사합니다. 그러나 signature가 유효해도 chain ID·height·round·vote type과 block ID가 canonical sign bytes에 바르게 포함되었는지는 별도입니다. 그 encoding과 replay domain은 <a className="text-primary hover:underline" href="/blockchain/cometbft-types#vote-commit">CometBFT types 정본</a>에서 다룹니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="Sign()" onClick={() => sidebar.open("ed25519-sign", codeRefs["ed25519-sign"])} />
        <CodeViewButton label="VerifySignature()" onClick={() => sidebar.open("ed25519-verify", codeRefs["ed25519-verify"])} />
      </div>
      <p>Public-key address는 key 자체가 아니라 <code>SHA-256(pubkey)</code>의 앞 20 bytes입니다. Address equality로 validator identity를 찾은 뒤에도 signature verification은 원래 public key와 canonical message로 해야 합니다. 또한 batch verification은 throughput optimization이지, 하나의 서명을 빼거나 failed member를 숨기는 다른 보안 모델이 아닙니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="Address()" onClick={() => sidebar.open("ed25519-addr", codeRefs["ed25519-addr"])} />
      </div>
      <div id="paper-cometbft-ed25519-v040"><CitationBlock source="CometBFT v0.40.0 — crypto/ed25519/ed25519.go" citeKey={1} type="code" href="https://github.com/cometbft/cometbft/blob/v0.40.0/crypto/ed25519/ed25519.go"><p><strong>문제:</strong> Consensus key의 서명·address·batch verifier를 하나의 crypto interface로 제공합니다.</p><p><strong>기여:</strong> Fixed-size key/signature, ZIP-215 verification option, SHA-256-20 address와 batch verifier를 구현합니다.</p><p><strong>전제:</strong> v0.40.0 encoding과 consensus parameter가 해당 public-key type을 허용합니다.</p><p><strong>근거 범위:</strong> CometBFT Ed25519 instance의 구현 contract입니다.</p><p><strong>말하지 않는 것:</strong> User account authorization, key custody, application message validity를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="merkle" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Merkle commitment</p><h2 className="mt-2 text-2xl font-bold">Leaf와 inner node의 prefix를 달리해 구조적 혼동을 막는다</h2></header>
      <p><code>HashFromByteSlices</code>는 ordered leaves를 RFC 6962 스타일의 simple Merkle tree로 묶습니다. Empty list는 SHA-256(empty), leaf는 <code>0x00</code>, inner node는 <code>0x01</code> prefix를 붙여 hash합니다. 이 domain separation이 없으면 leaf bytes가 두 child hash의 연결처럼 보이는 구조적 혼동을 막기 어렵습니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="HashFromByteSlices()" onClick={() => sidebar.open("merkle-hash", codeRefs["merkle-hash"])} />
        <CodeViewButton label="leafHash · innerHash" onClick={() => sidebar.open("merkle-leaf-inner", codeRefs["merkle-leaf-inner"])} />
      </div>
      <ExplainedFormula question="같은 SHA-256을 쓰면서 leaf와 inner node를 어떻게 서로 다른 영역으로 나누는가?" idea={<>Input 앞의 한 byte를 type tag로 쓰면 leaf payload와 child-hash pair가 같은 byte string으로 해석되지 않습니다. Root는 leaf 순서와 tree shape까지 commitment합니다.</>} formula={String.raw`H_{leaf}(x)=\operatorname{SHA256}(0x00\,\|\,x),\qquad H_{inner}(L,R)=\operatorname{SHA256}(0x01\,\|\,L\,\|\,R)`} terms={[{symbol:"x",name:"leaf bytes",description:"상위 type이 canonical encoding한 하나의 item입니다."},{symbol:"L,R",name:"child hashes",description:"왼쪽·오른쪽 subtree의 32-byte roots입니다."},{symbol:"0x00,0x01",name:"domain prefixes",description:"Leaf와 inner node를 다른 input domain으로 구분합니다."},{symbol:String.raw`\|`,name:"concatenation",description:"Bytes를 순서대로 연결합니다."}]} assumptions={["SHA-256 collision resistance를 전제합니다.","Leaf encoding과 item order가 먼저 canonical해야 합니다.","Proof verifier는 index·total·aunt order와 root length를 검사해야 합니다.","Commitment는 confidentiality나 application validity를 제공하지 않습니다."]} interpretation="x의 한 byte라도 바뀌거나 path의 왼쪽·오른쪽 순서를 바꾸면 root가 달라져야 합니다. Root가 같다고 x의 의미가 유효하거나 숨겨진다고 읽으면 안 됩니다." />
      <HashCommitmentViz />
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="Proof.Verify()" onClick={() => sidebar.open("merkle-verify", codeRefs["merkle-verify"])} />
      </div>
      <div id="paper-cometbft-merkle-v040"><CitationBlock source="CometBFT v0.40.0 — crypto/merkle" citeKey={2} type="code" href="https://github.com/cometbft/cometbft/tree/v0.40.0/crypto/merkle"><p><strong>문제:</strong> Ordered byte slices를 compact root와 inclusion proof로 commitment합니다.</p><p><strong>기여:</strong> Prefix hash, split-point tree construction과 proof verification invariant를 구현합니다.</p><p><strong>전제:</strong> v0.40.0 Merkle encoding, exact item order와 trusted expected root를 사용합니다.</p><p><strong>근거 범위:</strong> CometBFT simple Merkle root·proof의 구현 semantics입니다.</p><p><strong>말하지 않는 것:</strong> Leaf confidentiality, data availability, business correctness를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="hash" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · TMHash</p><h2 className="mt-2 text-2xl font-bold">32-byte commitment와 20-byte address를 같은 보안 증거로 취급하지 않는다</h2></header>
      <p><code>tmhash.Sum</code>은 32-byte SHA-256 digest를 만들지만 <code>SumTruncated</code>는 앞 20 bytes만 남깁니다. Ed25519 public-key address는 truncated form을 쓰므로 compact lookup identity입니다. Block·header commitment처럼 32-byte digest가 필요한 자리와 address 비교를 섞으면 length mismatch뿐 아니라 충돌 예산도 달라집니다.</p>
      <div className="not-prose flex flex-wrap gap-3">
        <CodeViewButton label="Sum() · SumTruncated()" onClick={() => sidebar.open("tmhash-sum", codeRefs["tmhash-sum"])} />
      </div>
      <p>실제 검증은 ① expected length ② canonical bytes ③ hash/root ④ signature·proof ⑤ higher-level type invariant 순서로 합니다. Address나 root를 log string만으로 비교하지 말고 chain ID, height, validator key type, exact bytes와 source release를 함께 남겨야 replay fixture가 됩니다.</p>
      <div id="paper-cometbft-tmhash-v040"><CitationBlock source="CometBFT v0.40.0 — crypto/tmhash/hash.go" citeKey={3} type="code" href="https://github.com/cometbft/cometbft/blob/v0.40.0/crypto/tmhash/hash.go"><p><strong>문제:</strong> Full SHA-256 hash와 compact address hash를 분리합니다.</p><p><strong>기여:</strong> 32-byte Sum과 20-byte SumTruncated API를 구분합니다.</p><p><strong>전제:</strong> Caller가 field별 expected length와 encoding을 알고 사용합니다.</p><p><strong>근거 범위:</strong> v0.40.0 digest·address byte length입니다.</p><p><strong>말하지 않는 것:</strong> Truncated address를 256-bit commitment와 같은 충돌 저항으로 보장하지 않습니다.</p></CitationBlock></div>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>기초 6문제는 validator/user key 경계, fixed length, canonical bytes, prefix Merkle, proof과 32/20-byte hash를 확인합니다. 심화 4문제는 replay-domain omission, malformed proof, address/hash 혼동과 batch-verification release gate를 설계하게 합니다.</p>
    </section>
  </article>
  <CodeSidebar
    codeRefKey={sidebar.codeRefKey}
    codeRef={sidebar.codeRef}
    onClose={sidebar.close}
    onNavigate={sidebar.navigate}
    codeRefs={codeRefs}
    fileTrees={{ cometbft: cometbftCryptoTree }}
    projectMetas={{
      cometbft: {
        id: "cometbft",
        label: "CometBFT · Go",
        badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
      },
    }}
  />
  </>;
}
