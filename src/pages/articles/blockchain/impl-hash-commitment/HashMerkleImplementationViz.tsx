import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { useEffect, useRef } from "react";

const SCENES = [
  "검증 요청", "leaf 입력", "leaf hash", "첫 형제", "첫 부모", "둘째 형제", "root 계산", "root 비교",
] as const;
const SHORT = ["요청", "입력", "leaf", "형제 0", "부모", "형제 1", "root", "판정"] as const;
const NOTES = [
  "검증자는 data='c', index=2, sibling 두 개와 expected root를 받습니다. 아직 c가 tree에 있다는 결론은 나지 않았습니다.",
  "Leaf schema는 00 || u32be(length) || data입니다. c는 00 00000001 63이 되어 raw data와 inner node 입력을 구분합니다.",
  "SHA-256 leaf digest는 aa8d78cb…1beb22e입니다. 이 값은 index 2의 현재 hash가 됩니다.",
  "index 2의 낮은 bit는 0입니다. current가 left, sibling leaf d의 dd761f8d…b20219가 right에 놓입니다.",
  "01 || H(c) || H(d)를 hash해 오른쪽 subtree 3d1f97dd…ae1334를 만듭니다. Inner prefix 01은 leaf prefix 00과 다릅니다.",
  "index를 한 bit 오른쪽으로 옮기면 1입니다. sibling subtree H(a,b)가 left, 현재 H(c,d)가 right에 놓입니다.",
  "01 || H(a,b) || H(c,d)를 hash하면 004b7b71…55d9c3이 됩니다. 이것이 proof가 다시 계산한 root입니다.",
  "계산한 root와 expected root가 byte 단위로 같으므로 index 2의 c가 이 tree schema에 포함됐다는 검증이 통과합니다.",
] as const;

const NODES = [
  ["REQUEST", "c · index 2"], ["LEAF PREIMAGE", "00·00000001·63"],
  ["LEAF HASH", "aa8d78cb…"], ["LEVEL 0", "bit 0 · current left"],
  ["H(c,d)", "3d1f97dd…"], ["LEVEL 1", "bit 1 · current right"],
  ["COMPUTED ROOT", "004b7b71…"], ["VERDICT", "match · true"],
] as const;
const STATE = [
  ["현재 값", "raw c", "index", "2 (10₂)", "신뢰 상태", "검사 전"],
  ["현재 값", "typed leaf input", "prefix", "00", "길이", "1 byte"],
  ["현재 값", "leaf digest", "현재 hash", "aa8d78cb…", "남은 형제", "2개"],
  ["현재 위치", "level 0 left", "형제", "H(d)", "다음 연산", "inner hash"],
  ["현재 값", "subtree digest", "현재 hash", "3d1f97dd…", "남은 형제", "1개"],
  ["현재 위치", "level 1 right", "형제", "H(a,b)", "다음 연산", "root hash"],
  ["현재 값", "computed root", "현재 hash", "004b7b71…", "다음 조건", "expected와 비교"],
  ["판정", "포함됨", "computed", "expected와 같음", "schema", "v1"],
] as const;

function TraceMap({ active }: { active: number }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = scrollerRef.current;
    const target = scroller?.querySelector<HTMLElement>(`[data-hash-node="${active}"]`);
    if (!scroller || !target) return;
    const targetLeft =
      target.getBoundingClientRect().left -
      scroller.getBoundingClientRect().left +
      scroller.scrollLeft;
    scroller.scrollTo({
      left: targetLeft - (scroller.clientWidth - target.offsetWidth) / 2,
      behavior: "auto",
    });
  }, [active]);
  return <div aria-label="c의 leaf 입력부터 Merkle root 비교까지 이어지는 검증 경로">
    <div ref={scrollerRef} className="overflow-x-auto"><div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 800px)" }}>
      {NODES.map(([name,value],index)=><div key={name} data-hash-node={index} className={`relative min-w-0 bg-background px-2 py-3 sm:min-h-24 ${index===active?"ring-2 ring-inset ring-primary":index<active?"opacity-75":"opacity-35"}`}><div className="flex items-start justify-between gap-2"><span className="font-mono text-[8px] font-black text-primary">{name}</span><span className="font-mono text-[8px] text-muted-foreground">{String(index+1).padStart(2,"0")}</span></div><strong className="mt-3 block break-keep text-center font-mono text-[10px] leading-5 sm:text-xs">{value}</strong>{index<NODES.length-1?<span aria-hidden className="absolute -right-1 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-primary bg-background"/>:null}</div>)}
    </div></div>
    <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">{[0,1,2].map(index=><div key={STATE[active][index*2]} className="min-w-0 bg-background px-2 py-3"><span className="block break-keep text-muted-foreground">{STATE[active][index*2]}</span><strong className="mt-1 block break-keep text-primary">{STATE[active][index*2+1]}</strong></div>)}</div>
  </div>;
}

