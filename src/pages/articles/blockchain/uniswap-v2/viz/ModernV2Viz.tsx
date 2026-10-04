import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
type Mode="swap"|"pair"|"router"|"flash";
const flows:Record<Mode,{title:string;scenes:{label:string;input:string;calculation:string;result:string}[]}>= {
 swap:{title:"A100 입력을 잔액 검사까지 추적",scenes:[
 {label:"거래 전",input:"A1000 / B1000",calculation:"사용자가 A100 입력",result:"수수료 반영 입력은99.7입니다."},
 {label:"출력 계산",input:"유효 A1099.7",calculation:"B 출력≈90.661089",result:"입력100과 출력90.661089는 다릅니다. 정수 계산은 출력을 내립니다."},
 {label:"실제 잔액",input:"A1100 / B909.338911",calculation:"수수료를 반영한 곱 검사",result:"통과하면 이 잔액으로 reserve를 갱신합니다. 실제 A에는100이 모두 들어와 있습니다."}]},
 pair:{title:"두 입금 비율이 주는 LP 지분",scenes:[
 {label:"입금 전",input:"A1000 / B2000 / LP100",calculation:"A100 / B300 추가",result:"현재 풀과 LP를 정규화한 표시 단위입니다."},
 {label:"각 비율",input:"A는10% / B는15%",calculation:"LP 후보10 / 15",result:"같은 기존 LP 공급100에 각각의 입금 비율을 곱합니다."},
 {label:"작은 몫",input:"min(10,15)",calculation:"새 LP10",result:"부족한 A가 제한합니다. Pair 직접 mint는 초과한 B를 자동으로 환불하지 않습니다."}]},
 router:{title:"사전 견적과 실행 조건",scenes:[
 {label:"견적",input:"A100 → B90.661089 예상",calculation:"관측한 reserve로 계산",result:"아직 체결된 값이 아닙니다."},
 {label:"조건",input:"최저 B / 받을 주소 / 기한",calculation:"사용자가 허용 범위를 정함",result:"예시 견적100에1% 허용이면99이지만 실제 견적에는 그 값으로 다시 계산합니다."},
 {label:"실행",input:"실행 시점의 reserve",calculation:"최저 출력 검사 뒤 전달",result:"다른 거래가 앞서 실행되면 수량이 달라지고 허용 범위를 벗어나면 거절합니다."}]},
 flash:{title:"같은 토큰100을 먼저 받은 경우",scenes:[
 {label:"먼저 수령",input:"출력100을 받음",calculation:"수신자의 callback",result:"같은 호출 안에서 필요한 대가를 마련해야 합니다."},
 {label:"상환 계산",input:"0.997 × 상환량 ≥100",calculation:"상환량≥100.3009027…",result:"소수6자리 토큰이면100.300903 이상으로 올립니다."},
 {label:"잔액 확인",input:"실제 받은 상환량",calculation:"조정 곱 검사",result:"100만 갚으면 수수료 반영 조건이 부족해 해당 호출이 실패합니다."}]}
};
export default function ModernV2Viz({mode}:{mode:Mode}){const f=flows[mode],state=useAnimatedScenes(f.scenes.length),s=f.scenes[state.active];return <div data-viz={"v2-"+mode} data-viz-keyboard tabIndex={0} onKeyDown={state.onKeyDown} className="not-prose min-w-0 rounded-lg border border-border p-4 sm:p-6"><p className="mb-5 font-semibold">{f.title}</p><div data-viz-canvas className="h-[26rem] min-w-0 overflow-auto sm:h-[23rem]"><div className="border border-border p-4"><p className="text-xs text-muted-foreground">입력과 현재 상태</p><p className="mt-3 break-words font-semibold">{s.input}</p></div><svg aria-hidden="true" className="mx-auto my-4 h-6 w-8" viewBox="0 0 32 24"><path d="M16 1V22M10 16L16 22L22 16" fill="none" stroke="currentColor" strokeWidth="1"/></svg><div className="border border-primary/40 p-4"><p className="break-words font-semibold">{s.calculation}</p><p className="mt-4 text-sm leading-7" aria-live="polite">{s.result}</p></div></div><AnimatedSceneControls labels={f.scenes.map(x=>x.label)} {...state}/></div>}
