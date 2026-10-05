import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
const labels=["원문","합친 글","더 풀어 쓴 글"];
const cases=[
{parts:["A","e","◌́","가","😀"],counts:[5,6,11,4],detail:"원문은 e와 악센트를 따로 넣었습니다. 번호는 다섯 개이며 프로그램 저장 칸은 여섯 개, 파일 칸은 열한 개입니다. 화면에서 묶는 단위는 네 개입니다."},
{parts:["A","é","가","😀"],counts:[4,5,10,4],detail:"e와 악센트를 하나의 번호로 합치면 번호는 네 개, 프로그램 저장 칸은 다섯 개, 파일 칸은 열 개입니다. 가는 앞쪽으로 한 자리 이동합니다."},
{parts:["A","e","◌́","ᄀ","ᅡ","😀"],counts:[6,7,14,4],detail:"가도 앞소리와 모음으로 풀어 쓰면 번호는 여섯 개, 프로그램 저장 칸은 일곱 개, 파일 칸은 열네 개입니다. 이 규칙에서 화면 묶음은 네 개로 유지됩니다."}
];
const names=["문자 번호","프로그램 칸","파일 칸","화면 묶음"];
export default function TextCaseViz(){const a=useAnimatedScenes(3);const c=cases[a.active];return <VizFrame eyebrow="같은 입력의 네 길이" title="무엇을 한 칸으로 셌나요" description="같은 글을 합치거나 풀어 쓰며 길이를 비교합니다." note="점선 원은 악센트를 보여 주는 보조 표시이며 입력 문자가 아닙니다.">
<div data-viz-canvas tabIndex={0} role="group" aria-label="같은 문자열의 네 길이" onKeyDown={a.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
<svg viewBox="0 0 320 290" className="mx-auto block w-full max-w-[460px]" role="img" aria-label={c.detail}>
<text x="160" y="23" textAnchor="middle" fill="currentColor" fontSize="17">{labels[a.active]}</text>
{c.parts.map((p,i)=><g key={i} transform={"translate("+((320-c.parts.length*49)/2+i*49)+",40)"}><rect width="44" height="47" rx="5" fill="currentColor" fillOpacity={p==="가"||p==="ᄀ"||p==="ᅡ"?.14:.04} stroke="currentColor"/><>{p==="◌́"?<g aria-label="악센트의 보조 표시"><circle cx="22" cy="28" r="10" stroke="currentColor" strokeDasharray="2 2" fill="none"/><path d="M22 14 L28 7" stroke="currentColor" strokeWidth="1.25" fill="none"/></g>:<text x="22" y="31" textAnchor="middle" fontSize="21" fill="currentColor">{p}</text>}</></g>)}
{names.map((name,i)=><g key={name}><rect x={8+(i%2)*158} y={112+Math.floor(i/2)*85} width="146" height="72" rx="5" fill="currentColor" fillOpacity=".03" stroke="currentColor"/><text x={81+(i%2)*158} y={137+Math.floor(i/2)*85} textAnchor="middle" fontSize="16" fill="currentColor">{name}</text><text x={81+(i%2)*158} y={168+Math.floor(i/2)*85} textAnchor="middle" fontSize="25" fill="currentColor">{c.counts[i]}</text></g>)}
</svg><p aria-live="polite" className="min-h-[10rem] text-sm leading-7">{c.detail}</p><AnimatedSceneControls {...a} labels={labels}/></div></VizFrame>;}
