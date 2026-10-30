import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { useEffect, useRef } from "react";

const SCENES = [
  "관계 선언",
  "Composer 행",
  "전처리",
  "Wire 약정",
  "순열 누적곱",
  "몫 다항식",
  "평가와 열기",
  "검증",
] as const;

const SHORT = ["관계", "행", "키", "wire", "순열", "몫", "열기", "검증"] as const;

const NOTES = [
  "공개 주장은 z=12입니다. Prover는 비공개 x=3, y=4를 알고 있다는 사실을 증명하지만 두 값을 verifier에게 보내지는 않습니다.",
  "gate_mul은 3×4의 결과 witness 12를 만들고, append_public은 공개 z=12를 별도 행에 넣습니다. assert_equal이 두 witness를 같은 값으로 묶습니다.",
  "Compiler는 기본 circuit의 행 모양을 고정하고 selector·sigma polynomials를 만든 뒤 KZG로 약정해 Prover와 Verifier를 만듭니다.",
  "실제 witness로 a·b·c·d wire vectors를 다시 만들고 blinding한 polynomial 네 개를 약정합니다. 이 구현은 원 논문의 세 wire가 아니라 width-4 TurboPLONK 계열입니다.",
  "Wire 약정 뒤 transcript에서 β·γ를 얻습니다. 실제 copy wiring과 identity wiring의 비율을 누적한 Z(X)를 만들고 z_comm을 transcript에 넣습니다.",
  "z_comm 뒤 α와 widget 분리 challenge를 얻고, gate·permutation·public input 관계를 Z_H(X)로 나눈 T(X)를 계산합니다. 구현은 이를 네 조각으로 나눠 약정합니다.",
  "T 약정 뒤 ζ를 얻어 필요한 polynomial 값을 평가합니다. v·vω로 여러 열기를 합치고 ζ와 ζω 두 점의 KZG opening commitments를 만듭니다.",
  "Verifier는 공개 입력 12와 proof만으로 같은 transcript를 재생합니다. Linearization과 두 KZG opening을 하나의 pairing 식으로 검사해 Ok(()) 또는 오류를 반환합니다.",
] as const;

const NODES = [
  ["CLAIM", "z = 12"],
  ["COMPOSER", "3 rows"],
  ["COMPILER", "PK · VK"],
  ["ROUND 1", "[a] [b] [c] [d]"],
  ["ROUND 2", "β · γ · [Z]"],
  ["ROUND 3", "α · [T₀..T₃]"],
  ["ROUND 4–5", "ζ · evals · [W]"],
  ["VERIFIER", "pairing · Ok"],
] as const;

const STATE = [
  ["공개", "z=12", "비공개", "x=3 · y=4", "현재 객체", "relation"],
  ["곱 행", "3×4−12=0", "공개 행", "−12+PI=0", "같음 행", "12−12=0"],
  ["고정", "selectors · σ", "약정", "verifier key", "출력", "prover · verifier"],
  ["입력", "actual witness", "polynomial", "a · b · c · d", "출력", "4 commitments"],
  ["도전값", "β · γ", "누적곱", "Z(X)", "출력", "z_comm"],
  ["도전값", "α + separators", "몫", "T(X)", "출력", "4 commitments"],
  ["평가점", "ζ · ζω", "평가", "wire · σ · Z · q", "열기", "Wζ · Wζω"],
  ["입력", "VK · PI · proof", "계산", "transcript · pairing", "반환", "Ok(())"],
] as const;

