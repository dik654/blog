import HwSceneShell from "./HwSceneShell";

/**
 * 본문 대응: #memory-boot-attestation — image·TCB 기준값 버전을 고정하고 최신 attestation을 검증해
 * 통과했을 때만 session key를 channel에 묶어 지급한다. Debug·patch 최소선 미달·기준 manifest 부재는
 * 지급하지 않는다. Host 정지는 secret 미지급 성공과 가용성 실패를 별도 상태로 기록한다.
 * 조건 값은 #threat-properties의 A=C∧I∧F∧P와 그 term·assumption 정의를 따른다.
 */
type Lamp = 1 | 0 | "?" | null;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  lamps: readonly [Lamp, Lamp, Lamp, Lamp];
  key: string;
  extra: string;
}[] = [
  {
    label: "네 조건이 모두 통과",
    summary: "1∧1∧1∧1 = 1 → 지급",
    note: "먼저 image와 TCB 기준값의 버전을 고정하고, 그다음 최신 attestation을 검증합니다. 네 조건이 모두 1일 때만 session key를 해당 channel에 묶어 지급합니다.",
    lamps: [1, 1, 1, 1],
    key: "지급 · channel에 묶음",
    extra: "—",
  },
  {
    label: "과거 evidence를 다시 내밂",
    summary: "F = 0 → A = 0",
    note: "Freshness F는 evidence가 이번 challenge의 nonce나 허용 epoch에 묶였다는 조건입니다. C=1이어도 F=0이면 replay일 수 있으므로 A=0이고 지급하지 않습니다.",
    lamps: [1, 1, 0, 1],
    key: "지급 안 함",
    extra: "—",
  },
  {
    label: "Debug 켜짐 · patch 최소선 미달",
    summary: "P = 0 → A = 0",
    note: "Debug 상태와 patch 최소선은 업무 policy P에 들어갑니다. Debug가 켜졌거나 patch 최소선보다 낮으면 다른 조건과 관계없이 지급하지 않습니다.",
    lamps: [1, 1, 1, 0],
    key: "지급 안 함",
    extra: "—",
  },
  {
    label: "기준 manifest 없음",
    summary: "I를 1로 올리지 않음 → A = 0",
    note: "무결성 I는 image·TCB·configuration이 허용 reference와 맞는다는 조건입니다. 비교할 기준 manifest가 없으면 판정이 unknown이고, unknown은 1로 올리지 않으므로 지급하지 않습니다.",
    lamps: [1, "?", 1, 1],
    key: "지급 안 함",
    extra: "—",
  },
  {
    label: "Host가 실행을 멈춤",
    summary: "미지급 성공 · 가용성 실패",
    note: "Secret 미지급에는 성공했지만 서비스 가용성에는 실패했습니다. 가용성은 이 Boolean 하나가 보증하지 않으므로, 보안 성공으로 한데 묶지 않고 별도 상태로 기록합니다.",
    lamps: [null, null, null, null],
    key: "지급 안 됨 (미지급 성공)",
    extra: "가용성 실패 · 별도 기록",
  },
];

const NAMES = [
  { symbol: "C", name: "기밀성" },
  { symbol: "I", name: "무결성" },
  { symbol: "F", name: "최신성" },
  { symbol: "P", name: "업무 policy" },
] as const;

function lampClass(value: Lamp) {
  if (value === 1) return "border-green-600 text-green-700 dark:text-green-400";
  if (value === 0) return "border-red-600 bg-red-600/10 text-red-700 dark:text-red-400";
  if (value === "?") return "border-dashed border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  return "border-dashed border-border/60 text-muted-foreground/60";
}

export default function ReleaseDecisionViz() {
  return (
    <HwSceneShell
      eyebrow="Payroll key 지급 판정"
      title="한 조건만 빠져도 key는 나가지 않습니다"
      description="Threat model 절의 A = C ∧ I ∧ F ∧ P를 이 사례의 실패 상황마다 다시 계산합니다. A는 1이면 key 자동 지급, 0이면 deny하거나 사람 검토로 보내는 결과입니다. 각 실패 장면에서 나머지 조건은 통과했다고 둡니다(가정)."
      ariaLabel="네 조건의 AND로 payroll key 지급을 판정하고, host 정지를 별도 상태로 기록하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const paused = scene.lamps[0] === null;
        const released = scene.lamps.every((value) => value === 1);
        return (
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1 sm:gap-2">
              <div className="grid min-w-0 flex-[4] grid-cols-4 gap-1 sm:gap-2">
                {NAMES.map((item, index) => {
                  const value = scene.lamps[index];
                  return (
                    <div key={item.symbol} className={`rounded-lg border px-1 py-2 text-center ${lampClass(value)}`}>
                      <strong className="block font-mono text-sm">{item.symbol}</strong>
                      <span className="block font-mono text-base font-bold">{value === null ? "—" : value}</span>
                      <span className="block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{item.name}</span>
                    </div>
                  );
                })}
              </div>
              <span className="shrink-0 font-mono text-sm font-bold text-muted-foreground">∧ →</span>
              <div
                className={`min-w-0 flex-[1.3] rounded-lg border px-1 py-2 text-center ${
                  paused
                    ? "border-dashed border-border/60 text-muted-foreground/70"
                    : released
                      ? "border-blue-600 text-blue-700 dark:text-blue-400"
                      : "border-red-600 text-red-700 dark:text-red-400"
                }`}
              >
                <strong className="block font-mono text-sm">A</strong>
                <span className="block font-mono text-base font-bold">{paused ? "—" : released ? 1 : 0}</span>
                <span className="block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">자동 지급</span>
              </div>
            </div>
            <p className="mt-2 h-5 text-[11px] text-muted-foreground">
              {paused ? "가용성은 A = C ∧ I ∧ F ∧ P 하나가 보증하지 않습니다." : "‘?’는 unknown이며 1로 올리지 않습니다."}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-[11px] font-bold text-muted-foreground">Payroll key</span>
                <strong className={`mt-1 block break-keep text-xs leading-5 sm:text-sm ${released ? "text-blue-700 dark:text-blue-400" : "text-foreground"}`}>{scene.key}</strong>
              </div>
              <div className={`rounded-lg border px-3 py-2 ${paused ? "border-amber-600" : "border-border"}`}>
                <span className="block text-[11px] font-bold text-muted-foreground">별도 상태 (가용성)</span>
                <strong className={`mt-1 block break-keep text-xs leading-5 sm:text-sm ${paused ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/70"}`}>{scene.extra}</strong>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
