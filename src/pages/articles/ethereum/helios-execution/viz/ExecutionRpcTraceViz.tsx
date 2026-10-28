import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "전체 경로",
  "입력 고정",
  "상태 미리 채우기",
  "첫 실행",
  "증명으로 보충",
  "같은 입력 재실행",
  "반환 경계",
] as const;

const NOTES = [
  "eth_call 한 건은 검증된 블록 H를 고정하고, ProofDB에 필요한 상태를 채우며, 같은 call을 revm에서 다시 실행해 결과를 얻습니다.",
  "Block tag를 header hash H로 바꾸고 H의 number·timestamp·base fee와 fork f, call T, state override O를 한 실행 입력으로 고정합니다.",
  "원격 createAccessList는 필요한 주소와 slot을 예상하는 hint입니다. Helios는 각 항목을 H에 대한 account·storage proof로 다시 확인해 ProofDB를 미리 채웁니다.",
  "Revm이 아직 없는 account·slot·과거 block hash를 읽으면 ProofDB는 StateMissing과 정확한 access를 남깁니다. 이 시도는 최종 결과가 아닙니다.",
  "EVM borrow가 끝난 뒤 비동기 provider가 같은 H에서 proof를 가져옵니다. 검증에 성공한 account·slot만 ProofDB에 넣고, invalid proof나 provider 오류는 종료합니다.",
  "Helios는 T·H·fork·override를 바꾸지 않은 채 revm을 처음부터 다시 실행합니다. 다음 miss가 있으면 같은 규칙으로 보충하고, 더 없을 때 실행이 끝납니다.",
  "Success는 output을, Revert는 revert bytes를, Halt는 오류를 반환합니다. Gas estimate는 이 실행의 gas_used이며 transaction 포함이나 미래 상태를 보장하지 않습니다.",
] as const;

type PhaseState = "waiting" | "active" | "done";

function phaseState(active: number, phase: number): PhaseState {
  if (active < phase) return "waiting";
  if (active === phase) return "active";
  return "done";
}

const PHASES = [
  ["PIN", "블록 H·환경·fork 고정", "latest를 다시 풀지 않음"],
  ["HINT", "예상 account·slot 수집", "hint 뒤 proof 검증"],
  ["RUN", "revm 첫 실행", "없는 key는 StateMissing"],
  ["FILL", "같은 H에서 proof 보충", "검증된 값만 저장"],
  ["REPLAY", "같은 입력으로 다시 실행", "새 miss면 다시 보충"],
  ["RETURN", "output·gas 또는 오류", "simulation 범위 표시"],
] as const;

function Phase({
  index,
  active,
  code,
  title,
  detail,
}: {
  index: number;
  active: number;
  code: string;
  title: string;
  detail: string;
}) {
  const state = phaseState(active, index);
  return (
    <div
      className={`min-w-0 border-l-2 px-3 py-2.5 ${
        state === "active"
          ? "border-primary bg-primary/[0.055]"
          : state === "done"
            ? "border-foreground/35 bg-background"
            : "border-border bg-background"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] font-black text-muted-foreground">
          {String(index).padStart(2, "0")} · {code}
        </span>
        <span
          className={`font-mono text-[9px] font-bold ${
            state === "active"
              ? "text-primary"
              : state === "done"
                ? "text-foreground"
                : "text-muted-foreground/55"
          }`}
        >
          {state === "active" ? "진행" : state === "done" ? "완료" : "대기"}
        </span>
      </div>
      <strong className="mt-1 block break-keep text-[11px] leading-4">{title}</strong>
      <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function StateCell({
  label,
  value,
  ready,
}: {
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <div className="min-w-0 bg-background px-2 py-2.5">
      <p className="font-mono text-[8px] font-black text-muted-foreground">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-bold ${ready ? "text-foreground" : "text-muted-foreground/55"}`}>
        {ready ? value : "아직 없음"}
      </p>
    </div>
  );
}

