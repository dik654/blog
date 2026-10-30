import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { useEffect, useRef } from "react";

const SCENES = [
  "압축 bytes", "x와 부호", "y 후보", "점 선택",
  "곡선 검사", "부분군 검사", "점 두 배", "출력 bytes",
] as const;

const SHORT = ["입력", "해석", "복원", "선택", "곡선", "부분군", "연산", "출력"] as const;

const NOTES = [
  "입력은 0x03 0x05입니다. 첫 byte는 설명용 홀수 y 표식이고, 두 번째 byte는 x=5입니다. 아직 점이 아니라 검증되지 않은 byte 배열입니다.",
  "고정 길이와 표식을 확인한 뒤 x=5를 읽습니다. 설명용 field F₁₇의 범위 0≤x<17을 통과해야 다음 단계로 갑니다.",
  "곡선식 y²=x³+2x+2에 x=5를 넣으면 우변은 1입니다. F₁₇에서 제곱해 1이 되는 y는 1과 16입니다.",
  "0x03의 홀수 표식과 맞는 y=1을 골라 후보 P=(5,1)을 만듭니다. 다른 표식이었다면 같은 x의 반대점 (5,16)을 골랐을 것입니다.",
  "1² mod17과 5³+2·5+2 mod17이 모두 1인지 다시 확인합니다. 이 검사를 통과해야 후보가 곡선 위의 점이 됩니다.",
  "이 설명용 곡선은 무한원점을 포함해 19개 점을 가지며 [19]P=O입니다. 따라서 P는 여기서 사용할 19차 부분군에 속합니다.",
  "P를 두 배로 만들 때 기울기 λ=13을 구합니다. x₂=λ²−2x=6, y₂=λ(x−x₂)−y=3이므로 2P=(6,3)입니다.",
  "결과의 y=3이 홀수이므로 표식 0x03과 x=6을 기록합니다. 입력 bytes가 승인된 점과 연산을 거쳐 0x03 0x06으로 돌아옵니다.",
] as const;

const NODES = [
  ["PUBLIC BYTES", "03 · 05"], ["DECODED", "odd · x=5"],
  ["ROOTS", "y=1 · 16"], ["CANDIDATE", "P=(5,1)"],
  ["ON CURVE", "1 = 1"], ["SUBGROUP", "[19]P=O"],
  ["GROUP OP", "2P=(6,3)"], ["PUBLIC BYTES", "03 · 06"],
] as const;

const STATE = [
  ["현재 객체", "bytes", "승인 상태", "검사 전", "다음 질문", "표식·길이"],
  ["현재 객체", "x 후보", "공개 값", "x=5", "다음 질문", "제곱근 존재"],
  ["현재 객체", "두 좌표 후보", "방정식 우변", "1", "다음 질문", "부호 선택"],
  ["현재 객체", "점 후보", "선택한 y", "1", "다음 질문", "곡선 위인가"],
  ["현재 객체", "곡선점", "등식", "1=1", "다음 질문", "부분군인가"],
  ["현재 객체", "승인된 점", "점의 차수", "19", "다음 질문", "그룹 연산"],
  ["현재 객체", "결과 점", "연산", "P+P", "다음 질문", "직렬화"],
  ["현재 객체", "bytes", "공개 결과", "03 · 06", "왕복", "완료"],
] as const;

