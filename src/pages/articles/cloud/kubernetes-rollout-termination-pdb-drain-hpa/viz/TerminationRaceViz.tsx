import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * Pod 삭제 뒤 두 시계가 동시에 도는 모습을 그린다.
 * 한 mechanism: 노드의 kubelet은 preStop → SIGTERM → SIGKILL을 30초 예산 안에서 진행하고,
 * 컨트롤 플레인은 같은 순간 EndpointSlice의 ready를 false로 바꿔 각 노드의 kube-proxy 규칙과 LB로 퍼뜨린다. 두 시계 사이의 틈이 5xx다.
 * 30 s·2 s는 v1.37.1 기본값, preStop 5 s와 전파 3 s는 가정이다.
 */
interface Scene {
  label: string;
  t: string;
  pos: number;
  kubelet: string;
  plane: string;
  traffic: "new+old" | "old-only-ok" | "old-only-bad" | "none";
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "삭제 요청", t: "t = 0", pos: 0, kubelet: "deletionTimestamp 관찰 → 종료 시작", plane: "EndpointSlice: terminating=true, ready=false 기록", traffic: "new+old", note: "kubectl delete 또는 rollout이 Pod를 지우면 API는 deletionTimestamp와 30초 예산을 적습니다. 이 한 번의 쓰기를 kubelet과 EndpointSlice 컨트롤러가 동시에 봅니다. 두 시계가 여기서 함께 출발합니다." },
  { label: "preStop 실행 중", t: "t = 0 ~ 5 s", pos: 14, kubelet: "preStop: sleep 5 (가정) — SIGTERM 아직 안 보냄", plane: "각 노드 kube-proxy 규칙 갱신 중 (전파 ≈ 3 s, 가정)", traffic: "new+old", note: "아직 SIGTERM이 가지 않았으므로 앱은 모르고 계속 응답합니다. 그동안 규칙이 아직 바뀌지 않은 노드에서 온 새 연결도 정상 처리됩니다. preStop sleep은 이 전파 시간을 벌기 위한 것입니다." },
  { label: "전파 완료", t: "t ≈ 3 s", pos: 9, kubelet: "preStop 계속 (2 s 남음)", plane: "모든 노드 규칙에서 이 Pod 제외 완료", traffic: "old-only-ok", note: "규칙 전파가 끝나 새 연결은 더 이상 오지 않습니다. preStop이 전파보다 길었기 때문에 앱은 아직 SIGTERM을 받지 않았고, 열려 있던 연결만 마무리하면 됩니다." },
  { label: "SIGTERM", t: "t = 5 s", pos: 17, kubelet: "StopContainer(grace 25 s) → PID 1에 SIGTERM", plane: "변화 없음", traffic: "old-only-ok", note: "예산 30초에서 preStop 5초를 뺀 25초를 런타임에 넘기고 PID 1에 SIGTERM을 보냅니다. 앱은 리스너를 닫고 진행 중인 요청을 끝낸 뒤 스스로 종료합니다. 새 연결이 없으므로 거절도 없습니다." },
  { label: "preStop이 없었다면", t: "t = 0 ~ 3 s", pos: 9, kubelet: "SIGTERM 즉시 → 앱이 리스너를 닫음", plane: "규칙 아직 갱신 중", traffic: "old-only-bad", note: "preStop 없이 SIGTERM이 바로 가면 앱이 리스너를 닫는 순간에도 규칙이 남은 노드에서 새 연결이 옵니다. 그 연결은 connection refused나 5xx가 됩니다. 배포 때마다 몇 초 5xx가 튀는 전형적인 원인입니다." },
  { label: "SIGKILL 경계", t: "t = 30 s", pos: 100, kubelet: "예산 소진 → SIGKILL, Pod 삭제", plane: "endpoint 제거", traffic: "none", note: "앱이 25초 안에 끝나지 않으면 SIGKILL입니다. PID 1이 sh 래퍼라 SIGTERM을 자식에 넘기지 않으면 매번 이 경계까지 기다렸다가 죽습니다. 그 사연은 리눅스 프로세스·신호 글에 있습니다." },
];

const MARKS = [
  { pos: 0, label: "0" },
  { pos: 9, label: "3 s" },
  { pos: 17, label: "5 s" },
  { pos: 100, label: "30 s" },
] as const;

