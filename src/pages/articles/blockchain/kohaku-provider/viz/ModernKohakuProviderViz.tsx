import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const TRACE_SCENES = [
  "전체 경로",
  "공통 호출",
  "Helios 준비",
  "기본 경로",
  "우회 경로",
  "결과 정규화",
  "신뢰 경계",
] as const;

const TRACE_NOTES = [
  "애플리케이션은 getLogs 하나만 호출하지만, adapter 설정에 따라 실제 데이터 경로는 두 갈래입니다. 설명용 요청의 이름은 logs-17이며 실제 프로토콜 필드는 아닙니다.",
  "logs-17은 EthereumProvider.getLogs({fromBlock: 17, toBlock: 17})로 들어옵니다. 공통 인터페이스는 메서드와 반환 타입을 고정하지만 backend를 아직 증명하지는 않습니다.",
  "Helios adapter는 executionRpc 설정을 확인하고 Helios client를 만든 뒤 waitSynced가 끝나야 EthereumProvider를 반환합니다. 이 동기화는 adapter 생성 단계의 조건입니다.",
  "bypassLogs=false가 기본입니다. 이때 eth_getLogs는 Helios client.request를 지나며, 소스 주석은 최신 8,191개 block 범위와 느린 응답 가능성을 명시합니다.",
  "bypassLogs=true이면 eth_getLogs만 execution RPC로 직접 fetch합니다. 다른 메서드는 계속 Helios client.request로 보냅니다. 값의 출처가 바뀌었으므로 light-client 검증 결과라고 부를 수 없습니다.",
  "선택된 경로의 RPC log는 raw adapter에서 blockNumber와 선택적 logIndex를 변환해 TxLog[]가 됩니다. 두 경로의 TypeScript 타입은 같아집니다.",
  "같은 TxLog[]는 같은 검증 경로를 뜻하지 않습니다. 애플리케이션이 verified-only 정책을 원한다면 bypass 설정과 실제 backend 경로를 타입 밖의 구성·관측 증거로 확인해야 합니다.",
] as const;

const NODES = [
  { id: "app", name: "애플리케이션", role: "getLogs 요청 작성" },
  { id: "surface", name: "Ethereum Provider", role: "공통 메서드·반환 타입" },
  { id: "adapter", name: "Helios adapter", role: "sync 확인·경로 선택" },
  { id: "backend", name: "데이터 backend", role: "Helios 또는 execution RPC" },
  { id: "result", name: "raw adapter", role: "RPC log를 TxLog[]로 변환" },
] as const;

function activeNode(scene: number) {
  if (scene <= 0) return "";
  if (scene === 1) return "surface";
  if (scene === 2) return "adapter";
  if (scene === 3 || scene === 4) return "backend";
  return "result";
}

