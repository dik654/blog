import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { useEffect, useRef } from "react";

const FLOW_SCENES = [
  "bytes 입력",
  "범위 검사",
  "내부 변환",
  "곱셈",
  "나머지 정리",
  "정수 복원",
  "bytes 출력",
] as const;

const FLOW_SHORT_LABELS = [
  "입력",
  "검사",
  "변환",
  "곱셈",
  "정리",
  "복원",
  "출력",
] as const;

const FLOW_NOTES = [
  "외부 입력은 한 byte짜리 0x05와 0x09입니다. 아직 Rust의 field element가 아니라 검증되지 않은 byte 배열입니다.",
  "little-endian 정수 5와 9로 읽은 뒤 둘 다 p=13보다 작은지 확인합니다. 0x0d처럼 13인 입력은 0으로 줄이지 않고 이 경계에서 거절합니다.",
  "계산용 표현으로 옮깁니다. 설명용 radix R=16에서 5R mod 13=2, 9R mod 13=1이므로 내부에는 2와 1이 들어갑니다. 값의 뜻은 여전히 5와 9입니다.",
  "내부 residue 2와 1을 곱해 넓은 중간값 T=2를 만듭니다. 이 숫자를 그대로 공개하면 5×9 mod 13의 답이 아닙니다. Montgomery 배율 하나를 제거해야 합니다.",
  "N′=11을 써서 m=(2×11) mod 16=6을 고릅니다. T+mp=2+6×13=80은 16으로 정확히 나뉘고, 80÷16=5가 계산용 결과가 됩니다.",
  "계산용 결과 5에 reduction을 한 번 더 적용합니다. m=(5×11) mod 16=7이고 (5+7×13)÷16=6이므로 공개할 정수 6을 복원합니다.",
  "정수 6을 정해진 길이와 byte order로 직렬화하면 0x06입니다. 그래서 bytes 0x05와 0x09의 곱이 bytes 0x06으로 닫힙니다.",
] as const;

const NODES = [
  ["PUBLIC INPUT", "0x05 · 0x09"],
  ["CANONICAL", "5 · 9  <  13"],
  ["MONTGOMERY", "2 · 1"],
  ["WIDE PRODUCT", "T = 2"],
  ["INTERNAL RESULT", "5"],
  ["CANONICAL", "6"],
  ["PUBLIC OUTPUT", "0x06"],
] as const;

const ACTIVE: readonly (readonly number[])[] = [
  [0],
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
];

const STATE = [
  [
    "입력 상태",
    "검증 전 bytes",
    "field value",
    "아직 없음",
    "다음 조건",
    "길이·범위",
  ],
  ["입력 상태", "승인", "공개 값", "5 · 9", "거절 조건", "x ≥ 13"],
  ["저장 상태", "Montgomery", "내부 residue", "2 · 1", "공개 값", "5 · 9"],
  ["연산 상태", "중간값", "T", "2", "남은 일", "배율 제거"],
  ["연산 상태", "reduced", "내부 residue", "5", "공개 의미", "6"],
  ["출력 상태", "canonical", "공개 정수", "6", "내부 residue", "숨김"],
  ["출력 상태", "직렬화 완료", "공개 bytes", "0x06", "왕복", "완료"],
] as const;

