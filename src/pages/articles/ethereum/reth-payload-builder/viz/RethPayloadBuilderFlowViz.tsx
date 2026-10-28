import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const labels = [
  "요청",
  "검증",
  "Job",
  "선택",
  "실행",
  "개선",
  "반환",
] as const;

const notes = [
  "합의 클라이언트가 forkchoice head와 payload attributes를 보냅니다. Attributes에는 다음 block의 timestamp, fee recipient, prevRandao와 포크별 필드가 들어 있습니다.",
  "Reth는 Engine API 버전과 활성 fork, 그리고 head timestamp보다 큰지 확인합니다. 잘못된 attributes면 forkchoice 갱신과 후보 build 시작을 분리해 처리합니다.",
  "검증을 통과하면 parent와 attributes로 8-byte payloadId를 계산하고 active job을 등록합니다. Job은 parent header, attributes, deadline과 build resource lease를 소유합니다.",
  "첫 build 시도는 현재 txpool에서 base fee와 blob fee 조건에 맞는 best transaction iterator를 새로 얻습니다. Job이 txpool 세대 하나를 끝까지 얼려 두는 구조가 아닙니다.",
  "거래를 순서대로 EVM에 실행합니다. Gas·blob 수·block size를 따로 검사하고 성공한 state change, receipt, actual gas와 tip만 임시 후보에 누적합니다.",
  "다음 interval에는 pool을 다시 읽어 새 후보를 처음부터 만들 수 있습니다. 수수료 합이 기존 best보다 크면 교체하고, 작으면 기존 후보를 유지합니다.",
  "getPayload는 같은 payloadId의 timestamp와 fork 버전을 검사한 뒤 job을 resolve합니다. 준비된 best가 없으면 설정에 따라 진행 중 build를 기다리거나 empty payload와 경쟁합니다.",
] as const;

