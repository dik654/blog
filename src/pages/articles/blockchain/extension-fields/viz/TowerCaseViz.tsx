import StepViz from "@/components/ui/step-viz";
const steps=[
 {label:"입력",body:"A와 B에는 v²w에 붙는 두 계수만 있습니다. A는 [1,1], B는 [2,1]입니다."},
 {label:"두 계수 곱",body:"(1+u)(2+u)=2+3u+u²이고 u²=−1이므로 1+3u가 됩니다."},
 {label:"높은 항 줄이기",body:"v⁴w²=v⁵=(9+u)v²입니다. 따라서 두 계수 1+3u에 9+u를 곱합니다."},
 {label:"출력",body:"(1+3u)(9+u)=6+28u입니다. 출력은 v²에 붙는 [6,28]이며 w 쪽 여섯 계수는 모두 0입니다."},
];
const values=["A=(1+u)v²w · B=(2+u)v²w","(1+3u)v⁴w²","(1+3u)(9+u)v²","(6+28u)v²"];
const groups=["1 · u","v · uv","v² · uv²","w · uw","vw · uvw","v²w · uv²w"];
export default function TowerCaseViz(){return <StepViz steps={steps.map(step=>({...step,body:<span className="block min-h-[96px] sm:min-h-[48px]">{step.body}</span>}))}>{step=><div className="min-w-0 space-y-5">
 <div className="rounded-xl border bg-card p-4 text-center text-sm font-semibold leading-7 break-words">{values[step]}</div>
 <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{groups.map((basis,i)=><div key={basis} className={`min-w-0 rounded-lg border p-3 ${i===(step===3?2:5)?"border-primary bg-primary/5":"border-border"}`}><div className="text-xs text-muted-foreground">칸 {i*2}·{i*2+1}</div><div className="my-2 text-sm font-medium">{basis}</div><div className="text-xs leading-5">{step===0?(i===5?"A [1,1] · B [2,1]":"A [0,0] · B [0,0]"):step===3?(i===2?"출력 [6,28]":"출력 [0,0]"):"중간 항을 정리합니다"}</div></div>)}</div>
 <p className="text-xs leading-6 text-muted-foreground">칸 번호는 0부터 셉니다. 가운데 두 장면은 전개한 식이며 최종 저장값은 마지막 장면에서 확인합니다.</p>
 </div>}</StepViz>}
