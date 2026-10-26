import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "설정 입력",
  "값 정리",
  "사전 검사",
  "저장소 연결",
  "부품 조립",
  "서비스 시작",
  "준비 판정",
] as const;

const NOTES = [
  "명령행·설정 파일·기본값은 같은 항목을 서로 다르게 지정할 수 있습니다. 이 장면의 포트 값은 우선순위를 설명하기 위한 예시입니다.",
  "CLI는 최종값만 남기지 않고 어느 입력이 선택됐는지도 함께 기록해야 합니다. 정확한 우선순위와 기본값은 실행할 릴리스의 도움말과 설정 스키마에서 확인합니다.",
  "체인 식별자·데이터 경로·JWT 파일·포트가 서로 맞는지 확인합니다. 문자열 해석에 성공해도 파일 권한이나 포트 점유까지 통과한 것은 아닙니다.",
  "Reth v2.8.1의 NodeCommand 경로는 NodeConfig와 데이터베이스 핸들을 NodeBuilder에 넘깁니다. 기존 데이터의 체인·스키마가 맞지 않으면 일부 공개 서비스를 열기 전에 중단해야 합니다.",
  "NodeBuilder는 노드 형식, 핵심 부품, 부가 기능을 차례로 채웁니다. 필요한 형식이나 부품이 없으면 해당 조립 상태에서는 실행 메서드를 사용할 수 없습니다.",
  "형식 검사를 통과한 뒤에야 저장소 열기, P2P·Engine API·RPC 소켓 연결, 작업 실행 같은 런타임 실패가 나타납니다. 컴파일 성공은 서비스 준비 완료가 아닙니다.",
  "NodeHandle을 받거나 프로세스가 살아 있다는 사실만으로 동기화와 요청 처리가 정상이라고 단정하지 않습니다. 준비 판정은 각 서비스의 실제 상태를 별도로 확인합니다.",
] as const;

const STEPS = [
  ["입력", "명령행 · 파일 · 기본값"],
  ["설정", "NodeConfig · 값의 출처"],
  ["검사", "체인 · 경로 · JWT · 포트"],
  ["저장소", "DB 핸들 · 데이터 정체성"],
  ["조립", "형식 · 핵심 부품 · 부가 기능"],
  ["시작", "P2P · Engine · RPC · 작업"],
  ["판정", "NodeHandle · 서비스 상태"],
] as const;

const RECEIPTS = [
  ["후보", "기본값 8545 · 파일 9545 · CLI 10545"],
  ["선택", "http.port=10545 · source=CLI"],
  ["검사", "chain=mainnet · JWT 있음 · 포트 사용 가능"],
  ["연결", "data-dir identity · DB handle"],
  ["조립", "types → components → add-ons"],
  ["실행", "P2P · Engine API · RPC task 시작"],
  ["상태", "process up ≠ service ready ≠ sync complete"],
] as const;

export default function ContextViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="한 번의 실행 · 입력 → 조립 → 준비"
      title="reth node 명령은 설정을 정리한 뒤 노드 부품과 실행 서비스를 차례로 준비합니다"
      description="설명용 포트 설정 하나가 NodeConfig를 거쳐 실행 중인 서비스가 되기까지를 따라갑니다. 재생은 직접 시작해야 하며 마지막 장면에서 멈춥니다."
      note="8545·9545·10545는 설정 우선순위를 설명하기 위한 예시입니다. 실제 기본값과 병합 규칙은 사용할 Reth 릴리스에서 다시 확인합니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-cli-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth CLI 입력이 노드 준비 상태가 되는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid gap-3 px-1 py-2 lg:grid-cols-[11.5rem_minmax(0,1fr)]">
          <aside className="grid min-w-0 grid-cols-3 gap-px bg-border p-px lg:block lg:border lg:bg-background lg:p-3" aria-label="Reth 노드 실행의 상태 소유자">
            <div className="min-w-0 bg-background px-2 py-2.5 lg:p-0">
              <p className="text-[9px] font-black text-primary lg:text-[10px]">CLI</p>
              <p className="mt-1 break-keep text-[10px] font-bold leading-4 lg:text-xs lg:leading-5">입력 해석 · NodeConfig</p>
            </div>
            <div className="my-3 hidden border-t border-dashed border-border lg:block" />
            <div className="min-w-0 bg-background px-2 py-2.5 lg:p-0">
              <p className="text-[9px] font-black text-primary lg:text-[10px]">NodeBuilder</p>
              <p className="mt-1 break-keep text-[10px] font-bold leading-4 lg:text-xs lg:leading-5">호환 부품 조립</p>
            </div>
            <div className="my-3 hidden border-t border-dashed border-border lg:block" />
            <div className="min-w-0 bg-background px-2 py-2.5 lg:p-0">
              <p className="text-[9px] font-black text-primary lg:text-[10px]">런타임</p>
              <p className="mt-1 break-keep text-[10px] font-bold leading-4 lg:text-xs lg:leading-5">저장소 · 소켓 · 서비스 상태</p>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-px bg-border p-px lg:grid-cols-7" aria-label="Reth 노드 시작 단계">
              {STEPS.map(([label, detail], index) => {
                const passed = index < active;
                const current = index === active;
                return (
                  <div key={label} className={`min-w-0 bg-background px-2 py-2 sm:py-3 ${current ? "text-foreground" : "text-muted-foreground"}`}>
                    <span className={`mb-2 block h-1 w-8 ${current ? "bg-primary" : passed ? "bg-primary/35" : "bg-border"}`} />
                    <strong className="block break-keep text-xs">{label}</strong>
                    <span className="mt-1 hidden break-keep text-[10px] leading-4 sm:block">{detail}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-px bg-border p-px">
              <div className="min-w-0 bg-background px-3 py-3">
                <p className="text-[10px] font-bold text-muted-foreground">현재 장면</p>
                <p className="mt-1 break-keep text-sm font-black">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</p>
              </div>
              <div className="min-w-0 bg-background px-3 py-3">
                <p className="text-[10px] font-bold text-muted-foreground">이 단계에 남길 증거</p>
                <p className="mt-1 break-words font-mono text-xs font-bold leading-5">{RECEIPTS[active][0]} · {RECEIPTS[active][1]}</p>
              </div>
            </div>
          </div>
        </div>

        <p data-scene-note className="mx-1 mt-2 min-h-20 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-16 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["입력", "설정", "검사", "DB", "조립", "시작", "판정"]}
          playLabel="노드 시작 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
