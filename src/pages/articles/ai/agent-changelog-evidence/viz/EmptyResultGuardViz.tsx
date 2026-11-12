import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 프로필 A의 기록 12개가 정리 결과에 따라 어떻게 남는지.
 * 들어온 결과 네 가지(빈 0개, 불완전 5개, 검증한 전체 12개, 허용한 삭제 0개)를
 * 수정 전 · 길이>0만 보는 수정 · 네 경우를 나눈 규칙 세 장면으로 비교한다. 모든 수는 본문의 가정이다.
 */
const TOTAL = 12;

type Kind = "keep" | "new" | "lost" | "cleared" | "none";
interface Row {
  verdict: string;
  kind: Kind;
  count: number;
  tone: "ok" | "bad" | "muted";
}

const INPUTS = ["빈 결과 0개", "불완전 결과 5개", "검증한 전체 12개", "허용한 삭제 0개"] as const;

const SCENES = [
  {
    label: "수정 전",
    summary: "12 → 0 · 기록 12개를 잃음",
    note: "정리 작업이 실패해 0개를 돌려줬는데 이를 정상 결과로 받아 기존 내용을 교체합니다. 프로필 A에는 아무것도 남지 않습니다. 이 글은 수정 전의 나머지 세 경우는 다루지 않습니다.",
  },
  {
    label: "길이가 양수인지만 보는 수정",
    summary: "5개가 12개를 대신함",
    note: "0개는 막지만 불완전한 5개는 길이가 양수라 그대로 교체됩니다. 12개가 5개로 줄어듭니다. 허용한 삭제도 길이는 0이라 실패한 0개와 같은 규칙을 타고 보존되므로, 정당한 삭제가 실행되지 않습니다.",
  },
  {
    label: "네 경우를 나눈 규칙",
    summary: "보존 · 보존 · 검증 후 교체 · 별도 경로",
    note: "빈 결과와 불완전한 결과는 기존 12개를 보존하고, 검증한 전체 결과만 교체합니다. 삭제는 길이가 아니라 별도 권한과 대상 확인을 거쳐 처리합니다.",
  },
] as const;

const ROWS: readonly (readonly Row[])[] = [
  [
    { verdict: "정상으로 받아 교체", kind: "lost", count: 0, tone: "bad" },
    { verdict: "다루지 않음", kind: "none", count: 0, tone: "muted" },
    { verdict: "다루지 않음", kind: "none", count: 0, tone: "muted" },
    { verdict: "다루지 않음", kind: "none", count: 0, tone: "muted" },
  ],
  [
    { verdict: "0이라 보존", kind: "keep", count: 12, tone: "ok" },
    { verdict: "양수라 교체", kind: "lost", count: 5, tone: "bad" },
    { verdict: "양수라 교체", kind: "new", count: 12, tone: "ok" },
    { verdict: "0이라 빈 결과처럼 보존 · 삭제가 막힘", kind: "keep", count: 12, tone: "bad" },
  ],
  [
    { verdict: "보존", kind: "keep", count: 12, tone: "ok" },
    { verdict: "보존", kind: "keep", count: 12, tone: "ok" },
    { verdict: "검증 후 교체", kind: "new", count: 12, tone: "ok" },
    { verdict: "권한·대상 확인 후 삭제", kind: "cleared", count: 0, tone: "ok" },
  ],
];

const CELL = { keep: "#64748b", new: "#2563eb" } as const;

function Cells({ kind, count }: { kind: Kind; count: number }) {
  if (kind === "none") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <svg viewBox="0 0 132 12" className="h-3 w-full max-w-[11rem]" aria-hidden="true">
      {Array.from({ length: TOTAL }, (_, index) => {
        const x = index * 11 + 0.5;
        const filled = (kind === "keep" || kind === "new" || kind === "lost") && index < count;
        const fill = kind === "keep" ? CELL.keep : CELL.new;
        if (filled) return <rect key={index} x={x} y={0.5} width={9} height={11} rx={1.5} fill={fill} />;
        const stroke = kind === "lost" ? "#dc2626" : "#94a3b8";
        return <rect key={index} x={x} y={0.5} width={9} height={11} rx={1.5} fill="none" stroke={stroke} strokeWidth={1} strokeDasharray="2 1.5" />;
      })}
    </svg>
  );
}

export default function EmptyResultGuardViz() {
  return (
    <SceneShell
      eyebrow="기록 12개 보존"
      title="길이가 양수인지만 보면 불완전한 5개가 12개를 대신합니다"
      description="한 줄이 정리 작업이 돌려준 결과 하나이고, 오른쪽 칸 12개가 처리 뒤 프로필 A에 남는 기록입니다. 회색은 기존 기록, 파랑은 새 결과, 빨간 점선은 잃은 기록, 회색 점선은 허용해서 비운 자리입니다."
      note="기록 12개와 결과 0·5·12개, 허용한 삭제는 본문이 정한 설명용 사례입니다. (가정)"
      ariaLabel="정리 결과 네 가지가 프로필 A의 기록 12개에 미치는 영향을 세 규칙으로 비교"
      scenes={SCENES}
      render={(active) => (
        <ul className="grid gap-2">
          {INPUTS.map((input, index) => {
            const row = ROWS[active][index];
            const after = row.kind === "none" ? "—" : `${row.count}개`;
            return (
              <li key={input} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-3 gap-y-1 rounded-lg border border-border px-3 py-2 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,11rem)_3rem]">
                <span className="text-sm font-semibold">{input}</span>
                <span
                  className={`text-right text-xs sm:text-left ${
                    row.tone === "bad" ? "font-semibold text-red-700 dark:text-red-400" : row.tone === "ok" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {row.verdict}
                </span>
                <Cells kind={row.kind} count={row.count} />
                <span className="text-right font-mono text-xs">{after}</span>
              </li>
            );
          })}
        </ul>
      )}
    />
  );
}
