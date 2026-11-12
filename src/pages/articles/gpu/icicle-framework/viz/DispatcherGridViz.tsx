import SceneShell from "./SceneShell";

/**
 * 본문 대응: #backend-dispatch — I_{p,f} = R_{p,f}[d].
 * 행 = primitive·field/curve로 정해지는 dispatcher, 열 = active device type.
 * 본문 예: BN254 NTT dispatcher에는 CUDA 구현이 등록됨.
 * BLS12-381 MSM의 CUDA 칸이 비어 있는 것은 "설치 ≠ 등록"을 보이려는 가정이다.
 */
const DISPATCHERS = ["BN254 · NTT", "BLS12-381 · MSM"] as const;
const DEVICES = ["CPU", "CUDA"] as const;

const OK = "#16a34a";
const MISS = "#d97706";
const ACCENT = "#2563eb";

const SCENES = [
  {
    label: "dispatcher는 행, device type은 열",
    summary: "CUDA backend 설치 ≠ 모든 칸 등록",
    row: -1,
    note: "Primitive와 field·curve 조합마다 dispatcher가 하나씩 있고, 각 dispatcher 안에 device type → 구현 함수 표가 있습니다. CUDA backend가 load되어도 채워지는 것은 그 backend가 등록한 칸뿐입니다. 아래 BLS12-381 MSM의 CUDA 칸을 비운 것은 이 차이를 보이려는 가정입니다.",
  },
  {
    label: "BN254 NTT 호출",
    summary: "행 선택 → CUDA 열 → 구현 있음",
    row: 0,
    note: "호출의 primitive·field가 먼저 행을 고르고, 그 행 안에서 active device type인 CUDA로 칸을 찾습니다. 칸에 구현이 있으므로 CUDA NTT 함수가 실행됩니다.",
  },
  {
    label: "BLS12-381 MSM 호출",
    summary: "다른 행 → CUDA 칸 비어 있음 → error",
    row: 1,
    note: "Active device는 같은 CUDA지만 행이 다릅니다. 이 행의 CUDA 칸이 비어 있으면(가정) unsupported error를 돌려줍니다. 옆의 CPU 칸으로 조용히 넘어가지 않고, CPU로 돌리려면 caller가 그 fallback을 기록해야 합니다.",
  },
] as const;

/** [dispatcher][device] 등록 여부. CPU 칸은 이 예에서 조회하지 않으므로 null */
const REGISTERED: readonly (readonly (boolean | null)[])[] = [
  [null, true],
  [null, false],
];

export default function DispatcherGridViz() {
  return (
    <SceneShell
      eyebrow="두 단계 조회"
      title="CUDA가 설치돼도 dispatcher마다 칸은 따로 채워집니다"
      description="Dispatcher는 primitive·field/curve 조합마다 하나씩 있는, device type에서 구현 함수로 가는 표입니다. 이 예에서는 active device가 CUDA이므로 CPU 열은 조회하지 않습니다."
      ariaLabel="primitive·field별 dispatcher와 device type으로 구현을 찾는 두 단계 조회"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">dispatcher ↓ · device →</span>
              {DEVICES.map((d) => (
                <span
                  key={d}
                  className="rounded-md border px-2 py-1 text-center font-semibold"
                  style={{ borderColor: d === "CUDA" && scene.row >= 0 ? ACCENT : "#94a3b8" }}
                >
                  {d}
                  {d === "CUDA" ? " (active)" : ""}
                </span>
              ))}
              {DISPATCHERS.map((name, r) => (
                <div key={name} className="contents">
                  <span
                    className="flex items-center rounded-md border px-2 py-2 font-semibold"
                    style={{ borderColor: scene.row === r ? ACCENT : "#94a3b8", borderWidth: scene.row === r ? 1.25 : 1 }}
                  >
                    {name}
                  </span>
                  {DEVICES.map((d, c) => {
                    const reg = REGISTERED[r][c];
                    const hit = scene.row === r && d === "CUDA";
                    const color = reg === null ? "#94a3b8" : reg ? OK : MISS;
                    const text = reg === null ? "조회 안 함" : reg ? "구현 등록됨" : "비어 있음 (가정)";
                    return (
                      <span
                        key={d}
                        className={`flex min-h-[2.75rem] items-center justify-center rounded-md border px-1 py-2 text-center leading-5 ${reg === false ? "border-dashed" : ""}`}
                        style={{ borderColor: hit ? color : "#94a3b880", borderWidth: hit ? 1.25 : 1, color: reg === null ? "#94a3b8" : color, opacity: scene.row >= 0 && !hit ? 0.5 : 1 }}
                      >
                        {text}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-4 grid min-h-[3.5rem] grid-cols-1 gap-2 text-xs sm:text-sm">
              {scene.row === -1 && (
                <p className="rounded-md border border-dashed px-3 py-2 text-muted-foreground" style={{ borderColor: "#94a3b8" }}>
                  호출이 오면: ① primitive·field로 행을 고른다 → ② active device type으로 칸을 찾는다
                </p>
              )}
              {scene.row === 0 && (
                <p className="rounded-md border px-3 py-2" style={{ borderColor: OK, color: OK }}>
                  결과: CUDA NTT 함수 실행 → stream 완료 뒤 output 검증
                </p>
              )}
              {scene.row === 1 && (
                <p className="rounded-md border border-dashed px-3 py-2" style={{ borderColor: MISS, color: MISS }}>
                  결과: unsupported error · CPU로 자동 전환하지 않음
                </p>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
