import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["R1 기록", "R2 분기", "R3 추가", "사용 중인 길 보호"] as const;
const STATES = [
  { total: "8자리 보관", hit: "R1 재사용 0", note: "처음에는 저장된 기록이 없습니다. 여덟 자리를 계산해 한 구간으로 남깁니다." },
  { total: "6 + 2 + 2 = 10자리", hit: "R2 재사용 6", note: "일곱째 입력에서 달라집니다. 앞 여섯 자리의 기록을 공유하고 새 뒤 두 자리만 계산합니다." },
  { total: "6 + 2 + 2 + 2 = 12자리", hit: "R3 재사용 6", note: "앞 여섯 자리는 그대로입니다. R3의 뒤 두 자리를 추가하며 기록을 찾는 길이 하나 더 생깁니다." },
  { total: "보호 8자리 · 반환 4자리", hit: "5자리 요청을 채우지 못함", note: "R3가 사용하는 여덟 자리는 보호합니다. 나머지 두 끝 구간을 지워도 네 자리뿐이어서 다섯 자리 요구는 충족하지 못합니다." },
] as const;

export default function PrefixCachingRadixAttentionViz() {
  const scenes = useAnimatedScenes(STATES.length, 4300);
  const d = STATES[scenes.active];
  const active = scenes.active;
  return <VizFrame eyebrow="가정한 세 요청의 기록" title="같은 앞 여섯 자리는 함께 가리킵니다"
    description="입력 번호와 기록을 저장한 자리를 구분하며 분기와 반환을 따라갑니다."
    note="한 자리씩 재사용, 같은 모델·재사용 영역, 순차 요청, 생성 기록 제외. 마지막 장면만 R3 경로의 사용 잠금을 유지한 별도 반환 조건입니다.">
    <div data-viz-canvas role="group" tabIndex={0} aria-label="세 요청의 공통 기록과 사용 중인 경로" onKeyDown={scenes.onKeyDown}
      className="flex min-h-full min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex flex-none flex-col py-2">
        <h4 className="font-bold">{LABELS[active]}</h4>
        <p className="mt-2 font-mono text-sm text-primary">{d.total}</p>
        <svg viewBox="0 0 320 225" role="img" aria-label={d.hit} className="mt-2 h-auto max-h-64 w-full">
          <defs><marker id="prefix-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8" className="fill-primary" /></marker></defs>
          <circle cx="18" cy="112" r="7" className="fill-background stroke-border" />
          <text x="18" y="137" textAnchor="middle" className="fill-muted-foreground text-[12px]">시작</text>
          {active === 0 ? <>
            <path d="M27 112H111" className="stroke-primary" fill="none" markerEnd="url(#prefix-arrow)" />
            <rect x="118" y="84" width="145" height="56" rx="6" className="fill-muted stroke-border" />
            <text x="190" y="107" textAnchor="middle" className="fill-foreground text-[13px]">1·2·3·4·5·6·7·8</text>
            <text x="190" y="128" textAnchor="middle" className="fill-muted-foreground text-[12px]">R1의 여덟 자리</text>
          </> : <>
            <path d="M27 112H49" className="stroke-primary" fill="none" markerEnd="url(#prefix-arrow)" />
            <rect x="55" y="84" width="108" height="56" rx="6" className={active === 3 ? "fill-primary/15 stroke-primary" : "fill-muted stroke-border"} />
            <text x="109" y="108" textAnchor="middle" className="fill-foreground text-[13px]">1·2·3·4·5·6</text>
            <text x="109" y="128" textAnchor="middle" className="fill-muted-foreground text-[12px]">공통 여섯 자리</text>
            {[0,1,2].slice(0,active === 1 ? 2 : 3).map((i) => {
              const y = 18 + i * 73, removed = active === 3 && i < 2;
              return <g key={i}>
                <path d={`M164 112L209 ${y + 25}`} fill="none" className="stroke-primary" strokeDasharray={removed ? "4 3" : undefined} markerEnd="url(#prefix-arrow)" />
                <rect x="215" y={y} width="95" height="50" rx="6" className={active === 3 && i === 2 ? "fill-primary/15 stroke-primary" : "fill-background stroke-border"} strokeDasharray={removed ? "4 3" : undefined} />
                <text x="262" y={y+20} textAnchor="middle" className="fill-foreground text-[13px]">{["7·8", "9·10", "11·12"][i]}</text>
                <text x="262" y={y+40} textAnchor="middle" className="fill-muted-foreground text-[12px]">{removed ? "2자리 반환" : `R${i+1}의 두 자리`}</text>
              </g>;
            })}
          </>}
        </svg>
        <p className="font-semibold text-sm">{d.hit}</p>
        <p className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{d.note}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={LABELS} />
    </div>
  </VizFrame>;
}
