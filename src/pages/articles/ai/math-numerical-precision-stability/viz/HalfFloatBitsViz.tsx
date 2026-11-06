import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #code-rounding — 같은 0.5 비교가 1+δ는 0번에, 1+3δ는 2번에 남기고 16칸을 채운다.
 * 값은 본문의 _PyFloat_Pack2 추적과 3c00·3c02 실행 결과입니다.
 */
const W = 340;
const H = 84;
const AXIS_Y = 44;
const SX = (value: number) => 40 + value * 130;

const BLUE = "#2563eb";
const GRAY = "#64748b";

type Scene = {
  label: string;
  summary: string;
  scaled: number;
  stored: number | null;
  fraction: string | null;
  checks: readonly (readonly [string, string])[];
  note: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "1+δ를 1024배",
    summary: "(1+δ−1)×1024 = 0.5",
    scaled: 0.5,
    stored: null,
    fraction: null,
    checks: [["bits(정수 부분)", "0"], ["남은 부분", "0.5"]],
    note: "1+δ의 지수 0에 15를 더합니다. 선행 1을 빼고 소수부에 1024를 곱하면 눈금 0과 1의 정확히 가운데인 0.5입니다.",
  },
  {
    label: "1+δ의 가운데 판정",
    summary: "bits 0 유지",
    scaled: 0.5,
    stored: 0,
    fraction: null,
    checks: [["남은 부분 > 0.5", "거짓"], ["= 0.5 그리고 bits 홀수", "거짓"]],
    note: "남은 부분이 0.5보다 크지 않고 bits 0은 홀수가 아닙니다. 둘 다 거짓이므로 올리지 않습니다.",
  },
  {
    label: "1+δ의 16칸",
    summary: "0x3c00",
    scaled: 0.5,
    stored: 0,
    fraction: "0000000000",
    checks: [["부호 / 지수 / 소수부", "0 / 15 / 0"], ["16칸을 16진수로", "3c00"]],
    note: "지수 15를 열 자리 왼쪽으로 옮겨 소수부와 합치면 0x3c00입니다. 이 두 바이트를 다시 읽으면 1입니다.",
  },
  {
    label: "1+3δ는 올라간다",
    summary: "0x3c02",
    scaled: 1.5,
    stored: 2,
    fraction: "0000000010",
    checks: [["bits / 남은 부분", "1 / 0.5"], ["= 0.5 그리고 bits 홀수", "참"]],
    note: "같은 위치의 값이 1.5이고 bits는 1입니다. 남은 0.5와 홀수 조건이 함께 참이라 2로 올립니다. 0x3c02는 1+4δ입니다.",
  },
];

const EXPONENT = "01111";

function BitCell({ value, tone }: { value: string; tone: "plain" | "exponent" | "accent" | "empty" }) {
  const toneClass =
    tone === "accent"
      ? "border-primary text-primary font-bold"
      : tone === "empty"
        ? "border-dashed border-border text-muted-foreground/50"
        : tone === "exponent"
          ? "border-border bg-muted text-foreground"
        : "border-border text-foreground";
  return <span className={`flex h-7 items-center justify-center rounded-sm border font-mono text-[11px] ${toneClass}`}>{value}</span>;
}

export default function HalfFloatBitsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const scene = SCENES[active];

  return (
    <VizFrame
      eyebrow="저장 코드의 경로"
      title="가운데 값이 짝수 자리로 간 뒤 16칸에 들어갑니다"
      description="눈금은 소수부를 1024배 한 값, bits는 그 정수 부분, 아래 16칸은 저장되는 두 바이트입니다."
      note="양의 정규수 경로만 그렸습니다. 칸 배치는 뒤의 형식 표와 같은 FP16입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="1+δ와 1+3δ가 반올림을 거쳐 16비트로 저장되는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px]" role="img" aria-label={`반올림 직전 ${scene.scaled}${scene.stored === null ? "" : `, 저장 ${scene.stored}`}`}>
          <line x1={SX(0) - 16} x2={SX(2) + 16} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
          {[0, 1, 2].map((n) => (
            <g key={n}>
              <line x1={SX(n)} x2={SX(n)} y1={AXIS_Y - 6} y2={AXIS_Y + 6} stroke={GRAY} strokeWidth={1} />
              <text x={SX(n)} y={AXIS_Y + 22} textAnchor="middle" fontSize={12} fontWeight={scene.stored === n ? 700 : 400} fill={scene.stored === n ? BLUE : GRAY}>{n}</text>
            </g>
          ))}
          {scene.stored !== null && <path d={`M ${SX(scene.scaled)} ${AXIS_Y - 25} L ${SX(scene.stored)} ${AXIS_Y - 3}`} fill="none" stroke={BLUE} strokeWidth={1.25} />}
          {scene.stored !== null && <circle cx={SX(scene.stored)} cy={AXIS_Y} r={5} fill={BLUE} />}
          <circle cx={SX(scene.scaled)} cy={AXIS_Y - 30} r={5} fill="#ffffff" stroke={BLUE} strokeWidth={1.25} />
          <text x={SX(scene.scaled) + 10} y={AXIS_Y - 26} fontSize={12} fontWeight={700} fill={BLUE}>{scene.scaled}</text>
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((item) => (
            <dl key={item.label} className="grid grid-cols-1 gap-1 text-sm">
              {item.checks.map(([name, value]) => (
                <div key={name} className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-1">
                  <dt className="text-muted-foreground">{name}</dt>
                  <dd className="font-mono font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          ))}
        />
        <div className="mt-4 grid min-w-0 gap-[2px]" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
          <span className="col-span-1 whitespace-nowrap text-[11px] font-bold text-muted-foreground">부호</span>
          <span className="col-span-5 text-center text-[11px] font-bold text-muted-foreground">지수 15</span>
          <span className="col-span-10 text-center text-[11px] font-bold text-muted-foreground">소수부 10칸</span>
          <BitCell value="0" tone="plain" />
          {EXPONENT.split("").map((bit, index) => <BitCell key={`e${index}`} value={bit} tone="exponent" />)}
          {Array.from({ length: 10 }, (_, index) => {
            const bit = scene.fraction?.[index];
            return <BitCell key={`f${index}`} value={bit ?? "·"} tone={!bit ? "empty" : bit === "1" ? "accent" : "plain"} />;
          })}
        </div>
        <StableSceneStack
          active={active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
