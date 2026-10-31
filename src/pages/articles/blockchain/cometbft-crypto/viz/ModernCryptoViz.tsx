import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "T1 bytes",
  "TxHash",
  "Leaf 구분",
  "DataHash",
  "Header hash",
  "Vote bytes",
  "서명 검증",
  "Proof 검증",
  "결론 분리",
] as const;

type EvidenceKey = "tx" | "tree" | "header" | "vote" | "identity" | "proof" | "receipt";

const STATES: readonly {
  call: string;
  owner: string;
  tx: string;
  tree: string;
  header: string;
  vote: string;
  identity: string;
  proof: string;
  receipt: string;
  changed: readonly EvidenceKey[];
}[] = [
  {
    call: "Application → CometBFT Tx bytes",
    owner: "Block.Data.Txs",
    tx: "T1 = 61 6c … 31 30 · alice>bob:10",
    tree: "T1 · T2 · T3 순서 고정 전",
    header: "DataHash 미계산",
    vote: "A의 precommit 미서명",
    identity: "validator A public key 보존",
    proof: "T1 proof 미생성",
    receipt: "bytes를 받았을 뿐 의미·포함·승인 모두 미확인",
    changed: ["tx"],
  },
  {
    call: "Tx.Hash → tmhash.Sum",
    owner: "types.Tx",
    tx: "H1 = 5c41bd…4a06 · 32 bytes",
    tree: "H1 · H2 · H3 ordered leaves 입력",
    header: "DataHash 미계산",
    vote: "A의 precommit 미서명",
    identity: "20-byte address는 아직 lookup에만 사용",
    proof: "T1 proof 미생성",
    receipt: "T1 한 byte가 바뀌면 H1이 달라짐",
    changed: ["tx"],
  },
  {
    call: "leafHash(0x00 || H_i)",
    owner: "crypto/merkle",
    tx: "H1 = 5c41bd…4a06",
    tree: "L1=642302…60e2 · L2=11920b…cde7 · L3=9a81e6…6f8d",
    header: "DataHash 미계산",
    vote: "A의 precommit 미서명",
    identity: "full hashes는 모두 32 bytes",
    proof: "T1 path의 첫 sibling은 L2",
    receipt: "0x00이 leaf와 inner node의 입력 영역을 구분",
    changed: ["tree"],
  },
  {
    call: "innerHash(0x01 || left || right)",
    owner: "types.Txs.Hash",
    tx: "T1 · T2 · T3 순서 유지",
    tree: "P12=f26d10…55cf → D41=8b7610…f65f",
    header: "Header.DataHash = D41",
    vote: "A의 precommit 미서명",
    identity: "DataHash = 32 bytes",
    proof: "T1 path = [L2, L3]",
    receipt: "ordered transaction 목록을 32-byte D41로 commitment",
    changed: ["tree", "header", "proof"],
  },
  {
    call: "Header.Hash",
    owner: "types.Header",
    tx: "D41이 T1·T2·T3를 commitment",
    tree: "Header field 중 DataHash = D41",
    header: "HB41 = Merkle(Header fields) · BlockID.Hash",
    vote: "vote.BlockID.Hash = HB41",
    identity: "ProposerAddress도 별도 20-byte field",
    proof: "T1 proof의 expected root는 D41",
    receipt: "T1 root와 합의가 서명하는 block identity를 연결",
    changed: ["header", "vote"],
  },
  {
    call: "CanonicalizeVote → MarshalDelimited",
    owner: "types.VoteSignBytes",
    tx: "T1 bytes는 vote sign bytes에 직접 들어가지 않음",
    tree: "D41은 HB41을 통해 간접 연결",
    header: "BlockID = HB41 + PartSetHeader",
    vote: "PRECOMMIT · h41 · r0 · HB41 · demo-1",
    identity: "ValidatorAddress·Index는 canonical vote에서 제외",
    proof: "T1 proof는 vote와 별도 검증 경로",
    receipt: "Signer와 verifier가 같은 exact bytes를 사용",
    changed: ["vote"],
  },
  {
    call: "Vote.Verify → Ed25519.VerifySignature",
    owner: "validator set public key A",
    tx: "T1 업무 규칙은 아직 application 검증 대상",
    tree: "D41 자체를 A가 따로 서명한 것은 아님",
    header: "A가 HB41을 가리키는 canonical vote에 서명",
    vote: "signature 64B 검증 성공",
    identity: "SHA256(pubA)[:20] = vote.ValidatorAddress",
    proof: "포함 증명은 아직 별도 확인",
    receipt: "A의 key가 demo-1/h41/r0/HB41 precommit을 승인",
    changed: ["vote", "identity", "receipt"],
  },
  {
    call: "TxProof.Validate(D41)",
    owner: "types.TxProof · crypto/merkle.Proof",
    tx: "T1 bytes → H1 → L1 재계산",
    tree: "L1 + aunt L2 → P12; P12 + aunt L3 → D41",
    header: "proof.RootHash = Header.DataHash = D41",
    vote: "A의 signature receipt는 그대로 유지",
    identity: "proof index=0 · total=3",
    proof: "aunts=[L2,L3] · root 일치",
    receipt: "제공된 T1 bytes가 B41의 ordered DataHash에 포함",
    changed: ["tx", "tree", "header", "proof", "receipt"],
  },
  {
    call: "Evidence 결합",
    owner: "Commit verifier + TxProof verifier + Application",
    tx: "T1 = alice>bob:10",
    tree: "T1 ∈ ordered DataHash D41",
    header: "D41 ∈ Header HB41",
    vote: "A+B 75/100 Commit이 HB41을 확정했다는 전제",
    identity: "20B address는 lookup · 32B key는 signature 검증",
    proof: "포함 성공 ≠ transaction 실행 성공",
    receipt: "B41에 T1 포함은 확인 · Alice 잔액 규칙은 application이 판단",
    changed: ["tx", "tree", "header", "vote", "identity", "proof", "receipt"],
  },
] as const;

