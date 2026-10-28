import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "전체 경로",
  "블록 고정",
  "계정 증명",
  "슬롯 증명",
  "코드 확인",
  "검증 후 저장",
  "반환·거절",
] as const;

const NOTES = [
  "검증된 블록 H의 state root R에서 주소 A와 slot 5를 확인합니다. RPC는 값과 proof를 주지만 최종 판단은 로컬 verifier가 합니다.",
  "먼저 조회할 블록 H를 고정하고 H의 header에서 state root R을 가져옵니다. eth_getProof도 같은 H로 요청합니다.",
  "응답의 nonce·balance·storageHash·codeHash로 expected account를 만들고, accountProof가 R 아래 주소 A에 그 값을 넣는지 확인합니다.",
  "계정 증명으로 묶인 storage root S를 루트로 삼아 slot 5의 expected value와 storageProof를 다시 검증합니다.",
  "코드가 필요하면 받은 bytecode의 Keccak hash가 계정 증명에 들어 있던 codeHash와 같은지 확인합니다.",
  "모든 검증을 통과한 뒤에만 account는 (A,H), storage는 (S,slot), code는 codeHash를 key로 저장합니다.",
  "모든 단계가 성공하면 typed Account를 반환합니다. Root·proof·code hash 하나라도 맞지 않으면 값을 반환하거나 cache에 넣지 않습니다.",
] as const;

type StepState = "idle" | "active" | "done";

function stepState(active: number, index: number): StepState {
  if (active < index) return "idle";
  if (active === index) return "active";
  return "done";
}