const TRAFFIC: Record<Scene["traffic"], { text: string; color: string }> = {
  "new+old": { text: "새 연결 도착 · 정상 응답", color: "#16a34a" },
  "old-only-ok": { text: "새 연결 없음 · 기존 연결 마무리", color: "#2563eb" },
  "old-only-bad": { text: "새 연결 도착 · 거절(5xx)", color: "#dc2626" },
  none: { text: "연결 없음", color: "#94a3b8" },
};

export default function TerminationRaceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600, { loop: false });
  const s = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const traffic = TRAFFIC[s.traffic];

  return (
    <VizFrame
      eyebrow="Pod 종료의 두 시계"
      title="SIGTERM과 endpoint 제거는 같은 순간 출발하므로, preStop이 전파 시간을 벌어야 5xx가 없습니다"
      description="위 막대는 30초 예산, 아래 두 줄은 노드의 kubelet과 컨트롤 플레인이 같은 시각에 하는 일입니다. 맨 아래가 그 순간 들어오는 연결의 운명입니다."
      note="30초 예산과 최소 2초는 v1.37.1 기본값입니다. preStop 5초와 규칙 전파 3초는 설명용 가정이며 실측이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Pod 종료 중 kubelet과 컨트롤 플레인의 동시 진행"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="grid">
            {SCENES.map((x, i) => (
              <div key={x.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 flex flex-wrap items-baseline justify-between gap-2 ${i === scenes.active ? "" : "invisible"}`}>
                <h4 className="text-base font-bold">{x.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">{x.t}</span>
              </div>
            ))}
          </div>

          <div className="relative mt-4 h-12">
            <div className="absolute left-0 right-0 top-3 h-1 rounded bg-[#cbd5e1]" />
            <motion.div className="absolute left-0 top-3 h-1 rounded bg-[#2563eb]" initial={false} animate={{ width: `${s.pos}%` }} transition={{ duration: reduced ? 0 : 0.4 }} />
            {MARKS.map((m) => (
              <div key={m.label} className={`absolute top-0 ${m.pos === 0 ? "" : m.pos === 100 ? "-translate-x-full" : "-translate-x-1/2"}`} style={{ left: `${m.pos}%` }}>
                <div className="mx-auto h-7 w-px bg-[#94a3b8]" />
                <span className="block whitespace-nowrap text-[10px] font-bold text-muted-foreground">{m.label}</span>
              </div>
            ))}
            <motion.div className="absolute top-1 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#2563eb] bg-background" initial={false} animate={{ left: `${3 + s.pos * 0.94}%` }} transition={{ duration: reduced ? 0 : 0.4 }} />
          </div>

          <div className="mt-3 grid gap-2">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-3 rounded-md border border-border px-3 py-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <span className="text-[11px] font-bold leading-5 text-muted-foreground">노드 · kubelet</span>
              <span className="grid text-sm font-semibold leading-5 text-foreground">
                {SCENES.map((x, i) => (
                  <span key={x.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 ${i === scenes.active ? "" : "invisible"}`}>{x.kubelet}</span>
                ))}
              </span>
            </div>
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-3 rounded-md border border-border px-3 py-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <span className="text-[11px] font-bold leading-5 text-muted-foreground">컨트롤 플레인</span>
              <span className="grid text-sm font-semibold leading-5 text-foreground">
                {SCENES.map((x, i) => (
                  <span key={x.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 ${i === scenes.active ? "" : "invisible"}`}>{x.plane}</span>
                ))}
              </span>
            </div>
            <motion.div
              className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-3 rounded-md border px-3 py-2 sm:grid-cols-[8rem_minmax(0,1fr)]"
              initial={false}
              animate={{ borderColor: traffic.color, backgroundColor: `${traffic.color}14` }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              <span className="text-[11px] font-bold leading-5 text-muted-foreground">들어오는 연결</span>
              <span className="grid text-sm font-bold leading-5" style={{ color: traffic.color }}>
                {SCENES.map((x, i) => (
                  <span key={x.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 ${i === scenes.active ? "" : "invisible"}`}>{TRAFFIC[x.traffic].text}</span>
                ))}
              </span>
            </motion.div>
          </div>

<div className="mt-3 grid border-l border-primary/50 pl-4">
            {SCENES.map((item, i) => (
              <p key={i} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-sm leading-7 text-muted-foreground ${i === scenes.active ? "" : "invisible"}`}>
                {item.note}
              </p>
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((x) => x.label)} />
      </div>
    </VizFrame>
  );
}