const NOTES = [
  "CometBFT에서 Tx는 의미가 없는 byte array입니다. alice>bob:10이라는 해석은 이 글의 fixture이고 실제 authorization과 잔액 검사는 application이 소유합니다.",
  "Transaction identifier는 SHA-256(raw tx bytes)입니다. 이 32-byte H1이 Merkle tree의 item이 되며 raw transaction이 바로 prefix leaf에 들어가는 것은 아닙니다.",
  "Merkle leaf는 다시 SHA-256(0x00 || H1)로 계산합니다. 0x00과 inner node의 0x01을 분리해야 같은 byte string을 서로 다른 tree 구조로 해석하는 일을 막을 수 있습니다.",
  "세 leaves는 [L1,L2]와 [L3]로 갈라집니다. 먼저 P12를 만들고 P12를 L3와 결합해 D41을 얻습니다. 순서가 바뀌면 root도 바뀝니다.",
  "Header.Hash는 DataHash를 포함한 header fields를 다시 Merkle root로 묶습니다. Validator는 T1을 직접 서명하는 대신 D41을 품은 HB41의 BlockID에 precommit합니다.",
  "Canonical vote는 validator별 lookup field를 빼고 합의 좌표와 chain ID를 고정합니다. Chain ID나 round가 달라지면 같은 signature를 다른 vote에 재사용할 수 없습니다.",
  "20-byte address 일치는 올바른 public key를 찾았는지 확인하는 첫 단계입니다. 실제 승인은 32-byte public key와 64-byte signature로 exact canonical bytes를 검증해야 확인됩니다.",
  "T1 proof는 전달받은 LeafHash를 그대로 믿지 않습니다. T1 bytes에서 H1과 L1을 다시 만들고 index·total이 정한 왼쪽·오른쪽 순서로 D41을 복원합니다.",
  "Commit이 HB41을 신뢰할 block으로 만들고 proof가 T1을 HB41의 DataHash에 연결합니다. 둘을 통과해도 T1의 서명·잔액·업무 규칙과 실제 execution 결과는 application 검증이 필요합니다.",
] as const;

