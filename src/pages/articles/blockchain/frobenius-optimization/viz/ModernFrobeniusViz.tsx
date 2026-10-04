import StepViz from "@/components/ui/step-viz";
const scenes=[
 {label:"직접 세제곱",body:"같은 1+u를 제곱하면 2u이고 한 번 더 곱하면 1+2u입니다. 1,u 순서의 출력은 [1,2]입니다.",basis:"1, u",input:"[1,1]",rule:"x²=2u → x³=1+2u",output:"[1,2]",value:"1+2u"},
 {label:"옛 기저의 표",body:"1은 그대로 두고 u의 계수에 2를 곱합니다. 행렬의 두 행이 출력의 첫째·둘째 계수를 만듭니다.",basis:"1, u",input:"[1,1]",rule:"[[1,0],[0,2]]",output:"[1,2]",value:"1+2u"},
 {label:"새 기저의 표",body:"v=1+u를 쓰면 같은 입력은 [0,1]입니다. 첫 계수에도 둘째 계수의 두 배가 들어가므로 표를 바꿔야 합니다.",basis:"1, v",input:"[0,1]",rule:"[[1,2],[0,2]]",output:"[2,2]",value:"2+2v=1+2u"},
 {label:"잘못 복사한 표",body:"옛 대각선 표를 그대로 쓰면 [0,2]가 나와 다른 값입니다. 두 번 적용하면 돌아오므로 원복 검사만으로는 이 오류를 잡지 못합니다.",basis:"1, v",input:"[0,1]",rule:"[[1,0],[0,2]]",output:"[0,2]",value:"2v=2+2u · 오답"},
];
export default function ModernFrobeniusViz(){return <StepViz steps={scenes.map(s=>({label:s.label,body:<span className="block min-h-[120px] sm:min-h-[72px]">{s.body}</span>}))}>{i=><div className="w-full min-w-0 space-y-4">
 <div className="grid grid-cols-2 gap-3"><div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">계수의 기저</p><p className="mt-2 text-lg font-semibold">{scenes[i].basis}</p></div><div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">같은 입력 1+u</p><p className="mt-2 text-lg font-semibold">{scenes[i].input}</p></div></div>
 <div className="flex min-h-[86px] items-center justify-center rounded-lg border bg-primary/5 p-4 text-center font-mono text-sm leading-7 break-words">{scenes[i].rule}</div>
 <div className={`min-h-[105px] rounded-lg border p-4 ${i===3?"border-amber-500/60 bg-amber-500/5":"border-primary/50 bg-primary/5"}`}><p className="text-xs text-muted-foreground">출력 {scenes[i].output}</p><p className="mt-2 text-sm font-semibold leading-7">{scenes[i].value}</p></div>
 <p className="text-xs leading-6 text-muted-foreground">모든 계수 계산은 3의 나머지입니다. 올바른 세 장면은 같은 수학적 결과를 서로 다른 계산·표현으로 보여 줍니다.</p>
 </div>}</StepViz>}
