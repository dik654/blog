import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
const scenes=[
 {label:"시장 매수",token:"10000 S를 확보",money:"시장에 9700달러 지급",detail:"0.97달러에 전량 살 수 있다는 가정입니다. 목표 가격과 실제 거래 가격을 구분합니다."},
 {label:"상환 요청",token:"10000 S를 반환",money:"10000달러 지급 요청",detail:"상환 자격과 약관을 확인해야 합니다. 토큰 전송 성공이 은행의 입금 완료를 뜻하지 않습니다."},
 {label:"지급 완료",token:"유통량 10000 S 감소",money:"10000 − 9700 − 100 = 200",detail:"상환이 완료되고 전체 비용이 100달러라는 가정에서 남는 금액입니다. 지연·가격 변동이 있으면 결과가 달라집니다."},
 {label:"현금 부족",token:"별도 스트레스 사례",money:"요청 6000 / 확보 현금 5800",detail:"현금 2000에 장부가 4000인 자산을 팔아 받은 3800을 더했습니다. 장부상 자산과 오늘 지급할 현금은 다릅니다."},
]as const;
export default function StablecoinSystemViz(){const state=useAnimatedScenes(scenes.length),s=scenes[state.active];return <div data-viz="stablecoin-system" data-viz-keyboard tabIndex={0} onKeyDown={state.onKeyDown} className="not-prose min-w-0 rounded-lg border border-border p-4 sm:p-6"><p className="mb-5 font-semibold">토큰 반환과 달러 지급을 함께 보기</p><div data-viz-canvas className="h-[29rem] min-w-0 overflow-auto sm:h-[25rem]"><div className="border border-border p-4"><p className="text-xs text-muted-foreground">토큰 쪽 기록</p><p className="mt-3 break-words font-semibold">{s.token}</p></div><svg aria-hidden="true" className="mx-auto my-4 h-6 w-8" viewBox="0 0 32 24"><path d="M16 1V22M10 16L16 22L22 16" fill="none" stroke="currentColor" strokeWidth="1"/></svg><div className="border border-primary/40 p-4"><p className="text-xs text-muted-foreground">달러 쪽 기록</p><p className="mt-3 break-words font-semibold">{s.money}</p></div><p className="mt-5 text-sm leading-7" aria-live="polite">{s.detail}</p></div><AnimatedSceneControls labels={scenes.map(x=>x.label)} {...state}/></div>}
