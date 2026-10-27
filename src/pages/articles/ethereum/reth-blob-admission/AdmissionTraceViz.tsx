import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const labels = [
  "제출",
  "Stateless",
  "State 조회",
  "Account",
  "Sidecar",
  "Outcome",
  "Pool",
] as const;

const notes = [
  "외부에서 들어온 T₀는 type-3 transaction과 v0 sidecar 한 개를 함께 가집니다. 아직 유효하거나 Pool에 들어갔다고 말할 수 없습니다.",
  "Reth는 fork, transaction 동적 크기, gas·fee 관계, chain id, intrinsic gas와 Blob 개수를 state 조회 없이 먼저 확인합니다.",
  "Stateless 통과 뒤에만 최신 account state provider를 얻습니다. 이 조회가 실패하면 transaction 위반인 Invalid가 아니라 검증 의존성 실패인 Error입니다.",
  "같은 state snapshot에서 sender bytecode, nonce와 balance를 확인합니다. T₀의 nonce 7과 state nonce 7, max cost와 balance의 관계가 여기서 판정됩니다.",
  "새 제출인 Present sidecar는 활성 fork에 맞는 version인지 확인한 뒤 transaction reference 결속과 KZG proof를 검증합니다.",
  "모든 검사를 통과한 새 Blob 제출은 ValidWithSidecar가 됩니다. 규칙 위반은 Invalid, provider 장애는 Error로 남습니다.",
  "Valid는 insertion 시도 자격입니다. Pool 규칙과 capacity 적용 뒤 살아남은 transaction의 sidecar를 write lock 밖에서 BlobStore로 넘깁니다.",
] as const;

