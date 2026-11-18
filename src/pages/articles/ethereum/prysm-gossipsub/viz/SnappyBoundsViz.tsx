import SceneShell from "./SceneShell";

/**
 * 본문 대응: #snappy-encoding — 압축 입력 상한과 해제 크기 상한이 서로 다른 공격을 막는다.
 * n = 10 MiB = 10,485,760 B, ⌊n/6⌋ = 1,747,626, C_max = 32 + n + ⌊n/6⌋ = 12,233,418.
 * 상한 눈금만 실제 비율로 그리고, 입력 크기는 어느 구간에 드는지만 보인다(크기 가정).
 */
const RAW = 10_485_760;
const SLACK = Math.floor(RAW / 6);
const FIXED = 32;
const C_MAX = FIXED + RAW + SLACK;
const AXIS_MAX = 16 * 1_048_576;

const W = 360;
const LEFT = 12;
const RIGHT = 348;
const xOf = (bytes: number) => LEFT + (bytes / AXIS_MAX) * (RIGHT - LEFT);

type Zone = "ok" | "over" | "skip";

const SCENES = [
  {
    label: "상한의 구성",
    summary: "C_max = 12,233,418 bytes",
    note: "원문 상한 n = 10 MiB = 10,485,760 bytes에 고정 여유 32와 n을 6으로 나눈 몫 1,747,626을 더하면 압축 입력의 최악 상한 12,233,418 bytes입니다. Snappy가 압축에 실패해 조금 커지는 경우까지 허용하므로 원문 상한보다 큽니다.",
    wire: "skip" as Zone,
    decoded: "skip" as Zone,
    stop: -1,
  },
  {
    label: "거대한 wire 입력",
    summary: "① 압축 상한에서 거절",
    note: "압축 bytes가 12,233,418을 넘으면 Snappy를 풀기 전에 거절합니다. 거대한 wire input을 읽고 보관하는 비용을 막는 첫 상한이며, 해제 크기는 계산하지 않습니다.",
    wire: "over" as Zone,
    decoded: "skip" as Zone,
    stop: 1,
  },
  {
    label: "압축 폭탄",
    summary: "② 해제 크기 상한에서 거절",
    note: "작은 압축 입력은 첫 상한을 통과해도, snappy.DecodedLen이 예고한 raw 크기가 10 MiB보다 크면 allocation 전에 거절합니다. 작은 input이 큰 메모리로 부푸는 decompression bomb을 막는 둘째 상한입니다.",
    wire: "ok" as Zone,
    decoded: "over" as Zone,
    stop: 2,
  },
  {
    label: "두 상한 통과",
    summary: "그래도 아직 유효한 block은 아님",
    note: "두 크기를 통과해야 allocation과 fork별 SSZ decode로 갑니다. 그 뒤에도 signature·proposer·parent·slot 규칙이 남아 있어, ‘압축을 풀었다’와 ‘전파해도 된다’는 다른 단계입니다.",
    wire: "ok" as Zone,
    decoded: "ok" as Zone,
    stop: 3,
  },
] as const;

const GATES = ["wire 입력", "① 압축 상한", "② 해제 크기 상한", "SSZ decode"] as const;

function ZoneRuler({ y, label, bound, boundLabel, zone }: { y: number; label: string; bound: number; boundLabel: string; zone: Zone }) {
  const bx = xOf(bound);
  const okFill = zone === "ok" ? "#16a34a" : "#94a3b8";
  const overFill = zone === "over" ? "#dc2626" : "#94a3b8";
  const tokenX = zone === "ok" ? (LEFT + bx) / 2 : (bx + RIGHT) / 2;
  return (
    <g>
      <text x={LEFT} y={y - 10} fontSize={11} fontWeight={700} fill="#475569">{label}</text>
      <rect x={LEFT} y={y} width={bx - LEFT} height={14} rx={2} fill={okFill} opacity={zone === "ok" ? 0.28 : 0.12} />
      <rect x={bx} y={y} width={RIGHT - bx} height={14} rx={2} fill={overFill} opacity={zone === "over" ? 0.28 : 0.12} />
      <line x1={bx} x2={bx} y1={y - 4} y2={y + 18} stroke="#0f172a" strokeWidth={1.25} />
      <text x={bx} y={y + 30} textAnchor="middle" fontSize={10} fill="#334155">{boundLabel}</text>
      <text x={(LEFT + bx) / 2} y={y + 30} textAnchor="middle" fontSize={10} fill="#64748b">허용</text>
      <text x={(bx + RIGHT) / 2} y={y + 30} textAnchor="middle" fontSize={10} fill="#64748b">초과</text>
      {zone === "skip" ? (
        <text x={(LEFT + RIGHT) / 2} y={y + 11} textAnchor="middle" fontSize={10} fill="#64748b">계산하지 않음</text>
      ) : (
        <g>
          <rect x={tokenX - 34} y={y - 1} width={68} height={16} rx={8} fill="#ffffff" stroke={zone === "ok" ? "#16a34a" : "#dc2626"} strokeWidth={1.25} />
          <text x={tokenX} y={y + 11} textAnchor="middle" fontSize={10} fontWeight={700} fill={zone === "ok" ? "#15803d" : "#b91c1c"}>
            {zone === "ok" ? "이 입력 ✓" : "이 입력 ✕"}
          </text>
        </g>
      )}
    </g>
  );
}

