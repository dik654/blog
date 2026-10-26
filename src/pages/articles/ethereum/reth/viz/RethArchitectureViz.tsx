import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "역할 경계",
  "실행 요청",
  "규칙 확인",
  "상태 계산",
  "정본 반영",
  "영속 저장",
  "일관된 조회",
] as const;

const NOTES = [
  "합의 클라이언트는 head·safe·finalized 위치를 선택하고, Reth는 실행 데이터 묶음을 검증해 EVM 결과와 상태 루트를 계산합니다. 서로의 책임을 대신하지 않습니다.",
  "새 실행 데이터 묶음은 Engine API로 들어옵니다. 오래된 블록을 채우는 동기화 경로는 P2P에서 시작하지만, 둘 다 같은 블록 규칙과 실행 규칙으로 합류합니다.",
  "부모 블록과 부모 상태를 찾고 블록 머리글·본문·거래를 현재 분기 규칙에 맞춰 확인합니다. 바이트를 받았다는 사실만으로 유효한 블록이 되지는 않습니다.",
  "부모 상태에서 거래를 순서대로 실행해 계정·저장 공간 변경, 실행 영수증과 새 상태 루트를 계산합니다. 이 단계의 성공은 아직 정본 채택을 뜻하지 않습니다.",
  "합의 클라이언트가 forkchoiceUpdated로 새 head를 알리면 Reth가 정본 조회 시점을 바꿉니다. safe와 finalized 표시는 head와 별도로 유지합니다.",
  "선택된 블록·실행 영수증·상태와 조회용 색인을 저장합니다. 과거 동기화는 단계별 체크포인트를 남겨 중단 뒤 같은 지점에서 이어갑니다.",
  "JSON-RPC 요청은 조회를 시작할 때 블록 해시와 상태 루트가 맞는 한 시점을 고정합니다. 분기 재편 도중 서로 다른 시점의 블록 머리글과 상태를 섞지 않습니다.",
] as const;

const STAGES = [
  ["입력", "Engine API · P2P"],
  ["검증", "머리글 · 본문 · 거래"],
  ["실행", "EVM · 영수증 · 루트"],
  ["정본", "head · safe · finalized"],
  ["저장", "상태 · 과거 기록 · 색인"],
  ["조회", "조회 계층 · JSON-RPC"],
] as const;

const RECEIPTS = [
  ["요청", "아직 없음"],
  ["요청", "newPayload · 0x6a…"],
  ["검증", "부모 상태 S₀ · 규칙 통과"],
  ["실행", "상태 S₀ → S₁ · 영수증 R₁"],
  ["정본", "head = 0x6a… · safe/finalized 별도"],
  ["저장", "블록 0x6a… · stateRoot S₁"],
  ["응답", "eth_getBalance @ 0x6a…"],
] as const;

function activeStage(scene: number) {
  if (scene <= 1) return 0;
  return Math.min(scene - 1, STAGES.length - 1);
}

