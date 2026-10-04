import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["입력 도착", "원본 준비", "복사 중", "복사 완료", "첫 출력"] as const;
const DATA = [
  { time: "0 ms", left: "계산 시작", right: "아직 기다림", held: 0, copied: 0, result: "사용자 출력 없음", note: "네 자리의 입력을 앞 장치가 읽습니다. 뒤 장치는 같은 모델로 이어 쓸 준비가 되어 있습니다." },
  { time: "4 ms", left: "128B 보관", right: "목적지 확보", held: 4, copied: 0, result: "앞쪽 출력은 전달 안 함", note: "앞 장치가 기록을 완성했습니다. 원본을 그대로 두고 뒤 장치가 복사를 시작합니다." },
  { time: "5 ms", left: "원본 유지", right: "64B 도착", held: 4, copied: 2, result: "아직 읽으면 안 됨", note: "64B/ms 가정에서 절반을 복사했습니다. 원본 공간을 다른 요청이 덮어쓰면 안 됩니다." },
  { time: "6 ms", left: "반환 가능", right: "128B 준비", held: 4, copied: 4, result: "완료 확인 → 뒤 계산", note: "읽기 완료를 확인하면 앞의 보관을 끝낼 수 있습니다. 뒤 장치가 마지막 입력을 다시 계산합니다." },
  { time: "8 ms", left: "다음 요청 가능", right: "첫 출력 계산", held: 0, copied: 4, result: "사용자에게 첫 출력", note: "뒤 계산 2ms와 전달 지연 0의 가정입니다. 이 경로에서는 뒤 장치의 출력만 사용자에게 보냅니다." },
] as const;

export default function DisaggregatedPrefillDecodeServingViz() {
  const scenes = useAnimatedScenes(DATA.length, 4300);
  const d = DATA[scenes.active];
  return <VizFrame eyebrow="가정한 요청 R의 기록 이동" title="원본 준비와 복사 완료를 구분합니다"
    description="두 장치 사이에서 같은 128B가 어디에 있고 언제 읽을 수 있는지 따라갑니다."
    note="네 입력 자리 × 32B. 복사 64B/ms·뒤 계산 2ms, 그 밖의 대기·연결·전달 지연 0인 설명용 사례입니다.">
    <div data-viz-canvas role="group" tabIndex={0} aria-label="요청 R의 기록 복사와 첫 출력 시간표" onKeyDown={scenes.onKeyDown}
      className="flex min-h-full min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex flex-none flex-col py-2">
        <div className="flex items-center justify-between gap-3"><h4 className="font-bold">{LABELS[scenes.active]}</h4><span className="font-mono text-primary">{d.time}</span></div>
        <svg viewBox="0 0 320 170" role="img" aria-label={`앞 장치 ${d.left}, 뒤 장치 ${d.right}`} className="mt-3 h-auto max-h-44 w-full">
          <defs><marker id="disagg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L8 4L0 8" className="fill-primary" /></marker></defs>
          <rect x="14" y="20" width="124" height="98" rx="8" fill="none" className="stroke-border" />
          <rect x="182" y="20" width="124" height="98" rx="8" fill="none" className="stroke-border" />
          <text x="76" y="42" textAnchor="middle" className="fill-foreground text-[13px]">앞 장치</text>
          <text x="244" y="42" textAnchor="middle" className="fill-foreground text-[13px]">뒤 장치</text>
          {[0, 1, 2, 3].map(i => <g key={i}>
            <rect x={26 + i * 24} y="59" width="19" height="22" rx="2" className={i < d.held ? "fill-primary/65" : "fill-muted"} />
            <rect x={194 + i * 24} y="59" width="19" height="22" rx="2" className={i < d.copied ? "fill-primary/65" : "fill-muted"} />
          </g>)}
          <text x="76" y="102" textAnchor="middle" className="fill-foreground text-[12px]">{d.left}</text>
          <text x="244" y="102" textAnchor="middle" className="fill-foreground text-[12px]">{d.right}</text>
          <path d="M142 69H175" fill="none" className="stroke-primary" markerEnd="url(#disagg-arrow)" />
          <text x="160" y="141" textAnchor="middle" className="fill-muted-foreground text-[12px]">한 칸 = 입력 한 자리의 32B</text>
          <text x="160" y="162" textAnchor="middle" className="fill-primary text-[13px]">{d.result}</text>
        </svg>
        <p className="mt-2 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{d.note}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={LABELS} />
    </div>
  </VizFrame>;
}
