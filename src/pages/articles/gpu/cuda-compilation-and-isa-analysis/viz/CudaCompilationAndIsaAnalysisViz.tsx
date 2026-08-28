import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 kernel 이 소스 → PTX → SASS 로 내려가며
 * register 가 가상에서 물리로 배정되고 instruction 순서가 scheduling 으로 바뀌는 과정.
 * 장면 = 컴파일 단계 하나. stage 높이는 고정, control row 는 아래 고정 row.
 */
const SCENES = [
  "소스 · a[i] = b[i]*c + d",
  "PTX · 가상 register, 소스 순서",
  "SASS · 물리 register, load 앞당김",
  "SASS · unroll 4, load 4개 묶음",
] as const;

type Kind = "ctrl" | "addr" | "load" | "math" | "store";

type Row = { text: string; kind: Kind; moved?: boolean };

type Scene = {
  rows: Row[];
  regLabel: string;
  regs: number;
  regMax: number;
  virtual: boolean;
  perElement: string;
};

const STATES: readonly Scene[] = [
  {
    rows: [
      { text: "int i = blockIdx.x*blockDim.x + threadIdx.x;", kind: "addr" },
      { text: "if (i >= n) return;", kind: "ctrl" },
      { text: "float x = b[i];", kind: "load" },
      { text: "a[i] = x * c + d;", kind: "math" },
    ],
    regLabel: "소스 변수",
    regs: 5,
    regMax: 20,
    virtual: true,
    perElement: "변수 5개 · 문장 4개",
  },
  {
    rows: [
      { text: "mad.lo.s32  %r1, %ctaid, %ntid, %tid", kind: "addr" },
      { text: "setp.ge.s32 %p1, %r1, %r2 ; @%p1 bra L2", kind: "ctrl" },
      { text: "mul.wide.s32 %rd4, %r1, 4 ; add.s64 %rd5", kind: "addr" },
      { text: "ld.global.f32 %f3, [%rd5]", kind: "load" },
      { text: "fma.rn.f32  %f4, %f3, %f1, %f2", kind: "math" },
      { text: "add.s64 %rd7, %rd6, %rd4", kind: "addr" },
      { text: "st.global.f32 [%rd7], %f4", kind: "store" },
    ],
    regLabel: "가상 register %r·%f·%rd·%p",
    regs: 19,
    regMax: 20,
    virtual: true,
    perElement: "가상 register 19개 · 본문 18줄",
  },
  {
    rows: [
      { text: "S2R R9, SR_TID.X ; S2UR UR6, SR_CTAID.X", kind: "addr" },
      { text: "IMAD R9, R0, UR6, R9", kind: "addr" },
      { text: "ISETP.GE P0, R9, c[0x390] ; @P0 EXIT", kind: "ctrl" },
      { text: "IMAD.WIDE R2, R9, 0x4, R2", kind: "addr" },
      { text: "LDG.E R2, [R2.64]", kind: "load", moved: true },
      { text: "IMAD.WIDE R4, R9, 0x4, R4", kind: "addr" },
      { text: "FFMA R9, R2, c[0x394], c[0x398]", kind: "math" },
      { text: "STG.E [R4.64], R9", kind: "store" },
    ],
    regLabel: "물리 register R0–R9",
    regs: 10,
    regMax: 20,
    virtual: false,
    perElement: "물리 register 10개 · 본문 16줄",
  },
  {
    rows: [
      { text: "IMAD.WIDE R2/R4/R6/R8 ← i, i+s, i+2s, i+3s", kind: "addr" },
      { text: "LDG.E R10, [R2.64]", kind: "load", moved: true },
      { text: "LDG.E R11, [R4.64]", kind: "load", moved: true },
      { text: "LDG.E R12, [R6.64]", kind: "load", moved: true },
      { text: "LDG.E R13, [R8.64]", kind: "load", moved: true },
      { text: "FFMA R10..R13 ×4 (c, d 는 constant bank)", kind: "math" },
      { text: "STG.E ×4", kind: "store" },
      { text: "IADD i += 4s ; ISETP ; BRA (4 element 에 한 번)", kind: "ctrl" },
    ],
    regLabel: "물리 register R0–R15",
    regs: 16,
    regMax: 20,
    virtual: false,
    perElement: "물리 register 16개 · element 당 4.75 instruction",
  },
];