export default function RethArchitectureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600, { loop: false });
  const active = scenes.active;
  const currentStage = activeStage(active);

  return (
    <VizFrame
      eyebrow="한 블록 · 합의 선택 → 실행 → 조회"
      title="Reth는 합의가 고른 블록을 실행 가능한 상태와 조회 결과로 바꿉니다"
      description="새 실행 데이터 묶음(payload) 0x6a…가 들어와 상태 S₁을 만들고 JSON-RPC에서 같은 상태를 읽기까지를 따라갑니다. 재생은 직접 시작해야 하며 마지막 장면에서 멈춥니다."
      note="0x6a…·S₀·S₁·R₁은 흐름을 구분하기 위한 축약 표기입니다. 실제 값이나 특정 네트워크의 블록 번호가 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth에서 한 실행 데이터 묶음이 검증, 실행, 정본 반영, 저장, 조회되는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid gap-3 px-1 py-2 lg:grid-cols-[11.5rem_minmax(0,1fr)]">
          <aside className="min-w-0 border border-border bg-background p-3" aria-label="Ethereum 클라이언트 역할 경계">
            <p className="text-[10px] font-black text-primary">합의 클라이언트</p>
            <p className="mt-1 break-keep text-xs font-bold leading-5">정본 선택 · 최종 확정</p>
            <div className="my-3 border-t border-dashed border-border" />
            <p className="text-[10px] font-black text-primary">Reth · 실행 클라이언트</p>
            <p className="mt-1 break-keep text-xs font-bold leading-5">검증 · EVM · 상태 · 조회</p>
            <p className="mt-3 break-keep text-[10px] leading-4 text-muted-foreground">경계 프로토콜 · Engine API</p>
          </aside>

          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6" aria-label="Reth 블록 처리 단계">
              {STAGES.map(([label, detail], index) => {
                const passed = active > 0 && index < currentStage;
                const current = active > 0 && index === currentStage;
                return (
                  <div key={label} className={`min-w-0 bg-background px-2 py-3 ${current ? "text-foreground" : "text-muted-foreground"}`}>
                    <span className={`mb-2 block h-1 w-8 ${current ? "bg-primary" : passed ? "bg-primary/35" : "bg-border"}`} />
                    <strong className="block break-keep text-xs">{label}</strong>
                    <span className="mt-1 block break-keep text-[9px] leading-4 sm:text-[10px]">{detail}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="min-w-0 bg-background px-3 py-3">
                <p className="text-[10px] font-bold text-muted-foreground">현재 장면</p>
                <p className="mt-1 break-keep text-sm font-black">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</p>
              </div>
              <div className="min-w-0 bg-background px-3 py-3">
                <p className="text-[10px] font-bold text-muted-foreground">같은 블록에 이어 붙인 증거</p>
                <p className="mt-1 break-words font-mono text-xs font-bold leading-5">{RECEIPTS[active][0]} · {RECEIPTS[active][1]}</p>
              </div>
            </div>
          </div>
        </div>

        <p data-scene-note className="mx-1 mt-2 min-h-28 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-16 sm:pl-4 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["경계", "요청", "검증", "실행", "정본", "저장", "조회"]}
          playLabel="블록 처리 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function RethTwoPathViz() {
  const paths = [
    ["과거 동기화", "P2P에서 긴 블록 구간 수신", "단계별 체크포인트 · 되돌리기", "검증·EVM·저장"],
    ["실시간 처리", "Engine API에서 head 주변 실행 데이터 수신", "newPayload · forkchoiceUpdated", "검증·EVM·저장"],
  ] as const;

  return (
    <VizFrame
      eyebrow="두 입력 · 한 실행 규칙"
      title="과거를 채우는 경로와 최신 head를 처리하는 경로는 따로 시작해 같은 실행 규칙으로 합류합니다"
      description="입력·진척·되돌리기 방식은 다르지만 같은 블록과 부모 상태라면 실행 결과와 상태 루트가 같아야 합니다."
    >
      <div className="grid gap-px bg-border p-px lg:grid-cols-2" aria-label="Reth 과거 동기화와 실시간 Engine 경로 비교">
        {paths.map(([title, input, control, common], index) => (
          <section key={title} className="min-w-0 bg-background p-4 sm:p-5">
            <p className="font-mono text-[10px] font-black text-primary">경로 {String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 break-keep text-base font-bold">{title}</h3>
            <dl className="mt-4 grid gap-3 text-xs leading-5">
              <div><dt className="font-bold text-muted-foreground">시작</dt><dd className="mt-1 break-keep">{input}</dd></div>
              <div><dt className="font-bold text-muted-foreground">진척·복구</dt><dd className="mt-1 break-keep">{control}</dd></div>
              <div><dt className="font-bold text-muted-foreground">합류점</dt><dd className="mt-1 break-keep font-semibold">{common}</dd></div>
            </dl>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}

export function RethReorgViz() {
  const rows = [
    ["이전 정본", "공통 조상", "이전 블록", "이전 head", "파생 상태를 역순으로 되돌림"],
    ["새 정본", "공통 조상", "새 블록 1", "새 head", "새 분기를 다시 실행하고 조회 시점 교체"],
  ] as const;

  return (
    <VizFrame
      eyebrow="시스템 자체의 변화 · 분기 재편"
      title="Head가 바뀌면 포인터만 옮기지 않고 이전 파생 결과를 되돌린 뒤 새 분기를 계산합니다"
      description="두 분기가 갈라진 공통 조상까지 돌아가 상태·영수증·트라이·색인을 같은 순서로 다시 맞춥니다."
    >
      <div className="grid gap-3" aria-label="Reth 분기 재편에서 이전 분기를 되돌리고 새 분기를 실행하는 과정">
        {rows.map(([label, base, middle, head, action], rowIndex) => (
          <section key={label} className="grid min-w-0 gap-2 border-y border-border py-3 sm:grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
            <strong className="text-xs text-primary">{label}</strong>
            {[base, middle, head].map((item, index) => (
              <div key={item} className={`min-w-0 border px-3 py-2 text-center text-xs font-semibold ${rowIndex === 0 && index > 0 ? "border-border text-muted-foreground line-through decoration-destructive/60" : "border-primary/35 bg-primary/[0.035]"}`}>
                {item}
              </div>
            ))}
            <p className="break-keep text-[11px] leading-5 text-muted-foreground sm:col-start-2 sm:col-span-3">{rowIndex === 0 ? "① " : "② "}{action}</p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