function FlowMap({ active }: { active: number }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const target = scroller?.querySelector<HTMLElement>(
      `[data-flow-node="${ACTIVE[active].at(-1)}"]`,
    );
    if (!scroller || !target) return;
    scroller.scrollTo({
      left: target.offsetLeft - (scroller.clientWidth - target.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div aria-label="두 입력 byte가 유한체 곱셈을 거쳐 출력 byte가 되는 경로">
      <div ref={scrollerRef} className="overflow-x-auto">
        <div
          className="grid grid-cols-7 gap-px bg-border p-px"
          style={{ width: "max(100%, 700px)" }}
        >
          {NODES.map(([name, value], index) => {
            const selected = ACTIVE[active].includes(index);
            return (
              <div
                key={`${name}-${index}`}
                data-flow-node={index}
                className={`relative min-w-0 bg-background px-2 py-3 sm:min-h-24 ${
                  selected ? "ring-2 ring-inset ring-primary" : "opacity-40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[8px] font-black text-primary">
                    {name}
                  </span>
                  <span className="font-mono text-[8px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <strong className="mt-3 block break-keep text-center font-mono text-xs leading-5 sm:text-sm">
                  {value}
                </strong>
                {index < NODES.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute -right-1 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-primary bg-background"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        {[0, 1, 2].map((index) => (
          <div
            key={STATE[active][index * 2]}
            className="min-w-0 bg-background px-2 py-3"
          >
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

export function FieldImplementationViz() {
  const scenes = useAnimatedScenes(FLOW_SCENES.length, 4700, { loop: false });
  const active = scenes.active;
  const sceneScrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = sceneScrollerRef.current;
    const target = scroller?.querySelector<HTMLElement>(
      'button[aria-pressed="true"]',
    );
    if (!scroller || !target) return;
    scroller.scrollTo({
      left: target.offsetLeft - (scroller.clientWidth - target.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <VizFrame
      eyebrow="한 값의 전체 경로 · 설명용 F₁₃"
      title="0x05와 0x09는 계산용 표현을 거쳐 0x06으로 돌아옵니다"
      description="같은 값을 공개 bytes, canonical integer, Montgomery residue로 바꾸어 쓰되 각 경계에서 뜻을 보존하는지 추적합니다."
      note="p=13, R=16, N′=11은 reduction을 손으로 확인하기 위한 작은 사례입니다. 실제 arkworks backend는 64-bit word를 N개 사용하지만 같은 경계를 구현합니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-field-scene={active}
        tabIndex={0}
        role="group"
        aria-label="두 입력 byte의 유한체 곱셈을 일곱 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div
            ref={sceneScrollerRef}
            className="overflow-x-auto"
            aria-label="유한체 값 lifecycle의 일곱 장면"
          >
            <div
              className="grid grid-cols-7 gap-px bg-border p-px"
              style={{ width: "max(100%, 560px)" }}
            >
              {FLOW_SCENES.map((scene, index) => (
                <button
                  type="button"
                  key={scene}
                  aria-pressed={index === active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:py-2 ${
                    index === active
                      ? "text-primary"
                      : index < active
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  <span className="block font-mono text-[8px] font-black">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">
                    {FLOW_SHORT_LABELS[index]}
                  </strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">
                    {scene}
                  </strong>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <FlowMap active={active} />
          </div>
          <p
            data-scene-note
            className="mt-2 min-h-[9rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[5.5rem] sm:pl-4 sm:text-sm sm:leading-6"
          >
            {FLOW_NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls
          {...scenes}
          labels={FLOW_SCENES}
          controlLabels={FLOW_SCENES}
          playLabel="유한체 값 경로 재생"
          className="mt-0 sm:mt-4"
          compact
        />
      </div>
      <StaticSceneList labels={FLOW_SCENES} notes={FLOW_NOTES} />
    </VizFrame>
  );
}

export function FieldParameterViz() {
  const rows = [
    ["p", "13", "공개 값의 범위 0…12"],
    ["w · L", "4 bit · 1", "손으로 보는 설명용 limb"],
    ["R", "2⁴ = 16", "p보다 크고 p와 서로소인 radix"],
    ["R² mod p", "9", "canonical 값을 내부 domain으로 옮김"],
    ["N′", "11", "−13⁻¹ mod 16 · 하위 bit 소거"],
  ] as const;

  return (
    <VizFrame
      eyebrow="상수를 한 묶음으로 읽기"
      title="modulus 하나가 아니라 표현과 reduction 상수가 함께 field 구현을 정합니다"
      description="사례의 모든 계산은 같은 p, word 폭, radix와 inverse를 사용해야 합니다."
      note="실제 arkworks의 word 폭은 64 bit입니다. 표의 4 bit는 같은 관계를 작은 숫자로 드러내기 위한 설명용 축소입니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div
        className="grid gap-px bg-border p-px sm:grid-cols-5"
        aria-label="설명용 유한체 파라미터 다섯 개"
      >
        {rows.map(([symbol, value, role]) => (
          <div key={symbol} className="min-w-0 bg-background p-3">
            <span className="font-mono text-[9px] font-black text-primary">
              {symbol}
            </span>
            <strong className="mt-2 block break-keep font-mono text-base">
              {value}
            </strong>
            <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">
              {role}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        <div className="bg-background p-3 text-xs leading-6">
          <span className="font-mono text-[9px] font-black text-primary">
            CANONICAL
          </span>
          <strong className="mt-1 block">5 · 9</strong>
          <p className="text-muted-foreground">외부에서 뜻이 보이는 정수</p>
        </div>
        <span
          className="hidden items-center bg-background px-3 text-primary sm:flex"
          aria-hidden
        >
          × R mod p →
        </span>
        <div className="bg-background p-3 text-xs leading-6 ring-2 ring-inset ring-primary">
          <span className="font-mono text-[9px] font-black text-primary">
            INTERNAL
          </span>
          <strong className="mt-1 block">2 · 1</strong>
          <p className="text-muted-foreground">
            같은 값을 계산용으로 저장한 residue
          </p>
        </div>
      </div>
    </VizFrame>
  );
}

export function FieldAdmissionViz() {
  const cases = [
    ["0x05", "5", "승인", "5 < 13"],
    ["0x0c", "12", "승인", "12 < 13"],
    ["0x0d", "13", "거절", "13은 범위 밖"],
    ["0x0500", "두 bytes", "거절", "길이가 다름"],
  ] as const;

  return (
    <VizFrame
      eyebrow="공개 입력의 유일한 표현"
      title="범위 밖 bytes를 mod p로 줄이지 않고 입력 경계에서 거절합니다"
      description="한 field value에 여러 byte 표현을 허용하지 않으려면 길이와 0≤x<p 조건을 먼저 확인해야 합니다."
      note="예시는 B=1인 little-endian encoding입니다. 실제 길이와 byte order는 protocol schema와 field profile이 정합니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div
        className="grid gap-px bg-border p-px sm:grid-cols-4"
        aria-label="유한체 byte 입력의 승인과 거절 사례"
      >
        {cases.map(([bytes, value, result, reason]) => {
          const rejected = result === "거절";
          return (
            <div
              key={bytes}
              className={`min-w-0 bg-background p-3 ${
                rejected ? "ring-2 ring-inset ring-destructive" : ""
              }`}
            >
              <span className="font-mono text-[9px] font-black text-primary">
                {bytes}
              </span>
              <strong className="mt-2 block text-sm">{value}</strong>
              <p
                className={`mt-2 text-xs font-bold ${rejected ? "text-destructive" : "text-primary"}`}
              >
                {result}
              </p>
              <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">
                {reason}
              </p>
            </div>
          );
        })}
      </div>
    </VizFrame>
  );
}

export function MontgomeryLedgerViz() {
  const rows = [
    [
      "01",
      "내부 변환",
      "5×16 mod 13=2 · 9×16 mod 13=1",
      "공개 정수에 R을 곱합니다.",
    ],
    ["02", "넓은 곱", "T=2×1=2", "두 내부 residue를 먼저 곱합니다."],
    ["03", "하위 소거", "m=(2×11) mod 16=6", "T+mp가 R로 나뉘게 만듭니다."],
    ["04", "shift", "u=(2+6×13)÷16=5", "R로 나누어 내부 결과를 얻습니다."],
    [
      "05",
      "공개 복원",
      "(5+7×13)÷16=6",
      "reduction을 한 번 더 해 R 배율을 없앱니다.",
    ],
  ] as const;

  return (
    <VizFrame
      eyebrow="숫자를 한 줄씩 바꾸기"
      title="T에 p의 배수를 더해도 mod p 값은 그대로이고, R로 정확히 나눌 수 있습니다"
      description="각 행은 앞 행의 결과 하나만 바꿉니다. 어떤 표현을 다루는지는 계속 표시합니다."
      note="실제 multi-limb CIOS 구현은 이 소거를 64-bit word마다 반복합니다. 이 표는 전체 폭 관계를 4-bit 한 word로 축소한 계산입니다."
      canvasClassName="p-2 sm:p-5"
    >
      <ol
        className="grid gap-px bg-border p-px"
        aria-label="설명용 Montgomery 곱셈의 다섯 계산 단계"
      >
        {rows.map(([number, name, arithmetic, reason]) => (
          <li
            key={number}
            className="grid min-w-0 gap-2 bg-background p-3 sm:grid-cols-[3rem_7rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-center"
          >
            <span className="font-mono text-[9px] font-black text-primary">
              {number}
            </span>
            <strong className="break-keep text-xs">{name}</strong>
            <code className="break-words text-[11px] leading-5 text-foreground">
              {arithmetic}
            </code>
            <p className="break-keep text-[10px] leading-5 text-muted-foreground sm:text-xs">
              {reason}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}

export function FieldEvidenceViz() {
  const rows = [
    ["입력 경계", "0 · 1 · p−1 승인 / p 거절", "canonical range"],
    ["연산", "작은 정수 reference와 add·mul 비교", "같은 residue"],
    ["왕복", "bytes → field → bytes", "같은 bytes"],
    ["타입", "base field와 scalar field 분리", "다른 modulus 차단"],
  ] as const;

  return (
    <VizFrame
      eyebrow="구현이 지켜야 할 관찰 가능한 계약"
      title="빠른가보다 먼저 세 표현이 같은 field value로 닫히는지 확인합니다"
      description="테스트는 내부 limb 값을 고정하는 대신 공개 입력, 연산 결과와 canonical 출력을 비교합니다."
      note="컴파일러·ISA·타이밍을 포함한 배포 승인과 rollback은 별도 실무 글의 판단입니다. 이 글은 어떤 사실을 확인해야 하는지만 닫습니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div
        className="grid gap-px bg-border p-px sm:grid-cols-2"
        aria-label="유한체 구현의 네 가지 검증 경계"
      >
        {rows.map(([scope, fixture, proof]) => (
          <div key={scope} className="min-w-0 bg-background p-3">
            <span className="font-mono text-[9px] font-black text-primary">
              {scope}
            </span>
            <strong className="mt-2 block break-keep text-xs sm:text-sm">
              {fixture}
            </strong>
            <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground sm:text-xs">
              확인하는 것 · {proof}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
