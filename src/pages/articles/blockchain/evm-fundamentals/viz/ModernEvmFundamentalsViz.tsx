import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
const trace = [
 {label:"시작", pc:"0", command:"아직 실행 안 함", stack:"[]", gas:"20", detail:"다음 명령은 0번 바이트의 0x60입니다. 임시 스택과 메모리는 비어 있습니다."},
 {label:"2 올리기", pc:"2", command:"PUSH1 02", stack:"[2]", gas:"17", detail:"명령과 숫자 바이트를 함께 읽어 pc가 두 칸 이동합니다. 비용 3을 썼습니다."},
 {label:"3 올리기", pc:"4", command:"PUSH1 03", stack:"[2, 3]", gas:"14", detail:"오른쪽 3이 스택 맨 위입니다. ADD는 여기에 놓인 두 값을 꺼냅니다."},
 {label:"더하기", pc:"5", command:"ADD", stack:"[5]", gas:"11", detail:"3+2의 결과 5를 임시 스택에 넣습니다. storage를 쓰거나 데이터를 반환하지 않았습니다."},
 {label:"종료", pc:"5", command:"STOP", stack:"[5]", gas:"11", detail:"STOP은 실행을 끝냅니다. 이 구현에서 pc를 더 늘리지 않으며 사용 gas는 9입니다."},
] as const;
export function EvmStepTraceViz() {
 const state=useAnimatedScenes(trace.length);const current=trace[state.active];
 return <div data-viz="evm-literal-step" data-viz-keyboard tabIndex={0} onKeyDown={state.onKeyDown} className="not-prose flex min-w-0 flex-col rounded-lg border border-border p-4 sm:p-6">
 <p className="mb-4 font-semibold">같은 프로그램의 pc·스택·남은 예산</p>
 <div data-viz-canvas className="min-h-[23rem] min-w-0 overflow-auto">
 <div className="min-w-[280px]"><table className="w-full text-left text-xs sm:text-sm"><thead><tr className="border-b border-border"><th className="p-2">실행한 명령</th><th className="p-2">다음 pc</th><th className="p-2">stack</th><th className="p-2">gas</th></tr></thead><tbody>{trace.map((row,i)=><tr key={row.label} aria-current={i===state.active?"step":undefined} className={`border-b border-border ${i===state.active?"bg-primary/10 font-semibold":""}`}><td className="p-2">{i===state.active?"→ ":""}{row.command}</td><td className="p-2 font-mono">{row.pc}</td><td className="p-2 font-mono">{row.stack}</td><td className="p-2 font-mono">{row.gas}</td></tr>)}</tbody></table></div>
 <p aria-live="polite" className="mt-5 text-sm leading-7">{current.detail}</p>
 <p className="mt-3 text-xs leading-6 text-muted-foreground">시작 gas 20은 설명용 가정입니다. 거래 전체 수수료와 블록 확정 상태는 이 표가 계산하지 않습니다.</p>
 </div><AnimatedSceneControls labels={trace.map(x=>x.label)} {...state} />
 </div>;
}
export function EvmFailureViz(){return <figure className="not-prose rounded-lg border border-border p-4 sm:p-6"><figcaption className="mb-4 font-semibold">호출의 종료 이유와 변경 범위</figcaption><dl className="space-y-5">{[{t:"STOP / RETURN",d:"현재 호출이 정상 종료합니다. 상위 호출까지 성공해야 변경이 끝까지 남습니다."},{t:"REVERT",d:"현재 호출의 변경을 복원하고 반환 데이터를 전달합니다. 남은 gas를 모두 소모시키는 예외 경로와 다릅니다."},{t:"예외 종료",d:"gas 부족이나 잘못된 명령이면 현재 호출의 변경을 복원하고 해당 호출의 남은 gas를 소모합니다."}].map(x=><div key={x.t} className="border-t border-border pt-3"><dt className="font-mono text-sm font-semibold">{x.t}</dt><dd className="mt-2 text-sm leading-7">{x.d}</dd></div>)}</dl></figure>}
