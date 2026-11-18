import SceneShell from "./SceneShell";

/**
 * 본문 대응: #receipt-claim — verify(MULTIPLY_ID)는 ReceiptClaim::ok로 기대 claim을 만들고
 * seal이 인증한 실제 claim의 digest와 비교한다. 본문 interpretation의 세 변조
 * (journal 390, 다른 ImageID, Halted(1))를 한 필드씩 바꿔 본다.
 */
type Row = {
  field: string;
  role: string;
  expected: string;
  actual: string;
};

const BASE: readonly Row[] = [
  { field: "pre", role: "시작 state = 실행한 guest", expected: "digest(MULTIPLY_ID)", actual: "digest(MULTIPLY_ID)" },
  { field: "exit", role: "종료 방식", expected: "Halted(0)", actual: "Halted(0)" },
  { field: "journal", role: "output digest에 묶임", expected: "H(journal 391)", actual: "H(journal 391)" },
  { field: "assumptions", role: "output digest에 묶임", expected: "비어 있음", actual: "비어 있음" },
];

const SCENES = [
  {
    label: "정상 receipt",
    summary: "d_exp = d_inner → 승인",
    changed: -1,
    value: "",
    side: "actual" as const,
    note: "verifier는 receipt를 받기 전부터 MULTIPLY_ID, Halted(0), 빈 assumptions를 정해 두고, receipt의 journal digest만 채워 기대 claim을 만듭니다. 모든 필드가 같으니 두 digest도 같습니다.",
  },
  {
    label: "journal을 390으로",
    summary: "output(journal)이 달라짐 → 거절",
    changed: 2,
    value: "H(journal 390)",
    side: "expected" as const,
    note: "기대 claim은 receipt에 실린 journal로 만듭니다. 그 journal이 390이면 기대 쪽 output이 H(390)이 되고, seal이 인증한 실제 claim의 H(391)과 달라 digest가 어긋납니다.",
  },
  {
    label: "다른 guest의 391",
    summary: "pre 필드가 달라짐 → 거절",
    changed: 0,
    value: "digest(다른 ImageID)",
    side: "actual" as const,
    note: "다른 guest도 journal 391을 쓸 수 있습니다. 그 receipt의 실제 claim에는 그 guest의 ImageID가 들어 있으므로, verifier가 고정한 MULTIPLY_ID로 만든 기대 claim과 pre 필드가 다릅니다.",
  },
  {
    label: "Halted(1)로 종료",
    summary: "exit 필드가 달라짐 → 거절",
    changed: 1,
    value: "Halted(1)",
    side: "actual" as const,
    note: "같은 guest라도 성공 code 0으로 끝나지 않았다면 실제 claim의 exit는 Halted(1)입니다. ReceiptClaim::ok는 항상 Halted(0)을 기대하므로 digest가 같아질 수 없습니다.",
  },
] as const;

export default function ClaimDigestViz() {
  return (
    <SceneShell
      eyebrow="expected claim vs 실제 claim"
      title="필드 하나만 달라도 claim digest가 갈립니다"
      description="왼쪽은 verifier가 ReceiptClaim::ok로 만든 기대 claim, 오른쪽은 seal이 인증한 실제 claim입니다. verify는 두 쪽을 각각 한 digest(d_exp, d_inner)로 hash해 비교합니다."
      note="digest 값 자체는 적지 않았습니다. assumptions는 별도 필드가 아니라 journal digest와 함께 output digest에 묶이고, 표에 없는 input·post 필드도 ok()가 함께 채워 hash합니다. 변조 사례마다 한 필드만 바꾸고 나머지는 같다고 둔 설명용 구성입니다(가정). 정확한 field order와 hash는 고정 commit의 ReceiptClaim::digest를 따르며, seal 무결성 검사는 이 비교보다 먼저 통과해야 합니다."
      ariaLabel="정상, journal 390, 다른 ImageID, Halted(1) 네 경우에서 기대 claim과 실제 claim의 필드 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ok = scene.changed < 0;
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 text-[11px] font-bold text-muted-foreground sm:text-xs">
              <span>필드</span>
              <span>기대 claim (verifier)</span>
              <span>실제 claim (seal)</span>
            </div>
            <div className="space-y-1">
              {BASE.map((row, index) => {
                const differs = index === scene.changed;
                const expected = differs && scene.side === "expected" ? scene.value : row.expected;
                const actual = differs && scene.side === "actual" ? scene.value : row.actual;
                return (
                  <div
                    key={row.field}
                    className={`grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2 rounded-lg border px-2 py-1.5 text-[11px] leading-5 sm:text-xs ${
                      differs ? "border-red-600 bg-red-500/10" : "border-border bg-background"
                    }`}
                  >
                    <span className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
                      <span className="block font-mono font-bold">{row.field}</span>
                      <span className="block break-keep text-[10px] text-muted-foreground">{row.role}</span>
                    </span>
                    <span className={`min-w-0 break-words font-mono ${differs && scene.side === "expected" ? "font-bold text-red-700 dark:text-red-400" : ""}`}>
                      {expected}
                    </span>
                    <span className={`min-w-0 break-words font-mono ${differs && scene.side === "actual" ? "font-bold text-red-700 dark:text-red-400" : ""}`}>
                      {actual}
                      {differs ? <span className="ml-1 font-sans">≠</span> : null}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className={`rounded-lg border px-3 py-2 text-center text-xs font-bold sm:text-sm ${ok ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : "border-red-600 text-red-700 dark:text-red-400"}`}>
              <span className="font-mono">d_exp {ok ? "=" : "≠"} d_inner</span>
              {" · "}
              {ok ? "verify(MULTIPLY_ID) 통과" : "verify(MULTIPLY_ID) 거절"}
            </p>
          </div>
        );
      }}
    />
  );
}