function Composition() {
  const x0 = xOf(0);
  const xFixed = xOf(FIXED);
  const xRaw = xOf(FIXED + RAW);
  const xMax = xOf(C_MAX);
  const xRawOnly = xOf(RAW);
  return (
    <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="압축 입력 상한 12,233,418 bytes의 구성">
      <text x={LEFT} y={18} fontSize={11} fontWeight={700} fill="#475569">원문 상한 n (압축을 푼 뒤)</text>
      <rect x={x0} y={26} width={xRawOnly - x0} height={18} rx={2} fill="#64748b" opacity={0.75} />
      <text x={xRawOnly + 4} y={39} fontSize={10} fill="#334155">10,485,760</text>
      <text x={LEFT} y={72} fontSize={11} fontWeight={700} fill="#475569">압축 입력 상한 C_max (wire)</text>
      <rect x={xFixed} y={80} width={xRaw - xFixed} height={18} rx={2} fill="#64748b" opacity={0.75} />
      <rect x={xRaw} y={80} width={xMax - xRaw} height={18} rx={2} fill="#2563eb" opacity={0.8} />
      <line x1={x0} x2={x0} y1={76} y2={102} stroke="#d97706" strokeWidth={1.25} />
      <text x={x0} y={116} fontSize={10} fill="#b45309">+32 고정 여유</text>
      <text x={(xFixed + xRaw) / 2} y={93} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">n = 10,485,760</text>
      <text x={(xRaw + xMax) / 2} y={116} textAnchor="middle" fontSize={10} fill="#1d4ed8">+⌊n/6⌋ 1,747,626</text>
      <text x={xMax} y={136} textAnchor="end" fontSize={11} fontWeight={700} fill="#0f172a">= 12,233,418 bytes</text>
    </svg>
  );
}

export default function SnappyBoundsViz() {
  return (
    <SceneShell
      eyebrow="SSZ-Snappy 크기 검사"
      title="압축 크기와 풀린 크기를 따로 재야 두 공격이 모두 막힙니다"
      description="위 띠는 검사 순서입니다. 첫 장면은 압축 입력 상한의 구성이고, 둘째 장면부터 아래 두 눈금의 세로선은 실제 비율로 그린 상한입니다. 입력이 허용·초과 중 어느 쪽에 드는지만 표시하며, 입력의 정확한 크기는 정하지 않습니다(가정)."
      note="상한은 Prysm v7.3.1 mainnet config의 MAX_PAYLOAD_SIZE = 10 MiB 기준입니다. SSZ type 자체의 더 작은 최대 크기가 있다면 그 경계는 별도로 적용됩니다."
      ariaLabel="Snappy 압축 입력 상한과 해제 크기 상한이 각각 거르는 입력"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <ol className="grid grid-cols-4 gap-1.5">
              {GATES.map((gate, index) => {
                const stopped = scene.stop === index && scene.stop !== 3;
                const reached = scene.stop >= index;
                const tone =
                  scene.stop < 0
                    ? "border-border text-muted-foreground"
                    : stopped
                      ? "border-red-600 text-red-700 dark:text-red-400"
                      : reached
                        ? "border-green-600 text-foreground"
                        : "border-dashed border-border text-muted-foreground/60";
                return (
                  <li key={gate} className={`min-w-0 break-keep rounded-lg border px-1 py-1.5 text-center text-[11px] font-semibold leading-4 ${tone}`}>
                    {gate}
                    <span className="mt-1 block text-[10px] font-normal">
                      {scene.stop < 0 ? `${index + 1}번째` : stopped ? "거절" : reached ? "도달" : "안 감"}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div>
              {active === 0 ? (
                <Composition />
              ) : (
                <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
                  <ZoneRuler y={26} label="① 압축 bytes (wire)" bound={C_MAX} boundLabel="12,233,418" zone={scene.wire} />
                  <ZoneRuler y={98} label="② DecodedLen이 예고한 raw 크기" bound={RAW} boundLabel="10 MiB" zone={scene.decoded} />
                </svg>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
