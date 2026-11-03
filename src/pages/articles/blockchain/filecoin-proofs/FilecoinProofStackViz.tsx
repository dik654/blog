import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "원본 받기",
  "PoRep 만들기",
  "PoRep 검증",
  "시간 경과",
  "Window 점검",
  "Winning 추첨",
  "완료 구분",
] as const;

const SCENES = [
  {
    title: "처음에는 원본 data와 빈 저장 공간만 있습니다",
    detail:
      "Provider·sector ID·ticket을 고정하고 원본의 commitment인 CommD를 계산합니다. 아직 replica도 PoRep도 없으므로 '저장했다'고 주장할 수 없습니다.",
    claim: "아직 증명 없음",
    api: "PoRepConfig admission",
    statement: "CommD · provider · sector · ticket",
    receipt: "accepted seal job",
  },
  {
    title:
      "PoRep는 이 provider가 이 sector에 전용 replica를 만들었다고 증명합니다",
    detail:
      "PC1·PC2가 replica와 commitments를 만들고 C1·C2가 proof bytes를 만듭니다. 다른 sector의 cache를 섞으면 같은 작업이 아닙니다.",
    claim: "처음 복제했다",
    api: "seal_* · PC1→PC2→C1→C2",
    statement: "CommD ↔ CommR relation",
    receipt: "typed PoRep artifact chain",
  },
  {
    title: "PoRep 검증은 proof bytes와 원래 문제를 함께 확인합니다",
    detail:
      "Verifier는 CommD·CommR·provider·sector·randomness와 proof profile을 다시 묶습니다. 통과하면 replica 관계가 유효하다는 뜻이지, 앞으로 계속 보관한다는 약속은 아닙니다.",
    claim: "replica relation valid",
    api: "verify_seal",
    statement: "expected inputs + exact VK",
    receipt: "verified PoRep",
  },
  {
    title: "시간이 지나면 최초 PoRep만으로 현재 보관 여부를 알 수 없습니다",
    detail:
      "어제 만든 유효한 proof는 오늘 disk에 sector가 남아 있는지 답하지 못합니다. 그래서 새 chain randomness로 다시 묻는 PoSt가 필요합니다.",
    claim: "지금도 보관하는가?",
    api: "PoStConfig admission",
    statement: "fresh challenge context",
    receipt: "PoSt job required",
  },
  {
    title: "WindowPoSt는 정해진 deadline의 sector 묶음을 주기적으로 점검합니다",
    detail:
      "Deadline snapshot·ordered sectors·CommR·randomness를 Window profile에 넣습니다. Proof 생성 뒤에도 message submission·inclusion은 별도 단계입니다.",
    claim: "주기적 저장 유지",
    api: "window_post",
    statement: "deadline sector snapshot",
    receipt: "verified Window proof",
  },
  {
    title: "WinningPoSt는 한 epoch의 block 후보 자격을 위한 별도 문제입니다",
    detail:
      "Election randomness가 고른 sectors로 proof를 만듭니다. 같은 Merkle·SNARK 부품을 써도 Window 점검을 대신하지 않으며 block inclusion도 아직 아닙니다.",
    claim: "이번 epoch 자격",
    api: "winning_post",
    statement: "epoch election challenge",
    receipt: "valid block-candidate input",
  },
  {
    title:
      "따라서 세 proof는 같은 저장 증명의 옵션이 아니라 서로 다른 질문입니다",
    detail:
      "PoRep는 최초 replica 관계, Window는 주기적 유지, Winning은 epoch 자격을 답합니다. Router는 claim·config·statement·verifier가 모두 맞을 때만 각 receipt를 냅니다.",
    claim: "세 질문 · 세 완료 경계",
    api: "typed dispatch + fail closed",
    statement: "no cross-profile reuse",
    receipt: "job-specific verified receipt",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 이 단계의 결과는 ${scene.receipt}입니다.`,
);

export function FilecoinProofStackViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 sector · 최초 저장부터 다음 challenge까지"
      title="PoRep는 처음 만든 replica를 증명하고, PoSt는 시간이 지난 뒤에도 보관 중인지 새로 묻습니다"
      description="같은 sector가 PoRep를 거친 뒤 Window 점검과 Winning 추첨이라는 서로 다른 질문으로 갈라지는 이유를 따라갑니다."
      note="검증된 proof receipt는 cryptographic statement의 완료입니다. Chain message·block inclusion, finality, retrieval 가능성은 별도입니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Filecoin PoRep와 PoSt 역할 장면 탐색기"
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
                  현재 질문 · {LABELS[scenes.active]}
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
                  이 단계의 receipt
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.receipt}
                </p>
                <p className="mt-4 text-[9px] leading-5 text-muted-foreground">
                  Proof 생성·검증·chain 반영을 한 완료로 합치지 않습니다.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["답하려는 질문", scene.claim],
                ["API", scene.api],
                ["검증할 statement", scene.statement],
                ["출력", scene.receipt],
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
            playLabel="Filecoin proof 역할 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
