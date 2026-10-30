import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { useEffect, useRef } from "react";

const SCENES = [
  "주장",
  "변수 할당",
  "R1CS 검사",
  "QAP 변환",
  "proof 생성",
  "공개 입력 준비",
  "pairing 검사",
  "판정",
] as const;

const SHORT = ["주장", "할당", "제약", "QAP", "proof", "입력", "pairing", "판정"] as const;

const NOTES = [
  "공개 주장은 z=15입니다. Prover는 비공개 값 x=3과 y=5를 안다고 주장하지만, verifier에게 두 값을 보내지는 않습니다.",
  "arkworks의 instance assignment는 [1, 15], witness assignment는 [3, 5]가 됩니다. 맨 앞의 1은 상수항을 표현하기 위해 자동으로 포함됩니다.",
  "한 제약식은 ⟨A,w⟩=3, ⟨B,w⟩=5, ⟨C,w⟩=15를 만들고 3×5=15인지 확인합니다. z를 14로 바꾸면 여기서 만족하지 않습니다.",
  "R1CS의 여러 행을 polynomial A(X), B(X), C(X)로 옮깁니다. 만족한 witness라면 A(X)B(X)−C(X)가 domain에서 0이라 H(X)로 나누어떨어집니다.",
  "Prover는 proving key, witness, QAP 계수와 새 randomness r·s를 사용해 A∈G1, B∈G2, C∈G1 세 점을 만듭니다. 이 A·B·C는 앞 단계의 polynomial 이름과 구분해야 합니다.",
  "Verifier는 z=15를 verifying key의 gamma_abc_g1과 결합해 g_ic를 만듭니다. 비공개 x=3, y=5는 이 계산의 입력이 아닙니다.",
  "Verifier는 proof의 세 점과 g_ic를 하나의 multi-pairing 식에 넣습니다. Proof나 public z를 바꾸면 같은 등식이 성립하지 않아야 합니다.",
  "Pairing 결과가 verifying key에 미리 준비된 e(αG1,βG2)와 같으면 true입니다. 이 판정은 이 key의 circuit에 대해 public z=15를 만족하는 witness가 있다는 주장만 승인합니다.",
] as const;

const NODES = [
  ["PUBLIC CLAIM", "z = 15"],
  ["ASSIGNMENTS", "[1,15] · [3,5]"],
  ["R1CS ROW", "3 × 5 = 15"],
  ["WITNESS MAP", "H(X)"],
  ["PROOF", "A · B · C"],
  ["PUBLIC COMBINATION", "g_ic(z)"],
  ["PAIRING", "3 pair terms"],
  ["VERDICT", "true"],
] as const;

const STATE = [
  ["공개", "z=15", "비공개", "x=3 · y=5", "현재 상태", "검사 전"],
  ["instance", "[1,15]", "witness", "[3,5]", "현재 객체", "field values"],
  ["A row", "3", "B row", "5", "C row", "15"],
  ["입력", "R1CS+witness", "출력", "H coefficients", "필요조건", "remainder 0"],
  ["G1", "proof.a · proof.c", "G2", "proof.b", "비공개 값", "직접 노출 안 됨"],
  ["verifier 입력", "z=15", "결합 결과", "g_ic", "private", "사용하지 않음"],
  ["왼쪽", "proof points", "오른쪽", "prepared VK", "연산", "multi pairing"],
  ["반환", "true", "승인한 주장", "∃x,y: x·y=15", "비공개 값", "공개하지 않음"],
] as const;