function EvidenceCell({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`min-w-0 border px-2.5 py-2 transition-colors duration-300 motion-reduce:transition-none ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="block text-[8px] font-black text-muted-foreground sm:text-[9px]">{label}</span>
      <strong className="mt-1 block break-keep text-[9px] leading-4 sm:text-[11px] sm:leading-5">{value}</strong>
    </div>
  );
}

export function CryptoEvidenceTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7200, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];
  const active = (key: EvidenceKey) => state.changed.includes(key);

  useEffect(() => {
    const scroller = tabsRef.current;
    const selected = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !selected) return;
    const left = selected.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - selected.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="CometBFT v0.40.0 · 증거 한 묶음"
      title="B41의 validator 서명과 T1 포함 증명을 서로 다른 경로로 검증합니다"
      description="T1 bytes가 DataHash와 Header를 거쳐 BlockID에 연결되는 경로와, validator가 그 BlockID에 서명하는 경로를 함께 추적합니다."
      note="Hash·proof·signature 순서는 content commit 0880b4d3의 types/tx.go, types/vote.go와 crypto 구현에 맞췄습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div id={scenes.playbackId} data-viz-live-only data-cometbft-crypto-scene={scenes.active} tabIndex={0} role="group" aria-label="B41의 transaction inclusion과 validator vote 검증을 아홉 장면으로 추적" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-9 gap-px bg-border p-px" style={{ width: "max(100%, 720px)" }}>
              {SCENES.map((label, index) => (
                <button key={label} type="button" aria-pressed={index === scenes.active} onClick={() => scenes.setActive(index)} className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[8px] leading-3">{label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-[31rem] border-y border-border py-3 sm:min-h-[32rem] sm:py-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="transaction commitment path">
                <span className="text-[9px] font-black text-muted-foreground">TRANSACTION PATH</span>
                <div className="mt-2 grid gap-1.5">
                  <EvidenceCell label="T1 BYTES · TX HASH" value={state.tx} active={active("tx")} />
                  <EvidenceCell label="MERKLE TREE" value={state.tree} active={active("tree")} />
                  <EvidenceCell label="HEADER · BLOCK ID" value={state.header} active={active("header")} />
                  <EvidenceCell label="TX PROOF" value={state.proof} active={active("proof")} />
                </div>
              </section>

              <section className="border border-border bg-background p-2.5 sm:p-3" aria-label="validator approval path">
                <span className="text-[9px] font-black text-muted-foreground">VALIDATOR PATH</span>
                <div className="mt-2 grid gap-1.5">
                  <EvidenceCell label="CANONICAL VOTE" value={state.vote} active={active("vote")} />
                  <EvidenceCell label="KEY · ADDRESS" value={state.identity} active={active("identity")} />
                  <div className={`min-h-[8.25rem] border p-2.5 transition-colors duration-300 motion-reduce:transition-none ${active("receipt") ? "border-primary bg-primary/10" : "border-dashed border-border"}`}>
                    <span className="text-[8px] font-black text-muted-foreground sm:text-[9px]">CURRENT RECEIPT</span>
                    <p className="mt-2 break-keep text-[9px] font-bold leading-5 sm:text-xs sm:leading-6">{state.receipt}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-3 grid grid-cols-[5.25rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[8px] font-bold text-muted-foreground sm:text-[9px]">현재 호출</div>
              <div className="min-w-0 bg-background p-3 text-[9px] font-bold leading-5 sm:text-xs">{state.call} · {state.owner}</div>
            </div>
            <p data-scene-note className="mt-3 min-h-[5rem] border-l-2 border-primary/50 pl-3 text-[9px] leading-5 text-muted-foreground sm:min-h-[6rem] sm:text-sm sm:leading-6">{NOTES[scenes.active]}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="Crypto 검증 단계 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

const EVIDENCE_ROWS = [
  ["A의 Ed25519 signature", "A가 exact canonical vote bytes를 승인", "A 혼자 quorum·block 포함·transaction 유효성을 증명하지 않음"],
  ["A+B의 Commit", "신뢰한 validator set 기준 HB41에 2/3 초과 power", "T1 bytes를 직접 제공하거나 실행 결과를 증명하지 않음"],
  ["T1 Merkle proof + D41", "T1이 ordered transaction root D41에 포함", "D41이 신뢰할 block의 field인지는 별도 확인이 필요"],
  ["Header HB41 + Commit + proof", "확정된 B41의 DataHash에 T1이 포함", "Alice authorization·잔액·application 성공을 보장하지 않음"],
] as const;

export function CryptoEvidenceBoundaryViz() {
  return (
    <figure data-viz="cometbft-crypto-evidence-boundary" className="not-prose my-8 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">증거마다 확인하는 질문이 다릅니다</p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">성공한 검증을 합치기 전에 각 receipt가 보장하지 않는 범위를 먼저 확인합니다.</p>
      </figcaption>
      <div data-viz-canvas className="mt-5 grid gap-px bg-border p-px">
        <div className="hidden grid-cols-[12rem_minmax(0,1fr)_minmax(0,1.25fr)] gap-px bg-border text-[10px] font-black text-muted-foreground sm:grid">
          <span className="bg-background p-3">검증한 증거</span><span className="bg-background p-3">확인한 사실</span><span className="bg-background p-3">아직 확인하지 못한 사실</span>
        </div>
        {EVIDENCE_ROWS.map(([evidence, proves, limit]) => (
          <div key={evidence} className="grid gap-px bg-border sm:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1.25fr)]">
            <strong className="bg-background p-3 text-[10px] leading-5 text-primary sm:text-xs">{evidence}</strong>
            <span className="bg-background p-3 text-[10px] font-bold leading-5 sm:text-xs">{proves}</span>
            <span className="bg-background p-3 text-[10px] leading-5 text-muted-foreground sm:text-xs">{limit}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
