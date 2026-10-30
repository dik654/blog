import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "Schema", "바이트", "검사", "Chunk", "Root", "Proof", "경계"] as const;

const NOTES = [
  "하나의 typed value에서 두 출력이 갈라집니다. Serialization은 전송·저장할 32 bytes를 만들고, hash-tree-root는 같은 값의 32-byte commitment를 만듭니다. Proof는 그 root 안의 validators field를 가리킵니다.",
  "DemoRecord는 slot:uint64, validators:List[uint64,4], epoch:uint32 순서입니다. Schema가 field 순서, 고정·가변 구분과 list limit을 정하므로 payload에 type 이름을 반복해 넣지 않습니다.",
  "Fixed part는 slot 8 bytes, validators offset 4 bytes, epoch 4 bytes로 총 16 bytes입니다. Offset 16 뒤 variable part에 10과 20을 각각 uint64 little-endian으로 붙여 전체 32 bytes가 됩니다.",
  "Decoder는 offset 16이 fixed part보다 작지 않고 payload 끝을 넘지 않는지 먼저 봅니다. 남은 16 bytes가 uint64 폭 8의 배수이고 list limit 4를 넘지 않아야 값을 할당합니다.",
  "slot과 epoch는 각각 32-byte chunk 하나가 됩니다. Validators 10과 20은 16 bytes라 한 data chunk에 함께 pack되고, 실제 길이 2는 별도 length chunk가 됩니다.",
  "Validators root는 H(data chunk || length chunk)입니다. Container field root 셋을 폭 4의 tree에 놓고 빈 네 번째 leaf를 zero로 채우면 최종 root는 9dfd…32cc가 됩니다.",
  "Container의 두 번째 field validators는 gindex 5=101₂입니다. Leaf에서 root까지 sibling 두 개, 즉 slot root와 오른쪽 subtree root 64 bytes로 포함을 검증합니다.",
  "Canonical bytes, root와 proof가 맞아도 signature, state transition, fork-choice나 finalized chain은 아직 검증되지 않았습니다. SSZ는 값의 표현과 commitment 경계만 소유합니다.",
] as const;

const FIELDS = [
  { name: "slot", type: "uint64", value: "1", bytes: "8 B" },
  { name: "validators", type: "List[uint64,4]", value: "[10, 20]", bytes: "offset 4 B" },
  { name: "epoch", type: "uint32", value: "3", bytes: "4 B" },
] as const;

const WIRE = [
  { label: "slot", value: "01 00 … 00", width: "8 B" },
  { label: "offset", value: "10 00 00 00", width: "4 B" },
  { label: "epoch", value: "03 00 00 00", width: "4 B" },
  { label: "validator 10", value: "0a 00 … 00", width: "8 B" },
  { label: "validator 20", value: "14 00 … 00", width: "8 B" },
] as const;

const RECEIPTS = [
  "Typed value → canonical 32 bytes · root 9dfd…32cc · validators proof",
  "Field order 0·1·2 · fixed widths 8·4·4 · validators limit 4",
  "fixed 16 B + variable 16 B = 32 B · validators offset = 16",
  "offset bounds ✓ · 16 mod 8 = 0 ✓ · element count 2 ≤ 4 ✓",
  "validators data chunk 0a…14… · length chunk 02…00",
  "H(H(slot, validators), H(epoch, zero)) = 9dfd…32cc",
  "validators gindex 5 · path 01₂ · sibling payload 2×32 = 64 B",
  "SSZ PASS ≠ signature PASS ≠ state transition PASS ≠ finalized",
] as const;

function StageCard({ active, title, detail }: { active: boolean; title: string; detail: string }) {
  return (
    <div className={`min-w-0 bg-background p-2.5 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : "opacity-40"}`}>
      <strong className="block break-keep text-[10px] leading-4 sm:text-xs">{title}</strong>
      <span className="mt-1 block break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</span>
    </div>
  );
}

export default function PrysmSszFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · 한 typed value"
      title="같은 Schema가 전송 바이트와 검증 가능한 Root를 만듭니다"
      description="DemoRecord {slot:1, validators:[10,20], epoch:3} 하나를 encoding, bounded decode, chunk, root와 field proof까지 계속 따라갑니다."
      note="DemoRecord는 SSZ 구조를 계산하기 위한 설명용 type입니다. Hash 값은 SHA-256으로 직접 계산했으며 protocol object나 대상 환경 측정값이 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-ssz-scene={active}
        tabIndex={0}
        role="group"
        aria-label="하나의 SSZ typed value가 바이트, root와 proof로 변하는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-8 gap-px bg-border p-px" aria-label="SSZ의 여덟 장면">
          {SCENES.map((scene, index) => (
            <div key={scene} className={`min-w-0 bg-background px-0.5 py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px sm:mt-3" aria-label="DemoRecord의 세 field">
          {FIELDS.map((field) => (
            <div key={field.name} className={`min-w-0 bg-background p-2.5 sm:p-3 ${active === 1 ? "ring-2 ring-inset ring-primary" : ""}`}>
              <span className="font-mono text-[8px] font-black text-primary sm:text-[9px]">{field.name}</span>
              <strong className="mt-1 block break-keep text-[9px] leading-4 sm:text-xs">{field.type}</strong>
              <span className="mt-1 block text-[9px] text-muted-foreground sm:text-[10px]">{field.value} · {field.bytes}</span>
            </div>
          ))}
        </div>

        <div className={`mt-2 grid grid-cols-5 gap-px bg-border p-px sm:mt-3 ${active === 2 || active === 3 ? "ring-2 ring-primary" : ""}`} aria-label="32-byte SSZ wire layout">
          {WIRE.map((part) => (
            <div key={part.label} className="min-w-0 bg-background px-1.5 py-2 sm:px-2.5 sm:py-3">
              <span className="block break-keep text-[8px] font-bold text-muted-foreground sm:text-[9px]">{part.label} · {part.width}</span>
              <code className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap text-[8px] text-primary sm:text-[10px]">{part.value}</code>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-4 gap-px bg-border p-px sm:mt-3" aria-label="SSZ chunk와 Merkle tree">
          <StageCard active={active === 4} title="slot root" detail="01…00 · 32 B" />
          <StageCard active={active === 4 || active === 5 || active === 6} title="validators root" detail="H(data · length 2)" />
          <StageCard active={active === 4} title="epoch root" detail="03…00 · 32 B" />
          <StageCard active={active === 5} title="zero leaf" detail="field 3 padding" />
          <StageCard active={active === 5 || active === 6} title="left subtree" detail="H(slot · validators)" />
          <StageCard active={active === 5 || active === 6} title="right subtree" detail="H(epoch · zero)" />
          <div className="col-span-2 min-w-0 bg-background p-2.5 sm:p-3">
            <span className="font-mono text-[8px] font-black text-primary sm:text-[9px]">ROOT · gindex 1</span>
            <strong className={`mt-1 block break-all text-[9px] leading-4 sm:text-xs ${active === 5 || active === 6 ? "text-primary" : "text-foreground"}`}>9dfd6779…410832cc</strong>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-[0.62fr_1.38fr] gap-px bg-border p-px sm:mt-3">
          <div className="min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">계산 영수증</span>
            <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-2 min-h-24 border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["전체", "Schema", "바이트", "검사", "Chunk", "Root", "Proof", "경계"]}
          playLabel="재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
