import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const primary = "var(--primary)";
const border = "var(--border)";

function Lesson({
  id,
  title,
  description,
  labels,
  notes,
  children,
}: {
  id: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 3200);
  return (
    <VizFrame title={title} description={description} className="my-9">
      <div
        id={id}
        data-viz
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
          Animated lesson · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7">
          {labels[controls.active]}
        </h3>
        <div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">
          {children(controls.active)}
        </div>
        <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
          {notes[controls.active]}
        </p>
        <AnimatedSceneControls labels={labels} {...controls} />
      </div>
    </VizFrame>
  );
}

function Box({
  x,
  y,
  width,
  label,
  detail,
  active,
  dashed = false,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  detail: string;
  active: boolean;
  dashed?: boolean;
}) {
  return (
    <motion.g initial={false} animate={{ opacity: active ? 1 : 0.2 }}>
      <rect
        x={x}
        y={y}
        width={width}
        height="58"
        rx="8"
        fill={active ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "var(--background)"}
        stroke={active ? primary : border}
        strokeWidth="1.25"
        strokeDasharray={dashed ? "5 5" : undefined}
      />
      <text x={x + width / 2} y={y + 23} textAnchor="middle" className="fill-foreground text-[11px] font-bold">
        {label}
      </text>
      <text x={x + width / 2} y={y + 42} textAnchor="middle" className="fill-muted-foreground text-[9px]">
        {detail}
      </text>
    </motion.g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  active,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  id: string;
}) {
  return (
    <g opacity={active ? 1 : 0.2}>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0L7 3.5L0 7Z" fill={active ? primary : "var(--muted-foreground)"} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? primary : "var(--muted-foreground)"} strokeWidth="1.25" markerEnd={`url(#${id})`} />
    </g>
  );
}

