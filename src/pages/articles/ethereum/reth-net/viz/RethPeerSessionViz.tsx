import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["후보", "Identity", "Hello", "Capability", "Status", "자료 교환", "정리"] as const;
const NOTES = [
  "상대의 endpoint를 얻어도 아직 dial 후보일 뿐입니다. 거래·블록 메시지를 처리할 권한과 active slot은 없습니다.",
  "TCP 위 ECIES handshake가 상대 key 보유를 확인합니다. Reth는 이 identity를 세션의 기준 ID로 고정합니다.",
  "Hello의 node ID가 ECIES identity와 같아야 합니다. 다른 ID를 말하면 UnexpectedHandshakeIdentity로 종료합니다.",
  "로컬의 eth/69·67·66과 상대의 eth/68·67·66에서 정확히 겹치는 67·66을 찾고 가장 높은 eth/67을 선택합니다.",
  "선택한 eth/67 Status의 genesis·version·chain·Fork ID가 local 설정과 맞아야 Established event를 만들 수 있습니다.",
  "ActiveSession이 열린 뒤에야 거래 해시를 알리고, 모르는 거래만 request/response로 가져와 별도 TxPool 검증에 넘깁니다.",
  "연결 종료나 protocol 오류가 나면 pending 또는 active map에서 세션을 지우고 slot과 inflight 상태를 회수합니다. 종료 이유는 재시도·평판 판단의 입력으로 남깁니다.",
] as const;

const STAGES = [
  ["CANDIDATE", "endpoint", "권한 없음"],
  ["ECIES", "remote key", "identity 확인"],
  ["HELLO", "node ID", "ID 결속"],
  ["CAPABILITY", "eth/67", "schema 선택"],
  ["STATUS", "chain·fork", "active 승격"],
  ["ETH DATA", "announce→pull", "자료 전달"],
  ["CLOSE", "reason", "slot 회수"],
] as const;

const ACTIVE_VALUE = [
  ["203.0.113.20:30303", "candidate=1 · active=0"],
  ["peer public key", "authenticated identity"],
  ["Hello ID = ECIES ID", "identity match"],
  ["{67,66} → eth/67", "highest exact match"],
  ["genesis·67·chain·fork", "Established"],
  ["hash → request → bytes", "TxPool 검증으로"],
  ["Disconnected", "active=0 · slot 반환"],
] as const;

function LifecycleRail({ active }: { active: number }) {
  return (
    <div className="grid grid-cols-7 gap-px bg-border p-px" aria-label="후보 주소가 활성 세션이 된 뒤 정리되는 전체 단계">
      {STAGES.map(([title], index) => (
        <div key={title} className={`min-w-0 bg-background px-0.5 py-2 text-center ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
          <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
          <strong className="mt-1 hidden break-keep text-[8px] leading-3 sm:block lg:text-[9px]">{title}</strong>
        </div>
      ))}
    </div>
  );
}

function PeerLane({ active }: { active: number }) {
  const [title, role, result] = STAGES[active];
  const [input] = ACTIVE_VALUE[active];
  const failed = active === 6;
  return (
    <section className="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)] items-stretch gap-1.5 sm:mt-3 sm:grid-cols-[minmax(0,1fr)_minmax(8.5rem,0.72fr)_minmax(0,1fr)] sm:gap-2" aria-label={`${title} 단계의 양쪽 피어 상태`}>
      <div className="min-w-0 border border-border bg-background p-2 sm:p-4">
        <span className="font-mono text-[9px] font-black text-muted-foreground">LOCAL RETH</span>
        <strong className="mt-1.5 block break-keep text-xs sm:mt-2 sm:text-sm">
          {active < 3 ? "연결 검사 중" : active === 3 ? "eth/69·67·66" : active < 6 ? "eth/67 session" : "세션 제거"}
        </strong>
        <span className="mt-1.5 block break-keep text-[9px] leading-4 text-muted-foreground sm:mt-2 sm:text-[10px]">
          {active < 4 ? "pending slot" : active < 6 ? "active slot" : "slot returned"}
        </span>
      </div>

      <div className={`min-w-0 border bg-background p-2 text-center sm:p-4 ${failed ? "border-amber-500/70" : "border-primary"}`}>
        <span className="font-mono text-[9px] font-black text-primary">{title}</span>
        <strong className="mt-1.5 block break-keep text-xs sm:mt-2 sm:text-sm">{role}</strong>
        <span className="mt-2 block break-all border-t border-border pt-1.5 font-mono text-[9px] leading-4 text-muted-foreground sm:mt-3 sm:pt-2">{input}</span>
        <span className={`mt-1 block break-keep text-[10px] font-bold ${failed ? "text-amber-700 dark:text-amber-300" : "text-primary"}`}>{result}</span>
      </div>

      <div className="min-w-0 border border-border bg-background p-2 sm:p-4">
        <span className="font-mono text-[9px] font-black text-muted-foreground">REMOTE PEER</span>
        <strong className="mt-1.5 block break-keep text-xs sm:mt-2 sm:text-sm">
          {active === 0 ? "endpoint만 알려짐" : active < 3 ? "key·Hello 제시" : active === 3 ? "eth/68·67·66" : active < 6 ? "호환 Status" : "연결 종료"}
        </strong>
        <span className="mt-1.5 block break-keep text-[9px] leading-4 text-muted-foreground sm:mt-2 sm:text-[10px]">
          {active < 5 ? "자료 권한 없음" : active === 5 ? "ETH message 가능" : "재접속은 정책 판단"}
        </span>
      </div>
    </section>
  );
}

export default function RethPeerSessionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Reth 피어 세션"
      title="주소를 찾은 뒤 상대·메시지 규격·체인을 차례로 확인합니다"
      description="로컬과 상대가 공통 eth/67을 고르고 active session을 연 뒤 자료를 교환하고 정리하는 한 연결을 추적합니다."
      note="IP 주소, 암호화 연결, 공통 capability와 Status 통과는 서로 다른 상태입니다. 어느 한 단계도 이후 거래·블록의 유효성을 대신하지 않습니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-network-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth가 후보 endpoint를 활성 ETH 세션으로 바꾸고 정리하는 일곱 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <LifecycleRail active={active} />
        <PeerLane active={active} />

        <div className="mt-2 grid grid-cols-[0.72fr_1.28fr] gap-px bg-border p-px sm:mt-3">
          <div className="bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">현재 상태</span>
            <strong className="mt-1 block break-keep text-xs sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="bg-background p-3">
            <span className="text-[10px] font-bold text-muted-foreground">새로 열린 권한 또는 정리된 상태</span>
            <strong className="mt-1 block break-keep text-xs text-primary sm:text-sm">{ACTIVE_VALUE[active][1]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-2 min-h-[4.5rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["후보", "ECIES", "Hello", "공통 버전", "Status", "자료", "정리"]}
          playLabel="세션 흐름 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