const NOTES = [
  "소스에는 변수 다섯 개와 문장 네 개뿐입니다. Register 도 instruction 순서도 아직 정해지지 않았습니다.",
  "cicc 가 낸 PTX 는 값마다 다른 가상 register 를 씁니다. 19개는 구분한 값의 수이지 실제 register 수가 아니며, load 는 소스 순서 그대로 fma 바로 앞에 있습니다.",
  "ptxas 가 19개 값을 R0–R9 열 개에 배정하고 mul·add 를 FFMA 로 합쳤습니다. LDG 는 주소 계산 직후로 앞당겨져 FFMA 까지 두 instruction 이 latency 를 가립니다.",
  "Unroll 4 는 LDG 네 개를 한 덩어리로 앞당겨 loop 제어를 4 element 에 한 번만 냅니다. 대신 값 4개와 주소 4쌍이 함께 살아 있어 register 가 10개에서 16개로 늘었습니다.",
] as const;

const KIND_CLASS: Record<Kind, string> = {
  ctrl: "border-border bg-muted/50 text-muted-foreground",
  addr: "border-border bg-background text-foreground",
  load: "border-amber-600 bg-amber-500/10 text-foreground",
  math: "border-primary/60 bg-primary/10 text-foreground",
  store: "border-border bg-background text-foreground",
};

const MAX_ROWS = 8;

export default function CudaCompilationAndIsaAnalysisViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const state = STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="Source → PTX → SASS"
      title="가상 register 는 ptxas 에서 물리 register 가 되고 load 는 앞으로 당겨집니다"
      description="각 장면은 같은 kernel 의 컴파일 단계 하나입니다. 왼쪽은 그 단계의 instruction 열, 오른쪽은 그 시점에 세어지는 register 수입니다. 노란 줄이 global load, 파란 줄이 FMA 입니다."
      note="PTX·SASS 줄은 본문의 예제를 줄여 쓴 것이고 unroll 4 장면의 register 16개는 산수 상한입니다. 실제 수는 CUDA 버전과 sm_XX 에 따라 다르며 -Xptxas -v 로 확인해야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="같은 kernel 이 소스·PTX·SASS·unroll 4 SASS 로 내려가며 register 수와 instruction 순서가 바뀌는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[28rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 grid gap-4 sm:grid-cols-[3fr_2fr]">
            <div className="min-h-[15.5rem] border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">instruction 열 · 위에서 아래로 issue</p>
              <div className="mt-2 flex flex-col gap-1">
                {Array.from({ length: MAX_ROWS }).map((_, index) => {
                  const row = state.rows[index];
                  if (!row) {
                    return <div key={index} className="h-[1.375rem]" aria-hidden="true" />;
                  }
                  return (
                    <div
                      key={`${scenes.active}-${index}`}
                      className={`flex h-[1.375rem] items-center overflow-hidden border px-2 font-mono text-[10.5px] leading-none ${KIND_CLASS[row.kind]}`}
                    >
                      <span className="w-4 shrink-0 text-muted-foreground">{index + 1}</span>
                      <span className="truncate">{row.text}</span>
                      {row.moved ? <span className="ml-auto shrink-0 pl-2 text-[9px] font-bold text-amber-700">↑ 앞당김</span> : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="min-h-[15.5rem] border border-border p-3">
              <p className="text-[11px] font-bold text-muted-foreground">{state.regLabel}</p>
              <div className="mt-2 grid grid-cols-5 gap-[3px]" aria-label={`register ${state.regs}개`}>
                {Array.from({ length: state.regMax }).map((_, index) => {
                  const on = index < state.regs;
                  return (
                    <span
                      key={index}
                      className={`block h-5 border text-center font-mono text-[9px] leading-5 ${
                        on
                          ? state.virtual
                            ? "border-dashed border-primary/60 bg-primary/10 text-foreground"
                            : "border-primary/70 bg-primary/30 text-foreground"
                          : "border-border bg-muted/30 text-transparent"
                      }`}
                    >
                      {on ? (state.virtual ? "v" : `R${index}`) : "."}
                    </span>
                  );
                })}
              </div>
              <div className="mt-3 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">count</span>
                  <span className="text-primary">{state.regs}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-muted-foreground">종류</span>
                  <span>{state.virtual ? "가상 (한도 없음)" : "물리 (thread 당 ≤255)"}</span>
                </div>
              </div>
              <p className="mt-3 border-t border-border pt-2 font-mono text-[10.5px] text-muted-foreground">{state.perElement}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 border border-amber-600 bg-amber-500/10" /> global load
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 border border-primary/60 bg-primary/10" /> FMA
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 border border-border bg-muted/50" /> loop·branch 제어
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 border border-dashed border-primary/60 bg-primary/10" /> 가상 register
            </span>
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
