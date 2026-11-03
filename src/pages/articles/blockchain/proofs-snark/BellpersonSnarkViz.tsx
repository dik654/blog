import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "압축이 필요한 이유",
  "답안지 만들기",
  "구현 고정",
  "Native 경로",
  "SupraSeal 묶음",
  "proof 반환",
  "독립 검증",
] as const;

const SCENES = [
  {
    title:
      "큰 저장 증명을 그대로 다시 계산시키지 않으려면 짧은 검증 결과가 필요합니다",
    detail:
      "PoRep·PoSt 계산 전체를 체인 검증자마다 반복하면 비용이 너무 큽니다. 그래서 증명자는 무거운 계산을 한 뒤, 검증자가 빠르게 확인할 Groth16 proof를 만듭니다.",
    input: "PoRep / PoSt statement",
    work: "large witness computation",
    output: "short proof needed",
    receipt: "아직 승인 아님",
  },
  {
    title:
      "회로를 실행해 공개 입력과 비공개 답, A·B·C 평가값을 같은 순서로 적습니다",
    detail:
      "Bellperson의 ProvingAssignment는 회로의 채워진 답안지입니다. Density tracker는 실제 query가 쓰는 항을 표시해 FFT·MSM 단계가 불필요한 항을 건너뛰게 합니다.",
    input: "8 circuits + witnesses",
    work: "synthesize in parallel",
    output: "8 assignments + density",
    receipt: "statement order 고정",
  },
  {
    title:
      "어느 prover를 쓸지는 요청 때가 아니라 binary를 만들 때 이미 갈립니다",
    detail:
      "cuda-supraseal feature가 있으면 SupraSeal module, 없으면 native module이 연결됩니다. 같은 영수증 안에서 실패한 경로를 몰래 다른 구현으로 바꾸지 않습니다.",
    input: "binary feature manifest",
    work: "compile-time cfg",
    output: "one top-level prover path",
    receipt: "revision + features",
  },
  {
    title:
      "Native 경로는 같은 Groth16 계산의 FFT·MSM을 CPU 또는 GPU helper로 수행합니다",
    detail:
      "CUDA·OpenCL feature와 장치 상태에 따라 내부 가속기가 달라질 수 있습니다. 이것은 SupraSeal batch path와 다른 층의 선택입니다.",
    input: "one or more assignments",
    work: "FFT + multiexponentiation",
    output: "native Groth16 proofs",
    receipt: "backend와 장치 기록",
  },
  {
    title:
      "SupraSeal은 같은 constraint 길이의 assignments를 하나의 C++ GPU 호출로 넘깁니다",
    detail:
      "현재 adapter는 각 assignment의 A 길이가 첫 항목과 같은지 확인하고, pinned SRS를 얻은 뒤 batch를 호출합니다. 조건이 깨지면 native로 자동 전환하지 않습니다.",
    input: "equal-length assignments",
    work: "pack → FFI → GPU batch",
    output: "ordered proof vector",
    receipt: "SRS + batch size",
  },
  {
    title: "FFI가 proof 8개를 돌려줘도 아직 요청 8개가 성공한 것은 아닙니다",
    detail:
      "성공 code와 proof 개수는 각 proof가 원래 statement에 대응한다는 뜻이 아닙니다. Circuit index, public input과 proof index를 다시 연결해야 합니다.",
    input: "proof[0…7]",
    work: "restore request mapping",
    output: "proof + expected input pairs",
    receipt: "반환 완료, 승인 전",
  },
  {
    title:
      "각 proof를 원래 공개 입력과 verification key로 확인해야 비로소 완료됩니다",
    detail:
      "8개가 모두 독립 검증을 통과해야 batch를 승인합니다. 이 마지막 경계 덕분에 GPU 속도, FFI 순서와 실제 statement correctness를 섞지 않습니다.",
    input: "proof + public inputs + VK",
    work: "independent verification",
    output: "8 verified proofs",
    receipt: "batch accepted",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 이 단계의 영수증은 ${scene.receipt}입니다.`,
);

export function BellpersonSnarkViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="PoRep·PoSt의 마지막 압축 단계"
      title="무거운 계산은 한 번 수행하고, 검증자는 짧은 Groth16 proof만 확인합니다"
      description="같은 크기의 회로 8개가 Bellperson assignment를 거쳐 proof 8개가 되고, 원래 공개 입력으로 다시 검증될 때까지 한 묶음을 따라갑니다."
      note="이 그림은 Bellperson v0.27.0의 구현 경계를 설명합니다. Proof 생성 성공과 Filecoin chain inclusion은 서로 다른 완료 상태입니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Bellperson Groth16 proof 생성과 검증 장면 탐색기"
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
                  지금 확인할 질문 · {LABELS[scenes.active]}
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
                  이 단계에서 남기는 영수증
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.receipt}
                </p>
                <p className="mt-4 text-[9px] leading-5 text-muted-foreground">
                  Proof bytes가 생긴 것과 원래 statement가 승인된 것을
                  구분합니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["들어온 것", scene.input],
                ["이번 계산", scene.work],
                ["나온 것", scene.output],
                ["현재 상태", scene.receipt],
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
            playLabel="Groth16 proof 생성·검증 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
