import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "Domain", "Point", "서명", "검증", "Aggregate", "Batch", "경계"] as const;

const NOTES = [
  "직전 SSZ 글의 object root가 BLS에 곧바로 들어가지는 않습니다. Consensus domain과 다시 SSZ로 묶은 signing root를 만든 뒤 public key와 signature의 pairing 관계를 확인합니다.",
  "설명용 object root 9dfd…32cc와 32-byte zero domain을 SigningData에 넣으면 SHA-256 기반 SSZ root는 740450ab…05ae86입니다. Zero domain은 계산을 보여주기 위한 값이며 실제 duty domain이 아닙니다.",
  "Compressed public key 48 bytes와 signature 96 bytes는 길이만 맞는다고 point가 되지 않습니다. Canonical decode, curve·subgroup과 key의 non-infinity 검사를 통과해야 BLST 연산에 들어갑니다.",
  "설명용 secret scalar 42는 G1 public key를 만들고, POP ciphersuite DST로 signing root를 G2 point에 옮긴 뒤 같은 scalar를 곱해 96-byte signature를 만듭니다.",
  "Verifier는 secret scalar를 복구하지 않습니다. e(G1, signature)와 e(public key, H(signing root))가 같은지 비교해 key·message·signature 관계를 판정합니다.",
  "여러 validator가 정확히 같은 signing root에 서명했다면 signature와 public key를 각각 더해 FastAggregateVerify 경로로 검사할 수 있습니다. 참여자 목록이나 aggregation bits는 별도로 남습니다.",
  "서로 다른 signing root의 독립 signature들을 함께 검사할 때 Prysm은 각 식에 예측하기 어려운 nonzero scalar를 곱하는 MultipleAggregateVerify 경로를 사용합니다. 실패는 어느 item이 틀렸는지 알려주지 않습니다.",
  "Prysm의 verbose fallback은 batch가 실패하면 각 signature를 다시 검사해 invalid item을 찾습니다. BLS PASS는 서명 관계만 증명하며 state transition, fork choice와 slashing 안전성은 다음 계층의 일입니다.",
] as const;

const RECEIPTS = [
  "object root → signing root → point 검사 → pairing → aggregate 또는 batch",
  "H(9dfd…32cc || 00…00) = 740450ab…05ae86",
  "public key 48 B · signature 96 B · decode 뒤 group validation",
  "sk 42 · pk 8ce3…9c48 · sig b6bd…e728",
  "same key + same signing root + same signature 관계 = PASS",
  "같은 signing root · N signatures → aggregate signature 96 B",
  "서로 다른 signing roots · random coefficient 64-bit entropy",
  "batch FAIL → 개별 Verify · BLS PASS ≠ consensus PASS",
] as const;

function Cell({ active, label, value, detail }: { active: boolean; label: string; value: string; detail: string }) {
  return (
    <div className={`min-w-0 bg-background p-2.5 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="block break-keep text-[8px] font-bold leading-3 text-muted-foreground sm:text-[10px]">{label}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-4 sm:text-sm sm:leading-5">{value}</strong>
      <span className="mt-1 block break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</span>
    </div>
  );
}

export default function PrysmBlsFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · 한 signing root"
      title="Object Root를 서명으로 검증한 뒤 두 묶기 경로로 나눕니다"
      description="SSZ 글의 root 하나를 domain, point validation, sign·verify, 같은-message aggregate와 서로 다른-message batch까지 계속 따라갑니다."
      note="Secret scalar 42와 zero domain은 계산을 재현하기 위한 설명용 fixture입니다. Mainnet validator key나 실제 duty domain이 아니며 대상 환경 성능도 나타내지 않습니다."
      canvasClassName="px-2 py-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-bls-scene={active}
        tabIndex={0}
        role="group"
        aria-label="하나의 object root가 BLS signing root와 signature 검증을 거쳐 aggregate와 batch로 갈라지는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-8 gap-px bg-border p-px" aria-label="Prysm BLS의 여덟 장면">
          {SCENES.map((scene, index) => (
            <div key={scene} className={`min-w-0 bg-background px-0.5 py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-px bg-border p-px sm:mt-3" aria-label="SigningData가 object root와 domain을 묶는 과정">
          <Cell active={active === 1} label="SSZ object root" value="9dfd6779…410832cc" detail="직전 글의 DemoRecord root · 32 B" />
          <Cell active={active === 1} label="설명용 consensus domain" value="00000000…00000000" detail="실제 duty domain이 아닌 zero fixture · 32 B" />
          <div className={`col-span-2 min-w-0 bg-background p-2.5 sm:p-3 ${active === 1 || active === 3 || active === 4 ? "ring-2 ring-inset ring-primary" : ""}`}>
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">SigningData hash-tree-root</span>
            <code className="mt-1 block break-all text-[10px] font-bold leading-5 text-primary sm:text-xs">740450ab9681b33c9130b6c2e66a16888eb6d8d4f6f0f433009571b1e405ae86</code>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3" aria-label="BLS key와 signature의 point validation 경계">
          <Cell active={active === 2 || active === 3} label="Secret scalar" value="42" detail="설명용 private input · wire에 없음" />
          <Cell active={active === 2 || active === 3 || active === 4} label="Public key" value="8ce3…9c48" detail="Compressed G1 · 48 B" />
          <div className="min-w-0">
            <Cell active={active === 2 || active === 3 || active === 4} label="Signature" value="b6bd…e728" detail="Compressed G2 · 96 B" />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3" aria-label="단일 검증과 두 가지 묶기 경로">
          <Cell active={active === 4} label="Single Verify" value="1 key · 1 root · 1 sig" detail="Pairing relation → PASS 또는 FAIL" />
          <Cell active={active === 5} label="FastAggregateVerify" value="N keys · 같은 root · 1 agg sig" detail="서명 point를 더해도 signature는 96 B" />
          <Cell active={active === 6 || active === 7} label="MultipleAggregateVerify" value="N keys · N roots · N sigs" detail="무작위 가중 batch · 실패 item은 별도 확인" />
        </div>

        <div className="mt-2 grid grid-cols-[0.62fr_1.38fr] gap-px bg-border p-px sm:mt-3">
          <div className="min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">검증 영수증</span>
            <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-1 min-h-[5.75rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-24 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["전체", "Domain", "Point", "서명", "검증", "Aggregate", "Batch", "경계"]}
          playLabel="재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