export function KohakuProviderTraceViz() {
  const scenes = useAnimatedScenes(TRACE_SCENES.length, 7000, { loop: false });
  const active = scenes.active;
  const selectedNode = activeNode(active);

  return (
    <VizFrame
      eyebrow="getLogs 한 건 · 공통 API와 실제 데이터 경로"
      title="같은 호출이 Helios와 execution RPC 중 어느 쪽을 지나는지 끝까지 추적합니다"
      description="고정된 그림에서 logs-17의 위치와 선택 경로만 바뀝니다. 재생은 직접 시작하며 마지막 장면에서 멈춥니다."
      note="Block 17과 logs-17은 메서드 경계를 설명하기 위한 예시입니다. 성능·가용성 측정값이 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-kohaku-provider-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Kohaku Provider의 getLogs 요청이 Helios 또는 execution RPC를 지나 TxLog 배열이 되는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid gap-px bg-border p-px lg:grid-cols-5" aria-label="getLogs 요청의 고정 경로">
          {NODES.map((node, index) => {
            const selected = selectedNode === node.id;
            const passed = active > 0 && (
              node.id === "app" ||
              (node.id === "surface" && active >= 1) ||
              (node.id === "adapter" && active >= 2) ||
              (node.id === "backend" && active >= 3) ||
              (node.id === "result" && active >= 5)
            );
            return (
              <div
                key={node.id}
                className={`relative grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-x-2 bg-background px-2.5 py-1 lg:block lg:p-4 ${selected ? "ring-2 ring-inset ring-primary" : ""}`}
              >
                <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <strong className="block break-keep text-xs sm:text-sm lg:mt-2">{node.name}</strong>
                  <span className="mt-0.5 block break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5 lg:mt-1">{node.role}</span>
                </span>
                <span
                  aria-hidden={!passed}
                  className={`inline-flex border-b pb-0.5 font-mono text-[9px] font-bold lg:mt-3 lg:text-[10px] ${passed ? "border-primary text-primary" : "invisible border-transparent"}`}
                >
                  logs-17
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px" aria-label="Helios adapter의 두 getLogs 경로">
          <section className={`min-w-0 bg-background p-3 sm:p-4 ${active === 3 ? "ring-2 ring-inset ring-emerald-500" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="break-keep text-xs sm:text-sm">기본 · bypassLogs=false</strong>
              <span className="break-all font-mono text-[9px] text-emerald-700 dark:text-emerald-300 sm:text-[10px]">client.request</span>
            </div>
            <p className="mt-2 break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">Helios가 제공하는 eth_getLogs 경로를 사용합니다. 소스가 밝힌 범위·속도 제약이 남습니다.</p>
            <p className="mt-3 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">출처 · Helios light-client 경로</p>
          </section>
          <section className={`min-w-0 bg-background p-3 sm:p-4 ${active === 4 ? "ring-2 ring-inset ring-amber-500" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="break-keep text-xs sm:text-sm">선택 · bypassLogs=true</strong>
              <span className="break-all font-mono text-[9px] text-amber-700 dark:text-amber-300 sm:text-[10px]">fetch(executionRpc)</span>
            </div>
            <p className="mt-2 break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">eth_getLogs만 execution RPC로 직접 보냅니다. 다른 메서드는 Helios client를 계속 사용합니다.</p>
            <p className="mt-3 text-[10px] font-bold text-amber-700 dark:text-amber-300">출처 · 설정한 execution RPC</p>
          </section>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px" aria-label="공통 타입과 남는 차이">
          <div className="min-w-0 bg-background p-3 sm:p-4">
            <p className="text-[10px] font-bold text-muted-foreground">같아지는 것</p>
            <p className="mt-2 break-all font-mono text-[11px] font-bold sm:text-xs">Promise&lt;TxLog[]&gt;</p>
            <p className="mt-1 break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">blockNumber · topics · data · address · 선택적 logIndex</p>
          </div>
          <div className={`min-w-0 bg-background p-3 sm:p-4 ${active >= 6 ? "ring-2 ring-inset ring-rose-500" : ""}`}>
            <p className="text-[10px] font-bold text-muted-foreground">같아지지 않는 것</p>
            <p className="mt-2 break-keep text-[11px] font-bold leading-4 text-rose-700 dark:text-rose-300 sm:text-xs sm:leading-5">검증 경로 · 지원 범위 · 실패 의미</p>
            <p className="mt-1 break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">현재 TxLog 타입에는 이 provenance가 들어 있지 않습니다.</p>
          </div>
        </div>

        <p data-scene-note className="mt-3 min-h-20 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:pl-4 sm:text-sm sm:leading-6">
          {TRACE_NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={TRACE_SCENES}
          controlLabels={["전체", "호출", "준비", "기본", "우회", "변환", "경계"]}
          playLabel="getLogs 경로 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={TRACE_SCENES} notes={TRACE_NOTES} />
    </VizFrame>
  );
}

export function KohakuSignerBoundaryViz() {
  return (
    <figure data-viz="kohaku-signer-boundary" className="not-prose border-y border-border py-5" aria-labelledby="kohaku-signer-title">
      <figcaption id="kohaku-signer-title" className="text-sm font-bold">읽기 계약과 서명 계약은 같은 객체가 아닙니다</figcaption>
      <div className="mt-4 grid gap-px bg-border p-px md:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1fr)]">
        <section className="bg-background p-4">
          <p className="font-mono text-xs font-bold text-primary">EthereumProvider&lt;T&gt;</p>
          <p className="mt-2 break-keep text-sm font-semibold">Chain·block·balance·code·logs·receipt 조회</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Backend 요청을 보내고 공통 결과 타입으로 바꿉니다. 개인키 권한은 이 interface에 없습니다.</p>
        </section>
        <div className="flex min-h-24 items-center justify-center bg-background p-4 text-center">
          <p className="text-xs font-bold text-muted-foreground">사용자 승인 뒤<br />별도 주입</p>
        </div>
        <section className="bg-background p-4">
          <p className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">TxSigner</p>
          <p className="mt-2 break-keep text-sm font-semibold">메시지 서명·거래 전송·주소 확인</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Type 분리는 경계를 표현합니다. 실제 키 보관과 승인 강제는 애플리케이션이 구현해야 합니다.</p>
        </section>
      </div>
    </figure>
  );
}
