import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "공통 출발",
  "Window 묶음",
  "Window proof",
  "message 제출",
  "reorg",
  "Winning 추첨",
  "완료 구분",
] as const;

const SCENES = [
  {
    title:
      "두 PoSt는 같은 sealed sectors에서 출발하지만 서로 다른 시간 질문입니다",
    detail:
      "과거 PoRep가 유효해도 지금 보관 중인지는 새 randomness로 확인해야 합니다. 여기서 정기 점검인 Window와 epoch 추첨인 Winning으로 갈라집니다.",
    kind: "아직 분기 전",
    snapshot: "sealed sectors + CommR",
    output: "fresh PoSt job needed",
    done: "아직 없음",
  },
  {
    title: "WindowPoSt는 이번 deadline에 점검할 sector snapshot을 고정합니다",
    detail:
      "Window type·challenge epoch·randomness·provider·ordered sector/CommR·partition·skip/fault 정책과 tipset을 한 job으로 묶습니다.",
    kind: "Window · maintenance",
    snapshot: "deadline sectors",
    output: "partitioned Window job",
    done: "inputs admitted",
  },
  {
    title: "각 partition의 vanilla proof를 만들고 Window SNARK를 검증합니다",
    detail:
      "Proof bytes가 expected snapshot과 같은지 독립 verifier로 확인합니다. 이 성공은 cryptographic proof 완료일 뿐 chain 제출 완료가 아닙니다.",
    kind: "Window · proof",
    snapshot: "ordered partitions",
    output: "verified Window proof",
    done: "generated + verified",
  },
  {
    title:
      "Lotus는 proof를 SubmitWindowedPoSt message로 보내고 receipt를 기다립니다",
    detail:
      "생성 전후 randomness가 그대로인지 다시 확인하고 message를 전송합니다. Mpool 접수와 submitted 상태를 canonical inclusion으로 부르지 않습니다.",
    kind: "Window · chain",
    snapshot: "proof + current head",
    output: "submitted message CID",
    done: "submitted, not included",
  },
  {
    title:
      "포함 뒤 reorg가 나면 이전 완료를 취소하고 새 head에서 다시 판단합니다",
    detail:
      "Receipt가 되돌아가거나 deadline context가 바뀌면 reverted/retry generation으로 이동합니다. 같은 idempotency key로 중복 외부 효과를 막습니다.",
    kind: "Window · recovery",
    snapshot: "new head + old receipt",
    output: "retry or fail decision",
    done: "included only after confidence",
  },
  {
    title:
      "WinningPoSt는 이번 epoch에 선택된 sectors만 별도 statement로 묶습니다",
    detail:
      "Election randomness·provider·ordered challenged sector/CommR를 Winning profile로 검증합니다. Valid proof는 block candidate 입력이지 Window 유지 증명이 아닙니다.",
    kind: "Winning · election",
    snapshot: "epoch challenge sectors",
    output: "verified Winning proof",
    done: "valid candidate input",
  },
  {
    title: "Window와 Winning은 입력도 다르고 마지막 영수증도 다릅니다",
    detail:
      "Window는 deadline proof message의 inclusion·confidence까지 추적합니다. Winning은 block assembly 입력에서 끝나며 propagation·tipset inclusion은 별도입니다.",
    kind: "서로 다른 완료 경계",
    snapshot: "no receipt reuse",
    output: "job-specific completion",
    done: "claim boundary preserved",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 완료 상태는 ${scene.done}입니다.`,
);

export function PoStDeadlineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="같은 sealed sectors · 서로 다른 time claim"
      title="WindowPoSt는 정기 점검을 chain message로 남기고, WinningPoSt는 이번 epoch의 block 후보 자격을 만듭니다"
      description="공통 출발점에서 두 job이 갈라지고 Window inclusion이 reorg로 되돌아가는 지점까지 따라갑니다."
      note="예제 상태명은 운영 ledger 설명용입니다. Exact actor deadline·proof parameters·confidence는 network version과 정책에서 읽습니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="WindowPoSt와 WinningPoSt deadline 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[44rem] space-y-4 sm:min-h-[31rem] xl:min-h-[27rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>
            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.4fr)_minmax(13rem,0.6fr)]">
              <div className="bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  현재 경로 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.title}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.detail}
                </p>
              </div>
              <div className="bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계의 완료 상태
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.done}
                </p>
                <p className="mt-4 text-[9px] leading-5 text-muted-foreground">
                  Proof verify와 chain inclusion을 같은 완료로 부르지 않습니다.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["proof kind", scene.kind],
                ["고정한 snapshot", scene.snapshot],
                ["출력", scene.output],
                ["완료", scene.done],
              ].map(([label, value], index) => (
                <article
                  key={label}
                  className={`min-w-0 border bg-background p-3 ${index === 3 ? "border-primary/60" : "border-border"}`}
                >
                  <p className="text-[9px] font-bold text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                    {value}
                  </p>
                </article>
              ))}
            </div>
            <div className="flex gap-1" aria-hidden="true">
              {LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`h-1.5 flex-1 ${index <= scenes.active ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>
          </div>
          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="PoSt deadline·election 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
