import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "입력 고정",
  "첫 제곱",
  "T회 완료",
  "도전값 생성",
  "증명 생성",
  "빠른 검증",
  "보장 범위",
] as const;

const CHAIN = [
  { exponent: "g", value: "3" },
  { exponent: "g²", value: "9" },
  { exponent: "g⁴", value: "13" },
  { exponent: "g⁸", value: "16" },
  { exponent: "g¹⁶ = y", value: "1" },
] as const;

const SCENES = [
  {
    title: "군과 입력 g, 반복 횟수 T를 먼저 고정합니다",
    detail:
      "VDF의 입력은 단순한 숫자 하나가 아닙니다. 공개 매개변수와 미지 순서 군, 입력을 군 원소로 바꾸는 규칙, T가 같은 계산을 정의합니다.",
    progress: 0,
    transcript: "(G, g=3, T=4)",
    proof: "아직 없음",
    check: "아직 시작하지 않음",
    result: "평가 입력 고정",
  },
  {
    title: "첫 결과가 나와야 다음 제곱을 시작할 수 있습니다",
    detail:
      "3² mod 17 = 9를 계산합니다. 각 단계가 직전 단계의 출력에 의존하므로 같은 한 경로를 여러 코어로 나눠 동시에 끝낼 수 없습니다.",
    progress: 1,
    transcript: "g → g²",
    proof: "아직 없음",
    check: "1 / 4회 계산",
    result: "중간값 9",
  },
  {
    title: "앞선 출력을 이어 받아 네 번 제곱하면 y가 나옵니다",
    detail:
      "9²→13, 13²→16, 16²→1의 순서를 거쳐 y=1이 됩니다. 실제 VDF는 이 작은 군이 아니라 순서를 알기 어려운 큰 군을 사용합니다.",
    progress: 4,
    transcript: "y = g^(2⁴)",
    proof: "아직 없음",
    check: "4 / 4회 계산",
    result: "평가 결과 y=1",
  },
  {
    title: "결과 y를 먼저 고정한 뒤 transcript에서 소수 ℓ을 만듭니다",
    detail:
      "비대화형 Wesolowski 증명에서는 prover가 유리한 ℓ을 먼저 고르지 못하게 합니다. 논문 구성은 (G,g,y,T)를 hash-to-prime 입력으로 사용합니다.",
    progress: 4,
    transcript: "ℓ = Hprime(G,g,y,T) = 5",
    proof: "아직 없음",
    check: "16 = q·5 + r",
    result: "도전 소수 ℓ=5",
  },
  {
    title: "2^T를 ℓ로 나눈 몫 q를 군의 지수로 옮겨 π를 만듭니다",
    detail:
      "예시에서는 16=3·5+1이므로 q=3, r=1, π=g³=10 mod 17입니다. 큰 q는 정수로 펼치지 않고 지수 안에서 long division으로 계산합니다.",
    progress: 4,
    transcript: "q=3 · r=1",
    proof: "π = g^q = 10",
    check: "검증식 준비",
    result: "군 원소 하나인 증명 π",
  },
  {
    title: "검증자는 T번의 제곱을 되풀이하지 않고 한 식을 확인합니다",
    detail:
      "π⁵·g¹ mod 17 = 10⁵·3 mod 17 = 1이므로 제출된 y와 같습니다. 실제 비용은 ℓ 크기와 군 연산에 좌우되며 T에 비해 훨씬 작습니다.",
    progress: 4,
    transcript: "r = 2^T mod ℓ = 1",
    proof: "π=10",
    check: "π^ℓ · g^r = y",
    result: "이 tuple의 검증 통과",
  },
  {
    title: "통과했다는 사실과 애플리케이션이 얻는 보장을 구분합니다",
    detail:
      "검증 성공은 고정한 매개변수에서 y와 π가 관계식을 만족한다는 뜻입니다. 정확한 초 단위 지연, 난수의 공정성, 블록 확정성은 별도 계측과 프로토콜이 책임집니다.",
    progress: 4,
    transcript: "고정된 (G,g,T,y,π)",
    proof: "Wesolowski 관계식 통과",
    check: "검증됨 ≠ 모든 응용 보장",
    result: "VDF 결과만 승인",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 현재 결과는 ${scene.result}입니다.`,
);

export default function VdfEvaluationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];
  const showChallenge = scenes.active >= 3;
  const showProof = scenes.active >= 4;
  const showVerify = scenes.active >= 5;

  return (
    <VizFrame
      eyebrow="산술 예시 · g=3 · mod 17 · T=4"
      title="네 번 이어 계산한 결과를 짧은 증명 하나로 확인합니다"
      description="입력 고정부터 반복 제곱, Wesolowski 증명과 검증 경계까지 한 요청을 따라갑니다. 작은 mod 17 계산은 산술을 보여 줄 뿐, 안전한 VDF 매개변수가 아닙니다."
      note="실제 비대화형 구성의 transcript와 군 선택은 고정한 명세를 따라야 합니다. 이 그림의 ℓ=5는 식을 손으로 확인하기 위한 설명용 값입니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="VDF 평가와 Wesolowski 검증 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[31rem] space-y-4 xl:min-h-[27rem]"
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.4fr)_minmax(13rem,0.6fr)]">
              <div className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 확인할 상태 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.title}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.detail}
                </p>
                <p className="mt-3 border-l-2 border-primary pl-3 font-mono text-[10px] font-black leading-5 sm:hidden">
                  {scene.result}
                </p>
              </div>
              <div className="hidden min-w-0 bg-background p-4 sm:block sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계에서 확정된 것
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.result}
                </p>
                <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">
                  계산 완료, 증명 생성, 애플리케이션 사용 승인은 서로 다른 완료
                  상태입니다.
                </p>
              </div>
            </div>

            <div className="border border-border bg-background p-3 sm:p-4">
              <p className="text-[9px] font-bold text-muted-foreground">
                앞 결과를 다음 입력으로 쓰는 한 경로
              </p>
              <div className="mt-3 grid grid-cols-5 items-center gap-1.5">
                {CHAIN.map((item, index) => (
                  <div key={item.exponent} className="min-w-0 text-center">
                    <div
                      className={`mx-auto flex aspect-square max-h-14 max-w-14 items-center justify-center rounded-full border font-mono text-[10px] font-black sm:text-xs ${
                        index <= scene.progress
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      {item.exponent}
                    </div>
                    <p className="mt-1 font-mono text-[9px] font-bold">
                      {item.value}
                    </p>
                    {index < CHAIN.length - 1 ? (
                      <span className="sr-only">
                        다음 값은 현재 값을 제곱합니다.
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1" aria-hidden="true">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1 ${step <= scene.progress ? "bg-primary" : "bg-border"}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <article
                className={`min-w-0 border bg-background p-3 ${showChallenge ? "border-primary/60" : "border-border"}`}
              >
                <p className="text-[9px] font-bold text-muted-foreground">
                  transcript → 소수
                </p>
                <p className="mt-2 break-words font-mono text-[9px] font-black leading-5 sm:text-[10px]">
                  {showChallenge ? scene.transcript : "y가 나온 뒤 생성"}
                </p>
              </article>
              <article
                className={`min-w-0 border bg-background p-3 ${showProof ? "border-primary/60" : "border-border"}`}
              >
                <p className="text-[9px] font-bold text-muted-foreground">
                  prover가 보내는 값
                </p>
                <p className="mt-2 break-words font-mono text-[9px] font-black leading-5 sm:text-[10px]">
                  {showProof ? scene.proof : "아직 π 없음"}
                </p>
              </article>
              <article
                className={`min-w-0 border bg-background p-3 ${showVerify ? "border-primary/60" : "border-border"}`}
              >
                <p className="text-[9px] font-bold text-muted-foreground">
                  verifier의 판정
                </p>
                <p className="mt-2 break-words font-mono text-[9px] font-black leading-5 sm:text-[10px]">
                  {showVerify ? scene.check : "증명을 기다림"}
                </p>
              </article>
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="VDF 평가와 검증 과정 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
