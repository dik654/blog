import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
const scenes=[
 {label:"송금 접수",input:"T1: A → B 10 / T2: B → A 5",state:"A: 100 → 90 → 95",result:"처리자의 빠른 응답",detail:"아직 다른 참여자가 L1 데이터에서 재현했다고 확인한 상태는 아닙니다."},
 {label:"자료 누락",input:"조각 1 도착, 마지막 표시 있음",state:"조각 0이 빠짐",result:"전체 입력을 읽지 못함",detail:"끝 번호를 안다는 사실과 그 앞의 자료를 모두 갖고 있다는 사실은 다릅니다."},
 {label:"입력 복원",input:"같은 채널의 조각 0과 1",state:"번호순 연결 → T1, T2",result:"A=95, B=5 재계산",detail:"같은 앞선 상태와 규칙으로 실행해 결과를 대조합니다. 조각의 도착 순서로 송금 순서를 바꾸지 않습니다."},
 {label:"결과 검증",input:"발표한 결과 A=96",state:"재계산한 A=95와 다름",result:"잘못된 주장을 거절",detail:"어떤 계약이 어떤 증거로 거절할지는 fault proof 또는 validity proof의 규칙으로 정합니다."},
]as const;
export function RollupPipelineViz(){const state=useAnimatedScenes(scenes.length),s=scenes[state.active];return <div data-viz="rollup-case" data-viz-keyboard tabIndex={0} onKeyDown={state.onKeyDown} className="not-prose min-w-0 rounded-lg border border-border p-4 sm:p-6"><p className="mb-4 font-semibold">두 송금의 입력과 결과를 따라가기</p><div data-viz-canvas className="h-[29rem] min-w-0 overflow-auto sm:h-[25rem]"><p className="text-xs text-muted-foreground">받은 입력</p><p className="mt-2 break-words text-sm leading-7">{s.input}</p><svg aria-hidden="true" className="mx-auto my-4 h-6 w-8" viewBox="0 0 32 24"><path d="M16 1V22M10 16L16 22L22 16" fill="none" stroke="currentColor" strokeWidth="1"/></svg><div className="border border-border p-4"><p className="text-xs text-muted-foreground">확인할 상태</p><p className="mt-3 break-words font-semibold">{s.state}</p></div><div className="mt-4 border border-primary/40 p-4"><p className="break-words font-semibold">{s.result}</p><p className="mt-3 text-sm leading-7" aria-live="polite">{s.detail}</p></div></div><AnimatedSceneControls labels={scenes.map(x=>x.label)} {...state}/></div>}
const rows=[
 {axis:"잘못된 96을 배제하는 방식",optimistic:"95를 재현한 참여자가 이의를 제기하고 정해진 게임으로 오류를 판정합니다.",validity:"지정된 계산이 95로 이어진다는 증명을 계약이 확인합니다."},
 {axis:"정산까지 기다리는 요인",optimistic:"주장과 이의 제기 기간, 분쟁 응답과 L1 포함 시간을 확인합니다.",validity:"증명 생성과 L1 포함, 계약의 추가 정산 조건을 확인합니다."},
 {axis:"별도로 확인할 조건",optimistic:"검증 자료에 접근할 수 있고 필요한 참여자가 기간 안에 이의를 제기할 수 있어야 합니다.",validity:"검증 프로그램과 공개 입력이 올바르게 연결되고 상태를 복원할 자료를 얻을 수 있어야 합니다."},
]as const;
export function ProofComparisonViz(){return <figure className="not-prose rounded-lg border border-border p-4 sm:p-6"><figcaption className="mb-5 font-semibold">같은 95 결과에 도달하는 두 검증 방식</figcaption><dl className="space-y-6">{rows.map(r=><div key={r.axis} className="border-t border-border pt-4"><dt className="font-semibold">{r.axis}</dt><dd className="mt-3 text-sm leading-7"><strong>Optimistic:</strong> {r.optimistic}</dd><dd className="mt-3 text-sm leading-7"><strong>Validity:</strong> {r.validity}</dd></div>)}</dl></figure>}
