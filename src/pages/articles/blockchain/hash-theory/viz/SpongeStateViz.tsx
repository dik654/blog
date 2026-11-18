import SceneShell from "./HashSceneShell";

/**
 * 본문 대응: #sponge — SHA3-256 상태 1600비트 = 64비트 값 25개.
 * rate 1088비트 = 136바이트 = 값 17개(136/8), capacity 512비트 = 값 8개(512/64).
 * abc 블록을 XOR하면 값 0 = 0000000006636261, 값 16 = 8000000000000000, 나머지 rate 값은 0.
 * 순열 P(24라운드)가 25개 전부를 바꾸고, 앞부분 32바이트(값 4개)를 읽어 결과로 낸다.
 */
const LANES = 25;
const RATE_LANES = 17;
const OUT_LANES = 4;

const SCENES = [
  { label: "빈 상태", summary: "25 × 64 = 1600비트, 모두 0", note: "처음에는 25칸 모두 0입니다. 앞 17칸(rate 1088비트)만 입출력에 쓰고 뒤 8칸(capacity 512비트)은 직접 입출력하지 않습니다." },
  { label: "abc 블록 흡수", summary: "rate 17칸에만 XOR", note: "136바이트 블록을 앞 17칸에 XOR해 첫 칸은 0000000006636261, 17번째 칸은 8000000000000000이 됩니다. 사이 칸과 capacity는 0 그대로입니다." },
  { label: "순열 P", summary: "24라운드가 25칸 전부를 바꿈", note: "입력은 앞부분에만 들어갔지만 순열 P는 capacity까지 상태 전체를 바꿉니다. 입력을 아는 사람은 이 과정을 그대로 재현할 수 있습니다." },
  { label: "앞부분 읽기", summary: "앞 4칸 = 32바이트 = 3a985da7…", note: "결과는 rate 앞부분의 32바이트, 곧 64비트 값 4개입니다. 나머지 21칸은 내보내지 않습니다." },
] as const;

const C = { rate: "#2563eb", cap: "#64748b", touched: "#d97706", changed: "#7c3aed", out: "#16a34a" } as const;

function laneStyle(active: number, i: number) {
  const isRate = i < RATE_LANES;
  if (active === 0) return { border: isRate ? C.rate : C.cap, fill: "transparent", text: "0" };
  if (active === 1) {
    if (i === 0) return { border: C.touched, fill: C.touched, text: "…6261" };
    if (i === RATE_LANES - 1) return { border: C.touched, fill: C.touched, text: "80…" };
    return { border: isRate ? C.rate : C.cap, fill: "transparent", text: "0" };
  }
  if (active === 2) return { border: C.changed, fill: C.changed, text: "P" };
  return i < OUT_LANES
    ? { border: C.out, fill: C.out, text: "출력" }
    : { border: C.changed, fill: "transparent", text: "" };
}

export default function SpongeStateViz() {
  return (
    <SceneShell
      eyebrow="SHA3-256 스펀지"
      title="입력은 앞 17칸에만 들어가고 순열은 25칸 전체를 섞습니다"
      description="칸 하나가 64비트 값 하나입니다. 실선 칸 0–16이 rate(136바이트), 점선 칸 17–24가 capacity(64바이트)입니다. 번호 순서대로 다섯 개씩 줄 세운 그림이며 14절의 5×5 좌표 배치와는 별개입니다."
      ariaLabel="SHA3-256 상태 25칸에서 rate 17칸 흡수, 순열, 앞 4칸 출력"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: LANES }, (_, i) => {
              const style = laneStyle(active, i);
              const filled = style.fill !== "transparent";
              return (
                <div
                  key={i}
                  className="flex h-9 min-w-0 flex-col sm:h-10 items-center justify-center rounded-md border text-center"
                  style={{ borderColor: style.border, backgroundColor: style.fill, borderStyle: i < RATE_LANES ? "solid" : "dashed" }}
                >
                  <span className={`text-[9px] leading-3 ${filled ? "text-white" : "text-muted-foreground"}`}>값 {i}</span>
                  <span className={`font-mono text-[11px] font-semibold leading-4 ${filled ? "text-white" : ""}`}>{style.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
