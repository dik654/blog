import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #taints-eviction — NoSchedule은 새 Pod를, NoExecute는 있던 Pod를 다룹니다.
 * 가로축은 taint가 붙은 뒤 시간입니다. 300이 전체 폭의 80% 지점이고, 그 뒤는 "기간 없음"을 보이는 여백입니다.
 */
const P300 = 80;

const SCENES = [
  { label: "새 Pod", summary: "NoSchedule: 들어오지 못함", note: "NoSchedule taint는 scheduler의 Filter 단계에서 새 Pod를 막습니다. 기본 toleration은 NoExecute 쪽에만 들어가므로 Unknown 노드에는 새 Pod가 가지 않습니다." },
  { label: "toleration 없는 Pod", summary: "NoExecute: 바로 삭제 요청", note: "taint eviction 컨트롤러가 이미 있는 Pod를 살펴 toleration이 없으면 바로 삭제를 요청합니다." },
  { label: "기본 toleration", summary: "NoExecute: 300초 뒤", note: "tolerationSeconds가 있으면 그 뒤에 삭제를 요청합니다. 기본값 300초 덕분에 기존 Pod는 5분을 버팁니다." },
  { label: "DaemonSet Pod", summary: "기간 없음: 쫓겨나지 않음", note: "DaemonSet Pod에는 컨트롤러가 not-ready·unreachable에 대해 tolerationSeconds 없는 toleration을 넣어 쫓겨나지 않습니다." },
] as const;

function Row({ title, on, children }: { title: string; on: boolean; children: ReactNode }) {
  return (
    <div style={{ opacity: on ? 1 : 0.4 }}>
      <p className={`text-xs leading-5 ${on ? "font-bold" : ""}`}>{title}</p>
      <div className="relative h-7 min-w-0">{children}</div>
    </div>
  );
}

function Stop({ left, text }: { left: number; text: string }) {
  return (
    <>
      <span className="absolute top-0 h-7 w-0 border-l" style={{ left: `${left}%`, borderColor: "#b91c1c" }} />
      <span className="absolute top-1 whitespace-nowrap text-[11px] font-bold leading-5" style={{ left: `calc(${left}% + 6px)`, color: "#b91c1c" }}>{text}</span>
    </>
  );
}

export default function TaintEffectsViz() {
  return (
    <SceneShell
      eyebrow="Unknown 노드에 붙은 두 taint"
      title="같은 노드에서 새 Pod는 막히고, 있던 Pod는 toleration만큼 버팁니다"
      description="가로축은 taint가 붙은 뒤 흐른 시간입니다. 파란 막대는 노드에 남아 있는 기간, 빨간 선은 삭제 요청 시점입니다."
      ariaLabel="NoSchedule과 NoExecute taint가 Pod 종류별로 다르게 작동하는 시간 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <div className="relative h-6 border-b border-slate-400 font-mono text-[11px] text-muted-foreground">
            <span className="absolute left-0">taint 0</span>
            <span className="absolute -translate-x-1/2" style={{ left: `${P300}%` }}>300 s</span>
          </div>
          <Row title="새 Pod (NoSchedule)" on={active === 0}>
            <span className="absolute left-0 top-0 inline-flex h-7 items-center rounded-sm border border-dashed px-2 text-[11px] font-bold" style={{ borderColor: "#b91c1c", color: "#b91c1c" }}>Filter에서 탈락, 노드에 오지 않음</span>
          </Row>
          <Row title="toleration 없는 Pod (NoExecute)" on={active === 1}>
            <Stop left={0} text="바로 삭제 요청" />
          </Row>
          <Row title="기본 toleration 300초 Pod (NoExecute)" on={active === 2}>
            <span className="absolute left-0 top-1 h-5" style={{ width: `${P300}%`, backgroundColor: "#2563eb" }} />
            <span className="absolute top-0 h-7 w-0 border-l" style={{ left: `${P300}%`, borderColor: "#b91c1c" }} />
            <span className="absolute left-2 top-1 text-[11px] font-bold leading-5 text-white">300초 버팀, 끝에 삭제 요청</span>
          </Row>
          <Row title="DaemonSet Pod (기간 없는 toleration)" on={active === 3}>
            <span className="absolute inset-x-0 top-1 h-5" style={{ backgroundColor: "#2563eb" }} />
            <span className="absolute left-2 top-1 text-[11px] font-bold leading-5 text-white">기간 없음, 축 끝 너머까지 남음 →</span>
          </Row>
        </div>
      )}
    />
  );
}