function Stage({
  number,
  title,
  detail,
  state,
}: {
  number: number;
  title: string;
  detail: string;
  state: "future" | "current" | "done";
}) {
  return (
    <div
      className={`min-w-0 border p-3 transition-colors duration-300 ${
        state === "current"
          ? "border-primary bg-primary/5"
          : state === "done"
            ? "border-primary/35 bg-background"
            : "border-border bg-background text-muted-foreground/65"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <strong className="break-keep text-xs">{title}</strong>
        <span className="font-mono text-[9px] font-black text-primary">
          {String(number + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function MobileCard({
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
      <span className="text-[8px] font-black tracking-[0.12em] text-muted-foreground">
        {eyebrow}
      </span>
      <h4 className="mt-1 break-keep text-sm font-bold">{title}</h4>
      <dl className="mt-3 grid gap-px bg-border p-px text-[10px] leading-4">
        {rows.map(([term, description]) => (
          <div key={term} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2 bg-background px-2 py-2">
            <dt className="font-bold text-primary">{term}</dt>
            <dd className="break-keep text-muted-foreground">{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function AdmissionTraceViz() {
  const scenes = useAnimatedScenes(labels.length, 9000, { loop: false });
  const active = scenes.active;
  const status = (step: number) =>
    active === step ? "current" : active > step ? "done" : "future";

  const mobileScenes: readonly ReactNode[] = [
    <MobileCard
      key="input"
      eyebrow="EXTERNAL SUBMISSION"
      title="T₀ · 새 Blob transaction"
      rows={[
        ["Transaction", "type 3 · nonce 7 · Blob reference 1개"],
        ["Sidecar", "v0 · Blob·commitment·proof 각 1개"],
        ["현재 상태", "아직 미검증 · 미삽입"],
      ]}
    />,
    <MobileCard
      key="stateless"
      eyebrow="VALIDATE_STATELESS"
      title="State 없이 끝낼 수 있는 검사"
      rows={[
        ["Fork·type", "EIP-4844와 Cancun 활성 여부"],
        ["형식·비용", "동적 크기 · gas · fee · chain id · intrinsic gas"],
        ["Blob count", "1개 이상 · fork별 상한 이하"],
      ]}
    />,
    <MobileCard
      key="provider"
      eyebrow="STATE PROVIDER"
      title="통과한 요청만 최신 state를 읽습니다"
      rows={[
        ["성공", "Account snapshot을 stateful 검사에 전달"],
        ["실패", "Transaction Invalid가 아니라 Error"],
        ["이유", "입력 위반과 노드 의존성 장애를 분리"],
      ]}
    />,
    <MobileCard
      key="account"
      eyebrow="VALIDATE_STATEFUL"
      title="T₀와 sender account를 비교합니다"
      rows={[
        ["Bytecode", "허용된 sender 형태인지 확인"],
        ["Nonce", "T₀ 7 · state 7"],
        ["Balance", "transaction.cost() 이하인지 확인"],
      ]}
    />,
    <MobileCard
      key="sidecar"
      eyebrow="VALIDATE_EIP4844"
      title="Present sidecar의 결속과 proof를 검증합니다"
      rows={[
        ["Version", "활성 fork에 맞는 v0/v1"],
        ["Binding", "Transaction reference ↔ commitment"],
        ["KZG", "Blob·commitment·proof"],
      ]}
    />,
    <MobileCard
      key="outcome"
      eyebrow="TYPED OUTCOME"
      title="성공과 두 실패를 섞지 않습니다"
      rows={[
        ["Valid", "현재 head에서 insertion 시도 가능"],
        ["Invalid", "Transaction 규칙 위반"],
        ["Error", "Provider 등 검증 의존성 실패"],
      ]}
    />,
    <MobileCard
      key="pool"
      eyebrow="POOL INSERTION"
      title="Valid 뒤에도 실제 삽입 단계가 남습니다"
      rows={[
        ["Pool", "중복·replacement·ordering 규칙 적용"],
        ["Capacity", "batch 뒤 discard_worst로 상한 적용"],
        ["Sidecar", "살아남은 후보를 BlobStore에 전달"],
      ]}
    />,
  ];

  return (
    <VizFrame
      className="scroll-mt-20"
      eyebrow="개념 경로 · T₀ 한 건의 입장 검사"
      title="Validator의 Valid와 실제 Pool 삽입을 분리해 따라갑니다"
      description="새 Blob transaction T₀가 값싼 검사, state, sidecar 검증과 typed outcome을 지나 Pool에 들어가는 순서입니다."
      note="T₀의 nonce와 금액은 흐름을 고정하기 위한 설명용 값입니다. 실제 limit·fork·state는 선택한 node 설정과 head에서 읽습니다."
      canvasClassName="flex flex-col justify-center px-2 py-0 sm:px-5 sm:py-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-blob-admission-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth가 Blob transaction 한 건을 검사하고 Pool에 넣는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="sm:hidden">
          <div className="grid grid-cols-7 gap-1" aria-label="Blob admission의 일곱 단계">
            {labels.map((label, index) => (
              <div key={label} className="min-w-0 text-center">
                <span className={`block h-1 ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
                <span className={`mt-1 block font-mono text-[8px] font-black ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex min-h-60 items-center">
            <div className="w-full">{mobileScenes[active]}</div>
          </div>
        </div>

        <div className="hidden gap-3 border border-border bg-background p-3 sm:grid">
          <div className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-stretch gap-3">
            <section className="grid gap-2" aria-label="Transaction과 account 검사">
              <p className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">TRANSACTION VALIDATOR</p>
              <Stage number={0} title="T₀ · 제출" detail="type 3 · nonce 7 · v0 sidecar" state={status(0)} />
              <Stage number={1} title="Stateless" detail="fork · size · gas · fee · chain · Blob count" state={status(1)} />
              <Stage number={2} title="State provider" detail="latest account snapshot · 실패하면 Error" state={status(2)} />
              <Stage number={3} title="Account" detail="bytecode · nonce · balance" state={status(3)} />
            </section>

            <div className="flex items-center justify-center" aria-hidden>
              <span className={`text-2xl transition-colors ${active >= 4 ? "text-primary" : "text-muted-foreground/30"}`}>→</span>
            </div>

            <section className="grid gap-2" aria-label="Blob 검증과 Pool 삽입">
              <p className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">BLOB · POOL BOUNDARY</p>
              <Stage number={4} title="Sidecar" detail="version · reference binding · KZG proof" state={status(4)} />
              <Stage number={5} title="Typed outcome" detail="ValidWithSidecar · Invalid · Error" state={status(5)} />
              <Stage number={6} title="Pool insertion" detail="add · discard_worst · BlobStore 전달" state={status(6)} />
              <div className="grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4">
                <div className={`bg-background px-1 py-2 ${active >= 5 ? "opacity-100" : "opacity-45"}`}><strong className="block text-emerald-700">VALID</strong><span>현재 head</span></div>
                <div className={`bg-background px-1 py-2 ${active >= 1 ? "opacity-100" : "opacity-45"}`}><strong className="block text-amber-700">INVALID</strong><span>규칙 위반</span></div>
                <div className={`bg-background px-1 py-2 ${active >= 2 ? "opacity-100" : "opacity-45"}`}><strong className="block text-rose-700">ERROR</strong><span>조회 실패</span></div>
              </div>
            </section>
          </div>
        </div>

        <p data-scene-note className="mt-2 min-h-20 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-14 sm:pl-4 sm:text-sm sm:leading-6">
          <strong className="mb-1 block font-mono text-[9px] text-primary">
            {String(active + 1).padStart(2, "0")}/{String(labels.length).padStart(2, "0")} · {labels[active]}
          </strong>
          {notes[active]}
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={labels}
          controlLabels={["제출", "형식", "조회", "계정", "Blob", "결과", "Pool"]}
          playLabel="Blob admission 경로 재생"
          className="mt-0 sm:!min-h-0 sm:!border-t-0 sm:!pt-2 [&>p]:hidden [&_[data-viz-desktop-controls]]:gap-1 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button]:py-1 [&_[data-viz-desktop-controls]>button:last-child]:w-20"
        />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
