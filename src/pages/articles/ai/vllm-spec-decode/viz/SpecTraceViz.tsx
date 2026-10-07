import { useEffect, useRef } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["제안", "수락", "거부", "보충", "확정"] as const;
const TITLES = ["네 후보", "두 개 수락", "첫 거부", "부족분 보충", "세 개 확정"] as const;
const PSEUDOCODE = [
  "candidates ← propose(prefix, count=4)",
  "accepted ← acceptFromLeft(candidates, target, draft)",
  "on firstReject(i): discard(candidates[i:])",
  "replacement ← sample(positivePart(target − draft))",
  "commit(accepted + replacement)",
] as const;
const STATES = [
  { result: "아직 확정하지 않음", note: "빠른 부품이 A·B·B·A를 제안했습니다. 원래 선택 비중을 지키는지 왼쪽부터 확인합니다." },
  { result: "앞의 A·B를 유지", note: "A의 수락 경계는 1, B는 0.5입니다. 비교값 0.6과 0.4에서 앞의 두 후보를 받아들입니다." },
  { result: "셋째 B에서 멈춤", note: "셋째의 0.8은 경계 0.5보다 큽니다. 넷째는 이미 달라진 앞 글을 가정하므로 이번 출력에 이어 쓰지 않습니다." },
  { result: "부족했던 A로 교체", note: "받아들인 비중은 A 40%, B 30%입니다. 거부된 30%에서 A를 고르면 원래 A 70%, B 30%가 됩니다." },
  { result: "그대로 2 + 교체 1 = 확정 3", note: "이번 글 뒤에 A·B·A를 붙입니다. 다음 바퀴에서는 이 확정된 글을 조건으로 새 후보를 만듭니다." },
] as const;
export default function SpecTraceViz() {
  const scenes = useAnimatedScenes(STATES.length, 4300);
  const active = scenes.active;
  const state = STATES[active];
  const canvas = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const viewport = canvas.current?.parentElement;
    if (viewport) viewport.scrollTop = 0;
  }, [active]);
  return <VizFrame eyebrow="가정한 한 요청" title="첫 거부 뒤의 후보는 이어 쓰지 않습니다" description="같은 네 후보가 세 개의 확정 출력이 되는 과정을 따라갑니다." note="처음 세 위치의 기준 비중은 A 70%·B 30%, 제안 비중은 A 40%·B 60%입니다. 종료 신호는 없는 사례입니다.">
    <div ref={canvas} data-viz-canvas role="group" tabIndex={0} aria-label="후보 네 개의 확인과 교체" onKeyDown={scenes.onKeyDown} className="flex min-h-full min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex flex-none flex-col py-2">
        <h4 className="font-bold">{TITLES[active]}</h4>
        <svg viewBox="0 0 320 235" role="img" aria-label={state.result} className="mt-3 h-auto max-h-64 w-full">
          <text x="16" y="19" className="fill-muted-foreground text-[12px]">미리 만든 후보</text>
          {["A", "B", "B", "A"].map((token, index) => {
            const x = 16 + index * 76;
            const kept = active >= 1 && index < 2;
            const rejected = active >= 2 && index === 2;
            return <g key={index}>
              <rect x={x} y="31" width="60" height="44" rx="6" className={kept ? "fill-primary/15 stroke-primary" : "fill-muted stroke-border"} strokeDasharray={active >= 2 && index === 3 ? "4 3" : undefined} />
              <text x={x+30} y="59" textAnchor="middle" className="fill-foreground text-[17px]">{token}</text>
              <text x={x+30} y="96" textAnchor="middle" className="fill-muted-foreground text-[12px]">{["0.6", "0.4", "0.8", "0.2"][index]}</text>
              <text x={x+30} y="119" textAnchor="middle" className="fill-foreground text-[12px]">{kept ? "유지" : rejected ? "거부" : active >= 2 ? "제외" : "확인 전"}</text>
              {kept && <path d={`M${x+30} 126V165`} className="stroke-primary" fill="none" />}
              {active >= 3 && index === 2 && <path d={`M${x+30} 126V165`} className="stroke-primary" fill="none" strokeDasharray="4 3" />}
            </g>;
          })}
          <text x="258" y="192" textAnchor="middle" className="fill-muted-foreground text-[12px]">확정 글</text>
          {["A", "B", "A"].map((token,index) => <g key={index}>
            <rect x={16+index*76} y="168" width="60" height="44" rx="6" className="fill-background stroke-border" />
            <text x={46+index*76} y="196" textAnchor="middle" className="fill-foreground text-[17px]">{active >= (index===2 ? 3 : 1) ? token : "·"}</text>
          </g>)}
        </svg>
        <ol aria-label="현재 장면과 함께 실행되는 의사코드" className="mb-4 space-y-1.5">
          {PSEUDOCODE.map((line, index) => (
            <li
              key={line}
              aria-current={active === index ? "step" : undefined}
              className={`flex min-w-0 gap-2 rounded-md border-l-2 px-3 py-2 ${
                active === index
                  ? "border-primary bg-primary/[0.07]"
                  : index < active
                    ? "border-primary/30 text-muted-foreground"
                    : "border-border/60 text-muted-foreground"
              }`}
            >
              <span className="shrink-0 font-mono text-[10px] font-bold text-primary">
                {index < active ? "✓" : String(index + 1).padStart(2, "0")}
              </span>
              <code className="min-w-0 break-words font-mono text-[11px] leading-5">{line}</code>
            </li>
          ))}
        </ol>
        <p className="font-semibold text-sm">{state.result}</p>
        <p className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{state.note}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={LABELS}/>
    </div>
  </VizFrame>;
}