export function BlobBoundaryViz() {
  const labels = [
    "Blob",
    "KZG",
    "Reference",
    "두 기록",
    "검증",
    "구현 경계",
  ] as const;
  const notes = [
    "설명용 롤업 배치 하나를 4096개의 32-byte slot에 넣습니다. 결과인 Blob B₀의 길이는 131,072 bytes입니다.",
    "B₀에서 48-byte commitment C₀와 48-byte proof π₀를 만듭니다. C₀는 압축본이 아니므로 B₀를 복원할 수 없습니다.",
    "C₀를 SHA-256으로 줄이고 첫 byte를 0x01로 바꿔 32-byte versioned hash h₀를 만듭니다.",
    "Type-3 transaction은 h₀와 fee 조건을 기록합니다. Sidecar의 index 0은 B₀·C₀·π₀를 운반합니다.",
    "목록 수, h₀와 C₀의 결속, B₀·C₀·π₀의 KZG proof가 모두 맞아야 같은 제출로 인정합니다.",
    "Reth v2.8.1의 Pool validator가 transaction과 sidecar를 Alloy v2.5.0에 넘깁니다. 성공한 sidecar만 저장 단계로 이어집니다.",
  ] as const;
  const scenes = useAnimatedScenes(labels.length, 9000, { loop: false });
  const active = scenes.active;
  const reached = (step: number) => active >= step;
  const current = (step: number) => active === step;
  const mobileScenes: readonly ReactNode[] = [
    <section key="blob" className="border border-primary p-3" aria-label="Blob B₀의 크기와 slot 구조">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <span className="block text-[8px] font-black tracking-[0.12em] text-muted-foreground">ROLLUP BATCH</span>
          <strong className="mt-1 block text-sm">Blob B₀</strong>
        </div>
        <span className="font-mono text-[10px] font-bold text-primary">131,072 B</span>
      </div>
      <div className="mt-3 grid grid-cols-8 gap-1" aria-hidden>
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} className={`h-4 border ${index % 5 === 0 ? "border-primary/70 bg-primary/20" : "border-primary/25 bg-primary/5"}`} />
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">32-byte slot × 4096</p>
    </section>,
    <section key="kzg" className="grid gap-2" aria-label="Blob B₀에서 만든 KZG commitment와 proof">
      <div className="border border-border px-3 py-2 text-center font-mono text-[10px] text-muted-foreground">Blob B₀</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-primary p-3">
          <span className="block text-[8px] font-black text-muted-foreground">COMMITMENT</span>
          <strong className="mt-1 block text-sm">C₀</strong>
          <span className="text-[10px] text-muted-foreground">48 bytes</span>
        </div>
        <div className="border border-primary p-3">
          <span className="block text-[8px] font-black text-muted-foreground">PROOF</span>
          <strong className="mt-1 block text-sm">π₀</strong>
          <span className="text-[10px] text-muted-foreground">48 bytes</span>
        </div>
      </div>
    </section>,
    <section key="hash" className="grid grid-cols-[1fr_auto_1fr] items-center gap-2" aria-label="Commitment C₀에서 versioned hash h₀를 만드는 과정">
      <div className="border border-border p-3 text-center">
        <span className="block text-[8px] font-black text-muted-foreground">COMMITMENT</span>
        <strong className="mt-1 block text-sm">C₀</strong>
        <span className="text-[9px] text-muted-foreground">48 B</span>
      </div>
      <span className="text-primary" aria-hidden>→</span>
      <div className="border border-primary p-3 text-center">
        <span className="block text-[8px] font-black text-muted-foreground">VERSIONED HASH</span>
        <strong className="mt-1 block text-sm">h₀</strong>
        <span className="text-[9px] text-muted-foreground">32 B</span>
      </div>
      <p className="col-span-3 border-t border-border pt-3 text-center font-mono text-[9px] leading-4 text-muted-foreground">
        h₀ = 0x01 ‖ SHA-256(C₀)[1:]
      </p>
    </section>,
    <section key="records" className="grid grid-cols-2 gap-2" aria-label="Transaction과 sidecar의 두 기록">
      <div className="min-w-0 border border-primary p-2.5">
        <span className="block text-[8px] font-black text-muted-foreground">TRANSACTION</span>
        <strong className="mt-1 block text-xs">h₀ · Blob fee</strong>
        <p className="mt-2 break-keep text-[9px] leading-4 text-muted-foreground">실행 payload가 참조할 Blob을 남깁니다.</p>
      </div>
      <div className="min-w-0 border border-primary p-2.5">
        <span className="block text-[8px] font-black text-muted-foreground">SIDECAR · INDEX 0</span>
        <strong className="mt-1 block text-xs">B₀ · C₀ · π₀</strong>
        <p className="mt-2 break-keep text-[9px] leading-4 text-muted-foreground">원문과 검증 witness를 운반합니다.</p>
      </div>
    </section>,
    <section key="validation" className="grid gap-1.5" aria-label="Transaction과 sidecar를 결속하는 세 검사">
      {[
        ["01", "개수·순서", "hash 1 · Blob 1 · C 1 · proof 1"],
        ["02", "Reference", "h₀ = versioned_hash(C₀)"],
        ["03", "KZG proof", "verify(B₀, C₀, π₀) = true"],
      ].map(([number, title, detail]) => (
        <div key={number} className="grid grid-cols-[2rem_5rem_minmax(0,1fr)] items-center border border-border px-2 py-2">
          <span className="font-mono text-[8px] font-black text-primary">{number}</span>
          <strong className="text-[10px]">{title}</strong>
          <span className="break-all font-mono text-[8px] leading-3 text-muted-foreground">{detail}</span>
        </div>
      ))}
    </section>,
    <section key="owners" className="grid grid-cols-3 gap-px bg-border p-px text-center" aria-label="Reth와 Alloy의 구현 경계">
      {[
        ["RETH", "Pool validator", "전달"],
        ["ALLOY", "sidecar.validate", "검증"],
        ["SUCCESS", "BlobStore", "저장"],
      ].map(([owner, name, job]) => (
        <div key={owner} className="min-w-0 bg-background px-1.5 py-4">
          <span className="block text-[8px] font-black text-muted-foreground">{owner}</span>
          <strong className="mt-1 block break-all text-[9px]">{name}</strong>
          <span className="mt-1 block text-[8px] text-primary">{job}</span>
        </div>
      ))}
    </section>,
  ];

  return (
    <VizFrame
      className="scroll-mt-20"
      eyebrow="개념 경로 · Blob 하나의 제출"
      title="한 Blob을 두 기록으로 나눈 뒤 세 검사로 다시 묶습니다"
      description="같은 B₀·C₀·h₀·π₀를 유지한 채 생성, 분리, 결속 검증과 구현 owner를 따라갑니다."
      note="B₀·C₀·h₀·π₀는 이 글의 설명용 식별자입니다. 크기는 EIP-4844 규격값이며 실제 bytes와 hash 값은 생략합니다."
      canvasClassName="flex flex-col justify-center px-2 py-0 sm:px-5 sm:py-0"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-eip4844-scene={active}
        tabIndex={0}
        role="group"
        aria-label="한 Blob을 transaction 참조와 sidecar로 나누고 다시 검증하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="sm:hidden">
          <div className="grid grid-cols-6 gap-1" aria-label="Blob 제출의 여섯 단계">
            {labels.map((label, index) => (
              <div key={label} className="min-w-0 text-center">
                <span className={`mx-auto block h-1 w-full ${index === active ? "bg-primary" : index < active ? "bg-primary/35" : "bg-border"}`} />
                <span className={`mt-1 block font-mono text-[8px] font-black ${index === active ? "text-foreground" : "text-muted-foreground"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex min-h-48 items-center border border-border bg-background p-2">
            <div className="w-full">{mobileScenes[active]}</div>
          </div>
        </div>

        <div className="hidden gap-2 border border-border bg-background p-3 sm:grid">
          <div className="grid grid-cols-[minmax(0,.9fr)_1.5rem_minmax(0,1.1fr)] items-stretch gap-2">
            <section
              className={`min-w-0 border p-2.5 transition-colors ${
                current(0) ? "border-primary" : "border-border"
              }`}
              aria-label="Blob 원문"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <div>
                  <span className="block text-[9px] font-black tracking-[0.12em] text-muted-foreground">
                    ROLLUP BATCH
                  </span>
                  <strong className="mt-0.5 block text-sm">Blob B₀</strong>
                </div>
                <span className="font-mono text-[10px] font-bold text-primary">
                  131,072 B
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-4 gap-1" aria-label="4096개 slot을 축약해 그린 구조">
                {Array.from({ length: 16 }, (_, index) => (
                  <span
                    key={index}
                    className={`h-3 border transition-colors sm:h-4 ${
                      reached(0)
                        ? index % 5 === 0
                          ? "border-primary/70 bg-primary/20"
                          : "border-primary/25 bg-primary/5"
                        : "border-border"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
                32 B slot × 4096
              </p>
            </section>

            <div className="flex items-center justify-center text-muted-foreground" aria-hidden>
              <span className={`text-2xl transition-colors ${reached(1) ? "text-primary" : "text-muted-foreground/30"}`}>
                →
              </span>
            </div>

            <section className="grid min-w-0 grid-rows-3 gap-1.5" aria-label="Blob에서 파생한 KZG 값과 transaction 참조">
              <div
                className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border px-2 py-1.5 transition-colors ${
                  current(1) ? "border-primary" : "border-border"
                } ${reached(1) ? "opacity-100" : "opacity-45"}`}
              >
                <div className="min-w-0">
                  <span className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">
                    COMMITMENT
                  </span>
                  <strong className="block break-keep text-[11px]">C₀ · Blob을 약속</strong>
                </div>
                <span className="font-mono text-[10px] font-bold">48 B</span>
              </div>
              <div
                className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border px-2 py-1.5 transition-colors ${
                  current(1) ? "border-primary" : "border-border"
                } ${reached(1) ? "opacity-100" : "opacity-45"}`}
              >
                <div className="min-w-0">
                  <span className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">
                    PROOF
                  </span>
                  <strong className="block break-keep text-[11px]">π₀ · 결속을 증명</strong>
                </div>
                <span className="font-mono text-[10px] font-bold">48 B</span>
              </div>
              <div
                className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border px-2 py-1.5 transition-colors ${
                  current(2) ? "border-primary" : "border-border"
                } ${reached(2) ? "opacity-100" : "opacity-45"}`}
              >
                <div className="min-w-0">
                  <span className="text-[9px] font-black tracking-[0.12em] text-muted-foreground">
                    VERSIONED HASH
                  </span>
                  <strong className="block break-all font-mono text-[10px]">h₀ = 0x01 ‖ SHA-256(C₀)[1:]</strong>
                </div>
                <span className="font-mono text-[10px] font-bold text-primary">32 B</span>
              </div>
            </section>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <section
              className={`min-w-0 border p-2.5 transition-colors ${
                current(3) ? "border-primary" : "border-border"
              } ${reached(3) ? "opacity-100" : "opacity-45"}`}
              aria-label="Type-3 transaction에 남는 값"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <strong className="text-xs">Type-3 transaction</strong>
                <span className="text-[8px] font-black text-primary">REFERENCE</span>
              </div>
              <div className="mt-2 grid gap-px bg-border p-px font-mono text-[9px] leading-4">
                <span className="break-all bg-background px-2 py-1">max_fee_per_blob_gas</span>
                <span className="break-all bg-background px-2 py-1 font-bold">blob_versioned_hashes[0] = h₀</span>
              </div>
              <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
                B₀ 원문은 transaction body에 들어가지 않습니다.
              </p>
            </section>

            <section
              className={`min-w-0 border p-2.5 transition-colors ${
                current(3) ? "border-primary" : "border-border"
              } ${reached(3) ? "opacity-100" : "opacity-45"}`}
              aria-label="Sidecar에 실리는 값"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                <strong className="text-xs">Blob sidecar</strong>
                <span className="text-[8px] font-black text-primary">DATA + WITNESS</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px text-center font-mono text-[8px] leading-4 sm:text-[9px]">
                <span className="break-all bg-background px-1 py-1 font-bold">blobs[0]<br />B₀</span>
                <span className="break-all bg-background px-1 py-1 font-bold">commitments[0]<br />C₀</span>
                <span className="break-all bg-background px-1 py-1 font-bold">proofs[0]<br />π₀</span>
              </div>
              <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
                같은 index 0이 한 제출의 세 값을 연결합니다.
              </p>
            </section>
          </div>

          <section
            className={`border p-2 transition-colors ${
              current(4) ? "border-primary" : "border-border"
            } ${reached(4) ? "opacity-100" : "opacity-45"}`}
            aria-label="Transaction과 sidecar를 결속하는 세 검사"
          >
            <div className="grid grid-cols-3 gap-px bg-border p-px">
              {[
                ["01", "개수·순서", "hash 1 · Blob 1 · C 1 · proof 1"],
                ["02", "Reference", "h₀ = versioned_hash(C₀)"],
                ["03", "KZG proof", "verify(B₀, C₀, π₀) = true"],
              ].map(([number, title, detail]) => (
                <div key={number} className="min-w-0 bg-background px-2 py-1.5">
                  <span className="font-mono text-[8px] font-black text-primary">{number}</span>
                  <strong className="ml-1 text-[10px]">{title}</strong>
                  <span className="mt-0.5 block break-all font-mono text-[8px] leading-3 text-muted-foreground sm:text-[9px] sm:leading-4">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div
            className={`grid grid-cols-3 gap-px bg-border p-px text-center transition-opacity ${
              reached(5) ? "opacity-100" : "opacity-45"
            }`}
            aria-label="Reth와 Alloy의 구현 경계"
          >
            <div className="bg-background px-2 py-1.5">
              <span className="block text-[8px] font-black text-muted-foreground">RETH v2.8.1</span>
              <strong className="mt-0.5 block text-[10px]">Pool validator</strong>
              <span className="block text-[8px] leading-3 text-muted-foreground">transaction + sidecar</span>
            </div>
            <div className="bg-background px-2 py-1.5">
              <span className="block text-[8px] font-black text-muted-foreground">ALLOY v2.5.0</span>
              <strong className="mt-0.5 block break-all text-[10px] text-primary">sidecar.validate</strong>
              <span className="block text-[8px] leading-3 text-muted-foreground">결속·KZG 검증</span>
            </div>
            <div className="bg-background px-2 py-1.5">
              <span className="block text-[8px] font-black text-muted-foreground">SUCCESS ONLY</span>
              <strong className="mt-0.5 block text-[10px]">BlobStore</strong>
              <span className="block text-[8px] leading-3 text-muted-foreground">검증한 sidecar</span>
            </div>
          </div>
        </div>

        <p
          data-scene-note
          className="mt-2 min-h-16 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-14 sm:pl-4 sm:text-sm sm:leading-6"
        >
          <strong className="mb-1 block font-mono text-[9px] text-primary">
            {String(active + 1).padStart(2, "0")}/{String(labels.length).padStart(2, "0")} · {labels[active]}
          </strong>
          {notes[active]}
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={labels}
          controlLabels={["Blob", "KZG", "Hash", "기록", "검증", "코드"]}
          playLabel="Blob 제출 경로 재생"
          className="mt-0 sm:!min-h-0 sm:!border-t-0 sm:!pt-2 [&>p]:hidden [&_[data-viz-desktop-controls]]:gap-1 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button]:px-1 [&_[data-viz-desktop-controls]>button]:py-1 [&_[data-viz-desktop-controls]>button:last-child]:w-20"
        />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}

export function BlobAdmissionViz() {
  const labels = [
    "Bounded decode로 입력 크기부터 제한합니다",
    "Fork·count·size·hash binding을 확인합니다",
    "Nonce·balance·두 fee market을 확인합니다",
    "KZG와 pool budget을 통과한 것만 저장합니다",
  ] as const;
  const notes = [
    "Malformed·oversized input을 싼 단계에서 거부해야 비싼 cryptographic work를 공격자가 강제하지 못합니다.",
    "Transaction hash list와 sidecar tuple의 길이·순서가 맞지 않으면 state 조회 전에 끝냅니다.",
    "Execution gas와 blob gas를 서로 다른 단위와 base fee로 판정합니다.",
    "KZG success 뒤에도 memory·disk·per-account policy가 pool admission을 거부할 수 있습니다.",
  ] as const;
  return (
    <Lesson id="blob-admission-viz" title="Cheap checks에서 KZG까지" description="실패 비용과 이유를 단계별로 분리한 admission pipeline입니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 440 240" role="img" aria-label={labels[active]} className="block h-auto w-full">
          {[
            [12, "decode", "byte bound"],
            [118, "shape", "fork · count"],
            [224, "state", "nonce · fees"],
            [330, "KZG", "store gate"],
          ].map(([x, label, detail], index) => (
            <Box key={String(label)} x={Number(x)} y={82} width={88} label={String(label)} detail={String(detail)} active={active >= index} />
          ))}
          <Arrow x1={102} y1={111} x2={114} y2={111} active={active >= 1} id="ea1" />
          <Arrow x1={208} y1={111} x2={220} y2={111} active={active >= 2} id="ea2" />
          <Arrow x1={314} y1={111} x2={326} y2={111} active={active >= 3} id="ea3" />
          <path d="M56 146V184H374V146" fill="none" stroke={active >= 3 ? primary : border} strokeWidth="1.25" strokeDasharray="5 5" />
          <text x="215" y="204" textAnchor="middle" className="fill-muted-foreground text-[9px]">reason-coded reject at every gate</text>
        </svg>
      )}
    </Lesson>
  );
}

export function BlobStoreLifecycleViz() {
  const labels = [
    "Verified sidecar를 transaction hash에 묶습니다",
    "Bytes·digest·generation을 atomic receipt로 씁니다",
    "Read 결과를 hit·miss·corrupt로 나눕니다",
    "Finalized cleanup도 generation receipt를 남깁니다",
  ] as const;
  const notes = [
    "Key가 같아도 sidecar bytes와 검증 metadata의 owner를 분리해 기록합니다.",
    "Partial write 뒤 metadata만 남는 상태를 막거나 restart recovery가 처리해야 합니다.",
    "Miss는 빈 blob이 아니고 corrupt는 retry 가능한 miss와 다른 failure입니다.",
    "EL pool cleanup은 consensus sidecar retention이나 장기 archive 삭제와 같은 사건이 아닙니다.",
  ] as const;
  return (
    <Lesson id="blob-store-viz" title="BlobStore artifact state machine" description="큰 sidecar를 receipt가 있는 artifact로 저장·조회·정리합니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 440 250" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <Box x={20} y={84} width={94} label="verified" detail="H + sidecar" active />
          <Arrow x1={116} y1={113} x2={166} y2={113} active={active >= 1} id="es1" />
          <Box x={170} y={84} width={100} label="stored" detail="bytes · digest" active={active >= 1} />
          <Arrow x1={272} y1={113} x2={322} y2={113} active={active >= 2} id="es2" />
          <Box x={326} y={84} width={94} label="read" detail="hit/miss/bad" active={active >= 2} />
          <path d="M220 144V190H74V144" fill="none" stroke={active >= 3 ? primary : border} strokeWidth="1.25" strokeDasharray="5 5" />
          <text x="147" y="210" textAnchor="middle" className="fill-muted-foreground text-[9px]">finalized generation cleanup</text>
          <circle cx="392" cy="192" r="18" fill="none" stroke={active >= 3 ? primary : border} strokeWidth="1.25" />
          <path d="M383 192H401" stroke={active >= 3 ? primary : border} strokeWidth="1.25" />
        </svg>
      )}
    </Lesson>
  );
}

export function BlobFeeFeedbackViz() {
  const labels = [
    "Parent excess E와 사용량 U를 읽습니다",
    "활성 fork target T를 뺍니다",
    "음수 결과는 0에서 멈춥니다",
    "정수 fake-exponential이 다음 fee를 만듭니다",
  ] as const;
  const notes = [
    "E·U·T는 모두 blob gas 단위이며 execution gas와 섞지 않습니다.",
    "Target은 고정 암기값이 아니라 parent timestamp에 활성인 chain parameter에서 고릅니다.",
    "Saturating subtraction은 unused capacity가 negative debt가 되는 것을 막습니다.",
    "부동소수점 대신 같은 정수 항을 더해 모든 client가 결정론적인 fee를 계산합니다.",
  ] as const;
  return (
    <Lesson id="blob-fee-viz" title="사용량에서 다음 blob base fee까지" description="Excess state가 target 주변 수요를 다음 가격으로 되먹임합니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 440 245" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <Box x={18} y={80} width={86} label="E + U" detail="parent state" active />
          <Arrow x1={106} y1={109} x2={148} y2={109} active={active >= 1} id="ef1" />
          <Box x={152} y={80} width={86} label="− T" detail="active target" active={active >= 1} />
          <Arrow x1={240} y1={109} x2={282} y2={109} active={active >= 2} id="ef2" />
          <Box x={286} y={80} width={84} label="max(0,·)" detail="next excess" active={active >= 2} />
          <Arrow x1={328} y1={140} x2={328} y2={176} active={active >= 3} id="ef3" />
          <Box x={268} y={180} width={120} label="integer exp" detail="next blob fee" active={active >= 3} />
          <path d="M268 209C170 224 60 211 60 140" fill="none" stroke={active >= 3 ? primary : border} strokeWidth="1.25" strokeDasharray="5 5" />
        </svg>
      )}
    </Lesson>
  );
}

export function BlobReorgReleaseViz() {
  const labels = [
    "Old canonical chain의 blob transaction을 찾습니다",
    "Local BlobStore에서 sidecar receipt를 조회합니다",
    "Hit이면 재주입하고 miss면 fetch 또는 실패합니다",
    "Failure parity 뒤에만 성능 candidate를 승인합니다",
  ] as const;
  const notes = [
    "Reorg는 transaction body뿐 아니라 다시 실행 가능한 sidecar availability를 요구합니다.",
    "검증된 receipt와 generation이 같은 sidecar인지 확인해야 KZG 재검증 생략을 정당화할 수 있습니다.",
    "Transaction의 versioned hash만으로 128 KiB blob을 복원할 수 없습니다.",
    "Wrong hash·proof·fee·corruption·cleanup crash를 base와 candidate에 같은 순서로 재생합니다.",
  ] as const;
  return (
    <Lesson id="blob-reorg-viz" title="Reorg에서 release gate까지" description="Orphaned transaction의 sidecar availability와 복구 결과를 추적합니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 440 250" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <Box x={20} y={84} width={94} label="orphaned tx" detail="old chain" active />
          <Arrow x1={116} y1={113} x2={164} y2={113} active={active >= 1} id="er1" />
          <Box x={168} y={84} width={100} label="store lookup" detail="receipt" active={active >= 1} />
          <Arrow x1={270} y1={101} x2={322} y2={64} active={active >= 2} id="er2" />
          <Box x={326} y={34} width={94} label="hit" detail="reinsert" active={active >= 2} />
          <Arrow x1={270} y1={127} x2={322} y2={166} active={active >= 2} id="er3" />
          <Box x={326} y={142} width={94} label="miss" detail="fetch / fail" active={active >= 2} dashed />
          <path d="M373 94V132" stroke={active >= 3 ? primary : border} strokeWidth="1.25" strokeDasharray="5 5" />
          <text x="220" y="214" textAnchor="middle" className="fill-muted-foreground text-[9px]">paired failure trace → release or rollback</text>
        </svg>
      )}
    </Lesson>
  );
}
