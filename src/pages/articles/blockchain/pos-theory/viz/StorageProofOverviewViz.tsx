import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "파일 준비",
  "PoR 표본",
  "전체 복구",
  "복제본 생성",
  "PoRep 확인",
  "PoSt 반복",
  "서비스 경계",
] as const;

const SCENES = [
  {
    title: "Alice의 파일 F를 복구 가능한 encoded blocks로 바꿉니다",
    detail:
      "Error-correcting encoding과 block authenticator를 만들고 verifier metadata를 보관합니다. 원본·encoding·key를 잃으면 provider가 data를 가지고 있어도 extractor가 복구하지 못할 수 있습니다.",
    claim: "복구 시험의 입력 고정",
    proof: "아직 없음",
    next: "일부 block 답만으로 전체를 말할 수 있나?",
  },
  {
    title: "PoR verifier가 예측하기 어려운 block 표본을 묻습니다",
    detail:
      "Provider는 challenged encoded blocks와 authenticator에서 짧은 response를 만듭니다. 한 번의 PASS가 말하는 것은 이번 표본에 답했다는 사실입니다.",
    claim: "이번 표본의 응답 확인",
    proof: "PoR audit response",
    next: "표본 성공이 왜 full retrieval인가?",
  },
  {
    title: "반복 응답률과 encoding 조건을 extractor의 전체 복구에 연결합니다",
    detail:
      "PoR의 핵심은 sample을 맞혔다는 말이 아니라, theorem이 정한 error bound 안에서 반복 질의하는 extractor가 F를 복구할 수 있다는 주장입니다.",
    claim: "조건부 full-file retrievability",
    proof: "extractor theorem",
    next: "같은 data의 독립 복제본은 어떻게 구분하나?",
  },
  {
    title:
      "Filecoin은 data와 provider·sector·ticket을 묶어 replica R을 만듭니다",
    detail:
      "같은 data D라도 replica identity가 다르면 replica-specific encoding과 commitment가 달라져야 합니다. 이는 물리 disk 위치를 직접 보는 센서가 아닙니다.",
    claim: "복제본별 commitment 생성",
    proof: "CommD · CommR",
    next: "실제로 그 encoding을 만들었나?",
  },
  {
    title: "PoRep가 data commitment와 replica commitment의 관계를 검증합니다",
    detail:
      "Sealing 시점의 proof는 특정 provider·sector context에 맞는 unique encoding을 만들었다는 주장을 확인합니다. 한 번 만든 뒤 계속 보관했다는 뜻은 아직 아닙니다.",
    claim: "초기 replica 생성 확인",
    proof: "PoRep proof",
    next: "시간이 지난 뒤에도 가지고 있나?",
  },
  {
    title: "PoSt가 fresh randomness와 deadline으로 보관 의무를 반복 검사합니다",
    detail:
      "Window마다 sector snapshot과 challenge를 고정하고 deadline 안 proof를 확인합니다. WinningPoSt는 block 생산 자격, WindowPoSt는 주기적 storage audit라는 역할 차이가 있습니다.",
    claim: "시간축 storage evidence",
    proof: "Winning·Window PoSt",
    next: "사용자가 지금 빠르게 받을 수 있나?",
  },
  {
    title: "Proof PASS와 실제 retrieval·privacy·placement를 별도 gate로 둡니다",
    detail:
      "Accepted proof sequence가 있어도 user-facing latency, encryption key, geographic diversity와 독립 장애 영역은 따로 측정해야 합니다. Storage proof는 이 모든 서비스 품질을 한 번에 증명하지 않습니다.",
    claim: "암호 증명과 서비스 SLO 분리",
    proof: "proof receipt + retrieval test",
    next: "어느 주장을 어떤 증거가 맡는가?",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 이 단계의 결론은 ${scene.claim}입니다.`,
);

export default function StorageProofOverviewViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8600, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="Alice의 파일 F 한 건 · 표본 응답에서 시간축 보관까지"
      title="PoR·PoRep·PoSt는 같은 ‘파일이 있다’를 세 번 부르는 이름이 아닙니다"
      description="전체 복구 가능성, replica-specific encoding과 시간에 걸친 보관 의무를 같은 파일로 따라갑니다."
      note="표본 수와 sector·window 수치는 설명용입니다. 실제 보안 주장은 각 construction과 network version의 전제에 귀속합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="PoR PoRep PoSt 저장 증명 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[42rem] space-y-4 sm:min-h-[34rem] xl:min-h-[29rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`border px-1 py-2 text-center text-[9px] font-black ${
                    index === scenes.active
                      ? "border-primary bg-primary/10"
                      : index < scenes.active
                        ? "border-foreground/30 bg-background"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.45fr)_minmax(13rem,0.55fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 답할 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.title}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.detail}
                </p>
              </div>
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계에서 말할 수 있는 것
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.claim}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  다음 질문 · {scene.next}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <article className="min-w-0 border border-border bg-background p-3">
                <p className="text-[9px] font-bold text-muted-foreground">
                  남은 증거
                </p>
                <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.proof}
                </p>
              </article>
              <article className="min-w-0 border border-primary/60 bg-background p-3">
                <p className="text-[9px] font-bold text-muted-foreground">
                  꼬리 질문
                </p>
                <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                  {scene.next}
                </p>
              </article>
            </div>

            <div className="flex gap-1" aria-hidden="true">
              {LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`h-1.5 flex-1 ${
                    index <= scenes.active ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="파일 F의 저장 증명 질문 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
