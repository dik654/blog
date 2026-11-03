import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "원본 나누기",
  "복구 조각 만들기",
  "신원 붙이기",
  "네 조각 손실",
  "여섯 조각 복원",
  "오답과 빈칸 구분",
  "사용 목적 선택",
] as const;

const SCENES = [
  {
    title: "600 MiB 파일을 100 MiB source symbol 여섯 개로 나눕니다",
    detail:
      "아직 복구 능력은 없습니다. Source 하나를 잃으면 원본 600 MiB를 그대로 되살릴 수 없습니다.",
    state: "source 6 · repair 0",
    stored: "600 MiB",
    available: 6,
    missing: 0,
    corrupt: 0,
    outcome: "원본만 분할",
  },
  {
    title: "같은 profile로 repair symbol 네 개를 계산해 총 열 조각을 만듭니다",
    detail:
      "(n=10,k=6) MDS profile이면 정확한 symbol 여섯 개만 남아도 복원할 수 있습니다. 총 저장량은 1,000 MiB입니다.",
    state: "source 6 · repair 4",
    stored: "1,000 MiB",
    available: 10,
    missing: 0,
    corrupt: 0,
    outcome: "최대 erasure 4",
  },
  {
    title: "각 조각에 object digest, index, size와 profile version을 붙입니다",
    detail:
      "Decoder가 다른 파일이나 다른 generator의 조각을 섞지 않게 합니다. 조각 개수만 같다고 같은 codeword는 아닙니다.",
    state: "object A · indices 0…9",
    stored: "profile 고정",
    available: 10,
    missing: 0,
    corrupt: 0,
    outcome: "identity 검사 가능",
  },
  {
    title: "위치가 확인된 조각 네 개가 사라져도 여섯 개는 남습니다",
    detail:
      "Checksum이나 timeout 기록으로 2·4·7·9번이 없다는 사실을 압니다. 이것이 위치를 아는 erasure입니다.",
    state: "missing 2 · 4 · 7 · 9",
    stored: "읽은 양 600 MiB",
    available: 6,
    missing: 4,
    corrupt: 0,
    outcome: "threshold 충족",
  },
  {
    title:
      "남은 여섯 symbol을 보간해 source 여섯 개와 원본 digest를 복원합니다",
    detail:
      "복원된 bytes의 전체 object hash까지 맞아야 성공입니다. Decoder가 값을 냈다는 사실만으로 완료하지 않습니다.",
    state: "6 independent symbols",
    stored: "복원 600 MiB",
    available: 6,
    missing: 4,
    corrupt: 0,
    outcome: "digest 일치 → 성공",
  },
  {
    title: "위치를 모르는 오답은 빈칸보다 복구 예산을 두 배 사용합니다",
    detail:
      "(10,6)의 예산은 4입니다. Erasure 네 개는 4칸이지만 unknown error 두 개도 2×2=4칸을 씁니다. Error 두 개와 erasure 하나는 5칸이라 unique decode 경계를 넘습니다.",
    state: "2e+s≤4",
    stored: "예: e=2 · s=0",
    available: 8,
    missing: 0,
    corrupt: 2,
    outcome: "경계 안, 인증은 별도",
  },
  {
    title: "같은 원리를 저장, 전송, 데이터 가용성에 서로 다르게 적용합니다",
    detail:
      "고정 MDS threshold면 RS, 유동적인 packet 수면 RaptorQ, sparse large block이면 LDPC를 검토합니다. DAS에서는 조각 진위, 올바른 encoding, network availability를 따로 입증합니다.",
    state: "보장·channel·decoder 선택",
    stored: "같은 fixture로 측정",
    available: 10,
    missing: 0,
    corrupt: 0,
    outcome: "정확성 뒤 p95 비교",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 이 단계의 판정은 ${scene.outcome}입니다.`,
);

function SymbolStrip({ sceneIndex }: { sceneIndex: number }) {
  const cells = Array.from({ length: 10 }, (_, index) => {
    const notCreated = sceneIndex === 0 && index >= 6;
    const isMissing =
      (sceneIndex === 3 || sceneIndex === 4) && [2, 4, 7, 9].includes(index);
    const isCorrupt = sceneIndex === 5 && [1, 8].includes(index);
    return { index, notCreated, isMissing, isCorrupt };
  });

  return (
    <div
      className="grid grid-cols-5 gap-1.5 sm:grid-cols-10"
      aria-label="열 개 encoded symbol 상태"
    >
      {cells.map(({ index, notCreated, isMissing, isCorrupt }) => (
        <div
          key={index}
          className={`min-w-0 border px-1 py-3 text-center font-mono text-[9px] font-black ${
            notCreated
              ? "border-dashed border-border bg-muted/20 text-muted-foreground/60"
              : isMissing
                ? "border-dashed border-muted-foreground/50 bg-muted/30 text-muted-foreground"
                : isCorrupt
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : index < 6
                    ? "border-foreground/30 bg-foreground/5"
                    : "border-primary/50 bg-primary/10 text-primary"
          }`}
        >
          {notCreated
            ? "미생성"
            : isMissing
              ? "없음"
              : isCorrupt
                ? "오답"
                : index < 6
                  ? `S${index}`
                  : `R${index - 6}`}
        </div>
      ))}
    </div>
  );
}

export default function ErasureObjectTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="600 MiB object · RS (10,6) · 100 MiB symbols"
      title="복사본을 늘리는 대신, 열 조각 중 아무 여섯 조각으로 원본을 되살립니다"
      description="원본을 나누는 순간부터 손실·복원·오답 예산·사용 목적 선택까지 같은 object 한 건을 따라갑니다."
      note="(10,6) MDS와 100 MiB symbol은 설명용 고정 사례입니다. 실제 구현은 field·generator·packing·object identity를 같은 profile로 고정해야 합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="600 MiB object의 erasure coding 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[47rem] space-y-4 sm:min-h-[33rem] xl:min-h-[29rem]"
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
                  이 단계의 판정
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.outcome}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  조각을 받음, 원본을 복원함, 애플리케이션에서 신뢰함은 서로
                  다른 완료 상태입니다.
                </p>
              </div>
            </div>

            <SymbolStrip sceneIndex={scenes.active} />

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["code profile", "n=10 · k=6"],
                ["현재 조각", scene.state],
                ["저장·복원량", scene.stored],
                ["결과", scene.outcome],
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
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="erasure coding object 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