function CompactScene({ active }: { active: number }) {
  const compact = [
    ["한 요청", "T @ block H → ProofDB → revm → output", "원격 실행 결과가 아니라 검증된 상태와 로컬 실행을 연결합니다."],
    ["입력 고정", "H · T · block env · fork f · override O", "이후 proof fetch와 모든 replay에서 같은 식별자를 유지합니다."],
    ["상태 미리 채우기", "createAccessList hint → verified account·slot", "Hint는 최적화 재료일 뿐이며 값은 H의 proof로 다시 확인합니다."],
    ["첫 실행", "revm read → StateMissing(Basic A)", "동기 Database trait은 빠진 access를 기록하고 실행을 중단합니다."],
    ["증명으로 보충", "get_account(A, H) → proof 검증 → cache", "EVM을 drop한 뒤에만 비동기 요청을 수행합니다."],
    ["같은 입력 재실행", "replay(T, H, f, O) → slot miss 또는 완료", "입력을 바꾸지 않고 처음부터 계산해야 한 snapshot을 유지합니다."],
    ["반환 경계", "Success(output) · Revert(bytes) · Halt(error)", "gas_used는 이 simulation의 결과이며 inclusion·finality가 아닙니다."],
  ] as const;
  const [label, title, detail] = compact[active];

  return (
    <div className="grid gap-3">
      <div className="border-l-2 border-primary bg-primary/[0.055] px-3 py-3">
        <p className="font-mono text-[9px] font-black text-muted-foreground">
          {String(active + 1).padStart(2, "0")} / {LABELS.length} · {label}
        </p>
        <strong className="mt-1.5 block break-keep text-sm leading-5">{title}</strong>
        <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-y border-border px-2 py-3 text-center">
        <div>
          <p className="font-mono text-[8px] font-black text-muted-foreground">REMOTE</p>
          <p className="mt-1 text-[10px] font-bold">Block · proof · hint</p>
        </div>
        <span aria-hidden className="text-primary">→</span>
        <div>
          <p className="font-mono text-[8px] font-black text-muted-foreground">LOCAL</p>
          <p className="mt-1 text-[10px] font-bold">Verify · replay · result</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border p-px text-center">
        <StateCell label="ACCOUNT A" value="proof 통과" ready={active >= 4} />
        <StateCell label="SLOT 5" value="value 7" ready={active >= 5} />
        <StateCell label="OUTPUT" value="0x…07" ready={active >= 6} />
      </div>
    </div>
  );
}

export default function ExecutionRpcTraceViz() {
  const scenes = useAnimatedScenes(LABELS.length, 8200, { loop: false });
  const active = scenes.active;
  const progress = active === 0 ? 0 : ((active - 1) / (PHASES.length - 1)) * 100;

  return (
    <VizFrame
      eyebrow="Execution RPC · eth_call 한 건"
      title="없는 상태를 증명으로 채우고 같은 call을 다시 실행합니다"
      description="검증된 블록 H에서 contract A의 slot 5를 읽는 call을 따라갑니다. 장면을 고르거나 그림에 초점을 두고 방향키로 이동할 수 있습니다."
      note="H·T·A·slot 5·value 7과 output 0x…07은 실행 경계를 설명하기 위한 기호입니다. 실제 네트워크 주소나 측정값이 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-execution-rpc-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Helios가 proof-backed eth_call을 실행하는 일곱 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="flex min-h-8 items-center justify-between border-b border-border px-1">
          <strong className="text-xs">
            {String(active + 1).padStart(2, "0")} · {LABELS[active]}
          </strong>
          <span className="font-mono text-[10px] text-muted-foreground">
            H / T · {active + 1}/{LABELS.length}
          </span>
        </div>

        <div className="mt-3 xl:hidden">
          <CompactScene active={active} />
        </div>

        <div className="mt-3 hidden gap-4 xl:grid xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.25fr)_minmax(0,0.72fr)]">
          <div className="grid content-start gap-2">
            <div className="border-l-2 border-foreground/40 px-3 py-3">
              <p className="font-mono text-[8px] font-black text-muted-foreground">CALL RECEIPT</p>
              <p className="mt-1 text-xs font-bold">T · to A · read slot 5</p>
              <p className="mt-1 text-[9px] leading-4 text-muted-foreground">block H · override O · chain schedule</p>
            </div>
            <div className={`border-l-2 px-3 py-3 ${active >= 1 ? "border-primary bg-primary/[0.055]" : "border-border"}`}>
              <p className="font-mono text-[8px] font-black text-muted-foreground">PINNED SNAPSHOT</p>
              <p className="mt-1 text-xs font-bold">header hash H · state root R</p>
              <p className="mt-1 text-[9px] leading-4 text-muted-foreground">number · timestamp · base fee · prevrandao</p>
            </div>
            <div className="mt-1 border-y border-border px-2 py-3">
              <div className="relative h-1 bg-border">
                <span
                  aria-hidden
                  className="absolute -top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-primary motion-safe:transition-[left] motion-safe:duration-700"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <p className="mt-3 font-mono text-[8px] text-muted-foreground">PIN → HINT → RUN → FILL → REPLAY → RETURN</p>
            </div>
          </div>

          <div className="grid gap-px bg-border p-px sm:grid-cols-2">
            {PHASES.map(([code, title, detail], index) => (
              <Phase
                key={code}
                index={index + 1}
                active={active}
                code={code}
                title={title}
                detail={detail}
              />
            ))}
          </div>

          <div className="grid content-start gap-3">
            <div className="grid gap-px bg-border p-px">
              <StateCell label="PROOFDB · ACCOUNT A" value="nonce·balance·code" ready={active >= 4} />
              <StateCell label="PROOFDB · STORAGE" value="slot 5 = 7" ready={active >= 5} />
              <StateCell label="REVM RESULT" value="output 0x…07" ready={active >= 6} />
            </div>
            <div className="border-t border-border pt-3">
              <p className="font-mono text-[8px] font-black text-muted-foreground">BOUNDARY</p>
              <p className="mt-1 break-keep text-[10px] font-bold leading-4">
                Call 결과는 H의 simulation입니다.
              </p>
              <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground">
                Mempool 수락·block 포함·finality는 별도 사실입니다.
              </p>
            </div>
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