function TraceMap({ active }: { active: number }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const target = scroller?.querySelector<HTMLElement>(`[data-plonk-node="${active}"]`);
    if (!scroller || !target) return;
    const targetLeft =
      target.getBoundingClientRect().left -
      scroller.getBoundingClientRect().left +
      scroller.scrollLeft;
    scroller.scrollTo({
      left: targetLeft - (scroller.clientWidth - target.offsetWidth) / 2,
      behavior: "auto",
    });
  }, [active]);

  return (
    <div aria-label="공개 주장 z=12가 Dusk PLONK의 circuit, transcript와 KZG 검증을 통과하는 경로">
      <div ref={scrollerRef} className="overflow-x-auto">
        <div
          className="grid grid-cols-8 gap-px bg-border p-px"
          style={{ width: "max(100%, 860px)" }}
        >
          {NODES.map(([name, value], index) => (
            <div
              key={name}
              data-plonk-node={index}
              className={`relative min-w-0 bg-background px-2 py-3 sm:min-h-24 ${
                index === active
                  ? "ring-2 ring-inset ring-primary"
                  : index < active
                    ? "opacity-75"
                    : "opacity-35"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[8px] font-black text-primary">{name}</span>
                <span className="font-mono text-[8px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <strong className="mt-3 block break-keep text-center font-mono text-[10px] leading-5 sm:text-xs">
                {value}
              </strong>
              {index < NODES.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -right-1 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-primary bg-background"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        {[0, 1, 2].map((index) => (
          <div key={STATE[active][index * 2]} className="min-w-0 bg-background px-2 py-3">
            <span className="block break-keep text-muted-foreground">
              {STATE[active][index * 2]}
            </span>
            <strong className="mt-1 block break-keep text-primary">
              {STATE[active][index * 2 + 1]}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlonkImplementationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4700, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = tabsRef.current;
    const target = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !target) return;
    const targetLeft =
      target.getBoundingClientRect().left -
      scroller.getBoundingClientRect().left +
      scroller.scrollLeft;
    scroller.scrollTo({
      left: targetLeft - (scroller.clientWidth - target.offsetWidth) / 2,
      behavior: "auto",
    });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="한 증명의 전체 경로 · x=3 · y=4 · z=12"
      title="Rust circuit의 세 값은 Composer 행이 되고, 약정과 도전값을 거쳐 pairing 판정으로 끝납니다"
      description="회로 작성, compile, prove, verify는 한 함수가 아니라 서로 다른 상태와 입력을 가진 단계입니다."
      note="그림은 dusk-plonk v0.22.1의 V3 경로를 따릅니다. 다른 PLONKish 구현의 wire 수, round와 proof 구조는 달라질 수 있습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-plonk-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Dusk PLONK 증명과 검증을 여덟 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div
              className="grid grid-cols-8 gap-px bg-border p-px"
              style={{ width: "max(100%, 620px)" }}
            >
              {SCENES.map((scene, index) => (
                <button
                  type="button"
                  key={scene}
                  aria-pressed={index === scenes.active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:py-2 ${
                    index === scenes.active
                      ? "text-primary"
                      : index < scenes.active
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  <span className="block font-mono text-[8px] font-black">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">
                    {SHORT[index]}
                  </strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">
                    {scene}
                  </strong>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <TraceMap active={scenes.active} />
          </div>
          <p
            data-scene-note
            className="mt-2 min-h-[10rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[6.5rem] sm:pl-4 sm:text-sm sm:leading-6"
          >
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={SCENES}
          playLabel="PLONK 경로 재생"
          compact
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function PlonkCircuitRowsViz() {
  const rows = [
    ["곱셈", "a=3 · b=4 · c=12", "qM·ab + qO·c = 12−12 = 0"],
    ["공개", "a=z=12 · PI=12", "−a + PI = −12+12 = 0"],
    ["같음", "a=expected · b=z", "a−b = 12−12 = 0"],
  ] as const;

  return (
    <VizFrame
      eyebrow="Circuit API가 만드는 실제 행"
      title="x·y=z 한 문장은 Dusk Composer에서 세 개의 의미 있는 행으로 내려갑니다"
      description="gate_mul은 결과 witness를 계산하고, 공개 입력과 equality constraint는 별도 행으로 추가됩니다."
      note="Composer::initialized가 추가하는 상수·dummy 행은 생략했습니다. 회로의 총 행 수는 이 세 행보다 큽니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="grid gap-px bg-border p-px md:grid-cols-3">
        {rows.map(([name, values, equation], index) => (
          <div key={name} className="min-w-0 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] font-black text-primary">ROW {index + 1}</span>
              <strong className="text-xs">{name}</strong>
            </div>
            <p className="mt-3 break-keep font-mono text-xs">{values}</p>
            <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{equation}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        <div className="bg-background p-3 text-center"><strong>private x·y</strong><p className="mt-1 text-xs text-muted-foreground">3 · 4</p></div>
        <span aria-hidden className="hidden items-center bg-background px-3 text-primary sm:flex">→</span>
        <div className="bg-background p-3 text-center"><strong>expected</strong><p className="mt-1 text-xs text-muted-foreground">12</p></div>
        <span aria-hidden className="hidden items-center bg-background px-3 text-primary sm:flex">=</span>
        <div className="bg-background p-3 text-center ring-2 ring-inset ring-primary"><strong>public z</strong><p className="mt-1 text-xs text-muted-foreground">12</p></div>
      </div>
    </VizFrame>
  );
}

export function PlonkTranscriptViz() {
  const phases = [
    ["PI", "public input"],
    ["[a,b,c,d]", "wire commitments"],
    ["β · γ", "permutation challenges"],
    ["[Z]", "grand product"],
    ["α", "quotient challenge"],
    ["[T₀..T₃]", "quotient commitments"],
    ["ζ", "evaluation point"],
    ["evals", "opened values"],
    ["v · vω", "batch challenges"],
    ["[Wζ] · [Wζω]", "opening commitments"],
    ["u", "pairing batch"],
  ] as const;

  return (
    <VizFrame
      eyebrow="Fiat–Shamir transcript"
      title="도전값은 앞 단계의 약정을 transcript에 넣은 뒤에만 나옵니다"
      description="Verifier도 public input과 proof에서 같은 순서를 재생해야 같은 β·γ·α·ζ·v·u를 얻습니다."
      note="v0.22.1의 V3 transcript입니다. V2·V3 호환 경로와 다른 PLONK 구현의 label·round를 섞으면 안 됩니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="overflow-x-auto">
        <div
          className="grid grid-cols-11 gap-px bg-border p-px"
          style={{ width: "max(100%, 1060px)" }}
        >
          {phases.map(([value, role], index) => (
            <div key={value} className="relative min-w-0 bg-background p-3 text-center">
              <span className="font-mono text-[8px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-2 block break-keep font-mono text-[10px]">{value}</strong>
              <p className="mt-2 break-keep text-[8px] leading-4 text-muted-foreground">{role}</p>
              {index < phases.length - 1 ? <span aria-hidden className="absolute -right-1 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-primary bg-background" /> : null}
            </div>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}

export default PlonkImplementationViz;
