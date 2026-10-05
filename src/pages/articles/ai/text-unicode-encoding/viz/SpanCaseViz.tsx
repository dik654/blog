import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
const labels=["원문 가","NFC 가","옛 범위 재사용"];
const cases=[
{bytes:["41","65","CC","81","EA","B0","80","F0","9F","98","80"],span:[4,7],title:"원문 · 가",detail:"원문의 가는 UTF-8 byte 범위 [4,7)입니다. 강조한 EA B0 80은 유효한 가의 저장값입니다."},
{bytes:["41","C3","A9","EA","B0","80","F0","9F","98","80"],span:[3,6],title:"NFC · 같은 가",detail:"NFC 후에는 앞부분이 한 byte 줄었습니다. 같은 가의 범위는 [3,6)이며 강조한 값은 여전히 EA B0 80입니다."},
{bytes:["41","C3","A9","EA","B0","80","F0","9F","98","80"],span:[4,7],title:"NFC · 옛 범위",detail:"NFC에 원문의 [4,7)을 그대로 적용하면 B0 80 F0을 읽습니다. 가의 중간에서 시작해 다음 그림의 첫 byte까지 섞인 유효하지 않은 조각입니다."}
];
export default function SpanCaseViz(){const a=useAnimatedScenes(3);const c=cases[a.active];return <VizFrame eyebrow="같은 가의 위치 대응" title="내용은 같아도 시작 위치는 이동합니다" description="강조한 칸의 실제 저장값을 함께 확인합니다." note="범위는 0부터 세며 시작을 포함하고 끝을 제외합니다.">
<div data-viz-canvas tabIndex={0} role="group" aria-label="원문과 NFC의 byte 범위" onKeyDown={a.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<svg viewBox="0 0 320 272" className="mx-auto block w-full max-w-[460px]" role="img" aria-label={c.detail}>
<text x="160" y="25" textAnchor="middle" fontSize="18" fill="currentColor">{c.title}</text>
{c.bytes.map((v,i)=>{const x=8+(i%6)*52,y=55+Math.floor(i/6)*78;return <g key={i}><rect x={x} y={y} width="44" height="43" rx="4" fill="currentColor" fillOpacity={i>=c.span[0]&&i<c.span[1]?.2:.025} stroke="currentColor"/><text x={x+22} y={y+27} textAnchor="middle" fontSize="17" fill="currentColor">{v}</text><text x={x+22} y={y+62} textAnchor="middle" fontSize="13" fill="currentColor">{i}</text></g>;})}
<text x="160" y="226" textAnchor="middle" fontSize="20" fill="currentColor">[{c.span[0]},{c.span[1]}) → {c.bytes.slice(c.span[0],c.span[1]).join(" ")}</text>
<text x="160" y="258" textAnchor="middle" fontSize="17" fill="currentColor">{a.active===2?"경계가 맞지 않습니다":"같은 가를 읽었습니다"}</text>
</svg><p aria-live="polite" className="min-h-[10rem] text-sm leading-7">{c.detail}</p><AnimatedSceneControls {...a} labels={labels}/></div></VizFrame>;}
