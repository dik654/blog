import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 첫 문단과 #picture의 항목 설명 — EIP-7928 블록 접근 인덱스 0, 1..n, n+1.
 * 두 거래 사례에서 n=2이므로 0, 1, 2, 3입니다. X의 값은 100→90→95 사례입니다.
 */
const SLOTS = [
  { index: 0, name: "사전 처리", x: "" },
  { index: 1, name: "T1", x: "90" },
  { index: 2, name: "T2", x: "95" },
  { index: 3, name: "사후 처리", x: "" },
] as const;

const OTHER = ["잔액 변화", "nonce 변화", "코드 변화", "읽기만 한 항목"];

const SCENES = [
  { label: "번호 매기기", summary: "0 · 1…n · n+1", note: "거래가 n개면 거래 앞의 사전 시스템 처리가 0, 거래가 1부터 n, 사후 처리가 n+1입니다. 두 거래면 n=2라서 사후 처리가 3입니다." },
  { label: "X의 기록", summary: "(1, 90) · (2, 95)", note: "BAL은 그 번호에 맞춰 거래 뒤 값을 적습니다. 사례에서 X를 바꾸는 것은 T1·T2뿐이라고 가정해 0과 3은 비웠습니다." },
  { label: "실제 목록의 범위", summary: "저장 칸만이 아닙니다", note: "잔액·nonce(계정의 거래 순번)·코드 변화와 읽기만 한 항목도 들어갑니다. 실제 접근 없이 이름만 올린 항목도 검증 대상입니다." },
] as const;

export default function BalIndexViz() {
  return (
    <SceneShell
      eyebrow="블록 접근 목록"
      title="값마다 블록 안의 몇 번째 처리에서 나왔는지 번호가 붙습니다"
      description="가로 칸은 처리 순서, 사례는 3절의 T1·T2입니다. BAL은 블록 접근 목록이고 칸 모양은 설명용입니다."
      ariaLabel="블록 접근 인덱스 0부터 3까지와 저장 칸 X의 거래별 값"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="min-w-0 rounded-lg border border-border/70 p-2 sm:p-3">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">{active === 2 ? "주소 > 저장 칸 X" : "저장 칸 X"}</p>
            <ol className="grid grid-cols-4 gap-1.5 text-center sm:gap-2">
              {SLOTS.map((slot) => (
                <li key={slot.index} className="flex min-w-0 flex-col rounded-lg border border-border bg-background px-1 py-1.5">
                  <span className="font-mono text-lg font-bold">{slot.index}</span>
                  <span className="text-xs leading-5 text-muted-foreground">{slot.name}</span>
                  <span className={`mt-1 rounded border px-1 py-1 font-mono text-sm font-bold ${active === 0 || !slot.x ? "border-dashed border-border/60 font-normal text-muted-foreground/70" : ""}`} style={active !== 0 && slot.x ? { borderColor: "#2563eb", backgroundColor: "#2563eb14", color: "#2563eb" } : undefined}>
                    {active !== 0 && slot.x ? slot.x : "−"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className={`mt-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium leading-5 ${active === 2 ? "" : "invisible"}`}>함께 담기는 것: {OTHER.join(" · ")}</p>
        </div>
      )}
    />
  );
}
