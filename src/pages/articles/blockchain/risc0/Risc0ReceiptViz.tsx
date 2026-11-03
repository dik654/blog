import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "비공개 입력",
  "guest 실행",
  "journal",
  "method 고정",
  "receipt",
  "무결성만",
  "최종 verify",
  "보장 경계",
] as const;

const SCENES = [
  {
    question: "무엇을 증명하는 가장 작은 사례인가요?",
    answer: "Host는 17과 23을 guest에 넣습니다. 목표는 두 수를 공개하지 않고, 이 guest가 계산한 곱 391만 공개하는 것입니다.",
    state: "private input: a=17 · b=23",
    confirmed: "증명 대상은 Rust source 문장이 아니라, 나중에 ImageID로 가리킬 guest 실행입니다.",
    next: "guest가 두 수로 정확히 무엇을 하는지",
    phase: 0,
  },
  {
    question: "guest 안에서는 어떤 규칙을 실행하나요?",
    answer: "두 u64를 읽고, 어느 값도 1이 아닌지 검사하고, checked_mul로 overflow 없이 곱합니다. 이 실행 규칙 전체가 ELF에 들어갑니다.",
    state: "read(17,23) → reject 1 → checked_mul = 391",
    confirmed: "391만 맞으면 되는 것이 아니라, 고정 guest의 모든 분기와 계산을 통과해야 합니다.",
    next: "계산 결과 가운데 무엇이 공개되는지",
    phase: 1,
  },
  {
    question: "17과 23도 receipt에서 보이나요?",
    answer: "공식 예제의 guest는 product만 env::commit합니다. 따라서 journal에는 391이 들어가고 두 입력은 journal에 쓰이지 않습니다.",
    state: "journal = encode_u64(391) · factors are not committed",
    confirmed: "journal은 공개 출력입니다. 비밀을 commit하면 영지식이 다시 숨겨 주지 않습니다.",
    next: "검증자가 이 계산을 한 guest인지 구별하는 방법",
    phase: 2,
  },
  {
    question: "다른 guest가 391을 써도 같은 증명인가요?",
    answer: "아닙니다. 빌드가 만든 MULTIPLY_ELF의 method identity가 MULTIPLY_ID입니다. 검증자는 네트워크 요청이 준 임의 ID가 아니라 배포 때 고정한 ID를 사용해야 합니다.",
    state: "MULTIPLY_ELF → build identity → MULTIPLY_ID",
    confirmed: "같은 공개값 391이라도 expected ImageID가 다르면 다른 statement입니다.",
    next: "prover가 돌려주는 receipt 안의 역할 분담",
    phase: 3,
  },
  {
    question: "Receipt에는 무엇이 들어 있나요?",
    answer: "inner는 proof variant와 claim을, journal은 공개 bytes를 담습니다. metadata는 상호운용을 돕지만 암호학적으로 결속되지 않아 보안 판단의 근거가 아닙니다.",
    state: "Receipt { inner, journal=391, metadata(untrusted for security) }",
    confirmed: "필드가 Receipt 안에 있다는 사실과 seal이 그 필드를 인증한다는 사실을 구별해야 합니다.",
    next: "verify_integrity만 호출하면 어디까지 확인되는지",
    phase: 4,
  },
  {
    question: "Seal과 journal이 맞으면 바로 승인해도 될까요?",
    answer: "안 됩니다. verify_integrity는 claim과 journal이 seal에 결속됐는지만 봅니다. guest가 실패했는지, 어떤 ImageID를 실행했는지는 확인하지 않습니다.",
    state: "verify_integrity: authentic seal+journal · no success/image check",
    confirmed: "암호학적으로 진짜인 실패 receipt나 다른 guest receipt도 애플리케이션의 정답은 아닐 수 있습니다.",
    next: "verify(MULTIPLY_ID)가 추가로 만드는 기대 claim",
    phase: 5,
  },
  {
    question: "최종 verify는 무엇을 더 확인하나요?",
    answer: "Seal 무결성을 확인한 뒤 MULTIPLY_ID, 정상 종료 Halted(0), 현재 journal digest, 빈 assumptions를 넣은 ReceiptClaim::ok를 만들고 실제 claim digest와 비교합니다.",
    state: "expected = ok(MULTIPLY_ID,H(journal=391)) · expected.digest == inner.claim.digest",
    confirmed: "ImageID·성공 종료·391 가운데 하나만 바뀌어도 같은 expected claim이 아닙니다.",
    next: "verify가 통과해도 애플리케이션에 남는 책임",
    phase: 6,
  },
  {
    question: "Receipt가 통과하면 391의 사업적 의미도 자동으로 맞나요?",
    answer: "아닙니다. 입력 출처, 391의 단위와 스키마, method 버전 허용 목록, receipt freshness와 재사용 방지는 애플리케이션이 정합니다. metadata의 버전 문자열로 대신하면 안 됩니다.",
    state: "valid proof ≠ trusted input · schema meaning · freshness · authorization",
    confirmed: "RISC Zero는 고정 guest의 성공 실행 claim을 인증하고, 그 실행을 언제 왜 믿을지는 바깥 정책이 결정합니다.",
    next: "negative fixtures와 실제 비용을 묶은 release gate",
    phase: 7,
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) => `${LABELS[index]}. ${scene.question} ${scene.answer} 이 장면에서 ${scene.confirmed}`,
);