function MobileScene({
  eyebrow,
  title,
  rows,
}: {
  eyebrow: string;
  title: string;
  rows: readonly [string, string][];
}) {
  return (
    <section className="border border-primary p-3">
      <span className="font-mono text-[8px] font-black tracking-[0.12em] text-primary">{eyebrow}</span>
      <h4 className="mt-1 break-keep text-sm font-bold">{title}</h4>
      <dl className="mt-3 grid gap-px bg-border p-px text-[10px] leading-4">
        {rows.map(([term, description]) => (
          <div key={term} className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-2 bg-background px-2 py-2">
            <dt className="font-bold text-primary">{term}</dt>
            <dd className="break-keep text-muted-foreground">{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Stage({
  title,
  detail,
  value,
  active,
}: {
  title: string;
  detail: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className={`min-w-0 border px-3 py-3 transition-colors duration-300 ${active ? "border-primary bg-primary/5" : "border-border bg-background text-muted-foreground/65"}`}>
      <strong className="block break-keep text-xs">{title}</strong>
      <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{detail}</span>
      <code className="mt-2 block break-all text-[9px] text-primary">{value}</code>
    </div>
  );
}

export default function RethPayloadBuilderFlowViz() {
  const scenes = useAnimatedScenes(labels.length, 9200, { loop: false });
  const active = scenes.active;

  const mobileScenes: readonly ReactNode[] = [
    <MobileScene key="request" eyebrow="ENGINE_FORKCHOICEUPDATED" title="다음 block을 만들 조건이 들어옵니다" rows={[["Head", "parent block hash"], ["Attributes", "timestamp · recipient · randao"], ["결과", "아직 payload 없음"]]} />,
    <MobileScene key="validate" eyebrow="TWO VALIDATION GATES" title="포크와 parent 문맥을 먼저 확인합니다" rows={[["API", "version별 attributes"], ["Tree", "timestamp > head timestamp"], ["실패", "build 시작 안 함"]]} />,
    <MobileScene key="job" eyebrow="PAYLOAD SERVICE" title="ID와 active job이 연결됩니다" rows={[["ID", "SHA-256 입력의 앞 8 byte"], ["고정", "parent · attributes"], ["Job", "deadline · resources"]]} />,
    <MobileScene key="select" eyebrow="CURRENT TXPOOL VIEW" title="Build 시도마다 pool iterator를 얻습니다" rows={[["입력", "base fee · blob fee"], ["순서", "best transactions"], ["주의", "pool generation 고정 아님"]]} />,
    <MobileScene key="execute" eyebrow="TEMPORARY BLOCK STATE" title="성공한 실행만 후보에 누적합니다" rows={[["Budget", "gas · blob · RLP 각각"], ["EVM", "state diff · receipt"], ["Value", "Σ tip × actual gas"]]} />,
    <MobileScene key="improve" eyebrow="INTERVAL REBUILD" title="더 나은 후보만 best를 바꿉니다" rows={[["새 시도", "현재 pool 다시 조회"], ["Better", "best payload 교체"], ["Aborted", "기존 best 유지"]]} />,
    <MobileScene key="resolve" eyebrow="ENGINE_GETPAYLOAD" title="같은 ID의 최선 후보를 반환합니다" rows={[["검사", "timestamp · API version"], ["Resolve", "best 또는 fallback"], ["경계", "canonical 확정 아님"]]} />,
  ];

  return (
    <VizFrame
      eyebrow="개념 경로 · 한 Engine API 요청"
      title="요청은 job이 되고, job은 pool을 반복해서 읽어 후보를 개선합니다"
      description="forkchoiceUpdated 한 건이 getPayload 응답이 되기까지 실제 상태 소유권과 데이터 변화를 일곱 장면으로 따라갑니다."
      note="표시한 거래 수와 금액은 메커니즘 설명용 fixture입니다. Reth v2.8.1의 기본 timeout이나 mainnet 성능 측정값이 아닙니다."
      canvasClassName="flex flex-col justify-center px-2 py-0 sm:px-5 sm:py-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-payload-builder-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth Payload Builder가 forkchoice 요청을 후보 block으로 만드는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="sm:hidden">
          <div className="grid grid-cols-7 gap-1" aria-label="Payload Builder의 일곱 단계">
            {labels.map((label, index) => (
              <div key={label} className="min-w-0 text-center">
                <span className={`block h-1 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
                <span className={`mt-1 block font-mono text-[8px] font-black ${index === active ? "text-foreground" : "text-muted-foreground"}`}>{String(index + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex h-72 items-center"><div className="w-full">{mobileScenes[active]}</div></div>
        </div>

        <div className="hidden border border-border bg-background p-3 sm:block">
          <div className="grid grid-cols-7 gap-1">
            {labels.map((label, index) => (
              <div key={label} className={`min-w-0 border-t-2 px-1 py-2 text-center text-[9px] font-bold ${index === active ? "border-primary text-foreground" : index < active ? "border-primary/35 text-muted-foreground" : "border-border text-muted-foreground/55"}`}>
                {String(index + 1).padStart(2, "0")} · {label}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-2">
            <Stage title="Engine boundary" detail={active < 1 ? "요청 수신" : active < 6 ? "payloadId 반환" : "getPayload 호출"} value={active < 6 ? "forkchoiceUpdated(attrs)" : "getPayload(id)"} active={active <= 1 || active === 6} />
            <span className="text-center text-primary" aria-hidden>→</span>
            <Stage title="Payload service · job" detail={active < 2 ? "아직 등록 전" : active < 5 ? "active · 반복 build" : active < 6 ? "best 교체" : "resolve 후 제거"} value={active < 2 ? "—" : "id → {config, best, deadline}"} active={active === 2 || active === 5 || active === 6} />
            <span className="text-center text-primary" aria-hidden>→</span>
            <Stage title="Builder · temporary state" detail={active < 3 ? "실행 전" : active < 4 ? "현재 pool iterator" : active < 5 ? "EVM 실행 중" : "best candidate 보관"} value={active < 3 ? "—" : active === 3 ? "best_txs(base_fee, blob_fee)" : "block + receipts + fees"} active={active >= 3} />
          </div>
          <div className="mt-3 grid gap-px bg-border p-px text-[10px] leading-4 sm:grid-cols-4">
            {[
              ["고정되는 것", "parent · attributes · payloadId"],
              ["다시 읽는 것", "각 build 시도의 current txpool"],
              ["임시 상태", "candidate state · receipts · fees"],
              ["확정이 아닌 것", "canonical block · proposer 채택"],
            ].map(([title, body]) => <div key={title} className="bg-background px-3 py-2"><strong>{title}</strong><span className="mt-1 block text-muted-foreground">{body}</span></div>)}
          </div>
        </div>

        <p data-scene-note className="mt-2 h-28 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:h-auto sm:min-h-14 sm:pl-4 sm:text-sm sm:leading-6">
          <strong className="mb-1 block font-mono text-[9px] text-primary">{String(active + 1).padStart(2, "0")}/{String(labels.length).padStart(2, "0")} · {labels[active]}</strong>
          {notes[active]}
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={labels}
          controlLabels={["요청", "검증", "Job", "선택", "실행", "개선", "반환"]}
          playLabel="Payload Builder 경로 재생"
          className="mt-0 sm:!min-h-0 sm:!border-t-0 sm:!pt-2 [&>p]:hidden [&_[data-viz-desktop-controls]]:gap-1 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button]:py-1 [&_[data-viz-desktop-controls]>button:last-child]:w-20"
        />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
