import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "주장 고정",
  "cell 배치",
  "gate 켜기",
  "selector 반례",
  "같은 값 연결",
  "proof 경로",
  "출시 경계",
] as const;

const SCENES = [
  {
    question: "이번 회로는 무엇을 공개하고 무엇을 숨길까요?",
    answer:
      "공개 instance는 out=12이고, private advice는 a=3과 b=4입니다. 증명할 관계는 a·b=out입니다.",
    state: "instance out=12 · advice a=3,b=4",
    confirmed: "공개 statement와 비공개 witness",
    unknown: "세 값을 어느 cell에 놓고 어떤 식으로 묶는지",
    phase: 0,
  },
  {
    question: "표의 어느 칸이 곱셈에 참여할까요?",
    answer:
      "Row 0의 advice 두 칸에 3과 4를 놓고, 다음 row의 첫 advice 칸에 12를 놓습니다. Gate는 Rotation::cur와 next로 이 세 칸을 읽습니다.",
    state: "row0: [a=3,b=4,s=1] · row1: [out=12,–,s=0]",
    confirmed: "Column·row·rotation이 가리키는 세 cell",
    unknown: "값을 놓는 것만으로 3·4=12가 강제되는지",
    phase: 1,
  },
  {
    question: "어느 식이 실제 검증 규칙이 될까요?",
    answer:
      "Selector s_mul을 row 0에서 켜고 s_mul·(a_cur·b_cur−out_next)=0을 등록합니다. s_mul=1이므로 3·4−12=0이어야 합니다.",
    state: "1·(3·4−12)=0",
    confirmed: "해당 row에서 활성화된 multiplication identity",
    unknown: "selector를 켜지 않으면 같은 값들이 어떻게 되는지",
    phase: 2,
  },
  {
    question: "Gate source가 있어도 selector가 0이면 안전할까요?",
    answer:
      "아닙니다. s_mul=0이면 식 전체가 0이 되어 3·4≠11도 이 gate를 통과합니다. 그래서 selector coverage를 negative fixture로 확인해야 합니다.",
    state: "0·(3·4−11)=0 · wrong relation passes this gate",
    confirmed: "Gate 정의와 gate 활성화는 별도 책임",
    unknown: "다른 region의 같은 값과 public output은 어떻게 연결하는지",
    phase: 3,
  },
  {
    question: "두 곳에 4를 써 넣으면 자동으로 같은 값일까요?",
    answer:
      "아닙니다. Equality-enabled columns와 copy constraint가 있어야 서로 다른 cell이 같은 값을 갖습니다. Public instance도 constrain_instance로 output cell에 연결합니다.",
    state: "copy(a_old,a_new) · copy(b_old,b_new) · out ↔ instance[0]",
    confirmed: "Gate 밖의 cell identity와 public binding",
    unknown: "MockProver와 실제 cryptographic proof의 차이",
    phase: 4,
  },
  {
    question: "MockProver가 통과하면 배포 proof도 끝난 걸까요?",
    answer:
      "아닙니다. MockProver는 semantic debugging 도구입니다. 실제 경로는 같은 circuit shape로 keygen_vk·keygen_pk를 만들고 create_proof·verify_proof를 실행합니다.",
    state: "configure/synthesize → keygen → create_proof → verify_proof",
    confirmed: "회로 의미 검사와 cryptographic verifier의 경계",
    unknown: "‘Halo2’ 이름만으로 key와 proof가 호환되는지",
    phase: 5,
  },
  {
    question: "어떤 정보가 같아야 같은 Halo2 proof일까요?",
    answer:
      "Repository commit, curve·commitment scheme, k, transcript, circuit fingerprint와 public schema가 같아야 합니다. Zcash IPA 구현과 KZG fork는 같은 이름이어도 다른 profile입니다.",
    state: "profile = source + curve/PCS + k + transcript + circuit + instance schema",
    confirmed: "Key·proof·verifier를 함께 고정하는 배포 단위",
    unknown: "애플리케이션 relation의 완전성과 production audit는 별도",
    phase: 6,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.question} ${scene.answer} 새로 확정된 것은 ${scene.confirmed}입니다.`,
);

const TABLE = [
  ["statement", "out=12"],
  ["advice", "a=3,b=4"],
  ["fixed", "s_mul"],
  ["identity", "s·(ab−out)"],
  ["proof", "IPA opening"],
] as const;

export default function Halo2RowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 multiplication gate 추적 · row 0 → row 1"
      title="값을 cell에 놓는 일과 관계를 강제하는 일을 따로 봅니다"
      description="3, 4, 12가 어디에 놓이고 selector·rotation·copy constraint·instance binding을 거쳐 proof가 되는지 한 경로로 추적합니다."
      note="이 그림은 Zcash Halo2의 공식 simple-example 배치를 단순화했습니다. 실제 proof profile은 exact source와 parameters를 함께 고정해야 합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="Halo2 cell gate selector copy proof 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[40rem] space-y-4 sm:min-h-[34rem] lg:min-h-[28rem] xl:min-h-[24rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`min-w-0 border px-1 py-2 text-center text-[9px] font-black ${
                    index === scenes.active
                      ? "border-primary bg-primary/10"
                      : index < scenes.active
                        ? "border-foreground/25 bg-background"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(13rem,0.65fr)]">
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 생긴 꼬리 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.question}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.answer}
                </p>
              </article>
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 장면의 상태
                </p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5">
                  {scene.state}
                </p>
              </article>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {TABLE.map(([name, value], index) => (
                <article
                  key={name}
                  className={`min-w-0 border bg-background p-3 ${
                    index <= scene.phase
                      ? "border-primary/60"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <p className="text-[9px] font-bold">{name}</p>
                  <p className="mt-2 break-words font-mono text-[9px] font-black leading-5 sm:text-[10px]">
                    {value}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-primary">새로 확정된 결과</p>
                <p className="mt-2 break-keep text-xs font-semibold leading-5">
                  {scene.confirmed}
                </p>
              </article>
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300">
                  아직 닫히지 않은 질문
                </p>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                  {scene.unknown}
                </p>
              </article>
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="Halo2 한 gate 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