const PATH = ["17 · 23", "guest ELF", "391", "Receipt", "verify"] as const;

export function Risc0ReceiptViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="공식 hello-world · 17×23"
      title="비공개 두 수로 곱 391을 증명하는 과정"
      description="같은 사례를 유지한 채 guest 실행, journal 공개, ImageID, receipt 무결성, expected claim 비교를 차례로 엽니다."
      note="수치와 API는 RISC Zero main commit 164c64bb의 hello-world와 receipt.rs를 따릅니다. 입력이 비공개라는 말은 이 guest가 journal에 입력을 쓰지 않는다는 범위이며, host·prover 운영 환경까지 자동으로 보호한다는 뜻은 아닙니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        aria-label="RISC Zero receipt 여덟 장면 탐색기"
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div data-viz-live-only className="space-y-4">
          <div data-viz-scene-stage className="min-h-[86rem] space-y-4 sm:min-h-[64rem] lg:min-h-[55rem] xl:min-h-[50rem]">
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
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

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.4fr)_minmax(15rem,0.6fr)]">
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">지금 생긴 꼬리 질문 · {LABELS[scenes.active]}</p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.question}</h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.answer}</p>
              </article>
              <article className="min-w-0 bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">이 장면의 상태</p>
                <p className="mt-2 break-words font-mono text-[10px] font-black leading-5">{scene.state}</p>
              </article>
            </div>

            <div className="bg-border p-px">
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-primary">한 요청의 실제 이동 경로</p>
                <div className="mt-3 grid grid-cols-5 items-stretch gap-1.5">
                  {PATH.map((item, index) => (
                    <div key={item} className="min-w-0">
                      <div className={`grid h-full min-h-14 place-items-center border px-1 text-center text-[8px] font-black leading-4 sm:text-[10px] ${index <= Math.min(scene.phase, 4) ? "border-primary/55 bg-primary/[0.06]" : "border-border text-muted-foreground"}`}>
                        <span className="break-words">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">
                  왼쪽에서 오른쪽으로 host 입력→guest 계산→journal→receipt→검증 순서입니다.
                </p>
              </article>
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-3">
              {[
                ["비공개", "17 · 23", "guest 입력이지만 journal에는 쓰지 않음"],
                ["공개", "391", "env::commit으로 journal에 기록"],
                ["검증자 고정", "MULTIPLY_ID", "허용한 guest의 method identity"],
              ].map(([kind, value, note], index) => (
                <article key={kind} className={`min-w-0 bg-background p-4 ${scene.phase >= index * 2 ? "opacity-100" : "opacity-55"}`}>
                  <p className="text-[9px] font-bold text-primary">{kind}</p>
                  <p className="mt-2 break-words font-mono text-sm font-black">{value}</p>
                  <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{note}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300">verify_integrity</p>
                <ul className="mt-3 space-y-1.5 text-[10px] leading-5">
                  <li className={scene.phase >= 5 ? "font-bold" : "text-muted-foreground"}>✓ seal이 claim을 인증</li>
                  <li className={scene.phase >= 5 ? "font-bold" : "text-muted-foreground"}>✓ journal digest가 output에 결속</li>
                  <li className="text-rose-700 dark:text-rose-300">× 성공 종료와 expected ImageID는 확인하지 않음</li>
                </ul>
              </article>
              <article className="min-w-0 bg-background p-4">
                <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300">verify(MULTIPLY_ID)</p>
                <ul className="mt-3 space-y-1.5 text-[10px] leading-5">
                  <li className={scene.phase >= 6 ? "font-bold" : "text-muted-foreground"}>✓ seal 무결성</li>
                  <li className={scene.phase >= 6 ? "font-bold" : "text-muted-foreground"}>✓ Halted(0) · ImageID · H(journal)</li>
                  <li className="text-rose-700 dark:text-rose-300">× 입력 출처·freshness·업무 권한은 외부 정책</li>
                </ul>
              </article>
            </div>

            <div className="grid gap-px bg-border p-px sm:grid-cols-2">
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-primary">새로 확정된 결과</p>
                <p className="mt-2 break-keep text-xs font-semibold leading-5">{scene.confirmed}</p>
              </article>
              <article className="bg-background p-4">
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300">다음 꼬리 질문</p>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{scene.next}</p>
              </article>
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="RISC Zero receipt 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