export default function HashMerkleImplementationViz() {
  const scenes=useAnimatedScenes(SCENES.length,4700,{loop:false});
  const tabsRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const scroller=tabsRef.current;const target=scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');if(!scroller||!target)return;const targetLeft=target.getBoundingClientRect().left-scroller.getBoundingClientRect().left+scroller.scrollLeft;scroller.scrollTo({left:targetLeft-(scroller.clientWidth-target.offsetWidth)/2,behavior:"auto"});},[scenes.active]);
  return <VizFrame eyebrow="한 leaf의 전체 검증 경로 · SHA-256 tree v1" title="index 2의 c는 두 형제와 두 index bit를 거쳐 root로 올라갑니다" description="같은 sibling 목록이라도 leaf 입력 schema와 좌우 순서가 다르면 다른 root가 됩니다." note="수치는 Node.js crypto의 SHA-256으로 독립 계산했습니다. Prefix 00·01과 u32be 길이는 이 글의 설명용 tree v1 schema입니다." canvasClassName="p-1.5 sm:p-5" documentFlow>
    <div id={scenes.playbackId} data-viz-live-only data-hash-scene={scenes.active} tabIndex={0} role="group" aria-label="Merkle proof를 여덟 장면으로 추적" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
      <div data-viz-scene-stage><div ref={tabsRef} className="overflow-x-auto"><div className="grid grid-cols-8 gap-px bg-border p-px" style={{width:"max(100%,620px)"}}>{SCENES.map((scene,index)=><button type="button" key={scene} aria-pressed={index===scenes.active} onClick={()=>scenes.setActive(index)} className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:py-2 ${index===scenes.active?"text-primary":index<scenes.active?"text-foreground":"text-muted-foreground"}`}><span className="block font-mono text-[8px] font-black">{String(index+1).padStart(2,"0")}</span><strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{SHORT[index]}</strong><strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong></button>)}</div></div><div className="mt-2 sm:mt-3"><TraceMap active={scenes.active}/></div><p data-scene-note className="mt-2 min-h-[8rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[5.5rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[scenes.active]}</p></div>
      <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="Merkle 경로 재생" compact/>
    </div><StaticSceneList labels={SCENES} notes={NOTES}/>
  </VizFrame>;
}

export function HashBoundaryViz(){return <VizFrame eyebrow="같은 bytes, 다른 API 모양" title="한 번에 넣어도 a와 bc로 나눠 넣어도 SHA-256의 message는 abc입니다" description="update 호출 경계는 전송 단위일 뿐 digest에 포함되는 message metadata가 아닙니다." note="SHA-256('abc')의 known digest는 FIPS 180-4 예제와 일치하는 ba7816bf…15ad입니다." canvasClassName="p-2 sm:p-5"><div className="grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr]"><div className="bg-background p-4 text-center"><span className="font-mono text-[9px] font-black text-primary">ONE SHOT</span><strong className="mt-2 block font-mono">abc</strong></div><span aria-hidden className="hidden items-center bg-background px-3 text-primary sm:flex">→</span><div className="bg-background p-4 text-center"><span className="font-mono text-[9px] font-black text-primary">STREAM</span><strong className="mt-2 block font-mono">a · bc</strong></div><span aria-hidden className="hidden items-center bg-background px-3 text-primary sm:flex">→</span><div className="bg-background p-4 text-center ring-2 ring-inset ring-primary"><span className="font-mono text-[9px] font-black text-primary">SAME DIGEST</span><strong className="mt-2 block font-mono text-xs">ba7816bf…15ad</strong></div></div></VizFrame>}

export function PoseidonEncodingViz(){const rows=[["01","tag · 1 · 1","길이 1"],["01 00","tag · 2 · 1","길이 2"]] as const;return <VizFrame eyebrow="Bytes에서 field elements로" title="정수 값 1이 같아도 길이 1과 길이 2는 다른 Poseidon 입력이어야 합니다" description="Raw little-endian 정수만 흡수하지 않고 용도 tag와 byte 길이를 별도 field element로 보존합니다." note="Packing schema는 Poseidon permutation 자체가 정하지 않습니다. Protocol이 chunk 폭·endianness·length·domain tag를 고정해야 합니다." canvasClassName="p-2 sm:p-5"><div className="grid gap-px bg-border p-px sm:grid-cols-2">{rows.map(([bytes,fields,meaning])=><div key={bytes} className="bg-background p-4"><span className="font-mono text-[9px] font-black text-primary">BYTES · {bytes}</span><strong className="mt-3 block break-keep font-mono text-sm">[{fields}]</strong><p className="mt-2 text-xs text-muted-foreground">{meaning} · field sequence가 다름</p></div>)}</div><div className="mt-3 grid gap-px bg-border p-px text-center text-xs sm:grid-cols-3"><div className="bg-background p-3"><strong>tag</strong><p className="mt-1 text-muted-foreground">용도 분리</p></div><div className="bg-background p-3"><strong>length</strong><p className="mt-1 text-muted-foreground">trailing zero 보존</p></div><div className="bg-background p-3"><strong>chunk</strong><p className="mt-1 text-muted-foreground">canonical field 값</p></div></div></VizFrame>}