function TraceMap({ active }: { active: number }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = scrollerRef.current;
    const target = scroller?.querySelector<HTMLElement>(`[data-curve-node="${active}"]`);
    if (!scroller || !target) return;
    scroller.scrollTo({ left: target.offsetLeft - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);
  return (
    <div aria-label="압축 bytes가 승인된 점과 두 배 연산을 거쳐 다시 bytes가 되는 경로">
      <div ref={scrollerRef} className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 760px)" }}>
          {NODES.map(([name, value], index) => (
            <div key={name + index} data-curve-node={index} className={`relative min-w-0 bg-background px-2 py-3 sm:min-h-24 ${index === active ? "ring-2 ring-inset ring-primary" : index < active ? "opacity-75" : "opacity-35"}`}>
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[8px] font-black text-primary">{name}</span>
                <span className="font-mono text-[8px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <strong className="mt-3 block break-keep text-center font-mono text-xs leading-5 sm:text-sm">{value}</strong>
              {index < NODES.length - 1 ? <span aria-hidden className="absolute -right-1 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-primary bg-background" /> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        {[0, 1, 2].map((index) => (
          <div key={STATE[active][index * 2]} className="min-w-0 bg-background px-2 py-3">
            <span className="block break-keep text-muted-foreground">{STATE[active][index * 2]}</span>
            <strong className="mt-1 block break-keep text-primary">{STATE[active][index * 2 + 1]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CurveImplementationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4700, { loop: false });
  const sceneScrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = sceneScrollerRef.current;
    const target = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !target) return;
    scroller.scrollTo({ left: target.offsetLeft - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "smooth" });
  }, [scenes.active]);
  return (
    <VizFrame
      eyebrow="한 점의 전체 경로 · 설명용 E(F₁₇)"
      title="0x03 0x05는 점 P가 되고, 두 배 연산 뒤 0x03 0x06으로 돌아옵니다"
      description="외부 bytes를 바로 점으로 믿지 않고 좌표 복원, 곡선식, 부분군을 차례로 확인한 뒤에만 그룹 연산을 실행합니다."
      note="E: y²=x³+2x+2 mod17은 경계를 손으로 확인하기 위한 작은 곡선입니다. 실제 BN254의 좌표와 encoding은 pinned arkworks 구현을 따릅니다."
      canvasClassName="p-1.5 sm:p-5" documentFlow
    >
      <div id={scenes.playbackId} data-viz-live-only data-curve-scene={scenes.active} tabIndex={0} role="group" aria-label="압축 점 입력과 두 배 연산을 여덟 장면으로 추적" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage>
          <div ref={sceneScrollerRef} className="overflow-x-auto" aria-label="점 lifecycle의 여덟 장면">
            <div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 620px)" }}>
              {SCENES.map((scene, index) => (
                <button type="button" key={scene} aria-pressed={index === scenes.active} onClick={() => scenes.setActive(index)} className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:py-2 ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{SHORT[index]}</strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 sm:mt-3"><TraceMap active={scenes.active} /></div>
          <p data-scene-note className="mt-2 min-h-[9rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[5.5rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[scenes.active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="점 경로 재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function CurveProfileViz() {
  const rows = [
    ["좌표 field", "Fq", "x·y와 곡선식을 계산"], ["scalar field", "Fr", "점에 곱할 정수의 범위"],
    ["G1", "Fq 위의 점", "pairing의 첫 입력군"], ["G2", "Fq² 위의 점", "twist 위의 두 번째 입력군"],
    ["GT", "Fq¹²의 부분군", "pairing 결과가 머무는 곳"],
  ] as const;
  return (
    <VizFrame eyebrow="BN254 이름 아래의 서로 다른 타입" title="좌표·scalar·G1·G2·GT는 한 profile에 속하지만 서로 바꿔 쓸 수 없습니다" description="Profile은 각 타입의 field, 곡선식, generator, 부분군 차수와 pairing 상수를 같은 source revision에 묶습니다." note="이 지도는 역할을 보여줍니다. 실제 constants는 arkworks curves commit e2d16a2와 의존 algebra commit 6a28df5에 귀속합니다." canvasClassName="p-2 sm:p-5">
      <div className="grid gap-px bg-border p-px sm:grid-cols-5">
        {rows.map(([name, value, role]) => <div key={name} className="min-w-0 bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">{name}</span><strong className="mt-2 block break-keep text-sm">{value}</strong><p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{role}</p></div>)}
      </div>
      <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
        {[["G1", "P"], ["PAIRING", "e(P,Q)"], ["G2", "Q"]].map(([name, value], index) => <div key={name} className="contents"><div className={`bg-background p-3 text-center ${index === 1 ? "ring-2 ring-inset ring-primary" : ""}`}><span className="font-mono text-[9px] font-black text-primary">{name}</span><strong className="mt-1 block font-mono">{value}</strong></div>{index < 2 ? <span aria-hidden className="hidden items-center bg-background px-3 text-primary sm:flex">→</span> : null}</div>)}
      </div>
    </VizFrame>
  );
}

export function PairingBoundaryViz() {
  const stages = [["G1 × G2", "승인된 P·Q"], ["MILLER LOOP", "line 값을 Fq¹²에 누적"], ["FINAL EXP", "GT 부분군으로 보냄"], ["GT", "e(P,Q)"]] as const;
  return (
    <VizFrame eyebrow="점 연산 다음의 별도 경계" title="Pairing은 G1과 G2를 받아 Miller loop와 final exponentiation을 거쳐 GT를 만듭니다" description="요청 하나가 두 단계의 서로 다른 중간 상태를 지나므로, 오류가 나면 어느 단계에서 달라졌는지 분리해 확인합니다." note="설명용 곡선의 숫자를 BN254 pairing 값처럼 사용하지 않습니다. 아래는 arkworks BnConfig가 연결하는 실제 타입 경계입니다." canvasClassName="p-2 sm:p-5">
      <div className="overflow-x-auto"><div className="grid grid-cols-[1fr_auto_1.15fr_auto_1.15fr_auto_1fr] items-stretch gap-px bg-border p-px" style={{ width: "max(100%, 720px)" }}>
        {stages.map(([name, detail], index) => <div key={name} className="contents"><div className="min-w-0 bg-background p-4 text-center"><span className="font-mono text-[9px] font-black text-primary">{name}</span><strong className="mt-2 block break-keep text-xs leading-5">{detail}</strong></div>{index < 3 ? <span aria-hidden className="flex items-center bg-background px-3 text-primary">→</span> : null}</div>)}
      </div></div>
      <div className="mt-3 grid gap-px bg-border p-px text-xs leading-5 sm:grid-cols-2"><div className="bg-background p-3"><strong className="text-primary">확인할 등식</strong><p className="mt-1">e([a]P,[b]Q) = e(P,Q)ᵃᵇ</p></div><div className="bg-background p-3"><strong className="text-primary">등식이 깨질 때</strong><p className="mt-1">입력군·loop 상수·line 함수·final exponent를 차례로 분리합니다.</p></div></div>
    </VizFrame>
  );
}
