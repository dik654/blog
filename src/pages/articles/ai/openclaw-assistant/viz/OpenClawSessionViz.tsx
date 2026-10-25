import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["기본 main", "발신자 분리", "동일인 연결"] as const;
const NOTES = [
  "기본 main에서는 모든 DM이 한 대화 기록을 공유합니다. 한 사람이 여러 채널에서 같은 개인 비서를 쓰는 경우에는 연속성이 생기지만, 여러 사람이 접근하면 서로의 문맥이 섞일 수 있습니다.",
  "per-channel-peer는 채널과 발신자 조합마다 별도 대화 상태를 선택합니다. Telegram 사용자와 Slack 사용자는 같은 Agent를 쓰더라도 transcript가 갈라집니다.",
  "검증된 identityLinks를 설정하면 같은 사람의 여러 채널 신원을 하나의 peer로 연결할 수 있습니다. 이는 의도적인 연결이며 session key 자체가 신원 증명이나 권한 토큰이 되는 것은 아닙니다.",
] as const;

function StateBox({ title, rows, active }: { title: string; rows: readonly string[]; active: boolean }) {
  return (
    <section className={`min-w-0 border p-3 sm:p-4 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <h4 className="break-keep text-xs font-bold">{title}</h4>
      <div className="mt-3 space-y-2">
        {rows.map((row) => <p key={row} className="break-words border-l border-border pl-2 font-mono text-[10px] leading-5 text-muted-foreground">{row}</p>)}
      </div>
    </section>
  );
}

export default function OpenClawSessionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  return (
    <VizFrame
      eyebrow="같은 Agent · 다른 대화 상태"
      title="Binding이 Agent를 고르고, DM scope가 읽을 기록을 고릅니다"
      description="두 결정은 연속해서 일어나지만 같은 결정은 아닙니다. Agent가 같아도 session scope에 따라 대화 상태는 합쳐지거나 분리됩니다."
      note="그림의 session 표기는 구성 요소를 보여 주는 설명용 표현입니다. 실제 저장 key의 직렬화 형식을 고정한 예시는 아닙니다."
      canvasClassName="p-2 sm:p-6"
    >
      <div id={scenes.playbackId} data-viz-canvas data-viz-scene="openclaw-session-scope" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="OpenClaw DM session scope 비교" onKeyDown={scenes.onKeyDown} className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div data-viz-live-only>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
            <section className="border border-border bg-background p-3 sm:p-4">
              <p className="text-[10px] font-black text-primary">BINDING OUTPUT</p>
              <p className="mt-2 text-sm font-bold">agentId: support</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] leading-4">
                <p className="border border-border p-2"><strong className="block">Telegram</strong>사용자 A</p>
                <p className="border border-border p-2"><strong className="block">Slack</strong>사용자 A</p>
                <p className="border border-border p-2"><strong className="block">Slack</strong>사용자 B</p>
              </div>
            </section>
            <div className="grid gap-2 sm:grid-cols-2">
              <StateBox title="main session" rows={["Telegram · A history", "Slack · A history", "Slack · B history"]} active={scenes.active === 0} />
              <StateBox title={scenes.active === 2 ? "linked peer sessions" : "channel + peer sessions"} rows={scenes.active === 2 ? ["peer P · Telegram A + Slack A", "Slack · B", "B · 연결 대상 아님"] : ["Telegram · A", "Slack · A", "Slack · B"]} active={scenes.active > 0} />
            </div>
          </div>
          <p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[scenes.active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="상태 변화 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}
        </ol>
      </div>
    </VizFrame>
  );
}