function Step({
  index,
  active,
  label,
  title,
  detail,
}: {
  index: number;
  active: number;
  label: string;
  title: string;
  detail: string;
}) {
  const status = stepState(active, index);
  return (
    <div
      className={`min-w-0 border-l-2 px-3 py-3 ${
        status === "active"
          ? "border-primary bg-primary/[0.055]"
          : status === "done"
            ? "border-foreground/35 bg-background"
            : "border-border bg-background"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] font-black text-muted-foreground">
          {String(index).padStart(2, "0")} · {label}
        </span>
        <span
          className={`font-mono text-[9px] font-bold ${
            status === "active"
              ? "text-primary"
              : status === "done"
                ? "text-foreground"
                : "text-muted-foreground/55"
          }`}
        >
          {status === "active" ? "확인 중" : status === "done" ? "통과" : "대기"}
        </span>
      </div>
      <strong className="mt-1.5 block break-keep text-xs leading-5">{title}</strong>
      <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function CompactScene({ active }: { active: number }) {
  const scenes = [
    {
      label: "한 요청",
      title: "H · R → A · slot 5 → value 7",
      detail: "원격 응답을 그대로 쓰지 않고 root가 이어지는 두 proof를 검증합니다.",
    },
    {
      label: "블록 고정",
      title: "block H → header.stateRoot = R",
      detail: "getProof(A,[5])도 같은 block hash H에 묶습니다.",
    },
    {
      label: "계정 증명",
      title: "Verify(R, keccak(A), account, πA)",
      detail: "nonce·balance·storage root S·code hash C를 한 account 값으로 확인합니다.",
    },
    {
      label: "슬롯 증명",
      title: "Verify(S, keccak(5), 7, πS)",
      detail: "두 번째 root S는 앞 계정 증명이 확인한 값이어야 합니다.",
    },
    {
      label: "코드 확인",
      title: "keccak(bytecode) = C",
      detail: "다른 시점의 코드를 받으면 hash mismatch로 거절합니다.",
    },
    {
      label: "검증 후 저장",
      title: "(A,H) · (S,5) · C",
      detail: "값의 유효 범위가 다른 만큼 cache identity도 나눕니다.",
    },
    {
      label: "결론",
      title: "모두 통과하면 반환, 하나라도 다르면 거절",
      detail: "정상 부재 proof는 0으로 해석할 수 있지만 잘린 proof는 오류입니다.",
    },
  ] as const;

  const scene = scenes[active];
  return (
    <div className="grid gap-3">
      <div className="border-l-2 border-primary bg-primary/[0.055] px-3 py-3">
        <p className="font-mono text-[9px] font-black text-muted-foreground">
          {String(active + 1).padStart(2, "0")} / {LABELS.length} · {scene.label}
        </p>
        <strong className="mt-1.5 block break-keep text-sm leading-5">
          {scene.title}
        </strong>
        <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">
          {scene.detail}
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-y border-border px-2 py-3 text-center">
        <div>
          <p className="font-mono text-[9px] font-black text-muted-foreground">UNTRUSTED</p>
          <p className="mt-1 text-[10px] font-bold">RPC 값 + proof</p>
        </div>
        <span aria-hidden className="text-primary">→</span>
        <div>
          <p className="font-mono text-[9px] font-black text-muted-foreground">LOCAL</p>
          <p className="mt-1 text-[10px] font-bold">검증 또는 거절</p>
        </div>
      </div>
    </div>
  );
}

export default function StateProofTraceViz() {
  const scenes = useAnimatedScenes(LABELS.length, 7600, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="State proof · 한 요청 추적"
      title="블록 H의 state root에서 slot 5의 값이 나올 때까지"
      description="주소 A의 account와 storage slot 5를 같은 검증된 블록에 묶는 과정을 일곱 장면으로 봅니다. 장면을 고르거나 그림에 초점을 두고 방향키로 이동할 수 있습니다."
      note="H·R·A·S·C와 slot 5·value 7은 상태 검증 순서를 설명하기 위한 기호입니다. 대상 네트워크의 실제 주소나 측정값이 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-state-proof-scene={active}
        tabIndex={0}
        role="group"
        aria-label="검증된 블록에서 account와 storage 값을 확인하는 일곱 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="flex min-h-8 items-center justify-between border-b border-border px-1">
          <strong className="text-xs">
            {String(active + 1).padStart(2, "0")} · {LABELS[active]}
          </strong>
          <span className="font-mono text-[10px] text-muted-foreground">
            H / R · {active + 1}/{LABELS.length}
          </span>
        </div>

        <div className="mt-3 xl:hidden">
          <CompactScene active={active} />
        </div>

        <div className="mt-3 hidden gap-3 xl:grid xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.3fr)]">
          <div className="grid content-start gap-2">
            <div className="border-l-2 border-foreground/40 px-3 py-3">
              <p className="font-mono text-[9px] font-black text-muted-foreground">VERIFIED HEADER</p>
              <p className="mt-1 text-xs font-bold">block H · state root R</p>
            </div>
            <div className="border-l-2 border-primary bg-primary/[0.055] px-3 py-3">
              <p className="font-mono text-[9px] font-black text-muted-foreground">QUERY</p>
              <p className="mt-1 text-xs font-bold">address A · slot 5 · with code</p>
            </div>
            <div className="mt-1 grid grid-cols-3 gap-px bg-border p-px text-center">
              <div className="bg-background px-2 py-3">
                <p className="font-mono text-[9px] text-muted-foreground">ACCOUNT KEY</p>
                <p className="mt-1 text-[10px] font-bold">A + H</p>
              </div>
              <div className="bg-background px-2 py-3">
                <p className="font-mono text-[9px] text-muted-foreground">STORAGE KEY</p>
                <p className="mt-1 text-[10px] font-bold">S + 5</p>
              </div>
              <div className="bg-background px-2 py-3">
                <p className="font-mono text-[9px] text-muted-foreground">CODE KEY</p>
                <p className="mt-1 text-[10px] font-bold">C</p>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-border p-px sm:grid-cols-2">
            <Step index={1} active={active} label="ANCHOR" title="블록 H와 state root R" detail="같은 H로 getProof 요청" />
            <Step index={2} active={active} label="ACCOUNT" title="R → address A → account" detail="storage root S와 code hash C 확인" />
            <Step index={3} active={active} label="STORAGE" title="S → slot 5 → value 7" detail="앞 proof가 확인한 S만 사용" />
            <Step index={4} active={active} label="CODE" title="keccak(code) = C" detail="필요한 경우 bytecode까지 확인" />
            <Step index={5} active={active} label="CACHE" title="검증된 값만 identity별 저장" detail="(A,H) · (S,5) · C" />
            <Step index={6} active={active} label="RESULT" title="Account 반환 또는 fail closed" detail="Mismatch는 cache와 반환 모두 금지" />
          </div>
        </div>

        <AnimatedSceneControls
          labels={LABELS}
          active={active}
          playing={scenes.playing}
          reducedMotion={scenes.reducedMotion}
          setActive={scenes.setActive}
          setPlaying={scenes.setPlaying}
          playLabel="과정 재생"
        />
      </div>

      <StaticSceneList labels={LABELS} notes={NOTES} />
    </VizFrame>
  );
}