function TraceMap({ active }: { active: number }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const target = scroller?.querySelector<HTMLElement>(`[data-groth16-node="${active}"]`);
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
    <div aria-label="공개 주장 z=15가 witness와 R1CS를 거쳐 Groth16 검증 결과가 되는 경로">
      <div ref={scrollerRef} className="overflow-x-auto">
        <div
          className="grid grid-cols-8 gap-px bg-border p-px"
          style={{ width: "max(100%, 820px)" }}
        >
          {NODES.map(([name, value], index) => (
            <div
              key={name}
              data-groth16-node={index}
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

export function Groth16ImplementationViz() {
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
      eyebrow="한 증명의 전체 경로 · x=3 · y=5 · z=15"
      title="비공개 3과 5는 proof 세 점이 되고, verifier는 공개값 15만으로 검증합니다"
      description="Circuit, witness, proving key와 public input은 서로 다른 입력이며, verifier가 보는 값도 다릅니다."
      note="작은 곱셈 회로는 데이터 경계를 설명하기 위한 예입니다. 실제 proof 점은 선택한 pairing curve와 circuit-specific setup에 따라 달라집니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-groth16-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Groth16 증명과 검증을 여덟 장면으로 추적"
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
            className="mt-2 min-h-[9rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[5.5rem] sm:pl-4 sm:text-sm sm:leading-6"
          >
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={SCENES}
          playLabel="Groth16 경로 재생"
          compact
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function Groth16VisibilityViz() {
  return (
    <VizFrame
      eyebrow="누가 무엇을 봅니까"
      title="Prover는 witness를 사용하지만 verifier에게 보내는 것은 proof와 public input뿐입니다"
      description="Zero knowledge를 설명할 때 private 값을 단순히 전송하지 않는다는 사실과, cryptographic hiding 성질을 구분합니다."
      note="Setup과 proving key의 안전성, randomness와 protocol 가정까지 충족해야 zero-knowledge 성질을 말할 수 있습니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        <div className="bg-background p-4">
          <span className="font-mono text-[9px] font-black text-primary">PROVER</span>
          <strong className="mt-2 block break-keep text-sm">pk · z=15 · x=3 · y=5</strong>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">비공개 witness로 R1CS를 만족시키고 proof A·B·C를 계산합니다.</p>
        </div>
        <div className="flex min-h-14 items-center justify-center bg-background px-4 text-primary">
          proof A·B·C →
        </div>
        <div className="bg-background p-4 ring-2 ring-inset ring-primary">
          <span className="font-mono text-[9px] font-black text-primary">VERIFIER</span>
          <strong className="mt-2 block break-keep text-sm">vk · z=15 · proof</strong>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">x와 y를 입력받지 않고 public input과 pairing 식만 검사합니다.</p>
        </div>
      </div>
      <div className="mt-3 grid gap-px bg-border p-px text-center text-xs sm:grid-cols-3">
        <div className="bg-background p-3"><strong>공개</strong><p className="mt-1 text-muted-foreground">z=15 · circuit identity</p></div>
        <div className="bg-background p-3"><strong>비공개</strong><p className="mt-1 text-muted-foreground">x=3 · y=5</p></div>
        <div className="bg-background p-3"><strong>전송</strong><p className="mt-1 text-muted-foreground">A∈G1 · B∈G2 · C∈G1</p></div>
      </div>
    </VizFrame>
  );
}

export function Groth16VerifierViz() {
  const terms = [
    ["e(A,B)", "proof A·B"],
    ["e(g_ic,−γ)", "public z"],
    ["e(C,−δ)", "proof C"],
    ["e(α,β)", "prepared VK"],
  ] as const;

  return (
    <VizFrame
      eyebrow="Verifier의 실제 계산 경계"
      title="세 pairing 항의 곱을 verifying key의 기준 pairing과 비교합니다"
      description="Public input z가 바뀌면 g_ic가 달라지고, proof의 A·B·C가 바뀌어도 왼쪽 pairing 결과가 달라집니다."
      note="식은 arkworks verifier.rs의 multi_miller_loop와 final_exponentiation을 읽기 쉬운 곱 형태로 옮긴 것입니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="overflow-x-auto">
        <div
          className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-px bg-border p-px"
          style={{ width: "max(100%, 720px)" }}
        >
          {terms.map(([formula, role], index) => (
            <div key={formula} className="contents">
              <div className={`min-w-0 bg-background p-4 text-center ${index === 3 ? "ring-2 ring-inset ring-primary" : ""}`}>
                <strong className="font-mono text-sm text-primary">{formula}</strong>
                <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{role}</p>
              </div>
              {index < terms.length - 1 ? (
                <span aria-hidden className="flex items-center bg-background px-3 text-primary">
                  {index === 2 ? "=" : "×"}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}

export default Groth16ImplementationViz;
