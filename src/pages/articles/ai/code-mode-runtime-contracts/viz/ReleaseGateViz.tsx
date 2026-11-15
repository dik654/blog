import SceneShell from "./SceneShell";

/**
 * 본문 대응: #result-contract — release = schema ∧ N ≤ 50 ∧ B ≤ 32 KiB ∧ redacted, 그리고 receipt.
 * 같은 50 rows라도 한 row에 거대한 값이 들어가면 행 수 gate는 통과하고 byte gate에서 막힌다.
 * 정상 결과 12 KiB와 blob 결과의 크기는 그림을 위한 가정이다(본문은 크기를 주지 않는다).
 */
const ROW_LIMIT = 50;
const ROW_SCALE = 60;
const BYTE_LIMIT = 32;
const BYTE_SCALE = 40;
const NORMAL_KIB = 12;

const STAGES = ["허용 field", "민감값 제거", `행 ≤ ${ROW_LIMIT}`, `byte ≤ ${BYTE_LIMIT} KiB`, "receipt"] as const;

const SCENES = [
  {
    label: "허용 field만 고릅니다",
    summary: "team · count · topIssueUrl",
    note: "Sandbox 안 원본 rows에서 반환을 허용한 field만 남깁니다. 그 밖의 field는 결과로 나가지 않습니다. 두 후보 모두 이 단계까지는 같은 모양입니다.",
  },
  {
    label: "민감값을 지웁니다",
    summary: "redaction",
    note: "남은 값 중 내보내면 안 되는 값을 가리거나 지웁니다(redaction). field를 고르는 것과 값 안의 민감한 내용을 지우는 것은 다른 단계입니다.",
  },
  {
    label: "행 수를 셉니다",
    summary: "두 후보 모두 50 ≤ 50 통과",
    note: "두 후보 모두 50 rows라 행 수 gate를 통과합니다. 행 수만 보면 둘째 후보가 한 row에 거대한 값(blob)을 담고 있다는 사실이 드러나지 않습니다.",
  },
  {
    label: "byte 크기를 잽니다",
    summary: "blob 후보만 32 KiB 초과",
    note: "직렬화한 크기를 따로 재면 차이가 보입니다. 정상 후보는 32 KiB 안이고, 둘째 후보는 한 row의 거대한 값 때문에 32 KiB를 넘어 release 조건이 거짓이 됩니다.",
  },
  {
    label: "receipt와 함께 반환합니다",
    summary: "두 gate 모두 통과한 쪽만",
    note: "두 gate를 모두 통과한 결과만 source call IDs와 truncation flag(빠진 데이터가 있는지 표시)를 붙여 model에 돌려줍니다. Schema를 통과했다고 내용이 사실이거나 완전하다는 뜻은 아닙니다.",
  },
] as const;

type Candidate = {
  name: string;
  detail: string;
  bytesLabel: string;
  bytesPct: number;
  overBytes: boolean;
};

const CANDIDATES: readonly Candidate[] = [
  { name: "정상 결과 (가정)", detail: "팀별 count 50 rows", bytesLabel: `${NORMAL_KIB} KiB (가정)`, bytesPct: (NORMAL_KIB / BYTE_SCALE) * 100, overBytes: false },
  { name: "한 row에 거대한 값 (가정)", detail: "50 rows 중 1 row에 거대한 덩어리 값(blob)", bytesLabel: "32 KiB 초과", bytesPct: 100, overBytes: true },
];

function Meter({ label, value, pct, limitPct, over, shown }: { label: string; value: string; pct: number; limitPct: number; over: boolean; shown: boolean }) {
  return (
    <div className={`transition-opacity ${shown ? "opacity-100" : "opacity-25"}`}>
      <div className="flex justify-between gap-2 text-[11px] sm:text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-mono font-bold ${over && shown ? "text-red-700 dark:text-red-400" : ""}`}>{value}</span>
      </div>
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="mt-1 h-3 w-full" aria-hidden>
        <rect x={0} y={1} width={100} height={8} fill="#94a3b8" opacity={0.2} />
        <rect x={0} y={1} width={pct} height={8} fill={over ? "#dc2626" : "#2563eb"} opacity={0.8} />
        <line x1={limitPct} x2={limitPct} y1={0} y2={10} stroke="#64748b" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export default function ReleaseGateViz() {
  return (
    <SceneShell
      eyebrow="결과 내보내기 · 두 budget"
      title="행 수 gate만 두면 50 rows 안에 거대한 값을 실어 보낼 수 있습니다"
      description="본문의 예처럼 최대 50 rows·32 KiB를 둡니다. 두 후보의 byte 크기와 blob은 설명을 위한 가정이며, 세로 눈금선이 각 한도입니다."
      ariaLabel="허용 field, 민감값 제거, 행 수, byte 크기, receipt 순서로 두 결과 후보를 거르는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <ol className="grid grid-cols-5 gap-1 text-center">
            {STAGES.map((stage, index) => (
              <li
                key={stage}
                className={`flex min-h-12 items-center justify-center rounded-md border px-1 py-1 text-[10px] leading-4 break-keep sm:text-xs ${
                  index === active ? "border-primary bg-primary/10 font-bold text-primary" : index < active ? "border-border text-foreground" : "border-border/50 text-muted-foreground"
                }`}
              >
                {stage}
              </li>
            ))}
          </ol>
          <div className="grid gap-3 sm:grid-cols-2">
            {CANDIDATES.map((candidate) => {
              const blocked = candidate.overBytes && active >= 3;
              const released = !candidate.overBytes && active >= 4;
              return (
                <div key={candidate.name} className="min-w-0 rounded-lg border border-border bg-background p-3">
                  <p className="text-xs font-bold sm:text-sm">{candidate.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">{candidate.detail}</p>
                  <div className="mt-2 flex flex-wrap gap-1 text-[10px] sm:text-[11px]">
                    {["team", "count", "topIssueUrl"].map((field) => (
                      <span key={field} className="rounded border border-border px-1.5 py-0.5 font-mono">{field}</span>
                    ))}
                    <span className="rounded border border-dashed border-border/50 px-1.5 py-0.5 text-muted-foreground line-through">그 밖의 field</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Meter label="행 수" value={`${ROW_LIMIT} / ${ROW_LIMIT}`} pct={(ROW_LIMIT / ROW_SCALE) * 100} limitPct={(ROW_LIMIT / ROW_SCALE) * 100} over={false} shown={active >= 2} />
                    <Meter label="byte 크기" value={candidate.bytesLabel} pct={candidate.bytesPct} limitPct={(BYTE_LIMIT / BYTE_SCALE) * 100} over={candidate.overBytes} shown={active >= 3} />
                  </div>
                  <p
                    className={`mt-3 rounded-md border px-2 py-1.5 text-center text-[11px] font-bold sm:text-xs ${
                      blocked
                        ? "border-red-600 text-red-700 dark:text-red-400"
                        : released
                          ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                          : "border-border/60 text-muted-foreground"
                    }`}
                  >
                    {blocked ? "release 거짓 · 내보내지 않음" : released ? "반환 + call IDs · truncation flag" : "검사 중"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
